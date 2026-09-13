"use client";

import type { ChangeEvent, ReactNode } from "react";

// Campos reutilizáveis de formulário do admin - todos com rótulo SEMPRE
// visível (nunca só placeholder, regra de acessibilidade do projeto), erro
// inline com role="alert" e aria-invalid/aria-describedby corretos. Reusa as
// classes .lc-field* já existentes em app/globals.css (mesmas do carrinho
// público) - só acrescenta .lc-field-textarea/.lc-admin-select, novas.

interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  full?: boolean;
  required?: boolean;
}

function FieldShell({ id, label, error, hint, full, children }: BaseFieldProps & { children: ReactNode }) {
  return (
    <div className={`lc-field${full ? " lc-field--full" : ""}`}>
      <label className="lc-field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="lc-field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="lc-field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "date";
  placeholder?: string;
  autoComplete?: string;
}

export function TextField({ id, label, value, onChange, error, hint, full, required, type = "text", placeholder, autoComplete }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} full={full} required={required}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`lc-field-input${error ? " is-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

interface NumberFieldProps extends BaseFieldProps {
  value: number | "";
  onChange: (value: number | "") => void;
  min?: number;
  step?: number;
  placeholder?: string;
}

export function NumberField({ id, label, value, onChange, error, hint, full, required, min, step, placeholder }: NumberFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} full={full} required={required}>
      <input
        id={id}
        name={id}
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        step={step ?? 1}
        placeholder={placeholder}
        required={required}
        className={`lc-field-input${error ? " is-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const raw = event.target.value;
          onChange(raw === "" ? "" : Number(raw));
        }}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export function TextAreaField({ id, label, value, onChange, error, hint, full = true, required, rows = 4, placeholder }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} full={full} required={required}>
      <textarea
        id={id}
        name={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`lc-field-textarea${error ? " is-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField({ id, label, value, onChange, options, error, hint, full, required, placeholder }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} full={full} required={required}>
      <select
        id={id}
        name={id}
        value={value}
        required={required}
        className={`lc-admin-select${error ? " is-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}

export function CheckboxField({ id, label, checked, onChange, hint }: CheckboxFieldProps) {
  return (
    <div className="lc-field">
      <div className="lc-field-checkbox-row">
        <input id={id} name={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <label className="lc-field-label" htmlFor={id}>
          {label}
        </label>
      </div>
      {hint ? <p className="lc-field-hint">{hint}</p> : null}
    </div>
  );
}

// Lista de textos de tamanho livre (benefícios) - uma linha por item, textarea
// convertida para array no blur/submit. Guarda o texto cru enquanto o usuário
// digita (permite linha em branco temporária) e só filtra linhas vazias na
// hora de enviar (ver FormulaForm).
interface ListFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ListField({ id, label, value, onChange, error, hint, full = true }: ListFieldProps) {
  return (
    <TextAreaField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      hint={hint ?? "Um item por linha."}
      full={full}
      rows={5}
    />
  );
}
