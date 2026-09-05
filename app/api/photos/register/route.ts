import { randomUUID } from "node:crypto";
import { del, head } from "@vercel/blob";
import { getAdmin } from "@/lib/auth";
import { getEvent } from "@/lib/data";
import { getSql } from "@/lib/db";

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return Response.json({ error: "Sesión vencida." }, { status: 401 });
  const input = await request.json() as { eventId?: string; pathname?: string; url?: string; filename?: string };
  if (!input.eventId || !input.pathname || !input.url || !input.filename) return Response.json({ error: "Datos de foto incompletos." }, { status: 400 });
  const event = await getEvent(input.eventId, admin.id);
  if (!event || !input.pathname.startsWith(`events/${event.id}/`)) return Response.json({ error: "Evento inválido." }, { status: 403 });
  try {
    const blob = await head(input.pathname);
    if (!["image/jpeg", "image/png", "image/webp"].includes(blob.contentType)) {
      await del(input.pathname);
      return Response.json({ error: "El archivo no es una imagen permitida." }, { status: 415 });
    }
    const sql = getSql();
    await sql`INSERT INTO jmr_photos (id, event_id, pathname, blob_url, filename, content_type, size_bytes, position) VALUES (${randomUUID()}, ${event.id}, ${blob.pathname}, ${blob.url}, ${input.filename.slice(0, 240)}, ${blob.contentType}, ${blob.size}, (SELECT COUNT(*)::int FROM jmr_photos WHERE event_id=${event.id}))`;
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo registrar la foto." }, { status: 400 });
  }
}
