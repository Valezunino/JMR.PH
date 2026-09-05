import { ensureSchema, getSql } from "@/lib/db";
import type { JmrEvent, JmrPhoto } from "@/lib/types";

export async function getEvents(adminId: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT e.*, COUNT(p.id)::int AS photo_count
    FROM jmr_events e
    LEFT JOIN jmr_photos p ON p.event_id = e.id
    WHERE e.admin_id = ${adminId}
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `;
  return rows as unknown as JmrEvent[];
}

export async function getEvent(id: string, adminId?: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = adminId
    ? await sql`SELECT * FROM jmr_events WHERE id = ${id} AND admin_id = ${adminId} LIMIT 1`
    : await sql`SELECT * FROM jmr_events WHERE id = ${id} LIMIT 1`;
  return (rows[0] as unknown as JmrEvent | undefined) ?? null;
}

export async function getPublishedEventBySlug(slug: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM jmr_events WHERE slug = ${slug} AND status = 'published' LIMIT 1
  `;
  return (rows[0] as unknown as JmrEvent | undefined) ?? null;
}

export async function getPhotos(eventId: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM jmr_photos WHERE event_id = ${eventId}
    ORDER BY position ASC, created_at ASC
  `;
  return rows as unknown as JmrPhoto[];
}

export async function getPhoto(id: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT p.*, e.downloads_enabled, e.status
    FROM jmr_photos p JOIN jmr_events e ON e.id = p.event_id
    WHERE p.id = ${id} LIMIT 1
  `;
  return (rows[0] as (JmrPhoto & { downloads_enabled: boolean; status: string }) | undefined) ?? null;
}
