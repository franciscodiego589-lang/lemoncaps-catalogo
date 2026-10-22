// Números da página de apresentação da fábrica, que é a raiz do site desde
// 13/09/2026 (app/page.tsx; até então estes números viviam em /fabricacao) —
// todos derivados do que getCatalogData()
// devolveu na MESMA requisição, nunca digitados à mão. Função pura, testável,
// separada do componente que exibe (AGENTS.md, "Convenções de código"). Mesma
// disciplina de components/home/catalog-stats.ts, que faz o equivalente para a
// landing.
//
// REGRA DE EXATIDÃO — três armadilhas encontradas ao conferir o banco em
// 13/09/2026 (projeto yyiykuffhuxaqiysgekv) e resolvidas aqui:
//
// 1. A tabela `formulas` tem 28 linhas, mas só 27 estão ativas e não
//    excluídas. Quem chama esta função recebe apenas as ativas (getCatalogData
//    já filtra `active = true and deleted_at is null`), então `totalFormulas`
//    é 27 — nunca 28.
//
// 2. SOFTGEL NÃO É UM FORMATO. O enum product_format tem exatamente quatro
//    valores: capsula, soluvel, gummy, liquido. A única fórmula em softgel
//    ("Ômega Pró TG") está gravada como `format = capsula`, com
//    pote_contents_description = "60 Softgels". Tratá-la como um quinto formato
//    somaria 14+6+4+3+1 = 28 e contaria essa fórmula duas vezes, dizendo ao
//    visitante um total que não existe. Aqui o softgel aparece pelo que é: uma
//    APRESENTAÇÃO dentro do formato cápsula.
//
// 3. As apresentações saem do banco com a grafia do próprio cadastro
//    ("150 Gramas", "30 ml", "420 gramas (30 doses de 14 g)"). Não são
//    normalizadas nem reescritas: o que a fábrica tem em linha é exatamente
//    isso, e padronizar maiúscula/minúscula aqui seria editar dado de produto
//    numa página comercial. Só o que é nulo fica de fora (uma fórmula líquida
//    ainda não tem apresentação cadastrada) — sem inventar valor no lugar.
import type { FormulaDTO, ProductFormat, SegmentDTO } from "@/lib/data/formulas";

// Rótulo de formato na voz de quem compra fabricação — não é o mesmo público do
// admin (components/admin/enum-labels.ts diz "Solúvel" e "Gummy", que é o valor
// cru do enum traduzido). Aqui "Pó solúvel" e "Goma" descrevem o que sai da
// linha de produção, e cada um é fiel ao dado: as 6 fórmulas `soluvel` estão
// todas cadastradas em gramas (150 g, 300 g, 420 g), e as 4 `gummy` em
// "60 Gomas". Conferido no banco em 13/09/2026.
const FORMAT_LABELS: Record<ProductFormat, string> = {
  capsula: "Cápsula",
  soluvel: "Pó solúvel",
  gummy: "Goma",
  liquido: "Líquido",
};

// Ordem fixa de leitura (a mesma das chaves acima), não a ordem em que os
// formatos aparecem nas fórmulas — assim a página não reordena a cada build só
// porque o sort_order mudou no banco.
const FORMAT_ORDER = Object.keys(FORMAT_LABELS) as ProductFormat[];

export interface FormatCapability {
  format: ProductFormat;
  label: string;
  /** Quantas fórmulas ativas do catálogo saem neste formato. */
  formulaCount: number;
  /** Apresentações realmente cadastradas neste formato, na grafia do banco. */
  presentations: string[];
}

export interface ManufacturingStats {
  totalFormulas: number;
  formats: FormatCapability[];
  /** Nomes dos segmentos com pelo menos uma fórmula ativa, na ordem do catálogo. */
  segmentNames: string[];
  /**
   * Menor e maior preço de tabela por pote entre as fórmulas ativas que TÊM
   * preço publicado. Herdado de components/home/catalog-stats.ts, que calculava
   * o mesmo para a landing antiga: quando as duas páginas viraram uma só
   * (13/09/2026), a faixa de preço foi o único número exclusivo da landing que
   * valia a pena salvar — é a segunda pergunta de quem procura fabricante,
   * depois do lote mínimo.
   *
   * Fórmula sem preço cadastrado fica de fora do cálculo em vez de virar zero:
   * um "R$ 0,00" na ponta de baixo da faixa seria um preço que a fábrica não
   * pratica. Nenhuma com preço => null nos dois, e quem exibe omite a frase.
   */
  priceMinCents: number | null;
  priceMaxCents: number | null;
  /**
   * Pedido mínimo por fórmula, em potes. Só é preenchido quando TODAS as
   * fórmulas ativas praticam o mesmo mínimo — a página afirma "100 potes por
   * fórmula" como regra da casa, e essa frase só é verdadeira se não houver
   * exceção. Havendo divergência, vem null e a seção não é exibida.
   */
  uniformMinimumOrderPotes: number | null;
}

export function computeManufacturingStats(
  allFormulas: readonly FormulaDTO[],
  segments: readonly SegmentDTO[],
): ManufacturingStats {
  // 4. Só conta fórmula COM PREÇO. Desde 23/09/2026 a linha Essencial pode
  //    ficar no ar sem preço ("Preço sob consulta", migration
  //    20260923050000_essencial_sem_preco.sql), e várias delas ainda dependem
  //    de insumo a comprar e de tabela nutricional. A página afirma "fórmulas
  //    prontas, já em produção, prontas para sair com a sua marca" — frase que
  //    só vale para o que já tem preço e pode ser cotado. Quando a fórmula
  //    ganha preço, entra na conta sozinha.
  const formulas = allFormulas.filter((formula) => formula.listPriceCents != null);

  const formats = FORMAT_ORDER.map((format): FormatCapability => {
    const ofFormat = formulas.filter((formula) => formula.format === format);
    // Set preserva a ordem de inserção, e as fórmulas já chegam ordenadas por
    // sort_order — então a lista de apresentações sai estável entre builds.
    const presentations = [
      ...new Set(
        ofFormat
          .map((formula) => formula.poteContentsDescription)
          .filter((description): description is string => description != null),
      ),
    ];
    return { format, label: FORMAT_LABELS[format], formulaCount: ofFormat.length, presentations };
  }).filter((capability) => capability.formulaCount > 0);

  const segmentIdsInUse = new Set(formulas.map((formula) => formula.segmentId));
  const segmentNames = segments.filter((segment) => segmentIdsInUse.has(segment.id)).map((segment) => segment.name);

  const minimums = new Set(formulas.map((formula) => formula.minimumOrderPotes));
  const uniformMinimumOrderPotes = minimums.size === 1 ? [...minimums][0] : null;

  const prices = formulas
    .map((formula) => formula.listPriceCents)
    .filter((cents): cents is number => cents != null);

  return {
    totalFormulas: formulas.length,
    formats,
    segmentNames,
    priceMinCents: prices.length > 0 ? Math.min(...prices) : null,
    priceMaxCents: prices.length > 0 ? Math.max(...prices) : null,
    uniformMinimumOrderPotes,
  };
}
