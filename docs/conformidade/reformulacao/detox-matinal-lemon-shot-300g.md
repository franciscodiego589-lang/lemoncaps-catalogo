# Memorial de reformulação — Detox Matinal (Lemon Shot) 300 g

**Slug:** `detox-matinal-lemon-shot-300g` · **Data:** 16/09/2026 · **Fase 2 — reformulação regulatória do catálogo Lemon Caps**
**Fontes lidas nesta tarefa:** Anexos I, III, IV, V e VI da IN 28/2018 (transcrições literais em `docs/conformidade/IN28-2018-*.md`, texto consolidado vigente até a IN 450/2026); auditoria de 15/09/2026 (`AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md`, seção 4.7); memorial de cálculo rev02 da fábrica (13/08/2026, `MEMORIAIS_2026 2/11_DETOX/MEMORIAL-CALCULO-DETOX-rev02.docx`, via `memoriais-formulacoes.json`); inventário de laudos (`LAUDOS-INVENTARIO-2026-09-16.md` / `laudos.json`); gabarito da tabela nutricional (`PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md` e `vd.json`); cadastro atual do banco (chave pública, lido em 16/09/2026).

Em cada número deste documento está dito se ele foi **lido** na fonte, **calculado** (com a conta mostrada) ou **assumido**. Nada foi preenchido por plausibilidade.

---

## 1. Identificação

| campo | valor |
|---|---|
| Nome | Detox Matinal (Lemon Shot) — 300 g |
| Formato | pó para diluição (suplemento alimentar em pó / solúvel) |
| Porção | 10 g (1 dose) diluída em 200 mL de água — **mantida** |
| Porções por embalagem | 30 (300 g ÷ 10 g) |
| Público / grupo populacional | adultos, coluna "> 19 anos" dos Anexos III e IV (`target_audience` do banco: "Adultos (19 anos ou mais)") |
| Modo de uso (banco) | "Diluir 10 g (1 dose) em 200 mL de água e consumir 1 vez ao dia" |

## 2. Antes — composição atual e veredito da auditoria

Fonte da composição: **memorial de cálculo rev02 da fábrica (13/08/2026)** — é o que a fábrica pesa hoje. Coincide com a arte do rótulo (`composicoes_rotulo.json`, Detox.pdf) em todos os itens, com uma diferença de 9,49 mg na maltodextrina (rótulo 6.603 mg; memorial 6.593,51 mg, "q.s.p."). O cadastro do banco ainda tem as 5 linhas antigas do "cadastro-teto" (vitamina C 1.600 mg, café verde 400 mg, laranja moro 100 mg, cúrcuma 84,21 mg, zinco 8,3 mg) — a migration 20260920000000, que gravaria o rótulo, **não foi aplicada** (conferido ao vivo em 16/09/2026).

| # | insumo (memorial rev02) | massa | ativo entregue (memorial) | veredito da auditoria de 15/09 |
|---|---|---|---|---|
| 1 | Maltodextrina q.s.p. | 6.593,51 mg | veículo | conforme como ingrediente do Art. 6, § único, da RDC 243/2018; **laudo do lote 210170 vencido em 26/07/2026** |
| 2 | Ácido ascórbico (vitamina C) 99,5 % | 1.608,04 mg | 1.600,00 mg de vitamina C | CONFORME (83,5 % do teto de 1.916,02 mg) |
| 3 | Ácido cítrico anidro (INS 330) | 670 mg | acidulante | CONFORME (quantum satis) |
| 4 | Café verde insolúvel (HERBALTEC, lote 10841, 53,86 %) | 400 mg | 215,44 mg de ácido clorogênico | NÃO VERIFICADO na auditoria (o rótulo não tinha laudo); o memorial traz o teor, mas com quatro problemas no laudo: espécie *Coffea robusta* (rótulo diz *arabica*), irradiação a 10 kGy, microbiologia "ND", fabricante fora da lista do painel |
| 5 | Flavorizante limão (lote 19934) | 330 mg | aroma | CONFORME |
| 6 | Extrato de cúrcuma (NaturalPRO, lote NPT.0425/580, 0,42 %) | 130 mg | 0,55 mg de curcumina | NÃO VERIFICADO na auditoria; pelo memorial, **0,7 % do mínimo de 80 mg** |
| 7 | Extrato de laranja moro (AllPremium, lote 17624, 1,47 %) | 100 mg | 1,47 mg de antocianinas | NÃO VERIFICADO na auditoria; pelo laudo, 29 % do teto de 5 mg |
| 8 | Dióxido de silício (INS 551) | 100 mg | antiumectante | CONFORME |
| 9 | Sucralose (INS 955), lote 91233 | 50 mg | edulcorante | CONFORME (238,1 mg/kg no produto pronto; limite 2.400) |
| 10 | Corante "verde folha" (lote 250301) | 17 mg | corantes | CONFORME quanto ao limite (81 mg/kg somados); **laudo não identifica os corantes nem os INS** |
| 11 | Bisglicinato de zinco 20 % (Galena, lote 055-ZN/25) | 1,45 mg | 0,29 mg de zinco | **ABAIXO DO MÍNIMO** (17,6 % de 1,65 mg) |

Soma do memorial: 10.000,00 mg (fecha). Veredito da auditoria de 15/09: **NÃO CONFORME** (zinco abaixo do mínimo) com três extratos não verificados.

## 3. Depois — composição proposta

Grupo populacional: "> 19 anos". Porção: 10 g. Todos os limites abaixo foram copiados das linhas dos Anexos III (mínimo) e IV (máximo) citadas na coluna "linha do anexo".

| constituinte (nome exato do Anexo I) | forma / insumo comercial | massa do insumo por porção | teor (%) e fonte | ativo por porção | mín. | máx. (> 19 anos) | % do máx. | linha do anexo | laudo (lote · validade · vencido?) | status |
|---|---|---|---|---|---|---|---|---|---|---|
| Vitamina C — "Ácido ascórbico/Ácido L-ascórbico" (CAS 50-81-7) | ácido ascórbico 99 %, Analitic, lote interno 950467 | 1.608,04 mg | 99,5 % — **lido** no laudo do lote 950467 | 1.608,04 × 0,995 = **1.600,00 mg** (calculado) | 13,5 mg | 1.916,02 mg | 83,5 % | III·Vitamina C / IV·Vitamina C | 950467 · 05/03/2029 · não | **mantido** |
| Ácido clorogênico — "Extrato de café verde" (IN 102/2021) | café verde solúvel (extrato solúvel em pó), IDNLABS, lote 10269 | 400 mg | 64,05 % de ácido clorogênico (calc. ácidos cafeoilquínicos) — **lido** no laudo 10269; metilxantinas 1,56 % (informativo) | 400 × 0,6405 = **256,20 mg** (calculado) | NE | 400 mg | 64,0 % | III·Ácido clorogênico (NE) / IV·Ácido clorogênico (400) | 10269 · 08/2027 · não | **mantido; laudo regularizado** (ver §4) |
| Antocianinas da laranja moro — "Extrato de laranja moro (Citrus sinensis (L.) Osbeck)" (IN 336/2024) | extrato de laranja Moro, AllPremium, lote interno 17624 (original 1289) | 100 mg | 1,47 % (cianidina-3-glucosídeos) — **lido** no laudo 17624 | 100 × 0,0147 = **1,47 mg** (calculado) | NE | 5 mg | 29,4 % | III·Antocianinas da laranja moro / IV·Antocianinas da laranja moro | 17624 · 09/04/2027 · não | **mantido** |
| Curcumina — "Extrato de rizomas de cúrcuma (Curcuma longa L.)" | extrato NaturalPRO, lote NPT.0425/580 | (era 130 mg) | 0,42 % de curcumina — **lido** no memorial rev02 (o PDF do laudo é digitalização não lida no inventário) | 130 × 0,0042 = 0,55 mg | 80 mg (curcuminoides totais) | 130 mg | 0,4 % | III·Curcumina^xv / IV·Curcumina^x (IN 438/2026) | NPT.0425/580 · validade não confirmada em disco | **retirado** |
| Zinco — "Bisglicinato de zinco" (CAS 14281-83-5) | zinco quelato 20 % (bisglicinato), Galena, lote 055-ZN/25 | **11,06 mg** | 20,00 % base seca (**lido**) × (1 − 0,0054 de umidade) = 19,89 % tal qual (conta do memorial, reconferida) | 11,06 × 0,1989 = **2,20 mg de zinco** (calculado) | 1,65 mg | 29,59 mg | 7,4 % | III·Zinco / IV·Zinco | 055-ZN/25 · 06/05/2027 · não | **dose ajustada** (era 0,29 mg) |

Ingredientes não constituintes (Art. 6, § único, da RDC 243/2018 e IN 211/2023, categoria 14.2):

| ingrediente | massa por porção | papel | observação |
|---|---|---|---|
| Maltodextrina | **6.713,90 mg** (q.s.p. — calculado: 10.000 − 3.286,10) | veículo | laudo do lote 210170 vencido em 26/07/2026 — pedir novo; não recebe alegação de fonte de carboidrato |
| Ácido cítrico (INS 330) | 670 mg | acidulante | quantum satis; lote GE2844AFG (100,10 %, memorial) |
| Aromatizante idêntico ao natural de limão | 330 mg | aroma | quantum satis; lote 19934 (validade 12/01/2027 segundo o memorial) |
| Dióxido de silício (INS 551) | 100 mg | antiumectante | quantum satis |
| Sucralose (INS 955) | 50 mg | edulcorante | 50 mg ÷ 0,210 kg = 238,1 mg/kg (limite 2.400 mg/kg) |
| Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133) | 17 mg | corantes | 81,0 mg/kg somados (limite 300 mg/kg cada); identificação pendente (§8) |

**Soma da porção:** constituintes 1.608,04 + 400 + 100 + 11,06 = 2.119,10 mg; aditivos 670 + 330 + 100 + 50 + 17 = 1.167,00 mg; subtotal 3.286,10 mg; maltodextrina q.s.p. 6.713,90 mg; **total 10.000,00 mg de 10.000 mg (100,0 %) — cabe.** (Antes, o rótulo somava 10.001,45 mg.)

## 4. Mudanças e motivos

1. **Zinco: 0,29 → 2,2 mg de zinco (1,45 → 11,06 mg de bisglicinato).** Motivo: Anexo III, linha "Zinco", mínimo 1,65 mg para > 19 anos; 0,29 mg é 17,6 % do mínimo. Alvo escolhido em 2,2 mg = 133 % do mínimo, 7,4 % do teto (Anexo IV, 29,59 mg) e 20 % do VD (11 mg) — folga real para variação de pesagem e de teor do lote (o laudo 055-ZN/25 está no limite inferior da própria especificação, 20,00–23,00 %). Conta: 2,2 ÷ 0,1989 = 11,06 mg.
2. **Cúrcuma: retirada.** Motivo: Anexo III, linha "Curcumina", mínimo 80 mg de curcuminoides totais (IN 438/2026); o lote em uso entrega 0,55 mg (0,7 % do mínimo); para chegar a 80 mg seriam 19.048 mg de extrato, impossível em 10 g. Regra do princípio 7 (extrato sem laudo que demonstre o marcador na faixa): sai e **volta quando houver extrato de rizoma padronizado com laudo de curcuminoides totais**. Dose que seria conforme: 100 mg de curcuminoides (77 % do teto de 130 mg) = 105,3 mg de um extrato a 95 % — e, nesse caso, entra a advertência específica da IN 438/2026 (§7) e a proibição de associar com tetraidrocurcuminoides (nota xv do Anexo I). Existe em disco um laudo de "Curcuma Longa 95 %" (Pharma Nostra, lote CP260100042, 95,15 % de curcuminoides totais, validade 06/01/2031) que o parecer interno de 28/08/2026 rejeitou por especificação (CAS de curcumina isolada, parte declarada "raiz" e método in-house) — só o RT pode rever.
3. **Café verde: massa mantida (400 mg), laudo trocado.** Motivo: a dose tem de ser demonstrada pelo marcador (Anexo IV, "Ácido clorogênico", máximo 400 mg; Anexo III: mínimo NE). O laudo do lote em uso (HERBALTEC 10841) está em digitalização não lida no inventário, sem validade confirmada, com espécie *Coffea robusta* (o rótulo imprime *arabica*), irradiação a 10 kGy e microbiologia "ND". O único laudo de café verde **válido e legível** em disco é o do café verde solúvel IDNLABS, lote 10269 (64,05 % de ácido clorogênico; metilxantinas 1,56 %; validade 08/2027). A conta desta proposta usa esse laudo: 256,20 mg de ácido clorogênico (64 % do teto). Se a fábrica mantiver o 10841, a conta com o teor lido no memorial (53,86 %) dá 215,44 mg (54 % do teto) — também dentro da faixa — mas o laudo precisa ser completado (validade, cafeína, microbiologia) e o rótulo precisa declarar a espécie do laudo. Observação sobre cafeína: com metilxantinas de 1,56 %, o extrato traz no máximo 6,24 mg de cafeína por porção (calculado: 400 × 0,0156); o produto **não é fonte de cafeína** (mínimo 75 mg) e fica muito abaixo do teto de 200 mg. O memorial cita um "mínimo de 50 mg" de ácido clorogênico lido no painel; o Anexo III literal diz **NE** — prevalece o texto da norma.
4. **Laranja moro: mantida (100 mg → 1,47 mg de antocianinas).** Forma "Extrato de laranja moro (Citrus sinensis (L.) Osbeck)" autorizada (Anexo I, redação IN 336/2024); antocianinas 29 % do teto de 5 mg; laudo válido. O memorial aponta que o painel da ANVISA exige a especificação do fabricante BIONAP SRL; **essa condição não consta do Anexo I literal nem das notas i–xv** — registrada como pendência para o RT, não como não conformidade.
5. **Vitamina C: mantida (1.600 mg = 83,5 % do teto).** Dentro da faixa, forma autorizada, laudo válido.
6. **Maltodextrina recalculada** para fechar 10.000 mg (6.713,90 mg) e laudo a renovar (vencido).
7. **Aditivos mantidos** nas massas do memorial; corante com identificação pendente.

## 5. Tabela nutricional (padrão RDC 429/2020 + IN 75/2020)

Contas de energia (fatores de Atwater; kJ com 17 kJ/g para carboidrato e 13 kJ/g para ácido orgânico — os fatores em kJ do Anexo XXII da IN 75/2020 **não foram relidos em disco: PROVISÓRIOS**): maltodextrina 6,7139 g × 4 kcal/g = 26,86 kcal (× 17 = 114,14 kJ); ácido cítrico 0,670 g × 3 kcal/g = 2,01 kcal (× 13 = 8,71 kJ); vitamina C, extratos, aroma e sucralose não contabilizados (o aroma e os extratos não têm composição centesimal em disco). Total 28,87 kcal → **29 kcal**; 122,85 kJ → **123 kJ**. Carboidratos = 6,7139 g (maltodextrina) → **6,7 g**. Açúcares totais: a maltodextrina pode conter mono e dissacarídeos em teor que só o laudo informa — declarado **0 g (PROVISÓRIO)**. Proteínas, gorduras, fibras e sódio: nenhuma fonte na fórmula → quantidade não significativa (Anexo IV da IN 75/2020) → **%VD = 0**. Arredondamento pelo Anexo III da IN 75/2020 (paráfrase do gabarito): ≥ 10 inteiro; entre 1 e 10 uma casa; < 1 g uma casa; < 1 mg/µg duas casas. %VD: Anexo VIII da IN 75/2020, coluna adultos (macronutrientes: Anexo II, 2.000 kcal). Constituinte sem VDR: célula em branco (RDC 429/2020, art. 12, § 1º).

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)
                                 Quantidade por porção     %VD*
Valor energético                 29 kcal = 123 kJ          1 %
Carboidratos                     6,7 g                     2 %
  Açúcares totais                0 g                       0 %
  Açúcares adicionados           0 g                       0 %
Proteínas                        0 g                       0 %
Gorduras totais                  0 g                       0 %
  Gorduras saturadas             0 g                       0 %
  Gorduras trans                 0 g                       0 %
Fibras alimentares               0 g                       0 %
Sódio                            0 mg                      0 %
Vitamina C                       1.600 mg                  1600 %
Zinco                            2,2 mg                    20 %
Ácido clorogênico                256 mg
Antocianinas da laranja moro     1,5 mg
*Percentual de valores diários fornecidos pela porção
```

Contas dos %VD: 29 ÷ 2.000 = 1,4 % → 1 %; 6,7139 ÷ 300 = 2,2 % → 2 %; 1.600 ÷ 100 = 1.600 %; 2,20 ÷ 11 = 20,0 % → 20 %. Antocianinas: 1,47 mg → 1,5 mg (uma casa, faixa 1–10). Ácido clorogênico: 256,20 → 256 mg.

## 6. Lista de ingredientes proposta (ordem decrescente de massa)

Maltodextrina, ácido ascórbico (vitamina C), acidulante ácido cítrico (INS 330), extrato de café verde (*Coffea canephora* — a espécie impressa tem de ser a do laudo do lote; conferir antes de imprimir), aromatizante idêntico ao natural de limão, extrato de laranja moro (*Citrus sinensis* (L.) Osbeck), antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), corantes tartrazina (INS 102) e azul brilhante FCF (INS 133), bisglicinato de zinco.

Alergênicos (RDC 26/2015): nenhum dos insumos deriva dos alergênicos listados; a composição do aromatizante não está em disco — confirmar com o fornecedor antes de afirmar ausência. "Não contém glúten": só se a origem da maltodextrina for comprovada por laudo — não declarar até lá.

## 7. Advertências obrigatórias propostas

Texto literal, na ordem em que o banco já grava o campo `warnings`:

1. "Este produto não é um medicamento." — RDC 243/2018, art. 14, I, c.
2. "Público indicado: adultos (19 anos ou mais)." — art. 14, I, a (grupo populacional).
3. "Não exceder a recomendação diária de consumo indicada na embalagem." — art. 14, I, d.
4. "Mantenha fora do alcance de crianças." — art. 14, I, e.
5. "Este produto não deve ser consumido por gestantes, lactantes e crianças." — Anexo VI da IN 28/2018: linha "Ácido clorogênico" (primeira linha da tabela, junto de cafeína, carnitina etc.) e linha "Antocianinas" (IN 336/2024).
6. "Contém TARTRAZINA (INS 102)." — condicionada à confirmação do corante (§8); a base normativa citada pelo memorial (RDC 340/2002) não foi relida nesta tarefa — PROVISÓRIO.
7. Conservação (art. 14, II): "Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado."

O que falta hoje no banco: só a linha da tartrazina (as demais já estão). A advertência específica da cúrcuma (IN 438/2026) deixa de ser exigida porque a cúrcuma sai; se voltar, entra: "Este produto não deve ser consumido por gestantes, lactantes, crianças, pessoas com doenças hepáticas, biliares ou com úlceras gástricas. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico."

## 8. Pendências e decisões do dono / RT

1. **Café verde — qual lote?** Decidir entre trocar para o café verde solúvel IDNLABS 10269 (laudo válido, legível, com ácido clorogênico e metilxantinas) ou manter o HERBALTEC 10841 e obter laudo completo (validade, cafeína, microbiologia). Em qualquer caso, corrigir a espécie no rótulo para a do laudo.
2. **RT — "especificação do fabricante" do painel** (café verde: Sorocaps/AQIA/Naturex; laranja moro: BIONAP): o Anexo I literal não condiciona essas formas a fabricante. Posição escrita do RT sobre a exigibilidade.
3. **Maltodextrina:** laudo novo (o do lote 210170 venceu em 26/07/2026), com teor de açúcares para fechar a linha "açúcares totais".
4. **Corante:** identificar os corantes e os INS (o certificado 250301 não os traz) e confirmar a frase da tartrazina.
5. **Rótulo/texto de apresentação:** remover "resveratrol" (nunca esteve na fórmula) e a cúrcuma como protagonista.
6. **Cúrcuma:** só volta com extrato de rizoma padronizado e laudo de curcuminoides totais; o RT decide se o lote Pharma Nostra (95,15 %) atende à especificação.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A** (i) laudo válido do lote de café verde efetivamente usado, (ii) laudo novo da maltodextrina, (iii) identificação do corante e (iv) posição do RT sobre a exigência de fabricante do painel para café verde e laranja moro. Com esses quatro pontos fechados, todos os constituintes ficam em forma do Anexo I, dentro de [mínimo, máximo] com folga (o maior uso do teto é a vitamina C, 83,5 %), a porção fecha em 10.000 mg e as advertências do Anexo VI estão no texto.

Arquivos gerados: `scratchpad/fase2/detox-matinal-lemon-shot-300g.json` e `.sql` (mesmos números; SQL conferido com o parser do PostgreSQL — pglast — sem execução).
