"use client";

import { Download } from "lucide-react";

import { downloadDossiePdf } from "@/lib/catalog/dossie-pdf";
import type { FormulaDetailDTO } from "@/lib/data/formulas";

interface DossiePdfButtonProps {
  formula: FormulaDetailDTO;
}

// Único pedaço interativo da página (o resto é Server Component): gerar o PDF
// só pode acontecer no navegador (jsPDF monta o arquivo em memória e dispara
// o download ali mesmo). `formula` chega como prop já serializável (strings,
// números, arrays) — nenhuma função nem classe atravessa a fronteira
// servidor/cliente.
export function DossiePdfButton({ formula }: DossiePdfButtonProps) {
  return (
    <button
      type="button"
      className="lc-btn lc-btn-primary lc-btn-icon-inline lc-dossie-pdf-btn"
      onClick={() => downloadDossiePdf(formula)}
    >
      <Download size={16} aria-hidden="true" />
      Baixar dossiê em PDF
    </button>
  );
}
