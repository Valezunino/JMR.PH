import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="JMR.PH, inicio">
      <span className="brand-mark">JMR</span>
      <span className="brand-dot">.PH</span>
      <span className="brand-sub">FOTOGRAFÍA</span>
    </Link>
  );
}
