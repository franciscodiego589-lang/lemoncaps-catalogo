-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20261022120100_linha_lemon_caps_dados.sql
--
-- Parte 2 da linha Lemon Caps (ver 20261022120000_linha_lemon_caps.sql):
--   1. liga/desliga da aba no admin (public.catalog_lines), ligada;
--   2. a trava "formula no ar precisa de preco" aceita a Lemon Caps sem preco, como ja
--      aceita Premium e Economica ("Preco sob consulta");
--   3. as 16 formulas das fichas do Word passam para a linha lemon_caps. A lista de slugs
--      e o MAPA_TOTAL de anvisa/catalogo-lemon/cruzar_catalogo_word_planilha.py.
-- =====================================================================================

insert into public.catalog_lines (line, enabled)
values ('lemon_caps', true)
on conflict (line) do nothing;

comment on table public.catalog_lines is
  'Liga/desliga cada aba de linha do catalogo publico (premium, essencial = "Economica", lemon_caps = "Lemon Caps"). enabled=false esconde a aba e as formulas dela do site, sem alterar as formulas.';

alter table public.formulas drop constraint if exists formulas_active_requires_price;
alter table public.formulas add constraint formulas_active_requires_price
  check (not active or list_price_cents is not null or line in ('essencial', 'premium', 'lemon_caps'));

update public.formulas
   set line = 'lemon_caps', updated_at = now()
 where deleted_at is null
   and slug in (
     'detox-matinal-lemon-shot-300g',
     'creatina-gummy-sabor-frutas-vermelhas',
     'multivitaminico',
     'bella-gummy-biotina-em-gummy',
     'pro-energy',
     'biotina-em-capsula',
     'pre-treino-creatina-sabor-limao-420g',
     'melatonina-em-gummy-sabor-uva',
     'dores-musculares',
     'emagrecimento-em-gotas',
     'focus-colina',
     'emagrecimento-em-capsulas',
     'serena',
     'melatonina-triptofanos-encapsulados',
     'antioxidantes-e-longevidade-nac-em-capsulas',
     'energia-e-disposicao-complexo-b-em-capsulas'
   );
