# Memorial de reformulação — Saúde Intestinal (Floravex)

**Slug:** `saude-intestinal` · **Data:** 16/09/2026 · **Fase 2 — reformulação regulatória do catálogo Lemon Caps**
**Fontes lidas:** Anexos I, III, IV, V e VI da IN 28/2018 (transcrições literais em disco, consolidação vigente até a IN 450/2026); auditoria de 15/09/2026 (seção 4.8); memorial de cálculo rev02 da fábrica (13/08/2026, `MEMORIAIS_2026 2/12_FLORAVEX/MEMORIAL-CALCULO-FLORAVEX-rev02.docx`, via `memoriais-formulacoes.json`); inventário de laudos de 16/09/2026; gabarito da tabela nutricional; cadastro do banco lido ao vivo em 16/09/2026.

Em cada número está dito se foi **lido**, **calculado** (com a conta) ou **assumido**.

---

## 1. Identificação

| campo | valor |
|---|---|
| Nome | Saúde Intestinal (nome de fábrica: Floravex) |
| Formato | suplemento alimentar em cápsula — cápsula gelatinosa dura tamanho 0 (vazia 98,45 mg; memorial rev02) |
| Porção | 1 g (2 cápsulas) — **mantida** |
| Porções por embalagem | 30 (60 cápsulas) |
| Grupo populacional | adultos, coluna "> 19 anos" |
| Modo de uso (banco) | "Ingerir 2 cápsulas ao dia" |

## 2. Antes — composição atual e veredito da auditoria

Fonte: **memorial rev02 (13/08/2026)**, que é o que a fábrica pesa e coincide, item a item, com a arte do rótulo (Floravex-intestino.pdf). O cadastro do banco ainda tem as 7 linhas do cadastro-teto (magnésio 350 mg, quercetina 280 mg, B6 98,6 mg, zinco 29,59 mg etc.) — a migration 20260920000000 não foi aplicada (conferido ao vivo).

| # | insumo (memorial rev02) | massa | ativo (memorial) | veredito da auditoria de 15/09 |
|---|---|---|---|---|
| 1 | Psyllium pó (tegumento), lote AUTO9JPE | 342 mg | 342 mg (1:1) | **ABAIXO DO MÍNIMO** de fibras (5,7 g): psyllium + inulina + FOS = 567 mg (9,9 %) |
| 2 | Bisglicinato de magnésio 30 %, lote 90844 | 297,81 mg | 90,00 mg de Mg | CONFORME (63–350 mg); **laudo vencido em 21/06/2025** |
| 3 | Inulina (raiz de chicória), lote 206486 | 135 mg | 122,85 mg | ABAIXO DO MÍNIMO (fibras) |
| 4 | L-glutamina, lote 950334 | 135,54 mg | 135,00 mg | CONFORME (2,7 % do teto de 5.000 mg) |
| 5 | Extrato de cúrcuma, lote NPT.0425/580 (0,42 %) | 117 mg | 0,49 mg de curcumina | NÃO VERIFICADO na auditoria; pelo memorial, **0,6 % do mínimo de 80 mg** |
| 6 | FOS, lote 212448 | 90 mg | 86,67 mg | ABAIXO DO MÍNIMO (fibras) |
| 7 | Quercetina di-hidratada, lote 873635 | 72 mg | 69,16 mg | CONFORME (24,7 % do teto de 280 mg); **laudo vencido em 06/2026** |
| 8 | Bisglicinato de zinco 20 %, lote 055-ZN/25 | 67,87 mg | 13,50 mg de Zn | CONFORME (45,6 % do teto) |
| 9 | Acetato de retinol, lote 215230 (568.116 UI/g) | 3,17 mg | 540 µg RAE | CONFORME (20,6 % do teto) |
| 10 | Cloridrato de piridoxina, lote 91188 | 1,53 mg | 1,26 mg de B6 | CONFORME (1,3 % do teto) |
| — | Dióxido de silício (INS 551) | 0 mg | — | listado nos ingredientes, sem massa: **não havia espaço** |

Soma do memorial: **1.261,92 mg em 1.000 mg (126,2 %)** — a fórmula não cabe em duas cápsulas. Veredito da auditoria: **NÃO CONFORME** (fibras abaixo do mínimo) e cúrcuma não verificada.

## 3. Depois — composição proposta

| constituinte (nome exato do Anexo I) | forma / insumo comercial | massa por porção | teor e fonte | ativo por porção | mín. | máx. (> 19) | % do máx. | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|
| Glutamina — "L-Glutamina" (CAS 56-85-9) | L-glutamina INLAB ref. A100020, lote 950334 | 135,54 mg | 99,6 % — **lido** no laudo citado no memorial rev02 | 135,54 × 0,996 = **135,00 mg** | NE | 5.000 mg | 2,7 % | III·Glutamina / IV·Glutamina | 950334 · 28/01/2027 (memorial) · não | **mantido** |
| Magnésio — "Bisglicinato de magnésio" (CAS 14783-68-7) | magnésio glicinato 30 %, Analitic, lote 90844 | 297,81 mg | 30,38 % b.s. (**lido**) × (1 − 0,0053) = 30,22 % t.q. (calculado) | 297,81 × 0,3022 = **90,00 mg de Mg** | 63 mg | 350 mg | 25,7 % | III·Magnésio / IV·Magnésio | 90844 · 21/06/2025 · **sim (vencido)** | **mantido; laudo a renovar** |
| Quercetina — "Quercetina" (IN 418/2025) | quercetina di-hidratada INLAB, lote 873635 | 72 mg | 96,05 % — **lido** no laudo citado no memorial | 72 × 0,9605 = **69,16 mg** | NE | 280 mg | 24,7 % | III·Quercetina / IV·Quercetina | 873635 · 06/2026 · **sim (vencido)** | **mantido; laudo a renovar** |
| Zinco — "Bisglicinato de zinco" (CAS 14281-83-5) | zinco quelato 20 %, Galena, lote 055-ZN/25 | 67,87 mg | 20,00 % b.s. × (1 − 0,0054) = 19,89 % t.q. | 67,87 × 0,1989 = **13,50 mg de Zn** | 1,65 mg | 29,59 mg | 45,6 % | III·Zinco / IV·Zinco | 055-ZN/25 · 06/05/2027 · não | **mantido** |
| Vitamina A — "Acetato de retinol/Acetato de retinila" (CAS 127-47-9) | vitamina A acetato pó, lote 215230 | 3,17 mg | 568.116 UI/g — **lido** no memorial (o PDF do laudo é digitalização não lida) | 3,17 mg × 568.116 UI/g = 1.800,9 UI × 0,3 µg RAE/UI = **540,3 µg RAE** | 135 µg | 2.623,61 µg | 20,6 % | III·Vitamina A^ii / IV·Vitamina A^i | 215230 · validade não confirmada · ? | **mantido** |
| Vitamina B6 — "Cloridrato de piridoxina" (CAS 58-56-0) | piridoxina HCl, Analitic, lote 91188 | 1,53 mg | 99,9 % (**lido**) × 82,27 % (169,18/205,64, estequiométrico) | 1,53 × 0,999 × 0,8227 = **1,26 mg de B6** | 0,26 mg | 98,60 mg | 1,3 % | III·Vitamina B_6 / IV·Vitamina B_6 | 91188 · 28/12/2027 · não | **mantido** |
| Fibras alimentares — "Psyllium (Plantago ovatae)" | psyllium pó, lote AUTO9JPE | (era 342 mg) | sem % de fibra no laudo | ≤ 342 mg | 5,7 g | NE | — | III·Fibras alimentares | scan não lido | **retirado** |
| Fibras alimentares — "Inulina" (CAS 9005-80-5) | inulina, lote 206486 | (era 135 mg) | 91,0 % | 122,85 mg | 5,7 g | NE | — | III·Fibras alimentares | scan | **retirado** |
| Fibras alimentares — "Frutooligossacarídeos (FOS)" | FOS Fagron, lote 212448 | (era 90 mg) | 96,3 % | 86,67 mg | 5,7 g | NE | — | III·Fibras alimentares | 04/09/2028 (memorial) | **retirado** |
| Curcumina — "Extrato de rizomas de cúrcuma (Curcuma longa L.)" | extrato NaturalPRO, lote NPT.0425/580 | (era 117 mg) | 0,42 % | 0,49 mg | 80 mg | 130 mg | 0,4 % | III·Curcumina^xv / IV·Curcumina^x | validade não confirmada | **retirado** |

Ingredientes não constituintes:

| ingrediente | massa | papel | observação |
|---|---|---|---|
| Maltodextrina (q.s.p.) | **417,08 mg** (calculado: 1.000 − 582,92) | excipiente | **proposta** para completar as duas cápsulas tamanho 0; a fábrica pode preferir cápsula menor sem excipiente (decisão do dono) |
| Dióxido de silício (INS 551) | 5 mg | antiumectante | quantum satis; agora há espaço (o memorial tinha 0 mg) |
| Cápsula: gelatina, água purificada, dióxido de titânio (INS 171) | fora da porção | envoltório | como no rótulo atual |

**Soma da porção:** 135,54 + 297,81 + 72 + 67,87 + 3,17 + 1,53 + 5 = 582,92 mg; maltodextrina 417,08 mg; **total 1.000,00 mg (100,0 %) — cabe** (antes: 1.261,92 mg, 126,2 %).

## 4. Mudanças e motivos

1. **Psyllium, inulina e FOS retirados.** Anexo III, linha "Fibras alimentares", mínimo 5,7 g para > 19 anos; as três fontes somam 567 mg (9,9 % do mínimo) e em cápsula nunca alcançam 5,7 g — princípio 6 da reformulação (o dono já tirou o psyllium de outro produto por isso). Sem as fibras, o rodapé da tabela ("não contém quantidades significativas de fibras") e o texto de apresentação ("fórmula completa que combina fibras alimentares") deixam de se contradizer — o texto de apresentação tem de ser reescrito. Alternativa, registrada e não principal: versão em pó/sachê com psyllium + inulina + FOS ≥ 5,7 g por porção.
2. **Cúrcuma retirada.** Anexo III/IV "Curcumina": 80–130 mg de curcuminoides totais (IN 438/2026); o lote entrega 0,49 mg. Volta com extrato de rizoma padronizado e laudo (dose conforme: 100 mg de curcuminoides = 105,3 mg de extrato a 95 %, 77 % do teto), com a advertência específica da IN 438/2026.
3. **Magnésio mantido (90 mg).** Dentro da faixa com folga (143 % do mínimo; 25,7 % do teto). Com 684 mg liberados pelas retiradas, os 297,81 mg do bisglicinato cabem — não é preciso trocar por óxido de magnésio nem passar a 3 cápsulas (as duas saídas que o próprio memorial sugeria). O laudo do lote está **vencido**: laudo novo antes de fabricar.
4. **Quercetina mantida (69,16 mg).** Laudo **vencido**: laudo novo. A linha "Quercetina" do Anexo I não traz CAS nem forma; a dúvida anidra × di-hidratada é do painel — o RT decide.
5. **Zinco, vitamina A e B6 mantidos** (todos dentro da faixa, longe do teto).
6. **Dióxido de silício com massa (5 mg)** e **maltodextrina q.s.p.** para fechar 1.000 mg — decisão de excipiente é da fábrica.

## 5. Tabela nutricional (padrão RDC 429/2020 + IN 75/2020)

Energia (Atwater; kJ com 17 kJ/g — fatores kJ do Anexo XXII **não relidos em disco, PROVISÓRIOS**): L-glutamina 0,13554 g × 4 = 0,54 kcal; maltodextrina 0,41708 g × 4 = 1,67 kcal; total 2,21 kcal (≤ 4 kcal: quantidade não significativa, Anexo IV → %VD 0) → **2,2 kcal**; kJ: (0,13554 + 0,41708) × 17 = 9,39 → **9,4 kJ**. Carboidratos 0,417 g → **0,4 g** (≤ 0,5 g → %VD 0). Proteínas: a L-glutamina é aminoácido livre e vai em linha própria; não foi computada como proteína (PROVISÓRIO — o RT confirma o enquadramento). Zinco: 13,50 mg arredonda para **14 mg** pela regra "≥ 10 → inteiro"; o %VD foi calculado sobre 13,50 mg (13,50 ÷ 11 = 122,7 % → 123 %); se a norma mandar calcular sobre o valor arredondado, seria 127 %. Vitamina A 540,3 → 540 µg RAE (540 ÷ 800 = 67,5 % → 68 %). B6 1,26 → 1,3 mg (1,26 ÷ 1,3 = 96,9 % → 97 %). Magnésio 90 ÷ 420 = 21,4 % → 21 %.

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
                                 Quantidade por porção     %VD*
Valor energético                 2,2 kcal = 9,4 kJ         0 %
Carboidratos                     0,4 g                     0 %
  Açúcares totais                0 g                       0 %
  Açúcares adicionados           0 g                       0 %
Proteínas                        0 g                       0 %
Gorduras totais                  0 g                       0 %
  Gorduras saturadas             0 g                       0 %
  Gorduras trans                 0 g                       0 %
Fibras alimentares               0 g                       0 %
Sódio                            0 mg                      0 %
Vitamina A                       540 µg RAE                68 %
Vitamina B6                      1,3 mg                    97 %
Magnésio                         90 mg                     21 %
Zinco                            14 mg                     123 %
L-glutamina                      135 mg
Quercetina                       69 mg
*Percentual de valores diários fornecidos pela porção
```

## 6. Lista de ingredientes proposta (ordem decrescente de massa)

Maltodextrina, bisglicinato de magnésio, L-glutamina, quercetina, bisglicinato de zinco, antiumectante dióxido de silício (INS 551), acetato de retinila, cloridrato de piridoxina; cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).

Alergênicos (RDC 26/2015): nenhum. Glúten: não declarar "não contém" sem laudo da maltodextrina. A cápsula de gelatina impede alegação vegana.

## 7. Advertências obrigatórias propostas

1. "Este produto não é um medicamento." (RDC 243/2018, art. 14, I, c)
2. "Público indicado: adultos (19 anos ou mais)." (art. 14, I, a)
3. "Não exceder a recomendação diária de consumo indicada na embalagem." (art. 14, I, d)
4. "Mantenha fora do alcance de crianças." (art. 14, I, e)
5. "Este produto não deve ser consumido por gestantes, lactantes e crianças." — Anexo VI da IN 28/2018: linha "Aminoácidos" (a L-glutamina está no grupo Aminoácidos do Anexo I) e linha "Quercetina" (IN 418/2025).
6. Conservação (art. 14, II): texto já gravado no banco.

Hoje o banco já tem todas essas frases. A advertência específica da cúrcuma (IN 438/2026), que faltava, deixa de ser exigida com a retirada.

## 8. Pendências e decisões do dono / RT

1. **Laudo novo do bisglicinato de magnésio** (lote 90844 vencido em 21/06/2025).
2. **Laudo novo da quercetina** (lote 873635 vencido em 06/2026) e posição do RT sobre a forma di-hidratada.
3. **Validade do laudo da vitamina A** (lote 215230): o PDF em disco é digitalização não lida; o único laudo legível de acetato de retinol (lote 90494) venceu em 21/10/2024.
4. **Fábrica:** excipiente q.s.p. (maltodextrina 417,08 mg) ou cápsula menor; refazer o memorial com a porção fechando em 1.000 mg.
5. **Dono:** aceitar a saída das fibras e da cúrcuma do produto em cápsula; se quiser fibras, versão em pó/sachê.
6. **Rótulo:** reescrever o texto de apresentação (sem "fibras alimentares" e sem cúrcuma).

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A** laudos novos de bisglicinato de magnésio e de quercetina, validade do laudo da vitamina A e definição do excipiente/cápsula pela fábrica. Com isso, os seis constituintes restantes estão em forma do Anexo I, dentro de [mínimo, máximo] com folga (maior uso do teto: zinco, 45,6 %), a porção fecha em 1.000 mg e as advertências do Anexo VI estão no texto.

Arquivos gerados: `scratchpad/fase2/saude-intestinal.json` e `.sql` (SQL conferido com pglast, sem execução).
