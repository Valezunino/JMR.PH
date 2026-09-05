"use client";

export function DeleteButton({ label = "Eliminar", message = "¿Seguro que querés eliminarlo? Esta acción no se puede deshacer." }: { label?: string; message?: string }) {
  return <button className="button danger" type="submit" onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>{label}</button>;
}
