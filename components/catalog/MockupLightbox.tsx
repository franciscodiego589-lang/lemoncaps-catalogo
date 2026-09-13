"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";

interface MockupLightboxProps {
  src: string;
  alt: string;
  productName: string;
  slug?: string;
  onClose: () => void;
}

// Amplitude do giro dentro da tela cheia. Bem maior que os 7 graus do card:
// aqui o pote é o único objeto em cena e ocupa a altura toda, então o mesmo
// ângulo pequeno passaria despercebido.
const MAX_TILT_DEG = 16;

// Sobreposição em tela cheia com o pote ampliado, girando conforme o cursor.
//
// Não usa Three.js nem R3F de propósito: os mockups são FOTOGRAFIA PLANA
// (WebP com alfa, ~480x900), não modelo 3D. Não existe geometria para
// renderizar — uma biblioteca 3D custaria ~150 KB e não compraria um único
// grau de rotação verdadeira. A profundidade vem de perspective + rotateX/
// rotateY, de uma sombra projetada que se desloca em sentido contrário ao
// giro, e de um brilho que varre a superfície acompanhando o ponteiro.
export function MockupLightbox({ src, alt, productName, slug, onClose }: MockupLightboxProps) {
  const paletteRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  // onClose entra em listener de teclado e de ponteiro; sem a referência
  // estável, cada re-render religaria todos eles. A escrita vai num efeito, e
  // não no corpo do componente: em React 19 mexer em ref durante o render é
  // erro de lint, porque com renderização concorrente o mesmo render pode ser
  // descartado e refeito — e a escrita já teria acontecido.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const palette = paletteRef.current;
    if (!palette) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function applyTilt() {
      frameRef.current = null;
      const point = pointerRef.current;
      if (!palette || !point) return;

      const relX = point.x / window.innerWidth - 0.5;
      const relY = point.y / window.innerHeight - 0.5;

      palette.style.setProperty("--zoom-ry", `${(relX * MAX_TILT_DEG * 2).toFixed(2)}deg`);
      palette.style.setProperty("--zoom-rx", `${(relY * MAX_TILT_DEG * -2).toFixed(2)}deg`);
      // A sombra anda para o lado oposto ao giro: é o que vende a ideia de que
      // existe um chão abaixo e uma luz fixa acima.
      palette.style.setProperty("--zoom-shadow-x", `${(relX * -60).toFixed(1)}px`);
      // O brilho, ao contrário, segue o cursor — é o reflexo da própria luz.
      palette.style.setProperty("--zoom-gloss-x", `${(50 + relX * 60).toFixed(1)}%`);
      palette.style.setProperty("--zoom-gloss-y", `${(50 + relY * 60).toFixed(1)}%`);
    }

    function handlePointerMove(event: PointerEvent) {
      if (reduceMotion) return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current == null) frameRef.current = requestAnimationFrame(applyTilt);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);

    // Trava a rolagem do fundo enquanto a tela cheia está aberta: sem isso a
    // roda do mouse rola o catálogo atrás e a sobreposição "desliza" junto.
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflowAnterior;
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const fechar = useCallback(() => closeRef.current(), []);

  return createPortal(
    <div
      className="lc-zoom-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização ampliada de ${productName}`}
      onClick={fechar}
    >
      <button type="button" className="lc-zoom-close" onClick={fechar} aria-label="Fechar visualização">
        <X size={22} aria-hidden="true" />
      </button>

      <div ref={paletteRef} className="lc-zoom-stage">
        <span className="lc-zoom-shadow" aria-hidden="true" />
        <div className="lc-zoom-figure">
          {/* 1400 de altura pedida contra ~900 do arquivo: o next/image nunca
              aumenta além do original, então isto só garante que ele sirva a
              resolução cheia em tela grande, em vez de uma versão reduzida. */}
          <Image src={src} alt={alt} width={760} height={1400} preload className="lc-zoom-img" />
          <span className="lc-zoom-gloss" aria-hidden="true" />
        </div>
      </div>

      {/* Para de propagar o clique: dentro da legenda o alvo é o link do
          dossiê, e fechar aqui roubaria o clique dele. */}
      <div className="lc-zoom-caption" onClick={(event) => event.stopPropagation()}>
        <strong>{productName}</strong>
        {slug && (
          <Link href={`/catalogo/${slug}`} className="lc-btn lc-btn-ghost">
            Ver dossiê técnico
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>,
    document.body,
  );
}
