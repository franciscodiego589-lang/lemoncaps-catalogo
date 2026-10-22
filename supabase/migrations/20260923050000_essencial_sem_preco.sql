-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260923050000_essencial_sem_preco.sql
--
-- Decisao do dono, 23/09/2026: a linha Essencial vai ao ar ja, com "Preco sob
-- consulta", antes de ter preco definido. Pedido: "preciso que adicione um botao
-- linha essencial" -> escolhido "Os 26 com 'Preco sob consulta'".
--
-- A trava formulas_active_requires_price (desde 20260909210000_schema.sql) nao
-- deixava formula no ar sem preco - protecao contra publicar rascunho sem preco
-- (caso LIDEMA). Ela CONTINUA valendo para a linha Premium (e para 'basica').
-- So a linha Essencial pode ficar ativa com list_price_cents nulo; nesse caso o
-- card mostra "Preco sob consulta" e nao oferece "Cotar formula".
-- =====================================================================================

begin;

alter table public.formulas drop constraint formulas_active_requires_price;
alter table public.formulas add constraint formulas_active_requires_price
  check (not active or list_price_cents is not null or line = 'essencial');

comment on constraint formulas_active_requires_price on public.formulas is
  'Trava de integridade: formula no ar (active=true) precisa de preco - evita publicar rascunho sem preco (caso real: registro "LIDEMA"). Excecao desde 23/09/2026, decisao do dono: a linha essencial pode ficar no ar sem preco, exibida como "Preco sob consulta".';

-- Mesma grafia da apresentacao ja em linha ("30 ml", Serena): a home junta as
-- apresentacoes num Set, e "30 mL" apareceria como uma segunda, repetida.
update public.formulas
set pote_contents_description = '30 ml'
where line = 'essencial'
  and deleted_at is null
  and pote_contents_description = '30 mL';

-- Publica as formulas da linha Essencial gravadas como rascunho em 23/09/2026.
update public.formulas
set active = true
where line = 'essencial'
  and deleted_at is null
  and active = false;

-- Autocheck: premium continua toda com preco; essencial toda no ar.
do $$
declare
    v_premium_sem_preco integer;
    v_essencial_fora    integer;
begin
    select count(*) into v_premium_sem_preco
    from public.formulas
    where deleted_at is null and active and line <> 'essencial' and list_price_cents is null;
    if v_premium_sem_preco <> 0 then
        raise exception 'formula fora da linha essencial no ar sem preco: %', v_premium_sem_preco;
    end if;

    select count(*) into v_essencial_fora
    from public.formulas
    where deleted_at is null and line = 'essencial' and not active;
    if v_essencial_fora <> 0 then
        raise exception 'formula essencial que nao foi ao ar: %', v_essencial_fora;
    end if;
end $$;

commit;
