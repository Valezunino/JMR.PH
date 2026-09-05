import { Brand } from "@/components/brand";

export function AuthArt() {
  return (
    <aside className="auth-art">
      <Brand />
      <h1>Tu trabajo,<br />ordenado y<br /><span style={{ color: "var(--gold)" }}>bien presentado.</span></h1>
      <p className="eyebrow">PANEL DEL FOTÓGRAFO</p>
    </aside>
  );
}
