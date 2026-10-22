# Memorial de reformulação — Melatonina em Gummy Sabor Uva ("Dream Gummy")

**Data:** 16/09/2026. **Slug:** `melatonina-em-gummy-sabor-uva` (slug real do banco ao vivo, com dois "m"; o `seed_catalogo.sql` grafa "gumy" — anotado na fase 1, não corrigido aqui). **Para:** dono e RT (Anderson C. Barbosa, CRF/MT 5526).

**Fontes lidas:** memorial MEM-CALC-DREAMGUMMY-rev02 (13/08/2026), extraído do `.docx` original em 16/09/2026; laudos do L-triptofano lote 950388 (validade 03/10/2026) e da melatonina lote 950151 (**vencido** em 09/12/2024); análise de produto acabado MGW RG 005706/03/2026 (lote G20/1550; microbiologia e glúten < 10 ppm; sem doseamento de melatonina ou triptofano); rótulo em `composicoes_rotulo.json`, chave `dreamgummy` (DreamGummy.pdf); cadastro ao vivo em 16/09/2026 (2 linhas: L-triptofano 800 mg, melatonina 0,21 mg; `ingredients_list`, `warnings`, `target_audience` e `storage_instructions` **vazios**); auditoria de 15/09/2026 (seção 4.4, 100 % conforme, melatonina "igual ao máximo"); `INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md`, seção 4 (os dois grupos de documentos que se contradizem); `laudos.json` (todas as cinco fontes de melatonina em disco estão vencidas); IN 28/2018 Anexos I, III, IV, VI literais; IN 75/2020 e RDC 429/2020 (AnvisaLegis, 16/09/2026).

## 1. Identificação

| campo | atual | proposta |
|---|---|---|
| Nome | Melatonina em Gummy Sabor Uva (no memorial e na arte: "Dream Gummy") | mantido; designação "Suplemento Alimentar em goma" |
| Formato | goma mastigável | mantido |
| Porção | 6 g (2 gomas de 3,00 g) | mantida — com a ressalva de que a ficha da versão só-melatonina ("Suelen", 28/08/2026) traz 7,0 g (2 gomas) e 210 g |
| Porções por embalagem | 30 (60 gomas, 180 g) | mantido |
| Grupo populacional | adultos, "> 19 anos" (`target_audience` vazio no banco; a melatonina é "NA" em todos os outros grupos) | "Adultos (19 anos ou mais)" — preencher |

## 2. Antes — e a dúvida que a fábrica precisa resolver

Existem **dois produtos** nos documentos da fábrica sob este mesmo nome: **versão A, "Dream Gummy"** — L-triptofano 800 mg + melatonina 0,21 mg (ficha FT-DREAM-GUMMY de 27/07/2026, memorial rev02 de 13/08/2026 e a arte-final DreamGummy.pdf, a mais recente lida) — que é o que o banco cadastra; **versão B, "Melatonina em Gummy"** — só melatonina 0,21 mg (Relatório de Rótulos de 14/05/2026 e ficha técnica "Suelen" de 28/08/2026, porção 7,0 g). As duas propostas comerciais de 19/02/2026 mostram que são produtos distintos desde a origem, não uma revisão da outra. **Este memorial reformula a versão A (é a do cadastro e da arte) e registra a B como alternativa.** A decisão é do dono.

Fonte da composição: **rótulo** (= cadastro, 2 de 2) e **memorial** (massas pesadas).

| insumo | rótulo | memorial (massa pesada) | ativo | mín | máx | auditoria 15/09 |
|---|---|---|---|---|---|---|
| L-triptofano | 800 mg | 800,800 mg × 99,9 % | 800 mg | 42 mg | 860 mg | conforme (93 % do teto) |
| Melatonina | 0,21 mg | 0,211 mg × 99,33 % | 0,21 mg | NE | 0,21 mg | conforme — **igual ao máximo** |
| matriz de goma (q.s.p.) | — | 5.198,99 mg, sem massas individuais | | | | |

O memorial (Tabelas 14 e 15) recomenda 0,19 mg de melatonina (margem de 10 %) e 750 mg de triptofano. Os excipientes são os mesmos do Bella Gummy (sorbitol líquido, maltitol, gelatina, água, glicerina, maltodextrina, pectina, goma acácia, ácido cítrico, aroma de uva, citrato de sódio, sorbato de potássio PA, sucralose, corantes vermelho 40 e azul brilhante FCF) — sem massas.

## 3. Depois (versão A)

| # | constituinte (Anexo I) | insumo | massa por porção | teor e fonte | ativo (conta) | mín | máx | % do máx | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Triptofano — "L-Triptofano" (CAS 73-22-3) | L-triptofano | **750,75 mg** (era 800,80) | 99,9 % — laudo | 750,75 × 0,999 = **750,0 mg** | 42 mg | 860 mg | **87,2 %** | I·Triptofano·L-Triptofano; III·Triptofano; IV·Triptofano | 950388 (Analitic/INLAB; fabricante SA20241004046X, China) · **03/10/2026 (vence em 17 dias)** · não | **dose ajustada** (800 → 750 mg) |
| 2 | Melatonina — "Melatonina" (CAS 73-31-4, IN 102/2021) | melatonina | **0,1812 mg** (era 0,211) | 99,5 % base seca × (1 − 0,17 % umidade) = 99,33 % — laudo **vencido** (último teor conhecido) | 0,1812 × 0,9933 = **0,180 mg** | NE | 0,21 mg | **85,7 %** | I·Melatonina; III·Melatonina (NE); IV·Melatonina | 950151 · 09/12/2024 · **VENCIDO** | **dose ajustada** (0,21 → 0,18 mg) |

**Soma da porção:** ativos 750,75 + 0,18 = 750,93 mg; matriz q.s.p. 6.000 − 750,93 = **5.249,07 mg**; total 6.000 mg (100 %) — cabe por definição; massas individuais da matriz PENDENTES.

**Versão B (alternativa, se o pote em produção for só melatonina):** melatonina 0,1812 mg → 0,18 mg; sem triptofano; porção e peso conforme a ficha que valer (6 g/180 g ou 7 g/210 g). Advertências: só as da melatonina e do Art. 14 (a linha "Aminoácidos" do Anexo VI deixa de se aplicar).

## 4. Mudanças e motivos

1. **Melatonina 0,21 → 0,18 mg** (insumo 0,211 → 0,1812 mg). 0,21 mg é o teto de segurança do Anexo IV, "que não pode ser ultrapassado"; qualquer variação de lote ou pesagem estoura. 0,18 mg = 85,7 % do teto. O memorial sugeria 0,19 mg (90,5 % — passa da regra de 90 %).
2. **L-triptofano 800 → 750 mg** (insumo 800,80 → 750,75 mg). 800 mg = 93 % do teto; 750 mg = 87,2 %, como o memorial sugeria.
3. **`ingredients_list`, `warnings`, `target_audience` e conservação preenchidos** — estavam vazios; a advertência da melatonina (Anexo VI) e a dos aminoácidos faltavam.
4. Nenhuma troca de forma: L-Triptofano e Melatonina são entradas literais do Anexo I. **Ponto a conferir**: o memorial afirma que o painel da ANVISA só aprova "L-triptofano de glicose de milho (Zea mays L.)" com especificação do fabricante Kyowa Hakko Bio (Japão), e o insumo em uso é chinês. No texto literal do Anexo I há **duas** entradas: "L-Triptofano | 73-22-3" (sem nota de fabricante) e "L-triptofano de glicose de milho (Zea mays L.)^ii" (nota ii excluída pela IN 76/2020). O insumo em uso (CAS 73-22-3) cabe na primeira entrada pelo texto literal; se o painel restringir a primeira, a fonte teria de mudar. **PENDENTE de conferência no painel pelo RT** — não afirmo nenhum dos dois lados.

## 5. Tabela nutricional

Regras: IN 75/2020 Anexo XI (o L-triptofano é "aminoácido específico", 1º nível sob Proteínas, em mg; a melatonina é substância bioativa, ao final); Anexo III (0,180 mg < 1 mg em mg → duas casas: "0,18"); Anexo VIII (VDR ≥ 19 anos); RDC 429 Art. 12 § 1º (célula de %VD vazia para constituinte sem VDR).

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
                                   6 g        %VD*
Valor energético                   PENDENTE
Carboidratos                       PENDENTE
n Açúcares totais                  PENDENTE
nn Açúcares adicionados            PENDENTE
n Polióis totais                   PENDENTE
Proteínas                          PENDENTE
n L-triptofano                     750 mg
Gorduras totais                    0 g        0 %
n Gorduras saturadas               0 g        0 %
n Gorduras trans                   0 g        0 %
Fibras alimentares                 PENDENTE
Sódio                              PENDENTE
Melatonina                         0,18 mg
*Percentual de valores diários fornecidos pela porção
```

Por que PENDENTE: o memorial não traz a massa de nenhum excipiente (só o q.s.p. da matriz); o rótulo atual imprime 11 kcal = 46 kJ, carboidratos 4,5 g (polióis 3,4 g), proteínas 0,8 g, gorduras 0 g e sódio 8 mg — não recalculáveis, não copiados. A maltodextrina da base cria uma linha de açúcares adicionados a calcular (RDC 429, Art. 3º, I). O triptofano livre não é proteína: fica na linha própria, em mg, e não entra no "g" de proteínas (critério do Anexo XI; se o RT declarar proteínas por Kjeldahl, o nitrogênio do triptofano será lido — registrar o critério).

## 6. Lista de ingredientes proposta (ordem do rótulo atual, com o triptofano reduzido; massas dos excipientes PENDENTES)

> Sorbitol líquido, maltitol, gelatina, L-triptofano, água purificada, glicerina vegetal, maltodextrina, pectina cítrica, goma acácia, ácido cítrico (INS 330), aroma de uva, citrato de sódio (INS 331), conservador sorbato de potássio (INS 202), edulcorante sucralose (INS 955), corante vermelho 40 (INS 129), corante azul brilhante FCF (INS 133) e melatonina. Não contém glúten.

"Não contém glúten": ensaio MGW RG 005706/03/2026 (< 10 ppm, lote G20/1550) — vale para o lote ensaiado. Alergênicos: "Contém: peixe" só se a gelatina for de peixe (espécie PENDENTE). Sulfitos: depende da massa da maltodextrina (6,27 ppm de SO2 no insumo) — PENDENTE.

## 7. Advertências (hoje vazias)

Art. 14 da RDC 243/2018 (literal, em destaque e negrito): **"Este produto não é um medicamento."** · **"Não exceder a recomendação diária de consumo indicada na embalagem."** · **"Mantenha fora do alcance de crianças."** Grupo e uso: "Público indicado: adultos a partir de 19 anos" · "Consumir 2 gomas ao dia". Conservação.

Anexo VI da IN 28/2018, linha "Melatonina" (literal, IN 102/2021): **"Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico."**

Anexo VI, linha "Aminoácidos …" (o L-triptofano é aminoácido): **"Este produto não deve ser consumido por gestantes, lactantes e crianças."** — a frase da melatonina contém esses três grupos, mas a norma exige o texto de cada linha; a proposta grava as duas (na versão B, só a da melatonina).

Polióis: "O consumo excessivo pode ter efeito laxativo (contém polióis)" — frase da fábrica; base legal a confirmar pelo RT. O memorial aponta que "preferencialmente antes de dormir" / "rotina noturna" podem ser lidos como alegação implícita — o RT decide.

## 8. Pendências e decisões

1. **Decisão do dono: versão A (com triptofano) ou B (só melatonina)?** O SQL grava a A.
2. **Laudo novo de melatonina** — nenhum válido em disco (950151 venceu em 09/12/2024; Lepuge AUTO040242/AUTO039807 em 27/05/2026; Gamma em 2022). Sem laudo válido não há como fechar o teor de um insumo cujo limite é de 0,21 mg.
3. **L-triptofano**: laudo do lote 950388 vence em 03/10/2026 e tem só 6 ensaios (sem identificação por IR/HPLC nem perfil de impurezas — ensaio crítico para triptofano); exigir certificado completo e conferir no painel a questão do fabricante (item 4 da seção 4).
4. **Massas dos excipientes** para fechar a tabela nutricional.
5. Corantes vermelho 40 e azul brilhante FCF sem laudo; goma acácia pH fora de spec; sorbato PA; maltodextrina vencida; gelatina sem espécie.
6. `target_audience` e `storage_instructions` vazios — preencher (fora do SQL desta fase).
7. Doseamento de melatonina e triptofano no produto acabado (a análise MGW não os dosa).

## 9. Veredito esperado

**CONFORME CONDICIONADO A**: laudo novo de melatonina; laudo completo (e novo) de L-triptofano; decisão sobre a versão A/B. Nos limites, a fórmula proposta está conforme com folga (melatonina 85,7 % e triptofano 87,2 % do teto).
