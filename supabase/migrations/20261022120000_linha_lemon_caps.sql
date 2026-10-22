-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20261022120000_linha_lemon_caps.sql
--
-- Pedido do dono em 22/10/2026: uma aba "Lemon Caps" no catalogo com as 16 formulas do
-- Word tecnico ("word tecnico lemon caps.docx") e da planilha de memorial de calculo, que
-- vao para o teste de estabilidade. As 16 saem das abas Premium e Economica.
--
-- Parte 1: o valor novo do enum. ALTER TYPE ... ADD VALUE nao pode ser usado na mesma
-- transacao em que e criado, por isso a linha da tabela catalog_lines, a trava de preco e a
-- troca de linha das formulas ficam na parte 2 (20261022120100_linha_lemon_caps_dados.sql).
-- =====================================================================================

alter type public.product_line add value if not exists 'lemon_caps';
