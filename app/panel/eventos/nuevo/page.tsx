import Link from "next/link";
import { createEvent } from "@/app/panel/eventos/actions";
import { EventForm } from "@/components/event-form";
import { PanelChrome } from "@/components/panel-chrome";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewEventPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const query = await searchParams;
  return <PanelChrome><div className="panel-title-row"><div><p className="eyebrow">NUEVO</p><h1>Crear evento</h1><p>Podés completar o modificar todo más adelante.</p></div><Link className="text-link" href="/panel/eventos">← Volver</Link></div>{query.error && <p className="notice error">{query.error}</p>}<section className="panel-card"><EventForm action={createEvent} /></section></PanelChrome>;
}
