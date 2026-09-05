import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ensureSchema, getSql } from "@/lib/db";

const ADMIN_COOKIE = "jmr_admin_session";
const GALLERY_COOKIE = "jmr_gallery_session";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function newToken() {
  return randomBytes(32).toString("base64url");
}

export async function getAdmin() {
  await ensureSchema();
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const sql = getSql();
  const rows = await sql`
    SELECT a.id, a.email
    FROM jmr_admin_sessions s
    JOIN jmr_admins a ON a.id = s.admin_id
    WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > NOW()
    LIMIT 1
  `;
  return (rows[0] as { id: string; email: string } | undefined) ?? null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/panel/login");
  return admin;
}

export async function createAdminSession(adminId: string) {
  const token = newToken();
  const expires = new Date(Date.now() + THIRTY_DAYS);
  const sql = getSql();
  await sql`
    INSERT INTO jmr_admin_sessions (id, admin_id, token_hash, expires_at)
    VALUES (${randomUUID()}, ${adminId}, ${hashToken(token)}, ${expires.toISOString()})
  `;
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (token) {
    const sql = getSql();
    await sql`DELETE FROM jmr_admin_sessions WHERE token_hash = ${hashToken(token)}`;
  }
  store.delete(ADMIN_COOKIE);
}

export async function createGallerySession(eventId: string) {
  const token = newToken();
  const expires = new Date(Date.now() + TWELVE_HOURS);
  const sql = getSql();
  await sql`
    INSERT INTO jmr_gallery_sessions (id, event_id, token_hash, expires_at)
    VALUES (${randomUUID()}, ${eventId}, ${hashToken(token)}, ${expires.toISOString()})
  `;
  (await cookies()).set(GALLERY_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/mi-evento",
    expires,
  });
}

export async function canAccessEvent(eventId: string) {
  if (await getAdmin()) return true;
  const token = (await cookies()).get(GALLERY_COOKIE)?.value;
  if (!token) return false;
  const sql = getSql();
  const rows = await sql`
    SELECT id FROM jmr_gallery_sessions
    WHERE event_id = ${eventId} AND token_hash = ${hashToken(token)} AND expires_at > NOW()
    LIMIT 1
  `;
  return Boolean(rows[0]);
}
