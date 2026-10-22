"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { COMPOSITION_UNIT_LABELS, toSelectOptions } from "@/components/admin/enum-labels";
import { removeCompositionLine, updateCompositionLine } from "@/lib/actions/compositions";
import type { AdminCompositionLineDTO, CompositionUnit, IngredientPickerOptionDTO } from "@/lib/data/admin";

interface CompositionRowProps {
  line: AdminCompositionLineDTO;
  ingredientOptions: IngredientPickerOptionDTO[];
  isFirst: boolean;
  isLast: boolean;
  disabled: boolean;
  onRemoved: (id: string) => void;
  onMove: (direction: "up" | "down") => void;
}

interface Draft {
  ingredientName: string;
  quantityText: string;
  unit: CompositionUnit;
  ingredientId: string;
}

function toDraft(line: AdminCompositionLineDTO): Draft {
  return {
    ingredientName: line.ingredientName,
    quantityText: String(line.quantity).replace(".", ","),
    unit: line.unit,
    ingredientId: line.ingredientId ?? "",
  };
}

export function CompositionRow({ line, ingredientOptions, isFirst, isLast, disabled, onRemoved, onMove }: CompositionRowProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(line));
  const [saved, setSaved] = useState<Draft>(() => toDraft(line));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  async function handleSave() {
    const quantity = Number(draft.quantityText.replace(",", "."));
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Quantidade precisa ser um número maior que zero.");
      return;
    }
    setError(null);
    setSaving(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de updateCompositionLine virava erro não tratado no cliente.
    try {
      const result = await updateCompositionLine(line.id, {
        ingredientName: draft.ingredientName,
        quantity,
        unit: draft.unit,
        ingredientId: draft.ingredientId === "" ? null : draft.ingredientId,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(draft);
      toast.success("Linha de composição salva.");
    } catch (caught) {
      console.error("[CompositionRow] falha ao salvar linha de composição:", caught);
      toast.error("Não foi possível salvar esta linha agora. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="lc-admin-comp-row">
      <div className="lc-field">
        <label className="lc-field-label" htmlFor={`comp-name-${line.id}`}>
          Insumo (rótulo)
        </label>
        <input
          id={`comp-name-${line.id}`}
          className="lc-field-input"
          value={draft.ingredientName}
          onChange={(event) => setDraft((prev) => ({ ...prev, ingredientName: event.target.value }))}
        />
      </div>

      <div className="lc-field">
        <label className="lc-field-label" htmlFor={`comp-ingredient-${line.id}`}>
          Insumo canônico
        </label>
        <select
          id={`comp-ingredient-${line.id}`}
          className="lc-admin-select"
          value={draft.ingredientId}
          onChange={(event) => {
            const nextId = event.target.value;
            const match = ingredientOptions.find((option) => option.id === nextId);
            setDraft((prev) => ({ ...prev, ingredientId: nextId, ingredientName: match ? match.name : prev.ingredientName }));
          }}
        >
          <option value="">(sem correspondência)</option>
          {ingredientOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div className="lc-field">
        <label className="lc-field-label" htmlFor={`comp-qty-${line.id}`}>
          Quantidade
        </label>
        <input
          id={`comp-qty-${line.id}`}
          className={`lc-field-input${error ? " is-invalid" : ""}`}
          inputMode="decimal"
          value={draft.quantityText}
          onChange={(event) => setDraft((prev) => ({ ...prev, quantityText: event.target.value }))}
        />
      </div>

      <div className="lc-field">
        <label className="lc-field-label" htmlFor={`comp-unit-${line.id}`}>
          Unidade
        </label>
        <select
          id={`comp-unit-${line.id}`}
          className="lc-admin-select"
          value={draft.unit}
          onChange={(event) => setDraft((prev) => ({ ...prev, unit: event.target.value as CompositionUnit }))}
        >
          {toSelectOptions(COMPOSITION_UNIT_LABELS).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="lc-admin-comp-actions">
        <div className="lc-admin-comp-reorder">
          <button
            type="button"
            className="lc-admin-icon-btn"
            aria-label="Mover para cima"
            disabled={isFirst || disabled}
            onClick={() => onMove("up")}
          >
            <ArrowUp size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="lc-admin-icon-btn"
            aria-label="Mover para baixo"
            disabled={isLast || disabled}
            onClick={() => onMove("down")}
          >
            <ArrowDown size={14} aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          className="lc-admin-icon-btn"
          aria-label="Salvar linha"
          disabled={!isDirty || isSaving || disabled}
          onClick={handleSave}
        >
          <Check size={16} aria-hidden="true" />
        </button>
        <ConfirmButton
          ariaLabel="Remover linha de composição"
          title="Remover insumo da composição"
          description={`Remover "${line.ingredientName}" da composição desta fórmula? Isto sai do dossiê público imediatamente.`}
          confirmLabel="Remover"
          onConfirm={() => removeCompositionLine(line.id)}
          onSuccess={() => onRemoved(line.id)}
        >
          <Trash2 size={16} aria-hidden="true" />
        </ConfirmButton>
      </div>

      {error ? (
        <p className="lc-field-error lc-admin-comp-row-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
