// Seções de PDF sobre UMA fórmula, compartilhadas pelo dossiê técnico
// (lib/catalog/dossie-pdf.ts) e pela ficha técnica de cada item dentro do
// orçamento (lib/cart/quote-pdf.ts). Extraídas para este módulo nesta tarefa
// para os dois documentos NUNCA divergirem: um ajuste de texto, cor ou
// condição de exibição feito aqui passa a valer para os dois PDFs ao mesmo
// tempo, só por estarem chamando a mesma função - antes desta tarefa o
// orçamento nem tinha estas seções, e o dossiê as tinha embutidas só nele.
//
// Cada `addXSection` segue a mesma API imperativa de cursor de
// lib/pdf/layout.ts: recebe a posição Y atual e devolve a próxima (é como o
// jsPDF desenha e avança - não existe "documento imutável" aqui). O que nunca
// é mutado é o dado de entrada (a fórmula): estas funções só leem o
// FormulaDetailDTO e devolvem um número.
//
// Cada seção só aparece quando o campo correspondente do DTO tem conteúdo
// real (hasContent / length > 0) - a MESMA regra de exatidão da página web
// (app/catalogo/[slug]/page.tsx) e do dossiê em PDF: campo vazio ou nulo
// nunca vira seção em branco nem "não informado", simplesmente não aparece.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type { FormulaDetailDTO } from "@/lib/data/formulas";
import { composicaoEmTexto, hasContent, lineLabel, stripLeadingBulletMarker } from "@/lib/catalog/format-catalog";
import {
  formatNutritionValorCelula,
  formatNutritionVdCell,
  nutritionPorcaoResumo,
  nutritionVdColumnLabel,
  type NutritionTable,
} from "@/lib/catalog/nutrition-table";
import { buildPackagingFacts } from "@/lib/catalog/packaging";
import { safeExternalUrl } from "@/lib/catalog/safe-url";
import {
  formatComplianceDate,
  MANUFACTURER_INFO,
  REGULATORY_CONSOLIDATION_NOTE,
  REGULATORY_DECLARATION,
  REGULATORY_FRAMEWORK,
  REGULATORY_SOURCE,
} from "@/lib/catalog/regulatory-info";
import {
  addCallout,
  addFactRows,
  addParagraph,
  addSectionTitle,
  readFinalY,
  tableTheme,
  type FactRow,
} from "@/lib/pdf/layout";
import {
  COLOR_ACCENT_BORDER,
  COLOR_ACCENT_TINT,
  COLOR_INK,
  COLOR_LABEL_BLACK,
  COLOR_LABEL_WHITE,
  COLOR_LIME_DEEP,
  COLOR_MUTED,
  COLOR_WARNING,
  COLOR_WARNING_BORDER,
  COLOR_WARNING_TINT,
  FONT_SIZE_CAPTION,
  FONT_SIZE_TABLE,
  LINE_HEIGHT,
  PAGE_MARGIN_X,
} from "@/lib/pdf/theme";

// Seção de texto simples (título + parágrafo): só entra se o campo tiver
// conteúdo real - campo vazio nunca vira seção em branco. Uso interno: cada
// addXSection de texto abaixo (nutricional, ingredientes, modo de uso,
// público-alvo, conservação) é uma casca fina em cima desta função, fixando o
// título e o campo certo do DTO - assim quem monta o documento (dossiê ou
// orçamento) nunca precisa saber qual é o nome do campo por trás de cada
// seção, só chama addNutritionalSection(doc, y, formula) e por aí vai.
function addTextSection(doc: jsPDF, startY: number, title: string, content: string | null): number {
  if (!hasContent(content)) return startY;
  const cursorY = addSectionTitle(doc, startY, title);
  return addParagraph(doc, cursorY, content);
}

function buildIdentityFacts(formula: FormulaDetailDTO): FactRow[] {
  return [
    { label: "Nome", value: formula.name },
    formula.segment ? { label: "Segmento", value: formula.segment.name } : null,
    { label: "Linha", value: lineLabel(formula.line) },
    formula.regulatoryProductType ? { label: "Tipo regulatório", value: formula.regulatoryProductType } : null,
    formula.poteContentsDescription ? { label: "Apresentação", value: formula.poteContentsDescription } : null,
    formula.netWeight ? { label: "Peso líquido", value: formula.netWeight } : null,
  ].filter((fact): fact is FactRow => fact !== null);
}

export function addIdentitySection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  const cursorY = addSectionTitle(doc, startY, "Identificação");
  return addFactRows(doc, cursorY, buildIdentityFacts(formula));
}

// Texto corrido, igual à seção "Ingredientes" (pedido do dono, 23/09/2026) —
// mesma função da página do dossiê. Exibe a massa do insumo como está gravada
// (formatQuantity só troca "." por ","; nunca converte para elemento).
export function addCompositionSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  const cursorY = addSectionTitle(doc, startY, "Composição por dose");
  return addParagraph(doc, cursorY, composicaoEmTexto(formula.compositions) || "Composição não cadastrada.");
}

// Tabela de Informação Nutricional no MODELO VERTICAL oficial da Anvisa (IN
// 75/2020, Anexo XII; RDC 429/2020) - ampliação de escopo pedida pelo dono em
// 16/09/2026, com 2 imagens de referência. MESMAS funções de formatação de
// lib/catalog/nutrition-table.ts que a versão web (components/catalog/
// NutritionTable.tsx) usa - formatNutritionValorCelula, formatNutritionVdCell,
// nutritionPorcaoResumo, nutritionVdColumnLabel - para os dois canais nunca
// divergirem sobre O DADO; a citação literal completa da norma (títulos de
// coluna, ausência de kJ na norma vigente, dispensa da coluna "100 g" para
// suplementos sólidos) está no comentário de topo de NutritionTable.tsx, e
// vale igualmente aqui - não repetida a cada arquivo.
//
// Título, "Porções por embalagem", "Porção", cabeçalho de colunas, grade de
// nutrientes e rodapé formam UMA autoTable só (head com várias linhas +
// colSpan, foot para o rodapé) - é o que dá o efeito de "uma caixa" no PDF
// (jsPDF não tem um <div> com borda que cresça sozinho por cima de uma tabela
// que pagina; a MESMA autoTable já resolve paginação e borda junto). Preto
// sobre branco fixo (COLOR_LABEL_BLACK/COLOR_LABEL_WHITE, nunca COLOR_INK/
// COLOR_LIME_DEEP do resto do documento) - é rotulagem, não a identidade
// visual do dossiê (mesma régua do .lc-nutri-table em app/globals.css).
//
// Indentação por nível (item.nivel) vira espaço literal no início do texto:
// jsPDF desenha texto corrido, não tem padding de CSS por célula.
function addNutritionTableSection(doc: jsPDF, startY: number, table: NutritionTable): number {
  const cursorY = addSectionTitle(doc, startY, "Informação nutricional");

  const totalColunas = 1 + (table.por100 ? 1 : 0) + 1 + table.gruposVd.length;

  const linhaFaixaLarga = (content: string, opts: { negrito?: boolean; centralizado?: boolean; fontSize?: number } = {}) => [
    {
      content,
      colSpan: totalColunas,
      styles: {
        halign: (opts.centralizado ? "center" : "left") as "center" | "left",
        fontStyle: (opts.negrito ? "bold" : "normal") as "bold" | "normal",
        fontSize: opts.fontSize ?? FONT_SIZE_CAPTION,
      },
    },
  ];

  const cabecalhoColunas = [
    "",
    ...(table.por100 ? ["100 g"] : []),
    nutritionPorcaoResumo(table.porcao),
    ...table.gruposVd.map((grupo) => nutritionVdColumnLabel(grupo, table.gruposVd.length)),
  ];

  const columnStyles: NonNullable<Parameters<typeof autoTable>[1]["columnStyles"]> = { 0: { halign: "left" } };
  for (let indiceColuna = 1; indiceColuna < totalColunas; indiceColuna++) {
    columnStyles[indiceColuna] = { halign: "center" };
  }

  autoTable(doc, {
    ...tableTheme(),
    startY: cursorY,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: FONT_SIZE_TABLE,
      cellPadding: 2.6,
      textColor: COLOR_LABEL_BLACK,
      lineColor: COLOR_LABEL_BLACK,
      lineWidth: 0.2,
      fillColor: COLOR_LABEL_WHITE,
    },
    head: [
      linhaFaixaLarga("INFORMAÇÃO NUTRICIONAL", { negrito: true, centralizado: true, fontSize: FONT_SIZE_TABLE + 1 }),
      linhaFaixaLarga(`Porções por embalagem: ${table.porcoesPorEmbalagem}`),
      linhaFaixaLarga(`Porção: ${table.porcao}`),
      cabecalhoColunas,
    ],
    headStyles: { fillColor: COLOR_LABEL_WHITE, textColor: COLOR_LABEL_BLACK, lineColor: COLOR_LABEL_BLACK, lineWidth: 0.2, fontStyle: "bold" },
    alternateRowStyles: {},
    body: table.linhas.map((row) => [
      `${"  ".repeat(row.nivel)}${row.item}${row.unidade ? ` (${row.unidade})` : ""}`,
      ...(table.por100 ? [formatNutritionValorCelula(row.quantidade100)] : []),
      formatNutritionValorCelula(row.quantidade),
      ...table.gruposVd.map((grupo) => formatNutritionVdCell(row, grupo)),
    ]),
    foot: table.rodape ? [linhaFaixaLarga(table.rodape, { fontSize: FONT_SIZE_CAPTION - 1.5 })] : undefined,
    footStyles: { fillColor: COLOR_LABEL_WHITE, textColor: COLOR_LABEL_BLACK, lineColor: COLOR_LABEL_BLACK, lineWidth: 0.2 },
    columnStyles,
    // Linha GROSSA depois de "Porção" (3ª linha do head, índice 2) - Anexo
    // XII do modelo vertical separa o bloco de cabeçalho do grid de
    // nutrientes, mesmo efeito de .lc-nutri-meta-row--divisoria na web.
    didParseCell(data) {
      if (data.section === "head" && data.row.index === 2) {
        data.cell.styles.lineWidth = { top: 0.2, left: 0.2, right: 0.2, bottom: 1.1 };
      }
    },
  });

  return readFinalY(doc, cursorY) + 9;
}

export function addNutritionalSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  if (formula.nutritionTable) return addNutritionTableSection(doc, startY, formula.nutritionTable);
  return addTextSection(doc, startY, "Informação nutricional", formula.nutritionalInfo);
}

export function addIngredientsSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  return addTextSection(doc, startY, "Ingredientes", formula.ingredientsList);
}

export function addUsageSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  return addTextSection(doc, startY, "Modo de uso", formula.usageInstructions);
}

export function addBenefitsSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  if (!hasContent(formula.generalBenefitsSummary) && formula.benefits.length === 0) return startY;

  let cursorY = addSectionTitle(doc, startY, "Benefícios");
  if (hasContent(formula.generalBenefitsSummary)) {
    cursorY = addParagraph(doc, cursorY, formula.generalBenefitsSummary);
  }
  for (const benefit of formula.benefits) {
    // Mesma limpeza da página web (stripLeadingBulletMarker): alguns
    // benefícios já vêm do banco com marcador embutido no texto - sem isso
    // o PDF mostraria marcador duplicado ("- - Contribui..." / "- • Contribui...").
    cursorY = addParagraph(doc, cursorY, stripLeadingBulletMarker(benefit), { prefix: "- " });
  }
  return cursorY;
}

export function addTargetAudienceSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  return addTextSection(doc, startY, "Público-alvo", formula.targetAudience);
}

// Moldura de destaque - informação de segurança, mesma cor de aviso da
// página web (.lc-dossie-warning).
export function addWarningsSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  if (!hasContent(formula.warnings)) return startY;
  let cursorY = addSectionTitle(doc, startY, "Advertências e restrições", COLOR_WARNING);
  cursorY = addCallout(doc, cursorY, [formula.warnings], {
    borderColor: COLOR_WARNING_BORDER,
    fillColor: COLOR_WARNING_TINT,
    textColor: COLOR_WARNING,
  });
  return cursorY;
}

export function addStorageSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  return addTextSection(doc, startY, "Conservação", formula.storageInstructions);
}

// Só quando complianceVerifiedAt não é nulo - AFIRMAÇÃO sobre ESTA fórmula
// específica - nunca confundir com addRegulatoryFrameworkSection abaixo, que
// é igual em todo PDF e não afirma conformidade de ninguém (mesma separação
// da página /catalogo/[slug]: moldura verde de "verificado" aqui, texto
// neutro sem moldura no marco regulatório).
export function addComplianceSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  if (!formula.complianceVerifiedAt) return startY;

  let cursorY = addSectionTitle(doc, startY, "Conformidade", COLOR_LIME_DEEP);
  const complianceParagraphs = [
    `Composição conferida contra os limites vigentes da ANVISA em ${formatComplianceDate(formula.complianceVerifiedAt)}.`,
    `Normas conferidas: ${formula.complianceNorms.join(", ")}.`,
  ];
  cursorY = addCallout(doc, cursorY, complianceParagraphs, {
    borderColor: COLOR_ACCENT_BORDER,
    fillColor: COLOR_ACCENT_TINT,
    textColor: COLOR_INK,
  });

  // A URL crua NÃO entra no corpo do texto. Medido no PDF de teste (orçamento
  // nº 6, 13/09/2026): o endereço do portal da ANVISA tem 214 caracteres e
  // quebrava em três linhas ilegíveis dentro da moldura verde - num documento
  // que vai ao cliente isso lê como defeito de diagramação. Mas tirar o
  // endereço e não pôr nada no lugar custaria a procedência, que é regra deste
  // projeto: quem recebe tem de conseguir chegar à fonte. Então o endereço
  // vira link clicável sob uma frase curta, como a página web já faz.
  const fonteConsultada = safeExternalUrl(formula.complianceSource);
  if (fonteConsultada) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SIZE_CAPTION);
    const rotulo = "Fonte consultada: texto consolidado da norma no portal da ANVISA.";
    const larguraTexto = doc.getTextWidth(rotulo);
    cursorY = addParagraph(doc, cursorY, rotulo, {
      fontSize: FONT_SIZE_CAPTION,
      color: COLOR_MUTED,
    });
    // A âncora do link sai do cursor DEPOIS de desenhar, não antes: quando a
    // linha não cabe no resto da página, addParagraph vira a folha e escreve
    // no topo da seguinte - foi o que aconteceu com o segundo produto do
    // orçamento de teste nº 7. Medindo antes, o link ficava preso na página
    // anterior. Como este rótulo é sempre uma única linha (texto fixo, curto),
    // recuar uma altura de linha a partir do cursor final acerta a baseline
    // real nos dois casos, com ou sem quebra de página.
    doc.link(
      PAGE_MARGIN_X,
      cursorY - LINE_HEIGHT - FONT_SIZE_CAPTION * 0.36,
      larguraTexto,
      FONT_SIZE_CAPTION * 0.5,
      { url: fonteConsultada },
    );
  }
  return cursorY;
}

// Especificação de embalagem e logística: EAN-13, DUN-14, validade, peso e
// dimensões da unidade e da caixa (migration 20260916000000). É o que o
// comprador profissional usa para calcular frete, montar palete e dimensionar
// estoque - sem isso uma cotação grande trava.
//
// As linhas saem de buildPackagingFacts (lib/catalog/packaging.ts), a MESMA
// função que a página /catalogo/[slug] usa: os três canais (web, dossiê em PDF
// e ficha dentro do orçamento) mostram exatamente as mesmas linhas, com os
// mesmos rótulos e as mesmas unidades. Nenhum campo preenchido = seção
// inteira omitida, nunca uma tabela de "não informado".
export function addPackagingSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  const facts = buildPackagingFacts(formula);
  if (facts.length === 0) return startY;

  const cursorY = addSectionTitle(doc, startY, "Especificação de embalagem e logística");
  return addFactRows(doc, cursorY, facts);
}

// Assinatura da ficha técnica pelo responsável técnico
// (public.formula_sheet_approvals). Vem logo depois de "Conformidade" porque é
// o complemento dela: a conformidade diz QUANDO a composição foi conferida
// contra a norma; a assinatura diz QUEM respondeu por essa ficha, com qual
// registro profissional e em que versão. Ficha sem aprovação nenhuma não gera
// seção - nunca "sem responsável técnico", que se leria como denúncia.
//
// A aprovação mais recente é a vigente e vai na moldura; as anteriores ficam
// listadas abaixo, em corpo pequeno. Registro histórico: aprovação não se
// edita nem se apaga, aprovar de novo cria linha nova - por isso o documento
// mostra a fila inteira, não só a última.
export function addSheetApprovalSection(doc: jsPDF, startY: number, formula: FormulaDetailDTO): number {
  const [vigente, ...anteriores] = formula.sheetApprovals;
  if (!vigente) return startY;

  let cursorY = addSectionTitle(doc, startY, "Assinatura da ficha técnica", COLOR_LIME_DEEP);
  cursorY = addCallout(
    doc,
    cursorY,
    [
      `Ficha técnica versão ${vigente.sheetVersion}, aprovada em ${formatComplianceDate(vigente.approvedAt)}.`,
      `Responsável técnico: ${vigente.approvedByName} - ${vigente.approvedByLicense}.`,
    ],
    {
      borderColor: COLOR_ACCENT_BORDER,
      fillColor: COLOR_ACCENT_TINT,
      textColor: COLOR_INK,
    },
  );

  if (anteriores.length > 0) {
    cursorY = addParagraph(doc, cursorY, "Aprovações anteriores:", { fontSize: FONT_SIZE_CAPTION, color: COLOR_MUTED });
  }
  for (const anterior of anteriores) {
    cursorY = addParagraph(
      doc,
      cursorY,
      `Versão ${anterior.sheetVersion}, aprovada em ${formatComplianceDate(anterior.approvedAt)} por ${anterior.approvedByName} - ${anterior.approvedByLicense}.`,
      { prefix: "- ", fontSize: FONT_SIZE_CAPTION, color: COLOR_MUTED },
    );
  }

  return cursorY;
}

// Bloco institucional FIXO (conteúdo igual em todo PDF, não depende da
// fórmula). Mesma ordem da página web desde 13/09/2026: primeiro a DECLARAÇÃO
// do que a fábrica cumpre, depois as normas como lastro - as Resoluções (que
// estabelecem os requisitos) antes das Instruções Normativas (que as
// detalham).
//
// O parágrafo `boundary` é obrigatório e não sai daqui: declarar que a fábrica
// respeita os limites da norma NÃO é afirmar que esta fórmula foi conferida.
// Essa afirmação só existe em addComplianceSection, acima, e depende de
// complianceVerifiedAt.
export function addRegulatoryFrameworkSection(doc: jsPDF, startY: number): number {
  let cursorY = addSectionTitle(doc, startY, REGULATORY_DECLARATION.headline, COLOR_MUTED);
  cursorY = addParagraph(doc, cursorY, REGULATORY_DECLARATION.intro);

  for (const statement of REGULATORY_DECLARATION.statements) {
    cursorY = addParagraph(doc, cursorY, `${statement.title}: ${statement.text}`, { prefix: "- " });
  }

  cursorY = addParagraph(doc, cursorY, REGULATORY_DECLARATION.boundary, {
    fontSize: FONT_SIZE_CAPTION,
    color: COLOR_MUTED,
  });

  cursorY = addParagraph(doc, cursorY, "Normas que a fábrica segue:");
  for (const item of REGULATORY_FRAMEWORK) {
    cursorY = addParagraph(doc, cursorY, `${item.norm}, de ${item.date} - ${item.summary}`, {
      prefix: "- ",
      fontSize: FONT_SIZE_CAPTION,
    });
  }

  cursorY = addParagraph(doc, cursorY, REGULATORY_CONSOLIDATION_NOTE, {
    fontSize: FONT_SIZE_CAPTION,
    color: COLOR_MUTED,
  });
  cursorY = addParagraph(
    doc,
    cursorY,
    `Fonte: ${REGULATORY_SOURCE.label}, consultada em ${REGULATORY_SOURCE.consultedAtLabel}.`,
    { fontSize: FONT_SIZE_CAPTION, color: COLOR_MUTED },
  );
  return cursorY;
}

// Bloco institucional FIXO (rodapé de responsabilidade técnica) - mesmo texto
// em todo PDF, lido de lib/catalog/regulatory-info.ts e nunca redigitado.
export function addManufacturerSection(doc: jsPDF, startY: number): number {
  const cursorY = addSectionTitle(doc, startY, "Fabricante e responsabilidade técnica", COLOR_MUTED);
  return addParagraph(
    doc,
    cursorY,
    `Fabricado e envasado por ${MANUFACTURER_INFO.companyName}, CNPJ ${MANUFACTURER_INFO.cnpj}.\n${MANUFACTURER_INFO.address}.\nFarmacêutico responsável: ${MANUFACTURER_INFO.pharmacist}.\n${MANUFACTURER_INFO.registrationExemption}\nSAC: ${MANUFACTURER_INFO.sac}`,
    { fontSize: FONT_SIZE_CAPTION, color: COLOR_MUTED },
  );
}
