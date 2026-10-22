// Sobrevivência da tela de sucesso do orçamento a um recarregamento da página.
//
// POR QUE ISTO EXISTE (auditoria de interface, 13/09/2026 - achado crítico):
// até então o retrato do orçamento gerado (`QuoteSuccessData`) vivia só no
// `useState` de components/cart/CartView.tsx, e a mesma função que entrava na
// tela de sucesso chamava `clear()`, esvaziando o carrinho persistido. Bastava
// um F5 - ou o navegador restaurando a aba - para o cliente perder o número do
// orçamento e os três botões da tela ("Copiar orçamento", "Baixar PDF" e
// "Falar no WhatsApp"): o carrinho já estava vazio e o retrato tinha morrido
// com o estado do React. O orçamento continuava no banco, mas sem caminho de
// volta pela interface. Isso é perda de conversão, não detalhe técnico.
//
// COMO FOI RESOLVIDO - duas metades, cada uma com um papel:
//
//   1. A URL diz QUAL tela está aberta: `/carrinho?orcamento=<numero>`.
//      É ela que distingue "estou na tela de sucesso do orçamento nº N" de
//      "estou no carrinho". Sem esse marcador, um retrato guardado no
//      navegador reapareceria em situações erradas (o cliente volta ao
//      carrinho para cotar de novo e leva na cara a tela de sucesso antiga).
//      Só o número sequencial anda na URL - nunca nome, WhatsApp ou o uuid
//      interno do orçamento.
//
//   2. O armazenamento da aba guarda o CONTEÚDO da tela: itens, valores, nome
//      e WhatsApp. Esses dados não podem vir da URL nem ser lidos do banco
//      pelo número, porque as tabelas do catálogo não têm leitura pública -
//      e criar uma leitura pública por número deixaria qualquer visitante
//      enumerar `?orcamento=1,2,3...` e colher nome e telefone de clientes
//      alheios. O retrato fica, portanto, no navegador de quem cotou.
//
// DADO PESSOAL DO CLIENTE (nome e WhatsApp) - as três decisões tomadas:
//   - `sessionStorage`, nunca `localStorage`: o retrato morre quando a aba
//     fecha. `localStorage` deixaria nome e telefone gravados no aparelho por
//     tempo indeterminado (e visíveis em qualquer outra aba do mesmo site),
//     que é muito mais do que o problema exige.
//   - prazo de validade de 2 horas (`QUOTE_SNAPSHOT_TTL_MS`): mesmo dentro da
//     aba, um retrato velho é descartado e apagado na primeira leitura. Cobre
//     com folga o F5 acidental e a aba restaurada logo em seguida, que é o
//     caso real; não vira arquivo de dados.
//   - apagado na saída deliberada: ao clicar em "Voltar ao catálogo" na tela
//     de sucesso, o retrato é removido na hora (ver `clearQuoteSnapshot` em
//     components/cart/QuoteSuccess.tsx). Quem terminou não precisa mais dele.
//
// Nada aqui é fonte de verdade: o orçamento verdadeiro está no banco. Isto é
// só o retrato do que já foi gerado, para a tela poder se remontar.
import type { QuoteSuccessData } from "@/lib/cart/types";
import type { CartItem } from "@/lib/store/cart";

/** Chave no sessionStorage. Irmã de "lemoncaps-cart" (localStorage, zustand). */
const SNAPSHOT_STORAGE_KEY = "lemoncaps-quote-success";

/** Nome do parâmetro na URL. Em português, como o resto das rotas do site. */
export const QUOTE_URL_PARAM = "orcamento";

/** 2 horas. Ver a nota sobre dado pessoal no cabeçalho deste arquivo. */
const QUOTE_SNAPSHOT_TTL_MS = 2 * 60 * 60 * 1000;

interface StoredQuoteSnapshot {
  /** Epoch em ms de quando o retrato foi guardado. Base do prazo de validade. */
  savedAt: number;
  data: QuoteSuccessData;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    isNonEmptyString(item.formulaId) &&
    isNonEmptyString(item.slug) &&
    typeof item.name === "string" &&
    (item.unitPriceCents === null || Number.isInteger(item.unitPriceCents)) &&
    Number.isInteger(item.quantityPotes) &&
    Number.isInteger(item.minimumOrderPotes)
  );
}

// O conteúdo do sessionStorage é território do visitante: dá para editar pelo
// DevTools, e também pode ter sido gravado por uma versão anterior do site,
// com outro formato. Como este retrato alimenta a tela, o texto copiado e o
// PDF, ele é conferido campo a campo antes de ser aceito - qualquer coisa fora
// do formato é tratada como inexistente. Valores em centavos são conferidos
// como inteiros (`Number.isInteger`) porque dinheiro neste projeto nunca é
// float: ver lib/money.ts (centsToBRL).
function isQuoteSuccessData(value: unknown): value is QuoteSuccessData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  return (
    isNonEmptyString(data.quoteId) &&
    Number.isInteger(data.quoteNumber) &&
    (data.quoteNumber as number) > 0 &&
    typeof data.customerName === "string" &&
    typeof data.customerWhatsapp === "string" &&
    Array.isArray(data.items) &&
    data.items.every(isCartItem) &&
    Number.isInteger(data.totalPotes) &&
    Number.isInteger(data.totalCents)
  );
}

/**
 * Número do orçamento marcado na URL atual, ou null se não houver um válido.
 * Só chame no navegador (o `typeof window` abaixo protege o servidor).
 */
export function readQuoteNumberFromUrl(): number | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get(QUOTE_URL_PARAM);
  if (raw === null) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/** Apaga o retrato guardado. Silencioso: nunca deve derrubar a tela. */
export function clearQuoteSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SNAPSHOT_STORAGE_KEY);
  } catch (error) {
    console.error("[quote-snapshot] falha ao limpar o retrato do orçamento:", error);
  }
}

/**
 * Guarda o retrato do orçamento recém-gerado e carimba `?orcamento=<numero>`
 * na URL, sem recarregar nada nem empilhar histórico.
 *
 * `replaceState` (e não `pushState`) porque a tela de sucesso SUBSTITUI o
 * carrinho: depois de gerar, o botão "voltar" do navegador deve levar de onde
 * o cliente veio (o catálogo), nunca de volta a um carrinho que já foi
 * esvaziado. O Next 16 suporta oficialmente a History API nativa e a mantém em
 * sincronia com o roteador - ver node_modules/next/dist/docs/01-app/
 * 01-getting-started/04-linking-and-navigating.md, seção "Native History API".
 *
 * Se o armazenamento estiver bloqueado (navegação anônima, cota cheia), a tela
 * de sucesso ainda aparece normalmente pelo estado do React; só não sobrevive
 * ao F5 - exatamente o comportamento antigo, nunca pior que ele.
 */
export function rememberQuoteSuccess(data: QuoteSuccessData): void {
  if (typeof window === "undefined") return;

  const payload: StoredQuoteSnapshot = { savedAt: Date.now(), data };
  try {
    window.sessionStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("[quote-snapshot] falha ao guardar o retrato do orçamento:", error);
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set(QUOTE_URL_PARAM, String(data.quoteNumber));
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  } catch (error) {
    console.error("[quote-snapshot] falha ao marcar o orçamento na URL:", error);
  }
}

/**
 * Remonta a tela de sucesso a partir da URL + retrato guardado, ou devolve
 * null quando não há o que remontar. É o que roda no F5.
 *
 * Só aceita o retrato quando as três condições valem ao mesmo tempo:
 *   - a URL traz `?orcamento=<numero>` (o cliente está mesmo na tela de
 *     sucesso, e não voltou ao carrinho para cotar outra coisa);
 *   - o retrato guardado é do MESMO número (não de um orçamento anterior);
 *   - o retrato ainda está dentro do prazo de validade.
 * Em qualquer outro caso o retrato é apagado, não fica pendurado no navegador.
 */
export function restoreQuoteSuccessFromUrl(): QuoteSuccessData | null {
  if (typeof window === "undefined") return null;

  const quoteNumber = readQuoteNumberFromUrl();
  if (quoteNumber === null) return null;

  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(SNAPSHOT_STORAGE_KEY);
  } catch (error) {
    console.error("[quote-snapshot] falha ao ler o retrato do orçamento:", error);
    return null;
  }
  if (raw === null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.error("[quote-snapshot] retrato do orçamento ilegível; descartado:", error);
    clearQuoteSnapshot();
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) {
    clearQuoteSnapshot();
    return null;
  }

  const stored = parsed as Record<string, unknown>;
  if (!isFiniteNumber(stored.savedAt) || !isQuoteSuccessData(stored.data)) {
    clearQuoteSnapshot();
    return null;
  }

  const isExpired = Date.now() - stored.savedAt > QUOTE_SNAPSHOT_TTL_MS;
  const isOtherQuote = stored.data.quoteNumber !== quoteNumber;
  if (isExpired || isOtherQuote) {
    clearQuoteSnapshot();
    return null;
  }

  return stored.data;
}
