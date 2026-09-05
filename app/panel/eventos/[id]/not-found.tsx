import Link from "next/link";
export default function EventNotFound() { return <main className="auth-box" style={{ minHeight: "100svh" }}><div className="auth-card"><p className="eyebrow">404</p><h2>Evento no encontrado</h2><Link className="button primary" href="/panel/eventos">Volver a eventos</Link></div></main>; }
