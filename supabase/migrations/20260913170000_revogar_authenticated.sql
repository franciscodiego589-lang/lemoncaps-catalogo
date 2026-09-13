-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260913170000_revogar_authenticated.sql
--
-- O papel `authenticated` tinha TRUNCATE e DELETE nas 10 tabelas de public,
-- inclusive formula_costs, leads e audit_logs. TRUNCATE NAO passa por RLS:
-- politica de linha nao defende contra ele.
--
-- Duas tentativas anteriores nao pegaram, e o motivo importa para quem ler
-- isto depois:
--   1. A 20260913060000 usava `revoke ... on all tables in schema public`.
--      Conferido ao vivo depois: o privilegio continuava de pe.
--   2. A primeira versao deste arquivo varria pg_tables e quebrou com
--      "relation public.pg_statistic does not exist" - nesta instalacao aquela
--      view devolve linha que nao corresponde a tabela acessivel.
--
-- Aqui a varredura usa information_schema.tables com table_type='BASE TABLE',
-- e a verificacao final ABORTA se algum privilegio sobreviver. Revoke que
-- falha calado e pior que revoke nenhum: deixa a sensacao de protegido sem a
-- protecao.
-- =====================================================================================

do $$
declare
    v_tabela text;
begin
    for v_tabela in
        select table_name from information_schema.tables
         where table_schema = 'public' and table_type = 'BASE TABLE'
    loop
        execute format('revoke truncate, references, trigger, delete on public.%I from authenticated', v_tabela);
    end loop;
end $$;

alter default privileges in schema public
  revoke truncate, references, trigger, delete on tables from authenticated;

-- Sobram select, insert e update, os tres filtrados pelas 25 policies de RLS.
-- DELETE fisico ja era negado pela RLS e o padrao do projeto e exclusao logica:
-- tirar o privilegio nao remove nenhuma capacidade legitima.

do $$
declare
    v_sobrou integer;
begin
    select count(*) into v_sobrou
      from information_schema.tables t
     where t.table_schema = 'public' and t.table_type = 'BASE TABLE'
       and (has_table_privilege('authenticated', 'public.' || quote_ident(t.table_name), 'TRUNCATE')
         or has_table_privilege('authenticated', 'public.' || quote_ident(t.table_name), 'DELETE'));
    if v_sobrou > 0 then
        raise exception 'revoke nao pegou: % tabela(s) ainda com TRUNCATE ou DELETE', v_sobrou;
    end if;
end $$;
