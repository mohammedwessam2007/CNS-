import { db, auth } from 'hatchable';

export const access = 'user';
export const methods = ['GET', 'POST'];

export default async function (req, res) {
  const userId = String(req.user.id);

  if (req.method === 'GET') {
    const { rows } = await db.query(
      'SELECT state, state_version, client_updated_at, updated_at FROM intellectuality_learning_state WHERE user_id = $1',
      [userId]
    );
    if (!rows.length) return res.json({ exists: false, stateVersion: 0 });
    const row = rows[0];
    return res.json({
      exists: true,
      state: row.state,
      stateVersion: Number(row.state_version),
      clientUpdatedAt: row.client_updated_at,
      updatedAt: row.updated_at
    });
  }

  const body = req.body || {};
  if (!body.state || typeof body.state !== 'object' || Array.isArray(body.state)) {
    return res.status(400).json({ error: 'state_object_required' });
  }
  const serialized = JSON.stringify(body.state);
  if (serialized.length > 1500000) {
    return res.status(413).json({ error: 'state_too_large' });
  }

  const baseVersion = Number(body.baseVersion || 0);
  const force = body.force === true;
  const clientUpdatedAt = body.clientUpdatedAt || new Date().toISOString();

  const current = await db.query(
    'SELECT state_version, client_updated_at, state FROM intellectuality_learning_state WHERE user_id = $1',
    [userId]
  );

  if (!current.rows.length) {
    const created = await db.query(
      'INSERT INTO intellectuality_learning_state (user_id, state, state_version, client_updated_at, updated_at) VALUES ($1, $2::jsonb, 1, $3, now()) RETURNING state_version, client_updated_at, updated_at',
      [userId, serialized, clientUpdatedAt]
    );
    const row = created.rows[0];
    return res.status(201).json({
      ok: true,
      stateVersion: Number(row.state_version),
      clientUpdatedAt: row.client_updated_at,
      updatedAt: row.updated_at
    });
  }

  const row = current.rows[0];
  const serverVersion = Number(row.state_version);
  if (!force && baseVersion !== serverVersion) {
    return res.status(409).json({
      error: 'version_conflict',
      stateVersion: serverVersion,
      clientUpdatedAt: row.client_updated_at,
      state: row.state
    });
  }

  const saved = await db.query(
    'UPDATE intellectuality_learning_state SET state = $2::jsonb, state_version = state_version + 1, client_updated_at = $3, updated_at = now() WHERE user_id = $1 RETURNING state_version, client_updated_at, updated_at',
    [userId, serialized, clientUpdatedAt]
  );
  const out = saved.rows[0];
  return res.json({
    ok: true,
    stateVersion: Number(out.state_version),
    clientUpdatedAt: out.client_updated_at,
    updatedAt: out.updated_at
  });
}