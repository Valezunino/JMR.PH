import Link from "next/link";
import { PanelChrome } from "@/components/panel-chrome";
import { requireAdmin } from "@/lib/auth";
import { getEvents } from "@/lib/data";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ eliminado?: string }> }) {
  const admin = await requireAdmin();
  const events = await getEvents(admin.id);
  const query = await searchParams;
  return <PanelChrome>
    {query.eliminado && <p className="notice success">Evento eliminado correctamente.</p>}
    <div className="panel-title-row"><div><p className="eyebrow">GESTIÓN</p><h1>Eventos</h1><p>{events.length} {events.length === 1 ? "evento creado" : "eventos creados"}</p></div><Link className="button primary" href="/panel/eventos/nuevo">Nuevo evento</Link></div>
    {events.length === 0 ? <div className="empty-state"><h2>Todavía no hay eventos</h2><p>Creá el primero para comenzar a cargar fotografías.</p></div> : <div className="event-list">{events.map((event) => <Link className="event-row" href={`/panel/eventos/${event.id}`} key={event.id}><div><h3>{event.title}</h3><p>{event.client_name || "Sin cliente"} · {event.location || "Sin lugar"}</p></div><small>{formatEventDate(event.event_date)}</small><span className={`status ${event.status}`}>{event.status === "published" ? "Publicado" : event.status === "archived" ? "Archivado" : "Borrador"}</span><small>{event.photo_count ?? 0} fotos →</small></Link>)}</div>}
  </PanelChrome>;
}
