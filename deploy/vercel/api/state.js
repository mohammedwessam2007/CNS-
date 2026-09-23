// /api/state for the Vercel host. Same contract as the Hatchable endpoint (source/api/state.js):
// GET → {exists, state, stateVersion, clientUpdatedAt, updatedAt}; POST {state, baseVersion,
// clientUpdatedAt, force} → {ok, stateVersion, …} or 409 version_conflict with the stored copy.
// Identity is the learner's private sync code (x-ix-sync header); only its salted hash is stored.
import { createHash } from "node:crypto";
import { read, write, Conflict } from "../lib/store.js";

const MAX_STATE_CHARS = 1500000;

function learnerPath(req) {
  const code = String(req.headers["x-ix-sync"] || "").toUpperCase();
  if (!/^[A-Z2-7]{26}$/.test(code)) return null;
  return "learners/" + createHash("sha256").update("intellectuality-sync:" + code).digest("hex") + ".json";
}

function conflict(res, current) {
  return res.status(409).json({
    error: "version_conflict",
    stateVersion: current ? Number(current.doc.stateVersion) : 0,
    clientUpdatedAt: current ? current.doc.clientUpdatedAt : null,
    state: current ? current.doc.state : null,
  });
}

export default async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  const path = learnerPath(req);
  if (!path) return res.status(401).json({ error: "sync_code_required" });

  try {
    if (req.method === "GET") {
      const cur = await read(path);
      if (!cur) return res.status(200).json({ exists: false, stateVersion: 0 });
      const d = cur.doc;
      return res.status(200).json({ exists: true, state: d.state, stateVersion: Number(d.stateVersion), clientUpdatedAt: d.clientUpdatedAt, updatedAt: d.updatedAt });
    }
    if (req.method !== "POST") {
      res.setHeader("allow", "GET, POST");
      return res.status(405).json({ error: "method_not_allowed" });
    }

    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {
        body = null;
      }
    }
    body = body || {};
    if (!body.state || typeof body.state !== "object" || Array.isArray(body.state)) return res.status(400).json({ error: "state_object_required" });
    if (JSON.stringify(body.state).length > MAX_STATE_CHARS) return res.status(413).json({ error: "state_too_large" });

    const baseVersion = Number(body.baseVersion || 0),
      force = body.force === true,
      clientUpdatedAt = body.clientUpdatedAt || new Date().toISOString(),
      now = new Date().toISOString();

    const cur = await read(path);
    if (!cur) {
      const doc = { state: body.state, stateVersion: 1, clientUpdatedAt, updatedAt: now };
      try {
        await write(path, doc, null);
      } catch (e) {
        if (e instanceof Conflict) return conflict(res, await read(path));
        throw e;
      }
      return res.status(201).json({ ok: true, stateVersion: 1, clientUpdatedAt, updatedAt: now });
    }

    const serverVersion = Number(cur.doc.stateVersion) || 0;
    if (!force && baseVersion !== serverVersion) return conflict(res, cur);
    const doc = { state: body.state, stateVersion: serverVersion + 1, clientUpdatedAt, updatedAt: now };
    try {
      await write(path, doc, cur.etag);
    } catch (e) {
      if (e instanceof Conflict) return conflict(res, await read(path));
      throw e;
    }
    return res.status(200).json({ ok: true, stateVersion: doc.stateVersion, clientUpdatedAt, updatedAt: now });
  } catch (e) {
    console.error("[api/state]", req.method, e && e.stack ? e.stack : e);
    return res.status(503).json({ error: "cloud_unavailable" });
  }
}
