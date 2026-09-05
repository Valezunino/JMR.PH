import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEvent, deletePhoto, updateEvent } from "@/app/panel/eventos/actions";
import { DeleteButton } from "@/components/delete-button";
import { EventForm } from "@/components/event-form";
import { EventQr } from "@/components/event-qr";
import { PanelChrome } from "@/components/panel-chrome";
import { PhotoUploader } from "@/components/photo-uploader";
import { requireAdmin } from "@/lib/auth";
import { getEvent, getPhotos } from "@/lib/data";
import { formatBytes, formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ creado?: string; guardado?: string; error?: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const [event, photos, query] = await Promise.all([getEvent(id, admin.id), getPhotos(id), searchParams]);
  if (!event) notFound();
  const update = updateEvent.bind(null, event.id);
  const remove = deleteEvent.bind(null, event.id);
  return <PanelChrome>
    {(query.creado || query.guardado) && <p className="notice success">{query.creado ? "Evento creado. Ya podés cargar las fotos." : "Cambios guardados."}</p>}
    {query.error && <p className="notice error">{query.error}</p>}
    <div className="panel-title-row"><div><p className="eyebrow">{event.status === "published" ? "PUBLICADO" : "EDICIÓN"}</p><h1>{event.title}</h1><p>{formatEventDate(event.event_date)} · {photos.length} fotos</p></div><Link className="text-link" href="/panel/eventos">← Eventos</Link></div>
    <div className="detail-grid">
      <div style={{ display: "grid", gap: 18 }}>
        <section className="panel-card"><h2>Datos y publicación</h2><EventForm action={update} event={event} /></section>
        <section className="panel-card"><h2>Fotografías</h2><PhotoUploader eventId={event.id} />
          {photos.length > 0 && <div className="photo-grid">{photos.map((photo) => <article className="photo-item" key={photo.id}><Image src={`/api/photos/${photo.id}/view`} alt={photo.filename} fill sizes="(max-width: 780px) 50vw, 25vw" unoptimized /><div className="photo-meta">{photo.filename} · {formatBytes(Number(photo.size_bytes))}</div><form action={deletePhoto.bind(null, photo.id, event.id)} style={{ position: "absolute", top: 7, right: 7 }}><DeleteButton label="×" message={`¿Eliminar ${photo.filename}?`} /></form></article>)}</div>}
        </section>
      </div>
      <aside style={{ display: "grid", gap: 18, alignContent: "start" }}>
        <section className="panel-card access-card"><h2>Acceso del cliente</h2><p style={{ color: "var(--muted)", fontSize: 13 }}>Compartí el QR o el código. El PIN se mantiene oculto por seguridad.</p><span className="eyebrow">CÓDIGO</span><code>{event.access_code}</code><EventQr code={event.access_code} />{event.status === "published" ? <Link className="button secondary" href={`/mi-evento/${event.slug}`} target="_blank">Abrir galería ↗</Link> : <p className="notice">Publicá el evento para habilitar la galería.</p>}</section>
        <section className="panel-card"><h2>Zona de riesgo</h2><p style={{ color: "var(--muted)", fontSize: 13 }}>Elimina el evento y todas sus fotos de forma permanente.</p><form action={remove}><DeleteButton label="Eliminar evento" message={`¿Eliminar definitivamente “${event.title}” y todas sus fotos?`} /></form></section>
      </aside>
    </div>
  </PanelChrome>;
}
