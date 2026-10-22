# -*- coding: utf-8 -*-
"""
Textos das listas `mudancas`, `removidos` e `alternativas` dos 15 produtos em que a migration
20260922000000 as gravava vazias. Transcritos em 17/09/2026 da seção 4 ("Mudanças e motivos"), do bloco
"Retirados da fórmula" (seção 3) e das alternativas registradas de cada memorial em
docs/conformidade/reformulacao/<slug>.md. Marcação em negrito (**) do markdown foi removida; o conteúdo é o
do memorial, sem acréscimo.
"""
from collections import OrderedDict


def _r(constituinte, quantidade_mg, motivo):
    return OrderedDict([("constituinte", constituinte), ("quantidade_mg", quantidade_mg), ("motivo", motivo)])


MUDANCAS = {
    "detox-matinal-lemon-shot-300g": [
        "Zinco: 0,29 → 2,2 mg de zinco (1,45 → 11,06 mg de bisglicinato). Motivo: Anexo III, linha 'Zinco', mínimo 1,65 mg para > 19 anos; 0,29 mg é 17,6 % do mínimo. Alvo escolhido em 2,2 mg = 133 % do mínimo, 7,4 % do teto (Anexo IV, 29,59 mg) e 20 % do VD (11 mg) — folga real para variação de pesagem e de teor do lote (o laudo 055-ZN/25 está no limite inferior da própria especificação, 20,00–23,00 %). Conta: 2,2 ÷ 0,1989 = 11,06 mg.",
        "Cúrcuma: retirada. Motivo: Anexo III, linha 'Curcumina', mínimo 80 mg de curcuminoides totais (IN 438/2026); o lote em uso entrega 0,55 mg (0,7 % do mínimo); para chegar a 80 mg seriam 19.048 mg de extrato, impossível em 10 g. Regra do princípio 7 (extrato sem laudo que demonstre o marcador na faixa): sai e volta quando houver extrato de rizoma padronizado com laudo de curcuminoides totais. Dose que seria conforme: 100 mg de curcuminoides (77 % do teto de 130 mg) = 105,3 mg de um extrato a 95 % — e, nesse caso, entra a advertência específica da IN 438/2026 (§7) e a proibição de associar com tetraidrocurcuminoides (nota xv do Anexo I). Existe em disco um laudo de 'Curcuma Longa 95 %' (Pharma Nostra, lote CP260100042, 95,15 % de curcuminoides totais, validade 06/01/2031) que o parecer interno de 28/08/2026 rejeitou por especificação (CAS de curcumina isolada, parte declarada 'raiz' e método in-house) — só o RT pode rever.",
        "Café verde: massa mantida (400 mg), laudo trocado. Motivo: a dose tem de ser demonstrada pelo marcador (Anexo IV, 'Ácido clorogênico', máximo 400 mg; Anexo III: mínimo NE). O laudo do lote em uso (HERBALTEC 10841) está em digitalização não lida no inventário, sem validade confirmada, com espécie Coffea robusta (o rótulo imprime arabica), irradiação a 10 kGy e microbiologia 'ND'. O único laudo de café verde válido e legível em disco é o do café verde solúvel IDNLABS, lote 10269 (64,05 % de ácido clorogênico; metilxantinas 1,56 %; validade 08/2027). A conta desta proposta usa esse laudo: 256,20 mg de ácido clorogênico (64 % do teto). Se a fábrica mantiver o 10841, a conta com o teor lido no memorial (53,86 %) dá 215,44 mg (54 % do teto) — também dentro da faixa — mas o laudo precisa ser completado (validade, cafeína, microbiologia) e o rótulo precisa declarar a espécie do laudo. Observação sobre cafeína: com metilxantinas de 1,56 %, o extrato traz no máximo 6,24 mg de cafeína por porção (calculado: 400 × 0,0156); o produto não é fonte de cafeína (mínimo 75 mg) e fica muito abaixo do teto de 200 mg. O memorial cita um 'mínimo de 50 mg' de ácido clorogênico lido no painel; o Anexo III literal diz NE — prevalece o texto da norma.",
        "Laranja moro: mantida (100 mg → 1,47 mg de antocianinas). Forma 'Extrato de laranja moro (Citrus sinensis (L.) Osbeck)' autorizada (Anexo I, redação IN 336/2024); antocianinas 29 % do teto de 5 mg; laudo válido. O memorial aponta que o painel da ANVISA exige a especificação do fabricante BIONAP SRL; essa condição não consta do Anexo I literal nem das notas i–xv — registrada como pendência para o RT, não como não conformidade.",
        "Vitamina C: mantida (1.600 mg = 83,5 % do teto). Dentro da faixa, forma autorizada, laudo válido.",
        "Maltodextrina recalculada para fechar 10.000 mg (6.713,90 mg) e laudo a renovar (vencido).",
        "Aditivos mantidos nas massas do memorial; corante com identificação pendente.",
    ],
    "saude-intestinal": [
        "Psyllium, inulina e FOS retirados. Anexo III, linha 'Fibras alimentares', mínimo 5,7 g para > 19 anos; as três fontes somam 567 mg (9,9 % do mínimo) e em cápsula nunca alcançam 5,7 g — princípio 6 da reformulação (o dono já tirou o psyllium de outro produto por isso). Sem as fibras, o rodapé da tabela ('não contém quantidades significativas de fibras') e o texto de apresentação ('fórmula completa que combina fibras alimentares') deixam de se contradizer — o texto de apresentação tem de ser reescrito. Alternativa, registrada e não principal: versão em pó/sachê com psyllium + inulina + FOS ≥ 5,7 g por porção.",
        "Cúrcuma retirada. Anexo III/IV 'Curcumina': 80–130 mg de curcuminoides totais (IN 438/2026); o lote entrega 0,49 mg. Volta com extrato de rizoma padronizado e laudo (dose conforme: 100 mg de curcuminoides = 105,3 mg de extrato a 95 %, 77 % do teto), com a advertência específica da IN 438/2026.",
        "Magnésio mantido (90 mg). Dentro da faixa com folga (143 % do mínimo; 25,7 % do teto). Com 684 mg liberados pelas retiradas, os 297,81 mg do bisglicinato cabem — não é preciso trocar por óxido de magnésio nem passar a 3 cápsulas (as duas saídas que o próprio memorial sugeria). O laudo do lote está vencido: laudo novo antes de fabricar.",
        "Quercetina mantida (69,16 mg). Laudo vencido: laudo novo. A linha 'Quercetina' do Anexo I não traz CAS nem forma; a dúvida anidra × di-hidratada é do painel — o RT decide.",
        "Zinco, vitamina A e B6 mantidos (todos dentro da faixa, longe do teto).",
        "Dióxido de silício com massa (5 mg) e maltodextrina q.s.p. para fechar 1.000 mg — decisão de excipiente é da fábrica.",
    ],
    "moro-slim": [
        "Feno-grego retirado — por forma e por laudo. O Anexo I autoriza 'Extrato de semente de feno-grego (Trigonella foenum-graecum L.)' (IN 304/2024); a fábrica pesa pó de semente (Santosflora, sem doseamento). Sem laudo de saponinas não há como demonstrar a dose (princípio 7). Existem em disco extratos com laudo válido de fenosídeos/saponinas (KTF 53,42 %; Quimer 72,82 %, 70,78 % e 75,92 %; Testofen/Galena sem fabricante nomeado), todos rejeitados pelo parecer interno PAR-LAU-2026-001 (28/08/2026) porque o painel da ANVISA exigiria o fabricante Indus Biotech. Essa exigência não consta do Anexo I literal nem das notas i–xv — a decisão de manter o parecer é do RT. Volta quando houver extrato com laudo de saponinas e fornecedor aceito; dose que seria conforme: ≤ 405 mg de saponinas (90 % do teto de 450 mg do Anexo IV) — por exemplo 220 mg de um extrato a 50 % = 110 mg (24 % do teto); nesse caso entra a advertência do Anexo VI (IN 304/2024).",
        "Cúrcuma retirada (0,57 mg de curcumina contra mínimo de 80 mg; volta com extrato padronizado — 105,3 mg a 95 % dão 100 mg, 77 % do teto — e com a advertência específica da IN 438/2026).",
        "Espirulina retirada: única entrada no Anexo I é como Proteínas (mínimo 8,4 g); 122 mg = 1,5 % do mínimo — princípio 6.",
        "Quitosana, psyllium e inulina retirados: fibras alimentares, mínimo 5,7 g; os três somam 232 mg de insumo (e a quitosana só tem 21,26 % de fibra) — princípio 6. Com a quitosana sai a declaração de alergênico de crustáceos.",
        "Cromo: 250 → 200 µg. O cadastro e o rótulo cravavam o teto exato (Anexo IV, 250 µg) — sem margem para o teor do lote (12,34 %, especificação 12,0–13,0 %) nem para pesagem. 200 µg = 80 % do teto, como o memorial rev02 já recomendava. Conta: 200 ÷ 0,1234 = 1,62 mg de picolinato.",
        "Café verde mantido (110 mg), laudo trocado: dose demonstrada pelo marcador com o laudo válido legível (IDNLABS 10269, 64,05 %) = 70,46 mg de ácido clorogênico (18 % do teto). Com o lote em uso (10841, 53,86 % lido no memorial) seriam 59,25 mg — também na faixa —, mas o laudo precisa ser completado e a espécie do rótulo corrigida. Cafeína no máximo 1,72 mg (metilxantinas): não é fonte de cafeína. O memorial cita 'faixa 50–400 mg' do painel; o Anexo III literal diz NE.",
        "Laranja moro mantida (175 mg → 2,57 mg, 51 % do teto). Divergência a resolver na fábrica: o inventário de laudos anota que o parecer PAR-LAU-2026-001 associa o Moro Slim a uma 'Laranja Vermelha Nacional em Pó' (T&T, sem variedade nem doseamento); o memorial rev02 usa o extrato AllPremium 17624. Se o estoque for o pó T&T, a linha fica NÃO VERIFICADA até trocar o insumo.",
        "Vitamina A mantida (1.500 µg RAE, 57 % do teto) — com alerta: o memorial rev00 (30/07/2026) pesava 1,5 mg do mesmo insumo para a mesma entrega (subdose de 5,9×); o RT precisa confirmar qual massa a produção usa.",
        "Maltodextrina q.s.p. e dióxido de silício 5 mg — decisão de excipiente da fábrica.",
    ],
    "pro-energy": [
        "Guaraná: extrato seco → 'Guaraná em pó (Paullinia cupana)'. O grupo Cafeína do Anexo I lista 'Cafeína/1,3,7-Trimethylxanthine', 'Café verde em pó', 'Extrato fluido de guaraná' (IN 450/2026) e 'Guaraná em pó (Paullinia cupana)'. 'Extrato seco de guaraná' não consta — e é o que a fábrica pesa (lote AUTO9J1Q, 22,35 % de cafeína). Existe em disco laudo válido de guaraná em pó de semente (lote interno 25H26-B028-213428, validade 28/04/2028, metilxantinas 5,11 %, taninos 4,12 %). A troca (i) põe o insumo numa forma do Anexo I, (ii) devolve folga à cafeína total (80 % do teto no pior caso, contra 97 %) e (iii) preserva o nome que o rótulo já imprime. Pendências: o laudo doseia metilxantinas totais, não cafeína — pedir laudo com cafeína específica para declarar a cafeína total exata; o documento não traz a razão social do fornecedor.",
        "Feno-grego retirado — por forma e por laudo. A fábrica pesa pó de semente (o Anexo I só autoriza o extrato) e não há laudo de saponinas (princípio 7). Os extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 por fabricante (exigência do painel que não consta do Anexo I literal; o RT decide). Volta com extrato + laudo + fornecedor aceito; dose que seria conforme: ≤ 405 mg de saponinas (ex.: 250 mg a 50 % = 125 mg, 28 % do teto), com a advertência do Anexo VI (IN 304/2024).",
        "Cafeína anidra mantida em 150 mg. Sozinha fica em 74,9 % do teto; com o guaraná em pó, 80 % no pior caso — dentro do princípio 'no máximo 90 % do teto'. A redução para 140 mg que o memorial sugeria era resposta ao extrato seco; com a troca do guaraná não é mais necessária (mudar só o necessário).",
        "Arginina: nome corrigido para 'cloridrato de L-arginina' (insumo real, forma autorizada, CAS 1119-34-2). O rótulo imprime 'L-Aspartato de L-arginina' (também autorizado, mas não é o que está na cápsula).",
        "Vitamina B6: declaração corrigida para 8,22 mg (632 % do VD); o rótulo declara 10 mg / 769 % tratando a massa do cloridrato como vitamina.",
        "Taurina, L-carnitina e zinco mantidos (todos longe do teto).",
        "Maltodextrina q.s.p. 250 mg — decisão de excipiente da fábrica.",
    ],
    "emagrecedor-em-capsula": [
        "Espirulina, psyllium, quitosana e inulina retirados — Anexo III: proteínas 8,4 g e fibras 5,7 g; nenhum chega perto em cápsula (princípio 6; o dono já havia removido três deles). Com a quitosana sai a declaração 'contém derivados de crustáceos'.",
        "Cúrcuma retirada — sem laudo de curcuminoides (princípio 7); os extratos com laudo em disco ou entregam 0,4–0,6 % (inatingível) ou foram rejeitados pelo parecer interno. Volta com extrato padronizado (105,3 mg a 95 % = 100 mg, 77 % do teto) e a advertência da IN 438/2026.",
        "Feno-grego retirado — sem laudo de saponinas; os extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 por fabricante (exigência que não consta do Anexo I literal — o RT decide). Dose conforme se voltar: ≤ 405 mg de saponinas.",
        "Guaraná em pó retirado — a forma é autorizada e há laudo válido, mas o guaraná está no Anexo I como fonte de Cafeína, cujo mínimo é 75 mg (Anexo III); 100 mg de pó entregam no máximo 5,11 mg (metilxantinas). Só volta se o produto ganhar cafeína anidra (cafeína total entre 75 e 180 mg) — isso muda o conceito e é decisão do dono.",
        "Café verde mantido, agora com laudo — 64,05 mg de ácido clorogênico (16 % do teto); a ficha citava '35 %' só no nome comercial.",
        "Laranja moro mantida em 5 mg, com laudo — 0,07 mg de antocianinas (1,5 % do teto; mínimo NE). A dose da ficha foi mantida por ser conforme; 100 mg (1,47 mg, como no Detox) fica como alternativa para o dono.",
        "Cromo: 200 µg (80 % do teto) — o cadastro cravava o teto e a ficha era ambígua (0,25 mg do sal).",
        "Vitamina A: dose mantida (1.500 µg RAE), massa do insumo corrigida — a ficha pesava 1,5 mg do acetato, que a 568.116 UI/g entregam cerca de 256 µg RAE (17 % do declarado); para 1.500 µg RAE são 8,80 mg (mesma conta do Moro Slim).",
        "Vitamina C não incluída — consta da lista de ingredientes do cadastro, mas nenhuma fonte dá a dose; não se inventa dose. Se o dono quiser, o lote 950467 (99,5 %, válido até 05/03/2029) permite qualquer valor entre 13,5 mg e 1.724 mg (90 % do teto).",
    ],
    "slim-up-emagrecimento-em-gota": [
        "Colina: 13,52 → 90 mg (33,3 → 221,62 mg de bitartarato). Anexo III, linha 'Colina', mínimo 82,5 mg; a dose do rev03 era 16 % disso. 90 mg = 109 % do mínimo, 2,8 % do teto (3.235,15 mg), 16 % do VD. É a única forma de manter a colina (princípio 3: dose dentro da faixa); a alternativa é retirá-la. Pendência de fábrica: confirmar que 221,62 mg de bitartarato de colina se mantêm dissolvidos e estáveis em 1 mL (os sólidos por mL sobem de 444,6 para 498,2 mg) e aceitável no sabor.",
        "Vitamina B12: 9,0 → 8,0 µg. O rev02 cravava o teto (9,94 µg) e o rev03 ficou em 90,5 % dele — acima dos 90 % do princípio 3. 8,0 µg = 80,5 % do teto e 333 % do VD; qualquer valor ≤ 8,9 µg atende. Conta: 8,0 ÷ 0,8927 = 8,96 µg de metilcobalamina. Divergência de teor para o mesmo lote (89,27 % t.q. no rev03; 98,17 % base anidra no inventário) — a fábrica confirma a base que usa na pesagem.",
        "Cúrcuma retirada (0,336 mg contra mínimo de 80 mg de curcuminoides; volta com extrato padronizado — 105,3 mg a 95 % — e, em gotas, com solubilidade a validar).",
        "Feno-grego retirado: sem laudo de saponinas e nomenclatura incoerente (rótulo 'extrato fluido', laudo de pó). Extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 por fabricante — exigência ausente do Anexo I literal; RT decide. Dose conforme se voltar: ≤ 405 mg de saponinas.",
        "Inulina retirada: fibra (mínimo 5,7 g) sem função tecnológica que a enquadre no Art. 6, § único — princípio 6.",
        "Café verde mantido (50 mg), laudo trocado: dose demonstrada com o laudo válido legível (IDNLABS 10269, 64,05 %) = 32,02 mg de ácido clorogênico (8 % do teto). O rev03 escreve 'abaixo do mínimo de 50 mg' com base no painel; o Anexo III literal diz NE — pelo texto da norma não há mínimo, e a linha fica conforme com qualquer dos dois lotes (com o 10841, 26,93 mg). Cafeína no máximo 0,78 mg: não é fonte de cafeína.",
        "Vitamina D3 mantida em 45 µg (90,0 % do teto — no limite do princípio 3; 300 % do VD). Se o RT quiser folga maior: 40 µg = 13,913 mg do pó (80 %).",
        "Cromo mantido (30,85 µg) — e o cadastro passa a declarar o elemento (o '250 mcg' do cadastro era a massa do sal).",
    ],
    "shot-colageno-300-gramas": [
        "Colágeno hidrolisado: 7.548 → 9.450 mg. O colágeno hidrolisado só existe no Anexo I como fonte de Proteínas ('Gelatina hidrolisada/Colágeno hidrolisado'), com mínimo de 8,4 g/dia no Anexo III; o 'Colágeno' de 11,5 mg (IN 102/2021) é outro constituinte, cuja fonte é membrana de casca de ovo. Com o único teor proteico em disco (91,0 %), 7.548 mg entregam 6,87 g (abaixo) e 8.400 mg (cadastro) só atingem 8,4 g se o colágeno fosse 100 % proteína. 9.450 mg → 8,60 g = 102,4 % do mínimo. A folga é estreita: um lote com proteína abaixo de 88,9 % fica abaixo do mínimo — por isso a alternativa de 12 g. Tudo depende do laudo de proteína do lote em uso, que não existe em disco (o certificado Lepuge do Peptan não doseia proteína; o do Verisol está vencido). Observação sobre alegação: 'fonte de proteínas' (Anexo V) exige o perfil de aminoácidos essenciais do Anexo VII (triptofano 6 mg/g de proteína) — o colágeno não atende; cumprir o mínimo de quantidade não autoriza a alegação.",
        "Vitamina C: 1.100 → 200 mg (200 % do VD, 10,4 % do teto) — redução dentro da faixa para abrir espaço ao colágeno (princípio 5: reduzir dose antes de mudar porção). Na alternativa de 12 g volta a 800 mg.",
        "Zinco: 0,29 mg de sal → 2,2 mg de zinco (11,06 mg de bisglicinato) — a ficha entregava 0,058 mg (3,5 % do mínimo); o cadastro cravava o mínimo exato. 2,2 mg = 133 % do mínimo, 7,4 % do teto, 20 % do VD.",
        "Cúrcuma, café verde e laranja moro retirados — cúrcuma sem laudo (princípio 7); café verde e laranja moro são secundários e não cabem com o colágeno em 10 g (princípio 5); nenhum dos três está na composição do cadastro (só na lista de ingredientes, que é a contradição apontada pela auditoria). Na alternativa de 12 g, café verde (50 mg = 32 mg de ácido clorogênico com o laudo IDNLABS 10269) e laranja moro (5 mg = 0,07 mg de antocianinas com o laudo 17624) podem voltar.",
        "Aditivos reduzidos (ácido cítrico 150, aroma 100, SiO2 20, sucralose 15, corante 5) — todos quantum satis ou muito abaixo do limite; a fábrica valida o sabor.",
    ],
    "bella-gummy-biotina-em-gummy": [
        "Biotina 45 → 40 µg (massa do insumo 0,046 → 0,040 mg). Motivo: 45 µg é o teto exato do Anexo IV ('limites máximos que não podem ser ultrapassados'); qualquer variação de lote ou pesagem ultrapassa. 40 µg = 88,9 % do teto e 133 % do VD. O memorial rev02 (Tabela 15) já propunha isso.",
        "Biotina — laudo de referência trocado para o que está anexado (91457/BN25121020, 100,0 %, válido até 19/12/2028). O memorial cita lote e teor que não existem no documento anexado; a conta passa a usar o laudo real.",
        "Vitamina E — só a declaração muda: a massa pesada (16,70 mg do pó 50 %) continua; o rótulo e a linha de composição passam a declarar o ativo, 5,68 mg de α-tocoferol (38 % VD), e não '16,7 mg (111 % VD)'. Sem isso o rótulo declara quase três vezes a vitamina E que a goma tem.",
        "Vitamina A — declaração mantida em µg RAE (1.020–1.022 µg conforme o fator usado; os dois arredondam para 128 % VD). O laudo do lote precisa ser conferido visualmente (é digitalização).",
        "Nada mais muda: vitamina C, zinco e a matriz ficam como a fábrica pesa hoje. Nenhum insumo tinha forma fora do Anexo I.",
    ],
    "creatina-monohidratada-150g-soluvel": [
        "Dose 5.000 → 4.000 mg por porção. 5.000 mg crava o teto do Anexo IV e, com o teor do laudo, o calculado passa dele (5.025 mg) na leitura que a própria fábrica usa; o dosador é volumétrico e não validado. 4.000 mg dá folga nas duas leituras e tolera a variação do dosador.",
        "Porções por embalagem 30 → 'Cerca de 38' (consequência da dose; regra do Anexo VI da IN 75).",
        "Advertência do Anexo VI já existe no cadastro ('Não deve ser consumido por gestantes, lactantes e crianças') — passa ao texto literal 'Este produto não deve ser consumido por gestantes, lactantes e crianças'.",
        "Forma, fornecedor e laudo: mantidos (única forma de creatina do Anexo I além do 'magnésio creatina quelato'; laudo válido).",
    ],
    "creatina-monohidratada-300g-soluvel": [
        "Dose 5.000 → 4.000 mg — mesmo motivo do pote de 150 g: 5.000 mg crava o teto; com o teor do laudo (100,5 %) o calculado é 5.025 mg na leitura A; o dosador é volumétrico e não validado. 4.000 mg fica com folga nas duas leituras e tolera ±10 % de dosagem.",
        "Porções por embalagem: 75 (inteiro exato).",
        "ingredients_list, warnings, nutritional_info e serving_description preenchidos — estavam vazios ou incompletos (o cadastro tinha só 'Creatina Monohidratada (5000 mg)'); a advertência do Anexo VI (creatina) faltava.",
    ],
    "creatina-gummy-sabor-frutas-vermelhas": [
        "Creatina 3.000 → 3.500 mg. 3.000 mg crava o mínimo (Anexo III) e a creatina degrada na goma; 3.500 mg fica acima do mínimo nas duas leituras do teor.",
        "Porção declarada posta em dúvida, por escrito. A receita do memorial tem 6.814 mg de sólidos para uma porção de 6.000 mg (7.314 mg com a nova dose). Pesar a goma acabada e dosear creatina/creatinina no produto acabado antes de qualquer arte nova.",
        "ingredients_list e warnings preenchidos (estavam vazios no banco; a migration em disco 20260920100000 já trazia a versão de rótulo, aqui atualizada com o '4R' do corante e a advertência literal).",
        "Designação de venda 'Suplemento Alimentar em goma' (o rótulo traz 'Suplemento alimentar CREATINA em goma').",
        "Sem troca de forma nem de insumo: a creatina monoidratada é a forma do Anexo I e o laudo é válido.",
    ],
    "creatina-em-gummy-sabor-tutti-frutti": [
        "Creatina 3.000 → 3.500 mg — acima do mínimo nas duas leituras do teor (ver memorial da irmã).",
        "ingredients_list e warnings preenchidos — estavam vazios; o corante fica marcado entre colchetes porque 'corante rosa' não é dizer de rotulagem (pode ser carmim, vermelho 40, ponceau ou mistura) e a lista não pode ir com lacuna para a arte.",
        "Massa da porção e peso líquido postos como PENDENTES — o cadastro nem sequer declara a massa da porção.",
    ],
    "melatonina-em-gummy-sabor-uva": [
        "Melatonina 0,21 → 0,18 mg (insumo 0,211 → 0,1812 mg). 0,21 mg é o teto de segurança do Anexo IV, 'que não pode ser ultrapassado'; qualquer variação de lote ou pesagem estoura. 0,18 mg = 85,7 % do teto. O memorial sugeria 0,19 mg (90,5 % — passa da regra de 90 %).",
        "L-triptofano 800 → 750 mg (insumo 800,80 → 750,75 mg). 800 mg = 93 % do teto; 750 mg = 87,2 %, como o memorial sugeria.",
        "ingredients_list, warnings, target_audience e conservação preenchidos — estavam vazios; a advertência da melatonina (Anexo VI) e a dos aminoácidos faltavam.",
        "Nenhuma troca de forma: L-Triptofano e Melatonina são entradas literais do Anexo I. Ponto a conferir: o memorial afirma que o painel da ANVISA só aprova 'L-triptofano de glicose de milho (Zea mays L.)' com especificação do fabricante Kyowa Hakko Bio (Japão), e o insumo em uso é chinês. No texto literal do Anexo I há duas entradas: 'L-Triptofano | 73-22-3' (sem nota de fabricante) e 'L-triptofano de glicose de milho (Zea mays L.)^ii' (nota ii excluída pela IN 76/2020). O insumo em uso (CAS 73-22-3) cabe na primeira entrada pelo texto literal; se o painel restringir a primeira, a fonte teria de mudar. PENDENTE de conferência no painel pelo RT — não afirmo nenhum dos dois lados.",
    ],
    "pre-treino-300-g": [
        "L-citrulina malato retirada da lista de ingredientes — não consta do Anexo I (a única entrada com citrulina é 'L-citrulinilarginina', autorizada só como alga Chondrus crispus invernal, com máximo de 52,8 mg e advertência 'Contém citrulina.'; não é o mesmo constituinte). O memorial da fábrica já a retirou em 14/08/2026 e recompôs a via do óxido nítrico com cloridrato de L-arginina (forma do Anexo I, laudo válido) — a proposta segue o memorial.",
        "Beta-alanina 2.000 → 300 mg por dose. Anexo VI: 'Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses.' Com 1 dose por dia de 300 mg o produto atende à condição e mantém o conceito de dose única. (O cadastro já trazia 300 mg; a fábrica pesava 2.000.)",
        "Cafeína 200 → 175 mg — 200 mg é o teto exato do Anexo IV (199,76 mg com o teor); 175 mg = 87,4 %. Segue insumo controlado pela Polícia Federal: a licença da Lemoncaps é PENDENTE (o próprio memorial marca isso como pendência crítica).",
        "Creatina 3.000 → 3.500 mg — 3.000 mg crava o mínimo (e fica abaixo na leitura B); 3.500 mg fica acima nas duas leituras (ver memorial da creatina em pó). O cadastro tinha 5.000 (teto).",
        "Vitamina B12 9,4 → 8,5 µg — 94,6 % do teto vira 85,5 %.",
        "Taurina 2.000 → 900 mg e tirosina 500 → 400 mg no cadastro — o cadastro cravava a taurina no teto; a fábrica pesa 900 e 400 (memorial).",
        "Arginina, B6 e B12 entram no cadastro — a fábrica pesa e o cadastro não tinha.",
        "Corante sem nome retirado da lista — não está no memorial; se existir, precisa de nome, INS, massa e laudo.",
        "Maltodextrina 600 → 1.825 mg (q.s.p.) — laudo do lote 210170 vencido; lote novo antes de fabricar.",
    ],
    "pre-treino-creatina-sabor-limao-420g": [
        "Cafeína total fechada em 162,6 mg (81 % do teto): cafeína anidra 150 mg (FRM) + guaraná em pó 250 mg a no máximo 5,11 % de metilxantinas. Resolve a NC1. Se o laudo de cafeína isolada do guaraná vier menor que 5,11 %, a folga só aumenta.",
        "Guaraná: 'extrato de guaraná'/'extrato seco' → 'Guaraná em pó (Paullinia cupana)' — única forma sólida do Anexo I; há laudo válido em disco (lote 25H26-B028-213428, val. 28/04/2028). Resolve a NC5. O extrato seco NaturalPRO em disco (fruto, 2,1 % de cafeína) está corretamente rejeitado.",
        "Beta-alanina 2.000 → 300 mg por dose única — condição do Anexo VI. Resolve a NC2 sem fracionar o produto.",
        "Creatina 5.000 → 4.000; magnésio 350 → 300 mg; niacina 35 → 30 mg; vitamina D 50 → 40 µg; B12 9,94 → 8,5 µg — todos saem do teto exato para 71–86 % dele. Resolve a NC3.",
        "Arginina 3.810 mg (teto) → cloridrato de L-arginina 1.240 mg = 1.019 mg de arginina — a FRM já usa ~1.000 mg; a forma com laudo válido em disco é o cloridrato (Anexo I). Resolve o teto e a forma indefinida.",
        "Vitamina B6: 90 mg passa a ser declarado como sal, entregando 74 mg de piridoxina (75 % do teto; 5.692 % VD) — o rótulo dizia '90 mg / 6.923 % VD' como se fosse a vitamina. (Se o dono quiser reduzir o %VD, é decisão de conceito, não de conformidade.)",
        "Soma da porção fecha em 14.000 mg com maltodextrina q.s.p. Resolve a NC6.",
        "Advertências no texto literal do Anexo VI (aminoácidos/creatina/taurina/carnitina/cafeína; beta-alanina). Resolve a NC4.",
        "Reconciliação rótulo × ficha (NC7): a proposta parte da FRM Rev.02 (a fórmula que a fábrica usa desde 20/08/2026) e o cadastro passa a refleti-la — a fábrica ainda precisa confirmar por escrito qual fórmula está em produção.",
    ],
}

REMOVIDOS = {
    "detox-matinal-lemon-shot-300g": [
        _r("Curcumina (extrato de rizomas de cúrcuma, NaturalPRO lote NPT.0425/580, 0,42 %)", 130, "0,55 mg de curcumina = 0,7 % do mínimo de 80 mg de curcuminoides totais (Anexo III, IN 438/2026); para 80 mg seriam 19.048 mg de extrato, impossível em 10 g; volta com extrato de rizoma padronizado e laudo de curcuminoides totais"),
    ],
    "saude-intestinal": [
        _r("Fibras alimentares (psyllium pó, lote AUTO9JPE)", 342, "psyllium + inulina + FOS somam 567 mg = 9,9 % do mínimo de 5,7 g de fibras (Anexo III); em cápsula nunca alcançam o mínimo — princípio 6"),
        _r("Fibras alimentares (inulina, lote 206486, 91,0 % = 122,85 mg)", 135, "mínimo de 5,7 g de fibras inatingível em cápsula — princípio 6"),
        _r("Fibras alimentares (FOS, lote 212448, 96,3 % = 86,67 mg)", 90, "mínimo de 5,7 g de fibras inatingível em cápsula — princípio 6"),
        _r("Curcumina (extrato de cúrcuma, NaturalPRO lote NPT.0425/580, 0,42 % = 0,49 mg)", 117, "0,49 mg contra mínimo de 80 mg de curcuminoides totais (IN 438/2026); volta com extrato de rizoma padronizado e laudo"),
    ],
    "moro-slim": [
        _r("Saponinas de glicosídeos de furostanol (feno-grego pó de semente, Santosflora lote AUTO9IVT)", 220, "a fábrica pesa pó de semente e o Anexo I só autoriza o extrato de semente (IN 304/2024); sem laudo de saponinas não há como demonstrar a dose (princípio 7)"),
        _r("Curcumina (extrato de cúrcuma, NaturalPRO lote NPT.0425/580, 0,42 % = 0,57 mg)", 135, "0,57 mg contra mínimo de 80 mg de curcuminoides totais; volta com extrato padronizado e a advertência da IN 438/2026"),
        _r("Proteínas (espirulina, Santosflora lote AUTO9JRN)", 122, "única entrada no Anexo I é como Proteínas (mínimo 8,4 g); 122 mg = 1,5 % do mínimo — princípio 6"),
        _r("Fibras alimentares (quitosana HDP, Quimer lote 20464, fibra 21,26 % = 25,94 mg)", 122, "mínimo de 5,7 g de fibras; com a quitosana sai a declaração de alergênico de crustáceos — princípio 6"),
        _r("Fibras alimentares (psyllium pó, lote AUTO9JPE)", 66, "mínimo de 5,7 g de fibras inatingível em cápsula — princípio 6"),
        _r("Fibras alimentares (inulina, lote 206486, 91,0 % = 40,04 mg)", 44, "mínimo de 5,7 g de fibras inatingível em cápsula — princípio 6"),
    ],
    "pro-energy": [
        _r("Saponinas de glicosídeos de furostanol (feno-grego pó de semente, Santosflora lote AUTO9IVT)", 250, "a fábrica pesa pó de semente (o Anexo I só autoriza o extrato) e não há laudo de saponinas (princípio 7); os extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 por fabricante"),
    ],
    "emagrecedor-em-capsula": [
        _r("Proteínas (espirulina, Arthrospira platensis)", 110, "proteínas: 1,3 % do mínimo de 8,4 g — inviável em cápsula (princípio 6)"),
        _r("Fibras alimentares (psyllium, Plantago ovata)", 60, "fibras: 1,1 % do mínimo de 5,7 g (princípio 6)"),
        _r("Fibras alimentares (quitosana)", 110, "fibras: abaixo do mínimo de 5,7 g; alergênico de crustáceos (princípio 6)"),
        _r("Fibras alimentares (inulina)", 40, "fibras: abaixo do mínimo de 5,7 g (princípio 6)"),
        _r("Curcumina (extrato seco do rizoma de cúrcuma)", 120, "sem laudo de curcuminoides (princípio 7); os extratos com laudo em disco entregam 0,4–0,6 % ou foram rejeitados pelo parecer interno"),
        _r("Cafeína (guaraná em pó, Paullinia cupana, lote 25H26-B028-213428)", 100, "como única fonte de cafeína fica abaixo do mínimo de 75 mg (100 mg de pó entregam no máximo 5,11 mg de metilxantinas); só volta se o produto ganhar cafeína anidra"),
        _r("Saponinas de glicosídeos de furostanol (feno-grego, extrato seco da semente)", 200, "sem laudo de saponinas; extratos com laudo em disco rejeitados pelo parecer PAR-LAU-2026-001 por fabricante"),
    ],
    "slim-up-emagrecimento-em-gota": [
        _r("Curcumina (extrato de cúrcuma, NaturalPRO lote NPT.0425/580, 0,42 % = 0,336 mg)", 80, "0,336 mg contra mínimo de 80 mg de curcuminoides; volta com extrato padronizado (105,3 mg a 95 %) e, em gotas, com solubilidade a validar"),
        _r("Saponinas de glicosídeos de furostanol ('extrato fluido' de feno-grego, lote AUTO9IVT — o laudo é de pó)", 33, "sem laudo de saponinas e nomenclatura incoerente (rótulo 'extrato fluido', laudo de pó)"),
        _r("Fibras alimentares (inulina, lote 206486, 91,0 % = 19,75 mg)", 21.7, "fibra (mínimo 5,7 g) sem função tecnológica que a enquadre no Art. 6, § único — princípio 6"),
    ],
    "shot-colageno-300-gramas": [
        _r("Curcumina (cúrcuma, sem teor)", 130, "sem laudo de curcuminoides (princípio 7)"),
        _r("Ácido clorogênico (café verde '35 %', teor nominal)", 50, "secundário; não cabe com o colágeno em 10 g (princípio 5); volta na alternativa de 12 g com o laudo IDNLABS 10269"),
        _r("Antocianinas da laranja moro (extrato 'Laranja Moro 08 %', teor nominal)", 5, "secundário; não cabe com o colágeno em 10 g (princípio 5); volta na alternativa de 12 g com o laudo 17624"),
    ],
    "pre-treino-300-g": [
        _r("L-citrulina malato (só na ingredients_list do cadastro, sem massa; a versão anterior do memorial da fábrica tinha 1.400 mg)", None, "não consta do Anexo I (a única entrada com citrulina é 'L-citrulinilarginina', de alga Chondrus crispus); o memorial da fábrica já a retirou na Rev.01 de 14/08/2026 e recompôs com cloridrato de L-arginina"),
        _r("Corante 'artificial (INS)' (só na ingredients_list do cadastro, sem nome, INS nem massa)", None, "não está no memorial da fábrica; se existir, precisa de nome, INS, massa e laudo"),
    ],
}

ALTERNATIVAS = {
    "detox-matinal-lemon-shot-300g": [
        "Café verde: manter o lote em uso HERBALTEC 10841 (53,86 % lido no memorial rev02) — 215,44 mg de ácido clorogênico (54 % do teto), também dentro da faixa —, desde que o laudo seja completado (validade, cafeína, microbiologia) e o rótulo declare a espécie do laudo.",
        "Cúrcuma: voltar com extrato de rizoma padronizado e laudo de curcuminoides totais — dose que seria conforme: 100 mg de curcuminoides (77 % do teto de 130 mg) = 105,3 mg de um extrato a 95 %, com a advertência específica da IN 438/2026 e sem associação com tetraidrocurcuminoides (nota xv do Anexo I); o lote Pharma Nostra CP260100042 (95,15 %) só pode ser considerado se o RT rever o parecer interno de 28/08/2026.",
    ],
    "saude-intestinal": [
        "Versão em pó/sachê com psyllium + inulina + FOS ≥ 5,7 g por porção, se o dono quiser manter fibras (registrada, não principal).",
        "Cúrcuma: voltar com extrato de rizoma padronizado e laudo de curcuminoides totais (100 mg de curcuminoides = 105,3 mg de extrato a 95 %, 77 % do teto), com a advertência específica da IN 438/2026.",
        "Cápsula menor sem excipiente, em vez de maltodextrina q.s.p. 417,08 mg para completar as duas cápsulas tamanho 0 (decisão do dono).",
    ],
    "moro-slim": [
        "Apresentação: uma cápsula de ~300 mg por dia em vez de duas cápsulas tamanho 0 com maltodextrina q.s.p. 699,58 mg (muda a apresentação — decisão do dono).",
        "Feno-grego: voltar quando houver extrato de semente com laudo de saponinas e fornecedor aceito pelo RT — dose que seria conforme: ≤ 405 mg de saponinas (90 % do teto de 450 mg), por exemplo 220 mg de um extrato a 50 % = 110 mg (24 % do teto), com a advertência do Anexo VI (IN 304/2024).",
        "Cúrcuma: voltar com extrato padronizado — 105,3 mg a 95 % dão 100 mg de curcuminoides (77 % do teto) — e com a advertência específica da IN 438/2026.",
        "Café verde: manter o lote em uso HERBALTEC 10841 (53,86 % lido no memorial) — 59,25 mg de ácido clorogênico, também na faixa —, desde que o laudo seja completado e a espécie do rótulo corrigida.",
    ],
    "pro-energy": [
        "Feno-grego: voltar com extrato de semente + laudo de saponinas + fornecedor aceito pelo RT — dose que seria conforme: ≤ 405 mg de saponinas (ex.: 250 mg a 50 % = 125 mg, 28 % do teto), com a advertência do Anexo VI (IN 304/2024).",
        "Excipiente: ajustar a cápsula em vez de maltodextrina q.s.p. 250 mg para manter as duas cápsulas tamanho 0 (decisão do dono).",
    ],
    "emagrecedor-em-capsula": [
        "Laranja moro a 100 mg (1,47 mg de antocianinas, como no Detox) em vez dos 5 mg da ficha — opção do dono.",
        "Vitamina C: incluir, se o dono quiser, com o lote 950467 (99,5 %, válido até 05/03/2029) — qualquer valor entre 13,5 mg e 1.724 mg (90 % do teto).",
        "Guaraná em pó: só volta se o produto ganhar cafeína anidra (cafeína total entre 75 e 180 mg) — muda o conceito, decisão do dono.",
        "Cúrcuma: voltar com extrato padronizado (105,3 mg a 95 % = 100 mg, 77 % do teto) e a advertência da IN 438/2026.",
        "Feno-grego: voltar só com laudo de saponinas e fornecedor aceito pelo RT; dose conforme: ≤ 405 mg de saponinas.",
        "Uma cápsula pequena por dia em vez de 2 cápsulas de 1 g com maltodextrina q.s.p. 879,58 mg (decisão do dono).",
    ],
    "slim-up-emagrecimento-em-gota": [
        "Retirar a colina, se a fábrica considerar inviável manter 221,62 mg de bitartarato de colina dissolvidos e estáveis em 1 mL (não há como atingir os 82,5 mg do mínimo com menos massa).",
        "Vitamina D3 a 40 µg (13,913 mg do pó, 80 % do teto) em vez de 45 µg, se o RT quiser folga maior.",
        "Porção de 2 mL (como o cadastro): mesma dose diária com metade da concentração por mL e 15 porções por frasco — decisão do dono.",
        "Cúrcuma: voltar com extrato padronizado (105,3 mg a 95 %) e, em gotas, com solubilidade a validar.",
        "Feno-grego: voltar só com extrato de semente + laudo de saponinas + fornecedor aceito pelo RT; dose conforme: ≤ 405 mg de saponinas.",
    ],
    "shot-colageno-300-gramas": [
        "Porção de 12 g (25 doses por pote): colágeno 9.900 mg (a 91 %: 9,01 g = 107 % do mínimo), vitamina C 800 mg (804,02 mg de insumo), zinco 2,2 mg (11,06 mg), ácido cítrico 400, aroma 200, SiO2 100, sucralose 50, corante 17, maltodextrina q.s.p. 517,92 mg → 12.000 mg. É a versão com folga real de proteína e com a vitamina C do cadastro; a mudança de porção é decisão do dono. Nela, café verde (50 mg = 32 mg de ácido clorogênico com o laudo IDNLABS 10269) e laranja moro (5 mg = 0,07 mg de antocianinas com o laudo 17624) podem voltar.",
    ],
    "creatina-monohidratada-150g-soluvel": [
        "Dose de 4,5 g, sugerida pelo memorial da fábrica: 4.522,5 mg na leitura A = 90,45 % do teto — passa da regra de 'no máximo 90 %' — e com +10 % no dosador chega a 99,5 % do teto; só é aceitável se o RT adotar formalmente a leitura B (aí 4.002 mg = 80 %).",
    ],
    "creatina-gummy-sabor-frutas-vermelhas": [
        "(i) Manter 3,00 g por goma e refazer a base (não há dado aqui para redesenhá-la) — decisão do dono e da fábrica.",
        "(ii) Aceitar a goma maior que a receita produz — por volta de 3,7 g seca a ~4,1 g com 10 % de umidade residual — e declarar a porção pela pesagem real (por exemplo '8 g (2 gomas)'), corrigindo peso líquido e porções.",
        "(iii) 3 gomas menores por porção. Em qualquer caso a tabela nutricional vale por 2 gomas (a energia não depende da água que evapora).",
    ],
    "creatina-em-gummy-sabor-tutti-frutti": [
        "(i) Manter 3,00 g por goma e refazer a base (ver memorial da irmã, creatina-gummy-sabor-frutas-vermelhas) — decisão do dono e da fábrica.",
        "(ii) Aceitar a goma maior que a receita produz e declarar a porção pela pesagem real, corrigindo peso líquido e porções (ver memorial da irmã).",
        "(iii) 3 gomas menores por porção (ver memorial da irmã). Em qualquer caso a tabela nutricional vale por 2 gomas.",
    ],
    "melatonina-em-gummy-sabor-uva": [
        "Versão B ('Melatonina em Gummy', só melatonina — Relatório de Rótulos de 14/05/2026 e ficha técnica 'Suelen' de 28/08/2026, porção 7,0 g), se o pote em produção for só melatonina: melatonina 0,1812 mg → 0,18 mg; sem triptofano; porção e peso conforme a ficha que valer (6 g/180 g ou 7 g/210 g). Advertências: só as da melatonina e do Art. 14 (a linha 'Aminoácidos' do Anexo VI deixa de se aplicar). A decisão é do dono.",
    ],
    "pre-treino-creatina-sabor-limao-420g": [
        "Magnésio via bisglicinato de magnésio 18 % da Lepuge (lote AUTO039968, laudo válido até 29/04/2027) em vez do bisglicinato 30 % sem laudo válido: 1.667 mg de sal para os mesmos 300 mg de magnésio (ajuste de massa na fórmula).",
    ],
}
