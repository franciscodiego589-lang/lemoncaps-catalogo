# migrations-pendentes/

Migrations escritas, com sintaxe conferida, **nunca aplicadas** em nenhum banco, e que
**continuam potencialmente aplicáveis** — não conflitam com o estado real de produção
hoje (18/09/2026). Diferente de `../migrations-obsoletas/`, nada aqui foi descartado por
incompatibilidade de conteúdo.

## 20260921300000_staff_integracao.sql

Provisiona o usuário de integração (outro sistema interno do dono, que vai ler/editar
este catálogo pela API REST do Supabase) como `staff` ativo em `public.staff_profiles`,
com `can_manage_quotes = true`. Contexto completo no cabeçalho do próprio arquivo: troca
o uso da chave `service_role` (que não carimba autor em auditoria) por um usuário comum
do Supabase Auth, sujeito às mesmas RLS e ao mesmo `private.tg_write_audit()` de
qualquer humano do admin.

**Por que continua aqui, e não em `migrations-obsoletas/`:**
- Não toca `public.formulas`, `public.formula_compositions` nem nenhuma coluna de
  conformidade — é inteiramente independente de toda a novela de reformulação/selos/
  nomes de insumo que gerou as 4 migrations movidas para `migrations-obsoletas/` e a
  `supabase/migrations/20260922300000_correcoes_pos_reformulacao_direto_no_banco.sql`.
  Nada no banco mudou de um jeito que invalide o que esta migration faz.
- O único bloqueio é o mesmo de sempre, documentado no próprio arquivo: o marcador
  `<<UUID_DO_USUARIO_INTEGRACAO>>` precisa ser trocado pelo UUID real de um usuário
  criado manualmente no painel do Supabase (Authentication → Users → Add user,
  `integracao@lemoncaps.com.br`, com "Auto Confirm User" marcado) — isso não dá para
  automatizar por SQL, é ação humana no painel ou na Admin API.
- A guarda da própria migration (seção 1) já aborta com erro legível se o UUID ainda for
  o marcador ou não existir em `auth.users`, em vez de estourar um erro cru de foreign
  key — então rodá-la sem o passo manual feito é seguro (falha limpa), só não é útil.

**Como aplicar quando o dono estiver pronto:** seguir os 4 passos do cabeçalho do
próprio arquivo (criar o usuário no painel, copiar o UUID, substituir todas as
ocorrências do marcador, só então `supabase db push` ou colar no SQL Editor).

## As outras quatro que já passaram por aqui

`20260920000000_composicoes_conforme_rotulo.sql`,
`20260920100000_ingredientes_e_advertencias_do_rotulo.sql`,
`20260921000000_selos_conforme_rotulo.sql` e
`20260921100000_selos_conforme_cadastro_sem_rotulo.sql` — todas movidas para
`../migrations-obsoletas/` em 18/09/2026, com o motivo de cada uma (evidência contra o
banco real, não suposição) no `LEIA-ME.md` daquela pasta.
