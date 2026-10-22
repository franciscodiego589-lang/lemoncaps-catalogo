# Runbook — Troca de domínio do catálogo (catalogo.lemoncaps.com.br → VPS nova)

Levantamento e preparação feitos em 15/09/2026. Este documento não executa nada
sozinho: é o roteiro para o dono e para quem operar a VPS seguirem no dia da
troca, com o comando exato de cada passo e como confirmar que deu certo antes
de ir para o próximo. Nenhum comando de escrita foi rodado na VPS nem no DNS
durante esta preparação — só leitura (`docker stack ls`, `docker service
inspect`, `dig`, `curl -sI`, `whois`, `openssl s_client`) e a edição do
`stack.yml` em disco, ainda não publicada.

## 0. O que foi confirmado antes de escrever este runbook (com origem e data)

| Fato | Evidência | Fonte e data |
|---|---|---|
| DNS de `lemoncaps.com.br` é a Cloudflare | NS = `amalia.ns.cloudflare.com` e `felicity.ns.cloudflare.com` | `dig NS` + `whois lemoncaps.com.br`, 15/09/2026 |
| `catalogo.lemoncaps.com.br` hoje aponta para `185.158.133.1` | registro A idêntico consultado direto nos dois NS autoritativos da Cloudflare | `dig @amalia.ns.cloudflare.com` e `dig @felicity.ns.cloudflare.com`, 15/09/2026 |
| `185.158.133.1` **não é IP da Cloudflare** | IP fora de todas as 15 faixas publicadas em cloudflare.com/ips-v4; whois mostra `netname: DET-FRA-CUSTOMERS`, `org-name: Private Customer` (não `CLOUDFLARENET`) | lista oficial da Cloudflare + `whois`, 15/09/2026 — ver seção 3 |
| Mesmo assim a resposta HTTP do site atual passa por borda Cloudflare | `curl -sI https://catalogo.lemoncaps.com.br/` devolve `server: cloudflare`, `cf-ray` e cookie `__cf_bm` | `curl`, 15/09/2026 |
| `catalogo.lemoncapsauto.com` (novo, VPS) já aponta direto para a VPS, sem proxy | `dig A` = `177.7.39.163` (o próprio IP da VPS), sem `cf-ray` no `curl` | `dig` + `curl -sI`, 15/09/2026 |
| Traefik da VPS usa desafio **HTTP-01**, na porta 80 | args do serviço: `--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true` e `...httpchallenge.entrypoint=web` (entrypoint `web` = porta 80, publicada em modo host) | `docker service inspect traefik_traefik`, 15/09/2026 |
| O host novo já emite certificado Let's Encrypt de verdade com esse mecanismo | certificado de `catalogo.lemoncapsauto.com`: emissor Let's Encrypt, emitido 14/09/2026, válido até 13/12/2026 | `openssl s_client` + `x509`, 15/09/2026 |
| Labels ao vivo do serviço `catalogo_catalogo` batem com o `stack.yml` em disco | comparação linha a linha antes da minha edição | `docker service inspect catalogo_catalogo`, 15/09/2026 |
| A troca de domínio **não exige rebuild** da imagem | busca literal por `lemoncapsauto`, `lemoncaps.com.br`, `metadataBase`, `canonical`, `openGraph`, `NEXT_PUBLIC_SITE_URL` em `app/`, `components/`, `lib/`, `next.config.ts`, `Dockerfile`, `.env.example`, `proxy.ts`, `public/` | grep, 15/09/2026 — detalhe na seção 1 |
| TTL atual do registro `catalogo.lemoncaps.com.br` | 3600 segundos (1 hora) | `dig +noall +answer`, 15/09/2026 |

## 1. O código não precisa de rebuild — o que foi checado

A hipótese de partida era que uma URL do site pudesse estar embutida no bundle
(`metadataBase`, canonical, Open Graph, sitemap, link de WhatsApp) e por isso
exigisse reconstruir a imagem ao trocar de domínio. Não é o caso:

- `app/layout.tsx` (linhas 16-19): o objeto `metadata` só tem `title` e
  `description`. Não existe `metadataBase`, `canonical` nem `openGraph` em
  nenhum lugar do projeto (busca literal, zero ocorrências).
- Não existem `app/robots.ts` nem `app/sitemap.ts` no projeto.
- `next.config.ts`: nenhuma referência a domínio; só `output: "standalone"`,
  `poweredByHeader: false` e um redirect interno (`/fabricacao` → `/`).
- `Dockerfile` (ARGs do build, linhas 22-25): só `NEXT_PUBLIC_SUPABASE_URL` e
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` entram como `--build-arg`. Nenhuma
  variável de URL do site.
- `NEXT_PUBLIC_SITE_URL` não existe em nenhum arquivo do projeto, incluindo
  `.env.example` e `.env.production.local`.
- A única ocorrência literal de `lemoncaps.com.br` em todo o código é
  `lib/catalog/regulatory-info.ts:100` — `sac: "sac@lemoncaps.com.br"`, um
  e-mail de atendimento, sem relação com roteamento ou com qual domínio serve
  o site.
- Os botões de WhatsApp com link fixo foram removidos do site em 14/09/2026
  (documentado em `.env.example`); o único `wa.me` que resta é
  `components/admin/LeadsTable.tsx:16`, gerado a partir do WhatsApp que o
  próprio cliente digitou no carrinho — ferramenta interna do admin, não
  depende do domínio do site.

Conclusão: o mesmo container, sem rebuild, serve os dois domínios de forma
idêntica assim que o Traefik aceitar as duas regras de `Host`. A troca é
puramente de infraestrutura (DNS + label do Traefik).

## 2. Pré-requisitos (decidir e preparar antes de tocar em qualquer DNS)

- [ ] **Confirmação visual de 10 segundos no painel da Cloudflare**: abrir a
      zona `lemoncaps.com.br` → DNS → registro `catalogo` e olhar a cor da
      nuvem. A evidência coletada (seção 3) indica fortemente que já está
      **cinza** ("DNS only"), mas eu não tenho acesso ao painel — só a
      quem tem login. Isso é o único ponto deste runbook marcado como
      **PENDENTE de confirmação visual do dono** antes do passo 3 abaixo.
      Se estiver laranja (proxied), o passo 3 muda — ver seção 3.
- [ ] Acesso confirmado: painel da Cloudflare (dono) e chave SSH da VPS
      (`~/.ssh/lemoncaps_vps_ed25519`, usuário `root` — testada nesta
      auditoria, só leitura).
- [ ] `stack.yml` já preparado com os dois hosts (feito nesta tarefa, ver
      seção 6) — falta só publicar.
- [ ] Decisão tomada com antecedência (não durante o corte): manter a nuvem
      cinza para sempre no registro `catalogo`, ou religar a laranja depois de
      estabilizar. Ver prós e contras na seção 3. Indecisão no meio da janela
      de corte é o cenário que mais atrasa uma reversão.
- [ ] TTL do registro `catalogo.lemoncaps.com.br` baixado de 3600 para 300
      segundos, com pelo menos 1 hora de antecedência (idealmente na
      véspera) — ver seção 4.
- [ ] Janela de baixo tráfego escolhida para o corte, porque existe uma
      janela curta em que o navegador pode ver aviso de certificado (seção 5,
      passo 5).
- [ ] **Pendência regulatória do catálogo, registrada aqui por pedido
      explícito da tarefa, e não resolvida por esta troca**: a auditoria de
      14/09/2026 encontrou 6 fórmulas irregulares e 5 que somam mais de 100%
      da porção diária frente aos limites da ANVISA, no catálogo que já está
      no ar hoje. Trocar de domínio não corrige nem esconde isso — é o
      mesmo catálogo, o mesmo banco, atrás de outro nome. Decidir
      separadamente (fora deste runbook) se essas fórmulas saem do ar antes
      de ampliar a audiência que enxerga o domínio oficial dos clientes.

## 3. Certificado atrás da Cloudflare — as duas rotas

**O que o desafio HTTP-01 exige:** o validador do Let's Encrypt faz uma
conexão HTTP comum (porta 80) para o domínio sendo validado e espera receber,
sem redirecionamento para outro servidor, o token que o Traefik colocou em
`/.well-known/acme-challenge/<token>`. Se essa conexão cair num servidor que
não seja o Traefik da VPS — como a borda da Cloudflare fazendo proxy — a
validação falha, porque quem responde não tem o token.

**O que a investigação encontrou sobre o estado atual:** o registro A de
`catalogo.lemoncaps.com.br` resolve, direto nos dois nameservers autoritativos
da Cloudflare, para `185.158.133.1` — um IP que **não está em nenhuma das 15
faixas que a própria Cloudflare publica** em cloudflare.com/ips-v4, e cujo
`whois` mostra um bloco genérico de hospedagem (`netname: DET-FRA-CUSTOMERS`,
`org-name: Private Customer`), não a rede da Cloudflare. Isso é o padrão de um
registro em **"DNS only" (nuvem cinza)**: a Cloudflare só responde a pergunta
de DNS, sem proxy. Os cabeçalhos `server: cloudflare` e `cf-ray` que aparecem
no `curl` desse domínio vêm, então, do lado do destino — a plataforma Lovable,
que hospeda o catálogo antigo, aparentemente já roda atrás da própria
Cloudflare dela. Isso não muda o que precisa ser feito aqui: é o registro
**dentro da zona `lemoncaps.com.br`** que importa, e a evidência aponta para
cinza. Ainda assim, é a única checagem deste runbook que depende de olhar o
painel (ver pré-requisito acima) — dado sensível a decisão de corte fica
marcado como PENDENTE até essa confirmação visual, e não como fato.

**Rota A — manter nuvem cinza (recomendada para o corte e para o dia a dia
logo após)**
- Prós: HTTP-01 funciona sem nenhum ajuste extra, exatamente como já funciona
  hoje para `catalogo.lemoncapsauto.com` (que emitiu certificado Let's
  Encrypt novo ontem, 14/09/2026, com este mesmo mecanismo). Renovação
  automática do Traefik (a cada ~60 dias, antes dos 90 de validade) continua
  funcionando sozinha, sem depender de ninguém mexer em nada.
- Contras: o tráfego chega direto à VPS, sem cache, sem WAF nem proteção
  contra DDoS da Cloudflare nesse subdomínio específico.

**Rota B — religar a nuvem laranja (proxy) depois que o domínio estabilizar**
- Prós: ganha cache, WAF e proteção contra DDoS da Cloudflare também neste
  subdomínio.
- Contras — e este é o ponto que decide a recomendação: a **renovação**
  automática do certificado também usa HTTP-01 na porta 80. Com o proxy
  ligado, essa renovação pode passar a falhar (depende do modo de SSL/TLS e
  das Page Rules configuradas na zona — configurações que eu não tenho como
  ler a partir daqui, sem acesso ao painel). E a documentação oficial do
  Traefik é explícita sobre o que acontece quando uma tentativa de emissão ou
  renovação falha: *"For new (sub)domains which need Let's Encrypt
  authentication, the default Traefik certificate will be used until Traefik
  is restarted"* — ou seja, o Traefik **não** corrige sozinho com uma nova
  tentativa automática; ele fica preso no certificado padrão (autoassinado,
  gera aviso no navegador) até alguém **reiniciar o serviço `traefik_traefik`
  inteiro** — que é compartilhado pelas outras 10 stacks da VPS
  (calculadora, evolution, importe, kit, lemonlog, n8n, portainer, postgres,
  seogmc), e reiniciá-lo afeta todas elas por alguns segundos.
- Se essa rota for escolhida mais adiante, o caminho mais seguro para não cair
  nessa armadilha de renovação é trocar o desafio deste resolver de HTTP-01
  para **DNS-01** (usando um token de API da Cloudflare com permissão de
  editar DNS) — que não depende da porta 80 e funciona atrás de qualquer
  proxy. Isso muda os argumentos do serviço `traefik_traefik` (afeta as 11
  stacks da VPS, não só o catálogo) e por isso fica registrado aqui como
  opção futura, fora do escopo desta preparação — não foi implementado nem
  deve ser, sem uma decisão à parte do dono.

**Recomendação objetiva:** Rota A agora. Reavaliar a Rota B, com DNS-01, só se
e quando a proteção da Cloudflare para este subdomínio específico vier a
fazer falta.

## 4. TTL do DNS

O registro `catalogo.lemoncaps.com.br` está hoje com TTL de **3600 segundos**
(confirmado em 15/09/2026). Recomendação: baixar para **300 segundos** no
painel da Cloudflare com pelo menos 1 hora de antecedência do corte —
idealmente na véspera, para ter folga confortável. A baixa em si não muda
nada visível (o site continua respondendo do mesmo IP); ela só faz com que,
na hora do corte de verdade, os resolvedores recursivos pelo mundo parem de
guardar a resposta antiga por até 1 hora e passem a reconsultar a cada 5
minutos — é isso que faz o corte propagar rápido em vez de lento.

## 5. Passo a passo do corte (a ordem entre os passos 3 e 5 importa)

| # | Passo | Comando exato | Quem executa | Tempo esperado | Como verificar |
|---|---|---|---|---|---|
| 1 | Baixar TTL para 300s | painel Cloudflare → DNS → editar TTL do registro `catalogo` | dono | 1 min + até 1h de folga antes do corte | `dig catalogo.lemoncaps.com.br A +noall +answer` mostra `300` na segunda coluna |
| 2 | Confirmar nuvem cinza no registro `catalogo` | olhar o ícone da nuvem no painel Cloudflare | dono | 10 s | ícone cinza = "DNS only" (se estiver laranja, ler seção 3, Rota B, antes de prosseguir) |
| 3 | Trocar o valor do registro A de `185.158.133.1` para `177.7.39.163` | painel Cloudflare → DNS → editar o registro `catalogo` (tipo A, manter cinza) | dono | 1 min para salvar | `dig @1.1.1.1 catalogo.lemoncaps.com.br A +short` e `dig @8.8.8.8 catalogo.lemoncaps.com.br A +short` — repetir até os dois devolverem `177.7.39.163` |
| 4 | Esperar propagação estável | — | ninguém (só aguardar) | poucos minutos, dado o TTL já baixo | repetir o comando do passo 3 por ~3-5 min seguidos sem ver o IP antigo voltar |
| 5 | Publicar o `stack.yml` com os dois hosts | `./deploy-vps.sh` (a partir de `/Users/diegofrancisco/Downloads/lemoncaps-catalogo`, com o Mac na mesma rede/permissão de sempre) | operador (quem já roda os deploys) | ~2-3 min (script já roda tsc, eslint, testes, rsync, build na VPS e `docker stack deploy`) | saída do próprio script no fim: `HTTP 200` na linha final |
| 6 | Confirmar que o certificado novo é Let's Encrypt de verdade, não o autoassinado do Traefik | `openssl s_client -connect catalogo.lemoncaps.com.br:443 -servername catalogo.lemoncaps.com.br </dev/null 2>/dev/null \| openssl x509 -noout -issuer -dates` | operador | até alguns minutos após o passo 5 | `issuer` mostra `Let's Encrypt`, não um emissor genérico/Traefik |
| 7 | Testar navegação real sob o novo domínio | abrir `https://catalogo.lemoncaps.com.br/` e navegar por `/`, `/catalogo`, `/catalogo/[slug]`, `/catalogo/[slug]/beneficios`, `/documentacao`, `/carrinho`, `/login` (mesmo roteiro já usado para validar o CSP em 14/09) | dono ou operador | 5-10 min | sem aviso de certificado, sem erro no console do navegador |
| 8 | (depois de alguns dias estáveis) subir o HSTS do host novo para 1 ano | editar `stsSeconds` no `stack.yml` para `31536000` e publicar de novo | dono decide, operador publica | — | ver seção 6 |

Se o passo 6 mostrar o certificado autoassinado do Traefik em vez do Let's
Encrypt (sinal de que a primeira tentativa de emissão aconteceu antes do DNS
apontar certo, ou falhou por outro motivo), a documentação oficial do Traefik
diz que a correção é reiniciar o serviço `traefik_traefik` — ação que afeta
as outras 10 stacks da VPS por alguns segundos e por isso não está automatizada
aqui: é uma decisão do operador, no momento, com o dono ciente do impacto.

**Por que a ordem é DNS antes do deploy, e não o contrário:** se o `stack.yml`
com os dois hosts for publicado ANTES do DNS apontar para a VPS, o Traefik já
tenta emitir o certificado de `catalogo.lemoncaps.com.br` nesse momento — e
como o domínio ainda aponta para o site antigo, a tentativa falha. Pela
documentação oficial do Traefik, citada na seção 3, esse é exatamente o
cenário que deixa o domínio preso no certificado autoassinado até alguém
reiniciar o Traefik inteiro. Fazendo o DNS primeiro e confirmando a
propagação antes de publicar o `stack.yml`, a primeira tentativa de emissão
já acontece com o DNS certo, e a chance de cair nessa armadilha é mínima —
exatamente o que já aconteceu, sem intervenção manual, com
`catalogo.lemoncapsauto.com` ontem (14/09/2026).

## 6. HSTS — o que já está e o risco de adiantar

O host novo manda hoje `Strict-Transport-Security: max-age=86400` (1 dia),
sem `includeSubDomains` — confirmado tanto no `stack.yml` quanto no cabeçalho
ao vivo de `catalogo.lemoncapsauto.com` em 15/09/2026. O host antigo, hoje, já
manda `max-age=31536000; includeSubDomains` (1 ano) — aparentemente injetado
pela borda Cloudflare/Lovable do lado do site antigo, não pelo backend novo.

Risco de subir o host novo para 1 ano cedo demais: HSTS não empilha — cada
resposta sobrescreve a política que o navegador tinha guardado para aquele
domínio. Um `max-age` de 1 ano grava no navegador do visitante uma exigência
de HTTPS por um ano inteiro para aquele host (e para todos os subdomínios,
se `includeSubDomains` for ligado); se durante esse ano o certificado tiver
qualquer problema (renovação falha, domínio muda de mão, etc.), o visitante
que já gravou essa política fica sem conseguir acessar o site algum — o
navegador recusa a conexão antes mesmo de tentar, sem oferecer opção de
"prosseguir mesmo assim". Por isso a recomendação é: manter os 86400s (1 dia)
enquanto o domínio novo estiver se estabilizando, e só subir para 31536000
depois de alguns dias sem incidente — inclusive depois de ver pelo menos uma
renovação automática do certificado acontecer sem intervenção manual. Não
ligar `preload` sem decisão à parte: entrar na lista de preload dos
navegadores é praticamente irreversível por meses, e o `stack.yml` já tem
essa mesma ressalva escrita desde 14/09/2026.

## 7. Rollback exato

Valor a restaurar, anotado nesta auditoria: registro **A** de
`catalogo.lemoncaps.com.br` = **185.158.133.1** (confirmado direto nos dois
nameservers autoritativos da Cloudflare — `amalia.ns.cloudflare.com` e
`felicity.ns.cloudflare.com` — em 15/09/2026, TTL 3600s no momento da
consulta).

Passo do rollback:
1. No painel da Cloudflare, zona `lemoncaps.com.br` → DNS, editar o registro
   `catalogo` de volta para `185.158.133.1` (tipo A, nuvem cinza, exatamente
   como está hoje).
2. Verificar com `dig @1.1.1.1 catalogo.lemoncaps.com.br A +short` e
   `dig @8.8.8.8 ...` até os dois devolverem `185.158.133.1`.
3. Não é preciso mexer no `stack.yml` nem na VPS para reverter: o Traefik
   pode continuar com os dois hosts configurados sem problema nenhum — o
   host antigo simplesmente para de receber tráfego assim que o DNS apontar
   de volta para lá. Só reverter o `stack.yml` (voltar para um único `Host`)
   se algum dia quiser tirar de vez a possibilidade daquele nome funcionar
   pela VPS.
4. Tempo esperado do rollback: poucos minutos, contanto que o TTL já esteja
   baixo (passo 1 da seção 5) — se o TTL ainda estiver em 3600s no momento de
   um rollback de emergência, pode levar até 1 hora para os resolvedores mais
   lentos esquecerem o IP novo.

## 8. O que acontece com o site Lovable depois

- Fica órfão no IP antigo (`185.158.133.1`): continua existindo e
  respondendo normalmente, só deixa de receber visitas pelo domínio oficial
  assim que o DNS apontar para a VPS. Nada nesta troca desliga ou apaga o
  site antigo — isso seria uma ação separada, à parte, e mais tarde.
- Segundo o levantamento que originou esta tarefa, o projeto Supabase antigo
  (`ckpitrqjqkswvkzudouk`) continua no ar com a chave anon exposta. Esta
  auditoria não testou essa chave nem acessou aquele projeto — o dado é
  reportado aqui como pendência de segurança já conhecida, não como algo
  reconfirmado agora, e a troca de domínio não resolve isso: o projeto antigo
  continua acessível pela URL dele independentemente de para onde
  `catalogo.lemoncaps.com.br` estiver apontando. Fica registrado para não
  cair no esquecimento depois que a atenção se voltar para o domínio novo já
  estável — decisão de quando desativar/revogar é do dono, fora deste
  runbook.

## 9. O que já foi alterado nesta preparação (e o que não foi)

- **Alterado**: `stack.yml`, só a linha da regra do router (`Host`), mais um
  comentário datado explicando a mudança. Nada de CSP, nada de HSTS, nada de
  mais nenhuma label.
- **Não alterado**: nenhum outro arquivo de código. Nenhum commit foi feito
  (ordem do dono). Nenhum comando de escrita rodou na VPS — só
  `docker stack ls`, `docker service ls`, `docker service inspect` e
  leitura de arquivos locais. Nenhum registro de DNS foi tocado.
- Este documento é novo (`docs/RUNBOOK-TROCA-DE-DOMINIO.md`) e por ser
  arquivo novo não aparece em `git diff --stat` — só o `stack.yml` aparece,
  como esperado.
