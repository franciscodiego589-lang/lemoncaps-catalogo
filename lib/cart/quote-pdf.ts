// PDF do orçamento, gerado inteiro no navegador (jspdf + jspdf-autotable, ver
// package.json - mesmo layout compartilhado de lib/pdf/ usado pelo dossiê
// técnico em lib/catalog/dossie-pdf.ts, para os dois documentos saírem com a
// mesma identidade visual). A proposta comercial (Parte 1) só usa dado que já
// está no retrato do orçamento (QuoteSuccessData): preço e nome de fórmula
// vêm do carrinho, que por sua vez veio do banco - nada aqui é estimado ou
// completado com valor plausível.
//
// A partir desta tarefa o documento ganhou uma Parte 2: uma ficha técnica
// completa por produto cotado, montada com as MESMAS funções de
// lib/pdf/formula-sections.ts que o dossiê técnico usa (lib/catalog/dossie-pdf.ts)
// - Identificação, Composição, Benefícios etc. saem idênticos nos dois
// documentos, sem duplicar lógica. A ficha depende de `formulas`, buscada à
// parte por lib/data/quote-details.ts (getFormulasForQuote) - QuoteSuccessData
// não carrega isso sozinho. Um item sem ficha carregada (busca falhou, ou o
// slug não existe mais no banco) simplesmente NÃO GANHA página técnica: ele
// já apareceu na tabela comercial da Parte 1 com os dados que o carrinho tem,
// e é isso que sai no PDF - nunca uma ficha técnica inventada.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { centsToBRL } from "@/lib/money";
import { lineLabel } from "@/lib/catalog/format-catalog";
import type { FormulaDetailDTO } from "@/lib/data/formulas";
import {
  addBenefitsSection,
  addComplianceSection,
  addCompositionSection,
  addIdentitySection,
  addIngredientsSection,
  addManufacturerSection,
  addNutritionalSection,
  addPackagingSection,
  addRegulatoryFrameworkSection,
  addSheetApprovalSection,
  addStorageSection,
  addTargetAudienceSection,
  addUsageSection,
  addWarningsSection,
} from "@/lib/pdf/formula-sections";
import type { QuoteSuccessData } from "./types";
import { addFactRows, addHighlightBox, addParagraph, addSectionTitle, readFinalY, tableTheme } from "@/lib/pdf/layout";
import { drawCoverBlock, stampRunningHeaderAndFooter } from "@/lib/pdf/header-footer";
import { CONTENT_START_Y, LONG_DATETIME_FORMATTER } from "@/lib/pdf/theme";

const DOC_TYPE_LABEL = "Orçamento de cotação";

// ÚNICO LUGAR A MUDAR a validade da proposta (dias corridos a partir da
// emissão) - pedido do dono: 2 (dois) dias corridos. Não mexer em mais nada
// além deste número para alterar o prazo.
const QUOTE_VALIDITY_DAYS = 2;

function addCalendarDays(base: Date, days: number): Date {
  const result = new Date(base.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

// `formulas` é a lista de fichas técnicas já carregadas (getFormulasForQuote,
// lib/data/quote-details.ts) para os slugs presentes em data.items - só os
// slugs que ainda existem no banco vêm aqui (ver comentário daquela função).
// Indexado por slug (não por formulaId): é o campo que os dois lados têm em
// comum (CartItem.slug e FormulaDetailDTO.slug).
export function downloadQuotePdf(data: QuoteSuccessData, formulas: readonly FormulaDetailDTO[]): void {
  const doc = new jsPDF();
  const documentTitle = `Orçamento nº ${data.quoteNumber}`;
  const formulaBySlug = new Map(formulas.map((formula) => [formula.slug, formula] as const));

  // "Emitido em": instante real de geração deste PDF no navegador - o
  // retrato do orçamento (QuoteSuccessData) não carrega um timestamp de
  // criação gravado no banco, então a data de emissão do documento é o
  // próprio momento em que ele é baixado (mesma convenção já usada antes
  // desta tarefa para o campo "Data" do PDF). Reaproveitado tal e qual em
  // cada ficha técnica da Parte 2 que precisar dele - nunca um "new Date()"
  // novo por página, o documento inteiro tem UM só instante de emissão.
  const issuedAt = new Date();
  const expiresAt = addCalendarDays(issuedAt, QUOTE_VALIDITY_DAYS);

  // ===========================================================================
  // PARTE 1 - Proposta comercial
  // ===========================================================================
  let cursorY = drawCoverBlock(doc, CONTENT_START_Y, {
    docTypeLabel: DOC_TYPE_LABEL,
    title: documentTitle,
    subtitle: null,
    issuedAtLabel: LONG_DATETIME_FORMATTER.format(issuedAt),
  });

  // ---- 2. Dados do cliente ------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Dados do cliente");
  cursorY = addFactRows(doc, cursorY, [
    { label: "Cliente", value: data.customerName },
    { label: "WhatsApp", value: data.customerWhatsapp },
  ]);

  // ---- 3. Itens do orçamento ------------------------------------------------
  // Apresentação vem da ficha técnica (poteContentsDescription, com netWeight
  // como alternativa) - quando o item não tem ficha carregada (busca falhou
  // ou slug some do banco depois de cotado), a célula fica em branco, NUNCA
  // "não informado" (regra de exatidão do projeto).
  cursorY = addSectionTitle(doc, cursorY, "Itens do orçamento");
  autoTable(doc, {
    ...tableTheme(),
    startY: cursorY,
    head: [["Fórmula", "Apresentação", "Quantidade (potes)", "Preço / pote", "Subtotal"]],
    body: data.items.map((item) => {
      const formula = formulaBySlug.get(item.slug);
      const presentation = formula ? (formula.poteContentsDescription ?? formula.netWeight ?? "") : "";
      return [
        item.name,
        presentation,
        String(item.quantityPotes),
        item.unitPriceCents === null ? "Sob consulta" : centsToBRL(item.unitPriceCents),
        item.unitPriceCents === null ? "Sob consulta" : centsToBRL(item.unitPriceCents * item.quantityPotes),
      ];
    }),
    foot: [["Total", "", String(data.totalPotes), "", centsToBRL(data.totalCents)]],
    footStyles: { fillColor: [241, 243, 245], textColor: [20, 22, 27], fontStyle: "bold" },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "left" },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 28 },
      4: { halign: "right", cellWidth: 28 },
    },
  });
  cursorY = readFinalY(doc, cursorY) + 9;

  // ---- 4. Total geral, em destaque -------------------------------------------
  const potesLabel = data.totalPotes === 1 ? "pote" : "potes";
  cursorY = addSectionTitle(doc, cursorY, "Total geral");
  cursorY = addHighlightBox(doc, cursorY, {
    label: "Total geral do orçamento",
    value: data.items.every((item) => item.unitPriceCents === null) ? "Sob consulta" : centsToBRL(data.totalCents),
    meta: data.items.some((item) => item.unitPriceCents === null)
      ? `${data.totalPotes} ${potesLabel} · + itens com preço sob consulta, fora deste total`
      : `${data.totalPotes} ${potesLabel}`,
  });

  // ---- 5. Validade da proposta ------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Validade do orçamento");
  cursorY = addParagraph(
    doc,
    cursorY,
    `Este orçamento é válido por ${QUOTE_VALIDITY_DAYS} (dois) dias corridos a partir da emissão, expirando em ${LONG_DATETIME_FORMATTER.format(expiresAt)}.`,
  );

  // ---- 6. Condições -------------------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Condições");
  // Mínimo por fórmula vem do próprio item do carrinho (nunca um número fixo
  // "achado" aqui) - quando todos os itens compartilham o mesmo mínimo, uma
  // frase só; se algum dia divergirem entre fórmulas, lista um a um.
  const distinctMinimums = Array.from(new Set(data.items.map((item) => item.minimumOrderPotes)));
  const minimumOrderLine =
    distinctMinimums.length <= 1
      ? `Pedido mínimo: ${distinctMinimums[0] ?? 0} potes por fórmula.`
      : `Pedido mínimo por fórmula: ${data.items.map((item) => `${item.name} - ${item.minimumOrderPotes} potes`).join("; ")}.`;
  cursorY = addParagraph(doc, cursorY, minimumOrderLine);
  cursorY = addParagraph(doc, cursorY, "Preços sujeitos a confirmação.");
  // PENDENTE (dono do projeto): prazo de produção, forma de pagamento, frete,
  // desconto e política de devolução não estão definidos em lugar nenhum do
  // projeto hoje - por isso não entram aqui (regra de exatidão: nunca
  // inventar condição comercial que ninguém confirmou). Assim que existir
  // fonte real para algum desses blocos, ele entra como mais uma linha desta
  // seção "Condições".

  // ===========================================================================
  // PARTE 2 - Uma ficha técnica por produto cotado
  // ===========================================================================
  // Cada item com ficha carregada abre em página nova - o documento pode ter
  // vários produtos, e misturar a ficha de um com o começo da de outro na
  // mesma página ficaria confuso. Ordem das seções idêntica ao dossiê técnico
  // (menos "Condições comerciais": aqui quem liga a fórmula ao preço é a
  // linha "Cotado neste orçamento" logo abaixo do título, não o preço de
  // tabela da fórmula) e os dois blocos institucionais do fim (Marco
  // regulatório, Fabricante) NÃO se repetem aqui - só uma vez, na Parte 3.
  for (const item of data.items) {
    const formula = formulaBySlug.get(item.slug);
    if (!formula) continue;

    doc.addPage();
    cursorY = CONTENT_START_Y;

    const productTitle = formula.technicalSheetTitle ?? formula.name;
    // Separador "·" - mesmo padrão da página web do dossiê (app/catalogo/[slug]/page.tsx
    // e componentes irmãos), não o "-" usado internamente pelo PDF do dossiê:
    // os dois já divergiam entre si antes desta tarefa (achado ao ler o
    // código-fonte, não suposição) - aqui a ficha segue o padrão mais atual,
    // o da página web.
    const productSubtitle = formula.segment ? `${formula.segment.name} · ${lineLabel(formula.line)}` : lineLabel(formula.line);
    cursorY = drawCoverBlock(doc, cursorY, {
      docTypeLabel: "Dossiê técnico",
      title: productTitle,
      subtitle: productSubtitle,
    });

    // Vínculo entre esta ficha e a proposta: o que foi cotado DESTE item,
    // nesta cotação - nunca o preço de tabela da fórmula (esse é o que
    // aparece em "Condições comerciais" no dossiê, seção que não existe
    // aqui de propósito).
    cursorY = addParagraph(
      doc,
      cursorY,
      item.unitPriceCents === null
        ? `Cotado neste orçamento: ${item.quantityPotes} potes, preço sob consulta.`
        : `Cotado neste orçamento: ${item.quantityPotes} potes × ${centsToBRL(item.unitPriceCents)} = ${centsToBRL(item.unitPriceCents * item.quantityPotes)}.`,
      { bold: true },
    );

    cursorY = addIdentitySection(doc, cursorY, formula);
    cursorY = addCompositionSection(doc, cursorY, formula);
    cursorY = addNutritionalSection(doc, cursorY, formula);
    cursorY = addIngredientsSection(doc, cursorY, formula);
    cursorY = addUsageSection(doc, cursorY, formula);
    cursorY = addBenefitsSection(doc, cursorY, formula);
    cursorY = addTargetAudienceSection(doc, cursorY, formula);
    cursorY = addWarningsSection(doc, cursorY, formula);
    cursorY = addStorageSection(doc, cursorY, formula);
    // Embalagem e logística importam ainda mais aqui do que no dossiê avulso: é
    // este documento que o comprador leva para calcular frete e fechar o pedido.
    cursorY = addPackagingSection(doc, cursorY, formula);
    cursorY = addComplianceSection(doc, cursorY, formula);
    cursorY = addSheetApprovalSection(doc, cursorY, formula);
  }

  // ===========================================================================
  // PARTE 3 - Blocos institucionais, uma vez só (nunca por item - ver Parte 2)
  // ===========================================================================
  cursorY = addRegulatoryFrameworkSection(doc, cursorY);
  addManufacturerSection(doc, cursorY);

  stampRunningHeaderAndFooter(doc, { docType: DOC_TYPE_LABEL, documentTitle });

  // Nome do arquivo pelo número do orçamento, não por pedaço do uuid:
  // o cliente arquiva e procura por "orçamento 7", nunca por "69127f52".
  doc.save(`orcamento-lemon-caps-${data.quoteNumber}.pdf`);
}
