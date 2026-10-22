# Avaliação de conformidade — fotos de insumo (`public/insumos/`)

**Data da apuração:** 15/09/2026
**Escopo:** as fotos de insumo do catálogo B2B Lemon Caps, uma por ingrediente, em `public/insumos/`, e o código que as exibe na página de benefícios do catálogo.

## Fontes e método (procedência de cada dado deste documento)

- **Arquivos de imagem:** lidos diretamente do disco, em `public/insumos/`, nesta sessão (15/09/2026). Tamanho por `stat -f%z`, dimensões em pixels por `sips -g pixelWidth -g pixelHeight`, hash por `md5`. Nenhum dado de tamanho/dimensão foi estimado.
- **Conteúdo de cada foto:** cada uma das 68 fotos foi **aberta e observada individualmente** nesta sessão (ferramenta de leitura de imagem). A descrição de "o que a foto mostra de fato" vem dessa observação direta — nunca do nome do arquivo, nunca só da legenda do `CREDITOS.md`. Em pelo menos dois casos (detalhados na seção 2) a legenda do próprio `CREDITOS.md` ou a memória de anotações anteriores **não batia** com o que a foto realmente mostra, e prevaleceu o que foi visto no arquivo.
- **Vínculo arquivo ↔ insumo:** lido da tabela `ingredients` em produção, via REST público do Supabase (`GET /rest/v1/ingredients?select=slug,name,category,image_path,active`), consultado em 15/09/2026. 70 linhas recebidas.
- **Código:** `components/catalog/IngredientCard.tsx`, `app/catalogo/[slug]/beneficios/page.tsx`, `app/globals.css` e `components/admin/IngredientForm.tsx`, lidos nesta sessão; busca por `image_path`/`imagePath`/`ingredientImagePath` em todo o projeto (`.ts`/`.tsx`) para garantir que nenhum outro ponto de uso ficasse de fora.
- **Critério de veredito aplicado a cada foto** (para o dono poder recalibrar qualquer linha, se discordar):
  - **ADEQUADA** — mostra o insumo em si (pó, cápsula, cristal) ou uma planta/fruto/alimento de origem real e bem reconhecido, em foto limpa: sem pessoa identificável, sem marca de terceiro, sem cena doméstica ou de varejo.
  - **FROUXA** — a ligação de conteúdo existe (fonte alimentar real, ainda que secundária, ou ligação científica/etimológica), mas a foto é informal, tem pessoa parcialmente visível, ambiente de cozinha/varanda, ou é pouco reconhecível para quem não é especialista.
  - **IMPRÓPRIA** — o conteúdo não representa o insumo de forma que um comprador razoável reconheça, ou mostra cena doméstica/de varejo/histórica, pessoa por inteiro, ou tem qualidade/legibilidade baixa demais.
  - **MARCA DE TERCEIRO VISÍVEL** — há logotipo, nome de marca comercial ou marca d'água de copyright legível na foto (usada mesmo quando o restante do conteúdo seria aceitável).
  - **DUPLICADA** — o mesmo arquivo (mesmo conteúdo, comprovado por hash MD5) está associado a mais de um insumo.

---

## 1. Resumo executivo

- **68 arquivos de foto** em `public/insumos/` (mais um `CREDITOS.md`, que documenta autor/licença/origem de cada uma — todas de Wikimedia Commons ou Openverse, licenças CC/domínio público, baixadas e processadas em 12/09/2026, três dias antes desta apuração).
- **70 insumos** cadastrados no banco. **68 têm `image_path` preenchido**, e cada um dos 68 caminhos aponta para um arquivo que de fato existe em disco — conferido por checagem de existência de cada caminho, não por amostragem. **2 não têm imagem nenhuma**, de propósito: `beta-alanina` e `corante-verde`. O próprio `CREDITOS.md` registra que, para esses dois, "nenhuma imagem com licença aceitável e representação honesta do insumo foi encontrada [...] depois de múltiplas tentativas de busca" e que "preferiu-se deixar sem imagem a usar uma foto errada".
- **Nenhum arquivo órfão** (arquivo em disco sem insumo apontando para ele) e **nenhum insumo com caminho quebrado** — comparação de conjunto entre nomes de arquivo e slugs do banco fechou 1 para 1, sem sobra de nenhum dos dois lados.
- Depois de abrir e examinar as 68 fotos, uma a uma:

| Veredito | Quantidade | % |
|---|---:|---:|
| ADEQUADA | 35 | 51% |
| FROUXA | 12 | 18% |
| IMPRÓPRIA | 12 | 18% |
| MARCA DE TERCEIRO VISÍVEL | 7 | 10% |
| DUPLICADA | 2 | 3% |
| **Total** | **68** | **100%** |

  Ou seja, **33 das 68 fotos (49%) têm algum problema real** — só pouco mais da metade está de fato adequada para um catálogo B2B industrial.
- **O fallback já existe e já funciona**: quando um insumo não tem foto, o cartão troca de layout sozinho e mostra um ícone neutro no lugar, sem quebrar e sem cor por categoria (`components/catalog/IngredientCard.tsx` — detalhes na seção 5). **Isso quer dizer que remover as fotos problemáticas agora é uma operação de baixo risco técnico**, sem precisar mexer em código.

---

## 2. Correções às anotações prévias do dono

Cada anotação já feita foi reconferida contra o arquivo real antes de entrar neste documento — não contra a legenda do crédito, não contra a memória da conversa. Duas estavam trocadas entre si; uma tinha o par errado; as demais se confirmaram exatamente como anotadas.

| Anotação prévia | O que a apuração encontrou, olhando o arquivo real | Situação |
|---|---|---|
| "sucralose é um ímã" | `edulcorante-sucralose.jpg` mostra sachês de açúcar, sal e pimenta sobre madeira, com a marca **Sainsbury's** e o selo **Fairtrade** legíveis. O ímã (ferradura vermelha com limalha de ferro, rotulado S/N) está em **`ferro.jpg`**. | **Corrigido** — as duas anotações estavam trocadas entre si |
| "ferro é uma caixa de ovos" | `ferro.jpg` mostra o ímã descrito acima — um objeto didático de sala de aula, não o mineral. A caixa de ovos aberta, com a marca **Eggland's Best** bem legível na tampa e painel nutricional completo, está em **`l-cisteina.jpg`**. | **Corrigido** — as duas anotações estavam trocadas entre si |
| "ácido hialurônico e extrato de café verde usam a mesma imagem" | `acido-hialuronico.jpg` (diagrama químico) e `extrato-de-cafe-verde.jpg` (saco de juta sujo no chão) são arquivos diferentes — tamanho, dimensões e MD5 não batem. A duplicata real, confirmada por **MD5 idêntico** (`3f421e565efbb192a2d9ac550691bb9f`), é entre **`acido-hialuronico.jpg` e `hialuronato-de-sodio.jpg`**: os dois são, byte a byte, a mesma imagem (um diagrama comparando as três moléculas). | **Corrigido** — a duplicata existe, mas é outro par |
| "L-triptofano é uma foto caseira de peru numa travessa de ceia" | Confirmado: peru fatiado numa travessa de porcelana com friso dourado, toalha vermelha, talheres de prata e tigela de milho ao fundo — mesa posta para jantar festivo. | **Confirmado** |
| "melatonina é uma cerejeira num quintal com sacos de entulho" | Confirmado: quintal residencial ao entardecer, árvore com folhagem de outono, **dois sacos brancos de entulho em primeiro plano**, casas e fiação elétrica ao fundo. Não há fruto algum visível na foto. | **Confirmado** |
| "cálcio é uma loja de queijos" | Confirmado: prateleira de loja com rodas de queijo Gouda empilhadas e placa de preço escrita à mão, em holandês. | **Confirmado** |
| "psyllium mostra a embalagem de outra marca, com logotipo visível" | Confirmado, e mais grave do que uma embalagem qualquer: a caixa traz a palavra **"TRADE MARK"** impressa, um logotipo de telefone antigo, o nome da fábrica ("The Sidhpur Sat-Isabgol Factory") e "Product of India". | **Confirmado** |

**Achado adicional, fora da lista prévia:** `extrato-de-cafe-verde.jpg` não mostra grão de café nenhum — mostra um pedaço de saco de juta sujo, largado no chão, com texto de identificação de carga impresso ("PAPUA NEW GUINEA RAW ARABICA COFFEE BEANS"), cercado de lixo. E `taurina.jpg` mostra uma mão segurando um molusco/búzio do mar — o que nem bate com a própria legenda de procedência do `CREDITOS.md` para esse arquivo (que descreve "filé de peixe em bandeja de alumínio").

---

## 3. Cruzamento arquivo × banco

- **Arquivos sem insumo correspondente:** nenhum.
- **Insumos com `image_path` preenchido mas sem arquivo em disco:** nenhum.
- **Insumos sem imagem nenhuma (`image_path` nulo):** 2 — `beta-alanina` (categoria aminoácido) e `corante-verde` (categoria outro). Decisão já tomada e documentada no próprio `CREDITOS.md`: preferiu-se não ter foto a ter foto errada.
- **Conteúdo duplicado (mesmo arquivo, hash idêntico) usado por mais de um insumo:** 1 caso — `acido-hialuronico.jpg` e `hialuronato-de-sodio.jpg`, MD5 `3f421e565efbb192a2d9ac550691bb9f` nos dois. Tecnicamente cada insumo aponta para o seu próprio nome de arquivo (não há um `image_path` compartilhado no banco), mas as duas fotos são, byte a byte, a mesma imagem.
- **Quase-duplicata visual, sem ser o mesmo arquivo:** `colina.jpg` e `cromo.jpg` — MD5 diferentes, dimensões diferentes (640×800 vs. 800×530), mas as duas mostram brócolis e cenoura sobre madeira escura, com a mesma marca d'água de fotógrafo ("ph. federica bertoldi ©") no mesmo canto — aparentam vir do mesmo ensaio fotográfico, reaproveitado em dois insumos diferentes.

---

## 4. Avaliação visual completa (68 fotos)

| Arquivo | Insumo | Categoria | Tamanho | Dimensões | O que a foto mostra de fato | Veredito | Motivo |
|---|---|---|---|---|---|---|---|
| `acido-citrico.jpg` | Ácido cítrico | outro | 104188 bytes | 800×600 | macro de cristal translúcido colorido sob luz polarizada | **ADEQUADA** | cristal do próprio insumo |
| `acido-hialuronico.jpg` | Ácido hialurônico | outro | 21415 bytes | 800×171 | diagrama químico comparando Hyaluronic acid / Hyaluronate / Sodium hyaluronate, rótulos em inglês | **DUPLICADA** | mesmo arquivo (MD5 idêntico) de `hialuronato-de-sodio.jpg`; além disso é diagrama, não foto do insumo |
| `acido-l-aspartico.jpg` | Ácido L-aspártico | aminoácido | 46752 bytes | 315×800 | maço de aspargos frescos com faixa roxa "Produce of Peru" | **FROUXA** | ligação só pelo nome (asparagus/aspártico); não mostra o aminoácido |
| `aromatizante-identico-ao-natural-de-limao.jpg` | Aromatizante idêntico ao natural de limão | outro | 35181 bytes | 800×368 | macro de fatia de limão em corte transversal | **ADEQUADA** | fruto de origem, foto limpa |
| `biotina.jpg` | Biotina | vitamina | 40537 bytes | 600×449 | tigela de amêndoas em close-up | **ADEQUADA** | fonte alimentar reconhecida de biotina |
| `boro.jpg` | Boro | mineral | 116081 bytes | 800×668 | foto antiga e desbotada (aspecto de slide escaneado) de fileiras de uva-passa secando ao sol numa fazenda | **IMPRÓPRIA** | baixa qualidade e cor esmaecida dificultam reconhecer do que se trata |
| `cafeina.jpg` | Cafeína | outro | 109747 bytes | 800×533 | grãos de café torrados em macro | **ADEQUADA** | fonte de origem, foto profissional |
| `cafeina-anidra.jpg` | Cafeína anidra | outro | 38032 bytes | 800×703 | modelo molecular 3D bola-bastão da molécula de cafeína | **ADEQUADA** | representação científica correta da forma isolada/anidra |
| `calcio-elementar.jpg` | Cálcio elementar | mineral | 98143 bytes | 800×600 | loja de queijos: prateleira com rodas de queijo Gouda e placa de preço em holandês | **IMPRÓPRIA** | cena de varejo/loja, não o mineral nem alimento isolado |
| `cloridrato-de-l-arginina.jpg` | Cloridrato de L-arginina | aminoácido | 46292 bytes | 500×333 | amendoins, com e sem casca | **ADEQUADA** | fonte alimentar reconhecida de arginina |
| `cloridrato-de-l-cisteina.jpg` | Cloridrato de L-cisteína | aminoácido | 86331 bytes | 800×600 | grande quantidade de bulbos brancos ovalados (aparência de alho ou cebola/chalota) | **FROUXA** | ligação indireta; a legenda do CREDITOS.md diz "Garlic Cloves", a foto lembra mais cebola pérola — divergência entre crédito e conteúdo |
| `cobre.jpg` | Cobre | mineral | 82043 bytes | 800×468 | peça de cobre nativo metálico, estilo escultural, fundo neutro | **ADEQUADA** | metal do próprio insumo |
| `colageno-hidrolisado.jpg` | Colágeno hidrolisado | outro | 45242 bytes | 800×533 | mulher (torso e mãos, sem rosto) usa colher medidora para tirar pó de um pote com rótulo em idioma estrangeiro | **IMPRÓPRIA** | pessoa visível + embalagem de produto pronto de terceiro, cena de cozinha/lifestyle |
| `colageno-tipo-ii-nao-desnaturado.jpg` | Colágeno tipo II não desnaturado | outro | 44820 bytes | 600×338 | lâmina de histologia: células roxas/rosas coradas ao microscópio | **FROUXA** | cientificamente ligado (cartilagem), mas não reconhecível pelo público geral |
| `colina.jpg` | Colina | outro | 101605 bytes | 640×800 | brócolis e cenouras sobre madeira, fundo escuro dramático, marca d'água "ph. federica bertoldi ©" | **MARCA DE TERCEIRO VISÍVEL** | marca d'água de fotógrafo impressa na foto; ligação nutricional também fraca |
| `creatina-monoidratada.jpg` | Creatina monoidratada | outro | 71878 bytes | 600×800 | pote plástico visto de cima, rótulo verde com texto em alemão ("Zutaten: Kreatin Monohydrat..."), pó branco dentro | **MARCA DE TERCEIRO VISÍVEL** | embalagem comercial de produto de terceiro com rótulo legível em alemão |
| `cromo.jpg` | Cromo | mineral | 68546 bytes | 800×530 | brócolis e cenouras sobre madeira, fundo escuro, mesma marca d'água "ph. federica bertoldi ©" (enquadramento diferente de colina.jpg) | **MARCA DE TERCEIRO VISÍVEL** | marca d'água de fotógrafo; quase-duplicata visual de colina.jpg (mesmo ensaio, arquivo binário diferente) |
| `dha.jpg` | DHA | outro | 98038 bytes | 600×800 | pilha de peixes inteiros frescos variados, ambiente externo/rústico | **FROUXA** | peixe é fonte real de DHA, mas foto informal/rústica |
| `dioxido-de-silicio.jpg` | Dióxido de silício | outro | 74608 bytes | 600×492 | espécime mineral: quartzo violeta com epidoto verde-escuro, fundo branco | **ADEQUADA** | cristal mineral do próprio composto (quartzo = SiO2) |
| `edulcorante-sucralose.jpg` | Edulcorante sucralose | outro | 111826 bytes | 600×800 | sachês de condimento sobre madeira: açúcar demerara "Fairtrade... by Sainsbury's", sal e pimenta | **MARCA DE TERCEIRO VISÍVEL** | marca "Sainsbury's" e selo Fairtrade legíveis; também mostra açúcar de mesa, não um adoçante — não é um ímã, como constava em anotação prévia |
| `epa.jpg` | EPA | outro | 111420 bytes | 600×800 | peixinhos prateados tipo anchova em saco plástico azul sobre gelo, ambiente externo | **FROUXA** | peixe oleoso é fonte real de EPA, mas foto tipo "flagrante de mercado" |
| `espirulina.jpg` | Espirulina | outro | 121248 bytes | 800×450 | microscopia de filamentos verdes de cianobactéria | **ADEQUADA** | é o próprio organismo, reconhecível como alga filamentosa |
| `extrato-de-cafe-verde.jpg` | Extrato de café verde | extrato vegetal | 108959 bytes | 800×593 | pedaço de saco de juta sujo, no chão, texto impresso "PAPUA NEW GUINEA RAW ARABICA COFFEE BEANS", lixo ao redor | **IMPRÓPRIA** | não mostra grão de café algum, mostra embalagem de transporte suja no chão |
| `extrato-de-laranja-moro.jpg` | Extrato de laranja moro | extrato vegetal | 106912 bytes | 800×561 | seis metades de laranja-sangue (blood orange) num prato branco | **ADEQUADA** | fruto de origem, foto limpa e profissional |
| `extrato-de-rizomas-de-curcuma.jpg` | Extrato de rizomas de cúrcuma | extrato vegetal | 109864 bytes | 800×533 | folhas verdes em formato de coração numa trepadeira, marca d'água "© 2006 David Stang http://ZipcodeZoo.com" | **MARCA DE TERCEIRO VISÍVEL** | marca d'água de copyright legível; além disso mostra folhas (não o rizoma) e o formato da folha não é o clássico da cúrcuma |
| `extrato-fluido-de-semente-de-feno-grego.jpg` | Extrato fluido de semente de feno-grego | extrato vegetal | 121739 bytes | 800×800 | sementes de feno-grego espalhadas em fundo branco, régua ao lado | **ADEQUADA** | semente de origem, foto de referência limpa |
| `feno-grego-em-po.jpg` | Feno-grego em pó | outro | 121350 bytes | 800×450 | monte de folhas secas fragmentadas (não pó) sobre uma folha verde | **FROUXA** | planta certa, mas forma errada: folha seca fragmentada, não pó de semente |
| `ferro.jpg` | Ferro | mineral | 22489 bytes | 413×519 | ímã em ferradura vermelho/prateado com limalha de ferro nas pontas (rotulado S/N), fundo azul-claro | **IMPRÓPRIA** | objeto didático de sala de aula, não o mineral/insumo — este é o "ímã" da anotação prévia, não sucralose |
| `fosfatidilserina.jpg` | Fosfatidilserina | outro | 107626 bytes | 800×600 | prato de edamame (vagem de soja cozida) | **ADEQUADA** | soja é fonte real de fosfatidilserina |
| `guarana-em-po.jpg` | Guaraná em pó | outro | 59804 bytes | 800×600 | colher com pó marrom sobre caneca amarela, bancada de cozinha escura, embalagem desfocada ao fundo | **FROUXA** | mostra um pó (possivelmente o insumo), mas em cena doméstica de cozinha |
| `hialuronato-de-sodio.jpg` | Hialuronato de sódio | outro | 21415 bytes | 800×171 | diagrama químico comparando Hyaluronic acid / Hyaluronate / Sodium hyaluronate, rótulos em inglês | **DUPLICADA** | mesmo arquivo (MD5 idêntico `3f421e565efbb192a2d9ac550691bb9f`) de `acido-hialuronico.jpg` |
| `inositol.jpg` | Inositol | outro | 40334 bytes | 600×403 | fatias de melão cantaloupe num prato estampado, mesa externa tipo varanda | **FROUXA** | fruta é fonte real de inositol, mas ambiente informal |
| `iodo.jpg` | Iodo | mineral | 41982 bytes | 800×610 | modelo 3D de cristal de iodo (esferas roxas) | **ADEQUADA** | representação científica correta do elemento |
| `l-arginina.jpg` | L-arginina | aminoácido | 80776 bytes | 800×600 | sementes de abóbora, com e sem casca | **ADEQUADA** | fonte alimentar real de arginina |
| `l-carnitina.jpg` | L-carnitina | aminoácido | 99009 bytes | 533×800 | bife/filé bovino grelhado numa pedra escura, faca e guardanapo xadrez | **ADEQUADA** | carne bovina é a fonte mais citada de L-carnitina |
| `l-cisteina.jpg` | L-cisteína | aminoácido | 91456 bytes | 800×600 | caixa de ovos aberta, marca "Eggland's Best" bem legível na tampa, painel nutricional completo, 12 ovos brancos | **MARCA DE TERCEIRO VISÍVEL** | marca comercial legível — esta é a "caixa de ovos" da anotação prévia, não ferro |
| `l-glutamina.jpg` | L-glutamina | aminoácido | 74107 bytes | 800×600 | vitrine refrigerada de supermercado com repolhos cortados, etiqueta "ORGANIC California..." visível, pouca luz | **IMPRÓPRIA** | cena de varejo/vitrine de mercado; ligação nutricional fraca |
| `l-metionina.jpg` | L-metionina | aminoácido | 118198 bytes | 800×620 | sementes de gergelim (branco e claro) num prato preto | **ADEQUADA** | gergelim é fonte real e bem citada de metionina |
| `l-teanina.jpg` | L-teanina | aminoácido | 117538 bytes | 800×599 | folhas de chá verde frescas secando em bandejas de bambu, chão de madeira | **ADEQUADA** | chá verde é a fonte mais citada de L-teanina; cena de processamento, não doméstica |
| `l-tirosina.jpg` | L-tirosina | aminoácido | 96927 bytes | 600×800 | pote plástico de comida para viagem com edamame, etiqueta de preço parcialmente visível, foto torta | **IMPRÓPRIA** | foto amadora com etiqueta de preço e recipiente de take-away |
| `l-triptofano.jpg` | L-triptofano | aminoácido | 107826 bytes | 800×600 | peru fatiado em travessa de porcelana com friso dourado, toalha vermelha, talheres de prata, tigela de milho ao fundo | **IMPRÓPRIA** | cena doméstica de ceia/jantar festivo — confirma a anotação prévia |
| `magnesio.jpg` | Magnésio | mineral | 118381 bytes | 800×602 | cristal metálico prateado de magnésio, fundo azul-claro | **ADEQUADA** | metal cristalizado do próprio insumo |
| `maltodextrina.jpg` | Maltodextrina | outro | 39393 bytes | 800×533 | grãos de milho roxo-avermelhado escuro, fundo branco | **ADEQUADA** | milho é fonte comum de maltodextrina |
| `melatonina.jpg` | Melatonina | outro | 116519 bytes | 600×800 | quintal residencial ao entardecer, árvore com folhas de outono, dois sacos brancos de entulho em primeiro plano, casas ao fundo | **IMPRÓPRIA** | cena doméstica com sacos de entulho — confirma integralmente a anotação prévia; não mostra fruto algum |
| `metilsulfonilmetano.jpg` | Metilsulfonilmetano | outro | 93154 bytes | 800×622 | cristal mineral amarelo (enxofre/aragonita) com inclusões brancas, fundo branco | **ADEQUADA** | ligação temática correta ao enxofre do composto |
| `oleo-de-peixe-tg.jpg` | Óleo de peixe TG | outro | 70952 bytes | 800×519 | cápsulas softgel douradas/âmbar empilhadas | **ADEQUADA** | mostra o insumo em si (cápsulas) |
| `omega-3-total.jpg` | Ômega-3 total | outro | 84425 bytes | 800×534 | tigela de madeira com sementes de linhaça | **ADEQUADA** | fonte vegetal real de ômega-3 |
| `outros-acidos-graxos-omega-3.jpg` | Outros ácidos graxos ômega-3 | outro | 121032 bytes | 533×800 | close-up preenchendo o quadro com sementes de chia | **ADEQUADA** | fonte vegetal real de ômega-3 |
| `psyllium.jpg` | Psyllium | outro | 122845 bytes | 533×800 | caixa verde/preta "PSYLLIUM HUSK!", selo "TRADE MARK" com logotipo de telefone antigo, "The Sidhpur Sat-Isabgol Factory", "Product of India" | **MARCA DE TERCEIRO VISÍVEL** | embalagem comercial de fábrica indiana com marca registrada nítida — confirma integralmente a anotação prévia |
| `quercetina.jpg` | Quercetina | outro | 49661 bytes | 800×534 | tábua com maçãs cortadas, fita métrica, bloco de notas e caneta, braço de pessoa desfocado ao fundo | **IMPRÓPRIA** | cena de estilo de vida/dieta, pessoa parcialmente visível |
| `selenio.jpg` | Selênio | mineral | 80652 bytes | 800×536 | mão de pessoa segurando castanha-do-pará parcialmente descascada, cenário externo perto d'água | **FROUXA** | castanha-do-pará é a fonte mais emblemática de selênio, mas mão de pessoa visível e cenário informal |
| `silicio-organico.jpg` | Silício orgânico | mineral | 114324 bytes | 600×800 | campo verde de cavalinha (Equisetum arvense) com pontas esporíferas | **ADEQUADA** | planta de origem clássica e correta do silício orgânico |
| `siliciumax.jpg` | Siliciumax | outro | 112002 bytes | 800×600 | vista de dentro de um bambuzal, luz solar entre os talos | **ADEQUADA** | bambu é fonte vegetal de sílica |
| `sulfato-de-glucosamina-com-cloreto-de-potassio.jpg` | Sulfato de glucosamina com cloreto de potássio | outro | 121749 bytes | 600×800 | rocha costeira com pequenos moluscos/cracas aderidos, oceano ao fundo | **FROUXA** | tema marinho correto em espírito, mas a legenda diz "Crab shells" e a foto não mostra casca de caranguejo |
| `taurina.jpg` | Taurina | aminoácido | 110363 bytes | 600×800 | mão de pessoa segurando molusco/búzio do mar parcialmente aberto, água e embarcação ao fundo | **IMPRÓPRIA** | pessoa visível segurando marisco cru; não bate com a legenda do crédito ("Fish fillet in aluminum tray") |
| `vitamina-a.jpg` | Vitamina A | vitamina | 119977 bytes | 600×800 | três cenouras inteiras frescas sobre madeira escura | **ADEQUADA** | fonte de origem clássica de vitamina A |
| `vitamina-b1.jpg` | Vitamina B1 | vitamina | 121164 bytes | 800×533 | mão de pessoa segurando panícula de arroz num arrozal ao ar livre | **FROUXA** | arroz é fonte real de B1, mas mão/braço de pessoa visível em cena de plantação |
| `vitamina-b12.jpg` | Vitamina B12 | vitamina | 102857 bytes | 600×800 | filé de salmão cru com azeite, ervas frescas, tomate-cereja, em preparo sobre papel manteiga | **ADEQUADA** | salmão é fonte real de B12, foto profissional |
| `vitamina-b2.jpg` | Vitamina B2 | vitamina | 48375 bytes | 800×533 | copo de leite com respingo dramático e dois biscoitos, fundo preto com gotas | **FROUXA** | leite é fonte real de riboflavina, mas composição inclui biscoitos, estilo comercial de "leite com bolacha" |
| `vitamina-b3.jpg` | Vitamina B3 | vitamina | 118215 bytes | 800×525 | fotografia antiga em preto e branco: homem inteiro ao lado de um monte de amendoim num galpão, legenda impressa "1.000 tons of bulk peanuts" | **IMPRÓPRIA** | fotografia histórica com pessoa inteira visível e texto sobreposto |
| `vitamina-b5.jpg` | Vitamina B5 | vitamina | 79181 bytes | 800×719 | ramo com folha e abacate inteiro ao lado de duas metades com caroço, fundo branco | **ADEQUADA** | abacate é fonte bem reconhecida de B5, foto limpa em estilo botânico |
| `vitamina-b6.jpg` | Vitamina B6 | vitamina | 31793 bytes | 800×570 | duas bananas maduras sobre fundo preto | **ADEQUADA** | fruta de origem clássica de B6 |
| `vitamina-b9.jpg` | Vitamina B9 | vitamina | 121155 bytes | 600×800 | folhas de espinafre frescas dentro de um saco plástico transparente | **ADEQUADA** | espinafre é a fonte clássica de folato (B9) |
| `vitamina-c.jpg` | Vitamina C | vitamina | 116574 bytes | 710×800 | laranjas inteiras e cortadas sobre madeira, fundo escuro, iluminação dramática | **ADEQUADA** | fruta clássica de origem, foto profissional |
| `vitamina-d.jpg` | Vitamina D | vitamina | 92774 bytes | 800×533 | foto aérea de floresta com neblina e raios de sol ao amanhecer | **ADEQUADA** | representação simbólica correta — luz solar é a fonte de síntese da vitamina D |
| `vitamina-e.jpg` | Vitamina E | vitamina | 83638 bytes | 800×533 | sementes de abóbora e girassol misturadas em close-up | **ADEQUADA** | sementes são fonte reconhecida de vitamina E |
| `vitamina-k.jpg` | Vitamina K | vitamina | 58122 bytes | 800×682 | close-up de folha verde-escura com gotas de água, veios visíveis | **ADEQUADA** | folha verde escura, fonte real de vitamina K |
| `zinco.jpg` | Zinco | mineral | 122801 bytes | 800×434 | corte polido de minério bandado (schalenblende, zinco-chumbo) em vitrine de museu com legenda parcial ao fundo | **ADEQUADA** | minério do próprio metal, identificável |

### Insumos sem imagem (`image_path` nulo no banco)

- `beta-alanina` (categoria aminoácido)
- `corante-verde` (categoria outro)

---

## 5. Onde o código usa a foto, e o que acontece sem ela

- **Único ponto de renderização visual no site:** `components/catalog/IngredientCard.tsx`.
  - Linha 42 — `const hasImage = hasContent(composition.ingredientImagePath);`
  - Linhas 70–104 — quando `hasImage` é verdadeiro: renderiza `<Image src={composition.ingredientImagePath} .../>` (`next/image`, linhas 83–91), com nome e quantidade sobrepostos numa faixa de vidro (glassmorphism) por cima da própria foto.
  - Linhas 106–129 — quando `hasImage` é falso: troca de variante de cartão inteira. Mostra `<ImageIcon size={22} aria-hidden="true" />` (ícone da biblioteca `lucide-react`, importado na linha 2) dentro de `<div className="lc-ingredient-image lc-ingredient-image--empty">` (linhas 108–110); nome, quantidade e descrição ficam abaixo, no corpo do cartão, não sobre a foto.
- Esse `IngredientCard` é chamado a partir de `app/catalogo/[slug]/beneficios/page.tsx`, linha 159, dentro do laço que percorre `formula.compositions` — a página de benefícios do catálogo, a mesma que o `CREDITOS.md` cita como destino das fotos.
- **CSS do estado vazio** — `app/globals.css`, linhas ~1708–1725: `.lc-ingredient-image--empty` só acrescenta `border-style: dashed` à mesma caixa (`background: var(--card-bg)`, `color: var(--text-muted)`) usada quando há foto. **Não há cor por categoria nem inicial do nome do insumo** — é sempre o mesmo ícone genérico de imagem, para qualquer insumo, de qualquer categoria.
- **Admin** — `components/admin/IngredientForm.tsx`, linhas 161–168: o campo "Imagem (caminho ou URL)" é um `TextField` simples, texto puro. Sem pré-visualização da imagem, sem upload, sem checagem de que o caminho aponta para um arquivo que existe.
- **PDFs** — busca por `image_path` / `imagePath` / `ingredientImagePath` em todo o projeto não encontrou nenhuma ocorrência em `lib/pdf/formula-sections.ts`, `lib/cart/quote-pdf.ts` nem `lib/catalog/dossie-pdf.ts`. **A foto do insumo não aparece em nenhum PDF gerado** (orçamento, dossiê) — só na página web de benefícios.

**Resposta direta:** já existe fallback, testado nesta apuração lendo o componente inteiro. É um ícone neutro, sem cor por categoria, sem inicial, e o cartão não quebra em nenhum dos dois estados (com ou sem foto). **Remover uma foto problemática hoje não exige nenhum ajuste de código.**

---

## 6. Caminho A — Remover

Nenhum comando abaixo foi executado. Comandos prontos para o dono rodar quando decidir.

### 6.1 Arquivos recomendados para remoção (20 de 68)

Os 12 **IMPRÓPRIA** + 7 **MARCA DE TERCEIRO VISÍVEL** + 1 dos 2 **DUPLICADA** (mantendo `acido-hialuronico.jpg` como está, já que ainda seria a única foto daquele insumo até uma substituição futura):

```bash
cd /Users/diegofrancisco/Downloads/lemoncaps-catalogo/public/insumos

rm boro.jpg calcio-elementar.jpg colageno-hidrolisado.jpg extrato-de-cafe-verde.jpg \
   ferro.jpg l-glutamina.jpg l-tirosina.jpg l-triptofano.jpg melatonina.jpg \
   quercetina.jpg taurina.jpg vitamina-b3.jpg \
   colina.jpg creatina-monoidratada.jpg cromo.jpg edulcorante-sucralose.jpg \
   extrato-de-rizomas-de-curcuma.jpg l-cisteina.jpg psyllium.jpg \
   hialuronato-de-sodio.jpg
```

Por categoria, essas 20 fotos se distribuem assim: mineral 4, aminoácido 5, extrato vegetal 2, vitamina 1, outro 8.

**Opção mais ampla:** incluir também as 12 **FROUXA** na remoção (mostram algo real, mas fraco ou informal demais) — mesma lógica, só acrescentar `acido-l-aspartico.jpg cloridrato-de-l-cisteina.jpg colageno-tipo-ii-nao-desnaturado.jpg dha.jpg epa.jpg feno-grego-em-po.jpg guarana-em-po.jpg inositol.jpg selenio.jpg sulfato-de-glucosamina-com-cloreto-de-potassio.jpg vitamina-b1.jpg vitamina-b2.jpg` ao comando (total 32 de 68).

**Opção nuclear — apagar todas as 68 (pedida explicitamente no escopo desta tarefa, "ou todos"):**

```bash
cd /Users/diegofrancisco/Downloads/lemoncaps-catalogo/public/insumos
rm *.jpg
# CREDITOS.md não é apagado por este comando (não é .jpg), mas ficaria
# inteiramente desatualizado e precisaria ser reescrito ou removido à parte.
```

### 6.2 SQL sugerido (migration) — zera `image_path` por slug, nunca por UUID

Não aplicado. Sugestão de conteúdo para uma migration nova (ex.: `supabase/migrations/20260915000000_remove_fotos_insumo_impropias.sql`), casando por `slug` como o resto do projeto exige:

```sql
-- Zera image_path dos insumos cuja foto foi avaliada como IMPRÓPRIA,
-- MARCA DE TERCEIRO VISÍVEL ou DUPLICADA (a cópia redundante), em
-- docs/conformidade/FOTOS-DE-INSUMO-AVALIACAO-2026-09-15.md.
-- Casamento por slug (nunca por id/UUID), como manda a convenção do projeto.
update public.ingredients
set image_path = null
where slug in (
  -- IMPRÓPRIA (12)
  'boro', 'calcio-elementar', 'colageno-hidrolisado', 'extrato-de-cafe-verde',
  'ferro', 'l-glutamina', 'l-tirosina', 'l-triptofano', 'melatonina',
  'quercetina', 'taurina', 'vitamina-b3',
  -- MARCA DE TERCEIRO VISÍVEL (7)
  'colina', 'creatina-monoidratada', 'cromo', 'edulcorante-sucralose',
  'extrato-de-rizomas-de-curcuma', 'l-cisteina', 'psyllium',
  -- DUPLICADA — mantém a foto em acido-hialuronico, zera só a cópia (1)
  'hialuronato-de-sodio'
);
```

Para a opção mais ampla (32 no total), acrescentar ao `in (...)`: `'acido-l-aspartico', 'cloridrato-de-l-cisteina', 'colageno-tipo-ii-nao-desnaturado', 'dha', 'epa', 'feno-grego-em-po', 'guarana-em-po', 'inositol', 'selenio', 'sulfato-de-glucosamina-com-cloreto-de-potassio', 'vitamina-b1', 'vitamina-b2'`.

Para a opção nuclear: `update public.ingredients set image_path = null where image_path is not null;` (zera as 68 de uma vez).

### 6.3 Ajuste de código necessário

**Nenhum.** Confirmado na seção 5: `IngredientCard.tsx` já trata `image_path` nulo/vazio com um layout próprio (ícone neutro), sem quebrar. Rodar só a migration acima (zerar o banco) e apagar os arquivos já é suficiente — o site continua funcionando exatamente como funciona hoje para `beta-alanina` e `corante-verde`, que já não têm foto.

Único ajuste manual necessário, e que não é de código: **atualizar `public/insumos/CREDITOS.md`**, removendo as linhas da tabela de créditos referentes a qualquer arquivo apagado (senão o arquivo de créditos passa a citar fotos que não existem mais).

---

## 7. Caminho B — Substituir

### 7.1 O que uma foto adequada precisa ter, por categoria

| Categoria | O que a foto deveria mostrar | Não pode ter |
|---|---|---|
| **Vitamina** | O alimento-fonte mais citado cientificamente para aquela vitamina especificamente (não um alimento genérico "saudável") OU o cristal/pó isolado da vitamina | Pessoa, cena doméstica, prato montado com múltiplos alimentos alheios à vitamina |
| **Mineral** | Cristal ou minério do próprio elemento/composto (como as já aprovadas: cobre, magnésio, dióxido de silício) OU o pó/sal mineral realmente usado na formulação | Objeto que só *parece* relacionado (ímã para "ferro"), cena de loja/varejo |
| **Aminoácido** | Cristal ou pó do próprio composto, ou o alimento-fonte mais citado — nunca por semelhança de nome (aspargo ≠ aspártico) | Embalagem de produto pronto de terceiro, cena de supermercado |
| **Extrato vegetal / botânico** | A planta, fruto, semente ou parte (raiz, folha) de onde o extrato realmente vem, em foto de estúdio/macro neutra | Embalagem de transporte (sacaria, sacos de carga), marca d'água de fotógrafo |
| **"Outro"** (cafeína, creatina, colágeno, MSM, ômega-3, edulcorante etc. — categoria genérica usada para o restante) | O pó, cápsula ou cristal do próprio insumo, em bandeja/colher/fundo liso neutro | Rótulo de produto de terceiro, pessoa manipulando o produto |

### 7.2 Quantas fotos novas seriam necessárias

- **Mínimo (só o que está claramente errado):** 20 fotos — as 12 IMPRÓPRIA + 7 MARCA DE TERCEIRO VISÍVEL + 1 duplicata redundante (`hialuronato-de-sodio`), listadas na seção 6.1. Distribuição por categoria: mineral 4, aminoácido 5, extrato vegetal 2, vitamina 1, outro 8.
- **Rodada completa (incluindo as fracas):** até 32 fotos, somando as 12 FROUXA (distribuição: aminoácido 2, mineral 1, outro 7, vitamina 2).
- As 35 ADEQUADA não precisam de nenhuma ação.

### 7.3 Três opções de origem para as fotos novas (sem gerar nenhuma nesta tarefa)

| Opção | Prós | Contras |
|---|---|---|
| **1. Banco de imagens com licença** (Wikimedia Commons / Openverse — mesmo método do `CREDITOS.md` atual) | Gratuito; processo já dominado pela equipe (o próprio `CREDITOS.md` documenta autor/licença/link, pronto para auditoria); rápido para achar imagens de alimentos/plantas comuns | Já provou ser fonte do problema: das 68 fotos atuais, feitas exatamente assim há 3 dias, 33 saíram com algum defeito; itens muito específicos (um sal mineral quelado, um extrato padronizado) raramente têm foto de banco fiel; exige conferir cada imagem com o mesmo rigor desta auditoria, sempre |
| **2. Foto própria, na fábrica** (fotografar o insumo real recebido do fornecedor, em bancada neutra) | Fidelidade máxima — é o insumo que a Lemon Caps de fato usa, do lote/fornecedor real; zero risco de licença de terceiro; reforça identidade visual própria da marca no catálogo | Exige tempo, equipamento (luz, fundo, às vezes macro) e rotina; 20 a 32 fotos é trabalho contínuo, não uma tarefa de uma tarde; precisa repetir se trocar de fornecedor ou a aparência do insumo mudar |
| **3. Geração por IA** | Controle total sobre composição, fundo e iluminação; não depende de achar uma foto de banco que exista; consistência visual entre todos os cartões | Risco de imprecisão técnica — gerar um pó/cristal com aparência que não corresponde ao insumo real fere exatamente a mesma regra de exatidão que motivou esta auditoria; exige revisão humana cuidadosa de cada imagem antes de publicar; num catálogo B2B industrial, um comprador pode preferir saber que a foto é real |

---

## 8. Recomendação objetiva

Remover agora os 20 arquivos com veredito IMPRÓPRIA, MARCA DE TERCEIRO VISÍVEL ou a cópia duplicada (seção 6.1) — o fallback do próprio código já cobre a ausência sem quebrar nada, e isso foi conferido lendo o componente inteiro, não suposto. Para repor, priorizar foto própria da fábrica (opção 2 da seção 7.3): é a via que melhor serve a regra de exatidão que motivou este levantamento, já que o banco de imagens foi exatamente o que gerou os 33 problemas encontrados aqui há três dias. As 12 FROUXA podem esperar uma segunda rodada, sem urgência — mostram algo real, só que fraco ou informal demais para um catálogo B2B industrial.
