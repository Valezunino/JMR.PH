import { Download } from "lucide-react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { canAccessEvent } from "@/lib/auth";
import { getPhotos, getPublishedEventBySlug } from "@/lib/data";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) notFound();
  if (!(await canAccessEvent(event.id))) redirect(`/mi-evento?codigo=${encodeURIComponent(event.access_code)}`);
  const photos = await getPhotos(event.id);
  return <main className="gallery-shell">
    <header className="gallery-header"><Brand /><span className="eyebrow">GALERÍA PRIVADA</span></header>
    <section className="gallery-hero"><p className="eyebrow">{formatEventDate(event.event_date)} · {event.location || "JMR.PH"}</p><h1>{event.title}</h1><p>{event.description || `${photos.length} fotografías de tu evento.`}</p></section>
    {photos.length === 0 ? <section className="empty-state" style={{ margin: "0 6vw" }}><h2>La galería está siendo preparada</h2><p>Volvé a ingresar más tarde con el mismo código y PIN.</p></section> : <section className="gallery-grid">{photos.map((photo) => <article className="gallery-photo" key={photo.id}><Image src={`/api/photos/${photo.id}/view`} alt={photo.filename} width={1600} height={1100} sizes="(max-width: 700px) 50vw, 34vw" unoptimized />{event.downloads_enabled && <a className="download-link" href={`/api/photos/${photo.id}/download`} aria-label={`Descargar ${photo.filename}`}><Download size={17} /></a>}</article>)}</section>}
    <footer><span>© JMR.PH</span><span>{photos.length} FOTOGRAFÍAS</span><span>Galería privada</span></footer>
  </main>;
}
