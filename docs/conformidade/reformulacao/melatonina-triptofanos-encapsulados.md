# Reformulação regulatória — Melatonina + Triptofanos (Encapsulados) (`melatonina-triptofanos-encapsulados`)

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/melatonina-triptofanos-encapsulados.json` e o fragmento SQL `scratchpad/fase2/melatonina-triptofanos-encapsulados.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** Melatonina + Triptofanos (Encapsulados) (nome no rótulo/mercado: Sonus (nome comercial candidato — layout 'sonus' com tabela placeholder; sem arte final, sem memorial)).
- **Slug:** `melatonina-triptofanos-encapsulados`.
- **Formato:** cápsula (sem memorial: tamanho e capacidade não registrados; assumida a cápsula 0 de 500 mg da linha).
- **Porção declarada:** 1 g (2 cápsulas) — 1.000 mg de conteúdo por porção (o cadastro diz 'Porção: 1g (2 Cápsulas)', 60 cápsulas). Sem mudança de porção proposta.
- **Público-alvo / grupo populacional dos Anexos III e IV:** adultos, coluna "> 19 anos" dos Anexos III e IV (a melatonina é 'NA' em todos os outros grupos).
- **Porções por embalagem:** 30.

Não há rótulo nem memorial: a composição de 9 linhas do cadastro (confirmada como deliberada pelo documento PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md de 08/09/2026, segundo a auditoria de ingredientes) foi 'ajustada aos limites' cravando quatro números exatamente nos limites — e é impossível na porção se os minerais forem elementos (126,3%). Os laudos usados aqui são os disponíveis na máquina para os mesmos insumos em outros produtos, não laudos deste produto.

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: cadastro vivo (`formula_compositions`, 9 linhas, lidas em 16/09/2026), com o veredito da auditoria de 15/09/2026 (Parte II, seção II.4).

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | L-triptofano | 572,38 mg | CONFORME (42–860). Sem laudo/lote no cadastro; laudo disponível: 950388 (99,9%, vence 03/10/2026). |
| 2 | Ácido L-aspártico | 150 mg | CONFORME (NE–5.320). Nenhum laudo na máquina. |
| 3 | L-glutamina | 94,77 mg | CONFORME (NE–5.000). Laudo Lepuge AUTO039665 (98,73% b.a.) válido até 08/11/2026. |
| 4 | Fosfatidilserina | 70 mg | NÃO VERIFICADO (Anexo I: 'Fosfatidilserina de lecitina de soja' / 'Lecitina de soja com alto teor de fosfatidilserina' — origem não declarada; nenhum laudo na máquina; massa real do insumo comercial desconhecida). |
| 5 | Magnésio (bisglicinato de magnésio) | 63 mg | leitura A (elemento): CONFORME no mínimo exato, sem margem; leitura B (sal): 19,1 mg, ABAIXO DO MÍNIMO. Laudo do bisglicinato vencido. |
| 6 | Zinco (bisglicinato de zinco) | 29,59 mg | CONFORME — igual ao máximo (teto exato); como sal seriam 147,9 mg. |
| 7 | Dióxido de silício (INS 551) | 20,01 mg | aditivo, quantum satis. |
| 8 | Melatonina | 0,21 mg | CONFORME — igual ao máximo; todos os laudos de melatonina vencidos. |
| 9 | Biotina (D-biotina) | 45 mcg | CONFORME — igual ao máximo. |

Soma como escrita 1.000,005 mg; com os sais que entregam os elementos, 1.262,7 mg (126,3%). Quatro limites cravados, uma origem não declarada (fosfatidilserina) e nenhum laudo de melatonina válido na empresa.

## 3. Depois — composição proposta, insumo a insumo

Grupo "> 19 anos". Magnésio levado a 110% do mínimo; zinco, melatonina e biotina tiradas do teto; triptofano e aspartato reduzidos para caber; fosfatidilserina retirada.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Triptofano | L-Triptofano (CAS 73-22-3) | 500,501 | 99,9% — laudo lote 950388 (val. 03/10/2026 — vence em ~2,5 semanas) | 500,000 mg | 42,00 mg | 860,00 mg | 58,1% | I·L-Triptofano; III·Triptofano 42 mg; IV·860 mg | 950388 (Analitic, fabricante SA20241004046X) · 03/10/2026 · em dia — vence em cerca de 2,5 semanas | dose ajustada |
| 2 | Aspartato | Ácido L-aspártico (CAS 56-84-8) — insumo sem laudo na máquina | 100,000 | 100% — assumido; nenhum laudo de ácido L-aspártico existe nas 308 fontes lidas | 100,000 mg | NE | 5.320,00 mg | 1,9% | I·Ácido L-aspártico; III·Aspartato NE; IV·5.320 mg | sem laudo — insumo a adquirir | dose ajustada — PENDENTE laudo |
| 3 | Glutamina | L-Glutamina (CAS 56-85-9) | 95,382 (a fase 2 propôs 96,473 com o lote AUTO039665) | 99,6% — laudo lote 950334 (INLAB; teor e validade lidos no memorial rev02 do Saúde Intestinal, que pesa esse lote; PDF é digitalização não relida) — **harmonizado na fase 3** (16/09/2026): laudo válido mais recente de L-glutamina; o AUTO039665 (Lepuge, 98,47% t.q.) vence em 08/11/2026 | 95,000 mg | NE | 5.000,00 mg | 1,9% | I·L-Glutamina; III·Glutamina NE; IV·5.000 mg | 950334 (INLAB ref. A100020) · 28/01/2027 · em dia — conferir o PDF do laudo | mantido (dose arredondada) |
| 4 | Magnésio | Bisglicinato de magnésio (CAS 14783-68-7) | 231,635 | 30,22% Mg tal qual — laudo lote 90844, VENCIDO — último teor conhecido | 70,000 mg | 63,00 mg | 350,00 mg | 20,0% | I·Bisglicinato de magnésio; III/IV·Magnésio | 90844 (Analitic, fabricante 66342023062230) · 21/06/2025 · VENCIDO — pedir laudo novo antes de pesar | dose ajustada — PENDENTE laudo |
| 5 | Zinco | Bisglicinato de zinco (CAS 14281-83-5) | 50,277 | 19,89% Zn tal qual — laudo lote 055-ZN/25 | 10,000 mg | 1,65 mg | 29,59 mg | 33,8% | I·Bisglicinato de zinco; III/IV·Zinco | 055-ZN/25 (Galena, CIQ 2505027507) · 06/05/2027 · em dia — resultado 20,00% no limite inferior da especificação 20,00–23,00% | dose ajustada |
| 6 | Melatonina | Melatonina (CAS 73-31-4) | 0,181 | 99,33% tal qual — laudo lote 950151 (99,5% b.s. × (1 − 0,17%)), VENCIDO em 09/12/2024 — último teor conhecido | 0,180 mg | NE | 0,21 mg | 85,7% | I·Melatonina (IN 102/2021); III·NE; IV·0,21 mg | 950151 (Analitic, fabricante MCS211210) — os 5 laudos de melatonina da máquina estão vencidos · 09/12/2024 · VENCIDO | dose ajustada — PENDENTE laudo |
| 7 | Biotina | D-biotina (CAS 58-85-5) | 0,040 | 100,0% — laudo lote 91457 | 40,000 µg | 4,50 µg | 45,00 µg | 88,9% | I·D-biotina; III/IV·Biotina | 91457 (Analitic, fabricante BN25121020; o arquivo está nomeado com o lote 25030042) · 19/12/2028 · em dia | dose ajustada |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Dióxido de silício (antiumectante) (INS 551) — 21,99 mg (a fase 2 tinha 20,89 mg; recalculado na fase 3 após a troca do lote de L-glutamina) — q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). Folga de 2,2%, no limite mínimo de 2%: qualquer aumento de massa (ex.: teor menor do magnésio no laudo novo) exige recompor.
- Cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171) — q.s.p. — assumida a cápsula dos demais produtos (Qualicaps/Genix, 98,45 mg) — não há memorial deste produto

**Soma da porção:** insumos 978,01 mg + excipientes 21,99 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Cabe, com 2,2% de excipiente — folga mínima; ver pendência 8.

**Retirados da fórmula:**

- **Fosfatidilserina 70 mg — retirada.** O Anexo I autoriza 'Fosfatidilserina de lecitina de soja' (CAS 84776-79-4) e 'Lecitina de soja com alto teor de fosfatidilserina'; o cadastro não declara a origem, não há nenhum laudo de fosfatidilserina nas 308 fontes lidas, e os insumos comerciais de fosfatidilserina são padronizados a 20–50% em carreador — a massa real seria 2 a 5 vezes os 70 mg, o que não cabe na porção junto com o magnésio no mínimo. Volta quando houver laudo (registrado como alternativa). Traria ainda a declaração de alergênico soja.

## 4. Mudanças e motivos

- Magnésio: 63 → 70 mg de Mg (231,63 mg de bisglicinato) — motivo: mínimo exato sem folga (Anexo III: 63 mg); e, na leitura como sal, abaixo do mínimo. Laudo novo obrigatório.
- Zinco: 29,59 → 10 mg — motivo: teto exato; e 29,59 mg de Zn exigiriam 148,8 mg de sal.
- Melatonina: 0,21 → 0,18 mg — motivo: teto exato (Anexo IV: 0,21 mg); laudo do lote em uso obrigatório (todos vencidos).
- Biotina: 45 → 40 µg — teto exato.
- L-triptofano: 572,38 → 500 mg — motivo: liberar massa para o magnésio; continua a 58% do teto.
- Ácido L-aspártico: 150 → 100 mg — motivo: liberar massa; sem laudo (a adquirir ou retirar).
- L-glutamina: 94,77 → 95 mg (arredondamento; laudo Lepuge válido).
- Fosfatidilserina: retirada — origem e laudo inexistentes; massa real desconhecida.
- Dióxido de silício: 20,01 → q.s.p. (20,9 mg).

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Coluna "> 19 anos" do Anexo VIII da IN 75/2020. Triptofano, aspartato, glutamina e melatonina sem VDR (células vazias).

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 g (2 cápsulas)

| Item | Quantidade por porção | %VD* (adultos) |
|---|---|---|
| Valor energético | 2,8 kcal = 12 kJ  | 0% |
| Carboidratos | 0 g | 0% |
| Açúcares totais | 0 g | 0% |
| Açúcares adicionados | 0 g | 0% |
| Proteínas | 0,7 g | 1% |
| Gorduras totais | 0 g | 0% |
| Gorduras saturadas | 0 g | 0% |
| Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Biotina | 40 µg | 133% |
| Magnésio | 70 mg | 17% |
| Zinco | 10 mg | 91% |
| Triptofano | 500 mg |  |
| Aspartato | 100 mg |  |
| Glutamina | 95 mg |  |
| Melatonina | 0,18 mg |  |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 695,0 mg → 2,78 kcal; carboidratos 0,0 mg → 0,00 kcal; gorduras 0,0 mg → 0,00 kcal; total 2,78 kcal = 11,81 kJ. Sódio calculado: 0,00 mg. Proteínas: aminoácidos livres (triptofano 500 + aspártico 100 + glutamina 95 = 695 mg) contados pelo fator das proteínas — 2,8 kcal, abaixo de 4 kcal (não significativo). Sem carboidratos, gorduras ou sódio.

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> L-triptofano, bisglicinato de magnésio, ácido L-aspártico, L-glutamina, bisglicinato de zinco, antiumectante dióxido de silício (INS 551), D-biotina, melatonina e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).

Nenhum insumo deriva dos alergênicos da RDC 26/2015 (com a saída da fosfatidilserina de soja). Sem declaração de glúten até laudo do produto acabado.

## 7. Advertências obrigatórias

**Texto proposto para o rótulo e para o campo `warnings` (as frases do art. 14, I, c/d/e da RDC 243/2018 vão em destaque e negrito):**

> Este produto não é um medicamento.
> Não exceder a recomendação diária de consumo indicada na embalagem.
> Mantenha fora do alcance de crianças.
> Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia, preferencialmente à noite.
> Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.

**Base de cada frase:**

- Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.
- "Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico." — IN 28/2018, Anexo VI, linha "Melatonina" (IN 102/2021), texto literal. A primeira oração cobre também a exigência da linha "Aminoácidos" (triptofano, aspartato, glutamina).

**O que falta hoje no cadastro/rótulo:** tudo: os campos `warnings` e `ingredients_list` do banco estão vazios (auditoria de 15/09, 'Ingredientes e advertências faltantes'). A frase específica da melatonina é obrigatória e não existe em nenhum documento do produto.

## 8. Pendências e decisões do dono/RT

1. **Laudo vigente de melatonina** do lote que a fábrica vai pesar — os cinco laudos da máquina venceram (o mais recente em 27/05/2026). Sem ele, o produto não pode ser fabricado: 0,18 mg é 85,7% do teto e qualquer teor acima do calculado aproxima do limite.
2. **Laudo novo de bisglicinato de magnésio** (90844 vencido) ou troca por óxido de magnésio (116,08 mg, a adquirir).
3. **L-triptofano:** laudo 950388 vence em 03/10/2026 — pedir laudo do lote que será usado.
4. **Ácido L-aspártico:** obter laudo (nenhum na máquina) ou retirar — decisão do dono; sem mínimo no Anexo III.
5. **Fosfatidilserina — decisão do dono:** retirada. Para voltar, precisa de insumo 'Fosfatidilserina de lecitina de soja' com laudo de teor e origem, e de espaço na porção (ver alternativa).
6. **Memorial de cálculo inexistente:** o único documento é um dossiê gerado a partir do banco; o RT precisa emitir memorial com lotes antes de produzir. Confirmar cápsula (tamanho/capacidade).
7. **Rótulo (a criar):** designação, tabela nutricional da seção 5, lista de ingredientes, advertência específica da melatonina, 'preferencialmente à noite'.
8. **Folga de excipiente de 2,1%:** se o laudo novo do magnésio vier com teor abaixo de 30,22%, a massa de sal sobe e a fórmula deixa de fechar — recompor (reduzir triptofano ou trocar por óxido).

**Alternativas registradas (não são a proposta principal):**

- **Óxido de magnésio** (116,08 mg para 70 mg de Mg; a adquirir) no lugar do bisglicinato: libera 115 mg, o que permitiria manter o triptofano em 572 mg ou reincluir 50 mg de fosfatidilserina de lecitina de soja quando houver laudo.
- **Retirar o ácido L-aspártico** (sem laudo, sem mínimo): libera 100 mg e uma pendência.
- **Fórmula simples da OP nº 586** (triptofano 800 mg + melatonina 0,21 mg), já produzida para outro cliente — é outro produto, não a fórmula do catálogo; fica só como referência de que a linha tem variantes.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (laudo vigente de melatonina; laudo novo de bisglicinato de magnésio; laudo de ácido L-aspártico ou sua retirada; laudo de L-triptofano do lote a usar; emissão do memorial de cálculo pelo RT)**

Com a composição da seção 3 (7 constituintes), os quatro números cravados em limites (magnésio no mínimo; zinco, melatonina e biotina no máximo) ganham folga (o mais alto é a biotina, 88,9% do teto), a fosfatidilserina sem origem sai, e a porção — que na leitura como elementos ficava em 126,3% — fecha em 1.000 mg com 2,1% de excipiente. O CONFORME pleno depende de quatro laudos (melatonina, magnésio, aspártico, triptofano) e de o RT documentar o produto, que hoje não tem memorial.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção II.4)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md (seção 5)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave melatonina-triptofanos-encapsulados — dossiê técnico gerado, sem laudos)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 19, 40, 41, 60, 161, 163, 205, 206, 207, 210)`
- `/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-GLUTAMINA lote AUTO039665: doseamento 98,73% b.a., perda por secagem 0,26%, val. 08/11/26)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json`
- `cadastro vivo: formulas?slug=eq.melatonina-triptofanos-encapsulados e formula_compositions (9 linhas ativas, lidas em 16/09/2026)`
