#!/usr/bin/env bash
# Publica o catálogo na VPS (Docker Swarm + Traefik).
#
# Ciclo completo: envia o código, constrói a imagem LÁ e troca o serviço sem
# derrubar o site (update_config: start-first no stack.yml).
#
# A imagem é construída na VPS de propósito: ela é x86_64 e o Mac é ARM — imagem
# montada aqui não roda lá. E nenhum arquivo .env é enviado: as variáveis
# públicas do Supabase entram como --build-arg, lidas de .env.production.local
# nesta máquina, e a chave secreta nunca entra no container.
#
# Uso:  ./deploy-vps.sh
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@177.7.39.163}"
VPS_KEY="${VPS_KEY:-$HOME/.ssh/lemoncaps_vps_ed25519}"
VPS_DIR="/opt/catalogo"
ENV_FILE=".env.production.local"
SSH="ssh -i $VPS_KEY -o BatchMode=yes -o LogLevel=ERROR"

[ -f "$ENV_FILE" ] || { echo "erro: $ENV_FILE não existe — sem ele o build sai sem a URL do Supabase"; exit 1; }
SUPABASE_URL=$(grep '^NEXT_PUBLIC_SUPABASE_URL=' "$ENV_FILE" | cut -d= -f2-)
SUPABASE_KEY=$(grep '^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=' "$ENV_FILE" | cut -d= -f2-)
[ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_KEY" ] || { echo "erro: variáveis do Supabase não encontradas em $ENV_FILE"; exit 1; }

echo ">>> 1/4  verificação local (tipos, lint, testes)"
npx tsc --noEmit
npx eslint app components lib --ext .ts,.tsx
npm test --silent

echo ">>> 2/4  enviando código (sem .env, sem node_modules, sem .next)"
rsync -az --delete \
  --exclude='.env' --exclude='.env.*' --exclude=node_modules --exclude=.next \
  --exclude=.git --exclude=graphify-out --exclude=.claude \
  --exclude='supabase/.temp' --exclude='.DS_Store' --exclude='*.log' \
  -e "$SSH" ./ "$VPS_HOST:$VPS_DIR/"

echo ">>> 3/4  construindo a imagem na VPS"
$SSH "$VPS_HOST" TAG="$(date +%Y%m%d-%H%M%S)" \
  SUPABASE_URL="$SUPABASE_URL" SUPABASE_KEY="$SUPABASE_KEY" 'bash -s' <<'REMOTO'
set -euo pipefail
cd /opt/catalogo
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$SUPABASE_KEY" \
  -t "catalogo-lemoncaps:$TAG" -t catalogo-lemoncaps:latest . 2>&1 | tail -6
sed -i "s|image: catalogo-lemoncaps:.*|image: catalogo-lemoncaps:$TAG|" stack.yml
docker stack deploy -c stack.yml catalogo --resolve-image never
REMOTO

echo ">>> 4/4  esperando o serviço estabilizar"
sleep 20
$SSH "$VPS_HOST" 'docker service ls --filter name=catalogo --format "  {{.Name}} | {{.Replicas}} | {{.Image}}"'
echo -n "  site: "
curl -sS -o /dev/null -w "HTTP %{http_code} em %{time_total}s\n" https://catalogo.lemoncapsauto.com/
