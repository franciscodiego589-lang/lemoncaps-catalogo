"use server";

// Busca as fichas técnicas completas (FormulaDetailDTO) dos itens já cotados,
// para o PDF do orçamento (lib/cart/quote-pdf.ts) poder trazer o mesmo nível
// de detalhe do dossiê técnico. Chamada a partir de um Client Component
// (components/cart/QuoteSuccess.tsx) no momento de baixar o PDF -
// QuoteSuccessData (o retrato do orçamento já gerado) só guarda o que o
// carrinho sabia na hora da cotação (nome, preço, quantidade); a ficha
// completa (composição, benefícios, advertências etc.) mora no banco e
// precisa desta busca à parte.
//
// Reaproveita getFormulaBySlug (lib/data/formulas.ts) - MESMA fonte de dados
// da página /catalogo/[slug] e do dossiê técnico em PDF, já cacheada 5 min -
// em vez de duplicar a consulta ao banco: os três canais nunca divergem entre
// si. As buscas rodam em paralelo (Promise.all): não há dependência entre
// elas, e getFormulaBySlug já reaproveita o mesmo getCatalogData() cacheado
// para todo slug, então isto nunca vira uma bateria de round-trips ao banco.
//
// Slug que não existe mais no banco (fórmula excluída ou renomeada depois da
// cotação) é OMITIDO do resultado, nunca preenchido com dado plausível - quem
// chama (QuoteSuccess.tsx) já trata a ausência: o PDF mostra aquele item só
// com os dados comerciais que o próprio carrinho guardou (regra de exatidão:
// nunca inventar ficha técnica para um produto que não foi possível conferir
// no banco).
import { getFormulaBySlug, type FormulaDetailDTO } from "@/lib/data/formulas";

export async function getFormulasForQuote(slugs: string[]): Promise<FormulaDetailDTO[]> {
  const uniqueSlugs = Array.from(new Set(slugs));
  const formulas = await Promise.all(uniqueSlugs.map((slug) => getFormulaBySlug(slug)));
  return formulas.filter((formula): formula is FormulaDetailDTO => formula !== null);
}
