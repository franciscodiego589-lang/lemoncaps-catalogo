"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { QUOTE_STATUS_LABELS } from "@/components/admin/enum-labels";
import { SelectField, TextAreaField } from "@/components/admin/FormFields";
import { updateQuoteStatus } from "@/lib/actions/quotes";
import type { QuoteStatus } from "@/lib/data/admin";

interface QuoteStatusEditorProps {
  quoteId: string;
  status: QuoteStatus;
  internalNote: string | null;
}

const STATUS_OPTIONS = (Object.keys(QUOTE_STATUS_LABELS) as QuoteStatus[]).map((value) => ({
  value,
  label: QUOTE_STATUS_LABELS[value],
}));

interface Draft {
  status: string;
  note: string;
}

function toDraft(status: QuoteStatus, internalNote: string | null): Draft {
  return { status, note: internalNote ?? "" };
}

// Mesmo padrão de QuoteItemRow.tsx (item 8 já existente): resincroniza o
// rascunho quando o valor vindo do servidor muda de verdade - por exemplo,
// depois do próprio save, quando internal_note volta já sem os espaços extra
// que o trim() da action tira. Ajuste de estado DURANTE a renderização
// (padrão do React para "adjusting state when a prop changes"), nunca dentro
// de um useEffect com setState síncrono.
export function QuoteStatusEditor({ quoteId, status, internalNote }: QuoteStatusEditorProps) {
  const router = useRouter();

  const [lastSyncedKey, setLastSyncedKey] = useState(`${status}:${internalNote ?? ""}`);
  const [draft, setDraft] = useState<Draft>(() => toDraft(status, internalNote));
  const [saved, setSaved] = useState<Draft>(() => toDraft(status, internalNote));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);

  const currentKey = `${status}:${internalNote ?? ""}`;
  if (currentKey !== lastSyncedKey) {
    setLastSyncedKey(currentKey);
    setDraft(toDraft(status, internalNote));
    setSaved(toDraft(status, internalNote));
  }

  const isDirty = draft.status !== saved.status || draft.note !== saved.note;

  async function handleSave() {
    setError(null);
    setSaving(true);
    const result = await updateQuoteStatus(quoteId, { status: draft.status as QuoteStatus, internalNote: draft.note });
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success("Orçamento atualizado.");
    router.refresh();
  }

  return (
    <div className="lc-admin-panel">
      <h2>Status e observação interna</h2>
      <div className="lc-admin-form-grid">
        <SelectField
          id="quote-status"
          label="Status"
          value={draft.status}
          onChange={(value) => setDraft((prev) => ({ ...prev, status: value }))}
          options={STATUS_OPTIONS}
        />
        <TextAreaField
          id="quote-internal-note"
          label="Observação interna"
          hint="Só o staff vê - nunca aparece para a cliente nem no PDF do orçamento."
          value={draft.note}
          onChange={(value) => setDraft((prev) => ({ ...prev, note: value }))}
          rows={3}
          full
        />
      </div>
      <div className="lc-card-actions">
        <button type="button" className="lc-btn lc-btn-primary" disabled={!isDirty || isSaving} onClick={handleSave} aria-busy={isSaving}>
          {isSaving ? "Salvando…" : "Salvar"}
        </button>
        {error ? (
          <p className="lc-field-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
