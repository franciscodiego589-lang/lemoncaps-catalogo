"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MockupLightbox } from "./MockupLightbox";

interface ProductMockupProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  variant: "card" | "dossie";
  /** Nome e slug alimentam a tela cheia; sem eles o mockup não amplia. */
  productName?: string;
  slug?: string;
}

// Atraso entre encostar o ponteiro e abrir a tela cheia. Sem ele, atravessar a
// grade com o mouse dispararia a ampliação de vários potes em sequência — o
// recurso viraria armadilha em vez de atalho.
const ATRASO_ABERTURA_MS = 350;

// Inclinação 3D leve do pote, só com CSS (perspective + rotateX/rotateY nas
// variáveis --tilt-rx/--tilt-ry, ver .lc-mockup-stage em globals.css). Nunca
// Three.js/WebGL: seria ~150 KB de biblioteca pra exibir uma imagem plana,
// sem 3D de verdade em troca (pedido explícito do dono).
//
// Amplitude máxima do giro, em graus (regra: "no máximo cerca de 8 graus").
const MAX_TILT_DEG = 7;

// Só anima transform/opacity (nunca width/top/box-shadow) e nunca guarda a
// posição do ponteiro em useState — isso re-renderizaria a árvore inteira do
// card a cada pixel de movimento. As variáveis CSS são escritas direto no
// elemento via ref, agrupadas num requestAnimationFrame por evento de
// ponteiro (no máximo uma escrita por frame).
export function ProductMockup({ src, alt, width, height, variant, productName, slug }: ProductMockupProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  // Abre e fecha raramente (uma vez por interação), então useState aqui não
  // tem o custo que teria guardando posição de ponteiro.
  const [ampliado, setAmpliado] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const podeAmpliar = Boolean(productName);

  function agendarAbertura() {
    if (!podeAmpliar || ampliado) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAmpliado(true), ATRASO_ABERTURA_MS);
  }

  function cancelarAbertura() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function abrirAgora() {
    if (!podeAmpliar) return;
    cancelarAbertura();
    setAmpliado(true);
  }

  useEffect(() => () => cancelarAbertura(), []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // hover:none (celular/toque) não recebe o efeito de cursor (regra do
    // dono); prefers-reduced-motion:reduce desliga a inclinação por completo,
    // inclusive no listener (não só via CSS) — nem calcula, nem escreve nada.
    const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTilt || reduceMotion) return;

    function applyTilt() {
      frameRef.current = null;
      const point = pointerRef.current;
      if (!stage || !point) return;
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // -0.5..0.5 a partir do centro do próprio card/estágio.
      const relX = Math.min(1, Math.max(0, point.x / rect.width)) - 0.5;
      const relY = Math.min(1, Math.max(0, point.y / rect.height)) - 0.5;
      const rotateY = relX * (MAX_TILT_DEG * 2);
      const rotateX = relY * (MAX_TILT_DEG * -2);

      stage.style.setProperty("--tilt-rx", `${rotateX.toFixed(2)}deg`);
      stage.style.setProperty("--tilt-ry", `${rotateY.toFixed(2)}deg`);
      stage.style.setProperty("--tilt-lift", "-5px");
      stage.style.setProperty("--tilt-scale", "1.03");
      stage.style.setProperty("--shadow-x", `${(relX * -12).toFixed(1)}px`);
      stage.style.setProperty("--shadow-y", `${(3 - relY * 3).toFixed(1)}px`);
      stage.style.setProperty("--shadow-opacity", "0.6");
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = stage!.getBoundingClientRect();
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(applyTilt);
      }
    }

    function resetTilt() {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      pointerRef.current = null;
      stage!.style.setProperty("--tilt-rx", "0deg");
      stage!.style.setProperty("--tilt-ry", "0deg");
      stage!.style.setProperty("--tilt-lift", "0px");
      stage!.style.setProperty("--tilt-scale", "1");
      stage!.style.setProperty("--shadow-x", "0px");
      stage!.style.setProperty("--shadow-y", "0px");
      stage!.style.setProperty("--shadow-opacity", "0.4");
    }

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", resetTilt);
    stage.addEventListener("pointercancel", resetTilt);
    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", resetTilt);
      stage.removeEventListener("pointercancel", resetTilt);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className={`lc-mockup lc-mockup-${variant}${podeAmpliar ? " lc-mockup-ampliavel" : ""}`}
      onPointerEnter={agendarAbertura}
      onPointerLeave={cancelarAbertura}
      onClick={abrirAgora}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          abrirAgora();
        }
      }}
      // Vira alvo de teclado só quando amplia; produto sem foto não deve
      // aparecer na navegação por Tab como se fosse clicável.
      role={podeAmpliar ? "button" : undefined}
      tabIndex={podeAmpliar ? 0 : undefined}
      aria-label={podeAmpliar ? `Ampliar imagem de ${productName}` : undefined}
    >
      {ampliado && productName && (
        <MockupLightbox
          src={src}
          alt={alt}
          productName={productName}
          slug={slug}
          onClose={() => setAmpliado(false)}
        />
      )}
      <div ref={stageRef} className="lc-mockup-stage">
        <span className="lc-mockup-shadow" aria-hidden="true" />
        {/* Next 16: `priority` foi depreciada em favor de `preload` (ver
            node_modules/next/dist/docs/.../components/image.md). O dossiê usa
            preload (imagem em destaque, acima da dobra); o card do catálogo
            usa loading="lazy" (grade de até 28 itens, maioria fora da
            primeira dobra) — os dois nunca juntos na mesma imagem. */}
        {variant === "dossie" ? (
          <Image src={src} alt={alt} width={width} height={height} preload className="lc-mockup-img" />
        ) : (
          <Image src={src} alt={alt} width={width} height={height} loading="lazy" className="lc-mockup-img" />
        )}
      </div>
    </div>
  );
}
