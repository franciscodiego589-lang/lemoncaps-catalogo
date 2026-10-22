# Verificação linha a linha: migration `20260922000000` × memoriais de reformulação

**Data:** 17/09/2026.
**Objeto:** `supabase/migrations/20260922000000_reformulacao_conforme_normas.sql` (1.569 linhas, 416 KB) comparada, produto a produto, com os memoriais em `docs/conformidade/reformulacao/<slug>.md`.
**Método:** seis verificações paralelas, cada uma lendo as linhas exatas do SQL de um grupo de produtos e o memorial completo correspondente. Só leitura; nenhum arquivo do projeto e nenhum banco foi alterado.
**Cobertura:** os 23 produtos com composição nova. Ômega Pró TG não recebe composição nova na migration (intencional e documentado no cabeçalho).

## Veredito

A migration está tecnicamente completa e executável: termina de forma limpa, as 201 linhas de composição batem com a guarda, a sintaxe é válida (pglast) e os nomes de insumo estão harmonizados entre produtos. Não é o rascunho interrompido que se temia em 16/09.

Mas o conteúdo que ela grava em `nutritional_info`, `metadata.tabela_nutricional`, `warnings` e `metadata.reformulacao_2026_09_16` diverge dos memoriais em pontos que vão para rótulo e tabela nutricional pública. **Não aplicar sem a passada de correção listada no fim.** Isso se soma aos bloqueios já registrados na auditoria de prontidão: laudos vencidos reaproveitados (bisglicinato de magnésio lote 90844, vencido em 21/06/2025, em 5 produtos; melatonina lote 950151, vencida em 09/12/2024, em 3), insumos "a adquirir" com teor assumido, e sobreposição total com a `20260920000000` nos 12 produtos do rótulo.

## Achados sistêmicos

1. **`mudancas`, `removidos` e `alternativas` vazios.** Em 15 dos 23 produtos, `metadata.reformulacao_2026_09_16` grava esses três arrays como `[]`, apesar de cada memorial ter a seção 4 ("Mudanças e motivos") com 3 a 9 itens. Preenchidos corretamente em 8: multivitaminico (11 itens), zma (6), biotina-em-capsula (8), dores-musculares (12), focus-colina, multi-vitta-gestante-e-lactante-em-capsula (10), melatonina-triptofanos-encapsulados e serena (6). É o sinal mais claro de que o gerador da Fase 3 foi interrompido antes de cobrir todos os produtos.
2. **Energia em kJ por método diferente.** O SQL grava kJ = kcal (já arredondado) × 4,184; os memoriais somam kJ por macronutriente (17 kJ/g de carboidrato, 13 kJ/g de ácido orgânico). Diverge em detox (121 × 123 kJ), saude-intestinal (9,2 × 9,4), pro-energy (4,2 × 4,3) e shot-colageno (147 × 149).
3. **%VD sobre valor arredondado.** O SQL calcula o %VD sobre a quantidade já arredondada e declarada; o memorial calcula sobre o ativo exato e só então arredonda. Diverge em saude-intestinal (B6 100% × 97%; zinco 127% × 123%), moro-slim (vitamina A 188% × 187%), emagrecedor (vitamina A 188% × 187%), pro-energy (B6 631% × 632%), slim-up (cromo 89% × 88%) e dores-musculares (vitamina E 133% × 136% — aqui o SQL é consistente com o VDR de 15 mg usado nos demais produtos e o memorial não tem nota de correção; decidir com o RT qual vai para o rótulo).
4. **Energia com decimal.** As duas gomas de creatina declaram "9,2 kcal" onde a regra citada pelo próprio memorial (RDC 429, art. 7º, § 1º) manda inteiro (9 kcal).

## Achados por produto

| Produto | Divergências encontradas | Gravidade |
|---|---|---|
| multivitaminico | nenhuma | — |
| zma-zinco-magnesio-e-vitamina-d | nota da teanina truncada na tabela nutricional ("...só a de folhas de Camellia sinensis é autor") | baixa |
| biotina-em-capsula | nenhuma | — |
| dores-musculares | vitamina E 133% × 136%; nota do colágeno tipo II truncada ("...O produto só é c"); `advertencias_anexo_vi` atribui a advertência só à glucosamina, quando o memorial a exige também por colágeno tipo II e MSM (o texto de `warnings` está completo; só a justificativa está incompleta) | média |
| detox-matinal-lemon-shot-300g | kJ 121 × 123; `mudancas`/`removidos` vazios apesar de zinco 0,29 → 2,2 mg e cúrcuma retirada | média |
| saude-intestinal | **a linha "Quercetina 69 mg" sumiu da tabela nutricional** (texto e JSON) e da justificativa da advertência (IN 418/2025); B6 100% × 97%; zinco 127% × 123%; kJ 9,2 × 9,4; "Glutamina" × "L-glutamina" na tabela; `forma_anexo_i` da quercetina gravado como "quercetina di-hidratada, INLAB cód. 5781, lote 873635" em vez de "Quercetina" | **alta** |
| moro-slim | vitamina A 188% × 187%; ativo do café verde 70,45 × 70,46 mg; `mudancas`/`removidos` vazios (feno-grego, cúrcuma, espirulina, quitosana, psyllium e inulina retirados; cromo 250 → 200 µg) | média |
| pro-energy | kJ 4,2 × 4,3; B6 631% × 632%; frase "Contém cafeína (160 mg por porção... PROVISÓRIO)" acrescentada aos `warnings` sem constar do memorial; `mudancas` vazio | média |
| emagrecedor-em-capsula | vitamina A 188% × 187%; `mudancas` vazio (9 itens no memorial) | média |
| slim-up-emagrecimento-em-gota | cromo 89% × 88%; **texto de conservação copiado do emagrecedor** (faixa de 15 °C a 30 °C, "consumir em até 60 dias", cláusula de lacre) onde o memorial manda manter o texto atual do banco, sem prazo após aberto, porque a fábrica não definiu | **alta** |
| shot-colageno-300-gramas | kJ 147 × 149; porção de 10 g e teor de 91% tratados como PROVISÓRIO nos dois lados (correto) | baixa |
| bella-gummy-biotina-em-gummy | "Biotina" × "Vitamina B7" (o memorial adota B7 como nome principal); "adultos (≥ 19 anos)" × "> 19 anos" (padrão dos demais); `mudancas` vazio | baixa |
| creatina-monohidratada-150g-soluvel | veredito cortado (falta "e à decisão do dono sobre a dose"); modo de uso sem "200 mL de água"; `mudancas` vazio | baixa |
| creatina-monohidratada-300g-soluvel | pendência omite a proposta comercial de 14/02/2026 ("5 g × 60 doses"); mesmos itens do 150 g | baixa |
| creatina-gummy-sabor-frutas-vermelhas | energia 9,2 × 9 kcal; decisões do RT incompletas na lista de pendências (fator de proteína da gelatina, glicerina na energia); pendência do aroma com laudo vencido em 21/05/2026 sumiu; polióis 2,46 × 2,48 g | média |
| creatina-em-gummy-sabor-tutti-frutti | **pendência de designação de venda copiada do frutas vermelhas e falsa para este produto** (o memorial diz que o nome já está correto); sólidos de 7.262 mg apresentados como total quando o memorial diz "+ aroma + corante"; energia 9,2 × 9 kcal; veredito omite "memorial" na lista de documentos pendentes | média |
| melatonina-em-gummy-sabor-uva | pendência real trocada: "doseamento de melatonina e triptofano no produto acabado" saiu e entrou uma nota sobre frases do rótulo que no memorial não é pendência; `mudancas` vazio | média |
| pre-treino-300-g | cita "memorial, seção 16", que não existe (o memorial tem 9 seções) — PENDENTE conferir se a referência é ao memorial .docx da fábrica; `mudancas` vazio | baixa |
| pre-treino-creatina-sabor-limao-420g | arginina com status "forma trocada" onde o memorial diz "forma definida (a FRM não dizia)"; fonte FRM Rev.02 declarada corretamente; "Niacina" no lugar de "Vitamina B3" está certo (o memorial autoriza) | baixa |
| focus-colina | valor energético gravado como 1,68 kcal = 7 kJ (`kcal_exato` 1.68, `kj` 7.0) onde a conta do memorial fecha em 1,72 kcal = 7,31 kJ (exibido "7,3 kJ"); afeta o texto do rótulo; composição e `mudancas` batem | média |
| multi-vitta-gestante-e-lactante-em-capsula | nenhuma (composição, `mudancas`, tabela com duas colunas de %VD e "Niacina PENDENTE" batem) | — |
| melatonina-triptofanos-encapsulados | `mudancas` da glutamina cita "laudo Lepuge válido" (98,47 %) quando a linha gravada usa o lote 950334 INLAB (99,6 %, harmonizado na fase 3); `warnings` repete "Este produto não deve ser consumido por gestantes, lactantes e crianças" além da frase longa da melatonina, que o memorial diz cobrir sozinha a exigência dos aminoácidos | média |
| serena | mesma advertência duplicada; frase de conservação reescrita: perdeu "arejado" e "do calor excessivo" e ganhou "manter a embalagem bem fechada", trecho que o memorial não propõe para este produto | média |

## O que corrigir antes de aplicar

1. Reprocessar `nutritional_info` e `metadata.tabela_nutricional` dos 23 produtos com um único método — o dos memoriais (kJ por macronutriente; %VD sobre o ativo exato; energia e %VD inteiros) — ou decidir com o RT o método e regravar os memoriais. Hoje os dois métodos convivem.
2. Preencher `mudancas`, `removidos` e `alternativas` a partir da seção 4 de cada memorial nos 15 produtos onde estão vazios.
3. Saúde Intestinal: reincluir "Quercetina 69 mg" na tabela nutricional e na justificativa da advertência; corrigir `forma_anexo_i` para "Quercetina".
4. Slim Up: restaurar o texto de conservação do banco, sem prazo após aberto, conforme o memorial.
5. Tutti-frutti: remover a pendência de designação de venda herdada do frutas vermelhas; registrar que os 7.262 mg de sólidos excluem aroma e corante.
6. Corrigir os textos truncados (ZMA, Dores Musculares), os %VD e kJ listados, "Glutamina" → "L-glutamina", "Biotina" → "Vitamina B7" (ou fixar o padrão), "≥" → ">".
7. Repor as pendências que sumiram (Melatonina Gummy; aroma do frutas vermelhas; decisões do RT).
8. Focus Colina: recalcular o valor energético (1,72 kcal = 7,3 kJ). Melatonina + Triptofanos e Serena: remover a advertência duplicada; Serena: restaurar a frase de conservação do memorial; Melatonina + Triptofanos: corrigir a referência ao laudo (INLAB 950334, não Lepuge) na `mudancas` da glutamina.

## Fontes

- `supabase/migrations/20260922000000_reformulacao_conforme_normas.sql` — linhas citadas em cada verificação: 272–335 e 508–680 (multivitaminico, zma, biotina, dores musculares); 379–415 e 830–966 (detox, saúde intestinal, moro slim, pro energy); 452–495 e 1119–1248 (creatinas, melatonina gummy, pré-treinos); 997, 1032, 1064 e 1116 (emagrecedor, slim up, shot colágeno, bella gummy); 336–378 e 681–829 (focus colina, multi vitta, melatonina + triptofanos, serena).
- `docs/conformidade/reformulacao/*.md` (memoriais individuais de 16/09/2026).
- Auditoria de prontidão das migrations, 17/09/2026 (mesma sessão): vereditos, pré-requisitos e conflito `920000` × `922000`.
