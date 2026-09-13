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
  const quotes = await getAdminQuotesForExport({
    busca: searchParams.get("busca") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    de: searchParams.get("de") ?? undefined,
    ate: searchParams.get("ate") ?? undefined,
  });

  const csv = buildQuotesCsv(quotes);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orcamentos.csv"`,
    },
  });
}
