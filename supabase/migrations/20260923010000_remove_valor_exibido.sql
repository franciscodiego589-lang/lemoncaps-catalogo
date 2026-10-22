-- Desfaz 20260923000000_composicao_valor_exibido.sql no mesmo dia.
--
-- Decisão do dono (23/09/2026): o catálogo mostra SEMPRE a massa do insumo
-- (quantity/unit), em todas as linhas — nunca o ativo convertido ("deixe sempre
-- a massa em todos"). As colunas de exibição deixam de ter uso; só guardavam o
-- valor derivado de metadata->ativo_mg, que continua no metadata e pode ser
-- recalculado a qualquer momento.
alter table public.formula_compositions
  drop column if exists display_name,
  drop column if exists display_quantity,
  drop column if exists display_unit;
