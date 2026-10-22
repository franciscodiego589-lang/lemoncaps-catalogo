# Fase 3 — Verificação determinística dos 24 JSONs da reformulação (16/09/2026)

Script: `scratchpad/fase3/verificar.py` (lê `scratchpad/fase2/<slug>.json`, `padrao-anvisa/vd.json` e os anexos literais em `docs/conformidade/`). Nenhum número foi digitado no verificador: limites vêm dos Anexos III/IV literais, VDs do `vd.json`, fatores sal→base e potências das próprias contas dos JSONs.

Gravidade: **alta** = erro de conta, de limite ou nome fora do Anexo I; **média** = desvio de %VD/energia/nome a conferir; **baixa** = arredondamento; **representação** = número certo com o campo `teor_pct` em semântica diferente entre grupos (doseamento do sal × teor efetivo) — harmonizado na fase 3; **critério** = escolha documentada do memorial (registrada; a consolidação adota um critério único e diz qual).

## Resumo

- Divergências registradas: **35** — alta 1, média 0, baixa 1, representação 22, critério 11.
- Conferências que fecharam ou itens não verificáveis (registrados, não são divergências): 399.

## (a) massa × teor = ativo

| slug | insumo/linha | esperado | encontrado | gravidade | nota |
|---|---|---|---|---|---|
| multivitaminico | Vitamina E | 14,9254 mg (massa × teor_pct) | 10 mg | representação | teor_pct (50,7 %) é o doseamento do insumo; o ativo aplica o fator 0,67 (α-tocoferol/acetato de rac-α-tocoferil (nota v Anexo III: 1 UI = 1 mg de acetato; 0,67)) declarado na conta → teor efetivo 33,97 % |
| multivitaminico | Ácido pantotênico | 5,434 mg (massa × teor_pct) | 5 mg | representação | teor_pct (98,2 %) é o doseamento do insumo; o ativo aplica o fator 0,9201 (ácido pantotênico/D-pantotenato de cálcio) declarado na conta → teor efetivo 90,35 % |
| multivitaminico | Vitamina B6 | 1,5801 mg (massa × teor_pct) | 1,3 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| multivitaminico | Tiamina | 1,5251 mg (massa × teor_pct) | 1,2 mg | representação | teor_pct (99,8 %) é o doseamento do insumo; o ativo aplica o fator 0,7868 (tiamina/cloridrato de tiamina 265,35/337,27) declarado na conta → teor efetivo 78,52 % |
| multivitaminico | Ácido fólico | 0,6 mg (massa × teor_pct) | 1 mg | representação | teor_pct (90,67 %) é o doseamento do insumo; o ativo aplica o fator 1,6667 (µg DFE = µg de ácido fólico ÷ 0,6 (nota vi Anexo III)) declarado na conta → teor efetivo 151,12 % (conversão de unidade, não perda de massa) |
| zma-zinco-magnesio-e-vitamina-d | Vitamina B6 | 1,5801 mg (massa × teor_pct) | 1,3 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| biotina-em-capsula | Vitamina E | 22,815 mg (massa × teor_pct) | 15,2861 mg | representação | teor_pct (50,7 %) é o doseamento do insumo; o ativo aplica o fator 0,67 (α-tocoferol/acetato de rac-α-tocoferil (nota v Anexo III: 1 UI = 1 mg de acetato; 0,67)) declarado na conta → teor efetivo 33,97 % |
| biotina-em-capsula | Vitamina B6 | 9,99 mg (massa × teor_pct) | 8,2189 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| biotina-em-capsula | Ácido pantotênico | 5,434 mg (massa × teor_pct) | 5 mg | representação | teor_pct (98,2 %) é o doseamento do insumo; o ativo aplica o fator 0,9201 (ácido pantotênico/D-pantotenato de cálcio) declarado na conta → teor efetivo 90,35 % |
| biotina-em-capsula | Ácido fólico | 0,4 mg (massa × teor_pct) | 0,6667 mg | representação | teor_pct (90,67 %) é o doseamento do insumo; o ativo aplica o fator 1,6667 (µg DFE = µg de ácido fólico ÷ 0,6 (nota vi Anexo III)) declarado na conta → teor efetivo 151,12 % (conversão de unidade, não perda de massa) |
| dores-musculares | Glucosamina | 200 mg (massa × teor_pct) | 118,3607 mg | representação | teor_pct (101,3 %) é o doseamento do insumo; o ativo aplica o fator 0,5918 (glucosamina/sulfato de glucosamina·2KCl) declarado na conta → teor efetivo 59,95 % |
| dores-musculares | Vitamina E | 30,42 mg (massa × teor_pct) | 20,3814 mg | representação | teor_pct (50,7 %) é o doseamento do insumo; o ativo aplica o fator 0,67 (α-tocoferol/acetato de rac-α-tocoferil (nota v Anexo III: 1 UI = 1 mg de acetato; 0,67)) declarado na conta → teor efetivo 33,97 % |
| dores-musculares | Vitamina B6 | 1,5801 mg (massa × teor_pct) | 1,3 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| focus-colina | Vitamina B6 | 1,5801 mg (massa × teor_pct) | 1,3 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| multi-vitta-gestante-e-lactante-em-capsula | Ácido pantotênico | 4,8907 mg (massa × teor_pct) | 4,5 mg | representação | teor_pct (98,2 %) é o doseamento do insumo; o ativo aplica o fator 0,9201 (ácido pantotênico/D-pantotenato de cálcio) declarado na conta → teor efetivo 90,35 % |
| multi-vitta-gestante-e-lactante-em-capsula | Vitamina E | 7,4627 mg (massa × teor_pct) | 5 mg | representação | teor_pct (50,7 %) é o doseamento do insumo; o ativo aplica o fator 0,67 (α-tocoferol/acetato de rac-α-tocoferil (nota v Anexo III: 1 UI = 1 mg de acetato; 0,67)) declarado na conta → teor efetivo 33,97 % |
| multi-vitta-gestante-e-lactante-em-capsula | Ácido fólico | 0,5 mg (massa × teor_pct) | 0,8333 mg | representação | teor_pct (90,67 %) é o doseamento do insumo; o ativo aplica o fator 1,6667 (µg DFE = µg de ácido fólico ÷ 0,6 (nota vi Anexo III)) declarado na conta → teor efetivo 151,12 % (conversão de unidade, não perda de massa) |
| serena | Vitamina B6 | 1,5801 mg (massa × teor_pct) | 1,3 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| saude-intestinal | Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0) | 1,5285 mg (massa × teor_pct) | 1,26 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| pro-energy | Arginina — Cloridrato de L-arginina (CAS 1119-34-2) | 74,55 mg (massa × teor_pct) | 61,64 mg | representação | teor_pct (99,4 %) é o doseamento do insumo; o ativo aplica o fator 0,8269 (arginina/cloridrato de L-arginina 174,20/210,66) declarado na conta → teor efetivo 82,19 % |
| pro-energy | Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0) | 9,99 mg (massa × teor_pct) | 8,22 mg | representação | teor_pct (99,9 %) é o doseamento do insumo; o ativo aplica o fator 0,8227 (piridoxina/cloridrato de piridoxina 169,18/205,64) declarado na conta → teor efetivo 82,19 % |
| bella-gummy-biotina-em-gummy | Vitamina E — Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila (CAS 7695-91-2) | 8,4669 mg (massa × teor_pct) | 5,673 mg | representação | teor_pct (50,7 %) é o doseamento do insumo; o ativo aplica o fator 0,67 (α-tocoferol/acetato de rac-α-tocoferil (nota v Anexo III: 1 UI = 1 mg de acetato; 0,67)) declarado na conta → teor efetivo 33,97 % |

<details><summary>Conferências registradas (19)</summary>

- multivitaminico · Vitamina A: vitamina A conferida: 7,6199 mg × 568116 UI/g = 4329 UI → 1300 µg RAE (critério ÷ 3,33 (nota ii do Anexo III); 1/3,33 e 0,3 diferem 0,1 %)
- multivitaminico · Vitamina D: vitamina D3 conferida: 13,913 mg × 115 UI/mg ÷ 40 = 40 µg
- zma-zinco-magnesio-e-vitamina-d · Vitamina D: vitamina D3 conferida: 8,6957 mg × 115 UI/mg ÷ 40 = 25 µg
- biotina-em-capsula · Vitamina A: vitamina A conferida: 8,7922 mg × 568116 UI/g = 4995 UI → 1500 µg RAE (critério ÷ 3,33 (nota ii do Anexo III); 1/3,33 e 0,3 diferem 0,1 %)
- biotina-em-capsula · Vitamina D: vitamina D3 conferida: 13,913 mg × 115 UI/mg ÷ 40 = 40 µg
- dores-musculares · Colágeno tipo II não desnaturado: teor_pct nulo: ativo declarado 40 mg para massa 40 mg — não verificável (teor PENDENTE/nominal no memorial)
- dores-musculares · Vitamina D: vitamina D3 conferida: 13,913 mg × 115 UI/mg ÷ 40 = 40 µg
- focus-colina · Vitamina D: vitamina D3 conferida: 1,7391 mg × 115 UI/mg ÷ 40 = 5 µg
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina D: vitamina D3 conferida: 13,913 mg × 115 UI/mg ÷ 40 = 40 µg
- saude-intestinal · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): vitamina A conferida: 3,17 mg × 568116 UI/g = 1800,9 UI → 540,3 µg RAE (critério × 0,3 (memorial); 1/3,33 e 0,3 diferem 0,1 %)
- moro-slim · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): vitamina A conferida: 8,8 mg × 568116 UI/g = 4999,4 UI → 1499,8 µg RAE (critério × 0,3 (memorial); 1/3,33 e 0,3 diferem 0,1 %)
- emagrecedor-em-capsula · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): vitamina A conferida: 8,8 mg × 568116 UI/g = 4999,4 UI → 1499,8 µg RAE (critério × 0,3 (memorial); 1/3,33 e 0,3 diferem 0,1 %)
- slim-up-emagrecimento-em-gota · Vitamina D — Vitamina D_3 (Colecalciferol) (CAS 67-97-0): vitamina D3 conferida: 15,652 mg × 115 UI/mg ÷ 40 = 45 µg
- omega-pro-tg · Lipídeos — Óleo de peixe (grupo 'Lipídeos' do Anexo I, redação IN 431/2026; linha 'Óleo de peixe', CAS '-'): teor_pct nulo: ativo declarado 1000 mg para massa 1000 mg — não verificável (teor PENDENTE/nominal no memorial)
- omega-pro-tg · EPA e DHA — (componentes do óleo de peixe; linha 'EPA e DHA' dos Anexos III e IV): teor_pct nulo: ativo declarado 185,34 mg para massa 185,34 mg — não verificável (teor PENDENTE/nominal no memorial)
- omega-pro-tg · EPA e DHA — DHA (componente do óleo de peixe): teor_pct nulo: ativo declarado 123,56 mg para massa 123,56 mg — não verificável (teor PENDENTE/nominal no memorial)
- omega-pro-tg · (componente) outros ácidos graxos ômega-3: teor_pct nulo: ativo declarado 7,6 mg para massa 7,6 mg — não verificável (teor PENDENTE/nominal no memorial)
- bella-gummy-biotina-em-gummy · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): vitamina A conferida: 5,99 mg × 568116 UI/g = 3403 UI → 1021,9 µg RAE (critério ÷ 3,33 (nota ii do Anexo III); 1/3,33 e 0,3 diferem 0,1 %)
- pre-treino-creatina-sabor-limao-420g · Vitamina D — Vitamina D3 (Colecalciferol) (CAS 67-97-0): vitamina D3 conferida: 13,9 mg × 115 UI/mg ÷ 40 = 39,96 µg

</details>

## (b) faixa [mínimo, máximo] e folga de 90 % (soma por constituinte)

| slug | insumo/linha | esperado | encontrado | gravidade | nota |
|---|---|---|---|---|---|
| pro-energy | Cafeína (soma de 2 linhas: 10,22 mg + 149,82 mg) | pct_do_maximo recalculado 80,02 % (soma ÷ máximo) | 74,9 % no JSON | baixa | pct_do_maximo do JSON difere do recálculo — o JSON traz o pct de uma linha só; a soma do constituinte é o que vale |
| omega-pro-tg | Lipídeos totais | ≥ mínimo 5 g | 1 g | alta | abaixo do mínimo do Anexo III — LEITURA LITERAL: o Anexo I põe 'Óleo de peixe' no grupo Lipídeos; o Anexo III fixa 'Lipídeos totais' mínimo 5 g para > 19 anos (máximo NE no Anexo IV). INTERPRETAÇÃO 1 (por grupo): o mínimo de 5 g se aplica a qualquer co |

<details><summary>Conferências registradas (153)</summary>

- multivitaminico · Magnésio: conforme: 260 mg = 74,3 % do teto 350 mg; mínimo 63
- multivitaminico · Vitamina C: conforme: 100 mg = 5,2 % do teto 1916,02 mg; mínimo 13,5
- multivitaminico · Zinco: conforme: 15 mg = 50,7 % do teto 29,59 mg; mínimo 1,65
- multivitaminico · Niacina: conforme: 16 mg = 45,7 % do teto 35 mg; mínimo 2,4
- multivitaminico · Vitamina E: conforme: 10 mg = 1 % do teto 1000 mg; mínimo 2,25
- multivitaminico · Ácido pantotênico: conforme: 5 mg = 88,7 % do teto 5,64 mg; mínimo 0,75
- multivitaminico · Boro: conforme: 3 mg = 33,8 % do teto 8,866 mg; mínimo NE
- multivitaminico · Vitamina B6: conforme: 1,3 mg = 1,3 % do teto 98,6 mg; mínimo 0,26
- multivitaminico · Tiamina: conforme: 1,2 mg = 59,4 % do teto 2,02 mg; mínimo 0,18
- multivitaminico · Riboflavina: conforme: 1,3 mg = 47,4 % do teto 2,74 mg; mínimo 0,2
- multivitaminico · Vitamina A: conforme: 1300 µg = 49,6 % do teto 2623,61 µg; mínimo 135
- multivitaminico · Ácido fólico: conforme: 1000 µg = 78 % do teto 1281,5 µg; mínimo 60
- multivitaminico · Cobre: conforme: 900 µg = 10 % do teto 8975,52 µg; mínimo 135
- multivitaminico · Selênio: conforme: 100 µg = 31,3 % do teto 319,75 µg; mínimo 8,25
- multivitaminico · Vitamina K: conforme: 120 µg = 80,5 % do teto 149,06 µg; mínimo 18
- multivitaminico · Vitamina D: conforme: 40 µg = 80 % do teto 50 µg; mínimo 3
- multivitaminico · Cromo: conforme: 35 µg = 14 % do teto 250 µg; mínimo 5,25
- multivitaminico · Vitamina B12: conforme: 8 µg = 80,5 % do teto 9,94 µg; mínimo 0,36
- zma-zinco-magnesio-e-vitamina-d · Magnésio: conforme: 151,1 mg = 43,2 % do teto 350 mg; mínimo 63
- zma-zinco-magnesio-e-vitamina-d · Teanina: conforme: 150 mg = 60 % do teto 250 mg; mínimo 50
- zma-zinco-magnesio-e-vitamina-d · Zinco: conforme: 15 mg = 50,7 % do teto 29,59 mg; mínimo 1,65
- zma-zinco-magnesio-e-vitamina-d · Boro: conforme: 3 mg = 33,8 % do teto 8,866 mg; mínimo NE
- zma-zinco-magnesio-e-vitamina-d · Vitamina B6: conforme: 1,3 mg = 1,3 % do teto 98,6 mg; mínimo 0,26
- zma-zinco-magnesio-e-vitamina-d · Vitamina D: conforme: 25 µg = 50 % do teto 50 µg; mínimo 3
- biotina-em-capsula · Vitamina C: conforme: 250 mg = 13 % do teto 1916,02 mg; mínimo 13,5
- biotina-em-capsula · Metionina: conforme: 110 mg = 7,2 % do teto 1530 mg; mínimo 105
- biotina-em-capsula · Cisteína: conforme: 76,4367 mg = 9,2 % do teto 830 mg; mínimo 42
- biotina-em-capsula · Vitamina E: conforme: 15,2861 mg = 1,5 % do teto 1000 mg; mínimo 2,25
- biotina-em-capsula · Metilsulfonilmetano: conforme: 50 mg = 5,6 % do teto 900 mg; mínimo NE
- biotina-em-capsula · Ácido hialurônico: conforme: 50 mg = 31,7 % do teto 157,7 mg; mínimo 3,5
- biotina-em-capsula · Silício: conforme: 0,715 mg = 4,6 % do teto 15,67 mg; mínimo NE
- biotina-em-capsula · Niacina: conforme: 31 mg = 88,6 % do teto 35 mg; mínimo 2,4
- biotina-em-capsula · Zinco: conforme: 15 mg = 50,7 % do teto 29,59 mg; mínimo 1,65
- biotina-em-capsula · Vitamina B6: conforme: 8,2189 mg = 8,3 % do teto 98,6 mg; mínimo 0,26
- biotina-em-capsula · Vitamina A: conforme: 1500 µg = 57,2 % do teto 2623,61 µg; mínimo 135
- biotina-em-capsula · Ácido pantotênico: conforme: 5 mg = 88,7 % do teto 5,64 mg; mínimo 0,75
- biotina-em-capsula · Cobre: conforme: 900 µg = 10 % do teto 8975,52 µg; mínimo 135
- biotina-em-capsula · Riboflavina: conforme: 2,4 mg = 87,6 % do teto 2,74 mg; mínimo 0,2
- biotina-em-capsula · Ácido fólico: conforme: 666,67 µg = 52 % do teto 1281,5 µg; mínimo 60
- biotina-em-capsula · Iodo: conforme: 150 µg = 16,3 % do teto 919,02 µg; mínimo 22,5
- biotina-em-capsula · Biotina: conforme: 40 µg = 88,9 % do teto 45 µg; mínimo 4,5
- biotina-em-capsula · Selênio: conforme: 60 µg = 18,8 % do teto 319,75 µg; mínimo 8,25
- biotina-em-capsula · Vitamina D: conforme: 40 µg = 80 % do teto 50 µg; mínimo 3
- biotina-em-capsula · Vitamina B12: conforme: 8 µg = 80,5 % do teto 9,94 µg; mínimo 0,36
- dores-musculares · Metilsulfonilmetano: conforme: 250 mg = 27,8 % do teto 900 mg; mínimo NE
- dores-musculares · Glucosamina: conforme: 118,3607 mg = 15,8 % do teto 750 mg; mínimo NE
- dores-musculares · Vitamina C: conforme: 140 mg = 7,3 % do teto 1916,02 mg; mínimo 13,5
- dores-musculares · Magnésio: conforme: 70 mg = 20 % do teto 350 mg; mínimo 63
- dores-musculares · Vitamina E: conforme: 20,3814 mg = 2 % do teto 1000 mg; mínimo 2,25
- dores-musculares · Zinco: conforme: 10 mg = 33,8 % do teto 29,59 mg; mínimo 1,65
- dores-musculares · Colágeno tipo II não desnaturado: conforme: 40 mg ≥ mínimo 1,2 mg (máximo NE)
- dores-musculares · Ferro: conforme: 8 mg = 23,3 % do teto 34,31 mg; mínimo 2,7
- dores-musculares · Vitamina D: conforme: 40 µg = 80 % do teto 50 µg; mínimo 3
- dores-musculares · Vitamina B6: conforme: 1,3 mg = 1,3 % do teto 98,6 mg; mínimo 0,26
- dores-musculares · Selênio: conforme: 100 µg = 31,3 % do teto 319,75 µg; mínimo 8,25
- dores-musculares · Vitamina B12: conforme: 8 µg = 80,5 % do teto 9,94 µg; mínimo 0,36
- focus-colina · Colina: conforme: 130 mg = 4 % do teto 3235,15 mg; mínimo 82,5
- focus-colina · Tirosina: conforme: 290 mg = 10,5 % do teto 2750 mg; mínimo 262,5
- focus-colina · Teanina: conforme: 115 mg = 46 % do teto 250 mg; mínimo 50
- focus-colina · L-Carnitina: conforme: 95 mg = 4,8 % do teto 2000 mg; mínimo NE
- focus-colina · Magnésio: conforme: 70 mg = 20 % do teto 350 mg; mínimo 63
- focus-colina · Inositol: conforme: 0,025 g = 1,2 % do teto 2 g; mínimo NE
- focus-colina · Vitamina D: conforme: 5 µg = 10 % do teto 50 µg; mínimo 3
- focus-colina · Vitamina B6: conforme: 1,3 mg = 1,3 % do teto 98,6 mg; mínimo 0,26
- focus-colina · Vitamina B12: conforme: 2,4 µg = 24,1 % do teto 9,94 µg; mínimo 0,36
- multi-vitta-gestante-e-lactante-em-capsula · Cálcio: conforme: 215 mg = 10,7 % do teto 2015,51 mg; mínimo 195
- multi-vitta-gestante-e-lactante-em-capsula · Magnésio: conforme: 66 mg = 18,9 % do teto 350 mg; mínimo 60
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina C: conforme: 20 mg = 1,2 % do teto 1723,43 mg; mínimo 18
- multi-vitta-gestante-e-lactante-em-capsula · Ferro: conforme: 8,1 mg = 23,3 % do teto 34,71 mg; mínimo 4,05
- multi-vitta-gestante-e-lactante-em-capsula · Niacina: conforme: 8 mg = 26,7 % do teto 30 mg; mínimo 2,7
- multi-vitta-gestante-e-lactante-em-capsula · Ácido pantotênico: conforme: 4,5 mg = 82 % do teto 5,49 mg; mínimo 1,05
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina E: conforme: 5 mg = 0,6 % do teto 800 mg; mínimo 2,85
- multi-vitta-gestante-e-lactante-em-capsula · Cobre: conforme: 900 µg = 13 % do teto 6935,01 µg; mínimo 195
- multi-vitta-gestante-e-lactante-em-capsula · Ácido fólico: conforme: 833,33 µg = 73,2 % do teto 1138,3 µg; mínimo 666,6
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina D: conforme: 40 µg = 80 % do teto 50 µg; mínimo 2,25
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina B12: conforme: 8 µg = 79,4 % do teto 10,07 µg; mínimo 0,42
- melatonina-triptofanos-encapsulados · Triptofano: conforme: 500 mg = 58,1 % do teto 860 mg; mínimo 42
- melatonina-triptofanos-encapsulados · Aspartato: conforme: 100 mg = 1,9 % do teto 5320 mg; mínimo NE
- melatonina-triptofanos-encapsulados · Glutamina: conforme: 95 mg = 1,9 % do teto 5000 mg; mínimo NE
- melatonina-triptofanos-encapsulados · Magnésio: conforme: 70 mg = 20 % do teto 350 mg; mínimo 63
- melatonina-triptofanos-encapsulados · Zinco: conforme: 10 mg = 33,8 % do teto 29,59 mg; mínimo 1,65
- melatonina-triptofanos-encapsulados · Melatonina: conforme: 0,18 mg = 85,7 % do teto 0,21 mg; mínimo NE
- melatonina-triptofanos-encapsulados · Biotina: conforme: 40 µg = 88,9 % do teto 45 µg; mínimo 4,5
- serena · Magnésio: conforme: 70 mg = 20 % do teto 350 mg; mínimo 63
- serena · Teanina: conforme: 60 mg = 24 % do teto 250 mg; mínimo 50
- serena · Inositol: conforme: 0,05 g = 2,5 % do teto 2 g; mínimo NE
- serena · Vitamina B6: conforme: 1,3 mg = 1,3 % do teto 98,6 mg; mínimo 0,26
- serena · Melatonina: conforme: 0,18 mg = 85,7 % do teto 0,21 mg; mínimo NE
- detox-matinal-lemon-shot-300g · Vitamina C: conforme: 1600 mg = 83,5 % do teto 1916,02 mg; mínimo 13,5
- detox-matinal-lemon-shot-300g · Ácido clorogênico: conforme: 256,2 mg = 64 % do teto 400 mg; mínimo NE
- detox-matinal-lemon-shot-300g · Antocianinas da laranja moro: conforme: 1,47 mg = 29,4 % do teto 5 mg; mínimo NE
- detox-matinal-lemon-shot-300g · Zinco: conforme: 2,2 mg = 7,4 % do teto 29,59 mg; mínimo 1,65
- saude-intestinal · Glutamina: conforme: 135 mg = 2,7 % do teto 5000 mg; mínimo NE
- saude-intestinal · Magnésio: conforme: 90 mg = 25,7 % do teto 350 mg; mínimo 63
- saude-intestinal · Quercetina: conforme: 69,16 mg = 24,7 % do teto 280 mg; mínimo NE
- saude-intestinal · Zinco: conforme: 13,5 mg = 45,6 % do teto 29,59 mg; mínimo 1,65
- saude-intestinal · Vitamina A: conforme: 540,3 µg = 20,6 % do teto 2623,61 µg; mínimo 135
- saude-intestinal · Vitamina B6: conforme: 1,26 mg = 1,3 % do teto 98,6 mg; mínimo 0,26
- moro-slim · Antocianinas da laranja moro: conforme: 2,57 mg = 51,4 % do teto 5 mg; mínimo NE
- moro-slim · Ácido clorogênico: conforme: 70,45 mg = 17,6 % do teto 400 mg; mínimo NE
- moro-slim · Vitamina A: conforme: 1499,8 µg = 57,2 % do teto 2623,61 µg; mínimo 135
- moro-slim · Cromo: conforme: 199,9 µg = 80 % do teto 250 µg; mínimo 5,25
- pro-energy · Taurina: conforme: 198,92 mg = 9,9 % do teto 2000 mg; mínimo NE
- pro-energy · L-Carnitina: conforme: 86,36 mg = 4,3 % do teto 2000 mg; mínimo NE
- pro-energy · Arginina: conforme: 61,64 mg = 1,6 % do teto 3810 mg; mínimo NE
- pro-energy · Zinco: conforme: 3,98 mg = 13,5 % do teto 29,59 mg; mínimo 1,65
- pro-energy · Vitamina B6: conforme: 8,22 mg = 8,3 % do teto 98,6 mg; mínimo 0,26
- emagrecedor-em-capsula · Ácido clorogênico: conforme: 64,05 mg = 16 % do teto 400 mg; mínimo NE
- emagrecedor-em-capsula · Antocianinas da laranja moro: conforme: 0,0735 mg = 1,5 % do teto 5 mg; mínimo NE
- emagrecedor-em-capsula · Cromo: conforme: 199,9 µg = 80 % do teto 250 µg; mínimo 5,25
- emagrecedor-em-capsula · Vitamina A: conforme: 1499,8 µg = 57,2 % do teto 2623,61 µg; mínimo 135
- slim-up-emagrecimento-em-gota · Vitamina D: exatamente 90,0 % do teto — no limite da regra de folga (memorial registra alternativa com mais folga)
- slim-up-emagrecimento-em-gota · Vitamina D: conforme: 45 µg = 90 % do teto 50 µg; mínimo 3
- slim-up-emagrecimento-em-gota · Vitamina B12: conforme: 8 µg = 80,5 % do teto 9,94 µg; mínimo 0,36
- slim-up-emagrecimento-em-gota · Cromo: conforme: 30,85 µg = 12,3 % do teto 250 µg; mínimo 5,25
- slim-up-emagrecimento-em-gota · Ácido clorogênico: conforme: 32,02 mg = 8 % do teto 400 mg; mínimo NE
- slim-up-emagrecimento-em-gota · Colina: conforme: 90 mg = 2,8 % do teto 3235,15 mg; mínimo 82,5
- shot-colageno-300-gramas · Proteínas: conforme: 8,5995 g ≥ mínimo 8,4 g (máximo NE)
- shot-colageno-300-gramas · Vitamina C: conforme: 200 mg = 10,4 % do teto 1916,02 mg; mínimo 13,5
- shot-colageno-300-gramas · Zinco: conforme: 2,2 mg = 7,4 % do teto 29,59 mg; mínimo 1,65
- omega-pro-tg · Lipídeos totais: conforme: 1 g ≥ mínimo 5 g (máximo NE)
- omega-pro-tg · EPA e DHA (soma de 2 linhas: 185,34 mg + 123,56 mg): conforme: 308,9 mg = 15,4 % do teto 2000 mg; mínimo 37,5
- bella-gummy-biotina-em-gummy · Vitamina C: conforme: 45,004 mg = 2,3 % do teto 1916,02 mg; mínimo 13,5
- bella-gummy-biotina-em-gummy · Vitamina E: conforme: 5,673 mg = 0,6 % do teto 1000 mg; mínimo 2,25
- bella-gummy-biotina-em-gummy · Zinco: conforme: 2,387 mg = 8,1 % do teto 29,59 mg; mínimo 1,65
- bella-gummy-biotina-em-gummy · Vitamina A: conforme: 1021,9 µg = 39 % do teto 2623,61 µg; mínimo 135
- bella-gummy-biotina-em-gummy · Biotina: conforme: 40 µg = 88,9 % do teto 45 µg; mínimo 4,5
- creatina-monohidratada-150g-soluvel · Creatina: conforme: 4020 mg = 80,4 % do teto 5000 mg; mínimo 3000
- creatina-monohidratada-300g-soluvel · Creatina: conforme: 4020 mg = 80,4 % do teto 5000 mg; mínimo 3000
- creatina-gummy-sabor-frutas-vermelhas · Creatina: conforme: 3517,5 mg = 70,3 % do teto 5000 mg; mínimo 3000
- creatina-em-gummy-sabor-tutti-frutti · Creatina: conforme: 3517,5 mg = 70,3 % do teto 5000 mg; mínimo 3000
- melatonina-em-gummy-sabor-uva · Triptofano: conforme: 750 mg = 87,2 % do teto 860 mg; mínimo 42
- melatonina-em-gummy-sabor-uva · Melatonina: conforme: 0,18 mg = 85,7 % do teto 0,21 mg; mínimo NE
- pre-treino-300-g · Creatina: conforme: 3517,5 mg = 70,3 % do teto 5000 mg; mínimo 3000
- pre-treino-300-g · Beta-alanina: conforme: 0,2973 g = 14,9 % do teto 2 g; mínimo NE
- pre-treino-300-g · Arginina: conforme: 1019,2 mg = 26,8 % do teto 3810 mg; mínimo NE
- pre-treino-300-g · Taurina: conforme: 895,1 mg = 44,8 % do teto 2000 mg; mínimo NE
- pre-treino-300-g · Tirosina: conforme: 399,6 mg = 14,5 % do teto 2750 mg; mínimo 262,5
- pre-treino-300-g · Cafeína: conforme: 174,8 mg = 87,4 % do teto 200 mg; mínimo 75
- pre-treino-300-g · Vitamina B6: conforme: 1,644 mg = 1,7 % do teto 98,6 mg; mínimo 0,26
- pre-treino-300-g · Vitamina B12: conforme: 8,5 µg = 85,5 % do teto 9,94 µg; mínimo 0,36
- pre-treino-creatina-sabor-limao-420g · Creatina: conforme: 4020 mg = 80,4 % do teto 5000 mg; mínimo 3000
- pre-treino-creatina-sabor-limao-420g · Beta-alanina: conforme: 0,2973 g = 14,9 % do teto 2 g; mínimo NE
- pre-treino-creatina-sabor-limao-420g · Arginina: conforme: 1019,2 mg = 26,8 % do teto 3810 mg; mínimo NE
- pre-treino-creatina-sabor-limao-420g · Taurina: conforme: 994,6 mg = 49,7 % do teto 2000 mg; mínimo NE
- pre-treino-creatina-sabor-limao-420g · Tirosina: conforme: 999 mg = 36,3 % do teto 2750 mg; mínimo 262,5
- pre-treino-creatina-sabor-limao-420g · L-Carnitina: conforme: 994,1 mg = 49,7 % do teto 2000 mg; mínimo NE
- pre-treino-creatina-sabor-limao-420g · Magnésio: conforme: 300 mg = 85,7 % do teto 350 mg; mínimo 63
- pre-treino-creatina-sabor-limao-420g · Cafeína (soma de 2 linhas: 149,8 mg + 12,78 mg): conforme: 162,58 mg = 81,3 % do teto 200 mg; mínimo 75
- pre-treino-creatina-sabor-limao-420g · Vitamina B6: conforme: 73,97 mg = 75 % do teto 98,6 mg; mínimo 0,26
- pre-treino-creatina-sabor-limao-420g · Niacina: conforme: 29,85 mg = 85,3 % do teto 35 mg; mínimo 2,4
- pre-treino-creatina-sabor-limao-420g · Vitamina D: conforme: 39,96 µg = 79,9 % do teto 50 µg; mínimo 3
- pre-treino-creatina-sabor-limao-420g · Vitamina B12: conforme: 8,5 µg = 85,5 % do teto 9,94 µg; mínimo 0,36

</details>

## (c) soma da porção e `cabe`

Nenhuma divergência.

<details><summary>Conferências registradas (29)</summary>

- multivitaminico · (porção): soma confere: insumos 722,864 + excipientes 277,136 = 1000 mg (porção 1000 mg; cabe=True)
- zma-zinco-magnesio-e-vitamina-d · (porção): soma confere: insumos 762,151 + excipientes 237,849 = 1000 mg (porção 1000 mg; cabe=True)
- biotina-em-capsula · (porção): soma confere: insumos 810,466 + excipientes 189,534 = 1000 mg (porção 1000 mg; cabe=True)
- dores-musculares · (porção): soma confere: insumos 910,19 + excipientes 89,81 = 1000 mg (porção 1000 mg; cabe=True)
- focus-colina · (porção): soma confere: insumos 968,855 + excipientes 31,145 = 1000 mg (porção 1000 mg; cabe=True)
- multi-vitta-gestante-e-lactante-em-capsula · (porção): soma confere: insumos 890,707 + excipientes 109,293 = 1000 mg (porção 1000 mg; cabe=True)
- melatonina-triptofanos-encapsulados · (porção): soma confere: insumos 979,106 + excipientes 20,894 = 1000 mg (porção 1000 mg; cabe=True)
- serena · (porção): soma confere: insumos 387,685 + excipientes 612,315 = 1000 mg (porção 1000 mg; cabe=True)
- serena · (porção): massas PENDENTES não somadas: Citrato de sódio (regulador de acidez) e ácido cítrico (acidulante); Aromatizante idêntico ao natural
- detox-matinal-lemon-shot-300g · (porção): soma confere: insumos 2119,1 + excipientes 7880,9 = 10000 mg (porção 10000 mg; cabe=True)
- saude-intestinal · (porção): soma confere: insumos 577,92 + excipientes 422,08 = 1000 mg (porção 1000 mg; cabe=True)
- moro-slim · (porção): soma confere: insumos 295,42 + excipientes 704,58 = 1000 mg (porção 1000 mg; cabe=True)
- pro-energy · (porção): soma confere: insumos 745 + excipientes 255 = 1000 mg (porção 1000 mg; cabe=True)
- emagrecedor-em-capsula · (porção): soma confere: insumos 115,42 + excipientes 884,58 = 1000 mg (porção 1000 mg; cabe=True)
- slim-up-emagrecimento-em-gota · (porção): soma confere: insumos 287,531 + excipientes 712,469 = 1000 mg (porção 1000 mg; cabe=True)
- shot-colageno-300-gramas · (porção): soma confere: insumos 9662,07 + excipientes 337,93 = 10000 mg (porção 10000 mg; cabe=True)
- omega-pro-tg · (porção): soma confere: insumos 1000 + excipientes 0 = 1000 mg (porção 1000 mg; cabe=True)
- bella-gummy-biotina-em-gummy · (porção): soma confere: insumos 79,96 + excipientes 5920,04 = 6000 mg (porção 6000 mg; cabe=True)
- bella-gummy-biotina-em-gummy · (porção): massas PENDENTES não somadas: Sorbitol líquido 70 %; Maltitol; Gelatina; Água purificada; Glicerina vegetal; Maltodextrina; Pectina cítrica; Goma acácia; Ácido cítrico; Citrato de sódio; Aroma de frutas vermelhas; Corante vermelho ponceau 4R; Sorbato de potássio; Sucralose
- creatina-monohidratada-150g-soluvel · (porção): soma confere: insumos 4000 + excipientes 0 = 4000 mg (porção 4000 mg; cabe=True)
- creatina-monohidratada-300g-soluvel · (porção): soma confere: insumos 4000 + excipientes 0 = 4000 mg (porção 4000 mg; cabe=True)
- creatina-gummy-sabor-frutas-vermelhas · (porção): soma confere: insumos 3500 + excipientes 4662,3 = 8162,3 mg (porção 6000 mg; cabe=False)
- creatina-em-gummy-sabor-tutti-frutti · (porção): soma confere: insumos 3500 + excipientes 4609,97 = 8109,97 mg (porção 6000 mg; cabe=False)
- creatina-em-gummy-sabor-tutti-frutti · (porção): massas PENDENTES não somadas: Aroma de tutti-frutti; Corante [rosa — nome técnico e INS PENDENTES]
- melatonina-em-gummy-sabor-uva · (porção): soma confere: insumos 750,931 + excipientes 5249,07 = 6000,001 mg (porção 6000 mg; cabe=True)
- melatonina-em-gummy-sabor-uva · (porção): massas PENDENTES não somadas: Sorbitol líquido 70 %; Maltitol; Gelatina; Água purificada; Glicerina vegetal; Maltodextrina; Pectina cítrica; Goma acácia; Ácido cítrico; Aroma de uva; Citrato de sódio; Sorbato de potássio; Sucralose; Corante vermelho 40; Corante azul brilhante FCF
- pre-treino-300-g · (porção): soma confere: insumos 6517,009 + excipientes 3482,991 = 10000 mg (porção 10000 mg; cabe=True)
- pre-treino-creatina-sabor-limao-420g · (porção): soma confere: insumos 10073,909 + excipientes 3926,091 = 14000 mg (porção 14000 mg; cabe=True)
- pre-treino-creatina-sabor-limao-420g · (porção): massas PENDENTES não somadas: Corante tartrazina

</details>

## (d) %VD

| slug | insumo/linha | esperado | encontrado | gravidade | nota |
|---|---|---|---|---|---|
| biotina-em-capsula | Vitamina E | %VD 100 % sobre a quantidade declarada (15 mg ÷ VD 15 [adultos_19_anos_ou_mais]) | 101,9 % (sobre o ativo exato 15,286 mg) | critério | o memorial calculou o %VD sobre o ativo exato; a consolidação recalcula sobre a quantidade declarada (o número impresso) — diferença ≤ 3 pontos |
| biotina-em-capsula | Vitamina B6 | %VD 630,8 % sobre a quantidade declarada (8,2 mg ÷ VD 1.3 [adultos_19_anos_ou_mais]) | 632,2 % (sobre o ativo exato 8,219 mg) | critério | o memorial calculou o %VD sobre o ativo exato; a consolidação recalcula sobre a quantidade declarada (o número impresso) — diferença ≤ 3 pontos |
| dores-musculares | Vitamina E | %VD 133,3 % sobre a quantidade declarada (20 mg ÷ VD 15 [adultos_19_anos_ou_mais]) | 135,9 % (sobre o ativo exato 20,381 mg) | critério | o memorial calculou o %VD sobre o ativo exato; a consolidação recalcula sobre a quantidade declarada (o número impresso) — diferença ≤ 3 pontos |
| saude-intestinal | Vitamina B6 | %VD 100 % sobre a quantidade declarada (1,3 mg ÷ VD 1.3 [adultos_19_anos_ou_mais]) | 97 % (sobre o ativo exato 1,26 mg) | critério | o memorial calculou o %VD sobre o ativo exato; a consolidação recalcula sobre a quantidade declarada (o número impresso) — diferença ≤ 3 pontos |
| saude-intestinal | Zinco | %VD 127,3 % sobre a quantidade declarada (14 mg ÷ VD 11 [adultos_19_anos_ou_mais]) | 123 % (sobre o ativo exato 13,5 mg) | critério | o memorial calculou o %VD sobre o ativo exato; a consolidação recalcula sobre a quantidade declarada (o número impresso) — diferença ≤ 3 pontos |
| pro-energy | Vitamina B6 | %VD 630,8 % sobre a quantidade declarada (8,2 mg ÷ VD 1.3 [adultos_19_anos_ou_mais]) | 632 % (sobre o ativo exato 8,22 mg) | critério | o memorial calculou o %VD sobre o ativo exato; a consolidação recalcula sobre a quantidade declarada (o número impresso) — diferença ≤ 3 pontos |

## (e) valor energético e kJ

| slug | insumo/linha | esperado | encontrado | gravidade | nota |
|---|---|---|---|---|---|
| focus-colina | Valor energético | kJ = kcal × 4,184 → 7 kJ | 7,3 kJ (fatores 17/37/13 kJ/g) | critério | memorial usou fatores em kJ/g (17 carboidrato e proteína, 37 gordura, 13 ácido orgânico), que NÃO constam do Anexo XXII da IN 75 (só kcal/g) — a consolidação adota kJ = kcal × 4,184; diferença ≤ 2 kJ |
| detox-matinal-lemon-shot-300g | Valor energético | kJ = kcal × 4,184 → 121 kJ | 123 kJ (fatores 17/37/13 kJ/g) | critério | memorial usou fatores em kJ/g (17 carboidrato e proteína, 37 gordura, 13 ácido orgânico), que NÃO constam do Anexo XXII da IN 75 (só kcal/g) — a consolidação adota kJ = kcal × 4,184; diferença ≤ 2 kJ |
| saude-intestinal | Valor energético | kJ = kcal × 4,184 → 9,2 kJ | 9,4 kJ (fatores 17/37/13 kJ/g) | critério | memorial usou fatores em kJ/g (17 carboidrato e proteína, 37 gordura, 13 ácido orgânico), que NÃO constam do Anexo XXII da IN 75 (só kcal/g) — a consolidação adota kJ = kcal × 4,184; diferença ≤ 2 kJ |
| shot-colageno-300-gramas | Valor energético | kJ = kcal × 4,184 → 147 kJ | 149 kJ (fatores 17/37/13 kJ/g) | critério | memorial usou fatores em kJ/g (17 carboidrato e proteína, 37 gordura, 13 ácido orgânico), que NÃO constam do Anexo XXII da IN 75 (só kcal/g) — a consolidação adota kJ = kcal × 4,184; diferença ≤ 2 kJ |
| omega-pro-tg | Valor energético | kJ = kcal × 4,184 → 38 kJ | 37 kJ (fatores 17/37/13 kJ/g) | critério | memorial usou fatores em kJ/g (17 carboidrato e proteína, 37 gordura, 13 ácido orgânico), que NÃO constam do Anexo XXII da IN 75 (só kcal/g) — a consolidação adota kJ = kcal × 4,184; diferença ≤ 2 kJ |

<details><summary>Conferências registradas (41)</summary>

- multivitaminico · Valor energético: 0 kcal — uma combinação que reproduz o declarado: fixos 0 [—] = 0 kcal
- multivitaminico · Valor energético: kJ 0 = kcal × 4,184 (0)
- zma-zinco-magnesio-e-vitamina-d · Valor energético: 0,6 kcal — uma combinação que reproduz o declarado: fixos 0 [—] + a 4 kcal/g: teanina = 0,6 kcal
- zma-zinco-magnesio-e-vitamina-d · Valor energético: kJ 2,6 = kcal × 4,184 (2,51)
- biotina-em-capsula · Valor energético: 1,1 kcal — uma combinação que reproduz o declarado: fixos 0,19 [maltodextrina do Siliciumax (95 %) 0,048 g × 4.0 = 0,19] + a 4 kcal/g: metionina, cisteina, metilsulfonilmetano | NÃO contados: hialuronato = 1,14 kcal
- biotina-em-capsula · Valor energético: kJ 4,8 = kcal × 4,184 (4,75)
- dores-musculares · Valor energético: 0,1 kcal — uma combinação que reproduz o declarado: fixos 0,11 [colágeno tipo II (proteína 67,6 % do laudo) 0,027 g × 4.0 = 0,11] | NÃO contados: metilsulfonilmetano, glucosamina = 0,11 kcal
- dores-musculares · Valor energético: kJ 0,5 = kcal × 4,184 (0,45)
- focus-colina · Valor energético: 1,7 kcal — uma combinação que reproduz o declarado: fixos 0 [—] + a 4 kcal/g: colina, tirosina | NÃO contados: teanina, carnitina, inositol = 1,68 kcal
- multi-vitta-gestante-e-lactante-em-capsula · Valor energético: 0 kcal — uma combinação que reproduz o declarado: fixos 0 [—] = 0 kcal
- multi-vitta-gestante-e-lactante-em-capsula · Valor energético: kJ 0 = kcal × 4,184 (0)
- melatonina-triptofanos-encapsulados · Valor energético: 2,8 kcal — uma combinação que reproduz o declarado: fixos 0 [—] + a 4 kcal/g: triptofano, aspartico, glutamina = 2,78 kcal
- melatonina-triptofanos-encapsulados · Valor energético: kJ 12 = kcal × 4,184 (11,63)
- serena · Valor energético: 1 kcal — uma combinação que reproduz o declarado: fixos 0 [—] + a 4 kcal/g: teanina, inositol, glicerina = 0,97 kcal
- serena · Valor energético: kJ 4,1 = kcal × 4,184 (4,07)
- detox-matinal-lemon-shot-300g · Valor energético: 29 kcal — uma combinação que reproduz o declarado: fixos 28,87 [maltodextrina 6,714 g × 4.0 = 26,86; ácido cítrico 0,67 g × 3.0 = 2,01] = 28,87 kcal
- saude-intestinal · Valor energético: 2,2 kcal — uma combinação que reproduz o declarado: fixos 1,67 [maltodextrina 0,417 g × 4.0 = 1,67] + a 4 kcal/g: glutamina = 2,21 kcal
- moro-slim · Valor energético: 2,8 kcal — uma combinação que reproduz o declarado: fixos 2,8 [maltodextrina 0,7 g × 4.0 = 2,8] = 2,8 kcal
- moro-slim · Valor energético: kJ 12 = kcal × 4,184 (11,71)
- pro-energy · Valor energético: 1 kcal — uma combinação que reproduz o declarado: fixos 1 [maltodextrina 0,25 g × 4.0 = 1] | NÃO contados: taurina, carnitina, aspartato = 1 kcal
- pro-energy · Valor energético: kJ 4,3 = kcal × 4,184 (4,18)
- emagrecedor-em-capsula · Valor energético: 3,5 kcal — uma combinação que reproduz o declarado: fixos 3,52 [maltodextrina 0,88 g × 4.0 = 3,52] = 3,52 kcal
- emagrecedor-em-capsula · Valor energético: kJ 15 = kcal × 4,184 (14,72)
- slim-up-emagrecimento-em-gota · Valor energético: 0,67 kcal — uma combinação que reproduz o declarado: fixos 0,14 [sorbitol (líquido 70 %) 0,047 g × 2.6 = 0,12; ácido cítrico 0,007 g × 3.0 = 0,02; fibra solúvel 0,001 g × 2.0 = 0] + a 4 kcal/g: glicerina | NÃO contados: colina = 0,68 kcal
- slim-up-emagrecimento-em-gota · Valor energético: kJ 2,8 = kcal × 4,184 (2,83)
- shot-colageno-300-gramas · Valor energético: 35 kcal — uma combinação que reproduz o declarado: fixos 35,04 [colágeno hidrolisado (× % de proteína) 9,45 g × 91 % × 4 = 34,4; ácido cítrico 0,15 g × 3.0 = 0,45; maltodextrina 0,048 g × 4.0 = 0,19] = 35,04 kcal
- omega-pro-tg · Valor energético: 9 kcal — uma combinação que reproduz o declarado: fixos 9 [óleo 1 g × 9.0 = 9] = 9 kcal
- bella-gummy-biotina-em-gummy · Valor energético: PENDENTE no JSON (memorial não traz massa dos excipientes; rótulo/memorial imprimem 12 kcal = 50 kJ (não recalculável))
- creatina-monohidratada-150g-soluvel · Valor energético: 0 kcal — uma combinação que reproduz o declarado: fixos 0 [—] | NÃO contados: creatina = 0 kcal
- creatina-monohidratada-150g-soluvel · Valor energético: kJ 0 = kcal × 4,184 (0)
- creatina-monohidratada-300g-soluvel · Valor energético: 0 kcal — uma combinação que reproduz o declarado: fixos 0 [—] | NÃO contados: creatina = 0 kcal
- creatina-monohidratada-300g-soluvel · Valor energético: kJ 0 = kcal × 4,184 (0)
- creatina-gummy-sabor-frutas-vermelhas · Valor energético: 9 kcal — uma combinação que reproduz o declarado: fixos 9,2 [sorbitol (líquido 70 %) 1,225 g × 2.6 = 3,18; maltitol 1,256 g × 2.1 = 2,64; gelatina (N 15,0 % × 6,25) 0,656 g × 4.0 = 2,62; ácido cítrico 0,168 g × 3.0 = 0,5; pectina (ácido galacturônico 90 %) 0,126 g × 2.0 = 0,25] | NÃO contados: creatina, glicerina = 9,2 kcal
- creatina-gummy-sabor-frutas-vermelhas · Valor energético: kJ 39 = kcal × 4,184 (38,51)
- creatina-em-gummy-sabor-tutti-frutti · Valor energético: 9 kcal — uma combinação que reproduz o declarado: fixos 9,2 [sorbitol (líquido 70 %) 1,225 g × 2.6 = 3,18; maltitol 1,256 g × 2.1 = 2,64; gelatina (N 15,0 % × 6,25) 0,656 g × 4.0 = 2,62; ácido cítrico 0,168 g × 3.0 = 0,5; pectina (ácido galacturônico 90 %) 0,126 g × 2.0 = 0,25] | NÃO contados: creatina, glicerina = 9,2 kcal
- creatina-em-gummy-sabor-tutti-frutti · Valor energético: kJ 39 = kcal × 4,184 (38,51)
- melatonina-em-gummy-sabor-uva · Valor energético: PENDENTE no JSON (memorial sem massa dos excipientes; rótulo/memorial: 11 kcal = 46 kJ (não recalculável))
- pre-treino-300-g · Valor energético: 17 kcal — uma combinação que reproduz o declarado: fixos 10,6 [ácido cítrico 1,1 g × 3.0 = 3,3; maltodextrina 1,825 g × 4.0 = 7,3] + a 4 kcal/g: beta-alanina, arginina, tirosina | NÃO contados: creatina, taurina = 17,46 kcal
- pre-treino-300-g · Valor energético: kJ 73 = kcal × 4,184 (73,07)
- pre-treino-creatina-sabor-limao-420g · Valor energético: 22 kcal — uma combinação que reproduz o declarado: fixos 12,37 [ácido cítrico 1,1 g × 3.0 = 3,3; maltodextrina 2,268 g × 4.0 = 9,07] + a 4 kcal/g: beta-alanina, arginina, tirosina | NÃO contados: creatina, taurina, carnitina = 21,63 kcal
- pre-treino-creatina-sabor-limao-420g · Valor energético: kJ 91 = kcal × 4,184 (90,52)

</details>

## (f) forma literal no Anexo I

Nenhuma divergência.

<details><summary>Conferências registradas (154)</summary>

- multivitaminico · Magnésio: forma encontrada literalmente no Anexo I: 'Óxido de magnésio'
- multivitaminico · Vitamina C: forma encontrada literalmente no Anexo I: 'Ácido ascórbico'
- multivitaminico · Zinco: forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- multivitaminico · Niacina: forma encontrada literalmente no Anexo I: 'Nicotinamida'
- multivitaminico · Vitamina E: forma encontrada literalmente no Anexo I: 'Acetato de DL-alfa-tocoferol'
- multivitaminico · Ácido pantotênico: forma encontrada literalmente no Anexo I: 'D-pantotenato de cálcio'
- multivitaminico · Boro: forma encontrada literalmente no Anexo I: 'Tetraborato de sódio decahidratado'
- multivitaminico · Vitamina B6: forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- multivitaminico · Tiamina: forma encontrada literalmente no Anexo I: 'Cloridrato de tiamina'
- multivitaminico · Riboflavina: forma encontrada literalmente no Anexo I: 'Riboflavina'
- multivitaminico · Vitamina A: forma encontrada literalmente no Anexo I: 'Acetato de retinol'
- multivitaminico · Ácido fólico: forma encontrada literalmente no Anexo I: 'Ácido fólico'
- multivitaminico · Cobre: forma encontrada literalmente no Anexo I: 'Bisglicinato de cobre'
- multivitaminico · Selênio: forma encontrada literalmente no Anexo I: 'Selenito de sódio'
- multivitaminico · Vitamina K: forma encontrada literalmente no Anexo I: 'Menaquinona-7'
- multivitaminico · Vitamina D: forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- multivitaminico · Cromo: forma encontrada literalmente no Anexo I: 'Picolinato de cromo'
- multivitaminico · Vitamina B12: forma encontrada literalmente no Anexo I: 'Metilcobalamina'
- zma-zinco-magnesio-e-vitamina-d · Magnésio: forma encontrada literalmente no Anexo I: 'Bisglicinato de magnésio'
- zma-zinco-magnesio-e-vitamina-d · Teanina: forma encontrada literalmente no Anexo I: 'L-teanina de folhas de Camellia sinensis'
- zma-zinco-magnesio-e-vitamina-d · Zinco: forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- zma-zinco-magnesio-e-vitamina-d · Boro: forma encontrada literalmente no Anexo I: 'Tetraborato de sódio decahidratado'
- zma-zinco-magnesio-e-vitamina-d · Vitamina B6: forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- zma-zinco-magnesio-e-vitamina-d · Vitamina D: forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- biotina-em-capsula · Vitamina C: forma encontrada literalmente no Anexo I: 'Ácido ascórbico'
- biotina-em-capsula · Metionina: forma encontrada literalmente no Anexo I: 'L-Metionina'
- biotina-em-capsula · Cisteína: forma encontrada literalmente no Anexo I: 'Cloridrato de L-cisteína'
- biotina-em-capsula · Vitamina E: forma encontrada literalmente no Anexo I: 'Acetato de DL-alfa-tocoferol'
- biotina-em-capsula · Metilsulfonilmetano: forma encontrada literalmente no Anexo I: 'Metilsulfonilmetano'
- biotina-em-capsula · Ácido hialurônico: forma encontrada literalmente no Anexo I: 'Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus'
- biotina-em-capsula · Silício: forma encontrada literalmente no Anexo I: 'Ácido orto-silícico estabilizado com maltodextrina'
- biotina-em-capsula · Niacina: forma encontrada literalmente no Anexo I: 'Nicotinamida'
- biotina-em-capsula · Zinco: forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- biotina-em-capsula · Vitamina B6: forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- biotina-em-capsula · Vitamina A: forma encontrada literalmente no Anexo I: 'Acetato de retinol'
- biotina-em-capsula · Ácido pantotênico: forma encontrada literalmente no Anexo I: 'D-pantotenato de cálcio'
- biotina-em-capsula · Cobre: forma encontrada literalmente no Anexo I: 'Bisglicinato de cobre'
- biotina-em-capsula · Riboflavina: forma encontrada literalmente no Anexo I: 'Riboflavina'
- biotina-em-capsula · Ácido fólico: forma encontrada literalmente no Anexo I: 'Ácido fólico'
- biotina-em-capsula · Iodo: forma encontrada literalmente no Anexo I: 'Iodeto de potássio'
- biotina-em-capsula · Biotina: forma encontrada literalmente no Anexo I: 'D-biotina'
- biotina-em-capsula · Selênio: forma encontrada literalmente no Anexo I: 'Selenito de sódio'
- biotina-em-capsula · Vitamina D: forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- biotina-em-capsula · Vitamina B12: forma encontrada literalmente no Anexo I: 'Metilcobalamina'
- dores-musculares · Metilsulfonilmetano: forma encontrada literalmente no Anexo I: 'Metilsulfonilmetano'
- dores-musculares · Glucosamina: forma encontrada literalmente no Anexo I: 'Sulfato de glucosamina com cloreto de potássio'
- dores-musculares · Vitamina C: forma encontrada literalmente no Anexo I: 'Ácido ascórbico'
- dores-musculares · Magnésio: forma encontrada literalmente no Anexo I: 'Óxido de magnésio'
- dores-musculares · Vitamina E: forma encontrada literalmente no Anexo I: 'Acetato de DL-alfa-tocoferol'
- dores-musculares · Zinco: forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- dores-musculares · Colágeno tipo II não desnaturado: forma encontrada literalmente no Anexo I: 'Colágeno de frango com colágeno tipo II não desnaturado'
- dores-musculares · Ferro: forma encontrada literalmente no Anexo I: 'Bisglicinato ferroso'
- dores-musculares · Vitamina D: forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- dores-musculares · Vitamina B6: forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- dores-musculares · Selênio: forma encontrada literalmente no Anexo I: 'Selenito de sódio'
- dores-musculares · Vitamina B12: forma encontrada literalmente no Anexo I: 'Metilcobalamina'
- focus-colina · Colina: forma encontrada literalmente no Anexo I: 'Bitartarato de colina'
- focus-colina · Tirosina: forma encontrada literalmente no Anexo I: 'L-Tirosina'
- focus-colina · Teanina: forma encontrada literalmente no Anexo I: 'L-teanina de folhas de Camellia sinensis'
- focus-colina · L-Carnitina: forma encontrada literalmente no Anexo I: 'Levocarnitina'
- focus-colina · Magnésio: forma encontrada literalmente no Anexo I: 'Óxido de magnésio'
- focus-colina · Inositol: forma encontrada literalmente no Anexo I: 'Inositol (Mio-inositol/Meso-inositol)'
- focus-colina · Vitamina D: forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- focus-colina · Vitamina B6: forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- focus-colina · Vitamina B12: forma encontrada literalmente no Anexo I: 'Metilcobalamina'
- multi-vitta-gestante-e-lactante-em-capsula · Cálcio: forma encontrada literalmente no Anexo I: 'Carbonato de cálcio'
- multi-vitta-gestante-e-lactante-em-capsula · Magnésio: forma encontrada literalmente no Anexo I: 'Bisglicinato de magnésio'
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina C: forma encontrada literalmente no Anexo I: 'Ácido ascórbico'
- multi-vitta-gestante-e-lactante-em-capsula · Ferro: forma encontrada literalmente no Anexo I: 'Bisglicinato ferroso'
- multi-vitta-gestante-e-lactante-em-capsula · Niacina: forma encontrada literalmente no Anexo I: 'Nicotinamida'
- multi-vitta-gestante-e-lactante-em-capsula · Ácido pantotênico: forma encontrada literalmente no Anexo I: 'D-pantotenato de cálcio'
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina E: forma encontrada literalmente no Anexo I: 'Acetato de DL-alfa-tocoferol'
- multi-vitta-gestante-e-lactante-em-capsula · Cobre: forma encontrada literalmente no Anexo I: 'Bisglicinato de cobre'
- multi-vitta-gestante-e-lactante-em-capsula · Ácido fólico: forma encontrada literalmente no Anexo I: 'Ácido fólico'
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina D: forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- multi-vitta-gestante-e-lactante-em-capsula · Vitamina B12: forma encontrada literalmente no Anexo I: 'Metilcobalamina'
- melatonina-triptofanos-encapsulados · Triptofano: forma encontrada literalmente no Anexo I: 'L-Triptofano'
- melatonina-triptofanos-encapsulados · Aspartato: forma encontrada literalmente no Anexo I: 'Ácido L-aspártico'
- melatonina-triptofanos-encapsulados · Glutamina: forma encontrada literalmente no Anexo I: 'L-Glutamina'
- melatonina-triptofanos-encapsulados · Magnésio: forma encontrada literalmente no Anexo I: 'Bisglicinato de magnésio'
- melatonina-triptofanos-encapsulados · Zinco: forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- melatonina-triptofanos-encapsulados · Melatonina: forma encontrada literalmente no Anexo I: 'Melatonina'
- melatonina-triptofanos-encapsulados · Biotina: forma encontrada literalmente no Anexo I: 'D-biotina'
- serena · Magnésio: forma encontrada literalmente no Anexo I: 'Cloreto de magnésio'
- serena · Teanina: forma encontrada literalmente no Anexo I: 'L-teanina de folhas de Camellia sinensis'
- serena · Inositol: forma encontrada literalmente no Anexo I: 'Inositol (Mio-inositol/Meso-inositol)'
- serena · Vitamina B6: forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- serena · Melatonina: forma encontrada literalmente no Anexo I: 'Melatonina'
- detox-matinal-lemon-shot-300g · Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7): forma encontrada literalmente no Anexo I: 'Ácido ascórbico'
- detox-matinal-lemon-shot-300g · Ácido clorogênico — Extrato de café verde (IN 102/2021): forma encontrada literalmente no Anexo I: 'Extrato de café verde'
- detox-matinal-lemon-shot-300g · Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024): forma encontrada literalmente no Anexo I: 'Extrato de laranja moro (Citrus sinensis (L.) Osbeck)'
- detox-matinal-lemon-shot-300g · Zinco — Bisglicinato de zinco (CAS 14281-83-5): forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- saude-intestinal · Glutamina — L-Glutamina (CAS 56-85-9): forma encontrada literalmente no Anexo I: 'L-Glutamina'
- saude-intestinal · Magnésio — Bisglicinato de magnésio (CAS 14783-68-7): forma encontrada literalmente no Anexo I: 'Bisglicinato de magnésio'
- saude-intestinal · Quercetina — Quercetina (IN 418/2025; linha do Anexo I sem CAS): forma encontrada literalmente no Anexo I: 'Quercetina'
- saude-intestinal · Zinco — Bisglicinato de zinco (CAS 14281-83-5): forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- saude-intestinal · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): forma encontrada literalmente no Anexo I: 'Acetato de retinol'
- saude-intestinal · Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0): forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- moro-slim · Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024): forma encontrada literalmente no Anexo I: 'Extrato de laranja moro (Citrus sinensis (L.) Osbeck)'
- moro-slim · Ácido clorogênico — Extrato de café verde (IN 102/2021): forma encontrada literalmente no Anexo I: 'Extrato de café verde'
- moro-slim · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): forma encontrada literalmente no Anexo I: 'Acetato de retinol'
- moro-slim · Cromo — Picolinato de cromo (CAS 14639-25-9): forma encontrada literalmente no Anexo I: 'Picolinato de cromo'
- pro-energy · Taurina — Taurina (CAS 107-35-7): forma encontrada literalmente no Anexo I: 'Taurina'
- pro-energy · Cafeína — Guaraná em pó (Paullinia cupana): forma encontrada literalmente no Anexo I: 'Guaraná em pó (Paullinia cupana)'
- pro-energy · Cafeína — Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2): forma encontrada literalmente no Anexo I: 'Cafeína'
- pro-energy · L-Carnitina — Levocarnitina/L-carnitina (CAS 541-15-1): forma encontrada literalmente no Anexo I: 'Levocarnitina'
- pro-energy · Arginina — Cloridrato de L-arginina (CAS 1119-34-2): forma encontrada literalmente no Anexo I: 'Cloridrato de L-arginina'
- pro-energy · Zinco — Bisglicinato de zinco (CAS 14281-83-5): forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- pro-energy · Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0): forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- emagrecedor-em-capsula · Ácido clorogênico — Extrato de café verde (IN 102/2021): forma encontrada literalmente no Anexo I: 'Extrato de café verde'
- emagrecedor-em-capsula · Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024): forma encontrada literalmente no Anexo I: 'Extrato de laranja moro (Citrus sinensis (L.) Osbeck)'
- emagrecedor-em-capsula · Cromo — Picolinato de cromo (CAS 14639-25-9): forma encontrada literalmente no Anexo I: 'Picolinato de cromo'
- emagrecedor-em-capsula · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): forma encontrada literalmente no Anexo I: 'Acetato de retinol'
- slim-up-emagrecimento-em-gota · Vitamina D — Vitamina D_3 (Colecalciferol) (CAS 67-97-0): forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- slim-up-emagrecimento-em-gota · Vitamina B12 — Metilcobalamina (CAS 13422-55-4): forma encontrada literalmente no Anexo I: 'Metilcobalamina'
- slim-up-emagrecimento-em-gota · Cromo — Picolinato de cromo (CAS 14639-25-9): forma encontrada literalmente no Anexo I: 'Picolinato de cromo'
- slim-up-emagrecimento-em-gota · Ácido clorogênico — Extrato de café verde (IN 102/2021): forma encontrada literalmente no Anexo I: 'Extrato de café verde'
- slim-up-emagrecimento-em-gota · Colina — Bitartarato de colina/Hidrogênio tartarato de colina (CAS 87-67-2): forma encontrada literalmente no Anexo I: 'Bitartarato de colina'
- shot-colageno-300-gramas · Proteínas — Gelatina hidrolisada/Colágeno hidrolisado: forma encontrada literalmente no Anexo I: 'Gelatina hidrolisada'
- shot-colageno-300-gramas · Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7): forma encontrada literalmente no Anexo I: 'Ácido ascórbico'
- shot-colageno-300-gramas · Zinco — Bisglicinato de zinco (CAS 14281-83-5): forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- omega-pro-tg · Lipídeos — Óleo de peixe (grupo 'Lipídeos' do Anexo I, redação IN 431/2026; linha 'Óleo de peixe', CAS '-'): forma encontrada literalmente no Anexo I: 'Óleo de peixe'
- bella-gummy-biotina-em-gummy · Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7): forma encontrada literalmente no Anexo I: 'Ácido ascórbico'
- bella-gummy-biotina-em-gummy · Vitamina E — Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila (CAS 7695-91-2): forma encontrada literalmente no Anexo I: 'Acetato de DL-alfa-tocoferol'
- bella-gummy-biotina-em-gummy · Zinco — Bisglicinato de zinco (CAS 14281-83-5): forma encontrada literalmente no Anexo I: 'Bisglicinato de zinco'
- bella-gummy-biotina-em-gummy · Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9): forma encontrada literalmente no Anexo I: 'Acetato de retinol'
- bella-gummy-biotina-em-gummy · Biotina — D-biotina (CAS 58-85-5): forma encontrada literalmente no Anexo I: 'D-biotina'
- creatina-monohidratada-150g-soluvel · Creatina — Creatina monohidratada (CAS 6020-87-7): forma encontrada literalmente no Anexo I: 'Creatina monohidratada'
- creatina-monohidratada-300g-soluvel · Creatina — Creatina monohidratada (CAS 6020-87-7): forma encontrada literalmente no Anexo I: 'Creatina monohidratada'
- creatina-gummy-sabor-frutas-vermelhas · Creatina — Creatina monohidratada (CAS 6020-87-7): forma encontrada literalmente no Anexo I: 'Creatina monohidratada'
- creatina-em-gummy-sabor-tutti-frutti · Creatina — Creatina monohidratada (CAS 6020-87-7): forma encontrada literalmente no Anexo I: 'Creatina monohidratada'
- melatonina-em-gummy-sabor-uva · Triptofano — L-Triptofano (CAS 73-22-3): forma encontrada literalmente no Anexo I: 'L-Triptofano'
- melatonina-em-gummy-sabor-uva · Melatonina — Melatonina (CAS 73-31-4, IN 102/2021): forma encontrada literalmente no Anexo I: 'Melatonina'
- pre-treino-300-g · Creatina — Creatina monohidratada (CAS 6020-87-7): forma encontrada literalmente no Anexo I: 'Creatina monohidratada'
- pre-treino-300-g · Beta-alanina (CAS 107-95-9, IN 102/2021): forma encontrada literalmente no Anexo I: 'Beta-alanina'
- pre-treino-300-g · Arginina — Cloridrato de L-arginina (CAS 1119-34-2): forma encontrada literalmente no Anexo I: 'Cloridrato de L-arginina'
- pre-treino-300-g · Taurina (CAS 107-35-7): forma encontrada literalmente no Anexo I: 'Taurina'
- pre-treino-300-g · Tirosina — L-Tirosina (CAS 60-18-4): forma encontrada literalmente no Anexo I: 'L-Tirosina'
- pre-treino-300-g · Cafeína — Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2): forma encontrada literalmente no Anexo I: 'Cafeína'
- pre-treino-300-g · Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0): forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- pre-treino-300-g · Vitamina B12 — Metilcobalamina (CAS 13422-55-4): forma encontrada literalmente no Anexo I: 'Metilcobalamina'
- pre-treino-creatina-sabor-limao-420g · Creatina — Creatina monohidratada (CAS 6020-87-7): forma encontrada literalmente no Anexo I: 'Creatina monohidratada'
- pre-treino-creatina-sabor-limao-420g · Beta-alanina (CAS 107-95-9): forma encontrada literalmente no Anexo I: 'Beta-alanina'
- pre-treino-creatina-sabor-limao-420g · Arginina — Cloridrato de L-arginina (CAS 1119-34-2): forma encontrada literalmente no Anexo I: 'Cloridrato de L-arginina'
- pre-treino-creatina-sabor-limao-420g · Taurina (CAS 107-35-7): forma encontrada literalmente no Anexo I: 'Taurina'
- pre-treino-creatina-sabor-limao-420g · Tirosina — L-Tirosina (CAS 60-18-4): forma encontrada literalmente no Anexo I: 'L-Tirosina'
- pre-treino-creatina-sabor-limao-420g · Carnitina — Levocarnitina/L-carnitina (CAS 541-15-1): forma encontrada literalmente no Anexo I: 'Levocarnitina'
- pre-treino-creatina-sabor-limao-420g · Magnésio — Bisglicinato de magnésio (CAS 14783-68-7): forma encontrada literalmente no Anexo I: 'Bisglicinato de magnésio'
- pre-treino-creatina-sabor-limao-420g · Cafeína — Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2): forma encontrada literalmente no Anexo I: 'Cafeína'
- pre-treino-creatina-sabor-limao-420g · Cafeína — Guaraná em pó (Paullinia cupana): forma encontrada literalmente no Anexo I: 'Guaraná em pó (Paullinia cupana)'
- pre-treino-creatina-sabor-limao-420g · Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0): forma encontrada literalmente no Anexo I: 'Cloridrato de piridoxina'
- pre-treino-creatina-sabor-limao-420g · Niacina — Nicotinamida/Niacinamida (CAS 98-92-0): forma encontrada literalmente no Anexo I: 'Nicotinamida'
- pre-treino-creatina-sabor-limao-420g · Vitamina D — Vitamina D3 (Colecalciferol) (CAS 67-97-0): forma encontrada literalmente no Anexo I: 'Vitamina D3 (Colecalciferol)'
- pre-treino-creatina-sabor-limao-420g · Vitamina B12 — Metilcobalamina (CAS 13422-55-4): forma encontrada literalmente no Anexo I: 'Metilcobalamina'

</details>

## (g) mínimos/máximos × Anexos III/IV literais

Nenhuma divergência.

<details><summary>Conferências registradas (3)</summary>

- omega-pro-tg · (componente) outros ácidos graxos ômega-3: constituinte não mapeado para linha dos Anexos III/IV (linha informativa)
- pre-treino-creatina-sabor-limao-420g · Cafeína — Guaraná em pó (Paullinia cupana): mínimo Cafeína não informado nesta linha (anexo: 75 mg); conferido pela soma do constituinte
- pre-treino-creatina-sabor-limao-420g · Cafeína — Guaraná em pó (Paullinia cupana): máximo Cafeína não informado nesta linha (anexo: 200 mg); conferido pela soma do constituinte

</details>
