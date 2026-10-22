-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260923020000_linha_essencial.sql
--
-- Decisao do dono, 23/09/2026: o catalogo volta a ter DUAS linhas.
--
--   - Premium   : as formulas que ja estavam no catalogo (todas 'premium' desde a
--                 migration 20260918000000_linha_unica_e_duplicatas.sql).
--   - Essencial : a linha nova, criada nesta data, com os produtos pedidos em
--                 23/09/2026 (diabetes, saude da prostata, antioxidante,
--                 eletrolitos e a linha de gotas). "Pra nao ficar tudo misturado."
--
-- Por que um valor NOVO, e nao reaproveitar 'basica': 'basica' e o nome de uma
-- divisao que o dono encerrou em 14/09/2026 e continua gravado no historico das
-- formulas que sairam do ar naquela decisao. Renomear o valor reescreveria esse
-- historico; acrescentar 'essencial' nao toca em nada que ja existe.
--
-- ALTER TYPE ... ADD VALUE nao pode rodar na mesma transacao que USA o valor
-- novo (restricao do Postgres). Por isso esta migration so cria o valor; as
-- formulas da linha Essencial entram em outra transacao.
-- =====================================================================================

alter type public.product_line add value if not exists 'essencial';

comment on type public.product_line is
  'Linha comercial da formula - vira as abas do catalogo. Em uso desde 23/09/2026: premium (linha original) e essencial (linha nova). basica ficou so no historico (divisao encerrada em 14/09/2026).';
