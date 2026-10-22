-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260920100000_ingredientes_e_advertencias_do_rotulo.sql
--
-- Pedido do dono, 15/09/2026: seis formulas ativas estavam com ingredients_list e
-- warnings vazios (confirmado ao vivo na mesma data, direto na tabela public.formulas).
-- Auditoria completa, com a origem de cada frase e a avaliacao de procedencia de cada
-- documento consultado, em:
--   docs/conformidade/INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md
--
-- Das seis, SO UMA chegou a "pronto para gravar": creatina-gummy-sabor-frutas-vermelhas.
-- As outras cinco ficaram PENDENTES por falta de fonte com procedencia clara (rotulo
-- lido ou documento da fabrica) — uma delas (melatonina-em-gummy-sabor-uva) por uma
-- contradicao real entre documentos oficiais sobre se o produto leva ou nao
-- L-triptofano, o que e mais grave que uma simples diferenca de redacao. Nenhuma delas
-- entra nesta migration: nao se grava dizer de rotulagem por inferencia.
--
-- FONTE da unica formula abaixo, em ordem de forca (as quatro concordam no conjunto de
-- ingredientes e no teor das advertencias; divergem so em peso de pote e tamanho de
-- porcao, que NAO fazem parte deste UPDATE):
--   1. ~/Desktop/POPS/19_SISTEMA_MEMORIAIS/DRT_GUMMY_CREATINA.html - os Dizeres de
--      Rotulagem oficiais da fabrica para "GUMMY CREATINA", marca LEMONCAPS PREMIUM.
--      E a mesma fonte primaria que lib/catalog/regulatory-info.ts ja cita e documenta
--      (conferida linha a linha contra a fabrica em 12/09/2026).
--   2. docs/conformidade/composicoes_rotulo.json, chave "creatina_gummy" - leitura
--      visual da arte-final de rotulo em curvas (creatina gummy.pdf), 13/09/2026,
--      confianca alta. Rotulo real, mas da marca de cliente "Ultra Life & Co" - mesma
--      receita, marca diferente; nao muda o dizer de ingrediente nem a advertencia.
--   3. FT-CREATINA-GUMMY_Ficha_Tecnica_Creatina_Gummy_Lemoncaps.pdf - ficha tecnica
--      oficial Lemon Caps, assinada pelo RT Farm. Anderson C. Barbosa (CRF/MT 5526),
--      27/07/2026.
--   4. ~/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-CREATINA-GUMMY-FRUTAS-VERMELHAS-SUELEN.docx
--      (variante de cliente "Suelen") - mesmo ingrediente, mesma advertencia (inclusive
--      a frase do efeito laxativo dos poliois).
--
-- Ordem dos ingredientes: creatina primeiro, por ser o de maior quantidade (34,7% da
-- receita bruta segundo a Ordem de Producao 526 e a Ficha Tecnica Resumida de 150
-- potes), batendo com 3 das 4 fontes acima. O DRT_GUMMY_CREATINA.html lista maltitol e
-- sorbitol antes da creatina - lapso provavel do proprio rascunho editavel (o arquivo
-- e literalmente uma ferramenta "clique para editar"), por isso a ordem dele nao foi
-- seguida aqui; nenhuma palavra do dizer foi trocada ou inventada, so a sequencia.
--
-- As tres primeiras frases da advertencia ("nao e um medicamento", "nao exceder a
-- recomendacao diaria", "mantenha fora do alcance de criancas") sao texto literal do
-- Art. 14, inciso I, alineas "c", "d" e "e" da RDC Anvisa n. 243/2018 - conferido ao
-- vivo no AnvisaLegis nesta mesma tarefa, pela URL ja verificada e registrada em
-- lib/catalog/regulatory-info.ts.
-- =====================================================================================

update public.formulas as f
set
    ingredients_list = v.ingredients_list,
    warnings = v.warnings
from (values
    (
        'creatina-gummy-sabor-frutas-vermelhas',
        'Creatina monoidratada, maltitol, sorbitol líquido, gelatina (agente de textura), água purificada, glicerina vegetal (umectante), ácido cítrico (INS 330), pectina cítrica (espessante), aroma de frutas vermelhas, citrato de sódio (INS 331), corante vermelho ponceau (INS 124), conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955).',
        'Este produto não é um medicamento.
Público indicado: Adultos (19 anos ou mais).
O consumo excessivo pode ter efeito laxativo (contém polióis).
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Não deve ser consumido por gestantes, lactantes e crianças.
Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.
Após aberto, consumir em até 60 dias.
Não consumir se o lacre de segurança estiver violado.'
    )
) as v(slug, ingredients_list, warnings)
where f.slug = v.slug
  and f.deleted_at is null
  and (
    f.ingredients_list is distinct from v.ingredients_list
    or f.warnings is distinct from v.warnings
  );

-- -------------------------------------------------------------------------------------
-- AUTOCHECK
-- -------------------------------------------------------------------------------------
do $$
declare
    v_encontrados integer;
    v_incompletos integer;
begin
    -- O slug precisa existir, ativo, e ser exatamente um.
    select count(*) into v_encontrados
    from public.formulas
    where deleted_at is null
      and slug = 'creatina-gummy-sabor-frutas-vermelhas';

    if v_encontrados <> 1 then
        raise exception 'esperava 1 formula com o slug creatina-gummy-sabor-frutas-vermelhas, encontrei %', v_encontrados;
    end if;

    -- Depois do update, os dois campos precisam ter ficado preenchidos de verdade.
    select count(*) into v_incompletos
    from public.formulas
    where deleted_at is null
      and slug = 'creatina-gummy-sabor-frutas-vermelhas'
      and (
        ingredients_list is null or btrim(ingredients_list) = ''
        or warnings is null or btrim(warnings) = ''
      );

    if v_incompletos <> 0 then
        raise exception 'creatina-gummy-sabor-frutas-vermelhas ainda ficou com ingredients_list ou warnings vazio depois do update';
    end if;
end $$;
