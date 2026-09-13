import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GlassSurface } from "@/components/glass/GlassSurface";

// Topo da landing (/): mesmo cromo de vidro do resto do site (lc-topbar/
// lc-glass, ver GlassTopBar/DossieTopBar), sem busca e sem carrinho — aqui a
// única ação é ir para o catálogo. Server Component: nada aqui depende de
// estado do cliente (a landing não lê o carrinho).
export function HomeTopBar() {
  return (
    <header className="lc-topbar">
      <GlassSurface as="nav" className="lc-topbar-inner" aria-label="Principal">
        <div className="lc-brand">
          <span className="lc-brand-dot" aria-hidden="true" />
          <span translate="no">Lemon Caps</span>
        </div>
        <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline lc-home-topbar-cta">
          Ver catálogo
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </GlassSurface>
    </header>
  );
}
