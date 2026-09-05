import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;
let schemaPromise: Promise<void> | null = null;

export function getSql() {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta configurar DATABASE_URL en Vercel.");
  client = neon(url);
  return client;
}

export async function ensureSchema() {
  if (schemaPromise) return schemaPromise;
  schemaPromise = createSchema().catch((error) => {
    schemaPromise = null;
    throw error;
  });
  return schemaPromise;
}

async function createSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS jmr_admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS jmr_admin_sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES jmr_admins(id) ON DELETE CASCADE,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS jmr_events (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES jmr_admins(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      client_name TEXT NOT NULL DEFAULT '',
      event_date DATE,
      location TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      access_code TEXT UNIQUE NOT NULL,
      pin_hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
      downloads_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS jmr_photos (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES jmr_events(id) ON DELETE CASCADE,
      pathname TEXT UNIQUE NOT NULL,
      blob_url TEXT NOT NULL,
      filename TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size_bytes BIGINT NOT NULL DEFAULT 0,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS jmr_gallery_sessions (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES jmr_events(id) ON DELETE CASCADE,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS jmr_events_admin_idx ON jmr_events(admin_id)`;
  await sql`CREATE INDEX IF NOT EXISTS jmr_photos_event_idx ON jmr_photos(event_id, position, created_at)`;
}

export async function databaseReady() {
  try {
    await ensureSchema();
    return true;
  } catch {
    return false;
  }
}
