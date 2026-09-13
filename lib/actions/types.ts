import type { ZodError } from "zod";

// Formato único de retorno de toda Server Action do /admin. Nunca devolve o
// registro inteiro do banco (next16-o-que-muda.md, seção 4, item 4) - só os
// campos que a UI realmente usa, em `data`.
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Partial<Record<string, string>> };

export function actionOk<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionError<T>(error: string, fieldErrors?: Partial<Record<string, string>>): ActionResult<T> {
  return { ok: false, error, fieldErrors };
}

// Reaproveitado por toda action com formulário de vários campos (fórmula,
// insumo, composição): converte o erro do zod num mapa {campo: mensagem} -
// só a primeira mensagem por campo, para o formulário focar o primeiro
// inválido sem repetir aviso.
export function zodIssuesToFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

// Mensagem estável para qualquer falha não prevista (nunca vaza stack técnico
// nem mensagem crua do Postgres para a tela).
export const GENERIC_ACTION_ERROR = "Não foi possível concluir agora. Tente novamente em instantes.";

// Traduz erros conhecidos do Postgres/PostgREST para mensagem em português
// compreensível. Qualquer código fora da lista cai na mensagem genérica -
// nunca expõe detalhe técnico (regra de segurança: "erro é tratado
// explicitamente e com mensagem compreensível para quem está na tela").
export function friendlyDbError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    const message = (error as { message?: unknown }).message;
    if (code === "23505") return "Já existe um registro com este mesmo identificador (slug). Escolha outro.";
    if (code === "23514" && typeof message === "string") {
      // check_violation - os triggers de negócio (ex.: mínimo de potes) já
      // levantam mensagem em português pronta para exibir.
      return typeof message === "string" && message.trim() !== "" ? message : GENERIC_ACTION_ERROR;
    }
    if (code === "23503") return "Este registro está em uso por outro dado e não pode ser removido ou alterado assim.";
  }
  return GENERIC_ACTION_ERROR;
}
