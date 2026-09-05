"use client";

import { useState } from "react";

export function WhatsAppForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");

  function send(eventSubmit: React.FormEvent) {
    eventSubmit.preventDefault();
    const message = [
      `Nombre: ${name}`,
      `Mi WhatsApp: ${phone}`,
      `Evento: ${event}`,
      `Fecha: ${date}`,
      `Lugar: ${place}`,
      "Consulta: Quería conocer disponibilidad y presupuesto.",
    ].join("\n");
    window.open(`https://wa.me/5492475417596?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={send}>
      <label>Nombre<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label>Tu WhatsApp<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" required /></label>
      <label>Tipo de evento<input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Boda, cumpleaños, deporte…" required /></label>
      <div className="form-row">
        <label>Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label>Lugar<input value={place} onChange={(e) => setPlace(e.target.value)} /></label>
      </div>
      <button className="button gold" type="submit">Consultar por WhatsApp</button>
    </form>
  );
}
