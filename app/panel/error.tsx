"use client";

export default function PanelError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="auth-box" style={{ minHeight: "100svh" }}><div className="auth-card"><p className="eyebrow">ERROR</p><h2>No pudimos abrir el panel</h2><p>Tus datos siguen guardados. Puede ser un problema momentáneo de conexión.</p><button className="button primary" onClick={reset}>Reintentar</button></div></main>;
}
