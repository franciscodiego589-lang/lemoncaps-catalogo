import type { ElementType, HTMLAttributes } from "react";

// Superfície de vidro genérica (borda especular + blur + saturação — ver
// .lc-glass em app/globals.css). Usada só no "cromo": barra de topo, faixa de
// chips, abas Premium/Básicas. Nunca no card nem na tabela de composição.
interface GlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "nav" | "section";
}

export function GlassSurface({ as = "div", className = "", children, ...rest }: GlassSurfaceProps) {
  const Component = as as ElementType;
  return (
    <Component className={`lc-glass ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}
