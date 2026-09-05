"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createGallerySession } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";
import { normalizeCode } from "@/lib/format";

export async function accessGallery(formData: FormData) {
  await ensureSchema();
  const code = normalizeCode(String(formData.get("code") ?? ""));
  const pin = String(formData.get("pin") ?? "").trim();
  const sql = getSql();
  const rows = await sql`SELECT id, slug, pin_hash FROM jmr_events WHERE access_code=${code} AND status='published' LIMIT 1`;
  const event = rows[0] as { id: string; slug: string; pin_hash: string } | undefined;
  if (!event || !(await bcrypt.compare(pin, event.pin_hash))) {
    redirect(`/mi-evento?codigo=${encodeURIComponent(code)}&error=Código+o+PIN+incorrectos`);
  }
  await createGallerySession(event.id);
  redirect(`/mi-evento/${event.slug}`);
}
