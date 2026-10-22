"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { getFriendlyQuoteErrorMessage, submitQuote } from "@/lib/cart/submit-quote";
import type { QuoteSuccessData } from "@/lib/cart/types";
import { isValidCustomerName, isValidWhatsapp, normalizeWhatsapp } from "@/lib/cart/validation";
import type { CartItem } from "@/lib/store/cart";

interface CustomerFormProps {
  items: readonly CartItem[];
  totalPotes: number;
  totalCents: number;
  onSuccess: (data: QuoteSuccessData) => void;
}

interface FormErrors {
  name?: string;
  whatsapp?: string;
}

// Identificação do cliente (item 4 do pedido): rótulo sempre visível (nunca só
// placeholder), inputMode/autoComplete corretos por campo, validação inline
// com foco no primeiro erro e mensagem que diz como corrigir. O botão só fica
// desabilitado depois que a requisição já começou (nunca antes, por validade
// do formulário) — clicar inválido dispara a validação, nunca fica mudo.
export function CustomerForm({ items, totalPotes, totalCents, onSuccess }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setSubmitting] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const whatsappInputRef = useRef<HTMLInputElement>(null);

  // Aviso de saída com dado digitado e não enviado (achado da auditoria de
  // 13/09/2026): nome e WhatsApp só existem no estado deste componente, então
  // um "voltar" do navegador, um fechamento acidental da aba ou um F5 apagavam
  // tudo em silêncio, e o cliente tinha de digitar de novo.
  //
  // As DUAS condições abaixo são o ponto do achado — um aviso que dispara
  // sempre é pior que aviso nenhum (o visitante aprende a clicar "sair" sem
  // ler, e o navegador passa a ignorar o site):
  //   - só com algo digitado: formulário em branco não tem o que perder;
  //   - só antes do envio começar: depois que a requisição partiu, o orçamento
  //     já está sendo gravado no banco e travar a saída não protege nada. É
  //     também o que deixa o F5 na tela de sucesso passar limpo, sem diálogo.
  const hasUnsavedInput = name.trim() !== "" || whatsapp.trim() !== "";
  const shouldWarnBeforeLeaving = hasUnsavedInput && !isSubmitting;

  useEffect(() => {
    if (!shouldWarnBeforeLeaving) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      // preventDefault() é a forma atual de pedir a confirmação; o texto é
      // sempre do navegador, nunca nosso. `returnValue = ""` fica junto só
      // para os navegadores antigos que ainda exigem a propriedade.
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldWarnBeforeLeaving]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const normalizedWhatsapp = normalizeWhatsapp(whatsapp);

    const nextErrors: FormErrors = {};
    if (!isValidCustomerName(trimmedName)) {
      nextErrors.name = "Informe seu nome completo.";
    }
    if (!isValidWhatsapp(normalizedWhatsapp)) {
      nextErrors.whatsapp = "Informe um WhatsApp válido com DDD, somente números (10 a 15 dígitos).";
    }

    if (nextErrors.name || nextErrors.whatsapp) {
      setErrors(nextErrors);
      if (nextErrors.name) nameInputRef.current?.focus();
      else whatsappInputRef.current?.focus();
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const { quoteId, quoteNumber } = await submitQuote({ name: trimmedName, whatsapp: normalizedWhatsapp, items });
      onSuccess({
        quoteId,
        quoteNumber,
        customerName: trimmedName,
        customerWhatsapp: normalizedWhatsapp,
        items,
        totalPotes,
        totalCents,
      });
    } catch (error) {
      console.error("[CustomerForm] falha ao gerar orçamento:", error);
      toast.error(getFriendlyQuoteErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="lc-checkout-form" onSubmit={handleSubmit} noValidate>
      <div className="lc-field">
        <label className="lc-field-label" htmlFor="cart-customer-name">
          Nome completo
        </label>
        <input
          ref={nameInputRef}
          id="cart-customer-name"
          name="name"
          type="text"
          className={`lc-field-input${errors.name ? " is-invalid" : ""}`}
          autoComplete="name"
          placeholder="Ex.: Maria Souza…"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "cart-customer-name-error" : undefined}
        />
        {/* `aria-live="polite"`, nunca `role="alert"` (achado da auditoria de
            13/09/2026): role="alert" equivale a aria-live="assertive" e corta
            no meio o que o leitor de tela estiver falando — desproporcional
            para uma mensagem de validação de campo. E o anúncio não depende
            disso: ao validar, o foco vai para o primeiro campo inválido (ver
            handleSubmit), e o campo tem aria-invalid + aria-describedby
            apontando para esta mensagem, então o leitor a lê ao chegar ali. */}
        {errors.name && (
          <p id="cart-customer-name-error" className="lc-field-error" aria-live="polite">
            {errors.name}
          </p>
        )}
      </div>

      <div className="lc-field">
        <label className="lc-field-label" htmlFor="cart-customer-whatsapp">
          WhatsApp (com DDD)
        </label>
        <input
          ref={whatsappInputRef}
          id="cart-customer-whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          className={`lc-field-input${errors.whatsapp ? " is-invalid" : ""}`}
          autoComplete="tel"
          placeholder="Ex.: 65999990000…"
          value={whatsapp}
          onChange={(event) => {
            setWhatsapp(event.target.value);
            if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
          }}
          aria-invalid={Boolean(errors.whatsapp)}
          aria-describedby={errors.whatsapp ? "cart-customer-whatsapp-error" : "cart-customer-whatsapp-hint"}
        />
        {/* Mesmo motivo do campo acima: validação de campo se anuncia com
            educação (polite) + foco, nunca interrompendo o leitor de tela. */}
        {errors.whatsapp ? (
          <p id="cart-customer-whatsapp-error" className="lc-field-error" aria-live="polite">
            {errors.whatsapp}
          </p>
        ) : (
          <p id="cart-customer-whatsapp-hint" className="lc-field-hint">
            Só números, com DDD. Vamos usar para confirmar o orçamento.
          </p>
        )}
      </div>

      <button type="submit" className="lc-btn lc-btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Gerando…" : "Gerar orçamento"}
      </button>
    </form>
  );
}
