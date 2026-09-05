import Link from "next/link";
import { accessGallery } from "@/app/mi-evento/actions";
import { AuthArt } from "@/components/auth-art";
import { SubmitButton } from "@/components/submit-button";

export const dynamic = "force-dynamic";

export default async function ClientAccessPage({ searchParams }: { searchParams: Promise<{ codigo?: string; error?: string }> }) {
  const query = await searchParams;
  return <main className="auth-shell"><AuthArt /><section className="auth-box"><div className="auth-card">
    <p className="eyebrow">GALERÍA PRIVADA</p><h2>Tu evento</h2><p>Ingresá el código y el PIN que recibiste junto con tu entrega.</p>
    {query.error && <p className="notice error">{query.error}</p>}
    <form action={accessGallery}><label className="field">Código del evento<input name="code" defaultValue={query.codigo ?? ""} autoCapitalize="characters" required /></label><label className="field">PIN<input name="pin" type="password" inputMode="numeric" autoComplete="one-time-code" required /></label><SubmitButton pendingText="Verificando…">Abrir galería</SubmitButton></form>
    <p style={{ marginTop: 28 }}><Link className="text-link" href="/">← Volver a JMR.PH</Link></p>
  </div></section></main>;
}
