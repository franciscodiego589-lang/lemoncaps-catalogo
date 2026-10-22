"use client";

import { useActionState, useEffect, useRef } from "react";

import { signIn } from "@/lib/actions/auth";
import type { ActionResult } from "@/lib/actions/types";

interface LoginFormProps {
  redirectTo?: string;
}

async function runSignIn(_prevState: ActionResult<undefined> | null, formData: FormData) {
  return signIn(formData);
}

// Formulário de login (item 1 da tarefa). Usa <form action={...}> nativo do
// React 19 + useActionState: funciona com JavaScript desligado (POST comum) e
// dá estado de pendente/erro quando ligado. E-mail e senha têm rótulo
// sempre visível (nunca só placeholder) - regra de acessibilidade do
// projeto.
export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(runSignIn, null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const error = state && !state.ok ? state : null;
  // Erro sem fieldErrors (credenciais inválidas, usuário sem acesso staff) não
  // aponta pra um campo específico — de propósito, pra não revelar qual dos
  // dois está errado. Mas os dois campos precisam ficar marcados como
  // inválidos mesmo assim: sem isso, quem usa leitor de tela ouve o erro
  // geral (role="alert") mas os campos continuam aria-invalid="false" e sem
  // aria-describedby (achado da auditoria WCAG 2.2 AA de 14/09/2026).
  const hasFieldError = Boolean(error?.fieldErrors?.email) || Boolean(error?.fieldErrors?.password);
  const hasGeneralError = Boolean(error) && !hasFieldError;

  useEffect(() => {
    if (!error) return;
    if (error.fieldErrors?.email) emailRef.current?.focus();
    else if (error.fieldErrors?.password) passwordRef.current?.focus();
    else emailRef.current?.focus();
  }, [error]);

  return (
    <form className="lc-admin-form" action={formAction}>
      {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}

      <div className="lc-field">
        <label className="lc-field-label" htmlFor="admin-login-email">
          E-mail
        </label>
        <input
          ref={emailRef}
          id="admin-login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={`lc-field-input${error?.fieldErrors?.email || hasGeneralError ? " is-invalid" : ""}`}
          aria-invalid={Boolean(error?.fieldErrors?.email) || hasGeneralError}
          aria-describedby={error?.fieldErrors?.email ? "admin-login-email-error" : hasGeneralError ? "login-error" : undefined}
        />
        {error?.fieldErrors?.email ? (
          <p id="admin-login-email-error" className="lc-field-error" role="alert">
            {error.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="lc-field">
        <label className="lc-field-label" htmlFor="admin-login-password">
          Senha
        </label>
        <input
          ref={passwordRef}
          id="admin-login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`lc-field-input${error?.fieldErrors?.password || hasGeneralError ? " is-invalid" : ""}`}
          aria-invalid={Boolean(error?.fieldErrors?.password) || hasGeneralError}
          aria-describedby={error?.fieldErrors?.password ? "admin-login-password-error" : hasGeneralError ? "login-error" : undefined}
        />
        {error?.fieldErrors?.password ? (
          <p id="admin-login-password-error" className="lc-field-error" role="alert">
            {error.fieldErrors.password}
          </p>
        ) : null}
      </div>

      {error ? (
        <p id="login-error" className="lc-field-error" role="alert">
          {error.error}
        </p>
      ) : null}

      <button type="submit" className="lc-btn lc-btn-primary" disabled={isPending} aria-busy={isPending}>
        {isPending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
