# Padrão Anvisa para tabela nutricional de suplemento alimentar

Gabarito para montagem das 24 tabelas nutricionais dos produtos Lemon Caps. Este
documento não monta nenhuma tabela de produto — ele fixa o que a norma vigente
exige, para que a montagem produto a produto seja feita contra uma régua única e
conferida na fonte oficial, não de memória.

**Metodologia**: cada norma foi aberta diretamente no AnvisaLegis
(`https://anvisalegis.datalegis.net/`), o portal de legislação consolidada da
Anvisa — é para lá que o próprio endereço institucional
`https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao` redireciona.
As URLs seguem o mesmo padrão já usado em
`lib/catalog/regulatory-info.ts` (lido antes de começar este levantamento, para
copiar o formato exato — os parâmetros `orgao` e `seqAto` não são uniformes entre
RDC e IN, e um deles [`seqAto`] varia até entre atos do mesmo tipo; ver os
comentários daquele arquivo). Data de consulta de todas as normas abaixo:
**16/09/2026**.

Onde a ferramenta de leitura trouxe conteúdo parafraseado em vez de cópia literal,
ou não alcançou um trecho do texto, isto está marcado explicitamente no corpo do
documento — não foi silenciado. Onde encontrei divergência entre o que a tarefa
presumia e o que a norma vigente realmente diz, a divergência está registrada como
**CORREÇÃO DE PREMISSA**, em destaque, porque usar o texto presumido em vez do
texto vigente citaria norma revogada num documento de conformidade.

---

## (a) Quadro das normas

| Norma | Ementa (resumo) | Status lido em 16/09/2026 | URL | Papel no gabarito |
|---|---|---|---|---|
| **RDC Anvisa nº 429/2020** (08/10/2020) | Rotulagem nutricional dos alimentos embalados | Vigente com Alterações | [AnvisaLegis](https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000429&seqAto=000&valorAno=2020&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true) | Regra do **%VD**, da tabela, da porção, das isenções |
| **IN Anvisa nº 75/2020** (08/10/2020) | Requisitos técnicos para declaração da rotulagem nutricional | Vigente com Alterações | [AnvisaLegis](https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000075&seqAto=000&valorAno=2020&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true) | **VDR** (Anexos II e VIII), arredondamento (Anexo III), ordem (Anexo XI), conversões (Anexos XXII/XXIII), quantidade não significativa (Anexo IV) |
| **RDC Anvisa nº 243/2018** (26/07/2018) | Requisitos sanitários dos suplementos alimentares — norma-mãe da categoria | Vigente com Alterações | [AnvisaLegis](https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000243&seqAto=000&valorAno=2018&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true) | Designação do produto, frases obrigatórias, grupo populacional no rótulo |
| **IN Anvisa nº 28/2018** (26/07/2018) | Listas de constituintes, limites de uso, alegações e rotulagem complementar dos suplementos | Vigente com Alterações | [AnvisaLegis](https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true) | Confirma que **não há VD aqui** (só min/máx); Anexo VI (rotulagem complementar) |

**Hierarquia** (lida literalmente no Art. 1º, parágrafo único, da IN 28/2018):
"Esta Instrução Normativa se aplica de maneira complementar à Resolução RDC nº
243, de 26 de julho, de 2018, que dispõe sobre os requisitos sanitários dos
suplementos alimentares." E a própria RDC 243/2018, Art. 15, manda que "a
rotulagem nutricional deve seguir o disposto" na RDC 429/2020 e na IN 75/2020. Ou
seja: a RDC 243/2018 é a norma-mãe da categoria "suplemento alimentar"; a IN
28/2018 detalha os constituintes e limites dessa RDC; e para a tabela nutricional
especificamente, a RDC 243/2018 remete à dupla RDC 429/2020 + IN 75/2020.

**Atos que alteraram cada norma**, lidos nesta consulta:

- **RDC 429/2020**: RDC 460/2020, RDC 604/2022, RDC 714/2022, RDC 715/2022, RDC
  717/2022, RDC 729/2022, RDC 819/2023, RDC 976/2025.
- **IN 75/2020**: RDC 460/2020 (incluiu item 19 no Anexo XVI), retificação de
  13/10/2022 (Anexos IX, XII, XIII, XIV) e retificação de 17/05/2024 (Anexos XII,
  XIII, XIV).
- **RDC 243/2018**: RDC 466/2021 (art. 5º), RDC 429/2020 (art. 15), RDC 839/2023
  (art. 20), RDC 843/2024 (revogou o parágrafo único do art. 11 e alterou o art.
  21).
- **IN 28/2018**: confirmei o status "Vigente com Alterações" diretamente nesta
  consulta, mas **não reconferi item a item** a lista dos 13 atos que a alteraram
  — usei a lista já conferida em `lib/catalog/regulatory-info.ts` (datada de
  13/09/2026, três dias antes desta consulta): IN 76/2020, IN 102/2021, IN
  275/2024, IN 284/2024, IN 304/2024, IN 318/2024, IN 336/2024, IN 361/2025, IN
  373/2025, IN 418/2025, IN 431/2026, IN 438/2026, IN 450/2026.

---

## (b) Modelo de tabela para suplemento alimentar

### O que torna o modelo de suplemento diferente do modelo de alimento comum

- **Lista de nutrientes não é fixa**: RDC 429/2020, Art. 5º, §3º — "No caso dos
  suplementos alimentares, a tabela de informação nutricional deve conter a
  declaração das quantidades de valor energético e de **todos** nutrientes,
  substâncias bioativas e enzimas **adicionados** aos produtos." Ou seja: declara
  o valor energético sempre, mais tudo que entrou na fórmula — não uma lista
  padrão de alimento comum.
- **Porção = dose diária recomendada**: RDC 429/2020, Art. 9º, inciso VI — a
  porção declarada "deve corresponder à quantidade diária recomendada pelo
  fabricante para cada um dos grupos populacionais específicos" indicados no
  rótulo.
- **Sem exigência de "por 100 g/100 mL"**: RDC 429/2020, Art. 8º, §1º — essa
  exigência vale só para sólidos/semissólidos e líquidos convencionais.
- **A tabela de VD usada é outra**: RDC 429/2020, Art. 12, §4º — "No caso dos
  alimentos para fins especiais não contemplados no §6º do art. 8º desta
  Resolução que tenham indicação para grupos populacionais específicos no seu
  rótulo **e dos suplementos alimentares**, o %VD deve ser determinado com base
  nos VDR definidos no **Anexo VIII** da Instrução Normativa IN nº 75, de 2020,
  para cada um dos grupos populacionais específicos indicados no rótulo." Alimento
  comum usa o Anexo II (VDR geral, base 2.000 kcal); suplemento usa o Anexo VIII
  (VDR por grupo populacional). Ver seção (c).
- **Rotulagem nutricional frontal**: segundo leitura resumida (não literal) do
  Anexo XVI, item 14, da IN 75/2020, suplemento alimentar está entre os produtos
  para os quais a declaração de rotulagem nutricional frontal é vedada. Não
  confirmei o texto literal deste item — tratar como informação de contexto, não
  como citação direta.

### Estrutura da tabela

1. **Título**: "INFORMAÇÃO NUTRICIONAL" — negrito, caixa alta, centralizado.
   Confirmado com razoável confiança (IN 75/2020, Anexo XII — modelos e
   formatação), mas não é transcrição literal certificada.
2. **Colunas**: uma coluna de quantidade por porção e uma coluna "**%VD\***".
   A redação exata do cabeçalho da coluna de quantidade (se é literalmente
   "Quantidade por porção" ou outra variação) **não foi confirmada
   literalmente** — ficou como pendência (seção f). O conceito — porção como
   dose diária recomendada — está confirmado (Art. 9º, VI, RDC 429/2020, acima).
3. **Ordem dos itens** (Anexo XI da IN 75/2020 — lida em paráfrase, não
   transcrição literal item a item; ver pendência):
   1. Valor energético
   2. Carboidratos (com açúcares totais → açúcares adicionados e
      mono/dissacarídeos específicos; poliois totais; outros carboidratos)
   3. Proteínas (+ aminoácidos específicos, quando declarados)
   4. Gorduras totais (saturadas, trans, monoinsaturadas/ômega 9,
      poli-insaturadas/ômega 6 e ômega 3, colesterol)
   5. Fibras alimentares (+ fibras específicas, quando declaradas)
   6. Sódio
   7. Vitaminas, na ordem A, D, E, K, C, B1 a B12
   8. Minerais, na ordem Cálcio, Cloreto, Cobre, Cromo, Ferro, Flúor, Fósforo,
      Iodo, Magnésio, Manganês, Molibdênio, Potássio, Selênio, Zinco
   9. Colina
   10. Taurina
   11. Nucleotídeos
   12. Substâncias bioativas nomeadas especificamente (as que o produto
       declarar)
4. **Nutriente sem VDR definido**: RDC 429/2020, Art. 12, §1º — "Para os
   nutrientes sem VDR definidos, o espaço para declaração do respectivo %VD deve
   ser deixado **vazio**." Não se usa símbolo.
   > **CORREÇÃO DE PREMISSA**: a tarefa presumia o uso de `**` para marcar
   > constituinte sem VD. O texto vigente manda **deixar o espaço em branco**,
   > não usar asterisco duplo nem nenhum outro símbolo. Não localizei `**`
   > associado a "sem VD" em nenhuma das quatro normas, na parte que a leitura
   > alcançou de cada uma. Se esse símbolo aparece em rótulos reais do mercado
   > hoje, é herança visual da norma anterior já revogada (RDC 360/2003), não da
   > norma vigente.
5. **Quantidade não significativa**: RDC 429/2020, Art. 12, §2º — "Quando a
   quantidade de valor energético ou de nutrientes for não significativa,
   conforme Anexo IV da Instrução Normativa - IN nº 75, de 2020, o %VD deve ser
   declarado como **zero**." Os limiares numéricos lidos (parciais — só energia e
   macronutrientes convencionais, não vitaminas/minerais isolados) estão no
   `vd.json`, chave `quantidade_nao_significativa_anexo_iv_in75`.
6. **Nota de rodapé do %VD**: RDC 429/2020, Art. 12, §5º, texto completo do
   parágrafo: 'A declaração de que trata o caput deve ser acompanhada da
   seguinte nota de rodapé: "**\*Percentual de valores diários fornecidos pela
   porção**".'
   > **CORREÇÃO DE PREMISSA**: a tarefa presumia o texto "*% Valores Diários de
   > referência com base em uma dieta de 2.000 kcal ou 8.400 kJ". Esse é o texto
   > da norma **anterior, já revogada** (RDC 360/2003). O texto vigente, lido
   > literalmente na RDC 429/2020 (norma hoje em vigor), é o de cima — mais
   > curto, e **sem** menção a 2.000 kcal ou 8.400 kJ. Usar o texto antigo nas 24
   > tabelas citaria norma revogada.
7. **Casas decimais e arredondamento**: ver seção (d).
8. **Isenções de %VD** (RDC 429/2020, Art. 12, §6º) — não se aplicam a
   suplementos como categoria. A lista literal de isentos é: fórmulas infantis;
   fórmulas para nutrição enteral; fórmulas dietoterápicas para erros inatos do
   metabolismo; produtos destinados exclusivamente ao processamento industrial;
   produtos destinados exclusivamente aos serviços de alimentação; e bebidas
   alcoólicas cuja declaração seja só por 100 mL. Suplemento alimentar **não
   está nessa lista** — uma primeira leitura automatizada, depois corrigida por
   releitura do texto integral do Art. 12, chegou a apontar (erradamente) que
   suplementos seriam isentos; a leitura literal do §6º, incisos I a VI,
   desmente isso. Registro esse erro de leitura aqui de propósito, porque é
   exatamente o tipo de engano que a releitura pega.

### Designação do produto (RDC 243/2018, Art. 12)

Texto literal do **caput**: "Os produtos de que trata esta Resolução devem ser
designados como 'Suplemento Alimentar' acrescido da sua forma farmacêutica."

**§1º** permite complementar com: nomes individuais dos nutrientes/substâncias
bioativas/enzimas; nome de categoria desses constituintes; nome da fonte; ou
identificação da linhagem do micro-organismo (para probióticos).

**§2º** remete aos Anexos V ou VI da IN 28/2018 para requisitos adicionais.

**Art. 13** — a designação fica próxima à marca do produto, em caracteres
legíveis: caixa alta, negrito, cor contrastante, tamanho mínimo de 1/3 do
tamanho da maior fonte usada na marca.

> **CORREÇÃO DE PREMISSA**: a tarefa presumia uma regra codificada do tipo
> "SUPLEMENTO ALIMENTAR DE ..." vs. "SUPLEMENTO ALIMENTAR EM ...". Não
> encontrei esse binômio como regra expressa em nenhum dispositivo lido — o
> Art. 12 inteiro (caput, §1º, §2º) não usa essa formulação. O que a norma
> exige literalmente é só "Suplemento Alimentar" + forma farmacêutica. "De"
> (ligando a um nutriente/fonte, ex.: "de Vitamina C") e "em" (ligando à forma
> farmacêutica, ex.: "em cápsulas") parecem convenção de redação em português
> corrente ao combinar os elementos do §1º com a forma farmacêutica do caput —
> não uma regra binária codificada à parte com critério de quando usar cada
> uma.

### Frases obrigatórias (RDC 243/2018, Art. 14)

Texto literal do **Art. 14, inciso I**, alíneas c, d, e — todas exigidas "em
destaque e negrito":

- "Este produto não é um medicamento"
- "Não exceder a recomendação diária de consumo indicada na embalagem"
- "Mantenha fora do alcance de crianças"

Demais exigências do mesmo artigo:

- **Alínea a**: declarar o(s) grupo(s) populacional(is) dos Anexos III e IV da
  IN 28/2018 a que o produto se destina, incluindo a faixa etária no caso de
  crianças.
- **Alínea b**: declarar quantidade e frequência de consumo para cada grupo
  populacional indicado.
- **Inciso II**: instruções de conservação, inclusive após aberta a embalagem.
- **Inciso III**: para suplementos com probióticos, identificar a espécie de
  cada linhagem por nomenclatura binomial atual, na lista de ingredientes.
- **§1º**: as informações da alínea a podem ser complementadas por indicações de
  gênero, faixa etária específica, praticantes de atividade física e atletas,
  dentro de cada grupo já indicado.
- **§2º**: "Devem ser atendidos os requisitos complementares de rotulagem para
  os suplementos alimentares estabelecidos no **Anexo VI** da Instrução
  Normativa n° 28, de 26 de julho de 2018." — **o conteúdo literal deste Anexo
  VI não foi alcançado nesta consulta** (ver seção f, é a pendência mais
  relevante deste levantamento).

---

## (c) Valores Diários de Referência (VDR) por grupo populacional

**Regra de qual tabela usar** (RDC 429/2020, Art. 12, §4º, citado acima): o
suplemento alimentar calcula %VD com base no **Anexo VIII da IN 75/2020** (VDR
por grupo populacional específico), **não** no Anexo II (VDR geral, base 2.000
kcal, usado por alimento comum). Título literal do Anexo VIII, como lido: "VDR
PARA FINS DE ROTULAGEM NUTRICIONAL DOS ALIMENTOS PARA FINS ESPECIAIS NÃO
CONTEMPLADOS NO § 6º DO ART. 8º DA RESOLUÇÃO - RDC Nº 429, DE 2020, QUE TENHAM
INDICAÇÃO PARA GRUPOS POPULACIONAIS ESPECÍFICOS NO SEU RÓTULO E DOS SUPLEMENTOS
ALIMENTARES."

Nos 28 nutrientes conferidos, o valor da coluna "≥19 anos" do Anexo VIII é
**idêntico**, em todos os casos, ao valor geral de adultos do Anexo II — o que dá
uma conferência cruzada a favor da confiabilidade dos dois conjuntos de números.

Tabela completa (8 grupos × 28 nutrientes) no arquivo `vd.json` anexo a este
levantamento, chave `grupos_populacionais_anexo_viii_in75`. Abaixo, só os 11
nutrientes que constavam do pedido de retorno, para os 8 grupos:

| Nutriente | 0–6 m | 7–11 m | 1–3 a | 4–8 a | 9–18 a | ≥19 a (adultos) | Gestantes | Lactantes |
|---|---|---|---|---|---|---|---|---|
| Vitamina C (mg) | 40 | 50 | 15 | 25 | 75 | **100** | 85 | 120 |
| Vitamina D (µg) | 10 | 10 | 15 | 15 | 15 | **15** | 15 | 15 |
| Vitamina B12 (µg) | 0,4 | 0,5 | 0,9 | 1,2 | 2,4 | **2,4** | 2,6 | 2,8 |
| Ácido fólico (µg DFE) | 65 | 80 | 150 | 200 | 400 | **400** | 600 | 500 |
| Zinco (mg) | 2 | 3 | 3 | 5 | 11 | **11** | 12 | 13 |
| Magnésio (mg) | 30 | 75 | 80 | 130 | 410 | **420** | 400 | 360 |
| Ferro (mg) | 0,27 | 11 | 7 | 10 | 15 | **14** | 27 | 10 |
| Cálcio (mg) | 200 | 260 | 700 | 1.000 | 1.300 | **1.000** | 1.300 | 1.300 |
| Selênio (µg) | 15 | 20 | 20 | 30 | 55 | **60** | 60 | 70 |
| Cromo (µg) | 0,2 | 5,5 | 11 | 15 | 35 | **35** | 30 | 45 |
| Biotina (µg) | 5 | 6 | 8 | 12 | 25 | **30** | 30 | 35 |

> **Ponto de atenção, não corrigido por mim**: Molibdênio em gestantes leu **5
> µg** — valor confirmado por duas leituras idênticas da fonte, mas que destoa
> da progressão da própria linha (43 µg aos 9–18 anos, 45 µg em adultos, 50 µg
> em lactantes — um valor de gestante mais baixo que o de adultos não-gestantes
> é atípico). Não substituí por um valor "mais plausível": registro o que a
> fonte mostrou duas vezes e recomendo conferência visual direta na página
> antes de usar em rótulo impresso. Ver `vd.json`.

O `vd.json` também traz, para os mesmos 8 grupos, mais 17 nutrientes (vitaminas
A, E, K, B1, B2, B6, ácido pantotênico; e sódio, potássio, cloreto, fósforo,
iodo, cobre, manganês, molibdênio, flúor, colina) — 28 no total. Niacina (mg NE)
só veio com valor explícito para adultos (15 mg NE); os demais grupos ficaram
como pendência (não confirmados, não assumidos como zero). Macronutrientes
(carboidratos, proteínas, gorduras, fibras, valor energético) não foram
verificados no Anexo VIII — só existe o valor geral de adultos, do Anexo II
abaixo.

### VDR geral de adultos (Anexo II, IN 75/2020 — Art. 3º, base 2.000 kcal)

Tabela completa (39 constituintes), usada por alimento comum e como referência
cruzada dos valores de adulto do Anexo VIII:

| Constituinte | VDR | Constituinte | VDR |
|---|---|---|---|
| Valor energético | 2.000 kcal | Ácido fólico | 400 µg DFE |
| Carboidratos | 300 g | Ácido pantotênico | 5 mg |
| Açúcares adicionados | 50 g | Vitamina B12 | 2,4 µg |
| Proteínas | 50 g | Cálcio | 1.000 mg |
| Gorduras totais | 65 g | Cloreto | 2.300 mg |
| Gorduras saturadas | 20 g | Cobre | 900 µg |
| Gorduras trans | 2 g | Cromo | 35 µg |
| Gorduras monoinsaturadas | 20 g | Ferro | 14 mg |
| Gorduras poli-insaturadas | 20 g | Flúor | 4 mg |
| Ômega 6 | 18 g | Fósforo | 700 mg |
| Ômega 3 | 4.000 mg | Iodo | 150 µg |
| Colesterol | 300 mg | Magnésio | 420 mg |
| Fibras alimentares | 25 g | Manganês | 3 mg |
| Sódio | 2.000 mg | Molibdênio | 45 µg |
| Vitamina A | 800 µg RAE | Potássio | 3.500 mg |
| Vitamina D | 15 µg | Selênio | 60 µg |
| Vitamina E | 15 mg | Zinco | 11 mg |
| Vitamina K | 120 µg | Colina | 550 mg |
| Vitamina C | 100 mg | | |
| Tiamina | 1,2 mg | | |
| Riboflavina | 1,2 mg | | |
| Niacina | 15 mg NE | | |
| Vitamina B6 | 1,3 mg | | |
| Biotina | 30 µg | | |

---

## (d) Regras de conversão

Base legal: IN 75/2020, Art. 22 (energia, Anexo XXII) e Art. 23 (nutrientes,
Anexo XXIII).

| Nutriente | Fator de conversão, texto lido literalmente |
|---|---|
| **Vitamina A** | "1 µg de equivalente de atividade de retinol (RAE) = 3,33 UI de vitamina A = 1 µg de retinol = 12 µg de betacaroteno = 24 µg de outros carotenoides provitamina A." |
| **Vitamina D** | "1 µg de colecalciferol = 40 UI de vitamina D." |
| **Vitamina E** | "1 mg de alfa-tocoferol = 1 mg de d-alfa tocoferol (natural) = 2 mg de alfa tocoferol sintético = 1,49 UI." |
| **Niacina** | "1 mg de niacina equivalente (NE) = 1 mg de niacina = 60 mg de triptofano." |
| **Ácido fólico** | "1 µg de folato dietético equivalente (DFE) = 1 mg de folato naturalmente presente no alimento = 0,6 µg de ácido fólico = 0,6 µg de L-metilfolato de suplemento." ⚠️ ver alerta abaixo |
| **Vitamina K / Colina** | Não localizado fator de conversão específico no Anexo XXIII — PENDENTE (seção f) |

> ⚠️ **Inconsistência não corrigida, sinalizada por mim**: no fator do ácido
> fólico, o segundo termo da equivalência aparece em **mg** ("1 mg de folato
> naturalmente presente no alimento"), enquanto os demais termos da mesma frase
> (DFE, ácido fólico, L-metilfolato) aparecem em **µg**. Isso não fecha
> dimensionalmente — um fator de equivalência não deveria trocar de unidade no
> meio da própria frase sem dizer isso explicitamente. Reconferi esse
> dispositivo especificamente, em fetch separado, e a fonte devolveu **o mesmo
> texto, com o mesmo "mg"**, nas duas vezes. Pode ser erro de digitação/OCR do
> próprio texto consolidado no AnvisaLegis — não é (até onde consigo checar) uma
> falha da minha leitura, já que duas leituras independentes bateram. **Não
> substituí "mg" por "µg"**: relatar o número visto, mesmo que pareça errado, é
> a regra; corrigir por conta própria seria "preencher lacuna com valor
> plausível". Antes de usar este fator em qualquer cálculo de rótulo,
> confirme visualmente a página oficial (ou o PDF do ato consolidado).

---

## (e) Frases obrigatórias

Já listadas na íntegra na seção (b), com o dispositivo de origem: as três
advertências em negrito do Art. 14, I, "c/d/e" da RDC 243/2018 ("Este produto
não é um medicamento" / "Não exceder a recomendação diária..." / "Mantenha fora
do alcance de crianças"), a nota de rodapé do %VD (Art. 12 §5º da RDC 429/2020),
e a remissão ao **Anexo VI da IN 28/2018** para requisitos complementares (Art.
14 §2º da RDC 243/2018) — cujo conteúdo literal é a principal pendência deste
levantamento (seção f).

---

## (f) Pendências

1. **Anexo VI da IN 28/2018 (requisitos de rotulagem complementar dos
   suplementos) — texto literal não alcançado.** A página do AnvisaLegis abriu
   normalmente (HTTP 200) nas quatro tentativas feitas para essa norma, mas o
   conteúdo que chegou até a etapa de leitura truncou antes do Anexo VI em
   **duas** tentativas com prompts diferentes — a segunda pedindo
   explicitamente para ignorar os Anexos I a V e ir direto ao VI. Tentei uma
   rota alternativa: busca na web por uma cópia oficial do Anexo VI. Achei um
   PDF em `antigo.anvisa.gov.br` (domínio legado da própria Anvisa), mas
   **rejeitei essa fonte**: o próprio Anexo VI foi alterado por IN 418/2025 e IN
   438/2026 (ambas posteriores a esse PDF legado, que é de uma consolidação
   anterior), então usá-lo citaria texto desatualizado exatamente no anexo que
   preciso. **PENDENTE — depende de novo acesso** (por exemplo, abrir a página
   num navegador de verdade em vez de por busca automatizada, ou obter um PDF
   oficial mais recente direto da Anvisa). Isso significa que as frases
   obrigatórias específicas de rotulagem complementar de suplemento (além das
   três do Art. 14 da RDC 243/2018, que essas sim estão confirmadas) **não
   entraram neste gabarito**.
2. **Anexo III da IN 75/2020 (arredondamento) e Anexo XI (ordem dos
   nutrientes)** — o conteúdo na seção (b)/(d) veio por paráfrase de duas
   leituras concordantes da ferramenta, não por transcrição literal
   célula-a-célula do texto oficial. A lógica bate nas duas leituras, mas a
   redação exata (ex.: se o original diz "maior ou igual" com essas palavras,
   ou como a tabela está formatada) não foi confirmada literalmente.
3. **Anexo VIII da IN 75/2020 para macronutrientes** — não verificado se esse
   anexo também dá VDR por grupo populacional para carboidratos, proteínas,
   gorduras, fibras e valor energético, ou se esses ficam só no valor geral de
   adultos do Anexo II. Relevante só se algum dos 24 produtos precisar declarar
   %VD de macronutriente para um grupo que não seja adulto.
4. **Niacina (mg NE) por grupo populacional** — só a coluna de adultos (≥19
   anos) veio com valor explícito (15 mg NE) no Anexo VIII. Os demais 7 grupos
   ficaram como pendência — não confirmados, e não assumidos como zero ou como
   igual ao valor de adulto.
5. **Molibdênio, gestantes = 5 µg** — ver ponto de atenção na seção (c).
   Confirmado por duas leituras idênticas da fonte, mas destoa da progressão da
   própria linha. Recomendo conferência visual direta antes de uso em rótulo.
6. **Fator de conversão do ácido fólico (DFE)** — inconsistência de unidade
   (µg/mg) sinalizada na seção (d), confirmada em duas leituras idênticas.
7. **Fatores de conversão de vitamina K e de colina** — não localizados no
   Anexo XXIII pela leitura feita. Não confirmei se de fato não existem (por
   não haver forma alternativa de expressão em uso) ou se a leitura não
   alcançou a linha correspondente.
8. **Cabeçalho literal exato da coluna de quantidade por porção** — não
   confirmado com transcrição literal (ver seção b, item 2).
9. **Quantidade não significativa para vitaminas e minerais isolados** — o
   Anexo IV da IN 75/2020 só foi conferido para valor energético e
   macronutrientes convencionais (ex.: "≤ 4 kcal", "≤ 0,5 g" de carboidrato).
   Os limiares individuais de vitaminas e minerais — que são o núcleo dos
   produtos Lemon Caps — não foram extraídos nesta consulta.
10. **Lista dos 13 atos que alteraram a IN 28/2018** — não reconferida item a
    item nesta tarefa; herdada de `lib/catalog/regulatory-info.ts` (conferida
    lá em 13/09/2026). O status geral "Vigente com Alterações" foi, sim,
    confirmado diretamente nesta consulta.

---

## Arquivo de dados

Os valores estruturados (VDR pelos 8 grupos × 28 nutrientes, conversões,
arredondamento, e todos os alertas/pendências acima em formato consultável) estão
em
`/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/padrao-anvisa/vd.json`.
Esse arquivo é temporário (scratchpad da sessão) — antes de a outra frente
começar a montar as 24 tabelas, vale copiá-lo para um local definitivo dentro do
repositório.
