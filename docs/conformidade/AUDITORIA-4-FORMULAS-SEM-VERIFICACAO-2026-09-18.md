# Auditoria regulatória — as 4 fórmulas sem verificação (18/09/2026)

**Tarefa:** aplicar às 4 fórmulas com `formula_compositions.metadata = {}` (nunca auditadas) o mesmo
método já usado nas outras 22 fórmulas em 16/09/2026, no mesmo formato de dado. Este documento é
só o relatório e o JSON proposto — **nada foi aplicado no banco**.

**As 4 fórmulas:** `emagrecimento-em-capsulas`, `emagrecimento-em-gotas`, `omega-pro-tg`,
`pre-treino-creatina-sabor-limao-420g`.

---

## 0. Metodologia, fontes e o que mudou desde 16/09/2026

### 0.1 Fonte primária consultada nesta tarefa

- **AnvisaLegis, IN 28/2018 (texto consolidado)** — URL lida em `lib/catalog/regulatory-info.ts`
  (`REGULATORY_INSTRUCTIONS[0].url`):
  `https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true`.
  **Consultada por WebFetch em 18/09/2026, duas vezes** (ver §0.2 — a primeira resposta continha uma
  inconsistência interna que exigiu reconferência).
- **Transcrições literais já em disco neste projeto** (`docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`,
  `IN28-2018-ANEXO-III-LITERAL.md`, `IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`), produzidas em sessões
  anteriores (13–16/09/2026) por WebFetch direto ao mesmo AnvisaLegis. **Reconferidas por mim, com
  grep no texto bruto, nesta tarefa (18/09/2026)** — não copiei número de resumo de terceiro; li a
  linha da tabela de cada nutriente diretamente nesses arquivos.
- **Painel oficial da ANVISA "Consulte os ingredientes autorizados" (Power BI)** — URL localizada em
  `docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md`:
  `https://app.powerbi.com/view?r=eyJrIjoiNDU4Y2UxNmEtZjc0Yi00ZTkyLTk3N2EtZTEyZTI5MjdkNzQ2IiwidCI6ImI2N2FmMjNmLWMzZjMtNGQzNS04MGM3LWI3MDg1ZjVlZGQ4MSJ9`.
  **Tentei acessá-lo por WebFetch nesta tarefa, agora, 18/09/2026** — não é uma afirmação copiada de
  sessão antiga. Resultado: a página devolveu só o spinner de carregamento do Power BI
  ("Power BI loading"), sem nenhum dado — confirma o que já era conhecido: o painel é renderizado em
  JavaScript e não abre por WebFetch/curl, só por navegador real (Playwright). Esta sessão **não tem
  ferramenta de navegador/Playwright disponível** (só WebFetch e WebSearch) — tentei mesmo assim, como
  manda a regra de não afirmar limitação sem testar, e registro aqui o resultado exato, não presumido.
- **WebSearch** (18/09/2026) para dois pontos específicos que a fonte primária não resolveu sozinha:
  existência da IN 470/2026 (ver §0.2) e piso de doseamento de cafeína do guaraná (ver §0.4 e a nota do
  pré-treino).

### 0.2 A norma mudou desde 16/09/2026? — achado que exigiu reconferência

A primeira consulta por WebFetch devolveu uma lista de 14 Instruções Normativas alterando a IN 28/2018,
terminando em **"IN nº 470, de 16/09/2026"** — e afirmou que a consolidação já ia até essa norma. Essa
resposta tinha um defeito interno que não posso ignorar: a própria lista veio **fora de ordem
cronológica** (citou a IN 102/2021 antes da IN 76/2020), o que indica que o modelo pequeno que resume a
página não leu a lista com o rigor que a pergunta exigia. Uma alteração normativa dois dias antes de
hoje, publicada no mesmo dia em que este projeto fez sua grande reformulação (16/09/2026), é
exatamente o tipo de coincidência que pede reconferência, não aceitação direta — por isso repeti a
consulta.

Na segunda consulta, pedi a frase literal do topo da página e pedi para localizar a string "470" com o
contexto ao redor, palavra por palavra. A resposta veio mais específica e internamente consistente:
"470" aparece ligada a três constituintes novos — **óleo de krill (Euphausia superba)**, **L-cistina** e
**esqualeno** — cada um com a marca "(Incluído pela Instrução Normativa Anvisa nº 470, de 16/09/2026)",
no mesmo padrão textual usado para toda alteração nesse documento. Fiz também um WebSearch por
`"Instrução Normativa" 470 2026 Anvisa` — não achei nenhuma fonte independente (site de escritório de
advocacia, LegisWeb, publicação oficial) confirmando essa norma; achei, isso sim, a **IN nº 452, de
10/06/2026**, publicada no mesmo dia da IN 450/2026, o que mostra que a ANVISA de fato publica lotes de
IN no mesmo dia — plausível que a 470 exista e não tenha sido indexada ainda por ser recentíssima.

**Conclusão desta verificação, com a procedência de cada parte separada:**

- **LIDO (com reconfirmação):** os limites de mínimo/máximo de todo constituinte usado nas 4 fórmulas
  desta tarefa (feno-grego/saponinas, café verde/clorogênico, laranja moro/antocianinas, cúrcuma/
  curcumina, cromo, vitamina D, vitamina B12, colina, cafeína, vitamina B6, niacina/B3, creatina,
  beta-alanina, arginina, taurina, L-carnitina, tirosina, magnésio, EPA e DHA, lipídeos totais) —
  continuam iguais aos que os arquivos literais deste projeto (13–16/09/2026) já traziam, e eu mesmo
  reconferi essa leitura, linha a linha, nesta tarefa.
- **PROVISÓRIO — não decorre de fonte confirmada de forma independente:** a existência e o alcance
  exatos da IN 470/2026. Pelo que consegui ver (via WebFetch, sem confirmação cruzada independente),
  ela **inclui constituintes novos (krill, L-cistina, esqualeno) que não aparecem em nenhuma das 4
  fórmulas desta tarefa** — ou seja, mesmo que exista, não achei indício de que altere algum limite que
  eu use aqui.
- **O que fica PENDENTE, por escrito:** confirmação humana, por navegador, de que a IN 470/2026 (se
  existir) não toca nenhum dos 20 constituintes usados nestas 4 fórmulas. Isso não muda nenhum veredito
  desta tarefa (nenhuma das reprovações ou pendências abaixo depende dessa confirmação), mas deve ser
  feito antes de qualquer selo definitivo ser emitido para QUALQUER fórmula do catálogo — não só estas
  4 —, porque a norma pode ter mudado dois dias antes da grande reformulação de 16/09/2026 em que todo
  o resto do banco se apoia.

### 0.3 Regime vigente (RDC/IN de base)

Reconfirmado: RDC 243/2018 (norma-mãe, "Vigente com Alterações") + IN 28/2018 (listas de constituintes e
limites, "Vigente com Alterações" — frase literal lida no topo da página: *"Vigente com Alterações
Instrução Normativa - IN nº 28, de 26/07/2018"*). Nenhuma mudança de regime desde 13/09/2026.

### 0.4 O que foi reaproveitado de auditorias já feitas neste catálogo (não repesquisado)

- Ácido clorogênico (café verde): mínimo NE, máximo 400 mg — já resolvido no projeto, reconferido por
  mim na fonte.
- Curcumina: mínimo 80 mg / máximo 130 mg, **agora expresso como curcuminoides TOTAIS** (curcumina +
  desmetoxicurcumina + bisdesmetoxicurcumina — nota ^xv/^x, redação da IN 438/2026, lida por mim
  diretamente no texto). Isto é mais rigoroso do que "80/130 mg de curcumina isolada".
- Cafeína no guaraná — piso de doseamento de 3,5%–5,5% citado no enunciado desta tarefa: **tentei
  confirmar isso na fonte primária (Anexo I da IN 28/2018) e não encontrei essa cifra** — nem eu, nesta
  tarefa, nem a sessão de 15/09/2026 (registrado no `PARECER-PRE-TREINO-CESIO-137-2026-09-15.md`, que já
  tinha tentado e não achado). Um WebSearch independente feito agora aponta uma **definição de mercado**
  ("extrato de guaraná... contém de 3 a 5% de cafeína") que não é texto da IN 28/2018, e um estudo
  encontrou variação real de **0,18%–0,93%** em pós de guaraná comercializados — faixa bem mais larga e
  mais baixa que "3,5–5,5%". Trato o piso de 3,5–5,5% como **não confirmado na norma**, e uso isso como
  razão adicional para não presumir teor de cafeína de guaraná em nenhuma conta abaixo.
- Vitamina D3: 1 µg = 40 UI (nota iii, reconfirmada). Vitamina B12: máximo 9,94 µg. Creatina: mínimo
  3.000 mg / máximo 5.000 mg (IN 373/2025). Todos reconfirmados por mim, na fonte, nesta tarefa.
- Beta-alanina — **a condição de fracionamento do Anexo VI, que o parecer de 15/09/2026 tentou confirmar
  e não conseguiu** ("a consulta não alcançou o Anexo VI"), **eu consegui confirmar nesta tarefa**, lendo
  a transcrição literal do Anexo VI: *"Quantidade diária máxima de 2 g com doses divididas de, no
  máximo, 300 mg, com intervalo de duas horas entre as doses."* (Suplementos e requisito incluídos pela
  IN nº 102, de 15/10/2021). Isto muda um "PENDENTE" antigo para um "CONFIRMADO" — ver §4.

### 0.5 Achado prévio importante: as 4 fórmulas não têm o histórico que parecia à primeira vista

Antes de calcular qualquer coisa, precisei entender a origem da composição **hoje** no banco (a que o
enunciado desta tarefa me deu, por SELECT direto de 18/09/2026), porque este projeto já tem memoriais de
reformulação de 16/09/2026 para produtos de nome parecido — e **não são o mesmo produto**:

- `emagrecimento-em-capsulas` e `emagrecimento-em-gotas` são **produtos novos**, criados em
  17–18/09/2026 (migration `20260922300000_correcoes_pos_reformulacao_direto_no_banco.sql`, seção 4) a
  partir de **um print de fórmula que o dono mandou** — não do memorial de reformulação de
  `emagrecedor-em-capsula`/`slim-up-emagrecimento-em-gota` (produtos antigos, ainda existentes,
  separados, com seus próprios problemas já documentados). O próprio banco grava
  `ingredients_list = 'Feno-grego, extrato de cafe verde, ... PENDENTE conferir com o RT.'` para o
  primeiro, e `usage_instructions = 'PENDENTE - número de gotas por dose a definir'` para o segundo —
  **não é leitura minha, é o texto gravado hoje no cadastro**. Por isso, **não reaproveitei nenhum laudo
  de lote dos produtos antigos para estes dois** — a regra do dono é clara (não presumir mesmo lote sem
  confirmação), e aqui nem o insumo-fornecedor é o mesmo produto.
- `omega-pro-tg` está **confirmado sem alteração** desde 16/09/2026 (a migration
  `20260922300000...md`, comentário da seção 5, diz explicitamente que é "a única formula das 23
  reformuladas que a 20260922000000 não tocou"). A composição de hoje bate, insumo a insumo, com o
  memorial `docs/conformidade/reformulacao/omega-pro-tg.md` de 16/09/2026 — reaproveito a análise
  regulatória de lá, mas refiz os limites na fonte primária, como pedido.
- `pre-treino-creatina-sabor-limao-420g` teve a composição **trocada** em 17–18/09/2026 (mesma
  migration, seção 5) para o **rótulo real da fábrica** (RT Farm. Anderson C. Barbosa, CRF/MT 5526) —
  uma composição **diferente** da proposta "seguraça regulatória" do memorial de 16/09/2026 (que reduzia
  a creatina a 4.000 mg etc. e nunca foi adotada para este SKU). A composição de hoje é, na verdade, a
  MESMA que o `PARECER-PRE-TREINO-CESIO-137-2026-09-15.md` já tinha auditado em detalhe (creatina
  5.000 mg, beta-alanina 2.000 mg, etc.) — reaproveito aquele parecer como base, mas reconfiro cada
  limite na fonte e acrescento o que ele deixou pendente (a condição do Anexo VI, agora confirmada).

---

## 1. `emagrecimento-em-capsulas`

**Identificação:** cápsula, porção declarada "1,8 g (2 cápsulas)", peso líquido 54 g (60 cápsulas = 30
porções), adultos ≥19 anos. Criado em 17–18/09/2026 a partir de print de fórmula do dono;
`ingredients_list` gravado como **"PENDENTE conferir com o RT"** no próprio banco.

### 1.1 Achado que bloqueia a fórmula inteira, antes de qualquer insumo: a soma bate com METADE da porção

Somando as 8 linhas do banco: 200 + 123,86 + 50 + 84,21 + 0,25 + 0,05 + 0,0099 + 441,62 =
**900,00 mg** (calculado por mim). A porção declarada é 1,8 g = **1.800 mg**. A soma dos insumos é
exatamente **metade** disso — e não por acaso: peso líquido 54.000 mg ÷ 60 cápsulas = **900,00 mg por
cápsula**, batendo em cheio com a soma dos insumos.

Isso deixa dois cenários igualmente possíveis, e **decisivos** para o veredito de três nutrientes com
teto legal (cromo, vitamina D3, vitamina B12) — por isso não escolho um sozinho:

| Leitura | O que significa | Cromo (declarado 0,25 mg) | Vitamina D3 (declarado 0,05 mg = 50 µg) | Vitamina B12 (declarado 0,0099 mg = 9,9 µg) |
|---|---|---|---|---|
| **A — os valores do banco já são a porção inteira** (2 cápsulas), como em todo o resto do catálogo | é o que uso nas contas abaixo, por ser a convenção usada em 100% dos outros produtos já auditados | 250 µg de sal/elemento (leitura ambígua à parte) | 50 µg = **100,0% do teto** (50 µg), sem margem | 9,9 µg = **99,6% do teto** (9,94 µg), quase sem margem |
| **B — os valores do banco são POR CÁPSULA**, e a porção (2 cápsulas) dobra tudo | sustentado pela conta 54.000 mg ÷ 60 = 900 mg/cápsula batendo exato com a soma | 500 µg, se já-elemento | **100 µg = 200,0% do teto** | **19,8 µg = 199,2% do teto** |

**Isto muda a decisão de "no limite, sem margem" para "o dobro do teto legal"** em três nutrientes — não
é uma diferença cosmética. Pela regra do dono (nunca supor valor plausível; parar quando a conclusão
depender de dado não confirmado), **não decido entre A e B**: registro os dois, uso A como base de
cálculo por ser a convenção do resto do catálogo, e sinalizo a B como risco que, sozinho, já bloqueia o
produto até o dono/RT confirmar qual das duas leituras é a real (e, já de saída, corrigir o excipiente
ou a descrição da porção, porque hoje as duas informações no cadastro — porção de 1,8 g e soma de
insumos de 900 mg — não se sustentam juntas).

### 1.2 Insumo a insumo (usando a leitura A acima)

| Insumo | Constituinte/Anexo I | Massa | Limite (adultos ≥19) | Situação |
|---|---|---|---|---|
| Feno-grego 200 mg | Saponinas de glicosídeos de furostanol | sem teor | NE / 450 mg | **PENDENTE** — sem laudo; forma física (pó? extrato?) não confirmada como a única autorizada ("Extrato de semente de feno-grego") |
| Extrato de Café Verde 123,86 mg | Ácido clorogênico | sem teor | NE / 400 mg | **PENDENTE** — nome bate com forma autorizada, falta laudo do lote |
| Extrato de Laranja Moro 50 mg | Antocianinas da laranja moro | sem teor | NE / 5 mg | **PENDENTE** — nome bate com forma autorizada, falta laudo |
| Cúrcuma 84,21 mg | Curcumina (curcuminoides totais) | sem teor | 80 / 130 mg | **PENDENTE** — forma cadastrada genérica ("Cúrcuma"), não confirma se é o "Extrato de rizomas de cúrcuma" exigido pelo Anexo I |
| Cromo 0,25 mg | Cromo | ambíguo (sal vs. elemento) | 5,25 / 250 µg | **PENDENTE** — mesma ambiguidade histórica deste catálogo; se sal picolinato a ~12,34% (padrão do catálogo, NÃO confirmado para este lote): ≈30,9 µg (12,3% do teto); se já-elemento: 100% do teto |
| Vitamina D3 0,05 mg (50 µg) | Vitamina D (colecalciferol) | dose final presumida | 3 / 50 µg | **CONDICIONADO A LAUDO** — 100,0% do teto, sem margem, sem laudo de potência do insumo |
| Vitamina B12 0,0099 mg (9,9 µg) | Vitamina B12 | dose final presumida | 0,36 / 9,94 µg | **CONDICIONADO A LAUDO** — 99,6% do teto, sem margem, sem laudo |
| Excipiente 441,62 mg | — | — | — | **PENDENTE** — composição não aberta; ver §1.1 sobre o total não fechar com a porção |

### 1.3 JSON de metadata proposto (leitura A; ver ressalva de cenário B em cada `conta`)

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 0,
  "ingredient_name": "Feno-grego",
  "quantity": 200.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "200 mg de massa do insumo, forma física não especificada no cadastro (pó? extrato seco? extrato fluido?). O Anexo I só autoriza 'Extrato de semente de feno-grego (Trigonella foenum-graecum L.)' como fonte de saponinas — se o insumo real for feno-grego em pó/semente moída, não é forma autorizada (mesmo achado já registrado em LIMITES-ANVISA-POR-INSUMO.md para outras fórmulas). Sem laudo de teor de saponinas para este produto (novo, sem memorial) — não é possível converter massa de insumo em massa de marcador ativo. ATENÇÃO: se a leitura correta da porção for 'valores por cápsula' (ver §1.1), a massa por porção dobra para 400 mg — não muda o veredito de pendência, porque o teor continua desconhecido.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 450,
    "minimo": null,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE (produto novo, sem memorial nem laudo em disco)",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de semente de feno-grego (Trigonella foenum-graecum L.) (IN 304/2024) — forma cadastrada não confirmada como esta; III·Saponinas de glicosídeos de furostanol (NE); IV·Saponinas de glicosídeos de furostanol (450)",
    "constituinte": "Saponinas de glicosídeos de furostanol",
    "forma_insumo": "Feno-grego (forma física não especificada no cadastro)",
    "forma_anexo_i": "NÃO CONFIRMADA",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 200.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 1,
  "ingredient_name": "Extrato de Café Verde",
  "quantity": 123.86,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "123,86 mg de massa do insumo. Nome bate com forma autorizada do Anexo I ('Extrato de café verde', IN 102/2021). Sem laudo de teor de ácido clorogênico para o lote deste produto (novo, sem memorial) — a regra do dono proíbe presumir o teor de outro lote já usado no catálogo (64,05%, lote IDNLABS 10269) sem confirmação. Se fosse esse mesmo teor (NÃO confirmado): 123,86 × 0,6405 = 79,3 mg = 19,8% do teto — apenas referência, não é o status usado.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 400,
    "minimo": null,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE (produto novo, sem memorial nem laudo em disco)",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de café verde (IN 102/2021); III·Ácido clorogênico (NE); IV·Ácido clorogênico (400, IN 102/2021)",
    "constituinte": "Ácido clorogênico",
    "forma_insumo": "Extrato de café verde (fornecedor/lote não identificado neste cadastro)",
    "forma_anexo_i": "Extrato de café verde",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 123.86,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 2,
  "ingredient_name": "Extrato de Laranja Moro",
  "quantity": 50.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "50 mg de massa do insumo. Nome bate com a forma autorizada do Anexo I ('Extrato de laranja moro (Citrus sinensis (L.) Osbeck)', IN 336/2024). Sem laudo de teor de antocianinas para o lote deste produto. Referência não confirmada: se o teor fosse igual ao de outro lote já usado no catálogo (1,47%, lote AllPremium 17624), 50 × 0,0147 = 0,735 mg = 14,7% do teto — só para dimensionar, não é o status usado.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 5,
    "minimo": null,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024); III·Antocianinas da laranja moro (NE); IV·Antocianinas da laranja moro (5, IN 336/2024)",
    "constituinte": "Antocianinas da laranja moro",
    "forma_insumo": "Extrato de laranja moro (fornecedor/lote não identificado)",
    "forma_anexo_i": "Extrato de laranja moro (Citrus sinensis (L.) Osbeck)",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 50.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 3,
  "ingredient_name": "Cúrcuma",
  "quantity": 84.21,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "84,21 mg de massa do insumo, cadastrado só como 'Cúrcuma' (nome genérico, não confirma se é o 'Extrato de rizomas de cúrcuma (Curcuma longa L.)' exigido pelo Anexo I — pode ser cúrcuma em pó/especiaria, forma NÃO autorizada como fonte do constituinte regulado). Desde a IN 438/2026 o limite é sobre CURCUMINOIDES TOTAIS (curcumina + desmetoxicurcumina + bisdesmetoxicurcumina), não só curcumina isolada — confirmado por mim na fonte primária nesta tarefa. Sem laudo de teor. Referência não confirmada (outros lotes deste catálogo variam de 0,42% a padronizados de 95% — faixa larga demais para estimar sem laudo próprio).",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 130,
    "minimo": 80,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de rizomas de cúrcuma (Curcuma longa L.) (Redação IN 438/2026) — forma cadastrada ('Cúrcuma') NÃO CONFIRMADA como esta; III·Curcumina, aplicável a curcuminoides totais^xv (80, IN 438/2026); IV·Curcumina, aplicável a curcuminoides totais^x (130, IN 438/2026)",
    "constituinte": "Curcumina (curcuminoides totais)",
    "forma_insumo": "Cúrcuma (forma não especificada — não confirmadamente o extrato de rizomas exigido)",
    "forma_anexo_i": "NÃO CONFIRMADA",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 84.21,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 4,
  "ingredient_name": "Cromo",
  "quantity": 0.25,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "0,25 mg cadastrados como 'Cromo' — mesma ambiguidade histórica deste catálogo (já registrada no memorial do antigo emagrecedor-em-capsula e no parecer do pré-treino): não se sabe se 0,25 mg é a massa do SAL (picolinato de cromo, forma usual neste catálogo) ou já a massa do cromo ELEMENTAR. NÃO presumo o lote (regra do dono) mesmo sendo o único fornecedor de cromo já visto no catálogo. Se SAL, a 12,34% de Cr (teor de um lote já usado noutro produto, Analitic 91190, NÃO confirmado para este): 0,25 × 0,1234 = 30,85 µg = 12,3% do teto, acima do mínimo (5,25 µg). Se já ELEMENTO: 250 µg = 100,0% do teto, no limite exato. Sob a leitura B da porção (ambiguidade cápsula-vs-porção, ver corpo do relatório), dobraria para 0,5 mg — se já-elemento, isso seria 200% do teto (estouro).",
    "e_sal": null,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 250,
    "minimo": 5.25,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Picolinato de cromo (CAS 14639-25-9) — forma presumida por padrão do catálogo, NÃO confirmada para este lote; III·Cromo (5,25); IV·Cromo (250)",
    "constituinte": "Cromo",
    "forma_insumo": "não identificada — presumivelmente picolinato de cromo pelo padrão do catálogo, sem laudo do lote",
    "forma_anexo_i": "Picolinato de cromo (referência, não confirmada)",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": null,
    "massa_insumo_mg": 0.25,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 5,
  "ingredient_name": "Vitamina D3",
  "quantity": 0.05,
  "unit": "mg",
  "meta": {
    "ativo": 50.0,
    "conta": "0,05 mg = 50 µg. Lido ao pé da letra como dose final de colecalciferol (não há declaração de potência de insumo diluído, ex.: '100.000 UI/g', que permitiria diferenciar massa de pó de dose final). 50 µg = 100,0% do teto de 50 µg (IN 361/2025, 1 µg = 40 UI) — no limite exato, sem margem. É o mesmo padrão já visto neste catálogo de valor batendo exato com o teto da norma, o que costuma indicar número copiado da norma em vez de calculado de um laudo de lote real. Sob a leitura B da porção (ver corpo do relatório), dobraria para 100 µg = 200% do teto.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 50,
    "minimo": 3,
    "status": "condicionado a laudo",
    "ativo_mg": 0.05,
    "laudo_lote": "não localizado — PENDENTE (sem laudo de potência do insumo)",
    "teor_fonte": "não informado — presumida dose final, não confirmado",
    "linha_anexo": "I·Vitamina D3 (Colecalciferol) (CAS 67-97-0); III·Vitamina D (3); IV·Vitamina D (50,0)",
    "constituinte": "Vitamina D",
    "forma_insumo": "não especificada (forma da vitamina D3 usada — pó diluído a que potência? não consta)",
    "forma_anexo_i": "Vitamina D3 (Colecalciferol)",
    "laudo_vencido": null,
    "pct_do_maximo": 100.0,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": 40,
    "massa_insumo_mg": 0.05,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "50 µg de Vitamina D"
  }
}
```

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 6,
  "ingredient_name": "Vitamina B12",
  "quantity": 0.0099,
  "unit": "mg",
  "meta": {
    "ativo": 9.9,
    "conta": "0,0099 mg = 9,9 µg. Lido ao pé da letra como dose final de vitamina B12 (sem laudo de potência de insumo diluído). 9,9 ÷ 9,94 = 99,6% do teto — praticamente no limite, sem margem de fabricação. Sob a leitura B da porção (ver corpo do relatório), dobraria para 19,8 µg = 199,2% do teto (estouro).",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 9.94,
    "minimo": 0.36,
    "status": "condicionado a laudo",
    "ativo_mg": 0.0099,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado — presumida dose final, não confirmado",
    "linha_anexo": "I·Metilcobalamina (CAS 13422-55-4) ou Hidroxocobalamina (forma não especificada); III·Vitamina B_12 (0,36); IV·Vitamina B_12 (9,94)",
    "constituinte": "Vitamina B12",
    "forma_insumo": "não especificada",
    "forma_anexo_i": "NÃO CONFIRMADA (Metilcobalamina ou Hidroxocobalamina, ambas autorizadas — forma real não consta)",
    "laudo_vencido": null,
    "pct_do_maximo": 99.6,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": null,
    "massa_insumo_mg": 0.0099,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "9,9 µg de Vitamina B12"
  }
}
```

```json
{
  "slug": "emagrecimento-em-capsulas",
  "ordem": 7,
  "ingredient_name": "Excipiente",
  "quantity": 441.62,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "excipiente",
    "ins": null,
    "massa_mg": 441.62,
    "laudo_lote": "não informado — composição do excipiente não aberta no cadastro",
    "observacao": "Nome genérico, sem abertura em substâncias/INS. Somado aos 7 insumos anteriores fecha exatamente 900,00 mg — metade da porção declarada de 1,8 g (1.800 mg). Ver §1.1 do relatório: bloqueio estrutural (ambiguidade cápsula-vs-porção) que precisa ser resolvido pelo dono/RT antes de qualquer selo.",
    "nome_no_memorial": null
  }
}
```

### 1.4 Veredito — `emagrecimento-em-capsulas`

**BLOQUEADO.** Não por um único motivo, mas por vários independentes, cada um já suficiente:

1. Ambiguidade estrutural entre massa por cápsula e massa por porção (fator 2×), que decide se cromo,
   vitamina D3 e vitamina B12 estão "no limite" ou "no dobro do limite" (§1.1).
2. Quatro extratos vegetais (feno-grego, café verde, laranja moro, cúrcuma) sem nenhum laudo de teor —
   sem isso não dá para saber quanto de marcador ativo (saponinas, ácido clorogênico, antocianinas,
   curcuminoides) a fórmula realmente entrega.
3. Forma química do cromo (sal vs. elemento) e do feno-grego/cúrcuma (forma física vs. forma exigida
   pelo Anexo I) não confirmadas.
4. O próprio cadastro já assume, por escrito, que a lista de ingredientes está "PENDENTE conferir com o
   RT" — ou seja, nem a fábrica fechou isso ainda.

---

## 2. `emagrecimento-em-gotas`

**Identificação:** líquido, porção **não definida** no cadastro (nem volume do frasco, nem número de
gotas por dose — `usage_instructions = 'PENDENTE - número de gotas por dose a definir'`, `net_weight`
nulo). Mesma origem do produto anterior (print de fórmula do dono, criado 17–18/09/2026, sem memorial).

### 2.1 Bloqueio estrutural — porção não definida

Sem porção diária definida (nem em mL, nem em número de gotas), **não é possível** calcular %VD nem
afirmar que os valores abaixo representam "por dia" — é um bloqueio de rotulagem básica (RDC 429/2020
exige porção declarada), à parte de qualquer conta de limite. **Sinalizo isto e sigo a orientação da
tarefa**: calculo a soma de massa e testo os valores exatamente como estão cadastrados, tratando-os
*como se* fossem a dose diária (única leitura possível hoje), deixando explícito que essa premissa em si
é uma pendência que precisa ser resolvida pelo dono/RT antes de qualquer coisa.

**Soma das 10 linhas:** 80 + 100 + 50 + 0,1 + 0,005 + 0,01 + 82,5 + 80 + 120 + 1,3 = **513,915 mg** —
não há porção declarada para comparar esse total.

### 2.2 Insumo a insumo (tratando os valores do cadastro como a dose diária)

| Insumo | Constituinte | Massa | Limite (adultos ≥19) | Situação |
|---|---|---|---|---|
| Extrato de Café Verde 80 mg | Ácido clorogênico | sem teor | NE / 400 mg | **PENDENTE** — sem laudo do lote |
| Cúrcuma 100 mg | Curcumina (curcuminoides totais) | sem teor | 80 / 130 mg | **PENDENTE** — sem laudo, forma não confirmada |
| Feno-grego 50 mg | Saponinas de glicosídeos de furostanol | sem teor | NE / 450 mg | **PENDENTE** — sem laudo, forma não confirmada |
| Cromo 0,1 mg | Cromo | ambíguo | 5,25 / 250 µg | **PENDENTE** — mesma ambiguidade sal/elemento; em qualquer leitura fica dentro da faixa (referência: se sal a 12,34%, ≈12,3 µg = 4,9% do teto; se já-elemento, 100 µg = 40% do teto) |
| Vitamina D3 0,005 mg (5 µg) | Vitamina D | dose final presumida | 3 / 50 µg | **CONDICIONADO A LAUDO** — 5 µg está dentro da faixa (166,7% do mínimo, 10,0% do máximo) |
| Vitamina B12 0,01 mg (10 µg) | Vitamina B12 | dose final presumida | 0,36 / 9,94 µg | **PENDENTE — excede o teto.** 10 ÷ 9,94 = **100,6% do teto**, mesmo antes de qualquer conversão de teor — ajuste simples (bastaria declarar ≤ 9,94 µg), mas real |
| Colina 82,5 mg | Colina | ambíguo (sal vs. elemento, forma não dita) | 82,5 / 3.235,15 mg | **PENDENTE** — valor bate EXATO com o mínimo da norma (padrão de número copiado, não calculado); se leitura for massa do sal (bitartarato, ~40,61% em lote já usado noutro produto — NÃO confirmado aqui), o teor elementar cairia a ≈33,5 mg = 40,6% do mínimo, ABAIXO do exigido |
| Cafeína 80 mg | Cafeína | presumida cafeína anidra | 75 / 200 mg | **CONFORME** (se pura) — 106,7% do mínimo, 40,0% do teto; única fonte de cafeína na fórmula |
| Extrato de Laranja Moro 120 mg | Antocianinas da laranja moro | sem teor | NE / 5 mg | **PENDENTE** — sem laudo; referência não confirmada: a 1,47% (lote de outro produto), 120×0,0147=1,76 mg=35,3% do teto |
| Vitamina B6 1,3 mg | Vitamina B6 | forma não dita | 0,26 / 98,60 mg | **CONFORME** com folga ampla em qualquer leitura (base ou sal) |

### 2.3 JSON de metadata proposto

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 0,
  "ingredient_name": "Extrato de Café Verde",
  "quantity": 80.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "80 mg de massa do insumo. Nome bate com forma autorizada do Anexo I. Sem laudo de teor de ácido clorogênico para este produto (novo, sem memorial). Referência não confirmada: a 64,05% (lote de outro produto do catálogo), 80×0,6405=51,2 mg=12,8% do teto — só para dimensionar.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 400,
    "minimo": null,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de café verde (IN 102/2021); III·Ácido clorogênico (NE); IV·Ácido clorogênico (400)",
    "constituinte": "Ácido clorogênico",
    "forma_insumo": "Extrato de café verde (fornecedor/lote não identificado)",
    "forma_anexo_i": "Extrato de café verde",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 80.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 1,
  "ingredient_name": "Cúrcuma",
  "quantity": 100.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "100 mg de massa do insumo, nome genérico ('Cúrcuma'), não confirma se é o 'Extrato de rizomas de cúrcuma' exigido pelo Anexo I. Limite desde IN 438/2026 é sobre curcuminoides TOTAIS. Sem laudo de teor.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 130,
    "minimo": 80,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de rizomas de cúrcuma (Curcuma longa L.) (IN 438/2026) — forma cadastrada NÃO CONFIRMADA como esta; III·Curcumina/curcuminoides totais^xv (80); IV·Curcumina/curcuminoides totais^x (130)",
    "constituinte": "Curcumina (curcuminoides totais)",
    "forma_insumo": "Cúrcuma (forma não especificada)",
    "forma_anexo_i": "NÃO CONFIRMADA",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 100.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 2,
  "ingredient_name": "Feno-grego",
  "quantity": 50.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "50 mg de massa do insumo, forma física não especificada. Anexo I só autoriza 'Extrato de semente de feno-grego'. Sem laudo de teor de saponinas.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 450,
    "minimo": null,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de semente de feno-grego (Trigonella foenum-graecum L.) — forma cadastrada NÃO CONFIRMADA; III·Saponinas de glicosídeos de furostanol (NE); IV·Saponinas de glicosídeos de furostanol (450)",
    "constituinte": "Saponinas de glicosídeos de furostanol",
    "forma_insumo": "Feno-grego (forma física não especificada)",
    "forma_anexo_i": "NÃO CONFIRMADA",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 50.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 3,
  "ingredient_name": "Cromo",
  "quantity": 0.1,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "0,1 mg cadastrados como 'Cromo' — mesma ambiguidade sal/elemento do resto do catálogo, não presumo o lote. Se sal a 12,34% (referência, não confirmada): 0,1×0,1234=12,34 µg=4,9% do teto, 235% do mínimo — dentro da faixa. Se já elemento: 100 µg=40,0% do teto — também dentro da faixa. Em QUALQUER leitura, este insumo fica dentro do intervalo — a pendência é só de laudo/forma, não de risco de estouro.",
    "e_sal": null,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 250,
    "minimo": 5.25,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Picolinato de cromo (referência, não confirmada); III·Cromo (5,25); IV·Cromo (250)",
    "constituinte": "Cromo",
    "forma_insumo": "não identificada",
    "forma_anexo_i": "Picolinato de cromo (referência, não confirmada)",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": null,
    "massa_insumo_mg": 0.1,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 4,
  "ingredient_name": "Vitamina D3",
  "quantity": 0.005,
  "unit": "mg",
  "meta": {
    "ativo": 5.0,
    "conta": "0,005 mg = 5 µg, lido como dose final. 5 ÷ 3 (mínimo) = 166,7% do mínimo; 5 ÷ 50 (máximo) = 10,0% do máximo — dentro da faixa com folga, mas ainda sem laudo de potência do insumo.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 50,
    "minimo": 3,
    "status": "condicionado a laudo",
    "ativo_mg": 0.005,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado — presumida dose final",
    "linha_anexo": "I·Vitamina D3 (Colecalciferol); III·Vitamina D (3); IV·Vitamina D (50,0)",
    "constituinte": "Vitamina D",
    "forma_insumo": "não especificada",
    "forma_anexo_i": "Vitamina D3 (Colecalciferol)",
    "laudo_vencido": null,
    "pct_do_maximo": 10.0,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": 40,
    "massa_insumo_mg": 0.005,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "5 µg de Vitamina D"
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 5,
  "ingredient_name": "Vitamina B12",
  "quantity": 0.01,
  "unit": "mg",
  "meta": {
    "ativo": 10.0,
    "conta": "0,01 mg = 10 µg, lido como dose final. 10 ÷ 9,94 = 100,6% do teto — EXCEDE o limite do Anexo IV mesmo antes de qualquer conversão de teor de insumo. É a única linha desta fórmula com estouro confirmado ao pé da letra (não depende de laudo para ver o problema; um laudo só poderia PIORAR a leitura, nunca resolver um valor declarado já acima do teto, a menos que '10 µg' seja massa de pó diluído, não dose final — PENDENTE confirmar).",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 9.94,
    "minimo": 0.36,
    "status": "pendente",
    "ativo_mg": 0.01,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado — se dose final, excede o teto; se massa de insumo diluído, dose real pode ser menor",
    "linha_anexo": "I·Metilcobalamina ou Hidroxocobalamina (forma não especificada); III·Vitamina B_12 (0,36); IV·Vitamina B_12 (9,94)",
    "constituinte": "Vitamina B12",
    "forma_insumo": "não especificada",
    "forma_anexo_i": "NÃO CONFIRMADA",
    "laudo_vencido": null,
    "pct_do_maximo": 100.6,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": null,
    "massa_insumo_mg": 0.01,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "10 µg de Vitamina B12 (se dose final — excede o teto)"
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 6,
  "ingredient_name": "Colina",
  "quantity": 82.5,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "82,5 mg cadastrados como 'Colina', sem indicar forma química nem se é massa do elemento ou do sal. O Anexo I só autoriza colina como SAL (bitartarato ou cloreto) — não existe entrada de colina pura na lista. O valor bate EXATO (100,00%) com o mínimo do Anexo III (82,5 mg) — padrão já visto neste catálogo de número copiado direto da norma, não calculado de laudo. Se lido como elementar, está no piso mínimo, sem margem. Se for massa do SAL (ex.: bitartarato a ~40,61%, teor de um lote já usado noutro produto do catálogo — NÃO confirmado aqui), o teor elementar cairia para ≈33,5 mg = 40,6% do mínimo — ABAIXO do exigido.",
    "e_sal": null,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 3235.15,
    "minimo": 82.5,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Bitartarato de colina/Hidrogênio tartarato de colina OU Cloreto de colina (forma não especificada); III·Colina (82,5); IV·Colina (3.235,15)",
    "constituinte": "Colina",
    "forma_insumo": "não especificada — sal não identificado",
    "forma_anexo_i": "NÃO CONFIRMADA",
    "laudo_vencido": null,
    "pct_do_maximo": 2.55,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 82.5,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 7,
  "ingredient_name": "Cafeína",
  "quantity": 80.0,
  "unit": "mg",
  "meta": {
    "ativo": 80.0,
    "conta": "80 mg cadastrados como 'Cafeína' (presume-se cafeína anidra, forma pura — não há outra fonte de cafeína nesta fórmula). 80 ÷ 75 (mínimo) = 106,7%; 80 ÷ 200 (máximo) = 40,0% — dentro da faixa com boa folga.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 200,
    "minimo": 75,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 80.0,
    "laudo_lote": "não localizado — PENDENTE (mas dose dentro da faixa em qualquer leitura de pureza razoável)",
    "teor_fonte": "presumida cafeína anidra pura — não confirmado por laudo",
    "linha_anexo": "I·Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2); III·Cafeína (75); IV·Cafeína^vi (200)",
    "constituinte": "Cafeína",
    "forma_insumo": "presumida cafeína anidra",
    "forma_anexo_i": "Cafeína/1,3,7-Trimethylxanthine",
    "laudo_vencido": null,
    "pct_do_maximo": 40.0,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 80.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 8,
  "ingredient_name": "Extrato de Laranja Moro",
  "quantity": 120.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "120 mg de massa do insumo — dose bem maior que a usada em outros produtos deste catálogo (5-100 mg). Sem laudo de teor de antocianinas. Referência não confirmada: a 1,47% (lote de outro produto), 120×0,0147=1,76 mg=35,3% do teto.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 5,
    "minimo": null,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Extrato de laranja moro (Citrus sinensis (L.) Osbeck); III·Antocianinas da laranja moro (NE); IV·Antocianinas da laranja moro (5)",
    "constituinte": "Antocianinas da laranja moro",
    "forma_insumo": "Extrato de laranja moro (fornecedor/lote não identificado)",
    "forma_anexo_i": "Extrato de laranja moro (Citrus sinensis (L.) Osbeck)",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 120.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "emagrecimento-em-gotas",
  "ordem": 9,
  "ingredient_name": "Vitamina B6",
  "quantity": 1.3,
  "unit": "mg",
  "meta": {
    "ativo": 1.3,
    "conta": "1,3 mg, forma não especificada (base piridoxina ou sal cloridrato de piridoxina). Em QUALQUER leitura fica muito acima do mínimo e muito abaixo do teto: como base, 1,3÷0,26=500% do mínimo, 1,3÷98,60=1,3% do teto; como sal (fator ~0,8227), 1,3×0,8227=1,07 mg, ainda 411% do mínimo e 1,1% do teto. Risco regulatório desprezível nesta dose independentemente da forma.",
    "e_sal": null,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 98.6,
    "minimo": 0.26,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 1.3,
    "laudo_lote": "não localizado — PENDENTE (mas irrelevante para o veredito nesta dose)",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Cloridrato de piridoxina ou Fosfato de piridoxal (forma não especificada); III·Vitamina B_6 (0,26); IV·Vitamina B_6 (98,60)",
    "constituinte": "Vitamina B6",
    "forma_insumo": "não especificada",
    "forma_anexo_i": "NÃO CONFIRMADA (ambas as formas do Anexo I dão resultado conforme)",
    "laudo_vencido": null,
    "pct_do_maximo": 1.3,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 1.3,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

### 2.4 Veredito — `emagrecimento-em-gotas`

**BLOQUEADO.** Motivos, cada um independente:

1. Porção diária não definida no cadastro (nem volume, nem gotas/dia) — bloqueia inclusive a rotulagem
   básica, não só a conferência de dose.
2. Vitamina B12 (10 µg), lida ao pé da letra como dose final, **excede o teto do Anexo IV em 0,6%** —
   achado confirmado, não pendência de informação.
3. Colina (82,5 mg) bate exatamente com o piso mínimo teórico e tem forma química indefinida — se for
   massa do sal em vez de elemento, cai abaixo do mínimo exigido.
4. Quatro extratos vegetais (café verde, cúrcuma, feno-grego, laranja moro) sem laudo de teor.

Cafeína (80 mg) e vitamina B6 (1,3 mg) ficam dentro da faixa com folga em qualquer leitura razoável, e o
cromo (0,1 mg) fica dentro da faixa nas duas leituras possíveis (sal ou elemento) — não são o problema
desta fórmula.

---

## 3. `omega-pro-tg`

**Identificação:** softgel, porção "1 g (2 softgels)", 30 porções (60 softgels), adultos ≥19 anos.
**Confirmado sem alteração desde 16/09/2026** (única das 23 fórmulas reformuladas que a migration de
composição não tocou) — composição de hoje idêntica à que o memorial
`docs/conformidade/reformulacao/omega-pro-tg.md` já tinha auditado.

### 3.1 Reavaliação do zero, com os limites reconfirmados na fonte nesta tarefa

| Insumo | Massa | Papel | Limite (adultos ≥19), reconfirmado agora |
|---|---|---|---|
| Óleo de Peixe | 1.000 mg | fonte de lipídeos / veículo de EPA+DHA | Lipídeos totais: mínimo **5 g**, máximo NE |
| Ômega-3 (total) | 316,5 mg | informativo (soma dos 3 abaixo: 185,34+123,56+7,6=316,5 — fecha) | — |
| EPA | 185,34 mg | componente de EPA+DHA | — |
| DHA | 123,56 mg | componente de EPA+DHA | — |
| Outros Ácidos Graxos Ômega-3 | 7,6 mg | informativo | — |
| **EPA+DHA somados** | **308,90 mg** | constituinte com linha própria | mínimo **37,5 mg**, máximo **2.000 mg** |

**A mesma ambiguidade regulatória do memorial de 16/09/2026 continua de pé, e eu a reconfirmei na fonte
primária nesta tarefa** (não apenas repeti o texto antigo):

- **Leitura pela linha "Lipídeos totais":** o óleo de peixe é constituinte do grupo Lipídeos; 1 g de
  óleo é 20% do mínimo de 5 g exigido para esse grupo — **abaixo do mínimo**.
- **Leitura pela linha "EPA e DHA":** o óleo de peixe é veículo de EPA+DHA, que têm linha própria
  (37,5–2.000 mg); 308,90 mg = **824% do mínimo**, 15,4% do teto — **conforme com folga**.

Nenhuma das duas leituras substitui a outra na norma — as duas linhas existem lado a lado no Anexo III/
IV, e o texto não diz qual prevalece para "óleo de peixe" puro (sem alegação de saúde específica
declarada). **Não decido entre elas** — é decisão do RT, como já registrado no memorial de 16/09/2026.

**O que continua sem solução, e por quê:** procurei nesta tarefa por qualquer laudo do óleo de peixe
usado neste produto — não encontrei nenhum documento novo além dos já catalogados em 16/09/2026 (quatro
laudos de "ômega" em disco, todos incompatíveis: dois são pó, não óleo; um está vencido; um é de alga,
não de peixe). **Sem laudo do óleo não dá para confirmar** a forma física (TG/éster etílico/rTG), o
perfil de ácidos graxos, nem — ponto que o enunciado desta tarefa pede para verificar — o índice de
peróxido/TOTOX (estabilidade oxidativa), que a IN 28/2018 não regula diretamente no Anexo III/IV (é
parâmetro de qualidade do insumo, não de dose), mas que qualquer laudo de óleo de peixe sério traz.
**Isto é, muito provavelmente, o motivo real do "NÃO RESOLVIDO" da auditoria anterior** — não falta
entendimento da norma, falta o Certificado de Análise do lote.

### 3.2 JSON de metadata proposto

```json
{
  "slug": "omega-pro-tg",
  "ordem": 0,
  "ingredient_name": "Óleo de Peixe",
  "quantity": 1000.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "1.000 mg = 1 g de óleo de peixe. Duas leituras regulatórias possíveis, nenhuma resolvida: (1) como 'Lipídeos totais' (Anexo I, grupo Lipídeos): mínimo 5 g — 1 g é 20,0% disso, ABAIXO do mínimo; (2) como veículo de EPA+DHA (linha própria no Anexo III/IV): não tem limite de massa próprio, o que importa é o EPA+DHA que entrega (ver linha própria abaixo). Sem laudo do óleo (forma TG/éster/rTG, perfil de ácidos graxos, TOTOX/oxidação, metais pesados) para decidir qual leitura é correta ou para confirmar o teor real.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": null,
    "minimo": 5000,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — 4 laudos de 'ômega' em disco, nenhum compatível (2 são pó, 1 vencido, 1 é de alga)",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Óleo de peixe (grupo Lipídeos, Redação IN 431/2026); III·Lipídeos totais (5 g); IV·Lipídeos totais (NE)",
    "constituinte": "Lipídeos totais (leitura 1) — ver leitura alternativa por EPA+DHA",
    "forma_insumo": "óleo de peixe TG (presumido pelo cadastro, sem confirmação)",
    "forma_anexo_i": "Óleo de peixe",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "g",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "g",
    "fator_conversao": null,
    "massa_insumo_mg": 1000.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "omega-pro-tg",
  "ordem": 1,
  "ingredient_name": "Ômega-3",
  "quantity": 316.5,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "informativo",
    "ins": null,
    "massa_mg": 316.5,
    "laudo_lote": "não se aplica — linha informativa, soma dos componentes abaixo (185,34+123,56+7,6=316,5, fecha exato)",
    "observacao": "Não é um insumo à parte; é o total dos 3 componentes seguintes (EPA, DHA e outros ômega-3), já contido neles.",
    "nome_no_memorial": "Ômega-3 total"
  }
}
```

```json
{
  "slug": "omega-pro-tg",
  "ordem": 2,
  "ingredient_name": "EPA (ácido eicosapentaenoico)",
  "quantity": 185.34,
  "unit": "mg",
  "meta": {
    "ativo": 308.9,
    "conta": "EPA (185,34 mg) + DHA (123,56 mg) = 308,90 mg somados, contra a linha própria do Anexo III/IV 'EPA e DHA'. 308,90 ÷ 37,5 (mínimo) = 823,7%; 308,90 ÷ 2.000 (máximo) = 15,4% — CONFORME com folga larga, se esta for a leitura regulatória adotada (ver ambiguidade com 'Lipídeos totais' na linha do Óleo de Peixe). Sem laudo do óleo para confirmar estes valores no lote real.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 2000,
    "minimo": 37.5,
    "status": "pendente",
    "ativo_mg": 308.9,
    "laudo_lote": "não localizado — PENDENTE",
    "teor_fonte": "não informado — valor do cadastro, sem laudo do lote",
    "linha_anexo": "I·Ácido eicosapentaenóico (EPA) obtido de óleo de alga Schizochytrium sp. (referência de nomenclatura — óleo de peixe usa a entrada genérica 'Óleo de peixe', sem linha própria de EPA/DHA de peixe no Anexo I); III·EPA e DHA (37,5, somados); IV·EPA e DHA (2.000, somados)",
    "constituinte": "EPA e DHA (somados)",
    "forma_insumo": "componente do óleo de peixe declarado (leitura 2 — ver ambiguidade regulatória)",
    "forma_anexo_i": "Óleo de peixe (não há entrada própria de 'EPA/DHA de peixe' no Anexo I — só de alga/atum/lisinato)",
    "laudo_vencido": null,
    "pct_do_maximo": 15.4,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 185.34,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "308,90 mg de EPA+DHA somados"
  }
}
```

```json
{
  "slug": "omega-pro-tg",
  "ordem": 3,
  "ingredient_name": "DHA (ácido docosaexaenoico)",
  "quantity": 123.56,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "informativo",
    "ins": null,
    "massa_mg": 123.56,
    "laudo_lote": "não localizado — PENDENTE",
    "observacao": "Componente do total EPA+DHA=308,90 mg já avaliado na linha do EPA (ordem 2), para não duplicar o mesmo veredito em duas linhas.",
    "nome_no_memorial": "DHA"
  }
}
```

```json
{
  "slug": "omega-pro-tg",
  "ordem": 4,
  "ingredient_name": "Outros Ácidos Graxos Ômega-3",
  "quantity": 7.6,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "informativo",
    "ins": null,
    "massa_mg": 7.6,
    "laudo_lote": "não localizado — PENDENTE",
    "observacao": "Fecha a soma de Ômega-3 total (316,5 = 185,34+123,56+7,6). Sem linha própria no Anexo III/IV para 'outros ômega-3' isolados.",
    "nome_no_memorial": "Outros ácidos graxos ômega-3"
  }
}
```

### 3.3 Veredito — `omega-pro-tg`

**NÃO RESOLVIDO (reconfirmado).** Reavaliei do zero e a mesma lacuna da auditoria de 16/09/2026
persiste: **falta o laudo do óleo de peixe** — sem ele, não dá para confirmar forma física, perfil de
ácidos graxos, estabilidade oxidativa (TOTOX) nem qual das duas leituras regulatórias (Lipídeos totais
vs. EPA+DHA linha própria) o RT deve adotar. Se o laudo confirmar EPA 185,34 mg + DHA 123,56 mg e o RT
adotar a leitura por EPA+DHA, a fórmula fica **conforme com folga** (15,4% do teto). Se o RT exigir a
leitura por Lipídeos totais, a porção precisaria subir para 5 g de óleo/dia — mudança de conceito de
produto, decisão do dono.

---

## 4. `pre-treino-creatina-sabor-limao-420g`

**Identificação:** pó solúvel sabor limão, porção "14 g (1 dosador)", peso líquido 420 g (30 doses),
adultos ≥19 anos. **Composição = rótulo real da fábrica** (RT Farm. Anderson C. Barbosa, CRF/MT 5526),
trocada em 17–18/09/2026 — a mesma que o `PARECER-PRE-TREINO-CESIO-137-2026-09-15.md` já tinha auditado
em detalhe. `ingredients_list` do banco confirma as formas químicas de quase todo insumo (usado abaixo
para resolver ambiguidades que o parecer antigo deixou em aberto).

### 4.1 O que mudou desde o parecer de 15/09/2026: uma pendência virou confirmação

O parecer de 15/09/2026 tentou confirmar o texto do Anexo VI sobre fracionamento da beta-alanina e
**não conseguiu** ("a consulta não alcançou esse anexo"). **Eu consegui, nesta tarefa**, lendo a
transcrição literal do Anexo VI:

> *"Beta-alanina | A advertência 'Quantidade diária máxima de 2 g com doses divididas de, no máximo,
> 300 mg, com intervalo de duas horas entre as doses.' deve constar na rotulagem do produto."*
> (Suplementos e requisito incluídos pela Instrução Normativa - IN nº 102, de 15/10/2021)

O modo de uso deste produto é **"1 vez ao dia"**, com **2.000 mg de beta-alanina numa única tomada**.
Isto **contraria, de forma confirmada** (não é mais uma dúvida pendente), a condição do Anexo VI — a
quantidade total (2 g) está dentro do teto do Anexo IV, mas o **modo de administração** (dose única, não
fracionada em ≤300 mg a cada 2h) é uma não conformidade objetiva. **Isto, sozinho, já impede o selo.**

### 4.2 Insumo a insumo (formas químicas confirmadas pelo `ingredients_list` do próprio rótulo)

| # | Insumo | Forma (do `ingredients_list` do rótulo) | Massa | Limite (adultos ≥19) | % do teto | Situação |
|---|---|---|---|---|---|---|
| 0 | Creatina monohidratada | Creatina monohidratada (CAS 6020-87-7) | 5.000 mg | 3.000 / 5.000 mg | **100,0%** | **mantido (dose do rótulo)** — no teto exato, sem margem |
| 1 | Beta-alanina | Beta-alanina (CAS 107-95-9) | 2.000 mg | — / 2.000 mg | 100,0% | **NÃO CONFORME confirmado** — quantidade total ok, mas dose única viola o fracionamento do Anexo VI (§4.1) |
| 2 | Ácido Cítrico | acidulante ácido cítrico (INS 330) | 1.100 mg | aditivo — categoria/limite IN 211/2023 não conferido nesta tarefa | — | **pendente-verificação** (aditivo, não constituinte de Anexo III/IV) |
| 3 | Arginina | "L-arginina" (rótulo) → L-Arginina (CAS 74-79-3) | 1.000 mg | NE / 3.810 mg | 26,2% | **conforme**, com folga ampla |
| 4 | Taurina | "taurina" → Taurina (CAS 107-35-7) | 1.000 mg | NE / 2.000 mg | 50,0% | **conforme** |
| 5 | Tirosina | "L-tirosina" → L-Tirosina (CAS 60-18-4) | 1.000 mg | 262,5 (somado c/ fenilalanina, ausente aqui) / 2.750 mg | 36,4% | **conforme** |
| 6 | L-Carnitina | "L-carnitina" → Levocarnitina/L-carnitina (CAS 541-15-1) | 1.000 mg | NE / 2.000 mg | 50,0% | **conforme** |
| 7 | Maltodextrina | maltodextrina | 492,44 mg | veículo, sem limite de Anexo III/IV | — | ver §4.3 (soma não fecha exato) |
| 8 | Magnésio | "magnesio (fonte a definir)" — **literalmente indefinido no próprio rótulo** | 350 mg | 63 / 350 mg | **100,0% se elemento** | **PENDENTE** — se sal (ex.: bisglicinato ~30,2% Mg, lote já usado noutro produto do catálogo, NÃO confirmado aqui), cairia a ≈105,8 mg = 30,2% do teto |
| 9 | Aromatizante de Limão | aromatizante idêntico ao natural de limão | 350 mg | aditivo/aromatizante — RDC 725/2022 | — | **pendente-verificação** (não é cápsula, então a restrição de "14.2" não se aplica; teto de 2% se de extrato vegetal, não conferido) |
| 10 | Guaraná em Pó | "guarana (Paullinia cupana)" | 350 mg | fonte adicional de Cafeína (Anexo I) | ver §4.4 | **CONDICIONADO A LAUDO** — forma agora É a autorizada ("Guaraná em pó"), resolvendo a antiga NC5 do parecer; falta teor de cafeína do lote atual |
| 11 | Cafeína | "cafeina anidra" → Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2) | 150 mg | 75 / 200 mg (nota vi — 400 mg só p/ atletas, não usado aqui) | 75,0% isolada | ver §4.4 (cafeína TOTAL, somada ao guaraná) |
| 12 | Dióxido de Silício | antiumectante dióxido de silício (INS 551) | 118 mg | aditivo — categoria/limite IN 211/2023 não conferido | — | **pendente-verificação** |
| 13 | Vitamina B6 | "cloridrato de piridoxina" (massa do SAL) | 90 mg | 0,26 / 98,60 mg | 91,3% (sem converter) / 75,1% (convertido a piridoxina livre, fator 0,8227) | **conforme**, nas duas leituras |
| 14 | Sucralose | edulcorante sucralose (INS 955) | 90 mg | aditivo — proibida em cápsula/comprimido (14.2); este produto é PÓ, não cápsula, então essa proibição específica não parece aplicável | — | **pendente-verificação** do limite quantitativo exato para "pó solúvel" na IN 211/2023 |
| 15 | Vitamina B3 | "nicotinamida" → Nicotinamida/Niacinamida (CAS 98-92-0) | 35 mg | 2,4 / 35 mg | **100,0%** | **mantido (dose do rótulo)** — no teto exato |
| 16 | Vitamina D3 | "colecalciferol" → Vitamina D3 (CAS 67-97-0); 2.000 UI ÷ 40 = 50 µg | 2.000 UI (50 µg) | 3 / 50 µg | **100,0%** | **mantido (dose do rótulo)** — no teto exato |
| 17 | Vitamina B12 | "metilcobalamina" → Metilcobalamina (CAS 13422-55-4) | 9,9 mcg | 0,36 / 9,94 µg | 99,6% | **mantido (dose do rótulo)** — quase no teto |

### 4.3 Soma da porção

5.000 + 2.000 + 1.100 + 1.000 + 1.000 + 1.000 + 1.000 + 492,44 + 350 + 350 + 350 + 150 + 118 + 90 + 90 +
35 + 0,05 (D3, 2.000 UI = 50 µg) + 0,0099 (B12, 9,9 µg) = **14.125,50 mg**, contra uma porção declarada
de 14 g (14.000 mg) — **100,9% do peso da porção**, 125,50 mg acima do declarado. É uma inconsistência
bem menor que a do rótulo antigo (que chegava a 107,14%), mas ainda real: a maltodextrina (492,44 mg)
parece ter ficado do rótulo anterior e não foi recalculada como "q.s.p." para fechar exato em 14 g depois
dos outros ajustes.

### 4.4 Cafeína total — mesma metodologia do parecer de 15/09, com a massa de guaraná de hoje (350 mg)

Cafeína anidra fixa em 150 mg (confirmada pelo `ingredients_list`). A forma do guaraná **agora é a
autorizada** ("Guaraná em pó (Paullinia cupana)"), o que resolve o problema de nomenclatura do parecer
antigo — mas **não há laudo do lote atual** (350 mg é uma dose nova, diferente de todas as anteriores
já vistas neste projeto: 515 mg no rótulo antigo, 224,5 mg na ficha da fábrica de agosto, 250 mg na
proposta de reformulação). Cenários, todos com a mesma ressalva de procedência do parecer original:

| Cenário | Teor de cafeína no guaraná | Cafeína do guaraná | Cafeína total (150 + guaraná) | % do teto (200 mg) |
|---|---|---|---|---|
| Teor de um lote já usado noutro produto deste catálogo (5,11%, NÃO confirmado para este lote) | 5,11% | 350×0,0511=17,9 mg | 167,9 mg | 84,0% — conforme |
| Definição geral de mercado para "extrato" de guaraná (3–5%, achado nesta tarefa por WebSearch — não é texto da IN 28/2018) | 3–5% | 10,5–17,5 mg | 160,5–167,5 mg | 80,3–83,8% — conforme |
| Variação real medida em pós de guaraná comercializados (0,18–0,93%, estudo independente achado nesta tarefa) | 0,18–0,93% | 0,63–3,26 mg | 150,6–153,3 mg | 75,3–76,6% — conforme |
| Teor citado internamente pela fábrica em memorando sem laudo formal (22,35%, já registrado no parecer de 15/09) | 22,35% | 350×0,2235=78,2 mg | 228,2 mg | **114,1% — estouraria o teto** |

**Leitura:** em quase todos os cenários com alguma base (lote real do catálogo, definição de mercado,
estudo de variação real), a cafeína total fica **dentro do limite**, numa folga confortável — bem melhor
que o rótulo antigo. O único cenário de risco é o teor de 22,35% citado internamente pela fábrica, que
**não tem laudo, fornecedor, lote nem data identificados** (mesma ressalva já registrada em 15/09/2026).
**Continua PENDENTE de laudo do lote de guaraná realmente em uso** — não decido entre os cenários.

### 4.5 JSON de metadata proposto

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 0,
  "ingredient_name": "Creatina monohidratada",
  "quantity": 5000.0,
  "unit": "mg",
  "meta": {
    "ativo": 5000.0,
    "conta": "5.000 mg = 100,00% do teto do Anexo IV (5.000 mg, redação da IN 373/2025, retificada nos DOU 113 e 121/2025). Mínimo do Anexo III é 3.000 mg. Dose do rótulo real da fábrica, no teto exato, sem margem de fabricação — mesmo padrão já identificado no parecer de 15/09/2026.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 5000,
    "minimo": 3000,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 5000.0,
    "laudo_lote": "não localizado nesta tarefa para o lote atual — laudo de outro lote já usado neste catálogo (217949, validade 22/09/2028, 100,5% b.s.) não confirmado como o mesmo",
    "teor_fonte": "não informado para este lote",
    "linha_anexo": "I·Creatina monohidratada (CAS 6020-87-7); III·Creatina (3.000); IV·Creatina (5.000, IN 373/2025)",
    "constituinte": "Creatina",
    "forma_insumo": "Creatina monohidratada",
    "forma_anexo_i": "Creatina monohidratada",
    "laudo_vencido": null,
    "pct_do_maximo": 100.0,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 5000.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 1,
  "ingredient_name": "Beta-alanina",
  "quantity": 2000.0,
  "unit": "mg",
  "meta": {
    "ativo": 2000.0,
    "conta": "2.000 mg = 100,00% do teto do Anexo IV (2 g), dentro do limite de QUANTIDADE. MAS o modo de uso do rótulo é '1 vez ao dia' — os 2.000 mg saem numa ÚNICA tomada. O Anexo VI da IN 28/2018 exige, textualmente (confirmado nesta tarefa, o que o parecer de 15/09/2026 não tinha conseguido confirmar): 'Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses.' (IN 102/2021). Isto é uma NÃO CONFORMIDADE CONFIRMADA de modo de administração, não uma dúvida de dado. O campo 'status' abaixo usa o vocabulário fechado do schema ('pendente' é o mais próximo disponível), mas a leitura correta é REPROVADO — resolve-se fracionando o uso (várias tomadas de até 300 mg, 2h de intervalo) ou reduzindo a dose por tomada, nunca mantendo '1 vez ao dia' com 2.000 mg.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 2000,
    "minimo": null,
    "status": "pendente",
    "ativo_mg": 2000.0,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "não informado para este lote",
    "linha_anexo": "I·Beta-alanina (CAS 107-95-9); III·(sem linha de mínimo); IV·Beta-alanina (2, IN 102/2021); VI·Beta-alanina — condição de fracionamento (300 mg/dose, intervalo de 2h, IN 102/2021)",
    "constituinte": "Beta-alanina",
    "forma_insumo": "Beta-alanina",
    "forma_anexo_i": "Beta-alanina",
    "laudo_vencido": null,
    "pct_do_maximo": 100.0,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 2000.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 2,
  "ingredient_name": "Ácido Cítrico",
  "quantity": 1100.0,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "aditivo",
    "ins": "INS 330",
    "massa_mg": 1100.0,
    "laudo_lote": "não informado",
    "observacao": "Acidulante. Limite quantitativo exato para a categoria 'pó solúvel para preparo de bebida' na IN 211/2023 não foi conferido nesta tarefa (o texto literal dessa IN não está transcrito neste projeto) — pendente-verificação, risco considerado baixo por ser aditivo de uso amplo em bebidas em pó.",
    "nome_no_memorial": "Acidulante ácido cítrico"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 3,
  "ingredient_name": "Arginina",
  "quantity": 1000.0,
  "unit": "mg",
  "meta": {
    "ativo": 1000.0,
    "conta": "1.000 mg. O ingredients_list do rótulo declara 'L-arginina' (base livre, não sal) — CAS 74-79-3, forma autorizada. Anexo III: NE (sem mínimo). Anexo IV: 3.810 mg. 1.000 ÷ 3.810 = 26,2% do teto — CONFORME com folga ampla (bem diferente do rótulo de 28/05/2026, que cravava exatamente os 3.810 mg do teto).",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 3810,
    "minimo": null,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 1000.0,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "declarado como L-arginina base no ingredients_list do rótulo — não confirmado por laudo",
    "linha_anexo": "I·L-Arginina (CAS 74-79-3); III·Arginina (NE); IV·Arginina (3.810)",
    "constituinte": "Arginina",
    "forma_insumo": "L-arginina (base livre, conforme ingredients_list do rótulo)",
    "forma_anexo_i": "L-Arginina",
    "laudo_vencido": null,
    "pct_do_maximo": 26.2,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 1000.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 4,
  "ingredient_name": "Taurina",
  "quantity": 1000.0,
  "unit": "mg",
  "meta": {
    "ativo": 1000.0,
    "conta": "1.000 mg, forma 'taurina' (CAS 107-35-7), autorizada. Anexo III NE, Anexo IV 2.000 mg. 1.000 ÷ 2.000 = 50,0% do teto — CONFORME com folga.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 2000,
    "minimo": null,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 1000.0,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Taurina (CAS 107-35-7); III·Taurina (NE); IV·Taurina (2.000)",
    "constituinte": "Taurina",
    "forma_insumo": "Taurina",
    "forma_anexo_i": "Taurina",
    "laudo_vencido": null,
    "pct_do_maximo": 50.0,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 1000.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 5,
  "ingredient_name": "Tirosina",
  "quantity": 1000.0,
  "unit": "mg",
  "meta": {
    "ativo": 1000.0,
    "conta": "1.000 mg, forma 'L-tirosina' (CAS 60-18-4), autorizada. Anexo III (nota viii): 'a soma da quantidade de fenilalanina e tirosina deve ser de, no mínimo, 262,5 mg' — este produto não declara fenilalanina, então os 1.000 mg de tirosina isolados já cobrem a exigência combinada (1.000 > 262,5). Anexo IV: 2.750 mg. 1.000 ÷ 2.750 = 36,4% do teto — CONFORME.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 2750,
    "minimo": 262.5,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 1000.0,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "não informado",
    "linha_anexo": "I·L-Tirosina (CAS 60-18-4); III·Tirosina^viii, somada com fenilalanina (262,5); IV·Tirosina^viii (2.750)",
    "constituinte": "Tirosina",
    "forma_insumo": "L-tirosina",
    "forma_anexo_i": "L-Tirosina",
    "laudo_vencido": null,
    "pct_do_maximo": 36.4,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 1000.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 6,
  "ingredient_name": "L-Carnitina",
  "quantity": 1000.0,
  "unit": "mg",
  "meta": {
    "ativo": 1000.0,
    "conta": "1.000 mg, forma 'L-carnitina' (Levocarnitina/L-carnitina, CAS 541-15-1), autorizada. Anexo III NE, Anexo IV 2.000 mg. 1.000 ÷ 2.000 = 50,0% do teto — CONFORME com folga.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 2000,
    "minimo": null,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 1000.0,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Levocarnitina/L-carnitina (CAS 541-15-1); III·L-Carnitina (NE); IV·L-Carnitina (2.000)",
    "constituinte": "L-Carnitina",
    "forma_insumo": "L-carnitina",
    "forma_anexo_i": "Levocarnitina/L-carnitina",
    "laudo_vencido": null,
    "pct_do_maximo": 50.0,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 1000.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 7,
  "ingredient_name": "Maltodextrina",
  "quantity": 492.44,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "veiculo",
    "ins": null,
    "massa_mg": 492.44,
    "laudo_lote": "não informado",
    "observacao": "Veículo/carga. Somando todos os 18 insumos do rótulo real, a porção fecha em 14.125,50 mg contra 14.000 mg declarados (100,9%, 125,50 mg acima) — pequena inconsistência, provavelmente porque esta massa de maltodextrina não foi recalculada como q.s.p. depois dos outros ajustes de dose feitos entre versões do rótulo.",
    "nome_no_memorial": "Maltodextrina"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 8,
  "ingredient_name": "Magnésio",
  "quantity": 350.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "350 mg cadastrados como 'Magnésio'. O PRÓPRIO ingredients_list do rótulo, gravado no banco, diz literalmente 'magnesio (fonte a definir)' — não é presunção minha, é o texto oficial hoje. Se 350 mg forem magnésio ELEMENTAR, é 100,0% do teto do Anexo IV (350 mg), no limite exato. Se forem massa de um SAL (ex.: bisglicinato de magnésio a ~30,22% de Mg tal qual, teor de um lote já usado noutro produto deste catálogo — NÃO confirmado para este), o elemento entregue cairia para ≈105,8 mg = 30,2% do teto. Já era a mesma dúvida (nota¹) do parecer de 15/09/2026, e continua sem solução hoje: a ficha ainda não define a fonte.",
    "e_sal": null,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 350,
    "minimo": 63,
    "status": "pendente",
    "ativo_mg": null,
    "laudo_lote": "não localizado — fonte do magnésio 'a definir' segundo o próprio rótulo",
    "teor_fonte": "não informado — forma química não definida",
    "linha_anexo": "I·(forma não definida — ver Anexo I lista longa de sais de magnésio autorizados); III·Magnésio (63); IV·Magnésio (350)",
    "constituinte": "Magnésio",
    "forma_insumo": "não definida (ingredients_list do rótulo diz 'fonte a definir')",
    "forma_anexo_i": "NÃO CONFIRMADA",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 350.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 9,
  "ingredient_name": "Aromatizante de Limão",
  "quantity": 350.0,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "aditivo",
    "ins": null,
    "massa_mg": 350.0,
    "laudo_lote": "não informado",
    "observacao": "Aromatizante idêntico ao natural de limão (RDC 725/2022). Produto é pó solúvel, não cápsula/comprimido — a restrição de 'quantum satis' não valer em cápsula (categoria 14.2, já documentada em LIMITES-ANVISA-POR-INSUMO.md) não parece se aplicar aqui. Teto de 2% quando o aromatizante vem de extrato vegetal (também já documentado) não conferido para esta forma específica de aromatizante — pendente-verificação.",
    "nome_no_memorial": "Aromatizante idêntico ao natural de limão"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 10,
  "ingredient_name": "Guaraná em Pó",
  "quantity": 350.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "350 mg, forma 'Guaraná em pó (Paullinia cupana)' — CONFIRMADA como forma autorizada do Anexo I (resolve a antiga NC5 do parecer de 15/09/2026, que apontava denominação incorreta em versões anteriores do rótulo). É fonte ADICIONAL do constituinte 'Cafeína', que tem limite único de 200 mg somando todas as fontes — ver o cálculo de cafeína total na linha 'Cafeína' (ordem 11) e no corpo do relatório (§4.4). Sem laudo do lote atual (350 mg é uma dose nova, diferente de todas as versões anteriores já documentadas neste projeto: 515 mg, 224,5 mg e 250 mg). O piso de doseamento de cafeína de 3,5-5,5% citado no enunciado desta tarefa NÃO foi confirmado na fonte primária (tentativa nesta tarefa e na sessão de 15/09/2026, ambas sem sucesso); um estudo independente achado por WebSearch mediu 0,18-0,93% em pós de guaraná comercializados, faixa bem mais larga e mais baixa.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": null,
    "minimo": null,
    "status": "condicionado a laudo",
    "ativo_mg": null,
    "laudo_lote": "não localizado para o lote de 350 mg usado nesta versão do rótulo (há laudos de outros lotes de guaraná em pó no catálogo, ex. 25H26-B028-213428 a 5,11% de metilxantinas, mas não confirmados para este lote específico)",
    "teor_fonte": "não informado para este lote — ver cenários no corpo do relatório (§4.4)",
    "linha_anexo": "I·Guaraná em pó (Paullinia cupana) (CAS não informado); constituinte regulado é 'Cafeína' (III·75 mg mínimo total; IV·200 mg máximo total, nota vi)",
    "constituinte": "Cafeína (fonte adicional — ver linha 'Cafeína' para o total)",
    "forma_insumo": "Guaraná em pó (Paullinia cupana)",
    "forma_anexo_i": "Guaraná em pó (Paullinia cupana)",
    "laudo_vencido": null,
    "pct_do_maximo": null,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 350.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 11,
  "ingredient_name": "Cafeína",
  "quantity": 150.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "150 mg de cafeína anidra (confirmada pelo ingredients_list: 'cafeina anidra'), forma autorizada. Isolada, 150 ÷ 200 = 75,0% do teto — mas o Anexo IV regula CAFEÍNA TOTAL (todas as fontes somadas), e este produto tem uma segunda fonte (guaraná em pó, 350 mg, ordem 10). Cafeína total = 150 + (350 × teor do guaraná, PENDENTE). Cenários calculados no corpo do relatório (§4.4): com o teor de outro lote do catálogo (5,11%) ou com a variação real medida em estudo independente (0,18-0,93%), o total fica entre 150,6 e 167,9 mg = 75,3%-84,0% do teto, CONFORME; só o teor citado internamente pela fábrica sem laudo formal (22,35%) daria 228,2 mg = 114,1%, estourando. Nota vi do Anexo IV (400 mg só 'exclusiva para atletas', dose individual ≤200mg) não se aplica — produto não é rotulado assim.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 200,
    "minimo": 75,
    "status": "condicionado a laudo",
    "ativo_mg": null,
    "laudo_lote": "cafeína anidra: 214171, validade 02/12/2029, 99,88% (lote já usado noutro produto do catálogo, NÃO confirmado como o mesmo lote em uso nesta formulação específica); guaraná: ver linha própria",
    "teor_fonte": "cafeína anidra presumida de alta pureza (~99,88%, referência de outro lote, não confirmada); cafeína total depende do teor do guaraná (PENDENTE)",
    "linha_anexo": "I·Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2); III·Cafeína (75, total); IV·Cafeína^vi (200, total, todas as fontes somadas)",
    "constituinte": "Cafeína (total, somando cafeína anidra + guaraná)",
    "forma_insumo": "Cafeína anidra",
    "forma_anexo_i": "Cafeína/1,3,7-Trimethylxanthine",
    "laudo_vencido": null,
    "pct_do_maximo": 75.0,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 150.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "150 mg isolados; total combinado com o guaraná é PENDENTE (ver conta)"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 12,
  "ingredient_name": "Dióxido de Silício",
  "quantity": 118.0,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "aditivo",
    "ins": "INS 551",
    "massa_mg": 118.0,
    "laudo_lote": "não informado",
    "observacao": "Antiumectante. LIMITES-ANVISA-POR-INSUMO.md já registra que, em líquido, dióxido de silício só vale para suspensões, efervescentes e pós para preparo (IN 295/2024) — este produto é justamente um pó para preparo, o que é favorável, mas o limite quantitativo exato em mg/kg para esta categoria não foi conferido nesta tarefa.",
    "nome_no_memorial": "Antiumectante dióxido de silício"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 13,
  "ingredient_name": "Vitamina B6",
  "quantity": 90.0,
  "unit": "mg",
  "meta": {
    "ativo": null,
    "conta": "90 mg. O ingredients_list do rótulo declara 'cloridrato de piridoxina' — confirma que os 90 mg são massa do SAL, não de piridoxina livre. Duas leituras, ambas CONFORMES: (1) sem converter (convenção usada no resto da Tabela 2 deste catálogo): 90 ÷ 98,60 = 91,3% do teto; (2) convertendo para piridoxina livre (fator 0,8227, já usado noutro produto deste catálogo): 90 × 0,8227 = 74,04 mg = 75,1% do teto. O rótulo imprime '90 mg / 6.923% VD' como se fosse a vitamina pura — isso é uma questão de %VD/rotulagem, não do teto do Anexo IV (as duas bases de cálculo são diferentes), mas seguem sendo dois problemas distintos, e o %VD alto por si só chama atenção de fiscal.",
    "e_sal": true,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 98.6,
    "minimo": 0.26,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": null,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "declarado como cloridrato de piridoxina (massa do sal) no ingredients_list do rótulo",
    "linha_anexo": "I·Cloridrato de piridoxina (CAS 58-56-0); III·Vitamina B_6 (0,26); IV·Vitamina B_6 (98,60)",
    "constituinte": "Vitamina B6",
    "forma_insumo": "Cloridrato de piridoxina (massa do sal)",
    "forma_anexo_i": "Cloridrato de piridoxina",
    "laudo_vencido": null,
    "pct_do_maximo": 91.3,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": 0.8227,
    "massa_insumo_mg": 90.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "74,04 mg de piridoxina livre (se convertido)"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 14,
  "ingredient_name": "Sucralose",
  "quantity": 90.0,
  "unit": "mg",
  "meta": {
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "aditivo",
    "ins": "INS 955",
    "massa_mg": 90.0,
    "laudo_lote": "não informado",
    "observacao": "Edulcorante. LIMITES-ANVISA-POR-INSUMO.md registra que sucralose NÃO é permitida em cápsulas/comprimidos/drágeas (categoria 14.2) — este produto é PÓ SOLÚVEL, não cápsula, então essa proibição específica não parece se aplicar. O teto quantitativo exato (mg/kg) para a categoria de pó solúvel na IN 211/2023 não foi conferido nesta tarefa — pendente-verificação, risco considerado baixo pela forma farmacêutica não ser a restringida.",
    "nome_no_memorial": "Edulcorante sucralose"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 15,
  "ingredient_name": "Vitamina B3",
  "quantity": 35.0,
  "unit": "mg",
  "meta": {
    "ativo": 35.0,
    "conta": "35 mg, forma 'nicotinamida' (Nicotinamida/Niacinamida, CAS 98-92-0), autorizada. Anexo III (niacina) mínimo 2,4 mg, Anexo IV máximo 35 mg — 100,0% do teto, no limite exato, sem margem.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 35,
    "minimo": 2.4,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 35.0,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Nicotinamida/Niacinamida (CAS 98-92-0); III·Niacina^iv (2,4); IV·Niacina^ix (35)",
    "constituinte": "Niacina (vitamina B3)",
    "forma_insumo": "Nicotinamida",
    "forma_anexo_i": "Nicotinamida/Niacinamida",
    "laudo_vencido": null,
    "pct_do_maximo": 100.0,
    "unidade_ativo": "mg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "mg",
    "fator_conversao": null,
    "massa_insumo_mg": 35.0,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": null
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 16,
  "ingredient_name": "Vitamina D3",
  "quantity": 2000.0,
  "unit": "ui",
  "meta": {
    "ativo": 50.0,
    "conta": "2.000 UI, forma 'colecalciferol' (Vitamina D3, CAS 67-97-0), autorizada. Conversão: 1 µg = 40 UI (nota iii do Anexo III, redação IN 361/2025) → 2.000 ÷ 40 = 50,0 µg. Anexo III mínimo 3 µg, Anexo IV máximo 50,0 µg — 100,0% do teto, no limite exato, sem margem.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 50,
    "minimo": 3,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 0.05,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Vitamina D3 (Colecalciferol) (CAS 67-97-0); III·Vitamina D^iii (3); IV·Vitamina D^ii (50,0)",
    "constituinte": "Vitamina D",
    "forma_insumo": "Colecalciferol",
    "forma_anexo_i": "Vitamina D3 (Colecalciferol)",
    "laudo_vencido": null,
    "pct_do_maximo": 100.0,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": 40,
    "massa_insumo_mg": 0.05,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "50,0 µg de Vitamina D"
  }
}
```

```json
{
  "slug": "pre-treino-creatina-sabor-limao-420g",
  "ordem": 17,
  "ingredient_name": "Vitamina B12",
  "quantity": 9.9,
  "unit": "mcg",
  "meta": {
    "ativo": 9.9,
    "conta": "9,9 µg, forma 'metilcobalamina' (CAS 13422-55-4), autorizada. Anexo III mínimo 0,36 µg, Anexo IV máximo 9,94 µg. 9,9 ÷ 9,94 = 99,6% do teto — quase sem margem. A migration de correção registra que o pedido original falava em 0,00994 mg (9,94 µg exatos, no teto) e o banco tem 0,0099 mg (9,9 µg) — diferença de 0,04 µg, decisão consciente de ficar 0,4% abaixo do teto em vez de exatamente nele.",
    "e_sal": false,
    "fonte": "auditoria_2026-09-18_pos_treino_e_emagrecimento",
    "papel": "constituinte",
    "maximo": 9.94,
    "minimo": 0.36,
    "status": "mantido (dose do rótulo)",
    "ativo_mg": 0.0099,
    "laudo_lote": "não localizado para o lote atual",
    "teor_fonte": "não informado",
    "linha_anexo": "I·Metilcobalamina (CAS 13422-55-4); III·Vitamina B_12 (0,36); IV·Vitamina B_12 (9,94)",
    "constituinte": "Vitamina B12",
    "forma_insumo": "Metilcobalamina",
    "forma_anexo_i": "Metilcobalamina",
    "laudo_vencido": null,
    "pct_do_maximo": 99.6,
    "unidade_ativo": "µg",
    "laudo_validade": null,
    "teor_laudo_pct": null,
    "unidade_limite": "µg",
    "fator_conversao": null,
    "massa_insumo_mg": 0.0099,
    "teor_efetivo_pct": null,
    "potencia_ui_por_g": null,
    "elemento_equivalente": "9,9 µg de Vitamina B12"
  }
}
```

### 4.6 Veredito — `pre-treino-creatina-sabor-limao-420g`

**BLOQUEADO.** Diferente dos outros três, aqui não é falta de dado — é um achado objetivo e confirmado:

1. **Beta-alanina em dose única (2.000 mg) viola a condição de fracionamento do Anexo VI**, confirmada
   nesta tarefa na fonte primária (máximo 300 mg por tomada, intervalo de 2h). Sozinho, já barra o selo.
2. **Magnésio** com fonte "a definir" — o próprio rótulo real da fábrica ainda não fechou isso; pode
   variar de 30% a 100% do teto conforme o sal escolhido.
3. **Cafeína do guaraná** sem laudo do lote atual (350 mg) — a maioria dos cenários fecha dentro do
   limite, mas o único cenário citado internamente pela própria fábrica (22,35%) estouraria.
4. Achado menor: soma da porção fecha em 14.125,50 mg contra 14.000 mg declarados (0,9% acima).

Sete constituintes ficam **conforme com boa folga** (arginina 26,2%, taurina 50,0%, L-carnitina 50,0%,
tirosina 36,4%, cafeína anidra isolada 75,0%, vitamina B6 75,1–91,3%) e quatro ficam **exatamente no teto
ou a menos de 0,5% dele, sem nenhuma margem de fabricação** (creatina, niacina/B3, vitamina D3 a 100,0%;
vitamina B12 a 99,6%) — mesmo padrão de risco já apontado pelo parecer de 15/09/2026.

---

## 5. Resumo comparativo

| Fórmula | Veredito | Motivo principal (1 linha) |
|---|---|---|
| `emagrecimento-em-capsulas` | **BLOQUEADO** | Soma dos insumos fecha em exatamente metade da porção declarada (900 mg em 1.800 mg) — se a leitura correta dobrar as doses, cromo/D3/B12 saltam para ~200% do teto; e faltam laudos de 4 extratos vegetais. |
| `emagrecimento-em-gotas` | **BLOQUEADO** | Porção diária não está definida no cadastro; vitamina B12 (10 µg), lida ao pé da letra, já excede o teto em 0,6%; colina no piso mínimo exato sem forma química definida. |
| `omega-pro-tg` | **BLOQUEADO / NÃO RESOLVIDO** (reconfirmado, mesma lacuna de 16/09) | Falta o laudo do óleo de peixe; sem ele não dá para resolver a ambiguidade entre a leitura "Lipídeos totais" (falharia, 20% do mínimo) e "EPA+DHA" (passaria, 824% do mínimo). |
| `pre-treino-creatina-sabor-limao-420g` | **BLOQUEADO** | Achado confirmado (não só pendência): 2.000 mg de beta-alanina em dose única contraria a condição de fracionamento do Anexo VI (máx. 300 mg/dose, 2h de intervalo) — confirmei o texto exato desta norma nesta tarefa, o que a auditoria de 15/09/2026 não tinha conseguido. |

Nenhuma das 4 fórmulas está pronta para receber o selo "Composição conferida" hoje.
