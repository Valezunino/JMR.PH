import Link from "next/link";
import { Brand } from "@/components/brand";
import { logoutAdmin } from "@/app/panel/actions";

export function PanelChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel-shell">
      <header className="panel-header">
        <Brand href="/panel" />
        <nav>
          <Link href="/" target="_blank">Ver sitio ↗</Link>
          <Link href="/panel/eventos">Eventos</Link>
          <form action={logoutAdmin}><button className="logout-button" type="submit">Salir</button></form>
        </nav>
      </header>
      <main className="panel-main">{children}</main>
    </div>
  );
}
