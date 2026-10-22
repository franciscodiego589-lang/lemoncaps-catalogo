# -*- coding: utf-8 -*-
"""Gerador dos entregáveis B (.json) e C (.sql) da Fase 2 — grupo de 8 produtos.
Todos os números vêm dos memoriais/laudos lidos em 16/09/2026; as contas estão nos
campos 'conta'. Regras de arredondamento: IN 75/2020, Anexo III (lido literalmente
no AnvisaLegis em 16/09/2026 08:40 UTC-4). Fatores de energia: IN 75/2020, Anexo XXII
(idem). VDR adultos: IN 75/2020, Anexo VIII, coluna ">= 19 anos" (idem).
"""
import json, math, os
from decimal import Decimal, ROUND_HALF_UP

OUT = os.path.dirname(os.path.abspath(__file__))
DATA = '2026-09-16'
REASON = 'reformulação regulatória 2026-09-16'

# ---------------------------------------------------------------- utilidades
def rnd_half_up(x, nd):
    q = Decimal(1).scaleb(-nd)
    return float(Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP))

def arred_in75(valor, unidade):
    """IN 75/2020 Anexo III. Devolve (numero_formatado_str, valor_arredondado)."""
    if valor is None:
        return ('PENDENTE', None)
    v = float(valor)
    if v >= 10:
        r = rnd_half_up(v, 0)
        return (fmt(r, 0), r)
    if 1 <= v < 10:
        r = rnd_half_up(v, 1)
        if abs(r - round(r)) < 1e-9:
            return (fmt(r, 0), r)
        return (fmt(r, 1), r)
    # v < 1
    if unidade == 'g':
        r = rnd_half_up(v, 1)
        return (fmt(r, 1), r)
    r = rnd_half_up(v, 2)
    if abs(r*10 - round(r*10)) < 1e-9:
        return (fmt(r, 1), r)
    return (fmt(r, 2), r)

def fmt(x, nd):
    s = f"{x:,.{nd}f}"
    # padrão brasileiro: milhar com ponto, decimal com vírgula
    s = s.replace(',', 'X').replace('.', ',').replace('X', '.')
    return s

def vd_pct(quant_arred, vdr):
    """%VD em inteiro (RDC 429 Art. 7 §1 e Art. 12 caput: sobre a quantidade arredondada)."""
    if quant_arred is None or vdr is None:
        return None
    return int(rnd_half_up(100.0 * quant_arred / vdr, 0))

VDR = {  # IN 75/2020 Anexo VIII, ">= 19 anos" (lido 16/09/2026)
    'energia_kcal': 2000, 'carboidratos_g': 300, 'acucares_adicionados_g': 50,
    'proteinas_g': 50, 'gorduras_totais_g': 65, 'gorduras_saturadas_g': 20,
    'gorduras_trans_g': 2, 'fibras_g': 25, 'sodio_mg': 2000,
    'vitamina_a_mcg': 800, 'vitamina_d_mcg': 15, 'vitamina_e_mg': 15, 'vitamina_c_mg': 100,
    'vitamina_b3_mg': 15, 'vitamina_b6_mg': 1.3, 'vitamina_b7_mcg': 30, 'vitamina_b12_mcg': 2.4,
    'magnesio_mg': 420, 'zinco_mg': 11,
}
ATWATER = {  # IN 75/2020 Anexo XXII (kcal/g), lido 16/09/2026
    'carboidratos_exceto_poliois': 4, 'proteinas': 4, 'gorduras': 9, 'acidos_organicos': 3,
    'maltitol': 2.1, 'sorbitol': 2.6, 'fibras_soluveis': 2,
}
KJ_POR_KCAL = 4.184  # fator de conversão físico (1 kcal = 4,184 kJ) — assumido, não consta do Anexo XXII

RODAPE = '*Percentual de valores diários fornecidos pela porção'

# ---------------------------------------------------------------- linhas da tabela
def linha(item, quantidade, unidade, vdr=None, nivel=0, pendente=False, nota=None, nao_signif=None):
    """Monta uma linha da tabela já arredondada. nao_signif: limiar do Anexo IV (mesma unidade)."""
    if pendente or quantidade is None:
        return {'item': item, 'quantidade': 'PENDENTE', 'unidade': unidade, 'vd_pct': None,
                'nivel': nivel, 'nota': nota}
    q_str, q_r = arred_in75(quantidade, unidade)
    vd = None
    if nao_signif is not None and float(quantidade) <= nao_signif:
        q_str, q_r = '0', 0.0
        vd = 0 if vdr else None
    elif vdr:
        vd = vd_pct(q_r, vdr)
    return {'item': item, 'quantidade': q_str, 'quantidade_num': q_r, 'unidade': unidade,
            'vd_pct': vd, 'nivel': nivel, 'nota': nota}

def energia_linhas(kcal, pendente=False, nota=None):
    if pendente:
        return [{'item': 'Valor energético', 'quantidade': 'PENDENTE', 'unidade': 'kcal', 'vd_pct': None, 'nivel': 0, 'nota': nota}]
    if kcal <= 4:
        return [{'item': 'Valor energético', 'quantidade': '0', 'unidade': 'kcal', 'kj': '0', 'vd_pct': 0, 'nivel': 0, 'nota': nota}]
    kcal_r = rnd_half_up(kcal, 0); kcal_s = fmt(kcal_r, 0)   # RDC 429 Art. 7 §1: valor energético em número inteiro
    kj_r = rnd_half_up(kcal * KJ_POR_KCAL, 0); kj_s = fmt(kj_r, 0)
    return [{'item': 'Valor energético', 'quantidade': kcal_s, 'unidade': 'kcal', 'kj': kj_s,
             'quantidade_num': kcal_r, 'vd_pct': vd_pct(kcal_r, VDR['energia_kcal']), 'nivel': 0, 'nota': nota}]

def tabela_texto(tab):
    """Renderização em texto (para formulas.nutritional_info, que é TEXT no banco)."""
    L = ['INFORMAÇÃO NUTRICIONAL',
         f"Porções por embalagem: {tab['porcoes_por_embalagem']}",
         f"Porção: {tab['porcao']}",
         f"{'':<44}{tab['porcao_coluna']:>10}   %VD*"]
    for r in tab['linhas']:
        ind = 'n' * r.get('nivel', 0)
        nome = (ind + ' ' if ind else '') + r['item']
        q = r['quantidade']
        if q != 'PENDENTE':
            q = f"{q} {r['unidade']}" + (f" = {r['kj']} kJ" if r.get('kj') else '')
        vd = '' if r.get('vd_pct') is None else f"{fmt(r['vd_pct'], 0)} %"
        L.append(f"{nome:<44}{q:>18}   {vd}")
    L.append(RODAPE)
    return '\n'.join(L)

# ---------------------------------------------------------------- SQL
def sql_escape(s):
    return s.replace("'", "''")

def gerar_sql(p, tab_json):
    slug = p['slug']
    novos = p.get('ingredients_novos', [])
    linhas = []
    for i, c in enumerate(p['composicoes_sql']):
        md = json.dumps(c['metadata'], ensure_ascii=False)
        linhas.append(f"    ('{slug}', {i}, '{sql_escape(c['nome'])}', {c['quantidade']}, '{c['unidade']}', '{c['ingredient_slug']}', '{sql_escape(md)}')")
    values = ',\n'.join(linhas)
    ing_sql = ''
    if novos:
        vals = ',\n'.join(
            f"    ('{n['slug']}', '{sql_escape(n['name'])}', ARRAY[{', '.join(chr(39)+sql_escape(s)+chr(39) for s in n['synonyms'])}]::text[], '{n['category']}'::public.ingredient_category, {n['sort_order']}, '{{\"fonte\": \"reformulacao_{DATA}\", \"criado_por\": \"fase2/{slug}.sql\"}}'::jsonb)"
            for n in novos)
        ing_sql = f"""
-- 2. Insumo(s) novo(s) em public.ingredients — nome como no Anexo I da IN 28/2018
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
{vals}
on conflict (slug) do nothing;
"""
    meta_formula = json.dumps({'tabela_nutricional_' + DATA.replace('-', ''): tab_json,
                               'reformulacao': {'data': DATA, 'fonte': f'docs/conformidade/reformulacao/{slug}.md',
                                                'veredito_esperado': p['veredito'],
                                                'porcao_mg': p['porcao_mg'], 'soma_porcao_mg': p['soma_porcao_mg'],
                                                'cabe': p['cabe']}}, ensure_ascii=False)
    return f"""-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO - REFORMULACAO REGULATORIA {DATA}
-- Fragmento para o slug: {slug}
-- Fonte: docs/conformidade/reformulacao/{slug}.md (memorial de reformulacao, {DATA})
--        scratchpad/fase2/{slug}.json (dados estruturados)
--
-- O que faz, nesta ordem, SEMPRE casando por slug (nunca por UUID):
--   1. exclusao logica das composicoes ativas atuais da formula
--      (active=false, deleted_at=now(), reason_deleted='{REASON}');
--   2. insumo(s) novo(s) em public.ingredients, se faltar (on conflict do nothing);
--   3. insercao das composicoes reformuladas, com ingredient_id resolvido por slug e
--      metadata de procedencia (fonte, laudo_lote, teor_pct, ativo_mg, linha_anexo);
--   4. update de public.formulas: ingredients_list, warnings, nutritional_info (TEXT —
--      tipo conferido ao vivo em {DATA}: a coluna e texto, nao jsonb; por isso a tabela
--      vai renderizada em texto em nutritional_info e, estruturada, em metadata->
--      'tabela_nutricional_{DATA.replace('-', '')}'), serving_description e metadata.
-- Idempotente: a exclusao so pega linhas sem metadata.fonte = 'reformulacao_{DATA}';
-- a insercao so acontece se a formula ainda nao tem linha ativa com essa fonte; o
-- update de formulas so grava se algum campo estiver diferente.
-- Sem guarda de contagem aqui (a consolidacao poe). NAO aplicado em banco nenhum.
-- Veredito esperado: {p['veredito']}
-- =====================================================================================

-- 1. Exclusao logica das composicoes ativas atuais
update public.formula_compositions fc
set active = false,
    deleted_at = now(),
    reason_deleted = '{REASON}'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug = '{slug}'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_{DATA}';
{ing_sql}
-- 3. Insercao das composicoes reformuladas
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
{values}
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null
      and x.metadata->>'fonte' = 'reformulacao_{DATA}'
);

-- 4. Dizeres e tabela nutricional
update public.formulas f
set ingredients_list    = v.ingredients_list,
    warnings            = v.warnings,
    nutritional_info    = v.nutritional_info,
    serving_description = v.serving_description,
    metadata            = coalesce(f.metadata, '{{}}'::jsonb) || v.metadata::jsonb
from (values (
    '{slug}',
    '{sql_escape(p['ingredients_list'])}',
    '{sql_escape(p['warnings'])}',
    '{sql_escape(tabela_texto(tab_json))}',
    '{sql_escape(p['serving_description'])}',
    '{sql_escape(meta_formula)}'
)) as v(slug, ingredients_list, warnings, nutritional_info, serving_description, metadata)
where f.slug = v.slug
  and f.deleted_at is null
  and (f.ingredients_list is distinct from v.ingredients_list
       or f.warnings is distinct from v.warnings
       or f.nutritional_info is distinct from v.nutritional_info
       or f.serving_description is distinct from v.serving_description
       or coalesce(f.metadata->'reformulacao'->>'data', '') <> '{DATA}');
"""

def gravar(p, tab):
    slug = p['slug']
    j = {k: p[k] for k in ['slug', 'porcao_mg', 'porcao_descricao', 'formato', 'grupo_populacional',
                            'insumos', 'excipientes', 'soma_porcao_mg', 'cabe']}
    j['tabela_nutricional'] = tab
    j['ingredients_list'] = p['ingredients_list']
    j['warnings'] = p['warnings']
    j['pendencias'] = p['pendencias']
    j['veredito'] = p['veredito']
    j['_procedencia'] = p.get('_procedencia', {})
    with open(os.path.join(OUT, slug + '.json'), 'w', encoding='utf-8') as fh:
        json.dump(j, fh, ensure_ascii=False, indent=1)
    with open(os.path.join(OUT, slug + '.sql'), 'w', encoding='utf-8') as fh:
        fh.write(gerar_sql(p, tab))
    print('gravado', slug, '| soma', p['soma_porcao_mg'], '| cabe', p['cabe'], '| veredito', p['veredito'])
    print(tabela_texto(tab))
    print()

# ---------------------------------------------------------------- textos comuns
ART14 = ['Este produto não é um medicamento.',
         'Não exceder a recomendação diária de consumo indicada na embalagem.',
         'Mantenha fora do alcance de crianças.']
GRUPO = 'Público indicado: adultos a partir de 19 anos.'
ANEXO_VI_GERAL = 'Este produto não deve ser consumido por gestantes, lactantes e crianças.'
ANEXO_VI_BETA = 'Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses.'
ANEXO_VI_MELA = 'Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.'
POLIOIS = 'O consumo excessivo pode ter efeito laxativo (contém polióis).'
CONSERV = 'Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.'
GLUTEN_PEND = '[PENDENTE — Lei 10.674/2003 obriga "Contém Glúten" ou "Não contém Glúten": só grafar "Não contém glúten" com laudo do produto acabado]'

def warnings_join(lst):
    return '\n'.join(lst)

def md_comp(**kw):
    """metadata da linha de formula_compositions."""
    base = {'fonte': f'reformulacao_{DATA}'}
    base.update(kw)
    return base

# =====================================================================================
# 1. BELLA GUMMY
# =====================================================================================
def bella():
    slug = 'bella-gummy-biotina-em-gummy'
    # ativos — massas do memorial MEM-CALC-BIOGUMMY-rev02 (13/08/2026), Tabela 7/9
    vitE_acetato = 16.70 * 0.507              # 8,4669 mg de acetato
    vitE_ate = vitE_acetato * 0.67            # 5,6728 mg alfa-TE (nota v Anexo III IN 28; IN 75 An. XXIII: 1 mg = 1,49 UI)
    zn = 12.00 * 0.1989                       # 2,3868 mg
    vitA_ui = 5.99 * 568116 / 1000            # 3.403,0 UI
    vitA_rae = vitA_ui / 3.33                 # IN 75 Anexo XXIII: 1 µg RAE = 3,33 UI → 1.021,9 µg
    biot = 0.040 * 1.000                      # 40,0 µg (0,040 mg × 100,0 %)
    vitC = 45.23 * 0.995                      # 45,00 mg
    insumos = [
        dict(constituinte_anexo_i='Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7)', forma_insumo='Ácido ascórbico 99 %',
             massa_insumo_mg=45.23, teor_pct=99.5, teor_fonte='laudo lote 950467 (Analitic, val. 05/03/2029)', ativo_mg=round(vitC, 3), unidade_ativo='mg',
             conta='45,23 mg × 99,5 % = 45,00 mg', minimo=13.5, maximo=1916.02, pct_do_maximo=round(100*vitC/1916.02, 2),
             linha_anexo='I·Vitamina C·Ácido ascórbico/Ácido L-ascórbico; III·Vitamina C (13,5 mg); IV·Vitamina C (1.916,02 mg)',
             laudo={'lote': '950467', 'validade': '05/03/2029', 'vencido': False}, status='mantido', motivo='dentro da faixa, 2,3 % do teto'),
        dict(constituinte_anexo_i='Vitamina E — Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila (CAS 7695-91-2)', forma_insumo='Vitamina E pó 50 % (acetato de DL-alfa-tocoferila)',
             massa_insumo_mg=16.70, teor_pct=50.7, teor_fonte='laudo lote 91320 (Analitic, val. 05/04/2028)', ativo_mg=round(vitE_ate, 3), unidade_ativo='mg de alfa-tocoferol',
             conta='16,70 mg × 50,7 % = 8,467 mg de acetato; × 0,67 (nota v do Anexo III da IN 28: 1 UI = 1 mg de acetato de rac-α-tocoferil; IN 75 Anexo XXIII: 1 mg de α-tocoferol = 1,49 UI) = 5,673 mg de α-TE',
             minimo=2.25, maximo=1000, pct_do_maximo=round(100*vitE_ate/1000, 2),
             linha_anexo='I·Vitamina E·Acetato de DL-alfa-tocoferol; III·Vitamina E^v (2,25 mg); IV·Vitamina E^iii (1000 mg)',
             laudo={'lote': '91320', 'validade': '05/04/2028', 'vencido': False}, status='mantido (declaração corrigida)',
             motivo='massa mantida; o rótulo declarava 16,7 mg de vitamina E (massa do insumo) — o ativo é 5,68 mg de α-TE (38 % VD), como o próprio memorial rev02 aponta'),
        dict(constituinte_anexo_i='Zinco — Bisglicinato de zinco (CAS 14281-83-5)', forma_insumo='Bisglicinato de zinco 20 %',
             massa_insumo_mg=12.00, teor_pct=19.89, teor_fonte='laudo lote 055-ZN/25 (Galena, 20,00 % Zn base seca, val. 06/05/2027); 19,89 % tal qual = critério do RT (umidade descontada)', ativo_mg=round(zn, 3), unidade_ativo='mg de zinco',
             conta='12,00 mg × 19,89 % = 2,387 mg de Zn', minimo=1.65, maximo=29.59, pct_do_maximo=round(100*zn/29.59, 2),
             linha_anexo='I·Zinco·Bisglicinato de zinco; III·Zinco (1,65 mg); IV·Zinco (29,59 mg)',
             laudo={'lote': '055-ZN/25', 'validade': '06/05/2027', 'vencido': False}, status='mantido', motivo='dentro da faixa, 8,1 % do teto; resultado do laudo (20,00 %) está no piso da especificação (20–23 %)'),
        dict(constituinte_anexo_i='Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9)', forma_insumo='Acetato de retinol pó (568.116 UI/g)',
             massa_insumo_mg=5.99, teor_pct=None, teor_fonte='potência 568.116 UI/g lida no memorial (lote 215230); laudo em digitalização, NÃO conferido nesta rodada — PENDENTE', ativo_mg=round(vitA_rae, 1), unidade_ativo='µg RAE',
             conta='5,99 mg × 568.116 UI/g ÷ 1.000 = 3.403 UI; ÷ 3,33 UI/µg RAE (IN 75 Anexo XXIII) = 1.022 µg RAE (memorial: × 0,3 = 1.020,9 µg)',
             minimo=135, maximo=2623.61, pct_do_maximo=round(100*vitA_rae/2623.61, 2),
             linha_anexo='I·Vitamina A·Acetato de retinol/Acetato de retinila; III·Vitamina A^ii (135 µg); IV·Vitamina A^i (2.623,61 µg)',
             laudo={'lote': '215230', 'validade': 'PENDENTE (laudo não lido)', 'vencido': None}, status='mantido', motivo='dentro da faixa, 39 % do teto'),
        dict(constituinte_anexo_i='Biotina — D-biotina (CAS 58-85-5)', forma_insumo='D-biotina',
             massa_insumo_mg=0.040, teor_pct=100.0, teor_fonte='laudo lote interno 91457 / fabricante BN25121020 (Analitic, val. 19/12/2028) — o laudo fisicamente anexado ao memorial; o memorial usava 97,69 % e lote 25030042, que não existem nesse laudo', ativo_mg=round(biot, 4), unidade_ativo='mg (= 40,0 µg)',
             conta='0,040 mg × 100,0 % = 0,040 mg = 40,0 µg', minimo=4.5, maximo=45, pct_do_maximo=round(100*40.0/45, 2),
             linha_anexo='I·Biotina·D-biotina; III·Biotina (4,5 µg); IV·Biotina (45 µg)',
             laudo={'lote': '91457 (BN25121020)', 'validade': '19/12/2028', 'vencido': False}, status='dose ajustada',
             motivo='45 µg era o teto exato; 40 µg = 88,9 % do teto (folga de 11 %), como o memorial rev02 já sugeria'),
    ]
    excip = [
        {'nome': 'Sorbitol líquido 70 %', 'ins': '420', 'massa_mg': None, 'observacao': 'massa PENDENTE (memorial só traz "matriz de goma q.s.p. 5.920,03 mg")'},
        {'nome': 'Maltitol', 'ins': '965', 'massa_mg': None, 'observacao': 'massa PENDENTE'},
        {'nome': 'Gelatina', 'ins': None, 'massa_mg': None, 'observacao': 'massa PENDENTE; espécie animal não declarada no laudo (lote 214196)'},
        {'nome': 'Água purificada', 'ins': None, 'massa_mg': None, 'observacao': 'massa PENDENTE'},
        {'nome': 'Glicerina vegetal', 'ins': '422', 'massa_mg': None, 'observacao': 'massa PENDENTE'},
        {'nome': 'Maltodextrina', 'ins': None, 'massa_mg': None, 'observacao': 'massa PENDENTE; laudo lote 210170 VENCIDO 26/07/2026; 6,27 ppm de SO2 no insumo'},
        {'nome': 'Pectina cítrica', 'ins': '440', 'massa_mg': None, 'observacao': 'massa PENDENTE'},
        {'nome': 'Goma acácia', 'ins': '414', 'massa_mg': None, 'observacao': 'massa PENDENTE; laudo lote 105226 com pH 2,84 fora da especificação 4–5'},
        {'nome': 'Ácido cítrico', 'ins': '330', 'massa_mg': None, 'observacao': 'massa PENDENTE'},
        {'nome': 'Citrato de sódio', 'ins': '331', 'massa_mg': None, 'observacao': 'massa PENDENTE'},
        {'nome': 'Aroma de frutas vermelhas', 'ins': None, 'massa_mg': None, 'observacao': 'massa PENDENTE; laudo lote 25051287 VENCIDO 21/05/2026 e da forma errada (pó × líquido)'},
        {'nome': 'Corante vermelho ponceau 4R', 'ins': '124', 'massa_mg': None, 'observacao': 'massa PENDENTE; laudo lote 108027 válido (85,99 %)'},
        {'nome': 'Sorbato de potássio', 'ins': '202', 'massa_mg': None, 'observacao': 'massa PENDENTE; lote em uso é grau PA (reagente) — trocar por grau alimentício (laudo válido disponível: Analitic lote 91202, 100,30 %, val. 05/01/2028)'},
        {'nome': 'Sucralose', 'ins': '955', 'massa_mg': None, 'observacao': 'massa PENDENTE'},
        {'nome': 'Matriz de goma — soma (q.s.p.)', 'ins': None, 'massa_mg': 5920.04, 'observacao': '6.000,00 − 79,96 mg de ativos = 5.920,04 mg (memorial Tabela 8: 5.920,03 mg)'},
    ]
    soma_ativos = sum(i['massa_insumo_mg'] for i in insumos)  # 79,96
    tab = {
        'porcoes_por_embalagem': '30', 'porcao': '6 g (2 gomas)', 'porcao_coluna': '6 g',
        'linhas': [
            *energia_linhas(None, pendente=True, nota='memorial não traz massa dos excipientes; rótulo/memorial imprimem 12 kcal = 50 kJ (não recalculável)'),
            linha('Carboidratos', None, 'g', pendente=True, nota='rótulo/memorial: 4,8 g (não recalculável)'),
            linha('Açúcares totais', None, 'g', nivel=1, pendente=True, nota='maltodextrina na base: fração de mono/dissacarídeos não quantificada'),
            linha('Açúcares adicionados', None, 'g', nivel=2, pendente=True, nota='RDC 429 Art. 3 I inclui a fração de mono/dissacarídeos da maltodextrina'),
            linha('Polióis totais', None, 'g', nivel=1, pendente=True, nota='rótulo/memorial: 3,4 g (sorbitol + maltitol; massas não disponíveis)'),
            linha('Proteínas', None, 'g', pendente=True, nota='rótulo/memorial: 0,6 g (gelatina; massa não disponível)'),
            linha('Gorduras totais', 0, 'g', VDR['gorduras_totais_g'], nao_signif=0.5),
            linha('Gorduras saturadas', 0, 'g', VDR['gorduras_saturadas_g'], nivel=1, nao_signif=0.1),
            linha('Gorduras trans', 0, 'g', VDR['gorduras_trans_g'], nivel=1, nao_signif=0.1),
            linha('Fibras alimentares', None, 'g', pendente=True, nota='pectina e goma acácia são fibras; massas não disponíveis'),
            linha('Sódio', None, 'mg', pendente=True, nota='rótulo/memorial: 8 mg (citrato de sódio; massa não disponível)'),
            linha('Vitamina A', vitA_rae, 'µg', VDR['vitamina_a_mcg'], nota='µg RAE; 1.022 µg calculado, memorial declara 1.020 µg'),
            linha('Vitamina E', vitE_ate, 'mg', VDR['vitamina_e_mg']),
            linha('Vitamina C', vitC, 'mg', VDR['vitamina_c_mg']),
            linha('Vitamina B7', 40.0, 'µg', VDR['vitamina_b7_mcg'], nota='nome do Anexo XI da IN 75 ("Vitamina B7", alternativo "Biotina")'),
            linha('Zinco', zn, 'mg', VDR['zinco_mg']),
        ],
        'rodape': RODAPE,
        'regras': 'Arredondamento: IN 75/2020 Anexo III (lido 16/09/2026). %VD: IN 75/2020 Anexo VIII, coluna ≥ 19 anos, sobre a quantidade arredondada (RDC 429 Art. 12). Ordem: IN 75/2020 Anexo XI.',
    }
    p = dict(
        slug=slug, porcao_mg=6000, porcao_descricao='6 g (2 gomas de 3,00 g) — 30 porções por embalagem (60 gomas, 180 g)',
        formato='gummy', grupo_populacional='adultos (≥ 19 anos)', insumos=insumos, excipientes=excip,
        soma_porcao_mg=6000.0, cabe=True,
        ingredients_list='Sorbitol líquido 70 %, maltitol, gelatina, água purificada, glicerina vegetal, maltodextrina, pectina cítrica, goma acácia, ácido cítrico (INS 330), citrato de sódio (INS 331), aroma de frutas vermelhas, vitamina C (ácido ascórbico), vitamina E (acetato de DL-alfa-tocoferila), zinco (bisglicinato de zinco), vitamina A (acetato de retinol), biotina (D-biotina), corante vermelho ponceau 4R (INS 124), conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955). ' + GLUTEN_PEND + ' [Alergênicos: "Contém: peixe" se a gelatina for de peixe — espécie PENDENTE; sulfitos se o produto atingir 10 mg/kg de SO2 — PENDENTE de cálculo com a massa da maltodextrina]',
        warnings=warnings_join(ART14 + [GRUPO, POLIOIS + ' [base legal a confirmar pelo RT]', CONSERV]),
        serving_description='6 g (2 gomas)',
        pendencias=[
            'Massa de cada excipiente da matriz de goma (memorial só traz o q.s.p. 5.920,03 mg) — sem elas, valor energético, carboidratos, polióis, proteínas, fibras e sódio ficam PENDENTES (os valores impressos hoje não são recalculáveis).',
            'Laudo do acetato de retinol lote 215230: existe só em digitalização, potência 568.116 UI/g lida do memorial — conferir visualmente.',
            'Biotina: o memorial cita lote 25030042 e teor 97,69 %, que não constam do laudo anexado (lote 91457/BN25121020, 100,0 %). Corrigir o memorial para o laudo real.',
            'Rótulo declara "vitamina E (DL-alfa-tocoferol) 16,7 mg (111 % VD)"; o ativo entregue é 5,68 mg de α-TE (38 % VD). Corrigir a arte e a linha de composição (o insumo é o acetato).',
            'Laudos vencidos/errados na base: aroma de frutas vermelhas (venc. 21/05/2026, laudo de pó para insumo líquido), maltodextrina (venc. 26/07/2026), sorbitol (laudo de pó para insumo líquido 70 %), goma acácia (pH 2,84 fora de 4–5, sem conclusão), sorbato de potássio grau PA (trocar por grau alimentício — laudo válido Analitic lote 91202).',
            'Gelatina lote 214196: espécie animal não declarada (se peixe, alergênico obrigatório; se bovina, certificado BSE).',
            'Glúten: Lei 10.674/2003 obriga "Contém Glúten" ou "Não contém Glúten"; não há ensaio deste produto (os ensaios MGW de glúten < 10 ppm são da Creatina Gummy e da Melatonina Gummy).',
            'A advertência "Não deve ser consumido por gestantes, lactantes e crianças", presente hoje no cadastro, NÃO é exigida pelo Anexo VI para vitaminas e minerais — manter ou retirar é decisão do RT.',
            'A alegação "PELE · CABELO · UNHA" do rótulo não é redação autorizada do Anexo V (apontado pelo memorial).',
        ],
        veredito='CONFORME CONDICIONADO A (laudo da vitamina A lote 215230 conferido; massas da matriz de goma para fechar a tabela nutricional; laudos vencidos/errados da base renovados)',
        _procedencia={'memorial': 'MEM-CALC-BIOGUMMY-rev02 (13/08/2026)', 'rotulo': 'composicoes_rotulo.json/biogummy (BioGummy.pdf)', 'anexos': 'IN 28/2018 consolidada, lida 16/09/2026', 'in75': 'IN 75/2020 consolidada, lida 16/09/2026 08:40 UTC-4'},
        composicoes_sql=[
            {'nome': 'Vitamina C (ácido ascórbico)', 'quantidade': 45, 'unidade': 'mg', 'ingredient_slug': 'vitamina-c',
             'metadata': md_comp(laudo_lote='950467', teor_pct=99.5, ativo_mg=45.0, massa_insumo_mg=45.23, linha_anexo='I·Ácido ascórbico; III/IV·Vitamina C', e_sal=False)},
            {'nome': 'Vitamina E (acetato de DL-alfa-tocoferila)', 'quantidade': 5.68, 'unidade': 'mg', 'ingredient_slug': 'vitamina-e',
             'metadata': md_comp(laudo_lote='91320', teor_pct=50.7, ativo_mg=5.68, massa_insumo_mg=16.70, unidade_ativo='mg alfa-TE', linha_anexo='I·Acetato de DL-alfa-tocoferol; III/IV·Vitamina E', e_sal=False, observacao='quantity = ativo (α-TE); massa do insumo 16,70 mg')},
            {'nome': 'Zinco (bisglicinato de zinco)', 'quantidade': 12, 'unidade': 'mg', 'ingredient_slug': 'zinco',
             'metadata': md_comp(laudo_lote='055-ZN/25', teor_pct=19.89, ativo_mg=2.39, massa_insumo_mg=12.0, linha_anexo='I·Bisglicinato de zinco; III/IV·Zinco', e_sal=True, elemento_equivalente_mg=2.39)},
            {'nome': 'Vitamina A (acetato de retinol)', 'quantidade': 1020, 'unidade': 'mcg', 'ingredient_slug': 'vitamina-a',
             'metadata': md_comp(laudo_lote='215230 (laudo não conferido)', teor_pct=None, potencia='568.116 UI/g', ativo_mg=1.02, unidade_ativo='µg RAE (1.020)', massa_insumo_mg=5.99, linha_anexo='I·Acetato de retinol; III/IV·Vitamina A', e_sal=False)},
            {'nome': 'Biotina (D-biotina)', 'quantidade': 40, 'unidade': 'mcg', 'ingredient_slug': 'biotina',
             'metadata': md_comp(laudo_lote='91457 (BN25121020)', teor_pct=100.0, ativo_mg=0.040, massa_insumo_mg=0.040, linha_anexo='I·D-biotina; III/IV·Biotina', e_sal=False, observacao='45 → 40 µg (folga 11 % do teto)')},
        ],
    )
    gravar(p, tab)

# =====================================================================================
# 2 e 3. CREATINA EM PÓ 150 g e 300 g
# =====================================================================================
def creatina_po(slug, peso_g):
    massa = 4000.0
    ativo_A = massa * 1.005                # leitura A: teor 100,5 % aplicado tal qual
    ativo_B = massa * (1 - 0.115) * 1.005  # leitura B: base seca (perda por dessecação 11,5 %) → creatina anidra
    porcoes = peso_g / 4.0
    if abs(porcoes - round(porcoes)) < 1e-9:
        porcoes_txt = str(int(porcoes))
    else:
        porcoes_txt = 'Cerca de ' + str(int(rnd_half_up(porcoes, 0)))   # IN 75 Anexo VI
    ins = [dict(constituinte_anexo_i='Creatina — Creatina monohidratada (CAS 6020-87-7)', forma_insumo='Creatina monoidratada (pó)',
                massa_insumo_mg=massa, teor_pct=100.5, teor_fonte='laudo lote interno 26A05-B023-217949 / fabricante 20250913 (SM/Fagron; teor 100,5 % base seca; perda por dessecação 11,5 %; creatinina 95 ppm; val. 22/09/2028)',
                ativo_mg=round(ativo_A, 1), unidade_ativo='mg (leitura A: creatina monoidratada × teor)',
                conta=f'leitura A: 4.000 mg × 100,5 % = {ativo_A:,.1f} mg (80,4 % do teto; 134 % do mínimo) · leitura B (creatina anidra): 4.000 × (1 − 0,115) × 1,005 = {ativo_B:,.1f} mg (71,2 % do teto; 118,6 % do mínimo)'.replace(',', 'X').replace('.', ',').replace('X', '.'),
                ativo_leitura_b_mg=round(ativo_B, 1), minimo=3000, maximo=5000, pct_do_maximo=round(100*ativo_A/5000, 2), pct_do_maximo_leitura_b=round(100*ativo_B/5000, 2),
                linha_anexo='I·Creatina·Creatina monohidratada; III·Creatina (3.000 mg); IV·Creatina (5.000 mg, IN 373/2025)',
                laudo={'lote': '217949 (26A05-B023-217949)', 'validade': '22/09/2028', 'vencido': False}, status='dose ajustada',
                motivo='5.000 mg cravava o teto: com o teor do laudo (100,5 %) a entrega calculada é 5.025 mg > 5.000 mg (leitura A). 4.000 mg dá folga nas duas leituras e tolera ±10 % de variação do dosador volumétrico sem sair da faixa 3.000–5.000 mg')]
    tab = {'porcoes_por_embalagem': porcoes_txt, 'porcao': '4 g (1 dosador)', 'porcao_coluna': '4 g',
           'linhas': [
               *energia_linhas(0, nota='creatina não tem fator no Anexo XXII da IN 75 → 0 kcal; ≤ 4 kcal declara-se 0 (Anexo IV)'),
               linha('Carboidratos', 0, 'g', VDR['carboidratos_g'], nao_signif=0.5),
               linha('Açúcares totais', 0, 'g', None, nivel=1, nao_signif=0.5),
               linha('Açúcares adicionados', 0, 'g', VDR['acucares_adicionados_g'], nivel=2, nao_signif=0.5),
               linha('Proteínas', 0, 'g', VDR['proteinas_g'], nao_signif=0.5, nota='creatina não é proteína (por formulação); Kjeldahl no produto leria o nitrogênio da creatina — critério do RT'),
               linha('Gorduras totais', 0, 'g', VDR['gorduras_totais_g'], nao_signif=0.5),
               linha('Gorduras saturadas', 0, 'g', VDR['gorduras_saturadas_g'], nivel=1, nao_signif=0.1),
               linha('Gorduras trans', 0, 'g', VDR['gorduras_trans_g'], nivel=1, nao_signif=0.1),
               linha('Fibras alimentares', 0, 'g', VDR['fibras_g'], nao_signif=0.5),
               linha('Sódio', 0, 'mg', VDR['sodio_mg'], nao_signif=5),
               linha('Creatina', 4000, 'mg', None, nota='sem VDR: célula de %VD em branco (RDC 429 Art. 12 §1). Declarada a massa nominal de creatina monoidratada; lote 217949 entrega 4.020 mg (leitura A) ou 3.558 mg de creatina anidra (leitura B)'),
           ], 'rodape': RODAPE,
           'regras': 'Arredondamento: IN 75/2020 Anexo III. Quantidade não significativa: IN 75/2020 Anexo IV (suplementos, por porção). Porções por embalagem: IN 75/2020 Anexo VI.'}
    p = dict(slug=slug, porcao_mg=4000, porcao_descricao=f'4 g (1 dosador nivelado — validar gravimetricamente) — {porcoes_txt.lower()} porções em {peso_g:g} g',
             formato='pó (solúvel)', grupo_populacional='adultos (≥ 19 anos)', insumos=ins, excipientes=[], soma_porcao_mg=4000.0, cabe=True,
             ingredients_list='Creatina monoidratada. ' + GLUTEN_PEND,
             warnings=warnings_join(ART14 + [GRUPO, ANEXO_VI_GERAL, CONSERV]),
             serving_description='4 g (1 dosador)',
             pendencias=[
                 'Decisão do RT sobre a base do limite de creatina: leitura A (massa de creatina monoidratada, praticada pelo memorial e pela auditoria de 15/09) ou leitura B (creatina anidra, descontando a perda por dessecação de 11,5 % do laudo). A dose de 4.000 mg fica conforme e com folga nas duas.',
                 'Validação gravimétrica do dosador: o certificado do dosador (Part Number 3.41.001.548) é de 8 mL de volume, não de massa; pela densidade aparente do laudo (491–737 g/L) 8 mL pesam 3,9–5,9 g. Definir o dosador/nível que entrega 4,0 g e registrar o ensaio.',
                 'Nova arte de rótulo (porção 4 g; porções por embalagem conforme IN 75 Anexo VI).',
                 'Glúten: Lei 10.674/2003 obriga a frase; não há ensaio deste produto — só grafar "Não contém glúten" com laudo (ou declaração formal do RT).',
             ] + (['Apresentação de 300 g sem memorial, rótulo ou laudo de embalagem próprios (o único memorial é o de 150 g). Existe um SVG de arte com "Porção: 3.000 mg (1 dosador) / 100 porções" — confirmar qual apresentação vale. Pote PEAD 600 mL: 300 g de pó solto (491 g/L) ocupam ~611 mL — cabe só com o pó assentado.'] if peso_g == 300 else []),
             veredito='CONFORME (com folga) — condicionado à validação gravimétrica do dosador' + (' e à documentação própria da apresentação de 300 g' if peso_g == 300 else ''),
             _procedencia={'memorial': 'MEM-CALC-CREATINAPO-rev02 (13/08/2026, apresentação 150 g)', 'rotulo': 'composicoes_rotulo.json/creatina_po_150g' if peso_g == 150 else 'sem rótulo (cadastro do banco lido ao vivo em 16/09/2026)', 'laudo': '01_laudo_creatina-monoidratada_lote-217949.pdf'},
             composicoes_sql=[{'nome': 'Creatina monoidratada', 'quantidade': 4000, 'unidade': 'mg', 'ingredient_slug': 'creatina-monoidratada',
                               'metadata': md_comp(laudo_lote='217949 (26A05-B023-217949)', teor_pct=100.5, ativo_mg=4020.0, ativo_leitura_b_mg=3557.7, massa_insumo_mg=4000, linha_anexo='I·Creatina monohidratada; III·Creatina 3.000; IV·Creatina 5.000 (IN 373/2025)', e_sal=False, observacao='5.000 → 4.000 mg: folga de fabricação (nunca cravar no teto)')}])
    gravar(p, tab)

# =====================================================================================
# 4 e 5. CREATINA EM GOMA (frutas vermelhas / tutti-frutti)
# =====================================================================================
def creatina_gummy(slug, sabor):
    massa = 3500.0
    ativo_A = massa * 1.005
    ativo_B = massa * (1 - 0.115) * 1.005
    # base do memorial MEM-CALC-CREATGUMMY-rev02 (por porção de 2 gomas)
    base = [  # nome, ins, massa_mg, teor, observacao
        ('Sorbitol líquido 70 %', '420', 1750.0, 'sólidos: 1.750 × 70 % = 1.225 mg (hipótese: "70 %" = concentração de sorbitol; o laudo anexado, lote 106371, é de sorbitol em PÓ, 98,5 %)'),
        ('Maltitol', '965', 1260.0, '1.260 × 99,7 % (laudo lote 106330, val. 22/04/2027) = 1.256 mg'),
        ('Gelatina', None, 700.0, 'laudo lote 214196 (val. 17/08/2030): N ≥ 15,0 %; espécie animal não declarada'),
        ('Água purificada', None, 323.3, 'evapora na cocção'),
        ('Glicerina vegetal', '422', 245.0, 'sem fator de energia próprio no Anexo XXII da IN 75 — PENDENTE decisão do RT'),
        ('Ácido cítrico', '330', 168.0, 'ácido orgânico: 3 kcal/g (Anexo XXII)'),
        ('Pectina cítrica', '440', 140.0, 'fibra alimentar solúvel: 2 kcal/g (Anexo XXII); ácido galacturônico 90 % (laudo lote 107755)'),
        ('Citrato de sódio', '331', 14.0, 'forma (anidro/di-hidratado) não informada; Na = 3,3–3,7 mg'),
        ('Sorbato de potássio', '202', 7.0, 'lote em uso é grau PA (reagente) — trocar por grau alimentício (Analitic lote 91202)'),
        (f'Aroma de {sabor}', None, 19.0 if sabor == 'frutas vermelhas' else None, 'massa do sabor frutas vermelhas; tutti-frutti PENDENTE (OP: 0,783 % do lote)' if sabor != 'frutas vermelhas' else 'laudo lote 25051287 VENCIDO 21/05/2026 e da forma errada'),
        ('Corante vermelho ponceau 4R' if sabor == 'frutas vermelhas' else 'Corante [rosa — nome técnico e INS PENDENTES]', '124' if sabor == 'frutas vermelhas' else None, 33.33 if sabor == 'frutas vermelhas' else None, 'laudo lote 108027 (85,99 %)' if sabor == 'frutas vermelhas' else 'OP do tutti-frutti chama de "corante rosa" (0,064 % do lote) — sem INS nem laudo'),
        ('Sucralose', '955', 2.67, '99,74 % (laudo lote 91233)'),
    ]
    excip = [{'nome': n, 'ins': i, 'massa_mg': m, 'observacao': o} for (n, i, m, o) in base]
    soma_excip = sum(m for (_, _, m, _) in base if m)
    soma = massa + soma_excip
    agua = 1750.0 * 0.30 + 323.3
    solidos = soma - agua
    # nutrição (por 2 gomas; independe da massa final, água não tem energia)
    sorb = 1750.0 * 0.70; malt = 1260.0 * 0.997
    poliois = sorb + malt
    prot = 700.0 * 0.150 * 6.25   # gelatina: N 15,0 % × 6,25 (IN 75 An. XXIII, "proteínas da carne ou misturas")
    fibra = 140.0 * 0.90
    kcal = sorb/1000*2.6 + malt/1000*2.1 + prot/1000*4 + 0.168*3 + fibra/1000*2   # sem glicerina (PENDENTE)
    kcal_glic = kcal + 0.245*4
    tab = {'porcoes_por_embalagem': '30', 'porcao': '6 g (2 gomas)', 'porcao_coluna': '6 g',
           'linhas': [
               *energia_linhas(kcal, nota=f'sorbitol 1,225 g × 2,6 + maltitol 1,256 g × 2,1 + proteína 0,656 g × 4 + ácido cítrico 0,168 g × 3 + pectina 0,126 g × 2 = {kcal:.2f} kcal (glicerina 0,245 g sem fator no Anexo XXII: se contada a 4 kcal/g → {kcal_glic:.2f} kcal — decisão do RT)'.replace('.', ',')),
               linha('Carboidratos', poliois/1000, 'g', VDR['carboidratos_g'], nota='= polióis 2,481 g; sem açúcares. Glicerina (0,245 g) NÃO incluída: sem fator no Anexo XXII da IN 75 nem enquadramento como carboidrato na RDC 429 Art. 3 VIII — se o RT a contar como carboidrato a 4 kcal/g, carboidratos = 2,7 g e energia = 10 kcal'),
               linha('Açúcares totais', 0, 'g', None, nivel=1, nao_signif=0.5, nota='sem açúcares na receita (polióis excluídos por definição, RDC 429 Art. 3 II)'),
               linha('Açúcares adicionados', 0, 'g', VDR['acucares_adicionados_g'], nivel=2, nao_signif=0.5),
               linha('Polióis totais', poliois/1000, 'g', None, nivel=1, nota='sorbitol 1,225 g + maltitol 1,256 g = 2,481 g (rótulo atual diz 2,7 g)'),
               linha('Sorbitol', sorb/1000, 'g', None, nivel=2),
               linha('Maltitol', malt/1000, 'g', None, nivel=2),
               linha('Proteínas', prot/1000, 'g', VDR['proteinas_g'], nota='gelatina 700 mg × N 15,0 % × 6,25 = 0,656 g (com fator 5,55 da gelatina: 0,58 g — critério do RT); rótulo atual diz 0,4 g'),
               linha('Gorduras totais', 0, 'g', VDR['gorduras_totais_g'], nao_signif=0.5),
               linha('Gorduras saturadas', 0, 'g', VDR['gorduras_saturadas_g'], nivel=1, nao_signif=0.1),
               linha('Gorduras trans', 0, 'g', VDR['gorduras_trans_g'], nivel=1, nao_signif=0.1),
               linha('Fibras alimentares', fibra/1000, 'g', VDR['fibras_g'], nao_signif=0.5, nota='pectina 140 mg × 90 % = 0,126 g ≤ 0,5 g → não significativa → 0'),
               linha('Sódio', 3.7, 'mg', VDR['sodio_mg'], nao_signif=5, nota='citrato de sódio 14 mg → 3,3–3,7 mg de Na (≤ 5 mg → 0); rótulo atual diz 10 mg — sem lastro no memorial; PENDENTE análise de sódio no produto acabado'),
               linha('Creatina', 3500, 'mg', None, nota='sem VDR: %VD em branco. Massa nominal de creatina monoidratada; lote 217949: 3.517,5 mg (leitura A) ou 3.113 mg de creatina anidra (leitura B)'),
           ], 'rodape': RODAPE,
           'regras': 'Arredondamento: IN 75/2020 Anexo III. Não significativo: Anexo IV. Ordem/indentação: Anexo XI. Energia: Anexo XXII (sorbitol 2,6; maltitol 2,1; proteínas 4; ácidos orgânicos 3; fibras solúveis 2).'}
    ins = [dict(constituinte_anexo_i='Creatina — Creatina monohidratada (CAS 6020-87-7)', forma_insumo='Creatina monoidratada (pó)',
                massa_insumo_mg=massa, teor_pct=100.5, teor_fonte='laudo lote 26A05-B023-217949 (teor 100,5 % base seca; LOD 11,5 %; val. 22/09/2028)' + ('' if sabor == 'frutas vermelhas' else ' — lote replicado do memorial de frutas vermelhas; tutti-frutti não tem memorial próprio'),
                ativo_mg=round(ativo_A, 1), unidade_ativo='mg (leitura A)', ativo_leitura_b_mg=round(ativo_B, 1),
                conta=f'leitura A: 3.500 × 100,5 % = 3.517,5 mg (117,3 % do mínimo; 70,4 % do teto) · leitura B: 3.500 × 0,885 × 1,005 = 3.112,9 mg (103,8 % do mínimo; 62,3 % do teto)',
                minimo=3000, maximo=5000, pct_do_maximo=round(100*ativo_A/5000, 2), pct_do_maximo_leitura_b=round(100*ativo_B/5000, 2),
                linha_anexo='I·Creatina·Creatina monohidratada; III·Creatina (3.000 mg); IV·Creatina (5.000 mg, IN 373/2025)',
                laudo={'lote': '217949 (26A05-B023-217949)', 'validade': '22/09/2028', 'vencido': False}, status='dose ajustada',
                motivo='3.000 mg cravava o mínimo (100,5 % com o teor; 88,9 % na leitura B) e a creatina degrada a creatinina em meio úmido e ácido: 3.500 mg fica acima do mínimo nas duas leituras e o memorial já pedia 3.200–3.300 mg')]
    pend = [
        'A porção declarada (6 g = 2 gomas de 3,00 g) NÃO comporta a receita do memorial: sólidos por porção = ' + f'{solidos:,.0f}'.replace(',', '.') + ' mg (creatina 3.500 + excipientes secos ' + f'{solidos-massa:,.0f}'.replace(',', '.') + ' mg); com 3.000 mg de creatina já eram 6.814 mg. A "evaporação de 1.662,3 mg" alegada pelo memorial excede a água disponível (525 mg no sorbitol líquido + 323,3 mg = 848,3 mg). Ou a goma pesa mais que 3 g (então 180 g/60 gomas e "6 g" estão errados) ou a creatina por 2 gomas é menor que a declarada (pela proporção da OP, 34,7 % de creatina no lote, 2 gomas de 3 g teriam ≈ 2.380 mg — ABAIXO do mínimo). Só a balança e o doseamento resolvem: pesar 20 gomas acabadas (peso médio e umidade) e dosear creatina e creatinina no produto acabado (a análise MGW existente só tem microbiologia e glúten).',
        'Se o dono mantiver 3,00 g/goma, a fábrica precisa refazer a receita da base para caber (não há dado para fazê-lo aqui); se aceitar a goma maior, a porção passa a ser "2 gomas de ≈ 4 g" e o peso líquido muda — decisão do dono.',
        'Estudo de estabilidade (creatina/creatinina em 0, 3, 6, 12 e 24 meses) — sem ele o teor declarado não se sustenta na validade de 24 meses (o próprio memorial pede).',
        'Decisão do RT sobre a base do limite (leitura A × leitura B) — a dose proposta atende às duas.',
        'Sorbitol: laudo anexado é de pó (98,5 %), o insumo é líquido 70 % — pedir laudo do insumo real; polióis totais mudam conforme a hipótese (2,46–2,98 g).',
        'Sódio: rótulo diz 10 mg, o memorial só justifica 3,3–3,7 mg (citrato de sódio) — análise no produto acabado ou correção da declaração.',
        'Gelatina lote 214196 sem espécie declarada (alergênico se peixe; BSE se bovina).',
        'Sorbato de potássio grau PA em uso — trocar por grau alimentício (laudo válido: Analitic lote 91202, 100,30 %, val. 05/01/2028).',
        'Corante: a lista de materiais de produção cita vermelho 40 (INS 129) e indigotina (INS 132); o rótulo e o único laudo, ponceau 4R (INS 124) — fábrica decide qual entra na arte.' if sabor == 'frutas vermelhas' else 'Tutti-frutti não tem memorial, ficha técnica Lemon Caps nem rótulo próprios; aroma e corante ("corante rosa" da OP) sem nome técnico, INS, massa por porção nem laudo — PENDENTE antes de qualquer arte.',
        'Glúten: ensaio MGW < 10 ppm (RG 005711/03/2026, amostra "Lemoncaps Creatina em Gummy", lote G20/1556) permite "Não contém glúten" para o lote ensaiado' + ('' if sabor == 'frutas vermelhas' else ' — mas a amostra não identifica o sabor; para o tutti-frutti é PENDENTE') + '.',
        'Designação de venda: "Suplemento Alimentar em goma" (RDC 243 Art. 12) — o rótulo atual traz "Suplemento alimentar CREATINA em goma".',
    ]
    p = dict(slug=slug, porcao_mg=6000, porcao_descricao='2 gomas (rótulo: 6 g; massa real da porção PENDENTE de pesagem — os sólidos da receita somam ' + f'{solidos:,.0f}'.replace(',', '.') + ' mg)',
             formato='gummy', grupo_populacional='adultos (≥ 19 anos)', insumos=ins, excipientes=excip,
             soma_porcao_mg=round(soma, 2), cabe=False,
             ingredients_list=('Creatina monoidratada, sorbitol líquido, maltitol, gelatina (agente de textura), água purificada, glicerina vegetal (umectante), ácido cítrico (INS 330), pectina cítrica (espessante), corante vermelho ponceau 4R (INS 124), aroma de frutas vermelhas, citrato de sódio (INS 331), conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955). Não contém glúten [ensaio MGW RG 005711/03/2026, < 10 ppm, lote G20/1556].'
                               if sabor == 'frutas vermelhas' else
                               'Creatina monoidratada, sorbitol líquido, maltitol, gelatina (agente de textura), água purificada, glicerina vegetal (umectante), ácido cítrico (INS 330), pectina cítrica (espessante), aroma de tutti-frutti, citrato de sódio (INS 331), corante [nome técnico e INS PENDENTES — "corante rosa" na OP], conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955). ' + GLUTEN_PEND)
                              + ' [Alergênicos: "Contém: peixe" se a gelatina for de peixe — espécie PENDENTE]',
             warnings=warnings_join(ART14 + [GRUPO, ANEXO_VI_GERAL, POLIOIS + ' [base legal a confirmar pelo RT]', CONSERV]),
             serving_description='6 g (2 gomas) — massa da porção a confirmar por pesagem',
             pendencias=pend,
             veredito='CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção: CONDICIONADO A pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado e estudo de estabilidade' + ('' if sabor == 'frutas vermelhas' else '; e a documentação própria do sabor tutti-frutti (aroma, corante, laudos)'),
             _procedencia={'memorial': 'MEM-CALC-CREATGUMMY-rev02 (13/08/2026, sabor frutas vermelhas)', 'rotulo': 'composicoes_rotulo.json/creatina_gummy' if sabor == 'frutas vermelhas' else 'sem rótulo; OP_Completa_Gummy_Creatina_Tutti_Frutti_130_Potes.pdf (percentuais do lote)', 'laudo': '01_laudo_creatina-monoidratada_lote-217949.pdf'},
             composicoes_sql=[{'nome': 'Creatina monoidratada', 'quantidade': 3500, 'unidade': 'mg', 'ingredient_slug': 'creatina-monoidratada',
                               'metadata': md_comp(laudo_lote='217949 (26A05-B023-217949)', teor_pct=100.5, ativo_mg=3517.5, ativo_leitura_b_mg=3112.9, massa_insumo_mg=3500, linha_anexo='I·Creatina monohidratada; III·Creatina 3.000; IV·Creatina 5.000', e_sal=False, observacao='3.000 → 3.500 mg: folga sobre o mínimo (degradação a creatinina na goma)')}])
    gravar(p, tab)

# =====================================================================================
# 6. MELATONINA EM GOMA
# =====================================================================================
def melatonina():
    slug = 'melatonina-em-gummy-sabor-uva'
    trp_m = 750.75; trp = trp_m * 0.999
    mel_m = 0.1812; mel = mel_m * 0.9933
    ins = [
        dict(constituinte_anexo_i='Triptofano — L-Triptofano (CAS 73-22-3)', forma_insumo='L-triptofano', massa_insumo_mg=trp_m, teor_pct=99.9,
             teor_fonte='laudo lote 950388 (Analitic/INLAB, val. 03/10/2026 — vence em 17 dias; 6 ensaios, sem perfil de impurezas)', ativo_mg=round(trp, 2), unidade_ativo='mg',
             conta='750,75 mg × 99,9 % = 750,0 mg', minimo=42, maximo=860, pct_do_maximo=round(100*trp/860, 2),
             linha_anexo='I·Triptofano·L-Triptofano; III·Triptofano (42 mg); IV·Triptofano (860 mg)',
             laudo={'lote': '950388', 'validade': '03/10/2026', 'vencido': False}, status='dose ajustada',
             motivo='800 mg = 93 % do teto; 750 mg = 87,2 % (memorial rev02 já sugeria 750 mg). Existe versão do produto SEM triptofano (ver memorial) — decisão do dono'),
        dict(constituinte_anexo_i='Melatonina — Melatonina (CAS 73-31-4, IN 102/2021)', forma_insumo='Melatonina', massa_insumo_mg=mel_m, teor_pct=99.33,
             teor_fonte='laudo lote 950151 (Analitic/INLAB): 99,5 % base seca × (1 − 0,17 % umidade) = 99,33 % — LAUDO VENCIDO em 09/12/2024 (último teor conhecido; todos os 5 laudos de melatonina em disco estão vencidos) — pedir laudo novo', ativo_mg=round(mel, 4), unidade_ativo='mg',
             conta='0,1812 mg × 99,33 % = 0,180 mg', minimo=None, maximo=0.21, pct_do_maximo=round(100*mel/0.21, 2),
             linha_anexo='I·Melatonina; III·Melatonina (NE); IV·Melatonina (0,21 mg)',
             laudo={'lote': '950151', 'validade': '09/12/2024', 'vencido': True}, status='dose ajustada',
             motivo='0,21 mg cravava o teto de segurança; 0,18 mg = 85,7 % do teto (memorial sugeria 0,19 mg = 90,5 %, acima da regra de 90 %)'),
    ]
    excip = [{'nome': n, 'ins': i, 'massa_mg': None, 'observacao': o} for (n, i, o) in [
        ('Sorbitol líquido 70 %', '420', 'massa PENDENTE (memorial: "matriz de goma q.s.p. 5.198,99 mg")'),
        ('Maltitol', '965', 'massa PENDENTE; laudo lote 106330 válido (99,70 %)'),
        ('Gelatina', None, 'massa PENDENTE; espécie animal não declarada (lote 214196)'),
        ('Água purificada', None, 'massa PENDENTE'),
        ('Glicerina vegetal', '422', 'massa PENDENTE'),
        ('Maltodextrina', None, 'massa PENDENTE; laudo lote 210170 VENCIDO 26/07/2026'),
        ('Pectina cítrica', '440', 'massa PENDENTE'),
        ('Goma acácia', '414', 'massa PENDENTE; laudo lote 105226 pH fora de spec'),
        ('Ácido cítrico', '330', 'massa PENDENTE'),
        ('Aroma de uva', None, 'massa PENDENTE; sem laudo citado'),
        ('Citrato de sódio', '331', 'massa PENDENTE; laudo lote 6ST2401047 válido'),
        ('Sorbato de potássio', '202', 'massa PENDENTE; grau PA em uso — trocar por grau alimentício'),
        ('Sucralose', '955', 'massa PENDENTE'),
        ('Corante vermelho 40', '129', 'massa PENDENTE; SEM laudo no dossiê'),
        ('Corante azul brilhante FCF', '133', 'massa PENDENTE; SEM laudo no dossiê'),
        ('Matriz de goma — soma (q.s.p.)', None, '6.000,00 − 750,93 mg de ativos = 5.249,07 mg'),
    ]]
    excip[-1]['massa_mg'] = round(6000 - (trp_m + mel_m), 2)
    tab = {'porcoes_por_embalagem': '30', 'porcao': '6 g (2 gomas)', 'porcao_coluna': '6 g',
           'linhas': [
               *energia_linhas(None, pendente=True, nota='memorial sem massa dos excipientes; rótulo/memorial: 11 kcal = 46 kJ (não recalculável)'),
               linha('Carboidratos', None, 'g', pendente=True, nota='rótulo/memorial: 4,5 g'),
               linha('Açúcares totais', None, 'g', nivel=1, pendente=True, nota='maltodextrina na base — fração de mono/dissacarídeos não quantificada'),
               linha('Açúcares adicionados', None, 'g', nivel=2, pendente=True),
               linha('Polióis totais', None, 'g', nivel=1, pendente=True, nota='rótulo/memorial: 3,4 g'),
               linha('Proteínas', None, 'g', pendente=True, nota='rótulo/memorial: 0,8 g (gelatina; massa não disponível)'),
               linha('L-triptofano', trp, 'mg', None, nivel=1, nota='aminoácido específico, 1º nível sob Proteínas (Anexo XI); sem VDR'),
               linha('Gorduras totais', 0, 'g', VDR['gorduras_totais_g'], nao_signif=0.5),
               linha('Gorduras saturadas', 0, 'g', VDR['gorduras_saturadas_g'], nivel=1, nao_signif=0.1),
               linha('Gorduras trans', 0, 'g', VDR['gorduras_trans_g'], nivel=1, nao_signif=0.1),
               linha('Fibras alimentares', None, 'g', pendente=True, nota='pectina/goma acácia; massas não disponíveis'),
               linha('Sódio', None, 'mg', pendente=True, nota='rótulo/memorial: 8 mg'),
               linha('Melatonina', mel, 'mg', None, nota='substância bioativa; sem VDR → %VD em branco'),
           ], 'rodape': RODAPE,
           'regras': 'Arredondamento: IN 75/2020 Anexo III (0,180 mg → "0,18"). Ordem: Anexo XI.'}
    p = dict(slug=slug, porcao_mg=6000, porcao_descricao='6 g (2 gomas de 3,00 g) — 30 porções (60 gomas, 180 g); a ficha "Suelen" da versão só-melatonina traz 7,0 g (2 gomas), 210 g',
             formato='gummy', grupo_populacional='adultos (≥ 19 anos)', insumos=ins, excipientes=excip, soma_porcao_mg=6000.0, cabe=True,
             ingredients_list='Sorbitol líquido, maltitol, gelatina, L-triptofano, água purificada, glicerina vegetal, maltodextrina, pectina cítrica, goma acácia, ácido cítrico (INS 330), aroma de uva, citrato de sódio (INS 331), conservador sorbato de potássio (INS 202), edulcorante sucralose (INS 955), corante vermelho 40 (INS 129), corante azul brilhante FCF (INS 133) e melatonina. Não contém glúten [ensaio MGW RG 005706/03/2026, < 10 ppm, lote G20/1550]. [Alergênicos: "Contém: peixe" se a gelatina for de peixe — espécie PENDENTE]',
             warnings=warnings_join(ART14 + [GRUPO, ANEXO_VI_MELA, ANEXO_VI_GERAL, POLIOIS + ' [base legal a confirmar pelo RT]', CONSERV]),
             serving_description='6 g (2 gomas)',
             pendencias=[
                 'Decisão do dono: o pote em produção leva L-triptofano (versão A — "Dream Gummy", arte DreamGummy.pdf e cadastro atual) ou é só melatonina (versão B — "Melatonina em Gummy", ficha Suelen de 28/08/2026 e Relatório de Rótulos)? O SQL grava a versão A; a versão B está no memorial.',
                 'Laudo NOVO de melatonina: todos os cinco laudos em disco estão vencidos (950151 desde 09/12/2024; Lepuge AUTO040242/AUTO039807 desde 27/05/2026; Gamma 11038 desde 2022).',
                 'Laudo do L-triptofano lote 950388 vence em 03/10/2026 e tem só 6 ensaios (sem identificação nem perfil de impurezas) — exigir certificado completo; confirmar no painel da ANVISA se a especificação de fabricante (Kyowa Hakko, citada pelo memorial) vale para "L-Triptofano" (CAS 73-22-3) ou só para "L-triptofano de glicose de milho" — no texto literal do Anexo I o L-Triptofano não traz nota de fabricante.',
                 'Massas dos excipientes da matriz (memorial só traz o q.s.p.) — sem elas, energia, carboidratos, polióis, proteínas, fibras e sódio ficam PENDENTES.',
                 'Corantes vermelho 40 e azul brilhante FCF sem laudo no dossiê; goma acácia com pH fora de spec; sorbato PA; maltodextrina vencida; gelatina sem espécie.',
                 'target_audience e storage_instructions estão vazios no banco — o SQL não os preenche (fora do escopo pedido); propor "Adultos (19 anos ou mais)" e a conservação padrão.',
                 'Frases "preferencialmente antes de dormir"/"rotina noturna" no rótulo podem ser lidas como alegação implícita (memorial) — RT confere.',
             ],
             veredito='CONFORME CONDICIONADO A (laudo novo de melatonina; laudo completo/novo de L-triptofano; decisão versão A/B)',
             _procedencia={'memorial': 'MEM-CALC-DREAMGUMMY-rev02 (13/08/2026)', 'rotulo': 'composicoes_rotulo.json/dreamgummy (DreamGummy.pdf)'},
             composicoes_sql=[
                 {'nome': 'L-triptofano', 'quantidade': 750, 'unidade': 'mg', 'ingredient_slug': 'l-triptofano',
                  'metadata': md_comp(laudo_lote='950388', teor_pct=99.9, ativo_mg=750.0, massa_insumo_mg=750.75, linha_anexo='I·L-Triptofano; III·Triptofano 42; IV·Triptofano 860', e_sal=False, observacao='800 → 750 mg (87,2 % do teto)')},
                 {'nome': 'Melatonina', 'quantidade': 0.18, 'unidade': 'mg', 'ingredient_slug': 'melatonina',
                  'metadata': md_comp(laudo_lote='950151 (VENCIDO 09/12/2024 — último teor conhecido)', teor_pct=99.33, ativo_mg=0.18, massa_insumo_mg=0.1812, linha_anexo='I·Melatonina; IV·Melatonina 0,21', e_sal=False, observacao='0,21 → 0,18 mg (85,7 % do teto)')},
             ])
    gravar(p, tab)

# =====================================================================================
# 7. PRÉ TREINO 300 g (10 g)
# =====================================================================================
def pre300():
    slug = 'pre-treino-300-g'
    creat = 3500.0; creat_A = creat * 1.005; creat_B = creat * 0.885 * 1.005
    beta = 300.0 * 0.991
    arg_m = 1240.0; arg = arg_m * 0.994 * (174.20/210.66)
    tau = 900.0 * 0.9946
    tir = 400.0 * 0.999
    caf_m = 175.0; caf = caf_m * 0.9988
    b6_m = 2.00; b6 = b6_m * 0.999 * (169.18/205.64)
    b12_m = 0.00899; b12 = b12_m * 0.9454
    ativos = creat + 300 + arg_m + tau/0.9946 + 400 + caf_m + b6_m + b12_m  # massas de insumo
    excip_fixos = [('Ácido cítrico', '330', 1100.0, 'acidulante; laudo lote GE2844AFG (100,1 %, val. 28/05/2030)'),
                   ('Aromatizante idêntico ao natural de limão', None, 350.0, 'laudo lote 19504 (Alphataste) vence em 25/09/2026'),
                   ('Dióxido de silício', '551', 118.0, 'antiumectante; laudo lote 876013 sem teor (val. 01/2027)'),
                   ('Sucralose', '955', 90.0, '99,74 % (laudo lote 91233, val. 22/12/2026)')]
    malto = 10000 - (creat + 300 + arg_m + 900 + 400 + caf_m + b6_m + b12_m + sum(m for _, _, m, _ in excip_fixos))
    excip = [{'nome': n, 'ins': i, 'massa_mg': m, 'observacao': o} for (n, i, m, o) in excip_fixos]
    excip.append({'nome': 'Maltodextrina', 'ins': None, 'massa_mg': round(malto, 3), 'observacao': 'veículo q.s.p. 10.000 mg (Art. 6 § único RDC 243); laudo lote 210170 VENCIDO 26/07/2026 — lote novo antes de fabricar; DE 17,72 %'})
    soma = creat + 300 + arg_m + 900 + 400 + caf_m + b6_m + b12_m + sum(m for _, _, m, _ in excip_fixos) + malto
    kcal = malto/1000*4 + 1.1*3 + (arg + tir + beta)/1000*4
    ins = [
        dict(constituinte_anexo_i='Creatina — Creatina monohidratada (CAS 6020-87-7)', forma_insumo='Creatina monoidratada', massa_insumo_mg=creat, teor_pct=100.5, teor_fonte='laudo lote 26A05-B023-217949 (val. 22/09/2028)', ativo_mg=round(creat_A, 1), unidade_ativo='mg (leitura A)', ativo_leitura_b_mg=round(creat_B, 1), conta='A: 3.500 × 1,005 = 3.517,5 mg (70,4 % do teto) · B: 3.500 × 0,885 × 1,005 = 3.112,9 mg (103,8 % do mínimo)', minimo=3000, maximo=5000, pct_do_maximo=round(100*creat_A/5000, 2), linha_anexo='I·Creatina monohidratada; III·Creatina 3.000; IV·Creatina 5.000', laudo={'lote': '217949', 'validade': '22/09/2028', 'vencido': False}, status='dose ajustada', motivo='memorial 3.000 (piso) e cadastro 5.000 (teto): 3.500 dá folga nas duas leituras'),
        dict(constituinte_anexo_i='Beta-alanina (CAS 107-95-9, IN 102/2021)', forma_insumo='Beta-alanina', massa_insumo_mg=300.0, teor_pct=99.1, teor_fonte='laudo Lepuge lote AUTO033847 (99,1 %) — VENCIDO em 03/08/2026: último teor conhecido, pedir laudo novo (o memorial não tinha laudo nenhum)', ativo_mg=round(beta, 1), unidade_ativo='mg', conta='300 × 99,1 % = 297,3 mg', minimo=None, maximo=2000, pct_do_maximo=round(100*beta/2000, 2), linha_anexo='I·Beta-alanina; IV·Beta-alanina (2 g); VI·Beta-alanina (doses de no máximo 300 mg com 2 h de intervalo)', laudo={'lote': 'AUTO033847', 'validade': '03/08/2026', 'vencido': True}, status='dose ajustada', motivo='memorial pesa 2.000 mg em dose única — contraria a condição do Anexo VI; 300 mg em 1 dose/dia atende (cadastro já trazia 300)'),
        dict(constituinte_anexo_i='Arginina — Cloridrato de L-arginina (CAS 1119-34-2)', forma_insumo='Cloridrato de L-arginina', massa_insumo_mg=arg_m, teor_pct=round(0.994*174.20/210.66*100, 2), teor_fonte='laudo Lepuge lote AUTO035918 (doseamento 99,40 %, val. 12/11/2026); conversão sal→base 174,20/210,66 = 82,69 %', ativo_mg=round(arg, 1), unidade_ativo='mg de L-arginina', conta='1.240 × 99,40 % × 82,69 % = 1.019,2 mg', minimo=None, maximo=3810, pct_do_maximo=round(100*arg/3810, 2), linha_anexo='I·Arginina·Cloridrato de L-arginina; III·Arginina (NE); IV·Arginina (3.810 mg)', laudo={'lote': 'AUTO035918', 'validade': '12/11/2026', 'vencido': False}, status='mantido (memorial) / novo no cadastro', motivo='substitui a L-citrulina malato (não consta do Anexo I); o memorial já fez essa troca em 14/08/2026'),
        dict(constituinte_anexo_i='Taurina (CAS 107-35-7)', forma_insumo='Taurina', massa_insumo_mg=900.0, teor_pct=99.46, teor_fonte='laudo lote 25H04-B053-214586 (99,5 % b.s. × 0,9996; val. 10/05/2028) — dados do memorial (digitalização não relida)', ativo_mg=round(tau, 1), unidade_ativo='mg', conta='900 × 99,46 % = 895,1 mg', minimo=None, maximo=2000, pct_do_maximo=round(100*tau/2000, 2), linha_anexo='I·Taurina; IV·Taurina (2.000 mg)', laudo={'lote': '214586', 'validade': '10/05/2028', 'vencido': False}, status='dose ajustada (cadastro 2.000 → memorial 900)', motivo='cadastro cravava o teto; a fábrica pesa 900'),
        dict(constituinte_anexo_i='Tirosina — L-Tirosina (CAS 60-18-4)', forma_insumo='L-tirosina', massa_insumo_mg=400.0, teor_pct=99.9, teor_fonte='laudo lote 91382 (Analitic, val. 07/05/2028)', ativo_mg=round(tir, 1), unidade_ativo='mg', conta='400 × 99,9 % = 399,6 mg', minimo=262.5, maximo=2750, pct_do_maximo=round(100*tir/2750, 2), linha_anexo='I·L-Tirosina; III·Tirosina^viii (262,5 mg); IV·Tirosina (2.750 mg)', laudo={'lote': '91382', 'validade': '07/05/2028', 'vencido': False}, status='dose ajustada (cadastro 500 → memorial 400)', motivo='152 % do mínimo; 14,5 % do teto'),
        dict(constituinte_anexo_i='Cafeína — Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2)', forma_insumo='Cafeína anidra', massa_insumo_mg=caf_m, teor_pct=99.88, teor_fonte='laudo lote 25I01-B062-214171 (100,11 % anidra × 0,9977; val. 02/12/2029) — dados do memorial', ativo_mg=round(caf, 1), unidade_ativo='mg', conta='175 × 99,88 % = 174,8 mg', minimo=75, maximo=200, pct_do_maximo=round(100*caf/200, 2), linha_anexo='I·Cafeína; III·Cafeína (75 mg); IV·Cafeína^vi (200 mg)', laudo={'lote': '214171', 'validade': '02/12/2029', 'vencido': False}, status='dose ajustada', motivo='200 mg cravava o teto (199,76 mg = 99,9 %); 175 mg = 87,4 %. Insumo controlado (Polícia Federal): situação da licença PENDENTE'),
        dict(constituinte_anexo_i='Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0)', forma_insumo='Cloridrato de piridoxina', massa_insumo_mg=b6_m, teor_pct=round(0.999*169.18/205.64*100, 2), teor_fonte='laudo lote 91188 (Analitic, 99,9 %, val. 28/12/2027); conversão 169,18/205,64 = 82,27 %', ativo_mg=round(b6, 3), unidade_ativo='mg de piridoxina', conta='2,00 × 99,9 % × 82,27 % = 1,644 mg', minimo=0.26, maximo=98.60, pct_do_maximo=round(100*b6/98.60, 2), linha_anexo='I·Vitamina B6·Cloridrato de piridoxina; III·Vitamina B6 (0,26 mg); IV·Vitamina B6 (98,60 mg)', laudo={'lote': '91188', 'validade': '28/12/2027', 'vencido': False}, status='mantido (memorial) / novo no cadastro', motivo='126 % VD; 1,7 % do teto'),
        dict(constituinte_anexo_i='Vitamina B12 — Metilcobalamina (CAS 13422-55-4)', forma_insumo='Metilcobalamina', massa_insumo_mg=b12_m, teor_pct=94.54, teor_fonte='laudo lote 90955 (Analitic, 99,2 % base anidra × (1 − 4,7 % água) = 94,54 %; val. 28/12/2026 — vence em 3 meses; alternativa lote 219376, 98,17 %, val. 14/11/2030)', ativo_mg=round(b12, 5), unidade_ativo='mg (= 8,5 µg)', conta='0,00899 × 94,54 % = 0,0085 mg = 8,5 µg', minimo=0.36e-3, maximo=9.94e-3, pct_do_maximo=round(100*b12/9.94e-3, 2), linha_anexo='I·Vitamina B12·Metilcobalamina; III·Vitamina B12 (0,36 µg); IV·Vitamina B12 (9,94 µg)', laudo={'lote': '90955', 'validade': '28/12/2026', 'vencido': False}, status='dose ajustada', motivo='memorial entrega 9,40 µg = 94,6 % do teto; 8,5 µg = 85,5 %'),
    ]
    tab = {'porcoes_por_embalagem': '30', 'porcao': '10 g (1 dosador)', 'porcao_coluna': '10 g',
           'linhas': [
               *energia_linhas(kcal, nota=f'maltodextrina {malto/1000:.3f} g × 4 + ácido cítrico 1,1 g × 3 + aminoácidos (arginina 1,019 + tirosina 0,400 + beta-alanina 0,297 g) × 4 = {kcal:.2f} kcal; taurina e creatina sem fator no Anexo XXII → 0 (critério do RT)'.replace('.', ',')),
               linha('Carboidratos', malto/1000, 'g', VDR['carboidratos_g'], nota='maltodextrina (veículo)'),
               linha('Açúcares totais', None, 'g', nivel=1, pendente=True, nota='fração de mono/dissacarídeos da maltodextrina (DE 17,72 %) não quantificada — RDC 429 Art. 3 I/II'),
               linha('Açúcares adicionados', None, 'g', nivel=2, pendente=True, nota='idem (maltodextrina conta como açúcar adicionado na fração de mono/dissacarídeos)'),
               linha('Proteínas', 0, 'g', VDR['proteinas_g'], nao_signif=0.5, nota='sem fonte proteica; aminoácidos livres declarados abaixo'),
               linha('L-arginina', arg, 'mg', None, nivel=1),
               linha('L-tirosina', tir, 'mg', None, nivel=1),
               linha('Beta-alanina', beta, 'mg', None, nivel=1),
               linha('Gorduras totais', 0, 'g', VDR['gorduras_totais_g'], nao_signif=0.5),
               linha('Gorduras saturadas', 0, 'g', VDR['gorduras_saturadas_g'], nivel=1, nao_signif=0.1),
               linha('Gorduras trans', 0, 'g', VDR['gorduras_trans_g'], nivel=1, nao_signif=0.1),
               linha('Fibras alimentares', 0, 'g', VDR['fibras_g'], nao_signif=0.5),
               linha('Sódio', 0, 'mg', VDR['sodio_mg'], nao_signif=5, nota='sem fonte de sódio na receita'),
               linha('Vitamina B6', b6, 'mg', VDR['vitamina_b6_mg']),
               linha('Vitamina B12', b12*1000, 'µg', VDR['vitamina_b12_mcg']),
               linha('Taurina', tau, 'mg', None),
               linha('Cafeína', caf, 'mg', None),
               linha('Creatina', 3500, 'mg', None, nota='massa nominal de creatina monoidratada (lote 217949: 3.517,5 mg A / 3.113 mg B)'),
           ], 'rodape': RODAPE, 'regras': 'IN 75/2020 Anexos III, IV, VIII, XI e XXII (lidos 16/09/2026).'}
    p = dict(slug=slug, porcao_mg=10000, porcao_descricao='10 g (1 dosador) diluídos em 200 mL de água, 1 vez ao dia — 30 porções em 300 g',
             formato='pó (solúvel)', grupo_populacional='adultos (≥ 19 anos)', insumos=ins, excipientes=excip, soma_porcao_mg=round(soma, 3), cabe=True,
             ingredients_list='Creatina monoidratada, maltodextrina, cloridrato de L-arginina, acidulante ácido cítrico (INS 330), taurina, L-tirosina, aromatizante idêntico ao natural de limão, beta-alanina, cafeína anidra, antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), vitamina B6 (cloridrato de piridoxina) e vitamina B12 (metilcobalamina). ' + GLUTEN_PEND,
             warnings=warnings_join(ART14 + [GRUPO, ANEXO_VI_GERAL, ANEXO_VI_BETA, 'Contém cafeína (175 mg por porção).', CONSERV]),
             serving_description='10 g (1 dosador)',
             pendencias=[
                 'Laudo novo de beta-alanina (o de disco, Lepuge AUTO033847, venceu em 03/08/2026; o memorial não tinha nenhum).',
                 'Cafeína anidra é insumo controlado pela Polícia Federal ("Controlado P.F." no laudo) — situação da licença da Lemoncaps não esclarecida em nenhum documento (memorial, seção 16).',
                 'Maltodextrina lote 210170 vencido (26/07/2026); aroma de limão lote 19504 vence em 25/09/2026; cloridrato de L-arginina AUTO035918 vence em 12/11/2026; B12 lote 90955 vence em 28/12/2026.',
                 'Perfil de açúcares da maltodextrina (DE 17,72 %) para fechar açúcares totais/adicionados.',
                 'Corante: o cadastro listava "corante artificial (INS)" sem nome, INS ou massa; o memorial da fábrica não tem corante — a lista proposta segue o memorial. Se a fábrica usar corante, informar nome, INS e massa (IN 211/2023).',
                 'Decisão do RT sobre a base do limite de creatina (leitura A/B) e sobre o critério de energia dos aminoácidos livres.',
                 'Nova arte de rótulo (não existe rótulo deste produto em disco).',
             ],
             veredito='CONFORME (fórmula proposta, com folga em todos os constituintes) — condicionado a laudo novo de beta-alanina e à regularização do insumo controlado (cafeína)',
             _procedencia={'memorial': 'MEMORIAL-CALCULO-PRE-TREINO.docx MC-PRD-PRETREINO-001 Rev.01 (14/08/2026)', 'cadastro': 'banco lido ao vivo 16/09/2026 (10 linhas, com citrulina na lista de ingredientes)'},
             composicoes_sql=[
                 {'nome': 'Creatina monoidratada', 'quantidade': 3500, 'unidade': 'mg', 'ingredient_slug': 'creatina-monoidratada', 'metadata': md_comp(laudo_lote='217949', teor_pct=100.5, ativo_mg=3517.5, ativo_leitura_b_mg=3112.9, linha_anexo='I·Creatina monohidratada; III/IV·Creatina', e_sal=False)},
                 {'nome': 'Maltodextrina', 'quantidade': round(malto, 3), 'unidade': 'mg', 'ingredient_slug': 'maltodextrina', 'metadata': md_comp(laudo_lote='210170 (VENCIDO 26/07/2026)', teor_pct=None, ativo_mg=None, linha_anexo='I·Carboidratos·Maltodextrina (veículo, Art. 6 § único RDC 243)', e_sal=False, papel='excipiente q.s.p.')},
                 {'nome': 'Cloridrato de L-arginina', 'quantidade': 1240, 'unidade': 'mg', 'ingredient_slug': 'cloridrato-de-l-arginina', 'metadata': md_comp(laudo_lote='AUTO035918', teor_pct=82.2, ativo_mg=1019.2, unidade_ativo='mg de L-arginina', linha_anexo='I·Cloridrato de L-arginina; IV·Arginina 3.810', e_sal=True, elemento_equivalente_mg=1019.2)},
                 {'nome': 'Ácido cítrico (INS 330)', 'quantidade': 1100, 'unidade': 'mg', 'ingredient_slug': 'acido-citrico', 'metadata': md_comp(laudo_lote='GE2844AFG', teor_pct=100.1, ativo_mg=None, linha_anexo='aditivo — IN 211/2023 cat. 14.2 (quantum satis)', papel='acidulante')},
                 {'nome': 'Taurina', 'quantidade': 900, 'unidade': 'mg', 'ingredient_slug': 'taurina', 'metadata': md_comp(laudo_lote='214586', teor_pct=99.46, ativo_mg=895.1, linha_anexo='I·Taurina; IV·Taurina 2.000', e_sal=False)},
                 {'nome': 'L-tirosina', 'quantidade': 400, 'unidade': 'mg', 'ingredient_slug': 'l-tirosina', 'metadata': md_comp(laudo_lote='91382', teor_pct=99.9, ativo_mg=399.6, linha_anexo='I·L-Tirosina; III·Tirosina 262,5; IV·Tirosina 2.750', e_sal=False)},
                 {'nome': 'Aromatizante idêntico ao natural de limão', 'quantidade': 350, 'unidade': 'mg', 'ingredient_slug': 'aromatizante-identico-ao-natural-de-limao', 'metadata': md_comp(laudo_lote='19504 (vence 25/09/2026)', teor_pct=None, ativo_mg=None, linha_anexo='aditivo — IN 211/2023 cat. 14.2', papel='aromatizante')},
                 {'nome': 'Beta-alanina', 'quantidade': 300, 'unidade': 'mg', 'ingredient_slug': 'beta-alanina', 'metadata': md_comp(laudo_lote='AUTO033847 (VENCIDO 03/08/2026 — último teor conhecido)', teor_pct=99.1, ativo_mg=297.3, linha_anexo='I·Beta-alanina; IV·Beta-alanina 2 g; VI·Beta-alanina', e_sal=False)},
                 {'nome': 'Cafeína anidra', 'quantidade': 175, 'unidade': 'mg', 'ingredient_slug': 'cafeina-anidra', 'metadata': md_comp(laudo_lote='214171', teor_pct=99.88, ativo_mg=174.8, linha_anexo='I·Cafeína; III·Cafeína 75; IV·Cafeína 200', e_sal=False, observacao='200 → 175 mg (87,4 % do teto)')},
                 {'nome': 'Dióxido de silício (INS 551)', 'quantidade': 118, 'unidade': 'mg', 'ingredient_slug': 'dioxido-de-silicio', 'metadata': md_comp(laudo_lote='876013', teor_pct=None, ativo_mg=None, linha_anexo='aditivo — IN 211/2023 cat. 14.2 (quantum satis)', papel='antiumectante')},
                 {'nome': 'Edulcorante sucralose (INS 955)', 'quantidade': 90, 'unidade': 'mg', 'ingredient_slug': 'edulcorante-sucralose', 'metadata': md_comp(laudo_lote='91233', teor_pct=99.74, ativo_mg=None, linha_anexo='aditivo — IN 211/2023 cat. 14.2 (2.400 mg/kg no produto pronto)', papel='edulcorante')},
                 {'nome': 'Vitamina B6 (cloridrato de piridoxina)', 'quantidade': 2, 'unidade': 'mg', 'ingredient_slug': 'vitamina-b6', 'metadata': md_comp(laudo_lote='91188', teor_pct=82.19, ativo_mg=1.644, unidade_ativo='mg de piridoxina', linha_anexo='I·Cloridrato de piridoxina; III/IV·Vitamina B6', e_sal=True, elemento_equivalente_mg=1.644)},
                 {'nome': 'Vitamina B12 (metilcobalamina)', 'quantidade': 8.99, 'unidade': 'mcg', 'ingredient_slug': 'vitamina-b12', 'metadata': md_comp(laudo_lote='90955', teor_pct=94.54, ativo_mg=0.0085, unidade_ativo='µg (8,5)', linha_anexo='I·Metilcobalamina; III/IV·Vitamina B12', e_sal=False, observacao='9,94 µg pesados → 8,99 µg pesados (entrega 8,5 µg = 85,5 % do teto)')},
             ])
    gravar(p, tab)

# =====================================================================================
# 8. PRÉ-TREINO + CREATINA "CÉSIO 137" 420 g (14 g)
# =====================================================================================
def cesio():
    slug = 'pre-treino-creatina-sabor-limao-420g'
    creat = 4000.0; creat_A = creat*1.005; creat_B = creat*0.885*1.005
    beta = 300.0*0.991
    arg_m = 1240.0; arg = arg_m*0.994*(174.20/210.66)
    tau = 1000.0*0.9946
    tir = 1000.0*0.999
    carn = 1000.0*0.9941
    mg_m = 1000.0; mg = mg_m*0.300
    guar_m = 250.0; guar_caf = guar_m*0.0511
    caf_m = 150.0; caf_an = caf_m*0.9988; caf_tot = caf_an + guar_caf
    b6_m = 90.0; b6 = b6_m*0.999*(169.18/205.64)
    b3_m = 30.0; b3 = b3_m*0.995
    d3_m = 13.9; d3_ui = d3_m*115.0; d3 = d3_ui/40.0
    b12_m = 0.00899; b12 = b12_m*0.9454
    excip_fixos = [('Ácido cítrico', '330', 1100.0, 'acidulante; laudo lote GE2844AFG'),
                   ('Aromatizante idêntico ao natural de limão', None, 350.0, 'laudo lote 19504 vence em 25/09/2026'),
                   ('Dióxido de silício', '551', 118.0, 'antiumectante'),
                   ('Sucralose', '955', 90.0, '99,74 % (lote 91233)'),
                   ('Corante tartrazina', '102', None, 'massa PENDENTE — a FRM Rev.02 não quantifica; rótulo/cadastro listam. Limite IN 211/2023 cat. 14.2: 300 mg/kg → ≤ 4,2 mg em 14 g')]
    fixos = sum(m for _, _, m, _ in excip_fixos if m)
    ativos_m = creat + 300 + arg_m + 1000 + 1000 + 1000 + mg_m + guar_m + caf_m + b6_m + b3_m + d3_m + b12_m
    malto = 14000 - ativos_m - fixos
    excip = [{'nome': n, 'ins': i, 'massa_mg': m, 'observacao': o} for (n, i, m, o) in excip_fixos]
    excip.append({'nome': 'Maltodextrina', 'ins': None, 'massa_mg': round(malto, 3), 'observacao': 'veículo q.s.p. 14.000 mg; laudo lote 210170 VENCIDO'})
    soma = ativos_m + fixos + malto
    kcal = malto/1000*4 + 1.1*3 + (arg + tir + beta)/1000*4
    ins = [
        dict(constituinte_anexo_i='Creatina — Creatina monohidratada (CAS 6020-87-7)', forma_insumo='Creatina monoidratada', massa_insumo_mg=creat, teor_pct=100.5, teor_fonte='laudo lote 26A05-B023-217949 (val. 22/09/2028)', ativo_mg=round(creat_A, 1), unidade_ativo='mg (leitura A)', ativo_leitura_b_mg=round(creat_B, 1), conta='A: 4.000 × 1,005 = 4.020 mg (80,4 % do teto) · B: 4.000 × 0,885 × 1,005 = 3.557,7 mg (71,2 %)', minimo=3000, maximo=5000, pct_do_maximo=round(100*creat_A/5000, 2), linha_anexo='I·Creatina monohidratada; III·Creatina 3.000; IV·Creatina 5.000', laudo={'lote': '217949', 'validade': '22/09/2028', 'vencido': False}, status='dose ajustada', motivo='5.000 cravava o teto (5.025 com o teor)'),
        dict(constituinte_anexo_i='Beta-alanina (CAS 107-95-9)', forma_insumo='Beta-alanina', massa_insumo_mg=300.0, teor_pct=99.1, teor_fonte='laudo Lepuge AUTO033847 VENCIDO 03/08/2026 — último teor conhecido', ativo_mg=round(beta, 1), unidade_ativo='mg', conta='300 × 99,1 % = 297,3 mg', minimo=None, maximo=2000, pct_do_maximo=round(100*beta/2000, 2), linha_anexo='I·Beta-alanina; IV·Beta-alanina 2 g; VI·Beta-alanina', laudo={'lote': 'AUTO033847', 'validade': '03/08/2026', 'vencido': True}, status='dose ajustada', motivo='2.000 mg em dose única contraria o Anexo VI (doses de no máximo 300 mg, 2 h de intervalo)'),
        dict(constituinte_anexo_i='Arginina — Cloridrato de L-arginina (CAS 1119-34-2)', forma_insumo='Cloridrato de L-arginina', massa_insumo_mg=arg_m, teor_pct=82.2, teor_fonte='laudo Lepuge AUTO035918 (99,40 %, val. 12/11/2026); 174,20/210,66 = 82,69 %', ativo_mg=round(arg, 1), unidade_ativo='mg de L-arginina', conta='1.240 × 99,40 % × 82,69 % = 1.019,2 mg', minimo=None, maximo=3810, pct_do_maximo=round(100*arg/3810, 2), linha_anexo='I·Cloridrato de L-arginina; IV·Arginina 3.810', laudo={'lote': 'AUTO035918', 'validade': '12/11/2026', 'vencido': False}, status='forma trocada / dose ajustada', motivo='rótulo/cadastro: 3.810 mg de "L-arginina" (teto exato); FRM Rev.02: 1.000 mg sem forma. Usa-se a forma com laudo válido em disco (cloridrato), entregando 1.019 mg de arginina'),
        dict(constituinte_anexo_i='Taurina (CAS 107-35-7)', forma_insumo='Taurina', massa_insumo_mg=1000.0, teor_pct=99.46, teor_fonte='laudo lote 214586 (val. 10/05/2028)', ativo_mg=round(tau, 1), unidade_ativo='mg', conta='1.000 × 99,46 % = 994,6 mg', minimo=None, maximo=2000, pct_do_maximo=round(100*tau/2000, 2), linha_anexo='I·Taurina; IV·Taurina 2.000', laudo={'lote': '214586', 'validade': '10/05/2028', 'vencido': False}, status='mantido', motivo='49,7 % do teto'),
        dict(constituinte_anexo_i='Tirosina — L-Tirosina (CAS 60-18-4)', forma_insumo='L-tirosina', massa_insumo_mg=1000.0, teor_pct=99.9, teor_fonte='laudo lote 91382 (val. 07/05/2028)', ativo_mg=round(tir, 1), unidade_ativo='mg', conta='1.000 × 99,9 % = 999 mg', minimo=262.5, maximo=2750, pct_do_maximo=round(100*tir/2750, 2), linha_anexo='I·L-Tirosina; III·Tirosina 262,5; IV·Tirosina 2.750', laudo={'lote': '91382', 'validade': '07/05/2028', 'vencido': False}, status='mantido', motivo='36,3 % do teto'),
        dict(constituinte_anexo_i='Carnitina — Levocarnitina/L-carnitina (CAS 541-15-1)', forma_insumo='L-carnitina base', massa_insumo_mg=1000.0, teor_pct=99.41, teor_fonte='laudo SM lote 26H14-B025-226329 (99,41 %, val. 20/05/2028)', ativo_mg=round(carn, 1), unidade_ativo='mg', conta='1.000 × 99,41 % = 994,1 mg', minimo=None, maximo=2000, pct_do_maximo=round(100*carn/2000, 2), linha_anexo='I·Carnitina·Levocarnitina/L-carnitina; III·L-Carnitina (NE); IV·L-Carnitina 2.000', laudo={'lote': '26H14-B025-226329', 'validade': '20/05/2028', 'vencido': False}, status='mantido', motivo='49,7 % do teto'),
        dict(constituinte_anexo_i='Magnésio — Bisglicinato de magnésio (CAS 14783-68-7)', forma_insumo='Bisglicinato de magnésio 30 %', massa_insumo_mg=mg_m, teor_pct=30.0, teor_fonte='último teor conhecido: laudo 22B04-B019-088629 (30,0 % Mg, ICP-OES) VENCIDO 12/01/2024 e laudo 90844 (30,38 %) VENCIDO 21/06/2025 — pedir laudo novo; alternativa com laudo válido: Lepuge bisglicinato 18 % lote AUTO039968 (val. 29/04/2027) → 1.667 mg', ativo_mg=round(mg, 1), unidade_ativo='mg de magnésio', conta='1.000 × 30,0 % = 300 mg de Mg', minimo=63, maximo=350, pct_do_maximo=round(100*mg/350, 2), linha_anexo='I·Magnésio·Bisglicinato de magnésio; III·Magnésio (63 mg); IV·Magnésio (350 mg)', laudo={'lote': '22B04-B019-088629 / 90844', 'validade': '12/01/2024 / 21/06/2025', 'vencido': True}, status='dose ajustada', motivo='350 mg cravava o teto (se elemento); 300 mg = 85,7 %'),
        dict(constituinte_anexo_i='Cafeína — Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2)', forma_insumo='Cafeína anidra', massa_insumo_mg=caf_m, teor_pct=99.88, teor_fonte='laudo lote 214171 (val. 02/12/2029)', ativo_mg=round(caf_an, 1), unidade_ativo='mg', conta='150 × 99,88 % = 149,8 mg', minimo=75, maximo=200, pct_do_maximo=round(100*caf_tot/200, 2), linha_anexo='I·Cafeína; III·Cafeína 75; IV·Cafeína^vi 200 (total, incluindo o guaraná)', laudo={'lote': '214171', 'validade': '02/12/2029', 'vencido': False}, status='dose ajustada (rótulo 200 → FRM 150, mantido)', motivo='cafeína TOTAL (anidra + guaraná) = 162,6 mg = 81,3 % do teto'),
        dict(constituinte_anexo_i='Cafeína — Guaraná em pó (Paullinia cupana)', forma_insumo='Guaraná em pó (semente)', massa_insumo_mg=guar_m, teor_pct=5.11, teor_fonte='laudo lote interno 25H26-B028-213428 / AUTO9J0E (metilxantinas 5,11 %, taninos 4,12 %, val. 28/04/2028; fornecedor não identificado no documento). Metilxantinas totais usadas como LIMITE SUPERIOR da cafeína — laudo com doseamento específico de cafeína é PENDENTE', ativo_mg=round(guar_caf, 2), unidade_ativo='mg de cafeína (máximo)', conta='250 × 5,11 % = 12,78 mg', minimo=None, maximo=None, pct_do_maximo=None, linha_anexo='I·Cafeína·Guaraná em pó (Paullinia cupana); IV·Cafeína^vi 200 (total)', laudo={'lote': '25H26-B028-213428', 'validade': '28/04/2028', 'vencido': False}, status='forma trocada / dose ajustada', motivo='"extrato de guaraná" (rótulo, 515 mg) e "guaraná extrato seco" (FRM, 224,5 mg) não são formas do Anexo I; guaraná em pó é, e tem laudo válido'),
        dict(constituinte_anexo_i='Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0)', forma_insumo='Cloridrato de piridoxina', massa_insumo_mg=b6_m, teor_pct=82.19, teor_fonte='laudo lote 91188 (99,9 %, val. 28/12/2027); 169,18/205,64 = 82,27 %', ativo_mg=round(b6, 2), unidade_ativo='mg de piridoxina', conta='90 × 99,9 % × 82,27 % = 73,97 mg', minimo=0.26, maximo=98.60, pct_do_maximo=round(100*b6/98.60, 2), linha_anexo='I·Cloridrato de piridoxina; III·Vitamina B6 0,26; IV·Vitamina B6 98,60', laudo={'lote': '91188', 'validade': '28/12/2027', 'vencido': False}, status='mantido (massa do sal) / declaração corrigida', motivo='rótulo declarava 90 mg como se fosse B6 (6.923 % VD); 90 mg do sal entregam 74,0 mg de piridoxina = 75,0 % do teto'),
        dict(constituinte_anexo_i='Niacina — Nicotinamida/Niacinamida (CAS 98-92-0)', forma_insumo='Niacinamida', massa_insumo_mg=b3_m, teor_pct=99.5, teor_fonte='laudo INLAB lote 872226 (99,5 % b.s., val. 09/2027)', ativo_mg=round(b3, 2), unidade_ativo='mg NE', conta='30 × 99,5 % = 29,85 mg', minimo=2.4, maximo=35, pct_do_maximo=round(100*b3/35, 2), linha_anexo='I·Niacina·Nicotinamida/Niacinamida; III·Niacina^iv 2,4; IV·Niacina^ix 35', laudo={'lote': '872226', 'validade': '09/2027', 'vencido': False}, status='dose ajustada', motivo='35 mg cravava o teto; 30 mg = 85,3 %'),
        dict(constituinte_anexo_i='Vitamina D — Vitamina D3 (Colecalciferol) (CAS 67-97-0)', forma_insumo='Vitamina D3 pó 100.000 UI/g', massa_insumo_mg=d3_m, teor_pct=None, teor_fonte='laudo lote 91408 (Analitic, 115.000 UI/g, val. 15/11/2028)', ativo_mg=round(d3/1000, 5), unidade_ativo='mg (= 40,0 µg = 1.599 UI)', conta='13,9 mg × 115.000 UI/g ÷ 1.000 = 1.598,5 UI; ÷ 40 UI/µg (IN 75 An. XXIII; nota ii An. IV IN 28) = 39,96 µg', minimo=3, maximo=50, pct_do_maximo=round(100*d3/50, 2), linha_anexo='I·Vitamina D·Vitamina D3 (Colecalciferol); III·Vitamina D^iii 3 µg; IV·Vitamina D^ii 50 µg', laudo={'lote': '91408', 'validade': '15/11/2028', 'vencido': False}, status='dose ajustada', motivo='50 µg cravava o teto; 40 µg = 80 %'),
        dict(constituinte_anexo_i='Vitamina B12 — Metilcobalamina (CAS 13422-55-4)', forma_insumo='Metilcobalamina', massa_insumo_mg=b12_m, teor_pct=94.54, teor_fonte='laudo lote 90955 (val. 28/12/2026); alternativa 219376 (98,17 %, val. 14/11/2030)', ativo_mg=round(b12, 5), unidade_ativo='mg (= 8,5 µg)', conta='0,00899 × 94,54 % = 0,0085 mg = 8,5 µg', minimo=0.36e-3, maximo=9.94e-3, pct_do_maximo=round(100*b12/9.94e-3, 2), linha_anexo='I·Metilcobalamina; III·Vitamina B12 0,36 µg; IV·Vitamina B12 9,94 µg', laudo={'lote': '90955', 'validade': '28/12/2026', 'vencido': False}, status='dose ajustada', motivo='9,94 µg cravava o teto; 8,5 µg = 85,5 %'),
    ]
    tab = {'porcoes_por_embalagem': '30', 'porcao': '14 g (1 dosador)', 'porcao_coluna': '14 g',
           'linhas': [
               *energia_linhas(kcal, nota=f'maltodextrina {malto/1000:.3f} g × 4 + ácido cítrico 1,1 g × 3 + aminoácidos (arginina 1,019 + tirosina 0,999 + beta-alanina 0,297 g) × 4 = {kcal:.2f} kcal; taurina, carnitina e creatina sem fator no Anexo XXII → 0'.replace('.', ',')),
               linha('Carboidratos', malto/1000, 'g', VDR['carboidratos_g'], nota='maltodextrina (veículo)'),
               linha('Açúcares totais', None, 'g', nivel=1, pendente=True, nota='fração de mono/dissacarídeos da maltodextrina não quantificada'),
               linha('Açúcares adicionados', None, 'g', nivel=2, pendente=True),
               linha('Proteínas', 0, 'g', VDR['proteinas_g'], nao_signif=0.5),
               linha('L-arginina', arg, 'mg', None, nivel=1),
               linha('L-tirosina', tir, 'mg', None, nivel=1),
               linha('Beta-alanina', beta, 'mg', None, nivel=1),
               linha('Gorduras totais', 0, 'g', VDR['gorduras_totais_g'], nao_signif=0.5),
               linha('Gorduras saturadas', 0, 'g', VDR['gorduras_saturadas_g'], nivel=1, nao_signif=0.1),
               linha('Gorduras trans', 0, 'g', VDR['gorduras_trans_g'], nivel=1, nao_signif=0.1),
               linha('Fibras alimentares', 0, 'g', VDR['fibras_g'], nao_signif=0.5),
               linha('Sódio', 0, 'mg', VDR['sodio_mg'], nao_signif=5),
               linha('Vitamina D', d3, 'µg', VDR['vitamina_d_mcg']),
               linha('Vitamina B3', b3, 'mg', VDR['vitamina_b3_mg'], nota='mg NE'),
               linha('Vitamina B6', b6, 'mg', VDR['vitamina_b6_mg']),
               linha('Vitamina B12', b12*1000, 'µg', VDR['vitamina_b12_mcg']),
               linha('Magnésio', mg, 'mg', VDR['magnesio_mg']),
               linha('Taurina', tau, 'mg', None),
               linha('L-carnitina', carn, 'mg', None),
               linha('Cafeína', caf_tot, 'mg', None, nota='cafeína anidra 149,8 mg + guaraná em pó 12,8 mg (máximo, por metilxantinas)'),
               linha('Creatina', 4000, 'mg', None, nota='massa nominal de creatina monoidratada (lote 217949: 4.020 mg A / 3.558 mg B)'),
           ], 'rodape': RODAPE, 'regras': 'IN 75/2020 Anexos III, IV, VIII, XI e XXII (lidos 16/09/2026).'}
    p = dict(slug=slug, porcao_mg=14000, porcao_descricao='14 g (1 dosador) diluídos em 200 mL de água, 1 vez ao dia — 30 porções em 420 g',
             formato='pó (solúvel)', grupo_populacional='adultos (≥ 19 anos)', insumos=ins, excipientes=excip, soma_porcao_mg=round(soma, 3), cabe=True,
             ingredients_list='Creatina monoidratada, maltodextrina, cloridrato de L-arginina, acidulante ácido cítrico (INS 330), taurina, L-tirosina, L-carnitina, bisglicinato de magnésio, aromatizante idêntico ao natural de limão, beta-alanina, guaraná em pó (Paullinia cupana), cafeína anidra, antiumectante dióxido de silício (INS 551), vitamina B6 (cloridrato de piridoxina), edulcorante sucralose (INS 955), vitamina B3 (niacinamida), vitamina D3 (colecalciferol), vitamina B12 (metilcobalamina) e corante tartrazina (INS 102) [massa PENDENTE]. ' + GLUTEN_PEND,
             warnings=warnings_join(ART14 + [GRUPO, ANEXO_VI_GERAL, ANEXO_VI_BETA, 'Contém cafeína (163 mg por porção, incluindo a do guaraná).', CONSERV]),
             serving_description='14 g (1 dosador)',
             pendencias=[
                 'Confirmar com a fábrica qual fórmula está em produção (rótulo/cadastro de 28/05 ou FRM Rev.02 de 20/08/2026) — a proposta parte da FRM Rev.02 (parecer de 15/09/2026, NC7).',
                 'Guaraná: laudo do lote 25H26-B028-213428 dá metilxantinas totais (5,11 %), não cafeína isolada, e não identifica o fornecedor — pedir laudo com doseamento de cafeína e razão social; até lá a cafeína do guaraná foi computada pelo teto (12,8 mg).',
                 'Magnésio: sem laudo válido de bisglicinato 30 % (os dois em disco estão vencidos) — pedir laudo novo ou usar o Lepuge 18 % (AUTO039968, válido), ajustando a massa para 1.667 mg.',
                 'Beta-alanina: laudo novo (Lepuge AUTO033847 vencido em 03/08/2026).',
                 'Cafeína anidra: insumo controlado pela Polícia Federal — licença da Lemoncaps PENDENTE.',
                 'Tartrazina: massa por porção não consta de nenhum documento — quantificar (≤ 4,2 mg/14 g pela IN 211/2023).',
                 'Laudos a vencer: aroma de limão 25/09/2026; arginina HCl 12/11/2026; B12 90955 28/12/2026; maltodextrina 210170 já vencida.',
                 'Nova arte de rótulo (a atual imprime 15.000 mg de ativos em 14 g, B6 "6.923 % VD", "extrato de guaraná" e advertência mais fraca que o Anexo VI); a versão sabor Maracujá precisa da mesma correção.',
                 'Decisão do RT sobre a base do limite de creatina (leitura A/B) e sobre o critério de energia dos aminoácidos livres; perfil de açúcares da maltodextrina.',
             ],
             veredito='CONFORME (fórmula proposta: cafeína total 81 % do teto, beta-alanina 300 mg/dose, 13 constituintes com folga, soma 14.000 mg) — condicionado a laudo de cafeína do guaraná, laudo válido de bisglicinato de magnésio e laudo novo de beta-alanina',
             _procedencia={'ficha': 'FRM-PRETREINO-14G-001 / MC-PRD-PRETREINO-14G-001 Rev.02 (20/08/2026)', 'rotulo': 'PRÉ TREINO_CÉSIO 137_420g.pdf (= cadastro, 13 linhas)', 'parecer': 'PARECER-PRE-TREINO-CESIO-137-2026-09-15.md'},
             composicoes_sql=[
                 {'nome': 'Creatina monoidratada', 'quantidade': 4000, 'unidade': 'mg', 'ingredient_slug': 'creatina-monoidratada', 'metadata': md_comp(laudo_lote='217949', teor_pct=100.5, ativo_mg=4020.0, ativo_leitura_b_mg=3557.7, linha_anexo='I·Creatina monohidratada; III/IV·Creatina', e_sal=False)},
                 {'nome': 'Maltodextrina', 'quantidade': round(malto, 3), 'unidade': 'mg', 'ingredient_slug': 'maltodextrina', 'metadata': md_comp(laudo_lote='210170 (VENCIDO)', teor_pct=None, ativo_mg=None, linha_anexo='I·Maltodextrina (veículo)', papel='excipiente q.s.p.')},
                 {'nome': 'Cloridrato de L-arginina', 'quantidade': 1240, 'unidade': 'mg', 'ingredient_slug': 'cloridrato-de-l-arginina', 'metadata': md_comp(laudo_lote='AUTO035918', teor_pct=82.2, ativo_mg=1019.2, unidade_ativo='mg de L-arginina', linha_anexo='I·Cloridrato de L-arginina; IV·Arginina 3.810', e_sal=True, elemento_equivalente_mg=1019.2)},
                 {'nome': 'Ácido cítrico (INS 330)', 'quantidade': 1100, 'unidade': 'mg', 'ingredient_slug': 'acido-citrico', 'metadata': md_comp(laudo_lote='GE2844AFG', teor_pct=100.1, ativo_mg=None, linha_anexo='aditivo — IN 211/2023', papel='acidulante')},
                 {'nome': 'Taurina', 'quantidade': 1000, 'unidade': 'mg', 'ingredient_slug': 'taurina', 'metadata': md_comp(laudo_lote='214586', teor_pct=99.46, ativo_mg=994.6, linha_anexo='I·Taurina; IV·Taurina 2.000', e_sal=False)},
                 {'nome': 'L-tirosina', 'quantidade': 1000, 'unidade': 'mg', 'ingredient_slug': 'l-tirosina', 'metadata': md_comp(laudo_lote='91382', teor_pct=99.9, ativo_mg=999.0, linha_anexo='I·L-Tirosina; III/IV·Tirosina', e_sal=False)},
                 {'nome': 'L-carnitina', 'quantidade': 1000, 'unidade': 'mg', 'ingredient_slug': 'l-carnitina', 'metadata': md_comp(laudo_lote='26H14-B025-226329', teor_pct=99.41, ativo_mg=994.1, linha_anexo='I·Levocarnitina/L-carnitina; IV·L-Carnitina 2.000', e_sal=False)},
                 {'nome': 'Bisglicinato de magnésio', 'quantidade': 1000, 'unidade': 'mg', 'ingredient_slug': 'magnesio', 'metadata': md_comp(laudo_lote='22B04-B019-088629 (VENCIDO — último teor conhecido 30,0 %)', teor_pct=30.0, ativo_mg=300.0, unidade_ativo='mg de magnésio', linha_anexo='I·Bisglicinato de magnésio; III·Magnésio 63; IV·Magnésio 350', e_sal=True, elemento_equivalente_mg=300.0)},
                 {'nome': 'Aromatizante idêntico ao natural de limão', 'quantidade': 350, 'unidade': 'mg', 'ingredient_slug': 'aromatizante-identico-ao-natural-de-limao', 'metadata': md_comp(laudo_lote='19504', teor_pct=None, ativo_mg=None, linha_anexo='aditivo — IN 211/2023', papel='aromatizante')},
                 {'nome': 'Beta-alanina', 'quantidade': 300, 'unidade': 'mg', 'ingredient_slug': 'beta-alanina', 'metadata': md_comp(laudo_lote='AUTO033847 (VENCIDO)', teor_pct=99.1, ativo_mg=297.3, linha_anexo='I·Beta-alanina; IV·2 g; VI·Beta-alanina', e_sal=False)},
                 {'nome': 'Guaraná em pó (Paullinia cupana)', 'quantidade': 250, 'unidade': 'mg', 'ingredient_slug': 'guarana-em-po', 'metadata': md_comp(laudo_lote='25H26-B028-213428', teor_pct=5.11, ativo_mg=12.78, unidade_ativo='mg de cafeína (máximo, por metilxantinas)', linha_anexo='I·Cafeína·Guaraná em pó (Paullinia cupana); IV·Cafeína 200 (total)', e_sal=False, observacao='substitui "extrato de guaraná" 515 mg (forma não autorizada)')},
                 {'nome': 'Cafeína anidra', 'quantidade': 150, 'unidade': 'mg', 'ingredient_slug': 'cafeina-anidra', 'metadata': md_comp(laudo_lote='214171', teor_pct=99.88, ativo_mg=149.8, linha_anexo='I·Cafeína; III·75; IV·200 (total 162,6 mg = 81,3 %)', e_sal=False)},
                 {'nome': 'Dióxido de silício (INS 551)', 'quantidade': 118, 'unidade': 'mg', 'ingredient_slug': 'dioxido-de-silicio', 'metadata': md_comp(laudo_lote='876013', teor_pct=None, ativo_mg=None, linha_anexo='aditivo — IN 211/2023', papel='antiumectante')},
                 {'nome': 'Vitamina B6 (cloridrato de piridoxina)', 'quantidade': 90, 'unidade': 'mg', 'ingredient_slug': 'vitamina-b6', 'metadata': md_comp(laudo_lote='91188', teor_pct=82.19, ativo_mg=73.97, unidade_ativo='mg de piridoxina', linha_anexo='I·Cloridrato de piridoxina; III/IV·Vitamina B6', e_sal=True, elemento_equivalente_mg=73.97)},
                 {'nome': 'Edulcorante sucralose (INS 955)', 'quantidade': 90, 'unidade': 'mg', 'ingredient_slug': 'edulcorante-sucralose', 'metadata': md_comp(laudo_lote='91233', teor_pct=99.74, ativo_mg=None, linha_anexo='aditivo — IN 211/2023', papel='edulcorante')},
                 {'nome': 'Vitamina B3 (niacinamida)', 'quantidade': 30, 'unidade': 'mg', 'ingredient_slug': 'vitamina-b3', 'metadata': md_comp(laudo_lote='872226', teor_pct=99.5, ativo_mg=29.85, unidade_ativo='mg NE', linha_anexo='I·Nicotinamida/Niacinamida; III/IV·Niacina', e_sal=False)},
                 {'nome': 'Vitamina D3 (colecalciferol)', 'quantidade': 40, 'unidade': 'mcg', 'ingredient_slug': 'vitamina-d', 'metadata': md_comp(laudo_lote='91408', teor_pct=None, potencia='115.000 UI/g', ativo_mg=0.03996, unidade_ativo='µg (40,0)', massa_insumo_mg=13.9, linha_anexo='I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D', e_sal=False)},
                 {'nome': 'Vitamina B12 (metilcobalamina)', 'quantidade': 8.99, 'unidade': 'mcg', 'ingredient_slug': 'vitamina-b12', 'metadata': md_comp(laudo_lote='90955', teor_pct=94.54, ativo_mg=0.0085, unidade_ativo='µg (8,5)', linha_anexo='I·Metilcobalamina; III/IV·Vitamina B12', e_sal=False)},
             ])
    gravar(p, tab)

if __name__ == '__main__':
    bella()
    creatina_po('creatina-monohidratada-150g-soluvel', 150)
    creatina_po('creatina-monohidratada-300g-soluvel', 300)
    creatina_gummy('creatina-gummy-sabor-frutas-vermelhas', 'frutas vermelhas')
    creatina_gummy('creatina-em-gummy-sabor-tutti-frutti', 'tutti-frutti')
    melatonina()
    pre300()
    cesio()
