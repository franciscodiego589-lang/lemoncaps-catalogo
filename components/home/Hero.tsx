import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ============================================================================
// SEM ROTA ATIVA desde 13/09/2026 — não é importado por nenhuma página.
// Era o herói da landing institucional que ficava em /. A raiz passou a ser a
// apresentação da fábrica (ver app/page.tsx e o porquê registrado lá) e o herói
// de lá, components/manufacturing/ManufacturingHero.tsx, absorveu o que este
// tinha de bom: o título em uma frase, a frase de apoio e o CTA único e
// dominante para /catalogo. Guardado no repositório em vez de apagado por
// ordem do dono, para ele decidir depois o que fazer com o texto.
// ============================================================================

// Proposta em uma frase + uma chamada principal (pedido do dono: máximo 2
// linhas de título, uma frase de apoio, um único CTA). "Marca própria" é o
// termo do próprio setor (private label) — a Lemon Caps fabrica para a marca
// do cliente, não vende suplemento com a própria marca ao consumidor final.
export function Hero() {
  return (
    <section className="lc-home-hero" aria-labelledby="lc-home-hero-title">
      <h1 id="lc-home-hero-title" className="lc-home-hero-title">
        A Lemon Caps fabrica sua linha de suplementos em marca própria
      </h1>
      <p className="lc-home-hero-lead">
        Navegue pelo catálogo de fórmulas prontas, monte a cotação a partir de 100 potes e baixe o dossiê técnico
        de cada produto.
      </p>
      <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline lc-home-hero-cta">
        Ver catálogo de fórmulas
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
