// Tabela de Informação Nutricional estruturada (RDC 429/2020 + IN 75/2020),
// lida de formulas.metadata (jsonb) -> chave "tabela_nutricional". Até esta
// tarefa, a informação nutricional só existia como texto livre
// (formulas.nutritional_info) - este módulo é a "tabela de verdade": tipo,
// validação e as funções de formatação que o dossiê web (NutritionTable.tsx)
// e o dossiê em PDF (lib/pdf/formula-sections.ts) reaproveitam OS DOIS, para
// nunca divergir entre si (mesmo princípio de lib/catalog/packaging.ts e de
// lib/pdf/formula-sections.ts para o resto do dossiê).
//
// PROCEDÊNCIA DO FORMATO (conferido em 16/09/2026, na fonte, não de memória):
//   - docs/conformidade/dados-2026-09-16/fase2/<slug>.json (24 arquivos,
//     campo "tabela_nutricional") e
//   - supabase/migrations/20260922000000_reformulacao_conforme_normas.sql
//     (EM DISCO, marcada "NÃO APLICAR" no cabeçalho do próprio arquivo)
// concordam nos MESMOS nomes de campo usados no schema abaixo (item, nivel,
// quantidade, unidade, vd_pct, nota, provisorio, grupos_vd, rodape) para as
// 24 fórmulas. Esses nomes diferem do esboço verbal recebido para esta
// tarefa (que citava "colunas_vd", "vd", "provisoria", "observacoes") - o
// esboço era só uma aproximação do formato, e a regra do projeto é definir o
// tipo a partir do dado real, não da paráfrase. Peculiaridades reais
// confirmadas nos 24 registros (não suposição):
//   - porcoes_por_embalagem sempre chega como STRING ("30"), nunca número;
//   - quantidade é number OU null (null quando o memorial não permite
//     recalcular - ex.: excipiente de gummy sem massa individual conhecida;
//     a nota da própria linha explica o motivo, mas o texto da nota não é
//     estruturado o bastante para virar número com segurança);
//   - vd_pct é: null (o item não tem %VD - ex. "Açúcares totais", que é
//     discriminação de Carboidratos), OU um objeto {grupo: valor} com uma
//     chave por item de grupos_vd - nunca um número solto, mesmo quando há
//     um grupo só;
//   - dentro de vd_pct, o valor por grupo é number OU o literal "PENDENTE"
//     (Anexo VIII ainda sem referência para aquele nutriente/grupo);
//   - grupos_vd tem 1 item na imensa maioria ("adultos_19_anos_ou_mais") e 2
//     no Multi Vitta ("gestantes", "lactantes").
//
// A CHAVE em formulas.metadata é a RAIZ ("tabela_nutricional", plana) - por
// instrução explícita desta tarefa. A migration de referência acima grava
// aninhado sob "reformulacao_2026_09_16" (que carrega MUITO mais dado -
// veredito, pendências, laudos - fora do escopo deste parser e daquela
// migration, que por isso está marcada para não ser aplicada); a leitura
// aqui assume que a migration definitiva desta funcionalidade grava só o
// pedaço tabela_nutricional, direto na raiz do metadata. Ficou registrado
// aqui por escrito para quem for escrever aquela migration conferir.
import { z } from "zod";

import type { Json } from "@/lib/supabase/database.types";
import { formatQuantity } from "@/lib/catalog/format-catalog";

// ---------------------------------------------------------------------------
// Schema (valida o jsonb exatamente como ele chega do banco, em snake_case -
// mesma convenção de nomes que o resto do formulas.metadata usa).
// ---------------------------------------------------------------------------

// Percentual do Valor Diário por grupo populacional: número já arredondado,
// ou o literal "PENDENTE" quando o Anexo VIII da IN 75/2020 ainda não tem
// referência para aquele nutriente/grupo (RDC 429/2020, art. 12, §1º: sem
// VDR, a célula fica em branco na etiqueta - "PENDENTE" é o marcador interno
// que essa ausência recebeu na apuração da fase 3). Nunca convertido para
// vazio nem para zero: é um dado real, distinto de "não se aplica".
export const vdValueSchema = z.union([z.number(), z.literal("PENDENTE")]);

// Exportado (além dos tipos e das funções de formatação já exportados antes
// desta tarefa) porque a Server Action de escrita (lib/actions/formulas.ts,
// updateNutritionTable) precisa validar a entrada do editor administrativo
// com ESTE MESMO schema - nunca um schema duplicado, que poderia divergir
// silenciosamente do que readNutritionTable aceita como válido.
export const rawNutritionRowSchema = z.object({
  // Vazio é aceito por pedido do dono (17/09/2026, "desbloqueie qualquer
  // alteração no admin e salvar" - temporário e consciente, mesmo padrão de
  // lib/actions/sheet-approvals.ts): nunca rejeita, vira "PENDENTE". Não é
  // gambiarra nova neste módulo - "PENDENTE" já é um literal de dado real aqui
  // (ver vdValueSchema acima), então uma linha sem nome ainda definido usa a
  // mesma convenção que o resto da tabela já usa para "falta valor".
  item: z.string().transform((v) => (v.trim() === "" ? "PENDENTE" : v.trim())),
  // Indentação (0 = nutriente principal, 1+ = discriminação dele - ex.:
  // "Açúcares totais" sob "Carboidratos"). Ausente -> nível 0, nunca quebra a
  // leitura por causa de um campo estrutural que faltou.
  nivel: z.number().int().nonnegative().default(0),
  quantidade: z.number().nullable(),
  unidade: z.string().nullable().default(null),
  // kJ da linha "Valor energético" (as demais linhas nunca têm este campo) -
  // ver formatNutritionQuantity, abaixo.
  kj: z.number().nullable().optional(),
  vd_pct: z.record(z.string(), vdValueSchema).nullable().default(null),
  nota: z.string().nullable().optional(),
  provisorio: z.boolean().default(false),
  // NOVO (ampliação de escopo, ordem do dono em 16/09/2026): quantidade "por
  // 100 g/ml", para a coluna opcional do modelo vertical da IN 75/2020, Anexo
  // XII. Opcional e nullable: nenhuma das 24 fórmulas hoje grava este campo, e
  // a maioria nunca vai gravar - RDC 429/2020, art. 8º, §1º (conferido no
  // texto consolidado em 16/09/2026) DISPENSA os suplementos alimentares da
  // declaração por 100 g/ml, EXCETO quando a forma for líquida ou pó para
  // reconstituição (para essas, a declaração por 100 g/ml continua exigida).
  quantidade_100: z.number().nullable().optional(),
});

export const rawNutritionTableSchema = z.object({
  // Mesmo afrouxamento consciente de "item" acima: "" vira "PENDENTE" em vez
  // de travar o salvamento. porcoes_por_embalagem aceita number também (é o
  // formato real de parte das 24 fórmulas) - só normaliza quando o valor
  // chega como string.
  porcoes_por_embalagem: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" && v.trim() === "" ? "PENDENTE" : v)),
  porcao: z.string().transform((v) => (v.trim() === "" ? "PENDENTE" : v.trim())),
  grupos_vd: z.array(z.string().min(1)).min(1),
  linhas: z.array(rawNutritionRowSchema).min(1),
  rodape: z.string().nullable().default(null),
  // NOVO: liga a coluna "100 g"/"100 ml" (RDC 429/2020, art. 8º, §1º - ver
  // comentário de quantidade_100 acima). Default false porque a dispensa é a
  // regra para a maioria dos 24 produtos do catálogo (cápsula, goma); quem liga
  // é o responsável técnico, nunca uma dedução automática do código - o app
  // não decide sozinho uma questão de conformidade regulatória.
  por_100: z.boolean().default(false),
});

// Entrada validável do editor administrativo (mesmo shape snake_case gravado
// em formulas.metadata->tabela_nutricional, já com os defaults do zod
// aplicados - ex.: nivel ausente vira 0, provisorio ausente vira false).
export type NutritionTableInput = z.infer<typeof rawNutritionTableSchema>;

// ---------------------------------------------------------------------------
// Tipo público (camelCase - mesma convenção de todo DTO deste módulo de
// dados, ver FormulaDTO em lib/data/formulas.ts).
// ---------------------------------------------------------------------------

export interface NutritionTableRow {
  item: string;
  nivel: number;
  quantidade: number | null;
  unidade: string | null;
  kj: number | null;
  vdPct: Record<string, number | "PENDENTE"> | null;
  nota: string | null;
  provisorio: boolean;
  /** Quantidade "por 100 g/ml" - só tem sentido quando NutritionTable.por100 é true. */
  quantidade100: number | null;
}

export interface NutritionTable {
  porcoesPorEmbalagem: string;
  porcao: string;
  gruposVd: string[];
  linhas: NutritionTableRow[];
  rodape: string | null;
  /** Liga a coluna "100 g"/"100 ml" do modelo vertical (Anexo XII da IN 75/2020). */
  por100: boolean;
}

// Exportado: a Server Action de escrita (updateNutritionTable, em
// lib/actions/formulas.ts) usa esta MESMA conversão depois de validar a
// entrada do editor com rawNutritionTableSchema, para gerar o texto de
// nutritional_info (renderNutritionTableText, abaixo) a partir do objeto
// camelCase - a mesma conversão que readNutritionTable já usa há de valer
// para os dois sentidos (leitura do banco e gravação vinda do editor).
export function toNutritionTable(raw: z.infer<typeof rawNutritionTableSchema>): NutritionTable {
  return {
    porcoesPorEmbalagem: String(raw.porcoes_por_embalagem),
    porcao: raw.porcao,
    gruposVd: raw.grupos_vd,
    rodape: raw.rodape,
    por100: raw.por_100,
    linhas: raw.linhas.map((row) => ({
      item: row.item,
      nivel: row.nivel,
      quantidade: row.quantidade,
      unidade: row.unidade,
      kj: row.kj ?? null,
      vdPct: row.vd_pct,
      nota: row.nota ?? null,
      provisorio: row.provisorio,
      quantidade100: row.quantidade_100 ?? null,
    })),
  };
}

// ---------------------------------------------------------------------------
// Leitura segura - metadata é jsonb livre; um valor mal formado (fórmula
// ainda sem a tabela, chave com formato antigo, edição manual incorreta)
// nunca pode derrubar o dossiê. Mesma postura defensiva de readImageAlt
// (lib/data/formulas.ts): confere o formato dado por dado, sem `as` nem
// suposição de tipo, e devolve null para QUALQUER coisa fora do esperado -
// quem chama já sabe usar o texto livre (nutritionalInfo) como alternativa
// nesse caso.
// ---------------------------------------------------------------------------
export function readNutritionTable(metadata: Json | null | undefined): NutritionTable | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;

  const candidate = (metadata as Record<string, Json | undefined>).tabela_nutricional;
  if (candidate === undefined || candidate === null) return null;

  const parsed = rawNutritionTableSchema.safeParse(candidate);
  if (!parsed.success) {
    console.error(
      "[readNutritionTable] formulas.metadata.tabela_nutricional fora do formato esperado:",
      parsed.error.flatten(),
    );
    return null;
  }
  return toNutritionTable(parsed.data);
}

// ---------------------------------------------------------------------------
// Formatação compartilhada pela tabela web (components/catalog/NutritionTable.tsx)
// e pela tabela em PDF (lib/pdf/formula-sections.ts) - mesma regra do resto do
// projeto: um ajuste aqui vale para os dois canais ao mesmo tempo.
// ---------------------------------------------------------------------------

// Rótulo da coluna de %VD. Com um grupo só (o caso comum: "adultos_19_anos_ou_mais"),
// fica no "%VD*" enxuto de sempre - repetir o nome do grupo não ajuda quando
// só existe uma coluna. Com 2+ grupos (hoje só o Multi Vitta: gestantes e
// lactantes) cada coluna leva o nome do grupo, para o comprador saber qual é
// qual. "_" vira espaço por ser só formatação de um identificador (nunca
// tradução nem texto novo).
export function nutritionVdColumnLabel(grupo: string, totalGrupos: number): string {
  if (totalGrupos <= 1) return "%VD*";
  return `%VD* ${grupo.replace(/_/g, " ")}`;
}

// "Quantidade por porção": número (padrão brasileiro, via formatQuantity - a
// MESMA função usada pela tabela de composição, para os dois lugares
// formatarem número do mesmo jeito) + unidade. quantidade nula (rótulo/
// memorial não permite recalcular - ver a nota da própria linha) nunca vira
// "0" nem "null": vira travessão, igual a qualquer outro dado ausente no
// projeto.
//
// Só a linha "Valor energético" carrega kj - quando presente, entra como
// "= X kJ" ao lado do kcal, igual ao rótulo impresso oficial (RDC 429/2020).
export function formatNutritionQuantity(row: NutritionTableRow): string {
  if (row.quantidade === null) return "—";
  const base = `${formatQuantity(row.quantidade)}${row.unidade ? ` ${row.unidade}` : ""}`;
  return row.kj !== null ? `${base} = ${formatQuantity(row.kj)} kJ` : base;
}

// Célula de %VD de UM grupo. Vazio quando a linha inteira não tem %VD (ex.:
// "Açúcares totais", discriminação de Carboidratos - RDC 429/2020) ou quando
// o grupo pedido não aparece nesta linha; "PENDENTE" sai literal (nunca
// escondido, nunca traduzido - é dado real da apuração, distinto de "não se
// aplica"); número vira "NN%".
export function formatNutritionVdCell(row: NutritionTableRow, grupo: string): string {
  if (row.vdPct === null) return "";
  const valor = row.vdPct[grupo];
  if (valor === undefined) return "";
  if (valor === "PENDENTE") return "PENDENTE";
  return `${formatQuantity(valor)}%`;
}

// Parte quantitativa da porção ("1 g", "6 g", "2 mL", "2 gomas"), cortando a
// partir do primeiro " (" - é o que o cabeçalho de coluna do modelo vertical
// da IN 75/2020 (Anexo XII: títulos "100 g", "X g ou ml" e "%VD*") e o texto
// plano (renderNutritionTableText, abaixo) usam os dois, para nunca
// divergirem sobre o valor da coluna. Conferido nas 24 fórmulas reais em
// 16/09/2026: "1 g (2 cápsulas)" -> "1 g", "2 gomas (massa da porção não
// cadastrada)" -> "2 gomas", "2 mL" (sem parênteses) -> "2 mL" (usa a string
// inteira quando não há " (").
export function nutritionPorcaoResumo(porcao: string): string {
  const indiceParenteses = porcao.indexOf(" (");
  return indiceParenteses === -1 ? porcao : porcao.slice(0, indiceParenteses);
}

// Célula de valor "só o número" do modelo vertical (Anexo XII): a unidade já
// vai no NOME do item ("Valor energético (kcal)", "Carboidratos (g)" - Anexo
// XI da IN 75/2020), então a célula não repete a unidade. Usada pela tabela
// web (components/catalog/NutritionTable.tsx) e pelo PDF
// (lib/pdf/formula-sections.ts) - nunca duplicada nos dois lugares. Travessão
// para quantidade nula, mesma convenção de formatNutritionQuantity (nunca
// "0" nem "null" para dado ausente).
export function formatNutritionValorCelula(quantidade: number | null): string {
  return quantidade === null ? "—" : formatQuantity(quantidade);
}

// ---------------------------------------------------------------------------
// As 10 linhas obrigatórias (RDC 429/2020, art. 5º, incisos I a X - conferido
// no texto consolidado em 16/09/2026: "Art. 5º A tabela de informação
// nutricional deve conter a declaração das quantidades de: I - valor
// energético; II - carboidratos; III - açúcares totais; IV - açúcares
// adicionados; V - proteínas; VI - gorduras totais; VII - gorduras
// saturadas; VIII - gorduras trans; IX - fibras alimentares; X - sódio").
// nivel e unidade batem com o Anexo XI da IN 75/2020 (nomes, ordem,
// indentação e unidade de medida) E com as 24 fórmulas já gravadas (conferido
// via leitura ao vivo pela chave pública em 16/09/2026: as 24 têm exatamente
// estas 10 linhas, nesta ordem, com este nivel e esta unidade, antes de
// qualquer vitamina/mineral extra). O editor administrativo usa esta lista
// para (a) semear uma tabela nova e (b) recusar remover uma destas 10 linhas
// - só editar, nunca apagar.
export interface LinhaObrigatoria {
  item: string;
  nivel: number;
  unidade: string;
}

export const LINHAS_OBRIGATORIAS_ANEXO_XI: readonly LinhaObrigatoria[] = [
  { item: "Valor energético", nivel: 0, unidade: "kcal" },
  { item: "Carboidratos", nivel: 0, unidade: "g" },
  { item: "Açúcares totais", nivel: 1, unidade: "g" },
  { item: "Açúcares adicionados", nivel: 2, unidade: "g" },
  { item: "Proteínas", nivel: 0, unidade: "g" },
  { item: "Gorduras totais", nivel: 0, unidade: "g" },
  { item: "Gorduras saturadas", nivel: 1, unidade: "g" },
  { item: "Gorduras trans", nivel: 1, unidade: "g" },
  { item: "Fibras alimentares", nivel: 0, unidade: "g" },
  { item: "Sódio", nivel: 0, unidade: "mg" },
];

/** true quando o item bate (por nome) com uma das 10 linhas obrigatórias do Anexo XI. */
export function isLinhaObrigatoria(item: string): boolean {
  return LINHAS_OBRIGATORIAS_ANEXO_XI.some((linha) => linha.item === item);
}

// ---------------------------------------------------------------------------
// Merge em metadata (jsonb) - NUNCA sobrescreve o objeto inteiro. Lê o que já
// está lá e devolve uma CÓPIA NOVA (regra de imutabilidade do projeto) com
// só a chave "tabela_nutricional" trocada; qualquer outra chave que já
// exista em metadata (ex.: "nutritional_info_anterior_2026_09_16", presente
// nas 24 fórmulas reais) sobrevive intacta. Função pura, sem I/O - é o que
// permite testar o merge sem precisar de banco (ver
// lib/catalog/nutrition-table.test.ts).
export function mergeNutritionTableMetadata(
  metadataAtual: Json | null | undefined,
  tabela: NutritionTableInput,
): Record<string, Json> {
  const base =
    metadataAtual && typeof metadataAtual === "object" && !Array.isArray(metadataAtual)
      ? (metadataAtual as Record<string, Json>)
      : {};
  return { ...base, tabela_nutricional: tabela as unknown as Json };
}

// ---------------------------------------------------------------------------
// Texto plano de formulas.nutritional_info, gerado a partir da tabela
// estruturada - PROCEDÊNCIA DO FORMATO (conferida na fonte primária, não de
// memória, em 16/09/2026): o algoritmo abaixo foi obtido comparando, campo a
// campo, o JSON de formulas.metadata->tabela_nutricional contra o texto já
// gravado em formulas.nutritional_info das 24 fórmulas (lidas ao vivo pela
// chave pública) - e reproduz as 24 BYTE A BYTE (conferido por script antes
// de escrever esta função; o teste automatizado abaixo cobre as 2 fórmulas
// exigidas pela tarefa, zma-zinco-magnesio-e-vitamina-d e
// multi-vitta-gestante-e-lactante-em-capsula). Duas peculiaridades reais que
// só apareceram nessa conferência (nenhuma das duas está documentada em
// lugar nenhum, foram descobertas comparando o texto real):
//   - a quantidade usa separador de milhar ("1.333 µg DFE"), AO CONTRÁRIO de
//     formatQuantity (lib/catalog/format-catalog.ts), que desliga o
//     agrupamento de propósito para a tabela de composição - por isso este
//     módulo tem o SEU PRÓPRIO formatador de quantidade para o texto, só
//     para este fim, sem mexer em formatQuantity nem em
//     formatNutritionQuantity (que continuam servindo a tabela web e o PDF,
//     testados e sem agrupamento);
//   - quando quantidade é null, a linha vira "PENDENTE" (nunca o travessão
//     "—" que formatNutritionQuantity usa) E a célula de %VD fica em
//     branco - MESMO quando vd_pct daquela linha traz "PENDENTE" por grupo
//     (conferido em emagrecedor-em-capsula: a linha "Valor energético" tem
//     vd_pct {"adultos_19_anos_ou_mais":"PENDENTE"} e quantidade null, e o
//     texto gravado mostra a célula de %VD vazia, não "PENDENTE").
// %VD continua usando formatNutritionVdCell sem alteração (não agrupa, igual
// à tabela web/PDF - conferido: nenhuma das 24 fórmulas tem %VD com milhar
// agrupado, ex. "1600%", nunca "1.600%").
function formatNutritionQuantidadeTexto(valor: number): string {
  const maximumFractionDigits = Math.abs(valor) >= 1 ? 2 : 4;
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits }).format(valor);
}

function celulaQuantidadeTexto(row: NutritionTableRow): string {
  if (row.quantidade === null) return "PENDENTE";
  if (row.kj !== null) {
    return `${formatNutritionQuantidadeTexto(row.quantidade)} ${row.unidade} = ${formatNutritionQuantidadeTexto(row.kj)} kJ`;
  }
  return `${formatNutritionQuantidadeTexto(row.quantidade)}${row.unidade ? ` ${row.unidade}` : ""}`;
}

function celulasVdTexto(row: NutritionTableRow, gruposVd: string[]): string[] {
  // quantidade null força %VD em branco em TODA a linha, mesmo quando vd_pct
  // teria "PENDENTE" por grupo - ver comentário de procedência acima.
  if (row.quantidade === null) return gruposVd.map(() => "");
  return gruposVd.map((grupo) => formatNutritionVdCell(row, grupo));
}

export function renderNutritionTableText(table: NutritionTable): string {
  const linhasTexto: string[] = [
    "INFORMAÇÃO NUTRICIONAL",
    `Porções por embalagem: ${table.porcoesPorEmbalagem}`,
    `Porção: ${table.porcao}`,
    ` | ${nutritionPorcaoResumo(table.porcao)} | ${table.gruposVd.map((grupo) => nutritionVdColumnLabel(grupo, table.gruposVd.length)).join(" | ")}`,
  ];

  for (const row of table.linhas) {
    const indentacao = "  ".repeat(row.nivel);
    const celulaQuantidade = celulaQuantidadeTexto(row);
    const celulasVd = celulasVdTexto(row, table.gruposVd);
    linhasTexto.push(`${indentacao}${row.item} | ${celulaQuantidade} | ${celulasVd.join(" | ")}`);
  }

  if (table.rodape) linhasTexto.push(table.rodape);

  return linhasTexto.join("\n");
}
