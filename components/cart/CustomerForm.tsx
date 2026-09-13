"use client";

import { useRef, useState } from "react";
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
      const { quoteId } = await submitQuote({ name: trimmedName, whatsapp: normalizedWhatsapp, items });
      onSuccess({
        quoteId,
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
          placeholder="Ex.: Maria Souza"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "cart-customer-name-error" : undefined}
        />
        {errors.name && (
          <p id="cart-customer-name-error" className="lc-field-error" role="alert">
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
          placeholder="Ex.: 65999990000"
          value={whatsapp}
          onChange={(event) => {
            setWhatsapp(event.target.value);
            if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
          }}
          aria-invalid={Boolean(errors.whatsapp)}
          aria-describedby={errors.whatsapp ? "cart-customer-whatsapp-error" : "cart-customer-whatsapp-hint"}
        />
        {errors.whatsapp ? (
          <p id="cart-customer-whatsapp-error" className="lc-field-error" role="alert">
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
