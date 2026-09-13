-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260915140000_conformidade_laudos.sql - segunda leva de selo de conformidade ANVISA,
-- usando teor de laudo do insumo para converter SAL/QUELATO em ELEMENTO (mineral).
--
-- Contexto: a migration 20260914000000_conformidade.sql marcou 10 formulas 100%
-- conformes com base so na Tabela 1 (limite por insumo) do arquivo
-- lemoncaps-catalogo-planejamento/conformidade-anvisa.md. Nela, 4 formulas ficaram
-- "ACIMA DO LIMITE" e 14 "NAO VERIFICADO". Boa parte do "ACIMA DO LIMITE" era ERRO DE
-- COMPARACAO, nao produto irregular: o cadastro declara a MASSA TOTAL do sal/quelato
-- (ex.: "boro (quelato de boro) 56,6 mg"), enquanto a norma da ANVISA limita o ELEMENTO
-- (ex.: boro elementar, teto 8,866 mg) - comparar sal contra limite de elemento da falso
-- positivo. Essa investigacao esta inteira em
-- lemoncaps-catalogo-planejamento/teor-quelatos.md (12/09/2026), que foi ate os laudos
-- de materia-prima da fabrica (nao estimou nenhum teor) para achar o teor real de
-- magnesio, zinco e boro nos quelatos do ZMA, e ate o laudo do Siliciumax para achar o
-- teor de silicio do insumo usado em BIOPRINCESS e Biotina em Capsula.
--
-- IMPORTANTE - o que esta migration NAO faz: nao altera nenhuma linha de
-- formula_compositions. A quantidade exibida no catalogo continua sendo a massa do
-- sal/quelato, exatamente como esta hoje (decisao do dono). A conversao para elemento e
-- SO CALCULO INTERNO, feito aqui na migration, para decidir se a formula recebe o selo -
-- nunca gravado como novo valor de insumo.
--
-- ---------------------------------------------------------------------------------
-- CALCULO 1 - ZMA (Zinco, Magnesio e Vitamina B6) e ZMA Night (mesma composicao nas
-- duas, conferido ao vivo no banco em 12/09/2026: 6 insumos identicos, mesmas
-- quantidades)
-- ---------------------------------------------------------------------------------
--
-- Bisglicinato de magnesio, 673,055 mg no banco:
--   teor de magnesio: DOIS laudos, os dois VENCIDOS - INLAB lote 90844 (30,38%,
--   validade 21/06/2025, vencido ha ~14,7 meses) e SM/Fagron lote 088629 (30,0%,
--   validade 12/01/2024, vencido ha mais tempo ainda). Regra desta tarefa: usar o MAIS
--   CONSERVADOR (o que da mais elemento) = 30,38% (lote 90844).
--   673,055 x 0,3038 = 204,47 mg de magnesio elementar -> 204,47 / 350 = 58,4% do teto
--   (faixa 63-350 mg). CONFORME, com folga.
--   PENDENCIA PARA O DONO (nao impede este calculo, mas precisa de laudo novo antes de
--   fabricar): os DOIS laudos de magnesio em uso estao vencidos. Ja registrado como
--   pendencia interna no Relatorio de Nao Conformidades do ZMA da propria fabrica.
--
-- Bisglicinato de zinco, 119,02 mg no banco:
--   teor de zinco: um laudo so, Galena lote 055-ZN/25, 20,00%, validade 06/05/2027,
--   VIGENTE. 119,02 x 0,20 = 23,80 mg de zinco elementar -> 23,80 / 29,59 = 80,4% do
--   teto (faixa 1,65-29,59 mg). CONFORME.
--
-- Boro (quelato de boro), 56,6 mg no banco - o item que a auditoria original marcou
-- "6,38x acima do limite" ao dividir 56,6 mg direto pelo teto de 8,866 mg, sem converter
-- sal em elemento:
--   teor de boro: DOIS laudos vigentes - Valdequimica lote 044951 (5,30%, validade
--   17/12/2027, e o lote que o memorial oficial da fabrica adota) e Analitic/INLAB lote
--   91125 (5,43%, validade 02/10/2026, vigente mas vence em ~20 dias). Mais conservador
--   (mais elemento) = 5,43% (lote 91125).
--   56,6 x 0,0543 = 3,07 mg de boro elementar -> 3,07 / 8,866 = 34,7% do teto (minimo
--   nao estabelecido). CONFORME - nem perto do teto, muito menos 6,38x acima.
--   PENDENCIA PARA O DONO (nao bloqueia o selo desta migration, que e so sobre DOSE, mas
--   precisa de decisao): o proprio Relatorio de Nao Conformidades do ZMA da fabrica ja
--   registra que "quelato de boro" nao consta na lista de fontes de boro autorizadas
--   pelo painel da ANVISA (so frutoborato de calcio e tetraborato de sodio decahidratado
--   estao autorizados) - problema de IDENTIDADE QUIMICA da fonte, nao de dose. O mesmo
--   tipo de problema (fonte nao autorizada), sem nota, ja existe hoje no
--   "boro (quelato de boro) 3 mg" do Multivitaminico, que ja recebeu selo na migration
--   anterior - esta migration mede pela mesma vara das outras 10 formulas (dose contra a
--   Tabela 1), nao introduz um criterio novo so para o ZMA.
--
-- L-teanina 150 mg, vitamina B6 1,3 mg e vitamina D 50 mcg: ja eram CONFORME na
-- auditoria original (nao sao sal/quelato, nao precisam de conversao).
--
-- Resultado: as 6 linhas de insumo do ZMA e do ZMA Night ficam CONFORME. As duas
-- formulas passam a 100% conformes.
--
-- ---------------------------------------------------------------------------------
-- CALCULO 2 - BIOPRINCESS e Biotina em Capsula (silicio organico / Siliciumax)
-- ---------------------------------------------------------------------------------
--
-- Laudo encontrado (nao existia teor de silicio elementar no banco nem na auditoria
-- original, insumo estava "NAO VERIFICADO"): Certificado de Analise Fagron, insumo
-- "SILICIUMAX PO Silicio Organico" (acido ortossilicico estabilizado em maltodextrina,
-- composicao 95% maltodextrina + 5% gel acido silicico), lote interno
-- 25L02-B003-216957 / lote fabricante OP25211, fabricacao 29/07/2025, validade
-- 29/07/2029 (VIGENTE), conclusao APROVADO. Arquivo:
-- /Users/diegofrancisco/Desktop/POPS/laudos/_LAUDOS_IN_HAIR_60CAPS/03_Silicio_Acido-Ortossilicico.png
-- (mesmo lote 216957 citado no memorial oficial da fabrica em
-- MEMORIAIS_2026/01_BIO-PRINCESS/ARQUIVOS-PDF/09_laudo_siliciumax-silicio-organico_lote-216957.pdf,
-- confirmando que e o laudo realmente usado pela fabrica para este insumo). Resultado
-- medido de Silicio (Si): 1,4300% (especificacao 1,5% +-10%, ou seja 1,35%-1,65% - o
-- resultado medido esta dentro da faixa).
--
-- BIOPRINCESS declara "Siliciumax (acido ortosilicico estabilizado) 50 mg":
--   50 x 0,0143 = 0,715 mg de silicio elementar -> 0,715 / 15,67 = 4,6% do teto de
--   15,67 mg (minimo nao estabelecido). CONFORME, com folga grande. Checagem de
--   sensibilidade no cenario mais conservador (topo da faixa de especificacao, 1,65%):
--   50 x 0,0165 = 0,825 mg -> 5,3% do teto. Continua CONFORME nos dois cenarios.
--
-- Biotina em Capsula declara "silicio organico (acido ortossilicico) 50 mg" - mesmo
-- composto, mesma quantidade. NAO foi encontrado um laudo separado e proprio desta
-- formula para esse insumo (busca completa em laudos/, 14_ROTULAGEM/,
-- 19_SISTEMA_MEMORIAIS/, ordens de producao, _geradores/ e mdfind por "Siliciumax",
-- "ortossilicico", "silicio"). Pela regra de "um laudo por insumo" ja praticada pela
-- fabrica (mesmo teor aplicado ao mesmo composto em formulas diferentes - o mesmo
-- raciocinio usado para o zinco Galena em varias formulas), aplico aqui o MESMO teor de
-- 1,43% - registrado como PRESSUPOSTO (mesmo insumo, mesmo composto, nenhum laudo
-- alternativo encontrado), nao como leitura direta de um laudo exclusivo desta formula.
-- Calculo identico ao de cima: CONFORME, 4,6% do teto.
--
-- Biotina em Capsula tinha TAMBEM iodo e selenio "ACIMA DO LIMITE" (163x/188x) na
-- auditoria de 12/09/2026, por erro de unidade (mg em vez de mcg) - ja corrigido no
-- banco por outra sessao antes desta migration (conferido ao vivo agora via Management
-- API: iodo = 150 mcg, selenio = 60 mcg, os dois CONFORME contra 22,5-919,02 mcg e
-- 8,25-319,75 mcg). Com o silicio resolvido, BIOPRINCESS e Biotina em Capsula nao tem
-- mais nenhum insumo ACIMA do limite nem NAO VERIFICADO - todas as linhas de insumo de
-- ambas (20 e 21 linhas, respectivamente, conferidas uma a uma nesta migration contra a
-- Tabela 1) ficam CONFORME.
--
-- PENDENCIA PARA O DONO, achada de passagem e NAO investigada a fundo (fora do escopo
-- desta tarefa, e a formula ja estava marcada CONFORME nesta linha antes desta
-- migration): na linha "zinco (bisglicinato de zinco) 29,59 mg" da BIOPRINCESS, o valor
-- 29,59 mg bate exatamente com o TETO legal de zinco, nao com nenhum teor de laudo - o
-- memorial oficial da fabrica e o dado publicado internamente apontam 15 mg de zinco
-- elementar para esse produto (75,41 mg de bisglicinato x 19,89% de teor). Continua
-- CONFORME (29,59 <= 29,59, no limite exato) porque assim ja estava antes desta
-- migration e o item nao e um sal/quelato com teor recem-descoberto - registrado so para
-- o dono conferir esse dado especifico no catalogo.
--
-- NOTA SOBRE COMPLIANCE_SOURCE: mantido como a mesma URL primaria (AnvisaLegis, IN
-- 28/2018) usada nas 10 formulas anteriores, pelo mesmo motivo de la (e a fonte dos
-- LIMITES). A atribuicao dos laudos de insumo (lote e data, listados acima) fica
-- registrada aqui, no comentario da migration, e no documento
-- lemoncaps-catalogo-planejamento/conformidade-anvisa.md - a coluna compliance_source e
-- text unico (nao array) e ja carrega um proposito definido (URL da norma) nas 10 linhas
-- existentes; poluir esse campo so nestas 4 linhas quebraria a consistencia dos dados.
--
-- ORDEM DE EXECUCAO: depois de 20260914000000_conformidade.sql (cria as 3 colunas e
-- marca as 10 primeiras formulas).
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. MARCA AS 4 FORMULAS QUE A CONTA ACIMA COMPROVOU 100% CONFORMES
-- ---------------------------------------------------------------------------------
-- IDs conferidos ao vivo no banco de producao via Management API (select id, name from
-- public.formulas), nao supostos. Timestamp as 20h (nao 00h, horario usado na migration
-- anterior) so para marcar visualmente que esta e uma segunda leva de verificacao, feita
-- mais tarde no mesmo dia, depois de ir atras do laudo de silicio.

update public.formulas as f
set
    compliance_verified_at = timestamptz '2026-09-12 20:00:00-04:00',
    compliance_norms       = v.norms,
    compliance_source      = 'https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true'
from (values
    -- ZMA (Zinco, Magnesio e Vitamina B6): magnesio (IN 28/2018), L-teanina (IN
    -- 318/2024), zinco (IN 28/2018), boro (IN 76/2020), vitamina B6 e vitamina D (IN
    -- 28/2018).
    ('b72df9a1-d603-477b-be24-2686121929ea'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 318/2024']),

    -- ZMA Night (Zinco + Magnesio + Vitamina B6): mesma composicao do ZMA, mesmas
    -- normas.
    ('3519aa71-676e-49f6-8cd4-edb65baa458a'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 318/2024']),

    -- BIOPRINCESS: silicio (IN 76/2020 inclusao + IN 102/2021 redacao do maximo), acido
    -- hialuronico (IN 76/2020 + IN 102/2021), niacina/B3 no teto atual (IN 418/2025),
    -- acido folico com nomenclatura do minimo pela IN 102/2021; demais insumos
    -- (vitamina C, metionina, cisteina, MSM, vitamina E, zinco, B6, B5, B2, vitamina A,
    -- cobre, iodo, selenio, vitamina D, biotina, B12) sao IN 28/2018 original.
    ('0adc783d-202d-4f6c-8501-3b77f8b47761'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 418/2025']),

    -- Biotina em Capsula: mesma base da BIOPRINCESS, mais colageno hidrolisado (IN
    -- 102/2021).
    ('f0b96d75-b18f-4c77-846c-3cb905273f64'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 418/2025'])
) as v(id, norms)
where f.id = v.id
  and f.deleted_at is null;

-- Conferencia de guarda: 10 da migration anterior + 4 desta = 14. Se nao for esse
-- numero, algo mudou na tabela (formula apagada/reativada, ou selo tirado por outra
-- sessao concorrente) e a migration para em vez de seguir com contagem errada em
-- silencio - regra de exatidao, nunca falhar calado.
do $$
declare
    v_count integer;
begin
    select count(*) into v_count
    from public.formulas
    where compliance_verified_at is not null;

    if v_count <> 14 then
        raise exception 'esperado exatamente 14 formulas com compliance_verified_at preenchido (10 da migration anterior + 4 desta), encontrado %', v_count;
    end if;
end $$;
