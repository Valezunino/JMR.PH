import { get } from "@vercel/blob";
import { canAccessEvent } from "@/lib/auth";
import { getPhoto } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await getPhoto(id);
  if (!photo || !photo.downloads_enabled || !(await canAccessEvent(photo.event_id))) return new Response("Acceso denegado", { status: 403 });
  const blob = await get(photo.pathname, { access: "private" });
  if (!blob || blob.statusCode !== 200) return new Response("No encontrada", { status: 404 });
  const safeName = photo.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return new Response(blob.stream, { headers: { "Content-Type": blob.blob.contentType, "Content-Length": String(blob.blob.size), "Content-Disposition": `attachment; filename="${safeName}"`, "Cache-Control": "private, no-store" } });
}
