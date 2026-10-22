# Imagem do catálogo Lemon Caps para a VPS (Docker Swarm + Traefik).
#
# Construída NA VPS, nunca no Mac do dono: a VPS é x86_64 e o Mac é ARM — uma
# imagem montada aqui não roda lá sem emulação.
#
# Três estágios para a imagem final não carregar o que só serve para compilar:
# o runner recebe apenas o servidor autocontido do Next (output: "standalone"),
# os assets estáticos e a pasta public.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# As variáveis NEXT_PUBLIC_* são gravadas dentro do bundle no momento do build —
# precisam existir AQUI, não só em runtime, senão o navegador recebe "undefined"
# como URL do Supabase e o catálogo sobe sem dado nenhum.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
# Roda como usuário sem privilégio: o node:alpine já traz o usuário "node".
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
