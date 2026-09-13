"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateQuoteItem } from "@/lib/actions/quotes";
import type { AdminQuoteItemDTO } from "@/lib/data/admin";
import { brlStringToCents, centsToBRL, centsToPlain } from "@/lib/money";

interface QuoteItemRowProps {
  item: AdminQuoteItemDTO;
}

interface Draft {
  quantityText: string;
  priceText: string;
}

function toDraft(item: AdminQuoteItemDTO): Draft {
  return { quantityText: String(item.quantityPotes), priceText: centsToPlain(item.unitPriceCents) };
}

// Margem/lucro (item.profitCents, item.profitMarginPct) vêm de colunas
// GERADAS pelo Postgres (public.quote_items, ver schema.sql) - este
// componente NUNCA as recalcula; depois de salvar, chama router.refresh()
// para buscar o valor recalculado pelo banco.
export function QuoteItemRow({ item }: QuoteItemRowProps) {
  const router = useRouter();

  // Resincroniza o rascunho quando o item vindo do servidor muda de verdade
  // (após router.refresh() trazer quantidade/preço recalculados) - ajuste de
  // estado DURANTE a renderização (padrão recomendado pelo React para
  // "adjusting state when a prop changes"), nunca dentro de um useEffect com
  // setState síncrono, que dispara uma renderização em cascata evitável.
  const [lastSyncedKey, setLastSyncedKey] = useState(`${item.quantityPotes}:${item.unitPriceCents}`);
  const [draft, setDraft] = useState<Draft>(() => toDraft(item));
  const [saved, setSaved] = useState<Draft>(() => toDraft(item));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);

  const currentKey = `${item.quantityPotes}:${item.unitPriceCents}`;
  if (currentKey !== lastSyncedKey) {
    setLastSyncedKey(currentKey);
    setDraft(toDraft(item));
    setSaved(toDraft(item));
  }

  const isDirty = draft.quantityText !== saved.quantityText || draft.priceText !== saved.priceText;

  async function handleSave() {
    const quantity = Number(draft.quantityText);
    const priceCents = brlStringToCents(draft.priceText);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("Quantidade precisa ser um número inteiro maior que zero.");
      return;
    }
    if (priceCents === null || priceCents < 0) {
      setError("Preço inválido.");
      return;
    }

    setError(null);
    setSaving(true);
    const result = await updateQuoteItem(item.id, { quantityPotes: quantity, unitPriceCents: priceCents });
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success("Item do orçamento atualizado.");
    router.refresh();
  }

  return (
    <tr>
      <td>{item.formulaNameSnapshot}</td>
      <td className="lc-admin-col-num">
        <input
          className={`lc-field-input${error ? " is-invalid" : ""}`}
          inputMode="numeric"
          value={draft.quantityText}
          onChange={(event) => setDraft((prev) => ({ ...prev, quantityText: event.target.value }))}
          aria-label={`Quantidade de potes de ${item.formulaNameSnapshot}`}
        />
      </td>
      <td className="lc-admin-col-num">
        <input
          className={`lc-field-input${error ? " is-invalid" : ""}`}
          value={draft.priceText}
          onChange={(event) => setDraft((prev) => ({ ...prev, priceText: event.target.value }))}
          aria-label={`Preço por pote de ${item.formulaNameSnapshot}`}
        />
      </td>
      <td className="lc-admin-col-num">{centsToBRL(item.lineTotalCents)}</td>
      <td className="lc-admin-col-num">
        {item.profitMarginPct !== null ? (
          <span className={item.profitMarginPct >= 0 ? "lc-admin-margin-positive" : "lc-admin-margin-negative"}>
            {item.profitMarginPct.toFixed(1).replace(".", ",")}%
          </span>
        ) : (
          <span className="lc-admin-margin-unknown">desconhecida</span>
        )}
      </td>
      <td className="lc-admin-col-actions">
        <button type="button" className="lc-btn lc-btn-ghost" disabled={!isDirty || isSaving} onClick={handleSave} aria-busy={isSaving}>
          {isSaving ? "Salvando…" : "Salvar"}
        </button>
        {error ? (
          <p className="lc-field-error" role="alert">
            {error}
          </p>
        ) : null}
      </td>
    </tr>
  );
}
