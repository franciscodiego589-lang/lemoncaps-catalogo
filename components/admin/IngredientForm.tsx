"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/admin/FormFields";
import { INGREDIENT_CATEGORY_LABELS, toSelectOptions } from "@/components/admin/enum-labels";
import { createIngredient, updateIngredient, type IngredientWritableInput, type IngredientWritablePatch } from "@/lib/actions/ingredients";
import type { AdminIngredientDetailDTO } from "@/lib/data/admin";

interface IngredientFormProps {
  initial?: AdminIngredientDetailDTO;
}

interface FormState {
  name: string;
  slug: string;
  category: string;
  description: string;
  imagePath: string;
  claimText: string;
  claimSource: string;
  claimMinAmountText: string;
  claimVerifiedAt: string;
  active: boolean;
}

function toFormState(ingredient?: AdminIngredientDetailDTO): FormState {
  return {
    name: ingredient?.name ?? "",
    slug: ingredient?.slug ?? "",
    category: ingredient?.category ?? "outro",
    description: ingredient?.description ?? "",
    imagePath: ingredient?.imagePath ?? "",
    claimText: ingredient?.claimText ?? "",
    claimSource: ingredient?.claimSource ?? "",
    claimMinAmountText: ingredient?.claimMinAmount != null ? String(ingredient.claimMinAmount).replace(".", ",") : "",
    claimVerifiedAt: ingredient?.claimVerifiedAt ? ingredient.claimVerifiedAt.slice(0, 10) : "",
    active: ingredient?.active ?? true,
  };
}

const nullIfEmpty = (value: string): string | null => (value.trim() === "" ? null : value.trim());

function toWritableInput(state: FormState): IngredientWritableInput {
  const claimMinAmount =
    state.claimMinAmountText.trim() === "" ? null : Number(state.claimMinAmountText.replace(",", "."));
  return {
    name: state.name.trim(),
    slug: state.slug.trim(),
    category: state.category as IngredientWritableInput["category"],
    description: nullIfEmpty(state.description),
    imagePath: nullIfEmpty(state.imagePath),
    claimText: nullIfEmpty(state.claimText),
    claimSource: nullIfEmpty(state.claimSource),
    claimMinAmount: claimMinAmount !== null && Number.isFinite(claimMinAmount) ? claimMinAmount : null,
    claimVerifiedAt: state.claimVerifiedAt.trim() === "" ? null : state.claimVerifiedAt.trim(),
    active: state.active,
  };
}

function diffInput(current: IngredientWritableInput, original: IngredientWritableInput): IngredientWritablePatch {
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(current) as (keyof IngredientWritableInput)[]) {
    if (current[key] !== original[key]) patch[key] = current[key];
  }
  return patch as IngredientWritablePatch;
}

// Ficha por insumo (item 5 da tarefa): nome, categoria, descrição, imagem e
// os 4 campos de alegação ANVISA. claim_verified_at fica em branco até o dono
// conferir a norma vigente - nunca preenchido por suposição (regra de
// exatidão do AGENTS.md do projeto).
export function IngredientForm({ initial }: IngredientFormProps) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(() => toFormState(initial));
  const originalInput = useRef<IngredientWritableInput>(toWritableInput(toFormState(initial)));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as string]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    setFormError(null);
    const input = toWritableInput(state);

    setPending(true);
    const result = initial ? await updateIngredient(initial.id, diffInput(input, originalInput.current)) : await createIngredient(input);
    setPending(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.error);
      const firstInvalidKey = Object.keys(result.fieldErrors ?? {})[0];
      if (firstInvalidKey) document.getElementById(`ingredient-${firstInvalidKey}`)?.focus();
      return;
    }

    toast.success(initial ? "Insumo salvo." : "Insumo criado.");
    originalInput.current = input;
    if (!initial) router.push(`/admin/insumos/${result.data.id}`);
    else router.refresh();
  }

  return (
    <form className="lc-admin-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="lc-admin-form-section">
        <h2>Identificação</h2>
        <div className="lc-admin-form-grid">
          <TextField id="ingredient-name" label="Nome" value={state.name} onChange={(v) => set("name", v)} error={fieldErrors.name} required />
          <TextField
            id="ingredient-slug"
            label="Slug (URL)"
            value={state.slug}
            onChange={(v) => set("slug", v)}
            error={fieldErrors.slug}
            hint="Só letras minúsculas, números e hífen."
            required
          />
          <SelectField
            id="ingredient-category"
            label="Categoria"
            value={state.category}
            onChange={(v) => set("category", v)}
            error={fieldErrors.category}
            options={toSelectOptions(INGREDIENT_CATEGORY_LABELS)}
            required
          />
          <CheckboxField id="ingredient-active" label="Ativo" checked={state.active} onChange={(v) => set("active", v)} />
        </div>
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Ficha pública</h2>
        <div className="lc-admin-form-grid">
          <TextAreaField
            id="ingredient-description"
            label="Descrição"
            value={state.description}
            onChange={(v) => set("description", v)}
            error={fieldErrors.description}
            full
          />
          <TextField
            id="ingredient-imagePath"
            label="Imagem (caminho ou URL)"
            value={state.imagePath}
            onChange={(v) => set("imagePath", v)}
            error={fieldErrors.imagePath}
            full
          />
        </div>
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Alegação autorizada pela ANVISA</h2>
        <div className="lc-admin-form-grid">
          <TextAreaField
            id="ingredient-claimText"
            label="Texto da alegação"
            value={state.claimText}
            onChange={(v) => set("claimText", v)}
            error={fieldErrors.claimText}
            hint="Deixe em branco enquanto a alegação não tiver sido conferida contra a norma vigente."
            full
          />
          <TextField
            id="ingredient-claimSource"
            label="Fonte da norma"
            value={state.claimSource}
            onChange={(v) => set("claimSource", v)}
            error={fieldErrors.claimSource}
            hint="URL da IN/RDC vigente consultada."
            full
          />
          <TextField
            id="ingredient-claimMinAmountText"
            label="Quantidade mínima por porção"
            value={state.claimMinAmountText}
            onChange={(v) => set("claimMinAmountText", v)}
            error={fieldErrors.claimMinAmount}
            hint="Só o número (a unidade fica registrada junto ao texto da alegação)."
          />
          <TextField
            id="ingredient-claimVerifiedAt"
            label="Data da conferência"
            type="date"
            value={state.claimVerifiedAt}
            onChange={(v) => set("claimVerifiedAt", v)}
            error={fieldErrors.claimVerifiedAt}
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
