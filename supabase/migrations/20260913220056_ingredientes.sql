-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260913220056_ingredientes.sql - ficha por insumo: tabela public.ingredients + ligacao com
-- public.formula_compositions.
--
-- Contexto: a composicao de cada formula mora em public.formula_compositions, com
-- ingredient_name como texto livre (ex.: "Vitamina C (acido ascorbico)", "zinco
-- (bisglicinato de zinco)"). Essa coluna continua existindo e continua sendo o que a
-- tela de composicao exibe (e o texto exato do rotulo daquela formula, intocavel). Esta
-- migration so ACRESCENTA uma tabela de insumos normalizados e uma ligacao opcional
-- (ingredient_id, nullable) para alimentar uma pagina/painel por insumo no site, com
-- descricao, imagem e a alegacao autorizada pela ANVISA (levantada em paralelo, fora
-- desta migration - as colunas claim_* nascem vazias, para receber esse dado depois).
--
-- Normalizacao das 213 linhas em 70 insumos canonicos: feita por script Python lendo os
-- dados reais de producao (213 linhas / 28 formulas, conferido em 2026-09-12 via
-- Management API), documentada e validada mecanicamente antes de gerar o SQL abaixo -
-- ver relatorio da tarefa para o raciocinio de cada fusao aceita e cada fusao recusada
-- por falta de evidencia textual direta.
--
-- ORDEM DE EXECUCAO: depois de schema.sql e rls-policies.sql (repete o mesmo padrao de
-- controle, os mesmos triggers privados e o mesmo estilo de RLS ja usados no projeto).
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. ENUM ingredient_category
-- ---------------------------------------------------------------------------------

do $$ begin
    create type public.ingredient_category as enum ('vitamina', 'mineral', 'aminoacido', 'extrato_vegetal', 'outro');
exception when duplicate_object then null;
end $$;
comment on type public.ingredient_category is 'Classificacao do insumo para a ficha do site. Decidida por regra de nome (ver script de normalizacao), nunca por suposicao: quando a regra nao decide com clareza o insumo entra como outro, para revisao humana.';


-- ---------------------------------------------------------------------------------
-- 2. TABELA ingredients - o insumo canonico (ficha por insumo)
-- ---------------------------------------------------------------------------------
-- Nasce a partir da normalizacao de formula_compositions.ingredient_name (texto livre,
-- que continua existindo e continua sendo o que a tela de composicao exibe). Cada linha
-- aqui e UM insumo real (ex.: "Vitamina C"), com as grafias originais encontradas no
-- cadastro guardadas em synonyms, para rastrear a origem de cada uma.

create table if not exists public.ingredients (
    id                  uuid primary key default gen_random_uuid(),
    slug                text not null unique,
    name                text not null,
    synonyms            text[] not null default '{}',
    category            public.ingredient_category not null default 'outro',
    description         text,
    image_path          text,
    claim_text          text,
    claim_source        text,
    claim_min_amount    numeric(12,4),
    claim_verified_at   timestamptz,
    sort_order          integer not null default 0,
    active              boolean not null default true,
    version             integer not null default 1,
    metadata            jsonb not null default '{}'::jsonb,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz,
    deleted_by          uuid references auth.users(id),
    reason_deleted      text,
    created_by          uuid references auth.users(id),
    updated_by          uuid references auth.users(id),
    constraint ingredients_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on table public.ingredients is 'Insumo canonico (ficha por insumo do site). Cada linha agrupa uma ou mais grafias de formula_compositions.ingredient_name que sao o mesmo insumo real. Colunas de controle iguais as tabelas ricas do projeto (formulas, formula_compositions), nao as de segments, porque ingredients tambem guarda conteudo evolutivo (descricao, imagem, alegacao).';
comment on column public.ingredients.slug is 'Identificador de URL (/insumos/slug). Gerado a partir do name na migration, mesma constraint de formato das outras tabelas (kebab-case).';
comment on column public.ingredients.name is 'Nome canonico de exibicao (ex.: "Vitamina C"). Escolhido pelo script de normalizacao a partir das grafias reais do cadastro, sem inventar nome que nao aparece na fonte.';
comment on column public.ingredients.synonyms is 'Todas as grafias exatas encontradas em formula_compositions.ingredient_name que foram agrupadas neste insumo (inclui a forma quimica entre parenteses, quando existia). Serve para rastrear a origem e para auditar a normalizacao depois.';
comment on column public.ingredients.category is 'Classificacao por regra de nome (vitamina/mineral/aminoacido/extrato_vegetal/outro). Ver comentario do tipo ingredient_category.';
comment on column public.ingredients.description is 'Texto descritivo do insumo para a ficha publica. Nasce NULL nesta migration - conteudo a preencher depois pelo dono.';
comment on column public.ingredients.image_path is 'Caminho da imagem do insumo (bucket a definir). Nasce NULL nesta migration.';
comment on column public.ingredients.claim_text is 'Alegacao autorizada pela ANVISA para este insumo, em texto pronto para exibir na ficha. Nasce NULL - e levantada em processo separado (fora desta migration) e carregada depois. Enquanto for NULL, a ficha nao deve exibir alegacao nenhuma (nunca preencher com texto plausivel).';
comment on column public.ingredients.claim_source is 'URL ou identificacao da norma/fonte oficial que sustenta claim_text (ex.: link da IN/RDC vigente no site da ANVISA). Nasce NULL.';
comment on column public.ingredients.claim_min_amount is 'Quantidade minima por porcao exigida pela norma para poder usar a alegacao, quando a norma define um minimo. Nasce NULL. Sem coluna de unidade nesta migration (fora do escopo pedido) - quem carregar a alegacao depois precisa registrar a unidade junto ao dado (em claim_text ou em coluna futura), nunca supor.';
comment on column public.ingredients.claim_verified_at is 'Data em que a alegacao foi conferida contra a norma vigente (procedencia do dado, nao a data de criacao da linha). Nasce NULL ate a conferencia acontecer.';

create or replace trigger trg_ingredients_touch before insert or update on public.ingredients
    for each row execute function private.tg_touch_row();
create or replace trigger trg_ingredients_audit after insert or update or delete on public.ingredients
    for each row execute function private.tg_write_audit();

create index if not exists idx_ingredients_active_sort on public.ingredients (sort_order) where deleted_at is null;
create index if not exists idx_ingredients_category on public.ingredients (category) where deleted_at is null;
create index if not exists idx_ingredients_synonyms on public.ingredients using gin (synonyms);


-- ---------------------------------------------------------------------------------
-- 3. RLS ingredients - leitura publica dos ativos, escrita so staff
-- ---------------------------------------------------------------------------------
-- Mesmo padrao de segments/formulas em rls-policies.sql.

alter table public.ingredients enable row level security;

grant select on public.ingredients to anon, authenticated;
grant insert, update on public.ingredients to authenticated;

drop policy if exists ingredients_select on public.ingredients;
create policy ingredients_select on public.ingredients
    for select
    to anon, authenticated
    using (active or private.is_active_staff());

drop policy if exists ingredients_insert on public.ingredients;
create policy ingredients_insert on public.ingredients
    for insert
    to authenticated
    with check (private.is_active_staff());

drop policy if exists ingredients_update on public.ingredients;
create policy ingredients_update on public.ingredients
    for update
    to authenticated
    using (private.is_active_staff())
    with check (private.is_active_staff());

-- Reforco defensivo (idempotente): a policy de leitura publica acima avalia
-- private.is_active_staff() no predicado, e o anon so consegue rodar essa funcao se
-- tiver GRANT EXECUTE nela. Isso ja foi concedido em rls-policies.sql, mas repetir aqui
-- e barato e evita depender de o grant anterior continuar de pe - sem isso, toda
-- leitura publica de ingredients quebraria com "permission denied for function
-- is_active_staff" (mesmo problema ja documentado em rls-policies.sql).
grant execute on function private.is_active_staff() to anon, authenticated;


-- ---------------------------------------------------------------------------------
-- 4. LIGACAO formula_compositions -> ingredients
-- ---------------------------------------------------------------------------------
-- Coluna nova, NULLABLE, so para apontar qual insumo canonico aquela linha representa.
-- ingredient_name (texto exato do rotulo daquela formula) NAO muda e continua sendo o
-- que a tela de composicao exibe - ingredient_id e so a ligacao para a ficha do insumo.

alter table public.formula_compositions
    add column if not exists ingredient_id uuid references public.ingredients(id) on delete restrict;

comment on column public.formula_compositions.ingredient_id is 'Ligacao opcional com o insumo canonico (public.ingredients), para a ficha por insumo do site. NULLABLE de proposito - nao substitui nem altera ingredient_name, que continua sendo o texto exato do rotulo exibido na composicao daquela formula.';

create index if not exists idx_formula_compositions_ingredient on public.formula_compositions (ingredient_id);


-- ---------------------------------------------------------------------------------
-- 5. SEED - os insumos canonicos (gerado por script a partir dos dados reais)
-- ---------------------------------------------------------------------------------
-- 70 insumos, resultado de normalizar as 108 grafias distintas
-- reais de formula_compositions.ingredient_name (213 linhas, 28 formulas). idempotente
-- via "on conflict (slug) do nothing" - rodar de novo nao duplica.

insert into public.ingredients (slug, name, synonyms, category, sort_order) values
    ('biotina', 'Biotina', ARRAY['biotina (D-biotina)','Biotina (D-biotina)']::text[], 'vitamina'::public.ingredient_category, 10),
    ('vitamina-a', 'Vitamina A', ARRAY['vitamina A (acetato de retinol)','Vitamina A (acetato de retinol)']::text[], 'vitamina'::public.ingredient_category, 20),
    ('vitamina-b1', 'Vitamina B1', ARRAY['vitamina B1 (cloridrato de tiamina)']::text[], 'vitamina'::public.ingredient_category, 30),
    ('vitamina-b12', 'Vitamina B12', ARRAY['vitamina B12 (metilcobalamina)','Vitamina B12 (metilcobalamina)']::text[], 'vitamina'::public.ingredient_category, 40),
    ('vitamina-b2', 'Vitamina B2', ARRAY['vitamina B2 (riboflavina)']::text[], 'vitamina'::public.ingredient_category, 50),
    ('vitamina-b3', 'Vitamina B3', ARRAY['vitamina B3 (nicotinamida)','Vitamina B3 (nicotinamida)','niacina (nicotinamida)']::text[], 'vitamina'::public.ingredient_category, 60),
    ('vitamina-b5', 'Vitamina B5', ARRAY['vitamina B5 (D-pantotenato de cálcio)','Vitamina B5 (D-pantotenato de cálcio)','ácido pantotênico (D-pantotenato de cálcio)']::text[], 'vitamina'::public.ingredient_category, 70),
    ('vitamina-b6', 'Vitamina B6', ARRAY['vitamina B6 (cloridrato de piridoxina)','Vitamina B6 (cloridrato de piridoxina)']::text[], 'vitamina'::public.ingredient_category, 80),
    ('vitamina-b9', 'Vitamina B9', ARRAY['vitamina B9 (ácido fólico)','ácido fólico','Ácido fólico']::text[], 'vitamina'::public.ingredient_category, 90),
    ('vitamina-c', 'Vitamina C', ARRAY['vitamina C (ácido ascórbico)','Vitamina C (ácido ascórbico)','Vitamina C (Ácido ascórbico)']::text[], 'vitamina'::public.ingredient_category, 100),
    ('vitamina-d', 'Vitamina D', ARRAY['vitamina D (colecalciferol)','Vitamina D (colecalciferol)','vitamina D3 (colecalciferol)']::text[], 'vitamina'::public.ingredient_category, 110),
    ('vitamina-e', 'Vitamina E', ARRAY['vitamina E (acetato de DL-alfa-tocoferol)','Vitamina E (acetato de DL-alfa-tocoferol)','vitamina E (DL-α-tocoferol acetato)']::text[], 'vitamina'::public.ingredient_category, 120),
    ('vitamina-k', 'Vitamina K', ARRAY['vitamina K (menaquinona-7)']::text[], 'vitamina'::public.ingredient_category, 130),
    ('boro', 'Boro', ARRAY['boro (quelato de boro)']::text[], 'mineral'::public.ingredient_category, 140),
    ('calcio-elementar', 'Cálcio elementar', ARRAY['Cálcio elementar (carbonato de cálcio)']::text[], 'mineral'::public.ingredient_category, 150),
    ('cobre', 'Cobre', ARRAY['Cobre (bisglicinato de cobre)','cobre (cobre aminoácido quelato)','cobre (cobre quelado)']::text[], 'mineral'::public.ingredient_category, 160),
    ('cromo', 'Cromo', ARRAY['cromo (picolinato de cromo)','Picolinato de Cromo']::text[], 'mineral'::public.ingredient_category, 170),
    ('ferro', 'Ferro', ARRAY['Ferro (bisglicinato ferroso)','ferro (ferro aminoácido quelato)']::text[], 'mineral'::public.ingredient_category, 180),
    ('iodo', 'Iodo', ARRAY['iodo (iodeto de potássio)']::text[], 'mineral'::public.ingredient_category, 190),
    ('magnesio', 'Magnésio', ARRAY['magnésio (bisglicinato de magnésio)','Magnésio (bisglicinato de magnésio)','Magnésio (cloreto de magnésio)','Bisglicinato de magnésio']::text[], 'mineral'::public.ingredient_category, 200),
    ('selenio', 'Selênio', ARRAY['selênio (selênio quelato)']::text[], 'mineral'::public.ingredient_category, 210),
    ('silicio-organico', 'Silício orgânico', ARRAY['silício orgânico (ácido ortossilícico)']::text[], 'mineral'::public.ingredient_category, 220),
    ('zinco', 'Zinco', ARRAY['zinco (bisglicinato de zinco)','Zinco (bisglicinato de zinco)','bisglicinato de zinco']::text[], 'mineral'::public.ingredient_category, 230),
    ('acido-l-aspartico', 'Ácido L-aspártico', ARRAY['Ácido L-aspártico']::text[], 'aminoacido'::public.ingredient_category, 240),
    ('beta-alanina', 'Beta-alanina', ARRAY['Beta-alanina']::text[], 'aminoacido'::public.ingredient_category, 250),
    ('cloridrato-de-l-arginina', 'Cloridrato de L-arginina', ARRAY['cloridrato de L-arginina']::text[], 'aminoacido'::public.ingredient_category, 260),
    ('cloridrato-de-l-cisteina', 'Cloridrato de L-cisteína', ARRAY['cloridrato de L-cisteína']::text[], 'aminoacido'::public.ingredient_category, 270),
    ('l-arginina', 'L-arginina', ARRAY['L-arginina']::text[], 'aminoacido'::public.ingredient_category, 280),
    ('l-carnitina', 'L-carnitina', ARRAY['L-carnitina']::text[], 'aminoacido'::public.ingredient_category, 290),
    ('l-cisteina', 'L-cisteína', ARRAY['L-cisteína']::text[], 'aminoacido'::public.ingredient_category, 300),
    ('l-glutamina', 'L-glutamina', ARRAY['L-glutamina']::text[], 'aminoacido'::public.ingredient_category, 310),
    ('l-metionina', 'L-metionina', ARRAY['L-metionina']::text[], 'aminoacido'::public.ingredient_category, 320),
    ('l-teanina', 'L-teanina', ARRAY['L-teanina de folhas de Camellia sinensis']::text[], 'aminoacido'::public.ingredient_category, 330),
    ('l-tirosina', 'L-tirosina', ARRAY['L-tirosina']::text[], 'aminoacido'::public.ingredient_category, 340),
    ('l-triptofano', 'L-triptofano', ARRAY['L-triptofano']::text[], 'aminoacido'::public.ingredient_category, 350),
    ('taurina', 'Taurina', ARRAY['L-taurina','taurina']::text[], 'aminoacido'::public.ingredient_category, 360),
    ('extrato-de-cafe-verde', 'Extrato de café verde', ARRAY['extrato de café verde (Coffea arabica L., semente)','Extrato de café verde (Coffea arabica L., semente)']::text[], 'extrato_vegetal'::public.ingredient_category, 370),
    ('extrato-de-laranja-moro', 'Extrato de laranja moro', ARRAY['extrato de laranja moro (Citrus sinensis L. Osbeck)']::text[], 'extrato_vegetal'::public.ingredient_category, 380),
    ('extrato-de-rizomas-de-curcuma', 'Extrato de rizomas de cúrcuma', ARRAY['extrato de rizomas de cúrcuma (Curcuma longa L.)','Extrato de rizomas de cúrcuma (Curcuma longa L.)']::text[], 'extrato_vegetal'::public.ingredient_category, 390),
    ('extrato-fluido-de-semente-de-feno-grego', 'Extrato fluido de semente de feno-grego', ARRAY['extrato fluido de semente de feno-grego (Trigonella foenum-graecum L.)']::text[], 'extrato_vegetal'::public.ingredient_category, 400),
    ('acido-citrico', 'Ácido cítrico', ARRAY['ácido cítrico (INS 330)','Ácido cítrico (INS 330)']::text[], 'outro'::public.ingredient_category, 410),
    ('acido-hialuronico', 'Ácido hialurônico', ARRAY['ácido hialurônico']::text[], 'outro'::public.ingredient_category, 420),
    ('aromatizante-identico-ao-natural-de-limao', 'Aromatizante idêntico ao natural de limão', ARRAY['aromatizante idêntico ao natural de limão','Aromatizante idêntico ao natural de limão']::text[], 'outro'::public.ingredient_category, 430),
    ('cafeina', 'Cafeína', ARRAY['cafeína']::text[], 'outro'::public.ingredient_category, 440),
    ('cafeina-anidra', 'Cafeína anidra', ARRAY['cafeína anidra','Cafeína anidra']::text[], 'outro'::public.ingredient_category, 450),
    ('colageno-hidrolisado', 'Colágeno hidrolisado', ARRAY['colágeno hidrolisado','Colágeno hidrolisado']::text[], 'outro'::public.ingredient_category, 460),
    ('colageno-tipo-ii-nao-desnaturado', 'Colágeno tipo II não desnaturado', ARRAY['colágeno tipo II não desnaturado']::text[], 'outro'::public.ingredient_category, 470),
    ('colina', 'Colina', ARRAY['Colina (bitartarato de colina)']::text[], 'outro'::public.ingredient_category, 480),
    ('corante-verde', 'Corante verde', ARRAY['Corante verde (INS 102 e INS 133)']::text[], 'outro'::public.ingredient_category, 490),
    ('creatina-monoidratada', 'Creatina monoidratada', ARRAY['creatina monohidratada','Creatina monoidratada']::text[], 'outro'::public.ingredient_category, 500),
    ('dha', 'DHA', ARRAY['DHA (ácido docosaexaenoico)']::text[], 'outro'::public.ingredient_category, 510),
    ('dioxido-de-silicio', 'Dióxido de silício', ARRAY['dióxido de silício (INS 551)','Dióxido de silício (INS 551)']::text[], 'outro'::public.ingredient_category, 520),
    ('edulcorante-sucralose', 'Edulcorante sucralose', ARRAY['edulcorante sucralose (INS 955)','Edulcorante sucralose (INS 955)']::text[], 'outro'::public.ingredient_category, 530),
    ('epa', 'EPA', ARRAY['EPA (ácido eicosapentaenoico)']::text[], 'outro'::public.ingredient_category, 540),
    ('espirulina', 'Espirulina', ARRAY['Espirulina (Arthrospira platensis)']::text[], 'outro'::public.ingredient_category, 550),
    ('feno-grego-em-po', 'Feno-grego em pó', ARRAY['Feno-grego em pó (Trigonella foenum-graecum L., semente)']::text[], 'outro'::public.ingredient_category, 560),
    ('fosfatidilserina', 'Fosfatidilserina', ARRAY['Fosfatidilserina']::text[], 'outro'::public.ingredient_category, 570),
    ('guarana-em-po', 'Guaraná em pó', ARRAY['guaraná em pó (Paullinia cupana Kunth, semente)']::text[], 'outro'::public.ingredient_category, 580),
    ('hialuronato-de-sodio', 'Hialuronato de sódio', ARRAY['hialuronato de sódio']::text[], 'outro'::public.ingredient_category, 590),
    ('inositol', 'Inositol', ARRAY['inositol (mio-inositol)']::text[], 'outro'::public.ingredient_category, 600),
    ('maltodextrina', 'Maltodextrina', ARRAY['maltodextrina','Maltodextrina']::text[], 'outro'::public.ingredient_category, 610),
    ('melatonina', 'Melatonina', ARRAY['melatonina','Melatonina']::text[], 'outro'::public.ingredient_category, 620),
    ('metilsulfonilmetano', 'Metilsulfonilmetano', ARRAY['metilsulfonilmetano (MSM)','Metilsulfonilmetano (MSM)']::text[], 'outro'::public.ingredient_category, 630),
    ('oleo-de-peixe-tg', 'Óleo de peixe TG', ARRAY['Óleo de peixe TG']::text[], 'outro'::public.ingredient_category, 640),
    ('omega-3-total', 'Ômega-3 total', ARRAY['Ômega-3 total']::text[], 'outro'::public.ingredient_category, 650),
    ('outros-acidos-graxos-omega-3', 'Outros ácidos graxos ômega-3', ARRAY['Outros ácidos graxos ômega-3']::text[], 'outro'::public.ingredient_category, 660),
    ('psyllium', 'Psyllium', ARRAY['Psyllium (Plantago Ovata)']::text[], 'outro'::public.ingredient_category, 670),
    ('quercetina', 'Quercetina', ARRAY['Quercetina']::text[], 'outro'::public.ingredient_category, 680),
    ('siliciumax', 'Siliciumax', ARRAY['Siliciumax (ácido ortosilícico estabilizado)']::text[], 'outro'::public.ingredient_category, 690),
    ('sulfato-de-glucosamina-com-cloreto-de-potassio', 'Sulfato de glucosamina com cloreto de potássio', ARRAY['sulfato de glucosamina com cloreto de potássio']::text[], 'outro'::public.ingredient_category, 700)
on conflict (slug) do nothing;


-- ---------------------------------------------------------------------------------
-- 6. LIGACAO - cada uma das 213 linhas de formula_compositions aponta para o seu insumo
-- ---------------------------------------------------------------------------------
-- Gerado pelo mesmo script, casando cada composicao_id (id real da linha) com o slug do
-- insumo que ela representa. Idempotente: rodar de novo resolve para o mesmo
-- ingredient_id (determinismo), sem duplicar nem alterar ingredient_name.

with ligacao_insumo(composicao_id, insumo_slug) as (
    values
    ('ca021424-e05a-49cd-ae6e-c608bfee2447'::uuid, 'vitamina-c'),
    ('82a05731-8b8a-4cb4-ac71-dffb25733428'::uuid, 'vitamina-e'),
    ('13120904-4039-4a52-8a2b-530015dce1b4'::uuid, 'zinco'),
    ('0e7df603-fd19-4e41-86ec-a9bfd71f26dd'::uuid, 'vitamina-a'),
    ('a75f3d48-e542-49d0-bd78-529c03637897'::uuid, 'biotina'),
    ('20b4f7f9-022e-44e6-b58d-17b4d090e099'::uuid, 'vitamina-c'),
    ('5ca00fbc-c8ab-4ee2-b88f-203aa9b622f1'::uuid, 'l-metionina'),
    ('a5f0cb7b-31f4-4c13-a874-65c426750bfc'::uuid, 'cloridrato-de-l-cisteina'),
    ('9b76a4cf-cae1-4c0d-a7d6-591f9fffaa5f'::uuid, 'metilsulfonilmetano'),
    ('af917e12-2b76-4fa9-ad75-07f50bfda388'::uuid, 'hialuronato-de-sodio'),
    ('a4945742-58fe-46f7-b58e-25e97bc0f5d4'::uuid, 'siliciumax'),
    ('6f10e4ed-b2d7-4cba-a96f-e259f1c99ef2'::uuid, 'vitamina-e'),
    ('46bd07de-d1f4-46e2-842c-d4df694d7bd4'::uuid, 'vitamina-b3'),
    ('5b7031d3-b79a-48b8-a3d1-c0ecd7715472'::uuid, 'zinco'),
    ('9d929bff-6d8a-4d1f-95cf-1afec5743159'::uuid, 'vitamina-b6'),
    ('35a57887-2fd7-49ca-8d00-654873f65de2'::uuid, 'vitamina-b5'),
    ('17e4db4a-11d5-4abb-83da-80ca4291b915'::uuid, 'vitamina-b2'),
    ('0b92d72b-5b03-4b35-aaf9-f90a65289100'::uuid, 'vitamina-a'),
    ('7faacdb8-3c82-4c46-923f-d7164ef09a50'::uuid, 'cobre'),
    ('e51af377-8a89-4900-a0fc-99d91bc92eb8'::uuid, 'vitamina-b9'),
    ('5ff83068-8ce8-4a98-8f59-39456067e17e'::uuid, 'iodo'),
    ('aad0d456-bdfa-455d-a166-cff6429ab599'::uuid, 'selenio'),
    ('33a5c171-7a70-433e-b537-21e8a25ace0c'::uuid, 'vitamina-d'),
    ('519dd83e-7c05-4c63-b13f-45c23cb6021b'::uuid, 'biotina'),
    ('863f9694-8ddb-4af8-9fea-039f7af2ab96'::uuid, 'vitamina-b12'),
    ('f91994ab-859e-40ba-939e-da13b99dbb61'::uuid, 'vitamina-c'),
    ('d6558a94-2d0f-4323-92a7-769eb08d6043'::uuid, 'colageno-hidrolisado'),
    ('79793b46-3ae4-412c-ad2b-9d2f83ad29d7'::uuid, 'l-metionina'),
    ('5a7a6b28-2f23-40da-9cf5-8b1212d827fb'::uuid, 'l-cisteina'),
    ('28321380-ee8a-4828-81b2-c7f673a8cf33'::uuid, 'vitamina-e'),
    ('2b2cc39c-542d-403e-a2b4-fe9986effb4d'::uuid, 'metilsulfonilmetano'),
    ('c83e2ec8-a5fd-45de-ba03-2cd0b4b4ee0e'::uuid, 'acido-hialuronico'),
    ('5a11bd5d-6260-450f-a825-c9fe539e27ba'::uuid, 'silicio-organico'),
    ('f780634e-238e-4199-8869-1a02aacb59f0'::uuid, 'vitamina-b3'),
    ('a9695904-f797-49d0-aa88-b39338a4235d'::uuid, 'zinco'),
    ('d29a05b6-eb64-4f3b-8b6a-bd233d219eb4'::uuid, 'vitamina-b6'),
    ('b8fb3dbd-8645-4890-bc72-c14b5dbb3dac'::uuid, 'vitamina-b5'),
    ('dfd70968-1517-47ae-8648-d434865d33bc'::uuid, 'vitamina-b2'),
    ('ce5e340f-b8d7-4db5-8eca-540a2cf93006'::uuid, 'vitamina-a'),
    ('593adfd3-2adb-4e6d-8b65-15596014f0d1'::uuid, 'cobre'),
    ('90de0f21-e4a3-4fbc-bf72-1534e1a43a80'::uuid, 'vitamina-b9'),
    ('338f00bd-36ea-40a8-b4fb-50a0cbfc2fea'::uuid, 'iodo'),
    ('68d96c76-1e0b-47ad-96cd-742826aeb12a'::uuid, 'selenio'),
    ('4cc3a3ec-7cf0-4e5d-b083-ccb82db83868'::uuid, 'vitamina-d'),
    ('49a2e3ee-e7b9-4e41-9d5a-0d9791b9b11f'::uuid, 'biotina'),
    ('1dac4746-06d7-4650-b84b-852e1a469424'::uuid, 'vitamina-b12'),
    ('8579322f-31db-43f3-87cd-d0a74a8d7d39'::uuid, 'creatina-monoidratada'),
    ('cf1b6339-255f-40bb-a8e3-c06ab43d48d8'::uuid, 'creatina-monoidratada'),
    ('090c25ca-2bf0-4c5a-82b0-d8bab6d585ed'::uuid, 'creatina-monoidratada'),
    ('5ceed07b-c2a7-4feb-b367-51ebaa53a770'::uuid, 'creatina-monoidratada'),
    ('83930849-21f9-4da4-bb19-678cad257827'::uuid, 'vitamina-c'),
    ('c0718e3b-4f84-425d-92a4-608e98630856'::uuid, 'extrato-de-cafe-verde'),
    ('fecf3129-b998-4422-9667-b7f8b1ade6ed'::uuid, 'extrato-de-laranja-moro'),
    ('acd80397-ebb1-46c7-ae66-b4808d2eddbd'::uuid, 'extrato-de-rizomas-de-curcuma'),
    ('68ca994b-a50b-4d36-8e57-595641aeca33'::uuid, 'zinco'),
    ('1fb7cce8-9bf2-43ff-8c6c-4891c91b5423'::uuid, 'vitamina-c'),
    ('a23d2ad6-3534-4445-8363-badde5c76ec6'::uuid, 'extrato-de-cafe-verde'),
    ('dcaa846a-06e6-4cd9-ac46-eab6fab4e308'::uuid, 'extrato-de-laranja-moro'),
    ('c59b4a45-ace7-4354-af8e-c88ec28d88b5'::uuid, 'extrato-de-rizomas-de-curcuma'),
    ('328b74d1-cc17-4c80-ae56-8e7a74d03ac7'::uuid, 'zinco'),
    ('833fa4a8-083b-43ef-bbd8-e501c48929dc'::uuid, 'metilsulfonilmetano'),
    ('cbd2214e-056a-4bb6-bb9f-061a370f201f'::uuid, 'sulfato-de-glucosamina-com-cloreto-de-potassio'),
    ('2cb42fbd-6a80-4452-90f5-2291183ebad9'::uuid, 'vitamina-c'),
    ('d9f3dc32-bfd2-4126-818c-d8e34f564a04'::uuid, 'magnesio'),
    ('21ade732-7075-4761-9902-9e6065b366c6'::uuid, 'colageno-tipo-ii-nao-desnaturado'),
    ('9f85576e-056e-4577-bb06-0e2415fe7129'::uuid, 'vitamina-e'),
    ('9b56258f-0b73-4ffb-9656-dcb03d36eb76'::uuid, 'zinco'),
    ('051527cf-4c56-44d8-93e8-026c6a0104e6'::uuid, 'ferro'),
    ('70d26d05-16c4-4136-b1a2-0e1224543ca9'::uuid, 'vitamina-b6'),
    ('6efc2fe4-2546-4754-bd4a-f3b832f12228'::uuid, 'selenio'),
    ('390e24a1-dc60-4e65-ad1d-9aad327cde54'::uuid, 'vitamina-d'),
    ('51d155a3-fdca-4f19-b424-d089b0c683d2'::uuid, 'vitamina-b12'),
    ('8a63ce8a-29ca-4681-aa2d-f2b81670b939'::uuid, 'psyllium'),
    ('85ca3764-b4c8-4170-a8da-99035b35cb93'::uuid, 'espirulina'),
    ('c79edf08-8099-49ad-947d-d288bee57003'::uuid, 'cromo'),
    ('ef3f382b-e73b-4382-a43e-b4be2a71470a'::uuid, 'colina'),
    ('135f309a-30ff-4884-86e7-ff7f59bce0e0'::uuid, 'l-tirosina'),
    ('51f7d0e0-8edc-4378-9878-176af123cb1a'::uuid, 'l-teanina'),
    ('9347c683-5ec9-4350-86ac-ca225090762e'::uuid, 'l-carnitina'),
    ('3e091c51-b8af-4a13-b563-29cdff1e4466'::uuid, 'magnesio'),
    ('fdb2175d-cce6-4d17-8c98-107b7b64b8a0'::uuid, 'inositol'),
    ('62da7c85-4d13-4769-acd2-05d89d28334a'::uuid, 'vitamina-b6'),
    ('6b2c735f-2923-4d86-a471-1c9d564dda39'::uuid, 'vitamina-d'),
    ('210c1a95-38fa-4290-a60d-49d18ef88c55'::uuid, 'vitamina-b12'),
    ('658c57f1-81d5-48f5-9dd8-1bc1866c3123'::uuid, 'l-triptofano'),
    ('98387739-56eb-4fae-a4d2-fe97c6b00472'::uuid, 'acido-l-aspartico'),
    ('e738db44-e968-42b0-b138-90bfd2a6d175'::uuid, 'l-glutamina'),
    ('2697d672-c90c-4d98-91ef-2cc12ca16983'::uuid, 'fosfatidilserina'),
    ('e9c27104-60d9-4475-974c-efdaeb5695f2'::uuid, 'magnesio'),
    ('1f8775a7-a715-4f77-a5d7-364454e574c6'::uuid, 'zinco'),
    ('4e5c9cf1-d3b6-443e-8898-46bc9894e4dd'::uuid, 'dioxido-de-silicio'),
    ('aa272a30-765d-4d63-93fd-0fd9a47f6314'::uuid, 'melatonina'),
    ('f66de67f-bbbe-486d-810d-158173508cbc'::uuid, 'biotina'),
    ('7d1c9846-c180-41ba-8d52-de66d4e821de'::uuid, 'l-triptofano'),
    ('d006aef1-7b4b-45a9-9d96-a3b716bb1ef3'::uuid, 'melatonina'),
    ('63734f6c-b417-46e6-9d98-aa16610aa150'::uuid, 'feno-grego-em-po'),
    ('4d7bea6f-470f-4109-b313-a56e46015d20'::uuid, 'extrato-de-laranja-moro'),
    ('c378b9bb-9b4f-4497-8543-d0cac3622d3e'::uuid, 'extrato-de-cafe-verde'),
    ('507439f3-21fc-4f31-ab8e-c374e0cb51d2'::uuid, 'extrato-de-rizomas-de-curcuma'),
    ('2b5ed4b7-c06b-4fa7-b0f2-d57bada19f9c'::uuid, 'vitamina-a'),
    ('04ff9689-3229-4427-bcbe-104e42d00256'::uuid, 'cromo'),
    ('54b13bd0-ab8e-41e4-b31b-00e2652abcff'::uuid, 'dioxido-de-silicio'),
    ('2211d779-62bd-49cf-a199-c1b8519e66f7'::uuid, 'calcio-elementar'),
    ('6a12ccd7-0fab-4ac1-adf7-bc76a58a471e'::uuid, 'magnesio'),
    ('0818b07e-4414-4e76-8577-a689acef5084'::uuid, 'vitamina-c'),
    ('18978d35-fda5-419e-b29e-50b5335b8bc8'::uuid, 'ferro'),
    ('76193643-322c-4a23-9e97-06fc01f4ac55'::uuid, 'vitamina-b3'),
    ('f6b43a90-0b0a-45f6-b673-a08e39badb96'::uuid, 'vitamina-b5'),
    ('3db12132-4114-4efd-a753-d36d765f61ee'::uuid, 'vitamina-e'),
    ('2b652d48-51e9-471a-9686-43773a5cc639'::uuid, 'cobre'),
    ('b69c1ab5-7aeb-4711-ad27-00ca80e14227'::uuid, 'vitamina-b9'),
    ('bb5a27df-eefd-4765-8772-f6fea33ef6a0'::uuid, 'vitamina-d'),
    ('f817285d-3198-4040-95a0-7e5fada87ce1'::uuid, 'vitamina-b12'),
    ('7debf286-b8db-4993-915d-5e01b1626091'::uuid, 'vitamina-c'),
    ('de344ada-9511-4565-b6e5-9dc2559d0b59'::uuid, 'magnesio'),
    ('399c124e-4f71-4779-b181-1b82ea7fe3cd'::uuid, 'l-teanina'),
    ('2df3732e-e0e4-4e35-b2d3-2adb9be307d4'::uuid, 'vitamina-b3'),
    ('b0ab187f-fe5a-4cce-9df3-506d118d4000'::uuid, 'zinco'),
    ('c1736786-7511-4da2-bf7c-9b111d5ccc5c'::uuid, 'vitamina-e'),
    ('9239ce94-7268-4a74-b959-e85b17f2c158'::uuid, 'vitamina-b5'),
    ('21af83be-60f0-470e-8ce9-5f45afb52e3f'::uuid, 'boro'),
    ('18909aac-5deb-4101-9cba-d8521f0eba88'::uuid, 'vitamina-b6'),
    ('f1b73441-a9a8-482d-9e7f-b9fcd50173e7'::uuid, 'vitamina-b2'),
    ('34e6664e-b3f5-4fc6-a55b-79d47c1821cb'::uuid, 'vitamina-a'),
    ('165d107c-38ea-4495-8059-4d3d3eba3b05'::uuid, 'vitamina-b1'),
    ('2a0a9dc5-1da7-49db-9ea2-8baa1e462e38'::uuid, 'cobre'),
    ('c92571f0-eb74-4cb4-be72-5403d64d028a'::uuid, 'vitamina-b9'),
    ('a8107684-e01b-410b-9a07-bcfe91b75c40'::uuid, 'cromo'),
    ('5f3d1273-4ff7-4b05-bdfd-c6d6af6b1ee5'::uuid, 'vitamina-k'),
    ('c9c0ea3d-1dcd-41df-bb88-52576a8e58cf'::uuid, 'selenio'),
    ('f12ceecf-74cd-4061-bbf4-3fd2a268730b'::uuid, 'vitamina-d'),
    ('6bb6aea7-ab4f-4e98-9224-88dc2aed5d53'::uuid, 'vitamina-b12'),
    ('11090db8-a09a-48ee-bd8e-dc271da50f15'::uuid, 'oleo-de-peixe-tg'),
    ('4dcd0cb5-c302-4ac9-b514-951457b61e78'::uuid, 'omega-3-total'),
    ('cdf58247-1a9f-49f5-9e7c-140ffa7adfb0'::uuid, 'epa'),
    ('d53968e5-ee76-4bbc-8272-0b1ed7f35c08'::uuid, 'dha'),
    ('efa3e024-3022-4d98-9ea4-eb90cf3a5d71'::uuid, 'outros-acidos-graxos-omega-3'),
    ('9725cfb3-872e-4669-9f43-7e6339704228'::uuid, 'beta-alanina'),
    ('341b2f1a-f88b-4ced-8e95-62600ccf470a'::uuid, 'maltodextrina'),
    ('5f68639d-eacd-48fd-a98c-6c1d17e9aec8'::uuid, 'acido-citrico'),
    ('8ddbe200-bc4e-4321-9457-58a043f68b47'::uuid, 'taurina'),
    ('a9e798bf-c692-409b-9720-ce7e66cb7585'::uuid, 'l-arginina'),
    ('1c47e422-b3a1-4071-b3ff-8b028d06eeda'::uuid, 'l-tirosina'),
    ('8238c788-0ec4-403d-8de6-3693b3d234d0'::uuid, 'creatina-monoidratada'),
    ('941dea0f-300e-4557-9a16-2e1283990c21'::uuid, 'cafeina-anidra'),
    ('8649c6c5-7bce-4305-8d9d-6986b936cab3'::uuid, 'aromatizante-identico-ao-natural-de-limao'),
    ('82f76b34-a2f7-4cf8-bb23-9fe780ddab6e'::uuid, 'dioxido-de-silicio'),
    ('e3806645-9910-43e1-b597-1c127f48a05e'::uuid, 'edulcorante-sucralose'),
    ('c63100b0-0364-468c-90d3-ba0fa998cbdc'::uuid, 'vitamina-b6'),
    ('e6051c6e-e445-4a4d-967d-d5a0b53e093e'::uuid, 'vitamina-b12'),
    ('be727bd9-061f-4dc6-8d4f-42c1e3b184c3'::uuid, 'creatina-monoidratada'),
    ('a054abdb-50de-4cd9-8f99-b28d53711c33'::uuid, 'taurina'),
    ('d73c43f3-d31a-4f67-b4a8-ac0743757d27'::uuid, 'acido-citrico'),
    ('07d581b8-75ca-4868-9289-dc8111c6477c'::uuid, 'l-tirosina'),
    ('05d2a88d-9acd-4f87-b0ff-5e26d3674661'::uuid, 'aromatizante-identico-ao-natural-de-limao'),
    ('989cf75f-0734-4e71-a4cd-89e890bbe3ff'::uuid, 'maltodextrina'),
    ('3352e6da-f8cd-4166-b9de-614e9c54c0e4'::uuid, 'beta-alanina'),
    ('c49db812-f23b-478b-a796-67af14e9da63'::uuid, 'cafeina-anidra'),
    ('458d3f5a-a22e-4def-88f7-cb377176e9d0'::uuid, 'dioxido-de-silicio'),
    ('e72895dc-0a11-4477-8c0c-8bc08735c54c'::uuid, 'edulcorante-sucralose'),
    ('d334a28b-474c-415b-925a-51be3bf7e26f'::uuid, 'feno-grego-em-po'),
    ('048931ee-67d2-4007-b68a-52517c1df73b'::uuid, 'taurina'),
    ('07504008-59db-4bfe-a079-7bd0f5b45f84'::uuid, 'guarana-em-po'),
    ('b04cf5ae-adbc-46fb-b6e5-f9591fa6c010'::uuid, 'cafeina'),
    ('e7b6f2fb-5f7d-49be-9335-99a879f29db0'::uuid, 'l-carnitina'),
    ('5b9f72d9-d30d-4838-a489-a234d8eadb4e'::uuid, 'cloridrato-de-l-arginina'),
    ('f2eb57c5-1e86-4e6f-8bec-d9a377a05c03'::uuid, 'zinco'),
    ('b839644a-3b3d-4f28-a73a-cca8f21f3c89'::uuid, 'vitamina-b6'),
    ('14b5eda4-09f8-48a6-801f-7c0471a4508d'::uuid, 'magnesio'),
    ('589b8530-c46a-4fa8-a05b-5b107c6d093c'::uuid, 'quercetina'),
    ('84038d11-ac83-481b-83ce-2ee5f39c8bdd'::uuid, 'extrato-de-rizomas-de-curcuma'),
    ('cfe4b5a6-fa5f-4218-b4af-5123deac27b1'::uuid, 'l-glutamina'),
    ('103935fd-6b54-4e1f-b6c6-3911b34db243'::uuid, 'vitamina-b6'),
    ('1972b3c5-3293-4925-8b5f-e77ea90d22ea'::uuid, 'zinco'),
    ('ec9a5a6d-0e35-4090-ada6-9471ef5e046b'::uuid, 'vitamina-a'),
    ('871a85ae-ed93-4fbe-b934-05b720b7f6d4'::uuid, 'magnesio'),
    ('22083508-8149-4278-b78d-448fae6150cd'::uuid, 'inositol'),
    ('a744dc77-6249-41d8-bf58-6a7481c83354'::uuid, 'l-teanina'),
    ('fe88011a-b9ec-4d7f-bde4-bf5921e4df5b'::uuid, 'vitamina-b6'),
    ('066d5f59-94b1-4dd9-a693-a1b1baa76889'::uuid, 'melatonina'),
    ('c853f3e1-9ca3-49c4-b3f2-066ee2619d09'::uuid, 'colageno-hidrolisado'),
    ('607cce26-83ca-4864-8c35-5ebb4fa03a11'::uuid, 'vitamina-c'),
    ('004643ef-d6c5-48f3-ae62-869e73e0e46f'::uuid, 'acido-citrico'),
    ('0ee0684b-05d9-43e1-a80b-4db108d4dc1e'::uuid, 'aromatizante-identico-ao-natural-de-limao'),
    ('ac9f1c64-669d-4f49-a7af-d76535f8b241'::uuid, 'dioxido-de-silicio'),
    ('f7090183-d107-4698-9677-b89e66079492'::uuid, 'edulcorante-sucralose'),
    ('85222452-3ca6-45ef-b39c-fece2cc54c5d'::uuid, 'maltodextrina'),
    ('701cd426-e534-4e24-b221-9225560275ce'::uuid, 'corante-verde'),
    ('1aa9a152-9222-4d15-96ea-aa2b7f9bb087'::uuid, 'zinco'),
    ('0a9d11b7-cb21-4dd4-9dc5-24e65e25fb47'::uuid, 'extrato-de-cafe-verde'),
    ('96f6b46e-5a64-4165-9e93-88d84d58f705'::uuid, 'extrato-de-rizomas-de-curcuma'),
    ('0ab25ad9-9756-44a2-9b94-1219185fd4b5'::uuid, 'extrato-fluido-de-semente-de-feno-grego'),
    ('e2d5c12c-8cfe-4bd8-a2f8-03c5ab958ac4'::uuid, 'cromo'),
    ('ddeb271b-bc77-43ef-8d04-9a27dec4b7f4'::uuid, 'vitamina-d'),
    ('3fd277db-d733-4c4b-8510-bca347be041f'::uuid, 'vitamina-b12'),
    ('f20fa176-a8ba-45ea-8612-9c57f1ba0f0a'::uuid, 'extrato-de-cafe-verde'),
    ('a32b6f1f-a5dd-4785-8514-24c3d5e224c8'::uuid, 'extrato-de-rizomas-de-curcuma'),
    ('ab755baf-7fca-48f9-a043-b2f51e859133'::uuid, 'extrato-fluido-de-semente-de-feno-grego'),
    ('b75ea84a-4173-4963-a3ce-2f96a778c1e5'::uuid, 'cromo'),
    ('f2aaedef-98c6-4492-8e95-42410a98fa3d'::uuid, 'vitamina-d'),
    ('3c528bca-d093-4e0a-89bb-074ebe88e4be'::uuid, 'vitamina-b12'),
    ('c0fc2df7-025b-4507-af16-87aa2b52a0bd'::uuid, 'magnesio'),
    ('a3af49e9-8897-4ea9-afcd-872bdd3497c8'::uuid, 'l-teanina'),
    ('566b5f34-9814-4767-ace1-9c6fc72b9013'::uuid, 'zinco'),
    ('57d9cc4f-29d6-4b76-bc1d-40f85ab1c58c'::uuid, 'boro'),
    ('6ba82364-48ce-43f1-8086-20948d681464'::uuid, 'vitamina-b6'),
    ('5a2fb65b-c2b0-44f2-b640-b87b5d9ec4fd'::uuid, 'vitamina-d'),
    ('694e210a-06e4-41f4-9af3-f941a4d03707'::uuid, 'magnesio'),
    ('85b0b953-1585-4b8f-b50e-1739e0c80429'::uuid, 'l-teanina'),
    ('e08413ca-93db-406d-9492-6d7e89760f57'::uuid, 'zinco'),
    ('d0146d75-e01c-4052-bf42-931077869e3d'::uuid, 'boro'),
    ('a8016811-84c3-46ab-a0f0-06eaa930657f'::uuid, 'vitamina-b6'),
    ('d0176ba8-9198-4302-9522-52112ee6ed25'::uuid, 'vitamina-d')
)
update public.formula_compositions as fc
set ingredient_id = i.id
from ligacao_insumo li
join public.ingredients i on i.slug = li.insumo_slug
where fc.id = li.composicao_id;
