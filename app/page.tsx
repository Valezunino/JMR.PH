import Link from "next/link";
import Image from "next/image";
import { ArrowDown, Camera, Download, LockKeyhole, MessageCircle } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { WhatsAppForm } from "@/components/whatsapp-form";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <PublicHeader />
        <div className="hero-photo" aria-hidden="true">
          <Image
            src="/photos/jmr-atardecer-02.jpg"
            alt=""
            fill
            priority
            quality={95}
            sizes="(max-width: 780px) 100vw, 62vw"
          />
        </div>
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-frame" aria-hidden="true"><span /><span /><span /></div>
        <div className="hero-content">
          <p className="eyebrow">JMRUIZ FOTOGRAFÍA · PERGAMINO</p>
          <h1>Historias reales,<br /><em>miradas con intención.</em></h1>
          <p className="hero-copy">Fotografía social, deportiva y de eventos con una entrega cuidada de principio a fin.</p>
          <div className="hero-actions">
            <Link href="#contacto" className="button gold">Consultar fecha</Link>
            <Link href="/mi-evento" className="text-link">Ver mi galería <span>↗</span></Link>
          </div>
        </div>
        <a className="scroll-cue" href="#trabajos" aria-label="Bajar a trabajos"><ArrowDown size={18} /></a>
      </section>

      <section className="statement" id="trabajos">
        <p className="section-number">01 · ENFOQUE</p>
        <h2>La fotografía no se trata de posar.<br />Se trata de <em>estar ahí.</em></h2>
        <p>Cada cobertura busca conservar la energía, los vínculos y esos instantes que solo suceden una vez.</p>
      </section>

      <section className="portfolio-placeholder" aria-label="Portfolio de JMR.PH">
        <div className="photo-card photo-card-a">
          <Image src="/photos/jmr-casamiento-02.jpg" alt="Celebración de casamiento fotografiada por JMR.PH" fill quality={92} sizes="(max-width: 780px) 100vw, 42vw" />
          <span>Eventos</span>
        </div>
        <div className="photo-card photo-card-b">
          <Image src="/photos/jmr-atardecer-01.jpg" alt="Book al aire libre fotografiado por JMR.PH" fill quality={92} sizes="(max-width: 780px) 50vw, 29vw" />
          <span>Retratos</span>
        </div>
        <div className="photo-card photo-card-c">
          <Image src="/photos/jmr-casamiento-03.jpg" alt="Pareja disfrutando su casamiento, fotografía de JMR.PH" fill quality={92} sizes="(max-width: 780px) 50vw, 29vw" />
          <span>Historias</span>
        </div>
        <p className="portfolio-note">Fotografías originales de JMR.PH · <a href="https://www.instagram.com/jmr.ph/" target="_blank" rel="noreferrer">Ver Instagram ↗</a></p>
      </section>

      <section className="services" id="servicios">
        <div className="section-heading"><p className="section-number">02 · SERVICIOS</p><h2>Una cobertura pensada<br />para cada historia.</h2></div>
        <div className="service-grid">
          <article><span>01</span><Camera /><h3>Eventos sociales</h3><p>Bodas, cumpleaños, fiestas y celebraciones retratadas con naturalidad.</p></article>
          <article><span>02</span><LockKeyhole /><h3>Galería privada</h3><p>Acceso personal mediante código y PIN para compartir cada entrega con seguridad.</p></article>
          <article><span>03</span><Download /><h3>Entrega digital</h3><p>Fotos en alta calidad, organizadas y listas para ver o descargar desde cualquier dispositivo.</p></article>
        </div>
      </section>

      <section className="contact" id="contacto">
        <div className="contact-intro">
          <p className="section-number">03 · CONTACTO</p>
          <h2>Contame qué<br /><em>estás preparando.</em></h2>
          <p>Completá los datos y la consulta se abrirá directamente en WhatsApp.</p>
          <a href="tel:+542475417596" className="phone-link"><MessageCircle size={20} /> 2475-417596</a>
        </div>
        <WhatsAppForm />
      </section>

      <footer><span>© {new Date().getFullYear()} JMR.PH</span><span>FOTOGRAFÍA · PERGAMINO</span><Link href="/panel/login">Acceso fotógrafo</Link></footer>
    </main>
  );
}
