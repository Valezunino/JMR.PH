import type { JmrEvent } from "@/lib/types";
import { dateInputValue } from "@/lib/format";
import { SubmitButton } from "@/components/submit-button";

export function EventForm({ action, event }: { action: (formData: FormData) => void | Promise<void>; event?: JmrEvent }) {
  return (
    <form action={action} className="event-form">
      <div className="form-grid">
        <label className="field">Nombre del evento<input name="title" defaultValue={event?.title} placeholder="Ej: Casamiento de Ana y Juan" required /></label>
        <label className="field">Cliente<input name="client_name" defaultValue={event?.client_name} placeholder="Nombre y apellido" /></label>
        <label className="field">Fecha<input name="event_date" type="date" defaultValue={dateInputValue(event?.event_date)} /></label>
        <label className="field">Lugar<input name="location" defaultValue={event?.location} placeholder="Salón, club o ciudad" /></label>
      </div>
      <label className="field">Descripción<textarea name="description" defaultValue={event?.description} placeholder="Un texto breve para la portada de la galería" /></label>
      <div className="form-grid">
        <label className="field">Código de acceso<input name="access_code" defaultValue={event?.access_code} placeholder="ANA-JUAN-2026" required /></label>
        <label className="field">{event ? "Nuevo PIN (dejar vacío para conservarlo)" : "PIN privado"}<input name="pin" type="password" minLength={event ? undefined : 4} inputMode="numeric" autoComplete="new-password" required={!event} /></label>
        <label className="field">Estado<select name="status" defaultValue={event?.status ?? "draft"}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
        <label className="checkbox"><input type="checkbox" name="downloads_enabled" defaultChecked={event?.downloads_enabled ?? true} /> Permitir descarga de fotografías</label>
      </div>
      <div className="form-actions"><SubmitButton pendingText="Guardando…">{event ? "Guardar cambios" : "Crear evento"}</SubmitButton></div>
    </form>
  );
}
