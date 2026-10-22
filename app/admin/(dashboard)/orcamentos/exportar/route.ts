import { getAdminQuotesForExport, requireQuoteManagerPage } from "@/lib/data/admin";
import { buildQuotesCsv } from "@/lib/export/quotes-csv";

// Route Handler NÃO herda a checagem de orcamentos/layout.tsx - layout só
// envolve page.tsx, nunca route.ts (mesma árvore de segmento, tipo de arquivo
// diferente). Por isso requireQuoteManagerPage() é chamado de novo aqui,
// direto - mesma permissão (can_manage_quotes) do resto da aba, já que o CSV
// carrega exatamente o mesmo dado sensível (nome, WhatsApp, lucro) da
// listagem. Usa a variante "page" (redireciona) e não a variante "action"
// (lança StaffAuthError): este endpoint é aberto por navegação comum
// (clique num link), não por fetch - um redirect para /admin/login é o
// comportamento certo quando a sessão expirou.
export async function GET(request: Request) {
  await requireQuoteManagerPage();

  const { searchParams } = new URL(request.url);
  // "rows", não "quotes": desde o enriquecimento de 2026-09-13 o retorno é uma
  // linha por ITEM de orçamento (repetindo os campos do orçamento em cada
  // linha), não mais uma linha por orçamento - ver AdminQuoteExportRowDTO.
  const rows = await getAdminQuotesForExport({
    busca: searchParams.get("busca") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    de: searchParams.get("de") ?? undefined,
    ate: searchParams.get("ate") ?? undefined,
  });

  const csv = buildQuotesCsv(rows);

  // Data de HOJE (geração do arquivo) no nome, não dado de negócio - só para
  // downloads repetidos no mesmo dia não se sobrescreverem/confundirem na
  // pasta de downloads do navegador.
  const geradoEm = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orcamentos-${geradoEm}.csv"`,
    },
  });
}
