import { get } from "@vercel/blob";
import { canAccessEvent } from "@/lib/auth";
import { getPhoto } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await getPhoto(id);
  if (!photo) return new Response("No encontrada", { status: 404 });
  if (!(await canAccessEvent(photo.event_id))) return new Response("Acceso denegado", { status: 403 });
  const blob = await get(photo.pathname, { access: "private" });
  if (!blob || blob.statusCode !== 200) return new Response("No encontrada", { status: 404 });
  return new Response(blob.stream, { headers: { "Content-Type": blob.blob.contentType, "Content-Length": String(blob.blob.size), "Cache-Control": "private, max-age=3600", "ETag": blob.blob.etag } });
}
