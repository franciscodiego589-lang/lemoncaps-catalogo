-- =====================================================================================
-- LEMON CAPS — CATÁLOGO PÚBLICO
-- rate_limit_rpc.sql — freio contra abuso trivial nas RPCs públicas de escrita
-- (fn_capture_lead, fn_generate_quote) + idempotência no orçamento (clique duplo).
--
-- ORDEM DE EXECUÇÃO: rodar depois de schema.sql + rls-policies.sql (as duas funções já
-- precisam existir, esta migration faz CREATE OR REPLACE sobre elas).
--
-- Idempotente: pode rodar mais de uma vez sem erro (create table/index if not exists,
-- create or replace function preserva os GRANTs já concedidos em rls-policies.sql,
-- porque GRANT é ligado à assinatura da função, não ao corpo — e a assinatura de
-- fn_capture_lead/fn_generate_quote não muda aqui).
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. TABELA DE CONTROLE DE JANELA (rate limit) — schema private, nunca exposta pela API
-- ---------------------------------------------------------------------------------
-- LIMITAÇÃO CONHECIDA, DECLARADA POR ESCRITO (não vender isto como algo que não é):
-- dentro de uma função Postgres chamada via PostgREST, NÃO existe IP de origem
-- confiável — a requisição HTTP já passou pelo gateway antes de chegar aqui, e o
-- IP não é repassado como parâmetro confiável ao SQL. A única chave disponível é o
-- dado que o próprio chamador informa: o telefone/WhatsApp. Por isso este freio NÃO
-- é proteção contra ataque distribuído (um script pode trocar de número a cada
-- chamada e passar direto) — é só um freio contra abuso trivial e clique/reenvio
-- repetido vindo do MESMO número. Proteção real contra bot distribuído fica fora do
-- Postgres (rate limit por IP no edge/gateway, captcha, etc.) — não implementado
-- aqui porque está fora do alcance desta camada.

create table if not exists private.rpc_rate_limit (
    id           bigint generated always as identity primary key,
    fn_name      text not null,             -- 'fn_capture_lead' | 'fn_generate_quote'
    rate_key     text not null,             -- telefone/whatsapp informado pelo chamador (única chave disponível)
    created_at   timestamptz not null default now()
);

comment on table private.rpc_rate_limit is 'Registro de chamadas das RPCs públicas (fn_capture_lead/fn_generate_quote) por telefone/whatsapp e janela de tempo. NÃO é proteção contra ataque distribuído — não há IP confiável dentro do Postgres/PostgREST, só o dado que o próprio chamador informa. É freio contra abuso trivial e clique/reenvio repetido vindo do mesmo número. Nunca exposta pela API (schema private, fora de "schemas" no config.toml). Cresce sem limpeza automática (sem cron neste projeto hoje) — se o volume incomodar, considerar um DELETE periódico por created_at.';

create index if not exists idx_rpc_rate_limit_lookup on private.rpc_rate_limit (fn_name, rate_key, created_at desc);


-- Função central de controle: conta tentativas de fn_name+rate_key na janela e
-- recusa (RAISE EXCEPTION, aborta a transação inteira) acima do teto. Usada pelas
-- duas RPCs públicas abaixo — DRY: a regra de janela mora num só lugar.
create or replace function private.fn_check_rate_limit(
    p_fn_name text,
    p_rate_key text,
    p_max_attempts integer,
    p_window_minutes integer
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    v_attempts integer;
begin
    select count(*) into v_attempts
    from private.rpc_rate_limit
    where fn_name = p_fn_name
      and rate_key = p_rate_key
      and created_at > now() - make_interval(mins => p_window_minutes);

    if v_attempts >= p_max_attempts then
        raise exception 'limite de % tentativas em % minutos atingido para este WhatsApp. Aguarde e tente novamente.', p_max_attempts, p_window_minutes;
    end if;

    insert into private.rpc_rate_limit (fn_name, rate_key) values (p_fn_name, p_rate_key);
end;
$$;

comment on function private.fn_check_rate_limit(text, text, integer, integer) is 'Conta chamadas de fn_name+rate_key (telefone/whatsapp) na janela de p_window_minutes; RAISE EXCEPTION (aborta a transação) se v_attempts >= p_max_attempts, senão registra a tentativa e segue. Chamada só internamente por fn_capture_lead/fn_generate_quote (SECURITY DEFINER, dono do objeto tem EXECUTE implícito) — sem GRANT explícito, mesmo padrão já usado nas funções de trigger deste schema (private.tg_touch_row, private.tg_enforce_minimum_order).';


-- ---------------------------------------------------------------------------------
-- 2. TABELA DE DEDUPLICAÇÃO DE ORÇAMENTO — schema private, nunca exposta pela API
-- ---------------------------------------------------------------------------------
-- Guarda hash(whatsapp + itens normalizados) -> quote_id, com created_at. NÃO é
-- chave única para sempre (um cliente pode legitimamente refazer o mesmo pedido
-- dias depois) — só serve pra detectar reenvio na JANELA CURTA (60s, ver
-- fn_generate_quote), que é o retrato exato de "clique duplo no botão".

create table if not exists private.quote_dedup (
    id           bigint generated always as identity primary key,
    dedup_key    text not null,
    quote_id     uuid not null references public.quotes(id) on delete cascade,
    created_at   timestamptz not null default now()
);

comment on table private.quote_dedup is 'dedup_key = sha256(whatsapp || itens normalizados). Usada por fn_generate_quote para devolver o quote_id já criado quando a mesma chamada chega de novo dentro de uma janela curta (60s) — trava o cenário de "dois cliques no botão criam dois orçamentos". Não é unique: o mesmo dedup_key pode voltar a aparecer legitimamente fora da janela (pedido repetido de verdade, dias depois), e isso deve criar um orçamento novo.';

create index if not exists idx_quote_dedup_lookup on private.quote_dedup (dedup_key, created_at desc);


-- ---------------------------------------------------------------------------------
-- 3. fn_capture_lead — mesma assinatura, com rate limit adicionado
-- ---------------------------------------------------------------------------------
-- Teto escolhido: 5 tentativas por WhatsApp a cada 10 minutos. Justificativa: um
-- visitante real pode errar o WhatsApp e reenviar 2-3 vezes em poucos minutos; 5
-- tentativas do MESMO número em 10 minutos já é bem acima desse comportamento
-- humano normal e é o sinal mais simples de reenvio automatizado/robô. CREATE OR
-- REPLACE preserva a assinatura (p_name, p_whatsapp, p_cart_snapshot) e os GRANTs
-- já concedidos em rls-policies.sql — nenhuma mudança no lado do cliente TypeScript.

create or replace function public.fn_capture_lead(
    p_name text,
    p_whatsapp text,
    p_cart_snapshot jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    v_lead_id uuid;
begin
    if p_name is null or btrim(p_name) = '' then
        raise exception 'nome é obrigatório';
    end if;
    if p_whatsapp is null or p_whatsapp !~ '^\+?[0-9]{10,15}$' then
        raise exception 'whatsapp inválido';
    end if;

    perform private.fn_check_rate_limit('fn_capture_lead', p_whatsapp, 5, 10);

    insert into public.leads (name, whatsapp, cart_snapshot)
    values (btrim(p_name), p_whatsapp, coalesce(p_cart_snapshot, '[]'::jsonb))
    returning id into v_lead_id;

    return v_lead_id;
end;
$$;

comment on function public.fn_capture_lead is 'Único ponto de entrada para criar um lead a partir do site público (anon). Valida nome/whatsapp, aplica rate limit (5 tentativas / 10 min por whatsapp, ver private.fn_check_rate_limit) e só então grava. Não expõe a tabela leads para escrita direta.';


-- ---------------------------------------------------------------------------------
-- 4. fn_generate_quote — mesma assinatura, com rate limit + idempotência (clique duplo)
-- ---------------------------------------------------------------------------------
-- Mesmo teto do item anterior (5/10min) e mesma justificativa.
--
-- Idempotência: abordagem escolhida foi detectar duplicata por
-- (whatsapp + conjunto de itens normalizado) numa janela CURTA de 60 segundos, em
-- vez de pedir uma chave de idempotência opcional do cliente. Motivo da escolha:
-- mais simples (zero mudança de contrato/assinatura da função, zero mudança no
-- tipo gerado lib/supabase/database.types.ts, zero mudança no client TypeScript
-- que um dia vier a chamar esta RPC) e resolve exatamente o cenário descrito
-- ("dois cliques no botão") sem exigir que o front-end gere e envie uma chave.
-- 60 segundos cobre folgadamente um clique duplo/triplo acidental ou um reenvio por
-- lentidão de rede, sem bloquear um pedido novo e legítimo do mesmo cliente minutos
-- depois — nesse caso o dedup_key pode repetir, mas fora da janela vira um
-- orçamento novo de verdade (ver comentário em private.quote_dedup).

create or replace function public.fn_generate_quote(
    p_customer_name text,
    p_customer_whatsapp text,
    p_items jsonb,                    -- [{"formula_id": "...", "quantity_potes": 100}, ...]
    p_lead_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    v_quote_id uuid;
    v_item jsonb;
    v_formula record;
    v_cost integer;
    v_items_key text;
    v_dedup_key text;
    v_existing_quote_id uuid;
begin
    if p_customer_name is null or btrim(p_customer_name) = '' then
        raise exception 'nome do cliente é obrigatório';
    end if;
    if p_customer_whatsapp is null or p_customer_whatsapp !~ '^\+?[0-9]{10,15}$' then
        raise exception 'whatsapp inválido';
    end if;
    if p_items is null or jsonb_array_length(p_items) = 0 then
        raise exception 'orçamento precisa de ao menos um item';
    end if;

    perform private.fn_check_rate_limit('fn_generate_quote', p_customer_whatsapp, 5, 10);

    -- Chave de deduplicação: whatsapp + itens (formula_id:quantity_potes, ordenados
    -- por formula_id pra não depender da ordem em que o carrinho manda o array).
    select string_agg(
             format('%s:%s', v.value->>'formula_id', v.value->>'quantity_potes'),
             '|' order by v.value->>'formula_id'
           )
      into v_items_key
      from jsonb_array_elements(p_items) as v(value);

    -- pgcrypto (digest/hmac) mora no schema "extensions" neste projeto, não em
    -- "public" nem "pg_catalog" — achado real ao testar (a chamada sem qualificar
    -- falha com "function digest(...) does not exist", porque o search_path desta
    -- função é travado para pg_catalog, public, de propósito, contra sequestro de
    -- search_path). Por isso o schema vai qualificado aqui, igual já se faz com
    -- private./public. em todo o resto do arquivo.
    v_dedup_key := encode(extensions.digest(p_customer_whatsapp || '|' || coalesce(v_items_key, ''), 'sha256'), 'hex');

    select qd.quote_id into v_existing_quote_id
    from private.quote_dedup qd
    where qd.dedup_key = v_dedup_key
      and qd.created_at > now() - interval '60 seconds'
    order by qd.created_at desc
    limit 1;

    if v_existing_quote_id is not null then
        -- Clique duplo detectado: devolve o orçamento já criado, não gera outro.
        return v_existing_quote_id;
    end if;

    insert into public.quotes (lead_id, customer_name, customer_whatsapp)
    values (p_lead_id, btrim(p_customer_name), p_customer_whatsapp)
    returning id into v_quote_id;

    for v_item in select * from jsonb_array_elements(p_items)
    loop
        select f.id, f.name, f.list_price_cents, f.minimum_order_potes, f.active
        into v_formula
        from public.formulas f
        where f.id = (v_item->>'formula_id')::uuid
          and f.deleted_at is null;

        if v_formula.id is null then
            raise exception 'fórmula % não encontrada', v_item->>'formula_id';
        end if;
        if not v_formula.active then
            raise exception 'fórmula % não está ativa', v_formula.name;
        end if;
        if v_formula.list_price_cents is null then
            raise exception 'fórmula % não tem preço público definido', v_formula.name;
        end if;

        -- custo real é lido aqui com privilégio elevado (SECURITY DEFINER) mesmo que
        -- anon não tenha nenhum GRANT em formula_costs — é exatamente para isso que
        -- esta função existe.
        select fc.unit_cost_cents into v_cost
        from public.formula_costs fc
        where fc.formula_id = v_formula.id
          and fc.deleted_at is null;

        insert into public.quote_items
            (quote_id, formula_id, formula_name_snapshot, quantity_potes, unit_cost_cents, unit_price_cents)
        values
            (v_quote_id, v_formula.id, v_formula.name,
             (v_item->>'quantity_potes')::integer, v_cost, v_formula.list_price_cents);
    end loop;

    insert into private.quote_dedup (dedup_key, quote_id) values (v_dedup_key, v_quote_id);

    return v_quote_id;
end;
$$;

comment on function public.fn_generate_quote is 'Único ponto de entrada para gerar orçamento a partir do carrinho público (anon). unit_price_cents nasce igual ao preço público (formulas.list_price_cents); unit_cost_cents nasce do custo real privado (formula_costs), lido com privilégio elevado sem nunca expor a tabela de custo ao chamador. Aplica rate limit (5/10min por whatsapp) e idempotência por clique duplo (janela de 60s, ver private.quote_dedup) antes de gravar. A validação de mínimo de potes roda no trigger trg_quote_items_min_order.';
