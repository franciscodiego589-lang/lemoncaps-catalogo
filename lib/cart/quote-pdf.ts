// PDF do orçamento, gerado inteiro no navegador (jspdf + jspdf-autotable, ver
// package.json - mesmo layout compartilhado de lib/pdf/ usado pelo dossiê
// técnico em lib/catalog/dossie-pdf.ts, para os dois documentos saírem com a
// mesma identidade visual). Só usa dado que já está no retrato do orçamento
// (QuoteSuccessData): preço e nome de fórmula vêm do carrinho, que por sua vez
// veio do banco - nada aqui é estimado ou completado com valor plausível.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { centsToBRL } from "@/lib/money";
import { MANUFACTURER_INFO } from "@/lib/catalog/regulatory-info";
import type { QuoteSuccessData } from "./types";
import {
  addFactRows,
  addHighlightBox,
  addParagraph,
  addSectionTitle,
  readFinalY,
  tableTheme,
} from "@/lib/pdf/layout";
import { drawCoverBlock, stampRunningHeaderAndFooter } from "@/lib/pdf/header-footer";
import { COLOR_MUTED, CONTENT_START_Y, FONT_SIZE_CAPTION, LONG_DATETIME_FORMATTER } from "@/lib/pdf/theme";

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

export function downloadQuotePdf(data: QuoteSuccessData): void {
  const doc = new jsPDF();
  const documentTitle = `Orçamento nº ${data.quoteNumber}`;

  // "Emitido em": instante real de geração deste PDF no navegador - o
  // retrato do orçamento (QuoteSuccessData) não carrega um timestamp de
  // criação gravado no banco, então a data de emissão do documento é o
  // próprio momento em que ele é baixado (mesma convenção já usada antes
  // desta tarefa para o campo "Data" do PDF).
  const issuedAt = new Date();
  const expiresAt = addCalendarDays(issuedAt, QUOTE_VALIDITY_DAYS);

  let cursorY = drawCoverBlock(doc, CONTENT_START_Y, {
    docTypeLabel: DOC_TYPE_LABEL,
    title: `Orçamento nº ${data.quoteNumber}`,
    subtitle: null,
    issuedAtLabel: LONG_DATETIME_FORMATTER.format(issuedAt),
  });

  // ---- 2. Dados do cliente ------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Dados do cliente");
  cursorY = addFactRows(doc, cursorY, [
    { label: "Cliente", value: data.customerName },
    { label: "WhatsApp", value: data.customerWhatsapp },
  ]);

  // ---- 3. Tabela de itens ---------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Itens do orçamento");
  autoTable(doc, {
    ...tableTheme(),
    startY: cursorY,
    head: [["Fórmula", "Quantidade (potes)", "Preço / pote", "Subtotal"]],
    body: data.items.map((item) => [
      item.name,
      String(item.quantityPotes),
      centsToBRL(item.unitPriceCents),
      centsToBRL(item.unitPriceCents * item.quantityPotes),
    ]),
    foot: [["Total", String(data.totalPotes), "", centsToBRL(data.totalCents)]],
    footStyles: { fillColor: [241, 243, 245], textColor: [20, 22, 27], fontStyle: "bold" },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right", cellWidth: 34 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 30 },
    },
  });
  cursorY = readFinalY(doc, cursorY) + 9;

  // ---- 4. Total geral, em destaque -------------------------------------------
  const potesLabel = data.totalPotes === 1 ? "pote" : "potes";
  cursorY = addSectionTitle(doc, cursorY, "Total geral");
  cursorY = addHighlightBox(doc, cursorY, {
    label: "Total geral do orçamento",
    value: centsToBRL(data.totalCents),
    meta: `${data.totalPotes} ${potesLabel}`,
  });

  // ---- 5. Validade da proposta ------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Validade da proposta");
  cursorY = addParagraph(
    doc,
    cursorY,
    `Esta proposta é válida por ${QUOTE_VALIDITY_DAYS} (dois) dias corridos a partir da emissão, expirando em ${LONG_DATETIME_FORMATTER.format(expiresAt)}.`,
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

  // ---- 7. Rodapé institucional completo ---------------------------------------
  // Mesmo bloco fixo do dossiê técnico (lib/catalog/dossie-pdf.ts), lido de
  // lib/catalog/regulatory-info.ts e nunca redigitado.
  cursorY = addSectionTitle(doc, cursorY, "Fabricante e responsabilidade técnica", COLOR_MUTED);
  addParagraph(
    doc,
    cursorY,
    `Fabricado e envasado por ${MANUFACTURER_INFO.companyName}, CNPJ ${MANUFACTURER_INFO.cnpj}.\n${MANUFACTURER_INFO.address}.\nFarmacêutico responsável: ${MANUFACTURER_INFO.pharmacist}.\n${MANUFACTURER_INFO.registrationExemption}\nSAC: ${MANUFACTURER_INFO.sac}`,
    { fontSize: FONT_SIZE_CAPTION, color: COLOR_MUTED },
  );

  stampRunningHeaderAndFooter(doc, { docType: DOC_TYPE_LABEL, documentTitle });

  // Nome do arquivo pelo número do orçamento, não por pedaço do uuid:
  // o cliente arquiva e procura por "orçamento 7", nunca por "69127f52".
  doc.save(`orcamento-lemon-caps-${data.quoteNumber}.pdf`);
}
