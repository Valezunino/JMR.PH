"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export function EventQr({ code }: { code: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const url = `${window.location.origin}/mi-evento?codigo=${encodeURIComponent(code)}`;
    void QRCode.toCanvas(canvas.current, url, { width: 190, margin: 1, color: { dark: "#111111", light: "#ffffff" } });
  }, [code]);
  return <div className="qr-box"><canvas ref={canvas} aria-label="Código QR de acceso al evento" /></div>;
}
