# Pendências antes de publicar — 18/09/2026

> Checklist consolidado das decisões que faltam antes do próximo deploy do catálogo.
> Nada aqui foi aplicado ao público sem base — cada item é uma pendência real, registrada
> internamente (`formulas.metadata->>'pendencias_internas'` quando aplicável), nunca
> exposta ao cliente. Ordenado por prioridade.

## 1. Segurança alimentar — prioridade alta

- **Emagrecedor em Cápsula (`emagrecedor-em-capsula`) sem aviso de alergênico.** Usa
  cápsula de gelatina com origem animal não confirmada (bovina/suína/peixe) — a mesma
  situação de todas as gomas e do Shot + Colágeno, que já trazem "Pode conter peixe" no
  campo `warnings`. Esta é a única fórmula do catálogo com gelatina que **não** tem essa
  advertência. Decisão do dono/RT: aplicar a mesma frase de precaução, ou confirmar que
  a gelatina deste produto tem origem diferente (documentada) que dispensa o aviso.

- **Glúten sem declaração em 2 gomas** (`bella-gummy-biotina-em-gummy`,
  `creatina-em-gummy-sabor-tutti-frutti`): sem ensaio próprio do produto acabado, não é
  coerente declarar nem "Contém Glúten" nem "Não contém Glúten" (a Lei 10.674/2003 exige
  laudo para a segunda opção). Hoje o público não traz nenhuma frase sobre glúten nessas
  duas. As gomas-irmãs (creatina frutas vermelhas, melatonina uva) já têm ensaio
  negativo — mesma base de excipientes. RT decide: estender o ensaio já feito ou
  encomendar um novo para estas duas.

- **Lactose em Dores Musculares** (`dores-musculares`): o produto já declara "Pode
  conter leite e peixe" (com base em laudo do fornecedor do colágeno tipo II). A menção
  específica a lactose foi retirada do público porque a própria tabela nutricional desta
  fórmula declara Carboidratos = 0 g, o que não sustenta declarar lactose como fato.
  RT confirma com o fornecedor se há lactose residual do processamento do colágeno.

## 2. Rotulagem — a confirmar com fábrica/fornecedor

- **Corante da Tutti-Frutti** (`creatina-em-gummy-sabor-tutti-frutti`): a ordem de
  produção só registra "corante rosa", sem nome técnico nem número INS. Texto público
  simplificado para "corante" (sem inventar identidade). Fábrica precisa informar o
  corante real antes da arte final do rótulo.

- **Sulfitos na Bella Gummy** (`bella-gummy-biotina-em-gummy`): a maltodextrina pode
  contribuir SO2. Por precaução o público já declara "Pode conter sulfitos", sem o
  cálculo de concentração feito. Limite legal: 10 mg/kg de SO2. RT calcula a partir da
  massa real e confirma ou retira a declaração.

## 3. Selo de conformidade ANVISA — 25 de 26 fórmulas aplicadas

Só falta o **Ômega Pró TG** (`omega-pro-tg`), por decisão sua de deixar para depois.
Motivo registrado: a norma tem duas leituras conflitantes para óleo de peixe (mínimo
5 g/dia de lipídeos totais vs. mínimo 37,5 mg/dia de EPA+DHA) e nem o painel oficial da
ANVISA resolve isso sozinho; falta também o laudo do lote de óleo em uso.

## 4. Tabela nutricional incompleta (campo some da tela, não mostra "PENDENTE")

- `emagrecimento-em-capsulas` e `emagrecimento-em-gotas`: RT ainda precisa levantar e
  declarar os valores nutricionais reais (kcal, carboidratos, etc.) por porção.
- `multi-vitta-gestante-e-lactante-em-capsula`: valor de Niacina pendente.
- `omega-pro-tg`: gorduras saturadas, trans, poli-insaturadas e colesterol pendentes.
- `pre-treino-300-g`: açúcares totais e adicionados pendentes.

## 5. Infraestrutura — verificar antes do deploy

- **Qual projeto Supabase o site publicado (produção) vai ler.** A conta tem 2 projetos
  parecidos: `zjryrmqtumvaxdytvbbv` (onde está todo o trabalho de 16-18/09: reformulação,
  selos, revisão ortográfica, nichos) e `yyiykuffhuxaqiysgekv` (antigo, parado desde
  14/09 — era o que `.env.local` local apontava até hoje, já corrigido no ambiente local).
  Confirmar isso no provedor de deploy (Vercel/Netlify) antes de publicar — decisão sua,
  "olhamos quando for fazer o deploy".
- Login de staff (`tech@lemoncaps.com.br`) sem senha válida confirmada nesta sessão —
  resolver via reset de senha no painel Supabase (Authentication → Users) do projeto
  certo antes de depender do admin em produção.

## O que já está fechado, não precisa revisitar

25/26 selos aplicados e reconferidos; ortografia revisada nas 26 fórmulas e 76 insumos
(97 correções); nichos corrigidos (4 fórmulas realocadas); admin sem bloqueio de
formulário em nenhuma tela; catálogo local mostrando os 26 produtos corretamente.
