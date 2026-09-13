// PDF do orçamento, gerado inteiro no navegador (jspdf + jspdf-autotable, ver
// package.json). Só usa dado que já está no retrato do orçamento
// (QuoteSuccessData): preço e nome de fórmula vêm do carrinho, que por sua vez
// veio do banco — nada aqui é estimado ou completado com valor plausível.
// Data no formato brasileiro via Intl.DateTimeFormat("pt-BR"), como pedido.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { centsToBRL } from "@/lib/money";
import type { QuoteSuccessData } from "./types";

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function downloadQuotePdf(data: QuoteSuccessData): void {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Lemon Caps", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Orçamento de cotação", 14, 26);
  doc.text(`Data: ${DATE_FORMATTER.format(new Date())}`, 14, 32);
  doc.text(`Identificação do pedido: ${data.quoteId}`, 14, 38);
  doc.text(`Cliente: ${data.customerName}`, 14, 44);
  doc.text(`WhatsApp: ${data.customerWhatsapp}`, 14, 50);

  autoTable(doc, {
    startY: 58,
    head: [["Fórmula", "Quantidade (potes)", "Preço / pote", "Subtotal"]],
    body: data.items.map((item) => [
      item.name,
      String(item.quantityPotes),
      centsToBRL(item.unitPriceCents),
      centsToBRL(item.unitPriceCents * item.quantityPotes),
    ]),
    foot: [["Total", String(data.totalPotes), "", centsToBRL(data.totalCents)]],
    headStyles: { fillColor: [166, 225, 0], textColor: [21, 36, 0] },
    footStyles: { fillColor: [241, 243, 245], textColor: [20, 22, 27], fontStyle: "bold" },
    styles: { fontSize: 10 },
  });

  doc.save(`orcamento-lemon-caps-${data.quoteId.slice(0, 8)}.pdf`);
}
