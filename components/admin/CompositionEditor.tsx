"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { CompositionRow } from "@/components/admin/CompositionRow";
import { COMPOSITION_UNIT_LABELS, toSelectOptions } from "@/components/admin/enum-labels";
import { addCompositionLine, reorderCompositionLines } from "@/lib/actions/compositions";
import type { AdminCompositionLineDTO, CompositionUnit, IngredientPickerOptionDTO } from "@/lib/data/admin";

interface CompositionEditorProps {
  formulaId: string;
  initialLines: AdminCompositionLineDTO[];
  ingredientOptions: IngredientPickerOptionDTO[];
}

interface NewLineDraft {
  ingredientName: string;
  quantityText: string;
  unit: CompositionUnit;
  ingredientId: string;
}

const EMPTY_DRAFT: NewLineDraft = { ingredientName: "", quantityText: "", unit: "mg", ingredientId: "" };

// Item 4 da tarefa: adicionar, editar, remover e reordenar insumos. Cada
// linha (CompositionRow) cuida da própria edição/remoção; este componente só
// coordena a lista (ordem, adição) e é a única fonte de verdade do array em
// tela - sempre reflete o retorno das Server Actions, nunca assume sucesso
// sem confirmação do servidor.
export function CompositionEditor({ formulaId, initialLines, ingredientOptions }: CompositionEditorProps) {
  const [lines, setLines] = useState(initialLines);
  const [isReordering, setReordering] = useState(false);
  const [draft, setDraft] = useState<NewLineDraft>(EMPTY_DRAFT);
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setAdding] = useState(false);

  function handleRemoved(id: string) {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }

  async function persistOrder(nextLines: AdminCompositionLineDTO[]) {
    const previous = lines;
    setLines(nextLines);
    setReordering(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de reorderCompositionLines (rede caiu, RLS negou, sessão
    // expirou) virava erro não tratado no cliente E deixava a tela mostrando
    // a ordem nova sem ela ter sido salva de verdade - mentindo pro
    // operador. No catch, revertemos a lista visível para `previous`, igual
    // ao que já acontecia no caminho `!result.ok`.
    try {
      const result = await reorderCompositionLines(
        formulaId,
        nextLines.map((line) => line.id),
      );
      if (!result.ok) {
        toast.error(result.error);
        setLines(previous);
      }
    } catch (caught) {
      console.error("[CompositionEditor] falha ao reordenar composição:", caught);
      toast.error("Não foi possível reordenar agora. Tente novamente.");
      setLines(previous);
    } finally {
      setReordering(false);
    }
  }

  function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lines.length) return;
    const next = [...lines];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    void persistOrder(next);
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(draft.quantityText.replace(",", "."));
    // Nome vazio não trava mais o salvamento (ordem do dono, 17/09/2026): o
    // mesmo fallback "PENDENTE" que a Server Action aplica (ver
    // lib/actions/compositions.ts) já é calculado aqui, para o item otimista
    // abaixo bater com o que o servidor de fato gravou.
    const ingredientName = draft.ingredientName.trim() === "" ? "PENDENTE" : draft.ingredientName.trim();
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setAddError("Quantidade precisa ser um número maior que zero.");
      return;
    }

    setAddError(null);
    setAdding(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de addCompositionLine virava erro não tratado no cliente e
    // "Adicionando…" ficava travado (o setAdding(false) nunca era
    // alcançado).
    try {
      const result = await addCompositionLine(formulaId, {
        ingredientName,
        quantity,
        unit: draft.unit,
        ingredientId: draft.ingredientId === "" ? null : draft.ingredientId,
      });

      if (!result.ok) {
        setAddError(result.error);
        return;
      }

      setLines((prev) => [
        ...prev,
        {
          id: result.data.id,
          ingredientName,
          quantity,
          unit: draft.unit,
          sortOrder: result.data.sortOrder,
          ingredientId: draft.ingredientId === "" ? null : draft.ingredientId,
        },
      ]);
      setDraft(EMPTY_DRAFT);
      toast.success("Insumo adicionado à composição.");
    } catch (caught) {
      console.error("[CompositionEditor] falha ao adicionar insumo:", caught);
      toast.error("Não foi possível adicionar o insumo agora. Tente novamente.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="lc-admin-comp-editor">
      {lines.length === 0 ? <p className="lc-admin-empty">Nenhum insumo cadastrado nesta composição ainda.</p> : null}

      {lines.map((line, index) => (
        <CompositionRow
          key={line.id}
          line={line}
          ingredientOptions={ingredientOptions}
          isFirst={index === 0}
          isLast={index === lines.length - 1}
          disabled={isReordering}
          onRemoved={handleRemoved}
          onMove={(direction) => handleMove(index, direction)}
        />
      ))}

      <form className="lc-admin-comp-row" onSubmit={handleAdd}>
        <div className="lc-field">
          <label className="lc-field-label" htmlFor="comp-new-name">
            Novo insumo (rótulo)
          </label>
          <input
            id="comp-new-name"
            className="lc-field-input"
            value={draft.ingredientName}
            placeholder="Ex.: Vitamina C (ácido ascórbico)"
            onChange={(event) => setDraft((prev) => ({ ...prev, ingredientName: event.target.value }))}
          />
        </div>
        <div className="lc-field">
          <label className="lc-field-label" htmlFor="comp-new-ingredient">
            Insumo canônico
          </label>
          <select
            id="comp-new-ingredient"
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
          <label className="lc-field-label" htmlFor="comp-new-qty">
            Quantidade
          </label>
          <input
            id="comp-new-qty"
            className="lc-field-input"
            inputMode="decimal"
            value={draft.quantityText}
            placeholder="Ex.: 45"
            onChange={(event) => setDraft((prev) => ({ ...prev, quantityText: event.target.value }))}
          />
        </div>
        <div className="lc-field">
          <label className="lc-field-label" htmlFor="comp-new-unit">
            Unidade
          </label>
          <select
            id="comp-new-unit"
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
        <button type="submit" className="lc-btn lc-btn-primary" disabled={isAdding} aria-busy={isAdding}>
          {isAdding ? "Adicionando…" : "Adicionar"}
        </button>
        {addError ? (
          <p className="lc-field-error lc-admin-comp-row-error" role="alert">
            {addError}
          </p>
        ) : null}
      </form>
    </div>
  );
}
