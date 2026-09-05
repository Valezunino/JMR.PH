import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "JMR.PH — Fotografía", template: "%s — JMR.PH" },
  description: "Fotografía social, deportiva y de eventos. Galerías privadas para cada historia.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#090909" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
