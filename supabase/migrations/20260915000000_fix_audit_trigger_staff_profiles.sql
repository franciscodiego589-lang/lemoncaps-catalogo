-- =====================================================================================
-- LEMON CAPS - CATÁLOGO PÚBLICO
-- 20260915000000_fix_audit_trigger_staff_profiles.sql
--
-- BUG ENCONTRADO durante a construção do /admin (verificação de ponta a ponta,
-- não suposição): qualquer INSERT/UPDATE/DELETE em public.staff_profiles falha com
-- "record \"new\" has no field \"id\"". Causa: private.tg_write_audit()
-- (20260909210000_schema.sql) lê o identificador do registro direto como
-- new.id/old.id, mas public.staff_profiles usa user_id como chave primária -
-- é a ÚNICA tabela de negócio deste projeto sem uma coluna "id" própria.
-- NEW/OLD dentro do trigger são RECORD genérico (a mesma função atende toda
-- tabela auditada); acessar um campo ausente nesse tipo estoura em tempo de
-- execução, não em tempo de compilação - por isso o bug nunca apareceu antes:
-- nenhuma migration anterior chegou a INSERIR em staff_profiles de verdade.
--
-- IMPACTO SEM ESTA CORREÇÃO: nem o dono consegue promover a própria conta a
-- staff (INSERT trava), nem a Server Action que provisiona a definitiva.
-- Confirmado ao vivo via Management API antes de escrever este arquivo.
--
-- CORREÇÃO: troca o acesso direto a campo (new.id) por leitura via jsonb
-- (to_jsonb(new)->>'id'), que devolve NULL em vez de estourar quando a chave
-- não existe - com fallback para "user_id" quando "id" não está presente.
-- Cobre 100% das tabelas hoje auditadas (todas têm "id", só staff_profiles
-- tem "user_id") e continua funcionando sem alteração se uma tabela nova
-- também não tiver "id", desde que tenha "user_id" como equivalente.
-- Mesma assinatura/GRANTs/triggers já existentes - só troca o corpo da
-- função (create or replace), mesmo padrão já usado em
-- 20260912225011_rate_limit_rpc.sql para fn_capture_lead/fn_generate_quote.
--
-- SEGUNDO BUG DA MESMA FAMÍLIA, achado na sequência ao testar UPDATE (não só
-- INSERT) em staff_profiles: private.tg_touch_row() (o trigger BEFORE que
-- preenche updated_at/updated_by e a autoria de soft-delete) também acessa
-- old.deleted_at/new.deleted_at direto - e staff_profiles não tem NENHUMA
-- coluna de soft-delete (nem deleted_at, nem deleted_by, nem
-- reason_deleted): essa tabela não usa o padrão de exclusão lógica das
-- outras, é ativada/desativada via staff_profiles.active. Mesma técnica de
-- correção (leitura via jsonb, nunca campo direto no RECORD genérico).
-- =====================================================================================

create or replace function private.tg_write_audit()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    v_action text;
    v_old jsonb;
    v_new jsonb;
    v_changed text[];
    v_record_id uuid;
    v_actor_email text;
begin
    if TG_OP = 'DELETE' then
        v_action := 'DELETE';
        v_old := to_jsonb(old);
        v_new := null;
    elsif TG_OP = 'INSERT' then
        v_action := 'INSERT';
        v_old := null;
        v_new := to_jsonb(new);
    else -- UPDATE
        v_old := to_jsonb(old);
        v_new := to_jsonb(new);
        v_changed := akeys(hstore(new) - hstore(old));

        -- Mesmo cuidado do fix abaixo (v_record_id): staff_profiles não tem
        -- deleted_at, então a transição SOFT_DELETE/RESTORE é lida via
        -- jsonb->>'deleted_at' (NULL quando a coluna não existe), nunca via
        -- old.deleted_at/new.deleted_at direto - essa era a segunda linha
        -- (a primeira era v_record_id, já corrigida) que ainda acessava o
        -- campo direto no RECORD genérico e quebrava em UPDATE.
        if (v_old->>'deleted_at') is null and (v_new->>'deleted_at') is not null then
            v_action := 'SOFT_DELETE';
        elsif (v_old->>'deleted_at') is not null and (v_new->>'deleted_at') is null then
            v_action := 'RESTORE';
        else
            v_action := 'UPDATE';
        end if;
    end if;

    -- Identificador do registro para o log: leitura via jsonb->>'chave' nunca
    -- estoura quando a chave não existe (só devolve NULL) - ao contrário de
    -- acessar o campo direto no RECORD genérico (new.id), que é exatamente o
    -- que quebrava em staff_profiles.
    v_record_id := coalesce(
        (coalesce(v_new, v_old)->>'id')::uuid,
        (coalesce(v_new, v_old)->>'user_id')::uuid
    );

    select email into v_actor_email from auth.users where id = auth.uid();

    insert into public.audit_logs
        (table_name, record_id, action, changed_fields, old_data, new_data, actor_id, actor_email)
    values
        (TG_TABLE_NAME, v_record_id, v_action, v_changed, v_old, v_new, auth.uid(), v_actor_email);

    return coalesce(new, old);
end;
$$;

comment on function private.tg_write_audit() is 'AFTER INSERT OR UPDATE OR DELETE em toda tabela de negócio. Grava old/new (jsonb) + colunas alteradas (via hstore) em public.audit_logs. record_id lido via jsonb (id, com fallback para user_id) para funcionar também em staff_profiles, a única tabela sem coluna "id". SECURITY DEFINER porque authenticated não tem GRANT direto em audit_logs.';


create or replace function private.tg_touch_row()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
    v_old_deleted_at text;
    v_new_deleted_at text;
begin
    if TG_OP = 'INSERT' then
        new.created_at := coalesce(new.created_at, now());
        new.updated_at := now();
        new.created_by := coalesce(new.created_by, auth.uid());
        new.updated_by := auth.uid();
        return new;
    end if;

    -- UPDATE
    new.updated_at := now();
    new.updated_by := auth.uid();

    -- Nem toda tabela tem deleted_at (public.staff_profiles não tem - não
    -- usa o padrão de exclusão lógica das outras, é ativada/desativada via
    -- staff_profiles.active). Leitura via jsonb->>'chave' devolve NULL em
    -- vez de estourar quando a coluna não existe (mesma técnica do fix em
    -- private.tg_write_audit, acima). Quando a coluna não existe, os dois
    -- lados dão NULL, nenhuma das condições abaixo dispara, e as linhas que
    -- gravariam new.deleted_by/new.reason_deleted (que também não
    -- existiriam nessa tabela) nunca chegam a executar.
    v_old_deleted_at := to_jsonb(old)->>'deleted_at';
    v_new_deleted_at := to_jsonb(new)->>'deleted_at';

    -- transição para soft-deletado agora: registra quem apagou
    if v_old_deleted_at is null and v_new_deleted_at is not null then
        new.deleted_by := auth.uid();
    end if;

    -- restauração (deleted_at voltou a null): limpa a autoria do delete anterior
    if v_old_deleted_at is not null and v_new_deleted_at is null then
        new.deleted_by := null;
        new.reason_deleted := null;
    end if;

    return new;
end;
$$;

comment on function private.tg_touch_row() is 'BEFORE INSERT OR UPDATE em toda tabela de negócio. Preenche created_at/updated_at/created_by/updated_by/deleted_by automaticamente a partir de auth.uid(). A transição de soft-delete é lida via jsonb->>''deleted_at'' (nunca campo direto no RECORD genérico) para funcionar também em staff_profiles, a única tabela sem colunas de soft-delete.';
