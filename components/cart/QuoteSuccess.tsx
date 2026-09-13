"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleCheckBig, Copy, Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { downloadQuotePdf } from "@/lib/cart/quote-pdf";
import { buildQuoteOrderText, buildWhatsappMessage } from "@/lib/cart/quote-text";
import type { QuoteSuccessData } from "@/lib/cart/types";

// PENDENTE (dono do projeto): mesma variável de app/catalogo/error.tsx —
// NEXT_PUBLIC_WHATSAPP_NUMBER ainda não definida em .env.local. Sem ela,
// nenhum número é inventado aqui: o botão "Falar no WhatsApp" some e as outras
// duas ações (copiar pedido, baixar PDF) continuam disponíveis normalmente.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

interface QuoteSuccessProps {
  data: QuoteSuccessData;
}

// Tela final depois de fn_generate_quote responder (item 5 do pedido): é uma
// alternativa ao conteúdo normal do carrinho, com seu próprio <h1> — mesmo
// padrão de app/catalogo/error.tsx (estado alternativo da rota, título
// próprio, nunca dois <h1> ao mesmo tempo). Sólida (conteúdo, não cromo).
export function QuoteSuccess({ data }: QuoteSuccessProps) {
  const [isGeneratingPdf, setGeneratingPdf] = useState(false);

  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
        buildWhatsappMessage(data),
      )}`
    : null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildQuoteOrderText(data));
      toast.success("Pedido copiado. É só colar no WhatsApp.");
    } catch (error) {
      console.error("[QuoteSuccess] falha ao copiar pedido:", error);
      toast.error("Não foi possível copiar automaticamente. Selecione e copie manualmente.");
    }
  }

  function handleDownloadPdf() {
    setGeneratingPdf(true);
    try {
      downloadQuotePdf(data);
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
        <code className="lc-order-id">{data.quoteId}</code>

        <div className="lc-success-actions">
          <button type="button" className="lc-btn lc-btn-ghost lc-btn-icon-inline" onClick={handleCopy}>
            <Copy size={16} aria-hidden="true" />
            Copiar pedido
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
          {whatsappHref && (
            <a
              className="lc-btn lc-btn-ghost lc-btn-icon-inline"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Falar no WhatsApp
            </a>
          )}
        </div>

        <Link href="/catalogo" className="lc-btn lc-btn-primary">
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
