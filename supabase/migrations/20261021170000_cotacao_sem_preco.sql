-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20261021170000_cotacao_sem_preco.sql
--
-- Pedido do dono em 21/10/2026: "Cotar formula" em todos os cards, inclusive nos que
-- estao sem preco ("o valor depois coloco, mas coloca os botoes todos como os outros"),
-- e quatro formulas da linha Economica (Diabetes, Saude da Prostata, Antioxidante,
-- Eletrolitos) passando para a Premium antes de ter preco.
--
-- 1) A Premium passa a poder ficar no ar sem preco, como a Economica (line =
--    'essencial') ja podia desde 20260923050000_essencial_sem_preco.sql. O card mostra
--    "Preco sob consulta". Fica de fora so a antiga linha Basica.
-- 2) A cotacao aceita formula sem preco: o item entra com unit_price_cents NULL, que
--    significa "preco sob consulta". As colunas geradas ja tratam o nulo sem mudanca
--    (line_total_cents, profit_cents e profit_margin_pct saem nulos) e a soma do total
--    do orcamento ignora o nulo. O admin preenche o preco depois, no proprio orcamento
--    (lib/actions/quotes.ts, updateQuoteItem).
-- =====================================================================================

alter table public.formulas drop constraint if exists formulas_active_requires_price;
alter table public.formulas add constraint formulas_active_requires_price
  check (not active or list_price_cents is not null or line in ('essencial', 'premium'));

alter table public.quote_items alter column unit_price_cents drop not null;

comment on column public.quote_items.unit_price_cents is
  'Preco unitario cotado, em centavos. NULL = preco sob consulta (formula sem preco publico na hora da cotacao; o admin preenche depois).';

create or replace function public.fn_generate_quote(p_customer_name text, p_customer_whatsapp text, p_items jsonb, p_lead_id uuid default null::uuid)
 returns table(quote_id uuid, quote_number bigint)
 language plpgsql
 security definer
 set search_path to 'pg_catalog', 'public'
as $function$
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
        -- Sem preco publico: entra como "sob consulta" (unit_price_cents nulo).

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
$function$;
