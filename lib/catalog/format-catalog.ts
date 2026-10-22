// Helpers de apresentação específicos do catálogo público. Ficam separados de
// lib/format.ts (que não pode ser alterado) porque são regra de domínio do
// catálogo, não utilidade genérica do projeto.
import { Candy, CupSoda, Droplet, Pill, type LucideIcon } from "lucide-react";

import type { Enums } from "@/lib/supabase/database.types";

export type ProductLine = Enums<"product_line">;
export type ProductFormat = Enums<"product_format">;
export type CompositionUnit = Enums<"composition_unit">;

// Rótulo de exibição de cada unidade aceita (AGENTS.md): banco grava em
// minúsculo ("l", "ui"), mas o texto correto para o cliente final é "L"/"UI".
const UNIT_LABELS: Record<CompositionUnit, string> = {
  g: "g",
  mg: "mg",
  mcg: "mcg",
  ml: "ml",
  l: "L",
  ui: "UI",
  kg: "kg",
};

export function unitLabel(unit: CompositionUnit): string {
  return UNIT_LABELS[unit];
}

// Formata a quantidade numérica no padrão brasileiro (vírgula decimal).
//
// ARREDONDAMENTO DE EXIBIÇÃO — pedido do dono em 14/09/2026, ao ver
// "colina (bitartarato de colina) 438,1375 mg" na tabela de composição: "não
// precisa de todas essas casas depois da vírgula". Doses assim nascem de
// divisão pelo teor do laudo e carregam uma precisão que nenhuma balança de
// produção alcança — quatro casas num valor de centenas de miligramas é ruído,
// não informação.
//
// O DADO NO BANCO NÃO MUDA. A coluna `numeric` continua com o valor exato, e é
// ele que vale para produção e para o memorial de cálculo; isto aqui é só a
// camada de apresentação. Por isso o arredondamento é proporcional à grandeza,
// e não um número fixo de casas: cortar em duas casas cegamente transformaria
// a metilcobalamina de 0,011 mg em "0,01 mg" e a de 0,010082 em "0,01" — dois
// insumos distintos com a mesma cara, e um erro de 9% escondido no arredondamento.
//
//   valor >= 1  ->  até 2 casas   (438,1375 -> "438,14"  ·  9,94 -> "9,94")
//   valor <  1  ->  até 4 casas   (0,011 -> "0,011"  ·  0,010082 -> "0,0101")
//
// useGrouping: false mantém o comportamento anterior para milhares (5000 segue
// "5000", não "5.000"). Separador de milhar seria outra mudança, não pedida.
export function formatQuantity(quantity: number): string {
  const maximumFractionDigits = Math.abs(quantity) >= 1 ? 2 : 4;
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
    useGrouping: false,
  }).format(quantity);
}

// "Composição por dose" em texto corrido, no mesmo formato da lista de
// ingredientes — pedido do dono em 23/09/2026 ("não é tabela, é texto igual
// os ingredientes"). Uma função só para a página e os dois PDFs (dossiê e
// orçamento), que assim nunca divergem. Sempre a MASSA do insumo, nunca o
// ativo convertido — decisão do dono, 23/09/2026 ("deixe sempre a massa em todos").
export function composicaoEmTexto(
  compositions: ReadonlyArray<{ ingredientName: string; quantity: number; unit: CompositionUnit }>,
): string {
  if (compositions.length === 0) return "";
  return `${compositions
    .map((item) => `${item.ingredientName} ${formatQuantity(item.quantity)} ${unitLabel(item.unit)}`)
    .join(", ")}.`;
}

// A linha `essencial` aparece como "Econômica" desde 21/10/2026, por pedido do
// dono ("coloque eles em uma linha econômica, crie esse botão"). Só o rótulo
// mudou: o valor gravado no banco e o ?linha= da URL continuam "essencial".
// A linha `lemon_caps` (22/10/2026) reúne as fórmulas da marca própria que estão
// no Word técnico e na planilha de memorial de cálculo.
const LINE_LABELS: Record<ProductLine, string> = {
  premium: "Premium",
  basica: "Básica",
  essencial: "Econômica",
  lemon_caps: "Lemon Caps",
};

export function lineLabel(line: ProductLine): string {
  return LINE_LABELS[line];
}

// Ícone só decorativo (não é dado do banco, é mapeamento fixo de formato ->
// componente de ícone de traço da lucide-react — chaves batem com o enum real
// product_format, não com os apelidos em português usados na prévia estática).
// Antes era emoji 3D; trocado por ícone de traço para um catálogo de indústria.
//
// Exportado como tabela (não como função) de propósito: quem usa isto em JSX
// precisa indexar o mapa diretamente (`FORMAT_ICONS[formula.format]`) pra não
// disparar o aviso do React Compiler de "componente criado durante o render"
// — uma chamada de função no meio do JSX parece, pra aquela análise estática,
// fábrica de componente novo a cada render, mesmo devolvendo sempre a mesma
// referência estável.
export const FORMAT_ICONS: Record<ProductFormat, LucideIcon> = {
  capsula: Pill,
  soluvel: CupSoda,
  gummy: Candy,
  liquido: Droplet,
};

// Campo nulo ou vazio nunca aparece na tela como "null"/"undefined" — o
// elemento correspondente é escondido. Este helper centraliza a checagem.
export function hasContent(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasItems<T>(value: readonly T[] | null | undefined): value is readonly T[] {
  return Array.isArray(value) && value.length > 0;
}

// Alguns benefícios já vêm do banco com marcador de lista embutido no próprio
// texto ("• Contribui para..."), herdado da fonte original em texto livre. O
// ✓ mostrado antes de cada item é CSS (::before em .lc-dossie-benefits-list,
// app/globals.css) - sem esta limpeza os dois marcadores aparecem juntos
// ("✓ • Contribui..."). Remove só o marcador do começo da string (bullet,
// hífen, asterisco e os espaços ao redor); o dado no banco continua intacto,
// isto muda apenas a exibição. Função pura: mesma entrada, mesma saída,
// nenhum efeito colateral - testável isoladamente.
const LEADING_BULLET_MARKER = /^\s*[•*-]+\s*/;

export function stripLeadingBulletMarker(text: string): string {
  return text.replace(LEADING_BULLET_MARKER, "");
}

/**
 * Texto pronto para comparação de busca: minúsculo e sem acento.
 *
 * Sem isso, quem digita "colageno" não achava o Colágeno — e digitar sem acento é
 * o comportamento normal de quem busca com pressa, ainda mais no celular. Tem de
 * ser aplicado nos DOIS lados da comparação (no termo digitado e no nome da
 * fórmula), senão a assimetria só troca de lado.
 *
 * NFD separa a letra do acento; o intervalo \u0300-\u036f são as marcas
 * diacríticas combinantes, que saem fora.
 */
export function normalizarBusca(texto: string): string {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
