"use client";

// Campos do PACOTE TÉCNICO (embalagem e logística) do editor de fórmula. Extraído do
// FormulaForm porque são 12 campos: deixados lá dentro, aquele arquivo passaria de 500
// linhas e o formulário inteiro viraria uma parede de inputs. Aqui eles ficam com o
// próprio recorte, junto das duas funções puras que traduzem esses campos entre o
// estado do formulário (strings e números de input) e o formato que a Server Action
// valida.
//
// Por que este grupo é separado do resto do formulário na tela: dado LOGÍSTICO
// (código de barras, peso, dimensão, quantidade por caixa) é de outra natureza que
// dado REGULATÓRIO (composição, advertência, conformidade). Quem preenche um
// normalmente não é quem preenche o outro, e misturar os dois num bloco só já levou a
// gente a preencher campo errado em outros cadastros.
//
// Nenhum campo é obrigatório: as 28 fórmulas estão com tudo vazio hoje, à espera do
// levantamento do dono. Campo em branco vira null e some da tela pública - nunca "não
// informado".
import { NumberField, TextField } from "@/components/admin/FormFields";
import type { PackagingSpec } from "@/lib/catalog/packaging";

// Espelho do PackagingSpec no formato dos inputs: código de barras é texto (zero à
// esquerda é significativo num EAN, então nunca number), medida é número ou vazio.
export interface PackagingFormState {
  ean13: string;
  dun14: string;
  shelfLifeMonths: number | "";
  grossWeightG: number | "";
  packageHeightMm: number | "";
  packageWidthMm: number | "";
  packageDepthMm: number | "";
  unitsPerBox: number | "";
  boxHeightMm: number | "";
  boxWidthMm: number | "";
  boxDepthMm: number | "";
  boxGrossWeightG: number | "";
}

const EMPTY_PACKAGING: PackagingFormState = {
  ean13: "",
  dun14: "",
  shelfLifeMonths: "",
  grossWeightG: "",
  packageHeightMm: "",
  packageWidthMm: "",
  packageDepthMm: "",
  unitsPerBox: "",
  boxHeightMm: "",
  boxWidthMm: "",
  boxDepthMm: "",
  boxGrossWeightG: "",
};

const numberToField = (value: number | null | undefined): number | "" => (value == null ? "" : value);
const fieldToNumber = (value: number | ""): number | null => (value === "" ? null : value);

export function toPackagingFormState(spec?: PackagingSpec): PackagingFormState {
  if (!spec) return EMPTY_PACKAGING;
  return {
    ean13: spec.ean13 ?? "",
    dun14: spec.dun14 ?? "",
    shelfLifeMonths: numberToField(spec.shelfLifeMonths),
    grossWeightG: numberToField(spec.grossWeightG),
    packageHeightMm: numberToField(spec.packageHeightMm),
    packageWidthMm: numberToField(spec.packageWidthMm),
    packageDepthMm: numberToField(spec.packageDepthMm),
    unitsPerBox: numberToField(spec.unitsPerBox),
    boxHeightMm: numberToField(spec.boxHeightMm),
    boxWidthMm: numberToField(spec.boxWidthMm),
    boxDepthMm: numberToField(spec.boxDepthMm),
    boxGrossWeightG: numberToField(spec.boxGrossWeightG),
  };
}

export function packagingFormStateToSpec(state: PackagingFormState): PackagingSpec {
  const trimmed = (value: string): string | null => (value.trim() === "" ? null : value.trim());
  return {
    ean13: trimmed(state.ean13),
    dun14: trimmed(state.dun14),
    shelfLifeMonths: fieldToNumber(state.shelfLifeMonths),
    grossWeightG: fieldToNumber(state.grossWeightG),
    packageHeightMm: fieldToNumber(state.packageHeightMm),
    packageWidthMm: fieldToNumber(state.packageWidthMm),
    packageDepthMm: fieldToNumber(state.packageDepthMm),
    unitsPerBox: fieldToNumber(state.unitsPerBox),
    boxHeightMm: fieldToNumber(state.boxHeightMm),
    boxWidthMm: fieldToNumber(state.boxWidthMm),
    boxDepthMm: fieldToNumber(state.boxDepthMm),
    boxGrossWeightG: fieldToNumber(state.boxGrossWeightG),
  };
}

// Passo de 0,01 nas medidas: bate com numeric(10,2) do banco. Acima de duas casas a
// Server Action recusa em vez de deixar o Postgres arredondar calado.
const MEASURE_STEP = 0.01;

interface FormulaPackagingFieldsProps {
  state: PackagingFormState;
  fieldErrors: Partial<Record<string, string>>;
  // Recebe um pedaço do estado, não par chave/valor genérico: quem hospeda estes
  // campos (FormulaForm) tem um estado MAIOR que PackagingFormState, e um setter
  // genérico sobre o estado maior não é atribuível a um genérico sobre o menor (o
  // TypeScript não consegue provar a equivalência, mesmo sendo verdadeira). Um patch
  // parcial resolve isso sem cast e mantém a atualização imutável.
  onChange: (patch: Partial<PackagingFormState>) => void;
}

export function FormulaPackagingFields({ state, fieldErrors, onChange }: FormulaPackagingFieldsProps) {
  return (
    <>
      <fieldset className="lc-admin-form-section">
        <h2>Unidade de venda (o pote)</h2>
        <p className="lc-admin-section-note">
          Dado logístico do pote fechado, como sai da fábrica. É o que o comprador usa para calcular frete e espaço de
          estoque. Campo em branco não aparece no catálogo nem nos PDFs.
        </p>
        <div className="lc-admin-form-grid">
          <TextField
            id="formula-ean13"
            label="EAN-13 (código de barras da unidade)"
            value={state.ean13}
            onChange={(v) => onChange({ ean13: v })}
            error={fieldErrors.ean13}
            hint="13 dígitos, sem espaço nem hífen. Se o dígito verificador não conferir, o código fica como PENDENTE (vazio) e não trava o salvamento do restante da fórmula."
          />
          <NumberField
            id="formula-shelfLifeMonths"
            label="Prazo de validade (meses)"
            value={state.shelfLifeMonths}
            onChange={(v) => onChange({ shelfLifeMonths: v })}
            error={fieldErrors.shelfLifeMonths}
            min={1}
            hint="Ex.: 24. É o prazo do rótulo, contado da fabricação."
          />
          <NumberField
            id="formula-grossWeightG"
            label="Peso bruto da unidade (g)"
            value={state.grossWeightG}
            onChange={(v) => onChange({ grossWeightG: v })}
            error={fieldErrors.grossWeightG}
            min={0}
            step={MEASURE_STEP}
            hint="Produto + pote + tampa + rótulo. O peso líquido do rótulo continua no campo “Peso líquido”."
          />
          <NumberField
            id="formula-packageHeightMm"
            label="Altura da unidade (mm)"
            value={state.packageHeightMm}
            onChange={(v) => onChange({ packageHeightMm: v })}
            error={fieldErrors.packageHeightMm}
            min={0}
            step={MEASURE_STEP}
          />
          <NumberField
            id="formula-packageWidthMm"
            label="Largura da unidade (mm)"
            value={state.packageWidthMm}
            onChange={(v) => onChange({ packageWidthMm: v })}
            error={fieldErrors.packageWidthMm}
            min={0}
            step={MEASURE_STEP}
          />
          <NumberField
            id="formula-packageDepthMm"
            label="Profundidade da unidade (mm)"
            value={state.packageDepthMm}
            onChange={(v) => onChange({ packageDepthMm: v })}
            error={fieldErrors.packageDepthMm}
            min={0}
            step={MEASURE_STEP}
          />
        </div>
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Caixa de despacho</h2>
        <p className="lc-admin-section-note">
          A caixa fechada que sai no pedido. Sem estes números o cliente não monta palete nem fecha cotação grande.
        </p>
        <div className="lc-admin-form-grid">
          <TextField
            id="formula-dun14"
            label="DUN-14 (código de barras da caixa)"
            value={state.dun14}
            onChange={(v) => onChange({ dun14: v })}
            error={fieldErrors.dun14}
            hint="14 dígitos, sem espaço nem hífen. Se o dígito verificador não conferir, o código fica como PENDENTE (vazio) e não trava o salvamento do restante da fórmula."
          />
          <NumberField
            id="formula-unitsPerBox"
            label="Unidades por caixa"
            value={state.unitsPerBox}
            onChange={(v) => onChange({ unitsPerBox: v })}
            error={fieldErrors.unitsPerBox}
            min={1}
          />
          <NumberField
            id="formula-boxGrossWeightG"
            label="Peso bruto da caixa (g)"
            value={state.boxGrossWeightG}
            onChange={(v) => onChange({ boxGrossWeightG: v })}
            error={fieldErrors.boxGrossWeightG}
            min={0}
            step={MEASURE_STEP}
          />
          <NumberField
            id="formula-boxHeightMm"
            label="Altura da caixa (mm)"
            value={state.boxHeightMm}
            onChange={(v) => onChange({ boxHeightMm: v })}
            error={fieldErrors.boxHeightMm}
            min={0}
            step={MEASURE_STEP}
          />
          <NumberField
            id="formula-boxWidthMm"
            label="Largura da caixa (mm)"
            value={state.boxWidthMm}
            onChange={(v) => onChange({ boxWidthMm: v })}
            error={fieldErrors.boxWidthMm}
            min={0}
            step={MEASURE_STEP}
          />
          <NumberField
            id="formula-boxDepthMm"
            label="Profundidade da caixa (mm)"
            value={state.boxDepthMm}
            onChange={(v) => onChange({ boxDepthMm: v })}
            error={fieldErrors.boxDepthMm}
            min={0}
            step={MEASURE_STEP}
          />
        </div>
      </fieldset>
    </>
  );
}
