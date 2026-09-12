// Paleta de cores do "cromo" por segmento: fundo vivo por trás do vidro, tom
// do chip ativo e cor do rótulo do card. As cores curadas abaixo são as reais,
// já aprovadas no protótipo (docs/previa-liquid-glass.html) para os 8
// segmentos que hoje têm fórmula. Segmento sem par curado (ex.: um segmento
// novo cadastrado no banco, ou "Libido"/"Pele" caso o nome exato divirja do
// texto usado na prévia) nunca quebra: cai num ciclo de cores de reserva,
// escolhido pela posição (sort_order), nunca por achismo de nome.
import { slugify } from "@/lib/format";

export interface SegmentVisual {
  from: string;
  to: string;
  textLight: string;
  textDark: string;
}

const CURATED: Record<string, SegmentVisual> = {
  emagrecimento: { from: "#CFF24E", to: "#66A616", textLight: "#3F6B0D", textDark: "#D8F27A" },
  "energia-e-disposicao": { from: "#FFC24E", to: "#FF8A1E", textLight: "#B85A00", textDark: "#FFCB7A" },
  "beleza-e-bem-estar": { from: "#FFAAD4", to: "#FF4FA0", textLight: "#C22B7A", textDark: "#FFB3DD" },
  "qualidade-do-sono": { from: "#B0A0FF", to: "#5836D6", textLight: "#3B2394", textDark: "#C9BEFF" },
  imunidade: { from: "#8AC6FF", to: "#2470E8", textLight: "#1552B0", textDark: "#A9D4FF" },
  "foco-e-concentracao": { from: "#7CF2E8", to: "#00ACB0", textLight: "#007A7D", textDark: "#8FF2EC" },
  "sistema-digestivo": { from: "#8CEAC0", to: "#109C74", textLight: "#0B7A5A", textDark: "#9FEFC8" },
  "dores-articulares": { from: "#FFA096", to: "#E23345", textLight: "#B31F2E", textDark: "#FFB3AC" },
};

const FALLBACK_CYCLE: SegmentVisual[] = [
  { from: "#D6C6FF", to: "#7A4FE0", textLight: "#4B2A9E", textDark: "#E2D6FF" },
  { from: "#FFD199", to: "#E8790E", textLight: "#A85200", textDark: "#FFDDAD" },
  { from: "#C8F0FF", to: "#2FA9D6", textLight: "#146E90", textDark: "#B9EBFB" },
];

// Fundo padrão da tela quando nenhum segmento está selecionado (chip "Todos").
export const DEFAULT_BACKGROUND: [string, string, string] = ["#CFF24E", "#FFAAD4", "#8AC6FF"];

export function segmentVisual(segmentName: string, sortOrder: number): SegmentVisual {
  const key = slugify(segmentName);
  return CURATED[key] ?? FALLBACK_CYCLE[sortOrder % FALLBACK_CYCLE.length];
}
