-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260922200000_mockup_creatina_tutti_frutti.sql - mockup real do pote da Creatina em
-- Gummy Sabor Tutti-Frutti (ultima das 24 formulas ativas ainda sem mockup_path; o
-- admin mostrava "Sem foto" para ela).
--
-- ORIGEM: o dono forneceu em 17/09/2026 o arquivo
-- ~/Downloads/Mockup_Creatina_Gummy_Tutti_Fruti_Rosa.pdf (PDF de 1 pagina A4, sem texto,
-- com 1 imagem PNG embutida em 1254x1254 px - fotografia de estudio do pote rosa,
-- fundo cinza claro com sombra). A propria migration 20260914120000_mockups.sql ja
-- documentava esta formula como uma das 12 sem mockup candidato entre os 16 baixados
-- naquela leva - este e o mockup que faltava.
--
-- PROCESSAMENTO (100% local, nada saiu da maquina): imagem extraida do PDF em
-- resolucao nativa via PyMuPDF (sem re-rasterizar). Fundo e sombra removidos com
-- GrabCut (OpenCV, segmentacao por grafo/cor, sem rede neural) - os scripts
-- scratchpad/segmentar_mockups.py (ISNet/onnxruntime) e recortar_mockups.py citados
-- pelo dono nao foram encontrados neste repositorio, no historico do git nem em
-- ~/Downloads, e onnxruntime/rembg nao estao instalados nem ha modelo em cache local
-- (~/.u2net inexistente); GrabCut foi o metodo disponivel mais proximo que nao exige
-- baixar nada da rede. Resultado comparado lado a lado com o mockup de referencia mais
-- proximo (mesmo pote, outro sabor): creatina-gummy-sabor-frutas-vermelhas-sem-fundo.webp
-- (492x900) - mesmo tratamento (fundo e sombra fora, silhueta do pote com leve
-- antialiasing de borda, sem halo). Arquivo final:
-- public/produtos/creatina-em-gummy-sabor-tutti-frutti-sem-fundo.webp (499x900, ~69 KB).
--
-- CAMINHO GRAVADO: segue o formato ja em uso nos 23 mockups atuais em producao
-- (prefixo /produtos/, sufixo -sem-fundo.webp), confirmado ao vivo via REST publica
-- (GET .../rest/v1/formulas?select=slug,name,mockup_path&order=slug, projeto
-- zjryrmqtumvaxdytvbbv) em 17/09/2026 - nao suposto. Essa mesma consulta confirmou que
-- o slug abaixo e o unico com mockup_path NULL entre as 24 formulas ativas.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. GUARDA PRE-UPDATE - nunca gravar por cima em silencio nem sobre slug inexistente.
--    So falha se ja houver um mockup_path DIFERENTE do valor abaixo (protege contra
--    sobrescrever algo que outra migration/processo tenha gravado). Se a migration for
--    reexecutada depois de ja ter rodado com sucesso (mesmo valor), e no-op - idempotente
--    de proposito, para nao quebrar um reaplicar acidental em producao.
-- ---------------------------------------------------------------------------------

do $$
declare
    v_mockup_atual text;
    v_novo constant text := '/produtos/creatina-em-gummy-sabor-tutti-frutti-sem-fundo.webp';
begin
    select mockup_path into v_mockup_atual
    from public.formulas
    where slug = 'creatina-em-gummy-sabor-tutti-frutti'
      and deleted_at is null;

    if not found then
        raise exception 'slug creatina-em-gummy-sabor-tutti-frutti nao encontrado entre as formulas ativas - nada foi gravado';
    end if;

    if v_mockup_atual is not null and v_mockup_atual is distinct from v_novo then
        raise exception 'formula creatina-em-gummy-sabor-tutti-frutti ja tem mockup_path preenchido com valor diferente (%) - migration parou para nao sobrescrever sem ordem explicita', v_mockup_atual;
    end if;
end $$;


-- ---------------------------------------------------------------------------------
-- 2. GRAVA O MOCKUP (no-op se ja estiver exatamente com este valor - ver nota acima)
-- ---------------------------------------------------------------------------------

update public.formulas
set mockup_path = '/produtos/creatina-em-gummy-sabor-tutti-frutti-sem-fundo.webp'
where slug = 'creatina-em-gummy-sabor-tutti-frutti'
  and deleted_at is null
  and mockup_path is distinct from '/produtos/creatina-em-gummy-sabor-tutti-frutti-sem-fundo.webp';


-- ---------------------------------------------------------------------------------
-- 3. GUARDA POS-UPDATE - confere que gravou exatamente 1 linha, com o valor esperado.
-- ---------------------------------------------------------------------------------

do $$
declare
    v_count integer;
begin
    select count(*) into v_count
    from public.formulas
    where slug = 'creatina-em-gummy-sabor-tutti-frutti'
      and mockup_path = '/produtos/creatina-em-gummy-sabor-tutti-frutti-sem-fundo.webp'
      and deleted_at is null;

    if v_count <> 1 then
        raise exception 'esperado exatamente 1 formula com mockup_path gravado, encontrado %', v_count;
    end if;
end $$;
