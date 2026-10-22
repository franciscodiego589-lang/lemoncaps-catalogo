// Informação institucional e regulatória exibida em TODO dossiê técnico
// (/catalogo/[slug] e o PDF gerado em lib/catalog/dossie-pdf.ts), na página de
// fabricação e na página /documentacao, independente de a fórmula ter ou não o
// selo de conformidade (esse é individual, por fórmula, e vem do banco - ver
// FormulaDTO.complianceVerifiedAt). Este arquivo é conteúdo fixo (mesmo texto
// em todo produto), por isso não mora no banco.
//
// ===========================================================================
// REGRA DE EXATIDÃO: nada aqui é estimado ou parafraseado livremente.
// ===========================================================================
//
// - MANUFACTURER_INFO: lido de
//   /Users/diegofrancisco/Desktop/POPS/19_SISTEMA_MEMORIAIS/DRT_GUMMY_CREATINA.html
//   (Dizeres de Rotulagem oficiais da fábrica, painel "Painel Lateral
//   Direito"), conferido linha a linha em 12/09/2026. Fonte primária da
//   própria fábrica, não resumo de terceiro.
//
// - REGULATORY_RESOLUTIONS e REGULATORY_INSTRUCTIONS: cada norma foi aberta
//   uma a uma no AnvisaLegis em 13/09/2026 - o portal oficial de legislação
//   consolidada da Anvisa, para onde o próprio
//   https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao
//   redireciona (302). O campo `summary` é a EMENTA LITERAL copiada do
//   cabeçalho do ato; o campo `status` é o selo de vigência que o próprio
//   AnvisaLegis exibe na página da norma. Nenhuma norma entrou de memória,
//   de PDF consolidado antigo nem de fonte secundária.
//
// ===========================================================================
// CORREÇÃO DE UM ERRO ANTERIOR DESTE ARQUIVO (13/09/2026)
// ===========================================================================
//
// A versão anterior deste comentário afirmava que a "RDC 243/2018" NÃO entrava
// na lista porque não aparecia no arquivo de auditoria
// (lemoncaps-catalogo-planejamento/conformidade-anvisa.md) nem nos Dizeres de
// Rotulagem. Aquilo era verdade sobre AQUELES DOIS ARQUIVOS e falso sobre a
// realidade: ninguém tinha ido à fonte primária.
//
// A RDC 243/2018 existe, está VIGENTE e é a norma-mãe desta categoria. Prova
// literal, lida no texto oficial da própria IN 28/2018 (AnvisaLegis):
//
//   "Art. 1º [...] Parágrafo único. Esta Instrução Normativa se aplica de
//    maneira complementar à Resolução RDC nº 243, de 26 de julho, de 2018,
//    que dispõe sobre os requisitos sanitários dos suplementos alimentares."
//
// É exatamente a hierarquia que este arquivo agora reflete: a RDC estabelece
// os requisitos, a IN traz as listas que os detalham.
//
// A própria RDC 243/2018 também amarra as normas de rotulagem à categoria, e
// isso foi lido literalmente no texto dela (art. 15): "A rotulagem nutricional
// deve seguir o disposto na Resolução de Diretoria Colegiada - RDC nº 429, de
// 8 de outubro de 2020, e na Instrução Normativa - IN nº 75, de 8 de outubro
// de 2020." É por essa remissão expressa que as duas entram nesta lista.
//
// ===========================================================================
// DUAS NORMAS REVOGADAS QUE ESTAVAM (OU QUASE ENTRARAM) NESTA LISTA
// ===========================================================================
//
// - RDC 240/2018: estava nesta lista como "dispensa de registro". Está
//   REVOGADA desde 22/02/2024 pela RDC 843/2024 (lido no AnvisaLegis, na
//   página da própria 240/2018). Além de revogada, ela nunca foi a norma de
//   dispensa: era um ato que apenas ALTERAVA a ementa e o art. 1º da RDC
//   27/2010 - que também foi revogada pela mesma RDC 843/2024. Saiu da lista.
//   O regime vigente está em REGISTRATION_REGIME, abaixo.
//
// - RDC 26/2015 (alergênicos): candidata avaliada e RECUSADA. Está REVOGADA
//   pela RDC 727/2022, art. 40, inciso V - lido literalmente no PDF oficial
//   da RDC 727/2022 baixado do site da Anvisa. Os alergênicos hoje são
//   tratados dentro da própria RDC 727/2022, que os define no seu art. 3º.
//
// ===========================================================================
// A FRONTEIRA QUE NÃO SE CRUZA
// ===========================================================================
// A declaração institucional (REGULATORY_DECLARATION) e a lista de normas
// dizem QUAL MARCO REGULATÓRIO rege a categoria e sob qual disciplina a
// fábrica trabalha. Nenhuma das duas é, nem substitui, a afirmação de que uma
// fórmula específica foi conferida - essa vive só na seção "Conformidade" do
// dossiê, condicionada a complianceVerifiedAt, produto a produto.
// ===========================================================================

export interface ManufacturerInfo {
  companyName: string;
  cnpj: string;
  address: string;
  pharmacist: string;
  sac: string;
  registrationExemption: string;
}

export const MANUFACTURER_INFO: ManufacturerInfo = {
  // Razão social LITERAL do Comprovante de Inscrição e de Situação Cadastral
  // da Receita Federal, emitido em 24/08/2026: "LEMONCAPS INDUSTRIA E COMERCIO
  // LTDA". O "e" faltava aqui até 14/09/2026, quando o dono forneceu o Cartão
  // CNPJ - era "Lemoncaps Indústria Comércio LTDA", que não é o nome
  // registrado. Grafado com acento e caixa normal porque a Receita imprime
  // tudo em maiúscula sem acento, o que é limitação do formulário e não a
  // grafia da empresa.
  companyName: "Lemoncaps Indústria e Comércio LTDA",
  cnpj: "55.836.075/0001-07",
  address: "Rua Érico Veríssimo, Quadra 05, Lote 10, Santa Cruz, Cuiabá - MT, CEP 78068-190",
  pharmacist: "Anderson C. Barbosa - CRF/MT 5526",
  sac: "sac@lemoncaps.com.br",
  // ATENÇÃO: esta frase é a TRANSCRIÇÃO LITERAL do que está impresso nos
  // Dizeres de Rotulagem oficiais da fábrica. Ela é reproduzida como dado de
  // rótulo (o que o produto diz), nunca como afirmação nossa de qual norma
  // está em vigor - porque a RDC 240/2018 citada nela foi revogada em
  // 22/02/2024 pela RDC 843/2024. Mudar o texto do rótulo é decisão do dono
  // com o farmacêutico responsável, não deste arquivo. O regime realmente
  // vigente é o de REGISTRATION_REGIME, e é ele que a página /documentacao
  // apresenta.
  registrationExemption: "Produto dispensado de registro conforme RDC nº 240/2018.",
};

// ---------------------------------------------------------------------------
// LICENÇAS E HABILITAÇÕES DA FÁBRICA
// ---------------------------------------------------------------------------
// O comentário de topo de app/documentacao/page.tsx dizia, desde 13/09/2026,
// que licença sanitária e alvará de funcionamento "entram quando o dono passar
// o documento". Ele passou os três em 14/09/2026, e são estes.
//
// PROCEDÊNCIA: cada campo abaixo foi lido no PDF do próprio documento oficial,
// nesta data. Nada veio de memória, de cadastro interno ou do site.
//
// O QUE NÃO ENTRA, POR DECISÃO DE 14/09/2026 - a página é pública:
// - O PDF em si. Decidido publicar o DADO VERIFICÁVEL e não o arquivo, mesmo
//   padrão que a página já usa com as normas (linka o AnvisaLegis em vez de
//   copiar o texto). Os documentos inteiros carregam e-mail financeiro da
//   empresa, telefones, nome e CPF parcial do responsável legal, assinaturas
//   digitalizadas de servidores municipais, inscrição estadual, inscrição
//   imobiliária e registro na Junta Comercial. E-mail financeiro em página
//   pública é alvo de fraude de boleto.
// - A chave de acesso do alvará sanitário. Ela consta do rodapé do PDF e
//   REIMPRIME o documento para quem a tiver. Por isso a verificação aponta o
//   sistema da vigilância de MT sem a chave: quem precisa conferir pede o
//   documento e usa o QR code impresso nele.
// - O nome do responsável legal. É dado pessoal e não acrescenta nada ao
//   comprador; o responsável TÉCNICO aparece porque é ele quem assina a
//   produção, e já está em MANUFACTURER_INFO.
//
// DIVERGÊNCIAS ENTRE OS PRÓPRIOS DOCUMENTOS OFICIAIS, registradas em
// 14/09/2026 e NÃO resolvidas aqui, porque corrigir cadastro público não é
// tarefa deste arquivo:
// - Data de abertura: o Cartão CNPJ traz 08/07/2024 e o Alvará de Localização
//   traz 05/07/2024. Adotado o da Receita Federal, que é a fonte autoritativa
//   do CNPJ.
// - Logradouro: Cartão CNPJ e Alvará de Localização dizem RUA Érico
//   Veríssimo; o Alvará Sanitário diz AVENIDA. Mantido "Rua", que é o que diz
//   a maioria e o que já constava em MANUFACTURER_INFO.
// - Telefone: o Cartão CNPJ traz (48) 9181-8829, DDD de Santa Catarina, e o
//   Alvará Sanitário traz (65) 99810-1011. Nenhum dos dois é publicado aqui -
//   o canal do comprador é o SAC.
// ---------------------------------------------------------------------------

export interface CompanyLicense {
  /** Nome do documento, como ele se identifica. */
  name: string;
  /** Número tal como impresso. */
  number: string;
  /** Órgão que expediu. */
  issuer: string;
  /** Data de expedição, em dd/mm/aaaa. */
  issuedAt: string;
  /** Validade em dd/mm/aaaa, ou null quando o documento não vence por data. */
  validUntil: string | null;
  /** O que exatamente este documento autoriza. */
  scope: string;
  /** Onde qualquer pessoa confere que o documento existe. */
  verification: string;
}

export const COMPANY_LICENSES: readonly CompanyLicense[] = [
  {
    name: "Alvará Sanitário de Cuiabá",
    number: "20705.318674.2026",
    issuer: "Secretaria Municipal de Saúde de Cuiabá — Coordenadoria de Vigilância Sanitária",
    issuedAt: "10/09/2026",
    validUntil: "10/09/2027",
    scope:
      "Autoriza a fabricação de alimentos dietéticos, complementos alimentares e semelhantes, sob os CNAE 1099-6/07 e 4729-6/99.",
    verification:
      "A licença é digital e traz QR code de autenticidade, conferível no sistema da Secretaria de Estado de Saúde de Mato Grosso.",
  },
  {
    name: "Alvará de Localização e Funcionamento",
    number: "CM 290237",
    issuer: "Prefeitura Municipal de Cuiabá",
    issuedAt: "27/01/2026",
    validUntil: null,
    scope:
      "Autoriza o funcionamento do estabelecimento no endereço licenciado, com atividade principal 1099-6/07, em área de 50 m².",
    verification: "Autenticidade confirmável em www.cuiaba.mt.gov.br/taxas.",
  },
  {
    name: "Inscrição no CNPJ",
    number: "55.836.075/0001-07",
    issuer: "Receita Federal do Brasil",
    issuedAt: "24/08/2026",
    validUntil: null,
    scope:
      "Situação cadastral ATIVA desde 08/07/2024, com atividade econômica principal 10.99-6-07 — fabricação de alimentos dietéticos e complementos alimentares.",
    verification: "Conferível pelo número na consulta pública de CNPJ da Receita Federal.",
  },
] as const;

// ---------------------------------------------------------------------------
// DECLARAÇÃO INSTITUCIONAL - o que a Lemon Caps afirma sobre si mesma.
// ---------------------------------------------------------------------------
// Pedido do dono, 13/09/2026: o marco regulatório deixa de ser uma lista de
// alterações normativas e passa a ser uma declaração de postura, na voz da
// empresa, que um comprador entenda. As normas continuam - como lastro, não
// como conteúdo principal.
//
// Cada afirmação abaixo tem lastro conferido: os limites mínimo e máximo são
// os dos Anexos III e IV da IN 28/2018; o responsável técnico é o CRF
// registrado nos Dizeres de Rotulagem da fábrica. Nenhuma fala em
// certificação (BPF, ISO, HACCP) porque nenhuma está confirmada em documento.
export const REGULATORY_DECLARATION = {
  headline: "A Lemon Caps fabrica dentro da norma sanitária brasileira",
  intro:
    "Suplemento alimentar é categoria regulada pela Anvisa, e a fábrica trabalha sob essa disciplina em cada lote que produz.",
  statements: [
    {
      title: "Limites mínimos e máximos respeitados",
      text: "A Anvisa fixa, para cada constituinte de suplemento alimentar, uma quantidade mínima e uma quantidade máxima por dose diária. A Lemon Caps formula dentro dessa faixa.",
    },
    {
      title: "Legislação sanitária vigente",
      text: "A fábrica acompanha e cumpre as Resoluções e as Instruções Normativas da Anvisa aplicáveis a suplementos alimentares, e opera sob fiscalização da vigilância sanitária.",
    },
    {
      title: "Responsável técnico farmacêutico",
      text: `Toda a produção sai sob responsabilidade técnica do farmacêutico ${MANUFACTURER_INFO.pharmacist}.`,
    },
  ],
  // Esta ressalva é obrigatória e não sai. Ela é o que impede a declaração
  // institucional de ser lida como se fosse o selo de conformidade por
  // produto - que é individual, tem data e depende de complianceVerifiedAt.
  boundary:
    "Esta é a disciplina sob a qual a fábrica trabalha. A conferência da composição é feita produto a produto: quando uma fórmula foi conferida contra as listas da norma, ela recebe o selo \"Composição conferida\" no dossiê, com a data da conferência.",
} as const;

// Regime de regularização VIGENTE para suplemento alimentar, conferido em
// 13/09/2026 nos textos oficiais da RDC 843/2024 e da IN 281/2024:
//
//   RDC 843/2024, art. 3º: "A regularização de alimentos e embalagens deve ser
//   realizada previamente à sua oferta por meio dos seguintes procedimentos:
//   I - registro [...] no caso das categorias listadas no Anexo I da IN nº 281
//   [...]; II - notificação [...] no caso das categorias listadas no Anexo II
//   da IN nº 281 [...]"
//
//   IN 281/2024, ANEXO II - "CATEGORIAS DE ALIMENTOS E EMBALAGENS COM
//   OBRIGATORIEDADE DE NOTIFICAÇÃO JUNTO À ANVISA", item 8: "Suplementos
//   alimentares".
//
// Ou seja: suplemento alimentar é dispensado de REGISTRO, mas está sujeito a
// NOTIFICAÇÃO junto à Anvisa. Não é "dispensado de tudo" - e o Anexo IV, que
// lista as categorias dispensadas de qualquer regularização, não inclui
// suplementos.
export const REGISTRATION_REGIME = {
  headline: "Notificação junto à Anvisa, não registro",
  detail:
    "Suplemento alimentar é dispensado de registro sanitário prévio, mas está sujeito a notificação junto à Anvisa antes de ser ofertado. É o que determinam a RDC nº 843/2024 e a IN nº 281/2024.",
} as const;

export type RegulatoryTier = "resolucao" | "instrucao";

export interface RegulatoryFrameworkItem {
  /** Identificação da norma, como o AnvisaLegis a nomeia. */
  norm: string;
  /** Data do ato, no formato brasileiro. */
  date: string;
  /** "resolucao" (RDC: estabelece requisitos) ou "instrucao" (IN: detalha). */
  tier: RegulatoryTier;
  /** Ementa LITERAL, copiada do cabeçalho oficial do ato. Uma linha. */
  summary: string;
  /** O que ela rege, em poucas palavras. Redação nossa, sem jargão de anexo. */
  scope: string;
  /** Selo de vigência exibido pelo AnvisaLegis na página da norma. */
  status: string;
  /**
   * Link para o texto oficial do ato no AnvisaLegis. Verificado individualmente
   * em 14/09/2026 - ver o bloco "O CAMPO `url`" acima de REGULATORY_RESOLUTIONS
   * para a procedência e para as duas armadilhas de parâmetro que este campo
   * NUNCA deve ter "corrigidas" por padronização (orgao de RDC x IN; seqAto da
   * RDC 727/2022).
   */
  url: string;
  /**
   * Compatibilidade com o texto corrido dos PDFs e das listas antigas, que
   * imprimem "norma - description". Preenchido a partir de summary/scope.
   */
  description: string;
}

type RawItem = Omit<RegulatoryFrameworkItem, "description">;

/**
 * Frase que diz o alcance da norma, com o verbo que a hierarquia exige: a
 * Resolução REGE, a Instrução Normativa DETALHA. Não é preciosismo de redação -
 * é a mesma hierarquia que a página afirma em "Como a norma se organiza", e
 * escrever que uma IN "rege" a inverte no exato lugar onde ela é explicada.
 *
 * Vive aqui, e não no componente, porque o texto sai em duas superfícies (a
 * página de documentação e o campo `description`): verbo escolhido em dois
 * lugares é verbo que diverge na primeira alteração.
 */
export function regulatoryScopeSentence(item: RawItem): string {
  const verb = item.tier === "resolucao" ? "Rege" : "Detalha";
  return `${verb} ${item.scope}.`;
}

function withDescription(item: RawItem): RegulatoryFrameworkItem {
  return { ...item, description: `${item.summary} (${regulatoryScopeSentence(item)})` };
}

// ---------------------------------------------------------------------------
// O CAMPO `url` - LINK PARA O TEXTO OFICIAL NO ANVISALEGIS (14/09/2026)
// ---------------------------------------------------------------------------
// Pedido do dono, 14/09/2026: cada norma citada no site vira link clicável
// para a página da própria norma no AnvisaLegis. As 23 URLs desta lista (6
// RDC + 4 IN da lista principal + 13 IN de alteração, em REGULATORY_AMENDMENTS
// mais abaixo) foram abertas UMA A UMA e conferidas nesta mesma tarefa - mesmo
// método de exatidão do resto deste arquivo: nenhuma URL saiu de memória, de
// padrão adivinhado nem de composição própria a partir do número da norma.
//
// Duas armadilhas de parâmetro que já custaram falha e que este arquivo NUNCA
// deve "corrigir" por padronização:
//
// 1. O parâmetro `orgao` NÃO é igual para as duas famílias de ato: Resolução
//    (RDC) usa "RDC/DC/ANVISA/MS" e Instrução Normativa (IN) usa "DC/ANVISA/MS"
//    (sem o "RDC/" na frente). São valores de cadastro DIFERENTES no
//    AnvisaLegis para cada família de ato - não é inconsistência para
//    uniformizar entre as duas listas.
// 2. A RDC nº 727/2022 usa `seqAto=002`; toda outra norma desta lista usa
//    `seqAto=000`. Não é erro de digitação: é o número de sequência do ATO
//    dentro do cadastro daquela norma específica no AnvisaLegis, e normalizar
//    para "000" quebra exatamente este link.
//
// A URL também NÃO pode ser encurtada removendo `cod_menu`, `cod_modulo` ou
// `pesquisa=true`: testado nesta mesma tarefa - a versão curta devolve a
// página institucional genérica do AnvisaLegis, nunca o texto do ato. Por
// isso cada `url` abaixo está completa, com todos os parâmetros, exatamente
// como verificada.
// ---------------------------------------------------------------------------
// 1) RESOLUÇÕES (RDC) - as normas que ESTABELECEM os requisitos sanitários.
//    Vêm primeiro porque são o topo da hierarquia: uma Instrução Normativa
//    sozinha não autoriza insumo nenhum, ela detalha o que a Resolução manda.
// ---------------------------------------------------------------------------
// `satisfies RawItem[]` e não uma anotação de tipo: o literal precisa de
// contexto para inferir `tier` como RegulatoryTier em vez de string, e ao
// mesmo tempo o array já sai daqui mapeado para RegulatoryFrameworkItem.
export const REGULATORY_RESOLUTIONS: RegulatoryFrameworkItem[] = (
  [
  {
    norm: "RDC Anvisa nº 243/2018",
    date: "26/07/2018",
    tier: "resolucao",
    summary: "Dispõe sobre os requisitos sanitários dos suplementos alimentares.",
    scope: "a norma-mãe da categoria",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000243&seqAto=000&valorAno=2018&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "RDC Anvisa nº 843/2024",
    date: "22/02/2024",
    tier: "resolucao",
    summary:
      "Dispõe sobre a regularização de alimentos e embalagens sob competência do Sistema Nacional de Vigilância Sanitária (SNVS) destinados à oferta no território nacional.",
    scope: "como o produto entra legalmente no mercado",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000843&seqAto=000&valorAno=2024&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "RDC Anvisa nº 727/2022",
    date: "01/07/2022",
    tier: "resolucao",
    summary: "Dispõe sobre a rotulagem dos alimentos embalados.",
    scope: "o rótulo, incluindo a declaração de alergênicos",
    status: "Vigente",
    // seqAto=002, e não "000" como todas as outras normas desta lista - ver
    // o bloco "O CAMPO `url`" acima de REGULATORY_RESOLUTIONS. Não normalizar.
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000727&seqAto=002&valorAno=2022&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "RDC Anvisa nº 429/2020",
    date: "08/10/2020",
    tier: "resolucao",
    summary: "Dispõe sobre a rotulagem nutricional dos alimentos embalados.",
    scope: "a tabela nutricional e a rotulagem frontal",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000429&seqAto=000&valorAno=2020&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "RDC Anvisa nº 778/2023",
    date: "01/03/2023",
    tier: "resolucao",
    summary:
      "Dispõe sobre os princípios gerais, as funções tecnológicas e as condições de uso de aditivos alimentares e coadjuvantes de tecnologia em alimentos.",
    scope: "os aditivos da fórmula",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000778&seqAto=000&valorAno=2023&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "RDC Anvisa nº 725/2022",
    date: "01/07/2022",
    tier: "resolucao",
    summary: "Dispõe sobre os aditivos alimentares aromatizantes.",
    scope: "os aromatizantes",
    status: "Vigente",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000725&seqAto=000&valorAno=2022&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  ] satisfies RawItem[]
).map(withDescription);

// ---------------------------------------------------------------------------
// 2) INSTRUÇÕES NORMATIVAS (IN) - o DETALHAMENTO. Cada uma existe para dar
//    corpo a uma Resolução: é aqui que moram as listas de constituintes
//    autorizados e os limites mínimo e máximo por dose.
// ---------------------------------------------------------------------------
export const REGULATORY_INSTRUCTIONS: RegulatoryFrameworkItem[] = (
  [
  {
    norm: "IN Anvisa nº 28/2018",
    date: "26/07/2018",
    tier: "instrucao",
    summary:
      "Estabelece as listas de constituintes, de limites de uso, de alegações e de rotulagem complementar dos suplementos alimentares.",
    scope: "a RDC nº 243/2018, com os limites mínimo e máximo por dose diária",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 281/2024",
    date: "22/02/2024",
    tier: "instrucao",
    summary:
      "Estabelece a forma de regularização das diferentes categorias de alimentos e embalagens, e a respectiva documentação que deve ser apresentada.",
    scope: "a RDC nº 843/2024",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000281&seqAto=000&valorAno=2024&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 75/2020",
    date: "08/10/2020",
    tier: "instrucao",
    summary:
      "Estabelece os requisitos técnicos para declaração da rotulagem nutricional nos alimentos embalados.",
    scope: "a RDC nº 429/2020",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000075&seqAto=000&valorAno=2020&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 211/2023",
    date: "01/03/2023",
    tier: "instrucao",
    summary:
      "Estabelece as funções tecnológicas, os limites máximos e as condições de uso para os aditivos alimentares e os coadjuvantes de tecnologia autorizados para uso em alimentos.",
    scope: "a RDC nº 778/2023",
    status: "Vigente com alterações",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000211&seqAto=000&valorAno=2023&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  ] satisfies RawItem[]
).map(withDescription);

// União das duas listas, na ordem hierárquica (Resoluções e depois Instruções
// Normativas). É o que as superfícies antigas já consumiam - o dossiê web, o
// PDF do dossiê, o PDF do orçamento e a página de fabricação.
export const REGULATORY_FRAMEWORK: RegulatoryFrameworkItem[] = [
  ...REGULATORY_RESOLUTIONS,
  ...REGULATORY_INSTRUCTIONS,
];

export interface RegulatoryAmendment {
  norm: string;
  date: string;
  /**
   * Link para o texto oficial no AnvisaLegis - mesma procedência e mesma
   * regra de URL completa (nunca encurtada) da lista principal. Ver o bloco
   * "O CAMPO `url`" acima de REGULATORY_RESOLUTIONS.
   */
  url: string;
}

// ---------------------------------------------------------------------------
// 3) HISTÓRICO DE ALTERAÇÕES DA IN 28/2018
// ---------------------------------------------------------------------------
// Decisão de 13/09/2026, por ordem do dono: aqui ficam SÓ número e data.
// A versão anterior descrevia o que cada alteração mudou ("incluiu o limite de
// boro, silício, MSM...") e isso é registro técnico de alteração normativa -
// não interessa ao comprador e transformava a seção em nota de rodapé de
// legislação.
//
// Estas treze Instruções Normativas não são normas autônomas: cada uma existe
// só para acrescentar ou mudar uma linha das listas da IN 28/2018 e se exaure
// nesse ato. Quem lê a IN 28/2018 consolidada hoje já está lendo o resultado
// de todas elas. Ficam recolhidas nas superfícies, como lastro de que a
// fábrica acompanha a norma viva - treze atualizações em oito anos.
//
// Cada número e cada data foi conferido abrindo a página da própria norma no
// AnvisaLegis em 13/09/2026 - não a lista resumida de um terceiro. QUATRO
// delas não constavam do catálogo até hoje e entraram nesta tarefa:
// IN 275/2024, IN 284/2024, IN 361/2025 e IN 431/2026.
export const REGULATORY_AMENDMENTS: RegulatoryAmendment[] = [
  {
    norm: "IN Anvisa nº 76/2020",
    date: "05/11/2020",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000076&seqAto=000&valorAno=2020&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 102/2021",
    date: "15/10/2021",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000102&seqAto=000&valorAno=2021&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 275/2024",
    date: "21/02/2024",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000275&seqAto=000&valorAno=2024&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 284/2024",
    date: "07/03/2024",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000284&seqAto=000&valorAno=2024&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 304/2024",
    date: "26/06/2024",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000304&seqAto=000&valorAno=2024&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 318/2024",
    date: "19/09/2024",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000318&seqAto=000&valorAno=2024&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 336/2024",
    date: "28/11/2024",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000336&seqAto=000&valorAno=2024&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 361/2025",
    date: "14/05/2025",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000361&seqAto=000&valorAno=2025&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 373/2025",
    date: "05/06/2025",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000373&seqAto=000&valorAno=2025&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 418/2025",
    date: "18/12/2025",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000418&seqAto=000&valorAno=2025&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 431/2026",
    date: "01/04/2026",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000431&seqAto=000&valorAno=2026&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 438/2026",
    date: "16/04/2026",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000438&seqAto=000&valorAno=2026&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
  {
    norm: "IN Anvisa nº 450/2026",
    date: "10/06/2026",
    url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000450&seqAto=000&valorAno=2026&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  },
];

// Derivada da lista, nunca digitada: se entrar mais uma alteração, a frase se
// corrige sozinha. É o resumo que aparece no lugar da lista aberta.
const LATEST_AMENDMENT = REGULATORY_AMENDMENTS[REGULATORY_AMENDMENTS.length - 1];
export const REGULATORY_CONSOLIDATION_NOTE = `A IN 28/2018 é atualizada periodicamente pela Anvisa. O texto que a fábrica acompanha está consolidado até a ${LATEST_AMENDMENT.norm}, de ${LATEST_AMENDMENT.date}.`;

// Fonte oficial de TODAS as normas listadas acima. O AnvisaLegis é o portal de
// legislação consolidada da Anvisa: o endereço institucional
// https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao
// redireciona para ele. Cada norma deste arquivo foi aberta individualmente lá
// em 13/09/2026, e a ementa foi copiada do cabeçalho do próprio ato.
export const REGULATORY_SOURCE = {
  label: "AnvisaLegis - portal de legislação consolidada da Anvisa",
  url: "https://anvisalegis.datalegis.net/",
  consultedAtLabel: "13/09/2026",
};

// Explicação da hierarquia, para o comprador que não conhece a diferença. Sai
// na página /documentacao e é o argumento que sustenta a ordem das listas.
export const REGULATORY_HIERARCHY_NOTE =
  "A Resolução da Diretoria Colegiada (RDC) é a norma que estabelece os requisitos sanitários da categoria; a Instrução Normativa (IN) é o ato que detalha a Resolução e carrega as listas - constituintes autorizados, limites de uso por dose e alegações permitidas. Nenhuma Instrução Normativa autoriza um insumo sozinha: ela detalha a Resolução que a sustenta.";

// Nota geral do rodapé do catálogo (/catalogo, ver CatalogView.tsx). Texto
// sóbrio e honesto pedido pelo dono: explica o critério do selo sem alarmar e
// SEM sugerir que todo produto do catálogo está conforme (a maioria não tem
// o selo - ver lemoncaps-catalogo-planejamento/conformidade-anvisa.md, seção
// 6: 10 conformes, 4 acima do limite, 14 com insumo não verificado, de 28).
//
// A frase cita a RDC 243/2018 antes da IN 28/2018 para acompanhar a hierarquia
// do resto do arquivo, mas continua dizendo o que foi conferido DE FATO: os
// nutrientes com limite, contra as listas da IN. Citar a Resolução não amplia
// a afirmação de conformidade - a Resolução é só o que dá base à lista.
export const CATALOG_FOOTER_COMPLIANCE_NOTE = `Produtos com o selo "Composição conferida" tiveram os nutrientes com limite estabelecido conferidos, um a um, contra as listas da IN 28/2018 (Anvisa) e suas alterações - o ato que detalha a RDC 243/2018, norma que fixa os requisitos sanitários dos suplementos alimentares. A conferência é contra o texto vigente da norma em ${REGULATORY_SOURCE.consultedAtLabel}. Extratos vegetais (ex.: cúrcuma, laranja moro, feno-grego) têm limite definido pelo marcador ativo - curcuminoides, antocianinas etc. - e dependem de laudo de padronização do fornecedor para entrar nessa conferência. Por isso nem todo produto deste catálogo tem o selo.`;

const COMPLIANCE_DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Cuiaba",
});

// formula.complianceVerifiedAt vem como string ISO (timestamptz do Postgres,
// serializado pelo supabase-js) ou null. Formata para o padrão brasileiro
// (dd/mm/aaaa) sem depender de fuso do navegador do visitante - a data que
// importa é a de Cuiabá-MT, onde a fábrica e a auditoria estão.
export function formatComplianceDate(isoDate: string): string {
  return COMPLIANCE_DATE_FORMATTER.format(new Date(isoDate));
}
