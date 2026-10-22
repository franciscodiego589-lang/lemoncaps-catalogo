# Botão DOSSIÊ TÉCNICO — parte 2 de 5

Este é o **lote 2 de 5** da mesma tarefa. Os produtos deste lote são: PRÉ TREINO + CREATINA 300 g · DORES MUSCULARES (ArtFlex) · SERENA · MULTIVITAMÍNICO.

A especificação do botão abaixo é a MESMA dos lotes anteriores. Se o botão e o painel já foram criados, **não recriar** — apenas acrescentar os produtos deste lote ao que já existe, seguindo o mesmo padrão.

## O que criar

Adicionar em cada card de produto do catálogo um segundo botão, chamado **DOSSIÊ TÉCNICO**, que abre um painel com a ficha regulatória de cada insumo da fórmula.

### Especificação do botão

| Item | Definição |
| --- | --- |
| **Rótulo** | DOSSIÊ TÉCNICO |
| **Ícone** | documento ou selo de conformidade, à esquerda do texto |
| **Posição** | logo abaixo do botão *Benefícios* que já existe, ocupando a mesma largura total do card |
| **Estilo** | mesmo formato do botão *Benefícios* — borda arredondada, fundo claro —, herdando a cor de destaque de cada card |
| **Ação** | abre painel modal centralizado, com fundo escurecido; em tela estreita, abre em tela cheia com rolagem |
| **Cabeçalho do painel** | nome do produto, forma farmacêutica e porção, mais botão de fechar no canto |
| **Corpo do painel** | um item recolhível (accordion) por insumo, na MESMA ORDEM da tabela COMPOSIÇÃO POR DOSE, todos fechados ao abrir |
| **Título de cada item** | nome do insumo e, à direita, a quantidade por porção |
| **Rodapé fixo do painel** | a linha de fonte indicada no fim desta especificação |

### Sinalização visual dentro de cada item

| Situação | Como exibir |
| --- | --- |
| Campo de limite com **NÃO AUTORIZADO** | texto em vermelho, com ícone de alerta |
| Campo com **ALEGAÇÃO PROIBIDA NESTE PRODUTO** | caixa de aviso em vermelho, ocupando a largura do item |
| Insumo sem alegação aprovada | caixa neutra, em cinza, com o texto exato do painel — não usar cor de erro, não é irregularidade |
| Insumo que atinge o mínimo | selo verde discreto, com o texto *Alegação permitida* |
| Campo **Base de expressão do limite** | caixa de destaque em azul, quando existir — é a explicação de por que a massa do insumo difere do limite |

### Campos de cada insumo, nesta ordem

Denominação ANVISA · Nº CAS · Categoria · Função · Especificações aceitas · Quantidade neste produto · Base de expressão do limite (quando houver) · Limite adultos · Limite gestantes · Limite lactantes · Atinge o mínimo para alegar · Alegação autorizada · Advertência obrigatória

### Regras de exibição, obrigatórias

1. **A alegação só pode ser exibida na redação exata transcrita abaixo.** Não reescrever, não resumir, não adaptar para linguagem de marketing. Onde estiver escrito que não há alegação aprovada, exibir exatamente esse aviso.
2. Onde o campo trouxer **ALEGAÇÃO PROIBIDA NESTE PRODUTO**, exibir o aviso em destaque. Significa que a quantidade no produto está abaixo do mínimo que a ANVISA exige para a alegação valer.
3. Onde o limite disser **NÃO AUTORIZADO**, exibir em vermelho.
4. Não inventar benefício, indicação, posologia nem comparação com outro produto. O dossiê é técnico e regulatório.
5. Rodapé fixo do painel: *Fonte: painel Constituintes Autorizados para Uso em Suplementos Alimentares — ANVISA, consultado em 2026-09-08.*

---

# PRÉ TREINO + CREATINA 300 g

*pó · porção 10 g (1 dose) · 13 itens, 8 conferidos*

## Creatina monoidratada

- **Denominação ANVISA:** Creatina monohidratada
- **Nº CAS:** 6020-87-7
- **Categoria:** Outros Nutrientes
- **Função:** Fonte de Creatina
- **Especificações aceitas:** FCC
- **Quantidade neste produto:** 3.000,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 3,000 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 3.000 mg Máximo: 5.000 mg
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** 1) Alegação: A creatina auxilia no aumento do desempenho físico durante exercícios repetidos de curta duração e alta intensidade. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de creatina atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes e crianças deve constar na rotulagem do produto.

## Beta-alanina

- **Denominação ANVISA:** Beta-alanina
- **Nº CAS:** 107-95-9
- **Categoria:** Aminoácidos
- **Função:** Fonte do aminoácido Beta-alanina
- **Especificações aceitas:** TRS 928-JECFA 63/98 COMPENDIUM ADDENDUM 12/FNP 52 Add 12/88 FAS 54-JECFA 63/435
- **Quantidade neste produto:** 2.000,00 mg
- **Base de expressão do limite:** O painel autoriza 2 g por DIA, mas em doses de no máximo 300 mg com 2 horas de intervalo. A dose única de 2.000 mg não atende à condição.
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 2 g (em doses de no máximo 300 mg com intervalo de 2 horas entre as doses)
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** As advertências Este produto não deve ser consumido por gestantes, lactantes e crianças e Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses. devem constar na rotulagem do produto.

## L-taurina

- **Denominação ANVISA:** Taurina
- **Nº CAS:** 107-35-7
- **Categoria:** Outros Nutrientes
- **Função:** Fonte de Taurina
- **Especificações aceitas:** FCC
- **Quantidade neste produto:** 900,00 mg
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 2.000 mg
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes e crianças deve constar na rotulagem do produto.

## L-arginina

- **Denominação ANVISA:** Cloridrato de L-arginina
- **Nº CAS:** 1119-34-2
- **Categoria:** Aminoácidos
- **Função:** Fonte do aminoácido Arginina
- **Especificações aceitas:** FCC
- **Quantidade neste produto:** 800,00 mg
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 3.810 mg
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes e crianças deve constar na rotulagem do produto.

## L-tirosina

- **Denominação ANVISA:** L-Tirosina
- **Nº CAS:** 60-18-4
- **Categoria:** Aminoácidos
- **Função:** Fonte do aminoácido L-Tirosina
- **Especificações aceitas:** European pharmacopoeia 9.0 USP-NF FCC
- **Quantidade neste produto:** 400,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 262.5 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 262,5 mg Máximo: 2.750 mg
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes e crianças deve constar na rotulagem do produto.

## Cafeína anidra

- **Denominação ANVISA:** Cafeína/1,3,7-Trimethylxanthine
- **Nº CAS:** 58-08-2
- **Categoria:** Substâncias bioativas
- **Função:** Fonte de Cafeína
- **Especificações aceitas:** FCC European pharmacopoeia 9.0 USP-NF
- **Quantidade neste produto:** 200,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 75 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 75 mg Máximo: 200 mg
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** 1) Alegação: A cafeína auxilia no aumento do estado de alerta e na melhora da concentração. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de cafeína atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: A cafeína auxilia no aumento da capacidade de resistência e no desempenho de exercícios físicos de resistência. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade recomendada de cafeína seja de 200 mg, consumida uma hora antes do exercício.
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes e crianças deve constar na rotulagem do produto.

---

# DORES MUSCULARES (ArtFlex)

*cápsula · porção 1 g (2 cápsulas)*

## Metilsulfonilmetano (MSM)

- **Denominação ANVISA:** Metilsulfonilmetano (MSM)
- **Nº CAS:** 67-71-0
- **Categoria:** Substâncias bioativas
- **Função:** Fonte de Metilsulfonilmetano
- **Especificações aceitas:** Farmacopeia Americana (USP) USP Dietary Supplements Compendium (USP-DSC)
- **Quantidade neste produto:** 480,50 mg
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 900 mg/dia.
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes e crianças deve constar na rotulagem do produto.

## Sulfato de glucosamina com cloreto de potássio

- **Denominação ANVISA:** SULFATO DE GLUCOSAMINA COM CLORETO DE POTÁSSIO
- **Nº CAS:** 1296149-08-0
- **Categoria:** Substâncias bioativas
- **Função:** Fonte de glucosamina
- **Especificações aceitas:** FCC USP-NF
- **Quantidade neste produto:** 200,00 mg
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 750 mg
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não foi aprovada alegação de propriedade funcional nem de saúde para o ingrediente
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por indivíduos com alergia a frutos do mar; “Este produto não deve ser consumido por gestantes, lactantes e crianças”; Pessoas sob o uso de medicamentos devem consultar o médico antes de consumir este produto.” deve constar na rotulagem do produto.

## Vitamina C (ácido ascórbico)

- **Denominação ANVISA:** Ácido ascórbico/Ácido L-ascórbico
- **Nº CAS:** 50-81-7
- **Categoria:** Vitaminas
- **Função:** Fonte de vitamina C
- **Especificações aceitas:** European pharmacopoeia 9.0 USP-NF FCC Prepared at the 17th JECFA (1973), published in FNP 4 (1978) and in FNP 52 (1992). Metals and arsenic specifications revised at the 61st JECFA (2003). A group ADI ‘not specified’ was established for ascorbic acid and its Ca, K and Na salts at the 25th JECFA (1981).
- **Quantidade neste produto:** 140,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 13.5 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 13,5 mg Máximo: 1.916,02 mg
- **Limite gestantes:** Mínimo: 12,75 mg Máximo: 1.723,43 mg
- **Limite lactantes:** Mínimo: 18 mg Máximo: 1.726,73 mg
- **Alegação autorizada:** 1) Alegação: A vitamina C auxilia na absorção de ferro dos alimentos. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: A vitamina C é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 3) Alegação: A vitamina C auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: A vitamina C auxilia na formação do colágeno. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 5) Alegação: A vitamina C auxilia na regeneração da forma reduzida da vitamina E. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 6) Alegação: A vitamina C auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: A vitamina C auxilia no metabolismo de proteínas e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 8) Alegação: Fonte de vitamina C. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 9) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina C. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina C corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Magnésio (de bisglicinato de magnésio)

- **Denominação ANVISA:** Bisglicinato de magnésio
- **Nº CAS:** 14783-68-7
- **Categoria:** Minerais
- **Função:** Fonte de Magnésio
- **Especificações aceitas:** The EFSA Journal (2008) 718, 1-26
- **Quantidade neste produto:** 100,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 63 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 63 mg Máximo: 350 mg
- **Limite gestantes:** Mínimo: 60 mg Máximo: 350 mg
- **Limite lactantes:** Mínimo: 54 mg Máximo: 350 mg
- **Alegação autorizada:** 1) Alegação:O magnésio auxilia na formação de ossos e dentes. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: O magnésio auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 3) Alegação: O magnésio auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: O magnésio auxilia no equilíbrio dos eletrólitos. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 5) Alegação: O magnésio auxilia no funcionamento muscular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 6) Alegação: O magnésio auxilia no funcionamento neuromuscular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: O magnésio auxilia no processo de divisão celular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 8) Alegação: Fonte de magnésio. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 9) Alegação: Alto conteúdo/Rico em/Alto teor de magnésio. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de magnésio corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Colágeno tipo II não desnaturado

- **Denominação ANVISA:** Colágeno de frango com colágeno tipo II não desnaturado
- **Nº CAS:** não atribuído no painel
- **Categoria:** Substâncias bioativas
- **Função:** Fonte de Colágeno tipo II não desnaturado
- **Especificações aceitas:** Para esse constituinte foram aprovadas as especificações dos fabricantes: InterHealth Nutraceuticals Incorporated - EUA; Bioibérica S.A.- Espanha; Jiaxing Hengjie Biopharmaceutical Co., Ltd. - China; Akron Pharma SA - Anápolis/GO; AMNUTRA (CHINA) CO., LTD; BEYOND BIOPHARMA CO. LTD., China
- **Quantidade neste produto:** 40,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 1.2 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 1,2 mg/dia Máximo: Não estabelecido
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Alegação: O colágeno tipo II não desnaturado auxilia na manutenção da função articular. Requisito: A alegação está restrita aos suplementos alimentares cuja a quantidade mínima de colágeno total seja de 10 mg e de colágeno tipo II não desnaturado seja de 1,2 mg.
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes e crianças deve constar na rotulagem do produto.

## Vitamina E (acetato de DL-alfa-tocoferol)

- **Denominação ANVISA:** Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila
- **Nº CAS:** 7695-91-2
- **Categoria:** Vitaminas
- **Função:** Fonte de Vitamina E
- **Especificações aceitas:** EFSA Journal 2016;14(3):4412 European pharmacopoeia 9.0
- **Quantidade neste produto:** 20,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 2.25 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 2,25 mg Máximo: 1000 mg
- **Limite gestantes:** Mínimo: 2,25 mg Máximo: 800 mg
- **Limite lactantes:** Mínimo: 2,85 mg Máximo: 800 mg
- **Alegação autorizada:** 1) Alegação: A vitamina E é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina E atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: Fonte de vitamina E. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina E atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 3) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina E. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina E corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Zinco (de bisglicinato de zinco)

- **Denominação ANVISA:** Bisglicinato de zinco
- **Nº CAS:** 14281-83-5
- **Categoria:** Minerais
- **Função:** Fonte de Zinco
- **Especificações aceitas:** The EFSA Journal (2008) 718, 1-26
- **Quantidade neste produto:** 10,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 1.65 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 1,65 mg Máximo: 29,59 mg
- **Limite gestantes:** Mínimo: 1,8 mg Máximo: 23,50 mg
- **Limite lactantes:** Mínimo: 1,95 mg Máximo: 24,45 mg
- **Alegação autorizada:** 1) Alegação: O zinco é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: O zinco auxilia na visão. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 3) Alegação: O zinco auxilia no metabolismo da vitamina A. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 4) Alegação: O zinco contribui para a manutenção do cabelo, da pele e das unhas. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 5) Alegação: O zinco auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 6) Alegação: O zinco auxilia na síntese de proteínas. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: O zinco auxilia no processo de divisão celular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 8) Alegação: O zinco auxilia na manutenção de ossos. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 9) Alegação: O zinco auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 10) Alegação: Fonte de zinco.Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 11) Alegação: Alto conteúdo/Rico em/Alto teor de zinco. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de zinco corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Ferro (de ferro aminoácido quelato)

- **Denominação ANVISA:** Bisglicinato ferroso
- **Nº CAS:** 20150-34-9
- **Categoria:** Minerais
- **Função:** Fonte de Ferro
- **Especificações aceitas:** The EFSA Journal (2006) 299, 1-17 FCC 61st JECFA (2003), FNP 52 Add 11 (2003), FAO JECFA MONOGRAPHS 1 (2006)
- **Quantidade neste produto:** 8,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 2.7 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 2,7 mg Máximo: 34,31 mg
- **Limite gestantes:** Mínimo: 4,05 mg Máximo: 34,71 mg
- **Limite lactantes:** Mínimo: 1,5 mg Máximo: 34,96 mg
- **Alegação autorizada:** 1)Alegação: O ferro auxilia na formação das células vermelhas do sangue. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de ferro atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: O ferro auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de ferro atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 3) Alegação: O ferro auxilia no transporte do oxigênio no organismo. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de ferro atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: O ferro auxilia no processo de divisão celular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de ferro atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 5) Alegação: O ferro auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de ferro atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 6) Alegação: Fonte de ferro. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de ferro atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: Alto conteúdo/Rico em/Alto teor de ferro. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de ferro corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Vitamina B6 (cloridrato de piridoxina)

- **Denominação ANVISA:** Cloridrato de piridoxina
- **Nº CAS:** 58-56-0
- **Categoria:** Vitaminas
- **Função:** Fonte de vitamina B6
- **Especificações aceitas:** European pharmacopoeia 9.0 FCC USP-NF
- **Quantidade neste produto:** 1,30 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 0.26 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 0,26 mg Máximo: 98,60 mg
- **Limite gestantes:** Mínimo: 0,285 mg Máximo: 78,59 mg
- **Limite lactantes:** Mínimo: 0,3 mg Máximo: 78,68 mg
- **Alegação autorizada:** 1) Alegação: A vitamina B6 auxilia na formação das células vermelhas do sangue. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 2) Alegação: A vitamina B6 auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 3) Alegação: A vitamina B6 auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 4) Alegação: A vitamina B6 auxilia no metabolismo de proteínas e do glicogênio. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 5) Alegação: A vitamina B6 auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 6) Alegação: A vitamina B6 auxilia no metabolismo de homocisteína. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 7) Alegação: A vitamina B6 auxilia na síntese de cisteína. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 8) Alegação: Fonte de vitamina B6. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 9) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina B6. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina B6 corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 10) Alegação: A vitamina B6 auxilia na função normal do sistema nervoso. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Selênio (de selênio quelato)

- **Denominação ANVISA:** Selenito de sódio
- **Nº CAS:** 10102-18-8
- **Categoria:** Minerais
- **Função:** Fonte de Selênio
- **Especificações aceitas:** European pharmacopoeia 9.0
- **Quantidade neste produto:** 100,00 mcg
- **Base de expressão do limite:** O insumo da casa é "selênio quelato", que NÃO consta do painel. As fontes autorizadas são ácido selenioso, levedura enriquecida, L-selenometionina, selenato e selenito de sódio.
- **Atinge o mínimo para alegar?** Sim — mínimo de 0.00825 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 8,25 μg Máximo: 319,75 μg
- **Limite gestantes:** Mínimo: 9 μg Máximo: 309,65 μg
- **Limite lactantes:** Mínimo: 10,5 μg Máximo: 320,20 μg
- **Alegação autorizada:** 1) Alegação: O selênio é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de selênio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 2) Alegação: O selênio auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de selênio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 3) Alegação: Fonte de selênio. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de selênio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: Alto conteúdo/Rico em/Alto teor de selênio. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de selênio corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações., desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Vitamina D (colecalciferol)

- **Denominação ANVISA:** Vitamina D3 (Colecalciferol)
- **Nº CAS:** 67-97-0
- **Categoria:** Vitaminas
- **Função:** Fonte de Vitamina D
- **Especificações aceitas:** European pharmacopoeia 9.0 FCC
- **Quantidade neste produto:** 50,00 mcg
- **Atinge o mínimo para alegar?** Sim — mínimo de 0.003 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 3 μg Máximo: 50,0 μg
- **Limite gestantes:** Mínimo: 2,25 μg Máximo: 50,0 μg
- **Limite lactantes:** Mínimo: 2,25 μg Máximo: 50,0 μg
- **Alegação autorizada:** 1) Alegação: A vitamina D auxilia na formação de ossos e dentes. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina D atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: A vitamina D auxilia na absorção de cálcio e fósforo. As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina D atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 3) Alegação: A vitamina D auxilia no funcionamento do sistema imune. As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina D atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: A vitamina D auxilia no funcionamento muscular. As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina D atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 5) Alegaão: A vitamina D auxilia na manutenção de níveis de cálcio no sangue. As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina D atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 6) Alegação: A vitamina D auxilia no processo de divisão celular. As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina D atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: Fonte de vitamina D. As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina D atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 8) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina D. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina D corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Vitamina B12 (metilcobalamina)

- **Denominação ANVISA:** Metilcobalamina
- **Nº CAS:** 13422-55-4
- **Categoria:** Vitaminas
- **Função:** Fonte de vitamina B12
- **Especificações aceitas:** The EFSA Journal (2008) 815, 1-21 USP-NF
- **Quantidade neste produto:** 9,94 mcg
- **Atinge o mínimo para alegar?** Sim — mínimo de 0.00036 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 0,36 μg Máximo: 9,94 μg
- **Limite gestantes:** Mínimo: 0,39 μg Máximo: 10,46 μg
- **Limite lactantes:** Mínimo: 0,42 μg Máximo: 10,07 μg
- **Alegação autorizada:** 1) Alegação: A vitamina B12 auxilia na formação de células vermelhas do sangue. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações 2) Alegação: A vitamina B12 auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações. 3) Alegação: A vitamina B12 auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações 4) Alegação: A vitamina B12 auxilia no metabolismo dos carboidratos, proteínas e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações 5) Alegação: A vitamina B12 auxilia no metabolismo da homocisteína. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações. 6) Alegação: A vitamina B12 auxilia no processo de divisão celular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações 7) Alegação: Fonte de vitamina B12. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações 8) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina B12. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina B12 corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações. 9) Alegação: A vitamina B12 auxilia na função normal do sistema nervoso. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B12 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo cianocobalamina pode ser usado em substituição ao termo vitamina B12 nas alegações.
- **Advertência obrigatória:** Não há requisitos adicionais

---

# SERENA

*gotas · porção 1 mL (20 gotas)*

## Magnésio (de cloreto de magnésio)

- **Denominação ANVISA:** Bisglicinato de magnésio
- **Nº CAS:** 14783-68-7
- **Categoria:** Minerais
- **Função:** Fonte de Magnésio
- **Especificações aceitas:** The EFSA Journal (2008) 718, 1-26
- **Quantidade neste produto:** 63,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 63 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 63 mg Máximo: 350 mg
- **Limite gestantes:** Mínimo: 60 mg Máximo: 350 mg
- **Limite lactantes:** Mínimo: 54 mg Máximo: 350 mg
- **Alegação autorizada:** 1) Alegação:O magnésio auxilia na formação de ossos e dentes. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: O magnésio auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 3) Alegação: O magnésio auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: O magnésio auxilia no equilíbrio dos eletrólitos. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 5) Alegação: O magnésio auxilia no funcionamento muscular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 6) Alegação: O magnésio auxilia no funcionamento neuromuscular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: O magnésio auxilia no processo de divisão celular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 8) Alegação: Fonte de magnésio. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 9) Alegação: Alto conteúdo/Rico em/Alto teor de magnésio. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de magnésio corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Inositol (mio-inositol)

- **Denominação ANVISA:** Inositol (Mio-inositol / Mesoinositol)
- **Nº CAS:** 87-89-8
- **Categoria:** Outros Nutrientes
- **Função:** Fonte de Inositol
- **Especificações aceitas:** USP-NF Farmacopeia Europeia 9.0 FCC
- **Quantidade neste produto:** 50,00 mg
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 2 g/dia
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** A advertência “Este produto não deve ser consumido por gestantes, lactantes e crianças.” deve constar na rotulagem do produto.

## L-teanina de folhas de Camellia sinensis

- **Denominação ANVISA:** L-teanina de folhas de Camellia sinensis.
- **Nº CAS:** 3081-61-6
- **Categoria:** Aminoácidos
- **Função:** Fonte de L-teanina
- **Especificações aceitas:** Para este constituinte foram aprovadas as especificações do fabricante: Blue California CO.
- **Quantidade neste produto:** 50,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 50 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 50 mg/dia Máximo: 250 mg/dia
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não foi aprovada alegação de propriedade funcional nem de saúde para o ingrediente
- **Advertência obrigatória:** o painel não exige advertência específica para este constituinte.

## Vitamina B6 (cloridrato de piridoxina)

- **Denominação ANVISA:** Cloridrato de piridoxina
- **Nº CAS:** 58-56-0
- **Categoria:** Vitaminas
- **Função:** Fonte de vitamina B6
- **Especificações aceitas:** European pharmacopoeia 9.0 FCC USP-NF
- **Quantidade neste produto:** 1,30 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 0.26 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 0,26 mg Máximo: 98,60 mg
- **Limite gestantes:** Mínimo: 0,285 mg Máximo: 78,59 mg
- **Limite lactantes:** Mínimo: 0,3 mg Máximo: 78,68 mg
- **Alegação autorizada:** 1) Alegação: A vitamina B6 auxilia na formação das células vermelhas do sangue. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 2) Alegação: A vitamina B6 auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 3) Alegação: A vitamina B6 auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 4) Alegação: A vitamina B6 auxilia no metabolismo de proteínas e do glicogênio. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 5) Alegação: A vitamina B6 auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 6) Alegação: A vitamina B6 auxilia no metabolismo de homocisteína. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 7) Alegação: A vitamina B6 auxilia na síntese de cisteína. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 8) Alegação: Fonte de vitamina B6. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 9) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina B6. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina B6 corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações. 10) Alegação: A vitamina B6 auxilia na função normal do sistema nervoso. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina B6 atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo piridoxina pode ser usado em substituição ao termo vitamina B6 nas alegações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Melatonina

- **Denominação ANVISA:** Melatonina
- **Nº CAS:** 73-31-4
- **Categoria:** Substâncias bioativas
- **Função:** Fonte de Melatonina
- **Especificações aceitas:** USP-NF
- **Quantidade neste produto:** 0,21 mg
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 0,21 mg
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** A advertência Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico. deve constar na rotulagem do produto.

---

# MULTIVITAMÍNICO

*cápsula · porção 1 g (2 cápsulas) · 19 itens, 8 conferidos*

## Vitamina C (ácido ascórbico)

- **Denominação ANVISA:** Ácido ascórbico/Ácido L-ascórbico
- **Nº CAS:** 50-81-7
- **Categoria:** Vitaminas
- **Função:** Fonte de vitamina C
- **Especificações aceitas:** European pharmacopoeia 9.0 USP-NF FCC Prepared at the 17th JECFA (1973), published in FNP 4 (1978) and in FNP 52 (1992). Metals and arsenic specifications revised at the 61st JECFA (2003). A group ADI ‘not specified’ was established for ascorbic acid and its Ca, K and Na salts at the 25th JECFA (1981).
- **Quantidade neste produto:** 533,68 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 13.5 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 13,5 mg Máximo: 1.916,02 mg
- **Limite gestantes:** Mínimo: 12,75 mg Máximo: 1.723,43 mg
- **Limite lactantes:** Mínimo: 18 mg Máximo: 1.726,73 mg
- **Alegação autorizada:** 1) Alegação: A vitamina C auxilia na absorção de ferro dos alimentos. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: A vitamina C é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 3) Alegação: A vitamina C auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: A vitamina C auxilia na formação do colágeno. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 5) Alegação: A vitamina C auxilia na regeneração da forma reduzida da vitamina E. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 6) Alegação: A vitamina C auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: A vitamina C auxilia no metabolismo de proteínas e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 8) Alegação: Fonte de vitamina C. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de vitamina C atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 9) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina C. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina C corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Magnésio (de bisglicinato de magnésio)

- **Denominação ANVISA:** Bisglicinato de magnésio
- **Nº CAS:** 14783-68-7
- **Categoria:** Minerais
- **Função:** Fonte de Magnésio
- **Especificações aceitas:** The EFSA Journal (2008) 718, 1-26
- **Quantidade neste produto:** 260,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 63 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 63 mg Máximo: 350 mg
- **Limite gestantes:** Mínimo: 60 mg Máximo: 350 mg
- **Limite lactantes:** Mínimo: 54 mg Máximo: 350 mg
- **Alegação autorizada:** 1) Alegação:O magnésio auxilia na formação de ossos e dentes. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: O magnésio auxilia no metabolismo energético. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 3) Alegação: O magnésio auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 4) Alegação: O magnésio auxilia no equilíbrio dos eletrólitos. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 5) Alegação: O magnésio auxilia no funcionamento muscular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 6) Alegação: O magnésio auxilia no funcionamento neuromuscular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: O magnésio auxilia no processo de divisão celular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 8) Alegação: Fonte de magnésio. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de magnésio atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 9) Alegação: Alto conteúdo/Rico em/Alto teor de magnésio. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de magnésio corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## L-teanina de folhas de Camellia sinensis

- **Denominação ANVISA:** L-teanina de folhas de Camellia sinensis.
- **Nº CAS:** 3081-61-6
- **Categoria:** Aminoácidos
- **Função:** Fonte de L-teanina
- **Especificações aceitas:** Para este constituinte foram aprovadas as especificações do fabricante: Blue California CO.
- **Quantidade neste produto:** 150,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 50 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 50 mg/dia Máximo: 250 mg/dia
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não foi aprovada alegação de propriedade funcional nem de saúde para o ingrediente
- **Advertência obrigatória:** o painel não exige advertência específica para este constituinte.

## Niacina (nicotinamida)

- **Denominação ANVISA:** Mononucleotídeo de beta-nicotinamida
- **Nº CAS:** 1094-61-7
- **Categoria:** Vitaminas
- **Função:** Fonte de Niacina
- **Especificações aceitas:** Para este ingrediente foram aprovadas as especificações do proprietário: EFFEPHARM (SHANGHAI) CO., LTD. - Shanghai City/China.
- **Quantidade neste produto:** 16,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 2.4 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 2,4 mg/dia Máximo: 35 mg/dia
- **Limite gestantes:** Mínimo: 2,7 mg/dia Máximo: 30 mg/dia
- **Limite lactantes:** Mínimo: 2,55 mg/dia Máximo: 30 mg/dia
- **Alegação autorizada:** 1) Alegação: A niacina contribui para a manutenção da pele. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de niacina atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo vitamina B3 pode ser usado em substituição ao termo niacina nas alegações. 2) Alegação: A niacina auxilia na manutenção de mucosas. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de niacina atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo vitamina B3 pode ser usado em substituição ao termo niacina nas alegações. 3) Alegação: A niacina auxilia no metabolismo energético. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de niacina atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo vitamina B3 pode ser usado em substituição ao termo niacina nas alegações. 4) Alegação: A niacina auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de niacina atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo vitamina B3 pode ser usado em substituição ao termo niacina nas alegações. 5) Alegação: Fonte de niacina. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de niacina atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo vitamina B3 pode ser usado em substituição ao termo niacina nas alegações. 6) Alegação: Alto conteúdo/Rico em/Alto teor de niacina. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de niacina corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018. O termo vitamina B3 pode ser usado em substituição ao termo niacina nas alegações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Zinco (de bisglicinato de zinco)

- **Denominação ANVISA:** Bisglicinato de zinco
- **Nº CAS:** 14281-83-5
- **Categoria:** Minerais
- **Função:** Fonte de Zinco
- **Especificações aceitas:** The EFSA Journal (2008) 718, 1-26
- **Quantidade neste produto:** 15,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 1.65 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 1,65 mg Máximo: 29,59 mg
- **Limite gestantes:** Mínimo: 1,8 mg Máximo: 23,50 mg
- **Limite lactantes:** Mínimo: 1,95 mg Máximo: 24,45 mg
- **Alegação autorizada:** 1) Alegação: O zinco é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: O zinco auxilia na visão. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 3) Alegação: O zinco auxilia no metabolismo da vitamina A. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 4) Alegação: O zinco contribui para a manutenção do cabelo, da pele e das unhas. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 5) Alegação: O zinco auxilia no metabolismo de proteínas, carboidratos e gorduras. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 6) Alegação: O zinco auxilia na síntese de proteínas. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 7) Alegação: O zinco auxilia no processo de divisão celular. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 8) Alegação: O zinco auxilia na manutenção de ossos. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 9) Alegação: O zinco auxilia no funcionamento do sistema imune. Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 10) Alegação: Fonte de zinco.Requisitos: As alegações são restritas aos suplementos alimentares cuja quantidade de zinco atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 11) Alegação: Alto conteúdo/Rico em/Alto teor de zinco. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de zinco corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Vitamina E (acetato de DL-alfa-tocoferol)

- **Denominação ANVISA:** Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila
- **Nº CAS:** 7695-91-2
- **Categoria:** Vitaminas
- **Função:** Fonte de Vitamina E
- **Especificações aceitas:** EFSA Journal 2016;14(3):4412 European pharmacopoeia 9.0
- **Quantidade neste produto:** 10,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 2.25 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 2,25 mg Máximo: 1000 mg
- **Limite gestantes:** Mínimo: 2,25 mg Máximo: 800 mg
- **Limite lactantes:** Mínimo: 2,85 mg Máximo: 800 mg
- **Alegação autorizada:** 1) Alegação: A vitamina E é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina E atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. 2) Alegação: Fonte de vitamina E. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina E atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações 3) Alegação: Alto conteúdo/Rico em/Alto teor de vitamina E. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de vitamina E corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018 e suas atualizações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Ácido pantotênico (D-pantotenato de cálcio)

- **Denominação ANVISA:** D-pantotenato de cálcio
- **Nº CAS:** 137-08-6
- **Categoria:** Vitaminas
- **Função:** Fonte de Ácido pantotênico
- **Especificações aceitas:** FCC
- **Quantidade neste produto:** 5,00 mg
- **Atinge o mínimo para alegar?** Sim — mínimo de 0.75 mg atendido.
- **Limite adultos (>19 anos):** Mínimo: 0,75 mg Máximo: 5,64 mg
- **Limite gestantes:** Mínimo: 0,9 mg Máximo: 5,83 mg
- **Limite lactantes:** Mínimo: 1,05 mg Máximo: 5,49 mg
- **Alegação autorizada:** 1) Alegação: O ácido pantotênico auxilia no metabolismo energético. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de ácido pantotênico atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo vitamina B5 pode ser usado em substituição ao termo ácido pantotênico nas alegações. 2) Alegação: Fonte de ácido pantotênico. Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de ácido pantotênico atenda aos valores mínimos estabelecidos na IN 28/2018 e suas atualizações. O termo vitamina B5 pode ser usado em substituição ao termo ácido pantotênico nas alegações. 3) Alegação: Alto conteúdo/Rico em/Alto teor de ácido pantotênico.Requisitos: A alegação é restrita aos suplementos alimentares cuja quantidade de ácido pantotênico corresponda ao dobro dos valores mínimos estabelecidos na IN 28/2018 e suas atualizações, desde que não ultrapasse o limite máximo estabelecido na IN 28/2018. O termo vitamina B5 pode ser usado em substituição ao termo ácido pantotênico nas alegações.
- **Advertência obrigatória:** Não há requisitos adicionais

## Boro (de quelato de boro)

- **Denominação ANVISA:** Frutoborato de cálcio
- **Nº CAS:** não atribuído no painel
- **Categoria:** Substâncias bioativas
- **Função:** Fonte de Boro
- **Especificações aceitas:** EFSA
- **Quantidade neste produto:** 3,00 mg
- **Base de expressão do limite:** O insumo da casa é "quelato de boro", que NÃO consta do painel. As fontes autorizadas são frutoborato de cálcio e tetraborato de sódio decahidratado.
- **Atinge o mínimo para alegar?** O painel não estabelece mínimo para este constituinte.
- **Limite adultos (>19 anos):** Mínimo: Não estabelecido Máximo: 8,866 mg/dia
- **Limite gestantes:** **NÃO AUTORIZADO** para este grupo
- **Limite lactantes:** **NÃO AUTORIZADO** para este grupo
- **Alegação autorizada:** Não autorizada alegação de propriedade funcional e/ou saúde para esse ingrediente.
- **Advertência obrigatória:** A advertência “Este produto não deve ser consumido por gestantes, lactantes e crianças.” deve constar na rotulagem do produto.

---
