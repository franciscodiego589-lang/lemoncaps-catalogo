"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { NutritionTable } from "@/components/catalog/NutritionTable";
import { NutritionTableRow } from "@/components/admin/NutritionTableRow";
import {
  adicionarLinhaVazia,
  atualizarLinha,
  draftEhLinhaObrigatoria,
  draftParaEntradaCrua,
  draftParaPreviewTable,
  moverLinha,
  removerLinha,
  tabelaParaFormDraft,
  type NutritionRowDraft,
  type NutritionTableFormDraft,
} from "@/components/admin/nutrition-table-draft";
import { updateNutritionTable } from "@/lib/actions/formulas";
import type { NutritionTable as NutritionTableData } from "@/lib/catalog/nutrition-table";

interface NutritionTableEditorProps {
  formulaId: string;
  initialTable: NutritionTableData | null;
}

// Editor estruturado da tabela de Informação Nutricional (RDC 429/2020 + IN
// 75/2020) - item 1 da tarefa: cabeçalho editável, linhas linha a linha
// (adicionar/remover/mover), %VD por grupo, rodapé editável, e uma PRÉVIA AO
// VIVO com o MESMO componente que o dossiê público usa (NutritionTable),
// para o RT ver exatamente o que o cliente final vai ver.
//
// Estado, validação leve e feedback com sonner seguem o MESMO padrão de
// CompositionEditor.tsx/CompositionRow.tsx (ver comentário de topo dos dois),
// com uma diferença estrutural real: a tabela nutricional é UM JSON só
// (formulas.metadata->tabela_nutricional), não linhas separadas do banco -
// então não existe "salvar esta linha" isolado (diferente de CompositionRow,
// que salva cada linha via Server Action própria). Aqui adicionar/remover/
// mover linha é só estado local (nenhuma chamada ao servidor), e existe UM
// botão "Salvar tabela nutricional" que manda o formulário inteiro de uma vez
// para updateNutritionTable (lib/actions/formulas.ts), que valida com
// rawNutritionTableSchema, faz o merge em metadata e regenera
// nutritional_info - tudo numa chamada atômica.
export function NutritionTableEditor({ formulaId, initialTable }: NutritionTableEditorProps) {
  const [form, setForm] = useState<NutritionTableFormDraft>(() => tabelaParaFormDraft(initialTable));
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  // Prévia ao vivo - recalculada a cada tecla, mas NUNCA lança (conversão
  // tolerante, ver draftParaPreviewTable): número inválido vira null e a
  // prévia mostra "—", nunca quebra a tela por causa de um campo a meio de
  // digitar.
  const previewTable = useMemo(() => draftParaPreviewTable(form), [form]);

  function handleRowChange(chave: string, proxima: NutritionRowDraft) {
    setForm((prev) => atualizarLinha(prev, chave, proxima));
  }

  function handleAddRow() {
    setForm((prev) => adicionarLinhaVazia(prev));
  }

  function handleRemoveRow(chave: string) {
    setForm((prev) => removerLinha(prev, chave));
  }

  function handleMoveRow(chave: string, direcao: "up" | "down") {
    setForm((prev) => moverLinha(prev, chave, direcao));
  }

  // Validação leve no cliente - só o que continua sendo estrutural depois do
  // afrouxamento consciente de 17/09/2026 (ordem do dono): "porções por
  // embalagem", "porção" e o "item" de cada linha deixaram de ser obrigatórios
  // (vazio grava como "PENDENTE", mesmo padrão de sheet-approvals.ts - ver
  // rawNutritionTableSchema/rawNutritionRowSchema em lib/catalog/nutrition-table.ts).
  // O que continua bloqueado aqui é só "tabela sem nenhuma linha", porque não
  // existe um "PENDENTE" razoável para isso - o servidor também exige
  // linhas.min(1) e uma tabela de 0 linhas não renderiza nada no dossiê.
  function validarLocalmente(): string | null {
    if (form.linhas.length === 0) return "A tabela precisa de pelo menos uma linha.";
    return null;
  }

  async function handleSave() {
    if (isPending) return;
    const erroLocal = validarLocalmente();
    if (erroLocal) {
      setFormError(erroLocal);
      return;
    }

    setFormError(null);
    setPending(true);
    // try/catch (mesmo padrão dos outros formulários do admin - ver
    // FormulaForm.tsx/CompositionEditor.tsx): sem isto, uma rejeição de
    // updateNutritionTable (rede caiu, sessão expirou) vira erro não tratado
    // no cliente e o botão fica travado em "Salvando…".
    try {
      const entrada = draftParaEntradaCrua(form);
      const resultado = await updateNutritionTable(formulaId, entrada);

      if (!resultado.ok) {
        setFormError(resultado.error);
        if (resultado.fieldErrors) {
          const mensagens = Object.values(resultado.fieldErrors).filter((mensagem): mensagem is string => Boolean(mensagem));
          for (const mensagem of mensagens) toast.error(mensagem);
        }
        return;
      }

      toast.success("Tabela nutricional salva. O texto de rótulo (nutritional_info) foi regenerado a partir dela.");
    } catch (caught) {
      console.error("[NutritionTableEditor] falha ao salvar tabela nutricional:", caught);
      toast.error("Não foi possível salvar a tabela nutricional agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="lc-admin-nutri-editor">
      <div className="lc-admin-form-grid">
        <div className="lc-field">
          <label className="lc-field-label" htmlFor="nutri-porcoes">
            Porções por embalagem
          </label>
          <input
            id="nutri-porcoes"
            className="lc-field-input"
            placeholder="vazio = PENDENTE"
            value={form.porcoesPorEmbalagemTexto}
            onChange={(event) => setForm((prev) => ({ ...prev, porcoesPorEmbalagemTexto: event.target.value }))}
          />
        </div>
        <div className="lc-field">
          <label className="lc-field-label" htmlFor="nutri-porcao">
            Porção
          </label>
          <input
            id="nutri-porcao"
            className="lc-field-input"
            placeholder="Ex.: 1 g (2 cápsulas) — vazio = PENDENTE"
            value={form.porcaoTexto}
            onChange={(event) => setForm((prev) => ({ ...prev, porcaoTexto: event.target.value }))}
          />
        </div>
        <div className="lc-field-checkbox-row">
          <input
            type="checkbox"
            id="nutri-por100"
            checked={form.por100}
            onChange={(event) => setForm((prev) => ({ ...prev, por100: event.target.checked }))}
          />
          <label htmlFor="nutri-por100" className="lc-field-label">
            Mostrar coluna &quot;100 g/ml&quot;
          </label>
        </div>
      </div>
      <p className="lc-field-hint">
        Grupo(s) de %VD desta fórmula: <strong>{form.gruposVd.map((grupo) => grupo.replace(/_/g, " ")).join(", ")}</strong>. A coluna &quot;100
        g/ml&quot; é dispensada para a maioria dos suplementos (RDC 429/2020, art. 8º, §1º) - só ligue se este produto for líquido ou pó para
        reconstituição.
      </p>

      <div className="lc-admin-comp-editor">
        {form.linhas.map((linha, index) => (
          <NutritionTableRow
            key={linha.chave}
            draft={linha}
            gruposVd={form.gruposVd}
            isEnergia={linha.item.trim() === "Valor energético"}
            mostrarPor100={form.por100}
            podeRemover={!draftEhLinhaObrigatoria(linha)}
            isFirst={index === 0}
            isLast={index === form.linhas.length - 1}
            onChange={(proxima) => handleRowChange(linha.chave, proxima)}
            onRemove={() => handleRemoveRow(linha.chave)}
            onMove={(direcao) => handleMoveRow(linha.chave, direcao)}
          />
        ))}
      </div>

      <div className="lc-admin-form-actions">
        <button type="button" className="lc-btn lc-btn-ghost" onClick={handleAddRow}>
          + Adicionar linha
        </button>
      </div>

      <div className="lc-field">
        <label className="lc-field-label" htmlFor="nutri-rodape">
          Rodapé
        </label>
        <input
          id="nutri-rodape"
          className="lc-field-input"
          value={form.rodapeTexto}
          onChange={(event) => setForm((prev) => ({ ...prev, rodapeTexto: event.target.value }))}
        />
      </div>

      <div className="lc-admin-nutri-preview">
        <p className="lc-field-label">Prévia (o mesmo componente do dossiê público)</p>
        <NutritionTable table={previewTable} />
      </div>

      {formError ? (
        <p className="lc-field-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="lc-admin-form-actions">
        <button type="button" className="lc-btn lc-btn-primary" disabled={isPending} aria-busy={isPending} onClick={handleSave}>
          {isPending ? "Salvando…" : "Salvar tabela nutricional"}
        </button>
      </div>
    </div>
  );
}
