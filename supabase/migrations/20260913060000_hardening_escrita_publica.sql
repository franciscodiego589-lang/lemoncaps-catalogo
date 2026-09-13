-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260913060000_hardening_escrita_publica.sql
--
-- Fecha o que a varredura de seguranca de 13/09/2026 encontrou na porta publica
-- de cotacao. Os tres achados foram EXECUTADOS contra o banco real, nao deduzidos
-- da leitura do SQL:
--
--   1. CRITICO - sem teto de tamanho na escrita anonima. Um lead com nome de
--      1.000.000 de caracteres foi gravado com HTTP 200. Num projeto no plano
--      gratuito (500 MB), um laco simples estoura a cota, derruba o catalogo e
--      afoga os leads reais em lixo.
--   2. CRITICO - o rate limit por WhatsApp e contornavel: a chave e o texto que
--      o proprio visitante manda, entao "5565977770001" e "+5565977770001" contam
--      como pessoas diferentes. Provado: bloqueou na 6a tentativa e liberou
--      na mesma hora com um "+" na frente.
--   3. ALTO - o papel `authenticated` tem TRUNCATE em todas as tabelas, inclusive
--      formula_costs, leads e audit_logs. TRUNCATE NAO passa por RLS: a politica
--      de linha nao protege contra ele. A migration 20260913230000 ja tinha feito
--      essa faxina para `anon`; faltava o mesmo para `authenticated`.
--
-- Idempotente: pode rodar de novo sem erro.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. TETO DE TAMANHO NAS COLUNAS DE TEXTO ESCRITAS PELO PUBLICO
-- ---------------------------------------------------------------------------------
-- 120 caracteres cobre com folga qualquer nome de pessoa ou de empresa
-- ("Distribuidora de Produtos Naturais do Centro-Oeste Ltda" tem 54). O CHECK
-- fica na coluna, e nao so na funcao, porque e a ultima linha de defesa: vale
-- para qualquer caminho de escrita, hoje e no futuro.

do $$ begin
  alter table public.leads add constraint leads_name_tamanho check (char_length(name) <= 120);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.quotes add constraint quotes_customer_name_tamanho check (char_length(customer_name) <= 120);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.quotes add constraint quotes_internal_note_tamanho check (internal_note is null or char_length(internal_note) <= 2000);
exception when duplicate_object then null;
end $$;


-- ---------------------------------------------------------------------------------
-- 2. RATE LIMIT COM CHAVE NORMALIZADA
-- ---------------------------------------------------------------------------------
-- A chave passa a ser so os digitos do telefone: "+55 65 97777-0001",
-- "5565977770001" e "+5565977770001" viram a mesma pessoa. Sem isso o limite
-- conta variacoes de formatacao como visitantes distintos, e quem quer abusar
-- so precisa alternar a pontuacao.
--
-- Continua sendo possivel trocar de numero a cada envio; travar isso de verdade
-- exige o IP de origem, que o PostgREST nao repassa ate o Postgres (o
-- inet_client_addr() ali e sempre o do pooler). O lugar certo para o limite por
-- IP e a borda - regra na Netlify ou Cloudflare - e fica anotado para o deploy.

-- A normalizacao entra DENTRO de fn_check_rate_limit, e nao nas duas RPCs que
-- a chamam: assim vale para fn_capture_lead, para fn_generate_quote e para
-- qualquer chamada futura, sem depender de alguem lembrar de normalizar antes.
-- O corpo abaixo e o de 20260912225011 com uma unica mudanca - a chave passa
-- por regexp_replace antes de contar e antes de gravar.

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
    -- So os digitos: "+55 65 97777-0001", "5565977770001" e "+5565977770001"
    -- passam a ser a MESMA pessoa. Antes eram tres chaves diferentes, e o
    -- limite caia com um "+" na frente do numero (provado na varredura).
    v_chave := regexp_replace(coalesce(p_rate_key, ''), '\D', '', 'g');

    select count(*) into v_attempts
    from private.rpc_rate_limit
    where fn_name = p_fn_name
      and rate_key = v_chave
      and created_at > now() - make_interval(mins => p_window_minutes);

    if v_attempts >= p_max_attempts then
        raise exception 'limite de % tentativas em % minutos atingido para este WhatsApp. Aguarde e tente novamente.', p_max_attempts, p_window_minutes;
    end if;

    insert into private.rpc_rate_limit (fn_name, rate_key) values (p_fn_name, v_chave);

    -- Faxina oportunista: a tabela so crescia (pg_cron nao esta instalado neste
    -- projeto e nao havia trigger de limpeza). Roda barato porque a janela do
    -- limite e de minutos e o volume por chamada e minusculo.
    delete from private.rpc_rate_limit where created_at < now() - interval '1 day';
end;
$$;

comment on function private.fn_check_rate_limit(text, text, integer, integer) is
  'Conta chamadas de fn_name+rate_key na janela de p_window_minutes e aborta a transacao ao estourar. Desde 20260913060000 a chave e normalizada para so digitos - antes "+5565..." e "5565..." contavam como pessoas diferentes e o limite era contornavel - e a propria funcao descarta registros com mais de 1 dia.';


-- ---------------------------------------------------------------------------------
-- 3. LIMPEZA DA TABELA DE RATE LIMIT
-- ---------------------------------------------------------------------------------
-- Cada tentativa insere uma linha e nada apagava: pg_cron nao esta instalado e
-- nao havia trigger de limpeza. A tabela so crescia. Como a janela do limite e
-- de minutos, tudo com mais de um dia e lixo puro.

