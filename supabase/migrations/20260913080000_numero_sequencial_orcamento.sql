-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260913080000_numero_sequencial_orcamento.sql
--
-- O cliente recebia o orcamento identificado pelo UUID interno:
--   "Orcamento 69127f52-a1b3-4c9d-..."  no titulo do PDF
--   "orcamento-lemon-caps-69127f52.pdf" no nome do arquivo
-- Pedido do dono (13/09/2026): numero sequencial simples, a partir de 1, "e nao
-- esse monte de letras e numeros".
--
-- A coluna quotes.quote_number JA existia e JA era sequencial (bigint identity)
-- desde o schema inicial - o problema e que fn_generate_quote so devolvia o uuid,
-- entao o front nunca via o numero e caia no id como ultimo recurso. Aqui a
-- funcao passa a devolver os dois.
--
-- Tambem reinicia a contagem em 1: os testes de desenvolvimento consumiram a
-- sequencia ate 26, e o primeiro orcamento real de um catalogo que ainda nem foi
-- publicado nao deve nascer com numero 27.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. fn_generate_quote passa a devolver (quote_id, quote_number)
-- ---------------------------------------------------------------------------------
-- Trocar o tipo de retorno exige derrubar a funcao antes: CREATE OR REPLACE nao
-- muda assinatura. O corpo abaixo e o de 20260912225011 sem nenhuma alteracao de
-- logica - so os dois "return" e a declaracao do retorno.

drop function if exists public.fn_generate_quote(text, text, jsonb, uuid);

create function public.fn_generate_quote(
    p_customer_name text,
    p_customer_whatsapp text,
    p_items jsonb,                    -- [{"formula_id": "...", "quantity_potes": 100}, ...]
    p_lead_id uuid default null
)
returns table (quote_id uuid, quote_number bigint)
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
    if char_length(btrim(p_customer_name)) > 120 then
        raise exception 'nome do cliente é longo demais';
    end if;
    if p_customer_whatsapp is null or p_customer_whatsapp !~ '^\+?[0-9]{10,15}$' then
        raise exception 'whatsapp inválido';
    end if;
    if p_items is null or jsonb_array_length(p_items) = 0 then
        raise exception 'orçamento precisa de ao menos um item';
    end if;
    if jsonb_array_length(p_items) > 50 then
        raise exception 'orçamento com itens demais';
    end if;

    perform private.fn_check_rate_limit('fn_generate_quote', p_customer_whatsapp, 5, 10);

    select string_agg(
             format('%s:%s', v.value->>'formula_id', v.value->>'quantity_potes'),
             '|' order by v.value->>'formula_id'
           )
      into v_items_key
      from jsonb_array_elements(p_items) as v(value);

    -- pgcrypto (digest/hmac) mora no schema "extensions" neste projeto, e o
    -- search_path desta funcao e travado em pg_catalog, public de proposito -
    -- por isso o schema vai qualificado.
    v_dedup_key := encode(extensions.digest(p_customer_whatsapp || '|' || coalesce(v_items_key, ''), 'sha256'), 'hex');

    select qd.quote_id into v_existing_quote_id
    from private.quote_dedup qd
    where qd.dedup_key = v_dedup_key
      and qd.created_at > now() - interval '60 seconds'
    order by qd.created_at desc
    limit 1;

    if v_existing_quote_id is not null then
        -- Clique duplo: devolve o orcamento ja criado, com o numero dele.
        return query
            select q.id, q.quote_number from public.quotes q where q.id = v_existing_quote_id;
        return;
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

        -- Custo real lido com privilegio elevado mesmo sem grant de anon em
        -- formula_costs - e exatamente para isso que esta funcao existe.
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

    return query
        select q.id, q.quote_number from public.quotes q where q.id = v_quote_id;
end;
$$;

comment on function public.fn_generate_quote is 'Único ponto de entrada para gerar orçamento a partir do carrinho público (anon). Devolve o id interno E o número sequencial do orçamento — o número é o que o cliente vê no PDF; o id nunca deve aparecer para ele. unit_price_cents nasce do preço público; unit_cost_cents nasce do custo real privado, lido com privilégio elevado sem expor formula_costs ao chamador. Aplica rate limit (5/10min por whatsapp, chave normalizada só com dígitos), teto de tamanho no nome e na quantidade de itens, e idempotência por clique duplo (janela de 60s).';

grant execute on function public.fn_generate_quote(text, text, jsonb, uuid) to anon, authenticated;


-- ---------------------------------------------------------------------------------
-- 2. NUMERACAO RECOMECA EM 1
-- ---------------------------------------------------------------------------------
-- Renumera o que existe hoje na ordem em que foi criado e reinicia a sequencia
-- logo depois do ultimo. So faz sentido porque o catalogo ainda nao foi
-- publicado e os unicos orcamentos sao de teste do proprio dono - renumerar
-- depois de existir cliente com numero anotado seria outra conversa.

-- quote_number e GENERATED ALWAYS AS IDENTITY: o Postgres recusa UPDATE direto
-- ("column can only be updated to DEFAULT"). A coluna passa por BY DEFAULT
-- durante a renumeracao e volta a ALWAYS logo em seguida - o ALWAYS existe
-- justamente para impedir que a aplicacao escolha o numero do orcamento, e essa
-- garantia nao pode ficar afrouxada depois desta migration.
alter table public.quotes alter column quote_number set generated by default;

do $$
declare
    v_ultimo bigint;
begin
    with ordenado as (
        select id, row_number() over (order by created_at) as novo_numero
        from public.quotes
    )
    update public.quotes q
       set quote_number = o.novo_numero
      from ordenado o
     where o.id = q.id;

    select coalesce(max(quote_number), 0) into v_ultimo from public.quotes;

    -- pg_get_serial_sequence acha o nome real da sequencia da coluna identity,
    -- em vez de depender do nome gerado automaticamente.
    execute format(
        'alter sequence %s restart with %s',
        pg_get_serial_sequence('public.quotes', 'quote_number'),
        v_ultimo + 1
    );
end $$;

-- Devolve a trava: a aplicacao nunca escolhe o numero do orcamento.
alter table public.quotes alter column quote_number set generated always;
