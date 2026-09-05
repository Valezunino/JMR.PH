"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";
import { normalizeCode, slugify } from "@/lib/format";
import type { EventStatus } from "@/lib/types";

function text(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function statusValue(value: string): EventStatus { return value === "published" || value === "archived" ? value : "draft"; }

export async function createEvent(formData: FormData) {
  const admin = await requireAdmin();
  await ensureSchema();
  const title = text(formData, "title");
  const pin = text(formData, "pin");
  const accessCode = normalizeCode(text(formData, "access_code"));
  if (!title || !accessCode || pin.length < 4) redirect("/panel/eventos/nuevo?error=Completá+el+título,+el+código+y+un+PIN+de+4+caracteres");

  const id = randomUUID();
  const slug = `${slugify(title)}-${id.slice(0, 6)}`;
  const pinHash = await bcrypt.hash(pin, 11);
  const sql = getSql();
  try {
    await sql`
      INSERT INTO jmr_events (id, admin_id, title, slug, client_name, event_date, location, description, access_code, pin_hash, status, downloads_enabled)
      VALUES (${id}, ${admin.id}, ${title}, ${slug}, ${text(formData, "client_name")}, ${text(formData, "event_date") || null}, ${text(formData, "location")}, ${text(formData, "description")}, ${accessCode}, ${pinHash}, ${statusValue(text(formData, "status"))}, ${formData.get("downloads_enabled") === "on"})
    `;
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) redirect("/panel/eventos/nuevo?error=Ese+código+de+acceso+ya+está+en+uso");
    throw error;
  }
  redirect(`/panel/eventos/${id}?creado=1`);
}

export async function updateEvent(eventId: string, formData: FormData) {
  const admin = await requireAdmin();
  await ensureSchema();
  const title = text(formData, "title");
  const accessCode = normalizeCode(text(formData, "access_code"));
  const pin = text(formData, "pin");
  if (!title || !accessCode) redirect(`/panel/eventos/${eventId}?error=El+título+y+el+código+son+obligatorios`);
  const sql = getSql();
  try {
    if (pin) {
      if (pin.length < 4) redirect(`/panel/eventos/${eventId}?error=El+PIN+debe+tener+al+menos+4+caracteres`);
      const pinHash = await bcrypt.hash(pin, 11);
      await sql`UPDATE jmr_events SET title=${title}, client_name=${text(formData, "client_name")}, event_date=${text(formData, "event_date") || null}, location=${text(formData, "location")}, description=${text(formData, "description")}, access_code=${accessCode}, pin_hash=${pinHash}, status=${statusValue(text(formData, "status"))}, downloads_enabled=${formData.get("downloads_enabled") === "on"}, updated_at=NOW() WHERE id=${eventId} AND admin_id=${admin.id}`;
    } else {
      await sql`UPDATE jmr_events SET title=${title}, client_name=${text(formData, "client_name")}, event_date=${text(formData, "event_date") || null}, location=${text(formData, "location")}, description=${text(formData, "description")}, access_code=${accessCode}, status=${statusValue(text(formData, "status"))}, downloads_enabled=${formData.get("downloads_enabled") === "on"}, updated_at=NOW() WHERE id=${eventId} AND admin_id=${admin.id}`;
    }
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) redirect(`/panel/eventos/${eventId}?error=Ese+código+de+acceso+ya+está+en+uso`);
    throw error;
  }
  revalidatePath("/panel");
  revalidatePath("/panel/eventos");
  revalidatePath(`/panel/eventos/${eventId}`);
  redirect(`/panel/eventos/${eventId}?guardado=1`);
}

export async function deleteEvent(eventId: string) {
  const admin = await requireAdmin();
  const sql = getSql();
  const events = await sql`SELECT id FROM jmr_events WHERE id=${eventId} AND admin_id=${admin.id} LIMIT 1`;
  if (!events[0]) redirect("/panel/eventos");
  const photos = await sql`SELECT pathname FROM jmr_photos WHERE event_id=${eventId}`;
  const paths = photos.map((row) => String(row.pathname));
  if (paths.length) await del(paths);
  await sql`DELETE FROM jmr_events WHERE id=${eventId} AND admin_id=${admin.id}`;
  revalidatePath("/panel");
  redirect("/panel/eventos?eliminado=1");
}

export async function deletePhoto(photoId: string, eventId: string) {
  const admin = await requireAdmin();
  const sql = getSql();
  const rows = await sql`SELECT p.pathname FROM jmr_photos p JOIN jmr_events e ON e.id=p.event_id WHERE p.id=${photoId} AND e.id=${eventId} AND e.admin_id=${admin.id} LIMIT 1`;
  const photo = rows[0] as { pathname: string } | undefined;
  if (!photo) return;
  await del(photo.pathname);
  await sql`DELETE FROM jmr_photos WHERE id=${photoId}`;
  revalidatePath(`/panel/eventos/${eventId}`);
}
