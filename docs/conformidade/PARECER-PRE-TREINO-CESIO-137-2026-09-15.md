# Parecer regulatório — Pré-treino + Creatina Sabor Limão (420 g) / "Pré-treino Césio 137"

**Data de emissão:** 15/09/2026
**Autor:** análise técnica de apoio, para entrega ao Responsável Técnico (RT) da Lemoncaps Indústria e Comércio Ltda e, quando indicado, ao fornecedor de guaraná
**Objeto:** avaliação de conformidade da fórmula e do rótulo do produto acima contra a IN 28/2018 (ANVISA) e a RDC 243/2018 (ANVISA), a partir do cadastro no banco de dados do catálogo, do rótulo real localizado nesta tarefa e dos documentos técnicos internos da fábrica disponíveis em `~/Downloads`.

> **Como ler este documento.** Cada número vem marcado com a procedência: **LIDO** (retirado diretamente de uma fonte, com identificação do documento e data), **CALCULADO** (obtido por conta aritmética simples a partir de números lidos, mostrada por extenso) ou **PENDENTE** (não confirmado nesta tarefa; não deve ser tratado como fato até confirmação). Nenhum número deste parecer foi suposto ou estimado por "valor típico de mercado".

---

## Resumo executivo

O selo de conformidade deste produto foi removido e, segundo o registro do projeto, não deve voltar até que os pontos abaixo sejam resolvidos. Esta tarefa **confirma as seis não conformidades do parecer preliminar de 14/09/2026**, corrige um detalhe factual dele (a denominação do guaraná no cadastro), e **localiza o rótulo real da gráfica** — que não estava no projeto e não havia sido encontrado até agora. Além disso, esta tarefa identifica um **sétimo problema, não descrito no parecer preliminar**: o rótulo real e o cadastro do banco declaram uma fórmula que diverge, em três insumos (L-arginina, cafeína anidra e extrato de guaraná), da ficha técnica de produção que a própria fábrica usa internamente para este SKU (420 g / 14 g / 30 doses), datada de 20/08/2026. Essa divergência muda o cálculo de cafeína total de forma decisiva e é, provavelmente, a pendência mais urgente a esclarecer com a fábrica.

Números-chave (todos com procedência detalhada abaixo):
- Soma dos 13 ativos declarados no rótulo/cadastro: **15.000,06 mg em uma porção de 14 g** (107,14% do peso da porção, antes de somar os 6 aditivos que o próprio rótulo lista).
- Oito insumos declarados **exatamente no teto legal** (100,00% do máximo, sem qualquer margem): creatina, beta-alanina, L-arginina, cafeína, magnésio, vitamina B3, vitamina B12 e vitamina D3.
- Cafeína total: **PENDENTE de laudo do lote de guaraná realmente usado** — os cenários calculados vão de 109% a 158% do limite diário, dependendo do teor de cafeína do guaraná e de qual das duas fórmulas (rótulo/cadastro ou ficha da fábrica de 20/08) está em vigor.

---

## 0. Metodologia e fontes consultadas nesta tarefa (15/09/2026)

| fonte | o que foi obtido | procedência |
|---|---|---|
| Banco de produção (`public.formulas`, filtro `slug=eq.pre-treino-creatina-sabor-limao-420g`) | registro completo do produto | Supabase, projeto `zjryrmqtumvaxdytvbbv`, consultado via REST (chave pública) em 15/09/2026, agora |
| Banco de produção (`public.formula_compositions`, filtro pelo `id` da fórmula acima) | 13 linhas de composição | idem, 15/09/2026 |
| `docs/CONTEXTO-COMPLETO-PARA-RETOMAR.md` (projeto `lemoncaps-catalogo`) | texto do parecer preliminar (seção 9) e achados correlatos (seções 7, 8, 10, 11) | arquivo do projeto, lido integralmente nesta tarefa; datado de 14/09/2026 |
| `docs/conformidade/LIMITES-ANVISA-POR-INSUMO.md` | tabela de limites por insumo e notas metodológicas | arquivo do projeto, levantamento de 13/09/2026, lido integralmente |
| `lemoncaps-catalogo-planejamento/conformidade-anvisa.md` (731 linhas) | Tabela 1 (limites, fonte AnvisaLegis + LegisWeb), Tabela 2 (veredito por fórmula — **não inclui este produto**, ver nota abaixo) | arquivo fora do projeto, auditoria de 12-13/09/2026, lido integralmente |
| `lemoncaps-catalogo-planejamento/teor-quelatos.md` | metodologia de conversão sal→elemento em quelatos (magnésio, zinco, boro) | arquivo fora do projeto, 12/09/2026, lido integralmente |
| `docs/conformidade/divergencias.md` e `composicoes_rotulo.json` | comparação cadastro × rótulo real de outros 15 produtos | arquivos do projeto, 13/09/2026 — **conferido nesta tarefa que nenhum dos dois cobre o produto aqui avaliado** (ver seção 1) |
| AnvisaLegis (IN 28/2018, texto consolidado) | confirmação ao vivo de limites de cafeína, creatina, e denominações autorizadas de guaraná | `https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true`, consultado por mim em 15/09/2026 |
| AnvisaLegis (RDC 243/2018) | **tentativa sem sucesso** — ver nota na seção 3 | tentado em 15/09/2026, mesma URL-padrão trocando o tipo do ato; a página retornou "Este ato está sendo processado" e não entregou texto |
| Painel oficial da ANVISA (Power BI) | não tentado nesta tarefa (já documentado como inacessível por ferramenta automatizada em 12/09/2026 — texto 100% renderizado em JavaScript) | **procedência: painel ANVISA consultado por outra sessão em 12-14/09/2026, não reconferido hoje** |
| ~70 arquivos "pré-treino" em `~/Downloads` | rótulo real da gráfica e fichas técnicas de produção (ver seção 1) | localizados e lidos nesta tarefa, 15/09/2026 |

**Nota sobre `conformidade-anvisa.md`:** este produto foi criado no banco em **14/09/2026 às 20:52:50 UTC** (campo `created_at`, lido ao vivo). A auditoria completa de 28 fórmulas em `conformidade-anvisa.md` foi feita em 12/09/2026 e **não inclui** "Pré-treino + Creatina Sabor Limão (420g)" — o produto não existia ainda. Da mesma forma, `divergencias.md` e `composicoes_rotulo.json` (13/09/2026) também são anteriores à criação deste produto. Por isso, os vereditos "CONFORME/NÃO VERIFICADO" desses documentos **não se aplicam** a este SKU — a conferência insumo a insumo da seção 2 abaixo foi feita **nesta tarefa, do zero**, usando a Tabela 1 de limites desses mesmos documentos (que continua válida, pois é sobre a norma, não sobre o produto).

---

## 1. Identificação do produto

| campo | valor | procedência |
|---|---|---|
| Nome no cadastro | Pré-treino + Creatina Sabor Limão (420 g) | banco, `formulas.name`, lido 15/09/2026 |
| Apelido interno | "Pré-treino Césio 137" | confirmado no nome dos arquivos de arte (`PRÉ TREINO_CÉSIO 137_420g.pdf`) e no caminho da imagem do produto no banco (`mockup_path = /produtos/pre-treino-cesio-137-420g-sem-fundo.webp`) |
| Slug | `pre-treino-creatina-sabor-limao-420g` | banco |
| ID interno | `36a54ecd-1a6b-4f32-9d84-2a3ca9e3b2c4` | banco |
| Porção | 14 g (1 dose, 1 medida dosadora) | banco e rótulo real, coincidentes |
| Peso líquido | 420 g | idem |
| Porções por embalagem | 30 | idem |
| Modo de uso declarado | Diluir 14 g em 200 mL de água, consumir 1 vez ao dia, preferencialmente antes do treino | idem |
| Preço de tabela | R$ 40,00 (`list_price_cents = 4000`) | banco |
| Pedido mínimo | 100 potes | banco |
| Criado em | 14/09/2026, 20:52:50 UTC | banco, `created_at` |
| Última atualização | 14/09/2026, 21:07:53 UTC | banco, `updated_at` |
| Selo de conformidade | `compliance_verified_at`, `compliance_norms` e `compliance_source` **vazios (null)** no registro atual | banco, lido ao vivo em 15/09/2026. `docs/CONTEXTO-COMPLETO-PARA-RETOMAR.md` (14/09/2026) descreve isso como "selo removido, não deve voltar" — cito as duas fontes sem reconciliar o mecanismo interno (é código/migration, fora do escopo desta análise) |

### O rótulo real da gráfica — localizado nesta tarefa

O enunciado desta tarefa informou que o rótulo oficial não está no projeto e pediu para procurá-lo em `~/Downloads`, avaliando a procedência de cada candidato. Fiz isso em duas etapas.

**Etapa 1 — os oito candidatos indicados e mais quatro que batiam por nome ("limão", "14g"), abertos e lidos por completo:**

| arquivo | o que é, de fato | é o rótulo deste produto? |
|---|---|---|
| `pre_treino_formula_maximo_permitido.pdf` | rascunho de 5 insumos (citrulina malato, beta-alanina, creatina, tirosina, magnésio), porção de 10 g, pote de 300 g, com a legenda "Quantidades Máximas Permitidas". Contém pelo menos um erro factual: chama 3.000 mg de creatina de "quantidade máxima diária reconhecida", quando 3.000 mg é o **mínimo** (o máximo, 5.000 mg, foi elevado pela IN 373/2025) | **Não.** Nem a porção (10 g), nem o peso (300 g), nem os insumos batem. É um rascunho anterior e, no que afirma sobre limites, está desatualizado |
| `formula_pre_treino_tecnica.pdf` | 14 insumos, porção de 10 g, com zinco (que não existe na fórmula deste produto) e corante amarelo crepúsculo (INS 110, diferente do corante tartrazina do produto real) | **Não.** Porção, zinco e corante não batem |
| `pre_treino_formula_corrigida_300g.pdf` | fórmula sem cafeína, com eletrólitos (sódio, potássio, cloreto), porção de 10 g, pote de 300 g | **Não.** Produto totalmente diferente (nem tem cafeína) |
| `PreTreino_Cafeina_200mg.pdf` | memorando de cálculo ("Ajuste de Cafeína"), sem porção nem peso de pote declarados, mostrando como combinar 150 mg de cafeína anidra com 224 mg de extrato de guaraná a 22,35% de cafeína para fechar 200 mg totais | **Não é rótulo** — é um documento de cálculo interno. É relevante como evidência de um teor de guaraná citado internamente pela fábrica (ver seção 4) |
| `Relatorio_BPF_PreTreino_COMPLETO_COM_FORMULACAO.pdf` | relatório genérico sobre RDC 275/2002, RDC 243/2018, IN 28/2018 e RDC 331/2019, mas **emitido para outro produto** ("ENZIMA PRÓ", uma fórmula de enzimas digestivas) | **Não.** O nome do produto avaliado no próprio documento é outro; é um modelo de relatório reaproveitado, útil só como referência genérica de normas |
| `FT-PRETREINO-001_Ficha_Tecnica_Pre_Treino_15g_Lemoncaps.docx` | ficha técnica/memorial de formulação, "dose única de 15 g", datada de 28/07/2026, assinada pelo RT Anderson C. Barbosa | **Não é este SKU** — porção de 15 g, não 14 g; é um antecessor histórico do produto (ver linha do tempo abaixo) |
| `FT-ROT-PRETREINO-001_Ficha_Tecnica_Rotulagem_PreTreino_Limao.docx` (duas cópias, conteúdo idêntico) | ficha técnica **para rotulagem**, "PRÉ-TREINO SABOR LIMÃO — POTE 450 G", 15 g por porção, Rev. 00, 28/07/2026, assinada pelo RT | **Não é este SKU** — pote de 450 g e porção de 15 g, não 420 g/14 g. É o antecessor direto do produto atual (mesmo sabor, embalagem diferente) e traz uma lista formal de pendências já identificadas pela própria fábrica em julho (ver seção 3) |
| `pre-treino com a mascara (1).pdf` | arte de rótulo real, pronta para gráfica, mas da marca **DAYON**, sabor **frutas vermelhas**, 300 g / 10 g por dose | **Não.** É rótulo genuíno, mas de outro produto — a mesma fábrica (CNPJ 55.836.075/0001-07) fabrica sob encomenda para outras marcas |
| `PRÉ TREINO WANESSA ZERO (1).pdf` | arte de rótulo real da marca **WEK CARE NUTRITION**, "Pré-treino Zero", sabor frutas vermelhas, 150 g / 5 g por dose, zero cafeína | **Não.** Outro produto, outra marca, mesma fábrica |
| `FRM-PRETREINO-14G-001_Formulas_Pre_Treino_Com_e_Sem_Creatina.pdf` | ficha técnica de produção interna, "MC-PRD-PRETREINO-14G-001 · Revisão 02 — 20/08/2026", porção de 14 g, pote de 420 g, 30 doses | **Não é o rótulo** — é a ficha técnica de fabricação (documento interno, sem advertências, sem informação nutricional em %VD). Mas é o SKU certo (420 g/14 g). Comparado em detalhe na seção 3 (achado adicional) |
| `OP_528_Pre_Treino_Limao_4_Potes.pdf` | ordem de produção real, 20/07/2026, cliente "Ingridy Taques", pote de 450 g, dose de 15 g | **Não é este SKU** — mesma família de antecessor (450 g/15 g) |
| `lemoncaps-producao/OP-pretreino-14g-2026-08-25.pdf` | ordem de produção, 25/08/2026, "Baseado na ficha técnica MC-PRD-PRETREINO-14G-001 · Revisão 02", pote de 420 g, dose de 14 g, sabores Limão e Maracujá | **Não é o rótulo** — é ordem de produção interna. Mesma fórmula da ficha técnica de 20/08, comparada na seção 3 |

**Etapa 2 — busca por conteúdo (Spotlight), não só por nome de arquivo.** A busca inicial por nome de arquivo (`find -iname '*pre*treino*'`) **não encontrou** o rótulo real, porque o nome do arquivo usa "PRÉ" com acento (Unicode "É"), que não é equivalente a "pre" sem acento nem em busca sem diferenciar maiúsculas/minúsculas — um detalhe técnico que teria deixado o rótulo real sem ser encontrado se a busca tivesse parado aí. Repeti a busca por conteúdo (`mdfind`) pelo apelido interno "Césio", o que localizou:

> **`/Users/diegofrancisco/Downloads/PRÉ TREINO_CÉSIO 137_420g.pdf`**

Este é um arquivo de arte de rótulo pronto para gráfica: traz margens de corte, margem de segurança, especificação de material ("Rótulo adesivo BOPP metalizado, 270mm x 90mm"), código de cor (#009eff, preto, branco), logotipo "LEMONCAPS" e o texto integral do rótulo (informação nutricional, lista de ingredientes, composição por porção, modo de uso, advertências, dados do fabricante). O metadado de criação do arquivo (`kMDItemContentCreationDate`, lido via `mdls`) é **28/05/2026** — um metadado do arquivo, não necessariamente a data de aprovação final da arte pela gráfica.

**Conferi, item a item, que o texto deste rótulo bate 100% com os campos do banco** (`ingredients_list`, `warnings`, `nutritional_info`, e as 13 linhas de `formula_compositions`, inclusive nos valores que mais chamam atenção: L-arginina 3,810 g, cafeína anidra 200 mg, extrato de guaraná 515 mg). Isso é forte evidência de que **este PDF é a fonte que foi transcrita para o cadastro** (ou vice-versa) — os dois documentos concordam entre si, palavra por palavra e número por número. Por isso, trato `PRÉ TREINO_CÉSIO 137_420g.pdf` como **o rótulo real deste produto**, e é ele que confirmo contra a norma na seção 2.

O mesmo arquivo traz, numa segunda página, uma arte-irmã ("PRÉ TREINO CÉSIO 137, 150g, SEM SABOR") sem tabela nutricional preenchida — parece um gabarito de outra apresentação da mesma linha, não avaliado aqui por não ser o produto em questão. Há também uma versão sabor Maracujá do mesmo produto de 420 g (`PRÉ TREINO_CÉSIO 137_420gMARACUJÁ CURVAS.pdf` e o arquivo-fonte `.ai`), fora do escopo desta tarefa (que é sobre o sabor Limão), mas relevante para o dono saber que existe — se a fórmula for corrigida, a versão Maracujá provavelmente precisa da mesma correção, pois a ordem de produção de 25/08/2026 trata os dois sabores como "mesma base, só troca o flavorizante".

---

## 2. Composição cadastrada, insumo a insumo, contra os limites da IN 28/2018

Fonte da coluna "declarado": banco (`formula_compositions`) e rótulo real (`PRÉ TREINO_CÉSIO 137_420g.pdf`) — **idênticos em todos os 13 itens**, conferido nesta tarefa. Fonte da coluna "limite ANVISA": Tabela 1 de `conformidade-anvisa.md` (12/09/2026), cruzada com `LIMITES-ANVISA-POR-INSUMO.md` (13/09/2026) — ambos citam como fonte primária o texto consolidado da IN 28/2018 no AnvisaLegis, cruzado com LegisWeb. Reconfirmei ao vivo, nesta tarefa (15/09/2026), os valores de cafeína e creatina diretamente no AnvisaLegis. Faixa etária: adultos ≥ 19 anos, coerente com `target_audience` do produto.

| # | Insumo (nome do cadastro/rótulo) | Declarado | Mínimo ANVISA | Máximo ANVISA | Razão dose/máximo | No teto? |
|---|---|---|---|---|---|---|
| 1 | Creatina monohidratada | 5.000 mg | 3.000 mg | **5.000 mg** | 5.000 / 5.000 = **100,00%** | **SIM** |
| 2 | Beta-alanina | 2.000 mg | não confirmado na fonte (provável NE) | **2.000 mg** | 2.000 / 2.000 = **100,00%** | **SIM** |
| 3 | L-arginina | 3.810 mg | NE (não estabelecido) | **3.810 mg** | 3.810 / 3.810 = **100,00%** | **SIM** |
| 4 | Taurina | 1.000 mg | NE | 2.000 mg | 1.000 / 2.000 = 50,00% | Não |
| 5 | L-tirosina | 1.000 mg | 262,5 mg (mínimo combinado com fenilalanina) | 2.750 mg | 1.000 / 2.750 = 36,36% | Não |
| 6 | L-carnitina | 1.000 mg | NE | 2.000 mg | 1.000 / 2.000 = 50,00% | Não |
| 7 | Cafeína anidra | 200 mg | 75 mg | **200 mg** | 200 / 200 = **100,00%** (sozinha, antes do guaraná) | **SIM** |
| 8 | Extrato de guaraná (*Paullinia cupana*) | 515 mg | sem limite de massa próprio | sem limite de massa próprio | é fonte adicional do nutriente "cafeína" (Anexo I) — ver seção 4 | — |
| 9 | Magnésio (de bisglicinato de magnésio) | 350 mg | 63 mg | **350 mg** | 350 / 350 = **100,00%** | **SIM**¹ |
| 10 | Vitamina B3 (niacinamida) | 35 mg | 2,4 mg | **35 mg** | 35 / 35 = **100,00%** | **SIM** |
| 11 | Vitamina B6 (cloridrato de piridoxina) | 90 mg | 0,26 mg | 98,60 mg | 90 / 98,60 = 91,28% | Não² |
| 12 | Vitamina B12 (metilcobalamina) | 9,94 mcg | 0,36 mcg | **9,94 mcg** | 9,94 / 9,94 = **100,00%** | **SIM** |
| 13 | Vitamina D3 (colecalciferol) | 50 mcg | 3 mcg | **50 mcg** | 50 / 50 = **100,00%** | **SIM** |

**Soma dos 13 itens (CALCULADO nesta tarefa, a partir das quantidades acima): 15.000,05994 mg ≈ 15.000,06 mg = 15,00006 g**, contra uma porção declarada de 14 g — **107,14% do peso da porção**, e isso antes de somar os seis aditivos que o próprio rótulo declara (aroma de limão, ácido cítrico INS 330, sucralose INS 955, dióxido de silício INS 551 e corante tartrazina INS 102 — nenhum deles com quantidade própria no cadastro).

¹ **Ressalva sobre o magnésio, não presente no parecer preliminar.** O cadastro nomeia o insumo como "magnésio (de bisglicinato de magnésio)" — pela convenção que o próprio catálogo usa em outros produtos (nome do elemento, forma química entre parênteses), isso indica que 350 mg já seria magnésio elementar, não peso do sal. Mas o documento `teor-quelatos.md` (12/09/2026), ao investigar exatamente este mesmo insumo (bisglicinato de magnésio) usado em outro produto do catálogo (ZMA), encontrou um laudo de fábrica com teor de **30,38% de magnésio elementar** — ou seja, se os "350 mg" deste produto forem, na realidade, peso do **sal** (não do elemento), a massa de magnésio elementar seria de apenas ~106 mg (30,3% do teto), longe de estar no limite. Não tenho, nesta tarefa, o laudo do lote de bisglicinato de magnésio usado especificamente nesta fórmula — **PENDENTE**: confirmar com o fornecedor/fábrica se os 350 mg são elementares (aí está exatamente no teto) ou são peso do sal (aí está bem abaixo). Trato a linha acima como "no teto" seguindo a convenção de nomenclatura do próprio cadastro, mas registro a dúvida por escrito, como manda a regra da exatidão.

² **Vitamina B6 — nota sobre método de cálculo.** A ficha técnica de rotulagem do antecessor deste produto (`FT-ROT-PRETREINO-001`, 28/07/2026) converte cloridrato de piridoxina em piridoxina livre (fator 0,8228) antes de calcular o %VD, e havia sinalizado como "CRÍTICA" uma dose de 50 mg de cloridrato nessa conversão — mas o %VD (referência de rotulagem da IN 75/2020) é uma base de cálculo diferente do teto do Anexo IV (98,60 mg), e não é a mesma coisa. Usando o teto do Anexo IV diretamente contra a massa declarada (convenção usada em toda a Tabela 2 de `conformidade-anvisa.md`, sem conversão), 90 mg está em 91,28% — não no teto. Mesmo aplicando o fator 0,8228 (90 × 0,8228 ≈ 74,05 mg de piridoxina livre), o resultado (74,05/98,60 = 75,1%) também fica abaixo do teto. Nas duas convenções, B6 não é um problema de limite — mas note-se, no rótulo real, o próprio print traz "VITAMINA B6 ... 6.923% VD", um número que salta aos olhos de qualquer fiscal ou consumidor mesmo não sendo, por si, prova de estouro do Anexo IV.

---

## 3. Não conformidades — evidência, norma, gravidade e o que resolve

### NC1 — Cafeína total provavelmente acima do limite diário

**Evidência:** rótulo real e cadastro declaram 200 mg de cafeína anidra (100% do limite, sozinha) **mais** 515 mg de extrato de guaraná — fonte adicional do mesmo nutriente regulado.
**Norma:** IN 28/2018, Anexo I (guaraná como fonte autorizada de cafeína) e Anexos III/IV (cafeína: 75–200 mg/dia, adultos). Reconfirmado por mim, ao vivo, no AnvisaLegis em 15/09/2026: tanto "Guaraná em pó" quanto "Extrato fluido de guaraná" (esta incluída pela IN 450/2026) constam como fontes de cafeína.
**Gravidade: CRÍTICA.** O valor exato depende do teor de cafeína do guaraná — **PENDENTE de laudo** (ver cálculo de cenários na seção 4). Mas em qualquer cenário com teor de cafeína maior que zero no guaraná, o total ultrapassa ou encosta no teto que a cafeína anidra sozinha já esgota.
**O que resolve:** obter o laudo do lote de guaraná realmente em uso (teor de cafeína) e, se necessário, reformular reduzindo a cafeína anidra e/ou a quantidade de guaraná, de modo que a soma das duas fontes nunca ultrapasse 200 mg/dia.

### NC2 — Beta-alanina em tomada única de 2.000 mg

**Evidência:** modo de uso do rótulo real ("consumir 1 vez ao dia") com 2.000 mg de beta-alanina na mesma dose de 14 g.
**Norma:** citada em `docs/CONTEXTO-COMPLETO-PARA-RETOMAR.md` (14/09/2026) como uma condição do Anexo VI da IN 28/2018, exigindo fracionamento em doses de no máximo 300 mg com 2 horas de intervalo. **Tentei reconfirmar isso na fonte primária hoje** (AnvisaLegis, 15/09/2026): o texto retornado pela consulta cobriu até o Anexo V e não alcançou o Anexo VI. **Não consegui confirmar o texto literal desta condição na fonte primária nesta tarefa** — permanece **PENDENTE** de conferência direta (navegador humano no portal da ANVISA, ou confirmação do RT, que deve ter acesso ao texto integral).
**Gravidade: ALTA**, condicionada à confirmação acima. Vale notar que essa condição, se confirmada, afeta o produto **independentemente** de qual fórmula estiver em vigor (rótulo/cadastro ou ficha da fábrica de 20/08 — ver NC7): as duas usam 2.000 mg de beta-alanina em dose única.
**O que resolve:** confirmar o texto exato do Anexo VI com o RT. Se confirmado, o produto precisa ou fracionar as instruções de uso (múltiplas tomadas ao longo do dia) ou reduzir a dose de beta-alanina por tomada — qualquer uma das duas muda a proposta do produto como "pré-treino de dose única".

### NC3 — Oito insumos exatamente no teto, sem margem de fabricação

**Evidência:** calculado na seção 2 — creatina, beta-alanina, L-arginina, cafeína, magnésio, vitamina B3, vitamina B12 e vitamina D3 batem, cada um, 100,00% do respectivo máximo do Anexo IV.
**Norma:** IN 28/2018, Anexos III/IV, por insumo.
**Gravidade: MÉDIA-ALTA.** Estar no teto não é, por si, ilegal — mas não sobra nenhuma margem para a variação normal de pesagem/processo entre lotes (a prática de "overage" para compensar perda é comum na indústria e, aqui, qualquer overage nesses oito insumos gera estouro).
**O que resolve:** reformular com folga de segurança abaixo do teto nesses oito insumos, ou comprovar por múltiplos lotes analisados que a variação de processo fica em zero overage — o que é difícil de sustentar na prática.

### NC4 — Advertência mais fraca que a norma

**Evidência:** o rótulo real diz "Este produto não é recomendado para crianças, gestantes, lactantes e pessoas sensíveis à cafeína."
**Norma:** citada em `CONTEXTO-COMPLETO-PARA-RETOMAR.md` (14/09/2026) como Anexo VI, que exigiria a redação "não deve ser consumido por gestantes, lactantes e crianças". **Mesma ressalva da NC2**: tentei reconfirmar o texto exato do Anexo VI hoje e não consegui (a consulta não alcançou esse anexo). **PENDENTE** de confirmação direta.
**Gravidade: ALTA** — rotulagem de advertência é ponto sensível de fiscalização, e a redação mais fraca se repete, de forma idêntica, na ficha técnica de rotulagem do antecessor do produto (`FT-ROT-PRETREINO-001`, 28/07/2026: "NAO RECOMENDADO PARA GESTANTES, LACTANTES, CRIANCAS..."), sugerindo que é um problema de modelo/template usado pela fábrica, não um erro isolado deste produto.
**O que resolve:** confirmar o texto exato do Anexo VI e corrigir a frase na arte (e, provavelmente, no modelo padrão de ficha de rotulagem da fábrica, para não se repetir em outros produtos com cafeína).

### NC5 — Denominação do guaraná não corresponde às formas autorizadas

**Evidência:** o rótulo real e o cadastro dizem, os dois, **"extrato de guaraná"** (sem qualificador).

> **Correção ao parecer preliminar de 14/09/2026:** aquele parecer afirmava que o cadastro dizia "guaraná em pó". Reconferi, hoje, diretamente no PDF do rótulo real e na tabela `formula_compositions` do banco — **nenhum dos dois** usa essa expressão; os dois dizem "extrato de guaraná". A ficha técnica de produção da fábrica (`FRM-PRETREINO-14G-001`, 20/08/2026) usa uma **terceira** denominação: "guaraná extrato seco". Registro a correção porque a regra da exatidão exige isso — o achado de fundo (a denominação usada não é nenhuma das autorizadas) continua de pé, só que com os nomes certos.

**Norma:** IN 28/2018, Anexo I, autoriza "Guaraná em pó (*Paullinia cupana*)" e "Extrato fluido de guaraná" (esta última incluída pela IN 450/2026) — confirmado ao vivo no AnvisaLegis nesta tarefa (15/09/2026). Nem "extrato de guaraná" (sem "fluido"), nem "guaraná extrato seco" correspondem, ao pé da letra, a nenhuma das duas denominações autorizadas — e um "extrato fluido" (líquido) não faz sentido físico num produto em pó, o que sugere que o insumo realmente usado é sólido (pó integral ou extrato seco), tornando "guaraná em pó" a denominação mais provavelmente correta, mas isso precisa ser confirmado com o fornecedor.
**Gravidade: MÉDIA.**
**O que resolve:** confirmar com o fornecedor a forma física exata do insumo e corrigir a denominação no rótulo e no cadastro para o termo que a IN 28/2018 realmente autoriza (ver texto pronto na seção 5).

### NC6 — A soma da fórmula (15.000,06 mg) não cabe na porção declarada (14 g)

**Evidência:** calculado na seção 2. 15.000,06 mg de ativos declarados numa porção de 14.000 mg — **antes** de somar os seis aditivos que o próprio rótulo lista (aroma de limão, ácido cítrico, sucralose, dióxido de silício, tartrazina — nenhum quantificado no cadastro).
**Norma:** não é um limite específico de um insumo — é uma exigência geral de veracidade da informação nutricional e da composição por porção (RDC 243/2018).
**Gravidade: CRÍTICA** — indica que a fórmula, como está escrita hoje no rótulo e no cadastro, não é fisicamente executável dentro da porção declarada.
**O que resolve:** ver NC7 abaixo — a própria fábrica já tem, desde 20/08/2026, uma ficha técnica que fecha exatamente em 14.000 mg. A questão é reconciliar essa ficha com o que está impresso no rótulo.

### NC7 — Achado adicional desta tarefa: o rótulo/cadastro diverge da ficha técnica de produção da fábrica

Este ponto **não constava do parecer preliminar de 14/09/2026** e foi encontrado comparando, insumo a insumo, o rótulo real (`PRÉ TREINO_CÉSIO 137_420g.pdf`) contra a ficha técnica de produção da própria Lemoncaps para este exato SKU — `FRM-PRETREINO-14G-001_Formulas_Pre_Treino_Com_e_Sem_Creatina.pdf` ("MC-PRD-PRETREINO-14G-001 · Revisão 02 — 20/08/2026") — e contra a ordem de produção derivada dela, de 25/08/2026.

| Insumo | Rótulo real / cadastro (28/05/2026\*) | Ficha técnica da fábrica, Rev. 02 (20/08/2026) |
|---|---|---|
| L-arginina | 3.810 mg | **1.000 mg** |
| Cafeína anidra | 200 mg | **150 mg** |
| Guaraná | 515 mg ("extrato de guaraná") | **224,5 mg** ("guaraná extrato seco") |
| Todos os outros 10 insumos | idênticos | idênticos |
| Soma da porção | 15.000,06 mg | **14.000,00 mg** (fecha exato) |

\* data do metadado do arquivo do rótulo, não confirmada como data de aprovação da arte.

**Linha do tempo reconstruída a partir das datas dos próprios arquivos** (CALCULADO/observado por mim, cruzando metadados e conteúdo — não é algo que os documentos afirmam explicitamente sobre si mesmos, por isso trato como reconstrução, não como fato confirmado por quem escreveu os documentos):

1. **28/05/2026** (data do arquivo) — arte do rótulo `PRÉ TREINO_CÉSIO 137_420g.pdf`: cafeína anidra 200 mg + guaraná 515 mg + arginina 3.810 mg.
2. **28/07/2026** — ficha técnica do antecessor de 450 g/15 g (`FT-PRETREINO-001`, `FT-ROT-PRETREINO-001`) e ordem de produção `OP_528` (20/07/2026): já um design diferente, com cafeína 150 mg + guaraná ~224 mg.
3. Documento sem data própria, `PreTreino_Cafeina_200mg.pdf` ("Ajuste de Cafeína"): mostra a conta 150 mg + (224 mg × 22,35%) ≈ 200 mg — o raciocínio por trás do design do item 2.
4. **20/08/2026** (Rev. 02) e **24/08/2026** (Rev. 00, versão sem creatina) — `FRM-PRETREINO-14G-001`: já no formato 420 g/14 g deste produto, repete cafeína 150 mg + guaraná 224,5 mg + arginina 1.000 mg, fechando exato em 14.000 mg.
5. **25/08/2026** — `OP-pretreino-14g-2026-08-25.pdf`: ordem de produção real, citando explicitamente a ficha do item 4 como base, para um lote de 22 potes de 420 g sabor Limão (e 22 de Maracujá).
6. **14/09/2026, 20:52 UTC** — produto criado no banco do catálogo com os números do rótulo do item 1 (200 mg / 515 mg / 3.810 mg), não os da ficha de produção dos itens 4–5.

**Hipótese, explicitamente marcada como tal (não é fato confirmado):** é possível que a fábrica tenha identificado e corrigido o problema de excesso de cafeína internamente, entre julho e agosto, chegando ao design 150 mg + 224,5 mg que fecha certinho em 14 g — e que, na hora de cadastrar o produto no novo sistema em 14/09, alguém tenha usado o arquivo de rótulo mais antigo (28/05) em vez da ficha técnica já corrigida (20/08). Se essa hipótese estiver certa, o produto **fisicamente fabricado** pode estar mais próximo da conformidade do que o rótulo e o cadastro sugerem — mas isso só a fábrica pode confirmar.
**Gravidade: CRÍTICA**, porque sem saber qual documento está em vigor, não é possível concluir se o produto real tem ou não excesso de cafeína, nem se o rótulo impresso corresponde ao que sai da linha de produção.
**O que resolve:** perguntar diretamente à fábrica/RT qual ficha está em vigor hoje para este SKU (texto pronto na seção 5).

**Uma pista adicional sobre a arginina:** o documento `divergencias.md` (13/09/2026), ao comparar outros 15 produtos do catálogo, já havia notado um padrão: "os valores divergentes do cadastro repetem os tetos máximos da ANVISA... e não as quantidades realmente formuladas." Os 3.810 mg de arginina no rótulo/cadastro deste produto **são exatamente o teto legal do Anexo IV** para esse aminoácido — o mesmo padrão. Isso é coerente com a hipótese acima (a ficha da fábrica, com 1.000 mg, seria a dose realmente pretendida) mas não a prova — cafeína (200 mg) também bate com o teto legal exato, e pode ser tanto um design intencional no limite quanto o mesmo padrão de erro. Já o guaraná (515 mg) **não corresponde a nenhum teto conhecido** — não se encaixa nesse padrão específico, então sua origem não tem, por ora, uma explicação além de "documento diferente".

---

## 4. Cálculo da cafeína total — cenários

Cafeína anidra é fixa em 200 mg no rótulo/cadastro (150 mg na ficha da fábrica de 20/08). A cafeína adicional vem do teor de cafeína do guaraná, que não está declarado em nenhum documento desta tarefa com laudo de lote identificado — **o valor real é PENDENTE de laudo do fornecedor**. Os cenários abaixo mostram a conta com os teores citados nos documentos disponíveis, para dimensionar o problema, não para afirmar o valor real.

| Cenário | Cafeína anidra | Massa de guaraná | Teor de cafeína do guaraná | Cafeína do guaraná (calculado) | Cafeína total (calculado) | % do limite de 200 mg |
|---|---|---|---|---|---|---|
| A — piso de doseamento de 3,5% citado no enunciado desta tarefa | 200 mg | 515 mg (rótulo/cadastro) | 3,5% — **NÃO CONFIRMADO NA FONTE.** Tentei localizar esse piso na especificação do Anexo I da IN 28/2018 via AnvisaLegis nesta tarefa (15/09/2026) e não encontrei essa cifra no texto retornado. Uso o número apenas porque foi apontado no enunciado, deixando claro que não é um valor que eu conferi na norma | 515 × 0,035 = 18,03 mg | 200 + 18,03 = **218,03 mg** | **109,0%** |
| B — teor de 22,35%, citado em `PreTreino_Cafeina_200mg.pdf` (arquivo local, sem nome de fornecedor, lote ou data do laudo original — citação de segunda mão dentro de um memorando interno) | 200 mg | 515 mg (rótulo/cadastro) | 22,35% | 515 × 0,2235 = 115,10 mg | 200 + 115,10 = **315,10 mg** | **157,55%** |
| C — mesmo teor de 22,35%, aplicado à fórmula da ficha técnica da fábrica de 20/08/2026 (não à do rótulo) | 150 mg | 224,5 mg | 22,35% | 224,5 × 0,2235 = 50,18 mg | 150 + 50,18 = **200,18 mg** | **100,1%** |

**Leitura dos três cenários:** com o teor de 22,35% citado internamente pela fábrica (cenário B), a fórmula do rótulo/cadastro excede o limite em quase 60%. A mesma fábrica, usando o mesmo teor mas a fórmula de agosto (cenário C), fecha praticamente exato no teto (100,1%, diferença de 0,18 mg irrelevante). Mesmo com o piso hipotético de 3,5% (cenário A, não confirmado na norma), a fórmula do rótulo ainda excede em 9%. **Em nenhum cenário testado a fórmula do rótulo/cadastro fica dentro do limite** — a única combinação que fecha é a fórmula de agosto com o teor de 22,35%.

**O que está PENDENTE, por escrito:**
- O piso de doseamento de 3,5% mencionado no enunciado desta tarefa **não foi confirmado por mim na fonte primária hoje**. Não decorre disso que o piso não exista — o texto integral do Anexo I é extenso e a ferramenta de consulta usada pode ter deixado de fora a linha específica do guaraná; apenas não consegui localizá-la.
- O teor de 22,35% vem de um documento interno sem identificação do laudo, do fornecedor, do lote ou da data do ensaio.
- Não há, em nenhum documento desta tarefa, o Certificado de Análise do lote de guaraná efetivamente em estoque ou em uso para este produto.
- Não está resolvido qual das duas fórmulas (rótulo/cadastro ou ficha de 20/08) é a que está de fato em produção hoje.

Nenhuma dessas quatro lacunas deve ser preenchida com um valor plausível — cada uma delas é uma pergunta a fazer, por escrito, ao fornecedor ou à fábrica (textos prontos na seção 5).

---

## 5. Textos prontos

### 5.1 Pedido ao fornecedor de guaraná

> Prezados,
>
> Para fins de conformidade regulatória (IN 28/2018 – ANVISA) do produto "Pré-treino + Creatina Sabor Limão", solicitamos o envio dos seguintes documentos e informações referentes ao guaraná (*Paullinia cupana*) fornecido para a Lemoncaps Indústria e Comércio Ltda:
>
> 1. Certificado de Análise (laudo) do(s) lote(s) atualmente em estoque e/ou reservado(s) para este produto, contendo:
>    a. Teor de cafeína, em percentual (% p/p), com o método analítico utilizado (ex.: HPLC) e a data do ensaio;
>    b. Denominação exata e completa do produto entregue — especificar se é pó integral da semente ("guaraná em pó"), extrato seco ("extrato seco de guaraná", com indicação da relação de concentração, ex.: 4:1) ou extrato fluido líquido ("extrato fluido de guaraná");
>    c. Nome botânico completo e parte da planta utilizada;
>    d. Número do lote, data de fabricação e data de validade;
>    e. Nome, CNPJ e responsável técnico do fabricante/fornecedor que assina o laudo.
> 2. Confirmação, por escrito, de que a denominação declarada no laudo corresponde a uma das formas autorizadas pela IN 28/2018 (Anexo I) como fonte de cafeína: "Guaraná em pó (*Paullinia cupana*)" ou "Extrato fluido de guaraná".
>
> Esta informação é indispensável para o cálculo do teor total de cafeína do produto acabado e para a liberação regulatória do lote.
>
> Atenciosamente,
> [nome / cargo / Lemoncaps Indústria e Comércio Ltda]

### 5.2 Pedido à fábrica (produção/RT)

> Prezado Anderson,
>
> Ao revisar a documentação do "Pré-treino + Creatina Sabor Limão (420 g)" (apelido interno "Pré-treino Césio 137"), encontramos duas versões de fórmula que não coincidem para este mesmo SKU (pote de 420 g, porção de 14 g, 30 doses):
>
> 1. O rótulo `PRÉ TREINO_CÉSIO 137_420g.pdf` e o cadastro do catálogo, que declaram: cafeína anidra 200 mg, extrato de guaraná 515 mg e L-arginina 3.810 mg por dose — soma total de 15.000,06 mg de ativos numa porção de 14.000 mg.
> 2. A ficha técnica de produção "MC-PRD-PRETREINO-14G-001, Revisão 02, de 20/08/2026" (e a ordem de produção de 25/08/2026 baseada nela), que declaram: cafeína anidra 150 mg, guaraná extrato seco 224,5 mg e L-arginina 1.000 mg — soma total de exatamente 14.000 mg, batendo com a porção declarada.
>
> Precisamos que você confirme:
>
> 1. Qual das duas fórmulas está em vigor hoje para este produto, e desde quando;
> 2. Se for a ficha de 20/08, precisamos de uma nova arte de rótulo com os valores corretos (e o cadastro do catálogo também precisa ser corrigido);
> 3. Se for o rótulo já impresso, precisamos entender por que a ficha técnica de produção usa valores diferentes, e reformular a fórmula para que a soma feche na porção de 14 g;
> 4. Em qualquer um dos dois casos, precisamos do memorial de cálculo assinado por você (RT) para a fórmula que ficar valendo, incluindo os seis aditivos (maltodextrina, ácido cítrico, aroma de limão, dióxido de silício, sucralose, tartrazina) com suas quantidades, já que hoje eles aparecem na lista de ingredientes mas não estão quantificados no cadastro;
> 5. O laudo do lote de guaraná efetivamente em uso (teor de cafeína) — já solicitamos isso também diretamente ao fornecedor (texto em anexo);
> 6. Esclarecimento sobre o regime de uso da beta-alanina (2.000 mg em dose única) frente à condição de fracionamento do Anexo VI da IN 28/2018, que não conseguimos confirmar no texto integral da norma nesta consulta;
> 7. A forma física exata do guaraná utilizado (pó integral, extrato seco ou extrato fluido), para corrigirmos a denominação no rótulo.
>
> Pedimos que nenhuma nova arte deste produto seja aprovada antes dessas confirmações, e que o selo de conformidade continue suspenso até a resposta.
>
> Atenciosamente,
> [nome / cargo]

---

## 6. Decisões que cabem ao Responsável Técnico (não decididas aqui)

1. Qual das duas fórmulas (rótulo/cadastro de 28/05, ou ficha de produção de 20/08/2026) deve prevalecer, e como reconciliar cadastro, rótulo e produção real.
2. Se, confirmado o teor de cafeína do guaraná, a fórmula precisa ser reformulada — e em que proporção reduzir cafeína anidra e/ou guaraná.
3. Se a condição de fracionamento da beta-alanina (Anexo VI, pendente de confirmação textual) é aplicável e, se for, se o conceito de "dose única diária" deste produto ainda é viável ou precisa ser redesenhado.
4. Se os oito insumos hoje exatamente no teto devem ganhar margem de segurança (reformulação) ou se a fábrica sustenta, com validação de múltiplos lotes, overage zero de produção.
5. O texto definitivo da advertência para gestantes/lactantes/crianças, após confirmação do Anexo VI.
6. A denominação definitiva do guaraná no rótulo e no cadastro, após o laudo do fornecedor.
7. Se os 350 mg de magnésio declarados são de fato magnésio elementar (convenção do cadastro) ou peso do sal — e, se for peso do sal, se isso muda a leitura de "no teto" para "com folga".
8. Se cabe manter a citação "Produto dispensado de registro conforme RDC nº 240/2018" no rodapé deste rótulo específico — o mesmo ponto já registrado em `CONTEXTO-COMPLETO-PARA-RETOMAR.md` para os demais 27 produtos do catálogo (a RDC 240/2018 está revogada desde 01/09/2024), com a mesma orientação já dada pelo dono: não alterar por conta própria, é decisão do RT. Registro aqui um dado adicional encontrado nesta tarefa: outro rótulo real da mesma fábrica (`pre-treino com a mascara (1).pdf`, marca DAYON) já usa uma base mais recente — "Dispensado de registro conforme RDC 843/2024 e IN 281/2024" — o que sugere que existe uma base de dispensa mais atual em uso em pelo menos parte da produção da fábrica.
9. Se, e quando, o selo de conformidade deste produto pode ser restabelecido — recomendação técnica desta análise é mantê-lo ausente até a resolução dos pontos 1 a 3 acima, mas a decisão final é do RT/dono.
10. Autorizar (ou ajustar) o envio dos textos da seção 5 ao fornecedor de guaraná e à fábrica.

---

## Anexo — o que ficou PENDENTE nesta tarefa, reunido

- Teor de cafeína do lote de guaraná realmente em uso (depende de laudo do fornecedor).
- Piso de doseamento de cafeína de 3,5% na especificação do Anexo I da IN 28/2018 — tentativa de confirmação via AnvisaLegis em 15/09/2026 não localizou essa cifra no texto retornado.
- Texto literal do Anexo VI da IN 28/2018 sobre fracionamento de dose da beta-alanina — tentativa de confirmação via AnvisaLegis em 15/09/2026 não alcançou esse anexo no texto retornado.
- Texto literal da advertência obrigatória do Anexo VI para cafeína/gestantes/lactantes/crianças — mesma tentativa, mesmo resultado.
- Vigência da RDC 243/2018 — tentativa de acesso direto ao AnvisaLegis em 15/09/2026 não carregou o texto do ato ("Este ato está sendo processado").
- Qual das duas fórmulas (rótulo/cadastro de 28/05/2026, ou ficha técnica da fábrica de 20/08/2026) está de fato em produção hoje.
- Se os 350 mg de magnésio declarados são elementares ou peso do sal (falta laudo do lote específico desta fórmula).
- Data real de aprovação da arte do rótulo `PRÉ TREINO_CÉSIO 137_420g.pdf` (o metadado do arquivo, 28/05/2026, é a data de criação do arquivo, não necessariamente a data de aprovação pela gráfica ou pelo RT).
