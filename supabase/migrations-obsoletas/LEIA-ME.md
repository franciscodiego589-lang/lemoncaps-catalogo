# migrations-obsoletas/

Migrations que existiram em disco (primeiro em `supabase/migrations/`, depois isoladas
em `supabase/migrations-pendentes/` em 17/09/2026), **nunca chegaram a ser aplicadas**
em nenhum banco, e hoje — 18/09/2026 — estão **incompatíveis com o estado real do banco
de produção** (`zjryrmqtumvaxdytvbbv`). Ficam arquivadas aqui, e não apagadas, porque
documentam decisões e auditorias reais que valeram a pena registrar; só não podem mais
ser aplicadas como estão.

Nenhuma foi movida por suposição: cada veredito abaixo foi conferido contra o banco real
(REST pública, chave anon) ou contra o texto de outra migration já aplicada, em
18/09/2026, na mesma sessão que escreveu
`supabase/migrations/20260922300000_correcoes_pos_reformulacao_direto_no_banco.sql`.

---

## 20260920000000_composicoes_conforme_rotulo.sql

Substituía a composição de 12 fórmulas pela composição impressa no rótulo (92 linhas,
`metadata.fonte = 'rotulo'). Pré-requisito declarado da `20260921000000` (abaixo).

**Por que ficou obsoleta:** o caminho que o dono escolheu de fato, em 17/09/2026, foi
outro — aplicar a reformulação regulatória inteira
(`20260922000000_reformulacao_conforme_normas.sql`, já em `supabase/migrations/`, já
aplicada em produção). Essa migration fez sua própria exclusão lógica + inserção de
composição para **23 fórmulas**, incluindo as mesmas 12 que esta migration mexeria — com
números e nomes diferentes dos do rótulo lido em 13-15/09. Aplicar esta migration hoje,
por cima do estado atual:

- reintroduziria nomes de insumo técnicos (o formato bruto do JSON de rótulo) que a
  correção de nomes de 17-18/09 (seção 1 da `20260922300000`) já limpou para nome
  comercial simples;
- mudaria de novo a dose de creatina de duas fórmulas que estão na lista das 12
  (`creatina-monohidratada-150g-soluvel` e `creatina-gummy-sabor-frutas-vermelhas`) para
  o valor do rótulo lido em 13/09, desfazendo a correção de dose pedida pelo dono em
  17/09 (seção 2 da `20260922300000` — ver também a nota de divergência regulatória no
  cabeçalho daquele arquivo).

Sua própria guarda de abertura (seção 0) provavelmente ainda passaria hoje (as 12
fórmulas continuam ativas), o que a tornaria **silenciosamente destrutiva** se alguém a
rodasse sem saber da história — por isso o arquivo é arquivado, não só deixado de lado.

## 20260920100000_ingredientes_e_advertencias_do_rotulo.sql

Preenchia `ingredients_list` e `warnings` de UMA fórmula
(`creatina-gummy-sabor-frutas-vermelhas`) com o texto de dizeres de rotulagem oficiais
da fábrica (DRT_GUMMY_CREATINA.html + ficha técnica assinada pelo RT).

**Por que ficou obsoleta:** conferido ao vivo em 18/09/2026 via REST pública — o banco
de produção **já tem** `ingredients_list`/`warnings` preenchidos para esta fórmula, com
um texto **diferente e mais completo** do que esta migration gravaria (o texto atual
inclui a ordem "creatina primeiro" mas também a cláusula de ausência de glúten com
número de ensaio e lote, e a nota de alergênicos "contém peixe — espécie PENDENTE", que
não existem no texto desta migration). Esse texto mais completo veio da seção 5 da
`20260922000000_reformulacao_conforme_normas.sql` (a mesma migration que substituiu a
composição desta fórmula). Aplicar esta migration por cima **regrediria** o catálogo
público para um texto mais pobre, perdendo a referência ao ensaio de glúten.

A guarda desta migration (`ingredients_list`/`warnings` não podem ficar vazios) também
passaria hoje sem detectar o problema, porque os campos JÁ estão preenchidos — só que
com outro texto. Mais um caso de migration que passaria na própria guarda mas produziria
uma regressão de conteúdo.

## 20260921000000_selos_conforme_rotulo.sql

Revogava o selo "Composição conferida" de 8 fórmulas e concedia a 4 (as únicas 100%
conformes na auditoria de rótulo de 15/09/2026), **condicionado** a essas 4 já terem a
composição do rótulo da `20260920000000` (guarda 0 confere `metadata.fonte = 'rotulo'`
em contagem exata por fórmula).

**Por que ficou obsoleta:** duas razões, uma de cada lado da migration.
1. **Pré-requisito nunca satisfeito:** a `20260920000000` (acima) nunca foi aplicada, e
   está ela mesma obsoleta agora — então a guarda 0 desta migration aborta hoje (as 4
   fórmulas aprovadas têm composição da reformulação regulatória, com
   `metadata.fonte = 'reformulacao_2026-09-16'`, não `'rotulo'`).
2. **Objetivo já alcançado por outro caminho:** a parte útil desta migration — revogar
   o selo das 8 fórmulas reprovadas em 15/09/2026 — foi feita direto no banco em
   18/09/2026 e está documentada na seção 6 de
   `supabase/migrations/20260922300000_correcoes_pos_reformulacao_direto_no_banco.sql`,
   sem depender da composição-do-rótulo (confirmado hoje: as 8 fórmulas já estão com
   `compliance_verified_at`/`compliance_norms`/`compliance_source` nulos). A lista dos 8
   slugs é idêntica nas duas migrations — não é coincidência, é a mesma auditoria de
   15/09/2026 sendo formalizada por dois caminhos diferentes; o caminho que venceu foi o
   da `20260922300000`.

A parte de "conceder selo às 4" desta migration também não faz mais sentido: o selo
afirmaria conformidade de uma composição (a do rótulo lido em 13-15/09) que não é mais a
composição ativa dessas 4 fórmulas hoje.

## 20260921100000_selos_conforme_cadastro_sem_rotulo.sql

Concedia o selo a 2 fórmulas sem rótulo
(`creatina-monohidratada-300g-soluvel` e `creatina-em-gummy-sabor-tutti-frutti`),
condicionado (guarda 0) ao estado exato deixado pela `20260921000000` — exatamente 4
selos concedidos, mais essas 2 sem selo, cada uma com exatamente 1 linha de composição
de creatina na dose auditada em 15/09/2026 (5.000 mg e 3.000 mg respectivamente).

**Por que ficou obsoleta:**
1. **Guarda 0 nunca passa:** hoje o banco tem **zero** fórmulas com
   `compliance_verified_at` preenchido (conferido ao vivo, `Content-Range: */0`) — não 4,
   não 6. A guarda desta migration aborta em qualquer um dos dois estados que ela
   reconhece.
2. **Conflito direto de decisão, não só de pré-requisito:** a seção 6 da
   `20260922300000_correcoes_pos_reformulacao_direto_no_banco.sql` **mantém essas duas
   mesmas fórmulas sem selo** — elas estão na lista dos 8 slugs revogados em 18/09/2026.
   Rodar esta migration depois da `20260922300000` **reabriria** um selo de conformidade
   que o dono manteve revogado, mesmo a dose de creatina batendo numericamente (5.000 mg
   e 3.000 mg — coincidência real com o que a seção 2 da `20260922300000` também usa,
   mas por caminhos de decisão diferentes: aqui era "cadastro é a fórmula real, dono
   confirma por escrito"; lá foi "dono pediu para voltar à dose de mercado").
   Conceder selo é uma afirmação de conformidade ao comprador — não é algo para reaplicar
   só porque um número bate.

## 20260921300000_staff_integracao.sql — NÃO está aqui, continua em `migrations-pendentes/`

Fica só para navegação: ver `../migrations-pendentes/LEIA-ME.md`. Não tem nenhuma relação
com fórmulas, composições ou selos — por isso não faz parte deste arquivo.

---

### Se algum dia precisar revisitar

O estado real de produção que tornou estas 4 obsoletas foi lido em 18/09/2026 via REST
pública (chave anon, projeto `zjryrmqtumvaxdytvbbv`) e está documentado no cabeçalho de
`supabase/migrations/20260922300000_correcoes_pos_reformulacao_direto_no_banco.sql`.
Antes de desarquivar qualquer uma destas quatro, reconferir o estado do banco de novo —
não assumir que nada mudou desde 18/09/2026.
