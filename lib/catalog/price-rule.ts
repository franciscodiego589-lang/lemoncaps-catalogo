// Regra "fórmula no ar precisa de preço" — o mesmo que a constraint
// public.formulas_active_requires_price garante no banco, repetido aqui para
// o admin avisar ANTES de ir ao banco (mensagem no campo certo). O banco
// continua sendo o backstop final.
//
// Exceções, decisões do dono: a linha Essencial (rótulo "Econômica") pode
// ficar no ar sem preço desde 23/09/2026 (migration
// 20260923050000_essencial_sem_preco.sql), e a Premium também desde 21/10/2026
// ("o valor depois coloco"; migration 20261021170000_cotacao_sem_preco.sql).
// A Lemon Caps nasce com a mesma regra (20261022120000_linha_lemon_caps.sql).
// O catálogo mostra "Preço sob consulta" e o botão "Cotar fórmula" continua.
// Só a antiga Básica segue exigindo preço.
import type { ProductLine } from "./format-catalog";

export function lineAllowsActiveWithoutPrice(line: ProductLine | null | undefined): boolean {
  return line === "essencial" || line === "premium" || line === "lemon_caps";
}

interface PricePatch {
  readonly active?: boolean;
  readonly line?: ProductLine;
  readonly listPriceCents?: number | null;
}

// true = a gravação vai ser recusada pela trava. A linha e o preço que valem
// são os do patch; o que o patch não traz vem do registro já gravado.
export function violatesActiveRequiresPrice(
  patch: PricePatch,
  currentListPriceCents: number | null | undefined,
  currentLine: ProductLine | null | undefined = undefined,
): boolean {
  if (patch.active !== true) return false;
  if (lineAllowsActiveWithoutPrice(patch.line ?? currentLine)) return false;
  const effectivePrice = patch.listPriceCents !== undefined ? patch.listPriceCents : currentListPriceCents;
  return effectivePrice === null || effectivePrice === undefined;
}
