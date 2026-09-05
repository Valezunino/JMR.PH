import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthArt } from "@/components/auth-art";
import { SubmitButton } from "@/components/submit-button";
import { getAdmin } from "@/lib/auth";
import { databaseReady, ensureSchema, getSql } from "@/lib/db";
import { loginAdmin } from "@/app/panel/actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdmin().catch(() => null)) redirect("/panel");
  const query = await searchParams;
  const ready = await databaseReady();
  let hasAdmin = true;
  if (ready) {
    await ensureSchema();
    const rows = await getSql()`SELECT COUNT(*)::int AS total FROM jmr_admins`;
    hasAdmin = Number(rows[0]?.total) > 0;
  }

  return (
    <main className="auth-shell">
      <AuthArt />
      <section className="auth-box">
        <div className="auth-card">
          <p className="eyebrow">ÁREA PRIVADA</p>
          <h2>Ingresar</h2>
          <p>Administrá eventos, fotos y galerías privadas desde un solo lugar.</p>
          {!ready && <p className="notice error">Todavía falta conectar la base de datos del proyecto en Vercel.</p>}
          {query.error && <p className="notice error">{query.error}</p>}
          {!hasAdmin && <p className="notice">Es la primera vez. <Link href="/panel/configurar">Creá el administrador</Link> para comenzar.</p>}
          <form action={loginAdmin}>
            <label className="field">Correo<input name="email" type="email" autoComplete="email" required /></label>
            <label className="field">Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
            <SubmitButton pendingText="Ingresando…">Entrar al panel</SubmitButton>
          </form>
          <p style={{ marginTop: 28 }}><Link className="text-link" href="/">← Volver al sitio</Link></p>
        </div>
      </section>
    </main>
  );
}
