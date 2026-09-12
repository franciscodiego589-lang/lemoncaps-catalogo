"use client";

import { useEffect, useRef } from "react";

// Fundo vivo por trás do vidro (é o que dá ao vidro algo de verdade para
// refratar — ver liquid-glass-guia.md, seção 5). Duas camadas empilhadas: ao
// trocar de segmento, a de trás já recebe as cores novas e sobe a opacidade
// enquanto a da frente desce — dá o crossfade sem depender de transição de
// gradiente (que CSS não anima direto). Puramente decorativo: aria-hidden.
interface AnimatedBackgroundProps {
  colors: readonly [string, string, string];
}

export function AnimatedBackground({ colors }: AnimatedBackgroundProps) {
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const activeLayer = useRef(0);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const [c1, c2, c3] = colors;
    const layers = [layerARef.current, layerBRef.current];

    if (isFirstRun.current) {
      // Primeira pintura já sai correta via estilo inline no JSX (camada A
      // visível). Só garante que as variáveis batem com a prop recebida.
      layers[activeLayer.current]?.style.setProperty("--bg-c1", c1);
      layers[activeLayer.current]?.style.setProperty("--bg-c2", c2);
      layers[activeLayer.current]?.style.setProperty("--bg-c3", c3);
      isFirstRun.current = false;
      return;
    }

    const nextIndex = 1 - activeLayer.current;
    const next = layers[nextIndex];
    const current = layers[activeLayer.current];
    if (!next || !current) return;

    next.style.setProperty("--bg-c1", c1);
    next.style.setProperty("--bg-c2", c2);
    next.style.setProperty("--bg-c3", c3);
    next.style.opacity = "1";
    current.style.opacity = "0";
    activeLayer.current = nextIndex;
    // `colors` já vem memoizado em CatalogView — só muda de referência quando
    // o segmento selecionado muda de verdade, que é exatamente quando este
    // efeito deve rodar.
  }, [colors]);

  return (
    <>
      <div ref={layerARef} className="lc-bg-layer" style={{ opacity: 1 }} aria-hidden="true" />
      <div ref={layerBRef} className="lc-bg-layer" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}
