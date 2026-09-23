// Learner-state storage for the Vercel host: one private Vercel Blob per learner.
// IX_MEMORY_STORE=1 swaps in an in-process store so the handler can be tested offline.
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";

const memory = new Map();
let seq = 0;

export class Conflict extends Error {}

export async function read(path) {
  if (process.env.IX_MEMORY_STORE === "1") {
    const hit = memory.get(path);
    return hit ? { doc: JSON.parse(hit.text), etag: hit.etag } : null;
  }
  const r = await get(path, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  const text = await new Response(r.stream).text();
  return { doc: JSON.parse(text), etag: r.blob.etag };
}

// etag === null → create only; otherwise overwrite only if the stored blob still has that etag.
export async function write(path, doc, etag) {
  const text = JSON.stringify(doc);
  if (process.env.IX_MEMORY_STORE === "1") {
    const hit = memory.get(path);
    if ((etag === null && hit) || (etag !== null && (!hit || hit.etag !== etag))) throw new Conflict("etag_mismatch");
    memory.set(path, { text, etag: "m" + ++seq });
    return;
  }
  try {
    await put(path, text, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: etag !== null,
      ...(etag !== null ? { ifMatch: etag } : {}),
      cacheControlMaxAge: 60,
    });
  } catch (e) {
    if (e instanceof BlobPreconditionFailedError || /already exists|precondition/i.test(String(e && e.message))) throw new Conflict(String(e.message));
    throw e;
  }
}
