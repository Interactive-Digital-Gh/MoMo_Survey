import pg from 'pg'
import { config } from './config.js'

// Small bounded pool — plenty for a ~500-user campaign and safe on a shared box.
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS responses (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id text UNIQUE NOT NULL,
    phone         text,
    answers       jsonb NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    ip            text,
    user_agent    text
  );
  CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses (created_at DESC);
`

// Optional stricter policy: one entry per (non-null) phone number.
const ONE_PER_PHONE_INDEX = `
  CREATE UNIQUE INDEX IF NOT EXISTS uniq_responses_phone
  ON responses (phone) WHERE phone IS NOT NULL;
`

export async function initSchema() {
  await pool.query(SCHEMA)
  if (config.oneEntryPerPhone) {
    await pool.query(ONE_PER_PHONE_INDEX)
  }
}

export async function healthCheck() {
  await pool.query('SELECT 1')
}
