// Especificação de embalagem e logística de uma fórmula, transformada em linhas
// rótulo/valor prontas para exibir. Função pura, compartilhada pelos TRÊS canais que
// mostram esses dados: a página /catalogo/[slug], o PDF do dossiê técnico e a ficha
// técnica dentro do PDF do orçamento (os dois PDFs via lib/pdf/formula-sections.ts).
// Mesma razão de existir do próprio formula-sections: um ajuste de rótulo, unidade ou
// condição de exibição feito aqui vale para os três ao mesmo tempo, sem chance de
// divergirem.
//
// REGRA DE EXATIDÃO: campo nulo não vira linha. Nenhum "não informado", nenhum "-",
// nenhum zero no lugar de dado que ninguém levantou. Fórmula sem EAN simplesmente não
// mostra linha de EAN, e fórmula sem nenhum campo preenchido não mostra a seção -
// hasPackagingSpec() abaixo é o teste que quem monta a tela/o PDF usa para isso.
//
// Nada é convertido: peso gravado em grama aparece em grama, dimensão gravada em
// milímetro aparece em milímetro. Converter para quilo ou centímetro seria cálculo
// nosso em cima de dado do dono - e cálculo escondido é como número errado entra em
// documento que vai ao comprador.
import { formatQuantity } from "@/lib/catalog/format-catalog";

// Só os campos de embalagem, nada além. Tipo próprio (em vez de depender de
// FormulaDetailDTO inteiro) para esta função continuar utilizável de qualquer lado -
// inclusive de um componente de cliente, que não pode importar lib/data/formulas.ts
// (marcado "server-only").
export interface PackagingSpec {
  ean13: string | null;
  dun14: string | null;
  shelfLifeMonths: number | null;
  grossWeightG: number | null;
  packageHeightMm: number | null;
  packageWidthMm: number | null;
  packageDepthMm: number | null;
  unitsPerBox: number | null;
  boxHeightMm: number | null;
  boxWidthMm: number | null;
  boxDepthMm: number | null;
  boxGrossWeightG: number | null;
}

export interface PackagingFact {
  label: string;
  value: string;
}

const MILLIMETER = "mm";
const GRAM = "g";

function measurement(value: number | null, unit: string): string | null {
  return value == null ? null : `${formatQuantity(value)} ${unit}`;
}

// Altura × largura × profundidade numa linha só quando as TRÊS medidas existem - é
// assim que o comprador lê caixa e é assim que ele calcula palete. Faltando alguma, cai
// para uma linha por medida existente: melhor três rótulos explícitos do que uma linha
// combinada com buraco no meio, que se lê como medida errada.
function dimensionFacts(
  prefix: string,
  height: number | null,
  width: number | null,
  depth: number | null,
): PackagingFact[] {
  if (height != null && width != null && depth != null) {
    return [
      {
        label: `${prefix} (A × L × P)`,
        value: `${formatQuantity(height)} × ${formatQuantity(width)} × ${formatQuantity(depth)} ${MILLIMETER}`,
      },
    ];
  }

  return [
    { label: `${prefix} · altura`, value: measurement(height, MILLIMETER) },
    { label: `${prefix} · largura`, value: measurement(width, MILLIMETER) },
    { label: `${prefix} · profundidade`, value: measurement(depth, MILLIMETER) },
  ].filter((fact): fact is PackagingFact => fact.value !== null);
}

export function buildPackagingFacts(spec: PackagingSpec): PackagingFact[] {
  const facts: Array<PackagingFact | null> = [
    spec.ean13 ? { label: "EAN-13 (unidade de venda)", value: spec.ean13 } : null,
    spec.dun14 ? { label: "DUN-14 (caixa de despacho)", value: spec.dun14 } : null,
    spec.shelfLifeMonths != null
      ? { label: "Prazo de validade", value: `${spec.shelfLifeMonths} ${spec.shelfLifeMonths === 1 ? "mês" : "meses"}` }
      : null,
    spec.grossWeightG != null ? { label: "Peso bruto da unidade", value: `${formatQuantity(spec.grossWeightG)} ${GRAM}` } : null,
    ...dimensionFacts("Dimensões da unidade", spec.packageHeightMm, spec.packageWidthMm, spec.packageDepthMm),
    spec.unitsPerBox != null
      ? { label: "Unidades por caixa", value: `${spec.unitsPerBox} ${spec.unitsPerBox === 1 ? "unidade" : "unidades"}` }
      : null,
    ...dimensionFacts("Dimensões da caixa", spec.boxHeightMm, spec.boxWidthMm, spec.boxDepthMm),
    spec.boxGrossWeightG != null ? { label: "Peso bruto da caixa", value: `${formatQuantity(spec.boxGrossWeightG)} ${GRAM}` } : null,
  ];

  return facts.filter((fact): fact is PackagingFact => fact !== null);
}

export function hasPackagingSpec(spec: PackagingSpec): boolean {
  return buildPackagingFacts(spec).length > 0;
}
