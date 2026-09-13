// Informação institucional e regulatória exibida em TODO dossiê técnico
// (/catalogo/[slug] e o PDF gerado em lib/catalog/dossie-pdf.ts), independente
// de a fórmula ter ou não o selo de conformidade (esse é individual, por
// fórmula, e vem do banco - ver FormulaDTO.complianceVerifiedAt). Este arquivo
// é conteúdo fixo (mesmo texto em todo produto), por isso não mora no banco.
//
// REGRA DE EXATIDÃO: nada aqui é estimado ou parafraseado livremente - cada
// dado tem procedência conferida:
//
// - MANUFACTURER_INFO: lido de
//   /Users/diegofrancisco/Desktop/POPS/19_SISTEMA_MEMORIAIS/DRT_GUMMY_CREATINA.html
//   (Dizeres de Rotulagem oficiais da fábrica, painel "Painel Lateral
//   Direito"), conferido linha a linha em 12/09/2026. Fonte primária da
//   própria fábrica, não resumo de terceiro.
// - REGULATORY_FRAMEWORK: cada entrada copiada da coluna "Norma" da Tabela 1
//   de lemoncaps-catalogo-planejamento/conformidade-anvisa.md (auditoria
//   ANVISA, consulta em 12/09/2026, fontes AnvisaLegis + LegisWeb cruzadas) -
//   nunca inventado. O item RDC 240/2018 vem do próprio DRT (frase "Produto
//   dispensado de registro conforme RDC nº 240/2018."), não do arquivo de
//   auditoria.
//
// NOTA IMPORTANTE (achado desta tarefa): o pedido original citava "RDC
// 243/2018" como exemplo de norma a incluir aqui. Conferido com grep no
// arquivo de auditoria inteiro: essa referência NÃO aparece em lugar nenhum
// dele. Também não aparece no DRT. Por isso "RDC 243/2018" NÃO entra nesta
// lista - só o que as duas fontes realmente citam (IN 28/2018 e as
// Instruções Normativas que a alteraram, mais a RDC 240/2018 do DRT).
//
// Citar uma norma aqui é informação de marco regulatório, NUNCA uma afirmação
// de que esta fórmula específica cumpre aquela norma - essa afirmação só
// existe na seção "Conformidade" (condicional a complianceVerifiedAt) da
// página do dossiê, nunca neste bloco.

export interface ManufacturerInfo {
  companyName: string;
  cnpj: string;
  address: string;
  pharmacist: string;
  sac: string;
  registrationExemption: string;
}

export const MANUFACTURER_INFO: ManufacturerInfo = {
  companyName: "Lemoncaps Indústria Comércio LTDA",
  cnpj: "55.836.075/0001-07",
  address: "Rua Érico Veríssimo, Quadra 05, Lote 10, Santa Cruz, Cuiabá - MT, CEP 78068-190",
  pharmacist: "Anderson C. Barbosa - CRF/MT 5526",
  sac: "sac@lemoncaps.com.br",
  registrationExemption: "Produto dispensado de registro conforme RDC nº 240/2018.",
};

export interface RegulatoryFrameworkItem {
  norm: string;
  description: string;
}

// Ordem cronológica (norma-base primeiro, depois as alterações por data).
export const REGULATORY_FRAMEWORK: RegulatoryFrameworkItem[] = [
  {
    norm: "IN Anvisa nº 28/2018",
    description:
      "Norma-base: Anexo III (limites mínimos) e Anexo IV (limites máximos) de vitaminas, minerais e outras substâncias por dose diária em suplementos alimentares.",
  },
  {
    norm: "IN Anvisa nº 76/2020, de 05/11/2020",
    description:
      "Incluiu no Anexo IV os limites de boro, silício, metilsulfonilmetano (MSM), L-carnitina, taurina, colágeno tipo II não desnaturado, inositol e ácido hialurônico/hialuronato; alterou a redação do limite máximo do ácido fólico.",
  },
  {
    norm: "IN Anvisa nº 102/2021, de 15/10/2021",
    description:
      "Incluiu os limites de melatonina (uso restrito a maiores de 19 anos), colágeno hidrolisado, beta-alanina e curcumina; ajustou a redação do limite máximo de silício, do mínimo de ácido hialurônico/hialuronato e a nomenclatura do mínimo do ácido fólico.",
  },
  {
    norm: "IN Anvisa nº 304/2024, de 26/06/2024",
    description: "Incluiu o limite de glucosamina.",
  },
  {
    norm: "IN Anvisa nº 318/2024, de 19/09/2024",
    description: "Incluiu o limite de teanina (L-teanina); alterou o limite de EPA e DHA combinados.",
  },
  {
    norm: "IN Anvisa nº 336/2024, de 28/11/2024",
    description: "Incluiu e alterou o limite de antocianinas da laranja moro.",
  },
  {
    norm: "IN Anvisa nº 373/2025, de 05/06/2025",
    description:
      "Elevou o limite máximo de creatina monoidratada de 3.000 mg para 5.000 mg por dose diária (retificada no DOU nº 113/2025 e no DOU nº 121/2025).",
  },
  {
    norm: "IN Anvisa nº 418/2025, de 18/12/2025",
    description: "Alterou o limite máximo de vitamina B3 (niacina); incluiu e alterou o limite de quercetina.",
  },
  {
    norm: "IN Anvisa nº 438/2026, de 16/04/2026",
    description: "Alterou os limites de curcumina (curcuminoides totais).",
  },
  {
    norm: "IN Anvisa nº 450/2026, de 10/06/2026",
    description: "Incluiu o extrato fluido de guaraná como fonte autorizada de cafeína.",
  },
  {
    norm: "RDC Anvisa nº 240/2018",
    description:
      'Dispensa este tipo de produto de registro sanitário prévio (base da frase de rotulagem "produto dispensado de registro").',
  },
];

// Mesma fonte primária citada em compliance_source (banco) para as fórmulas
// verificadas - texto consolidado da IN 28/2018, cruzado com LegisWeb (ver
// conformidade-anvisa.md, seção 1).
export const REGULATORY_SOURCE = {
  label: "AnvisaLegis - texto consolidado da IN 28/2018 e alterações",
  url: "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true",
  consultedAtLabel: "12/09/2026",
};

// Nota geral do rodapé do catálogo (/catalogo, ver CatalogView.tsx). Texto
// sóbrio e honesto pedido pelo dono: explica o critério do selo sem alarmar e
// SEM sugerir que todo produto do catálogo está conforme (a maioria não tem
// o selo - ver lemoncaps-catalogo-planejamento/conformidade-anvisa.md, seção
// 6: 10 conformes, 4 acima do limite, 14 com insumo não verificado, de 28).
export const CATALOG_FOOTER_COMPLIANCE_NOTE = `Produtos com o selo "Composição conferida" tiveram os nutrientes com limite estabelecido pela IN 28/2018 (Anvisa) e suas alterações conferidos, um a um, contra o texto vigente da norma em ${REGULATORY_SOURCE.consultedAtLabel}. Extratos vegetais (ex.: cúrcuma, laranja moro, feno-grego) têm limite definido pelo marcador ativo - curcuminoides, antocianinas etc. - e dependem de laudo de padronização do fornecedor para entrar nessa conferência. Por isso nem todo produto deste catálogo tem o selo.`;

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
