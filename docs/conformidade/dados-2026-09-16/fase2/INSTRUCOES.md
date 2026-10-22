# Fase 2 — Reformulação regulatória do catálogo Lemon Caps (16/09/2026)

Você trabalha para a Lemon Caps (indústria de suplementos, Cuiabá-MT, RT Anderson C. Barbosa, CRF/MT 5526). Responda e escreva TUDO em português do Brasil, com acentuação correta. O dono não lê inglês. **Não despache subagentes** (ontem vários caíram por limite de uso). Trabalhe produto a produto e grave cada saída assim que terminar aquele produto, para nada se perder se a sessão cair.

## Regras invioláveis (do dono)

1. **Exatidão acima de tudo.** Todo limite vem dos anexos literais da IN 28/2018 em disco (abaixo), citando a linha do anexo. Todo teor vem de laudo lido (com lote) ou fica marcado "estequiométrico — assumido" / "PENDENTE laudo". Nunca preencha lacuna com valor plausível. Distinga sempre, em cada número: lido na fonte · calculado (mostre a conta) · assumido. Nada de "provavelmente".
2. **Não escreva no banco. Não altere código. Não faça commit, deploy nem apague arquivo.** Entregáveis são arquivos novos em disco.
3. Arquivos existentes: Edit, nunca Write.
4. Documentos em prosa normal e completa (são para o dono e para o RT).

## Fontes em disco (leia antes de começar; caminhos absolutos)

Projeto: `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/`. Pasta `docs/conformidade/`:

- **Limites e formas autorizadas (fonte primária, literal, vigente até IN 450/2026):** `IN28-2018-ANEXO-I-LITERAL.md` (constituintes autorizados e CAS — a forma tem de estar nomeada aqui), `IN28-2018-ANEXO-III-LITERAL.md` (mínimos e máximos por grupo populacional; notas i–xv), `IN28-2018-ANEXOS-IV-V-VI-LITERAL.md` (Anexo IV: condições/limites de outros constituintes; Anexo V: alegações; Anexo VI: advertências obrigatórias por constituinte).
- **Auditoria de ontem (o que está fora e por quê):** `AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md` (24 produtos, insumo a insumo).
- **Composição real dos rótulos:** `composicoes_rotulo.json` (15 rótulos; ler `_meta`) e `COMPOSICOES-ROTULO-VS-CADASTRO-2026-09-15.md`.
- **O que a fábrica pesa hoje (memoriais):** `MEMORIAIS-INVENTARIO-2026-09-16.md` e o JSON `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json` (24 slugs; esquema: documento, revisao, porcao, formato, capsula, insumos[{nome_no_memorial, forma_quimica, massa_mg, teor_pct, teor_fonte, ativo_mg, conta_fecha, fornecedor, lote}], excipientes, massa_total_mg).
- **Laudos de insumo disponíveis:** `LAUDOS-INVENTARIO-2026-09-16.md` e `/private/tmp/.../scratchpad/fase1/laudos.json` (308 objetos: insumo, forma, fornecedor, lote, validade, vencido, teor:[{ensaio, valor, unidade, tipo}], origem, produto_anexo, arquivo). Só use teor de laudo **não vencido**; laudo vencido pode ser citado como "último teor conhecido — laudo vencido, pedir novo".
- **Gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, lidas em 16/09):** `PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md` e VDs por grupo em `/private/tmp/.../scratchpad/padrao-anvisa/vd.json`.
- Parecer do Pré-treino Césio 137: `PARECER-PRE-TREINO-CESIO-137-2026-09-15.md`. Ingredientes/advertências faltantes: `INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md`. Cadastro atual do banco (composições ativas) pode ser lido pela chave pública: URL `https://zjryrmqtumvaxdytvbbv.supabase.co`, chave `sb_publishable_U_85XpL6aO747U4DIqgGtQ_v1uP1hp5`, `curl -s "$URL/rest/v1/formulas?slug=eq.<slug>&select=*" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"` e `formula_compositions?formula_id=eq.<id>&select=*&order=sort_order`.

## Princípios de reformulação (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas")

1. **Manter o conceito do produto** e os insumos já autorizados; mudar só o necessário. Registrar toda mudança com o motivo (linha do anexo).
2. **Forma autorizada, com o nome exato do Anexo I.** Preferir a forma da qual existe laudo válido na máquina (citar lote); em segundo lugar, forma autorizada com laudo vencido ("pedir laudo novo"); em último, forma autorizada sem laudo ("insumo a adquirir — laudo pendente"). Os 7 constituintes só autorizados sob fabricante nomeado (ex.: extrato de feno-grego = Indus Biotech; ver notas do Anexo I) só podem ficar se o fornecedor for aquele — senão, retirar ou marcar "comprar do fabricante exigido".
3. **Dose dentro de [mínimo, máximo] do grupo populacional do produto**, com folga de fabricação: alvo entre o mínimo e **no máximo 90% do teto** (nunca cravar no teto — o cadastro antigo cravava e é impressão digital de fórmula fictícia). Respeitar condições especiais dos Anexos IV e VI (ex.: beta-alanina fracionada, cafeína total incluindo guaraná, melatonina, cúrcuma). Onde a dose atual já está na faixa e com folga, manter.
4. **Cálculo por elemento/ativo** com o teor do laudo (lote nomeado). Sem laudo, teor estequiométrico do sal puro, marcado "assumido". Mostrar a conta: massa do insumo × teor = ativo.
5. **Massa da porção:** soma das massas dos insumos (sal/extrato, não o elemento) + excipientes tem de caber na porção declarada (cápsula: usar a capacidade registrada no memorial; se não houver, 2 cápsulas × 500 mg = 1.000 mg; deixar folga ≥ 2% para excipiente/antiumectante). Se não couber: reduzir doses dentro da faixa, trocar por forma mais concentrada (óxido de magnésio 60,3% Mg; carbonato de cálcio ~40% Ca — citar laudo se houver), retirar insumo secundário — ou propor 3 cápsulas/porção como alternativa explícita (mudança de porção é decisão do dono).
6. **Insumos que nunca atingem o mínimo em cápsula** (fibras: 5,7 g; proteínas/colágeno hidrolisado/espirulina como proteína: 8,4 g): retirar do produto em cápsula. Se o dono quiser manter, só em pó/sachê na dose mínima — registrar como alternativa, não como proposta principal.
7. **Extratos botânicos:** dose pelo marcador (Anexo III/IV) usando laudo de padronização válido. Sem laudo válido → retirar e registrar "volta quando houver laudo" (não há como afirmar conformidade sem o teor do marcador).
8. **Gestante/lactante:** usar a coluna mais restritiva das duas para produto indicado aos dois grupos. Ácido fólico compara em µg DFE (fator do gabarito).
9. **Dizeres obrigatórios:** advertências do Anexo VI para cada constituinte presente; frases do art. 14 da RDC 243/2018; alergênicos (RDC 26/2015 — leite, peixe, crustáceos, soja etc. quando o insumo derivar deles: colágeno tipo II de frango/peixe, glucosamina de crustáceo, quitosana de crustáceo, whey).
10. **Custo e preço não se alteram** nesta etapa.

## Entregas por produto (slug)

### A. `docs/conformidade/reformulacao/<slug>.md` — memorial de reformulação (prosa completa)
1. Identificação: nome, slug, formato, porção (e proposta de porção, se mudar), público-alvo/grupo populacional, porções por embalagem.
2. **Antes:** composição atual (fonte: rótulo / cadastro / memorial — dizer qual), com o veredito da auditoria por insumo.
3. **Depois:** tabela insumo a insumo — nome do constituinte exatamente como no Anexo I · forma/insumo comercial · massa do insumo por porção (mg) · teor (% e fonte: laudo lote X / assumido) · ativo por porção · mínimo · máximo (grupo) · % do máximo (folga) · linha do anexo · laudo (lote, validade, vencido?) · status (mantido / dose ajustada / forma trocada / novo / retirado). Soma da porção: insumos + excipientes = X mg de Y mg (Z%).
4. **Mudanças e motivos**, uma por linha.
5. **Tabela nutricional no padrão ANVISA vigente** (siga o gabarito à risca): título INFORMAÇÃO NUTRICIONAL; "Porções por embalagem: N"; "Porção: X g (medida caseira)"; colunas "Quantidade por porção" e "%VD*"; valor energético (kcal e kJ, calculado com fatores de Atwater a partir dos insumos que aportam — mostre a conta), carboidratos, açúcares totais e adicionados, proteínas, gorduras totais/saturadas/trans, fibras alimentares, sódio — declarando só os obrigatórios do gabarito e os que foram adicionados; depois vitaminas e minerais na ordem do Anexo XI da IN 75 com %VD do grupo populacional do produto (adulto; gestante e lactante em colunas separadas quando o produto for para eles); demais constituintes (creatina, colágeno, melatonina, cafeína, extratos...) com quantidade e célula de %VD em branco; rodapé "*Percentual de valores diários fornecidos pela porção". Arredondamento pelas regras do gabarito (cite a regra usada).
6. **Lista de ingredientes** proposta (ordem decrescente de massa, nomes técnicos + INS dos aditivos; "Contém: ..." para alergênicos; "Não contém glúten" só se comprovado).
7. **Advertências** obrigatórias propostas (texto literal do Anexo VI + art. 14 RDC 243 + faixa etária), e as que faltam hoje.
8. **Pendências e decisões do dono/RT** (o que só a fábrica/fornecedor resolve: laudo a pedir, insumo a comprar, porção a mudar).
9. Veredito esperado após a reformulação: CONFORME / CONFORME CONDICIONADO A (laudo X) / NÃO RESOLVIDO (motivo).

### B. `/private/tmp/.../scratchpad/fase2/<slug>.json`
```
{ "slug":..., "porcao_mg":..., "porcao_descricao":..., "formato":..., "grupo_populacional":...,
  "insumos":[{"constituinte_anexo_i":..., "forma_insumo":..., "massa_insumo_mg":..., "teor_pct":..., "teor_fonte":..., "ativo_mg":..., "unidade_ativo":..., "minimo":..., "maximo":..., "pct_do_maximo":..., "linha_anexo":..., "laudo":{"lote":..., "validade":..., "vencido":...}, "status":..., "motivo":...}],
  "excipientes":[{"nome":..., "ins":..., "massa_mg":...}],
  "soma_porcao_mg":..., "cabe":true|false,
  "tabela_nutricional":{"porcoes_por_embalagem":..., "porcao":..., "linhas":[{"item":..., "quantidade":..., "unidade":..., "vd_pct":...|null}], "rodape":...},
  "ingredients_list":"...", "warnings":"...",
  "pendencias":[...], "veredito":... }
```

### C. `/private/tmp/.../scratchpad/fase2/<slug>.sql`
Fragmento PL/pgSQL idempotente, casando **por slug** (nunca UUID), no estilo de `supabase/migrations/20260920000000_composicoes_conforme_rotulo.sql` (leia-a): soft delete das composições ativas da fórmula (`active=false, deleted_at=now(), reason_deleted='reformulação regulatória 2026-09-16'`), insert das novas com `ingredient_id` resolvido por slug em `ingredients` (insert do insumo se faltar, nome como no Anexo I), `metadata` com `{"fonte":"reformulacao_2026-09-16","laudo_lote":...,"teor_pct":...,"ativo_mg":...,"linha_anexo":...}`, e `update formulas set ingredients_list=..., warnings=..., nutritional_info=<jsonb da tabela>, serving_description=... where slug=...`. Confira em `formulas` (chave pública, `select=*&limit=1`) o tipo/formato atual de `nutritional_info` e siga-o. Sem guarda de contagem aqui (a consolidação põe); só o bloco do produto.

## Retorno para o orquestrador
Por produto, uma linha: veredito esperado · nº de insumos antes/depois · mudanças (forma trocada, dose ajustada, retirado, novo) · soma da porção · pendências que dependem da fábrica/fornecedor. E a lista consolidada de laudos a pedir e insumos a comprar.
