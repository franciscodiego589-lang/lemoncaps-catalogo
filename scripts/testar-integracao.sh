#!/usr/bin/env bash
# =====================================================================================
# LEMON CAPS - CATALOGO PUBLICO
# scripts/testar-integracao.sh - testa de ponta a ponta o acesso do usuário de
# integração (outro sistema interno do dono) à API REST do Supabase deste projeto.
#
# O QUE ESTE SCRIPT FAZ, NESTA ORDEM:
#   1. Login  - POST /auth/v1/token?grant_type=password com INTEGRACAO_EMAIL/SENHA.
#      Imprime só o HTTP e se veio access_token (nunca o token em si, nem a senha).
#   2. Leitura pública - GET /rest/v1/formulas?select=slug&limit=3 (prova que o
#      token autentica e que a leitura básica do catálogo funciona).
#   3. Leitura privada - GET /rest/v1/formula_costs?select=formula_id&limit=1 (prova
#      de que o usuário está reconhecido como STAFF ATIVO: esta tabela nunca tem
#      grant nenhum para o papel anônimo - só staff autenticado a enxerga).
#   4. (OPCIONAL, só com INTEGRACAO_TESTE_ESCRITA=1) Escrita reversível - acrescenta
#      a chave "_teste_integracao" (com timestamp) em formulas.metadata de UMA
#      fórmula de teste, confirma, depois remove a MESMA chave (equivalente a
#      "metadata - '_teste_integracao'" em SQL) e confirma de novo. Nunca toca em
#      nenhuma outra chave de metadata nem em nenhuma outra coluna.
#
# CREDENCIAIS - NUNCA EMBUTIDAS NESTE ARQUIVO
#   As variáveis INTEGRACAO_EMAIL e INTEGRACAO_SENHA são lidas SÓ do ambiente. Se
#   alguma faltar, o script aborta com instrução de como definir - nunca segue
#   adiante com valor vazio nem inventa um valor.
#
#   export INTEGRACAO_EMAIL='integracao@lemoncaps.com.br'
#   export INTEGRACAO_SENHA='a senha real, definida pelo dono no painel'
#   ./scripts/testar-integracao.sh
#
#   Para incluir o teste de escrita (passo 4):
#   export INTEGRACAO_TESTE_ESCRITA=1
#
#   Por padrão o passo 4 usa a fórmula "zma-zinco-magnesio-e-vitamina-d" (fórmula
#   real, ativa, usada como exemplo em docs/INTEGRACAO-API-CATALOGO.md). Para testar
#   em outra, defina INTEGRACAO_TESTE_SLUG antes de rodar.
#
# A CHAVE PUBLISHABLE ABAIXO NÃO É SEGREDO - é a chave "sb_publishable_...", feita
# para ir em qualquer navegador (equivalente ao antigo "anon key"). O que nunca vai
# neste arquivo nem em nenhum outro do repositório é a chave "service_role"/
# "sb_secret_..." nem a senha do usuário de integração.
#
# PRÉ-REQUISITO: o usuário de integração precisa já existir em auth.users E ter uma
# linha ativa em public.staff_profiles (ver supabase/migrations/
# 20260921300000_staff_integracao.sql e docs/INTEGRACAO-API-CATALOGO.md) - sem isso,
# o passo 1 pode até funcionar (login não depende de staff_profiles), mas os passos
# 3 e 4 falham com 401/403 porque a RLS não reconhece o usuário como staff.
#
# Dependências: curl e jq (só leitura/parsing de JSON - nenhuma escreve fora das
# chamadas HTTP explícitas acima). Sem argumentos de linha de comando.
# =====================================================================================

set -euo pipefail

SUPABASE_URL="https://zjryrmqtumvaxdytvbbv.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_U_85XpL6aO747U4DIqgGtQ_v1uP1hp5"
TESTE_SLUG="${INTEGRACAO_TESTE_SLUG:-zma-zinco-magnesio-e-vitamina-d}"

# ---------------------------------------------------------------------------------
# 0. Dependências e credenciais
# ---------------------------------------------------------------------------------

for bin_necessario in curl jq; do
  if ! command -v "$bin_necessario" >/dev/null 2>&1; then
    echo "ERRO: comando obrigatório '$bin_necessario' não encontrado no PATH." >&2
    exit 1
  fi
done

if [ -z "${INTEGRACAO_EMAIL:-}" ] || [ -z "${INTEGRACAO_SENHA:-}" ]; then
  cat >&2 <<'MSG'
ERRO: defina INTEGRACAO_EMAIL e INTEGRACAO_SENHA no ambiente antes de rodar este
script. Nunca embuta a senha no arquivo nem na linha de comando em texto puro.

    export INTEGRACAO_EMAIL='integracao@lemoncaps.com.br'
    export INTEGRACAO_SENHA='a senha real'
    ./scripts/testar-integracao.sh

Opcional (inclui o passo 4, escrita reversível de teste):
    export INTEGRACAO_TESTE_ESCRITA=1
MSG
  exit 1
fi

corpo_login="$(mktemp)"
corpo_formulas="$(mktemp)"
corpo_costs="$(mktemp)"
corpo_metadata_atual="$(mktemp)"
corpo_patch_add="$(mktemp)"
corpo_patch_remove="$(mktemp)"
trap 'rm -f "$corpo_login" "$corpo_formulas" "$corpo_costs" "$corpo_metadata_atual" "$corpo_patch_add" "$corpo_patch_remove"' EXIT

# ---------------------------------------------------------------------------------
# 1. LOGIN - POST /auth/v1/token?grant_type=password
# ---------------------------------------------------------------------------------
echo "== 1. Login (POST /auth/v1/token?grant_type=password) =="

corpo_requisicao_login="$(jq -n --arg email "$INTEGRACAO_EMAIL" --arg password "$INTEGRACAO_SENHA" \
  '{email: $email, password: $password}')"

http_login="$(curl -sS -o "$corpo_login" -w '%{http_code}' \
  -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d "$corpo_requisicao_login")"

echo "HTTP $http_login"

access_token="$(jq -r '.access_token // empty' "$corpo_login" 2>/dev/null || true)"

if [ -n "$access_token" ]; then
  echo "access_token: presente (não impresso, por segurança)"
else
  echo "access_token: AUSENTE"
  echo "Corpo da resposta do login (a senha nunca aparece na resposta do Supabase):"
  jq . "$corpo_login" 2>/dev/null || cat "$corpo_login"
  echo
  echo "Sem access_token não há como seguir para os passos 2-4. Motivos comuns:"
  echo "  - e-mail ou senha errados (HTTP 400, \"invalid_grant\")."
  echo "  - usuário criado sem \"Auto Confirm User\" e ainda não confirmou o e-mail (HTTP 400)."
  echo "  - usuário de integração ainda não existe em Authentication > Users."
  exit 1
fi
echo

# ---------------------------------------------------------------------------------
# 2. LEITURA PÚBLICA - GET /rest/v1/formulas (prova que o token autentica)
# ---------------------------------------------------------------------------------
echo "== 2. GET /rest/v1/formulas?select=slug&limit=3 =="

http_formulas="$(curl -sS -o "$corpo_formulas" -w '%{http_code}' \
  "$SUPABASE_URL/rest/v1/formulas?select=slug&limit=3" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $access_token")"

echo "HTTP $http_formulas"
jq . "$corpo_formulas" 2>/dev/null || cat "$corpo_formulas"
echo

# ---------------------------------------------------------------------------------
# 3. LEITURA PRIVADA - GET /rest/v1/formula_costs (prova de acesso de staff)
# ---------------------------------------------------------------------------------
# formula_costs NUNCA tem grant para o papel anônimo (revogado por completo em
# 20260913230000_revogar_grants_anon.sql) - só um staff ativo de verdade (RLS via
# private.is_active_staff()) consegue ler esta tabela. HTTP 200 aqui é a prova de
# que public.staff_profiles está correto para este usuário; 401/403 significa que a
# migration de provisionamento não foi aplicada, ou foi aplicada com active=false.
echo "== 3. GET /rest/v1/formula_costs?select=formula_id&limit=1 (prova de leitura de dado privado) =="

http_costs="$(curl -sS -o "$corpo_costs" -w '%{http_code}' \
  "$SUPABASE_URL/rest/v1/formula_costs?select=formula_id&limit=1" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $access_token")"

echo "HTTP $http_costs"
jq . "$corpo_costs" 2>/dev/null || cat "$corpo_costs"

if [ "$http_costs" = "200" ]; then
  echo "OK: o usuário de integração está reconhecido como staff ativo."
else
  echo "ATENÇÃO: esperava HTTP 200. Confira se supabase/migrations/20260921300000_staff_integracao.sql"
  echo "foi aplicada com o UUID certo e se public.staff_profiles.active = true para este usuário."
fi
echo

# ---------------------------------------------------------------------------------
# 4. (OPCIONAL) ESCRITA REVERSÍVEL - só com INTEGRACAO_TESTE_ESCRITA=1
# ---------------------------------------------------------------------------------
if [ "${INTEGRACAO_TESTE_ESCRITA:-0}" != "1" ]; then
  echo "== 4. Teste de escrita PULADO (defina INTEGRACAO_TESTE_ESCRITA=1 para incluir) =="
  exit 0
fi

echo "== 4. Escrita reversível em formulas.metadata (slug=$TESTE_SLUG) =="

# 4a. Lê o metadata ATUAL - nunca assume que já sabe o que tem lá (mesma cautela do
# updateNutritionTable em lib/actions/formulas.ts: merge, nunca sobrescrita cega).
http_metadata_atual="$(curl -sS -o "$corpo_metadata_atual" -w '%{http_code}' \
  "$SUPABASE_URL/rest/v1/formulas?select=id,metadata&slug=eq.$TESTE_SLUG" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $access_token")"

if [ "$http_metadata_atual" != "200" ] || [ "$(jq 'length' "$corpo_metadata_atual")" = "0" ]; then
  echo "ERRO: não foi possível ler formulas.metadata para slug=$TESTE_SLUG (HTTP $http_metadata_atual)." >&2
  jq . "$corpo_metadata_atual" 2>/dev/null || cat "$corpo_metadata_atual" >&2
  exit 1
fi

metadata_atual="$(jq -c '.[0].metadata' "$corpo_metadata_atual")"
echo "metadata atual (antes do teste): $metadata_atual"

# 4b. Acrescenta "_teste_integracao" com timestamp ISO-8601, preservando todas as
# outras chaves - equivalente a metadata || jsonb_build_object('_teste_integracao', now()).
timestamp_teste="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
metadata_com_teste="$(printf '%s' "$metadata_atual" | jq -c --arg ts "$timestamp_teste" '. + {_teste_integracao: $ts}')"

echo "-- PATCH acrescentando _teste_integracao --"
http_patch_add="$(curl -sS -o "$corpo_patch_add" -w '%{http_code}' \
  -X PATCH "$SUPABASE_URL/rest/v1/formulas?slug=eq.$TESTE_SLUG" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $access_token" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "$(jq -n --argjson metadata "$metadata_com_teste" '{metadata: $metadata}')")"

echo "HTTP $http_patch_add"
jq '.[0].metadata' "$corpo_patch_add" 2>/dev/null || cat "$corpo_patch_add"
echo

# 4c. Remove a MESMA chave, restaurando o metadata exatamente como estava antes -
# equivalente a "update formulas set metadata = metadata - '_teste_integracao' ...".
echo "-- PATCH removendo _teste_integracao (reversão) --"
http_patch_remove="$(curl -sS -o "$corpo_patch_remove" -w '%{http_code}' \
  -X PATCH "$SUPABASE_URL/rest/v1/formulas?slug=eq.$TESTE_SLUG" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $access_token" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "$(jq -n --argjson metadata "$metadata_atual" '{metadata: $metadata}')")"

echo "HTTP $http_patch_remove"
jq '.[0].metadata' "$corpo_patch_remove" 2>/dev/null || cat "$corpo_patch_remove"
echo

metadata_final="$(jq -c '.[0].metadata' "$corpo_patch_remove" 2>/dev/null || echo null)"
if [ "$metadata_final" = "$metadata_atual" ]; then
  echo "OK: metadata voltou a ser exatamente igual ao estado anterior ao teste."
else
  echo "ATENÇÃO: metadata final difere do estado anterior ao teste - confira manualmente:"
  echo "  antes:  $metadata_atual"
  echo "  agora:  $metadata_final"
fi
