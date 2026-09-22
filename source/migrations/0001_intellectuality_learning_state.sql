CREATE TABLE intellectuality_learning_state (
  user_id TEXT PRIMARY KEY,
  state JSONB NOT NULL,
  state_version BIGINT NOT NULL DEFAULT 1,
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)