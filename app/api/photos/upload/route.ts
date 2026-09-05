import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAdmin } from "@/lib/auth";
import { getEvent } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const admin = await getAdmin();
        if (!admin) throw new Error("Sesión vencida. Volvé a ingresar al panel.");
        const payload = JSON.parse(clientPayload ?? "{}") as { eventId?: string };
        if (!payload.eventId || !pathname.startsWith(`events/${payload.eventId}/`)) throw new Error("Destino de carga inválido.");
        const event = await getEvent(payload.eventId, admin.id);
        if (!event) throw new Error("Evento no encontrado.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ eventId: event.id, adminId: admin.id }),
        };
      },
    });
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo autorizar la carga." }, { status: 400 });
  }
}
