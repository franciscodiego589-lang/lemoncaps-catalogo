import Link from "next/link";
import type { ReactNode } from "react";

// Botão flutuante de vidro com contagem — usado para o carrinho de cotação.
// Genérico o bastante para qualquer ação flutuante futura com badge numérico.
interface GlassFabProps {
  href: string;
  ariaLabel: string;
  count?: number;
  children: ReactNode;
}

export function GlassFab({ href, ariaLabel, count, children }: GlassFabProps) {
  return (
    <Link href={href} aria-label={ariaLabel} className="lc-fab lc-glass">
      {children}
      {typeof count === "number" && (
        <span className="lc-badge" aria-hidden="true">
          {count}
        </span>
      )}
    </Link>
  );
}
