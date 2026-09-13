-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260913190000_rate_limit_atomico.sql
--
-- Dois buracos que sobraram na porta publica de escrita, achados na revisao de
-- codigo de 13/09/2026:
--
--   1. O rate limit fura com requisicoes SIMULTANEAS. fn_check_rate_limit faz
--      "select count(*)" -> "if" -> "insert" sem nenhuma trava. Em READ
--      COMMITTED, 20 chamadas paralelas com o mesmo WhatsApp leem o mesmo
--      contador antes de qualquer INSERT confirmar, e todas passam o teto de
--      5/10min. O limite so segura quem tenta em sequencia - justamente nao o
--      caso de quem quer abusar.
--
--   2. cart_snapshot nao tem teto de tamanho. O nome ja ganhou CHECK em
--      20260913060000, depois de um lead de 1.000.000 de caracteres ter sido
--      gravado com HTTP 200 - mas o JSON do carrinho ficou de fora, e anon tem
--      EXECUTE na RPC que o grava. Mesmo projeto no plano gratuito de 500 MB.
-- =====================================================================================

-- ---------------------------------------------------------------------------
-- 1. TRAVA ATOMICA no rate limit
-- ---------------------------------------------------------------------------
-- pg_advisory_xact_lock serializa por chave (fn_name + telefone) e some sozinho
-- no fim da transacao. Duas chamadas do MESMO numero esperam uma pela outra;
-- numeros diferentes nao se bloqueiam, entao nao vira gargalo.

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
    v_chave    text;
begin
    -- So os digitos: "+55 65 97777-0001" e "5565977770001" sao a mesma pessoa.
    v_chave := regexp_replace(coalesce(p_rate_key, ''), '\D', '', 'g');

    -- Serializa antes de contar. Sem isto, chamadas paralelas leem o mesmo
    -- contador e passam todas.
    perform pg_advisory_xact_lock(hashtext(p_fn_name || ':' || v_chave));

    select count(*) into v_attempts
    from private.rpc_rate_limit
    where fn_name = p_fn_name
      and rate_key = v_chave
      and created_at > now() - make_interval(mins => p_window_minutes);

    if v_attempts >= p_max_attempts then
        raise exception 'limite de % tentativas em % minutos atingido para este WhatsApp. Aguarde e tente novamente.', p_max_attempts, p_window_minutes;
    end if;

    insert into private.rpc_rate_limit (fn_name, rate_key) values (p_fn_name, v_chave);

    -- Faxina oportunista: a tabela so crescia (pg_cron nao esta instalado).
    delete from private.rpc_rate_limit where created_at < now() - interval '1 day';
end;
$$;

comment on function private.fn_check_rate_limit(text, text, integer, integer) is
  'Conta chamadas de fn_name+rate_key na janela e aborta ao estourar. Chave normalizada so com digitos (desde 20260913060000) e serializada por advisory lock (desde 20260913190000) - sem a trava, chamadas simultaneas do mesmo numero passavam todas.';


-- ---------------------------------------------------------------------------
-- 2. TETO DE TAMANHO no carrinho gravado junto do lead
-- ---------------------------------------------------------------------------
-- 64 KB cabe com folga um carrinho de 50 itens; o que nao cabe e despejo.
do $$ begin
  alter table public.leads
    add constraint leads_cart_snapshot_tamanho
    check (cart_snapshot is null or octet_length(cart_snapshot::text) <= 65536);
exception when duplicate_object then null;
end $$;
