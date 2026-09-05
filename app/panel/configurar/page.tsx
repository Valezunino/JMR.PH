import { redirect } from "next/navigation";
import { setupAdmin } from "@/app/panel/actions";
import { AuthArt } from "@/components/auth-art";
import { SubmitButton } from "@/components/submit-button";
import { ensureSchema, getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await ensureSchema();
  const rows = await getSql()`SELECT COUNT(*)::int AS total FROM jmr_admins`;
  if (Number(rows[0]?.total) > 0) redirect("/panel/login");
  const query = await searchParams;
  return (
    <main className="auth-shell">
      <AuthArt />
      <section className="auth-box"><div className="auth-card">
        <p className="eyebrow">CONFIGURACIÓN INICIAL</p>
        <h2>Crear administrador</h2>
        <p>Esta pantalla se bloquea automáticamente después de crear la primera cuenta.</p>
        {query.error && <p className="notice error">{query.error}</p>}
        <form action={setupAdmin}>
          <label className="field">Correo<input name="email" type="email" autoComplete="email" required /></label>
          <label className="field">Contraseña<input name="password" type="password" minLength={10} autoComplete="new-password" required /></label>
          <label className="field">Repetir contraseña<input name="confirmation" type="password" minLength={10} autoComplete="new-password" required /></label>
          <SubmitButton pendingText="Creando…">Crear cuenta segura</SubmitButton>
        </form>
      </div></section>
    </main>
  );
}
