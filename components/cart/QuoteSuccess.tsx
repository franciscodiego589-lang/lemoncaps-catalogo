"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleCheckBig, Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { buildQuoteOrderText } from "@/lib/cart/quote-text";
import type { QuoteSuccessData } from "@/lib/cart/types";
import { getFormulasForQuote } from "@/lib/data/quote-details";
import type { FormulaDetailDTO } from "@/lib/data/formulas";

// DECISÃO DO DONO em 14/09/2026 — os botões de WhatsApp saíram do site inteiro,
// este incluído. Motivo dele: "o cliente já entra direto no catálogo depois de
// entrar em contato com o comercial" — quem chega a esta tela já tem o contato
// do comercial, então o botão repetia um canal que a pessoa já usa.
// Ficam as duas ações que entregam o orçamento na mão dela: copiar e baixar em
// PDF. O texto do toast continua citando o WhatsApp de propósito: é para lá que
// a pessoa vai colar o orçamento, pelo contato que ela já tem.

interface QuoteSuccessProps {
  data: QuoteSuccessData;
  /**
   * Chamado quando o cliente sai daqui de propósito, pelo "Voltar ao
   * catálogo". Serve para o CartView apagar do navegador o retrato do
   * orçamento (que carrega nome e WhatsApp) assim que ele deixa de ser útil —
   * ver lib/cart/quote-snapshot.ts.
   */
  onLeave?: () => void;
}

// Tela final depois de fn_generate_quote responder (item 5 do pedido): é uma
// alternativa ao conteúdo normal do carrinho, com seu próprio <h1> — mesmo
// padrão de app/catalogo/error.tsx (estado alternativo da rota, título
// próprio, nunca dois <h1> ao mesmo tempo). Sólida (conteúdo, não cromo).
export function QuoteSuccess({ data, onLeave }: QuoteSuccessProps) {
  const [isGeneratingPdf, setGeneratingPdf] = useState(false);


  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildQuoteOrderText(data));
      // "Orçamento", não "pedido": o botão que dispara esta ação diz "Copiar
      // orçamento" desde a padronização de vocabulário de 13/09/2026, e ver
      // "Pedido copiado" logo depois de clicar em "Copiar orçamento" faz o
      // usuário duvidar se copiou a coisa certa. Além disso, "pedido" tem
      // outro significado no catálogo — o pedido mínimo de potes por fórmula.
      toast.success("Orçamento copiado. É só colar no WhatsApp.");
    } catch (error) {
      console.error("[QuoteSuccess] falha ao copiar o orçamento:", error);
      toast.error("Não foi possível copiar automaticamente. Selecione e copie manualmente.");
    }
  }

  async function handleDownloadPdf() {
    setGeneratingPdf(true);
    try {
      // Busca as fichas técnicas completas (Server Action) para o PDF sair
      // com o mesmo nível de detalhe do dossiê - mas a falha desta busca
      // NUNCA impede o orçamento de sair: melhor um PDF só com os dados
      // comerciais do que orçamento nenhum (regra do dono para esta tarefa).
      let formulas: FormulaDetailDTO[] = [];
      try {
        formulas = await getFormulasForQuote(data.items.map((item) => item.slug));
      } catch (error) {
        console.error("[QuoteSuccess] falha ao buscar fichas técnicas para o PDF:", error);
        toast.error("Não foi possível carregar o dossiê técnico completo; o PDF sairá só com os dados comerciais.");
      }
      // Mesmo motivo do dossiê: a biblioteca de PDF só desce quando alguém pede
      // o arquivo. Antes, ela vinha junto de /carrinho em toda visita.
      const { downloadQuotePdf } = await import("@/lib/cart/quote-pdf");
      await downloadQuotePdf(data, formulas);
    } catch (error) {
      console.error("[QuoteSuccess] falha ao gerar PDF:", error);
      toast.error("Não foi possível gerar o PDF agora.");
    } finally {
      setGeneratingPdf(false);
    }
  }

  return (
    <div className="lc-container">
      <div className="lc-success-panel">
        <CircleCheckBig size={44} className="lc-success-icon" aria-hidden="true" />
        <h1>Orçamento gerado com sucesso</h1>
        <p>Guarde a identificação abaixo para acompanhar seu pedido.</p>
        <code className="lc-order-id">nº {data.quoteNumber}</code>

        <div className="lc-success-actions">
          <button type="button" className="lc-btn lc-btn-ghost lc-btn-icon-inline" onClick={handleCopy}>
            <Copy size={16} aria-hidden="true" />
            Copiar orçamento
          </button>
          <button
            type="button"
            className="lc-btn lc-btn-ghost lc-btn-icon-inline"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            <Download size={16} aria-hidden="true" />
            {isGeneratingPdf ? "Gerando…" : "Baixar PDF"}
          </button>
        </div>

        <Link href="/catalogo" className="lc-btn lc-btn-primary" onClick={onLeave}>
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
