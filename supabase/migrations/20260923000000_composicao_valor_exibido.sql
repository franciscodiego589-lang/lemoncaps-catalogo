-- Valor EXIBIDO da composição, separado da quantidade de produção.
--
-- Pedido do dono (23/09/2026): o catálogo é material de venda e o número que o
-- cliente lê na "Composição por dose" tem de cair dentro do mínimo e do máximo
-- da ANVISA para aquele constituinte. Em 32 linhas o banco guarda a massa de um
-- SAL, de um pó DILUÍDO ou de um EXTRATO com o nome do nutriente ("Zinco 75,41 mg"
-- = bisglicinato; "Vitamina D3 13,91 mg" = pó diluído) — número certo para a
-- produção, mas que para quem compara com a tabela da ANVISA parece acima do limite.
--
-- `quantity`/`unit` NÃO mudam: continuam sendo a massa pesada na produção e a
-- base do memorial de cálculo. As três colunas abaixo só dizem o que mostrar;
-- nulas = mostra quantity/unit como sempre. Preenchidas por
-- anvisa/catalogo-lemon/definir_valor_exibido.py (workspace do dono), a partir do
-- ativo já calculado em metadata->ativo_mg.
alter table public.formula_compositions
  add column if not exists display_name text,
  add column if not exists display_quantity numeric,
  add column if not exists display_unit text;

comment on column public.formula_compositions.display_name is
  'Nome exibido no catálogo quando difere de ingredient_name (ex.: "Antocianinas da laranja moro (Extrato de Laranja Moro)"). Nulo = ingredient_name.';
comment on column public.formula_compositions.display_quantity is
  'Quantidade exibida no catálogo (nutriente/marcador que a ANVISA limita). Nulo = quantity. Não é usada na produção.';
comment on column public.formula_compositions.display_unit is
  'Unidade exibida junto de display_quantity (ex.: "mcg", "mcg RAE", "mg NE"). Nulo = unit.';
