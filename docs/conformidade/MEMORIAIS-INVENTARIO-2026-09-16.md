# Inventário dos Memoriais de Cálculo — Lemon Caps

**Data deste documento:** 16/09/2026
**Autor:** auditoria documental (Claude), a partir de instrução direta do dono
**Cobertura:** os 24 slugs do catálogo indicados na tarefa, na ordem real de cadastro do
catálogo (lida de `supabase/migrations/20260909210002_seed_catalogo.sql`, 16/09/2026)

## O que é este documento

Para cada um dos 24 produtos abaixo, este documento registra: qual documento foi lido (com
caminho completo, revisão e data), a procedência desse documento (memorial de cálculo da
fábrica × ficha técnica × dossiê técnico gerado × proposta comercial), a porção e o formato
declarados, uma tabela insumo a insumo (massa pesada, teor considerado e de onde esse teor
veio, ativo declarado, ativo recalculado nesta auditoria, se a conta fecha, fornecedor e
lote), os excipientes e a massa total, e as observações — sobretudo as contas que não fecham
e as versões conflitantes entre memorial, ficha técnica, dossiê e rótulo.

Duas seções finais reúnem os produtos sem nenhum documento de composição encontrado e os dez
achados mais graves de toda a auditoria.

## Metodologia

**Fontes, nesta ordem de prioridade** (a mesma ordem já usada ontem, mantida por
continuidade):

1. `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/` — 16 memoriais de cálculo rev02
   (.docx), cada um com uma subpasta `ARQUIVOS-PDF` de laudos de matéria-prima e de produto
   acabado. Tratados como fonte primária desta tarefa.
2. `/Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/` — memoriais de cálculo
   adicionais ou anteriores, usados para comparação/histórico, nunca como substituto do
   memorial rev02 quando este existe.
3. `/Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/` — fichas técnicas (declaração de
   composição sem tabela de fechamento matemático nem rastreabilidade de laudo/lote).
4. Dossiês técnicos gerados (arquivos `dossie-tecnico-*.pdf`, produzidos por jsPDF, sem
   assinatura nem código de revisão) e ordens de produção (`Ordem_de_Producao_*`,
   `OP-*`) — usados apenas quando nada mais existe, e sempre com a ressalva de que não têm
   laudo/lote por trás.
5. Certificados de análise (laudos) de matérias-primas, quando citados pelo próprio memorial
   ou quando encontrados isoladamente e claramente relacionados a um insumo do produto.

**Ferramentas usadas:** `python-docx` (parágrafos e tabelas) para `.docx`; `PyMuPDF` (`fitz`)
para `.pdf`. Nenhum arquivo-fonte foi alterado — todas as leituras foram somente-leitura.

**Reaproveitamento do trabalho de ontem:** os JSONs já produzidos e listados na tarefa
(`memoriais-bio-princess.json`, `memoriais-biogummy-dreamgummy.json`,
`memoriais-creatina.json`, `memoriais-focus-colina.json`, `memoriais-lidema-moroslim.json`,
`memoriais-multivitaminico.json`, `memoriais-pretreino.json`, `memoriais-pro-energy.json`,
`memoriais-slimup.json`, `memoriais-zma-complex.json`) foram lidos por inteiro, tiveram sua
sintaxe conferida (todos válidos) e foram normalizados para o esquema único desta tarefa por
um script Python auditável (sem retranscrever números à mão, para não introduzir erro de
transcrição). Um bug de precedência de texto foi encontrado e corrigido durante essa
normalização: a string `"NÃO LEGÍVEL"` estava caindo, por engano, no mesmo grupo de `"não"`
(→ `false`), quando deveria virar `indeterminado`; corrigido antes de gerar qualquer saída.
Um segundo problema foi identificado e corrigido por leitura manual, não por regra
automática: quatro produtos (Bio Princess/Biotina em Cápsula, Focus Colina, Pro Energy,
ZMA) têm excipientes descritos em texto livre que citam a massa do INVÓLUCRO da cápsula
vazia ou dizem explicitamente "não é massa da porção" — uma extração ingênua por regex teria
somado esse número à porção por engano (chegou a inflar o Pro Energy e o ZMA em +98,45mg
cada, escondendo que as duas fórmulas na verdade fecham exatas em 1.000,00mg). Cada um dos
poucos casos foi lido por inteiro e decidido manualmente, não por expressão regular.

**Os quatro dumps de texto bruto já extraídos ontem** (Detox, Floravex, Nuviart, Serena ×2)
foram lidos por inteiro nesta sessão e transcritos para o esquema único — número por número,
igual ao que consta nas tabelas do próprio memorial. Nenhum valor foi estimado.

**Os cinco produtos sem memorial** (`emagrecedor-em-capsula`,
`multi-vitta-gestante-e-lactante-em-capsula`, `melatonina-triptofanos-encapsulados`,
`omega-pro-tg`, `shot-colageno-300-gramas`) tiveram busca própria e ampla, além da já feita
ontem: por nome de arquivo e por conteúdo, em `Downloads`, `Desktop/POPS` e no próprio
código-fonte do catálogo. Dois deles (`emagrecedor-em-capsula`, `shot-colageno-300-gramas`)
têm ficha técnica real da Lemoncaps (mesmo sem laudo/lote). Um (`melatonina-triptofanos-encapsulados`)
tem só um dossiê técnico gerado, sem laudo. Dois (`multi-vitta-gestante-e-lactante-em-capsula`,
`omega-pro-tg`) não têm nenhum documento de composição em lugar nenhum consultado.

**Regra de conferência aritmética ("a conta fecha?")** — dois níveis:

- *Insumo a insumo*: reaproveitado o veredito já calculado ontem (metodologia de ontem:
  diferença ≤3% relativa OU ≤0,5mg absoluta, o que for maior, entre massa×teor e o ativo
  declarado). Não refiz essa conta insumo a insumo à mão — refazer as ~200 linhas de
  memorial equivaleria a repetir a extração inteira; o que fiz foi conferir a
  *consistência* desses vereditos (não achei nenhum "sim" que devesse ser "não" nas
  amostras que reabri para os outros fins descritos acima).
- *Produto a produto (massa total da porção)* — **conferência nova desta consolidação**,
  não feita ontem na maioria dos produtos: somei a massa de todos os insumos e excipientes
  com massa numérica conhecida e comparei com a massa/volume da porção declarada (campo
  `porcao`), com tolerância de 3% relativo ou 0,5mg absoluto, o que for maior. Quando algum
  item ficou sem massa extraída (comum em gomas, cujo excipiente de base às vezes não tem
  massa individual no memorial), o resultado é `indeterminado` em vez de `não` — a menos que
  a soma dos itens já conhecidos, sozinha, já ultrapasse a porção declarada, caso em que o
  estouro é confirmado independentemente do dado que falta.

**Convenção de nomes:** o campo `nome_no_memorial` de cada insumo é o nome exatamente como
extraído do documento-fonte; o campo `forma_quimica` reproduz o mesmo texto, porque em todos
os documentos lidos a forma química já vem embutida no próprio nome do insumo (ex.:
"bisglicinato de zinco", não apenas "zinco") — nenhuma separação adicional foi inventada.

**Correções de slug** (o slug pedido na tarefa nem sempre bate com o slug real do catálogo —
conferido contra o seed em 15-16/09/2026): `melatonina-em-gummy-sabor-uva` → o real é
`melatonina-em-gumy-sabor-uva` (erro de grafia que já existe no banco, um só "m");
`creatina-gummy-tutti-frutti` → o real é `creatina-em-gummy-sabor-tutti-frutti`;
`creatina-monohidratada-300g` → o real é `creatina-monohidratada-300g-soluvel`;
`pre-treino-creatina-sabor-limao-420g` → o real é `pre-treino-creatina-sabor-limao-300g`
(300g, não 420g — o memorial de origem descreve um pote de 420g/14g por dose; registrar essa
diferença é o achado, a chave não foi "corrigida" para esconder o problema). O produto
LIDEMA, mapeado por alguns documentos como par do Moro Slim, é oficialmente um rascunho
excluído do catálogo (confirmado no seed) — por isso não é uma das 24 chaves finais, embora
seus dados, quando existentes, apareçam nas observações do Moro Slim por serem informativos.

---

## 1. `bella-gummy-biotina-em-gummy` — BELLA GUMMY (Biotina em Gummy)

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/13_BIOGUMMY/MEMORIAL-CALCULO-BIOGUMMY-rev02.docx (MEM-CALC-BIOGUMMY-rev02)`  
**Revisão:** 02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/13_BIOGUMMY/MEMORIAL-CALCULO-BIOGUMMY-rev02.docx (MEM-CALC-BIOGUMMY-rev02)

**Porção:** 6 g por porção = 2 gomas · 30 porções por embalagem (60 gomas, peso líquido 180 g). Cada goma pesa 3,00 g (180 g ÷ 60 gomas, confirmado na Tabela 26 do memorial: 'Peso por goma = 180 g ÷ 60 = 3,00 g'). · **Formato:** gummy


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ácido ascórbico (vitamina C) | 45,23 | 99,5% | laudo lote 950467 | 45 | 45,00385 | Sim | NÃO LEGÍVEL (sem PDF de laudo separado na pasta ARQUIVOS-PDF do Biogummy) | 950467 |
| 2 | Vitamina E pó 50% (acetato de DL-alfa-tocoferila) | 16,7 | 50,7% | laudo lote 91320 | 5,68 | 8,4669 | Sim | Analitic Tecnologia de Precisão Ltda (marca INLAB), Ref. 100738 — lote fabricante chinês 2025040605 | 91320 |
| 3 | Bisglicinato de zinco | 12 | 19,89% | laudo lote 055-ZN/25 | 2,39 | 2,3868 | Sim | NÃO LEGÍVEL (sem PDF de laudo separado na pasta ARQUIVOS-PDF do Biogummy) | 055-ZN/25 |
| 4 | Acetato de retinol (vitamina A) | 5,99 | — | não informado | 1,02 | 1,02 | Sim | NÃO LEGÍVEL (sem PDF de laudo separado na pasta ARQUIVOS-PDF do Biogummy) | 215230 |
| 5 | D-biotina | 0,046 | 97,69% | laudo lote 25030042 (citado pelo memorial e pelo nome do arquivo do laudo) | 0,045 | 0,044937 | Sim | Analitic Tecnologia de Precisão Ltda (marca INLAB), Ref. 100472 — lote fabricante BN25121020, lote interno 91457 | 25030042 (citado pelo memorial e pelo nome do arquivo do laudo) |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Aroma idêntico ao natural de frutas vermelhas | — |
| Corante vermelho ponceau 4R (INS 124) | — |
| Sorbitol líquido 70% | — |
| Maltitol | — |
| Gelatina pó | — |
| Maltodextrina | — |
| Pectina cítrica | — |
| Goma acácia | — |
| Ácido cítrico (INS 330) | — |
| Citrato de sódio (INS 331) | — |
| Sorbato de potássio PA (INS 202) | — |
| Sucralose (INS 955) | — |

**Massa total (insumos + excipientes):** 79,966 mg  
**A soma fecha com a porção declarada?** indeterminado

**Observações e divergências:**

- D-biotina: lote citado (25030042) e teor usado no cálculo (97,69%) não aparecem no PDF fisicamente anexado sob esse nome, que traz lote fabricante BN25121020 / lote interno 91457 e teor 100,0%. Padrão igual ao erro documentado de 'B12 com lote errado' em memoriais anteriores da empresa.
- Aroma de frutas vermelhas: laudo vencido (validade 21/05/2026, quase 4 meses vencido em relação a hoje) e da forma física errada (pó no laudo, líquido na fórmula) — usado mesmo assim como único documento de suporte.
- Sorbitol: laudo anexado é de sorbitol em pó; a fórmula e o rótulo usam sorbitol líquido 70% — insumos diferentes (achado do próprio memorial, aqui apenas confirmado).
- Vitamina E: teor do laudo (50,7%) bate exatamente com o memorial; conta fecha só quando se aplica também o fator adicional ×0,67 (equivalência a α-TE) — quem multiplicar só massa×teor vai achar 8,47 mg em vez de 5,68 mg e concluir, errado, que a conta não fecha.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma PARCIAL = 79.966 mg de um alvo de porção ≈6000.0 mg; faltam 12 de 17 itens sem massa_mg extraída no memorial/dump de origem — não dá para concluir se a porção fecha (dado incompleto, não é reprovação).
- Fontes secundárias conferidas: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/13_BIOGUMMY/ARQUIVOS-PDF/09_laudo_aroma-frutas-vermelhas_lote-25051287_VENCIDO.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/13_BIOGUMMY/ARQUIVOS-PDF/11_laudo_vitamina-E-po-50_lote-91320.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/13_BIOGUMMY/ARQUIVOS-PDF/14_laudo_biotina-B7_lote-25030042.pdf — lido (conteúdo não corresponde ao nome do arquivo/lote citado) | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/13_BIOGUMMY/ARQUIVOS-PDF/15_laudo_corante-ponceau-4R_lote-108027.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/13_BIOGUMMY/ARQUIVOS-PDF/30_ROTULO_BioGummy_2026.pdf — NÃO ABERTO (rótulo, fora do escopo desta comparação de laudos; conteúdo nutricional já consta no memorial)

---

## 2. `creatina-em-gummy-sabor-tutti-frutti` — Creatina em Gummy sabor Tutti-Frutti

**Documento lido:** `MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx (codigo interno MEM-CALC-CREATGUMMY-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx`  
**Revisão:** 02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx (codigo interno MEM-CALC-CREATGUMMY-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx

**Porção:** 6 g (2 gomas) · **Formato:** gummy


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina monoidratada | 3000 | 100,5% | assumido | 3000 | 3015 | Sim | Nao identificado de forma inequivoca no memorial (a tabela de insumos nao tem coluna fornecedor); o laudo do lote 217949 e emitido em papel timbrado 'SM Empreendimentos Farmaceuticos' e assinado por responsaveis tecnicos vinculados a 'Fagron Services Brasil' e 'Fagron Distribution Brazil' -- sugere Fagron como distribuidor, mas o documento nao afirma isso expressamente. | 217949 (lote interno do laudo: 26A05-B023-217949; lote do fabricante: 20250913) |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Sorbitol líquido 70% | 1750 |
| Maltitol cristal | 1260 |
| Gelatina pó | 700 |
| Água purificada | 323,3 |
| Glicerina vegetal | 245 |
| Ácido cítrico anidro | 168 |
| Pectina cítrica ATM | 140 |
| Citrato de sódio | 14 |
| Sorbato de potássio | 7 |
| Aroma frutas vermelhas | 19 |
| Corante vermelho ponceau (INS 124) | 33,33 |
| Sucralose | 2,67 |

**Massa total (insumos + excipientes):** 7662,3 mg  
**A soma fecha com a porção declarada?** **NÃO**

**Observações e divergências:**

- NOTA DE SLUG (consolidação): Slug pedido na tarefa foi "creatina-gummy-tutti-frutti"; o slug REAL no catálogo é "creatina-em-gummy-sabor-tutti-frutti".
- SABOR NÃO DOCUMENTADO — achado principal para este slug: o memorial MEM-CALC-CREATGUMMY-rev02 (único memorial de creatina gummy existente no dossiê) documenta especificamente o sabor FRUTAS VERMELHAS — usa 'aroma frutas vermelhas' (lote 25051287) e 'corante vermelho ponceau INS 124' (lote 108027) como ingredientes nomeados na lista de ingredientes (item 13) e na tabela de insumos (item 4). A palavra 'tutti' NÃO aparece em nenhum lugar do documento — nem no texto visível, nem nas tabelas, nem no XML bruto do .docx (busca feita diretamente no arquivo comprimido, não apenas no texto renderizado). NÃO é um caso de fórmula-base genérica com 'aroma a definir': é uma fórmula nomeada e fechada para um sabor específico que não é o deste slug. Os dados de CREATINA (insumo ativo) foram replicados para este slug por ASSUNÇÃO deste agente de que a dose de creatina não varia por sabor (aroma e corante não deveriam, em tese, afetar a pesagem do ativo) — mas isso é uma ASSUNÇÃO, não um dado lido de um documento específico do tutti-frutti. Da mesma forma, os excipientes estruturais (sorbitol, maltitol, gelatina, água, glicerina, ácido cítrico, pectina, citrato de sódio, sorbato de potássio, sucralose) foram replicados sob a mesma assunção. Os itens exclusivamente de sabor/cor (aroma frutas vermelhas, corante ponceau) NÃO foram replicados como dado do tutti-frutti — ficam marcados como PENDENTE/não documentados para este slug (ver os dois itens correspondentes em 'excipientes'). PENDENTE: não existe, em nenhuma pasta consultada, um memorial, ficha técnica ou laudo específico para 'creatina-gummy-tutti-frutti'. Recomenda-se, para a reformulação regulatória, obter ou produzir um memorial próprio para esse sabor antes de tratar os números aqui como definitivos.
- ANÁLISE DE PRODUTO ACABADO NÃO TESTA CREATINA — achado central para a reformulação regulatória: o arquivo 12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf (RG 005714/03/2026 R:00 e RG 005711/03/2026 R:00, emitido por MGW Consultoria em Garantia de Qualidade Ltda, amostra 'Lemoncaps Creatina em Gummy', lote G20/1556, coleta 23/03/2026, fabricação mar/26, validade mar/28) contém APENAS: Enterobacteriaceae (<1,0×10¹ UFC/g), Bolores e Leveduras (<1,0×10¹ UFC/g), Salmonella (ausência/25g) e Glúten (<10 ppm por imunocromatografia). NÃO HÁ doseamento de creatina nem de creatinina no produto acabado nesta análise, nem em qualquer outro arquivo da pasta ARQUIVOS-PDF (que só tem 3 arquivos: o laudo da matéria-prima, esta análise micro/glúten, e o rótulo). Os 3.000 mg de creatina por porção são EXCLUSIVAMENTE CALCULADOS a partir da massa de matéria-prima pesada e do teor do laudo (ver insumo 'Creatina monoidratada') — não existe confirmação analítica independente do teor real de creatina na goma já pronta. O próprio memorial (seção 6.1) já reconhece essa lacuna ao recomendar estudo de estabilidade com doseamento de creatina/creatinina em 0, 3, 6, 12 e 24 meses, que ainda não foi feito.
- CONTAMINAÇÃO APARENTE DE OUTRO MEMORIAL — achado deste agente: a seção 'AVALIAÇÃO TÉCNICA — NÃO CONFORMIDADES' do memorial traz caixas de alerta inteiras sobre 'MALTODEXTRINA — laudo vencido' (fornecedor Fagron, lote 210170, menção a 6,27 ppm de SO2) e 'GOMA ARÁBICA — laudo com pH 2,84 fora de especificação' (fornecedor Adicel, lote 105226). NENHUM dos dois insumos (maltodextrina, goma arábica) aparece na lista de ingredientes (item 13) nem na tabela de composição por porção (item 4) deste produto — a gummy de creatina usa gelatina como agente de textura, não goma arábica, e não leva maltodextrina em nenhuma quantidade. Isso sugere fortemente que esses dois alertas foram copiados de outro memorial (produto com maltodextrina e goma arábica na fórmula, ex. cápsula/pó multivitamínico) e não foram removidos ao adaptar o documento para a creatina gummy. Registrado como suspeita, não como fato confirmado — vale conferência editorial do memorial.
- FECHAMENTO DOS POLIÓIS NÃO BATE (cálculo deste agente, não constante do memorial): rótulo/memorial declaram 'polióis 2,7 g' por porção (sorbitol + maltitol). Usando massa pesada × teor do laudo: hipótese A (teor 98,5%/99,70% aplicado direto sobre a massa pesada, tratando '70%' como só nome comercial) dá sorbitol 1.723,75 mg + maltitol 1.256,22 mg = 2.979,97 mg (2,98 g) — 280 mg / 10,4% acima do declarado. Hipótese B (aplicando também os 70% de concentração do sorbitol líquido) dá sorbitol 1.206,63 mg + maltitol 1.256,22 mg = 2.462,85 mg (2,46 g) — 238 mg / 8,8% abaixo do declarado. Em NENHUMA das duas hipóteses o fechamento fica dentro da tolerância de 3% relativo. Isso é consequência direta da ambiguidade do próprio insumo 'sorbitol líquido 70%' (ver observação do item) — o memorial não deixa claro qual teor aplicar.
- FECHAMENTO DO SÓDIO NÃO BATE (cálculo deste agente): rótulo declara 'Sódio 10 mg' por porção. A única fonte de sódio na fórmula é o citrato de sódio (14,00 mg, teor 99,8%). Mesmo assumindo a forma anidra (26,72% de Na por massa, MM 258,07), o sódio calculado é 14 × 0,998 × 0,2672 = 3,74 mg — bem abaixo dos 10 mg declarados (diferença de 6,26 mg / 62,6% relativo, muito fora da tolerância). Se a forma for di-hidratada (23,45% de Na, MM 294,10), o valor calculado cai ainda mais (3,28 mg). O memorial não indica a forma química do citrato nem explica a origem dos 10 mg declarados — pode haver sódio residual de outros insumos (ex. traços no sorbato de potássio, na gelatina ou na água) não contabilizado no memorial, mas isso não está demonstrado em lugar nenhum do documento.
- DIVERGÊNCIA MEMORIAL × FICHA TÉCNICA (Desktop/POPS) — achado central: os dois documentos descrevem nominalmente o MESMO produto (Creatina Gummy sabor frutas vermelhas) mas trazem conjuntos de números incompatíveis. Memorial: peso líquido 180 g para 60 gomas (3,00 g/goma), porção 6 g (2 gomas), creatina 3.000 mg/porção (50% da porção). Ficha técnica (FT-PRD-GUMMY-CREA-FV-001): peso líquido 90 g para 60 gomas (calculado: 1,50 g/goma — metade do memorial), porção declarada '3 g (2 gomas)', mas creatina declarada é a MESMA: 3.000 mg/porção (1.500 mg/goma). Isso é uma IMPOSSIBILIDADE ARITMÉTICA interna à própria ficha técnica: se a porção pesa 3 g e a creatina sozinha já é 3.000 mg (=3 g), não sobra nenhuma massa para os 'demais componentes (base de goma, aromatizante, acidulante, conservador, edulcorante e corante) q.s.p. 3 g por porção' que o próprio texto da ficha técnica lista na sequência. Os demais valores nutricionais também não se conciliam por um fator simples de escala (ver tabela comparativa no .md) — não é um caso de 'mesma fórmula, porção pela metade': sódio bate exatamente na metade (5 mg vs 10 mg), mas carboidratos, proteínas, polióis e energia não seguem essa proporção. Os dois conjuntos de números são registrados aqui lado a lado, sem escolher qual está certo — isso exige decisão do responsável técnico.
- OUTRAS NÃO CONFORMIDADES JÁ DOCUMENTADAS PELO PRÓPRIO MEMORIAL (fora do escopo central desta extração sobre creatina, registradas apenas para contexto): pote PET 500 mL B43 especificado com 'tampa rosca 38 mm' incompatível (o par correto, mesma NF-e 68662, é tampa flip top 43 mm); pote e tampa da gummy sem número de lote e sem validade nos certificados da Randon (ao contrário dos demais); nenhuma embalagem da linha tem declaração de aptidão para contato com alimentos (RDC 326/2019 e 589/2021); alegação 'sem lactose' no rótulo sem laudo de lactose; designação de venda no rótulo ('Suplemento alimentar CREATINA em goma') não segue o art. 12 da RDC 243/2018 (correto: 'Suplemento Alimentar em goma').
- ANÁLISE DE PRODUTO ACABADO: 12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf -- RG 005714/03/2026 R:00 (micro) e RG 005711/03/2026 R:00 (glúten), MGW Consultoria em Garantia de Qualidade Ltda, emissão 03/04/2026, amostra 'Lemoncaps Creatina em Gummy' lote G20/1556, coleta 23/03/2026, fabricação mar/26, validade mar/28 -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf — NÃO É POSSÍVEL COMPARAR: esta análise de produto acabado contém exclusivamente Enterobacteriaceae (<1,0×10¹ UFC/g), Bolores e Leveduras (<1,0×10¹ UFC/g), Salmonella (ausência/25g) e Glúten (<10 ppm). NÃO há doseamento de creatina nem de creatinina no produto acabado. Os 3.000 mg/porção calculados no memorial (a partir da massa de matéria-prima pesada × teor do laudo) NÃO têm, até este dossiê, nenhuma confirmação analítica independente no produto já pronto. Isto é um achado importante e não uma suposição: o arquivo foi aberto e lido integralmente (2 páginas) para confirmar.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 7662.3 mg; porção declarada ≈ 6000.0 mg; diferença +1662.30 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: 30
- Fontes secundárias conferidas: Laudo materia-prima lido: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/01_laudo_creatina-monoidratada_lote-217949.pdf (SM Empreendimentos Farmaceuticos, lote interno 26A05-B023-217949 / lote fabricante 20250913, analise 03/02/2026, CAS 6020-87-7, teor base seca 100,5%, perda por dessecacao 11,5%, creatinina 95 ppm, dicianamida 43 ppm, conclusao APROVADO). Este laudo NAO tem copia propria na pasta 15_CREATINA-PO/ARQUIVOS-PDF -- os dois produtos compartilham o mesmo lote 217949 e o memorial da po remete aos mesmos dados. | Análise de produto acabado LIDA (mesma ressalva do slug frutas-vermelhas, replicada por não haver análise própria de tutti-frutti no dossiê): /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf -- amostra do laudo é identificada genericamente como 'Lemoncaps Creatina em Gummy', sem indicação de sabor; não dá para saber se a amostra ensaiada era frutas vermelhas, tutti-frutti ou outra. Contém só microbiologia e glúten, sem doseamento de creatina de qualquer forma. | Ficha técnica: NÃO EXISTE ficha técnica de tutti-frutti na pasta consultada (/Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/) — só há a de frutas vermelhas (FICHA-TECNICA-CREATINA-GUMMY-FRUTAS-VERMELHAS-SUELEN.docx), que também não menciona tutti-frutti.

---

## 3. `creatina-gummy-sabor-frutas-vermelhas` — Creatina Gummy sabor Frutas Vermelhas

**Documento lido:** `MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx (codigo interno MEM-CALC-CREATGUMMY-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx`  
**Revisão:** 02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx (codigo interno MEM-CALC-CREATGUMMY-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/MEMORIAL-CALCULO-CREATINA-GUMMY-rev02.docx

**Porção:** 6 g (2 gomas) · **Formato:** gummy


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina monoidratada | 3000 | 100,5% | laudo lote 217949 (lote interno do laudo: 26A05-B023-217949; lote do fabricante: 20250913) | 3000 | 3015 | Sim | Nao identificado de forma inequivoca no memorial (a tabela de insumos nao tem coluna fornecedor); o laudo do lote 217949 e emitido em papel timbrado 'SM Empreendimentos Farmaceuticos' e assinado por responsaveis tecnicos vinculados a 'Fagron Services Brasil' e 'Fagron Distribution Brazil' -- sugere Fagron como distribuidor, mas o documento nao afirma isso expressamente. | 217949 (lote interno do laudo: 26A05-B023-217949; lote do fabricante: 20250913) |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Sorbitol líquido 70% | 1750 |
| Maltitol cristal | 1260 |
| Gelatina pó | 700 |
| Água purificada | 323,3 |
| Glicerina vegetal | 245 |
| Ácido cítrico anidro | 168 |
| Pectina cítrica ATM | 140 |
| Citrato de sódio | 14 |
| Sorbato de potássio | 7 |
| Aroma frutas vermelhas | 19 |
| Corante vermelho ponceau (INS 124) | 33,33 |
| Sucralose | 2,67 |

**Massa total (insumos + excipientes):** 7662,3 mg  
**A soma fecha com a porção declarada?** **NÃO**

**Observações e divergências:**

- ANÁLISE DE PRODUTO ACABADO NÃO TESTA CREATINA — achado central para a reformulação regulatória: o arquivo 12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf (RG 005714/03/2026 R:00 e RG 005711/03/2026 R:00, emitido por MGW Consultoria em Garantia de Qualidade Ltda, amostra 'Lemoncaps Creatina em Gummy', lote G20/1556, coleta 23/03/2026, fabricação mar/26, validade mar/28) contém APENAS: Enterobacteriaceae (<1,0×10¹ UFC/g), Bolores e Leveduras (<1,0×10¹ UFC/g), Salmonella (ausência/25g) e Glúten (<10 ppm por imunocromatografia). NÃO HÁ doseamento de creatina nem de creatinina no produto acabado nesta análise, nem em qualquer outro arquivo da pasta ARQUIVOS-PDF (que só tem 3 arquivos: o laudo da matéria-prima, esta análise micro/glúten, e o rótulo). Os 3.000 mg de creatina por porção são EXCLUSIVAMENTE CALCULADOS a partir da massa de matéria-prima pesada e do teor do laudo (ver insumo 'Creatina monoidratada') — não existe confirmação analítica independente do teor real de creatina na goma já pronta. O próprio memorial (seção 6.1) já reconhece essa lacuna ao recomendar estudo de estabilidade com doseamento de creatina/creatinina em 0, 3, 6, 12 e 24 meses, que ainda não foi feito.
- CONTAMINAÇÃO APARENTE DE OUTRO MEMORIAL — achado deste agente: a seção 'AVALIAÇÃO TÉCNICA — NÃO CONFORMIDADES' do memorial traz caixas de alerta inteiras sobre 'MALTODEXTRINA — laudo vencido' (fornecedor Fagron, lote 210170, menção a 6,27 ppm de SO2) e 'GOMA ARÁBICA — laudo com pH 2,84 fora de especificação' (fornecedor Adicel, lote 105226). NENHUM dos dois insumos (maltodextrina, goma arábica) aparece na lista de ingredientes (item 13) nem na tabela de composição por porção (item 4) deste produto — a gummy de creatina usa gelatina como agente de textura, não goma arábica, e não leva maltodextrina em nenhuma quantidade. Isso sugere fortemente que esses dois alertas foram copiados de outro memorial (produto com maltodextrina e goma arábica na fórmula, ex. cápsula/pó multivitamínico) e não foram removidos ao adaptar o documento para a creatina gummy. Registrado como suspeita, não como fato confirmado — vale conferência editorial do memorial.
- FECHAMENTO DOS POLIÓIS NÃO BATE (cálculo deste agente, não constante do memorial): rótulo/memorial declaram 'polióis 2,7 g' por porção (sorbitol + maltitol). Usando massa pesada × teor do laudo: hipótese A (teor 98,5%/99,70% aplicado direto sobre a massa pesada, tratando '70%' como só nome comercial) dá sorbitol 1.723,75 mg + maltitol 1.256,22 mg = 2.979,97 mg (2,98 g) — 280 mg / 10,4% acima do declarado. Hipótese B (aplicando também os 70% de concentração do sorbitol líquido) dá sorbitol 1.206,63 mg + maltitol 1.256,22 mg = 2.462,85 mg (2,46 g) — 238 mg / 8,8% abaixo do declarado. Em NENHUMA das duas hipóteses o fechamento fica dentro da tolerância de 3% relativo. Isso é consequência direta da ambiguidade do próprio insumo 'sorbitol líquido 70%' (ver observação do item) — o memorial não deixa claro qual teor aplicar.
- FECHAMENTO DO SÓDIO NÃO BATE (cálculo deste agente): rótulo declara 'Sódio 10 mg' por porção. A única fonte de sódio na fórmula é o citrato de sódio (14,00 mg, teor 99,8%). Mesmo assumindo a forma anidra (26,72% de Na por massa, MM 258,07), o sódio calculado é 14 × 0,998 × 0,2672 = 3,74 mg — bem abaixo dos 10 mg declarados (diferença de 6,26 mg / 62,6% relativo, muito fora da tolerância). Se a forma for di-hidratada (23,45% de Na, MM 294,10), o valor calculado cai ainda mais (3,28 mg). O memorial não indica a forma química do citrato nem explica a origem dos 10 mg declarados — pode haver sódio residual de outros insumos (ex. traços no sorbato de potássio, na gelatina ou na água) não contabilizado no memorial, mas isso não está demonstrado em lugar nenhum do documento.
- DIVERGÊNCIA MEMORIAL × FICHA TÉCNICA (Desktop/POPS) — achado central: os dois documentos descrevem nominalmente o MESMO produto (Creatina Gummy sabor frutas vermelhas) mas trazem conjuntos de números incompatíveis. Memorial: peso líquido 180 g para 60 gomas (3,00 g/goma), porção 6 g (2 gomas), creatina 3.000 mg/porção (50% da porção). Ficha técnica (FT-PRD-GUMMY-CREA-FV-001): peso líquido 90 g para 60 gomas (calculado: 1,50 g/goma — metade do memorial), porção declarada '3 g (2 gomas)', mas creatina declarada é a MESMA: 3.000 mg/porção (1.500 mg/goma). Isso é uma IMPOSSIBILIDADE ARITMÉTICA interna à própria ficha técnica: se a porção pesa 3 g e a creatina sozinha já é 3.000 mg (=3 g), não sobra nenhuma massa para os 'demais componentes (base de goma, aromatizante, acidulante, conservador, edulcorante e corante) q.s.p. 3 g por porção' que o próprio texto da ficha técnica lista na sequência. Os demais valores nutricionais também não se conciliam por um fator simples de escala (ver tabela comparativa no .md) — não é um caso de 'mesma fórmula, porção pela metade': sódio bate exatamente na metade (5 mg vs 10 mg), mas carboidratos, proteínas, polióis e energia não seguem essa proporção. Os dois conjuntos de números são registrados aqui lado a lado, sem escolher qual está certo — isso exige decisão do responsável técnico.
- OUTRAS NÃO CONFORMIDADES JÁ DOCUMENTADAS PELO PRÓPRIO MEMORIAL (fora do escopo central desta extração sobre creatina, registradas apenas para contexto): pote PET 500 mL B43 especificado com 'tampa rosca 38 mm' incompatível (o par correto, mesma NF-e 68662, é tampa flip top 43 mm); pote e tampa da gummy sem número de lote e sem validade nos certificados da Randon (ao contrário dos demais); nenhuma embalagem da linha tem declaração de aptidão para contato com alimentos (RDC 326/2019 e 589/2021); alegação 'sem lactose' no rótulo sem laudo de lactose; designação de venda no rótulo ('Suplemento alimentar CREATINA em goma') não segue o art. 12 da RDC 243/2018 (correto: 'Suplemento Alimentar em goma').
- ANÁLISE DE PRODUTO ACABADO: 12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf -- RG 005714/03/2026 R:00 (micro) e RG 005711/03/2026 R:00 (glúten), MGW Consultoria em Garantia de Qualidade Ltda, emissão 03/04/2026, amostra 'Lemoncaps Creatina em Gummy' lote G20/1556, coleta 23/03/2026, fabricação mar/26, validade mar/28 -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf — NÃO É POSSÍVEL COMPARAR: esta análise de produto acabado contém exclusivamente Enterobacteriaceae (<1,0×10¹ UFC/g), Bolores e Leveduras (<1,0×10¹ UFC/g), Salmonella (ausência/25g) e Glúten (<10 ppm). NÃO há doseamento de creatina nem de creatinina no produto acabado. Os 3.000 mg/porção calculados no memorial (a partir da massa de matéria-prima pesada × teor do laudo) NÃO têm, até este dossiê, nenhuma confirmação analítica independente no produto já pronto. Isto é um achado importante e não uma suposição: o arquivo foi aberto e lido integralmente (2 páginas) para confirmar.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 7662.3 mg; porção declarada ≈ 6000.0 mg; diferença +1662.30 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: 30
- Fontes secundárias conferidas: Laudo materia-prima lido: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/01_laudo_creatina-monoidratada_lote-217949.pdf (SM Empreendimentos Farmaceuticos, lote interno 26A05-B023-217949 / lote fabricante 20250913, analise 03/02/2026, CAS 6020-87-7, teor base seca 100,5%, perda por dessecacao 11,5%, creatinina 95 ppm, dicianamida 43 ppm, conclusao APROVADO). Este laudo NAO tem copia propria na pasta 15_CREATINA-PO/ARQUIVOS-PDF -- os dois produtos compartilham o mesmo lote 217949 e o memorial da po remete aos mesmos dados. | Análise de produto acabado LIDA: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/12_ANALISE_PRODUTO-ACABADO_creatina-gummy.pdf -- contém só microbiologia (Enterobacteriaceae, Bolores e Leveduras, Salmonella) e glúten (<10 ppm); NÃO contém doseamento de creatina (ver divergências). | Ficha técnica LIDA: /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-CREATINA-GUMMY-FRUTAS-VERMELHAS-SUELEN.docx (código interno FT-PRD-GUMMY-CREA-FV-001, sem campo de revisão/data no corpo do documento) -- diverge do memorial em peso líquido, peso por goma e demais valores nutricionais (ver divergências); concorda apenas no valor de creatina por porção (3.000 mg) e, coincidentemente, no sódio quando escalado pela metade. | Rótulo real (arte) LIDO parcialmente: tentativa de leitura de /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/30_ROTULO_CreatinaGummy_2026.pdf FALHOU -- arquivo de 128 MB excede o limite técnico de 20 MB da ferramenta de leitura de PDF. NÃO LEGÍVEL por limite técnico (testado, não presumido).

---

## 4. `dores-musculares` — Dores Musculares (memorial: NUVIART)

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/08_NUVIART/MEMORIAL-CALCULO-NUVIART-rev02.docx`  
**Revisão:** 02 — 13/08/2026 (Tabela 0)  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/08_NUVIART/MEMORIAL-CALCULO-NUVIART-rev02.docx

**Porção:** 1 g (2 cápsulas) · 30 porções por embalagem · **Formato:** cápsula

**Cápsula:** tamanho 0 (gelatinosa dura) — vazia 98,45 mg (Qualicaps/Genix, lote 2505380SA); cheia 598,45 mg (Tabela 29); massa 500 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Metilsulfonilmetano (MSM) | 352,86 | 99,19% | laudo lote 222159 | 350 | 350,001834 | Sim | — | 222159 |
| 2 | Sulfato de glucosamina com cloreto de potássio | 197,43 | 101,3% | laudo lote 212517 | 200 | 199,99659 | Sim | — | 212517 |
| 3 | Ácido ascórbico (vitamina C) | 140,7 | 99,5% | laudo lote 950467 | 140 | 139,9965 | Sim | — | 950467 |
| 4 | Colágeno hidrolisado (Peptan) | 100 | — | não informado | 100 | 100 | Sim | — | AUTO040177 |
| 5 | Carbonato de cálcio DC | 100 | — | não informado | 40 | 40 | indeterminado | — | 950403 |
| 6 | Bisglicinato de magnésio | 100 | 30,22% | laudo lote 90844 | 30,22 | 30,22 | Sim | — | 90844 |
| 7 | Colágeno tipo II (não desnaturado, nominal) | 40 | — | não informado | 40 | 40 | indeterminado | — | AUTO040251 |
| 8 | Vitamina E pó 50% (acetato de DL-α-tocoferila) | 60 | 50,7% | laudo lote 91320 | 20,39 | 30,42 | Sim | — | 91320 |
| 9 | Bisglicinato de zinco | 50,28 | 19,89% | laudo lote 055-ZN/25 | 10 | 10,000692 | Sim | — | 055-ZN/25 |
| 10 | Selênio quelato (glicinato de selênio) | 35,79 | 0,2794% | laudo lote 044152 | 0,1 | 0,099997 | Sim | — | 044152 |
| 11 | Quelato Ferro Bios 20% | 39,8 | 20,1% | laudo lote NPT.0525/710 | 8 | 7,9998 | Sim | — | NPT.0525/710 |
| 12 | Vitamina D3 pó 100.000 UI/g (colecalciferol) | 17,39 | — | não informado | 50 | 50 | Sim | — | 91408 |
| 13 | Cloridrato de piridoxina (vitamina B6) | 1,58 | 99,9% | laudo lote 91188 | 1,3 | 1,57842 | Sim | — | 91188 |
| 14 | Metilcobalamina (vitamina B12) | 0,01 | 89,27% | laudo lote 219376 | 9,94 | 0,008927 | indeterminado | — | 219376 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (INS 551) — antiumectante | 0 |

**Massa total (insumos + excipientes):** 1235,84 mg  
**A soma fecha com a porção declarada?** **NÃO**

**Observações e divergências:**

- 🔴🔴 ERRO DE RÓTULO MAIS GRAVE DA LINHA: vitamina D declarada como "50 mg" (correto: 50 mcg) — erro de 1.000×, e %VD de 1000% calculado com VDR revogado (correto pela IN 75/2020: 333%). Correção urgente antes de qualquer impressão.
- 🔴🔴 TRÊS ALERGÊNICOS DE DECLARAÇÃO OBRIGATÓRIA NÃO DECLARADOS: colágeno tipo II "pode conter leite, lactose e peixe" + glucosamina de crustáceos — nenhum consta do rótulo vigente. Classificado no próprio memorial como "a não conformidade mais grave deste produto" (Tabela 31).
- 🔴🔴 COLÁGENO TIPO II — bifurcação regulatória total conforme o fabricante de origem seja confirmado ou não (0,5% do mínimo vs. 30× o mínimo com alegação liberada) — certificado atual não nomeia o fabricante.
- 🔴 A FÓRMULA ESTOURA A PORÇÃO DECLARADA: 14 insumos somam 1.235,84mg (123,58%) para uma porção de 1.000mg — excesso de 235,84mg (+23,58%), sem excipiente declarado.
- 🔴 FERRO — rótulo ambíguo entre massa do sal (bisglicinato) e massa do ferro elementar, mesmo padrão de risco de leitura de outros produtos da linha (o cálculo do memorial está correto; é a redação do rótulo que induz a erro).
- 🔴 CÁLCIO não declarado na tabela nutricional apesar de presente e de ter limite no painel; teor de cálcio do carbonato não confirmado em laudo (calculado por valor nominal).
- 🔴 SELÊNIO: fonte (glicinato/quelato) não consta entre as 5 fontes autorizadas pelo painel ANVISA — mesmo problema já visto no Bio Princess.
- 🔴 CÁLCIO e MAGNÉSIO abaixo dos mínimos ANVISA (22% e 48% do mínimo respectivamente) — presença permitida, alegação vedada.
- 🔴 COLÁGENO HIDROLISADO abaixo do mínimo (1,2% de 8,4g/dia).
- Vitamina E: rótulo identifica "DL-alfa-tocoferol"; insumo real é o ACETATO de DL-alfa-tocoferila (correção de nomenclatura).
- Fonte dos limites mínimo/máximo: painel oficial ANVISA "Constituintes Autorizados", consultado em 13/08/2026 (559 constituintes via API).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1235.84 mg; porção declarada ≈ 1000.0 mg; diferença +235.84 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL no texto extraído.

---

## 5. `detox-matinal-lemon-shot-300g` — Detox Matinal (Lemon Shot) 300g

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/11_DETOX/MEMORIAL-CALCULO-DETOX-rev02.docx`  
**Revisão:** 02 — 13/08/2026 (Tabela 0 do próprio memorial)  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/11_DETOX/MEMORIAL-CALCULO-DETOX-rev02.docx

**Porção:** 10 g (1 dose) · 30 porções por embalagem · **Formato:** pó para diluição (sabor limão)


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ácido ascórbico (vitamina C) | 1608,04 | 99,5% | laudo lote 950467 | 1600 | 1599,9998 | Sim | — | 950467 |
| 2 | Ácido cítrico anidro | 670 | 100,1% | laudo lote GE2844AFG | — | 670,67 | indeterminado | — | GE2844AFG |
| 3 | Café verde insolúvel | 400 | 53,86% | laudo lote 10841 | 215,44 | 215,44 | Sim | — | 10841 |
| 4 | Flavorizante limão pó hidrossolúvel | 330 | — | não informado | — | — | indeterminado | — | 19934 |
| 5 | Extrato de cúrcuma (rizomas) | 130 | 0,42% | laudo lote NPT.0425/580 | 0,55 | 0,546 | Sim | — | NPT.0425/580 |
| 6 | Extrato de laranja moro | 100 | 1,47% | laudo lote 17624 | 1,47 | 1,47 | Sim | — | 17624 |
| 7 | Dióxido de silício (INS 551) | 100 | — | não informado | — | — | indeterminado | — | — |
| 8 | Sucralose | 50 | 99,74% | laudo lote 91233 | — | 49,87 | indeterminado | — | 91233 |
| 9 | Corante ("verde folha") | 17 | — | não informado | — | — | indeterminado | — | 250301 |
| 10 | Bisglicinato de zinco | 1,45 | 19,89% | laudo lote 055-ZN/25 | 0,29 | 0,288405 | Sim | — | 055-ZN/25 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Maltodextrina — q.s.p. | 6593,51 |

**Massa total (insumos + excipientes):** 10000 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- 🔴🔴 RESVERATROL anunciado no texto de apresentação do rótulo ("a combinação de cúrcuma e RESVERATROL...") mas NÃO EXISTE na composição — publicidade enganosa (infração RDC 727/2022 e CDC). Mesmo texto usado no rótulo do Lidema.
- 🔴 CURCUMINA a 0,7% do mínimo ANVISA (0,55mg entregues contra mínimo de 80mg) — abaixo do mínimo mesmo sendo apresentada como ingrediente central do produto.
- 🔴 ZINCO a 18% do mínimo ANVISA (0,29mg contra mínimo de 1,65mg) — não pode ser alegado como fonte de zinco.
- 🔴 CAFÉ VERDE: quatro problemas no mesmo laudo — espécie divergente do rótulo (Coffea arabica declarado × Coffea robusta no laudo), fabricante (HERBALTEC) fora da lista de 3 aprovados pelo painel ANVISA, microbiologia "ND" em todos os ensaios, e irradiação a 10kGy não confirmada na rotulagem.
- 🔴 LARANJA MORO: fabricante do certificado (AllPremium) diferente do único fabricante aprovado pelo painel (BIONAP SRL, Itália) — quantidade correta, fonte irregular.
- 🔴 MALTODEXTRINA (65,94% da fórmula, maior componente): certificado de análise VENCIDO desde 26/07/2026.
- 🔴 CORANTE: rótulo declara tartrazina + azul brilhante FCF; o único laudo em arquivo é de um "corante verde folha" sem INS, sem doseamento e com cor incompatível (alaranjado) — rastreabilidade do corante comprometida.
- Tartrazina (se confirmada) exige declaração destacada "Contém TARTRAZINA (INS 102)" — ausente do rótulo revisado.
- Fonte dos limites mínimo/máximo: painel oficial ANVISA "Constituintes Autorizados", consultado em 13/08/2026 (559 constituintes via API) — não usou PDF consolidado.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 10000.0 mg; porção declarada ≈ 10000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL no texto extraído (não há tabela de rendimento padrão de lote nas 30 tabelas do dump).

---

## 6. `focus-colina` — Focus Colina

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/05_FOCUS-COLINA/MEMORIAL-CALCULO-FOCUS-COLINA-rev02.docx`  
**Revisão:** rev02 (documento interno MEM-CALC-FOCUS-rev02)  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/05_FOCUS-COLINA/MEMORIAL-CALCULO-FOCUS-COLINA-rev02.docx

**Porção:** 1 g (2 cápsulas) · 30 porções por embalagem · **Formato:** cápsula

**Cápsula:** tamanho 0 (zero), gelatinosa dura; massa 500 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Bitartarato de colina | 1157,35 | 40,61% | laudo lote 91442 | 470 | 469,999835 | Sim | NÃO INFORMADO NO MEMORIAL (laudo desta matéria-prima não fazia parte do escopo desta tarefa) | 91442 |
| 2 | L-tirosina (vegetal) | 220,22 | 99,9% | laudo lote 91382 (memorial) = lote interno 91382 do laudo (CONFIRMADO, lote fabricante 20250508, fab. 08/05/2025, val. 07/05/2028, origem/procedência China) | 220 | 219,99978 | Sim | INLAB / Analitic Tecnologia de Precisão Ltda — R. Guian 554, Vila Campestre, São Paulo/SP (laudo lido; responsável Adriana Juliani, CRF-SP 16.092) | 91382 (memorial) = lote interno 91382 do laudo (CONFIRMADO, lote fabricante 20250508, fab. 08/05/2025, val. 07/05/2028, origem/procedência China) |
| 3 | L-teanina | 114,82 | 100,16% | laudo lote AUTO039250 | 115 | 115,003712 | Sim | NÃO INFORMADO NO MEMORIAL (laudo desta matéria-prima não fazia parte do escopo desta tarefa) | AUTO039250 |
| 4 | L-carnitina base | 99,01 | 95,95% | laudo lote 216523 (memorial) = lote interno 25K12-B008-216523 / lote fabricante A2508084 (laudo, CONFIRMADO). Fab. 19/08/2025, venc. 18/08/2027, análise 11/12/2025, origem/procedência China. | 95 | 95,000095 | Sim | Fagron Distribution Brazil / SM Empreendimentos Farmacêuticos Ltda (laudo lido; responsáveis João Paulo Sartin Mendes CRF-GO 7.355 e Amanda R. Victorino CRF-SP 50.836) | 216523 (memorial) = lote interno 25K12-B008-216523 / lote fabricante A2508084 (laudo, CONFIRMADO). Fab. 19/08/2025, venc. 18/08/2027, análise 11/12/2025, origem/procedência China. |
| 5 | Bisglicinato de magnésio | 198,54 | 30,22% | assumido | 60 | 59,998788 | Sim | NÃO INFORMADO NO MEMORIAL (laudo desta matéria-prima não fazia parte do escopo desta tarefa) | 90844 — memorial (Tabela 19, Anexo 07) afirma que este lote está VENCIDO ('Os dois certificados de bisglicinato de magnésio localizados estão vencidos, e o site do fornecedor não publica lote mais recente') |
| 6 | Mio-inositol | 25,04 | 99,86% | laudo lote 950479 | 25 | 25,004944 | Sim | NÃO INFORMADO NO MEMORIAL (laudo desta matéria-prima não fazia parte do escopo desta tarefa) | 950479 |
| 7 | Vitamina D3 pó 100.000 UI/g | 1,74 | — | não informado | 0,005 | 0,005 | Sim | NÃO INFORMADO NO MEMORIAL (laudo desta matéria-prima não fazia parte do escopo desta tarefa) | 91408 |
| 8 | Cloridrato de piridoxina (vitamina B6) | 1,58 | 82,19% | laudo lote 91188 | 1,3 | 1,298602 | Sim | NÃO INFORMADO NO MEMORIAL (laudo desta matéria-prima não fazia parte do escopo desta tarefa) | 91188 |
| 9 | Metilcobalamina (vitamina B12) | 0,0025 | 94,54% | laudo lote 219376 | 0,0024 | 0,002364 | **NÃO** | FAGRON / SM EMPREENDIMENTOS FARMACÊUTICOS — lote de fabricante 032511057 (conforme Tabela 17 do próprio memorial). Laudo de B12 NÃO estava entre os PDFs desta pasta disponibilizados para conferência direta nesta tarefa. | 219376 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (INS 551) — antiumectante: LISTADO no §13 (INGREDIENTES) do memorial, mas com 0,00 mg alocados na Tabela 7 (fechamento de massa) — não há espaço físico para ele na fórmula atual, pois os insumos ativos sozinhos já somam 1.818,30 mg para uma porção declarada de 1.000 mg. | 0 |
| Cápsula gelatinosa dura tamanho 0 (invólucro, não é massa da porção): 98,45 mg vazia por unidade, fornecedor Qualicaps/Genix, lote 2505380SA, validade 02/04/2030 (Tabela 23/24 do memorial) — composição do invólucro: gelatina, dióxido de titânio (INS 171) e lauril sulfato de sódio (§11.1) / memorial §13 acrescenta água purificada à lista. | — |
| DIVERGÊNCIA: o rótulo vigente (30_ROTULO_FocusColina_2026.pdf, lido nesta tarefa) declara a cápsula como 'gelatina, água purificada e corante dióxido de titânio (INS 171)' — SEM mencionar o lauril sulfato de sódio que o próprio memorial (§11.1 e §13) atribui à cápsula. | — |

**Massa total (insumos + excipientes):** 1818,3025 mg  
**A soma fecha com a porção declarada?** **NÃO**

**Observações e divergências:**

- FORMATO — CÁPSULA × PÓ SOLÚVEL (achado central pedido nesta tarefa): /Users/diegofrancisco/Desktop/POPS/FORMULAS-FOCUS-COLINA-SOLUVEL-150g-300g.pdf (documento FOR-FORM-FOCUS-SOL-001, arquivo datado 20/08/2026, uma semana após o rev02 de 13/08/2026) descreve um FORMATO DIFERENTE — pó solúvel em pote de 150 g (dose de 5 g, 30 doses) e 300 g (dose de 10 g, 30 doses) — e NÃO é a mesma fórmula apenas re-embalada. Ingredientes exclusivos do solúvel, ausentes da cápsula: maltodextrina (veículo, 2.554,23 mg/dose — maior insumo da fórmula), ácido cítrico anidro (335,00 mg, acidulante), flavorizante limão pó (165,00 mg), sucralose (25,00 mg, edulcorante). Dos 9 ativos, 6 têm massa IDÊNTICA à da cápsula (bitartarato de colina 1.157,35 mg; L-teanina 114,82 mg; L-carnitina base 99,01 mg; mio-inositol 25,04 mg; vitamina D3 1,74 mg; cloridrato de piridoxina 1,58 mg), mas 2 têm massa DIFERENTE E MAIOR: L-tirosina (262,76 mg no solúvel vs 220,22 mg na cápsula — o solúvel entrega 262,5 mg, exatamente o mínimo ANVISA que a cápsula não atinge) e bisglicinato de magnésio (208,47 mg no solúvel vs 198,54 mg na cápsula — o solúvel entrega 63 mg, exatamente o mínimo ANVISA que a cápsula não atinge). A metilcobalamina do solúvel (0,0027 mg) também bate com o recálculo correto da B12 da cápsula (89,27% tal qual), não com o valor escrito no §6.1 da cápsula (0,0025 mg). CONCLUSÃO desta leitura: são duas fórmulas APARENTADAS (mesma base de ativos, mesmo fabricante/RT/CNPJ) mas NÃO IDÊNTICAS — o pó solúvel parece uma reformulação/correção que já resolve os dois pontos que a própria cápsula rev02 sinaliza como abaixo do mínimo ANVISA (L-tirosina e magnésio), adaptada a um formato de pó para diluir. Não é possível afirmar qual data/revisão é 'mais nova' regulatoriamente — o memorial de cálculo formal da cápsula é rev02/13-08-2026; o PDF do pote solúvel é uma ficha de fórmula (POPS), datada por metadado de arquivo em 20/08/2026, sem número de revisão indicado no próprio conteúdo do documento.
- B12/metilcobalamina — inconsistência de teor DENTRO do próprio memorial rev02: §6.1 usa 94,54% (origem não explicada); Tabela 17, tratando do mesmo lote 219376, documenta teor tal qual de 89,27%. Ver observação detalhada no insumo 'Metilcobalamina' acima. Recalculado com 89,27%: massa deveria ser ≈0,00269 mg, não 0,0025 mg. O PDF independente da fórmula solúvel usa 0,0027 mg — reforça que o §6.1 da cápsula está desatualizado/errado.
- RÓTULO VIGENTE × MEMORIAL — conferido por leitura direta do rótulo (30_ROTULO_FocusColina_2026.pdf), não apenas aceito por afirmação do memorial: (a) CONFIRMADO — colina, L-tirosina, L-teanina, L-carnitina e inositol aparecem no texto 'Composição por porção' do rótulo, mas NÃO constam da tabela formal 'INFORMAÇÃO NUTRICIONAL' (%VD), que só lista Magnésio, B6, B12 e D; (b) CONFIRMADO — rótulo declara 'agente de massa celulose microcristalina', divergente do padrão de dióxido de silício do memorial, e sem espaço de massa disponível na fórmula atual para qualquer agente de massa; (c) CONFIRMADO — rótulo declara 'cianocobalamina', mas o lote/laudo adotado no memorial (219376) é de METILCOBALAMINA, forma química diferente; (d) NOVO — rótulo descreve a cápsula como 'gelatina, água purificada e corante dióxido de titânio (INS 171)', OMITINDO o lauril sulfato de sódio que o próprio memorial (§11.1 e §13) inclui na composição do invólucro; (e) todos os 9 valores numéricos de 'entrega' (colina 470 mg … B12 2,4 mcg) batem EXATAMENTE entre rótulo e memorial — sem divergência numérica nesse ponto.
- FÓRMULA DA CÁPSULA NÃO CABE NA PORÇÃO DECLARADA — já apontado pelo próprio memorial (Tabela 12) e CONFIRMADO por mim recalculando a soma dos 9 insumos: 1.818,3025 mg (memorial arredonda para 1.818,30 mg) para uma porção declarada de 1.000 mg — excesso de 818,30 mg (quase o dobro). Maior responsável isolado: bitartarato de colina, 1.157,35 mg sozinho já ultrapassa a porção inteira.
- MAGNÉSIO (lote 90844) — o próprio memorial (Tabela 19) declara que os dois certificados localizados para este insumo estão VENCIDOS e que o fornecedor não publica lote mais recente. NÃO CONFIRMADO por mim diretamente: o laudo de magnésio não fazia parte do escopo desta tarefa (só recebi laudos de L-tirosina e L-carnitina) — registro apenas o que o memorial afirma sobre si mesmo.
- L-TEANINA — o próprio memorial (Tabela 18) declara que o insumo em uso é de fonte sintética, não a fonte autorizada pelo painel ANVISA (L-teanina de folhas de Camellia sinensis, especificação Blue California CO). NÃO CONFIRMADO por mim diretamente: laudo de L-teanina fora do escopo desta tarefa.
- VITAMINA D3 — nome comercial do insumo diz '100.000 UI/g', mas o teor usado no cálculo do memorial é 115.000 UI/g (15% acima do nominal do nome). Pode ser apenas o valor real do Certificado de Análise deste lote específico dentro de faixa de especificação, mas NÃO CONFIRMADO por mim: laudo de D3 fora do escopo desta tarefa.
- RASCUNHO ANTIGO SUPERADO E QUEBRADO — /Users/diegofrancisco/Downloads/Memorial_FOCUS_COLINA.doc (27/07/2026, revisão 00, formato HTML salvo como .doc): é uma saída de sistema/template NÃO PREENCHIDA — usa texto-placeholder literal 'fornecendo respectivamente' no lugar de nomes reais de insumos, soma da fórmula de apenas 0,21 mg para uma porção-alvo de 1.000 mg, com o PRÓPRIO documento alertando '⚠ A soma da fórmula (0,21 mg) não fecha o peso-alvo (1.000 mg): Δ -999,79 mg'. Além disso mistura, no mesmo documento, linguagem de produto LÍQUIDO/GOTAS ('SUPLEMENTO ALIMENTAR EM LÍQUIDO', 'Porção: 1 mL (20 gotas)', 'ingerir 20 gotas ao dia') com linguagem de CÁPSULA ('Cápsulas duras de gelatina', '60 unidades', 'Peso líquido: 30 g') — internamente contraditório. CONCLUSÃO: documento claramente SUPERADO pelo rev02 e inutilizável como fonte de dados; NENHUM valor numérico dele foi aproveitado nesta extração.
- FICHA TÉCNICA DEDICADA — busca em /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/ por '*focus*' ou '*colina*' (case-insensitive) NÃO retornou nenhum arquivo. A pasta existe e tem 36 arquivos (outras fichas técnicas e fórmulas da Lemoncaps), nenhum relacionado a Focus Colina. NÃO EXISTE ficha técnica dedicada para este produto naquela pasta.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1818.3025 mg; porção declarada ≈ 1000.0 mg; diferença +818.30 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL — o memorial rev02 não declara um tamanho de lote de produção (batch size); só informa 30 porções por EMBALAGEM (60 cápsulas / 30 g), o que é unidade comercial, não tamanho de lote fabril.
- Fontes secundárias conferidas: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/05_FOCUS-COLINA/ARQUIVOS-PDF/02_laudo_L-tirosina-vegetal_lote-91382.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/05_FOCUS-COLINA/ARQUIVOS-PDF/04_laudo_L-carnitina-base_lote-216523.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/05_FOCUS-COLINA/ARQUIVOS-PDF/30_ROTULO_FocusColina_2026.pdf | /Users/diegofrancisco/Downloads/Memorial_FOCUS_COLINA.doc | /Users/diegofrancisco/Desktop/POPS/FORMULAS-FOCUS-COLINA-SOLUVEL-150g-300g.pdf | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/ (busca por *focus*/*colina* — pasta existe, 36 arquivos, NENHUM resultado; NÃO EXISTE ficha técnica dedicada)

---

## 7. `moro-slim` — Moro Slim

**Documento lido:** `MEM-CALC-MOROSLIM-rev02, nome do produto no próprio documento: 'MORO SLIM COMPLEX' (/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/07_MORO-SLIM/MEMORIAL-CALCULO-MORO-SLIM-rev02.docx)`  
**Revisão:** 02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — MEM-CALC-MOROSLIM-rev02, nome do produto no próprio documento: 'MORO SLIM COMPLEX' (/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/07_MORO-SLIM/MEMORIAL-CALCULO-MORO-SLIM-rev02.docx)

**Porção:** 1 g (2 cápsulas) por porção · 30 porções por embalagem · **Formato:** Suplemento alimentar em cápsula gelatinosa dura, tamanho 0 · apresentação: pote com 60 cápsulas, peso líquido 30 g

**Cápsula:** tamanho 0; massa 98,45 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Feno grego pó (semente) | 220 | — | não informado | 220 | 220 | Sim | NÃO CONSTA (sem laudo avulso em PDF; mesmo lote usado na LIDEMA) | AUTO9IVT |
| 2 | Laranja moro, extrato | 175 | 1,47% | laudo lote 17624 (interno); lote original 1289 | 2,57 | 2,5725 | Sim | Certificado em nome Embrafarma, lote original 1289; campo 'Fabricante' do laudo diz AllPremium (Cotia/SP) -- LIDO NO PRÓPRIO MEMORIAL (citação/transcrição), PDF do laudo não estava em ARQUIVOS-PDF desta pasta | 17624 (interno); lote original 1289 |
| 3 | Extrato de cúrcuma | 135 | 0,42% | laudo lote NPT.0425/580 | 0,57 | 0,567 | Sim | Laudo NaturalPRO (mesmo lote NPT.0425/580 usado na LIDEMA) -- citado no próprio memorial | NPT.0425/580 |
| 4 | Espirulina (Arthrospira platensis) | 122 | — | não informado | 122 | 122 | Sim | Santosflora Comércio de Ervas Ltda (Mairiporã/SP, CNPJ 51.569.309/0004-80) -- LIDO DIRETAMENTE NO LAUDO por este agente; laudo é transcrição do original do exportador chinês | AUTO9JRN |
| 5 | Quitosana HDP | 122 | 90,66% | laudo lote 20464 (lote original 13/1) | 122 | 110,6052 | Sim | Laudo em papel timbrado Embrafarma; campo 'Fabricante' = Quimer; rodapé de contato = AllPremium Indústria e Comércio LTDA (Cotia/SP) -- LIDO DIRETAMENTE NO LAUDO por este agente | 20464 (lote original 13/1) |
| 6 | Café verde, insolúvel | 110 | 53,86% | laudo lote 10841 | 59,25 | 59,246 | Sim | HERBALTEC (Pariquera-Açu/SP) -- citado no próprio memorial (laudo nº 5271); PDF do laudo não estava em ARQUIVOS-PDF desta pasta | 10841 |
| 7 | Psyllium, pó | 66 | — | não informado | 66 | 66 | Sim | NÃO CONSTA (sem laudo avulso em PDF) | AUTO9JPE |
| 8 | Inulina | 44 | 91% | laudo lote 206486 | 40,04 | 40,04 | Sim | NÃO CONSTA (sem laudo avulso em PDF) | 206486 |
| 9 | Acetato de retinol (vitamina A) | 8,8 | — | não informado | 1,5 | 1,5 | Sim | NÃO CONSTA no memorial rev02 nem no memorial antigo (POPS) para este insumo especificamente | 215230 |
| 10 | Picolinato de cromo | 2,03 | 12,34% | laudo lote 91190 (lote externo 2024122501) | 0,25 | 0,250502 | Sim | Analitic Tecnologia de Precisão Ltda, origem China -- LIDO NO MEMORIAL ANTIGO (POPS); mesmo lote citado no memorial rev02 atual sem repetir o nome do fornecedor | 91190 (lote externo 2024122501) |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (INS 551) — antiumectante | 2,474 |

**Massa total (insumos + excipientes):** 1007,304 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- Nome comercial do produto: Memorial rev02 (fonte primária, Downloads) chama o produto 'MORO SLIM COMPLEX' em todo o texto (título, tabela de identificação, marca). Ficha técnica e memorial antigo (ambos no POPS) chamam apenas 'MORO SLIM', sem 'Complex'. Slug do catálogo fornecido para esta tarefa é 'moro-slim'.
- Tamanho da cápsula: Memorial rev02 (atual): cápsula gelatinosa dura tamanho 0 (98,45mg vazia, mesmo lote Qualicaps/Genix 2505380SA usado na LIDEMA). Memorial antigo (POPS, rev00 30/07/2026): tabela de identificação declara 'Cápsula dura de gelatina tamanho 00' -- e o próprio título do documento diz '60 CÁPSULAS DE 500 MG'. Cápsula tamanho 0 e tamanho 00 são fisicamente diferentes (00 é maior). Divergência não resolvida nos documentos lidos.
- %VD da vitamina A: Memorial rev02 (atual, base VDR da IN 75/2020, referência 800 mcg RAE): 1.500 mcg RAE = 188% VD. Ficha técnica e memorial antigo (ambos POPS, base IDR da RDC 269/2005, referência 600 mcg): 1.500 mcg = 250% VD. O PRÓPRIO memorial antigo documenta ter corrigido internamente de 188% para 250% numa revisão anterior sua, citando a RDC 269/2005 -- ou seja, os dois valores já circularam nos documentos da empresa em momentos diferentes, com bases regulatórias diferentes. Este agente NÃO verificou, nesta tarefa de leitura documental, qual VDR está vigente para vitamina A em suplementos -- registra-se a divergência com os dois conjuntos de números e a base de cada um; resolução fica PENDENTE de checagem na norma vigente.
- CRÍTICO -- massa do insumo vitamina A (acetato de retinol): Memorial rev02 (atual): 8,80mg de acetato de retinol (568.116 UI/g) para entregar 1.500 mcg RAE -- conta demonstrada e verificada por este agente (recalculo fecha, diff 0,17 mcg). Memorial antigo (POPS, rev00): 1,5mg de acetato de retinol para a MESMA entrega declarada (1.500 mcg RE) -- 5,87 vezes MENOS massa. O documento antigo NÃO demonstra de qual teor de laudo os 1,5mg derivam (ao contrário do que faz, com detalhe, para o cromo). Se a potência do insumo já fosse 568.116 UI/g na época do documento antigo e a produção seguiu literalmente 'peso de 1,5mg na fórmula', a entrega real teria sido de aproximadamente 256 mcg RAE -- 17% do declarado, uma subdose de aproximadamente 5,9 vezes. Este agente NÃO tem, pelos documentos lidos, como determinar se algum lote de produção real já saiu com o valor antigo (1,5mg) -- fica PENDENTE, e é do mesmo padrão dos erros históricos documentados no projeto (B12 com lote errado; K2 pesada como MK-7 pura, subdose de 67 vezes). Recomenda-se verificação urgente com o Responsável Técnico sobre qual valor foi efetivamente usado em produção, em qual período.
- Espécie do café verde: Ficha técnica (POPS), memorial antigo (POPS) e o PRÓPRIO rótulo vigente (citado dentro do memorial rev02) declaram 'Coffea arabica L.'. O laudo real do insumo em uso (lote 10841, fornecedor HERBALTEC) é de 'Coffea robusta' -- não conformidade já registrada pelo memorial rev02 (o mais recente e mais detalhado dos três documentos), mas ainda presente nos outros dois documentos administrativos.
- Dióxido de silício (INS 551): Ficha técnica e memorial antigo (ambos POPS) trazem o dióxido de silício com massa própria de 2,474mg (0,247% da fórmula) na tabela de composição/fechamento. Memorial rev02 (atual) NÃO inclui esse insumo em nenhuma tabela de massa/teor, apesar de listá-lo entre os ingredientes e ter um certificado anexado para ele. Ver detalhe em 'excipientes'.
- Alegação genérica de conformidade microbiológica (memorial antigo): O memorial antigo (POPS, seção 6.3) afirma genericamente que 'os certificados anexados apresentam resultado conforme' para metais pesados e microbiologia de TODOS os insumos. Essa afirmação NÃO se sustenta para a espirulina (lote AUTO9JRN): o laudo Santosflora, lido integralmente por este agente, não contém nenhum ensaio de metais pesados, microcistinas ou microbiologia -- apenas ensaios organolépticos e físico-químicos básicos. Divergência entre o que o memorial antigo afirma e o que o laudo realmente contém.
- Situação/vigência dos documentos: O memorial antigo (POPS) se autodeclara 'Situação: Vigente' apesar de ser datado de 30/07/2026, anterior ao memorial rev02 (13/08/2026) que o substitui na prática -- indício de que o campo de status não foi atualizado quando o documento novo foi emitido.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1007.304 mg; porção declarada ≈ 1000.0 mg; diferença +7.30 mg. Nenhum item ficou sem massa extraída.
- Fontes secundárias conferidas: {"arquivo": "04_laudo_spirulina_lote-AUTO9JRN.pdf", "fornecedor_no_laudo": "Santosflora Comércio de Ervas Ltda", "resultado": "CONFIRMADO -- laudo realmente não traz doseamento de ativos, nem microcistinas, nem metais pesados, nem microbiologia; confirma teor de água 4,29% e pH 7,29 citados no memorial."} | {"arquivo": "05_laudo_quitosana-HDP_lote-20464.pdf", "fornecedor_no_laudo": "Embrafarma / Fabricante: Quimer / contato AllPremium", "resultado": "CONFIRMADO -- laudo traz os dois teores citados no memorial: grau de desacetilação 90,66% e teor de fibra alimentar total 21,26%. Metais pesados 0,00 ppm em todos os itens testados; microbiologia conforme (patógenos ausentes)."} | {"arquivo": "Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-MORO-SLIM.docx", "fornecedor_no_laudo": "n/a (ficha técnica, não laudo)", "resultado": "COMPARADO -- composição em massa por insumo (220/175/135/122/122/110/66/44mg) bate 100% com o memorial rev02 atual. Diverge em: nome do produto ('MORO SLIM', sem 'Complex'), %VD da vitamina A (250% vs 188% do rev02) e presença de dióxido de silício quantificado (2,474mg). A subseção 'TABELA NUTRICIONAL — APRESENTAÇÃO EM GRADE' não retornou conteúdo de texto/tabela na extração (provável imagem incorporada); o conteúdo nutricional equivalente já foi capturado pela 'APRESENTAÇÃO LINEAR' no mesmo arquivo, então não há perda de informação relevante."} | {"arquivo": "Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-MORO-SLIM.docx", "fornecedor_no_laudo": "n/a (memorial de cálculo, revisão 00 de 30/07/2026, mais antigo que o rev02)", "resultado": "COMPARADO -- é um documento mais completo e mais tabelado que a ficha técnica isolada (5,97MB vs 19,2MB do rev02; a diferença de tamanho é sobretudo imagens anexadas em maior resolução no rev02, não conteúdo textual a mais). NÃO é um rascunho vazio nem idêntico ao atual: traz peso do insumo de vitamina A completamente diferente (1,5mg vs 8,80mg do rev02 -- ver divergência crítica), tamanho de cápsula diferente (00 vs 0), base de %VD diferente para vitamina A (RDC 269/2005 vs IN 75/2020 do rev02), e inclui a linha de dióxido de silício que o rev02 omite. Documento tem forte detalhamento técnico (ex.: teor de picolinato 99,30%, perda por secagem 0,60% do próprio picolinato de cromo, dado que nem o memorial rev02 atual repete)."}

---

## 8. `melatonina-triptofanos-encapsulados` — Melatonina + Triptofanos (Encapsulados)

**Documento lido:** `/Users/diegofrancisco/Downloads/dossie-tecnico-melatonina-triptofanos-encapsulados (1).pdf`  
**Revisão:** Documento gerado (jsPDF), sem número de revisão — 2ª versão encontrada (3 páginas, emitida 13/09/2026 00:37); existe uma 1ª versão de 12/09/2026 22:22 (1 página, mesmos números de composição, sem o texto do marco regulatório) tratada como rascunho anterior do mesmo gerador, não como documento conflitante.  
**Data:** 13/09/2026 (metadado creationDate do PDF)  
**Procedência:** /Users/diegofrancisco/Downloads/dossie-tecnico-melatonina-triptofanos-encapsulados (1).pdf

**Porção:** 1 g (2 cápsulas) · 30 porções por embalagem · **Formato:** cápsula


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | L-triptofano | 572,38 | — | não informado | 572,38 | 572,38 | indeterminado | — | — |
| 2 | Ácido L-aspártico | 150 | — | não informado | 150 | 150 | indeterminado | — | — |
| 3 | L-glutamina | 94,77 | — | não informado | 94,77 | 94,77 | indeterminado | — | — |
| 4 | Fosfatidilserina | 70 | — | não informado | 70 | 70 | indeterminado | — | — |
| 5 | Magnésio (bisglicinato de magnésio) | 63 | — | não informado | 63 | 63 | indeterminado | — | — |
| 6 | Zinco (bisglicinato de zinco) | 29,59 | — | não informado | 29,59 | 29,59 | indeterminado | — | — |
| 7 | Dióxido de silício (INS 551) | 20,01 | — | não informado | — | — | indeterminado | — | — |
| 8 | Melatonina | 0,21 | — | não informado | 0,21 | 0,21 | indeterminado | — | — |
| 9 | Biotina (D-biotina) | 0,045 | — | não informado | 45 | 45 | indeterminado | — | — |

**Massa total (insumos + excipientes):** 1000,005 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- NÃO HÁ MEMORIAL DE CÁLCULO nem laudo/lote para nenhum insumo — o único documento diretamente associado ao nome/segmento/preço do produto do catálogo é um "dossiê técnico" gerado (produtor de PDF: jsPDF, sem assinatura, sem código de documento), com números que aparentam vir do banco de dados do catálogo, não de uma pesagem de laboratório. Todos os "ativo_mg" são a massa nominal declarada, não uma entrega recalculada — conta_fecha não pode ser verdadeiramente verificado para nenhum insumo.
- TRÊS FORMULAÇÕES INCOMPATÍVEIS PARA "MELATONINA + TRIPTOFANO": (1) o dossiê técnico do catálogo (cápsula, 572,38mg de L-triptofano + 6 outros ativos); (2) a ficha CAPLEEV (goma, 860mg de L-triptofano, SEM os outros ativos); (3) a Ordem de Produção OP nº586 para a "Exclusiva Nutri Ltda." (cápsula, 800mg de triptofano + só melatonina, SEM os outros 6 ativos). As três descrevem produtos de nome muito parecido mas NENHUMA delas é claramente "a" fórmula do produto do catálogo Lemoncaps — (2) é de outro cliente/marca (Capleev) e outro formato (goma); (3) é de outro cliente (Exclusiva Nutri) e uma fórmula muito mais simples. Isto é registrado como achado, sem escolher uma das três como "a certa" além da que mais se aproxima do nome/preço/segmento do catálogo (o dossiê técnico).
- Soma dos 9 itens do dossiê técnico = 999,995mg aproximadamente 1.000mg da porção declarada — fecha em massa nominal, mas isso não confirma teor real de nenhum ativo (sem laudo).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1000.005 mg; porção declarada ≈ 1000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Fontes secundárias conferidas: /Users/diegofrancisco/Downloads/FICHA TÉCNICA MELATONINA + TRIPTOFANO CAPLEEV.docx (ficha técnica de OUTRO produto/cliente: goma/gummy "CAPLEEV", 6g/2 gomas, Melatonina 0,21mg + L-triptofano 860mg — dose de triptofano 50% MAIOR que a do dossiê acima, mas é formato GOMA, não cápsula; documento é majoritariamente uma especificação gráfica de rótulo, elaborado por Diego Francisco em 20/03/2026, com o campo "DISTRIBUIDO POR CNPJ E DADOS ?" deixado como pergunta/placeholder não preenchido) | /Users/diegofrancisco/Downloads/Ordem_de_Producao_Melatonina_Triptofano_OP_586_layout_corrigido.pdf (Ordem de Produção OP nº586, produto "Melatonina + Triptofano" em cápsula, mas para o CLIENTE "Exclusiva Nutri Ltda." — fórmula muito mais simples: só Triptofano 800mg + Melatonina 0,21mg + SiO2 76,92mg + amido de milho 122,86mg = 1.000mg/porção, SEM ácido aspártico, L-glutamina, fosfatidilserina, magnésio, zinco ou biotina)

---

## 9. `melatonina-em-gumy-sabor-uva` — Melatonina em Gummy sabor Uva (slug real: "gumy", 1 só "m")

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/MEMORIAL-CALCULO-DREAM-GUMMY-rev02.docx (MEM-CALC-DREAMGUMMY-rev02)`  
**Revisão:** 02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/MEMORIAL-CALCULO-DREAM-GUMMY-rev02.docx (MEM-CALC-DREAMGUMMY-rev02)

**Porção:** 6 g por porção = 2 gomas · 30 porções por embalagem (60 gomas, peso líquido 180 g). Cada goma pesa 3,00 g (180 g ÷ 60 gomas, Tabela 27 do memorial). · **Formato:** gummy


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | L-triptofano | 800,8 | 99,9% | laudo lote 950388 | 800 | 799,9992 | Sim | Analitic Tecnologia de Precisão Ltda (marca INLAB), Ref. A100009 — lote fabricante chinês SA20241004046X | 950388 |
| 2 | Melatonina | 0,211 | 99,33% | laudo lote 950151 | 0,21 | 0,209586 | Sim | Analitic Tecnologia de Precisão Ltda (marca INLAB), Ref. A100065 — lote fabricante MCS211210 | 950151 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Maltitol | — |
| Gelatina pó | — |
| Pectina cítrica | — |
| Goma acácia | — |
| Citrato de sódio (INS 331) | — |
| Sorbato de potássio PA (INS 202) | — |
| Sorbitol líquido | — |
| Maltodextrina | — |
| Ácido cítrico (INS 330) | — |
| Sucralose (INS 955) | — |
| Corante vermelho 40 (INS 129) | — |
| Corante azul brilhante FCF (INS 133) | — |

**Massa total (insumos + excipientes):** 801,011 mg  
**A soma fecha com a porção declarada?** indeterminado

**Observações e divergências:**

- NOTA DE SLUG (consolidação): Slug pedido na tarefa foi "melatonina-em-gummy-sabor-uva"; o slug REAL no catálogo (seed_catalogo.sql) está grafado "melatonina-em-gumy-sabor-uva" (um só "m" em "gumy") — erro de grafia que já existe no banco, registrado aqui, não corrigido.
- MELATONINA — laudo vencido há cerca de 21 meses (validade 09/12/2024), usado mesmo assim como única base de cálculo; os números batem exatamente com o memorial (rastreabilidade correta), o problema é a validade do documento-fonte, não a matemática.
- L-TRIPTOFANO — laudo incompleto (6 ensaios, sem perfil de impurezas, sem identificação por IR/HPLC/rotação óptica), validade a vencer em 18 dias a partir de hoje, e fabricante/origem (China) fora do único fabricante aprovado pelo painel da ANVISA (Kyowa Hakko Bio, Japão). Teor bate exatamente com o memorial.
- GOMA ACÁCIA — pH 2,84 fora da faixa 4-5 do próprio fornecedor, sem campo de conclusão no laudo; mesmo lote 105226 usado também no Biogummy.
- SORBATO DE POTÁSSIO — grau 'PA' (reagente de laboratório da Êxodo Científica), não grau alimentício; mesmo lote 2511219711 usado também no Biogummy.
- CORANTES (vermelho 40 e azul brilhante FCF) — sem nenhum laudo no dossiê inteiro, conforme o próprio memorial reconhece.
- ANÁLISE DE PRODUTO ACABADO (Anexo 13, MGW Consultoria, RG 005706/03/2026, lote G20/1550) — aberta e lida integralmente: contém SOMENTE Enterobacteriaceae (<1,0×10² UFC/g), Bolores e Leveduras (<1,0×10² UFC/g), Salmonella spp (Ausência/25g) e Glúten (<10 ppm). NÃO contém nenhum ensaio de teor de melatonina nem de L-triptofano. Não é possível, com este documento, confirmar por análise real quanto do ativo efetivamente permaneceu no gummy pronto — essa conferência simplesmente não existe no dossiê.
- DIVERGÊNCIA CENTRAL ENTRE OS 4 DOCUMENTOS DE MELATONINA — ver campo 'comparacao_4_documentos_melatonina': 3 dos 4 documentos (FT-GUMMY-MELATONINA em docx, o mesmo em pdf, e a Ficha Suelen) descrevem uma fórmula SEM L-triptofano, derivada de uma base diferente ('Gummy cabelo, pele e unha tutti-frutti GCP0006' no caso da FT), com peso de goma diferente em cada documento (3,00 g no memorial; ~2,69-2,94 g não confirmado na FT, que registra expressamente nunca ter medido o peso final; 3,50 g na Ficha Suelen — 210 g ÷ 60 gomas) e listas de ingredientes distintas entre si. Só o valor de melatonina por porção (0,21 mg a cada 2 gomas, o teto exato do painel da ANVISA) é idêntico nos 4 documentos — é o único ponto de concordância plena.
- COMPARAÇÃO ENTRE 4 DOCUMENTOS DE MELATONINA/TRIPTOFANO: MEMORIAL-CALCULO-DREAM-GUMMY-rev02.docx (rev02, 13/08/2026) — fonte primária desta tarefa: melatonina=0.21mg, triptofano=800.0mg | FT-GUMMY-MELATONINA_Ficha_Tecnica_Gummy_Melatonina.docx (rev00, 27/08/2026, POPS/03_FICHAS_TECNICAS — documento provisório, RT ainda não assinou): melatonina=0.21mg, triptofano=Nonemg | FT-GUMMY-MELATONINA_Ficha_Tecnica_Gummy_Melatonina.pdf (mesma rev00, 27/08/2026 — conteúdo confirmado IDÊNTICO ao docx, página por página): melatonina=0.21mg, triptofano=Nonemg | FICHA-TECNICA-MELATONINA-GUMMY-UVA-SUELEN.docx (POPS, raiz — sem número de revisão ou data legível no documento): melatonina=0.21mg, triptofano=Nonemg
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma PARCIAL = 801.011 mg de um alvo de porção ≈6000.0 mg; faltam 12 de 14 itens sem massa_mg extraída no memorial/dump de origem — não dá para concluir se a porção fecha (dado incompleto, não é reprovação).
- Fontes secundárias conferidas: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/01_laudo_L-triptofano_lote-950388.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/02_laudo_melatonina_lote-950151_VENCIDO.pdf — lido (2 páginas) | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/04_laudo_maltitol_lote-106330.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/05_laudo_gelatina-po_lote-214196.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/07_laudo_pectina-citrica_lote-107755.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/08_laudo_goma-acacia_lote-105226_pH-FORA-SPEC.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/10_laudo_citrato-de-sodio_lote-6ST2401047.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/11_laudo_sorbato-de-potassio-PA_lote-2511219711.pdf — lido | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/13_ANALISE_PRODUTO-ACABADO_melatonina-gummy.pdf — lido (2 páginas) — NÃO é ensaio de teor de melatonina/triptofano, é microbiologia + glúten (ver divergências) | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/20_EMB_pote-PET-500mL-B43.pdf — NÃO ABERTO (embalagem, fora do escopo de ativos/excipientes) | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/21_EMB_tampa-flip-top-43mm.pdf — NÃO ABERTO (embalagem, fora do escopo) | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/16_DREAM-GUMMY/ARQUIVOS-PDF/30_ROTULO_DreamGummy_2026.pdf — NÃO ABERTO (rótulo, conteúdo nutricional já consta no memorial) | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FT-GUMMY-MELATONINA_Ficha_Tecnica_Gummy_Melatonina.docx — lido integralmente | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FT-GUMMY-MELATONINA_Ficha_Tecnica_Gummy_Melatonina.pdf — lido integralmente (5 páginas) — conteúdo IDÊNTICO ao docx, mesma revisão 00 de 27/08/2026, mesmas tabelas e mesmo texto | /Users/diegofrancisco/Desktop/POPS/FICHA-TECNICA-MELATONINA-GUMMY-UVA-SUELEN.docx — lido integralmente

---

## 10. `multi-vitta-gestante-e-lactante-em-capsula` — Multi Vitta Gestante e Lactante em Cápsula

**NÃO ENCONTRADO.** Nenhum memorial de cálculo, ficha técnica ou dossiê técnico foi localizado para este produto.

**O que foi buscado e achado (ou não):**

- NÃO ENCONTRADO — busca ampla, sem resultado, nas seguintes localizações: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/ (16 memoriais, nenhum com esse nome); /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/ (38 arquivos, nenhum sobre "gestante"/"lactante"/"vitta" pré-natal); /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/; busca por nome de arquivo em todo /Users/diegofrancisco/Downloads e /Users/diegofrancisco/Desktop/POPS por "vitta", "gestante", "lactante", "prenatal" — os únicos resultados são artefatos do PRÓPRIO site (imagem .webp do produto e arquivos de build .next), não um documento de composição/fabricação. NENHUM memorial, ficha técnica ou dossiê técnico existe para este produto em nenhuma pasta consultada.
- O produto É REAL e ATIVO no catálogo (confirmado no cross-check de ontem contra supabase/migrations/20260909210002_seed_catalogo.sql: preço R$13,80, active=true) — ou seja, é vendido sem que exista, no acervo de documentos consultado, QUALQUER registro de qual é a sua composição, de onde vêm os insumos ou se as quantidades foram calculadas a partir de laudo. Isto é o achado, não uma falha de busca: a busca foi ampla e repetida (nomes de arquivo, pastas por conteúdo, e o próprio seed do catálogo).
- ACHADO BÔNUS (do CADASTRO do catálogo, não de um memorial — que não existe): o texto do rótulo cadastrado cita vitamina A, K2, cromo, selênio e biotina, mas NENHUM tem linha de quantidade cadastrada (gap já registrado no cross-check de ontem contra o seed). Além disso, o dióxido de silício está cadastrado com 592,14mg — cerca de 59% de uma cápsula de ~1g — o que é implausível para um antiumectante (nunca é o componente majoritário de uma fórmula). Como não existe memorial, não é possível confirmar se isso é erro de cadastro ou reflete a fórmula real.
- Sendo suplemento para GESTANTES E LACTANTES — público de maior sensibilidade regulatória e de saúde — a ausência total de memorial de cálculo ou ficha técnica é o achado mais grave associado a este produto específico.

---

## 11. `multivitaminico` — Multivitamínico

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/MEMORIAL-CALCULO-MULTIVITAMINICO-rev02.docx`  
**Revisão:** rev02 (documento interno: MEM-CALC-MULTIVIT-rev02)  
**Data:** 13/08/2026 (data declarada na Tabela 0 do documento; o arquivo em disco foi salvo por último em 14/08/2026 08:10, ~13h depois)  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/MEMORIAL-CALCULO-MULTIVITAMINICO-rev02.docx

**Porção:** 1 g (2 cápsulas) · 30 porções por embalagem · **Formato:** cápsula

**Cápsula:** tamanho 0; massa 98,45 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Bisglicinato de magnésio | 860,36 | 30,22% | laudo lote 90844 — VENCIDO (venceu 21/06/2025); outro lote localizado pelo memorial, 088629, também vencido (12/01/2024); nenhum lote vigente encontrado | 260 | 260,000792 | Sim | NÃO LEGÍVEL (laudo não fornecido para leitura direta nesta tarefa; memorial cita site do fabricante inlab.ind.br/certificados) | 90844 — VENCIDO (venceu 21/06/2025); outro lote localizado pelo memorial, 088629, também vencido (12/01/2024); nenhum lote vigente encontrado |
| 2 | L-teanina | 149,76 | 100,16% | laudo lote AUTO039250 | 150 | 149,999616 | Sim | Lepuge (citado na Tabela 15 do memorial) | AUTO039250 |
| 3 | Ácido ascórbico (vitamina C) | 100,5 | 99,5% | laudo lote 950467 | 100 | 99,9975 | Sim | NÃO LEGÍVEL | 950467 |
| 4 | Bisglicinato de zinco | 75,41 | 19,89% | laudo lote 055-ZN/25 | 15 | 14,999049 | Sim | NÃO LEGÍVEL | 055-ZN/25 |
| 5 | Quelato de boro 5% (glicinato de boro) | 57,36 | 5,23% | laudo lote 044951 (lote fabricante 20251218; fabricação 18/12/2025; validade 17/12/2027) | 3 | 2,999928 | Sim | Valdequímica (revenda/certificadora), fabricante SHOUYANG HAOYUAN BIO — China | 044951 (lote fabricante 20251218; fabricação 18/12/2025; validade 17/12/2027) |
| 6 | Selênio quelato (glicinato de selênio, ~0,2%) | 35,79 | 0,2794% | laudo lote 044152 | 0,1 | 0,099997 | Sim | Valdequímica, fabricante Hebei Liwellso Biote (conforme texto da Tabela 14 do memorial — não consegui ler o laudo em PDF diretamente, ele não estava entre os 5 fornecidos para esta tarefa) | 044152 |
| 7 | Vitamina E pó 50% (acetato de DL-alfa-tocoferila) | 30 | 50,7% | laudo lote 91320 | 10,2 | 15,21 | Sim | NÃO LEGÍVEL | 91320 |
| 8 | Vitamina D3 pó (nome comercial: 100.000 UI/g) | 17,39 | — | não informado | 0,05 | 0,05 | Sim | NÃO LEGÍVEL | 91408 |
| 9 | Nicotinamida (vitamina B3) | 16,14 | 99,09% | laudo lote 872226 | 16 | 15,993126 | Sim | NÃO LEGÍVEL | 872226 |
| 10 | Acetato de retinol (vitamina A) | 7,63 | — | não informado | 1,3 | 1,3 | Sim | NÃO LEGÍVEL | 215230 |
| 11 | D-pantotenato de cálcio (vitamina B5) | 5 | 98,2% | laudo lote 91186 (lote fabricante 241222X022; fabricação 22/12/2024; validade 21/12/2027) | 4,51 | 4,91 | Sim | Laboratório emissor do laudo: Analitic Tecnologia de Precisão Ltda (marca do laudo: INLAB). O laudo NÃO identifica o fabricante da matéria-prima, só o país de origem (China) | 91186 (lote fabricante 241222X022; fabricação 22/12/2024; validade 21/12/2027) |
| 12 | Cobre aminoácido quelato 24% | 3,82 | 23,57% | laudo lote NPT.0325/404 (fabricação 03/2025; validade 03/2027; análise 14/04/2025) | 0,9 | 0,900374 | Sim | Natural Products & Technologies Ltda (Rafard-SP) | NPT.0325/404 (fabricação 03/2025; validade 03/2027; análise 14/04/2025) |
| 13 | Cloridrato de tiamina (vitamina B1) | 2,4 | — | não informado | 2 | 2 | Sim | Laboratório emissor do laudo: Analitic Tecnologia de Precisão Ltda (marca do laudo: INLAB). O laudo NÃO identifica o fabricante da matéria-prima, só o país de origem (China) | 91454 (lote fabricante 260224T132; fabricação 24/02/2026; validade 23/02/2029) |
| 14 | Cloridrato de piridoxina (vitamina B6) | 1,58 | 99,9% | laudo lote 91188 | 1,3 | 1,57842 | Sim | NÃO LEGÍVEL | 91188 |
| 15 | Riboflavina (vitamina B2) | 1,3 | 100,1% | laudo lote 91068 (lote fabricante 2407332; fabricação 04/07/2024; validade 04/07/2027) | 1,3 | 1,3013 | Sim | Laboratório emissor do laudo: Analitic Tecnologia de Precisão Ltda (marca do laudo: INLAB). O laudo NÃO identifica o fabricante da matéria-prima, só o país de origem (China) | 91068 (lote fabricante 2407332; fabricação 04/07/2024; validade 04/07/2027) |
| 16 | Ácido fólico (vitamina B9) | 0,882 | 90,67% | laudo lote AUTO039613 | 0,8 | 0,799709 | Sim | NÃO LEGÍVEL | AUTO039613 |
| 17 | Picolinato de cromo | 0,284 | 12,34% | laudo lote 91190 | 0,035 | 0,035046 | Sim | NÃO LEGÍVEL | 91190 |
| 18 | Menaquinona-7 (vitamina K2) | 0,15 | — | não informado | 0,149 | 0,149 | indeterminado | NÃO LEGÍVEL — nem o lote foi identificado | a confirmar (não identificado no memorial) |
| 19 | Metilcobalamina (vitamina B12) | 0,011 | 89,27% | laudo lote 219376 (lote de fabricante 032511057; fabricação 15/11/2025; análise 13/03/2026; validade 14/11/2030) | 0,00994 | 0,00982 | Sim | Fagron / SM Empreendimentos (conforme narrativa da Tabela 17 do memorial) | 219376 (lote de fabricante 032511057; fabricação 15/11/2025; análise 13/03/2026; validade 14/11/2030) |

**Massa total (insumos + excipientes):** 1365,767 mg  
**A soma fecha com a porção declarada?** **NÃO**

**Observações e divergências:**

- FONTE DE MAGNÉSIO: rev02 usa bisglicinato de magnésio (860,36 mg, laudo vencido, faz a fórmula ultrapassar 1.000 mg em 36,58%) x documento de comparação (POPS) usa óxido de magnésio (433,33 mg, fórmula fecha exatamente em 1.000 mg). O rótulo impresso vigente anuncia 'magnésio bisglicinato' na chamada principal — confirma que a fórmula EM USO/no rótulo é a do rev02 (bisglicinato), não a da POPS.
- VITAMINA K2: rev02 trata a matéria-prima como ~100% pura (0,150 mg -> 149 mcg, teor 'a confirmar', sem lote identificado) x POPS usa teor real de laudo de 1,45% de MK-7 (10,28 mg -> 149,06 mcg, laudo vencido em 2022). Se o teor de ~1,45% também valer para o lote do rev02, a subdosagem seria de cerca de 68x.
- VITAMINA B1 (dose e teor): rev02 declara 2,00 mg por porção com massa de 2,400 mg (teor 'a confirmar') x POPS declara 1,2 mg por porção com massa de 1,20 mg (teor assumido de 99,85%, não confirmado) x o LAUDO REAL do lote 91454 (que li diretamente) mostra teor de 99,8% x o RÓTULO IMPRESSO vigente declara '1,2 mg' -- batendo com a POPS, não com o rev02.
- VITAMINA E: rev02 usa acetato de DL-alfa-tocoferila 50,7% (com fator de conversão x0,67) x POPS usa DL-alfa-tocoferol livre 51,4% (sem esse fator) -- formas químicas diferentes.
- VITAMINA D3: rev02 usa pó nominal '100.000 UI/g' com teor aplicado de 115.000 UI/g (17,39 mg) x POPS usa colecalciferol óleo concentrado de 39.720.000 UI/g (0,0504 mg) -- matérias-primas de concentração radicalmente diferente.
- VITAMINA B12: rev02 usa metilcobalamina (89,27% tal qual, 0,011 mg) x POPS usa cianocobalamina (97,50%, 0,0102 mg) -- formas químicas diferentes; o rótulo impresso e a informação nutricional de ambos os memoriais declaram/citam cianocobalamina, mas a matéria-prima realmente pesada no rev02 é metilcobalamina (já registrado na Tabela 18 do próprio rev02).
- COBRE: rev02 usa cobre aminoácido quelato 24% (3,820 mg) x POPS usa bisglicinato de cobre 20% (4,50 mg) -- fontes diferentes. O rótulo impresso menciona 'bisglicinato de cobre' no bloco de composição por porção, batendo com a POPS, não com o rev02.
- ÁCIDO FÓLICO (dose): rev02 declara 800 mcg (Tabela 4 do próprio rev02 já aponta que isso excede o teto DFE) x POPS já adota a dose corrigida de 750 mcg. O rótulo impresso ainda mostra 800 mcg -- a correção recomendada não foi incorporada na arte vigente.
- TAMANHO DE CÁPSULA: rev02 diz tamanho '0' x POPS diz 'nº 00' -- são tamanhos diferentes (00 é maior que 0). A massa real de insumos do rev02 (1.365,77 mg de ativos / porção = 682,88 mg por cápsula) é bem maior que o peso de pó declarado (500 mg/cápsula) e pode não caber fisicamente numa cápsula tamanho 0, o que tornaria o tamanho '00' da POPS mais condizente com a massa real do rev02 do que o próprio tamanho '0' que o rev02 declara para si.
- ESPAÇO PARA EXCIPIENTE: rev02 não sobra nenhum espaço para excipiente/antiumectante dentro da porção (0,00 mg, Tabela 7) porque os ativos já somam 136,58% da porção x POPS reserva 66,43 mg de dióxido de silício q.s.p. e fecha em exatamente 1.000,00 mg. Isso é consequência direta da divergência de fonte de magnésio.
- SELÊNIO: ambos os memoriais concordam que o insumo realmente em uso (glicinato/quelato de selênio) não consta no painel ANVISA, e que o rótulo declara 'selenito de sódio' (fonte autorizada mas sem laudo disponível) -- divergência rótulo x insumo real é a MESMA nos dois documentos, não é um conflito entre eles.
- ROTULO IMPRESSO x AMBOS OS MEMORIAIS: a leitura da arte do rótulo (30_ROTULO_Multivitaminico_2026.pdf) mostra uma combinação que não bate 100% com nenhum dos dois memoriais isoladamente -- usa magnésio bisglicinato (como o rev02), mas vitamina B1 a 1,2mg, cobre como bisglicinato e B12 como cianocobalamina (como a POPS). Isso indica que o rótulo em produção não tem uma única fonte de verdade documental clara entre os dois memoriais lidos. NOTA DE CONFIANÇA: a leitura do rótulo foi feita a partir de uma imagem (arte gráfica em PDF) com texto em fonte muito pequena no painel de informação nutricional; os nomes dos ingredientes e a dose de B1 (1,2 mg, num tamanho de fonte maior e mais legível) têm confiança alta, mas os %VD individuais têm confiança baixa e não foram usados para nenhuma conclusão numérica deste relatório.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1365.767 mg; porção declarada ≈ 1000.0 mg; diferença +365.77 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL
- Fontes secundárias conferidas: /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-MULTIVITAMINICO.docx | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/07_laudo_pantotenato-de-calcio-B5_lote-91186.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/09_laudo_quelato-de-boro_lote-044951.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/11_laudo_riboflavina-B2_lote-91068.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/13_laudo_cobre-quelato-24_lote-NPT0325-404.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/18_laudo_tiamina-HCl-B1_lote-91454.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/30_ROTULO_Multivitaminico_2026.pdf

---

## 12. `omega-pro-tg` — Ômega Pro TG

**NÃO ENCONTRADO.** Nenhum memorial de cálculo, ficha técnica ou dossiê técnico foi localizado para este produto.

**O que foi buscado e achado (ou não):**

- NÃO ENCONTRADO — nenhum memorial de cálculo, ficha técnica nem dossiê técnico do produto ACABADO "omega-pro-tg" (softgel EPA/DHA) foi localizado em MEMORIAIS_2026 2, Desktop/POPS (03_FICHAS_TECNICAS e 04_MEMORIAIS_CALCULO) nem em Downloads. Os únicos documentos com "omega"/"ômega" no nome são: (a) a ficha da linha de GOTAS (Ospectra Ômega 3 30ml — produto diferente, confirmado pela própria tarefa) e (b) um certificado de matéria-prima em PÓ ("Nanomega 3") fisicamente incompatível com a forma softgel/TG do nome do produto.
- Produto confirmado REAL e ativo no catálogo (cross-check de ontem: preço R$25,90, active=true) — vendido sem que exista, no acervo consultado, nenhum documento de composição, dose por cápsula, proporção EPA/DHA, fornecedor do óleo ou forma do triglicerídeo (TG vs. éster etílico vs. rTG).
- Sendo um produto de óleo de peixe (risco de oxidação/rancidez e de metais pesados/contaminantes marinhos), a ausência de qualquer documento de composição ou de laudo de matéria-prima é um achado grave por si — não há como confirmar proporção de EPA/DHA nem estabilidade declarada.
- Fontes secundárias conferidas: /Users/diegofrancisco/Downloads/NPT-0226141 - Nanomega 3 - Aprovado nº141 (1).pdf (certificado de análise de MATÉRIA-PRIMA "Nanomega 3", lote NPT.0226/141, fabricação 02/2026, validade 02/2028 — aprovado; concentração de Ômega 3 15,3% p/p, forma PÓ, insolúvel em água, uso indicado "manter em geladeira <10°C após aberto". Esta é uma nanoemulsão em PÓ, fisicamente incompatível com "TG" (triglicerídeo em softgel/cápsula mole) do nome do produto — NÃO tratado como a matéria-prima confirmada do omega-pro-tg, apenas registrado como possível referência, exatamente como a tarefa pediu para avaliar.) | /Users/diegofrancisco/Downloads/FT-OSPECTRA-OM3-001_Ficha_Tecnica_Ospectra_Omega3_Lemoncaps.docx (linha de GOTAS — Ospectra Ômega 3 30ml — produto DIFERENTE de omega-pro-tg segundo a própria tarefa; apenas registrado, não usado como fonte de composição).

---

## 13. `pre-treino-300-g` — Pré-Treino 300g

**Documento lido:** `MEMORIAL-CALCULO-PRE-TREINO.docx (código interno MC-PRD-PRETREINO-001)`  
**Revisão:** Revisão 01  
**Data:** 14/08/2026  
**Procedência:** MEMORIAL-CALCULO-PRE-TREINO.docx (código interno MC-PRD-PRETREINO-001)

**Porção:** 10 g (1 dose/dosador) — 30 doses por pote — total do pote 300 g · **Formato:** pó (pote com dosador)


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina monoidratada | 3000 | 100,5% | laudo lote 26A05-B023-217949 | 3015 | 3015 | Sim | Fagron/SM | 26A05-B023-217949 |
| 2 | Beta-alanina | 2000 | — | não informado | — | — | indeterminado | — | PENDENTE |
| 3 | Cloridrato de L-arginina | 1240 | 82,1% | laudo lote AUTO035918 | 1019,04 | 1018,04 | Sim | Lepuge | AUTO035918 |
| 4 | Ácido cítrico | 1100 | 100,1% | laudo lote GE2844AFG | 1101,1 | 1101,1 | Sim | Adicel | GE2844AFG |
| 5 | Taurina | 900 | 99,46% | laudo lote 25H04-B053-214586 | 895,14 | 895,14 | Sim | Fagron/SM | 25H04-B053-214586 |
| 6 | L-tirosina | 400 | 99,9% | laudo lote 91382 (ref. 100552) | 399,6 | 399,6 | Sim | INLAB/Analitic | 91382 (ref. 100552) |
| 7 | Cafeína anidra | 200 | 99,88% | laudo lote 25I01-B062-214171 | 199,76 | 199,76 | Sim | Fagron/SM | 25I01-B062-214171 |
| 8 | Vitamina B6 (cloridrato de piridoxina) | 2 | 82,19% | laudo lote 91188 (ref. 100151) | 1,64 | 1,6438 | Sim | INLAB/Analitic | 91188 (ref. 100151) |
| 9 | Vitamina B12 (metilcobalamina) | 0,00994 | 94,54% | laudo lote 90955 (ref. 100537) | 0,0094 | 0,009397 | Sim | INLAB/Analitic | 90955 (ref. 100537) |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Maltodextrina | 600 |
| Aromatizante idêntico ao natural de limão | 350 |
| Dióxido de silício | 118 |
| Sucralose | 90 |

**Massa total (insumos + excipientes):** 10000,0099 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- Este documento é o único, dos 9, com peso de pote de exatamente 300g — bate com o nome do slug por peso, mas NÃO por composição 'sem creatina': a fórmula tem creatina (3.000mg/dose), contrariando a hipótese inicial de trabalho.
- Revisão histórica documentada no próprio arquivo: a versão ANTERIOR desta fórmula (antes da Revisão 01 de 14/08/2026) continha L-citrulina 1.400mg/dose. Consulta ao painel de Constituintes Autorizados da ANVISA (13–14/08/2026) não encontrou L-citrulina, citrulina malato nem o dipeptídeo L-citrulinilarginina na base de 559 constituintes — o ingrediente foi removido e o cloridrato de L-arginina subiu de 800mg para 1.240mg para recompor a via do óxido nítrico. A fórmula anterior somava 10.960,01mg contra 10.000mg declarados (diferença de 960mg, 9,6% acima do declarado) — um erro de fechamento de conta já corrigido nesta revisão, mas que ilustra exatamente o tipo de erro que esta auditoria busca capturar.
- Erro histórico documentado (Tabela 8 do memorial): a ordem de produção OP-PRD-PRETREINO-528 trazia vitamina D3 a 0,33333% e vitamina B12 a 0,06627% da dose — 1.000 vezes maiores que os valores corretos (0,000333% e 0,0000663%). Isso inflava a soma em 0,398% e causava um excipiente aparecer com quantidade NEGATIVA (-0,060g) no fechamento daquela ordem. Relevante para o histórico do produto, mas não está nos 9 documentos-alvo desta tarefa (citado dentro do memorial, sem documento-fonte próprio fornecido) — registrado aqui só como contexto de risco conhecido da linha de produção deste item.
- Vitamina D3 e Vitamina B3: presentes na família 450g e no FRM (420g); AUSENTES desta fórmula de 300g — não é erro, é escopo de formulação diferente.
- Ver também a lista de divergências cruzadas registrada no objeto do slug 'pre-treino-creatina-sabor-limao-420g' (taurina, tirosina, carnitina, arginina, B6, cafeína) — todas comparam diretamente com os números desta fórmula de 300g.
- TEXTO LIVRE DO AGENTE DE ORIGEM (por que este documento foi escolhido entre vários candidatos, e achados adicionais): Escolhido como fonte mais autorizada para ESTE slug porque é o ÚNICO dos 9 documentos cujo peso de pote declarado é EXATAMENTE 300 g (Tabela 1: 'Apresentação: Pote com 300g e dosador' / 'Peso líquido: 300g') — bate literalmente com o nome do slug. É também, de longe, o documento tecnicamente mais completo dos 9: é o único com certificados de análise por lote, teor de laudo, conversão sal→base e memorial de cálculo mostrando ativo = massa pesada × teor. ATENÇÃO — ACHADO IMPORTANTE: ao contrário do que o nome do slug ('pre-treino-300-g', sem a palavra 'creatina') poderia sugerir, esta fórmula CONTÉM creatina monoidratada, 3.000 mg por dose — confirmado no texto do objetivo do produto (seção 2) e nas tabelas de composição (seções 4 e 6), não presumido. A hipótese de que este slug seria 'sem creatina' está CONTRARIADA pelo documento. O documento também está em situação 'Em análise — há pendências críticas' (beta-alanina sem certificado; cafeína anidra como insumo controlado pela Polícia Federal, situação de licença não esclarecida; maltodextrina com certificado vencido em 26/07/2026) — isto está declarado no próprio documento, não é inferência minha.
- TABELA COMPARATIVA ENTRE 9 DOCUMENTOS DA FAMÍLIA PRÉ-TREINO (valor do mesmo insumo em cada documento candidato): Peso do pote: MEMORIAL-CALCULO(300g/10g)=300 g (LIDO, explícito); FRM-COM(420g/14g)=420 g (LIDO, explícito no cabeçalho); FRM-SEM(420g/14g)=420 g (LIDO, mesmo cabeçalho da seção COM); FT-PRD-PRETREINO-001=não declara peso de pote (só '1 dose = 15g'); FICHA-TECNICA-COMPLETA=450 g (LIDO, 'Pote com 450g + dosador'); FICHA-TECNICA-PRE-TREINO=450 g (LIDO, título e texto 'Peso líquido: 450g'); FICHA-TECNICA-SUELEN=450 g (LIDO, 'Peso líquido: 450g'); Composicao-Limao=não declara peso de pote (só 'Porção/dose 15g'); FOR-FORM-001=N/A — outro produto (16 itens diferentes); FOR-CAPS-2026-001=N/A — outro produto (multivitamínico cápsula) | Dose/porção: MEMORIAL-CALCULO=10 g; FRM-COM=14 g; FRM-SEM=14 g; FT-PRD-PRETREINO-001=15 g; FICHA-TECNICA-COMPLETA=15 g; FICHA-TECNICA-PRE-TREINO=15 g; FICHA-TECNICA-SUELEN=15 g; Composicao-Limao=15 g; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Creatina monoidratada: MEMORIAL-CALCULO=3.000 mg pesados; teor 100,50%; entrega 3.015 mg (conta fecha); FRM-COM=5.000 mg (sem teor/lote); FRM-SEM=0 mg (substituída por maltodextrina); FT-PRD-PRETREINO-001=5.000 mg (5 g); FICHA-TECNICA-COMPLETA=5.000 mg; FICHA-TECNICA-PRE-TREINO=5.000 mg; FICHA-TECNICA-SUELEN=5.000 mg; Composicao-Limao=5.000 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Beta-alanina: MEMORIAL-CALCULO=2.000 mg pesados; teor PENDENTE; entrega PENDENTE; FRM-COM=2.000 mg; FRM-SEM=2.000 mg; FT-PRD-PRETREINO-001=2.000 mg; FICHA-TECNICA-COMPLETA=2.000 mg; FICHA-TECNICA-PRE-TREINO=2.000 mg; FICHA-TECNICA-SUELEN=2.000 mg; Composicao-Limao=2.000 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | L-arginina / cloridrato de L-arginina: MEMORIAL-CALCULO=1.240 mg de CLORIDRATO; entrega 1.019,04 mg de base (conta fecha); FRM-COM=1.000 mg 'L-arginina' (forma não especificada); FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=2.000 mg de L-arginina livre; FICHA-TECNICA-COMPLETA=2.000 mg; FICHA-TECNICA-PRE-TREINO=2.000 mg; FICHA-TECNICA-SUELEN=2.000 mg; Composicao-Limao=2.000 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Taurina: MEMORIAL-CALCULO=900 mg pesados; entrega 895,14 mg (conta fecha); FRM-COM=1.000 mg; FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=1.300 mg; FICHA-TECNICA-COMPLETA=1.300 mg; FICHA-TECNICA-PRE-TREINO=1.300 mg; FICHA-TECNICA-SUELEN=1.300 mg; Composicao-Limao=1.300 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | L-tirosina: MEMORIAL-CALCULO=400 mg pesados; entrega 399,60 mg (conta fecha); FRM-COM=1.000 mg; FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=1.500 mg; FICHA-TECNICA-COMPLETA=1.500 mg; FICHA-TECNICA-PRE-TREINO=1.500 mg; FICHA-TECNICA-SUELEN=1.500 mg; Composicao-Limao=1.500 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | L-carnitina: MEMORIAL-CALCULO=AUSENTE; FRM-COM=1.000 mg; FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=1.300 mg; FICHA-TECNICA-COMPLETA=1.300 mg; FICHA-TECNICA-PRE-TREINO=1.300 mg; FICHA-TECNICA-SUELEN=1.300 mg; Composicao-Limao=1.300 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Cafeína — fonte e massa: MEMORIAL-CALCULO=Só cafeína anidra: 200 mg pesados; teor 99,88%; entrega 199,76 mg (conta fecha; a 0,12% do teto ANVISA); FRM-COM=Guaraná 224,5mg (teor não declarado) + cafeína anidra 150mg direta — total não calculável; FRM-SEM=idêntico ao FRM-COM; FT-PRD-PRETREINO-001=Só guaraná: 500mg a 22,35% = 111,75mg (conta fecha); FICHA-TECNICA-COMPLETA=idêntico (111,75mg, com tabela própria de cálculo); FICHA-TECNICA-PRE-TREINO=idêntico (111,75mg); FICHA-TECNICA-SUELEN=idêntico (111,75mg); Composicao-Limao=idêntico (111,75mg); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Vitamina B6: MEMORIAL-CALCULO=2mg de sal; entrega 1,64mg de base (conta fecha); FRM-COM=90 mg; FRM-SEM=90 mg; FT-PRD-PRETREINO-001=50 mg; FICHA-TECNICA-COMPLETA=50 mg; FICHA-TECNICA-PRE-TREINO=50 mg; FICHA-TECNICA-SUELEN=50 mg; Composicao-Limao=50 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=5 mg (produto diferente) | Magnésio / Vitamina B3 / Vitamina D3: MEMORIAL-CALCULO=AUSENTES as 3; FRM-COM=350mg / 35mg / 50mcg; FRM-SEM=350mg / 35mg / 50mcg; FT-PRD-PRETREINO-001=350mg / 35mg / 50mcg; FICHA-TECNICA-COMPLETA=350mg / 35mg / 50mcg; FICHA-TECNICA-PRE-TREINO=350mg / 35mg / 50mcg; FICHA-TECNICA-SUELEN=350mg / 35mg / 50mcg; Composicao-Limao=350mg / 35mg / 50mcg; FOR-FORM-001=N/A (aparecem em outros produtos do mesmo doc); FOR-CAPS-2026-001=N/A | Vitamina B12: MEMORIAL-CALCULO=0,00994mg pesados; teor 94,54%; entrega 0,00940mg (conta fecha); FRM-COM=0,00994 mg; FRM-SEM=0,00994 mg; FT-PRD-PRETREINO-001=9,94 mcg; FICHA-TECNICA-COMPLETA=9,94 mcg; FICHA-TECNICA-PRE-TREINO=9,94 mcg; FICHA-TECNICA-SUELEN=9,94 mcg; Composicao-Limao=9,94 mcg; FOR-FORM-001=N/A (aparece em outros produtos); FOR-CAPS-2026-001=2,4mg de insumo para 9,94mcg (produto diferente) | Ácido cítrico / Dióxido de silício / Aromatizante / Sucralose: MEMORIAL-CALCULO=1.100mg (conta fecha) / 118mg (teor PENDENTE) / 350mg (teor PENDENTE) / 90mg (conta fecha, 89,77mg); FRM-COM=1.100mg / 118mg / 350mg / 90mg — idênticos ao MEMORIAL-CALCULO; FRM-SEM=idênticos; FT-PRD-PRETREINO-001=ácido cítrico e sucralose agregados em 'q.s.p 15g'; sílica AUSENTE; aromatizante agregado no q.s.p.; FICHA-TECNICA-COMPLETA=idem; FICHA-TECNICA-PRE-TREINO=idem; FICHA-TECNICA-SUELEN=idem; Composicao-Limao=idem; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Massa total por dose (soma vs. declarado): MEMORIAL-CALCULO=soma 10.000,00994mg = declarado 10.000mg + 0,00994mg de B12 (explicado no texto) — conta fecha; FRM-COM=soma 13.999,99994mg ≈ declarado 14.000mg — conta fecha; FRM-SEM=soma 13.999,99994mg ≈ declarado 14.000mg — conta fecha; FT-PRD-PRETREINO-001=fecha por definição (q.s.p. completa até 15g); FICHA-TECNICA-COMPLETA=idem; FICHA-TECNICA-PRE-TREINO=idem; FICHA-TECNICA-SUELEN=idem; Composicao-Limao=idem; FOR-FORM-001=N/A; FOR-CAPS-2026-001=total declarado 1.000mg — fora do escopo pré-treino
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 10000.0099 mg; porção declarada ≈ 10000.0 mg; diferença +0.01 mg. Nenhum item ficou sem massa extraída.
- Fontes secundárias conferidas: /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/FRM-PRETREINO-14G-001_Formulas_Pre_Treino_Com_e_Sem_Creatina.pdf | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FT-PRD-PRETREINO-001_Ficha_Tecnica_Memorial_Calculo_Lemoncaps.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-COMPLETA-PRE-TREINO.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-PRE-TREINO.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-PRE-TREINO-SUELEN.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/Composicao_Pre-Treino_Limao.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FOR-FORM-001_Formulas_Quantidade_por_Porcao.pdf (confirmado: outro produto — 16 itens diferentes, nenhum é pré-treino) | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FOR-CAPS-2026-001_Formula_Insumos_Quantidades.pdf (confirmado: outro produto — multivitamínico/mineral em cápsula, não é pré-treino)

---

## 14. `pro-energy` — Pro Energy

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/03_PRO-ENERGY/MEMORIAL-CALCULO-PRO-ENERGY-rev02.docx`  
**Revisão:** rev02 (código interno: MEM-CALC-PROENERGY-rev02)  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/03_PRO-ENERGY/MEMORIAL-CALCULO-PRO-ENERGY-rev02.docx

**Porção:** 1 g (2 cápsulas) · **Formato:** cápsula

**Cápsula:** tamanho 0; massa 98,45 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Feno grego pó (semente) — Trigonella foenum-graecum L. | 250 | — | não informado | 250 | 250 | Sim | Santosflora | AUTO9IVT |
| 2 | L-taurina | 200 | 99,46% | laudo lote 214586 | 198,92 | 198,92 | Sim | — | 214586 |
| 3 | Guaraná extrato seco 22% (Paullinia cupana Kunth, semente) | 200 | 22,35% | laudo lote AUTO9J1Q | 44,7 | 44,7 | Sim | Santosflora | AUTO9J1Q |
| 4 | Cafeína anidra | 150 | 99,88% | laudo lote 214171 | 149,82 | 149,82 | Sim | — | 214171 |
| 5 | L-carnitina base (higroscópica) | 90 | 95,95% | laudo lote 216523 | 86,36 | 86,355 | Sim | — | 216523 |
| 6 | L-arginina cloridrato | 75 | 99,4% | laudo lote AUTO035918 | 61,63 | 74,55 | Sim | Lepuge | AUTO035918 |
| 7 | Bisglicinato de zinco 20% | 20 | 19,89% | laudo lote 055-ZN/25 | 3,98 | 3,978 | Sim | — | 055-ZN/25 |
| 8 | Cloridrato de piridoxina (vitamina B6) | 10 | 99,9% | laudo lote 91188 | 8,22 | 9,99 | Sim | — | 91188 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (INS 551) — antiumectante, q.s.p., 5,00 mg (0,50% da porção) — sem teor/conversão aplicada, declarado como massa cheia | 5 |
| (componentes da cápsula, não do pó — não entram na soma da porção de 1000 mg): gelatina, dióxido de titânio (INS 171) e lauril sulfato de sódio | — |

**Massa total (insumos + excipientes):** 1000 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- DUPLICATA CONFIRMADA: /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-PRO-ENERGY.docx e /Users/diegofrancisco/Downloads/MEMORIAL-CALCULO-PRO-ENERGY.docx são byte-a-byte idênticos (mesmo md5 fbfe99f6be23030e030657bc7a0f1a78, 5.896.890 bytes) — mesmo documento 'FT-PRD-025', Revisão 00, 30/07/2026, 'Situação: Vigente' (autodeclarada na própria data, superada pelo rev02 de 13/08).
- MASSA DA FÓRMULA MUDOU AO LONGO DO TEMPO — guaraná/L-carnitina/B6/antiumectante: no rascunho .doc de 27/07/2026 e no PDF de 29/07/2026 (ambos código 'MEM-CALC-001', Revisão 00, mesma composição): guaraná em pó 180 mg, L-carnitina base 50 mg, vitamina B6 (cloridrato) 9 mg, dióxido de silício 66 mg (soma 1.000 mg). A partir do FT-PRD-025 de 30/07/2026 e mantido no rev02 de 13/08/2026: guaraná (agora chamado 'extrato seco 22%') 200 mg, L-carnitina base 90 mg, vitamina B6 (cloridrato) 10 mg, dióxido de silício 5 mg (soma 1.000 mg). O próprio FT-PRD-025 documenta a mudança: 'esta revisão redistribuiu o antiumectante, que estava em 66 mg, elevando o guaraná a 200 mg, a vitamina B6 a 10 mg e a L-carnitina a 90 mg'.
- CAFEÍNA TOTAL — divergência mais crítica encontrada, com conclusões regulatórias opostas: (a) .doc 27/07 e PDF 29/07 usam o teor real do guaraná (22,35%, mesmo lote AUTO9J1Q) sobre 180 mg = 40,23 mg + cafeína anidra 150 mg×100,11% (sem desconto de umidade) = 150,165 mg → total ≈190,4 mg; não citam teto regulatório específico para cafeína. (b) FT-PRD-025 de 30/07 ABANDONA o teor de laudo do guaraná e usa uma estimativa genérica ('Considerando um teor médio de 3,5% de cafeína no guaraná' — palavra do próprio documento, não é valor de certificado) sobre 200 mg ≈ 7 mg + cafeína anidra 150 mg (sem nenhum desconto) ≈ 157 mg total; compara com referência de segurança da EFSA (400 mg/dia, uso geral) e conclui 'Conforme, com ampla margem'. (c) rev02 de 13/08 volta ao teor real do guaraná (22,35%) sobre 200 mg = 44,70 mg + cafeína anidra 150 mg×99,88% tal qual = 149,82 mg → TOTAL 194,52 mg; compara com o teto específico do 'painel oficial ANVISA... consultado em 13/08/2026' = 200 mg/dose → margem de apenas 5,48 mg (2,7%) e RECOMENDA reduzir a cafeína anidra para 140 mg. As conclusões (b) e (c) são diretamente contraditórias ('ampla margem' vs. 'quase no teto, 97% do limite') e vêm de premissas de entrada diferentes — (b) não usa dado de laudo para o guaraná nem o teto regulatório específico do constituinte.
- VITAMINA B6 — sal tratado como se fosse a vitamina livre em TRÊS dos cinco documentos comparados: o rascunho .doc de 27/07 (8,99 mg/691%VD), o PDF de 29/07 (9 mg/692%VD) e o FT-PRD-025 de 30/07 + Ficha Técnica (10 mg/769%VD) tratam a massa do CLORIDRATO de piridoxina como igual à massa de vitamina B6 entregue, sem aplicar o fator estequiométrico sal→base. Só o rev02 (13/08) aplica o fator 169,18÷205,64=82,27% e chega a 8,22 mg/632%VD — o próprio rev02 sinaliza isso como correção necessária no rótulo vigente (que, pelo que a Ficha Técnica lida mostra, ainda não foi corrigido: continua em 10 mg/769%VD).
- LIMITES REGULATÓRIOS CITADOS DIVERGEM ENTRE VERSÕES DO PRÓPRIO MEMORIAL — zinco: máximo citado como 34 mg (.doc 27/07 e PDF 29/07, sem fonte citada) vs. 40 mg (FT-PRD-025 30/07, citando 'IN nº 28/2018') vs. 29,59 mg (rev02 13/08, citando 'painel oficial ANVISA, Constituintes Autorizados..., consultado em 13/08/2026'). Vitamina B6: máximo citado como 100 mg (.doc, PDF e FT-PRD-025, citando IN 28/2018) vs. 98,60 mg (rev02, painel ANVISA). Três valores diferentes para o teto de zinco e dois para o de B6 dentro do histórico do mesmo produto — o rev02 é o único dos cinco documentos que registra explicitamente a fonte do limite E a data da consulta ao painel.
- NOMES DE INSUMO TROCADOS FACE AO RÓTULO — confirmado nos documentos de comparação: Ficha Técnica, FT-PRD-025, .doc de 27/07 e PDF de 29/07 usam todos 'extrato seco de semente de feno-grego' e 'guaraná em pó' — o rev02 (seção 8) afirma que o insumo REAL é o inverso (feno-grego é PÓ da Santosflora; guaraná é EXTRATO SECO 22,35% da Santosflora). Os nomes usados nos documentos de comparação confirmam a troca apontada pelo rev02.
- L-ARGININA — alegação do rev02 sobre o rótulo NÃO confirmada nos documentos lidos: o rev02 (Tabela 15) diz que o rótulo vigente declara 'L-Aspartato de L-arginina'. Nenhum dos cinco documentos de comparação usa essa expressão — todos dizem 'L-arginina HCl' (Ficha Técnica, .doc, PDF) ou 'cloridrato de L-arginina' (FT-PRD-025), formas equivalentes e coerentes com o insumo real. Não foi possível confirmar nem refutar a afirmação do rev02 com os arquivos desta atribuição, porque a arte do rótulo em si não estava entre os arquivos lidos.
- CÓDIGO/NUMERAÇÃO DO DOCUMENTO MUDOU TRÊS VEZES: 'MEM-CALC-001' (.doc 27/07 e PDF 29/07) → 'FT-PRD-025' (Desktop/POPS + Downloads, 30/07) → 'MEM-CALC-PROENERGY-rev02' (13/08). O rótulo 'rev02' pressupõe uma 'rev01' que não foi fornecida nem localizada nesta atribuição — PENDENTE, fora do escopo dos arquivos indicados.
- PORÇÕES POR LOTE: nenhum dos documentos lidos declara uma quantidade de porções por LOTE DE PRODUÇÃO industrial — todos declaram apenas 'porções por EMBALAGEM' = 30 (consistente em rev02, Ficha Técnica, FT-PRD-025, .doc e PDF). Campo 'porcoes_por_lote' marcado como null/PENDENTE por não haver esse dado especificamente no memorial.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1000.0 mg; porção declarada ≈ 1000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Fontes secundárias conferidas: /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-PRO-ENERGY.docx | /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-PRO-ENERGY.docx | /Users/diegofrancisco/Downloads/MEMORIAL-CALCULO-PRO-ENERGY.docx | /Users/diegofrancisco/Downloads/Memorial_PR__ENERGY.doc | /Users/diegofrancisco/Downloads/Memorial_de_Calculo_PRO_ENERGY.pdf

---

## 15. `pre-treino-creatina-sabor-limao-300g` — Pré-Treino Creatina sabor Limão 300g

**Documento lido:** `FRM-PRETREINO-14G-001_Formulas_Pre_Treino_Com_e_Sem_Creatina.pdf, seção '1. COM CREATINA' (código interno MC-PRD-PRETREINO-14G-001)`  
**Revisão:** Revisão 02  
**Data:** 20/08/2026  
**Procedência:** FRM-PRETREINO-14G-001_Formulas_Pre_Treino_Com_e_Sem_Creatina.pdf, seção '1. COM CREATINA' (código interno MC-PRD-PRETREINO-14G-001)

**Porção:** 14 g (1 dose/dosador) — 30 doses por pote — total do pote 420 g · **Formato:** pó (pote com dosador)


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina monohidratada | 5000 | — | não informado | — | — | indeterminado | — | — |
| 2 | Beta-alanina | 2000 | — | não informado | — | — | indeterminado | — | — |
| 3 | L-arginina | 1000 | — | não informado | — | — | indeterminado | — | — |
| 4 | Taurina | 1000 | — | não informado | — | — | indeterminado | — | — |
| 5 | L-tirosina | 1000 | — | não informado | — | — | indeterminado | — | — |
| 6 | L-carnitina | 1000 | — | não informado | — | — | indeterminado | — | — |
| 7 | Magnésio | 350 | — | não informado | — | — | indeterminado | — | — |
| 8 | Guaraná extrato seco | 224,5 | — | não informado | — | — | indeterminado | — | — |
| 9 | Cafeína anidra | 150 | — | não informado | — | — | indeterminado | — | — |
| 10 | Vitamina B6 (forma não especificada no cabeçalho da tabela) | 90 | — | não informado | — | — | indeterminado | — | — |
| 11 | Vitamina B3 | 35 | — | não informado | — | — | indeterminado | — | — |
| 12 | Vitamina D | 0,05 | — | não informado | — | — | indeterminado | — | — |
| 13 | Vitamina B12 (metilcobalamina) | 0,00994 | — | não informado | — | — | indeterminado | — | — |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Ácido cítrico | 1100 |
| Maltodextrina | 492,44 |
| Aromatizante idêntico ao natural de limão | 350 |
| Dióxido de silício | 118 |
| Sucralose | 90 |

**Massa total (insumos + excipientes):** 13999,9999 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- NOTA DE SLUG (consolidação): Slug pedido na tarefa foi "pre-treino-creatina-sabor-limao-420g"; o slug e o peso REAIS no catálogo são "pre-treino-creatina-sabor-limao-300g" (300g, não 420g) — o memorial de origem, porém, descreve um pote de 420g/14g por dose (ver campo porcao); registrar essa diferença é o ACHADO, não corrigi-la.
- Peso do pote: slug diz '420g'; só o FRM PDF declara 420g. As 5 fichas da família 450g descrevem um produto com creatina e sabor limão MUITO parecido em conceito, mas declaram 450g/dose de 15g — não 420g/dose de 14g. Não escolhi qual é 'o' produto do slug; registrei os dois conjuntos.
- Dose total: 14.000 mg (FRM) vs 15.000 mg (família 450g) — são fórmulas de tamanhos de dose diferentes, não arredondamento.
- L-arginina: 1.000 mg forma livre (FRM) vs 2.000 mg forma livre (família 450g) vs 1.240 mg de CLORIDRATO de L-arginina/sal, entrega 1.019,04 mg de base (MEMORIAL-CALCULO 300g) — 3 documentos, 3 números, 2 formas químicas diferentes.
- Taurina: 1.000 mg (FRM) vs 1.300 mg (família 450g) vs 900 mg pesados/895,14 mg entrega (MEMORIAL-CALCULO).
- L-tirosina: 1.000 mg (FRM) vs 1.500 mg (família 450g) vs 400 mg pesados/399,60 mg entrega (MEMORIAL-CALCULO).
- L-carnitina: 1.000 mg (FRM) vs 1.300 mg (família 450g) vs AUSENTE (MEMORIAL-CALCULO não tem este insumo).
- Vitamina B6: 90 mg (FRM) vs 50 mg (família 450g) vs 2 mg de sal/1,64 mg de base entregue (MEMORIAL-CALCULO) — divergência agravada por não ficar claro se FRM e família 450g reportam sal pesado ou base entregue.
- Cafeína — fonte E quantidade divergem nos 3 grupos: família 450g usa só guaraná extrato seco (500 mg a 22,35% = 111,75 mg de cafeína, conta fechada e lida no próprio documento); FRM usa guaraná (224,5 mg, teor não declarado) MAIS cafeína anidra direta (150 mg), total não calculável com os dados do documento; MEMORIAL-CALCULO (300g) usa só cafeína anidra direta (200 mg pesados, teor de laudo 99,88%, entrega 199,76 mg, a 0,12% do teto ANVISA de 200 mg/dose citado no próprio memorial). Nenhum dos 3 é 'o errado' — são 3 fórmulas de fato diferentes; o ponto de atenção real é que a cafeína TOTAL da fórmula FRM não pôde ser verificada por falta do teor do guaraná nesse documento.
- Magnésio, Vitamina B3, Vitamina D3: presentes e idênticos (350 mg / 35 mg / 0,05 mg) em FRM e na família 450g; AUSENTES por completo no MEMORIAL-CALCULO (300g) — são fórmulas com escopos de vitaminas/minerais diferentes, não só doses diferentes.
- Ácido cítrico, aromatizante, dióxido de silício e sucralose: FRM e MEMORIAL-CALCULO (300g) concordam exatamente (1.100 / 350 / 118 / 90 mg) apesar de terem doses totais diferentes (14g vs 10g) — pode indicar que os excipientes foram copiados de um memorial para o outro sem reajuste proporcional à dose, ou que são deliberadamente fixos por dosador; o documento não explica, registrado como observação, não como conclusão.
- A família 450g NÃO detalha ácido cítrico/aromatizante/sucralose em mg — usa 'q.s.p. 15 g' (quantidade suficiente para completar), o que IMPEDE checar essas 3 massas individualmente nesses 5 documentos.
- TEXTO LIVRE DO AGENTE DE ORIGEM (por que este documento foi escolhido entre vários candidatos, e achados adicionais): Escolhido como fonte mais autorizada para ESTE slug porque é o ÚNICO dos 9 documentos cujo cabeçalho declara, ao mesmo tempo, 'POTE DE 420 G' e uma fórmula 'COM CREATINA' — batendo literalmente com o nome do slug ('creatina' + '420g'). As 5 fichas técnicas da 'família 450g' (FT-PRD-PRETREINO-001, FICHA-TECNICA-COMPLETA-PRE-TREINO, FICHA-TECNICA-PRE-TREINO, FICHA-TECNICA-PRE-TREINO-SUELEN, Composicao_Pre-Treino_Limao) também descrevem um pré-treino com creatina sabor limão, mas com peso de pote de 450 g (não 420 g) e dose de 15 g (não 14 g) — ou seja, o nome do slug não bate com o peso de pote dessas 5. Não presumi que sejam o mesmo SKU: registro como DIVERGÊNCIA/AMBIGUIDADE não resolvida, não escolhi uma como 'a certa'. IMPORTANTE: este documento (FRM) não traz teor/lote/fornecedor para nenhum insumo — só uma coluna única 'por dose (mg)'. Por isso quase todo 'conta_fecha' abaixo é NÃO LEGÍVEL (nada para recalcular contra), exceto o fechamento da MASSA TOTAL da dose, que confere.
- TABELA COMPARATIVA ENTRE 9 DOCUMENTOS DA FAMÍLIA PRÉ-TREINO (valor do mesmo insumo em cada documento candidato): Peso do pote: MEMORIAL-CALCULO(300g/10g)=300 g (LIDO, explícito); FRM-COM(420g/14g)=420 g (LIDO, explícito no cabeçalho); FRM-SEM(420g/14g)=420 g (LIDO, mesmo cabeçalho da seção COM); FT-PRD-PRETREINO-001=não declara peso de pote (só '1 dose = 15g'); FICHA-TECNICA-COMPLETA=450 g (LIDO, 'Pote com 450g + dosador'); FICHA-TECNICA-PRE-TREINO=450 g (LIDO, título e texto 'Peso líquido: 450g'); FICHA-TECNICA-SUELEN=450 g (LIDO, 'Peso líquido: 450g'); Composicao-Limao=não declara peso de pote (só 'Porção/dose 15g'); FOR-FORM-001=N/A — outro produto (16 itens diferentes); FOR-CAPS-2026-001=N/A — outro produto (multivitamínico cápsula) | Dose/porção: MEMORIAL-CALCULO=10 g; FRM-COM=14 g; FRM-SEM=14 g; FT-PRD-PRETREINO-001=15 g; FICHA-TECNICA-COMPLETA=15 g; FICHA-TECNICA-PRE-TREINO=15 g; FICHA-TECNICA-SUELEN=15 g; Composicao-Limao=15 g; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Creatina monoidratada: MEMORIAL-CALCULO=3.000 mg pesados; teor 100,50%; entrega 3.015 mg (conta fecha); FRM-COM=5.000 mg (sem teor/lote); FRM-SEM=0 mg (substituída por maltodextrina); FT-PRD-PRETREINO-001=5.000 mg (5 g, sem teor/lote); FICHA-TECNICA-COMPLETA=5.000 mg (5 g); FICHA-TECNICA-PRE-TREINO=5.000 mg (5 g); FICHA-TECNICA-SUELEN=5.000 mg (5 g); Composicao-Limao=5.000 mg (5 g); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Beta-alanina: MEMORIAL-CALCULO=2.000 mg pesados; teor PENDENTE (sem laudo no dossiê); entrega PENDENTE; FRM-COM=2.000 mg; FRM-SEM=2.000 mg; FT-PRD-PRETREINO-001=2.000 mg (2 g); FICHA-TECNICA-COMPLETA=2.000 mg (2 g); FICHA-TECNICA-PRE-TREINO=2.000 mg (2 g); FICHA-TECNICA-SUELEN=2.000 mg (2 g); Composicao-Limao=2.000 mg (2 g); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | L-arginina / cloridrato de L-arginina: MEMORIAL-CALCULO=1.240 mg de CLORIDRATO (sal); teor 99,40%×82,68% conversão molar; entrega 1.019,04 mg de base (conta fecha); FRM-COM=1.000 mg de 'L-arginina' (forma não especificada); FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=2.000 mg (2 g) de 'L-arginina' (forma livre); FICHA-TECNICA-COMPLETA=2.000 mg (2 g); FICHA-TECNICA-PRE-TREINO=2.000 mg (2 g); FICHA-TECNICA-SUELEN=2.000 mg (2 g); Composicao-Limao=2.000 mg (2 g); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Taurina: MEMORIAL-CALCULO=900 mg pesados; teor 99,46%; entrega 895,14 mg (conta fecha); FRM-COM=1.000 mg; FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=1.300 mg (1,3 g); FICHA-TECNICA-COMPLETA=1.300 mg (1,3 g); FICHA-TECNICA-PRE-TREINO=1.300 mg (1,3 g); FICHA-TECNICA-SUELEN=1.300 mg (1,3 g); Composicao-Limao=1.300 mg (1,3 g); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | L-tirosina: MEMORIAL-CALCULO=400 mg pesados; teor 99,90%; entrega 399,60 mg (conta fecha); FRM-COM=1.000 mg; FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=1.500 mg (1,5 g); FICHA-TECNICA-COMPLETA=1.500 mg (1,5 g); FICHA-TECNICA-PRE-TREINO=1.500 mg (1,5 g); FICHA-TECNICA-SUELEN=1.500 mg (1,5 g); Composicao-Limao=1.500 mg (1,5 g); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | L-carnitina: MEMORIAL-CALCULO=AUSENTE — não consta na fórmula; FRM-COM=1.000 mg; FRM-SEM=1.000 mg; FT-PRD-PRETREINO-001=1.300 mg (1,3 g); FICHA-TECNICA-COMPLETA=1.300 mg (1,3 g); FICHA-TECNICA-PRE-TREINO=1.300 mg (1,3 g); FICHA-TECNICA-SUELEN=1.300 mg (1,3 g); Composicao-Limao=1.300 mg (1,3 g); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Cafeína — fonte e massa: MEMORIAL-CALCULO=Só cafeína anidra: 200 mg pesados; teor de laudo 99,88%; entrega 199,76 mg (conta fecha; a 0,12% do teto ANVISA de 200mg/dose citado no memorial); FRM-COM=Guaraná extrato seco 224,5 mg (teor NÃO declarado) + cafeína anidra 150 mg direta — total não calculável neste documento; FRM-SEM=idêntico ao FRM-COM (224,5 mg guaraná + 150 mg cafeína anidra); FT-PRD-PRETREINO-001=Só guaraná extrato seco: 500 mg a 22,35% de cafeína = 111,75 mg (conta fecha, calculada no próprio documento); FICHA-TECNICA-COMPLETA=idêntico ao FT-PRD-PRETREINO-001 (500mg/22,35%/111,75mg, com tabela própria de cálculo); FICHA-TECNICA-PRE-TREINO=idêntico (500mg/22,35%/111,75mg); FICHA-TECNICA-SUELEN=idêntico (500mg/22,35%/111,75mg); Composicao-Limao=idêntico (500mg/22,35%/111,75mg); FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Magnésio: MEMORIAL-CALCULO=AUSENTE; FRM-COM=350 mg; FRM-SEM=350 mg; FT-PRD-PRETREINO-001=350 mg (bisglicinato); FICHA-TECNICA-COMPLETA=350 mg (bisglicinato); FICHA-TECNICA-PRE-TREINO=350 mg; FICHA-TECNICA-SUELEN=350 mg; Composicao-Limao=350 mg; FOR-FORM-001=N/A (produto 'BIO MAG 60' do mesmo doc tem 350mg de magnésio, mas é OUTRO produto); FOR-CAPS-2026-001=N/A | Vitamina B6: MEMORIAL-CALCULO=2 mg de sal (cloridrato de piridoxina) pesados; teor 99,90%×82,27% conversão; entrega 1,64 mg de base (conta fecha); FRM-COM=90 mg (forma não especificada no documento); FRM-SEM=90 mg; FT-PRD-PRETREINO-001=50 mg (cloridrato de piridoxina, sem conversão sal→base explicitada); FICHA-TECNICA-COMPLETA=50 mg; FICHA-TECNICA-PRE-TREINO=50 mg; FICHA-TECNICA-SUELEN=50 mg; Composicao-Limao=50 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=5 mg (produto multivitamínico diferente) | Vitamina B3: MEMORIAL-CALCULO=AUSENTE; FRM-COM=35 mg; FRM-SEM=35 mg; FT-PRD-PRETREINO-001=35 mg (nicotinamida); FICHA-TECNICA-COMPLETA=35 mg; FICHA-TECNICA-PRE-TREINO=35 mg; FICHA-TECNICA-SUELEN=35 mg; Composicao-Limao=35 mg; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Vitamina D3: MEMORIAL-CALCULO=AUSENTE; FRM-COM=0,05 mg = 50 mcg; FRM-SEM=0,05 mg = 50 mcg; FT-PRD-PRETREINO-001=50 mcg (2.000 UI); FICHA-TECNICA-COMPLETA=50 mcg; FICHA-TECNICA-PRE-TREINO=50 mcg; FICHA-TECNICA-SUELEN=50 mcg (2.000 UI); Composicao-Limao=50 mcg; FOR-FORM-001=50 mcg/2.000 UI em 3 produtos diferentes (N/A para pré-treino); FOR-CAPS-2026-001=17,39 mg de insumo para entregar 50 mcg (produto multivitamínico diferente) | Vitamina B12 (metilcobalamina): MEMORIAL-CALCULO=0,00994 mg pesados; teor de laudo 94,54%; entrega 0,00940 mg (conta fecha); FRM-COM=0,00994 mg (sem teor/lote); FRM-SEM=0,00994 mg; FT-PRD-PRETREINO-001=9,94 mcg = 0,00994 mg; FICHA-TECNICA-COMPLETA=9,94 mcg; FICHA-TECNICA-PRE-TREINO=9,94 mcg; FICHA-TECNICA-SUELEN=9,94 mcg; Composicao-Limao=9,94 mcg; FOR-FORM-001=9,94 mcg em 3 produtos diferentes (N/A para pré-treino); FOR-CAPS-2026-001=2,4 mg de insumo para entregar 9,94 mcg (produto multivitamínico diferente) | Ácido cítrico: MEMORIAL-CALCULO=1.100 mg pesados; teor 100,10%; entrega 1.101,10 mg (conta fecha); FRM-COM=1.100 mg; FRM-SEM=1.100 mg; FT-PRD-PRETREINO-001=incluído em 'q.s.p. 15g' junto com aromatizante e sucralose — não individualizado; FICHA-TECNICA-COMPLETA=idem (q.s.p. 15g agregado); FICHA-TECNICA-PRE-TREINO=idem; FICHA-TECNICA-SUELEN=idem; Composicao-Limao=idem; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Dióxido de silício: MEMORIAL-CALCULO=118 mg pesados; teor PENDENTE (laudo não declara teor de sílica); FRM-COM=118 mg; FRM-SEM=118 mg; FT-PRD-PRETREINO-001=AUSENTE — não consta na lista de ingredientes; FICHA-TECNICA-COMPLETA=AUSENTE; FICHA-TECNICA-PRE-TREINO=AUSENTE; FICHA-TECNICA-SUELEN=AUSENTE; Composicao-Limao=AUSENTE; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Sucralose: MEMORIAL-CALCULO=90 mg pesados; teor 99,74%; entrega 89,77 mg (conta fecha); FRM-COM=90 mg; FRM-SEM=90 mg; FT-PRD-PRETREINO-001=incluída em 'q.s.p. 15g' — não individualizada; FICHA-TECNICA-COMPLETA=idem; FICHA-TECNICA-PRE-TREINO=idem; FICHA-TECNICA-SUELEN=idem; Composicao-Limao=idem; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Maltodextrina: MEMORIAL-CALCULO=600 mg pesados; teor PENDENTE; entrega PENDENTE; FRM-COM=492,44 mg; FRM-SEM=5.492,44 mg (492,44 + 5.000 no lugar da creatina); FT-PRD-PRETREINO-001=AUSENTE; FICHA-TECNICA-COMPLETA=AUSENTE; FICHA-TECNICA-PRE-TREINO=AUSENTE; FICHA-TECNICA-SUELEN=AUSENTE; Composicao-Limao=AUSENTE; FOR-FORM-001=N/A; FOR-CAPS-2026-001=N/A | Massa total por dose (soma vs. declarado): MEMORIAL-CALCULO=soma 10.000,00994 mg = declarado 10.000 mg + 0,00994 mg de B12 (explicado no próprio texto) — conta fecha; FRM-COM=soma calculada 13.999,99994 mg ≈ declarado 14.000 mg — conta fecha; FRM-SEM=soma calculada 13.999,99994 mg ≈ declarado 14.000 mg — conta fecha; FT-PRD-PRETREINO-001=13,6g de ativos nominados + ≈435mg de minerais/vitaminas + resto em 'q.s.p.' até 15g — fecha por definição (q.s.p.); FICHA-TECNICA-COMPLETA=idem (q.s.p.); FICHA-TECNICA-PRE-TREINO=idem (q.s.p.); FICHA-TECNICA-SUELEN=idem (q.s.p.); Composicao-Limao=idem (q.s.p.); FOR-FORM-001=N/A; FOR-CAPS-2026-001=total declarado 1.000 mg — não verificado linha a linha (fora do escopo pré-treino)
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 13999.9999 mg; porção declarada ≈ 14000.0 mg; diferença -0.00 mg. Nenhum item ficou sem massa extraída.
- Fontes secundárias conferidas: /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-PRE-TREINO.docx | /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/FRM-PRETREINO-14G-001_Formulas_Pre_Treino_Com_e_Sem_Creatina.pdf (seção 2, SEM CREATINA) | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FT-PRD-PRETREINO-001_Ficha_Tecnica_Memorial_Calculo_Lemoncaps.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-COMPLETA-PRE-TREINO.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-PRE-TREINO.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-PRE-TREINO-SUELEN.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/Composicao_Pre-Treino_Limao.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FOR-FORM-001_Formulas_Quantidade_por_Porcao.pdf (confirmado: outro produto — 16 itens diferentes, nenhum é pré-treino) | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FOR-CAPS-2026-001_Formula_Insumos_Quantidades.pdf (confirmado: outro produto — multivitamínico/mineral em cápsula, não é pré-treino)

---

## 16. `shot-colageno-300-gramas` — Shot + Colágeno 300 gramas

**Documento lido:** `/Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FOR-SHOT-COLAG-001_Formula_Shot_Matinal_Colageno_3_medidas.docx`  
**Revisão:** Sem número de revisão formal — ficha "FÓRMULA" (não memorial de cálculo), datada 19/08/2026 no próprio texto. Coluna usada: "Pote 300 g / dose 10 g" (das 3 apresentações 100g/200g/300g da mesma tabela).  
**Data:** 19/08/2026  
**Procedência:** Ficha técnica (Desktop/POPS/03_FICHAS_TECNICAS), não é memorial de cálculo — /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FOR-SHOT-COLAG-001_Formula_Shot_Matinal_Colageno_3_medidas.docx

**Porção:** 10 g (1 dose) · 30 doses por pote de 300 g · **Formato:** pó para diluição (shot matinal)


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Colágeno Verisol | 7548 | — | não informado | 7548 | 7548 | indeterminado | — | — |
| 2 | Vitamina C (ácido ascórbico 99%) | 1100 | — | não informado | 1089 | 1089 | indeterminado | — | — |
| 3 | Ácido cítrico | 670 | — | não informado | — | — | indeterminado | — | — |
| 4 | Fresh Drink Limão | 330 | — | não informado | — | — | indeterminado | — | — |
| 5 | Cúrcuma | 130 | — | não informado | — | — | indeterminado | — | — |
| 6 | Dióxido de silício | 100 | — | não informado | — | — | indeterminado | — | — |
| 7 | Café verde (35% de ácido clorogênico) | 50 | — | não informado | 17,5 | 17,5 | indeterminado | — | — |
| 8 | Sucralose | 50 | — | não informado | — | — | indeterminado | — | — |
| 9 | Corante Verde Folha pó | 17 | — | não informado | — | — | indeterminado | — | — |
| 10 | Citrus sinensis (Laranja Moro 08%) | 5 | — | não informado | 0,4 | 0,4 | indeterminado | — | — |
| 11 | Bisglicinato de zinco | 0,29 | — | não informado | 0,0577 | 0,0577 | indeterminado | — | — |

**Massa total (insumos + excipientes):** 10000,29 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- 🔴🔴 TRÊS DOCUMENTOS, TRÊS FÓRMULAS DIFERENTES para o "pote de 300g/dose de 10g" (ou variantes de nome muito próximo): (1) esta ficha ("3 medidas", coluna 300g): 7,548g de Colágeno VERISOL (branded) + vitamina C 1,100g + zinco 0,29mg; (2) a ficha "pote 210g" (mesma data, 19/08/2026): pote de tamanho DIFERENTE (210g não 300g), com 2,0g colágeno hidrolisado genérico + 500mg Verisol + maltodextrina — combinação mais plausível mas para outro SKU; (3) o dossiê técnico gerado (12/09/2026, provavelmente refletindo o cadastro atual do catálogo): 8,4g de colágeno hidrolisado GENÉRICO, SEM Verisol, vitamina C só 800mg, zinco 1,65mg (5,7× mais que as outras duas fichas). NENHUMA das três foi escolhida aqui como "a certa" — todas as três são registradas, com esta (ficha "3 medidas", coluna 300g) como principal por ser a única com o tamanho de pote exato do slug E ter timbre/data da Lemoncaps, mas a divergência de zinco (0,29 vs. 1,65mg, mesma ordem de grandeza dos limites mínimo/máximo já vistos noutros produtos da linha) e de fonte de colágeno (Verisol branded vs. genérico) é séria o bastante para impedir uma leitura única e confiável da fórmula vigente.
- NENHUM dos três documentos tem laudo, lote ou teor de matéria-prima verificado — não existe memorial de cálculo para esta linha de produto (Shot Colágeno), apesar de haver preço/dossiê comercial (R$41,90/pote, confirmado ontem no cross-check contra o seed do catálogo).
- COLÁGENO VERISOL a 7,548g/dose (75% da porção) é mais de 3× a dose tipicamente estudada clinicamente para esse ingrediente de marca (~2,5g/dia) — plausibilidade técnica e de custo questionável, mesmo sem ser, por si, um risco de segurança conhecido.
- ZINCO: a mesma massa nominal "0,29mg" aparece em dois documentos da linha (Detox e esta ficha) mas com bases diferentes — no Detox é claramente massa do SAL bisglicinato (recalculada para 0,29mg de zinco elementar); nesta ficha do Shot Colágeno não há teor declarado, então não é possível confirmar se os "0,29mg" aqui já são zinco elementar ou massa do sal (que entregaria só ≈0,058mg de zinco, 18% da própria referência já baixa do Detox).
- CÚRCUMA e CAFÉ VERDE: mesma limitação do Detox/Floravex — se os teores de padronização forem semelhantes, os ativos entregues (curcumina, ácido clorogênico) tenderiam a ficar abaixo dos mínimos ANVISA já documentados noutros produtos da linha, mas isso não está confirmado por laudo neste documento.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 10000.29 mg; porção declarada ≈ 10000.0 mg; diferença +0.29 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: Para lote de 1.000 potes de 300g: ver Tabela 2 do documento (ex.: Colágeno Verisol 226,431kg; Vitamina C 33,000kg; TOTAL DO LOTE 300kg).
- Fontes secundárias conferidas: /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FOR-SHOT-COLAG-001_Formula_Shot_Matinal_Colageno_pote_210g.docx (MESMA DATA 19/08/2026, mesmo cabeçalho "FÓRMULA — SHOT MATINAL + COLÁGENO VERISOL", mas para um POTE DE 210g/dose de 7g — tamanho de pote DIFERENTE do slug "300-gramas". Formula usa DOIS colágenos: 2,000g de "colágeno hidrolisado" genérico + 500mg de "Colágeno Verisol" separadamente, mais 1.902,71mg de maltodextrina como veículo — uma composição mais equilibrada e mais plausível que a coluna "300g" do documento principal, mas para um tamanho de pote que não é o pedido.) | /Users/diegofrancisco/Downloads/dossie-tecnico-shot-colageno-300-gramas.pdf (dossiê técnico GERADO — jsPDF, 12/09/2026, sem laudo/lote — para "SHOT + COLÁGENO 300 GRAMAS", 10g/dose: Colágeno hidrolisado GENÉRICO 8.400mg — SEM nenhuma menção a "Verisol" — Vitamina C 800mg, ácido cítrico 400mg, aromatizante limão 200mg, SiO2 100mg, sucralose 50mg, maltodextrina 31,35mg, corante verde 17mg, zinco 1,65mg (bisglicinato). TOTAL = 10.000,00mg, fecha exato com a porção.)

---

## 17. `saude-intestinal` — Saúde Intestinal (memorial: FLORAVEX)

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/12_FLORAVEX/MEMORIAL-CALCULO-FLORAVEX-rev02.docx`  
**Revisão:** 02 — 13/08/2026 (Tabela 0)  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/12_FLORAVEX/MEMORIAL-CALCULO-FLORAVEX-rev02.docx

**Porção:** 1 g (2 cápsulas) · 30 porções por embalagem · **Formato:** cápsula

**Cápsula:** tamanho 0 (gelatinosa dura) — vazia 98,45 mg (Qualicaps/Genix, lote 2505380SA); cheia 598,45 mg (Tabela 23); massa 500 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Psyllium pó (tegumento) | 342 | — | não informado | 342 | 342 | Sim | — | AUTO9JPE |
| 2 | Bisglicinato de magnésio | 297,81 | 30,22% | laudo lote 90844 | 90 | 89,998182 | Sim | — | 90844 |
| 3 | Inulina (raiz de chicória) | 135 | 91% | laudo lote 206486 | 122,85 | 122,85 | Sim | — | 206486 |
| 4 | L-glutamina | 135,54 | 99,6% | laudo lote 950334 | 135 | 134,99784 | Sim | — | 950334 |
| 5 | Extrato de cúrcuma (rizomas) | 117 | 0,42% | laudo lote NPT.0425/580 | 0,49 | 0,4914 | Sim | — | NPT.0425/580 |
| 6 | Frutooligossacarídeos (FOS) | 90 | 96,3% | laudo lote 212448 | 86,67 | 86,67 | Sim | — | 212448 |
| 7 | Quercetina dihidratada | 72 | 96,05% | laudo lote 873635 | 69,16 | 69,156 | Sim | — | 873635 |
| 8 | Bisglicinato de zinco | 67,87 | 19,89% | laudo lote 055-ZN/25 | 13,5 | 13,499343 | Sim | — | 055-ZN/25 |
| 9 | Acetato de retinol (vitamina A) | 3,17 | — | não informado | 540 | 540 | Sim | — | 215230 |
| 10 | Cloridrato de piridoxina (vitamina B6) | 1,53 | 99,9% | laudo lote 91188 | 1,26 | 1,52847 | Sim | — | 91188 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (INS 551) — antiumectante | 0 |

**Massa total (insumos + excipientes):** 1261,92 mg  
**A soma fecha com a porção declarada?** **NÃO**

**Observações e divergências:**

- 🔴🔴 A FÓRMULA ESTOURA A PORÇÃO DECLARADA: os 10 insumos somam 1.261,92mg (126,19% da porção) para uma porção declarada de 1.000mg — excesso de 261,92mg (+26,19%), confirmado pelo próprio memorial (Tabela 6/13). O bisglicinato de magnésio (297,81mg) é o maior contribuinte para o estouro. Soluções sugeridas no próprio memorial: reduzir o magnésio, trocar por óxido de magnésio (60% Mg, precisaria só 150mg) ou passar a dose para 3 cápsulas.
- 🔴 CONTRADIÇÃO NO PRÓPRIO RÓTULO SOBRE FIBRA: o rodapé da tabela nutricional diz "não contém quantidades significativas de... FIBRAS ALIMENTARES", mas o texto de apresentação anuncia "fórmula completa que combina FIBRAS ALIMENTARES..." — e o produto é majoritariamente fibra (psyllium+inulina+FOS ≈490mg/dose). A fibra DEVE ser declarada na tabela nutricional (resposta 50 do Q&A ANVISA).
- 🔴 PSYLLIUM, INULINA e FOS muito abaixo do mínimo de fibra (5,7g/dia): a fórmula entrega 342mg, 123mg e 90mg respectivamente (6%, 2% e 1,6% do mínimo) — podem permanecer mas o produto NÃO pode ser apresentado como fonte de fibras.
- 🔴 CURCUMINA a 0,6% do mínimo ANVISA (0,49mg contra 80mg mínimo) — mesmo padrão do Detox, mesmo lote de extrato.
- 🔴 PSYLLIUM: laudo sem microbiologia, metais pesados nem agrotóxicos — origem Índia, não esterilizado, maior massa do produto.
- 🔴 MAGNÉSIO: certificado vencido (lote 90844) — mesmo lote vencido do Nuviart; fornecedor não publica lote mais recente.
- 🔴 QUERCETINA: certificado vencido desde 06/2026; forma dihidratada do laudo (CAS 6151-25-3) pode não corresponder exatamente à forma anidra autorizada pelo painel (CAS 117-39-5) — pendência de confirmação.
- Origem animal: cápsula de gelatina impede alegação vegana/vegetariana (Tabela 25).
- Fonte dos limites mínimo/máximo: painel oficial ANVISA "Constituintes Autorizados", consultado em 13/08/2026 (559 constituintes via API).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1261.92 mg; porção declarada ≈ 1000.0 mg; diferença +261.92 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL no texto extraído.

---

## 18. `serena` — Serena

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/09_SERENA/MEMORIAL-CALCULO-SERENA-rev02.docx`  
**Revisão:** 02 — 13/08/2026 (Tabela 0)  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/09_SERENA/MEMORIAL-CALCULO-SERENA-rev02.docx

**Porção:** 1 mL (20 gotas) · 30 porções por embalagem · **Formato:** solução oral em gotas


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Cloreto de magnésio anidro | 246,77 | 25,53% | laudo lote 950301 | 63 | 63,000381 | Sim | — | 950301 |
| 2 | L-teanina | 49,92 | 100,16% | laudo lote AUTO039250 | 50 | 49,999872 | Sim | — | AUTO039250 |
| 3 | Mio-inositol | 50,07 | 99,86% | laudo lote 950479 | 50 | 49,999902 | Sim | — | 950479 |
| 4 | Cloridrato de piridoxina (vitamina B6) | 1,58 | 99,9% | laudo lote 91188 | 1,3 | 1,57842 | Sim | — | 91188 |
| 5 | Melatonina | 0,211 | 99,33% | laudo lote 950151 | 0,21 | 0,209586 | Sim | — | 950151 |
| 6 | Sorbato de potássio | 2 | — | não informado | — | — | indeterminado | — | 91202 |
| 7 | Benzoato de sódio | 2 | — | não informado | — | — | indeterminado | — | 950430 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Glicerina vegetal e água purificada — q.s.p. | 647,45 |

**Massa total (insumos + excipientes):** 1000,001 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- 🔴🔴 MELATONINA — laudo vencido há mais de 20 meses (venceu 09/12/2024, lote de dezembro de 2021) — é o laudo mais antigo de toda a linha Lemoncaps. O teor usado em todo o cálculo do produto vem desse certificado vencido.
- 🔴 L-TEANINA de fonte sintética (Lepuge), não a forma de folhas de Camellia sinensis exigida pelo painel ANVISA — sem substituto imediato disponível no fornecedor atual (INLAB não comercializa L-teanina).
- ⚠️ TRÊS CONSTITUINTES SEM MARGEM NENHUMA: magnésio no mínimo exato (63,00mg=63mg), L-teanina no mínimo exato (50,00mg=50mg) e melatonina no teto exato (0,21mg=0,21mg) — qualquer variação de teor de lote quebra o limite (para baixo nos dois primeiros, perdendo alegação; para cima na melatonina, infração de segurança). Memorial recomenda subir magnésio para 70mg, L-teanina para 60mg e reduzir melatonina-alvo para 0,19mg para criar margem de processo.
- 🔴 VALOR ENERGÉTICO NÃO FECHA: rótulo declara 1kcal com 0,5g de carboidratos; 0,5g×4kcal/g=2kcal (o dobro do declarado) — e se os carboidratos vierem da glicerina (4,3kcal/g) o valor seria ainda maior. Refazer o cálculo.
- ⚠️ INCONSISTÊNCIA DE CONTA-GOTAS ENTRE PRODUTOS: Serena declara 1mL=20 gotas; Slim Up declara 1mL=30 gotas. Se o conta-gotas físico for o mesmo modelo, um dos dois valores está errado — altera a dose administrada. Confirmar com o fornecedor da embalagem.
- ⚠️ EMBALAGEM SEM LAUDO: certificado do frasco conta-gotas de 30mL não localizado (Tabela 15/19) — laudo e declaração de aptidão para contato com alimentos são obrigatórios para embalagem primária.
- DIVERGÊNCIA ENTRE DUAS VERSÕES DATADAS DO MESMO DIA (13/08/2026): rev02 (MEMORIAIS_2026 2, fonte primária desta tarefa) usa 246,77mg de cloreto de magnésio; documento POPS/rev00 (MC-PRD-SERENA-001) usa 248,23mg para o mesmo alvo de 63mg — diferença de 1,46mg. Tratado o rev02 como vigente por ser revisão posterior, mas a divergência entre "mesma data, dois números" fica registrada.
- Benzoato de sódio: teor não localizado em nenhum dos dois documentos (rev02 nem POPS) — pendência confirmada nos dois.
- Fonte dos limites mínimo/máximo: painel oficial ANVISA "Constituintes Autorizados", consultado em 13/08/2026 (559 constituintes via API).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1000.001 mg; porção declarada ≈ 1000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL no rev02 (o documento POPS/rev00, código MC-PRD-SERENA-001, cita "1.000 frascos = 30L de solução" — não presumido válido para o rev02 sem confirmação).
- Fontes secundárias conferidas: /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-SERENA.docx (rev00/MC-PRD-SERENA-001, mesma data 13/08/2026, "Situação: Vigente" à época — magnésio calculado em 248,23mg em vez de 246,77mg; sólidos totais 349,73mg em vez de 352,55mg; demais insumos coincidem)

---

## 19. `zma-zinco-magnesio-e-vitamina-d` — ZMA (Zinco, Magnésio e Vitamina D)

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/02_ZMA-COMPLEX/MEMORIAL-CALCULO-ZMA-COMPLEX-rev02.docx`  
**Revisão:** rev02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/02_ZMA-COMPLEX/MEMORIAL-CALCULO-ZMA-COMPLEX-rev02.docx

**Porção:** 1 g (2 cápsulas) — 30 porções por embalagem de 60 cápsulas (peso líquido 30 g) · **Formato:** cápsula

**Cápsula:** tamanho 0; massa 98,45 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Bisglicinato de magnésio (ATENÇÃO: o laudo primário deste mesmo lote chama o insumo de 'Magnésio Glicinato 30%' — ver divergência de nomenclatura nas observações) | 500 | 30,22% | laudo lote 90844 (lote fabricante 66342023062230) | 151,1 | 151,1 | Sim | Analitic Tecnologia de Precisão Ltda (certificado em papel timbrado INLAB), Ref. 100643 | 90844 (lote fabricante 66342023062230) |
| 2 | L-teanina (rótulo do fabricante indica folhas de Camellia sinensis; o laudo do lote em uso declara obtenção por síntese química — ver divergência/não conformidade) | 149,76 | 100,16% | laudo lote AUTO039250 (lote fabricante 202408145) | 150 | 149,999616 | Sim | Lepuge Insumos Farmacêuticos Ltda | AUTO039250 (lote fabricante 202408145) |
| 3 | Bisglicinato de zinco | 75,41 | 19,89% | laudo lote 055-ZN/25 | 15 | 14,999049 | Sim | Galena Química e Farmacêutica Ltda | 055-ZN/25 |
| 4 | Quelato de boro 5% (glicinato de boro) | 57,36 | 5,23% | laudo lote 044951 | 3 | 2,999928 | Sim | NÃO LIDO DIRETAMENTE por mim nesta tarefa — dado vem do memorial rev02 e da planilha PROPOSTA (que marca este laudo como 'CONFERIDO'); o certificado do lote 044951 não foi aberto por mim | 044951 |
| 5 | Vitamina D3 (colecalciferol), pó 100.000 UI/g | 8,7 | — | não informado | 0,025 | 0,025 | Sim | NÃO LIDO DIRETAMENTE por mim nesta tarefa — dado vem do memorial rev02 e da planilha PROPOSTA (que marca este laudo como 'CONFERIDO'); o certificado do lote 91408 não foi aberto por mim | 91408 |
| 6 | Cloridrato de piridoxina (vitamina B6) | 1,3 | 99,9% | laudo lote 91188 | 1,07 | 1,2987 | Sim | NÃO LIDO DIRETAMENTE por mim nesta tarefa — dado vem do memorial rev02 e da planilha PROPOSTA (que marca este laudo como 'CONFERIDO'); o certificado do lote 91188 não foi aberto por mim | 91188 |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (INS 551) — antiumectante, q.s.p., 207,47 mg/porção (20,75% da fórmula). RECALCULADO: 792,53 mg de ativos + 207,47 mg de SiO2 = 1.000,00 mg/porção — fecha exato com o peso-alvo declarado. | 207,47 |
| Cápsula gelatinosa dura tamanho 0: gelatina, água purificada, dióxido de titânio (INS 171) e lauril sulfato de sódio — massa vazia 98,45 mg (laudo Qualicaps/Genix, lote 2505380SA, validade 02/04/2030). | — |

**Massa total (insumos + excipientes):** 1000 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- QUESTÃO B6 vs VITAMINA D (pedida explicitamente): a fórmula REAL contém as DUAS vitaminas em todas as versões examinadas (memorial antigo rev00, memorial vigente rev02, e a planilha de proposta rev01). Não é erro de digitação de uma vitamina pela outra. O slug do catálogo ('...vitamina-d') cita só a vitamina D; o nome do arquivo da planilha de proposta ('...Vitamina-B6') cita só a vitamina B6; a frase de marketing impressa no próprio rótulo vigente ('A união de zinco, magnésio, vitamina D3 e L-teanina...') cita D3 e nem menciona B6 nem boro — mas a tabela de Informação Nutricional do mesmo rótulo LISTA vitamina B6 (1,3 mg). Ou seja: cada nome/título usado (catálogo, planilha, headline do rótulo) menciona só uma parte da fórmula real, que tem as duas vitaminas mais boro e L-teanina.
- RÓTULO VIGENTE desatualizado em relação às correções do próprio rev02 (conferido por mim, PDF do rótulo): (1) declara 'Vitamina B6 1,3 mg (100% VD)' quando o valor realmente entregue, aplicando o fator cloridrato->piridoxina, é 1,07 mg (82% VD) — rev02 já identifica isso como correção obrigatória, não aplicada na arte; (2) Boro (3 mg) e L-teanina (150 mg) não aparecem na tabela de Informação Nutricional do rótulo, embora rev02 diga que ambos devem constar (com '**' no %VD); confirmei que de fato nenhum dos dois consta no rótulo impresso.
- NOMENCLATURA DO MAGNÉSIO: o laudo primário do lote usado no cálculo (90844) chama o insumo de 'Magnésio Glicinato 30%'. O memorial rev02 chama o mesmo insumo, o tempo todo, de 'Bisglicinato de magnésio'. O rótulo vigente e o memorial antigo (rev00) usam 'Magnésio glicinato', batendo com o nome do laudo. Ou seja, é o rev02 (o documento mais novo) que diverge do nome oficial do certificado.
- PROPOSTA (rev01, rascunho de 14-15/09/2026, NÃO ASSINADO) muda massas em relação ao rev02 vigente: bisglicinato de magnésio sobe de 500,00 mg para 673,055 mg (+34,6%; magnésio entregue sobe de 151,10 mg para ≈203,4 mg); bisglicinato de zinco sobe de 75,41 mg para 119,02 mg (+57,8%; zinco entregue sobe de 15,00 mg para ≈23,67 mg); vitamina D3 dobra de 25 mcg para 50 mcg (dose alvo fica exatamente NO TETO do limite máximo de 50,0 mcg do painel ANVISA, sem nenhuma margem de segurança de fabricação). Boro e vitamina B6 (massa do sal) permanecem praticamente iguais.
- PROPOSTA contém erro de método reintroduzido: em duas das suas cinco abas ('Sugestão de Memorial' e 'Conformidade ANVISA'), a massa do SAL de magnésio (673,055 mg) e de zinco (119,02 mg) é tratada como se fosse a dose do ELEMENTO ativo, gerando %VD absurdos (160% e 1082%) — a própria planilha marca isso como 'PENDENTE: a quantidade é de matéria-prima/sal; o limite incide sobre o ativo'. Só a quinta aba ('Massa a pesar') faz a conversão correta (magnésio ≈203,4 mg elemento; zinco ≈23,68 mg elemento). O mesmo problema ocorre com o boro (56,6 mg tratado como se fosse elemento, quando a própria planilha estima o boro real entregue em ≈2,96 mg) e com a vitamina B6 (1,3 mg de cloridrato tratado como 100% VD, repetindo o mesmo erro que o rev02 já havia corrigido para o rótulo).
- PROPOSTA NÃO FECHA O TOTAL DA PORÇÃO: a soma das massas dos 6 insumos da aba 'Massa a pesar' é 1.017,683 mg para uma porção-alvo de 1.000 mg — excesso de 17,683 mg (1,77% relativo). A própria planilha reconhece o excesso explicitamente. Não há nenhuma linha de excipiente/antiumectante q.s.p. na proposta para absorver essa diferença (diferente do rev02, que fecha exato com 207,47 mg de dióxido de silício). Em termos absolutos e relativos, 17,68 mg / 1,77% cai tecnicamente dentro do critério de tolerância de 3% pedido para fechamento individual — mas o documento-fonte trata isso como um problema real de fórmula, não resolvido, por faltar a etapa de completar/ajustar com excipiente.
- NÃO CONFORMIDADE DE FONTE — BORO: presente tanto no rev02 quanto na PROPOSTA (mesmo diagnóstico nos dois): a fonte usada ('quelato de boro'/'glicinato de boro') não consta na lista de fontes de boro autorizadas pelo painel oficial da ANVISA (que autoriza só frutoborato de cálcio e tetraborato de sódio decahidratado); o próprio laudo do insumo declara CAS e DCB como 'NA'.
- NÃO CONFORMIDADE DE FONTE — L-TEANINA: presente tanto no rev02 quanto na PROPOSTA, e CONFIRMADA por mim diretamente no laudo primário (Lepuge, lote AUTO039250): o campo 'Forma de Obtenção' do certificado diz 'SÍNTESE QUÍMICA'; o painel ANVISA exige L-teanina obtida de folhas de Camellia sinensis (extração/fermentação vegetal).
- LAUDOS DE MAGNÉSIO VENCIDOS: os dois certificados localizados para o insumo de magnésio estão vencidos — lote 90844 (usado no cálculo do rev02, venceu 21/06/2025) e lote 088629 (alternativo, venceu 12/01/2024). Confirmei ambos diretamente nos respectivos PDFs. Não há, nos documentos apresentados a mim, nenhum certificado vigente/não vencido para o insumo de maior massa da fórmula.
- SUSPEITA INVESTIGADA E AFASTADA: magnésio (lote 90844) e zinco (lote 055-ZN/25) — fornecedores diferentes — mostravam exatamente o mesmo valor de perda por secagem (0,54%) usado no cálculo de teor tal-qual. Levantei a hipótese de erro de cópia entre insumos; ao abrir o laudo primário do zinco, confirmei que 0,54% é resultado próprio e genuíno desse ensaio, não uma duplicação.
- PRODUTO CORRELATO 'ZMA NIGHT': achado por acaso na mesma busca por 'zma' no Downloads — um dossiê comercial separado, 'ZMA Night (Zinco + Magnésio + Vitamina D)', datado 12/09/2026, com preço definido (R$ 13,80/pote, pedido mínimo 100 potes). NÃO é o produto desta atribuição (o catálogo 'zma-zinco-magnesio-e-vitamina-d' corresponde ao 'ZMA Complex'). Mas a composição do ZMA Night é numericamente IDÊNTICA à da planilha PROPOSTA de reformulação do ZMA Complex (mesmos 6 insumos, mesmas 6 massas: 673,055 / 150 / 119,02 / 56,6 / 1,3 / 50 mcg). Registro como observação relevante para a reformulação, sem afirmar que são o mesmo produto.
- MEMORIAL ANTIGO (rev00, MEM-CALC-001, 22/07/2026) não tem campo de fornecedor nem de lote para NENHUM dos 7 insumos que lista — lacuna de rastreabilidade que o rev02 (com fornecedor e lote em cada linha) corrigiu. As massas do rev00 (500 / 217,1 / 150 / 75 / 56,6 / 1,3 mg / 25 mcg) são as mesmas que aparecem hoje impressas no rótulo vigente — ou seja, o rótulo reflete os números do memorial ANTIGO/superado, não os números mais recentes e mais precisos do rev02 (75,41 mg e 57,36 mg em vez de 75 mg e 56,6 mg para zinco e boro).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1000.0 mg; porção declarada ≈ 1000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL — o memorial rev02 não declara tamanho de lote de produção industrial (kg por batelada); traz apenas massa por porção/cápsula e por embalagem de 60 cápsulas (30 porções, peso líquido 30 g, peso bruto aproximado 53,40 g).
- Fontes secundárias conferidas: /Users/diegofrancisco/Downloads/Memorial_ZMA_Complex.doc | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/02_ZMA-COMPLEX/ARQUIVOS-PDF/01b_laudo_bisglicinato-magnesio-30_lote-088629_VENCIDO.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/02_ZMA-COMPLEX/ARQUIVOS-PDF/30_ROTULO_ZMA-Complex_2026.pdf | /Users/diegofrancisco/Downloads/MEM-CALC-ZMA-Zinco-Magn-sio-e-Vitamina-B6-rev01-PROPOSTA.xlsx | /Users/diegofrancisco/Downloads/MEM-CALC-ZMA-Zinco-Magn-sio-e-Vitamina-B6-rev01-PROPOSTA (1).xlsx | /Users/diegofrancisco/Desktop/POPS/laudos/Magnesio-Glicinato-30-100643-90844.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/09_SERENA/ARQUIVOS-PDF/01_laudo_L-teanina_lote-AUTO039250.pdf | /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/11_DETOX/ARQUIVOS-PDF/09_laudo_bisglicinato-de-zinco_lote-055-ZN-25.pdf | /Users/diegofrancisco/Downloads/dossie-tecnico-zma-night-zinco-magnesio-vitamina-d.pdf (produto correlato — NÃO é o mesmo item do catálogo; ver observação)

---

## 20. `biotina-em-capsula` — Biotina em Cápsula (memorial: BIO-PRINCESS)

**Documento lido:** `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/01_BIO-PRINCESS/MEMORIAL-CALCULO-BIO-PRINCESS-rev02.docx`  
**Revisão:** rev02 (tabela de identificação interna do próprio arquivo diz 'Revisão / data: 02 — 13/08/2026'; a data de modificação do arquivo no disco é 14/08/2026 08:11, um dia depois da data escrita dentro do documento — ver divergências)  
**Data:** 13/08/2026 (como escrita na Tabela 0 do documento; ver nota acima sobre a data de modificação do arquivo)  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/01_BIO-PRINCESS/MEMORIAL-CALCULO-BIO-PRINCESS-rev02.docx

**Porção:** 1 g (2 cápsulas) · 30 porções por embalagem · 60 cápsulas por pote · **Formato:** cápsula

**Cápsula:** tamanho 0 (LIDO no rev02, Tabela 1: 'Cápsula gelatinosa dura, tamanho 0'). DIVERGÊNCIA: o memorial rev01 (Desktop/POPS) diz Nº 00 para o mesmo produto. Cápsula vazia (Qualicaps/Genix, lote 2505380SA) pesa 98,45 mg/un (rev02 Tabela 23); cápsula cheia = 500,00 + 98,45 = 598,45 mg (rev02 Tabela 24).; massa 500 mg


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ácido ascórbico (vitamina C) | 251,26 | 99,5% | laudo lote 950467 | 250 | 250,0037 | Sim | NÃO INFORMADO no rev02 | 950467 |
| 2 | Colágeno hidrolisado (Peptan) | 120 | — | não informado | 120 | 120 | Sim | Peptan (marca); fabricante não informado no rev02 | AUTO040177 |
| 3 | L-metionina | 110,78 | 99,3% | laudo lote 950347 | 110 | 110,00454 | Sim | NÃO INFORMADO no rev02 | 950347 |
| 4 | L-cisteína cloridrato anidra | 100 | 76,44% | laudo lote 218167 | 76,44 | 76,44 | Sim | NÃO INFORMADO no rev02 | 218167 |
| 5 | Bisglicinato de zinco | 75,41 | 19,89% | laudo lote 055-ZN/25 | 15 | 14,999049 | Sim | Galena Química e Farmacêutica Ltda (Brasil) — informado no rev00 para o mesmo lote; NÃO reafirmado no texto do rev02 | 055-ZN/25 |
| 6 | Metilsulfonilmetano (MSM) | 50,41 | 99,19% | laudo lote 222159 (26D10-B033-222159) | 50 | 50,001679 | Sim | FAGRON/SM EMPREENDIMENTOS (lote de fabricante 20251224) | 222159 (26D10-B033-222159) |
| 7 | Hialuronato de sódio | 52,25 | 95,7% | laudo lote HA2026022540X | 50 | 50,00325 | Sim | NÃO INFORMADO no rev02 (laudo não registra fornecedor, só 'lote fabricante', segundo a planilha PROPOSTA de 14/09/2026) | HA2026022540X |
| 8 | Siliciumax (silício orgânico / ácido ortossilícico) | 50 | 1,43% | laudo lote 216957 (25L02-B003-216957) | 0,715 | 0,715 | Sim | Fagron (Espanha) — informado no rev00 para o mesmo lote; NÃO reafirmado no texto do rev02 | 216957 (25L02-B003-216957) |
| 9 | Vitamina E pó 50% (acetato de DL-α-tocoferila) | 45 | 50,7% | laudo lote 91320 | 15,29 | 22,815 | Sim | NÃO INFORMADO no rev02 para este lote (91320); rev00 cita 'Analitic Tecnologia de Precisão Ltda' para um LOTE DIFERENTE do mesmo insumo (2024012905/90925, teor 51,4%) — não aplicável automaticamente ao lote 91320 | 91320 |
| 10 | Nicotinamida (vitamina B3) | 35,32 | 99,09% | laudo lote 872226 | 35 | 34,998588 | Sim | NÃO INFORMADO no rev02 | 872226 |
| 11 | Selênio quelato (glicinato de selênio) | 21,47 | 0,2794% | laudo lote 044152 | 0,06 | 0,059987 | Sim | Valdequímica (comercial) / Hebei Liwellso Biote (fabricante) — LIDO no próprio rev02, Tabela 17 | 044152 |
| 12 | Vitamina D3 pó 100.000 UI/g (colecalciferol) | 17,39 | — | não informado | 0,05 | 0,05 | Sim | NÃO INFORMADO no rev02 | 91408 |
| 13 | Cloridrato de piridoxina (vitamina B6) | 10 | 99,9% | laudo lote 91188 | 8,22 | 9,99 | Sim | NÃO INFORMADO no rev02 | 91188 |
| 14 | Acetato de retinol (vitamina A) | 8,8 | — | não informado | 1,5 | 1,5 | Sim | NÃO INFORMADO no rev02 | 25I27-B017-215230 |
| 15 | D-pantotenato de cálcio (vitamina B5) | 5,64 | 98,2% | laudo lote 91186 | 5,08 | 5,53848 | Sim | NÃO INFORMADO no rev02 | 91186 |
| 16 | Cobre aminoácido quelato 24% | 3,82 | 23,57% | laudo lote NPT.0325/404 | 0,9 | 0,900374 | Sim | Natural Products & Technologies Ltda (Brasil) — LIDO no rev00 para o mesmo número de lote; NÃO reafirmado no texto do rev02 | NPT.0325/404 |
| 17 | Riboflavina (vitamina B2) | 2,74 | 100,1% | laudo lote 91068 | 2,74 | 2,74274 | Sim | NÃO INFORMADO no rev02 | 91068 |
| 18 | Ácido fólico (vitamina B9) | 0,441 | 90,67% | laudo lote AUTO039613 | 0,4 | 0,399855 | Sim | NÃO INFORMADO no rev02 | AUTO039613 |
| 19 | Iodeto de potássio | 0,197 | 76,15% | laudo lote 210468 | 0,15 | 0,150016 | Sim | NÃO INFORMADO no rev02 | 210468 |
| 20 | D-biotina (vitamina B7) | 0,046 | 97,69% | assumido | 0,045 | 0,044937 | Sim | NÃO INFORMADO no rev02 | 25030042 |
| 21 | Metilcobalamina (vitamina B12) | 0,011 | 89,27% | laudo lote 219376 (26B20-B032-219376) | 0,00994 | 0,00982 | Sim | FAGRON/SM EMPREENDIMENTOS (lote de fabricante 032511057) | 219376 (26B20-B032-219376) |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (INS 551), antiumectante, q.s.p. — 39,01 mg por porção (rev02, Tabela 7). NOTA: no memorial rev00 (29/07/2026) o antiumectante era só 10 mg e havia ADICIONALMENTE 16,69 mg de maltodextrina como excipiente de fechamento — combinação diferente da usada no rev02, embora o total de porção feche em 1.000 mg nos dois casos. | 39,01 |
| Cápsula (vazia): gelatina, água purificada, corante dióxido de titânio (INS 171) e lauril sulfato de sódio (rev02, item 13 — o lauril sulfato de sódio é citado no rev02 mas sua função como ingrediente de declaração obrigatória ainda depende de confirmação do fabricante, segundo o próprio rev02, Tabela 28). | — |

**Massa total (insumos + excipientes):** 999,995 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- NOTA DE SLUG (consolidação): Memorial lido chama-se MEMORIAL-CALCULO-BIO-PRINCESS-rev02.docx. O cadastro do catálogo tem DOIS slugs distintos e reais: `bioprincess` (linha premium, vit. C 508,91mg) e `biotina-em-capsula` (linha básica, vit. C 250mg, com colágeno). O dossiê técnico oficial (dossie-tecnico-biotina-em-capsula.pdf) e a planilha MEM-CALC-Biotina-em-Cápsula-rev01-PROPOSTA.xlsx tratam este memorial como correspondente a `biotina-em-capsula` — por isso os dados abaixo foram registrados sob esta chave, conforme pedido na tarefa. Isso NÃO cobre o slug `bioprincess` (fora do escopo dos 24 pedidos), cuja composição de rótulo é numericamente diferente (vit. C 508,91mg vs 250mg aqui) — não presumir que os números abaixo valem para `bioprincess`.
- IDENTIDADE DO PRODUTO: o slug de catálogo 'biotina-em-capsula' corresponde, pelo dossiê técnico oficial (dossie-tecnico-biotina-em-capsula.pdf, emitido 14/09/2026) e pela planilha MEM-CALC-Biotina-em-Cápsula-rev01-PROPOSTA.xlsx, à MESMA fórmula multi-ativo 'cabelo/pele/unha' do BIO PRINCESS (21 constituintes: colágeno, aminoácidos sulfurados, MSM, ácido hialurônico, silício orgânico + complexo vitamínico-mineral) — NÃO é biotina isolada. O memorial rev00 (29/07/2026) declara textualmente que a fórmula 'consolida quatro composições distintas praticadas em contratos de fabricação vigentes — Beleza Cabelo, Pele e Unhas; Bio Princess; In Hair; e Sol — em uma única composição notificável... para 5 clientes, correspondentes a 1.700 unidades'. 'Biotina em Cápsula' é aparentemente mais um nome comercial do mesmo pó.
- LINHAGEM DE REVISÕES: existem pelo menos 3 memoriais do mesmo produto: rev00 (11 MB, 29/07/2026, código 'FT-PRD-022', idêntico por MD5 em Desktop/POPS e em Downloads), rev01 (47 KB, 13/08/2026, código 'MC-PRD-BIOPRINCESS-001', só em Desktop/POPS, sem '-rev01' no nome do arquivo) e rev02 (38 MB, Downloads/MEMORIAIS_2026 2 — fonte primária desta tarefa, data interna 13/08/2026 mas arquivo modificado em 14/08/2026).
- VITAMINA A — erro histórico de ≈5,86× já corrigido: rev00 declarava 1.500 mcg RE a partir de só 1,5 mg de acetato de retinol, sem conversão de potência; pela potência real do laudo (568.116 UI/g) essa massa entregaria ≈256 mcg RE (17% do declarado). Corrigido no rev01 para 8,80 mg, confirmado no rev02.
- SELÊNIO — regressão de conformidade: rev00 usava glicinato de selênio (fonte hoje apontada, pelo próprio rev02, como NÃO autorizada pelo painel ANVISA). Rev01 tinha corrigido para L-selenometionina (fonte autorizada). Rev02 REVERTEU para o glicinato de rev00 — e o próprio rev02 sinaliza isso em vermelho (🔴) sem, no entanto, reverter a fórmula. A recomendação de trocar para selenito de sódio não foi adotada nem na proposta de 14/09/2026.
- COBRE — mesmo padrão de regressão: rev00 usava cobre aminoácido quelato 24% (forma não listada entre as autorizadas pela ANVISA, que só permite aspartato, bisglicinato, gluconato, óxido e sulfato de cobre). Rev01 tinha corrigido para bisglicinato de cobre 20% (fonte autorizada). Rev02 REVERTEU para o aminoácido quelato de rev00, mesmo lote (NPT.0325/404). Diferente do selênio, o rev02 NÃO sinaliza este problema em nenhum lugar do texto extraído; só a planilha de 'Biotina em Cápsula' de 14/09/2026 o identifica.
- VITAMINA B6 e L-CISTEÍNA — massa do sal tratada como massa do ativo livre: rev01, rev00, o rótulo impresso vigente e o dossiê técnico (todos ainda em 14/09/2026) declaram 10 mg de 'vitamina B6' e 100 mg de 'L-cisteína' direto da massa do sal pesado, sem aplicar a razão de peso molecular sal→base. O rev02 é o único a aplicar essa razão, chegando a 8,22 mg e 76,44 mg respectivamente, a partir das MESMAS massas pesadas (10 mg e 100 mg). A proposta de 14/09/2026 chama isso de 'ERRO DE RÓTULO'.
- VITAMINA E — fator de conversão ausente até o rev02: rev00 e rev01 declaravam 45 mg de vitamina E direto da massa do pó a 50%, sem o fator acetato→alfa-tocoferol-equivalente (×0,67). O rev02 introduz esse fator e recalcula a entrega real em 15,29 mg (queda de ≈3×). Rótulo e dossiê comercial (14/09/2026) ainda mostram 45 mg/450%VD.
- VITAMINA B5 — três leituras diferentes para o mesmo insumo/lote (91186): rev01 pesa 6,24 mg para entregar 5,64 mg (aplicando pureza 98,2% × conversão sal→ácido pantotênico 92%); rev02 reduz a massa pesada para 5,64 mg do mesmo insumo, entregando só 5,08 mg (mesmos dois fatores, massa menor); a planilha 'Biotina em Cápsula' de 14/09/2026 NÃO aplica o fator de 92% (por decisão de escopo explicitamente documentada nela) e trata 5,64 mg como já sendo o ativo puro, resultando 'NO TETO EXATO'.
- SEIS NUTRIENTES NO TETO LEGAL EXATO, SEM MARGEM: vitamina D, B2, B3, B12 e biotina permanecem exatamente no limite máximo tanto no rev01 quanto no rev02 (só B5 ganhou margem no rev02). A proposta BIOPRINCESS-rev03 (14/09/2026, NÃO ASSINADA) reduz esses cinco para sair do teto; a proposta Biotina-em-Cápsula (mesma data) NÃO adota essa redução, mantendo todos os seis exatamente no teto.
- METILCOBALAMINA (B12), lote 219376 — dois teores diferentes no MESMO documento rev02: seção 6.1 (texto corrido) usa 99,2%/água 4,7%/94,54% tal qual; Tabelas 6, 9 e 18 (inclusive a justificativa formal de escolha do lote) usam 98,17%/água 9,07%/89,27% tal qual. A planilha de 14/09/2026 usa o segundo conjunto mas classifica sua própria confiança como 'PARCIAL', dizendo que falta 'confirmar o corpo do laudo na leitura visual'. Nenhum documento lido verifica de forma independente, a partir do laudo original, qual teor está certo.
- LIMITES LEGAIS (teto) divergem entre revisões para o MESMO nutriente: o caso mais grave é vitamina B3/niacina — rev00 cita teto de 500 mg/dia (dose a 7% do limite); rev02 cita teto de 35 mg/dia (dose a 100% do limite, 'NO TETO EXATO') — diferença de 14,3×. Outros pares divergentes (rev00 × rev02): zinco 40×29,59 mg; cobre 10.000×8.975,52 mcg; iodo 600×919,02 mcg; selênio 400×319,75 mcg; vitamina B9 1.000×1.281,50 mcg; vitamina C 1.000×1.916,02 mg; vitamina E 300×1.000 mg; vitamina A 3.000×2.623,61 mcg; silício 2,96 mg (rev01, fonte não declarada) × 15,67 mg (rev02, atribuído ao painel oficial ANVISA consultado em 13/08/2026). Não fui à fonte oficial da ANVISA arbitrar qual valor está certo em cada caso — registro apenas que os documentos internos da própria empresa divergem entre si.
- TAMANHO DA CÁPSULA: rev01 diz Nº 00; rev02 diz tamanho 0 (mesmo peso de pó declarado, 500 mg). Rev00 não especifica o número.
- ÁCIDO HIALURÔNICO (lote HA2026022540X, em uso no rev02): segundo a planilha de 14/09/2026 (não verificado por mim no laudo), o certificado não declara processo de obtenção nem cepa — mesma lacuna que levou a Lemoncaps a reprovar formalmente outro lote de hialuronato (225412, parecer PAR-LAU-2026-003 de 28/08/2026). Não é uma reprovação deste lote, é um paralelo a verificar com urgência.
- ARQUIVO DE LAUDO INCOMPLETO na própria pasta 'fonte primária': a cópia do laudo do ácido fólico (lote AUTO039613) em 'Downloads/MEMORIAIS_2026 2/06_LIDEMA/ARQUIVOS-PDF/' está faltando a página com a tabela de resultados; há 3 cópias completas do mesmo laudo em Desktop/POPS.
- VITAMINA A, laudo lote 25I27-B017-215230: potência medida (568.116,28 UI/g) é 13,6% maior que o valor nominal do rótulo do insumo (500.000 UI/g) — variação sinalizada (planilha de 14/09/2026) como incomum e merecedora de confirmação com o fornecedor. É o mesmo valor usado em todos os cálculos de vitamina A do rev02.
- STATUS DOS ARQUIVOS '_PROPOSTA': tanto MEM-CALC-BIOPRINCESS-rev03_PROPOSTA.xlsx quanto MEM-CALC-Biotina-em-Cápsula-rev01-PROPOSTA.xlsx se autodeclaram, no próprio cabeçalho, como 'PROPOSTA 14/09/2026 — NÃO ASSINADO'. Nenhum dos dois é a formulação vigente/assinada. São propostas calculadas de forma parcialmente independente uma da outra e DIVERGEM ENTRE SI (ex.: B5, e quais dos 6 nutrientes no teto foram reduzidos).
- RÓTULO E DOSSIÊ COMERCIAL DESATUALIZADOS: a proposta BIOPRINCESS-rev03 confirma, comparando com a arte do rótulo vigente ('30_ROTULO_BioPrincess_2026.pdf', lida em 14/09/2026), que o rótulo impresso ainda mostra os valores de ANTES da correção do rev02 (vitamina E 45 mg, B6 10 mg, B5 5,64 mg, L-cisteína 100 mg) — as correções do rev02 (13-14/08/2026) não chegaram ao material comercial nem 1 mês depois. O rótulo também ainda traz a frase de abertura 'Biohair reúne nutrientes...' — nome de outro produto.
- FICHA TÉCNICA 'FICHA-TECNICA-BIO-PRINCESS-PREMIUM.docx': o título interno é 'FICHA TÉCNICA - 60 CÁPSULAS – cabelo suelen' — não menciona 'BIO PRINCESS' em nenhum lugar do cabeçalho, e a fórmula (com Manganês 2,3 mg, ausente de todas as demais versões) não bate com nenhuma revisão do memorial. Parece ser um artefato de outro produto/cliente, reaproveitado por engano com o nome de arquivo do BIO PRINCESS.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 999.995 mg; porção declarada ≈ 1000.0 mg; diferença -0.00 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: NÃO LEGÍVEL no rev02 (não encontrei, nas tabelas e parágrafos extraídos do rev02, uma cifra de rendimento padrão de lote). PENDENTE — depende de reler o rev02 com foco dedicado ou consultar produção. Para comparação apenas: o rev01 (13/08/2026, documento diferente) declara 'Rendimento padrão de lote: 10.000 cápsulas = 5,000 kg de blend = 166 potes' — não presumi que esse número ainda valha para o rev02.
- Fontes secundárias conferidas: /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-BIO-PRINCESS-PREMIUM.docx | /Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-BIOPRINCESS.docx | /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-BIO-PRINCESS.docx | /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-BIOPRINCESS.docx | /Users/diegofrancisco/Downloads/MEMORIAL-CALCULO-BIOPRINCESS.docx | /Users/diegofrancisco/Downloads/MEM-CALC-BIOPRINCESS-rev03_PROPOSTA.xlsx | /Users/diegofrancisco/Downloads/MEM-CALC-Biotina-em-C-psula-rev01-PROPOSTA.xlsx | /Users/diegofrancisco/Downloads/dossie-tecnico-biotina-em-capsula.pdf | /Users/diegofrancisco/Desktop/POPS/REDUCAO-FORMULA-1000MG-2CAPSULAS.pdf

---

## 21. `creatina-monohidratada-150g-soluvel` — Creatina Monoidratada 150g Solúvel

**Documento lido:** `MEMORIAL-CALCULO-CREATINA-PO-rev02.docx (codigo interno MEM-CALC-CREATINAPO-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/MEMORIAL-CALCULO-CREATINA-PO-rev02.docx`  
**Revisão:** 02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — MEMORIAL-CALCULO-CREATINA-PO-rev02.docx (codigo interno MEM-CALC-CREATINAPO-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/MEMORIAL-CALCULO-CREATINA-PO-rev02.docx

**Porção:** 5 g (1 scoop/dosador) · **Formato:** pó


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina monoidratada | 5000 | 100,5% | laudo lote 217949 (lote interno do laudo: 26A05-B023-217949; lote do fabricante: 20250913) | 5000 | 5025 | Sim | Nao identificado de forma inequivoca no memorial (a tabela de insumos nao tem coluna fornecedor); o laudo do lote 217949 e emitido em papel timbrado 'SM Empreendimentos Farmaceuticos' e assinado por responsaveis tecnicos vinculados a 'Fagron Services Brasil' e 'Fagron Distribution Brazil' -- sugere Fagron como distribuidor, mas o documento nao afirma isso expressamente. | 217949 (lote interno do laudo: 26A05-B023-217949; lote do fabricante: 20250913) |

**Massa total (insumos + excipientes):** 5000 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- DOSADOR É VOLUMÉTRICO (8 mL), NÃO GRAVIMÉTRICO (8 g) — o nome do arquivo '23_EMB_dosador-8.pdf' pode sugerir '8 gramas', mas o certificado (Part Number 3.41.001.548) descreve 'DOSADOR 8 ML HC GRADUADO' — 8 MILILITROS de volume. O certificado só atesta dimensões físicas e peso da peça plástica vazia (1,50 g em média, padrão 1,55 ±0,20 g); não há ensaio gravimétrico de quanto pó de creatina uma dosada realmente pesa. Pela densidade aparente do laudo da matéria-prima (491 g/L solta a 737 g/L compactada), 8 mL renderiam entre ~3,93 g e ~5,90 g — faixa que TORNA PLAUSÍVEL os 5,00 g declarados, mas não os CONFIRMA. O próprio memorial já recomenda validar o volume do scoop, especialmente porque a dose está no teto exato do limite legal (5.000 mg) e qualquer excesso de enchimento ultrapassaria o máximo autorizado.
- NENHUMA DOCUMENTAÇÃO ESPECÍFICA PARA O SLUG DE 300 G — busca no texto visível e no XML bruto do .docx não encontrou nenhuma menção a '300 g' ou a uma segunda apresentação em todo o memorial; o documento (título, tabela de identificação, seção de embalagem, cálculo de peso bruto) trata exclusivamente da apresentação de 150 g com pote PEAD 600 mL B93. O rótulo real (30_ROTULO_CreatinaPo_2026.pdf) confirma: 'PESO LÍQUIDO: 150G', 'CONTÉM 30 DOSES' — artes de rótulo para 150 g apenas. A pasta ARQUIVOS-PDF só tem 4 arquivos, todos referentes a essa mesma embalagem de 150 g (pote 600 mL, tampa rosca 93 mm, dosador 8 mL, rótulo 150 g); não há um segundo pote maior, laudo de embalagem ou arte de rótulo para 300 g em nenhum lugar consultado. CÁLCULO HIPOTÉTICO (só se o slug de 300 g reaproveitar o MESMO pote PEAD 600 mL): 300 g de creatina monoidratada, na densidade aparente 'sem compactação' do laudo (491 g/L), ocupariam cerca de 611 mL — ligeiramente ACIMA da capacidade nominal de 600 mL do pote; já na densidade 'com compactação' (737 g/L), ocupariam cerca de 407 mL, cabendo com folga. Ou seja, cabe ou não cabe dependendo de quanto o pó assenta durante o envase — isso é um cálculo deste agente, não uma constatação do memorial, e fica como ponto de atenção para quem definir a embalagem real de 300 g.
- DADOS DE EMBALAGEM QUE O PRÓPRIO MEMORIAL DEIXOU EM ABERTO E QUE ESTE AGENTE CONFERIU NA FONTE: a tabela de embalagem do memorial lista 'Tampa do pote 600 mL' e 'Dosador (scoop)' com peso e lote como 'ver laudo anexo' (não preenchidos). Lendo os laudos diretamente: tampa = 'TAMPA ROSCA 93MM LISA C/ SELO PEAD', Randon Embalagens, cor preta, peso 17,80 g (±2%), lotes RF1-50/10355 e RF1-50/10475, matéria-prima Polipropileno (PP), rosca 93 mm (compatível com o ø da rosca do pote, também 93 mm — aqui NÃO há o tipo de incompatibilidade pote×tampa que a gummy apresenta). Dosador = Part Number 3.41.001.548, 'DOSADOR 8 ML HC GRADUADO', lote 26013100, peso da peça vazia 1,50 g (padrão 1,55 ±0,20 g), Polipropileno (PP), fabricação 01/2026. Com esses dados, o peso bruto completo do pote de 150 g seria aproximadamente 150 (pó) + 42,00 (pote) + 17,80 (tampa) + 1,50 (dosador) = 211,30 g — o memorial só soma pote + pó ('peso bruto aproximado 192,00 g', explicitamente rotulado como aproximado, sem incluir tampa/dosador/sílica).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 5000.0 mg; porção declarada ≈ 5000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: 30
- Fontes secundárias conferidas: Laudo materia-prima lido: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/01_laudo_creatina-monoidratada_lote-217949.pdf (SM Empreendimentos Farmaceuticos, lote interno 26A05-B023-217949 / lote fabricante 20250913, analise 03/02/2026, CAS 6020-87-7, teor base seca 100,5%, perda por dessecacao 11,5%, creatinina 95 ppm, dicianamida 43 ppm, conclusao APROVADO). Este laudo NAO tem copia propria na pasta 15_CREATINA-PO/ARQUIVOS-PDF -- os dois produtos compartilham o mesmo lote 217949 e o memorial da po remete aos mesmos dados. | Laudo dosador LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/23_EMB_dosador-8.pdf -- 'DOSADOR 8 ML HC GRADUADO' (volume, não massa); peso da peça vazia 1,50 g; sem ensaio gravimétrico do conteúdo de creatina por dosada. | Laudo pote LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/20_EMB_pote-PEAD-600mL_lote-RF1-50-10238.pdf -- Randon Embalagens, POTE PEAD 600ML B93 preto, peso 42,00 g (±5%), lote RF1-50/10238, confirma exatamente os dados do memorial. | Laudo tampa LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/22_EMB_tampa-creatina-soluvel.pdf -- TAMPA ROSCA 93MM LISA C/ SELO PEAD, peso 17,80 g, lotes RF1-50/10355 e RF1-50/10475 -- preenche um dado que o memorial deixou como 'ver laudo anexo'. | Rótulo real (arte) LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/30_ROTULO_CreatinaPo_2026.pdf (2 páginas) -- confirma 'Porção: 5 g (1 scoop)', 'Creatina (mg): 5000', 'PESO LÍQUIDO: 150G', 'CONTÉM 30 DOSES', 'SEM SABOR' -- consistente com o memorial em tudo; nenhuma menção a 300 g.

---

## 22. `creatina-monohidratada-300g-soluvel` — Creatina Monoidratada 300g Solúvel

**Documento lido:** `MEMORIAL-CALCULO-CREATINA-PO-rev02.docx (codigo interno MEM-CALC-CREATINAPO-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/MEMORIAL-CALCULO-CREATINA-PO-rev02.docx`  
**Revisão:** 02  
**Data:** 13/08/2026  
**Procedência:** Memorial de cálculo rev02 da fábrica, pasta MEMORIAIS_2026 2 (fonte primária desta tarefa) — MEMORIAL-CALCULO-CREATINA-PO-rev02.docx (codigo interno MEM-CALC-CREATINAPO-rev02) -- /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/MEMORIAL-CALCULO-CREATINA-PO-rev02.docx

**Porção:** 5 g (1 scoop/dosador) · **Formato:** pó


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina monoidratada | 5000 | 100,5% | laudo lote 217949 (lote interno do laudo: 26A05-B023-217949; lote do fabricante: 20250913) | 5000 | 5025 | Sim | Nao identificado de forma inequivoca no memorial (a tabela de insumos nao tem coluna fornecedor); o laudo do lote 217949 e emitido em papel timbrado 'SM Empreendimentos Farmaceuticos' e assinado por responsaveis tecnicos vinculados a 'Fagron Services Brasil' e 'Fagron Distribution Brazil' -- sugere Fagron como distribuidor, mas o documento nao afirma isso expressamente. | 217949 (lote interno do laudo: 26A05-B023-217949; lote do fabricante: 20250913) |

**Massa total (insumos + excipientes):** 5000 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- NOTA DE SLUG (consolidação): Slug pedido na tarefa foi "creatina-monohidratada-300g"; o slug REAL no catálogo é "creatina-monohidratada-300g-soluvel".
- APRESENTAÇÃO DE 300 G NÃO DOCUMENTADA — achado principal para este slug: o memorial MEM-CALC-CREATINAPO-rev02 (único memorial de creatina em pó existente no dossiê) declara explicitamente 'Apresentação: 150 g · contém 30 doses' na tabela de identificação, e todo o memorial de embalagem (pote PEAD 600 mL B93, cálculo de peso bruto) é construído em cima dessa única apresentação. Busca no texto visível e no XML bruto do .docx não encontrou nenhuma menção a '300 g' ou a uma segunda apresentação em lugar nenhum do documento. O rótulo real (30_ROTULO_CreatinaPo_2026.pdf) também só existe, neste dossiê, para 150 g ('PESO LÍQUIDO: 150G'). A pasta ARQUIVOS-PDF correspondente só tem 4 arquivos, todos sobre a mesma embalagem de 150 g. Os dados de CREATINA por dose (5.000 mg, 1 scoop de 5 g) foram replicados para este slug por ASSUNÇÃO deste agente de que a dose por porção não muda com o tamanho do pote — apenas o número de doses por embalagem mudaria (300 g ÷ 5 g = 60 doses, contra 30 doses do pote de 150 g) — mas isso é uma ASSUNÇÃO, não um dado lido de um documento específico do slug de 300 g. PENDENTE: não existe, em nenhuma pasta consultada, memorial, ficha técnica ou laudo de embalagem específico para 'creatina-monohidratada-300g'.
- CÁLCULO HIPOTÉTICO DE CAPACIDADE DO POTE (deste agente, não do memorial): SE o slug de 300 g reaproveitar o mesmo pote PEAD 600 mL B93 documentado para os 150 g, 300 g de creatina monoidratada ocupariam entre ~407 mL (densidade 'com compactação', 737 g/L, do laudo do lote 217949) e ~611 mL (densidade 'sem compactação', 491 g/L) — ou seja, no cenário menos favorável (pó solto, sem assentar), o volume necessário ficaria levemente ACIMA da capacidade nominal de 600 mL do pote. Isso não é uma constatação de erro (o pó normalmente assenta durante o envase e transporte), apenas um ponto de atenção a verificar fisicamente antes de definir a embalagem real de 300 g — nenhum documento do dossiê trata dessa apresentação.
- DOSADOR É VOLUMÉTRICO (8 mL), NÃO GRAVIMÉTRICO (8 g) — o nome do arquivo '23_EMB_dosador-8.pdf' pode sugerir '8 gramas', mas o certificado (Part Number 3.41.001.548) descreve 'DOSADOR 8 ML HC GRADUADO' — 8 MILILITROS de volume. O certificado só atesta dimensões físicas e peso da peça plástica vazia (1,50 g em média, padrão 1,55 ±0,20 g); não há ensaio gravimétrico de quanto pó de creatina uma dosada realmente pesa. Pela densidade aparente do laudo da matéria-prima (491 g/L solta a 737 g/L compactada), 8 mL renderiam entre ~3,93 g e ~5,90 g — faixa que TORNA PLAUSÍVEL os 5,00 g declarados, mas não os CONFIRMA. O próprio memorial já recomenda validar o volume do scoop, especialmente porque a dose está no teto exato do limite legal (5.000 mg) e qualquer excesso de enchimento ultrapassaria o máximo autorizado.
- NENHUMA DOCUMENTAÇÃO ESPECÍFICA PARA O SLUG DE 300 G — busca no texto visível e no XML bruto do .docx não encontrou nenhuma menção a '300 g' ou a uma segunda apresentação em todo o memorial; o documento (título, tabela de identificação, seção de embalagem, cálculo de peso bruto) trata exclusivamente da apresentação de 150 g com pote PEAD 600 mL B93. O rótulo real (30_ROTULO_CreatinaPo_2026.pdf) confirma: 'PESO LÍQUIDO: 150G', 'CONTÉM 30 DOSES' — artes de rótulo para 150 g apenas. A pasta ARQUIVOS-PDF só tem 4 arquivos, todos referentes a essa mesma embalagem de 150 g (pote 600 mL, tampa rosca 93 mm, dosador 8 mL, rótulo 150 g); não há um segundo pote maior, laudo de embalagem ou arte de rótulo para 300 g em nenhum lugar consultado. CÁLCULO HIPOTÉTICO (só se o slug de 300 g reaproveitar o MESMO pote PEAD 600 mL): 300 g de creatina monoidratada, na densidade aparente 'sem compactação' do laudo (491 g/L), ocupariam cerca de 611 mL — ligeiramente ACIMA da capacidade nominal de 600 mL do pote; já na densidade 'com compactação' (737 g/L), ocupariam cerca de 407 mL, cabendo com folga. Ou seja, cabe ou não cabe dependendo de quanto o pó assenta durante o envase — isso é um cálculo deste agente, não uma constatação do memorial, e fica como ponto de atenção para quem definir a embalagem real de 300 g.
- DADOS DE EMBALAGEM QUE O PRÓPRIO MEMORIAL DEIXOU EM ABERTO E QUE ESTE AGENTE CONFERIU NA FONTE: a tabela de embalagem do memorial lista 'Tampa do pote 600 mL' e 'Dosador (scoop)' com peso e lote como 'ver laudo anexo' (não preenchidos). Lendo os laudos diretamente: tampa = 'TAMPA ROSCA 93MM LISA C/ SELO PEAD', Randon Embalagens, cor preta, peso 17,80 g (±2%), lotes RF1-50/10355 e RF1-50/10475, matéria-prima Polipropileno (PP), rosca 93 mm (compatível com o ø da rosca do pote, também 93 mm — aqui NÃO há o tipo de incompatibilidade pote×tampa que a gummy apresenta). Dosador = Part Number 3.41.001.548, 'DOSADOR 8 ML HC GRADUADO', lote 26013100, peso da peça vazia 1,50 g (padrão 1,55 ±0,20 g), Polipropileno (PP), fabricação 01/2026. Com esses dados, o peso bruto completo do pote de 150 g seria aproximadamente 150 (pó) + 42,00 (pote) + 17,80 (tampa) + 1,50 (dosador) = 211,30 g — o memorial só soma pote + pó ('peso bruto aproximado 192,00 g', explicitamente rotulado como aproximado, sem incluir tampa/dosador/sílica).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 5000.0 mg; porção declarada ≈ 5000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Fontes secundárias conferidas: Laudo materia-prima lido: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/14_CREATINA-GUMMY/ARQUIVOS-PDF/01_laudo_creatina-monoidratada_lote-217949.pdf (SM Empreendimentos Farmaceuticos, lote interno 26A05-B023-217949 / lote fabricante 20250913, analise 03/02/2026, CAS 6020-87-7, teor base seca 100,5%, perda por dessecacao 11,5%, creatinina 95 ppm, dicianamida 43 ppm, conclusao APROVADO). Este laudo NAO tem copia propria na pasta 15_CREATINA-PO/ARQUIVOS-PDF -- os dois produtos compartilham o mesmo lote 217949 e o memorial da po remete aos mesmos dados. | Laudo dosador LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/23_EMB_dosador-8.pdf -- 'DOSADOR 8 ML HC GRADUADO' (volume, não massa); peso da peça vazia 1,50 g; sem ensaio gravimétrico do conteúdo de creatina por dosada. | Laudo pote LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/20_EMB_pote-PEAD-600mL_lote-RF1-50-10238.pdf -- Randon Embalagens, POTE PEAD 600ML B93 preto, peso 42,00 g (±5%), lote RF1-50/10238, confirma exatamente os dados do memorial. | Laudo tampa LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/22_EMB_tampa-creatina-soluvel.pdf -- TAMPA ROSCA 93MM LISA C/ SELO PEAD, peso 17,80 g, lotes RF1-50/10355 e RF1-50/10475 -- preenche um dado que o memorial deixou como 'ver laudo anexo'. | Rótulo real (arte) LIDO: /Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/15_CREATINA-PO/ARQUIVOS-PDF/30_ROTULO_CreatinaPo_2026.pdf (2 páginas) -- confirma 'Porção: 5 g (1 scoop)', 'Creatina (mg): 5000', 'PESO LÍQUIDO: 150G', 'CONTÉM 30 DOSES', 'SEM SABOR' -- consistente com o memorial em tudo; nenhuma menção a 300 g.

---

## 23. `emagrecedor-em-capsula` — Emagrecedor em Cápsula

**Documento lido:** `/Users/diegofrancisco/Downloads/FICHA TÉCINICA EMAGRECIMENTO EM CÁPSULAS LEMON CAPS .docx`  
**Revisão:** SEM NÚMERO DE REVISÃO (não é memorial de cálculo; é ficha técnica simples, sem código nem "rev0x")  
**Data:** NÃO DATADO no arquivo (data de modificação do arquivo em disco: 01/04/2026)  
**Procedência:** /Users/diegofrancisco/Downloads/FICHA TÉCINICA EMAGRECIMENTO EM CÁPSULAS LEMON CAPS .docx

**Porção:** 1 g (2 cápsulas) · **Formato:** cápsula


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Spirulina (Arthrospira platensis) | 110 | — | não informado | 110 | 110 | indeterminado | — | — |
| 2 | Psyllium (Plantago ovata, pó da casca da semente) | 60 | — | não informado | 60 | 60 | indeterminado | — | — |
| 3 | Cúrcuma (Curcuma longa L., extrato seco do rizoma) | 120 | — | não informado | 120 | 120 | indeterminado | — | — |
| 4 | Vitamina A (acetato de retinila) | 1,5 | — | não informado | 1500 | 1500 | indeterminado | — | — |
| 5 | Guaraná (Paullinia cupana, pó da semente) | 100 | — | não informado | 100 | 100 | indeterminado | — | — |
| 6 | Quitosana | 110 | — | não informado | 110 | 110 | indeterminado | — | — |
| 7 | Inulina (de Cichorium intybus) | 40 | — | não informado | 40 | 40 | indeterminado | — | — |
| 8 | Cromo (picolinato de cromo) | 0,25 | — | não informado | 250 | 250 | indeterminado | — | — |
| 9 | Laranja moro (Citrus sinensis, extrato padronizado) | 5 | — | não informado | 5 | 5 | indeterminado | — | — |
| 10 | Feno-grego (extrato seco da semente) | 200 | — | não informado | 200 | 200 | indeterminado | — | — |
| 11 | Café verde (extrato padronizado 35% ácido clorogênico) | 100 | — | não informado | 35 | 35 | indeterminado | — | — |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Dióxido de silício (antiumectante INS 551) | — |

**Massa total (insumos + excipientes):** 846,75 mg  
**A soma fecha com a porção declarada?** indeterminado

**Observações e divergências:**

- NÃO HÁ MEMORIAL DE CÁLCULO nem dossiê técnico para este produto — o único documento localizado é uma FICHA TÉCNICA simples (sem código, sem número de revisão, sem tabela de fechamento matemático, sem nenhum lote/laudo/fornecedor). Todos os "ativos" abaixo são a massa NOMINAL declarada na ficha, não uma entrega recalculada a partir de teor de laudo — portanto NENHUM item desta lista pode ter "conta_fecha" verdadeiramente verificado (todos ficam indeterminados).
- SOMA PARCIAL: os 11 insumos somam 846,75mg de uma porção declarada de 1.000mg (1g/2 cápsulas) — faltam ≈153,25mg não atribuídos a nenhum insumo nomeado (dióxido de silício sem massa e/ou cápsula) — não é possível concluir se a porção fecha.
- Existem, no mesmo acervo, PROPOSTAS COMERCIAIS alternativas para "emagrecimento" com formulações e apresentações diferentes desta ficha (ex.: "proposta_EMAGRECIMENTO_60_CÁPSULAS_COM_500_MG_CADA_20260214.pdf", "proposta_EMAGRECIMENTO_FRASCO_COM_30_MLS_20260214.pdf", "Dossie_Tecnico_Formula_Solange_Emagrecimento.pdf", diversos "Formula_Metabolica_Emagrecimento_*" e "Formulacao_Emagrecimento_Tabela_Tecnica_*") — não abertas nesta consolidação por terem nome de arquivo característico de PROPOSTA/RASCUNHO de fornecedor (não de ficha adotada com timbre e CNPJ da Lemoncaps); a ficha usada aqui é a única com timbre, CNPJ e farmacêutico responsável da Lemoncaps.
- Alergênico de crustáceos (quitosana) corretamente declarado nesta ficha — ponto positivo, ao contrário de outros produtos da linha (Nuviart) que omitem alergênicos de fonte semelhante.
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma PARCIAL = 846.75 mg de um alvo de porção ≈1000.0 mg; faltam 1 de 12 itens sem massa_mg extraída no memorial/dump de origem — não dá para concluir se a porção fecha (dado incompleto, não é reprovação).
- Porções por lote: NÃO LEGÍVEL (documento não traz rendimento de lote).

---

## 24. `slim-up-emagrecimento-em-gota` — Slim Up (Emagrecimento em Gota)

**Documento lido:** `/Users/diegofrancisco/Downloads/MEM-CALC-SLIMUP-rev03_Memorial_de_Calculo_PREENCHIDO.xlsx`  
**Revisão:** rev03  
**Data:** 14/09/2026 — RASCUNHO, NÃO ASSINADO (texto literal da própria planilha, aba 'Sugestão de Memorial', célula ao lado do nome do produto)  
**Procedência:** /Users/diegofrancisco/Downloads/MEM-CALC-SLIMUP-rev03_Memorial_de_Calculo_PREENCHIDO.xlsx

**Porção:** 1 mL (30 gotas) — 30 porções por embalagem — frasco de 30 mL (LIDO, aba 'Sugestão de Memorial') · **Formato:** LÍQUIDO — solução oral em gotas. Confirmado por leitura direta em 4 documentos independentes: rev03 ('Suplemento Alimentar em gotas'), rev02 ('Forma farmacêutica: Solução oral em gotas'), Ficha Técnica ('SUPLEMENTO ALIMENTAR EM GOTAS') e Memorial rev00/FT-PRD-023 ('solução oral em gotas, frasco de 30 mL'). NÃO é cápsula — não há tamanho/massa de cápsula em nenhum documento.


**Insumos (massa pesada → ativo declarado/recalculado, fonte do teor, fornecedor/lote):**

| # | Insumo no memorial | Massa pesada (mg) | Teor | Teor — fonte | Ativo declarado | Ativo recalculado | Conta fecha? | Fornecedor | Lote |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Vitamina D3 pó 100.000 UI/g (colecalciferol) | 15,652 | — | não informado | — | — | Sim | Analitic Tecnologia de Precisão Ltda. (emissão INLAB) | 91408 (lote fabricante 2025111601) |
| 2 | Metilcobalamina (vitamina B12) | 0,010082 | 89,27% | laudo lote 219376 (mesmo número citado no rev02) | — | 0,009 | Sim | SM Empreendimentos Farmacêuticos / Fagron Distribution Brazil | 219376 (mesmo número citado no rev02) |
| 3 | Picolinato de cromo | 0,25 | 12,34% | laudo lote 91190 (lote fabricante 2024122501) | — | 0,03085 | Sim | Analitic Tecnologia de Precisão Ltda. (emissão INLAB) | 91190 (lote fabricante 2024122501) |
| 4 | Extrato seco de semente de café verde (rev03: identificado no laudo como Coffea robusta) | 50 | 53,86% | laudo lote 10841 | 26,93 | 26,93 | Sim | Herbaltec — Tecnologia de Alimentos | 10841 |
| 5 | DL-Bitartarato de colina | 33,3 | 40,61% | laudo lote 91442 (lote fabricante CA26010402USPS) | 13,523 | 13,52313 | Sim | Analitic Tecnologia de Precisão Ltda. (emissão INLAB) | 91442 (lote fabricante CA26010402USPS) |
| 6 | Extrato seco de rizoma de cúrcuma (Curcuma longa L.) | 80 | 0,42% | laudo lote NPT.0425/580 | 0,336 | 0,336 | Sim | Natural Products & Technologies Ltda (NaturalPRO) | NPT.0425/580 |
| 7 | Extrato fluido de semente de feno-grego (Trigonella foenum-graecum L.) | 33 | — | não informado | — | — | indeterminado | Santosflora Comércio de Ervas Ltda. | AUTO9IVT |

**Excipientes:**

| Nome | Massa (mg) |
|---|---|
| Água mineral (q.s.p. 1 mL) | 555,377918 |
| Glicerina vegetal | 133,3 |
| Sorbitol líquido 70% | 66,7 |
| Inulina de raiz de chicória (Cichorium intybus L.) | 21,7 |
| Ácido cítrico anidro (INS 330) | 6,7 |
| Benzoato de sódio (INS 211) | 1,67 |
| Sorbato de potássio (INS 202) | 1,67 |
| Goma xantana (INS 415) | 0,67 |

**Massa total (insumos + excipientes):** 1000 mg  
**A soma fecha com a porção declarada?** Sim

**Observações e divergências:**

- MEM-CALC (fonte principal) × MEM1-CALC/(1)/(2): mesmo conteúdo em todas as abas; diferem só no cache da linha Total (ver fonte_secundaria_conferida acima). Não é divergência de dado.
- Sorbitol: laudo anexado é de PÓ (confirmado: 'Pó fino Cristalino', Adicel, lote 106371); fórmula usa LÍQUIDO 70%. Divergência aberta, não corrigida no rev03 nem por mim.
- Café verde: laudo (Herbaltec 5271) identifica a espécie como Coffea robusta; rótulo e Ficha Técnica declaram 'Coffea arabica L.'. Confirmado por leitura direta do laudo.
- Café verde: laudo mostra irradiação a 10 kGy (Sterigenics, certificado WO 3921468) e toda a microbiologia como 'ND' (não determinado) — nenhum dos dois fatos consta do rótulo, segundo o rev03.
- Colina: totalmente ausente da tabela de cálculo do rev02 (apesar de constar no rótulo); incluída pela primeira vez no rev03.
- Goma xantana (rev03, INS 415) × goma arábica (Ficha Técnica/memorial rev00, INS 414): são substâncias diferentes por número INS; os documentos não usam o mesmo nome para o que parece ser o mesmo papel de espessante. Não resolvido nesta leitura.
- Vitamina D3: o memorial rev00/FT-PRD-023 usa um insumo de potência 39.720.000 UI/g (lote AUTO038947, Lepuge); rev02 e rev03 usam um insumo de 115.000 UI/g (lote 91408, Analitic/INLAB). São matérias-primas diferentes entre revisões/documentos, não apenas doses diferentes do mesmo insumo.
- Vitamina B12: memorial rev00/FT-PRD-023 adota o lote 90955 explicitamente; rev02 diz adotar o lote 219376 mas calcula com o teor do lote 90955; rev03 adota e calcula corretamente com o lote 219376. Três posições diferentes em três documentos — ver comparacao_rev02_vs_rev03 para o detalhe.
- Bitartarato de colina: o laudo (INLAB, lote 91442) tem rodapé '1/2' mas o arquivo PDF só contém a página 1 (confirmado: minha leitura retornou 1 página só) — falta a folha de assinatura.
- Item 'sólidos por mL': o rev03 cita 'rótulo vigente = 382,96 mg' de sólidos por mL contra 'rev03 = 444,62 mg' (aumento de 16,1%). Recalculei a soma do rev03 (1.000,000 mg − 555,378 mg de água = 444,622 mg) e BATE. Já o valor de 382,96 mg do 'rótulo vigente' eu NÃO consegui reproduzir com exatidão a partir da Ficha Técnica/memorial rev00 (as somas que reconstruí a partir desses dois documentos ficaram entre ~332,65 mg e ~365,95 mg, dependendo de como se trata a massa do feno-grego, que é declarada em mL, não mg). PENDENTE — não é um dos 7 ativos; não recalculei além disso por não ser o foco desta tarefa.
- COMPARAÇÃO REV02 → REV03, INSUMO A INSUMO (o que mudou entre as duas revisões do memorial): Vitamina D3 (colecalciferol): rev02=17.39mg/115.000 UI/g (lote 91408) -> rev03=15.652mg/115.000 UI/g (lote 91408) — sim — mudou a massa/meta de dose (50→45 mcg, abrindo margem de segurança); o lote e o teor do laudo são os MESMOS nas duas revisões. || Vitamina B12 (metilcobalamina): rev02=0.0105mg/94.54 (lote 219376 (citado como adotado no texto, mas calculado com o teor do lote 90955)) -> rev03=0.010082mg/89.27 (lote 219376) — O NÚMERO DO LOTE NÃO MUDOU — 219376 em ambas as revisões. O QUE MUDOU foi o TEOR usado na conta: rev02 usou por engano 94,54% (teor do lote 90955, não adotado); rev03 usa corretamente 89,27% (teor do próprio lote 219376). A meta de dose também caiu de 9,94 para 9,0 mcg. || Cromo (picolinato de cromo): rev02=0.25mg/12.34 (lote 91190) -> rev03=0.25mg/12.34 (lote 91190) — não — massa, teor e lote idênticos nas duas revisões (30,85 mcg entregues nas duas). || Ácido clorogênico (café verde): rev02=33.3mg/53.86 (lote 10841) -> rev03=50.0mg/53.86 (lote 10841) — sim — massa subiu de 33,3 para 50,0 mg (mesmo lote/teor). Entrega subiu de 17,94 para 26,93 mg, mas segue ABAIXO do mínimo de 50 mg (agora 54% do mínimo, era 36%). || Colina (bitartarato de colina): rev02=Nonemg/None (lote None) -> rev03=33.3mg/40.61 (lote 91442) — sim — colina estava TOTALMENTE AUSENTE do cálculo/tabela do rev02 (só aparecia no rótulo). Incluída pela primeira vez no rev03, entregando 13,523 mg contra mínimo de 82,5 mg (16% do mínimo). || Curcumina (extrato de cúrcuma): rev02=33.3mg/0.42 (lote NPT.0425/580) -> rev03=80.0mg/0.42 (lote NPT.0425/580) — sim — massa subiu de 33,3 para 80,0 mg (mesmo lote/teor 0,42%). Entrega subiu de 0,14 para 0,336 mg, mas segue muitíssimo abaixo do mínimo de 80 mg (0,4% do mínimo). || Feno-grego (extrato/pó): rev02=33.0mg/None (lote AUTO9IVT) -> rev03=33.0mg/None (lote AUTO9IVT) — não mudou massa nem lote. O rev03 tornou EXPLÍCITO que o laudo não permite demonstrar entrega de nenhum ativo — o rev02 não destacava isso com a mesma clareza, embora o problema já existisse (mesmo laudo em ambas as revisões).
- RESUMO DE CONFORMIDADE DA REV03 CONTRA OS MÍNIMOS DA ANVISA — fonte dos limites: Painel oficial 'Constituintes Autorizados para Uso em Suplementos Alimentares' da ANVISA — conforme citado no próprio rev03 (não confirmado por mim em consulta separada ao painel; usei o valor que o documento diz ter lido de lá).; conforme com margem para alegação: Vitamina D (90% do teto máximo); Vitamina B12 (91% do teto máximo); Cromo (12% do teto máximo); abaixo do mínimo, sem alegação: Ácido clorogênico/café verde (54% do mínimo); Colina (16% do mínimo); Curcumina (0,4% do mínimo); sem doseamento de ativo: Feno-grego (laudo não quantifica nenhum ativo). Nota textual do próprio rev03: "Citação literal da aba 'Memorial de Cálculo Técnico': 'dos 7 constituintes ativos, 4 estão abaixo do mínimo (ácido clorogênico, colina, curcumina) ou sem doseamento (feno-grego). Só vitamina D, vitamina B12 e cromo sustentam alegação.' — ou seja, o PRÓPRIO REV03 (a versão corrigida) ainda reconhece 4 de 7 pendências de mínimo/doseamento; a correção do rev03 resolveu o erro de cálculo da B12 e a falta de margem de segurança de D3/B12, mas NÃO resolveu as 3 insuficiências de mínimo regulatório nem a falta de doseamento do feno-grego."
- Massa total por porção já calculada pelo agente de origem: declarada 1000.0mg, recalculada 1000.0mg (conferida nesta consolidação de forma independente, ver 'massa_total_mg'/'soma_fecha' deste registro).
- CONFERÊNCIA DE FECHAMENTO DE MASSA (feita nesta consolidação): Soma de TODOS os insumos+excipientes = 1000.0 mg; porção declarada ≈ 1000.0 mg; diferença +0.00 mg. Nenhum item ficou sem massa extraída.
- Porções por lote: 30
- Fontes secundárias conferidas: {"arquivo": "/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/10_SLIM-UP/MEMORIAL-CALCULO-SLIM-UP-rev02.docx", "revisao_data": "rev02 — 13/08/2026 (LIDO na Tabela 0 do próprio documento)", "resultado": "Fonte de comparação obrigatória. Ver comparacao_rev02_vs_rev03."} | {"arquivo": "/Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-SLIM-UP.docx", "revisao_data": "NÃO LEGÍVEL — o corpo do documento (parágrafos+tabelas via python-docx) não trouxe código/revisão/data; cabeçalho e rodapé do docx não foram inspecionados nesta leitura", "resultado": "Valores batem com a FÓRMULA ANTIGA/vigente (D=50 mcg, B12=9,94 mcg, Cr=30,85 mcg) — ou seja, ainda não reflete o rev03. Traz composição por frasco de 30 mL com 'goma arábica' (INS 414) em vez de 'goma xantana' (INS 415), e cita vitamina D3 a 1,5106 mg/frasco e B12 a 0,3006 mg/frasco — valores de massa muito diferentes dos usados no rev02/rev03 para os mesmos nutrientes-alvo, indicando insumo de potência distinta (ver observação sobre o memorial rev00/FT-PRD-023 abaixo)."} | {"arquivo": "/Users/diegofrancisco/Downloads/MEMORIAL-CALCULO-SLIM-UP.docx (idêntico por MD5 a /Users/diegofrancisco/Desktop/POPS/04_MEMORIAIS_CALCULO/MEMORIAL-CALCULO-SLIM-UP.docx — MD5 513e457a021d8f461e41710237730dd9 nas duas cópias, confirmado)", "revisao_data": "Código FT-PRD-023, Revisão 00 — 30/07/2026 (LIDO na Tabela 0)", "resultado": "Documento estrutural MAIS ANTIGO que o rev02/rev03, com base de cálculo diferente: usa vitamina D3 colecalciferol de potência 39.720.000 UI/g (lote AUTO038947, fornecedor Lepuge) — cerca de 345× mais concentrada que o insumo usado no rev02/rev03 (115.000 UI/g, lote 91408, fornecedor Analitic/INLAB) — e cita o lote de B12 90955 (Analitic, 99,2% base anidra) como o lote ADOTADO nesta revisão (não 219376). Ou seja: este documento não tem o erro do rev02 (não mistura teor de lotes), mas também não é comparável célula a célula com rev02/rev03 porque os insumos-base são outros. Não li cabeçalho/rodapé nem imagens embutidas (arquivo pesado por imagens anexadas)."} | {"arquivo": "4 variantes do xlsx em ~/Downloads: MEM-CALC-SLIMUP-rev03_Memorial_de_Calculo_PREENCHIDO.xlsx (fonte principal, MD5 b970a5e8e5be898302b790e4e1ddad8b) e MEM1-CALC-SLIMUP-rev03_Memorial_de_Calculo_PREENCHIDO.xlsx + '(1)' + '(2)' (as 3 idênticas entre si, MD5 d2dbd12cf8c10436871e4c3c651328ad)", "revisao_data": "rev03 — 14/09/2026 em todas as 4", "resultado": "As 3 variantes 'MEM1-CALC' são BYTE-IDÊNTICAS entre si (mesmo MD5). Comparando célula a célula com o arquivo-fonte principal 'MEM-CALC': todo o conteúdo (produto, insumos, massas, teores, lotes, rastreabilidade, divergências) é IDÊNTICO nas 5 abas. A ÚNICA diferença encontrada está na linha 'Total' da aba 'Sugestão de Memorial': no arquivo-fonte principal essa linha está com as células de soma vazias (fórmula sem valor em cache — openpyxl com data_only=True não recupera nada); nas 3 variantes 'MEM1-CALC' as mesmas células aparecem preenchidas com os totais já calculados pelo Excel (coluna D = 0,9999999999999999 g; sódio 0,266; vit. D 45; B12 9; cromo 30,85; ác. clorogênico 26,93; curcumina 0,336; colina 13,523). Recalculei manualmente somando as 15 linhas de insumos do arquivo-fonte principal e cheguei exatamente aos mesmos valores — ou seja, não há divergência de DADO, apenas de cache de fórmula do Excel (arquivo-fonte não tinha sido reaberto/recalculado no Excel antes de salvar)."} | {"arquivo": "12 laudos em PDF lidos diretamente (11 da pasta ~/Downloads/MEMORIAIS_2026 2/10_SLIM-UP/ARQUIVOS-PDF/ + 1 de Desktop/POPS/MEMORIAIS_2026/10_SLIM-UP/ARQUIVOS-PDF/08_laudo_metilcobalamina-B12_lote-219376.pdf)", "revisao_data": "datas de análise individuais — ver campo 'lote' de cada insumo acima", "resultado": "Todos os teores citados no rev03 para os 7 ativos + inulina + benzoato + sorbato + sorbitol foram CONFERIDOS diretamente no PDF de origem e bateram exatamente com o que o rev03 declara, com uma ressalva: o laudo do lote de B12 219376 (o ADOTADO no rev03) NÃO ESTÁ na pasta ARQUIVOS-PDF de Downloads — só existe na cópia equivalente em Desktop/POPS. A pasta de Downloads só tem o laudo do lote 90955 (o NÃO adotado). Não li o rótulo (30_ROTULO_SlimUp_2026.pdf, 9,4 MB) diretamente — me apoiei na transcrição feita pelo próprio rev03, que diz tê-lo lido 'na fonte em 14/09/2026'."}

---
## Produtos sem memorial nem ficha

Dos 24 produtos cobertos por este documento, cinco não têm memorial de cálculo próprio. A
situação real de cada um, depois da busca ampla desta sessão, é mais matizada do que um
simples "existe" ou "não existe":

| Produto | Memorial de cálculo | Ficha técnica da Lemoncaps | Dossiê técnico gerado | Situação final |
|---|---|---|---|---|
| `emagrecedor-em-capsula` | Não | **Sim** (sem laudo/lote/teor, sem tabela de fechamento) | Não | Tem ficha, não tem memorial. Conta não verificável para nenhum insumo. |
| `shot-colageno-300-gramas` | Não | **Sim**, mas em DUAS versões que não batem entre si (mesma data, formulações diferentes) | Sim (formulação diferente das duas fichas) | Três documentos, três fórmulas — nenhuma com laudo. Ver achado nº 7. |
| `melatonina-triptofanos-encapsulados` | Não | Não (existem fichas de OUTROS produtos/clientes com nome parecido) | Sim (única fonte diretamente associada ao produto do catálogo) | Só há números sem laudo; os outros dois documentos achados são de clientes diferentes (Capleev, Exclusiva Nutri) com fórmulas diferentes. |
| `omega-pro-tg` | Não | Não | Não | Nada encontrado. Só um certificado de matéria-prima em pó ("Nanomega 3") fisicamente incompatível com a forma softgel/TG do nome do produto. |
| `multi-vitta-gestante-e-lactante-em-capsula` | Não | Não | Não | Nada encontrado, de nenhum tipo. Produto real, vendido, para o público de maior sensibilidade (gestantes e lactantes), sem qualquer documento de composição no acervo consultado. |

Em nenhum dos cinco casos "sem memorial" foi aceito o silêncio como resposta: a busca
percorreu `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/` inteiro (16 memoriais, por
nome e por pasta), `/Users/diegofrancisco/Desktop/POPS/03_FICHAS_TECNICAS/` (38 arquivos) e
`04_MEMORIAIS_CALCULO/`, o `Downloads` inteiro por palavra-chave (nome do produto, sinônimos
como "gestante"/"lactante"/"prenatal"/"vitta", "melatonina"/"triptofano", "ômega"/"omega"),
e o próprio código-fonte do catálogo (`lemoncaps-catalogo/`) em busca de artefatos que
apontassem para um documento de composição. Para `multi-vitta-gestante-e-lactante-em-capsula`
e `omega-pro-tg`, a busca não teve nenhum resultado além de artefatos do próprio site
(imagem do produto, páginas geradas pelo Next.js) — nenhum documento de composição, de
qualquer tipo, existe no acervo consultado.

## Os 10 achados mais graves

Ordenados por risco — primeiro o que pode afetar a saúde do consumidor de forma direta ou
configurar publicidade enganosa, depois o que é falha de sistema de qualidade.

1. **Vitamina D rotulada com erro de mil vezes (NUVIART / `dores-musculares`).** O rótulo
   vigente declara a vitamina D como **"50 mg"** com **"1000% VD"**; o valor correto,
   confirmado pelo próprio cálculo do memorial (17,39mg de pó a 115.000 UI/g entregando
   corretamente ≈50mcg), é **50 MCG** — mil vezes menor. 50mg equivaleriam a 2.000.000 UI,
   contra as 2.000 UI reais da fórmula. O erro está isolado na tabela nutricional: a lista de
   ingredientes do mesmo rótulo já traz "colecalciferol 50mcg" corretamente. Correção urgente
   antes de qualquer impressão ou notificação nova.

2. **Três alergênicos de declaração obrigatória ausentes do rótulo (NUVIART /
   `dores-musculares`).** O certificado do colágeno tipo II (lote AUTO040251) declara
   expressamente "PODE CONTER LEITE, LACTOSE E PEIXE"; a glucosamina vem de crustáceos.
   Nenhum dos três alergênicos consta do rótulo vigente. O próprio memorial classifica isto
   como "a não conformidade mais grave deste produto" — risco de saúde real para consumidores
   alérgicos, não uma formalidade.

3. **Laudo de melatonina vencido há mais de 20 meses, usado para calcular um nutriente sem
   nenhuma margem de segurança (SERENA).** O certificado do lote 950151 venceu em
   09/12/2024 — é "o laudo mais antigo de toda a linha" segundo o próprio memorial, datado de
   dezembro de 2021. O teor de 99,5% desse laudo antigo é a base de TODO o cálculo da
   melatonina do produto, que já está no teto legal exato (0,21mg = 0,21mg máximo, sem
   margem nenhuma) — qualquer variação real de teor do lote atualmente em uso pode significar
   estar acima do limite de segurança sem que ninguém saiba.

4. **Regressão de conformidade documentada entre revisões (BIO-PRINCESS / `biotina-em-capsula`).**
   O selênio e o cobre foram corrigidos para fontes autorizadas pela ANVISA na revisão 01
   (13/08) — e a revisão 02 **reverteu os dois** para as fontes não autorizadas da revisão 00,
   mesmo lote. O próprio rev02 sinaliza o problema do selênio em vermelho no texto, mas não
   reverte a fórmula; o do cobre nem é sinalizado no rev02 (só uma planilha externa de
   14/09/2026 identifica os dois). Isto não é uma pendência estática: é uma correção real que
   foi desfeita.

5. **Padrão sistêmico de fórmulas que fisicamente não cabem na porção declarada.** Confirmado
   pelo próprio texto do memorial em três produtos: **Focus Colina** — os insumos ativos
   sozinhos somam 1.818,30mg para uma porção de 1.000mg (+81,8%); **Floravex** — 1.261,92mg
   para 1.000mg (+26,2%); **Nuviart** — 1.235,84mg para 1.000mg (+23,6%). Nos três casos o
   próprio documento admite o estouro e não deixa espaço nem para o antiumectante
   (dióxido de silício alocado a 0,00mg qualitativamente). Três produtos de uma linha de
   poucos memoriais lidos terem o mesmo problema estrutural sugere falha de processo de
   formulação, não acidente isolado.

6. **Creatina em goma: nenhuma confirmação analítica da dose real, e a soma de insumos já
   ultrapassa a porção (`creatina-gummy-sabor-frutas-vermelhas` e
   `creatina-em-gummy-sabor-tutti-frutti`).** A única análise de produto acabado (lote
   G20/1556) testa apenas microbiologia e glúten — nunca doseou creatina nem creatinina; os
   3.000mg declarados são inteiramente calculados a partir da matéria-prima, sem verificação
   independente no produto pronto, e o próprio memorial já recomendava esse doseamento sem
   tê-lo feito. Conferência desta consolidação: somando a creatina aos excipientes com massa
   conhecida (sorbitol, maltitol, gelatina etc.) chega-se a 7.662,30mg — 1.662,30mg (27,7%)
   acima da porção declarada de 6g, mesmo sem contar os itens ainda sem massa extraída
   (achado numérico desta auditoria, não uma frase do memorial original). O sabor
   tutti-frutti, adicionalmente, **não tem memorial próprio**: a dose de creatina foi
   replicada do memorial de frutas vermelhas por suposição do agente que extraiu os dados
   ontem, não por um documento específico desse sabor.

7. **Shot + Colágeno 300g: três documentos, três fórmulas incompatíveis, nenhuma com
   laudo.** A ficha "3 medidas" (POPS, 19/08/2026, coluna do pote de 300g) usa 7,548g de
   colágeno VERISOL de marca — mais de 3× a dose tipicamente estudada clinicamente para esse
   ingrediente — e declara zinco em 0,29mg; o dossiê técnico gerado (12/09/2026, provavelmente
   refletindo o cadastro atual) usa colágeno hidrolisado genérico a 8,4g, sem nenhum Verisol,
   e zinco em 1,65mg — quase 6 vezes mais. Uma terceira ficha (mesma data 19/08/2026, mas
   para um pote de 210g, tamanho diferente) usa ainda uma terceira combinação. Não existe
   memorial de cálculo com laudo/lote para esta linha.

8. **Três produtos reais e vendidos sem memorial de cálculo confiável — o mais grave deles
   para o público mais sensível.** `melatonina-triptofanos-encapsulados` e `omega-pro-tg` não
   têm memorial (o primeiro tem só um dossiê gerado sem laudo; o segundo não tem nada
   diretamente aplicável). O mais grave dos três é
   **`multi-vitta-gestante-e-lactante-em-capsula`**: nenhum documento de composição de
   qualquer tipo foi encontrado, para um produto destinado especificamente a gestantes e
   lactantes — o público que menos deveria depender de fórmula não documentada. Como achado
   à parte, do próprio cadastro do catálogo (não de um memorial, que não existe): o
   dióxido de silício está lançado com 592,14mg, quase 59% de uma cápsula de ~1g — implausível
   para um antiumectante.

9. **Cafeína anidra como insumo controlado pela Polícia Federal, com situação de licença não
   esclarecida (PRÉ-TREINO 300G / `pre-treino-300-g`).** O próprio memorial mais completo da
   família pré-treino (o único dos 9 documentos com laudo por lote e conversão sal→base)
   registra sua própria situação como **"Em análise — há pendências críticas"**: cafeína
   anidra é insumo controlado pela Polícia Federal e a licença não está esclarecida nos
   documentos consultados; beta-alanina sem certificado de análise; maltodextrina com
   certificado vencido desde 26/07/2026. São três pendências num só produto, uma delas de
   natureza regulatória federal, não apenas de qualidade.

10. **Cúrcuma entregando entre 0,4% e 0,7% do mínimo exigido pela ANVISA, tratada como
    ingrediente de destaque no texto comercial, e fontes de matéria-prima fora da lista
    autorizada repetidas em produtos diferentes.** O mesmo lote de extrato de cúrcuma
    (NPT.0425/580, 0,42% de curcumina) entrega 0,55mg no Detox e 0,49mg no Floravex contra um
    mínimo de 80–130mg (e mesmo a rev03 do Slim Up, que subiu a massa de propósito, chega só a
    0,4% do mínimo) — presença permitida, mas tecnicamente irrelevante, enquanto o texto de
    apresentação do rótulo do Detox coloca a cúrcuma como protagonista da fórmula e ainda
    anuncia **"RESVERATROL"**, que **não existe** na composição (mesmo texto reaproveitado no
    rótulo do Lidema). Em paralelo, o selênio quelato/glicinato (Valdequímica/Hebei Liwellso)
    aparece como fonte não autorizada pela ANVISA tanto no Bio Princess/Biotina em Cápsula
    quanto no Nuviart, e a L-teanina do Serena é de síntese química (Lepuge) quando o painel
    só autoriza a forma extraída de folhas de Camellia sinensis — sem substituto disponível no
    fornecedor atual da empresa. Padrão de homologação de matéria-prima repetido, não erro
    isolado.

