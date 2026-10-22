# Integração com a API do Catálogo Lemon Caps

> Documento para a equipe do **outro sistema interno** que vai ler e editar os dados
> deste catálogo. Não contém segredos: a única chave aqui é a chave **publishable**,
> feita para ser pública (vai em qualquer navegador que abre o site). Senha do
> usuário de integração, chave `service_role` e qualquer outro segredo **não estão
> e nunca devem estar** neste arquivo.
>
> Conferido diretamente na fonte (migrations do banco e chamadas reais à API com a
> chave pública) em 16/09/2026. Onde alguma informação depende de algo que ainda não
> existe (o usuário de integração), isso está marcado explicitamente como pendente.

## 1. O que é isto

O catálogo Lemon Caps é um site Next.js com banco **Supabase (PostgreSQL)**. Todo
acesso a dado — do site público, do painel administrativo, e agora deste outro
sistema — passa pela **API REST automática do Supabase (PostgREST)**, nunca por uma
API própria escrita à mão. Isso quer dizer que não existe um "endpoint de
integração" especial: o outro sistema usa exatamente a mesma API que o próprio
catálogo usa, com um usuário próprio e as mesmas regras de permissão (RLS) que já
valem para qualquer funcionário autenticado.

**Por que não a chave `service_role`.** A chave `service_role` ignora toda regra de
permissão (RLS) do banco e não deixa rastro de autoria: um `UPDATE` feito com ela
não preenche `created_by`/`updated_by`, e o gatilho de auditoria grava o registro
com autor **nulo**. Isso já causou um incidente real neste projeto: em 13/09/2026,
um `UPDATE` em massa executado por fora do aplicativo com o papel `service_role`
carimbou `compliance_verified_at` (o selo público "composição conferida") de 19
fórmulas de uma só vez — 9 delas sem nenhum lastro de auditoria documentado — e o
log de auditoria ficou sem autor, então não dava para saber quem fez (relato
completo em `supabase/migrations/20260917000000_corrige_selo_conformidade.sql`).
Por isso a integração é feita como está descrita abaixo: um **usuário comum do
Supabase Auth**, com uma linha em `staff_profiles`, sujeito à mesma RLS e à mesma
auditoria que qualquer humano do admin.

## 2. URL base e chave pública

| Item | Valor |
|---|---|
| Projeto (ref) | `zjryrmqtumvaxdytvbbv` |
| URL base | `https://zjryrmqtumvaxdytvbbv.supabase.co` |
| Chave publishable (pública) | `sb_publishable_U_85XpL6aO747U4DIqgGtQ_v1uP1hp5` |
| API de dados (PostgREST) | `{URL base}/rest/v1/` |
| API de autenticação (GoTrue) | `{URL base}/auth/v1/` |

A chave publishable identifica o **projeto**, não uma pessoa — sozinha, ela só dá
acesso ao que o papel `anon` (visitante anônimo do site) enxerga (ver seção 5). Para
"ver e editar todos os dados" o outro sistema precisa **também** do `access_token`
obtido no login (seção 3) — os dois são usados **juntos**, em cada chamada, como
mostrado nos exemplos a seguir.

Nos exemplos deste documento, os comandos assumem estas três variáveis de ambiente
já exportadas no shell:

```bash
export SUPABASE_URL="https://zjryrmqtumvaxdytvbbv.supabase.co"
export SUPABASE_PUBLISHABLE_KEY="sb_publishable_U_85XpL6aO747U4DIqgGtQ_v1uP1hp5"
export ACCESS_TOKEN="<obtido no login da seção 3>"
```

## 3. Autenticação

### 3.1 Login (usuário + senha)

```bash
curl -sS -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "email": "integracao@lemoncaps.com.br",
        "password": "<a senha definida pelo dono no painel>"
      }'
```

Resposta em caso de sucesso (HTTP 200; campos irrelevantes omitidos):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "user": { "id": "<uuid do usuário>", "email": "integracao@lemoncaps.com.br", "...": "..." }
}
```

`access_token` é um JWT **válido por 1 hora** (`expires_in: 3600`, conferido no
próprio corpo da resposta). Depois de expirar, toda chamada com ele devolve 401 —
use o `refresh_token` (seção 3.2) para obter um novo, em vez de fazer login de novo
a cada hora.

Credenciais erradas (testado ao vivo em 16/09/2026, com e-mail inexistente, para
confirmar o formato exato do erro nesta instância — não é suposição de
documentação genérica) devolvem **HTTP 400**, não 401:

```json
{"code":400,"error_code":"invalid_credentials","msg":"Invalid login credentials"}
```

### 3.2 Renovar sessão (sem pedir usuário/senha de novo)

```bash
curl -sS -X POST "$SUPABASE_URL/auth/v1/token?grant_type=refresh_token" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<refresh_token recebido no login>"}'
```

A resposta tem o mesmo formato do login, com um `access_token` novo (mais 1 hora) e,
normalmente, um `refresh_token` novo também — guarde sempre o mais recente.

### 3.3 Cabeçalhos obrigatórios em toda chamada a `/rest/v1/*`

| Cabeçalho | Valor | Por quê |
|---|---|---|
| `apikey` | a chave publishable | identifica o projeto; sem ele, 401 |
| `Authorization` | `Bearer <access_token>` | identifica o usuário; sem ele, a chamada roda como `anon` (só o que o site público vê) |
| `Content-Type` | `application/json` | em toda chamada com corpo (POST/PATCH) |
| `Prefer` | `return=representation` | em POST/PATCH, para a resposta trazer a linha gravada de volta (sem isto, POST/PATCH bem-sucedido devolve corpo vazio) |

## 4. Como a permissão funciona aqui

Não existe RBAC genérico neste projeto — só dois níveis, os dois controlados por
Row Level Security (RLS) no banco, nunca pelo front-end:

- **`anon`** (quem não manda `Authorization: Bearer <token>`, ou manda um token
  inválido/expirado): enxerga só o catálogo público — fórmulas ativas, composição,
  segmentos, insumos, a parte pública da assinatura de ficha técnica. Zero acesso a
  custo, staff, leads, orçamentos ou auditoria.
- **`authenticated` + `staff_profiles.active = true`** ("staff ativo", checado pela
  função `private.is_active_staff()`): catálogo inteiro (leitura e escrita) +
  leads + custo real de produção + auditoria.
- **`authenticated` + `staff_profiles.active = true` + `staff_profiles.can_manage_quotes = true`**
  (checado por `private.can_manage_quotes()`, o "papel extra"): tudo o que o staff
  ativo já vê, **mais** a área de Orçamentos gerados (`quotes`, `quote_items`, a view
  `quote_summaries`) — preço de venda, custo congelado, margem e lucro por orçamento.

O usuário de integração (`integracao@lemoncaps.com.br`) é provisionado com **as duas
flags em `true`** (ver `supabase/migrations/20260921300000_staff_integracao.sql`),
porque o pedido foi "ver e editar todos os dados" — sem `can_manage_quotes = true`
ele ficaria cego para a área de Orçamentos.

**Nota sobre as duas RPCs públicas (`fn_capture_lead`, `fn_generate_quote`, seção
8):** elas existem para o **carrinho do site público**, chamadas pelo visitante
anônimo — por isso têm limite de tentativas (rate limit) e proteção contra clique
duplo embutidos. Sendo staff, o outro sistema **não precisa** passar por elas: pode
ler e escrever direto nas tabelas `leads`, `quotes` e `quote_items` (seções 6.8 a
6.10), sem os limites pensados para tráfego anônimo. As RPCs continuam documentadas
aqui por completude, já que são endpoints reais e publicamente expostos.

## 5. Resumo de permissões por tabela

Tabela lida diretamente das migrations (`supabase/migrations/20260909210001_rls_policies.sql`
e as que alteram grants depois dela) e **confirmada ao vivo** contra a API em
16/09/2026 com a chave publishable (coluna "anon via API hoje"). "Staff" = qualquer
`authenticated` com `staff_profiles.active = true`. "—" = nenhum acesso por nenhum
caminho da API (nem RLS libera, nem existe GRANT).

| Tabela / view | anon via API hoje | staff SELECT | staff INSERT | staff UPDATE | staff DELETE | exige `can_manage_quotes` |
|---|---|---|---|---|---|---|
| `segments` | 200 (só `active=true`) | tudo | sim | sim | não¹ | não |
| `formulas` | 200 (só `active=true and deleted_at is null`) | tudo | sim | sim | não¹ | não |
| `formula_compositions` | 200 (só da fórmula-mãe visível) | tudo | sim | sim | não¹ | não |
| `ingredients` | 200 (só `active=true`) | tudo | sim | sim | não¹ | não |
| `formula_sheet_approvals` | 200 (só 8 colunas públicas, ver 6.6) | tudo (inclusive `notes`) | sim (só colunas de conteúdo) | **não²** | **não²** | não |
| `formula_costs` | **401** (zero grant) | tudo | sim | sim | não¹ | não |
| `staff_profiles` | **401** | tudo | **não³** | **não³** | **não³** | não |
| `leads` | **401** | tudo | não⁴ | sim | não¹ | não |
| `quotes` | **401** | tudo | sim | sim | não¹ | **sim** |
| `quote_items` | **401** | tudo | sim | sim | não¹ | **sim** |
| `audit_logs` | **401** | tudo | **não** (só o gatilho grava) | **não** | **não** | não |
| view `quote_summaries` | **401** | sim⁵ | — | — | — | **sim** |

¹ Nenhuma tabela de negócio tem `GRANT DELETE` para `authenticated` (revogado
explicitamente em `20260913170000_revogar_authenticated.sql`, inclusive para
tabelas futuras via `ALTER DEFAULT PRIVILEGES`). Exclusão é **sempre lógica**:
`PATCH` em `deleted_at`/`reason_deleted` (ver seção 6 de cada tabela). Um `DELETE`
HTTP contra qualquer tabela devolve 401 `permission denied`.
² `formula_sheet_approvals` não tem policy de UPDATE nem de DELETE — proposital: uma
aprovação de responsável técnico é histórico, nunca se corrige, só se lança de novo
(nova linha). Nem o dono corrige por esta API; só por migration/console.
³ Sem GRANT de INSERT/UPDATE/DELETE para `authenticated` em `staff_profiles`, de
propósito — evita que um staff (inclusive a integração) se autopromova. Só o dono,
via painel/SQL, altera esta tabela.
⁴ `leads` não tem INSERT liberado por tabela para ninguém, nem staff — a única porta
de entrada é a RPC `fn_capture_lead` (seção 8). Staff só lê e atualiza lead já
existente.
⁵ Não há um `GRANT SELECT` explícito para `authenticated` em `quote_summaries` em
nenhuma migration lida — o acesso de staff a esta view **não foi confirmado por uma
linha de GRANT explícita nem testado ao vivo** (a integração ainda não existe para
testar com token de staff). O padrão do projeto revoga de `anon` explicitamente e
deixa `authenticated` como estava (o privilégio-padrão que o Supabase concede a
`authenticated` na criação do objeto) — **PROVISÓRIO**: confirmar com
`select * from information_schema.role_table_grants where table_name = 'quote_summaries'`
depois que o usuário de integração existir, ou testar diretamente com o token dele.
Se por algum motivo vier 401, o mesmo dado (com o mesmo filtro de RLS) pode ser
obtido somando `quote_items` agrupado por `quote_id`.

## 6. Catálogo de tabelas

Todas as tabelas de negócio compartilham as colunas de controle
`version integer`, `metadata jsonb`, `created_at/updated_at timestamptz`,
`created_by/updated_by uuid` (preenchidas sozinhas por gatilho — nunca envie estas
duas num INSERT/PATCH, o servidor ignora silenciosamente porque quem preenche é o
`private.tg_touch_row()` a partir do seu token) e, exceto `staff_profiles` e
`audit_logs`, `deleted_at timestamptz`, `deleted_by uuid`, `reason_deleted text`
(exclusão lógica — seção 6 mostra o PATCH de cada uma). **`version` existe em quase
toda tabela mas não é incrementado por nenhum gatilho neste projeto** — é só um
inteiro (`default 1`) à disposição de quem quiser usar para controle de
concorrência otimista na própria aplicação; se o outro sistema depende de detectar
"alguém mexeu nisso entre minha leitura e minha escrita", use `updated_at` ou
consulte `audit_logs`, não `version`.

### 6.1 `segments` — segmentos do catálogo (chips de filtro)

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | uuid, PK | |
| `slug` | text, único | kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`) |
| `name` | text | nome de exibição (frase, ex. "Beleza e bem-estar") |
| `sort_order` | integer | ordem de exibição |
| `active` | boolean | `false` = não aparece para `anon` |
| `created_at`/`updated_at`/`deleted_at`/`deleted_by`/`reason_deleted`/`created_by`/`updated_by` | — | padrão (ver acima) |

Listar (paginado, só ativos, ordenado):

```bash
curl -sS "$SUPABASE_URL/rest/v1/segments?select=id,slug,name,sort_order&active=is.true&order=sort_order.asc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Buscar por slug:

```bash
curl -sS "$SUPABASE_URL/rest/v1/segments?select=*&slug=eq.libido" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Criar:

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/segments" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"slug":"novo-segmento","name":"Novo Segmento","sort_order":110}'
```

Atualizar (PATCH parcial — só envie os campos que mudam):

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/segments?slug=eq.novo-segmento" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"sort_order":115}'
```

Excluir (sempre lógico — **nunca** `DELETE`, que devolve 401 por falta de grant):

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/segments?slug=eq.novo-segmento" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"deleted_at":"2026-09-16T12:00:00Z","reason_deleted":"duplicado"}'
```

Restaurar: o mesmo PATCH com `"deleted_at": null` (o gatilho `tg_touch_row` limpa
`deleted_by`/`reason_deleted` sozinho quando `deleted_at` volta a `null`).

### 6.2 `formulas` — o produto/fórmula (núcleo do catálogo)

52 colunas hoje (conferido ao vivo). As de conteúdo/identificação:

`id, slug, name, segment_id, line, format, regulatory_product_type, pote_contents_description, net_weight, capsule_count, description, serving_description, nutritional_info, ingredients_list, usage_instructions, benefits (text[]), general_benefits_summary, warnings, target_audience, storage_instructions, technical_sheet_title, list_price_cents, minimum_order_potes, sort_order, active, mockup_path, featured_at`

Enums: `line` é `'premium'`, `'basica'` ou `'essencial'` (este último desde
23/09/2026; `'basica'` não tem fórmula ativa desde 14/09/2026); `format` é
`'capsula'`, `'soluvel'`, `'gummy'` ou `'liquido'`.

**Preço nulo em fórmula ativa (desde 23/09/2026):** fórmula da linha
`'essencial'` pode vir com `active=true` e `list_price_cents: null`. No catálogo
ela aparece como "Preço sob consulta" e não pode ser cotada. Quem consome esta
API tem de tratar `null` como "sem preço publicado", nunca como zero. Nas linhas
`'premium'` e `'basica'` a trava continua: ativa sempre tem preço.

Pacote técnico (todas nullable, `numeric(10,2)` para peso/dimensão em mm/g):
`ean13, dun14, shelf_life_months, gross_weight_g, package_height_mm, package_width_mm, package_depth_mm, units_per_box, box_height_mm, box_width_mm, box_depth_mm, box_gross_weight_g, technical_sheet_version`.
`ean13`/`dun14` têm índice único parcial (dois produtos não podem repetir o mesmo
código) e são validados por dígito verificador GTIN no próprio banco — um código
com dígito verificador errado é rejeitado com **HTTP 400** (`check_violation`,
`formulas_ean13_valido`/`formulas_dun14_valido`), não com um aviso.

Conformidade regulatória (preenchidas só por auditoria documentada — nunca deduza
um valor plausível para elas): `compliance_verified_at timestamptz`,
`compliance_norms text[]`, `compliance_source text`. `compliance_verified_at` não
nulo é o que liga o selo público "composição conferida" no site — foi exatamente o
preenchimento incorreto desse campo (incidente de 13/09/2026, seção 1) que motivou
nunca usar `service_role` aqui. Trate estas três colunas com o mesmo cuidado que o
próprio projeto trata: só grave depois de uma auditoria de verdade.

`nutritional_info text` e `metadata jsonb` (que carrega `metadata->tabela_nutricional`)
são tratados em detalhe na seção 9 — **os dois puxam informação nutricional e
precisam ser regravados juntos**.

Colunas de controle: `version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

Nenhuma coluna de `formulas` é gerada/calculada pelo banco (diferente de
`quote_items`, seção 6.10) — tudo aqui é editável por staff, exceto as de controle.

Listar ativos, paginado por página de 20 (`Range` também funciona, ver seção 7):

```bash
curl -sS "$SUPABASE_URL/rest/v1/formulas?select=id,slug,name,list_price_cents,active&active=is.true&deleted_at=is.null&limit=20&offset=0&order=name.asc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Buscar uma fórmula por slug (exemplo real, produto ativo hoje):

```bash
curl -sS "$SUPABASE_URL/rest/v1/formulas?select=*&slug=eq.zma-zinco-magnesio-e-vitamina-d" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Criar fórmula nova (campos mínimos; `list_price_cents` é obrigatório se `active=true`,
exceto na linha `'essencial'` — constraint `formulas_active_requires_price`, ver seção 12):

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/formulas" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{
        "slug": "produto-novo-exemplo",
        "name": "Produto Novo Exemplo",
        "segment_id": "80d463ff-c277-4455-af53-3e86aa00d547",
        "line": "premium",
        "format": "capsula",
        "active": false
      }'
```

Atualizar preço:

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/formulas?slug=eq.produto-novo-exemplo" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"list_price_cents": 3990}'
```

Excluir (lógico):

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/formulas?slug=eq.produto-novo-exemplo" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"deleted_at":"2026-09-16T12:00:00Z","reason_deleted":"cadastro de teste"}'
```

### 6.3 `formula_compositions` — composição por dose

Uma linha por insumo de uma fórmula. Colunas:
`id, formula_id, ingredient_name, quantity numeric(12,4), unit, sort_order, active, ingredient_id, version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

`unit` é um dos 7 valores do enum `composition_unit`: `g, mg, mcg, ml, l, ui, kg`.
`quantity` é sempre numérico (`> 0`) e a unidade fica **separada**, nunca texto
solto ("16,7 mg" não é um valor válido para `quantity` — seria `16.7` +
`unit: "mg"`).

**Vínculo com `ingredients` (`ingredient_id`).** `ingredient_name` é o texto exato
que aparece na composição impressa daquela fórmula (ex.: `"magnésio (cloreto de
magnésio)"`) e **nunca deve ser inferido/normalizado** — é dado de rótulo.
`ingredient_id` é uma referência **opcional** (nullable) para o insumo canônico em
`public.ingredients` (seção 6.4), usada pela ficha pública de insumo do site. Para
ligar uma composição a um insumo canônico, primeiro descubra o `id` do insumo pelo
`slug`:

```bash
curl -sS "$SUPABASE_URL/rest/v1/ingredients?select=id,slug&slug=eq.magnesio" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

depois grave esse `id` em `formula_compositions.ingredient_id`:

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/formula_compositions?id=eq.<id-da-linha-de-composicao>" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"ingredient_id":"<id do insumo, do passo anterior>"}'
```

Listar a composição de uma fórmula (pelo `formula_id`, na ordem de exibição):

```bash
curl -sS "$SUPABASE_URL/rest/v1/formula_compositions?select=*&formula_id=eq.<uuid-da-formula>&order=sort_order.asc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Adicionar uma linha de composição:

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/formula_compositions" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"formula_id":"<uuid-da-formula>","ingredient_name":"Vitamina C (ácido ascórbico)","quantity":45,"unit":"mg","sort_order":10}'
```

### 6.4 `ingredients` — ficha por insumo (canônico, reaproveitado entre fórmulas)

Colunas: `id, slug, name, synonyms (text[]), category, description, image_path, claim_text, claim_source, claim_min_amount numeric(12,4), claim_verified_at, sort_order, active, version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

`category` é um dos 5 valores do enum `ingredient_category`:
`vitamina, mineral, aminoacido, extrato_vegetal, outro`.

`claim_text`/`claim_source`/`claim_min_amount`/`claim_verified_at` guardam a
alegação autorizada pela ANVISA para aquele insumo — nascem `null` e só devem ser
preenchidos com texto vindo de uma fonte regulatória conferida, nunca redigidos.
Enquanto `claim_text` for `null`, o site não exibe alegação nenhuma para o insumo.

Listar (só ativos, para o público; staff vê todos):

```bash
curl -sS "$SUPABASE_URL/rest/v1/ingredients?select=id,slug,name,category&active=is.true&order=sort_order.asc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Buscar por slug (exemplo real):

```bash
curl -sS "$SUPABASE_URL/rest/v1/ingredients?select=*&slug=eq.zinco" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Atualizar a descrição pública de um insumo:

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/ingredients?slug=eq.zinco" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"description":"Texto novo, revisado."}'
```

### 6.5 `formula_costs` — custo real de produção (NUNCA pública)

Uma linha por fórmula (`formula_id` é `unique`). Colunas:
`id, formula_id, unit_cost_cents integer, internal_notes, version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

`anon` não tem **nenhum** privilégio aqui (nem SELECT) — é a tabela que existe
especificamente para nunca repetir um vazamento de margem que já aconteceu no
sistema anterior a este catálogo. Qualquer chamada sem o token de staff devolve 401.

Ler o custo de uma fórmula:

```bash
curl -sS "$SUPABASE_URL/rest/v1/formula_costs?select=*&formula_id=eq.<uuid-da-formula>" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Definir/atualizar o custo (upsert manual — primeiro tente PATCH; se não achar linha,
faça POST, já que `formula_id` é único e um segundo POST para a mesma fórmula
devolveria **409** por violar essa unicidade):

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/formula_costs" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"formula_id":"<uuid-da-formula>","unit_cost_cents":1250}'
```

### 6.6 `formula_sheet_approvals` — assinatura da ficha técnica (histórico, só INSERT)

Registro histórico de cada aprovação do responsável técnico. **Nunca se edita nem
se apaga por esta API** — não existe policy de UPDATE nem de DELETE (RLS nega os
dois por padrão; ver seção 5, nota ²). Aprovar de novo = inserir uma linha nova.

Colunas: `id, formula_id, sheet_version integer, approved_by_name, approved_by_license, approved_at, notes, active, version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

`anon` só enxerga 8 colunas (grant por coluna, não a linha inteira):
`id, formula_id, sheet_version, approved_by_name, approved_by_license, approved_at, active, deleted_at`
— **`notes` fica de fora de propósito** (observação interna). Um detalhe importante
de PostgREST: pedir uma coluna fora dessa lista, mesmo junto de colunas permitidas,
faz a chamada **inteira** falhar com 401 (testado ao vivo: `select=notes` sozinho
devolve 401 `permission denied`, e `select=*` também, porque `*` tenta trazer
`notes` junto). Staff (com token) não tem essa restrição e pode usar `select=*`
normalmente.

Listar aprovações públicas de uma fórmula:

```bash
curl -sS "$SUPABASE_URL/rest/v1/formula_sheet_approvals?select=id,formula_id,sheet_version,approved_by_name,approved_by_license,approved_at,active,deleted_at&formula_id=eq.<uuid-da-formula>&order=approved_at.desc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Registrar uma aprovação nova (staff; só as colunas de conteúdo são aceitas no
INSERT — `created_by`/`version`/etc. ficam a cargo do gatilho):

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/formula_sheet_approvals" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{
        "formula_id": "<uuid-da-formula>",
        "sheet_version": 2,
        "approved_by_name": "Nome do responsável técnico",
        "approved_by_license": "CRF/MT 0000",
        "notes": "O que mudou desde a versão anterior."
      }'
```

### 6.7 `staff_profiles` — quem é staff (só leitura pela API; escrita é do dono)

Colunas: `user_id uuid (PK, = auth.users.id), full_name, can_manage_quotes boolean, active boolean, created_at, updated_at, created_by, updated_by`. **Sem** colunas de
exclusão lógica — esta é a única tabela de negócio do projeto sem `deleted_at`;
ativar/desativar é só `active`.

`anon` não tem acesso nenhum (401). Staff só tem **SELECT** — sem INSERT, UPDATE nem
DELETE por API para ninguém autenticado, de propósito, para nenhum staff (inclusive
a integração) conseguir se autopromover. Ver a fórmula de provisionamento e de
revogação nas seções 13 e no cabeçalho de
`supabase/migrations/20260921300000_staff_integracao.sql`.

O próprio usuário de integração consultando seu status:

```bash
curl -sS "$SUPABASE_URL/rest/v1/staff_profiles?select=*&user_id=eq.<uuid-do-proprio-usuario>" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 6.8 `leads` — nome + WhatsApp de quem converteu no site (dado pessoal, LGPD)

Colunas: `id, name, whatsapp, cart_snapshot jsonb, version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

`anon` não tem acesso nenhum (401) — a única porta de entrada pública é a RPC
`fn_capture_lead` (seção 8). Staff **lê e atualiza**, mas **não insere direto pela
tabela** (sem GRANT de INSERT nem para staff) — para criar um lead, use a RPC.

Listar leads recentes:

```bash
curl -sS "$SUPABASE_URL/rest/v1/leads?select=id,name,whatsapp,created_at&order=created_at.desc&limit=20" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Atualizar um lead existente (ex.: corrigir nome):

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/leads?id=eq.<uuid-do-lead>" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"name":"Nome Corrigido"}'
```

### 6.9 `quotes` — orçamento gerado (cabeçalho) — exige `can_manage_quotes`

Colunas: `id, quote_number bigint (gerado, ver abaixo), lead_id, customer_name, customer_whatsapp, status, internal_note, version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

`quote_number` é **`GENERATED ALWAYS AS IDENTITY`** — **somente leitura**: um
POST/PATCH que tente definir `quote_number` é rejeitado pelo Postgres ("column
\"quote_number\" can only be updated to DEFAULT"). É o número que aparece para o
cliente (no PDF/WhatsApp) — nunca o `id` (uuid) interno.

`status` é um dos 4 valores do enum `quote_status`: `aberto, aprovado, recusado,
expirado` — controlado manualmente por staff, nunca calculado sozinho pelo sistema.

Listar orçamentos abertos:

```bash
curl -sS "$SUPABASE_URL/rest/v1/quotes?select=id,quote_number,customer_name,status,created_at&status=eq.aberto&order=created_at.desc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Mudar o status de um orçamento:

```bash
curl -sS -X PATCH "$SUPABASE_URL/rest/v1/quotes?id=eq.<uuid-do-orcamento>" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"status":"aprovado"}'
```

### 6.10 `quote_items` — linhas do orçamento — exige `can_manage_quotes`

Colunas editáveis: `id, quote_id, formula_id, formula_name_snapshot, quantity_potes, unit_cost_cents, unit_price_cents, sort_order, version, metadata, created_at, updated_at, deleted_at, deleted_by, reason_deleted, created_by, updated_by`.

Colunas **geradas pelo Postgres, somente leitura** (`GENERATED ALWAYS AS ... STORED`
— o Postgres recusa qualquer tentativa de gravá-las diretamente):

| Coluna | Fórmula |
|---|---|
| `line_total_cents` | `quantity_potes * unit_price_cents` |
| `line_cost_cents` | `quantity_potes * unit_cost_cents` (`null` se o custo for `null`) |
| `profit_cents` | `quantity_potes * (unit_price_cents - unit_cost_cents)` (`null` se o custo for `null`) |
| `profit_margin_pct` | `(unit_price_cents - unit_cost_cents) / unit_price_cents * 100`, arredondado a 4 casas (`null` se o custo for `null` ou o preço for 0) |

Ou seja: para mudar margem/lucro, mude `unit_cost_cents` ou `unit_price_cents` — as
quatro colunas de cima recalculam sozinhas, sempre, sem risco de ficarem
desatualizadas.

Há também um gatilho que **recusa** `quantity_potes` abaixo do mínimo daquela
fórmula (`formulas.minimum_order_potes`, hoje sempre 100): tentar gravar menos
devolve **400** (`check_violation`, mensagem "quantidade X abaixo do mínimo de Y
potes para esta fórmula").

`formula_name_snapshot` **não é preenchido sozinho** — é uma cópia congelada do
nome da fórmula no momento do orçamento (mesmo padrão que `fn_generate_quote` usa
internamente); se a fórmula mudar de nome depois, este texto não deve mudar. Ao
inserir manualmente pela API, leia `formulas.name` e copie o valor.

Adicionar um item a um orçamento existente:

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/quote_items" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{
        "quote_id": "<uuid-do-orcamento>",
        "formula_id": "<uuid-da-formula>",
        "formula_name_snapshot": "Nome da Fórmula",
        "quantity_potes": 100,
        "unit_cost_cents": 1250,
        "unit_price_cents": 3990
      }'
```

### 6.11 `audit_logs` — trilha de auditoria (só leitura, ninguém escreve pela API)

Colunas: `id bigint, table_name, record_id uuid, action, changed_fields text[], old_data jsonb, new_data jsonb, actor_id uuid, actor_email, created_at`. Sem
`updated_at`/soft delete — é um livro-razão, nunca editado nem apagado.

`action` é um de `INSERT, UPDATE, SOFT_DELETE, RESTORE, DELETE` (os dois últimos
são refinamentos automáticos: o gatilho detecta transição de `deleted_at` e troca
`UPDATE` por `SOFT_DELETE`/`RESTORE` sozinho).

Toda escrita feita pelo usuário de integração aparece aqui automaticamente, com
`actor_id` = o UUID dele e `actor_email` = `integracao@lemoncaps.com.br` — é o que
resolve "autoria" sem precisar de nenhum campo extra nas chamadas.

Ver o histórico de uma fórmula específica:

```bash
curl -sS "$SUPABASE_URL/rest/v1/audit_logs?select=action,changed_fields,actor_email,created_at&table_name=eq.formulas&record_id=eq.<uuid-da-formula>&order=created_at.desc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 6.12 view `quote_summaries` — totais por orçamento — exige `can_manage_quotes`

Não é tabela, é uma view (`security_invoker = true`, então aplica a RLS de quem
consulta, não de quem a criou) com: `quote_id, quote_number, customer_name, customer_whatsapp, created_at, item_count, total_cents, total_profit_cents, lead_id, status, internal_note`. Só leitura (não aceita POST/PATCH/DELETE — é
derivada de `quotes`/`quote_items`).

```bash
curl -sS "$SUPABASE_URL/rest/v1/quote_summaries?select=*&order=created_at.desc&limit=20" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

Ver a nota ⁵ da seção 5 sobre esta view especificamente: o acesso de staff a ela
ainda não foi confirmado com um token real.

## 7. Paginação, filtro e ordenação (sintaxe do PostgREST)

| O que | Sintaxe | Exemplo |
|---|---|---|
| Escolher colunas | `select=col1,col2` | `?select=slug,name` |
| Igualdade | `coluna=eq.valor` | `?slug=eq.zma-zinco-magnesio-e-vitamina-d` |
| Booleano | `coluna=is.true` / `is.false` / `is.null` | `?active=is.true` |
| Maior/menor | `gt.` `gte.` `lt.` `lte.` | `?list_price_cents=gte.5000` |
| Texto contém (case-insensitive) | `ilike.*valor*` | `?name=ilike.*creatina*` |
| Ordenar | `order=coluna.asc` / `.desc` | `?order=created_at.desc` |
| Paginar por limite/deslocamento | `limit=N&offset=N` | `?limit=20&offset=40` |
| Paginar por cabeçalho `Range` | `Range: 0-19` (base 0, inclusivo) | ver abaixo |

Paginação por cabeçalho (alternativa ao `limit`/`offset`, útil para páginas
grandes — a resposta traz `Content-Range` dizendo quantos itens existem no total):

```bash
curl -sS -D - "$SUPABASE_URL/rest/v1/formulas?select=id&order=name.asc" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Range-Unit: items" -H "Range: 0-19"
# resposta inclui, por exemplo: content-range: 0-19/24
```

**Resultado vazio não é erro.** `GET` com filtro que não bate com nada devolve
**HTTP 200** com `[]` — testado ao vivo tanto para um `slug` inexistente quanto para
um filtro que a RLS esconde (ver seção 12). Não trate array vazio como falha de
rede/autenticação.

## 8. RPCs disponíveis

Chamadas por `POST /rest/v1/rpc/<nome>` (nunca GET, mesmo que a função pareça só
ler — as duas abaixo gravam dado). Como já são `SECURITY DEFINER` com validação
própria, não dependem de o chamador ter GRANT nas tabelas que tocam por dentro
(inclusive `formula_costs`, que `anon` nunca enxerga diretamente).

### `fn_capture_lead(p_name, p_whatsapp, p_cart_snapshot default '[]')`

Cria um lead. `p_whatsapp` precisa bater com `^\+?[0-9]{10,15}$`. Sujeita a rate
limit interno (5 chamadas por WhatsApp a cada 10 minutos, chave normalizada só com
dígitos). Devolve o `uuid` do lead criado.

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/rpc/fn_capture_lead" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_name":"Cliente Exemplo","p_whatsapp":"+5565999999999","p_cart_snapshot":[]}'
```

### `fn_generate_quote(p_customer_name, p_customer_whatsapp, p_items, p_lead_id default null)`

Cria um orçamento a partir de uma lista de itens
`[{"formula_id":"<uuid>","quantity_potes":100}, ...]` (máximo 50 itens). Sujeita ao
mesmo rate limit (5/10min) e a uma trava de clique duplo (mesmo cliente + mesmos
itens em menos de 60 segundos devolve o **mesmo** orçamento, não cria um novo).
Devolve **uma tabela** (array, mesmo com uma linha só) com `quote_id` e
`quote_number`:

```bash
curl -sS -X POST "$SUPABASE_URL/rest/v1/rpc/fn_generate_quote" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "p_customer_name": "Cliente Exemplo",
        "p_customer_whatsapp": "+5565999999999",
        "p_items": [{"formula_id":"<uuid-da-formula>","quantity_potes":100}]
      }'
# resposta: [{"quote_id":"...","quote_number":27}]
```

## 9. Tabela de Informação Nutricional — JSON + texto (os dois precisam ser regravados juntos)

Cada fórmula carrega a informação nutricional em **dois lugares que precisam dizer
a mesma coisa**:

- `formulas.metadata -> 'tabela_nutricional'` (jsonb): a tabela **estruturada** —
  fonte da verdade sempre que existir e for válida. É o que o dossiê web e o PDF
  usam primeiro (`lib/pdf/formula-sections.ts: addNutritionalSection` — usa a
  estruturada se existir, só cai para o texto puro se não existir/for inválida).
- `formulas.nutritional_info` (text): o **texto plano equivalente**, usado como
  reserva quando a estruturada não existe, e também é o que aparece nalguns
  trechos do PDF/exportação que só lidam com texto.

**Não existe gatilho no banco que gere um a partir do outro.** Isso é feito pelo
código da aplicação (`updateNutritionTable` em `lib/actions/formulas.ts`) numa
única chamada, que grava os dois campos juntos. Como o outro sistema fala
diretamente com a API REST (sem passar por esse código), **é responsabilidade dele
manter os dois em sincronia**: sempre que alterar
`metadata->tabela_nutricional`, recalcular `nutritional_info` com o mesmo algoritmo
e enviar os dois no mesmo PATCH.

### 9.1 Formato do JSON (`metadata.tabela_nutricional`)

```json
{
  "porcoes_por_embalagem": "30",
  "porcao": "1 g (2 cápsulas)",
  "grupos_vd": ["adultos_19_anos_ou_mais"],
  "por_100": false,
  "rodape": "*Percentual de valores diários fornecidos pela porção",
  "linhas": [
    {
      "item": "Valor energético",
      "nivel": 0,
      "quantidade": 4,
      "unidade": "kcal",
      "kj": 17,
      "vd_pct": {"adultos_19_anos_ou_mais": 0},
      "nota": null,
      "provisorio": false
    }
  ]
}
```

Regras do formato (schema completo, validado por Zod, em
`lib/catalog/nutrition-table.ts`, exportado como `rawNutritionTableSchema`):

| Campo | Tipo | Observação |
|---|---|---|
| `porcoes_por_embalagem` | string OU number | nos dados reais sempre chega como **string** (`"30"`, não `30`) |
| `porcao` | string, obrigatório | ex. `"1 g (2 cápsulas)"` |
| `grupos_vd` | array de string, mín. 1 | quase sempre `["adultos_19_anos_ou_mais"]`; o Multi Vitta usa `["gestantes","lactantes"]` |
| `por_100` | boolean, default `false` | liga a coluna "100 g/ml" (só obrigatória para líquido/pó, RDC 429/2020 art. 8º §1º) |
| `rodape` | string ou `null` | texto legal ao final da tabela |
| `linhas` | array, mín. 1 | ver abaixo |
| `linhas[].item` | string, obrigatório | nome do nutriente/linha |
| `linhas[].nivel` | integer ≥ 0, default `0` | indentação (0 = principal, 1+ = discriminação, ex. "Açúcares totais" sob "Carboidratos") |
| `linhas[].quantidade` | number OU `null` | `null` quando não dá para calcular (nunca vira `0`) |
| `linhas[].unidade` | string ou `null` | |
| `linhas[].kj` | number ou `null`, opcional | só a linha "Valor energético" costuma ter |
| `linhas[].vd_pct` | objeto `{grupo: valor}` ou `null` | `null` = a linha não tem %VD (ex. discriminação); por grupo, o valor é number OU o literal `"PENDENTE"` (nunca omitir a chave nem inventar número) |
| `linhas[].nota` | string ou `null`, opcional | observação da linha (procedência do número, ressalva) |
| `linhas[].provisorio` | boolean, default `false` | linha ainda sujeita a confirmação |
| `linhas[].quantidade_100` | number ou `null`, opcional | só quando `por_100=true` |

As **10 linhas obrigatórias** pela RDC 429/2020 art. 5º (nesta ordem, nível e
unidade — não remover nenhuma, só editar): Valor energético (kcal, nível 0),
Carboidratos (g, 0), Açúcares totais (g, 1), Açúcares adicionados (g, 2), Proteínas
(g, 0), Gorduras totais (g, 0), Gorduras saturadas (g, 1), Gorduras trans (g, 1),
Fibras alimentares (g, 0), Sódio (mg, 0). Depois delas vêm as vitaminas/minerais
específicos daquela fórmula.

**Regra de merge:** `metadata` carrega outras chaves além de `tabela_nutricional`
(ex. `nutritional_info_anterior_2026_09_16`, presente em fórmulas migradas) — ao
atualizar, **sempre leia o `metadata` atual primeiro e faça o merge**, nunca
sobrescreva o objeto inteiro só com `{"tabela_nutricional": {...}}}`.

### 9.2 Algoritmo do texto (`nutritional_info`), a partir do JSON

Implementado em `renderNutritionTableText` (`lib/catalog/nutrition-table.ts:365`).
Regras exatas:

1. Linha 1: literal `INFORMAÇÃO NUTRICIONAL`.
2. Linha 2: `Porções por embalagem: {porcoes_por_embalagem}`.
3. Linha 3: `Porção: {porcao}`.
4. Linha 4 (cabeçalho): ` | {parte de "porcao" antes do primeiro " ("} | {rótulo de %VD do grupo 1} | {rótulo do grupo 2}...` — o rótulo de cada grupo é `"%VD*"` quando há **um** grupo só, ou `"%VD* {grupo com "_" trocado por espaço}"` quando há mais de um.
5. Uma linha por item de `linhas`, nesta forma:
   `{"  " repetido "nivel" vezes}{item} | {célula de quantidade} | {célula de %VD grupo 1} | {célula de %VD grupo 2}...`
   - Célula de quantidade: `quantidade` formatado em `pt-BR` (separador de milhar
     com ponto, decimal com vírgula; até 2 casas se `|valor| >= 1`, até 4 se menor)
     + espaço + `unidade` (se houver); se a linha tiver `kj`, acrescenta
     ` = {kj formatado} kJ`. Se `quantidade` for `null`, a célula inteira é o
     literal `PENDENTE`.
   - Célula de %VD de um grupo: vazia (string vazia, não aparece nem "0") se
     `vd_pct` da linha for `null` **ou** se `quantidade` da linha for `null`
     (mesmo que aquele grupo tivesse um valor em `vd_pct` — quantidade nula força
     todas as células de %VD em branco); senão, `"PENDENTE"` literal se o valor for
     `"PENDENTE"`; senão, o número formatado + `%`.
6. Se `rodape` não for vazio/`null`, uma última linha com o texto dele, sem
   formatação extra.
7. Linhas juntadas por `\n` (quebra de linha simples, sem linha em branco entre elas).

### 9.3 Exemplo real (lido ao vivo, 16/09/2026)

```bash
curl -sS "$SUPABASE_URL/rest/v1/formulas?select=nutritional_info,metadata&slug=eq.zma-zinco-magnesio-e-vitamina-d" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
```

`nutritional_info` (texto) devolvido de verdade por essa chamada:

```text
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g |
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-teanina | 150 mg |
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 25 µg | 167%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 152 mg | 36%
Zinco | 15 mg | 136%
Boro | 3,1 mg |
*Percentual de valores diários fornecidos pela porção
```

O `metadata.tabela_nutricional` da mesma resposta traz o JSON completo que gera
este texto (`linhas` com os mesmos 16 itens, na mesma ordem — reparem que
"Açúcares totais", "L-teanina" e "Boro" têm `vd_pct: null` no JSON, e é por isso
que a célula de %VD delas fica em branco no texto, não "0%"). Confirmado hoje:
**as 24 fórmulas ativas do catálogo já têm `metadata.tabela_nutricional`
preenchido** — não é um recurso novo/vazio.

> **Achado à parte, para o dono, fora do escopo desta integração:** o arquivo
> `supabase/migrations/20260921200000_tabelas_nutricionais_formula_atual.sql` tem em
> seu próprio cabeçalho a frase "NÃO APLICADA — fica em disco até ordem do dono".
> Isso está desatualizado: os dados já estão live (conferido acima, nas 24
> fórmulas, pela chave pública). Registrado aqui só para conhecimento — nenhum
> arquivo de migration existente foi alterado por esta tarefa (o escopo era só
> leitura de código/banco).

## 10. O que a RLS impede — lista objetiva

- **`anon` nunca lê**: `formula_costs`, `staff_profiles`, `leads`, `quotes`,
  `quote_items`, `audit_logs`, `quote_summaries`, nem as colunas
  `notes`/`metadata`/`version`/etc. de `formula_sheet_approvals` (só as 8 públicas).
- **`anon` nunca escreve nada, em nenhuma tabela**, nem nas que lê (só `SELECT`
  concedido). Toda escrita pública passa pelas RPCs `fn_capture_lead`/`fn_generate_quote`.
- **Ninguém (nem staff) apaga fisicamente** nenhuma linha de nenhuma tabela de
  negócio via API — `DELETE` HTTP sempre devolve 401 (`GRANT` de `DELETE`
  revogado de `authenticated` para toda tabela, presente e futura). Exclusão é
  sempre `PATCH` em `deleted_at`.
- **Ninguém além do dono (via painel/SQL) altera `staff_profiles`** — nem o
  próprio staff, nem a integração, nem para se autopromover a `can_manage_quotes`.
- **Ninguém edita nem apaga uma linha de `formula_sheet_approvals`** depois de
  criada — só INSERT (nova aprovação = nova linha).
- **Ninguém insere direto em `leads`** (nem staff) — só via `fn_capture_lead`.
- **Staff sem `can_manage_quotes` não vê nada** de `quotes`/`quote_items`/`quote_summaries`
  — nem a lista, nem preço de venda, nem margem/lucro.
- **Ninguém escreve em `audit_logs`** — só o gatilho grava, com privilégio próprio.
- **Ninguém grava valor em coluna gerada** (`quote_items.line_total_cents` e as
  outras três, `quotes.quote_number`) — o Postgres rejeita a tentativa.

## 11. Auditoria automática

Toda tabela de negócio tem um gatilho (`private.tg_write_audit()`) que grava, a
cada INSERT/UPDATE/DELETE, uma linha em `public.audit_logs` com: nome da tabela,
id do registro, ação (`INSERT`/`UPDATE`/`SOFT_DELETE`/`RESTORE`/`DELETE`, os dois
últimos detectados automaticamente pela transição de `deleted_at`), quais colunas
mudaram, o valor antes e depois (JSON completo da linha) e **quem fez** —
`actor_id` (uuid do usuário autenticado) e `actor_email` (snapshot do e-mail
daquele momento). Isso funciona automaticamente para qualquer escrita feita pelo
usuário de integração, sem precisar de nenhum campo extra na chamada: é
exatamente a razão de a integração usar um usuário autenticado normal em vez da
chave `service_role` (que deixaria `actor_id`/`actor_email` nulos — seção 1).

## 12. Erros comuns

| Situação | HTTP | Corpo (resumo) | O que significa |
|---|---|---|---|
| Cabeçalho `apikey` ausente (esquecido por completo) | **401** | `{"message":"No API key found in request","hint":"No \`apikey\` request header or url param was found."}` | Testado ao vivo. Diferente do caso de baixo: aqui falta o `apikey`, não o `Authorization` — sem `apikey` a chamada nem chega a resolver um papel (nem `anon`). |
| `Authorization` ausente (só `apikey` presente), ou tabela sem nenhum GRANT para o papel atual | **200** (sem `Authorization`, vira `anon` - ver seção 3.3) ou **401** (tabela sem GRANT nenhum para o papel atual) | 401: `{"code":"42501","message":"permission denied for table X","hint":"GRANT ... TO ..."}` | Testado ao vivo nos dois casos, em toda tabela privada deste projeto. O `hint` do 401 já diz literalmente o GRANT que falta — isso é só informativo: o outro sistema não tem (nem deve ter) acesso para rodar `GRANT`; o que falta de verdade é usar o token de staff, ou a tabela é mesmo inacessível por design (seção 5). |
| Login com e-mail/senha errados | **400** | `{"code":400,"error_code":"invalid_credentials","msg":"Invalid login credentials"}` | Testado ao vivo. Não é 401 — é 400, do endpoint de auth, não do REST de dados. |
| `access_token` expirado (mais de 1h) | **401** | `{"message":"JWT expired"}` (comportamento padrão documentado do PostgREST/GoTrue; não reproduzido ao vivo nesta auditoria porque exigiria esperar 1h ou forjar um token vencido) | Use `grant_type=refresh_token` (seção 3.2) em vez de tratar como falha definitiva. |
| GRANT existe, mas a policy de RLS nega aquela operação específica | **403** | `{"code":"42501","message":"new row violates row-level security policy for table \"X\""}` | Comportamento padrão documentado do PostgREST para INSERT/UPDATE barrado por `WITH CHECK` (não foi reproduzido ao vivo nesta auditoria porque exigiria um segundo usuário autenticado sem privilégio de staff, que não foi criado). Na prática, neste projeto, isso só aconteceria se `staff_profiles.active` virasse `false` depois de emitido o token, ou por erro de configuração — usando o fluxo desta integração normalmente, não deve acontecer. |
| `slug`/`ean13`/`dun14`/`formula_costs.formula_id` repetido | **409** | `{"code":"23505", "message":"duplicate key value violates unique constraint ..."}` | Violação de índice único. `formulas.slug`, `segments.slug`, `ingredients.slug` são únicos globais; `ean13`/`dun14` são únicos entre as linhas não excluídas; `formula_costs.formula_id` é único (uma linha de custo por fórmula — use PATCH, não POST, se já existir). |
| Texto longo demais, número negativo, GTIN com dígito verificador errado, quantidade abaixo do mínimo, `active=true` sem preço | **400** | `{"code":"23514","message":"new row for relation \"X\" violates check constraint \"Y\""}` | Violação de `CHECK`. Exemplos reais deste schema: `leads_name_tamanho` (>120 caracteres), `formulas_ean13_valido`/`formulas_dun14_valido` (dígito verificador GTIN errado), `formulas_active_requires_price` (fórmula ativa sem `list_price_cents` fora da linha `'essencial'`), o gatilho de mínimo de potes em `quote_items`. |
| Campo obrigatório ausente no corpo (ex.: `formula_name_snapshot` num POST em `quote_items`, `name` em `segments`) | **400** | `{"code":"23502","message":"null value in column \"X\" of relation \"Y\" violates not-null constraint"}` | Violação de `NOT NULL` — código diferente do `CHECK` (23502, não 23514), mas mesmo HTTP 400. Envie todas as colunas `not null` sem `default` (ver a lista de colunas de cada tabela na seção 6). |
| Resultado vazio (`GET` sem erro) | **200** | `[]` | **Nunca é erro** — pode ser que o filtro não bate com nada, ou que a linha existe mas a RLS a esconde do seu papel atual (ex.: fórmula inativa, para `anon`). Testado ao vivo nos dois casos. |
| Pedir uma coluna sem privilégio junto de colunas permitidas (`formula_sheet_approvals.notes` para `anon`) | **401** | igual à linha "tabela sem nenhum GRANT", acima (`code: 42501`) | Testado ao vivo (seção 6.6). O PostgREST nega a **chamada inteira**, não só a coluna. Peça só as colunas que o seu papel tem. |

## 13. Como revogar acesso, reduzir privilégio ou trocar a senha

Toda ação desta seção é feita pelo **dono**, no painel do Supabase ou via SQL
Editor — nunca pela API pública com o token da própria integração (não há
GRANT de escrita em `staff_profiles` para nenhum `authenticated`, de propósito).

- **Desativar por completo** (o token, enquanto não expirar, continua sendo um JWT
  `authenticated` válido — mas `private.is_active_staff()` passa a devolver `false`
  para ele, e é isso que muda o resultado prático, não o código de erro sozinho):
  nas tabelas onde `authenticated` tem GRANT de tabela incondicional
  (`formula_costs`, `staff_profiles`, `leads`, `quotes`, `quote_items`,
  `audit_logs`), leituras passam a devolver **HTTP 200 com `[]`** (a RLS filtra
  todas as linhas, a chamada em si continua "permitida"), e qualquer INSERT/UPDATE
  passa a devolver **403** (viola o `WITH CHECK` da policy). Nas tabelas de
  catálogo público (`formulas`, `segments`, `formula_compositions`, `ingredients`,
  `formula_sheet_approvals`), a leitura simplesmente volta a mostrar só o mesmo
  subconjunto público que `anon` já vê, e a escrita passa a dar 403. Ou seja:
  acesso de staff zerado de fato, mas **não espere um 401 genérico** em toda
  chamada - o sintoma varia por tabela, conforme a tabela acima.
  ```sql
  update public.staff_profiles set active = false
    where user_id = '<uuid do usuário de integração>';
  ```
- **Tirar só o acesso a Orçamentos**, mantendo o resto do catálogo:
  ```sql
  update public.staff_profiles set can_manage_quotes = false
    where user_id = '<uuid do usuário de integração>';
  ```
- **Reativar**: repetir a migration `20260921300000_staff_integracao.sql` (é
  idempotente) ou `update ... set active = true`.
- **Trocar a senha**: painel → Authentication → Users → usuário → "Reset password"
  (o dono define uma senha nova) ou "Send password recovery" (o outro sistema
  define, pelo link recebido por e-mail). Nenhuma das duas mexe em
  `staff_profiles` — o vínculo é pelo `user_id` (UUID), que não muda.
- **Apagar o usuário de vez** (Authentication → Users → excluir), em vez de só
  desativar: `staff_profiles.user_id` referencia `auth.users(id)` com
  `on delete cascade` (conferido no DDL), então a linha de `staff_profiles` some
  junto, sem passo extra. **Mas atenção**: `audit_logs.actor_id` referencia
  `auth.users(id)` **sem** `on delete cascade`/`set null` (conferido no DDL,
  `20260909210000_schema.sql`) — ou seja, pelo comportamento padrão do Postgres
  para *foreign key* sem regra de `ON DELETE`, apagar um usuário que já tem
  qualquer linha em `audit_logs` como autor tende a **falhar** com violação de
  chave estrangeira, e não foi testado ao vivo nesta tarefa (exigiria criar e
  apagar um usuário de verdade, fora do escopo de uma auditoria só leitura). Como
  o usuário de integração vai gravar dado desde o primeiro dia, é bem provável que
  já tenha linha em `audit_logs` na primeira vez que o dono for excluí-lo. **Por
  isso a forma recomendada de tirar o acesso é sempre a desativação** (primeiro
  item desta lista, `active = false`) — funcionalmente equivalente para fins de
  acesso, sem esbarrar nessa restrição, e mantém o histórico de auditoria intacto
  e legível.
