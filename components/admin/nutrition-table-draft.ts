// Estado de edição (strings de input) da tabela nutricional estruturada, e as
// conversões nos dois sentidos - carregar do banco (linhaParaDraft/
// tabelaParaFormDraft) e devolver para o banco (draftParaEntradaCrua), mais a
// conversão para a prévia ao vivo (draftParaPreviewTable). Extraído de
// NutritionTableEditor.tsx (que já concentra estado + JSX) para este módulo
// só de dados/conversão - "muitos arquivos pequenos", regra do projeto.
//
// PADRÃO DE TEXTO: todo número mora na tela como STRING (ex.: quantidadeTexto),
// nunca como number - mesmo padrão de CompositionRow.tsx (quantityText), que
// existe para o campo aceitar vírgula decimal e estados intermediários
// enquanto o usuário digita ("1,", "-", vazio) sem o React "corrigir" o valor
// a cada tecla.
import {
  isLinhaObrigatoria,
  LINHAS_OBRIGATORIAS_ANEXO_XI,
  type NutritionTable,
  type NutritionTableInput,
  type NutritionTableRow,
} from "@/lib/catalog/nutrition-table";

export interface NutritionRowDraft {
  /** Chave estável para key do React e id de checkbox - nunca o índice (muda ao reordenar). */
  chave: string;
  item: string;
  nivel: number;
  quantidadeTexto: string;
  unidade: string;
  kjTexto: string;
  quantidade100Texto: string;
  vdPctTexto: Record<string, string>;
  nota: string;
  provisorio: boolean;
}

export interface NutritionTableFormDraft {
  porcoesPorEmbalagemTexto: string;
  porcaoTexto: string;
  rodapeTexto: string;
  por100: boolean;
  gruposVd: string[];
  linhas: NutritionRowDraft[];
}

// Rodapé padrão - texto literal da RDC 429/2020, art. 12, §5º (conferido no
// texto consolidado em 16/09/2026: "A declaração de que trata o caput deve
// ser acompanhada da seguinte nota de rodapé: '*Percentual de valores diários
// fornecidos pela porção'" - SEM ponto final; o ponto que aparece depois, no
// texto da lei, fecha a FRASE que introduz a citação, não faz parte dela).
// Bate com o que as 24 fórmulas reais têm gravado (conferido ao vivo pela
// chave pública em 16/09/2026). O Anexo XII, ao descrever a TIPOGRAFIA do
// rodapé, mostra o mesmo texto COM ponto final - as duas passagens do próprio
// texto consolidado divergem nisso; o art. 12 §5º é a norma que manda usar o
// texto, por isso prevalece.
export const RODAPE_PADRAO_RDC429 = "*Percentual de valores diários fornecidos pela porção";

function novaChave(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `linha-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function linhaVaziaDraft(gruposVd: string[]): NutritionRowDraft {
  return {
    chave: novaChave(),
    item: "",
    nivel: 0,
    quantidadeTexto: "",
    unidade: "",
    kjTexto: "",
    quantidade100Texto: "",
    vdPctTexto: Object.fromEntries(gruposVd.map((grupo) => [grupo, ""])),
    nota: "",
    provisorio: false,
  };
}

// Semente de uma tabela nova: as 10 linhas obrigatórias do Anexo XI (RDC
// 429/2020, art. 5º), já na ordem, nível e unidade certos - só falta
// preencher os números.
function linhasObrigatoriasDraft(gruposVd: string[]): NutritionRowDraft[] {
  return LINHAS_OBRIGATORIAS_ANEXO_XI.map((linha) => ({
    chave: novaChave(),
    item: linha.item,
    nivel: linha.nivel,
    quantidadeTexto: "",
    unidade: linha.unidade,
    kjTexto: "",
    quantidade100Texto: "",
    vdPctTexto: Object.fromEntries(gruposVd.map((grupo) => [grupo, ""])),
    nota: "",
    provisorio: false,
  }));
}

/** true quando o item da linha bate com uma das 10 linhas obrigatórias do Anexo XI - não pode ser removida, só editada. */
export function draftEhLinhaObrigatoria(draft: NutritionRowDraft): boolean {
  return isLinhaObrigatoria(draft.item.trim());
}

function numeroParaTexto(valor: number | null): string {
  // Vírgula decimal na tela (padrão brasileiro) - mesma convenção de
  // CompositionRow.toDraft (String(quantity).replace(".", ",")).
  return valor === null ? "" : String(valor).replace(".", ",");
}

function vdPctParaTexto(vdPct: Record<string, number | "PENDENTE"> | null, gruposVd: string[]): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const grupo of gruposVd) {
    const valor = vdPct?.[grupo];
    saida[grupo] = valor === undefined || valor === null ? "" : String(valor);
  }
  return saida;
}

function linhaParaDraft(row: NutritionTableRow, gruposVd: string[]): NutritionRowDraft {
  return {
    chave: novaChave(),
    item: row.item,
    nivel: row.nivel,
    quantidadeTexto: numeroParaTexto(row.quantidade),
    unidade: row.unidade ?? "",
    kjTexto: numeroParaTexto(row.kj),
    quantidade100Texto: numeroParaTexto(row.quantidade100),
    vdPctTexto: vdPctParaTexto(row.vdPct, gruposVd),
    nota: row.nota ?? "",
    provisorio: row.provisorio,
  };
}

// Carrega o estado inicial do editor - de uma tabela já gravada, ou (quando a
// fórmula ainda não tem tabela nenhuma) uma tabela nova semeada com as 10
// linhas obrigatórias do Anexo XI e o grupo populacional padrão (o mais comum
// nas 24 fórmulas reais: "adultos_19_anos_ou_mais").
export function tabelaParaFormDraft(tabela: NutritionTable | null): NutritionTableFormDraft {
  if (!tabela) {
    const gruposVd = ["adultos_19_anos_ou_mais"];
    return {
      porcoesPorEmbalagemTexto: "",
      porcaoTexto: "",
      rodapeTexto: RODAPE_PADRAO_RDC429,
      por100: false,
      gruposVd,
      linhas: linhasObrigatoriasDraft(gruposVd),
    };
  }
  return {
    porcoesPorEmbalagemTexto: tabela.porcoesPorEmbalagem,
    porcaoTexto: tabela.porcao,
    rodapeTexto: tabela.rodape ?? RODAPE_PADRAO_RDC429,
    por100: tabela.por100,
    gruposVd: tabela.gruposVd,
    linhas: tabela.linhas.map((row) => linhaParaDraft(row, tabela.gruposVd)),
  };
}

export function adicionarLinhaVazia(form: NutritionTableFormDraft): NutritionTableFormDraft {
  return { ...form, linhas: [...form.linhas, linhaVaziaDraft(form.gruposVd)] };
}

export function removerLinha(form: NutritionTableFormDraft, chave: string): NutritionTableFormDraft {
  return { ...form, linhas: form.linhas.filter((linha) => linha.chave !== chave) };
}

export function moverLinha(form: NutritionTableFormDraft, chave: string, direcao: "up" | "down"): NutritionTableFormDraft {
  const indiceAtual = form.linhas.findIndex((linha) => linha.chave === chave);
  const indiceAlvo = direcao === "up" ? indiceAtual - 1 : indiceAtual + 1;
  if (indiceAtual === -1 || indiceAlvo < 0 || indiceAlvo >= form.linhas.length) return form;

  const linhas = [...form.linhas];
  const linhaTemp = linhas[indiceAtual]!;
  linhas[indiceAtual] = linhas[indiceAlvo]!;
  linhas[indiceAlvo] = linhaTemp;
  return { ...form, linhas };
}

export function atualizarLinha(form: NutritionTableFormDraft, chave: string, proxima: NutritionRowDraft): NutritionTableFormDraft {
  return { ...form, linhas: form.linhas.map((linha) => (linha.chave === chave ? proxima : linha)) };
}

// --- conversão para o que vai para a tela (prévia ao vivo) -----------------
// Tolerante: nunca lança, número inválido vira null - a prévia é só uma
// referência visual enquanto se digita, quem trava valor inválido de verdade
// é a validação do servidor (rawNutritionTableSchema), na hora de salvar.
function paraNumeroOuNuloPreview(texto: string): number | null {
  const limpo = texto.trim();
  if (limpo === "") return null;
  const numero = Number(limpo.replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}

function paraVdOuNuloPreview(texto: string): number | "PENDENTE" | null {
  const limpo = texto.trim();
  if (limpo === "") return null;
  if (limpo.toUpperCase() === "PENDENTE") return "PENDENTE";
  return paraNumeroOuNuloPreview(texto);
}

export function draftParaPreviewTable(form: NutritionTableFormDraft): NutritionTable {
  return {
    porcoesPorEmbalagem: form.porcoesPorEmbalagemTexto.trim() === "" ? "—" : form.porcoesPorEmbalagemTexto.trim(),
    porcao: form.porcaoTexto.trim() === "" ? "—" : form.porcaoTexto.trim(),
    gruposVd: form.gruposVd,
    rodape: form.rodapeTexto.trim() === "" ? null : form.rodapeTexto.trim(),
    por100: form.por100,
    linhas: form.linhas.map((linha) => {
      const entradasVd = form.gruposVd
        .map((grupo): [string, number | "PENDENTE" | null] => [grupo, paraVdOuNuloPreview(linha.vdPctTexto[grupo] ?? "")])
        .filter((par): par is [string, number | "PENDENTE"] => par[1] !== null);
      return {
        item: linha.item.trim() === "" ? "(sem nome)" : linha.item,
        nivel: linha.nivel,
        quantidade: paraNumeroOuNuloPreview(linha.quantidadeTexto),
        unidade: linha.unidade.trim() === "" ? null : linha.unidade.trim(),
        kj: linha.kjTexto.trim() === "" ? null : paraNumeroOuNuloPreview(linha.kjTexto),
        vdPct: entradasVd.length === 0 ? null : Object.fromEntries(entradasVd),
        nota: linha.nota.trim() === "" ? null : linha.nota.trim(),
        provisorio: linha.provisorio,
        quantidade100: paraNumeroOuNuloPreview(linha.quantidade100Texto),
      };
    }),
  };
}

// --- conversão para o que vai para o servidor (payload cru) -----------------
// NUNCA lava silenciosamente um valor inválido para "vazio"/null - texto que
// não é número nem "PENDENTE" segue CRU para o servidor, que rejeita com
// rawNutritionTableSchema e mensagem clara (regra de exatidão do projeto:
// nunca preencher lacuna com valor plausível, nunca esconder um erro de
// digitação como se fosse "sem dado").
function paraNumeroOuCru(texto: string): number | string | null {
  const limpo = texto.trim();
  if (limpo === "") return null;
  const numero = Number(limpo.replace(",", "."));
  return Number.isFinite(numero) ? numero : limpo;
}

function paraVdOuCru(texto: string): number | string | null {
  const limpo = texto.trim();
  if (limpo === "") return null;
  if (limpo.toUpperCase() === "PENDENTE") return "PENDENTE";
  return paraNumeroOuCru(texto);
}

/**
 * Payload snake_case para updateNutritionTable (lib/actions/formulas.ts) -
 * MESMO padrão de toWritableInput em components/admin/FormulaForm.tsx:
 * "moldado" no tipo NutritionTableInput sem validação nenhuma aqui (um campo
 * mal preenchido pode virar um texto cru que não bate com o tipo real, ex.:
 * vd_pct com uma string que não é nem número nem "PENDENTE"). Isso é
 * intencional - o cliente NUNCA é a fonte de verdade; quem valida de
 * verdade, campo a campo, com mensagem clara, é rawNutritionTableSchema
 * dentro da Server Action, exatamente como createFormulaSchema/
 * updateFormulaSchema já fazem para o resto da fórmula.
 */
export function draftParaEntradaCrua(form: NutritionTableFormDraft): NutritionTableInput {
  const bruto = {
    porcoes_por_embalagem: form.porcoesPorEmbalagemTexto.trim(),
    porcao: form.porcaoTexto.trim(),
    grupos_vd: form.gruposVd,
    rodape: form.rodapeTexto.trim() === "" ? null : form.rodapeTexto.trim(),
    por_100: form.por100,
    linhas: form.linhas.map((linha) => {
      const entradasVd = form.gruposVd
        .map((grupo): [string, number | string | null] => [grupo, paraVdOuCru(linha.vdPctTexto[grupo] ?? "")])
        .filter((par): par is [string, number | string] => par[1] !== null);
      return {
        item: linha.item.trim(),
        nivel: linha.nivel,
        quantidade: paraNumeroOuCru(linha.quantidadeTexto),
        unidade: linha.unidade.trim() === "" ? null : linha.unidade.trim(),
        kj: linha.kjTexto.trim() === "" ? null : paraNumeroOuCru(linha.kjTexto),
        vd_pct: entradasVd.length === 0 ? null : Object.fromEntries(entradasVd),
        nota: linha.nota.trim() === "" ? null : linha.nota.trim(),
        provisorio: linha.provisorio,
        quantidade_100: linha.quantidade100Texto.trim() === "" ? null : paraNumeroOuCru(linha.quantidade100Texto),
      };
    }),
  };
  // "as unknown as" (não um "as" direto): quantidade/kj/vd_pct podem carregar
  // texto cru inválido (ver paraNumeroOuCru/paraVdOuCru acima) que não bate
  // estruturalmente com NutritionTableInput - de propósito, é isso que
  // rawNutritionTableSchema.safeParse recusa do outro lado, com mensagem
  // clara por campo.
  return bruto as unknown as NutritionTableInput;
}
