import Link from "next/link";
import { PanelChrome } from "@/components/panel-chrome";
import { requireAdmin } from "@/lib/auth";
import { getEvents } from "@/lib/data";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ bienvenida?: string }> }) {
  const admin = await requireAdmin();
  const events = await getEvents(admin.id);
  const published = events.filter((event) => event.status === "published").length;
  const photos = events.reduce((sum, event) => sum + Number(event.photo_count ?? 0), 0);
  const query = await searchParams;
  return (
    <PanelChrome>
      {query.bienvenida && <p className="notice success">Administrador creado. El panel ya está listo.</p>}
      <div className="panel-title-row"><div><p className="eyebrow">RESUMEN</p><h1>Panel del fotógrafo</h1><p>{admin.email}</p></div><Link className="button primary" href="/panel/eventos/nuevo">Nuevo evento</Link></div>
      <section className="stats">
        <article className="stat-card"><span>Eventos</span><strong>{events.length}</strong></article>
        <article className="stat-card"><span>Publicados</span><strong>{published}</strong></article>
        <article className="stat-card"><span>Fotos</span><strong>{photos}</strong></article>
      </section>
      <section className="panel-card"><h2>Eventos recientes</h2>
        {events.length === 0 ? <div className="empty-state"><h2>Tu primer evento empieza acá</h2><p>Crealo, cargá las fotos y compartí el código privado con tu cliente.</p><Link className="button primary" href="/panel/eventos/nuevo">Crear evento</Link></div> :
          <div className="event-list">{events.slice(0, 5).map((event) => <Link className="event-row" href={`/panel/eventos/${event.id}`} key={event.id}><div><h3>{event.title}</h3><p>{event.client_name || "Sin cliente indicado"}</p></div><small>{formatEventDate(event.event_date)}</small><span className={`status ${event.status}`}>{event.status === "published" ? "Publicado" : event.status === "archived" ? "Archivado" : "Borrador"}</span><span>→</span></Link>)}</div>}
      </section>
    </PanelChrome>
  );
}
