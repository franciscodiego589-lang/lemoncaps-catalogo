# Auditoria: composição do rótulo × limites vigentes da ANVISA (15/09/2026)

**Data da auditoria:** 15/09/2026, entre 18:26 e 18:50 (horário de Cuiabá, UTC−4).
**O que foi auditado:** a composição **impressa no rótulo** das 15 fórmulas ativas que têm arte de rótulo, insumo a insumo, contra a IN 28/2018 da ANVISA no texto consolidado vigente (Anexos I, III, IV e VI), lido hoje na fonte primária. Para as 12 fórmulas que entram na migration `supabase/migrations/20260920000000_composicoes_conforme_rotulo.sql`, auditei as **92 linhas dessa migration** (conferidas nesta tarefa, uma a uma, iguais ao `docs/conformidade/composicoes_rotulo.json`; 0 divergências). Para as 3 fórmulas com rótulo que ficam fora dessa migration, auditei a composição do rótulo tal como está no JSON (`bioprincess`, `nuviart`) ou no PDF da gráfica via parecer próprio (Pré-treino Césio 137).
**O que NÃO foi auditado na Parte I:** o cadastro-teto atual de `formula_compositions` das 15 com rótulo (já provado como não sendo a fórmula real). **Parte II** (no fim do documento, acrescentada por ordem do dono na mesma data): as 9 fórmulas sem rótulo, auditadas contra o cadastro atual do catálogo, lido ao vivo às 19:36, com a procedência marcada em cada tabela.
**Nada foi escrito no banco.** Entregáveis: este documento e as migrations `supabase/migrations/20260921000000_selos_conforme_rotulo.sql` (Parte I) e `supabase/migrations/20260921100000_selos_conforme_cadastro_sem_rotulo.sql` (Parte II, condicionada à confirmação escrita do dono), criadas em disco e **não aplicadas**.

Convenção de procedência, usada em todo o texto: **lido** = copiado da fonte, com a fonte identificada; **calculado** = conta aritmética sobre valores lidos, mostrada; **assumido** = marcado como tal, sempre ao lado do dado. Nenhum limite abaixo vem de memória, de PDF antigo, de blog ou de documento derivado; os documentos de sessões anteriores (`LIMITES-ANVISA-POR-INSUMO.md`, fichas de enquadramento, `conformidade-anvisa.md`) foram usados só como orientação e **cada número foi relido na fonte primária hoje**.

---

## 0. Resumo executivo

| resultado | quantidade | quais |
|---|---|---|
| fórmulas com rótulo auditadas | 15 | seção 4 |
| **100% CONFORME** (todo insumo autorizado, verificado e dentro da faixa) | **4** | BELLA GUMMY; Creatina Monoidratada 150 g; Creatina Gummy Frutas Vermelhas; Melatonina em Gummy Sabor Uva |
| **NÃO CONFORME** (pelo menos um insumo abaixo do mínimo, acima do máximo ou em forma não autorizada) | **9** | Biotina em Cápsula; Detox 300 g; Saúde Intestinal; Focus Colina; Moro Slim; Multivitamínico; ZMA; Dores Musculares; Pré-treino Césio 137 |
| **NÃO VERIFICÁVEL** (nenhuma violação confirmada, mas há insumo que só laudo ou ficha do fornecedor resolve) | **2** | Serena; Pro Energy |
| selos que a migration **concede** | 4 | os 4 conformes acima — todos já tinham selo desde 12/09; a migration os reafirma com a data e as fontes desta auditoria (seção 5) |
| selos que a migration **remove** | 8 | Biotina em Cápsula, Creatina Gummy Tutti-frutti, Creatina 300 g, Dores Musculares, Focus Colina, Multivitamínico, Serena, ZMA |
| selos no banco depois da migration | 4 (eram 12) | seção 5 |
| **Parte II — 9 fórmulas sem rótulo, auditadas contra o cadastro** (ordem do dono, mesma data) | 2 100% CONFORME PELO CADASTRO (Creatina 300 g; Creatina Gummy Tutti-frutti) · 1 NÃO CONFORME e impossível na porção (Multi Vitta) · 1 COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (Melatonina + Triptofanos) · 5 NÃO VERIFICÁVEL (Emagrecedor, Ômega Pró TG, Pré-treino 300 g, Shot + Colágeno, Slim Up) | Parte II; migration condicionada `20260921100000` (2 selos, só com confirmação escrita do dono) |

Os achados que mudam decisão, todos lidos hoje na fonte primária:

1. **L-teanina só é autorizada como "L-teanina de folhas de *Camellia sinensis*"** (Anexo I, incluída pela IN 318/2024; o painel oficial acrescenta que a especificação aprovada é a do fabricante Blue California). Os rótulos de Serena, Focus Colina, Multivitamínico e ZMA declaram só "L-teanina", sem origem. Sem ficha técnica do insumo dizendo a origem botânica, o item fica **NÃO VERIFICADO** — e isso, sozinho, tira o selo da Serena (que nos demais itens está dentro da faixa). A auditoria de 12/09 não tinha olhado esse ponto.
2. **Focus Colina está abaixo de dois mínimos:** magnésio 60 mg contra mínimo de 63 mg, e L-tirosina 220 mg contra o mínimo de 262,5 mg (soma de fenilalanina e tirosina, nota viii do Anexo III). O cadastro-teto (350 mg de magnésio) escondia isso.
3. **Detox 300 g declara zinco 0,29 mg**, abaixo do mínimo de 1,65 mg.
4. **Boro como "quelato de boro"/"glicinato de boro" não é forma autorizada**: o Anexo I só lista frutoborato de cálcio e tetraborato de sódio decahidratado. Afeta Multivitamínico e ZMA.
5. **"Selênio quelado" não é forma autorizada**: o Anexo I lista ácido selenioso, levedura enriquecida com selênio, selenato de sódio, selenito de sódio e L-selenometionina. Afeta Biotina em Cápsula e Dores Musculares.
6. **Multivitamínico: ácido fólico 800 mcg** = 1.333,3 µg DFE na conversão da própria norma (1 DFE = 0,6 mcg de ácido fólico de suplemento), acima do máximo de 1.281,5 µg DFE. O %VD impresso (200%) só fecha se o número já for DFE — contradição interna do rótulo que a fábrica precisa esclarecer; em qualquer hipótese a fórmula já é NÃO CONFORME pelo boro.
7. **Colágeno hidrolisado** só existe no Anexo I como fonte de **Proteínas** (linha "Gelatina hidrolisada/Colágeno hidrolisado"), com mínimo de 8,4 g/dia. O "Colágeno" com mínimo de 11,5 mg (IN 102/2021) é outro constituinte, cuja fonte autorizada é **membrana de casca de ovo**. Confirma a decisão de 14/09: 120 mg (Biotina em Cápsula) e 100 mg (Dores Musculares) ficam abaixo do mínimo.
8. **Fibras declaradas como ativo** (psyllium, inulina, FOS, quitosana) somam 567 mg no Saúde Intestinal e 232 mg no Moro Slim, contra mínimo de 5,7 g de fibras alimentares. **Espirulina** (Moro Slim, 122 mg) só consta como fonte de Proteínas, mínimo 8,4 g.
9. **Cafeína total do Pro Energy** não pode ser fechada sem laudo do guaraná (150 mg de cafeína anidra + 200 mg de guaraná em pó; o máximo é 200 mg). E os extratos vegetais (feno-grego, cúrcuma, laranja moro, café verde) continuam sem laudo de padronização do marcador — a norma limita saponinas, curcuminoides, antocianinas e ácido clorogênico, não a massa do extrato.
10. **Aditivos que aparecem na linha de composição** (dióxido de silício, ácido cítrico, sucralose, corantes, aromatizante) foram conferidos contra a IN 211/2023 (categoria 14.2), também lida hoje: todos dentro do permitido. Nenhuma fórmula ficou presa por aditivo.

---

## 1. Fontes primárias: o que abriu, o que não abriu

| tag | fonte | como cheguei | resultado | evidência em disco (scratchpad `agente-g/`) |
|---|---|---|---|---|
| **[F1]** | **IN 28/2018, texto consolidado "Vigente com Alterações"**, AnvisaLegis | `curl` na URL já registrada em `lib/catalog/regulatory-info.ts` (REGULATORY_INSTRUCTIONS): `https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true` | **HTTP 200, 675.743 bytes, lido em 15/09/2026 18:26 (UTC−4).** A página traz o cabeçalho "Vigente com Alterações", as notas de alteração (IN 450/2026, 438/2026, 431/2026, 418/2025 no topo) e os **sete anexos completos em tabelas HTML** (Anexo I 673 linhas; III 172; IV 174; V 247; VI 57; VII 12). No texto aparecem as 13 INs alteradoras: 76/2020, 102/2021, 275/2024, 284/2024, 304/2024, 318/2024, 336/2024, 361/2025, 373/2025, 418/2025, 431/2026, 438/2026 e **450/2026 (10/06/2026)** — bate com a lista do projeto. | `in28_tentativa1.html` (bruto), `in28_texto.txt`, `in28_tabelas.json` (as 7 tabelas), `anexo_I.txt`, `in28_consulta_data.txt` |
| **[F2]** | **RDC 243/2018, texto consolidado** (norma-mãe: Art. 4 constituintes; Art. 6 outros ingredientes e § único; Art. 9 limites mínimos e máximos; Art. 14 advertências) | `curl` na URL de `regulatory-info.ts` (REGULATORY_RESOLUTIONS): `https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000243&seqAto=000&valorAno=2018&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true` | **HTTP 200, 62.636 bytes, lido em 15/09/2026 18:33 (UTC−4)**, "Vigente com Alterações", texto completo. (O parecer do pré-treino, hoje mais cedo, tinha recebido "Este ato está sendo processado" nessa mesma norma; agora abriu.) | `rdc243.html`, `rdc243_texto.txt` |
| **[F3]** | **IN 211/2023 (aditivos), texto consolidado até a IN 466/2026 (20/08/2026)** — categoria 14.2 "Suplementos alimentares sólidos e semissólidos (inclusive comprimidos, gomas, drágeas, tabletes, cápsulas, cápsulas gelatinosas, géis, cremes, pós, granulados, pastilhas e formas mastigáveis)" | `curl` na URL de `regulatory-info.ts`: `…tipo=INM&numeroAto=00000211&seqAto=000&valorAno=2023…` | **HTTP 200, 6.806.271 bytes, lido em 15/09/2026 18:39 (UTC−4)**, "Vigente com Alterações"; notas de alteração no topo: IN 466 (20/08/2026), 452 (10/06/2026), 432 (01/04/2026), 415 (17/12/2025). | `in211.html`, `in211_texto.txt` |
| **[F4]** | **Painel oficial "Constituintes Autorizados para Uso em Suplementos Alimentares"** (Power BI) | Link atual localizado na página `https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/consulte-a-lista-de-ingredientes-autorizados` (HTTP 200, 18:43): `https://app.powerbi.com/view?r=eyJrIjoiNDU4Y2UxNmEtZjc0Yi00ZTkyLTk3N2EtZTEyZTI5MjdkNzQ2IiwidCI6ImI2N2FmMjNmLWMzZjMtNGQzNS04MGM3LWI3MDg1ZjVlZGQ4MSJ9`. Aberto com Playwright (Chromium) às 18:44–18:48. | **Abriu.** "Última atualização: 9/15/2026 5:07:51 AM". O próprio painel avisa: *"As informações contidas neste painel foram adaptadas do texto normativo (IN 28/2018) com objetivo de facilitar a consulta… Entretanto, elas não substituem o texto legal."* Por isso o painel entrou só como **contraprova** de 4 constituintes: creatina (mín. 3.000 / máx. 5.000 mg), triptofano (42 / 860 mg), L-teanina (50 / 250 mg; única entrada "L-teanina de folhas de Camellia sinensis", CAS 3081-61-6, "especificações do fabricante: Blue California CO."), bisglicinato de zinco (forma autorizada). Todos batem com [F1]. A automação do filtro do painel é instável (o filtro anterior persiste entre buscas), então não a usei para os demais. | `painel_powerbi_01.png` (tela inicial), `painel_constituintes_*.png` |
| **[F5]** | Certificado de Análise Fagron, "SILICIUMAX PO Silício Orgânico" | arquivo `/Users/diegofrancisco/Desktop/POPS/laudos/_LAUDOS_IN_HAIR_60CAPS/03_Silicio_Acido-Ortossilicico.png`, **lido hoje** (imagem aberta e conferida) | Lote interno 25L02-B003-216957, lote do fabricante OP25211, fabricação 29/07/2025, vencimento 29/07/2029, análise 09/01/2026; composição "maltodextrina 95%; gel ácido silícico 5%"; **Silício (Si): especificação 1,5% ± 10%, resultado 1,4300%**; conclusão APROVADO. | — |
| — | Diário Oficial (in.gov.br) para IN 450/2026 e IN 466/2026 | não foi necessário: o texto consolidado [F1] já incorpora a IN 450/2026 (citada nominalmente em 4 linhas dos Anexos III/IV/VI e nas notas de alteração), e [F3] já incorpora a IN 466/2026. Não tentado. | — |

Composições auditadas (fonte **[R]**): `docs/conformidade/composicoes_rotulo.json` (extração de 13/09/2026, artes-finais em PDF) e as 92 linhas de `supabase/migrations/20260920000000_composicoes_conforme_rotulo.sql` (conferidas hoje contra o JSON: 92 de 92 iguais em insumo, quantidade, unidade, `e_sal` e elemento equivalente). Para o Pré-treino Césio 137, o rótulo é o PDF `/Users/diegofrancisco/Downloads/PRÉ TREINO_CÉSIO 137_420g.pdf`, já lido e reprovado em `docs/conformidade/PARECER-PRE-TREINO-CESIO-137-2026-09-15.md` — só registrado aqui, não reaberto. Estado do banco (selos, `warnings`, `target_audience`, `usage_instructions`) lido ao vivo às 18:31 via PostgREST com a chave pública (`formulas_prod.json`, `formulas_detox_etc.json`).

---

## 2. Método (as regras que decidem cada veredito)

1. **Faixa etária.** Todas as 15 fórmulas são indicadas para adultos ("Adultos (19 anos ou mais)" em `target_audience`; a Melatonina em Gummy está com o campo vazio no banco, mas melatonina é "NA" em todos os grupos exceto "> 19 anos", então o único grupo possível é esse). Coluna usada em todos os Anexos III e IV: **"> 19 anos"**.
2. **Constituinte é o que está no Anexo I.** Cada insumo do rótulo foi procurado no Anexo I de [F1] (lista de constituintes autorizados, com as formas/fontes). Forma que não consta = **FORMA NÃO AUTORIZADA** (Art. 4 da RDC 243/2018 [F2]: "restringem-se àqueles previstos nos Anexos I e II"). Forma que o rótulo não deixa identificar (ex.: "cobre quelado", "L-teanina" sem origem) = **NÃO VERIFICADO**.
3. **Limite vale para o elemento/ativo, nunca para a massa do sal ou do extrato.** Quando o rótulo declara o sal (`e_sal: true`) e o elemento (tabela nutricional), uso o elemento declarado. Quando declara só o sal, mostro a conta estequiométrica (massas atômicas IUPAC: Ca 40,078; Mg 24,305; Zn 65,38; Fe 55,845; C 12,011; O 15,999; N 14,007; H 1,008) e, quando há laudo do projeto, o teor do laudo — e digo qual dos dois usei. Extrato vegetal sem laudo de padronização do marcador = **NÃO VERIFICADO**.
4. **Unidades da norma** (notas de rodapé dos Anexos III e IV, lidas hoje): vitamina A em **µg RAE** (nota i do Anexo IV: "aplicável somente a vitamina A pré-formada… 1 RAE = 1 μg retinol"); vitamina E "como α-tocoferol" (nota iii: forma sintética rac-α-tocoferil com atividade 0,67 × RRR; 1 UI = 1 mg de acetato de rac-α-tocoferil); niacina em **mg NE** (nota ix, IN 418/2025); ácido fólico em **µg DFE** (nota iv, IN 76/2020: "1 DFE = 1 mcg de folato do alimento = 0,6 mcg de ácido fólico de suplemento"); vitamina D "como colecalciferol" (nota ii, IN 361/2025). Para vitamina A e E, quando o rótulo não deixa claro se o número é do éster ou do ativo, mostro as duas leituras — nas 15 fórmulas as duas caem dentro da faixa, então a ambiguidade não muda veredito.
5. **Mínimos.** Art. 9 da RDC 243/2018 [F2]: "as quantidades de nutrientes, substâncias bioativas, enzimas e probióticos contidas nos suplementos alimentares devem atender aos limites mínimos e máximos… na recomendação diária de consumo". A única exceção é o Art. 6, parágrafo único: ingrediente usado **só** para dar sabor, cor, aroma, ou para dissolver, diluir, dispersar ou alterar consistência (sem alegação de que é fonte de nutriente) escapa do mínimo mesmo quando também consta como fonte de proteína, carboidrato, fibra ou lipídio. Apliquei essa exceção **apenas** à maltodextrina do Detox (veículo declarado). Colágeno hidrolisado, psyllium, inulina, FOS, quitosana e espirulina aparecem na linha "Composição por porção" como ativos do produto — Art. 9, sem exceção. "NE" (não estabelecido) = sem limite naquele lado; "NA" = não autorizado para o grupo.
6. **Igual ao máximo é conforme.** O Anexo IV lista "limites máximos… que não podem ser ultrapassados" (Art. 6 da IN): 5.000 mg de creatina, 0,21 mg de melatonina, 45 µg de biotina, 50 µg de vitamina D e 9,94 µg de B12 no teto exato são CONFORME (sem margem de fabricação, o que registro como observação, não como não conformidade).
7. **Aditivos** (ácido cítrico, dióxido de silício, sucralose, corantes, aromatizante) **não são constituintes** da IN 28/2018 (Art. 3, I, e Art. 5 da RDC 243/2018 [F2]); quando aparecem na linha de composição, foram conferidos contra a IN 211/2023 [F3], categoria 14.2, com a nota "limite refere-se ao produto pronto para consumo, de acordo com as instruções de preparo" aplicada usando o modo de uso do banco (Detox: 10 g em 200 mL). Aditivos que só aparecem na lista de ingredientes (sem quantidade) estão fora do escopo do selo — o selo afirma conferência da **composição**, não da lista de ingredientes.
8. **Escopo do selo.** O selo "Composição conferida" e a nota de rodapé do catálogo (`CATALOG_FOOTER_COMPLIANCE_NOTE`) afirmam conferência dos constituintes contra as listas da IN 28/2018. Por isso o veredito por fórmula considera Anexos I, III e IV (forma, mínimo, máximo). As advertências do Anexo VI e o campo `warnings` do banco são registrados por fórmula (seção 4) como **pendência de cadastro/rotulagem**, não como critério do selo — mesma régua das migrations 20260914, 20260915140000 e 20260917.
9. **Veredito por fórmula:** **100% CONFORME** = todo insumo CONFORME (forma autorizada, verificado, dentro da faixa); **NÃO CONFORME** = pelo menos um ABAIXO DO MÍNIMO, ACIMA DO MÁXIMO ou FORMA NÃO AUTORIZADA; **NÃO VERIFICÁVEL** = nenhuma violação confirmada, mas pelo menos um NÃO VERIFICADO.
10. **Referência às linhas da fonte.** Nas tabelas, "I·Bisglicinato de zinco" = Anexo I de [F1], linha "Bisglicinato de zinco"; "III·Zinco" = Anexo III, linha "Zinco"; "IV·Zinco" = Anexo IV; "VI·n" = Anexo VI, linha n da tabela extraída. Todas em [F1], lidas em 15/09/2026.

---

## 3. Limites lidos hoje na fonte, grupo "> 19 anos" (só os constituintes que aparecem nos 15 rótulos)

Fonte: [F1], Anexo III (mínimo) e Anexo IV (máximo), coluna "> 19 anos", lidos em 15/09/2026. Norma alteradora indicada quando a própria tabela a cita.

| constituinte (nome exato no Anexo) | unidade | mínimo | máximo | observação lida na fonte |
|---|---|---|---|---|
| Proteínas | g | 8,4 | NE | fontes no Anexo I incluem "Gelatina hidrolisada/Colágeno hidrolisado" e "Espirulina (Arthrospira platensis)" |
| Carboidratos | g | 19,5 | NE | "Maltodextrina" é fonte no Anexo I |
| Fibras alimentares | g | 5,7 | NE | fontes: "Psyllium (Plantago ovatae)", "Inulina", "Frutooligossacarídeos (FOS)", "Quitosana" |
| Teanina | mg | 50 | 250 | incluído pela IN 318/2024; forma autorizada: só "L-teanina de folhas de Camellia sinensis" |
| Colina | mg | 82,5 | 3.235,15 | formas: bitartarato de colina, cloreto de colina |
| Vitamina A | µg RAE | 135 | 2.623,61 | nota i (IV): só vitamina A pré-formada; 1 RAE = 1 µg retinol |
| Vitamina B6 | mg | 0,26 | 98,60 | cloridrato de piridoxina autorizado |
| Vitamina C | mg | 13,5 | 1.916,02 | ácido ascórbico autorizado |
| Vitamina D | µg | 3 | 50,0 | colecalciferol autorizado; nota ii (IN 361/2025) |
| Niacina | mg NE | 2,4 | 35 | máximo com redação da IN 418/2025; nicotinamida/niacinamida autorizada |
| Vitamina E | mg α-tocoferol | 2,25 | 1000 | DL-alfa-tocoferol e acetato de DL-alfa-tocoferol autorizados |
| Ácido fólico | µg DFE | 60 | 1.281,5 | mínimo: redação IN 102/2021; máximo: IN 76/2020; 1 DFE = 0,6 mcg de ácido fólico de suplemento |
| Ácido pantotênico | mg | 0,75 | 5,64 | D-pantotenato de cálcio autorizado |
| Biotina | µg | 4,5 | 45 | D-biotina autorizada |
| Riboflavina | mg | 0,20 | 2,74 | |
| Tiamina | mg | 0,18 | 2,02 | cloridrato de tiamina autorizado |
| Vitamina B12 | µg | 0,36 | 9,94 | cianocobalamina e metilcobalamina autorizadas |
| Vitamina K | µg | 18 | 149,06 | menaquinona-7 autorizada |
| Cálcio | mg | 180 | 1.534,67 | carbonato de cálcio autorizado |
| Cobre | µg | 135 | 8.975,52 | formas: aspartato, bisglicinato, gluconato cúprico, óxido, sulfato cúprico |
| Selênio | µg | 8,25 | 319,75 | formas: ácido selenioso, levedura enriquecida, selenato de sódio, selenito de sódio, L-selenometionina |
| Zinco | mg | 1,65 | 29,59 | bisglicinato de zinco autorizado |
| Iodo | µg | 22,5 | 919,02 | iodeto de potássio autorizado |
| Ferro | mg | 2,7 | 34,31 | bisglicinato ferroso autorizado |
| Magnésio | mg | 63 | 350 | bisglicinato de magnésio e cloreto de magnésio autorizados |
| Cromo | µg | 5,25 | 250 | picolinato de cromo autorizado |
| Tirosina | mg | 262,5 (nota viii: soma de fenilalanina e tirosina) | 2.750 | L-Tirosina autorizada |
| Metionina | mg | 105 (nota ix: soma de metionina e cisteína ≥ 157,5) | 1.530 | |
| Cisteína | mg | 42 (nota ix) | 830 | L-Cisteína autorizada |
| Triptofano | mg | 42 | 860 | L-Triptofano autorizado |
| Arginina | mg | NE | 3.810 | L-Arginina, L-Aspartato de L-arginina e cloridrato autorizados |
| Aspartato | mg | NE | 5.320 | |
| Glutamina | mg | NE | 5.000 | |
| Taurina | mg | NE | 2.000 | |
| L-Carnitina | mg | NE | 2.000 | levocarnitina/L-carnitina autorizada |
| Creatina | mg | 3.000 | 5.000 | máximo com redação da IN 373/2025 (retificada DOU 17/06 e 01/07/2025); creatina monohidratada autorizada |
| Beta-alanina | g | — (não consta do Anexo III) | 2 | IN 102/2021 |
| Inositol | g | NE | 2 | IN 76/2020; "Inositol (Mio-inositol/Meso-inositol)" autorizado |
| Ácido hialurônico | mg | 3,5 | 157,7 | IN 76/2020 (mínimo com redação IN 102/2021); forma: "Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus" |
| Boro | mg | NE | 8,866 | IN 76/2020; formas: "Frutoborato de cálcio" (IN 418/2025) e "Tetraborato de sódio decahidratado" |
| Cafeína | mg | 75 | 200 (nota vi: 400 mg só para atletas, dose individual ≤ 200) | formas: cafeína, café verde em pó, extrato fluido de guaraná (IN 450/2026), guaraná em pó (Paullinia cupana) |
| Colágeno tipo II não desnaturado | mg | 1,2 | NE | IN 76/2020; forma: "Colágeno de frango com colágeno tipo II não desnaturado" |
| Colágeno | mg | 11,5 | NE | IN 102/2021; fonte autorizada: "Membrana de casca de ovo" — **não é o colágeno hidrolisado** |
| Metilsulfonilmetano | mg | NE | 900 | IN 76/2020 |
| Curcumina | mg | 80 (nota xv, IN 438/2026: curcuminoides totais) | 130 (nota x) | forma: "Extrato de rizomas de cúrcuma (Curcuma longa L.)" |
| Silício | mg | NE | 15,67 | formas: ácido ortosilícico estabilizado em cloreto de colina; ácido orto-silícico estabilizado com maltodextrina (IN 102/2021); monometilsilanotriol |
| Ácido clorogênico | mg | NE | 400 | forma: "Extrato de café verde" (IN 102/2021) |
| Antocianinas da laranja moro | mg | NE | 5 | forma: "Extrato de laranja moro (Citrus sinensis (L.) Osbeck)" (IN 336/2024) |
| Glucosamina | mg | NE | 750 | IN 304/2024; formas: "Cloridrato de glucosamina obtido por fermentação (E. coli AT-29)" e "Sulfato de glucosamina com cloreto de potássio" (IN 418/2025) |
| Quercetina | mg | NE | 280 | IN 418/2025 |
| Saponinas de glicosídeos de furostanol | mg | NE | 450 | IN 304/2024; forma: "Extrato de semente de feno-grego (Trigonella foenum-graecum L.)" |
| Melatonina | mg | NE | 0,21 | IN 102/2021 |

Aditivos, IN 211/2023 [F3], categoria 14.2, lidos em 15/09/2026: ácido cítrico (INS 330) quantum satis; dióxido de silício (INS 551) quantum satis; sucralose (INS 955) 2.400 mg/kg no produto pronto para consumo, "não permitido em cápsulas, cápsulas gelatinosas, comprimidos e drágeas, com exceção das formas mastigáveis ou sublinguais"; tartrazina (INS 102) 300 mg/kg; azul brilhante FCF (INS 133) 300 mg/kg; ponceau 4R (INS 124) 300 mg/kg; sorbato de potássio (INS 202) 800 mg/kg só em semissólidos e gomas; aromatizantes: quantum satis, não permitidos em cápsulas/comprimidos/drágeas (exceto mastigáveis), e "para aromatizantes provenientes de extratos vegetais, o limite máximo é de 2%".

---

## 4. Auditoria por fórmula

### 4.1 `bella-gummy-biotina-em-gummy` — BELLA GUMMY (Biotina em Gummy) × BioGummy.pdf — **100% CONFORME**

Porção 6 g (2 gomas), 30 porções. Composição: migration 20260920000000 (5 linhas = JSON `biogummy`).

| # | rótulo | ativo considerado (conta) | constituinte / forma no Anexo I | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Vitamina C (ácido ascórbico) 45 mg | 45 mg | Vitamina C / I·Ácido ascórbico ✓ | 13,5 mg | 1.916,02 mg | CONFORME |
| 2 | Vitamina E (DL-alfa-tocoferol) 16,7 mg | 16,7 mg se o número já é α-tocoferol (o %VD impresso, 111% de 15 mg, indica isso); pior caso 16,7 × 0,67 = 11,19 mg | Vitamina E / I·DL-alfa-tocoferol ✓ | 2,25 mg | 1000 mg | CONFORME nas duas leituras |
| 3 | Zinco (bisglicinato de zinco) 12 mg — sal; rótulo declara "equivalente a 2,4 mg de zinco" | 2,4 mg de zinco (lido no rótulo) | Zinco / I·Bisglicinato de zinco ✓ | 1,65 mg | 29,59 mg | CONFORME |
| 4 | Vitamina A (acetato de retinol) 1.020 mcg | 1.020 µg RAE (o %VD impresso, 170% de 600, mostra que o rótulo já trata como RAE); se fosse massa do acetato: 1.020 × 286,45/328,49 = 889,5 µg | Vitamina A / I·Acetato de retinol ✓ | 135 µg | 2.623,61 µg | CONFORME nas duas leituras |
| 5 | Biotina (D-biotina) 45 mcg | 45 µg | Biotina / I·D-biotina ✓ | 4,5 µg | 45 µg | CONFORME — **igual ao máximo** |

Soma dos itens: 45 + 16,7 + 12 + 1,02 + 0,045 = **74,765 mg em 6.000 mg** (1,25% da porção; o resto é base da goma). Advertências do Anexo VI: nenhuma exigida para vitaminas e minerais. `warnings` no banco: presente (texto genérico da RDC 243). Observação, não impedimento: biotina exatamente no teto, sem margem de sobredosagem (Art. 10, § 2º da RDC 243: o produto à venda não pode ultrapassar o máximo).

**Veredito: 100% CONFORME. Selo mantido.** Fontes: [F1] Anexos I, III, IV, lidos em 15/09/2026; [R].

### 4.2 `creatina-monohidratada-150g-soluvel` — Creatina Monoidratada 150 g × CreatinaPo.pdf — **100% CONFORME**

Porção 5 g (1 scoop), 30 doses. Composição: migration 20260920000000 (1 linha).

| # | rótulo | ativo | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Creatina monohidratada 5.000 mg | 5.000 mg | Creatina / I·Creatina monohidratada (CAS 6020-87-7) ✓ | 3.000 mg | 5.000 mg (IN 373/2025) | CONFORME — **igual ao máximo** |

Soma: 5.000 mg em 5.000 mg (100,0%). Advertência exigida (VI·0, Creatina): "Este produto não deve ser consumido por gestantes, lactantes e crianças" — `warnings` no banco **tem** a frase. Contraprova no painel [F4]: creatina mín. 3.000 / máx. 5.000 mg, mesma advertência.

**Veredito: 100% CONFORME. Selo mantido.** Norma alteradora relevante: IN 373/2025 (teto de 5.000 mg).

### 4.3 `creatina-gummy-sabor-frutas-vermelhas` — Creatina Gummy Frutas Vermelhas × creatina gummy.pdf — **100% CONFORME**

Porção 6 g (2 gomas), 30 porções. Composição: migration 20260920000000 (1 linha).

| # | rótulo | ativo | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Creatina monohidratada 3.000 mg | 3.000 mg | Creatina / I·Creatina monohidratada ✓ | 3.000 mg | 5.000 mg | CONFORME — **igual ao mínimo** |

Soma: 3.000 mg em 6.000 mg (50,0%). Advertência exigida (VI·0, Creatina): `warnings` no banco está **vazio (null)** hoje; a migration em disco `20260920100000_ingredientes_e_advertencias_do_rotulo.sql` grava o texto com a frase exigida — pendente de aplicação. Pendência de cadastro que não afeta a composição: `nutritional_info` diz "Porção: 3 g (2 gomas)" enquanto o rótulo diz 6 g (2 gomas).

**Veredito: 100% CONFORME. Selo mantido.**

### 4.4 `melatonina-em-gummy-sabor-uva` — Melatonina em Gummy Sabor Uva × DreamGummy.pdf — **100% CONFORME**

Porção 6 g (2 gomas), 30 porções. Composição: migration 20260920000000 (2 linhas).

| # | rótulo | ativo | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | L-triptofano 800 mg | 800 mg | Triptofano / I·L-Triptofano (CAS 73-22-3) ✓ | 42 mg | 860 mg | CONFORME |
| 2 | Melatonina 0,21 mg | 0,21 mg | Melatonina / I·Melatonina (CAS 73-31-4, IN 102/2021) ✓ | NE | 0,21 mg | CONFORME — **igual ao máximo** |

Soma: 800,21 mg em 6.000 mg (13,3%). Advertências exigidas: VI·0 (Aminoácidos) "Este produto não deve ser consumido por gestantes, lactantes e crianças" e VI·21 (Melatonina) "Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico." — `warnings` no banco está **vazio (null)**; `target_audience` também vazio. Pendências de cadastro.

Ressalva registrada, sem mudar o veredito: `docs/conformidade/INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md` (seção 4) mostra dois grupos de documentos da fábrica que se contradizem sobre este slug — "Dream Gummy" (L-triptofano 800 mg + melatonina 0,21 mg, que é o que a arte-final DreamGummy.pdf imprime e o que auditei) e "Melatonina em Gummy" (só melatonina 0,21 mg). **Nas duas hipóteses a composição está dentro dos limites** (melatonina 0,21 ≤ 0,21; triptofano 800 dentro de 42–860), então o selo "composição conferida" é verdadeiro nos dois cenários; qual produto o slug representa continua sendo pergunta para a fábrica (seção 8).

**Veredito: 100% CONFORME. Selo mantido.** Contraprova no painel [F4]: triptofano 42–860 mg.

### 4.5 `serena` — Serena × Serena.pdf — **NÃO VERIFICÁVEL**

Porção 1 mL (20 gotas), 30 doses. Composição: migration 20260920000000 (5 linhas).

| # | rótulo | ativo | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Magnésio (de cloreto de magnésio) 63 mg | 63 mg de magnésio (elemento, declarado) | Magnésio / I·Cloreto de magnésio ✓ | 63 mg | 350 mg | CONFORME — **igual ao mínimo** |
| 2 | L-teanina 50 mg | 50 mg | Teanina / Anexo I autoriza **só** "L-teanina de folhas de Camellia sinensis" (IN 318/2024); o rótulo não declara a origem | 50 mg | 250 mg | **NÃO VERIFICADO** — quantidade dentro da faixa (igual ao mínimo), mas a forma/origem do insumo só a ficha técnica do fornecedor confirma |
| 3 | Mio-inositol 50 mg | 50 mg | Inositol / I·Inositol (Mio-inositol/Meso-inositol) ✓ | NE | 2 g | CONFORME |
| 4 | Vitamina B6 (cloridrato de piridoxina) 1,3 mg | 1,3 mg | Vitamina B6 / I·Cloridrato de piridoxina ✓ | 0,26 mg | 98,60 mg | CONFORME |
| 5 | Melatonina 0,21 mg | 0,21 mg | Melatonina / I·Melatonina ✓ | NE | 0,21 mg | CONFORME — igual ao máximo |

Soma dos itens impressos: 164,51 mg por mL (16,5% de ~1 g; o cloreto de magnésio necessário para 63 mg de Mg é maior que 63 mg, mas cabe em 1 mL). Advertências exigidas: VI·0 (Aminoácidos: L-teanina) e VI·16 (Inositol) — frase genérica **presente** em `warnings`; VI·21 (Melatonina) — a frase específica ("…pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico") **não está** em `warnings`.

**Veredito: NÃO VERIFICÁVEL — o selo atual não se sustenta; a migration o remove.** O que destrava: ficha técnica/laudo do insumo L-teanina dizendo que é obtida de folhas de *Camellia sinensis* (especificação aprovada: Blue California, segundo o painel [F4]). Com esse documento, a Serena volta a 100% CONFORME sem mudar nada na fórmula.

### 4.6 `biotina-em-capsula` — Biotina em Cápsula × BioPrincess.pdf — **NÃO CONFORME**

Porção 1 g (2 cápsulas). Composição auditada: JSON `bioprincess` (21 itens, inclusive o colágeno hidrolisado 120 mg que o cadastro removeu em 14/09 — o rótulo imprime, então entra na conta). Fora da migration 20260920000000.

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Vitamina C (ácido ascórbico) 250 mg | 250 mg | Vitamina C ✓ | 13,5 | 1.916,02 mg | CONFORME |
| 2 | Colágeno hidrolisado 120 mg | 120 mg = 0,12 g de proteína (no máximo) | Proteínas / I·Gelatina hidrolisada/Colágeno hidrolisado (única entrada de colágeno hidrolisado no Anexo I) | **8,4 g** | NE | **ABAIXO DO MÍNIMO** (1,4% do mínimo) |
| 3 | L-metionina 110 mg | 110 mg | Metionina / I·L-Metionina ✓ | 105 mg; nota ix: met + cis ≥ 157,5 → 110 + 100 = 210 ✓ | 1.530 mg | CONFORME |
| 4 | L-cisteína 100 mg | 100 mg | Cisteína / I·L-Cisteína ✓ | 42 mg | 830 mg | CONFORME |
| 5 | Vitamina E (DL-α-tocoferol acetato) 45 mg | 45 × 0,67 = 30,15 mg α-tocoferol (nota iii) | Vitamina E / I·Acetato de DL-alfa-tocoferol ✓ | 2,25 | 1000 mg | CONFORME |
| 6 | Metilsulfonilmetano (MSM) 50 mg | 50 mg | Metilsulfonilmetano ✓ (IN 76/2020) | NE | 900 mg | CONFORME |
| 7 | Ácido hialurônico 50 mg (lista de ingredientes: hialuronato de sódio) | 50 mg | Ácido hialurônico / forma autorizada: "Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus" — origem não declarada | 3,5 | 157,7 mg | **NÃO VERIFICADO** (origem do hialuronato) |
| 8 | Silício orgânico (ácido ortossilícico) 50 mg | laudo [F5] lido hoje: Si 1,43% → 50 × 0,0143 = **0,715 mg de silício**; composição do insumo "maltodextrina 95% + gel ácido silícico 5%" | Silício / I·Ácido orto-silícico estabilizado com maltodextrina ✓ (IN 102/2021) — forma confirmada pelo laudo, não pelo rótulo | NE | 15,67 mg | CONFORME (4,6% do teto); ressalva: o rótulo deveria nomear a forma estabilizada |
| 9 | Vitamina B3 (nicotinamida) 35 mg | 35 mg NE | Niacina / I·Nicotinamida ✓ | 2,4 | 35 mg NE | CONFORME — igual ao máximo |
| 10 | Zinco (bisglicinato de zinco) 15 mg | 15 mg de zinco (elemento; tabela nutricional 136% VD) | Zinco / I·Bisglicinato ✓ | 1,65 | 29,59 mg | CONFORME |
| 11 | Vitamina B6 (cloridrato de piridoxina) 10 mg | 10 mg | Vitamina B6 ✓ | 0,26 | 98,60 mg | CONFORME |
| 12 | Vitamina B5 (D-pantotenato de cálcio) 5,64 mg | 5,64 mg | Ácido pantotênico ✓ | 0,75 | 5,64 mg | CONFORME — igual ao máximo |
| 13 | Vitamina B2 (riboflavina) 2,74 mg | 2,74 mg | Riboflavina ✓ | 0,20 | 2,74 mg | CONFORME — igual ao máximo |
| 14 | Vitamina A (acetato de retinol) 1.500 mcg | 1.500 µg RAE (250% de 600 no rótulo); se massa do acetato: 1.308 µg | Vitamina A ✓ | 135 | 2.623,61 µg | CONFORME |
| 15 | Cobre (cobre quelado) 900 mcg | 900 µg | Cobre / "cobre quelado" não identifica nenhuma das 5 formas autorizadas (aspartato, bisglicinato, gluconato, óxido, sulfato) | 135 | 8.975,52 µg | **NÃO VERIFICADO** (forma não identificada no rótulo) |
| 16 | Vitamina B9 (ácido fólico) 400 mcg | 400 / 0,6 = **666,67 µg DFE** (o rótulo confirma: 167% de 400) | Ácido fólico / I·Ácido fólico ✓ | 60 | 1.281,5 µg DFE | CONFORME |
| 17 | Iodo (iodeto de potássio) 150 mcg | 150 µg | Iodo / I·Iodeto de potássio ✓ | 22,5 | 919,02 µg | CONFORME |
| 18 | Selênio (selênio quelado) 60 mcg | 60 µg | Selênio / "selênio quelado" **não consta** entre as formas autorizadas (ácido selenioso, levedura enriquecida, selenato, selenito, L-selenometionina) | 8,25 | 319,75 µg | **FORMA NÃO AUTORIZADA** (se o insumo real for L-selenometionina, o rótulo precisa dizê-lo e o laudo provar) |
| 19 | Vitamina D3 (colecalciferol) 50 mcg | 50 µg | Vitamina D ✓ | 3 | 50,0 µg | CONFORME — igual ao máximo |
| 20 | Biotina (D-biotina) 45 mcg | 45 µg | Biotina ✓ | 4,5 | 45 µg | CONFORME — igual ao máximo |
| 21 | Vitamina B12 (metilcobalamina) 9,94 mcg | 9,94 µg | Vitamina B12 / I·Metilcobalamina ✓ | 0,36 | 9,94 µg | CONFORME — igual ao máximo |

Soma dos itens impressos: 846,49 mg; como o zinco é elemento (15 mg), o sal bisglicinato pesa ~75 mg (a 20% de teor, laudo Galena citado na migration 20260915140000) → ~906,5 mg, mais maltodextrina e dióxido de silício da lista de ingredientes: cabe em 1 g, mas com pouca folga. Seis insumos exatamente no teto (B3, B5, B2, D3, biotina, B12). Advertências exigidas: VI·0 (aminoácidos), VI·4 (ácido hialurônico, MSM, silício) e VI·16 (ácido orto-silícico estabilizado com maltodextrina) — todas com a mesma frase genérica, **presente** em `warnings`.

**Veredito: NÃO CONFORME (colágeno hidrolisado abaixo do mínimo; selênio em forma não autorizada). Selo removido.** O que destrava: (a) decisão da fábrica sobre o colágeno hidrolisado (tirar do rótulo, ou subir a 8,4 g — impossível em cápsula de 1 g); (b) trocar "selênio quelado" por uma das cinco formas autorizadas, com laudo; (c) ficha técnica do cobre e do hialuronato de sódio identificando a forma/origem.

### 4.7 `detox-matinal-lemon-shot-300g` — Detox Matinal (Lemon Shot) 300 g × Detox.pdf — **NÃO CONFORME**

Porção 10 g (1 dose) diluída em 200 mL de água (`usage_instructions`), 30 doses. Composição: migration 20260920000000 (11 linhas).

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Maltodextrina 6,603 g | veículo | Carboidratos / I·Maltodextrina ✓ — usada para diluir/dar corpo: Art. 6, § único, da RDC 243 [F2] afasta o mínimo | (19,5 g, não aplicável) | NE | CONFORME (como ingrediente do Art. 6; não pode receber alegação de fonte de carboidrato) |
| 2 | Ácido ascórbico (vitamina C) 1,6 g | 1.600 mg | Vitamina C ✓ | 13,5 | 1.916,02 mg | CONFORME (83,5% do teto) |
| 3 | Ácido cítrico (INS 330) 0,67 g | aditivo | IN 211/2023 [F3] 14.2: quantum satis | — | — | CONFORME |
| 4 | Extrato de café verde (Coffea arabica L.) 0,4 g | massa do extrato; teor de ácido clorogênico e de cafeína **desconhecido** | Ácido clorogênico / I·Extrato de café verde ✓ (IN 102/2021); a norma limita o ácido clorogênico (máx. 400 mg) e a cafeína total (máx. 200 mg) | NE | 400 mg (ác. clorogênico) | **NÃO VERIFICADO** (extrato sem laudo de padronização) |
| 5 | Aromatizante idêntico ao natural de limão 0,33 g | aditivo (3,3% do pó) | IN 211/2023 14.2: quantum satis; o teto de 2% vale só para aromatizante "proveniente de extrato vegetal", e o rótulo declara idêntico ao natural; pó para preparo não é cápsula | — | — | CONFORME (condicionado ao aroma ser mesmo idêntico ao natural, como impresso) |
| 6 | Extrato de rizomas de Curcuma longa L. 0,13 g | massa do extrato; curcuminoides **desconhecidos** | Curcumina / I·Extrato de rizomas de cúrcuma ✓; limite em curcuminoides totais: mín. 80, máx. 130 mg (IN 438/2026) | 80 mg | 130 mg | **NÃO VERIFICADO** — sem laudo não se sabe se 130 mg de extrato entregam entre 80 e 130 mg de curcuminoides |
| 7 | Extrato de laranja Moro (Citrus sinensis L. Osbeck) 0,1 g | antocianinas **desconhecidas** | Antocianinas da laranja moro / I·Extrato de laranja moro ✓ (IN 336/2024) | NE | 5 mg de antocianinas | **NÃO VERIFICADO** |
| 8 | Dióxido de silício (INS 551) 0,1 g | aditivo | IN 211/2023 14.2: quantum satis | — | — | CONFORME |
| 9 | Edulcorante sucralose (INS 955) 0,05 g | 50 mg em 210 g prontos = 238,1 mg/kg (calculado) | IN 211/2023 14.2: 2.400 mg/kg no produto pronto; pó para preparo não é cápsula | — | 2.400 mg/kg | CONFORME |
| 10 | Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133) 0,017 g (conjunto) | 17 mg em 210 g = 81,0 mg/kg somados (calculado) | IN 211/2023 14.2: 300 mg/kg cada | — | 300 mg/kg | CONFORME (mesmo se todo o 17 mg fosse de um só corante) |
| 11 | Bisglicinato de zinco 1,45 mg — sal; rótulo declara "equivalente a 0,29 mg de zinco" | **0,29 mg de zinco** (lido) | Zinco / I·Bisglicinato de zinco ✓ | **1,65 mg** | 29,59 mg | **ABAIXO DO MÍNIMO** (17,6% do mínimo) |

Soma dos itens: 6.603 + 1.600 + 670 + 400 + 330 + 130 + 100 + 100 + 50 + 17 + 1,45 = **10.001,45 mg em 10.000 mg** (100,01%: passa da porção em 1,45 mg — arredondamento do próprio rótulo, mas passa). Advertências exigidas: VI·0 (ácido clorogênico; cafeína do café verde) e VI·36 (antocianinas) — frase genérica presente em `warnings`; VI·53 (extrato de rizomas de cúrcuma, IN 438/2026): "Este produto não deve ser consumido por gestantes, lactantes, crianças, pessoas com doenças hepáticas, biliares ou com úlceras gástricas. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico." — **ausente** em `warnings`.

**Veredito: NÃO CONFORME (zinco abaixo do mínimo). Sem selo hoje; continua sem.** O que destrava: subir o zinco a pelo menos 1,65 mg de elemento (ou retirá-lo da composição), laudos de padronização dos três extratos (curcuminoides, antocianinas, ácido clorogênico + cafeína), e a advertência da cúrcuma no rótulo.

### 4.8 `saude-intestinal` — Saúde Intestinal × Floravex-intestino.pdf — **NÃO CONFORME**

Porção 1 g (2 cápsulas). Composição: migration 20260920000000 (11 linhas).

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Psyllium (Plantago ovata, casca da semente) 342 mg | fibra: no máximo 342 mg | Fibras alimentares / I·Psyllium (Plantago ovatae) ✓ | 5,7 g (fibras totais) | NE | **ABAIXO DO MÍNIMO** — psyllium + inulina + FOS = 567 mg mesmo contando 100% como fibra (9,9% do mínimo) |
| 2 | Inulina de Cichorium intybus 135 mg | fibra | Fibras alimentares / I·Inulina ✓ | idem | NE | ABAIXO DO MÍNIMO (soma acima) |
| 3 | L-glutamina 135 mg | 135 mg | Glutamina / I·L-Glutamina ✓ | NE | 5.000 mg | CONFORME |
| 4 | Extrato de rizomas de Curcuma longa L. 117 mg | curcuminoides **desconhecidos** | Curcumina / I·Extrato de rizomas de cúrcuma ✓ | 80 mg | 130 mg | **NÃO VERIFICADO** (mesmo a 95% de curcuminoides daria 111 mg, dentro da faixa — mas isso é hipótese, não laudo) |
| 5 | Frutooligossacarídeos (FOS) 90 mg | fibra | Fibras alimentares / I·FOS ✓ | idem | NE | ABAIXO DO MÍNIMO (soma acima) |
| 6 | Magnésio (de bisglicinato de magnésio) 90 mg | 90 mg de magnésio (elemento, declarado) | Magnésio / I·Bisglicinato de magnésio ✓ | 63 | 350 mg | CONFORME |
| 7 | Quercetina 72 mg | 72 mg | Quercetina ✓ (IN 418/2025) | NE | 280 mg | CONFORME |
| 8 | Zinco (de bisglicinato de zinco) 13,5 mg | 13,5 mg de zinco (elemento, declarado) | Zinco ✓ | 1,65 | 29,59 mg | CONFORME |
| 9 | Dióxido de silício (INS 551) 4,7 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | CONFORME |
| 10 | Vitamina B6 (cloridrato de piridoxina) 1,26 mg | 1,26 mg | Vitamina B6 ✓ | 0,26 | 98,60 mg | CONFORME |
| 11 | Vitamina A (acetato de retinila) 540 mcg | 540 µg RAE (90% de 600); se massa do acetato: 470,9 µg | Vitamina A ✓ | 135 | 2.623,61 µg | CONFORME |

Soma dos itens impressos: **1.001,00 mg em 1.000 mg** (100,1%) — e magnésio e zinco são elemento: o bisglicinato de magnésio para 90 mg de Mg pesa 296 mg a 30,38% (laudo INLAB citado na migration 20260915140000) ou 638 mg estequiométrico (14,10%), e o de zinco ~67,5 mg a 20%. **A fórmula impressa não cabe numa cápsula de 1 g** — ponto para a fábrica, não critério do selo. Advertências: VI·0 (glutamina) e VI·47 (quercetina) — genérica presente; VI·53 (cúrcuma) — específica **ausente**.

**Veredito: NÃO CONFORME (fibras abaixo do mínimo). Sem selo hoje; continua sem.**

### 4.9 `focus-colina` — FOCUS COLINA × FocusColina.pdf — **NÃO CONFORME**

Porção 1 g (2 cápsulas). Composição: migration 20260920000000 (9 linhas).

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Colina (bitartarato de colina) 470 mg | 470 mg se o número é colina; se é massa do bitartarato (41% de colina): 193 mg — as duas leituras ficam na faixa | Colina / I·Bitartarato de colina ✓ | 82,5 | 3.235,15 mg | CONFORME |
| 2 | L-tirosina 220 mg | 220 mg; não há fenilalanina na fórmula | Tirosina / I·L-Tirosina ✓; nota viii do Anexo III: soma de fenilalanina e tirosina ≥ 262,5 mg | **262,5 mg** | 2.750 mg | **ABAIXO DO MÍNIMO** (83,8% do mínimo) |
| 3 | L-teanina 115 mg | 115 mg | Teanina / só "L-teanina de folhas de Camellia sinensis" é autorizada; origem não declarada | 50 | 250 mg | **NÃO VERIFICADO** (origem) |
| 4 | L-carnitina 95 mg | 95 mg | L-Carnitina / I·Levocarnitina ✓ | NE | 2.000 mg | CONFORME |
| 5 | Magnésio (bisglicinato de magnésio) 60 mg | 60 mg de magnésio (elemento; tabela nutricional 14% VD) | Magnésio ✓ | **63 mg** | 350 mg | **ABAIXO DO MÍNIMO** (95,2% do mínimo) |
| 6 | Inositol (mio-inositol) 25 mg | 25 mg | Inositol ✓ | NE | 2 g | CONFORME |
| 7 | Vitamina B6 (cloridrato de piridoxina) 1,3 mg | 1,3 mg | Vitamina B6 ✓ | 0,26 | 98,60 mg | CONFORME |
| 8 | Vitamina D3 (colecalciferol) 5 mcg | 5 µg | Vitamina D ✓ | 3 | 50 µg | CONFORME |
| 9 | Vitamina B12 (cianocobalamina) 2,4 mcg | 2,4 µg | Vitamina B12 / I·Cianocobalamina ✓ | 0,36 | 9,94 µg | CONFORME |

Soma dos itens impressos: 986,31 mg (98,6%); com o magnésio como sal (60 / 0,3038 = 197,5 mg), 1.123,8 mg — **não cabe em 1 g**. Advertências: VI·0 (aminoácidos, carnitina) e VI·16 (inositol) — genérica presente em `warnings`.

**Veredito: NÃO CONFORME (magnésio e tirosina abaixo do mínimo). Selo removido** — a auditoria de 12/09 aprovou o cadastro-teto (magnésio 350 mg, tirosina 262,5 mg no mínimo exato), não o rótulo. O que destrava: reformular (magnésio ≥ 63 mg; tirosina ≥ 262,5 mg ou tirosina + fenilalanina ≥ 262,5 mg) e ficha técnica da L-teanina.

### 4.10 `moro-slim` — MORO SLIM × MoroSlim.pdf — **NÃO CONFORME**

Porção 1 g (2 cápsulas). Composição: migration 20260920000000 (11 linhas).

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.) 220 mg | saponinas **desconhecidas** | Saponinas de glicosídeos de furostanol / I·Extrato de semente de feno-grego ✓ (IN 304/2024) | NE | 450 mg de saponinas | **NÃO VERIFICADO** |
| 2 | Extrato seco de laranja Moro 175 mg | antocianinas **desconhecidas** | Antocianinas da laranja moro / I·Extrato de laranja moro ✓ | NE | 5 mg | **NÃO VERIFICADO** |
| 3 | Extrato seco de rizoma de cúrcuma 135 mg | curcuminoides **desconhecidos** | Curcumina / I·Extrato de rizomas de cúrcuma ✓ | 80 mg | 130 mg | **NÃO VERIFICADO** |
| 4 | Espirulina (Arthrospira platensis) 122 mg | proteína: no máximo 0,122 g | Proteínas / I·Espirulina — única entrada da espirulina no Anexo I é como fonte de proteínas | **8,4 g** | NE | **ABAIXO DO MÍNIMO** |
| 5 | Quitosana 122 mg | fibra | Fibras alimentares / I·Quitosana ✓ | 5,7 g (fibras totais) | NE | **ABAIXO DO MÍNIMO** — quitosana + psyllium + inulina = 232 mg |
| 6 | Extrato seco de semente de café verde 110 mg | ácido clorogênico e cafeína **desconhecidos** | Ácido clorogênico / I·Extrato de café verde ✓ | NE | 400 mg | **NÃO VERIFICADO** |
| 7 | Psyllium (Plantago ovata Forssk.) 66 mg | fibra | Fibras alimentares ✓ | idem | NE | ABAIXO DO MÍNIMO (soma acima) |
| 8 | Inulina de raiz de chicória 44 mg | fibra | Fibras alimentares ✓ | idem | NE | ABAIXO DO MÍNIMO (soma acima) |
| 9 | Dióxido de silício (INS 551) 2,474 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | CONFORME |
| 10 | Vitamina A (acetato de retinol) 1.500 mcg | 1.500 µg RAE (250% de 600); se acetato: 1.308 µg | Vitamina A ✓ | 135 | 2.623,61 µg | CONFORME |
| 11 | Cromo (picolinato de cromo) 250 mcg | 250 µg de cromo (elemento, declarado: 714% VD) | Cromo / I·Picolinato de cromo ✓ | 5,25 | 250 µg | CONFORME — igual ao máximo |

Soma: 998,22 mg em 1.000 mg (99,8%). Advertências: VI·26 (saponinas), VI·36 (antocianinas), VI·0 (ácido clorogênico/cafeína) — genérica presente; VI·53 (cúrcuma) — específica **ausente**.

**Veredito: NÃO CONFORME (espirulina e fibras abaixo do mínimo) e quatro extratos NÃO VERIFICADOS. Sem selo hoje; continua sem.**

### 4.11 `multivitaminico` — Multivitamínico × multivitaminico.pdf — **NÃO CONFORME**

Porção 1 g (2 cápsulas). Composição: migration 20260920000000 (20 linhas).

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Magnésio (de bisglicinato de magnésio) 260 mg | 260 mg (elemento, 62% VD) | Magnésio ✓ | 63 | 350 mg | CONFORME |
| 2 | L-teanina 150 mg | 150 mg | Teanina / origem não declarada (só Camellia sinensis é autorizada) | 50 | 250 mg | **NÃO VERIFICADO** (origem) |
| 3 | Vitamina C (ácido ascórbico) 100 mg | 100 mg | Vitamina C ✓ | 13,5 | 1.916,02 mg | CONFORME |
| 4 | Zinco (de bisglicinato de zinco) 15 mg | 15 mg (elemento, 136% VD) | Zinco ✓ | 1,65 | 29,59 mg | CONFORME |
| 5 | Vitamina B3 (nicotinamida) 16 mg | 16 mg NE | Niacina / I·Nicotinamida ✓ | 2,4 | 35 mg NE | CONFORME |
| 6 | Vitamina E (acetato de tocoferol) 10 mg | 10 × 0,67 = 6,7 mg α-tocoferol (se DL); ~9,1 mg se D | Vitamina E / acetato de D- ou de DL-alfa-tocoferol, ambos ✓ | 2,25 | 1000 mg | CONFORME |
| 7 | Vitamina B5 (pantotenato de cálcio) 5 mg | 5 mg | Ácido pantotênico ✓ | 0,75 | 5,64 mg | CONFORME |
| 8 | Boro (de quelato de boro) 3 mg | 3 mg de boro (elemento, declarado) | Boro / **"quelato de boro" não é forma autorizada** (Anexo I: frutoborato de cálcio; tetraborato de sódio decahidratado) | NE | 8,866 mg | **FORMA NÃO AUTORIZADA** (quantidade dentro do teto) |
| 9 | Vitamina B6 1,3 mg | 1,3 mg | Vitamina B6 ✓ | 0,26 | 98,60 mg | CONFORME |
| 10 | Vitamina B1 (cloridrato de tiamina) 1,2 mg | 1,2 mg | Tiamina ✓ | 0,18 | 2,02 mg | CONFORME |
| 11 | Vitamina B2 (riboflavina) 1,3 mg | 1,3 mg | Riboflavina ✓ | 0,20 | 2,74 mg | CONFORME |
| 12 | Vitamina A (acetato de retinol) 1.300 mcg | 1.300 µg RAE (217% de 600); se acetato: 1.133,6 µg | Vitamina A ✓ | 135 | 2.623,61 µg | CONFORME |
| 13 | Vitamina B9 (ácido fólico) 800 mcg | leitura literal: 800 mcg de ácido fólico → 800 / 0,6 = **1.333,33 µg DFE**; o teto de 1.281,5 DFE equivale a 768,9 mcg de ácido fólico | Ácido fólico ✓ | 60 | **1.281,5 µg DFE** | **ACIMA DO MÁXIMO** (4,0% acima) na leitura literal. O %VD impresso (200% de 400) só fecha se "800" já for DFE (= 480 mcg de ácido fólico, conforme). Contradição interna do rótulo — a fábrica precisa dizer qual é |
| 14 | Cobre (de bisglicinato de cobre) 0,9 mg | 900 µg | Cobre / I·Bisglicinato de cobre ✓ | 135 | 8.975,52 µg | CONFORME |
| 15 | Selênio (de selenito de sódio) 100 mcg | 100 µg | Selênio / I·Selenito de sódio ✓ | 8,25 | 319,75 µg | CONFORME |
| 16 | Vitamina K2 (menaquinona-7) 149 mcg | 149 µg | Vitamina K / I·Menaquinona-7 ✓ | 18 | 149,06 µg | CONFORME (99,96% do teto) |
| 17 | Vitamina D3 (colecalciferol) 50 mcg | 50 µg | Vitamina D ✓ | 3 | 50 µg | CONFORME — igual ao máximo |
| 18 | Cromo (de picolinato de cromo) 35 mcg | 35 µg | Cromo ✓ | 5,25 | 250 µg | CONFORME |
| 19 | Vitamina B12 (cianocobalamina) 9,94 mcg | 9,94 µg | Vitamina B12 ✓ | 0,36 | 9,94 µg | CONFORME — igual ao máximo |
| 20 | Dióxido de silício (INS 551) 10 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | CONFORME |

Soma dos itens impressos: 576,14 mg; convertendo os elementos em sais (magnésio 260 / 0,3038 = 855,8 mg; zinco 75 mg; boro 3 / 0,0543 = 55,2 mg), a fórmula passa de **1.400 mg — não cabe em 1 g**. Advertências: VI·0 (L-teanina) e VI·4 (boro) — genérica presente em `warnings`.

**Veredito: NÃO CONFORME (boro em forma não autorizada; ácido fólico acima do máximo na leitura literal). Selo removido.** O que destrava: trocar a fonte de boro por frutoborato de cálcio ou tetraborato de sódio decahidratado; esclarecer o ácido fólico (se for 800 mcg de substância, baixar para ≤ 768 mcg); ficha da L-teanina.

### 4.12 `pro-energy` — Pro Energy × ProEnergy.pdf — **NÃO VERIFICÁVEL**

Porção 1 g (2 cápsulas). Composição: migration 20260920000000 (9 linhas).

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Extrato seco de semente de feno-grego 250 mg | saponinas **desconhecidas** | Saponinas de glicosídeos de furostanol / I·Extrato de semente de feno-grego ✓ | NE | 450 mg | **NÃO VERIFICADO** |
| 2 | L-taurina 200 mg | 200 mg | Taurina ✓ | NE | 2.000 mg | CONFORME |
| 3 | Guaraná em pó (Paullinia cupana Kunth, semente) 200 mg | cafeína do guaraná **desconhecida** | Cafeína / I·Guaraná em pó (Paullinia cupana) ✓ | (soma na linha 4) | (soma na linha 4) | **NÃO VERIFICADO** — entra na cafeína total |
| 4 | Cafeína anidra 150 mg | 150 mg + cafeína do guaraná = total desconhecido; ultrapassa 200 mg se o guaraná tiver mais de 25% de cafeína (calculado: (200 − 150) / 200) | Cafeína / I·Cafeína (CAS 58-08-2) ✓ | 75 mg | 200 mg | **NÃO VERIFICADO** — 150 mg sozinhos estão na faixa; o total depende do laudo do guaraná |
| 5 | L-carnitina base 90 mg | 90 mg | L-Carnitina ✓ | NE | 2.000 mg | CONFORME |
| 6 | L-Aspartato de L-arginina 75 mg | 75 mg do sal (arginina e aspartato, cada um abaixo de 75 mg) | Arginina / I·L-Aspartato de L-arginina (CAS 7675-83-4) ✓ | NE | 3.810 mg (arginina); 5.320 mg (aspartato) | CONFORME |
| 7 | Bisglicinato de zinco 20 mg — sal; tabela nutricional: zinco 4 mg | **4 mg de zinco** (lido) | Zinco ✓ | 1,65 | 29,59 mg | CONFORME |
| 8 | Vitamina B6 (cloridrato de piridoxina) 10 mg | 10 mg | Vitamina B6 ✓ | 0,26 | 98,60 mg | CONFORME |
| 9 | Dióxido de silício (INS 551) 5 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | CONFORME |

Soma: **1.000,00 mg em 1.000 mg** (100,0% exatos, sem espaço para excipiente além do que está listado). Advertências exigidas: VI·0 (aminoácidos, carnitina, cafeína) e VI·26 (saponinas): "Este produto não deve ser consumido por gestantes, lactantes e crianças" — `warnings` no banco traz "CONTÉM CAFEÍNA. NÃO RECOMENDADO PARA GESTANTES, LACTANTES, CRIANÇAS E PESSOAS SENSÍVEIS À CAFEÍNA." — **texto diferente do exigido** ("não recomendado" no lugar de "não deve ser consumido").

**Veredito: NÃO VERIFICÁVEL (nenhuma violação confirmada; feno-grego e cafeína total dependem de laudo). Sem selo hoje; continua sem.** O que destrava: laudo do lote de guaraná (teor de cafeína) e laudo do extrato de feno-grego (saponinas).

### 4.13 `zma-zinco-magnesio-e-vitamina-d` — ZMA (Zinco, Magnésio e Vitamina B6) × ZmaComplex.pdf — **NÃO CONFORME**

Porção 1 g (2 cápsulas). Composição: migration 20260920000000 (7 linhas).

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Magnésio glicinato 500 mg — sal; tabela nutricional: magnésio 152 mg | **152 mg de magnésio** (lido; 30,4% de teor, coerente com o laudo INLAB de 30,38% citado na migration 20260915140000) | Magnésio / I·Bisglicinato de magnésio ✓ ("magnésio glicinato" é o nome comercial do mesmo sal, CAS 14783-68-7 — leitura minha, registrada) | 63 | 350 mg | CONFORME |
| 2 | Dióxido de silício (INS 551) 217,1 mg | aditivo — 21,7% da cápsula | IN 211/2023 14.2: quantum satis (antiumectante) | — | — | CONFORME pelo limite; observação: 217 mg de antiumectante numa cápsula de 1 g é dose de enchimento, não de "quantidade suficiente para o efeito tecnológico" — ponto para o RT |
| 3 | L-teanina 150 mg | 150 mg | Teanina / origem não declarada | 50 | 250 mg | **NÃO VERIFICADO** (origem) |
| 4 | Bisglicinato de zinco 75 mg — sal; tabela nutricional: zinco 15 mg | **15 mg de zinco** (lido) | Zinco ✓ | 1,65 | 29,59 mg | CONFORME |
| 5 | Quelato de boro (glicinato de boro) 56,6 mg — sal; elemento **não declarado** no rótulo | pelo laudo Analitic/INLAB lote 91125 (5,43%, citado na migration 20260915140000, não relido hoje): 56,6 × 0,0543 = 3,07 mg — **PROVISÓRIO** | Boro / **"quelato de boro"/"glicinato de boro" não é forma autorizada** | NE | 8,866 mg | **FORMA NÃO AUTORIZADA** |
| 6 | Vitamina B6 (cloridrato de piridoxina) 1,3 mg | 1,3 mg | Vitamina B6 ✓ | 0,26 | 98,60 mg | CONFORME |
| 7 | Vitamina D3 (colecalciferol) 25 mcg | 25 µg | Vitamina D ✓ | 3 | 50 µg | CONFORME |

Soma: 500 + 217,1 + 150 + 75 + 56,6 + 1,3 + 0,025 = **1.000,025 mg em 1.000 mg** (100,003%: 25 µg acima, arredondamento do rótulo). Advertências: VI·0 (L-teanina) e VI·4 (boro) — genérica presente.

**Veredito: NÃO CONFORME (boro em forma não autorizada). Selo removido** — a migration 20260915140000 já registrava o problema de identidade química do boro e decidiu medir "pela mesma vara" das outras; hoje a régua é o Anexo I lido na fonte, e "quelato de boro" não está nele. O que destrava: trocar a fonte de boro (frutoborato de cálcio ou tetraborato de sódio decahidratado) e ficha da L-teanina.

### 4.14 `dores-musculares` — DORES MUSCULARES × Nuviart.pdf — **NÃO CONFORME**

Porção 1 g (2 cápsulas). Composição auditada: JSON `nuviart` (14 itens). Fora da migration 20260920000000 (rótulo contraditório em sal × elemento). Onde o rótulo se contradiz, mostro as duas leituras.

| # | rótulo | ativo (conta) | constituinte / forma | mín | máx | veredito |
|---|---|---|---|---|---|---|
| 1 | Metilsulfonilmetano (MSM) 250 mg | 250 mg | Metilsulfonilmetano ✓ | NE | 900 mg | CONFORME |
| 2 | Sulfato de glucosamina 200 mg | 200 mg | Glucosamina / formas autorizadas: "Sulfato de glucosamina com cloreto de potássio" (IN 418/2025) ou cloridrato por fermentação; o rótulo não diz se é o sulfato com KCl | NE | 750 mg | **NÃO VERIFICADO** (forma incompleta no rótulo; quantidade dentro do teto) |
| 3 | Ácido ascórbico 140 mg | 140 mg | Vitamina C ✓ | 13,5 | 1.916,02 mg | CONFORME |
| 4 | Colágeno hidrolisado 100 mg | 0,1 g de proteína | Proteínas / I·Colágeno hidrolisado | **8,4 g** | NE | **ABAIXO DO MÍNIMO** |
| 5 | Carbonato de cálcio 100 mg — sal; elemento não declarado | estequiometria: Ca/CaCO3 = 40,078/100,086 = 40,04% → **40,0 mg de cálcio** (calculado; é o máximo físico possível) | Cálcio / I·Carbonato de cálcio ✓ | **180 mg** | 1.534,67 mg | **ABAIXO DO MÍNIMO** (22,2% do mínimo, mesmo no melhor caso) |
| 6 | Bisglicinato de magnésio 100 mg — sal; elemento não declarado | estequiometria (14,10%): 14,1 mg; laudo INLAB do projeto (30,38%, blend tamponado): 30,4 mg — **as duas leituras ficam abaixo de 63 mg** | Magnésio ✓ | **63 mg** | 350 mg | **ABAIXO DO MÍNIMO** na leitura "sal" (a única compatível com o texto da composição); só seria conforme se os 100 mg fossem elemento, o que o rótulo não diz |
| 7 | Colágeno tipo II não desnaturado 40 mg | 40 mg | Colágeno tipo II não desnaturado / I·Colágeno de frango com colágeno tipo II não desnaturado ✓ | 1,2 mg | NE | CONFORME |
| 8 | DL-alfa-tocoferol 20 mg | 20 mg (ou 13,4 mg a 0,67) | Vitamina E ✓ | 2,25 | 1000 mg | CONFORME |
| 9 | Bisglicinato de zinco 10 mg (composição: sal) × tabela nutricional "Zinco 10 mg" (elemento) | se sal: 10 × 30,62% (estequiométrico) = 3,06 mg ou 10 × 20% (laudo Galena) = 2,0 mg; se elemento: 10 mg | Zinco ✓ | 1,65 | 29,59 mg | CONFORME nas duas leituras |
| 10 | Bisglicinato de ferro 8 mg (composição: sal) × tabela "Ferro 8 mg" (elemento) | se sal: 8 × 27,38% = 2,19 mg (**abaixo** de 2,7); se elemento: 8 mg (conforme) | Ferro / I·Bisglicinato ferroso ✓ | 2,7 mg | 34,31 mg | **NÃO VERIFICADO** — o veredito muda conforme a leitura; só a ficha técnica resolve |
| 11 | Cloridrato de piridoxina 1,3 mg | 1,3 mg | Vitamina B6 ✓ | 0,26 | 98,60 mg | CONFORME |
| 12 | Selênio quelado 100 mcg | 100 µg | Selênio / **"selênio quelado" não é forma autorizada** | 8,25 | 319,75 µg | **FORMA NÃO AUTORIZADA** |
| 13 | Colecalciferol 50 mcg | 50 µg | Vitamina D ✓ | 3 | 50 µg | CONFORME — igual ao máximo |
| 14 | Metilcobalamina 9,94 mcg | 9,94 µg | Vitamina B12 ✓ | 0,36 | 9,94 µg | CONFORME — igual ao máximo |

Soma dos itens impressos: 969,46 mg em 1.000 mg (96,9%). Advertências: VI·4 (MSM, colágeno tipo II) — genérica presente; VI·28 (Glucosamina): "Este produto não deve ser consumido por gestantes, lactantes e crianças. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico." — a segunda frase **não está** em `warnings`.

**Veredito: NÃO CONFORME (colágeno hidrolisado, cálcio e magnésio abaixo do mínimo; selênio em forma não autorizada). Selo removido** — o selo de 12/09 foi dado ao cadastro-teto (MSM 480,5 mg, sem colágeno, sem carbonato de cálcio), que não é o rótulo. O que destrava: ficha técnica da fábrica (leitura sal × elemento do zinco e do ferro; teores de cálcio e magnésio; forma da glucosamina), troca do selênio e decisão sobre colágeno, cálcio e magnésio (subir aos mínimos ou retirar).

### 4.15 `pre-treino-creatina-sabor-limao-420g` — Pré-treino + Creatina Sabor Limão (420 g), "Césio 137" × PRÉ TREINO_CÉSIO 137_420g.pdf — **NÃO CONFORME (registro do parecer, não reaberto)**

Porção 14 g, 30 doses. Cadastro = rótulo (13 de 13). Parecer próprio: `docs/conformidade/PARECER-PRE-TREINO-CESIO-137-2026-09-15.md` (15/09/2026), com sete não conformidades. Registro aqui, sem reabrir, só o que a norma lida hoje confirma:

| insumo do rótulo | ativo | constituinte | mín | máx | situação registrada |
|---|---|---|---|---|---|
| Creatina monohidratada 5 g | 5.000 mg | Creatina | 3.000 | 5.000 mg | no teto exato (NC3 do parecer) |
| Beta-alanina 2 g | 2.000 mg em tomada única | Beta-alanina (IN 102/2021) | — | 2 g/dia | no teto; advertência VI·18 exige "doses divididas de, no máximo, 300 mg, com intervalo de duas horas" — o rótulo dá tudo numa dose (NC2) |
| L-arginina 3,810 g | 3.810 mg | Arginina | NE | 3.810 mg | no teto exato |
| Taurina 1 g; L-tirosina 1 g; L-carnitina 1 g | — | Taurina; Tirosina; L-Carnitina | NE; 262,5; NE | 2.000; 2.750; 2.000 mg | conformes em quantidade |
| Cafeína anidra 200 mg + extrato de guaraná 515 mg | cafeína total > 200 mg em qualquer cenário com guaraná > 0% (o parecer calcula 109% a 158% do limite) | Cafeína | 75 | 200 mg | **ACIMA DO MÁXIMO** (NC1), e "extrato de guaraná" (seco) não é nenhuma das formas do Anexo I — "guaraná em pó" e "extrato fluido de guaraná" (IN 450/2026) (NC5) |
| Magnésio 350 mg; vitamina B3 35 mg; vitamina B6 90 mg; B12 9,94 mcg; D3 50 mcg | elementos/ativos declarados | Magnésio; Niacina; B6; B12; D | — | 350; 35; 98,60; 9,94; 50 | magnésio, B3, B12 e D3 no teto exato; B6 a 91,3% do teto |

Soma: 15.000,06 mg em 14.000 mg (**107,1% da porção** — NC6). Advertências: VI·0 (aminoácidos, carnitina, creatina, taurina, cafeína) — `warnings` traz "Este produto não é recomendado para crianças, gestantes, lactantes e pessoas sensíveis à cafeína" (texto mais fraco que o exigido, NC4); VI·18 (beta-alanina) — **ausente**.

**Veredito: NÃO CONFORME. Sem selo hoje; não volta** (ordem já registrada no parecer).

---

## 5. Selos: o que a migration `20260921000000_selos_conforme_rotulo.sql` faz com cada fórmula

Estado lido ao vivo em 15/09/2026 18:31: **12 fórmulas com `compliance_verified_at` preenchido** (10 com 2026-09-12 04:00 UTC = 00:00 −04:00; 2 — Biotina em Cápsula e ZMA — com 2026-09-13 00:00 UTC = 20:00 −04:00 de 12/09).

| # | slug | selo hoje | veredito desta auditoria | ação da migration | motivo |
|---|---|---|---|---|---|
| 1 | `bella-gummy-biotina-em-gummy` | sim | 100% CONFORME | **concede** (regrava com data de hoje e normas `{IN 28/2018}`) | 5 de 5 insumos conformes |
| 2 | `creatina-monohidratada-150g-soluvel` | sim | 100% CONFORME | **concede** (`{IN 28/2018, IN 373/2025}`) | creatina 5.000 = teto da IN 373/2025 |
| 3 | `creatina-gummy-sabor-frutas-vermelhas` | sim | 100% CONFORME | **concede** (`{IN 28/2018, IN 373/2025}`) | creatina 3.000 = mínimo |
| 4 | `melatonina-em-gummy-sabor-uva` | sim | 100% CONFORME | **concede** (`{IN 28/2018, IN 102/2021}`) | triptofano e melatonina na faixa (nos dois cenários de composição) |
| 5 | `serena` | sim | NÃO VERIFICÁVEL | **remove** | L-teanina sem origem declarada (só Camellia sinensis é autorizada) |
| 6 | `biotina-em-capsula` | sim | NÃO CONFORME | **remove** | colágeno hidrolisado 120 mg < 8,4 g; selênio quelado (forma não autorizada) |
| 7 | `focus-colina` | sim | NÃO CONFORME | **remove** | magnésio 60 < 63 mg; tirosina 220 < 262,5 mg; L-teanina sem origem |
| 8 | `multivitaminico` | sim | NÃO CONFORME | **remove** | quelato de boro (forma não autorizada); ácido fólico 1.333 DFE > 1.281,5 na leitura literal; L-teanina sem origem |
| 9 | `zma-zinco-magnesio-e-vitamina-d` | sim | NÃO CONFORME | **remove** | quelato de boro (forma não autorizada); L-teanina sem origem |
| 10 | `dores-musculares` | sim | NÃO CONFORME | **remove** | colágeno hidrolisado, cálcio e magnésio abaixo do mínimo; selênio quelado; rótulo contraditório |
| 11 | `creatina-em-gummy-sabor-tutti-frutti` | sim | sem rótulo; pelo cadastro: 100% CONFORME PELO CADASTRO (Parte II) | **remove** nesta migration; a `20260921100000` devolve o selo **só após confirmação escrita do dono** | sem documento de composição além do cadastro; "mesma fórmula da irmã" é inferência, não leitura |
| 12 | `creatina-monohidratada-300g-soluvel` | sim | sem rótulo; pelo cadastro: 100% CONFORME PELO CADASTRO (Parte II) | **remove** nesta migration; idem `20260921100000` | idem |
| 13–24 | as outras 12 (Detox, Saúde Intestinal, Moro Slim, Pro Energy, Pré-treino Césio 137 e as 7 sem rótulo e sem selo) | não | NÃO CONFORME / NÃO VERIFICÁVEL / COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO | nada a fazer (a varredura final da migration garante que continuam sem selo) | seções 4 e Parte II |

Resultado da `20260921000000`: **4 selos concedidos (todos já existiam e são reafirmados com a auditoria de hoje), 8 removidos, 4 no banco ao final.** A migration casa por `slug`, pressupõe a `20260920000000` aplicada antes (confere isso na guarda 0) e aborta com `raise exception` se a contagem final não for exatamente 4. A `20260921100000` (Parte II) acrescenta, condicionalmente, os 2 selos das creatinas sem rótulo (total 6). Quadro final dos 24 na seção II.11.

---

## 6. Sobre os 12 selos atuais: quais não se sustentavam e por quê

- **4 se sustentam** (BELLA GUMMY, Creatina 150 g, Creatina Gummy Frutas Vermelhas, Melatonina em Gummy): o cadastro auditado em 12/09 já era o rótulo, e a releitura de hoje na fonte primária confirma insumo a insumo.
- **1 se sustentava em quantidade, mas não em forma** (Serena): tudo dentro da faixa; a origem da L-teanina nunca foi olhada.
- **4 foram dados ao cadastro-teto, não ao rótulo** (Focus Colina, Multivitamínico, ZMA, Dores Musculares): com os números impressos, três têm mínimo não atingido ou máximo ultrapassado, e três têm forma não autorizada (boro, selênio).
- **1 foi dado a uma fórmula com forma não autorizada já apontada em 13/09** (Biotina em Cápsula: selênio quelado) e com o colágeno abaixo do mínimo no rótulo impresso.
- **2 não tinham documento de composição** (Creatina 300 g e Creatina Gummy Tutti-frutti).

---

## 7. As 9 fórmulas sem rótulo: o que pedir à fábrica

Na Parte I (rótulos) nenhuma delas pôde ser auditada — não há documento de composição com procedência (arte de rótulo ou ficha técnica assinada pelo RT). Por ordem do dono, a **Parte II** deste documento as audita contra o **cadastro atual do catálogo**, com a procedência marcada ("o dono é a fonte"). O que pedir à fábrica continua o mesmo, e a Parte II acrescenta o que cada cadastro esconde ou contradiz:

| slug | nome no banco | pedir à fábrica |
|---|---|---|
| `creatina-em-gummy-sabor-tutti-frutti` | CREATINA EM GUMMY SABOR TUTTI-FRUTTI | arte-final do rótulo (ou ficha técnica) desta variante; confirmar se é a mesma receita da Frutas Vermelhas (3.000 mg de creatina em 2 gomas) |
| `creatina-monohidratada-300g-soluvel` | CREATINA MONOIDRATADA 300 g SOLÚVEL | arte-final do rótulo do pote de 300 g (porção, doses e composição) |
| `emagrecedor-em-capsula` | Emagrecedor Em Cápsula | arte-final ou ficha técnica completa (o cadastro tem um único insumo, o que não descreve um produto) |
| `melatonina-triptofanos-encapsulados` | Melatonina + Triptofanos (Encapsulados) | arte-final ou ficha técnica (o cadastro traz zinco 29,59 mg = teto legal, sinal de cadastro-teto) |
| `multi-vitta-gestante-e-lactante-em-capsula` | Multi Vitta — Gestante e Lactante em Cápsula | arte-final ou ficha técnica; **atenção**: público gestante/lactante usa as colunas "Gestantes"/"Lactantes" dos Anexos III e IV (tetos menores: cromo 45/67,5 µg; vitamina A 2.414,35/2.434,07 µg; ácido fólico 1.138,3/1.162,3 DFE; magnésio 350; zinco 23,50/24,45 mg), e vários bioativos são NA nesses grupos; corrigir `target_audience` (hoje "Adultos com 19 anos ou mais") |
| `omega-pro-tg` | Ômega Pró TG | arte-final ou ficha técnica com EPA e DHA por porção (Anexo III, "> 19 anos": mín. 37,5 mg; Anexo IV: máx. 2.000 mg; a exigência de "no mínimo 30 mg de DHA" vale para as colunas de gestantes e lactantes, 45 mg) |
| `pre-treino-300-g` | PRÉ TREINO 300 G | arte-final ou ficha técnica; se tiver cafeína e guaraná, laudo do guaraná |
| `shot-colageno-300-gramas` | SHOT + COLÁGENO 300 GRAMAS | arte-final ou ficha técnica; colágeno hidrolisado é fonte de proteínas (mín. 8,4 g/dia) — conferir a dose |
| `slim-up-emagrecimento-em-gota` | Slim Up — EMAGRECIMENTO EM GOTA | arte-final ou ficha técnica (a ficha de 30/07/2026 citada em `correcoes-de-dados.md` contradiz o cadastro); corrigir `target_audience` |

---

## 8. O que só a fábrica ou o fornecedor resolve (lista objetiva)

1. **Ficha técnica/laudo da L-teanina** declarando origem "folhas de *Camellia sinensis*" (especificação Blue California) — destrava Serena (volta a 100% CONFORME) e é pré-requisito para Focus Colina, Multivitamínico e ZMA.
2. **Trocar a fonte de boro** (Multivitamínico 3 mg; ZMA 56,6 mg de quelato) por frutoborato de cálcio ou tetraborato de sódio decahidratado, com laudo de teor de boro.
3. **Trocar "selênio quelado"** (Biotina em Cápsula 60 µg; Dores Musculares 100 µg) por uma das cinco formas autorizadas, nomeada no rótulo, com laudo.
4. **Reformular o Focus Colina**: magnésio ≥ 63 mg de elemento; tirosina ≥ 262,5 mg (ou tirosina + fenilalanina ≥ 262,5 mg).
5. **Reformular o Detox**: zinco ≥ 1,65 mg de elemento (hoje 0,29 mg) ou retirar o zinco da composição.
6. **Multivitamínico, ácido fólico**: dizer se "800 mcg" é substância (então baixar para ≤ 768 mcg) ou DFE (então o rótulo precisa declarar em DFE e a substância é 480 mcg).
7. **Colágeno hidrolisado abaixo do mínimo** (Biotina em Cápsula 120 mg; Dores Musculares 100 mg): retirar do rótulo ou levar a 8,4 g (inviável em cápsula) — decisão de formulação.
8. **Fibras e espirulina declaradas como ativo abaixo do mínimo** (Saúde Intestinal: psyllium + inulina + FOS = 567 mg; Moro Slim: quitosana + psyllium + inulina = 232 mg e espirulina 122 mg): retirar, subir a 5,7 g/8,4 g (inviável em cápsula), ou reposicionar como ingrediente do Art. 6 — só o RT pode enquadrar.
9. **Laudos de padronização dos extratos**: cúrcuma (curcuminoides totais, faixa 80–130 mg) no Detox, Saúde Intestinal e Moro Slim; laranja moro (antocianinas ≤ 5 mg) no Detox e Moro Slim; café verde (ácido clorogênico ≤ 400 mg e cafeína) no Detox e Moro Slim; feno-grego (saponinas ≤ 450 mg) no Moro Slim e Pro Energy.
10. **Laudo do guaraná** (teor de cafeína) para fechar a cafeína total do Pro Energy (e do Pré-treino Césio 137, já reprovado).
11. **Dores Musculares (Nuviart)**: ficha técnica dizendo se zinco 10 mg e ferro 8 mg são sal ou elemento, quanto cálcio e magnésio elementares existem, e se a glucosamina é "sulfato com cloreto de potássio".
12. **Biotina em Cápsula**: ficha do cobre ("cobre quelado" → qual forma) e do hialuronato de sódio (origem por fermentação de *S. zooepidemicus*).
13. **Fórmulas que não cabem na porção** (soma dos sais > 1 g): Saúde Intestinal, Focus Colina, Multivitamínico; Detox e ZMA passam da porção por arredondamento; Pré-treino Césio 137 em 107%. Ficha técnica de produção de cada uma.
14. **Melatonina em Gummy**: confirmar se o pote em produção leva L-triptofano 800 mg (Dream Gummy) ou só melatonina 0,21 mg — não muda o veredito de limites, muda o que o catálogo exibe.
15. **Advertências do Anexo VI faltando no `warnings`** (pendência de cadastro/rotulagem, não do selo): melatonina (Melatonina em Gummy — campo vazio — e Serena); creatina (Creatina Gummy Frutas Vermelhas — campo vazio, migration 20260920100000 em disco); cúrcuma (Detox, Saúde Intestinal, Moro Slim); glucosamina (Dores Musculares); frase literal "não deve ser consumido" no Pro Energy e no Pré-treino; beta-alanina (Pré-treino).
16. **As 9 artes de rótulo/fichas técnicas** da seção 7.

---

## Parte II — 9 fórmulas sem rótulo, auditadas contra o cadastro (ordem do dono, 15/09/2026)

**Ordem recebida:** "confere cada insumo se está dentro do mínimo e máximo em TODOS os produtos". Como estas 9 fórmulas não têm arte de rótulo, a única declaração de composição que existe é o **cadastro atual do catálogo** (`public.formula_compositions`, linhas ativas, lidas ao vivo pela chave pública em **15/09/2026 às 19:36 (UTC−4)** — arquivo `compositions_prod.json`; `usage_instructions`, `warnings`, `ingredients_list` e `target_audience` lidos às 19:38, `formulas_9.json`). **Procedência de todas as tabelas desta parte: composição = cadastro do catálogo, sem rótulo para conferir; o dono é a fonte.** Mesmas regras da seção 2 e mesmas fontes primárias da seção 1 ([F1] IN 28/2018 consolidada; [F2] RDC 243/2018; [F3] IN 211/2023, categoria 14.2; [F4] painel como contraprova — usado aqui para "Óleo de peixe", captura `painel_oleo_peixe.png`, 19:40).

Regras a mais, pedidas na ordem ou exigidas pelo caso:

- **Soma acima da porção invalida a composição** mesmo com todo insumo na faixa: veredito **COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO**, sem selo. A soma é feita duas vezes: como está escrita no cadastro e, quando o cadastro declara **elemento** mineral, com a massa do sal necessária para entregar esse elemento (a cápsula carrega o sal, não o elemento).
- **Convenção do cadastro para minerais (assumida, marcada como tal):** "magnésio (bisglicinato de magnésio) 63 mg" = 63 mg do **elemento** — é a convenção que o próprio catálogo documenta (`COMPOSICOES-ROTULO-VS-CADASTRO-2026-09-15.md`, seção 9, item 1) e que os rótulos das outras 15 confirmam ("Magnésio (de bisglicinato de magnésio) 260 mg"). Sem rótulo, isso é **assumido**; por isso, onde a leitura alternativa (massa do sal) mudaria o veredito, as duas leituras aparecem.
- **Cadastro contraditório:** quando `ingredients_list` da mesma fórmula declara ingrediente que não está na composição, o cadastro não descreve uma composição única e o selo não pode afirmar que a conferiu — fica NÃO VERIFICÁVEL, com o que falta listado.

Faixa etária: "> 19 anos" em 8 fórmulas; **Multi Vitta Gestante e Lactante** usa as colunas **Gestantes e Lactantes** (as duas, e vale a mais restritiva), apesar de `target_audience` no banco dizer "Adultos com 19 anos ou mais".

### II.1 `creatina-em-gummy-sabor-tutti-frutti` — CREATINA EM GUMMY SABOR TUTTI-FRUTTI — **100% CONFORME PELO CADASTRO**

Cadastro: 1 linha. Modo de uso: "Consumir 2 gomas ao dia". `nutritional_info` diz só "3 g de creatina / Base da Gummy" — a massa da porção não está declarada (a irmã com rótulo tem 6 g por 2 gomas). `warnings` e `ingredients_list` vazios.

| # | cadastro | ativo | constituinte / forma (Anexo I) | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | creatina monoidratada 3.000 mg | 3.000 mg | Creatina / I·Creatina monohidratada ✓ | 3.000 mg | 5.000 mg (IN 373/2025) | > 19 anos | [F1] III·Creatina, IV·Creatina, 15/09/2026; [F4] contraprova | CONFORME — igual ao mínimo |

Soma: 3.000 mg; porção em massa não declarada no cadastro (não dá para calcular o percentual; na irmã Frutas Vermelhas são 6 g, 50%). Advertência VI·0 (creatina) exigida — `warnings` vazio (pendência de cadastro).

**Veredito: 100% CONFORME PELO CADASTRO.** Selo só com confirmação escrita do dono de que o cadastro é a formulação real (migration `20260921100000`, seção II.10).

### II.2 `creatina-monohidratada-300g-soluvel` — CREATINA MONOIDRATADA 300 g SOLÚVEL — **100% CONFORME PELO CADASTRO**

Cadastro: 1 linha. Modo de uso: "Diluir 5 g (1 dose) em 200 mL de água e consumir 1 vez ao dia". `warnings` e `ingredients_list` vazios.

| # | cadastro | ativo | constituinte / forma (Anexo I) | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | creatina monoidratada 5.000 mg | 5.000 mg | Creatina / I·Creatina monohidratada ✓ | 3.000 mg | 5.000 mg (IN 373/2025) | > 19 anos | [F1] III/IV·Creatina, 15/09/2026; [F4] contraprova | CONFORME — igual ao máximo |

Soma: 5.000 mg em 5.000 mg (100,0%). Advertência VI·0 (creatina) exigida — `warnings` vazio (pendência de cadastro).

**Veredito: 100% CONFORME PELO CADASTRO.** Mesma condição da II.1.

### II.3 `emagrecedor-em-capsula` — Emagrecedor Em Cápsula — **NÃO VERIFICÁVEL (cadastro incompleto)**

Cadastro: **1 linha** para uma porção de 1 g (2 cápsulas). `ingredients_list` do mesmo cadastro declara **12 ingredientes**: spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, picolinato de cromo, laranja moro, extrato seco de feno-grego e extrato de café verde — 11 deles sem quantidade nenhuma na composição.

| # | cadastro | ativo (conta) | constituinte / forma | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | picolinato de Cromo 250 mcg | se 250 mcg é cromo (elemento; o valor é o teto exato, padrão cadastro-teto): 250 µg; se é massa do picolinato de cromo (12,43% de Cr, calculado: 51,996/418,31): 31,1 µg | Cromo / I·Picolinato de cromo ✓ | 5,25 µg | 250 µg | > 19 anos | [F1] III/IV·Cromo, 15/09/2026 | CONFORME nas duas leituras |

Soma: 0,25 mg em 1.000 mg (0,03% da porção declarada); 99,97% da massa sem declaração. Advertências: os 11 ingredientes sem quantidade incluem cafeína (guaraná), ácido clorogênico, saponinas e antocianinas (VI·0, 26, 36) e cúrcuma (VI·53); `warnings` traz só a frase genérica.

**Veredito: NÃO VERIFICÁVEL — o cadastro não descreve a composição** (uma linha de 0,25 mg numa cápsula de 1 g, com 11 ingredientes declarados sem quantidade). Sem selo. O que destrava: ficha técnica ou arte de rótulo com a composição completa; extratos com laudo de padronização; guaraná com laudo de cafeína.

### II.4 `melatonina-triptofanos-encapsulados` — Melatonina + Triptofanos (Encapsulados) — **COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO**

Cadastro: 9 linhas, porção 1 g (2 cápsulas), "Ingerir 2 cápsulas ao dia". `warnings` e `ingredients_list` vazios.

| # | cadastro | ativo (conta) | constituinte / forma | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | L-triptofano 572,38 mg | 572,38 mg | Triptofano / I·L-Triptofano ✓ | 42 mg | 860 mg | > 19 | [F1] III/IV·Triptofano | CONFORME |
| 2 | ácido L-aspártico 150 mg | 150 mg | Aspartato / I·Ácido L-aspártico ✓ | NE | 5.320 mg | > 19 | [F1] III/IV·Aspartato | CONFORME |
| 3 | L-glutamina 94,77 mg | 94,77 mg | Glutamina / I·L-Glutamina ✓ | NE | 5.000 mg | > 19 | [F1] III/IV·Glutamina | CONFORME |
| 4 | fosfatidilserina 70 mg | 70 mg | Fosfatidilserina / Anexo I autoriza "Fosfatidilserina de lecitina de soja" e "Lecitina de soja com alto teor de fosfatidilserina"; o cadastro não declara a origem | NE | 400 mg | > 19 | [F1] III/IV·Fosfatidilserina | **NÃO VERIFICADO** (origem do insumo; quantidade dentro do teto) |
| 5 | magnésio (bisglicinato de magnésio) 63 mg | leitura A (convenção do cadastro, assumida): 63 mg de magnésio = mínimo exato; leitura B (massa do sal): 63 × 0,3038 = 19,1 mg (laudo INLAB citado na migration 20260915140000) ou 63 × 0,1410 = 8,9 mg (estequiométrico) | Magnésio / I·Bisglicinato de magnésio ✓ | 63 mg | 350 mg | > 19 | [F1] III/IV·Magnésio | leitura A: CONFORME (igual ao mínimo, margem zero); leitura B: **ABAIXO DO MÍNIMO** |
| 6 | zinco (bisglicinato de zinco) 29,59 mg | leitura A: 29,59 mg de zinco = teto exato; leitura B: 29,59 × 0,20 = 5,92 mg (laudo Galena) ou 9,06 mg (estequiométrico) | Zinco / I·Bisglicinato de zinco ✓ | 1,65 mg | 29,59 mg | > 19 | [F1] III/IV·Zinco | CONFORME nas duas leituras (A: igual ao máximo) |
| 7 | dióxido de silício (INS 551) 20,01 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | — | [F3] | CONFORME |
| 8 | melatonina 0,21 mg | 0,21 mg | Melatonina / I·Melatonina ✓ | NE | 0,21 mg | > 19 | [F1] IV·Melatonina | CONFORME — igual ao máximo |
| 9 | biotina (D-biotina) 45 mcg | 45 µg | Biotina / I·D-biotina ✓ | 4,5 µg | 45 µg | > 19 | [F1] III/IV·Biotina | CONFORME — igual ao máximo |

Soma como escrita: **1.000,005 mg em 1.000 mg** (100,0005% — passa por 5 µg, arredondamento). Soma com os sais que entregam os elementos da leitura A: 1.000,005 − 63 − 29,59 + 207,4 (bisglicinato de Mg a 30,38%) + 147,9 (bisglicinato de Zn a 20%) = **1.262,7 mg = 126,3% da porção** (145,1% no cálculo estequiométrico). Quatro insumos exatamente no limite (magnésio no mínimo; zinco, melatonina e biotina no máximo) — padrão de cadastro-teto. Advertências exigidas: VI·0 (aminoácidos, fosfatidilserina) e VI·21 (melatonina, texto específico) — `warnings` vazio.

**Veredito: COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO** (na leitura A, a única em que o magnésio atinge o mínimo). Na leitura B a soma fecha em 1.000 mg, mas o magnésio fica ABAIXO DO MÍNIMO. Não há leitura em que a fórmula passe. Sem selo. O que destrava: ficha técnica dizendo o que os 63 mg e os 29,59 mg são (sal ou elemento), teor dos quelatos, origem da fosfatidilserina e uma formulação que caiba em 1 g.

### II.5 `multi-vitta-gestante-e-lactante-em-capsula` — Multi Vitta — Gestante e Lactante em Cápsula — **NÃO CONFORME e COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO**

Cadastro: 12 linhas, porção 1 g (2 cápsulas), "Ingerir 2 cápsulas ao dia". Público real: gestantes e lactantes (nome do produto e `warnings`); `target_audience` no banco está errado ("Adultos com 19 anos ou mais"). `ingredients_list` declara ainda vitamina A, vitamina K2, "complexo B", biotina, cromo e selênio, que **não estão** na composição — cadastro incompleto. Limites: colunas **Gestantes** e **Lactantes** dos Anexos III e IV [F1], lidas em 15/09/2026; o veredito usa a mais restritiva.

| # | cadastro | ativo (conta) | constituinte / forma | mín (gest. / lact.) | máx (gest. / lact.) | fonte | veredito |
|---|---|---|---|---|---|---|---|
| 1 | dióxido de silício (INS 551) 592,14 mg | aditivo — **59,2% da cápsula** | IN 211/2023 14.2: quantum satis (antiumectante) | — | — | [F3] | CONFORME pelo limite; 592 mg de antiumectante em 1 g não é "quantidade suficiente para o efeito tecnológico" — ponto para o RT |
| 2 | cálcio elementar (carbonato de cálcio) 300 mg | 300 mg de cálcio (o cadastro diz "elementar") | Cálcio / I·Carbonato de cálcio ✓ | 195 / 195 mg | 2.015,51 / 2.082,58 mg | [F1] III/IV·Cálcio | CONFORME |
| 3 | magnésio (bisglicinato de magnésio) 60 mg | leitura A (assumida): 60 mg de magnésio; leitura B (sal): 18,2 mg (30,38%) | Magnésio ✓ | 60 / 54 mg | 350 / 350 mg | [F1] III/IV·Magnésio | leitura A: CONFORME (igual ao mínimo de gestantes); leitura B: ABAIXO DO MÍNIMO |
| 4 | vitamina C (ácido ascórbico) 20 mg | 20 mg | Vitamina C ✓ | 12,75 / 18 mg | 1.723,43 / 1.726,73 mg | [F1] III/IV·Vitamina C | CONFORME |
| 5 | ferro (bisglicinato ferroso) 8,1 mg | leitura A (assumida): 8,1 mg de ferro; leitura B (sal, 27,38% estequiométrico): 2,22 mg | Ferro / I·Bisglicinato ferroso ✓ | 4,05 / 1,5 mg | 34,71 / 34,96 mg | [F1] III/IV·Ferro | leitura A: CONFORME; leitura B: ABAIXO DO MÍNIMO de gestantes |
| 6 | vitamina B3 (nicotinamida) 8 mg | 8 mg NE | Niacina / I·Nicotinamida ✓ | 2,7 / 2,55 mg | 30 / 30 mg | [F1] III/IV·Niacina | CONFORME |
| 7 | vitamina B5 (D-pantotenato de cálcio) 5 mg | 5 mg | Ácido pantotênico ✓ | 0,9 / 1,05 mg | 5,83 / 5,49 mg | [F1] III/IV·Ácido pantotênico | CONFORME |
| 8 | vitamina E (acetato de DL-alfa-tocoferol) 5 mg | 5 × 0,67 = 3,35 mg de α-tocoferol (nota iii) | Vitamina E / I·Acetato de DL-alfa-tocoferol ✓ | 2,25 / 2,85 mg | 800 / 800 mg | [F1] III/IV·Vitamina E | CONFORME (3,35 ≥ 2,85, margem de 0,5 mg) |
| 9 | cobre (bisglicinato de cobre) 900 mcg | 900 µg (convenção) | Cobre / I·Bisglicinato de cobre ✓ | 150 / 195 µg | 6.935,01 / 7.036,33 µg | [F1] III/IV·Cobre | CONFORME |
| 10 | ácido fólico 800 mcg | leitura literal: 800 / 0,6 = **1.333,3 µg DFE**; o teto de gestantes equivale a 683,0 mcg de ácido fólico e o de lactantes a 697,4 mcg (calculado) | Ácido fólico ✓ | 666,6 / 75 µg DFE | **1.138,3 / 1.162,3 µg DFE** | [F1] III/IV·Ácido fólico (IN 76/2020; IN 102/2021) | **ACIMA DO MÁXIMO** nos dois grupos (17,1% acima em gestantes; 14,7% em lactantes). Se o cadastro já estivesse em DFE (800), seria conforme — o cadastro diz "ácido fólico 800 mcg" |
| 11 | vitamina D (colecalciferol) 50 mcg | 50 µg | Vitamina D ✓ | 2,25 / 2,25 µg | 50,0 / 50,0 µg | [F1] III/IV·Vitamina D | CONFORME — igual ao máximo |
| 12 | vitamina B12 (metilcobalamina) 10,46 mcg | 10,46 µg | Vitamina B12 / I·Metilcobalamina ✓ | 0,39 / 0,42 µg | **10,46 / 10,07 µg** | [F1] III/IV·Vitamina B12 | gestantes: CONFORME (igual ao máximo); **lactantes: ACIMA DO MÁXIMO** (10,46 > 10,07, 3,9% acima) — o cadastro copiou o teto de gestantes e ignorou o de lactantes |

Soma como escrita: 1.000,0005 mg (100,00%). Soma com os sais: só o carbonato de cálcio necessário para 300 mg de cálcio elementar pesa 300 / 0,4004 = **749,2 mg** → 1.449,2 mg = **144,9%**; com bisglicinato de magnésio (197,5 mg a 30,38%), bisglicinato ferroso (29,6 mg) e bisglicinato de cobre (3,0 mg) → 1.610,3 mg = **161,0%**. Advertências: o Anexo VI não exige frase específica destes constituintes para gestantes e lactantes; `warnings` traz as três frases do Art. 14 da RDC 243 e a orientação de consumo sob acompanhamento médico.

**Veredito: NÃO CONFORME (ácido fólico acima do máximo nos dois grupos; vitamina B12 acima do máximo de lactantes) e COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (144,9% a 161,0%).** Sem selo. O que destrava: reformular para caber em 1 g (o carbonato de cálcio sozinho ocupa 75% da cápsula), ácido fólico ≤ 683 mcg (ou declarar em DFE), B12 ≤ 10,07 mcg, completar a composição com os insumos que a lista de ingredientes declara, corrigir `target_audience`.

### II.6 `omega-pro-tg` — Ômega Pró TG — **NÃO VERIFICÁVEL (interpretação do mínimo de lipídeos pendente)**

Cadastro: 5 linhas, porção 1 g (2 softgels), "Ingerir 2 softgels ao dia". As linhas 2 a 5 (ômega-3 total, EPA, DHA, outros ômega-3) são **componentes** da linha 1 (óleo de peixe), não massa adicional: 185,34 + 123,56 + 7,6 = 316,5 = ômega-3 total (fecha). `warnings` e `ingredients_list` vazios.

| # | cadastro | ativo (conta) | constituinte / forma | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | óleo de peixe TG 1.000 mg | 1.000 mg de lipídeos | Lipídeos / I·Óleo de peixe ✓ (grupo "Lipídeos" do Anexo I, redação IN 431/2026) | **Lipídeos totais: 5 g** | NE | > 19 | [F1] III·Lipídeos totais; [F4] painel "Óleo de peixe": função "Fonte de EPA / Fonte de DHA", e para maiores de 19 anos mostra "Lipídeos: Mínimo: 5g; Máximo: Não estabelecido" além da faixa de EPA e DHA (captura `painel_oleo_peixe.png`) | **NÃO VERIFICADO** — na leitura literal (Anexo I põe o óleo de peixe no grupo Lipídeos; Anexo III exige 5 g de lipídeos totais; o painel oficial mostra esse mínimo para o óleo de peixe em adultos), 1 g fica ABAIXO DO MÍNIMO. Se o óleo de peixe for tratado só como fonte de EPA e DHA (função que o painel lhe atribui), está conforme. Reprovar depende dessa confirmação, que cabe ao RT/ANVISA — por isso não reprovo nem aprovo |
| 2 | ômega-3 total 316,5 mg | componente do óleo | (não é constituinte listado; soma de EPA + DHA + outros) | — | — | — | — | informativo |
| 3 | EPA 185,34 mg | 185,34 mg | EPA e DHA (Anexo III/IV) | 37,5 mg (EPA + DHA) | 2.000 mg (EPA + DHA) | > 19 | [F1] III/IV·EPA e DHA | CONFORME — EPA + DHA = 308,9 mg |
| 4 | DHA 123,56 mg | 123,56 mg | EPA e DHA | idem | idem | > 19 | idem | CONFORME (na soma) |
| 5 | outros ácidos graxos ômega-3 7,6 mg | componente do óleo | — | — | — | — | — | informativo |

Soma real: 1.000 mg de óleo em 1.000 mg (100,0%); a soma ingênua das 5 linhas (1.633 mg) conta os componentes duas vezes e não é massa. Advertências: o Anexo VI não exige frase para EPA e DHA de óleo de peixe; `warnings` está vazio (as três frases do Art. 14 da RDC 243 faltam — pendência de cadastro).

**Veredito: NÃO VERIFICÁVEL.** Sem selo. O que destrava: posição escrita do RT (ou resposta da ANVISA) sobre a aplicação do mínimo de 5 g de lipídeos totais a suplemento de óleo de peixe; se não se aplica, a fórmula é 100% CONFORME PELO CADASTRO (EPA + DHA 308,9 mg dentro de 37,5–2.000 mg).

### II.7 `pre-treino-300-g` — PRÉ TREINO 300 G — **NÃO VERIFICÁVEL (cadastro contraditório)**

Cadastro: 10 linhas, porção 10 g (1 dose) diluída em 200 mL, 1 vez ao dia. `ingredients_list` do mesmo cadastro declara **"L-citrulina malato"** e um **"corante artificial (INS)"** que **não estão** na composição — e a composição já soma exatamente 10.000 mg, sem massa para eles. **L-citrulina (malato ou não) não consta do Anexo I** [F1] (a única entrada com citrulina é "L-citrulinilarginina", IN 102/2021); se o produto a contiver, é FORMA NÃO AUTORIZADA.

| # | cadastro | ativo (conta) | constituinte / forma | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | creatina monoidratada 5.000 mg | 5.000 mg | Creatina ✓ | 3.000 | 5.000 mg (IN 373/2025) | > 19 | [F1] III/IV·Creatina | CONFORME — igual ao máximo |
| 2 | L-taurina 2.000 mg | 2.000 mg | Taurina ✓ | NE | 2.000 mg | > 19 | [F1] IV·Taurina | CONFORME — igual ao máximo |
| 3 | ácido cítrico (INS 330) 1.100 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | — | [F3] | CONFORME |
| 4 | L-tirosina 500 mg | 500 mg | Tirosina ✓ | 262,5 mg | 2.750 mg | > 19 | [F1] III/IV·Tirosina | CONFORME |
| 5 | aromatizante idêntico ao natural de limão 350 mg | aditivo, 3,5% do pó | IN 211/2023 14.2: quantum satis; 2% só para aromatizante de extrato vegetal; pó para preparo não é cápsula | — | — | — | [F3] | CONFORME (condicionado ao aroma ser idêntico ao natural, como cadastrado) |
| 6 | maltodextrina 342 mg | veículo | Carboidratos / I·Maltodextrina; Art. 6, § único, RDC 243 afasta o mínimo | (19,5 g, não aplicável) | NE | > 19 | [F2] | CONFORME (como ingrediente do Art. 6) |
| 7 | beta-alanina 300 mg | 300 mg em dose única | Beta-alanina / I·Beta-alanina ✓ (IN 102/2021) | — | 2 g/dia; advertência VI·18: doses de no máximo 300 mg com 2 h de intervalo | > 19 | [F1] IV·Beta-alanina; VI·18 | CONFORME (300 mg por dose, 1 dose/dia) |
| 8 | cafeína anidra 200 mg | 200 mg; não há guaraná nem café verde na composição | Cafeína / I·Cafeína ✓ | 75 mg | 200 mg | > 19 | [F1] III/IV·Cafeína | CONFORME — igual ao máximo |
| 9 | dióxido de silício (INS 551) 118 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | — | [F3] | CONFORME |
| 10 | edulcorante sucralose (INS 955) 90 mg | 90 mg em 210 g prontos = 428,6 mg/kg (calculado) | IN 211/2023 14.2: 2.400 mg/kg no produto pronto; não é cápsula | — | 2.400 mg/kg | — | [F3] | CONFORME |

Soma: **10.000,00 mg em 10.000 mg (100,0% exatos)** — não sobra massa para a L-citrulina malato nem para o corante que a lista de ingredientes declara. Três insumos no teto exato (creatina, taurina, cafeína). Advertências exigidas: VI·0 (aminoácidos, creatina, taurina, cafeína) — `warnings` traz "não é recomendado para crianças, gestantes, lactantes e pessoas sensíveis à cafeína" (texto diferente do literal "não deve ser consumido por gestantes, lactantes e crianças"); VI·18 (beta-alanina) — **ausente**.

**Veredito: NÃO VERIFICÁVEL — as 10 linhas da composição, isoladas, estão todas dentro da faixa, mas o próprio cadastro declara na lista de ingredientes um constituinte não autorizado (L-citrulina malato) e um corante que a composição não tem.** Sem selo. O que destrava: a fábrica dizer se o produto leva L-citrulina malato (se leva, é FORMA NÃO AUTORIZADA e a composição está errada; se não leva, corrigir `ingredients_list`) e qual corante; com o cadastro coerente e a confirmação escrita do dono, a fórmula passa a 100% CONFORME PELO CADASTRO.

### II.8 `shot-colageno-300-gramas` — SHOT + COLÁGENO 300 GRAMAS — **NÃO VERIFICÁVEL**

Cadastro: 9 linhas, porção 10 g (1 dose) diluída em 200 mL, 1 vez ao dia. `ingredients_list` declara ainda extrato de *Curcuma longa*, extrato de café verde e extrato de laranja Moro, que **não estão** na composição (que já soma 10.000 mg) — cadastro contraditório.

| # | cadastro | ativo (conta) | constituinte / forma | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | colágeno hidrolisado 8.400 mg | 8,4 g de insumo; proteína = 8,4 g × teor proteico do lote (**desconhecido**; o valor é exatamente o mínimo legal, padrão cadastro-teto) | Proteínas / I·Gelatina hidrolisada/Colágeno hidrolisado ✓ | **8,4 g de proteínas** | NE | > 19 | [F1] III·Proteínas | **NÃO VERIFICADO** — só atinge 8,4 g de proteínas se o colágeno for 100% proteína; qualquer teor menor (laudo) deixa ABAIXO DO MÍNIMO |
| 2 | vitamina C (ácido ascórbico) 800 mg | 800 mg | Vitamina C ✓ | 13,5 | 1.916,02 mg | > 19 | [F1] III/IV·Vitamina C | CONFORME |
| 3 | ácido cítrico (INS 330) 400 mg | aditivo | IN 211/2023 14.2: quantum satis | — | — | — | [F3] | CONFORME |
| 4 | aromatizante idêntico ao natural de limão 200 mg | aditivo, 2,0% | quantum satis (idêntico ao natural) | — | — | — | [F3] | CONFORME |
| 5 | dióxido de silício (INS 551) 100 mg | aditivo | quantum satis | — | — | — | [F3] | CONFORME |
| 6 | edulcorante sucralose (INS 955) 50 mg | 50 / 0,210 kg = 238,1 mg/kg | 2.400 mg/kg no produto pronto | — | 2.400 mg/kg | — | [F3] | CONFORME |
| 7 | maltodextrina 31,35 mg | veículo | Art. 6, § único, RDC 243 | — | NE | — | [F2] | CONFORME |
| 8 | corante verde (INS 102 e INS 133) 17 mg | 17 / 0,210 kg = 81,0 mg/kg somados | tartrazina 300 mg/kg; azul brilhante 300 mg/kg | — | 300 mg/kg cada | — | [F3] | CONFORME |
| 9 | zinco (bisglicinato de zinco) 1,65 mg | leitura A (assumida): 1,65 mg de zinco = mínimo exato; leitura B (sal): 0,33 mg (20%) ou 0,51 mg (estequiométrico) | Zinco / I·Bisglicinato de zinco ✓ | 1,65 mg | 29,59 mg | > 19 | [F1] III/IV·Zinco | leitura A: CONFORME (igual ao mínimo, margem zero); leitura B: ABAIXO DO MÍNIMO |

Soma: 10.000,00 mg em 10.000 mg (100,0%); com o zinco como sal (8,25 mg de bisglicinato para 1,65 mg de Zn), 10.006,6 mg (100,07%). Advertências: nenhuma exigida pelo Anexo VI para vitamina C, zinco e colágeno hidrolisado; `warnings` tem as frases do Art. 14.

**Veredito: NÃO VERIFICÁVEL (teor proteico do colágeno; zinco no mínimo exato sem laudo; cadastro contraditório com três extratos declarados sem quantidade).** Sem selo. O que destrava: laudo do colágeno (proteína por N × 6,25) e do bisglicinato de zinco; ficha técnica dizendo se os três extratos existem no produto (e, se existem, laudos de padronização).

### II.9 `slim-up-emagrecimento-em-gota` — Slim Up — EMAGRECIMENTO EM GOTA — **NÃO VERIFICÁVEL**

Cadastro: 5 linhas ativas (a linha de ordem 1 foi excluída logicamente antes desta auditoria), porção 2 mL, "Ingerir 2 mL ao dia", formato líquido. `ingredients_list` declara ainda cúrcuma, bitartarato de colina e inulina, que **não estão** na composição; `target_audience` "Adultos com 19 anos ou mais". A memória do projeto registra que a ficha técnica de 30/07/2026 contradiz este cadastro (`correcoes-de-dados.md`).

| # | cadastro | ativo (conta) | constituinte / forma | mín | máx | faixa | fonte | veredito |
|---|---|---|---|---|---|---|---|---|
| 1 | extrato de café verde (Coffea arabica L., semente) 92,9 mg | ácido clorogênico e cafeína **desconhecidos** | Ácido clorogênico / I·Extrato de café verde ✓ (IN 102/2021) | NE | 400 mg de ácido clorogênico; cafeína total ≤ 200 mg | > 19 | [F1] III/IV·Ácido clorogênico, Cafeína | **NÃO VERIFICADO** (extrato sem laudo) |
| 2 | extrato fluido de semente de feno-grego (Trigonella foenum-graecum L.) 33 mg | saponinas **desconhecidas** | Saponinas de glicosídeos de furostanol / I·Extrato de semente de feno-grego ✓ (IN 304/2024) | NE | 450 mg de saponinas | > 19 | [F1] IV·Saponinas | **NÃO VERIFICADO** (extrato sem laudo) |
| 3 | cromo (picolinato de cromo) 250 mcg | 250 µg de cromo (convenção; se massa do picolinato: 31,1 µg) | Cromo / I·Picolinato de cromo ✓ | 5,25 µg | 250 µg | > 19 | [F1] III/IV·Cromo | CONFORME nas duas leituras (A: igual ao máximo) |
| 4 | vitamina D (colecalciferol) 50 mcg | 50 µg | Vitamina D ✓ | 3 µg | 50 µg | > 19 | [F1] III/IV·Vitamina D | CONFORME — igual ao máximo |
| 5 | vitamina B12 (metilcobalamina) 9,94 mcg | 9,94 µg | Vitamina B12 ✓ | 0,36 µg | 9,94 µg | > 19 | [F1] III/IV·Vitamina B12 | CONFORME — igual ao máximo |

Soma: 126,21 mg em 2 mL (≈ 6,3% de 2 g, assumindo densidade 1). Três insumos no teto exato. Advertências exigidas: VI·0 (ácido clorogênico, cafeína) e VI·26 (saponinas): "Este produto não deve ser consumido por gestantes, lactantes e crianças" — `warnings` diz "Gestantes, lactantes e crianças somente devem consumir este produto sob orientação de médico ou nutricionista" (texto diferente do exigido).

**Veredito: NÃO VERIFICÁVEL (dois extratos sem laudo; cadastro contraditório).** Sem selo. O que destrava: laudos de padronização (ácido clorogênico, cafeína, saponinas) e ficha técnica que feche a composição.

### II.10 Resultado da Parte II e o que a migration `20260921100000` faz

| slug | nº insumos | veredito | selo |
|---|---|---|---|
| `creatina-em-gummy-sabor-tutti-frutti` | 1 | 100% CONFORME PELO CADASTRO | concedido pela `20260921100000`, **só com confirmação escrita do dono** de que o cadastro é a formulação real |
| `creatina-monohidratada-300g-soluvel` | 1 | 100% CONFORME PELO CADASTRO | idem |
| `emagrecedor-em-capsula` | 1 | NÃO VERIFICÁVEL (cadastro incompleto) | não |
| `melatonina-triptofanos-encapsulados` | 9 | COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (126,3%) | não |
| `multi-vitta-gestante-e-lactante-em-capsula` | 12 | NÃO CONFORME + COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (144,9–161,0%) | não |
| `omega-pro-tg` | 5 (1 óleo + 4 componentes) | NÃO VERIFICÁVEL (mínimo de lipídeos totais: interpretação pendente) | não |
| `pre-treino-300-g` | 10 | NÃO VERIFICÁVEL (cadastro contraditório: L-citrulina malato na lista de ingredientes) | não |
| `shot-colageno-300-gramas` | 9 | NÃO VERIFICÁVEL (teor proteico do colágeno; extratos sem quantidade) | não |
| `slim-up-emagrecimento-em-gota` | 5 | NÃO VERIFICÁVEL (extratos sem laudo; cadastro contraditório) | não |

A migration `supabase/migrations/20260921100000_selos_conforme_cadastro_sem_rotulo.sql` (em disco, **não aplicada**) concede o selo às 2 creatinas sem rótulo, casando por slug, com guarda de contagem (4 da `20260921000000` + 2 = 6) e com o cabeçalho dizendo, em letras claras, que ela só pode ser aplicada depois da confirmação escrita do dono — sem rótulo, o selo se apoia nessa confirmação. Ordem: `20260920000000` → `20260921000000` → `20260921100000`.

### II.11 Quadro final dos 24 selos (Parte I + Parte II)

| # | slug | selo hoje | veredito | selo depois das migrations | motivo |
|---|---|---|---|---|---|
| 1 | `bella-gummy-biotina-em-gummy` | sim | 100% CONFORME (rótulo) | **sim** (`20260921000000`) | 5 de 5 insumos conformes |
| 2 | `creatina-monohidratada-150g-soluvel` | sim | 100% CONFORME (rótulo) | **sim** (`20260921000000`) | creatina 5.000 = teto (IN 373/2025) |
| 3 | `creatina-gummy-sabor-frutas-vermelhas` | sim | 100% CONFORME (rótulo) | **sim** (`20260921000000`) | creatina 3.000 = mínimo |
| 4 | `melatonina-em-gummy-sabor-uva` | sim | 100% CONFORME (rótulo) | **sim** (`20260921000000`) | triptofano e melatonina na faixa |
| 5 | `creatina-em-gummy-sabor-tutti-frutti` | sim | 100% CONFORME PELO CADASTRO | **sim, condicionado** (`20260921100000`, só após confirmação escrita do dono) | creatina 3.000 = mínimo; sem rótulo |
| 6 | `creatina-monohidratada-300g-soluvel` | sim | 100% CONFORME PELO CADASTRO | **sim, condicionado** (`20260921100000`) | creatina 5.000 = teto; sem rótulo |
| 7 | `serena` | sim | NÃO VERIFICÁVEL | não (removido) | L-teanina sem origem |
| 8 | `biotina-em-capsula` | sim | NÃO CONFORME | não (removido) | colágeno < mínimo; selênio quelado |
| 9 | `focus-colina` | sim | NÃO CONFORME | não (removido) | magnésio 60 < 63; tirosina 220 < 262,5 |
| 10 | `multivitaminico` | sim | NÃO CONFORME | não (removido) | boro (forma); ácido fólico > máximo |
| 11 | `zma-zinco-magnesio-e-vitamina-d` | sim | NÃO CONFORME | não (removido) | boro (forma) |
| 12 | `dores-musculares` | sim | NÃO CONFORME | não (removido) | colágeno, cálcio, magnésio < mínimo; selênio quelado |
| 13 | `detox-matinal-lemon-shot-300g` | não | NÃO CONFORME | não | zinco 0,29 < 1,65 mg; 3 extratos sem laudo |
| 14 | `saude-intestinal` | não | NÃO CONFORME | não | fibras 567 mg < 5,7 g; cúrcuma sem laudo |
| 15 | `moro-slim` | não | NÃO CONFORME | não | espirulina e fibras < mínimo; 4 extratos sem laudo |
| 16 | `pro-energy` | não | NÃO VERIFICÁVEL | não | cafeína total (guaraná) e feno-grego sem laudo |
| 17 | `pre-treino-creatina-sabor-limao-420g` | não | NÃO CONFORME (parecer) | não | cafeína > máximo; beta-alanina; 107% da porção |
| 18 | `emagrecedor-em-capsula` | não | NÃO VERIFICÁVEL | não | cadastro incompleto (1 linha de 0,25 mg em 1 g) |
| 19 | `melatonina-triptofanos-encapsulados` | não | COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO | não | 126,3% com os sais; fosfatidilserina sem origem |
| 20 | `multi-vitta-gestante-e-lactante-em-capsula` | não | NÃO CONFORME + IMPOSSÍVEL NA PORÇÃO | não | ácido fólico e B12 (lactantes) > máximo; 144,9–161,0% |
| 21 | `omega-pro-tg` | não | NÃO VERIFICÁVEL | não | mínimo de lipídeos totais (5 g): interpretação pendente |
| 22 | `pre-treino-300-g` | não | NÃO VERIFICÁVEL | não | cadastro contraditório (L-citrulina malato) |
| 23 | `shot-colageno-300-gramas` | não | NÃO VERIFICÁVEL | não | teor proteico do colágeno; extratos sem quantidade |
| 24 | `slim-up-emagrecimento-em-gota` | não | NÃO VERIFICÁVEL | não | 2 extratos sem laudo; cadastro contraditório |

Totais: 6 selos possíveis (4 firmes pela `20260921000000` + 2 condicionados pela `20260921100000`), 18 sem selo. Hoje há 12.

---

## 9. Evidências guardadas (fora do repositório)

Pasta `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/agente-g/`: `in28_tentativa1.html` (IN 28/2018 consolidada, bruta, 675.743 bytes), `in28_texto.txt`, `in28_tabelas.json` (7 anexos em tabelas), `anexo_I.txt`, `in28_consulta_data.txt` (2026-09-15 18:27:27 −04), `rdc243.html`/`rdc243_texto.txt`, `in211.html`/`in211_texto.txt`, `govbr_suplementos.html`, `govbr_lista.html`, `painel_powerbi_01.png`, `painel_constituintes_*.png` e `painel_oleo_peixe.png` (contraprovas do painel), `formulas_prod.json` e `formulas_detox_etc.json` (estado do banco às 18:31), `compositions_prod.json`, `ingredients_prod.json` e `formulas_9.json` (cadastro das 9 sem rótulo, 19:36–19:38), `painel_consulta2.py` (script Playwright). Pasta temporária de sessão: não versionada.
