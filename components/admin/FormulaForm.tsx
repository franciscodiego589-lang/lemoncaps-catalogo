"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { CheckboxField, NumberField, SelectField, TextAreaField, TextField } from "@/components/admin/FormFields";
import {
  FormulaPackagingFields,
  packagingFormStateToSpec,
  toPackagingFormState,
  type PackagingFormState,
} from "@/components/admin/FormulaPackagingFields";
import { PRODUCT_FORMAT_LABELS, PRODUCT_LINE_LABELS, toSelectOptions } from "@/components/admin/enum-labels";
import { createFormula, updateFormula, type FormulaWritableInput, type FormulaWritablePatch } from "@/lib/actions/formulas";
import type { AdminFormulaDetailDTO, AdminSegmentDTO } from "@/lib/data/admin";
import { brlStringToCents, centsToPlain } from "@/lib/money";

interface FormulaFormProps {
  segments: AdminSegmentDTO[];
  initial?: AdminFormulaDetailDTO;
}

// FormState estende PackagingFormState (os 12 campos de embalagem e logística, com os
// respectivos conversores, em components/admin/FormulaPackagingFields.tsx) - os campos
// vivem no mesmo estado e são salvos no mesmo submit, só o pedaço de JSX é que mora em
// outro arquivo, para este aqui não virar uma parede de inputs.
interface FormState extends PackagingFormState {
  name: string;
  slug: string;
  segmentId: string;
  line: string;
  format: string;
  regulatoryProductType: string;
  poteContentsDescription: string;
  netWeight: string;
  description: string;
  ingredientsList: string;
  usageInstructions: string;
  benefitsText: string;
  generalBenefitsSummary: string;
  warnings: string;
  targetAudience: string;
  storageInstructions: string;
  technicalSheetTitle: string;
  priceText: string;
  minimumOrderPotes: number | "";
  sortOrder: number | "";
  active: boolean;
  technicalSheetVersion: number | "";
}

function toFormState(formula?: AdminFormulaDetailDTO): FormState {
  return {
    ...toPackagingFormState(formula),
    name: formula?.name ?? "",
    slug: formula?.slug ?? "",
    segmentId: formula?.segmentId ?? "",
    line: formula?.line ?? "",
    format: formula?.format ?? "",
    regulatoryProductType: formula?.regulatoryProductType ?? "",
    poteContentsDescription: formula?.poteContentsDescription ?? "",
    netWeight: formula?.netWeight ?? "",
    description: formula?.description ?? "",
    ingredientsList: formula?.ingredientsList ?? "",
    usageInstructions: formula?.usageInstructions ?? "",
    benefitsText: (formula?.benefits ?? []).join("\n"),
    generalBenefitsSummary: formula?.generalBenefitsSummary ?? "",
    warnings: formula?.warnings ?? "",
    targetAudience: formula?.targetAudience ?? "",
    storageInstructions: formula?.storageInstructions ?? "",
    technicalSheetTitle: formula?.technicalSheetTitle ?? "",
    priceText: formula?.listPriceCents != null ? centsToPlain(formula.listPriceCents) : "",
    minimumOrderPotes: formula?.minimumOrderPotes ?? 100,
    sortOrder: formula?.sortOrder ?? 0,
    active: formula?.active ?? false,
    // Ficha nova começa na versão 1 - é também o default da coluna no banco.
    technicalSheetVersion: formula?.technicalSheetVersion ?? 1,
  };
}

const nullIfEmpty = (value: string): string | null => (value.trim() === "" ? null : value.trim());

// Converte o estado local (strings de input) para o formato que a Server
// Action valida - é aqui que "16,90" vira 1690 centavos, texto vazio vira
// null, e a lista de benefícios (uma linha por item) vira array.
function toWritableInput(state: FormState): FormulaWritableInput {
  return {
    ...packagingFormStateToSpec(state),
    name: state.name.trim(),
    slug: state.slug.trim(),
    segmentId: state.segmentId,
    line: state.line as FormulaWritableInput["line"],
    format: state.format as FormulaWritableInput["format"],
    regulatoryProductType: nullIfEmpty(state.regulatoryProductType),
    poteContentsDescription: nullIfEmpty(state.poteContentsDescription),
    netWeight: nullIfEmpty(state.netWeight),
    description: state.description.trim(),
    // Não é mais editável aqui - vira DERIVADO da tabela estruturada
    // (NutritionTableEditor.tsx grava o texto via a Server Action própria,
    // updateNutritionTable, a cada vez que a tabela é salva). Enviar null
    // neste formulário garante duas coisas: fórmula nova nasce sem texto
    // solto (só a tabela estruturada define isto daqui em diante), e
    // diffInput (abaixo) nunca inclui nutritionalInfo no patch de uma
    // fórmula existente (o valor "atual" calculado por toWritableInput
    // também é sempre null - nunca há mudança a diffar).
    nutritionalInfo: null,
    ingredientsList: nullIfEmpty(state.ingredientsList),
    usageInstructions: nullIfEmpty(state.usageInstructions),
    benefits: state.benefitsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
    generalBenefitsSummary: nullIfEmpty(state.generalBenefitsSummary),
    warnings: nullIfEmpty(state.warnings),
    targetAudience: nullIfEmpty(state.targetAudience),
    storageInstructions: nullIfEmpty(state.storageInstructions),
    technicalSheetTitle: nullIfEmpty(state.technicalSheetTitle),
    listPriceCents: state.priceText.trim() === "" ? null : brlStringToCents(state.priceText),
    // Vazio volta para 100 (o DEFAULT da coluna no banco), nunca para 0: a
    // Server Action exige minimumOrderPotes >= 1 (CHECK minimum_order_potes >
    // 0) - mandar 0 aqui só trocaria a trava "campo vazio" por uma mensagem de
    // erro do servidor, o que não desbloqueia nada (ordem do dono, 17/09/2026).
    minimumOrderPotes: state.minimumOrderPotes === "" ? 100 : state.minimumOrderPotes,
    sortOrder: state.sortOrder === "" ? 0 : state.sortOrder,
    active: state.active,
    // Campo apagado no formulário volta para 1 (o mínimo aceito pelo banco), nunca
    // para 0 - versão de ficha começa em 1 e a constraint recusaria zero.
    technicalSheetVersion: state.technicalSheetVersion === "" ? 1 : state.technicalSheetVersion,
  };
}

// Só os campos que realmente mudaram desde o carregamento (comparado ao
// snapshot original guardado em useRef) - nunca reenvia o objeto inteiro
// como se fosse a verdade. Ver comentário de topo em lib/actions/formulas.ts.
function diffInput(current: FormulaWritableInput, original: FormulaWritableInput): FormulaWritablePatch {
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(current) as (keyof FormulaWritableInput)[]) {
    const currentValue = current[key];
    const originalValue = original[key];
    const changed = Array.isArray(currentValue) ? JSON.stringify(currentValue) !== JSON.stringify(originalValue) : currentValue !== originalValue;
    if (changed) patch[key] = currentValue;
  }
  return patch as FormulaWritablePatch;
}

export function FormulaForm({ segments, initial }: FormulaFormProps) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(() => toFormState(initial));
  const originalInput = useRef<FormulaWritableInput>(toWritableInput(toFormState(initial)));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as string]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // Mesma coisa que set(), só que recebendo um pedaço do estado - é o formato que
  // FormulaPackagingFields usa (ver o comentário do prop onChange lá).
  function setPatch(patch: Partial<FormState>) {
    setState((prev) => ({ ...prev, ...patch }));
    for (const key of Object.keys(patch)) {
      if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    setFormError(null);
    const input = toWritableInput(state);

    setPending(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de updateFormula/createFormula virava erro não tratado no
    // cliente e o botão ficava travado em "Salvando…".
    try {
      const result = initial ? await updateFormula(initial.id, diffInput(input, originalInput.current)) : await createFormula(input);

      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        const firstInvalidKey = Object.keys(result.fieldErrors ?? {})[0];
        if (firstInvalidKey) {
          const el = document.getElementById(`formula-${firstInvalidKey}`);
          el?.focus();
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Aviso não-bloqueante (ex.: EAN-13/DUN-14 com dígito verificador errado): a
      // fórmula salvou, só o código de barras ficou como PENDENTE - ver
      // gtinPendingWarning em lib/actions/formulas.ts.
      if (result.data.warnings) {
        for (const mensagem of Object.values(result.data.warnings)) {
          if (mensagem) toast.warning(mensagem);
        }
      }
      toast.success(initial ? "Fórmula salva." : "Fórmula criada.");
      originalInput.current = input;
      if (!initial) router.push(`/admin/catalogo/${result.data.id}`);
      else router.refresh();
    } catch (caught) {
      console.error("[FormulaForm] falha ao salvar fórmula:", caught);
      toast.error("Não foi possível salvar a fórmula agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="lc-admin-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="lc-admin-form-section">
        <h2>Identificação</h2>
        <div className="lc-admin-form-grid">
          {/* Não é mais "required": vazio grava como PENDENTE (ordem do dono, 17/09/2026 - ver lib/actions/formulas.ts). */}
          <TextField id="formula-name" label="Nome" value={state.name} onChange={(v) => set("name", v)} error={fieldErrors.name} />
          <TextField
            id="formula-slug"
            label="Slug (URL)"
            value={state.slug}
            onChange={(v) => set("slug", v)}
            error={fieldErrors.slug}
            // Não é mais "required": vazio gera um slug de rascunho automático
            // (ordem do dono, 17/09/2026 - ver lib/actions/formulas.ts).
            hint="Só letras minúsculas, números e hífen. Ex.: multivitaminico-adulto. Em branco, um slug de rascunho é gerado sozinho."
          />
          <SelectField
            id="formula-segmentId"
            label="Segmento"
            value={state.segmentId}
            onChange={(v) => set("segmentId", v)}
            error={fieldErrors.segmentId}
            placeholder="Selecione…"
            options={segments.map((s) => ({ value: s.id, label: s.name }))}
            required
          />
          <SelectField
            id="formula-line"
            label="Linha"
            value={state.line}
            onChange={(v) => set("line", v)}
            error={fieldErrors.line}
            placeholder="Selecione…"
            options={toSelectOptions(PRODUCT_LINE_LABELS)}
            required
          />
          <SelectField
            id="formula-format"
            label="Formato"
            value={state.format}
            onChange={(v) => set("format", v)}
            error={fieldErrors.format}
            placeholder="Selecione…"
            options={toSelectOptions(PRODUCT_FORMAT_LABELS)}
            required
          />
          <TextField
            id="formula-regulatoryProductType"
            label="Tipo regulatório"
            value={state.regulatoryProductType}
            onChange={(v) => set("regulatoryProductType", v)}
            error={fieldErrors.regulatoryProductType}
            hint="Texto do rótulo, ex.: SUPLEMENTO ALIMENTAR EM CÁPSULA."
          />
          <CheckboxField
            id="formula-active"
            label="Ativo (visível no catálogo público)"
            checked={state.active}
            onChange={(v) => set("active", v)}
            hint="Fora da linha Econômica, só pode ficar ativo com preço por pote definido. A Econômica pode ir ao ar sem preço (aparece como Preço sob consulta)."
          />
        </div>
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Apresentação</h2>
        <div className="lc-admin-form-grid">
          <TextField
            id="formula-poteContentsDescription"
            label="Apresentação do pote"
            value={state.poteContentsDescription}
            onChange={(v) => set("poteContentsDescription", v)}
            error={fieldErrors.poteContentsDescription}
            hint='Ex.: "60 cápsulas".'
          />
          <TextField id="formula-netWeight" label="Peso líquido" value={state.netWeight} onChange={(v) => set("netWeight", v)} error={fieldErrors.netWeight} />
          <TextField
            id="formula-technicalSheetTitle"
            // "Dossiê técnico" e não "ficha técnica": é o nome que o catálogo
            // usa em toda parte visível (título da página, botão do card, capa
            // dos dois PDFs). O campo do banco continua sendo
            // technical_sheet_title — quem edita aqui precisa reconhecer o que
            // está preenchendo pelo nome que verá no site.
            label="Título do dossiê técnico"
            value={state.technicalSheetTitle}
            onChange={(v) => set("technicalSheetTitle", v)}
            error={fieldErrors.technicalSheetTitle}
            full
          />
        </div>
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Conteúdo</h2>
        <div className="lc-admin-form-grid">
          <TextAreaField id="formula-description" label="Descrição" value={state.description} onChange={(v) => set("description", v)} error={fieldErrors.description} full />
          <p className="lc-admin-section-note lc-field--full">
            A informação nutricional agora tem editor próprio, estruturado por linha, mais abaixo nesta página (&quot;Informação nutricional&quot;) -
            o texto de rótulo é gerado a partir dali, não é mais digitado aqui.
          </p>
          <TextAreaField
            id="formula-ingredientsList"
            label="Declaração de ingredientes"
            value={state.ingredientsList}
            onChange={(v) => set("ingredientsList", v)}
            error={fieldErrors.ingredientsList}
            hint="Texto completo de ingredientes (INCI), diferente da composição por dose."
            full
          />
          <TextAreaField
            id="formula-usageInstructions"
            label="Modo de uso"
            value={state.usageInstructions}
            onChange={(v) => set("usageInstructions", v)}
            error={fieldErrors.usageInstructions}
            full
          />
          <TextAreaField
            id="formula-targetAudience"
            label="Público-alvo"
            value={state.targetAudience}
            onChange={(v) => set("targetAudience", v)}
            error={fieldErrors.targetAudience}
            rows={2}
          />
          <TextAreaField
            id="formula-storageInstructions"
            label="Conservação"
            value={state.storageInstructions}
            onChange={(v) => set("storageInstructions", v)}
            error={fieldErrors.storageInstructions}
            rows={2}
          />
          <TextAreaField id="formula-warnings" label="Advertências" value={state.warnings} onChange={(v) => set("warnings", v)} error={fieldErrors.warnings} full />
        </div>
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Benefícios</h2>
        <div className="lc-admin-form-grid">
          <TextAreaField
            id="formula-benefitsText"
            label="Lista de benefícios"
            value={state.benefitsText}
            onChange={(v) => set("benefitsText", v)}
            error={fieldErrors.benefits}
            hint="Um benefício por linha."
            full
          />
          <TextAreaField
            id="formula-generalBenefitsSummary"
            label="Resumo de benefícios"
            value={state.generalBenefitsSummary}
            onChange={(v) => set("generalBenefitsSummary", v)}
            error={fieldErrors.generalBenefitsSummary}
            rows={2}
            full
          />
        </div>
      </fieldset>

      {/* Pacote técnico: dado LOGÍSTICO (código de barras, peso, dimensão,
          quantidade por caixa). Fica separado do bloco regulatório logo abaixo de
          propósito - são naturezas diferentes e normalmente não é a mesma pessoa
          que preenche as duas. */}
      <FormulaPackagingFields state={state} fieldErrors={fieldErrors} onChange={setPatch} />

      <fieldset className="lc-admin-form-section">
        <h2>Ficha técnica e responsabilidade</h2>
        <p className="lc-admin-section-note">
          Dado REGULATÓRIO. A versão da ficha é o que a assinatura do responsável técnico carimba: só suba o número
          quando a mudança for grande a ponto de exigir nova aprovação — um ajuste de preço não é ficha nova. Depois de
          subir a versão, registre a nova aprovação no bloco “Assinatura da ficha técnica”, no fim desta página.
        </p>
        <div className="lc-admin-form-grid">
          <NumberField
            id="formula-technicalSheetVersion"
            label="Versão da ficha técnica"
            value={state.technicalSheetVersion}
            onChange={(v) => set("technicalSheetVersion", v)}
            error={fieldErrors.technicalSheetVersion}
            min={1}
          />
        </div>
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Comercial</h2>
        <div className="lc-admin-form-grid">
          <TextField
            id="formula-priceText"
            label="Preço por pote (R$)"
            value={state.priceText}
            onChange={(v) => set("priceText", v)}
            error={fieldErrors.listPriceCents}
            hint="Ex.: 16,90. Deixe em branco enquanto não houver preço definido."
          />
          <NumberField
            id="formula-minimumOrderPotes"
            label="Pedido mínimo (potes)"
            value={state.minimumOrderPotes}
            onChange={(v) => set("minimumOrderPotes", v)}
            error={fieldErrors.minimumOrderPotes}
            min={1}
            hint="Em branco volta para 100 (o padrão)."
          />
          <NumberField
            id="formula-sortOrder"
            label="Ordem de exibição"
            value={state.sortOrder}
            onChange={(v) => set("sortOrder", v)}
            error={fieldErrors.sortOrder}
            min={0}
          />
        </div>
      </fieldset>

      {formError ? (
        <p className="lc-field-error" role="alert">
          {formError}
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
