"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

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
      onClick={async () => {
        // Import dinâmico de propósito: o jsPDF e o jspdf-autotable pesam 216,7 KB
        // comprimidos e só servem a este clique. Com import estático no topo, esse
        // peso descia em TODA visita ao catálogo, clicasse alguém ou não.
        try {
          const { downloadDossiePdf } = await import("@/lib/catalog/dossie-pdf");
          await downloadDossiePdf(formula);
        } catch (erro) {
          // Sem isto o clique morria calado: nem arquivo, nem mensagem. Mesmo
          // tratamento de components/cart/QuoteSuccess.tsx.
          console.error("[DossiePdfButton] falha ao gerar o dossiê:", erro);
          toast.error("Não foi possível gerar o PDF agora.");
        }
      }}
    >
      <Download size={16} aria-hidden="true" />
      Baixar dossiê em PDF
    </button>
  );
}
