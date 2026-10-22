# Memorial de reformulação — CREATINA MONOIDRATADA 300 g SOLÚVEL

**Data:** 16/09/2026. **Slug:** `creatina-monohidratada-300g-soluvel`. **Para:** dono e RT (Anderson C. Barbosa, CRF/MT 5526).

**Fontes lidas:** cadastro do banco lido ao vivo em 16/09/2026 (1 linha: creatina monoidratada 5.000 mg; `ingredients_list` e `warnings` **vazios**; `nutritional_info` = "Creatina Monohidratada (5000 mg)"; `net_weight` vazio); auditoria de 15/09/2026, Parte II, item II.2 (100 % conforme **pelo cadastro**, sem rótulo); `INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md`, seção 3; memorial MEM-CALC-CREATINAPO-rev02 (13/08/2026) — que trata **só** da apresentação de 150 g; laudo da creatina lote 217949 (validade 22/09/2028); IN 28/2018 Anexos I, III, IV, VI literais; IN 75/2020 e RDC 429/2020 (AnvisaLegis, 16/09/2026).

Este produto é o mesmo pó de ingrediente único do pote de 150 g (`creatina-monohidratada-150g-soluvel`), com a mesma dose — igualdade confirmada pelo dono na migration `20260919000000_padroniza_modo_de_uso.sql`. **Tudo que vale para a fórmula do pote de 150 g vale aqui**; o que este memorial acrescenta é o que é específico da apresentação de 300 g. Para não repetir, as contas do teor (leituras A e B) estão no memorial do pote de 150 g e são referidas abaixo.

## 1. Identificação

| campo | atual | proposta |
|---|---|---|
| Nome | CREATINA MONOIDRATADA 300 g SOLÚVEL | mantido |
| Formato | pó solúvel, sem sabor, ingrediente único | mantido |
| Porção | 5 g (1 dose) | **4 g (1 dosador nivelado)** — mesma decisão do pote de 150 g |
| Porções por embalagem | não declarada no cadastro (300 ÷ 5 = 60) | **75** (300 ÷ 4 = 75, inteiro: IN 75 Anexo VI, "3 ou mais porções inteiras") |
| Grupo populacional | adultos, "> 19 anos" | mantido |
| Peso líquido | 300 g (`pote_contents_description`); `net_weight` vazio no banco | preencher `net_weight` = "300 g" (fora do escopo do SQL desta fase; registrado) |

## 2. Antes

Fonte: **cadastro** (não há rótulo nem memorial próprios; o dono é a fonte da composição).

| insumo | cadastro | ativo | mín | máx | auditoria 15/09 (Parte II) |
|---|---|---|---|---|---|
| creatina monoidratada | 5.000 mg | 5.000 mg | 3.000 mg | 5.000 mg | conforme pelo cadastro — **igual ao máximo** |

Achado da auditoria de ingredientes (15/09): existe uma arte `~/Downloads/CREATINA MONOHIDRATADA 300 GRAMAS.svg` com "Porções por embalagem: 100 · Porção: 3.000 mg (1 dosador)" — dose de 3 g, não de 5 g — e uma proposta comercial de 14/02/2026 com "5 g × 60 doses". Qual arte vale é pergunta para a fábrica. A fase 1 (16/09) confirmou que o memorial de 150 g não menciona 300 g em lugar nenhum e que, se o pote for o mesmo PEAD de 600 mL, 300 g de pó solto (491 g/L) ocupam ~611 mL — cabe só com o pó assentado (737 g/L → ~407 mL).

## 3. Depois

| # | constituinte (Anexo I) | insumo | massa por porção | teor e fonte | ativo (conta) | mín | máx | % do máx | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina — "Creatina monohidratada" (CAS 6020-87-7) | creatina monoidratada em pó | **4.000 mg** | 100,5 % b.s.; LOD 11,5 % — laudo lote 217949 (o mesmo lote da gummy e do pote de 150 g) | leitura A: 4.000 × 1,005 = **4.020 mg** · leitura B: 4.000 × 0,885 × 1,005 = **3.558 mg** | 3.000 mg | 5.000 mg | A 80,4 % · B 71,2 % | I·Creatina·Creatina monohidratada; III·Creatina; IV·Creatina (IN 373/2025) | 217949 · 22/09/2028 · não vencido | **dose ajustada** (5.000 → 4.000 mg) |

**Soma da porção:** 4.000 mg de 4.000 mg (100 %). Sem excipientes.

## 4. Mudanças e motivos

1. **Dose 5.000 → 4.000 mg** — mesmo motivo do pote de 150 g: 5.000 mg crava o teto; com o teor do laudo (100,5 %) o calculado é 5.025 mg na leitura A; o dosador é volumétrico e não validado. 4.000 mg fica com folga nas duas leituras e tolera ±10 % de dosagem.
2. **Porções por embalagem: 75** (inteiro exato).
3. **`ingredients_list`, `warnings`, `nutritional_info` e `serving_description` preenchidos** — estavam vazios ou incompletos (o cadastro tinha só "Creatina Monohidratada (5000 mg)"); a advertência do Anexo VI (creatina) faltava.

## 5. Tabela nutricional

Mesmas regras do pote de 150 g (IN 75 Anexos III, IV, VI, VIII, XI, XXII; RDC 429 Art. 5º § 3º, Art. 7º e Art. 12).

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 75
Porção: 4 g (1 dosador)
                                   4 g            %VD*
Valor energético                   0 kcal = 0 kJ  0 %
Carboidratos                       0 g            0 %
n Açúcares totais                  0 g
nn Açúcares adicionados            0 g            0 %
Proteínas                          0 g            0 %
Gorduras totais                    0 g            0 %
n Gorduras saturadas               0 g            0 %
n Gorduras trans                   0 g            0 %
Fibras alimentares                 0 g            0 %
Sódio                              0 mg           0 %
Creatina                           4.000 mg
*Percentual de valores diários fornecidos pela porção
```

Energia: creatina não tem fator no Anexo XXII → 0 kcal (≤ 4 kcal declara-se 0, Anexo IV). Creatina declarada pela massa nominal de creatina monoidratada; o lote entrega 4.020 mg (A) ou 3.558 mg de creatina anidra (B).

## 6. Lista de ingredientes

> Creatina monoidratada.

Glúten: Lei 10.674/2003 obriga a frase; sem ensaio — "Não contém glúten" só com laudo ou declaração do RT. Sem alergênicos.

## 7. Advertências (hoje o campo está vazio)

Art. 14 da RDC 243/2018 (literal): **"Este produto não é um medicamento."** · **"Não exceder a recomendação diária de consumo indicada na embalagem."** · **"Mantenha fora do alcance de crianças."** Grupo e uso: "Público indicado: adultos a partir de 19 anos" · "Diluir 4 g (1 dosador) em 200 mL de água e consumir 1 vez ao dia". Conservação (o cadastro traz "Conservar em temperatura média entre 20 °C e 28 °C", redação diferente do pote de 150 g — unificar para a padrão da linha: local seco, fresco e arejado, 15–30 °C, 60 dias após aberto).

Anexo VI da IN 28/2018 (Creatina): **"Este produto não deve ser consumido por gestantes, lactantes e crianças."** — **faltava**.

## 8. Pendências e decisões

1. **Confirmar com a fábrica a apresentação de 300 g**: dose (4 g proposta × 75 porções) e pote (600 mL comporta 300 g só com o pó assentado; se for outro pote, laudo de embalagem próprio); descartar ou atualizar o SVG de "3 g × 100 porções".
2. **Memorial de cálculo e arte de rótulo próprios** para 300 g — não existem.
3. Decisão do RT sobre a leitura do limite (A/B) e validação gravimétrica do dosador — as mesmas do pote de 150 g.
4. `net_weight` = "300 g" e conservação padronizada no cadastro (fora do SQL desta fase).
5. Glúten: laudo ou declaração.

## 9. Veredito esperado

**CONFORME (com folga)** — condicionado à validação gravimétrica do dosador e à documentação própria da apresentação de 300 g (memorial, arte e embalagem).
