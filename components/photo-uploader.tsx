"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function PhotoUploader({ eventId }: { eventId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const files = Array.from(inputRef.current?.files ?? []);
    if (!files.length) return setMessage("Elegí al menos una fotografía.");
    const invalid = files.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_FILE_SIZE);
    if (invalid) return setMessage(`${invalid.name} no es JPG, PNG o WebP, o supera los 20 MB.`);
    setBusy(true); setMessage(""); setProgress(0);
    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const blob = await upload(`events/${eventId}/${file.name}`, file, {
          access: "private",
          handleUploadUrl: "/api/photos/upload",
          clientPayload: JSON.stringify({ eventId }),
          multipart: file.size > 5 * 1024 * 1024,
        });
        const response = await fetch("/api/photos/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ eventId, pathname: blob.pathname, url: blob.url, filename: file.name }),
        });
        if (!response.ok) throw new Error((await response.json()).error ?? "No se pudo registrar la foto");
        setProgress(Math.round(((index + 1) / files.length) * 100));
      }
      if (inputRef.current) inputRef.current.value = "";
      setMessage(`${files.length} ${files.length === 1 ? "foto cargada" : "fotos cargadas"} correctamente.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "La carga no pudo completarse.");
    } finally { setBusy(false); }
  }

  return <form className="photo-upload" onSubmit={submit}>
    <strong>Cargar fotografías originales</strong>
    <p style={{ color: "var(--muted)", fontSize: 12 }}>JPG, PNG o WebP · hasta 20 MB por archivo · selección múltiple</p>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} />
    <button className="button primary" disabled={busy} type="submit">{busy ? `Cargando ${progress}%…` : "Subir fotos"}</button>
    {busy && <div className="upload-progress"><span style={{ width: `${progress}%` }} /></div>}
    {message && <p className="notice" style={{ marginBottom: 0 }}>{message}</p>}
  </form>;
}
