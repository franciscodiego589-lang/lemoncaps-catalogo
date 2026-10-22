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
  return {
    quantityText: String(item.quantityPotes),
    priceText: item.unitPriceCents === null ? "" : centsToPlain(item.unitPriceCents),
  };
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
    // Vazio vira 0 - pedido do dono (17/09/2026: nenhum campo trava o
    // salvar por estar incompleto, mesmo padrão de CostForm.tsx e
    // CostsBatchTable.tsx). Texto REALMENTE preenchido com algo que não é
    // número continua barrado aqui: aí não é "vazio", é formato inválido, e
    // isso a tela sempre recusou.
    const trimmedQuantity = draft.quantityText.trim();
    const quantity = trimmedQuantity === "" ? 0 : Number(trimmedQuantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantidade precisa ser um número inteiro (0 ou mais).");
      return;
    }
    const trimmedPrice = draft.priceText.trim();
    const priceCents = trimmedPrice === "" ? 0 : brlStringToCents(trimmedPrice);
    if (priceCents === null || priceCents < 0) {
      setError("Preço inválido.");
      return;
    }

    setError(null);
    setSaving(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de updateQuoteItem virava erro não tratado no cliente e o
    // botão ficava travado em "Salvando…".
    try {
      const result = await updateQuoteItem(item.id, { quantityPotes: quantity, unitPriceCents: priceCents });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success("Item do orçamento atualizado.");
      router.refresh();
    } catch (caught) {
      console.error("[QuoteItemRow] falha ao salvar item do orçamento:", caught);
      toast.error("Não foi possível salvar este item agora. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr>
      <td>{item.formulaNameSnapshot}</td>
      <td className="lc-admin-col-num">
        <input
          className={`lc-field-input${error ? " is-invalid" : ""}`}
          inputMode="numeric"
          value={draft.quantityText}
          placeholder="0"
          onChange={(event) => setDraft((prev) => ({ ...prev, quantityText: event.target.value }))}
          aria-label={`Quantidade de potes de ${item.formulaNameSnapshot} - em branco grava 0`}
        />
      </td>
      <td className="lc-admin-col-num">
        <input
          className={`lc-field-input${error ? " is-invalid" : ""}`}
          value={draft.priceText}
          placeholder={item.unitPriceCents === null ? "sob consulta" : "0,00"}
          onChange={(event) => setDraft((prev) => ({ ...prev, priceText: event.target.value }))}
          aria-label={`Preço por pote de ${item.formulaNameSnapshot} - em branco grava 0`}
        />
      </td>
      <td className="lc-admin-col-num">
        {item.lineTotalCents === null ? "Sob consulta" : centsToBRL(item.lineTotalCents)}
      </td>
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
