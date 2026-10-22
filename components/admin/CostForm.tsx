"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { TextAreaField, TextField } from "@/components/admin/FormFields";
import { updateFormulaCost } from "@/lib/actions/costs";
import { brlStringToCents, centsToPlain } from "@/lib/money";

interface CostFormProps {
  formulaId: string;
  initialUnitCostCents: number | null;
  initialInternalNotes: string | null;
}

// Custo real de produção - public.formula_costs, tabela 100% privada (RLS
// nunca dá SELECT ao público, ver supabase/migrations/20260909210001_rls_policies.sql,
// seção 4). O banner acima deste formulário (na page) já deixa isso visível;
// aqui só o formulário em si.
export function CostForm({ formulaId, initialUnitCostCents, initialInternalNotes }: CostFormProps) {
  const [priceText, setPriceText] = useState(initialUnitCostCents != null ? centsToPlain(initialUnitCostCents) : "");
  const [notes, setNotes] = useState(initialInternalNotes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | undefined>(undefined);
  const [isPending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    setError(null);
    setPriceError(undefined);

    const unitCostCents = priceText.trim() === "" ? null : brlStringToCents(priceText);
    if (priceText.trim() !== "" && unitCostCents === null) {
      setPriceError("Valor inválido. Use vírgula para centavos, ex.: 4,20.");
      return;
    }

    setPending(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de updateFormulaCost virava erro não tratado no cliente e o
    // botão ficava travado em "Salvando…" (o setPending(false) nunca era
    // alcançado).
    try {
      const result = await updateFormulaCost(formulaId, { unitCostCents, internalNotes: notes.trim() === "" ? null : notes });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success("Custo salvo.");
    } catch (caught) {
      console.error("[CostForm] falha ao salvar custo:", caught);
      toast.error("Não foi possível salvar o custo agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="lc-admin-form" onSubmit={handleSubmit} noValidate>
      <TextField
        id="cost-price"
        label="Custo real por pote (R$)"
        value={priceText}
        onChange={setPriceText}
        error={priceError}
        hint="Deixe em branco enquanto o custo real não for conhecido."
      />
      <TextAreaField id="cost-notes" label="Notas internas" value={notes} onChange={setNotes} hint="Nunca aparece no catálogo público." rows={5} />
      {error ? (
        <p className="lc-field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="lc-admin-form-actions">
        <button type="submit" className="lc-btn lc-btn-primary" disabled={isPending} aria-busy={isPending}>
          {isPending ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
