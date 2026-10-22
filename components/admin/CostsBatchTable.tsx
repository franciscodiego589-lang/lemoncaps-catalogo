"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { toast } from "sonner";

import { updateFormulaCostsBatch, type CostBatchRowInput } from "@/lib/actions/costs";
import type { AdminFormulaCostListItemDTO } from "@/lib/data/admin";
import { brlStringToCents, centsToBRL, centsToPlain } from "@/lib/money";

interface CostsBatchTableProps {
  rows: AdminFormulaCostListItemDTO[];
}

interface BatchRowState {
  formulaId: string;
  formulaName: string;
  listPriceCents: number | null;
  // Baseline = o que está gravado no banco agora (ou o que a própria tela
  // acabou de confirmar que gravou). Comparar contra isto, nunca contra o
  // valor inicial da página inteira, é o que permite "salvar só o que mudou".
  initialUnitCostCents: number | null;
  initialNotes: string | null;
  costText: string;
  notes: string;
  costError?: string;
}

function toRowState(row: AdminFormulaCostListItemDTO): BatchRowState {
  return {
    formulaId: row.formulaId,
    formulaName: row.formulaName,
    listPriceCents: row.listPriceCents,
    initialUnitCostCents: row.unitCostCents,
    initialNotes: row.internalNotes,
    costText: row.unitCostCents != null ? centsToPlain(row.unitCostCents) : "",
    notes: row.internalNotes ?? "",
  };
}

// Campo vazio = custo NÃO lançado (null) - diferente de zero (regra explícita
// da tarefa). brlStringToCents("") já devolveria null sozinho, mas o trim()
// aqui na frente evita chamar a função para "   " e por acaso funcionar por
// coincidência de regex; deixa a intenção explícita.
function parseCostText(text: string): number | null {
  return text.trim() === "" ? null : brlStringToCents(text);
}

// Mesma normalização que o zod do servidor aplica (.trim(), "" vira null) -
// replicada aqui para o rastreio de "linha alterada" no cliente bater exatamente
// com o que será gravado, sem depender de ida e volta ao servidor para saber.
function normalizeNotes(text: string): string | null {
  const trimmed = text.trim();
  return trimmed === "" ? null : trimmed;
}

function isDirty(row: BatchRowState): boolean {
  return parseCostText(row.costText) !== row.initialUnitCostCents || normalizeNotes(row.notes) !== row.initialNotes;
}

interface Margin {
  cents: number | null;
  pct: number | null;
}

// cents nasce de subtrair dois inteiros (preço e custo já em centavos) - exato,
// sem ponto flutuante em lugar nenhum. pct é uma RAZÃO para leitura na tela,
// nunca um valor gravado no banco; não existe "percentual em centavos", então
// a regra de dinheiro-sempre-inteiro (que é sobre o que é GRAVADO) não se
// aplica a este número - ele só existe entre a digitação e o olho do dono.
function computeMargin(listPriceCents: number | null, unitCostCents: number | null): Margin {
  if (listPriceCents == null || unitCostCents == null) return { cents: null, pct: null };
  const cents = listPriceCents - unitCostCents;
  const pct = listPriceCents > 0 ? (cents / listPriceCents) * 100 : null;
  return { cents, pct };
}

function formatPercent(value: number): string {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

// Tela em lote (item novo do CLAUDE.md da tarefa): a listagem antiga mandava
// abrir uma tela por fórmula para digitar um número e voltar - com 28 linhas
// e nenhuma preenchida, ninguém fazia isso 28 vezes. Aqui o dono preenche
// tudo numa tela só, vê a margem calculada na hora e salva de uma vez; a
// edição individual (custos/[id]) continua existindo para quem preferir focar
// numa fórmula só ou escrever uma nota interna mais longa.
export function CostsBatchTable({ rows: initialRows }: CostsBatchTableProps) {
  const [rows, setRows] = useState<BatchRowState[]>(() => initialRows.map(toRowState));
  const [isSaving, setSaving] = useState(false);

  const dirtyCount = useMemo(() => rows.filter(isDirty).length, [rows]);

  const resumo = useMemo(() => {
    let definidos = 0;
    let somaPct = 0;
    let comPct = 0;
    let negativos = 0;
    for (const row of rows) {
      const cost = parseCostText(row.costText);
      if (cost == null) continue;
      definidos += 1;
      const { cents, pct } = computeMargin(row.listPriceCents, cost);
      if (cents != null && cents < 0) negativos += 1;
      if (pct != null) {
        somaPct += pct;
        comPct += 1;
      }
    }
    return { definidos, total: rows.length, margemMedia: comPct > 0 ? somaPct / comPct : null, negativos };
  }, [rows]);

  // Aviso do navegador ao fechar a aba/recarregar com edição não salva - só
  // liga quando há algo sujo. Números digitados à mão, 28 linhas de cada vez,
  // não têm como "redigitar de memória" se o dono fechar a aba sem querer.
  useEffect(() => {
    if (dirtyCount === 0) return;
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirtyCount]);

  function updateRow(formulaId: string, patch: Partial<Pick<BatchRowState, "costText" | "notes" | "costError">>) {
    setRows((prev) => prev.map((row) => (row.formulaId === formulaId ? { ...row, ...patch } : row)));
  }

  // Reformata no blur (se deu para entender o número) para o dono CONFIRMAR
  // visualmente o que foi lido - "8.5" virar "8,50" na hora evita a dúvida de
  // "isso ficou R$ 8,50 ou R$ 0,85?" antes mesmo de salvar.
  function handleCostBlur(formulaId: string, text: string) {
    if (text.trim() === "") return;
    const cents = brlStringToCents(text);
    if (cents != null) updateRow(formulaId, { costText: centsToPlain(cents) });
  }

  function handleEditClick(event: MouseEvent<HTMLAnchorElement>) {
    if (dirtyCount === 0) return;
    const confirmed = window.confirm("Você tem alterações não salvas nesta tela. Sair para a edição individual mesmo assim?");
    if (!confirmed) event.preventDefault();
  }

  function handleDiscard() {
    setRows(initialRows.map(toRowState));
    toast.message("Alterações descartadas - os campos voltaram ao que está salvo.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const dirtyRows = rows.filter(isDirty);
    if (dirtyRows.length === 0) return;

    // Revalida os campos de custo sujos antes de chamar a action - uma linha
    // com "8,x9" inválido nunca pode travar as outras 27 que estão certas,
    // mas também nunca pode ser enviada calada como null.
    let hasError = false;
    setRows((prev) =>
      prev.map((row) => {
        if (!isDirty(row)) return row.costError ? { ...row, costError: undefined } : row;
        const parsedCost = parseCostText(row.costText);
        if (row.costText.trim() !== "" && parsedCost === null) {
          hasError = true;
          return { ...row, costError: "Valor inválido. Use vírgula para centavos, ex.: 4,20." };
        }
        return row.costError ? { ...row, costError: undefined } : row;
      }),
    );
    if (hasError) {
      toast.error("Corrija os valores destacados antes de salvar.");
      return;
    }

    const payload: CostBatchRowInput[] = dirtyRows.map((row) => ({
      formulaId: row.formulaId,
      unitCostCents: parseCostText(row.costText),
      internalNotes: normalizeNotes(row.notes),
    }));

    setSaving(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de updateFormulaCostsBatch virava erro não tratado no
    // cliente e o botão ficava travado em "Salvando…".
    try {
      const result = await updateFormulaCostsBatch(payload);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      // A nova baseline vira o que acabou de ser confirmado pelo servidor -
      // essas linhas param de contar como "alteradas" sem precisar recarregar a
      // página inteira (o dono pode continuar preenchendo as outras).
      const savedByFormulaId = new Map(payload.map((row) => [row.formulaId, row]));
      setRows((prev) =>
        prev.map((row) => {
          const saved = savedByFormulaId.get(row.formulaId);
          if (!saved) return row;
          return { ...row, initialUnitCostCents: saved.unitCostCents, initialNotes: saved.internalNotes };
        }),
      );
      toast.success(payload.length === 1 ? "1 custo salvo." : `${payload.length} custos salvos.`);
    } catch (caught) {
      console.error("[CostsBatchTable] falha ao salvar custos em lote:", caught);
      toast.error("Não foi possível salvar os custos agora. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="lc-admin-costs-batch" onSubmit={handleSubmit}>
      <section className="lc-admin-metricas" aria-labelledby="lc-admin-custos-resumo-titulo">
        <h2 id="lc-admin-custos-resumo-titulo" className="lc-sr-only">
          Resumo dos custos
        </h2>
        <div className="lc-admin-metrica lc-admin-metrica--estatica">
          <span className="lc-admin-metrica-valor">
            {resumo.definidos} de {resumo.total}
          </span>
          <span className="lc-admin-metrica-rotulo">Custos definidos</span>
        </div>
        <div className="lc-admin-metrica lc-admin-metrica--estatica">
          <span
            className={`lc-admin-metrica-valor${resumo.margemMedia !== null && resumo.margemMedia < 0 ? " lc-admin-metrica-valor--alerta" : ""}`}
          >
            {resumo.margemMedia !== null ? formatPercent(resumo.margemMedia) : "-"}
          </span>
          <span className="lc-admin-metrica-rotulo">Margem média</span>
          <span className="lc-admin-metrica-nota">entre as fórmulas com custo definido</span>
        </div>
        <div className="lc-admin-metrica lc-admin-metrica--estatica">
          <span className={`lc-admin-metrica-valor${resumo.negativos > 0 ? " lc-admin-metrica-valor--alerta" : ""}`}>{resumo.negativos}</span>
          <span className="lc-admin-metrica-rotulo">Com margem negativa</span>
        </div>
      </section>

      <div className="lc-admin-form-actions">
        <button
          type="submit"
          className="lc-btn lc-btn-primary lc-admin-acao-principal"
          disabled={isSaving || dirtyCount === 0}
          aria-busy={isSaving}
        >
          {isSaving ? "Salvando…" : dirtyCount > 0 ? `Salvar alterações (${dirtyCount})` : "Salvar alterações"}
        </button>
        <button
          type="button"
          className="lc-btn lc-btn-ghost lc-admin-acao-principal"
          onClick={handleDiscard}
          disabled={isSaving || dirtyCount === 0}
        >
          Descartar alterações
        </button>
      </div>

      <div className="lc-admin-table-wrap">
        <table className="lc-admin-table lc-admin-costs-table">
          <thead>
            <tr>
              <th scope="col">Fórmula</th>
              <th scope="col" className="lc-admin-col-num">
                Preço público
              </th>
              <th scope="col">Custo real por pote</th>
              <th scope="col" className="lc-admin-col-num">
                Margem
              </th>
              <th scope="col" className="lc-admin-col-num">
                Margem %
              </th>
              <th scope="col">Observação interna</th>
              <th scope="col" className="lc-admin-col-actions">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const parsedCost = parseCostText(row.costText);
              const { cents: marginCents, pct: marginPct } = computeMargin(row.listPriceCents, parsedCost);
              const marginClass = marginCents == null ? "" : marginCents < 0 ? " lc-admin-margin--negativa" : " lc-admin-margin--positiva";
              const dirty = isDirty(row);

              return (
                <tr key={row.formulaId} className={dirty ? "lc-admin-row-dirty" : undefined}>
                  <td>{row.formulaName}</td>
                  <td className="lc-admin-col-num">{row.listPriceCents !== null ? centsToBRL(row.listPriceCents) : "-"}</td>
                  <td>
                    <input
                      type="text"
                      inputMode="decimal"
                      className={`lc-field-input lc-admin-cost-input${row.costError ? " is-invalid" : ""}`}
                      value={row.costText}
                      placeholder="não definido"
                      aria-label={`Custo real por pote de ${row.formulaName}`}
                      aria-invalid={Boolean(row.costError)}
                      onChange={(event) => updateRow(row.formulaId, { costText: event.target.value, costError: undefined })}
                      onBlur={(event) => handleCostBlur(row.formulaId, event.target.value)}
                    />
                    {row.costError ? (
                      <p className="lc-field-error" role="alert">
                        {row.costError}
                      </p>
                    ) : null}
                  </td>
                  <td className={`lc-admin-col-num${marginClass}`}>{marginCents !== null ? centsToBRL(marginCents) : "-"}</td>
                  <td className={`lc-admin-col-num${marginClass}`}>{marginPct !== null ? formatPercent(marginPct) : "-"}</td>
                  <td>
                    <textarea
                      className="lc-field-textarea lc-admin-cost-notes"
                      rows={2}
                      value={row.notes}
                      placeholder="opcional"
                      aria-label={`Observação interna de ${row.formulaName}`}
                      onChange={(event) => updateRow(row.formulaId, { notes: event.target.value })}
                    />
                  </td>
                  <td className="lc-admin-col-actions">
                    <Link href={`/admin/custos/${row.formulaId}`} className="lc-btn lc-btn-ghost" onClick={handleEditClick}>
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lc-admin-form-actions">
        <button
          type="submit"
          className="lc-btn lc-btn-primary lc-admin-acao-principal"
          disabled={isSaving || dirtyCount === 0}
          aria-busy={isSaving}
        >
          {isSaving ? "Salvando…" : dirtyCount > 0 ? `Salvar alterações (${dirtyCount})` : "Salvar alterações"}
        </button>
        <button
          type="button"
          className="lc-btn lc-btn-ghost lc-admin-acao-principal"
          onClick={handleDiscard}
          disabled={isSaving || dirtyCount === 0}
        >
          Descartar alterações
        </button>
      </div>
    </form>
  );
}
