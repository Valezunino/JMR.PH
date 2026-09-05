import Link from "next/link";
import { Brand } from "@/components/brand";

export function PublicHeader() {
  return (
    <header className="public-header">
      <Brand />
      <nav aria-label="Navegación principal">
        <Link href="/#trabajos">Trabajos</Link>
        <Link href="/#servicios">Servicios</Link>
        <Link href="/#contacto">Contacto</Link>
        <Link href="/mi-evento" className="nav-highlight">Mi evento</Link>
      </nav>
    </header>
  );
}
