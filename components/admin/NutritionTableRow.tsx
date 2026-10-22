"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import type { NutritionRowDraft } from "@/components/admin/nutrition-table-draft";

interface NutritionTableRowProps {
  draft: NutritionRowDraft;
  gruposVd: string[];
  isEnergia: boolean;
  mostrarPor100: boolean;
  podeRemover: boolean;
  isFirst: boolean;
  isLast: boolean;
  onChange: (next: NutritionRowDraft) => void;
  onRemove: () => void;
  onMove: (direcao: "up" | "down") => void;
}

// Linha do editor de tabela nutricional - puramente controlada (o estado
// inteiro da tabela vive em NutritionTableEditor, este componente só emite
// onChange/onRemove/onMove). Diferente de CompositionRow (components/admin/
// CompositionRow.tsx), que salva a própria linha na hora via Server Action
// própria: aqui não existe "linha" no banco - é tudo UM JSON só
// (formulas.metadata->tabela_nutricional), salvo de uma vez pelo formulário
// inteiro (NutritionTableEditor) - então não faz sentido cada linha ter seu
// próprio botão "salvar". O padrão visual (lc-field, lc-field-label,
// lc-admin-icon-btn, ícones lucide) é o MESMO de CompositionRow, só o layout
// de campos (lc-admin-nutri-row, ver app/globals.css) é próprio, porque esta
// linha tem muito mais campos que uma linha de composição.
export function NutritionTableRow({
  draft,
  gruposVd,
  isEnergia,
  mostrarPor100,
  podeRemover,
  isFirst,
  isLast,
  onChange,
  onRemove,
  onMove,
}: NutritionTableRowProps) {
  function set<K extends keyof NutritionRowDraft>(campo: K, valor: NutritionRowDraft[K]) {
    onChange({ ...draft, [campo]: valor });
  }

  function setVdPct(grupo: string, valor: string) {
    onChange({ ...draft, vdPctTexto: { ...draft.vdPctTexto, [grupo]: valor } });
  }

  return (
    <div className="lc-admin-nutri-row">
      <div className="lc-field lc-admin-nutri-field--item">
        <label className="lc-field-label">Item</label>
        <input
          className="lc-field-input"
          placeholder="vazio = PENDENTE"
          value={draft.item}
          onChange={(event) => set("item", event.target.value)}
        />
      </div>

      <div className="lc-field lc-admin-nutri-field--pequeno">
        <label className="lc-field-label">Nível</label>
        <select className="lc-admin-select" value={draft.nivel} onChange={(event) => set("nivel", Number(event.target.value))}>
          <option value={0}>0 - principal</option>
          <option value={1}>1 - discriminação</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>

      <div className="lc-field lc-admin-nutri-field--pequeno">
        <label className="lc-field-label">Quantidade</label>
        <input
          className="lc-field-input"
          inputMode="decimal"
          placeholder="vazio = PENDENTE"
          value={draft.quantidadeTexto}
          onChange={(event) => set("quantidadeTexto", event.target.value)}
        />
      </div>

      <div className="lc-field lc-admin-nutri-field--pequeno">
        <label className="lc-field-label">Unidade</label>
        <input
          className="lc-field-input"
          placeholder="g, mg, µg, kcal…"
          value={draft.unidade}
          onChange={(event) => set("unidade", event.target.value)}
        />
      </div>

      {isEnergia && (
        <div className="lc-field lc-admin-nutri-field--pequeno">
          <label className="lc-field-label">kJ</label>
          <input className="lc-field-input" inputMode="decimal" value={draft.kjTexto} onChange={(event) => set("kjTexto", event.target.value)} />
        </div>
      )}

      {mostrarPor100 && (
        <div className="lc-field lc-admin-nutri-field--pequeno">
          <label className="lc-field-label">Por 100 g/ml</label>
          <input
            className="lc-field-input"
            inputMode="decimal"
            value={draft.quantidade100Texto}
            onChange={(event) => set("quantidade100Texto", event.target.value)}
          />
        </div>
      )}

      {gruposVd.map((grupo) => (
        <div className="lc-field lc-admin-nutri-field--pequeno" key={grupo}>
          <label className="lc-field-label">%VD {gruposVd.length > 1 ? grupo.replace(/_/g, " ") : ""}</label>
          <input
            className="lc-field-input"
            placeholder="vazio = sem VD"
            title="Número, ou PENDENTE (Anexo VIII sem referência), ou vazio - sem VD por norma"
            value={draft.vdPctTexto[grupo] ?? ""}
            onChange={(event) => setVdPct(grupo, event.target.value)}
          />
        </div>
      ))}

      <div className="lc-field lc-admin-nutri-field--nota">
        <label className="lc-field-label">Nota</label>
        <input className="lc-field-input" value={draft.nota} onChange={(event) => set("nota", event.target.value)} />
      </div>

      <div className="lc-field-checkbox-row lc-admin-nutri-field--provisorio">
        <input
          type="checkbox"
          id={`nutri-provisorio-${draft.chave}`}
          checked={draft.provisorio}
          onChange={(event) => set("provisorio", event.target.checked)}
        />
        <label htmlFor={`nutri-provisorio-${draft.chave}`} className="lc-field-label">
          Provisório
        </label>
      </div>

      <div className="lc-admin-comp-actions">
        <div className="lc-admin-comp-reorder">
          <button type="button" className="lc-admin-icon-btn" aria-label="Mover linha para cima" disabled={isFirst} onClick={() => onMove("up")}>
            <ArrowUp size={14} aria-hidden="true" />
          </button>
          <button type="button" className="lc-admin-icon-btn" aria-label="Mover linha para baixo" disabled={isLast} onClick={() => onMove("down")}>
            <ArrowDown size={14} aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          className="lc-admin-icon-btn lc-admin-icon-btn--danger"
          aria-label="Remover linha"
          title={podeRemover ? "Remover linha" : "Linha obrigatória do Anexo XI (RDC 429/2020, art. 5º) - só pode ser editada, não removida"}
          disabled={!podeRemover}
          onClick={onRemove}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
