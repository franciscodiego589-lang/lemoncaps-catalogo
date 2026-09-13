import "server-only";

// O `.or()` do supabase-js não recebe SQL: recebe uma string na linguagem de
// filtro do PostgREST, no formato `coluna.operador.valor,coluna.operador.valor`.
// Interpolar texto do usuário ali não abre SQL injection — mas abre injeção de
// FILTRO, que é um problema real e foi comprovado na varredura de 13/09/2026:
//
//   termo: zzzz%,slug.not.is.null,name.ilike.%zzzz
//   vira:  or=(name.ilike.%zzzz%,slug.not.is.null,name.ilike.%zzzz%,...)
//
// `zzzz` não casava com nada e a consulta devolveu as 28 fórmulas: a condição
// `slug.not.is.null` que o atacante escreveu foi executada. Uma vírgula solta
// também derruba a consulta inteira com PGRST100 ("failed to parse logic tree").
//
// A RLS continua valendo por cima, então não há escalada de privilégio — o
// estrago é alterar o conjunto exportado no CSV e provocar erro 400. Ainda
// assim, entrada de usuário não deve poder reescrever a consulta.

/** Caracteres que o parser do PostgREST lê como sintaxe, não como conteúdo. */
const SINTAXE_POSTGREST = /[,.()"\\:]/g;

/**
 * Deixa o termo seguro para entrar num `.ilike` dentro de `.or()`.
 *
 * Remove o que o PostgREST interpretaria como estrutura e os curingas do
 * próprio LIKE (`%` e `_`), que de outro modo permitiriam ao visitante montar
 * padrões arbitrários. O `.` sai junto: ele separa coluna, operador e valor, e
 * ninguém busca cliente por ponto final.
 */
export function sanitizarTermoBusca(termo: string): string {
  return termo.replace(SINTAXE_POSTGREST, " ").replace(/[%_]/g, " ").trim().slice(0, 80);
}
