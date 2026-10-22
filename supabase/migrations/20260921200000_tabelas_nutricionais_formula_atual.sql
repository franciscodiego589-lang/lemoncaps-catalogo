-- =====================================================================================================
-- 20260921200000_tabelas_nutricionais_formula_atual.sql
-- Tabelas de Informação Nutricional da FÓRMULA ATUAL (o que a fábrica entrega hoje) — 24 fórmulas ativas.
--
-- Fonte da composição: para as 15 fórmulas com arte de rótulo, a composição e a tabela impressas no rótulo
--   (docs/conformidade/composicoes_rotulo.json, extraído em 13/09/2026, e o PDF PRÉ TREINO_CÉSIO 137_420g.pdf lido em 16/09/2026);
--   para as 9 fórmulas sem rótulo, o cadastro ativo de public.formula_compositions lido em 16/09/2026.
-- Padrão: RDC 429/2020 (arts. 5º, 7º, 8º, 12 e 15) e IN 75/2020 (Anexos III, IV, VIII, XI, XII e XXII), lidas no AnvisaLegis em 16/09/2026;
--   %VD pelo Anexo VIII da IN 75 (adultos ≥ 19 anos; gestantes e lactantes no Multi Vitta), recalculado com os VDR vigentes;
--   célula de %VD vazia para constituinte sem VDR; rodapé literal da RDC 429/2020, art. 12, §5º.
-- Documento de referência: docs/conformidade/TABELAS-NUTRICIONAIS-FORMULA-ATUAL-2026-09-16.md; dados: docs/conformidade/dados-2026-09-16/fase3/tabelas-nutricionais-atual.json.
-- Gerada em 16/09/2026 por scratchpad/fase3/atual.py. APLICADA em 16/09/2026 pelo dono (supabase db push --linked, com as demais pendentes isoladas); conferido ao vivo: 24/24 com metadata.tabela_nutricional.
--
-- O que faz, por slug (idempotente):
--   1. guarda o nutritional_info atual em metadata->'nutritional_info_anterior_2026_09_16' (só se a chave ainda não existir);
--   2. grava o bloco de texto puro da tabela em nutritional_info;
--   3. grava a tabela estruturada, PLANA, em metadata->'tabela_nutricional' (formato do schema zod de lib/catalog/nutrition-table.ts:
--      porcoes_por_embalagem, porcao, grupos_vd, linhas[item, nivel, quantidade, unidade, kj, vd_pct, nota, provisorio], rodape); as demais chaves de metadata são preservadas.
-- Guardas: exatamente 24 fórmulas ativas e cada um dos 24 slugs presente e ativo; qualquer diferença aborta com raise exception.
-- Linhas com provisorio = true (e pendente = true quando quantidade é null) dependem de laudo, ficha técnica ou decisão do RT; a nota da linha diz o motivo.
-- Sem begin/commit explícitos: a CLI do Supabase aplica cada migration numa transação (convenção das demais migrations deste repositório).
-- =====================================================================================================

do $guarda$
declare
  v_ativas integer;
  v_slug text;
  v_slugs text[] := array['bella-gummy-biotina-em-gummy', 'biotina-em-capsula', 'creatina-monohidratada-150g-soluvel', 'detox-matinal-lemon-shot-300g', 'melatonina-em-gummy-sabor-uva', 'saude-intestinal', 'focus-colina', 'moro-slim', 'multivitaminico', 'dores-musculares', 'pro-energy', 'serena', 'zma-zinco-magnesio-e-vitamina-d', 'creatina-gummy-sabor-frutas-vermelhas', 'pre-treino-creatina-sabor-limao-420g', 'multi-vitta-gestante-e-lactante-em-capsula', 'melatonina-triptofanos-encapsulados', 'emagrecedor-em-capsula', 'slim-up-emagrecimento-em-gota', 'shot-colageno-300-gramas', 'omega-pro-tg', 'creatina-monohidratada-300g-soluvel', 'creatina-em-gummy-sabor-tutti-frutti', 'pre-treino-300-g'];
begin
  select count(*) into v_ativas from public.formulas where active and deleted_at is null;
  if v_ativas <> 24 then
    raise exception 'Esperadas exatamente 24 fórmulas ativas; encontradas %. Migration abortada.', v_ativas;
  end if;
  foreach v_slug in array v_slugs loop
    if not exists (select 1 from public.formulas where slug = v_slug and active and deleted_at is null) then
      raise exception 'Fórmula ativa não encontrada para o slug %. Migration abortada.', v_slug;
    end if;
  end loop;
end
$guarda$;

-- BELLA GUMMY (Biotina em Gummy) (bella-gummy-biotina-em-gummy) — fonte: rótulo BioGummy.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo BioGummy.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "6 g (2 gomas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 12,
   "unidade": "kcal",
   "kj": 50,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 1
   },
   "nota": "base da goma (sorbitol, maltitol, gelatina, maltodextrina, pectina, goma acácia) não quantificada no rótulo — a conta pelos insumos não é possível; valor impresso mantido",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 4.8,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 2
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "rótulo não imprime a linha; carboidratos 4,8 g − poliois 3,4 g = 1,4 g de outros carboidratos (maltodextrina/base) sem perfil de açúcares — pode passar de 0,5 g",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "lista de ingredientes do rótulo sem açúcar adicionado (sorbitol, maltitol, gelatina, água, glicerina, maltodextrina, pectina, goma acácia, ácido cítrico, citrato de sódio, aroma, sucralose)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Poliois totais",
   "nivel": 1,
   "quantidade": 3.4,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.6,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 1
   },
   "nota": "gelatina da base, não quantificada no rótulo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "gorduras totais impressas 0 g",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "gorduras totais impressas 0 g",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "pectina cítrica e goma acácia na base da goma, sem quantidade no rótulo; o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 8,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina A",
   "nivel": 0,
   "quantidade": 1020,
   "unidade": "µg RAE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 128
   },
   "nota": "acetato de retinol 1.020 mcg; o %VD impresso (170 % de 600) trata o número como RAE",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina E",
   "nivel": 0,
   "quantidade": 17,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 113
   },
   "nota": "DL-alfa-tocoferol 16,7 mg — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT; valor antes do arredondamento: 16,7 mg → declarado 17 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": 45,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 45
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Biotina",
   "nivel": 0,
   "quantidade": 45,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 150
   },
   "nota": "igual ao máximo do Anexo IV da IN 28 (45 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 2.4,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 22
   },
   "nota": "rótulo: 'bisglicinato de zinco 12 mg (equivalente a 2,4 mg de zinco)'; a tabela declara o elemento",
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo BioGummy.pdf (5 insumos), idêntica ao cadastro ativo do banco. Auditoria de 15/09/2026: 100 % CONFORME."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 12 kcal = 50 kJ | 1%
Carboidratos | 4,8 g | 2%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 3,4 g | 
Proteínas | 0,6 g | 1%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 8 mg | 0%
Vitamina A | 1.020 µg RAE | 128%
Vitamina E | 17 mg | 113%
Vitamina C | 45 mg | 45%
Biotina | 45 µg | 150%
Zinco | 2,4 mg | 22%
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'bella-gummy-biotina-em-gummy' and active and deleted_at is null;

-- Biotina em Cápsula (biotina-em-capsula) — fonte: rótulo BioPrincess.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo BioPrincess.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 2,
   "unidade": "kcal",
   "kj": 6,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "conta pelos insumos (critério único): colágeno hidrolisado 0,12 g × 4 = 0,5 kcal + maltodextrina e cápsula de gelatina sem quantidade no rótulo — não significativo nas duas leituras; kJ impresso 6 (2 kcal × 4,184 = 8)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.1,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "maltodextrina (excipiente) sem quantidade no rótulo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,1 g) → não significativo (Anexo IV)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes; ≤ 0,1 g",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0,3 g (colágeno hidrolisado 120 mg + gelatina da cápsula); L-metionina 110 mg e L-cisteína 100 mg não somadas (critério pendente do RT); o colágeno hidrolisado é fonte de proteínas do Anexo I e está ABAIXO DO MÍNIMO de 8,4 g (auditoria 4.6); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-metionina",
   "nivel": 1,
   "quantidade": 110,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-cisteína",
   "nivel": 1,
   "quantidade": 100,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "gorduras totais impressas 0 g",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "gorduras totais impressas 0 g",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição do rótulo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina A",
   "nivel": 0,
   "quantidade": 1500,
   "unidade": "µg RAE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 188
   },
   "nota": "acetato de retinol 1.500 mcg; %VD impresso (250 % de 600) trata como RAE",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 333
   },
   "nota": "igual ao máximo (50 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina E",
   "nivel": 0,
   "quantidade": 45,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 300
   },
   "nota": "acetato de DL-alfa-tocoferol 45 mg — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT (22,5 mg = 150 % pela IN 75; 30,15 mg = 201 % pela IN 28)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": 250,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 250
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Riboflavina",
   "nivel": 0,
   "quantidade": 2.7,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 225
   },
   "nota": "igual ao máximo (2,74 mg); valor antes do arredondamento: 2,74 mg → declarado 2,7 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Niacina",
   "nivel": 0,
   "quantidade": 35,
   "unidade": "mg NE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 233
   },
   "nota": "nicotinamida 35 mg = 35 mg NE; igual ao máximo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido pantotênico",
   "nivel": 0,
   "quantidade": 5.6,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 112
   },
   "nota": "igual ao máximo (5,64 mg); valor antes do arredondamento: 5,64 mg → declarado 5,6 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 10,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 769
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Biotina",
   "nivel": 0,
   "quantidade": 45,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 150
   },
   "nota": "igual ao máximo (45 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido fólico",
   "nivel": 0,
   "quantidade": 667,
   "unidade": "µg DFE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 167
   },
   "nota": "rótulo imprime 400 mcg de ácido fólico; em DFE (Anexo XXIII: 1 µg DFE = 0,6 µg de ácido fólico) = 400 / 0,6 = 666,67 → 667 µg DFE; o %VD impresso (167 %) já usa a conversão; valor antes do arredondamento: 666,67 µg DFE → declarado 667 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B12",
   "nivel": 0,
   "quantidade": 9.9,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 413
   },
   "nota": "metilcobalamina; igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Cobre",
   "nivel": 0,
   "quantidade": 900,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": "'cobre quelado' não identifica nenhuma das cinco formas do Anexo I — NÃO VERIFICADO (auditoria 4.6)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Iodo",
   "nivel": 0,
   "quantidade": 150,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Selênio",
   "nivel": 0,
   "quantidade": 60,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": "FORMA NÃO AUTORIZADA: 'selênio quelado' não consta das fontes de selênio do Anexo I da IN 28 (auditoria 4.6); a tabela declara o que o rótulo diz existir",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 15,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 136
   },
   "nota": "valor do elemento (tabela do rótulo: 136 % VD)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Metilsulfonilmetano",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "mg",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido hialurônico",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "lista de ingredientes: hialuronato de sódio; origem (fermentação de Streptococcus zooepidemicus) não declarada — NÃO VERIFICADO",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Silício",
   "nivel": 0,
   "quantidade": 0.72,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "PROVISÓRIO — rótulo declara 'silício orgânico (ácido ortossilícico) 50 mg' (massa do insumo); silício elementar calculado com o laudo Fagron lote 216957 (Si 1,43 %): 50 × 0,0143 = 0,715 mg; se o lote em uso for outro, o número muda; valor antes do arredondamento: 0,71 mg → declarado 0,72 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo BioPrincess.pdf (21 itens, inclusive colágeno hidrolisado 120 mg que o cadastro do banco removeu em 14/09). Auditoria de 15/09/2026: NÃO CONFORME.",
  "Colágeno hidrolisado 120 mg não recebe linha própria: é fonte de Proteínas (Anexo I da IN 28) e entra na linha Proteínas (ver ⚠).",
  "Seis constituintes exatamente no máximo do Anexo IV da IN 28 (riboflavina, niacina, ácido pantotênico, vitamina D, biotina, vitamina B12) — sem margem de fabricação (observação da auditoria)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 2 kcal = 6 kJ | 0%
Carboidratos | 0,1 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-metionina | 110 mg | 
  L-cisteína | 100 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.500 µg RAE | 188%
Vitamina D | 50 µg | 333%
Vitamina E | 45 mg | 300%
Vitamina C | 250 mg | 250%
Riboflavina | 2,7 mg | 225%
Niacina | 35 mg NE | 233%
Ácido pantotênico | 5,6 mg | 112%
Vitamina B6 | 10 mg | 769%
Biotina | 45 µg | 150%
Ácido fólico | 667 µg DFE | 167%
Vitamina B12 | 9,9 µg | 413%
Cobre | 900 µg | 100%
Iodo | 150 µg | 100%
Selênio | 60 µg | 100%
Zinco | 15 mg | 136%
Metilsulfonilmetano | 50 mg | 
Ácido hialurônico | 50 mg | 
Silício | 0,72 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'biotina-em-capsula' and active and deleted_at is null;

-- CREATINA MONOIDRATADA 150 g SOLÚVEL (creatina-monohidratada-150g-soluvel) — fonte: rótulo CreatinaPo.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo CreatinaPo.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "5 g (1 scoop)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "kcal",
   "kj": 0,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "creatina sem fator no Anexo XXII (critério único) — coincide com o impresso",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "composição: só creatina monoidratada",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Creatina",
   "nivel": 0,
   "quantidade": 5000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "creatina monoidratada 5.000 mg (massa nominal do insumo, como impresso: 'Creatina (mg) 5000 mg'); igual ao máximo de 5.000 mg (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo CreatinaPo.pdf (1 insumo), idêntica ao cadastro. Auditoria de 15/09/2026: 100 % CONFORME."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 5 g (1 scoop)
 | 5 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Creatina | 5.000 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'creatina-monohidratada-150g-soluvel' and active and deleted_at is null;

-- Detox Matinal (Lemon Shot) 300 g (detox-matinal-lemon-shot-300g) — fonte: rótulo Detox.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo Detox.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "10 g (1 dose)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 34,
   "unidade": "kcal",
   "kj": 143,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 2
   },
   "nota": "valor impresso (34 kcal); conta pelos insumos (critério único): maltodextrina 6,603 g × 4 + ácido cítrico 0,67 g × 3 = 28,4 kcal (+ carreadores dos extratos, desconhecidos) — diverge do impresso; kJ impresso 143 (34 × 4,184 = 142)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 8.5,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 3
   },
   "nota": "valor impresso (8,5 g); conta pelos insumos: maltodextrina 6,603 g (+ carreadores dos extratos, desconhecidos) — diverge do impresso",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "maltodextrina 6,603 g sem perfil de açúcares (laudo); o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "extratos de café verde (400 mg), cúrcuma (130 mg) e laranja moro (100 mg) sem laudo de composição; o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 5,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "5 mg ≤ 5 mg → não significativo (Anexo IV) → %VD 0",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": 1600,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 1600
   },
   "nota": "rótulo: 1,6 g = 1.600 mg",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 0.29,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 3
   },
   "nota": "ABAIXO DO MÍNIMO: 0,29 mg de zinco (rótulo: 'bisglicinato de zinco 1,45 mg (equivalente a 0,29 mg de zinco)') contra mínimo de 1,65 mg do Anexo III da IN 28 (auditoria 4.7)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Ácido clorogênico",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de café verde (Coffea arabica L.) 0,4 g sem laudo de padronização — teor de ácido clorogênico e de cafeína desconhecidos (auditoria 4.7)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Curcumina",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de rizomas de Curcuma longa L. 0,13 g sem laudo de curcuminoides (faixa da IN 28: 80 a 130 mg)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Antocianinas da laranja moro",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de laranja moro 0,1 g sem laudo de antocianinas (máximo 5 mg)",
   "pendente": true,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo Detox.pdf (11 itens). Auditoria de 15/09/2026: NÃO CONFORME. Aditivos (ácido cítrico 0,67 g, aroma 0,33 g, dióxido de silício 0,1 g, sucralose 0,05 g, corantes 0,017 g) não são constituintes e não entram na tabela; o ácido cítrico entra na conta de energia (3 kcal/g)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 34 kcal = 143 kJ | 2%
Carboidratos | 8,5 g | 3%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 5 mg | 0%
Vitamina C | 1.600 mg | 1600%
Zinco | 0,29 mg | 3%
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'detox-matinal-lemon-shot-300g' and active and deleted_at is null;

-- Melatonina em Gummy Sabor Uva (melatonina-em-gummy-sabor-uva) — fonte: rótulo DreamGummy.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo DreamGummy.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "6 g (2 gomas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 11,
   "unidade": "kcal",
   "kj": 46,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 1
   },
   "nota": "base da goma não quantificada no rótulo; valor impresso mantido",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 4.5,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 2
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "rótulo não imprime a linha; carboidratos 4,5 g − poliois 3,4 g = 1,1 g de outros carboidratos sem perfil de açúcares",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "lista de ingredientes do rótulo sem açúcar adicionado (conferido no JSON de extração)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Poliois totais",
   "nivel": 1,
   "quantidade": 3.4,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.8,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 2
   },
   "nota": "valor impresso 0,8 g; L-triptofano 800 mg (= 0,8 g) não conta como proteína pelo critério único (pendente do RT) — o impresso parece somar o triptofano; gelatina da base não quantificada",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-triptofano",
   "nivel": 1,
   "quantidade": 800,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma (pectina, goma) sem quantidade no rótulo; o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 8,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Melatonina",
   "nivel": 0,
   "quantidade": 0.21,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "igual ao máximo (0,21 mg)",
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo DreamGummy.pdf (2 insumos), idêntica ao cadastro. Auditoria de 15/09/2026: 100 % CONFORME. Ressalva da auditoria: documentos da fábrica divergem sobre este slug (Dream Gummy × Melatonina em Gummy só com melatonina)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 11 kcal = 46 kJ | 1%
Carboidratos | 4,5 g | 2%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 3,4 g | 
Proteínas | 0,8 g | 2%
  L-triptofano | 800 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 8 mg | 0%
Melatonina | 0,21 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'melatonina-em-gummy-sabor-uva' and active and deleted_at is null;

-- Saúde Intestinal (Floravex) (saude-intestinal) — fonte: rótulo Floravex-intestino.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo Floravex-intestino.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 4,
   "unidade": "kcal",
   "kj": 17,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (4 kcal); conta pelos insumos (critério único): inulina 135 mg + FOS 90 mg + psyllium 342 mg como fibras solúveis × 2 kcal/g = 1,1 kcal (+ extrato de cúrcuma e cápsula sem quantidade); L-glutamina não conta — não significativo nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,3 g); psyllium, inulina e FOS são fibras, não carboidratos disponíveis; extrato de cúrcuma 117 mg com carreador desconhecido — a conta não reproduz o impresso",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,3 g) → não significativo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0,3 g (gelatina da cápsula, não quantificada); L-glutamina 135 mg não somada (critério pendente do RT)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-glutamina",
   "nivel": 1,
   "quantidade": 135,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "ABAIXO DO MÍNIMO e sem laudo: psyllium 342 mg + inulina 135 mg + FOS 90 mg = 567 mg de fontes de fibra (teor de fibra de cada insumo sem laudo) contra mínimo de 5,7 g do Anexo III da IN 28 (auditoria 4.8); o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina A",
   "nivel": 0,
   "quantidade": 540,
   "unidade": "µg RAE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 68
   },
   "nota": "acetato de retinila 540 mcg; %VD impresso (90 % de 600) trata como RAE",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 1.3,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": "valor antes do arredondamento: 1,26 mg → declarado 1,3 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 90,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 21
   },
   "nota": "valor do elemento ('de bisglicinato de magnésio')",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 14,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 127
   },
   "nota": "valor do elemento; valor antes do arredondamento: 13,5 mg → declarado 14 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Curcumina",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de rizomas de Curcuma longa L. 117 mg sem laudo de curcuminoides (faixa 80 a 130 mg)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Quercetina",
   "nivel": 0,
   "quantidade": 72,
   "unidade": "mg",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo Floravex-intestino.pdf (11 itens). Auditoria de 15/09/2026: NÃO CONFORME; a fórmula impressa (1.001 mg + sais dos elementos) não cabe em 1 g — ponto para a fábrica."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-glutamina | 135 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 0 mg | 0%
Vitamina A | 540 µg RAE | 68%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 90 mg | 21%
Zinco | 14 mg | 127%
Curcumina | PENDENTE | 
Quercetina | 72 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'saude-intestinal' and active and deleted_at is null;

-- FOCUS COLINA (focus-colina) — fonte: rótulo FocusColina.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo FocusColina.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 4,
   "unidade": "kcal",
   "kj": 17,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — colina, aminoácidos, L-carnitina e inositol sem fator no Anexo XXII; cápsula sem quantidade — não significativo nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,3 g); conta pelos insumos: 0 g (nenhuma fonte de carboidrato na composição; a lista de ingredientes cita celulose microcristalina, sem quantidade)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,3 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0,3 g; L-tirosina 220 mg, L-teanina 115 mg e L-carnitina 95 mg não somadas (critério pendente do RT); gelatina da cápsula não quantificada",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-tirosina",
   "nivel": 1,
   "quantidade": 220,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "ABAIXO DO MÍNIMO: 220 mg contra 262,5 mg (nota viii do Anexo III da IN 28: soma de fenilalanina e tirosina; não há fenilalanina na fórmula) — auditoria 4.9; declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-teanina",
   "nivel": 1,
   "quantidade": 115,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); origem (folhas de Camellia sinensis, única forma autorizada) não declarada no rótulo — NÃO VERIFICADO",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição do rótulo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 5,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 33
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 1.3,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B12",
   "nivel": 0,
   "quantidade": 2.4,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": "cianocobalamina 2,4 mcg (o cadastro do banco diz metilcobalamina 9,94 mcg — divergência já registrada)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 60,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 14
   },
   "nota": "ABAIXO DO MÍNIMO: 60 mg de magnésio (elemento, tabela do rótulo 14 % VD) contra mínimo de 63 mg (auditoria 4.9)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Colina",
   "nivel": 0,
   "quantidade": 470,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 85
   },
   "nota": "rótulo: 'Colina (bitartarato de colina) 470 mg' — lido como colina (mesma convenção do magnésio no mesmo rótulo); se fosse massa do bitartarato (41 % de colina) seriam 193 mg; a tabela impressa não traz a linha",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "L-carnitina",
   "nivel": 0,
   "quantidade": 95,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Inositol",
   "nivel": 0,
   "quantidade": 25,
   "unidade": "mg",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo FocusColina.pdf (9 insumos). Auditoria de 15/09/2026: NÃO CONFORME. Cadastro do banco difere do rótulo em colina (438,14 mg), tirosina (262,5), magnésio (63), vitamina D (50 mcg) e B12 (metilcobalamina 9,94 mcg) — valores-teto, não a fórmula impressa."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-tirosina | 220 mg | 
  L-teanina | 115 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 5 µg | 33%
Vitamina B6 | 1,3 mg | 100%
Vitamina B12 | 2,4 µg | 100%
Magnésio | 60 mg | 14%
Colina | 470 mg | 85%
L-carnitina | 95 mg | 
Inositol | 25 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'focus-colina' and active and deleted_at is null;

-- MORO SLIM (moro-slim) — fonte: rótulo MoroSlim.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo MoroSlim.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 3,
   "unidade": "kcal",
   "kj": 12,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (3 kcal); conta pelos insumos: inulina 44 mg e psyllium 66 mg como fibras solúveis × 2 = 0,2 kcal; espirulina 122 mg e quitosana 122 mg sem laudo de proteína/fibra; extratos secos 640 mg sem laudo — não reproduzível; kJ impresso 12 (3 × 4,184 = 13)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.2,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,2 g); carreadores dos quatro extratos secos (640 mg) desconhecidos — não reproduzível",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,2 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0 g; espirulina (Arthrospira platensis) 122 mg é fonte de Proteínas no Anexo I e está ABAIXO DO MÍNIMO de 8,4 g (auditoria 4.10); teor proteico do insumo sem laudo",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "ABAIXO DO MÍNIMO e sem laudo: quitosana 122 mg + psyllium 66 mg + inulina 44 mg = 232 mg de fontes de fibra contra mínimo de 5,7 g (auditoria 4.10); extratos secos de composição desconhecida; o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina A",
   "nivel": 0,
   "quantidade": 1500,
   "unidade": "µg RAE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 188
   },
   "nota": "acetato de retinol 1.500 mcg; %VD impresso (250 % de 600) trata como RAE",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Cromo",
   "nivel": 0,
   "quantidade": 250,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 714
   },
   "nota": "valor do elemento (picolinato de cromo); igual ao máximo (250 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido clorogênico",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato seco de café verde 110 mg sem laudo de padronização (ácido clorogênico e cafeína)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Curcumina",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato seco de cúrcuma 135 mg sem laudo de curcuminoides (faixa 80 a 130 mg)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Antocianinas da laranja moro",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato seco de laranja moro 175 mg sem laudo de antocianinas (máximo 5 mg)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Saponinas de glicosídeos de furostanol",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato seco de feno-grego 220 mg sem laudo de saponinas (máximo 450 mg)",
   "pendente": true,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo MoroSlim.pdf (11 itens). Auditoria de 15/09/2026: NÃO CONFORME. O cadastro do banco cita guaraná na lista de ingredientes; o rótulo não traz guaraná (por isso não há linha de cafeína)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 3 kcal = 12 kJ | 0%
Carboidratos | 0,2 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 0 mg | 0%
Vitamina A | 1.500 µg RAE | 188%
Cromo | 250 µg | 714%
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'moro-slim' and active and deleted_at is null;

-- Multivitamínico (multivitaminico) — fonte: rótulo multivitaminico.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo multivitaminico.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 4,
   "unidade": "kcal",
   "kj": 17,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — nenhum insumo com fator; cápsula sem quantidade — não significativo nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,3 g); conta pelos insumos: 0 g",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,3 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0,3 g (gelatina da cápsula, não quantificada); L-teanina 150 mg não somada (critério pendente do RT)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-teanina",
   "nivel": 1,
   "quantidade": 150,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); origem (Camellia sinensis) não declarada — NÃO VERIFICADO",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina A",
   "nivel": 0,
   "quantidade": 1300,
   "unidade": "µg RAE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 163
   },
   "nota": "acetato de retinol 1.300 mcg; %VD impresso (217 % de 600) trata como RAE",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 333
   },
   "nota": "igual ao máximo (50 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina E",
   "nivel": 0,
   "quantidade": 10,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 67
   },
   "nota": "'acetato de tocoferol' 10 mg (D ou DL não especificado) — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina K",
   "nivel": 0,
   "quantidade": 149,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 124
   },
   "nota": "menaquinona-7 149 mcg; o rótulo marca '**' (VD não estabelecido); VDR vigente do Anexo VIII: 120 µg → 124 %",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": 100,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Tiamina",
   "nivel": 0,
   "quantidade": 1.2,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Riboflavina",
   "nivel": 0,
   "quantidade": 1.3,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 108
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Niacina",
   "nivel": 0,
   "quantidade": 16,
   "unidade": "mg NE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 107
   },
   "nota": "nicotinamida 16 mg = 16 mg NE",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido pantotênico",
   "nivel": 0,
   "quantidade": 5,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 1.3,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido fólico",
   "nivel": 0,
   "quantidade": 1333,
   "unidade": "µg DFE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 333
   },
   "nota": "PROVISÓRIO — contradição interna do rótulo: a composição diz 'ácido fólico 800 mcg' (leitura literal: 800 / 0,6 = 1.333,33 → 1.333 µg DFE = 333 % VD, ACIMA DO MÁXIMO de 1.281,5 µg DFE, auditoria 4.11); o %VD impresso (200 % de 400) só fecha se o 800 já for DFE (= 480 mcg de ácido fólico, conforme). A fábrica precisa dizer qual é; valor antes do arredondamento: 1.333,33 µg DFE → declarado 1.333 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina B12",
   "nivel": 0,
   "quantidade": 9.9,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 413
   },
   "nota": "cianocobalamina; igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Cobre",
   "nivel": 0,
   "quantidade": 900,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": "rótulo: 0,9 mg = 900 µg (bisglicinato de cobre)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Cromo",
   "nivel": 0,
   "quantidade": 35,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 260,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 62
   },
   "nota": "valor do elemento",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Selênio",
   "nivel": 0,
   "quantidade": 100,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 167
   },
   "nota": "selenito de sódio (forma autorizada no rótulo; o cadastro do banco diz 'selênio quelado')",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 15,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 136
   },
   "nota": "valor do elemento",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Boro",
   "nivel": 0,
   "quantidade": 3,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "FORMA NÃO AUTORIZADA: 'quelato de boro' não consta do Anexo I da IN 28 (formas: frutoborato de cálcio; tetraborato de sódio decahidratado) — auditoria 4.11; 3 mg de boro (elemento, declarado) abaixo do máximo de 8,866 mg; sem VDR → célula vazia",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo multivitaminico.pdf (20 itens). Auditoria de 15/09/2026: NÃO CONFORME. A fórmula impressa, com os sais que entregam os elementos, passa de 1.400 mg — não cabe em 1 g (ponto para a fábrica)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-teanina | 150 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.300 µg RAE | 163%
Vitamina D | 50 µg | 333%
Vitamina E | 10 mg | 67%
Vitamina K | 149 µg | 124%
Vitamina C | 100 mg | 100%
Tiamina | 1,2 mg | 100%
Riboflavina | 1,3 mg | 108%
Niacina | 16 mg NE | 107%
Ácido pantotênico | 5 mg | 100%
Vitamina B6 | 1,3 mg | 100%
Ácido fólico | 1.333 µg DFE | 333%
Vitamina B12 | 9,9 µg | 413%
Cobre | 900 µg | 100%
Cromo | 35 µg | 100%
Magnésio | 260 mg | 62%
Selênio | 100 µg | 167%
Zinco | 15 mg | 136%
Boro | 3 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'multivitaminico' and active and deleted_at is null;

-- DORES MUSCULARES (Nuviart) (dores-musculares) — fonte: rótulo Nuviart.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo Nuviart.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 4,
   "unidade": "kcal",
   "kj": 17,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (4 kcal); conta pelos insumos (critério único): colágeno hidrolisado 0,1 g × 4 + colágeno tipo II 0,04 g × 0,676 × 4 = 0,5 kcal; cápsula sem quantidade — não significativo nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,3 g); conta pelos insumos: 0 g",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,3 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.4,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0,4 g (colágeno hidrolisado 100 mg + colágeno tipo II 40 mg + gelatina da cápsula); o colágeno hidrolisado é fonte de Proteínas do Anexo I e está ABAIXO DO MÍNIMO de 8,4 g (auditoria 4.14); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 333
   },
   "nota": "igual ao máximo (50 µg); o rótulo imprime 1000 % (VD antigo de 5 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina E",
   "nivel": 0,
   "quantidade": 20,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 133
   },
   "nota": "DL-alfa-tocoferol 20 mg — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": 140,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 140
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 1.3,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B12",
   "nivel": 0,
   "quantidade": 9.9,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 413
   },
   "nota": "igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Cálcio",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "rótulo declara 'carbonato de cálcio 100 mg' (sal) e não declara o cálcio elementar em lugar nenhum; estequiometria (Ca/CaCO3 = 40,04 %) dá no máximo 40 mg — ABAIXO DO MÍNIMO de 180 mg em qualquer leitura (auditoria 4.14)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Ferro",
   "nivel": 0,
   "quantidade": 8,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 57
   },
   "nota": "PROVISÓRIO — incoerência do próprio rótulo: a composição declara 'bisglicinato de ferro 8 mg' (sal → 2,19 mg de ferro, ABAIXO DO MÍNIMO de 2,7 mg) e a tabela nutricional declara 'Ferro 8 mg (57 %)' como elemento; mantida a tabela impressa (auditoria 4.14: só a ficha técnica resolve)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "rótulo declara 'bisglicinato de magnésio 100 mg' (sal) e não declara o magnésio elementar; 14,1 mg (estequiométrico) a 30,4 mg (laudo INLAB 30,38 %) — ABAIXO DO MÍNIMO de 63 mg nas duas leituras (auditoria 4.14)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Selênio",
   "nivel": 0,
   "quantidade": 100,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 167
   },
   "nota": "FORMA NÃO AUTORIZADA: 'selênio quelado' não consta das fontes do Anexo I (auditoria 4.14)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 10,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 91
   },
   "nota": "PROVISÓRIO — incoerência do rótulo: composição 'bisglicinato de zinco 10 mg' (sal → 2,0 a 3,1 mg de zinco) × tabela 'Zinco 10 mg (91 %)' (elemento); mantida a tabela impressa; conforme nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Metilsulfonilmetano",
   "nivel": 0,
   "quantidade": 250,
   "unidade": "mg",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sulfato de glucosamina",
   "nivel": 0,
   "quantidade": 200,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "massa do sal, como impresso; a norma limita a glucosamina (base); a forma (sulfato com cloreto de potássio, IN 418/2025) não está completa no rótulo — NÃO VERIFICADO",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Colágeno tipo II não desnaturado",
   "nivel": 0,
   "quantidade": 40,
   "unidade": "mg",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo Nuviart.pdf (14 itens). Auditoria de 15/09/2026: NÃO CONFORME. O cadastro do banco (MSM 480,5 mg, sem colágeno hidrolisado, sem carbonato de cálcio, magnésio 100 mg como elemento) não é o rótulo.",
  "Colágeno hidrolisado 100 mg não recebe linha própria: é fonte de Proteínas (Anexo I) e entra na linha Proteínas (ver ⚠)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,4 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 50 µg | 333%
Vitamina E | 20 mg | 133%
Vitamina C | 140 mg | 140%
Vitamina B6 | 1,3 mg | 100%
Vitamina B12 | 9,9 µg | 413%
Cálcio | PENDENTE | 
Ferro | 8 mg | 57%
Magnésio | PENDENTE | 
Selênio | 100 µg | 167%
Zinco | 10 mg | 91%
Metilsulfonilmetano | 250 mg | 
Sulfato de glucosamina | 200 mg | 
Colágeno tipo II não desnaturado | 40 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'dores-musculares' and active and deleted_at is null;

-- Pro Energy (pro-energy) — fonte: rótulo ProEnergy.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo ProEnergy.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 4,
   "unidade": "kcal",
   "kj": 17,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — taurina, cafeína, L-carnitina e aspartato de arginina sem fator; guaraná em pó 200 mg e extrato de feno-grego 250 mg sem laudo de composição — não significativo nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,3 g); guaraná em pó e extrato de feno-grego sem laudo de carboidratos — não reproduzível",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,3 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0,3 g (gelatina da cápsula); taurina 200 mg, L-carnitina 90 mg e L-aspartato de L-arginina 75 mg não somados (critério pendente do RT); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-aspartato de L-arginina",
   "nivel": 1,
   "quantidade": 75,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "75 mg do sal (L-arginina e ácido aspártico, cada um abaixo de 75 mg), como impresso; declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "guaraná em pó 200 mg + extrato de feno-grego 250 mg = 450 mg < 0,5 g → não significativo mesmo se fossem 100 % fibra",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 10,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 769
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 4,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 36
   },
   "nota": "rótulo: bisglicinato de zinco 20 mg (sal); a tabela declara Zinco 4 mg (elemento)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Taurina",
   "nivel": 0,
   "quantidade": 200,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-carnitina",
   "nivel": 0,
   "quantidade": 90,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Cafeína",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "cafeína total desconhecida: cafeína anidra 150 mg (impresso) + cafeína do guaraná em pó 200 mg (teor sem laudo); o total ultrapassa o máximo de 200 mg se o guaraná tiver mais de 25 % de cafeína (auditoria 4.12) — só o laudo do lote de guaraná fixa a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Saponinas de glicosídeos de furostanol",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato seco de feno-grego 250 mg sem laudo de saponinas (máximo 450 mg)",
   "pendente": true,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo ProEnergy.pdf (9 itens). Auditoria de 15/09/2026: NÃO VERIFICÁVEL. Cadastro do banco difere em taurina (215 mg), cafeína (140 mg, 'cafeína') e cloridrato de L-arginina 75 mg."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-aspartato de L-arginina | 75 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina B6 | 10 mg | 769%
Zinco | 4 mg | 36%
Taurina | 200 mg | 
L-carnitina | 90 mg | 
Cafeína | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'pro-energy' and active and deleted_at is null;

-- Serena (serena) — fonte: rótulo Serena.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo Serena.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 mL (20 gotas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 1,
   "unidade": "kcal",
   "kj": 4,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (1 kcal); conta pelos insumos (critério único): 0 kcal — L-teanina, inositol e sais sem fator; veículo (glicerina vegetal, água) sem quantidade no rótulo e sem fator no Anexo XXII — não significativo nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,3 g); nenhuma fonte de carboidrato quantificada (glicerina não é carboidrato) — não reproduzível",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,3 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes (glicerina, água, sais, aroma, conservantes)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "0 g impresso; L-teanina 50 mg não conta pelo critério único (não é aminoácido das proteínas) — coincide",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "L-teanina",
   "nivel": 1,
   "quantidade": 50,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); igual ao mínimo (50 mg); origem (Camellia sinensis) não declarada — NÃO VERIFICADO",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "0 mg impresso; a lista de ingredientes traz citrato de sódio e benzoato de sódio sem quantidade — valor impresso mantido",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 1.3,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 63,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 15
   },
   "nota": "valor do elemento ('de cloreto de magnésio'); igual ao mínimo (63 mg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Melatonina",
   "nivel": 0,
   "quantidade": 0.21,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "igual ao máximo (0,21 mg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Inositol",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "mg",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo Serena.pdf (5 insumos), idêntica ao cadastro. Auditoria de 15/09/2026: NÃO VERIFICÁVEL."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 mL (20 gotas)
 | 1 mL | %VD*
Valor energético | 1 kcal = 4 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
  L-teanina | 50 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 63 mg | 15%
Melatonina | 0,21 mg | 
Inositol | 50 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'serena' and active and deleted_at is null;

-- ZMA (Zinco, Magnésio e Vitamina B6) (zma-zinco-magnesio-e-vitamina-d) — fonte: rótulo ZmaComplex.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo ZmaComplex.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 4,
   "unidade": "kcal",
   "kj": 17,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — L-teanina e sais sem fator; cápsula sem quantidade — não significativo nas duas leituras",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso (0,3 g); conta pelos insumos: 0 g",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ carboidratos impressos (0,3 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "valor impresso 0,3 g (gelatina da cápsula); L-teanina 150 mg não somada (critério pendente do RT); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-teanina",
   "nivel": 1,
   "quantidade": 150,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); origem (Camellia sinensis) não declarada — NÃO VERIFICADO",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 25,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 167
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 1.3,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 100
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 152,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 36
   },
   "nota": "rótulo: magnésio glicinato 500 mg (sal); a tabela declara Magnésio 152 mg (elemento)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 15,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 136
   },
   "nota": "rótulo: bisglicinato de zinco 75 mg (sal); a tabela declara Zinco 15 mg (elemento)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Boro",
   "nivel": 0,
   "quantidade": 3.1,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "PROVISÓRIO e FORMA NÃO AUTORIZADA: rótulo declara 'quelato de boro (glicinato de boro) 56,6 mg' (sal) e não declara o boro elementar; 56,6 × 5,43 % (laudo Analitic/INLAB lote 91125, citado na migration 20260915140000, não relido) = 3,07 mg; 'quelato de boro' não consta do Anexo I (auditoria 4.13); valor antes do arredondamento: 3,07 mg → declarado 3,1 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo ZmaComplex.pdf (7 itens). Auditoria de 15/09/2026: NÃO CONFORME. Dióxido de silício 217,1 mg (21,7 % da cápsula) é aditivo e não entra na tabela."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-teanina | 150 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 25 µg | 167%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 152 mg | 36%
Zinco | 15 mg | 136%
Boro | 3,1 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'zma-zinco-magnesio-e-vitamina-d' and active and deleted_at is null;

-- CREATINA GUMMY SABOR FRUTAS VERMELHAS (creatina-gummy-sabor-frutas-vermelhas) — fonte: rótulo creatina gummy.pdf (JSON de extração de 13/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo creatina gummy.pdf (JSON de extração de 13/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "6 g (2 gomas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 9,
   "unidade": "kcal",
   "kj": 38,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "base da goma não quantificada no rótulo; valor impresso mantido (creatina sem fator)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 1
   },
   "nota": "rótulo imprime '3,0 g'; Anexo III: primeira casa decimal 0 → declarar em número inteiro (3 g)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "rótulo não imprime a linha; carboidratos 3 g − poliois 2,7 g = 0,3 g de outros carboidratos sem perfil (≤ 0,5 g, mas a base não está quantificada)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes (conferido no JSON de extração)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Poliois totais",
   "nivel": 1,
   "quantidade": 2.7,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0.4,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "gelatina da base; creatina não conta (critério único); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma (pectina, goma) sem quantidade; o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 10,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 1
   },
   "nota": "10 mg > 5 mg → significativo; 10 / 2.000 = 0,5 % → 1 % (arredondamento para inteiro); o rótulo imprime 0 %",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Creatina",
   "nivel": 0,
   "quantidade": 3000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "creatina monoidratada 3.000 mg (massa nominal, como impresso); igual ao mínimo de 3.000 mg; declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo creatina gummy.pdf (1 insumo), idêntica ao cadastro. Auditoria de 15/09/2026: 100 % CONFORME. O `nutritional_info` do banco diz 'Porção: 3 g (2 gomas)'; o rótulo diz 6 g (2 gomas) — a tabela segue o rótulo."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 9 kcal = 38 kJ | 0%
Carboidratos | 3 g | 1%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 2,7 g | 
Proteínas | 0,4 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 10 mg | 1%
Creatina | 3.000 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'creatina-gummy-sabor-frutas-vermelhas' and active and deleted_at is null;

-- Pré-treino + Creatina Sabor Limão (420 g) — Césio 137 (pre-treino-creatina-sabor-limao-420g) — fonte: rótulo PRÉ TREINO_CÉSIO 137_420g.pdf (texto extraído e conferido visualmente em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "rótulo PRÉ TREINO_CÉSIO 137_420g.pdf (texto extraído e conferido visualmente em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "14 g (1 dose)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 45,
   "unidade": "kcal",
   "kj": 189,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 2
   },
   "nota": "valor impresso (45 kcal); conta pelos insumos (critério único): 0 kcal — creatina, aminoácidos, taurina, L-carnitina e cafeína sem fator no Anexo XXII e nenhuma fonte de carboidrato/proteína/gordura na composição; o impresso corresponde a 8 g de 'proteínas' × 4 + 3 g de carboidratos × 4 (o rótulo soma os aminoácidos como proteína); kJ impresso 189 (45 × 4,184 = 188)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 3,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 1
   },
   "nota": "valor impresso (3 g); conta pelos insumos: 0 g — nenhuma fonte de carboidrato na composição impressa (ácido cítrico é ácido orgânico; extrato de guaraná sem laudo)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "carboidratos impressos 3 g sem origem identificada na composição; o rótulo não imprime a linha",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "frase impressa: 'não contém quantidades significativas de açúcares adicionados…'",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 8,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 16
   },
   "nota": "valor impresso (8 g = 16 %); pelo critério único (pendente do RT) os aminoácidos livres não contam como proteína → 0 g; o rótulo soma beta-alanina 2 g + L-arginina 3,81 g + L-tirosina 1 g + L-carnitina 1 g (= 7,81 → 8 g)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-tirosina",
   "nivel": 1,
   "quantidade": 1000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-arginina",
   "nivel": 1,
   "quantidade": 3810,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "igual ao máximo exato (3.810 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Beta-alanina",
   "nivel": 1,
   "quantidade": 2000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "2 g em dose única; igual ao máximo diário de 2 g (IN 102/2021); a advertência VI·18 exige doses de no máximo 300 mg com 2 h de intervalo (parecer NC2); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "frase impressa de quantidade não significativa",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "frase impressa",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "frase impressa: 'não contém quantidades significativas de … fibras alimentares'",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 333
   },
   "nota": "colecalciferol; igual ao máximo (50 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Niacina",
   "nivel": 0,
   "quantidade": 35,
   "unidade": "mg NE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 233
   },
   "nota": "niacinamida 35 mg = 35 mg NE; igual ao máximo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B6",
   "nivel": 0,
   "quantidade": 90,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 6923
   },
   "nota": "cloridrato de piridoxina 90 mg (91,3 % do máximo de 98,60 mg); 90 / 1,3 = 6.923 %",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B12",
   "nivel": 0,
   "quantidade": 9.9,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 413
   },
   "nota": "metilcobalamina; igual ao máximo; valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 350,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 83
   },
   "nota": "valor do elemento ('de bisglicinato de magnésio'); igual ao máximo (350 mg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Taurina",
   "nivel": 0,
   "quantidade": 1000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Creatina",
   "nivel": 0,
   "quantidade": 5000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "creatina monoidratada 5.000 mg (massa nominal, como impresso); igual ao máximo (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-carnitina",
   "nivel": 0,
   "quantidade": 1000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Cafeína",
   "nivel": 0,
   "quantidade": 200,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "ACIMA DO MÁXIMO: 200 mg de cafeína anidra (impresso, já igual ao máximo de 200 mg) + a cafeína do extrato de guaraná 515 mg (sem laudo) → cafeína total > 200 mg em qualquer cenário (parecer NC1 / auditoria 4.15); a linha declara só a cafeína anidra impressa",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Extrato de guaraná (Paullinia cupana)",
   "nivel": 0,
   "quantidade": 515,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "FORMA NÃO AUTORIZADA: 'extrato de guaraná' (seco) não é nenhuma das formas do Anexo I — 'guaraná em pó (Paullinia cupana)' e 'extrato fluido de guaraná' (IN 450/2026) — parecer NC5; linha mantida como impressa no rótulo",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: rótulo da gráfica PRÉ TREINO_CÉSIO 137_420g.pdf (13 itens), idêntica ao cadastro do banco. Auditoria/parecer de 15/09/2026: NÃO CONFORME (sete não conformidades). A soma dos 13 itens é 15.000,06 mg numa porção de 14 g (107,1 %).",
  "O rótulo usa a nota de rodapé da RDC 360/2003 ('*% Valores diários de referência com base em uma dieta de 2.000 kcal ou 8.400 kJ' e '** Valor diário não estabelecido'), revogada; esta tabela usa o rodapé da RDC 429/2020 e deixa a célula vazia onde não há VDR.",
  "A ficha técnica de produção da fábrica (FRM-PRETREINO-14G-001, Rev.02 de 20/08/2026) traz L-arginina 1.000 mg, cafeína 150 mg e extrato de guaraná 224,5 mg — diverge do rótulo; qual está em produção é PENDENTE da fábrica (parecer)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 14 g (1 dose)
 | 14 g | %VD*
Valor energético | 45 kcal = 189 kJ | 2%
Carboidratos | 3 g | 1%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 8 g | 16%
  L-tirosina | 1.000 mg | 
  L-arginina | 3.810 mg | 
  Beta-alanina | 2.000 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 50 µg | 333%
Niacina | 35 mg NE | 233%
Vitamina B6 | 90 mg | 6923%
Vitamina B12 | 9,9 µg | 413%
Magnésio | 350 mg | 83%
Taurina | 1.000 mg | 
Creatina | 5.000 mg | 
L-carnitina | 1.000 mg | 
Cafeína | 200 mg | 
Extrato de guaraná (Paullinia cupana) | 515 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'pre-treino-creatina-sabor-limao-420g' and active and deleted_at is null;

-- Multi Vitta — Gestante e Lactante em Cápsula (multi-vitta-gestante-e-lactante-em-capsula) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "gestantes",
  "lactantes"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "kcal",
   "kj": 0,
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": "nenhum insumo com fator no Anexo XXII na composição cadastrada",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "gestantes": 0,
    "lactantes": 0
   },
   "nota": "PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada; a cápsula e os excipientes não estão no cadastro",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "µg",
   "vd_pct": {
    "gestantes": 333,
    "lactantes": 333
   },
   "nota": "igual ao máximo (50 µg) nos dois grupos",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina E",
   "nivel": 0,
   "quantidade": 5,
   "unidade": "mg",
   "vd_pct": {
    "gestantes": 33,
    "lactantes": 33
   },
   "nota": "acetato de DL-alfa-tocoferol 5 mg (cadastro) — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT; pela IN 28 (0,67) 3,35 mg, acima do mínimo de lactantes (2,85 mg) por 0,5 mg",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": 20,
   "unidade": "mg",
   "vd_pct": {
    "gestantes": 24,
    "lactantes": 17
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Niacina",
   "nivel": 0,
   "quantidade": 8,
   "unidade": "mg NE",
   "vd_pct": {
    "gestantes": 44,
    "lactantes": 47
   },
   "nota": "nicotinamida 8 mg = 8 mg NE; VDR do Anexo VIII: 18 mg NE (gestantes) e 17 mg NE (lactantes), lidos em 16/09/2026 (resolve a pendência 4 do gabarito)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido pantotênico",
   "nivel": 0,
   "quantidade": 5,
   "unidade": "mg",
   "vd_pct": {
    "gestantes": 83,
    "lactantes": 71
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ácido fólico",
   "nivel": 0,
   "quantidade": 1333,
   "unidade": "µg DFE",
   "vd_pct": {
    "gestantes": 222,
    "lactantes": 267
   },
   "nota": "ACIMA DO MÁXIMO nos dois grupos na leitura literal: cadastro 'ácido fólico 800 mcg' → 800 / 0,6 = 1.333 µg DFE contra máximos de 1.138,3 (gestantes) e 1.162,3 µg DFE (lactantes) — auditoria II.5; se o cadastro já estivesse em DFE (800 µg DFE = 133 % / 160 %) seria conforme; valor antes do arredondamento: 1.333,33 µg DFE → declarado 1.333 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Vitamina B12",
   "nivel": 0,
   "quantidade": 10,
   "unidade": "µg",
   "vd_pct": {
    "gestantes": 385,
    "lactantes": 357
   },
   "nota": "ACIMA DO MÁXIMO de lactantes: 10,46 µg contra 10,07 µg (gestantes: igual ao máximo de 10,46) — auditoria II.5; valor antes do arredondamento: 10,46 µg → declarado 10 µg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Cálcio",
   "nivel": 0,
   "quantidade": 300,
   "unidade": "mg",
   "vd_pct": {
    "gestantes": 23,
    "lactantes": 23
   },
   "nota": "cadastro: 'cálcio elementar (carbonato de cálcio) 300 mg'",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Cobre",
   "nivel": 0,
   "quantidade": 900,
   "unidade": "µg",
   "vd_pct": {
    "gestantes": 90,
    "lactantes": 69
   },
   "nota": "bisglicinato de cobre; valor lido como elemento (convenção do cadastro)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Ferro",
   "nivel": 0,
   "quantidade": 8.1,
   "unidade": "mg",
   "vd_pct": {
    "gestantes": 30,
    "lactantes": 81
   },
   "nota": "PROVISÓRIO — convenção do cadastro assumida (8,1 mg de ferro elementar de bisglicinato ferroso); se fosse massa do sal (27,38 %), 2,22 mg — ABAIXO DO MÍNIMO de gestantes (4,05 mg) — auditoria II.5",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 60,
   "unidade": "mg",
   "vd_pct": {
    "gestantes": 15,
    "lactantes": 17
   },
   "nota": "PROVISÓRIO — convenção do cadastro assumida (60 mg de magnésio elementar = mínimo exato de gestantes); se fosse massa do sal (30,38 %), 18,2 mg — ABAIXO DO MÍNIMO — auditoria II.5",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (12 linhas). Dióxido de silício 592,14 mg (59,2 % da cápsula) é aditivo e não entra na tabela. Auditoria II.5 (15/09/2026): NÃO CONFORME e COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (144,9 % a 161,0 % com os sais dos elementos).",
  "A lista de ingredientes cadastrada declara vitamina A, vitamina K2, 'complexo B', biotina, cromo e selênio sem quantidade na composição — cadastro incompleto; a tabela declara só o que tem quantidade cadastrada.",
  "Grupos populacionais: gestantes e lactantes (nome do produto e advertências); `target_audience` do banco diz 'Adultos com 19 anos ou mais' — erro de cadastro. %VD pelas colunas Gestantes e Lactantes do Anexo VIII da IN 75 (inclusive energia e macronutrientes, que o Anexo VIII traz por grupo: lido em 16/09/2026)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD* gestantes | %VD* lactantes
Valor energético | 0 kcal = 0 kJ | 0% | 0%
Carboidratos | 0 g | 0% | 0%
  Açúcares totais | 0 g |  | 
    Açúcares adicionados | 0 g | 0% | 0%
Proteínas | 0 g | 0% | 0%
Gorduras totais | 0 g | 0% | 0%
  Gorduras saturadas | 0 g | 0% | 0%
  Gorduras trans | 0 g | 0% | 0%
Fibras alimentares | 0 g | 0% | 0%
Sódio | 0 mg | 0% | 0%
Vitamina D | 50 µg | 333% | 333%
Vitamina E | 5 mg | 33% | 33%
Vitamina C | 20 mg | 24% | 17%
Niacina | 8 mg NE | 44% | 47%
Ácido pantotênico | 5 mg | 83% | 71%
Ácido fólico | 1.333 µg DFE | 222% | 267%
Vitamina B12 | 10 µg | 385% | 357%
Cálcio | 300 mg | 23% | 23%
Cobre | 900 µg | 90% | 69%
Ferro | 8,1 mg | 30% | 81%
Magnésio | 60 mg | 15% | 17%
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'multi-vitta-gestante-e-lactante-em-capsula' and active and deleted_at is null;

-- Melatonina + Triptofanos (Encapsulados) (melatonina-triptofanos-encapsulados) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "kcal",
   "kj": 0,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "critério único (pendente do RT): fosfatidilserina 70 mg como lipídeo × 9 = 0,63 kcal; aminoácidos livres 817,15 mg não somados (se somados, + 3,3 kcal = 3,9 kcal — ainda não significativo); calculado 0,63 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "critério único (pendente do RT): L-triptofano 572,38 mg, ácido L-aspártico 150 mg e L-glutamina 94,77 mg não contam como proteína (se contassem: 0,817 g → 0,8 g = 2 % VD); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-triptofano",
   "nivel": 1,
   "quantidade": 572,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); valor antes do arredondamento: 572,38 mg → declarado 572 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-glutamina",
   "nivel": 1,
   "quantidade": 95,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); valor antes do arredondamento: 94,77 mg → declarado 95 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Ácido L-aspártico",
   "nivel": 1,
   "quantidade": 150,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "fosfatidilserina 70 mg = 0,07 g de lipídeo; calculado 0,07 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "≤ gorduras totais 0,07 g ≤ 0,1 g",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada; a cápsula e os excipientes não estão no cadastro",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Biotina",
   "nivel": 0,
   "quantidade": 45,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 150
   },
   "nota": "igual ao máximo (45 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Magnésio",
   "nivel": 0,
   "quantidade": 63,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 15
   },
   "nota": "PROVISÓRIO — convenção do cadastro assumida (63 mg de magnésio elementar = mínimo exato); se fosse massa do bisglicinato, 8,9 a 19,1 mg — ABAIXO DO MÍNIMO (auditoria II.4)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 30,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 273
   },
   "nota": "cadastro 29,59 mg (= máximo exato do Anexo IV); o arredondamento do Anexo III (≥ 10 → inteiro) leva a 30 mg impressos, acima do máximo no papel; convenção elemento × sal assumida (auditoria II.4); valor antes do arredondamento: 29,59 mg → declarado 30 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Melatonina",
   "nivel": 0,
   "quantidade": 0.21,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "igual ao máximo (0,21 mg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fosfatidilserina",
   "nivel": 0,
   "quantidade": 70,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "origem (lecitina de soja) não declarada no cadastro — NÃO VERIFICADO",
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (9 linhas; dióxido de silício 20,01 mg é aditivo e não entra). Auditoria II.4 (15/09/2026): COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (126,3 % com os sais dos elementos). `warnings` e `ingredients_list` vazios no banco."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
  L-triptofano | 572 mg | 
  L-glutamina | 95 mg | 
  Ácido L-aspártico | 150 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Biotina | 45 µg | 150%
Magnésio | 63 mg | 15%
Zinco | 30 mg | 273%
Melatonina | 0,21 mg | 
Fosfatidilserina | 70 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'melatonina-triptofanos-encapsulados' and active and deleted_at is null;

-- Emagrecedor Em Cápsula (emagrecedor-em-capsula) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 cápsulas)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": null,
   "unidade": "kcal",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Vitamina A",
   "nivel": 0,
   "quantidade": null,
   "unidade": "µg RAE",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "declarada na lista de ingredientes (acetato de retinol) sem quantidade na composição",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "declarada na lista de ingredientes (ácido ascórbico) sem quantidade na composição",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Cromo",
   "nivel": 0,
   "quantidade": 250,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 714
   },
   "nota": "PROVISÓRIO — cadastro 'picolinato de Cromo 250 mcg': se é cromo elementar, 250 µg = máximo exato; se é massa do picolinato (12,43 % de Cr), 31,1 µg — auditoria II.3",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Cafeína",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "guaraná em pó declarado na lista de ingredientes sem quantidade nem laudo de cafeína",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Ácido clorogênico",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de café verde declarado na lista de ingredientes sem quantidade",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Curcumina",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "cúrcuma declarada na lista de ingredientes sem quantidade",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Antocianinas da laranja moro",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "laranja moro declarada na lista de ingredientes sem quantidade",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Saponinas de glicosídeos de furostanol",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato seco de feno-grego declarado na lista de ingredientes sem quantidade",
   "pendente": true,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (1 linha = 0,25 mg numa porção de 1.000 mg; 99,97 % da massa sem declaração). Auditoria II.3 (15/09/2026): NÃO VERIFICÁVEL. A tabela declara o que o cadastro diz existir; quase tudo fica PENDENTE até a ficha técnica ou a arte do rótulo com a composição completa."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
Proteínas | PENDENTE | 
Gorduras totais | PENDENTE | 
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Vitamina A | PENDENTE | 
Vitamina C | PENDENTE | 
Cromo | 250 µg | 714%
Cafeína | PENDENTE | 
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'emagrecedor-em-capsula' and active and deleted_at is null;

-- Slim Up — EMAGRECIMENTO EM GOTA (slim-up-emagrecimento-em-gota) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "PENDENTE",
 "porcao": "2 mL",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": null,
   "unidade": "kcal",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Poliois totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "inulina declarada na lista de ingredientes sem quantidade; extratos sem laudo",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Vitamina D",
   "nivel": 0,
   "quantidade": 50,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 333
   },
   "nota": "igual ao máximo (50 µg)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Vitamina B12",
   "nivel": 0,
   "quantidade": 9.9,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 413
   },
   "nota": "metilcobalamina; igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Cromo",
   "nivel": 0,
   "quantidade": 250,
   "unidade": "µg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 714
   },
   "nota": "PROVISÓRIO — 250 mcg lidos como cromo elementar (convenção do cadastro; = máximo exato); se fosse massa do picolinato, 31,1 µg — auditoria II.9",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Colina",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "bitartarato de colina declarado na lista de ingredientes sem quantidade na composição",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Ácido clorogênico",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de café verde 92,9 mg sem laudo de padronização (ácido clorogênico e cafeína)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Curcumina",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "cúrcuma declarada na lista de ingredientes sem quantidade na composição",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Saponinas de glicosídeos de furostanol",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato fluido de feno-grego 33 mg sem laudo de saponinas",
   "pendente": true,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (5 linhas). Porção cadastrada: 2 mL ('Ingerir 2 mL ao dia'); porções por embalagem: 'Conforme apresentação comercial' — frasco não cadastrado (PENDENTE). O memorial da fábrica (Slim Up rev03, lido na fase 1) fala em frasco de 30 mL e porção de 1 mL (30 gotas): divergência entre cadastro e memorial, sem rótulo para decidir.",
  "Auditoria II.9 (15/09/2026): NÃO VERIFICÁVEL. A lista de ingredientes declara cúrcuma, bitartarato de colina e inulina que não estão na composição (cadastro contraditório)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: PENDENTE
Porção: 2 mL
 | 2 mL | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
  Poliois totais | PENDENTE | 
Proteínas | PENDENTE | 
Gorduras totais | PENDENTE | 
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Vitamina D | 50 µg | 333%
Vitamina B12 | 9,9 µg | 413%
Cromo | 250 µg | 714%
Colina | PENDENTE | 
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'slim-up-emagrecimento-em-gota' and active and deleted_at is null;

-- SHOT + COLÁGENO 300 GRAMAS (shot-colageno-300-gramas) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "10 g (1 dose)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 32,
   "unidade": "kcal",
   "kj": 133,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 2
   },
   "nota": "PROVISÓRIO — colágeno hidrolisado 8.400 mg × 91,0 % de proteína (último teor conhecido: Verisol lote 10.236, laudo vencido em 15/05/2026; o Peptan AUTO040177 válido não tem doseamento) × 4 = 30,58 kcal + ácido cítrico 400 mg × 3 = 1,2 kcal + maltodextrina 31,35 mg × 4 = 0,125 kcal = 31,9 kcal; se o colágeno fosse 100 % proteína: 34,9 kcal",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "maltodextrina 31,35 mg = 0,031 g; calculado 0,031 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ 0,03 g de maltodextrina → não significativo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes (sucralose não é açúcar)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 7.6,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 15
   },
   "nota": "PROVISÓRIO — 8.400 mg de colágeno hidrolisado × 91,0 % (último teor conhecido, laudo vencido; lote em uso sem laudo) = 7,644 g; a 100 % seriam 8,4 g (= mínimo exato de proteínas do Anexo III da IN 28); qualquer teor abaixo de 100 % deixa ABAIXO DO MÍNIMO (auditoria II.8); valor antes do arredondamento: 7,64 g → declarado 7,6 g (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "sódio do colágeno hidrolisado (8,4 g) desconhecido — depende do laudo do insumo; pode passar de 5 mg; corante e aditivos sem laudo",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Vitamina C",
   "nivel": 0,
   "quantidade": 800,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 800
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Zinco",
   "nivel": 0,
   "quantidade": 1.7,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 15
   },
   "nota": "PROVISÓRIO — cadastro 1,65 mg (= mínimo exato) lido como elemento (convenção do cadastro); se fosse massa do bisglicinato, 0,33 a 0,51 mg — ABAIXO DO MÍNIMO; Anexo III arredonda 1,65 → 1,7 mg (auditoria II.8); valor antes do arredondamento: 1,65 mg → declarado 1,7 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Ácido clorogênico",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de café verde declarado na lista de ingredientes sem quantidade na composição (cadastro contraditório)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Curcumina",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de Curcuma longa declarado na lista de ingredientes sem quantidade na composição",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Antocianinas da laranja moro",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "extrato de laranja moro declarado na lista de ingredientes sem quantidade na composição",
   "pendente": true,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (9 linhas; aromatizante 200 mg, dióxido de silício 100 mg, sucralose 50 mg e corante 17 mg são aditivos e não entram; o ácido cítrico entra só na energia). Auditoria II.8 (15/09/2026): NÃO VERIFICÁVEL."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 32 kcal = 133 kJ | 2%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 7,6 g | 15%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | PENDENTE | 
Vitamina C | 800 mg | 800%
Zinco | 1,7 mg | 15%
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'shot-colageno-300-gramas' and active and deleted_at is null;

-- Ômega Pró TG (omega-pro-tg) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "1 g (2 softgels)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 9,
   "unidade": "kcal",
   "kj": 38,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe: óleo de peixe 1.000 mg × 9 kcal/g = 9 kcal",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe (cápsula de gelatina não cadastrada)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 1,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 2
   },
   "nota": "PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe; 1 g de lipídeos contra o mínimo de 5 g de lipídeos totais do Anexo III da IN 28 — se o mínimo se aplica ao óleo de peixe como fonte de EPA/DHA é interpretação pendente do RT/ANVISA (auditoria II.6)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "perfil de ácidos graxos do laudo do óleo",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "laudo do óleo",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras poli-insaturadas",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "laudo do óleo (linha necessária para declarar ômega 3 no 2º nível, Anexo XI)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Ômega 3",
   "nivel": 2,
   "quantidade": 317,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 8
   },
   "nota": "PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe: ômega-3 total 316,5 mg do cadastro (EPA 185,34 + DHA 123,56 + outros 7,6); valor antes do arredondamento: 316,5 mg → declarado 317 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "EPA",
   "nivel": 3,
   "quantidade": 185,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe; valor antes do arredondamento: 185,34 mg → declarado 185 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "DHA",
   "nivel": 3,
   "quantidade": 124,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe; valor antes do arredondamento: 123,56 mg → declarado 124 mg (Anexo III da IN 75; %VD sobre o valor declarado)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Colesterol",
   "nivel": 1,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "laudo do óleo",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada; a softgel e os excipientes não estão no cadastro",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "TABELA INTEIRA PROVISÓRIA: montada sobre o cadastro do banco (óleo de peixe TG 1.000 mg; ômega-3 total 316,5 mg; EPA 185,34 mg; DHA 123,56 mg; outros ômega-3 7,6 mg — as linhas 2 a 5 são componentes do óleo, não massa adicional), sem laudo do óleo, memorial nem rótulo. Auditoria II.6 (15/09/2026): NÃO VERIFICÁVEL; EPA + DHA = 308,9 mg, dentro de 37,5 a 2.000 mg."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 softgels)
 | 1 g | %VD*
Valor energético | 9 kcal = 38 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 1 g | 2%
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
  Gorduras poli-insaturadas | PENDENTE | 
    Ômega 3 | 317 mg | 8%
      EPA | 185 mg | 
      DHA | 124 mg | 
  Colesterol | PENDENTE | 
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'omega-pro-tg' and active and deleted_at is null;

-- CREATINA MONOIDRATADA 300 g SOLÚVEL (creatina-monohidratada-300g-soluvel) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "60",
 "porcao": "5 g (1 dose)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "kcal",
   "kj": 0,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "critério único (pendente do RT): creatina sem fator no Anexo XXII → 0 kcal (a irmã de 150 g com rótulo imprime 0 kcal)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "PROVISÓRIO — cadastro sem fonte de sódio (só creatina monoidratada); a irmã de 150 g com rótulo imprime 0 mg",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Creatina",
   "nivel": 0,
   "quantidade": 5000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "creatina monoidratada 5.000 mg (massa nominal do cadastro); igual ao máximo (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (1 linha). Porção: 5 g (1 dose), do modo de uso cadastrado ('Diluir 5 g (1 dose) em 200 mL de água'); porções por embalagem: 300 g ÷ 5 g = 60 (calculado — o cadastro não declara). Auditoria II.2 (15/09/2026): 100 % CONFORME PELO CADASTRO (selo condicionado à confirmação escrita do dono)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 60
Porção: 5 g (1 dose)
 | 5 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Creatina | 5.000 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'creatina-monohidratada-300g-soluvel' and active and deleted_at is null;

-- CREATINA EM GUMMY SABOR TUTTI-FRUTTI (creatina-em-gummy-sabor-tutti-frutti) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "2 gomas (massa da porção não cadastrada)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": null,
   "unidade": "kcal",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Poliois totais",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": null,
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": null,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": "PENDENTE"
   },
   "nota": "base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Creatina",
   "nivel": 0,
   "quantidade": 3000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "creatina monoidratada 3.000 mg (massa nominal do cadastro); igual ao mínimo (3.000 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (1 linha). Porção: 2 gomas ('Consumir 2 gomas ao dia'); a massa da porção não está cadastrada (a irmã Frutas Vermelhas tem 6 g por 2 gomas) — PENDENTE; porções por embalagem: 60 gomas ÷ 2 = 30 (calculado). Auditoria II.1 (15/09/2026): 100 % CONFORME PELO CADASTRO (selo condicionado à confirmação escrita do dono)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 2 gomas (massa da porção não cadastrada)
 | 2 gomas | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
  Poliois totais | PENDENTE | 
Proteínas | PENDENTE | 
Gorduras totais | PENDENTE | 
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Creatina | 3.000 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'creatina-em-gummy-sabor-tutti-frutti' and active and deleted_at is null;

-- PRÉ TREINO 300 G (pre-treino-300-g) — fonte: cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
update public.formulas set
  metadata = (case when metadata ? 'nutritional_info_anterior_2026_09_16' then metadata
              else metadata || jsonb_build_object('nutritional_info_anterior_2026_09_16', coalesce(nutritional_info, '')) end)
             || jsonb_build_object('tabela_nutricional', $json${
 "fonte": "cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)",
 "gerado_em": "2026-09-16",
 "porcoes_por_embalagem": "30",
 "porcao": "10 g (1 dose)",
 "grupos_vd": [
  "adultos_19_anos_ou_mais"
 ],
 "linhas": [
  {
   "item": "Valor energético",
   "nivel": 0,
   "quantidade": 5,
   "unidade": "kcal",
   "kj": 20,
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "critério único (pendente do RT): ácido cítrico 1.100 mg × 3 = 3,3 kcal + maltodextrina 342 mg × 4 = 1,368 kcal = 4,668 kcal → 5 kcal; aminoácidos livres (800 mg), taurina (2.000 mg), creatina e cafeína não somados (se aminoácidos e taurina contassem, + 11,2 kcal)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Carboidratos",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "maltodextrina 342 mg = 0,342 g; açúcares totais ≤ 0,342 g; calculado 0,342 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares totais",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": null,
   "nota": "≤ maltodextrina 0,342 g → não significativo",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Açúcares adicionados",
   "nivel": 2,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem açúcar na lista de ingredientes",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Proteínas",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "critério único (pendente do RT): L-tirosina 500 mg e beta-alanina 300 mg não contam como proteína (se contassem: 0,8 g = 2 % VD); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-tirosina",
   "nivel": 1,
   "quantidade": 500,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Beta-alanina",
   "nivel": 1,
   "quantidade": 300,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "300 mg por dose única (dentro da advertência VI·18: doses de no máximo 300 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "L-citrulina malato",
   "nivel": 1,
   "quantidade": null,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "declarada em primeiro lugar na lista de ingredientes cadastrada, sem quantidade na composição (que já soma 10.000 mg); L-citrulina não consta do Anexo I da IN 28 — se existir no produto, é FORMA NÃO AUTORIZADA (auditoria II.7)",
   "pendente": true,
   "provisorio": true
  },
  {
   "item": "Gorduras totais",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras saturadas",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Gorduras trans",
   "nivel": 1,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": null,
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Fibras alimentares",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "g",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "sem fonte de fibra na composição",
   "pendente": false,
   "provisorio": false
  },
  {
   "item": "Sódio",
   "nivel": 0,
   "quantidade": 0,
   "unidade": "mg",
   "vd_pct": {
    "adultos_19_anos_ou_mais": 0
   },
   "nota": "PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada (sem citrato de sódio); aditivos e corante sem laudo",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Taurina",
   "nivel": 0,
   "quantidade": 2000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "igual ao máximo (2.000 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Creatina",
   "nivel": 0,
   "quantidade": 5000,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "creatina monoidratada 5.000 mg (massa nominal do cadastro); igual ao máximo (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)",
   "pendente": false,
   "provisorio": true
  },
  {
   "item": "Cafeína",
   "nivel": 0,
   "quantidade": 200,
   "unidade": "mg",
   "vd_pct": null,
   "nota": "cafeína anidra 200 mg = máximo exato (não há guaraná nem café verde na composição)",
   "pendente": false,
   "provisorio": false
  }
 ],
 "rodape": "*Percentual de valores diários fornecidos pela porção",
 "observacoes": [
  "Composição-fonte: cadastro ativo (10 linhas; aromatizante 350 mg, dióxido de silício 118 mg e sucralose 90 mg são aditivos e não entram; o ácido cítrico entra só na energia). Auditoria II.7 (15/09/2026): NÃO VERIFICÁVEL (cadastro contraditório: L-citrulina malato e corante na lista de ingredientes sem massa na composição, que já fecha em 10.000 mg)."
 ]
}$json$::jsonb),
  nutritional_info = $txt$INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 5 kcal = 20 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
  L-tirosina | 500 mg | 
  Beta-alanina | 300 mg | 
  L-citrulina malato | PENDENTE | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Taurina | 2.000 mg | 
Creatina | 5.000 mg | 
Cafeína | 200 mg | 
*Percentual de valores diários fornecidos pela porção$txt$,
  updated_at = now()
where slug = 'pre-treino-300-g' and active and deleted_at is null;

do $conferencia$
declare v_n integer;
begin
  select count(*) into v_n from public.formulas where active and deleted_at is null and metadata ? 'tabela_nutricional' and metadata ? 'nutritional_info_anterior_2026_09_16';
  if v_n <> 24 then
    raise exception 'Após a gravação, % fórmulas ativas têm tabela_nutricional e backup; esperadas 24. Migration abortada.', v_n;
  end if;
end
$conferencia$;
