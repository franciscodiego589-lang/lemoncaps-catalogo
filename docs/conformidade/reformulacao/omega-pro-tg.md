# Memorial de reformulação — Ômega Pró TG

**Slug:** `omega-pro-tg` · **Data:** 16/09/2026 · **Fase 2 — reformulação regulatória do catálogo Lemon Caps**
**Fontes lidas:** Anexos I, III, IV, V e VI da IN 28/2018 (transcrições literais, consolidação até a IN 450/2026); auditoria de 15/09/2026 (Parte II, seção II.6, inclusive a captura do painel oficial para "Óleo de peixe"); inventário de memoriais (`memoriais-formulacoes.json`, entrada `omega-pro-tg`: **nenhum documento encontrado**); inventário de laudos de 16/09/2026; gabarito da tabela nutricional; cadastro do banco lido ao vivo em 16/09/2026.

Em cada número está dito se foi **lido**, **calculado** ou **PROVISÓRIO**. Este produto **não tem memorial de cálculo, ficha técnica, arte de rótulo nem laudo do óleo** — a única fonte é o cadastro do banco, cuja procedência ninguém confirmou.

---

## 1. Identificação

| campo | valor |
|---|---|
| Nome | Ômega Pró TG |
| Formato | suplemento alimentar em softgel (cápsula mole); "TG" sugere triglicerídeo — nenhum documento confirma |
| Porção | 1 g de óleo (2 softgels) — conforme o cadastro ("Ingerir 2 softgels ao dia") |
| Porções por embalagem | 30 (60 softgels) |
| Grupo populacional | adultos, coluna "> 19 anos" |
| Campos vazios no banco | `ingredients_list`, `warnings`, `technical_sheet_title`, `storage_instructions` |

## 2. Antes — composição atual e veredito da auditoria

Fonte: **cadastro do banco** (5 linhas ativas, lidas ao vivo em 16/09/2026). As linhas 2 a 5 são componentes da linha 1, não massa adicional (185,34 + 123,56 + 7,6 = 316,5 = "ômega-3 total": fecha).

| # | cadastro | massa | leitura | veredito da auditoria de 15/09 |
|---|---|---|---|---|
| 1 | Óleo de peixe TG | 1.000 mg | 1 g de lipídeos | **NÃO VERIFICADO** — interpretação do mínimo de 5 g de lipídeos totais pendente |
| 2 | Ômega-3 total | 316,5 mg | componente | informativo |
| 3 | EPA (ácido eicosapentaenoico) | 185,34 mg | componente | CONFORME na soma (EPA + DHA = 308,9 mg; faixa 37,5–2.000 mg) |
| 4 | DHA (ácido docosaexaenoico) | 123,56 mg | componente | CONFORME na soma |
| 5 | Outros ácidos graxos ômega-3 | 7,6 mg | componente | informativo |

Veredito da auditoria: **NÃO VERIFICÁVEL**; `warnings` e `ingredients_list` vazios (as três frases do art. 14 faltam).

## 3. Leitura literal dos anexos e as duas interpretações

**O que está escrito (lido em 16/09/2026 nas transcrições literais):**

- Anexo I, grupo "Lipídeos (Redação dada pela IN 431/2026)": linha "Óleo de peixe | -" (e, separada, "Óleo de peixe com alto teor de DHA | 8016-13-5", IN 76/2020). Não há linha "EPA" ou "DHA de óleo de peixe" no Anexo I — as linhas de DHA/EPA nomeadas são de óleo de alga, atum e lisinato.
- Anexo III (mínimos, > 19 anos): "Lipídeos totais | g | … | 5"; "EPA e DHA | mg | … | 37,5" (a nota i, "no mínimo 30 mg devem ser de DHA", está nas colunas Gestantes e Lactantes, não na de > 19 anos).
- Anexo IV (máximos, > 19 anos): "Lipídeos totais | g | … | NE"; "EPA e DHA | mg | … | 2.000".
- Anexo V: "Fonte de ômega 3" exige EPA e DHA no mínimo do Anexo III; "O EPA e o DHA contribuem para o normal funcionamento do coração" exige ≥ 250 mg (IN 450/2026); "auxiliam na redução dos triglicerídeos" exige ≥ 1.500 mg.
- Anexo VI: nenhuma advertência para óleo de peixe ou EPA/DHA de peixe (só para "DHA e EPA obtido de lisinato de ômega 3").

**Interpretação 1 — por grupo (literal estrita):** o óleo de peixe é constituinte do grupo Lipídeos; o Anexo III fixa 5 g de "Lipídeos totais" como mínimo para > 19 anos; 1 g de óleo = 20 % do mínimo → **abaixo do mínimo**. Para cumprir seriam 5 g de óleo por dia (5 softgels de 1 g, ou porção de 5 g) — com EPA + DHA em 1.544,5 mg (77 % do teto), ainda dentro da faixa.

**Interpretação 2 — por função:** o óleo de peixe é a fonte de EPA e DHA, que têm linha própria nos Anexos III/IV (37,5–2.000 mg) e são atendidos com folga (308,9 mg = 824 % do mínimo, 15,4 % do teto); o mínimo de "Lipídeos totais" se aplica a produtos apresentados como fonte de lipídeos/gorduras. Nesse caso a fórmula do cadastro é conforme.

A auditoria de 15/09 registrou que o painel oficial da ANVISA mostra, para "Óleo de peixe", **as duas informações** — função "Fonte de EPA / Fonte de DHA" e "Lipídeos: mínimo 5 g; máximo não estabelecido" (captura `painel_oleo_peixe.png`). **Não decido entre as duas**: é posição do RT (ou consulta formal à ANVISA). Nenhuma das duas, porém, resolve o produto sem o laudo do óleo.

## 4. Depois — o que se pode propor sem laudo

Nada de composição nova: **não há fonte**. A tabela abaixo repete o cadastro com o veredito por linha, para deixar explícito o que falta.

| constituinte (nome exato do Anexo I) | insumo | massa por porção | teor e fonte | ativo | mín. | máx. (> 19) | % do máx. | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|
| Lipídeos — "Óleo de peixe" | óleo de peixe TG (cadastro) | 1.000 mg | **sem laudo** | 1 g de lipídeos | 5 g (interpretação 1) / não aplicável (interpretação 2) | NE | — | III·Lipídeos totais / IV·Lipídeos totais | nenhum | **mantido — sem procedência** |
| EPA e DHA (componentes do óleo) | EPA 185,34 mg + DHA 123,56 mg (cadastro) | (dentro do óleo) | **sem laudo** | EPA + DHA = **308,90 mg** (calculado) | 37,5 mg | 2.000 mg | 15,4 % | III·EPA e DHA / IV·EPA e DHA | nenhum | **mantido — sem procedência** |
| (componente) outros ômega-3 | 7,6 mg (cadastro) | — | — | — | — | — | — | informativo | — | — |

Laudos de "ômega" encontrados em disco e por que **nenhum serve**: (a) "Nanomega 3" (NaturalPRO, lote NPT.0226/141, validade 02/2028) — nanoemulsão em **pó**, ômega-3 15,3 % p/p, insolúvel em água: incompatível com softgel de óleo; (b) "OMEGA 3 PÓ" (Florien, lote NPT.0222/175) — ômega-3 **vegetal** (ácido alfa-linolênico) em pó, 15,2 %, **vencido** em 28/02/2024; (c) "BIO ATIVOS-OMEGA 3 Po" — digitalização não lida, pelo nome também pó; (d) "DHA Ultra-V 20 %" (SM, lote 26C27-B024-221282, válido até 23/12/2028) — DHA de *Schizochytrium* sp. em pó, fonte de alga, não óleo de peixe.

**O que falta, objetivamente:**

1. **Laudo do óleo de peixe** do lote em uso: forma (TG / éster etílico / rTG), EPA e DHA em mg/g, perfil de ácidos graxos (saturados, trans), colesterol, oxidação (peróxidos, anisidina, TOTOX), metais pesados (Hg, Pb, Cd, As), dioxinas/PCB, fornecedor, validade.
2. **Memorial de cálculo**: massa de óleo por softgel, composição da cápsula (gelatina, glicerina, água, antioxidante), rendimento.
3. **Arte de rótulo** (não existe).
4. **Posição do RT** sobre o mínimo de 5 g de lipídeos totais.

## 5. Tabela nutricional — PROVISÓRIA (não gravar no rótulo)

Montada só para mostrar a estrutura; **toda ela depende do laudo**. Energia: 1 g de óleo × 9 kcal/g = 9 kcal (× 37 kJ/g = 37 kJ; fator kJ PROVISÓRIO); 9 ÷ 2.000 = 0,45 % → 0 %. Gorduras totais 1 g (1 ÷ 65 = 1,5 % → 2 %). Ômega 3 316,5 → 317 mg (VD 4.000 mg do Anexo II: 8 %). Saturadas, trans e colesterol: **PENDENTES** (perfil do laudo).

```
INFORMAÇÃO NUTRICIONAL  (PROVISÓRIA — sem laudo do óleo)
Porções por embalagem: 30
Porção: 1 g (2 softgels)
                                 Quantidade por porção     %VD*
Valor energético                 9 kcal = 37 kJ            0 %
Carboidratos                     0 g                       0 %
  Açúcares totais                0 g                       0 %
  Açúcares adicionados           0 g                       0 %
Proteínas                        0 g                       0 %
Gorduras totais                  1 g                       2 %
  Gorduras saturadas             PENDENTE (laudo)
  Gorduras trans                 PENDENTE (laudo)
  Ômega 3                        317 mg                    8 %
    EPA                          185 mg
    DHA                          124 mg
  Colesterol                     PENDENTE (laudo)
Fibras alimentares               0 g                       0 %
Sódio                            0 mg                      0 %
*Percentual de valores diários fornecidos pela porção
```

## 6. Lista de ingredientes

**Não proposta**: sem documento que informe a composição da cápsula (gelatina? glicerina? antioxidante?) e sem confirmação do óleo, qualquer lista seria inventada. O único dizer que decorre do próprio cadastro é o alergênico: **"ALÉRGICOS: CONTÉM PEIXE"** (RDC 26/2015).

## 7. Advertências obrigatórias propostas (as que não dependem do laudo)

1. "Este produto não é um medicamento." (RDC 243/2018, art. 14, I, c)
2. "Público indicado: adultos (19 anos ou mais)." (art. 14, I, a)
3. "Não exceder a recomendação diária de consumo indicada na embalagem." (art. 14, I, d)
4. "Mantenha fora do alcance de crianças." (art. 14, I, e)
5. "ALÉRGICOS: CONTÉM PEIXE." (RDC 26/2015)
6. Conservação (art. 14, II): "Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Não consumir se o lacre de segurança estiver violado." — o prazo após aberto não foi incluído porque não há documento que o fixe para este produto.

O Anexo VI não exige advertência para óleo de peixe/EPA/DHA. **Hoje o banco tem `warnings` vazio** — as quatro primeiras frases faltam.

## 8. Pendências e decisões do dono / RT

1. **Fábrica/fornecedor:** laudo completo do óleo de peixe do lote em uso (item 1 do §4).
2. **Fábrica:** memorial de cálculo e composição da cápsula.
3. **Dono:** arte de rótulo.
4. **RT:** posição escrita sobre o mínimo de 5 g de lipídeos totais (interpretação 1 × 2). Se for a 1, a porção passaria a 5 g de óleo por dia — decisão do dono.
5. **Cadastro:** as linhas "ômega-3 total" e "outros ácidos graxos" são componentes, não insumos — marcar como tal quando houver memorial.

## 9. Veredito esperado

**NÃO RESOLVIDO** — não existe laudo do óleo de peixe, memorial nem rótulo; a composição do cadastro não tem procedência; e a aplicação do mínimo de 5 g de lipídeos totais ao óleo de peixe depende de posição do RT. Se o laudo confirmar EPA 185,34 mg + DHA 123,56 mg por 2 softgels e o RT adotar a interpretação 2, a fórmula é **CONFORME** (EPA + DHA = 308,9 mg, 15 % do teto, sem advertência do Anexo VI). Se o RT adotar a interpretação 1, a porção precisa ir a 5 g de óleo por dia.

Arquivos gerados: `scratchpad/fase2/omega-pro-tg.json` (com a tabela PROVISÓRIA e a lista dos laudos incompatíveis) e `.sql` — **este SQL não toca na composição**: só grava as frases do art. 14, o alergênico "peixe", a porção e o JSON provisório em `metadata`; `nutritional_info` e `ingredients_list` ficam como estão.
