import type { CSSProperties } from "react";

import {
  formatNutritionValorCelula,
  formatNutritionVdCell,
  nutritionPorcaoResumo,
  nutritionVdColumnLabel,
  type NutritionTable as NutritionTableData,
  type NutritionTableRow,
} from "@/lib/catalog/nutrition-table";

interface NutritionTableProps {
  table: NutritionTableData;
}

// Tabela de Informação Nutricional no MODELO VERTICAL oficial da Anvisa (IN
// 75/2020, Anexo XII "Requisitos específicos para formatação da tabela de
// informação nutricional" - conferido no texto consolidado em 16/09/2026, na
// fonte, não de memória; ampliação de escopo pedida pelo dono com duas
// imagens de referência). Citações literais usadas nesta reforma:
//
//   - títulos de coluna "100 g", "X g ou ml" e "%VD*" (Anexo XII, linha
//     "Tipografia dos títulos das colunas") -> as colunas abaixo são: 100 g
//     (só quando table.por100 - ver nota da RDC 429/2020 mais adiante),
//     a porção resumida (nutritionPorcaoResumo) e uma coluna de %VD por
//     grupo (nutritionVdColumnLabel), igual à norma;
//   - nome, ordem, indentação e UNIDADE de cada constituinte obrigatório
//     (Anexo XI da IN 75/2020: "Valor energético"/kcal, "Carboidratos"/g,
//     "Açúcares totais"/g em 1º nível, ... "Sódio"/mg) -> o nome de cada
//     linha carrega a unidade entre parênteses (ex.: "Valor energético
//     (kcal)"), e a célula de valor mostra só o número
//     (formatNutritionValorCelula) - nunca repete a unidade na célula;
//   - "kJ": NENHUMA ocorrência da palavra "kJ" nem de "joule" em todo o texto
//     consolidado da IN 75/2020 nem da RDC 429/2020 (busca literal íntegra
//     nos dois arquivos, 16/09/2026, zero resultados). O Anexo XI define a
//     unidade do valor energético como "kcal", só isso - não existe coluna
//     nem par "kcal = kJ" na norma vigente. A dupla que a versão anterior
//     desta tabela mostrava é herança da RDC 360/2003 (revogada) - o próprio
//     script que gerou os dados registra isso (docs/conformidade/
//     dados-2026-09-16/fase3/gerar.py, comentário de linha ~594: "o anexo
//     não traz coluna em kJ/g"). Este modelo segue a norma VIGENTE e mostra
//     só kcal; o campo `kj` do tipo/JSON não foi removido (não é dado
//     perdido) e continua alimentando o texto legado, ver
//     renderNutritionTableText em lib/catalog/nutrition-table.ts;
//   - coluna "100 g"/"100 ml": RDC 429/2020, art. 8º, §1º dispensa a maioria
//     dos suplementos alimentares dessa declaração, EXCETO quando a forma é
//     líquida ou pó para reconstituição (para essas, a coluna continua
//     exigida). Por isso é OPCIONAL (table.por100) e decidida pelo
//     responsável técnico no editor - o código nunca decide sozinho uma
//     questão de conformidade regulatória;
//   - rodapé dentro da caixa: RDC 429/2020, art. 12, §5º cita o texto entre
//     aspas SEM ponto final - "*Percentual de valores diários fornecidos
//     pela porção" - e é exatamente o que as 24 fórmulas reais têm gravado.
//     (O Anexo XII, ao descrever a TIPOGRAFIA do rodapé, mostra o mesmo texto
//     COM ponto final - as duas passagens do próprio texto consolidado
//     divergem nisso; o art. 12 §5º é quem manda usar o texto, por isso
//     prevalece, e bate com o dado real: nada foi alterado aqui, a tabela só
//     exibe table.rodape como ele estiver gravado).
//
// Cores PRETO SOBRE BRANCO fixas (nunca var(--ink)/var(--card-bg) do tema,
// ver app/globals.css): isto é rotulagem regulatória, não decoração do site -
// tem de continuar lendo igual no modo claro e no escuro. Mesmo princípio de
// ".lc-comp-table SEMPRE sólida, nunca vidro" (comentário no topo de
// app/globals.css), um degrau acima: aqui a cor também fica fixa, porque uma
// etiqueta virar "branco sobre preto" no modo escuro do site não seria uma
// leitura válida dela.
//
// Componente de servidor puro - sem estado, sem interação, só formata o que
// já veio validado de lib/catalog/nutrition-table.ts (readNutritionTable).
// Reaproveitado tal e qual pela prévia ao vivo do editor administrativo
// (components/admin/NutritionTableEditor.tsx), para o que o RT edita e o que
// o cliente final vê no dossiê serem SEMPRE o mesmo componente.
export function NutritionTable({ table }: NutritionTableProps) {
  const colunasValor = (table.por100 ? 1 : 0) + 1; // "100 g" (opcional) + porção
  const totalColunas = 1 + colunasValor + table.gruposVd.length; // + coluna do nome do item
  const colSpanMeta = totalColunas - 1;

  return (
    // overflow-x é a rede de segurança em telas estreitas (360 px, iPhone SE
    // etc.): item + 1-2 colunas de valor + 1-2 de %VD podem não caber lado a
    // lado; a rolagem fica CONTIDA no wrapper, a página nunca ganha barra
    // horizontal própria. tabIndex + aria-label pelo mesmo motivo de
    // acessibilidade do wrapper "boxed" de .lc-comp-table-wrap
    // (CompositionTable.tsx).
    <div className="lc-nutri-table-wrap" tabIndex={0} aria-label="Tabela de informação nutricional, role para o lado para ver mais">
      <table className="lc-nutri-table">
        <caption className="lc-nutri-caption">Informação nutricional</caption>
        {/*
          Um <tbody> só, DE PROPÓSITO, com as linhas na ORDEM VISUAL exigida
          pelo Anexo XII (título -> "Porções por embalagem" -> "Porção" ->
          linha grossa -> cabeçalho de colunas -> nutrientes): um <thead>
          teria de vir ANTES de qualquer <tbody> no HTML (a ordem de origem é
          normativa para thead/tbody, diferente de <tfoot>, que HTML5 permite
          logo depois de thead ou ao final) - colocar o cabeçalho de colunas
          num <thead> o empurraria para cima das duas linhas de "Porções por
          embalagem"/"Porção", invertendo a ordem pedida. scope="col"/"row"
          em cada célula já dá a semântica de cabeçalho para leitor de tela,
          sem depender de thead.
        */}
        <tbody>
          <tr className="lc-nutri-meta-row">
            <th scope="row">Porções por embalagem</th>
            <td colSpan={colSpanMeta}>{table.porcoesPorEmbalagem}</td>
          </tr>
          {/* Linha GROSSA depois da porção (Anexo XII: separa o bloco de
              cabeçalho do grid de nutrientes) - classe própria, ver
              .lc-nutri-table .lc-nutri-meta-row--divisoria em globals.css. */}
          <tr className="lc-nutri-meta-row lc-nutri-meta-row--divisoria">
            <th scope="row">Porção</th>
            <td colSpan={colSpanMeta}>{table.porcao}</td>
          </tr>
          <tr className="lc-nutri-col-headers">
            {/* Sem rótulo visível de propósito (a etiqueta impressa também não
                tem um) - "Componente" existe só para o <th scope="col"> ter
                nome acessível. */}
            <th scope="col" className="lc-sr-only">
              Componente
            </th>
            {table.por100 && (
              <th scope="col" className="lc-nutri-qty">
                100 g
              </th>
            )}
            <th scope="col" className="lc-nutri-qty">
              {nutritionPorcaoResumo(table.porcao)}
            </th>
            {table.gruposVd.map((grupo) => (
              <th scope="col" className="lc-nutri-vd" key={grupo}>
                {nutritionVdColumnLabel(grupo, table.gruposVd.length)}
              </th>
            ))}
          </tr>
          {table.linhas.map((row, index) => (
            <NutritionRow key={`${row.item}-${index}`} row={row} table={table} />
          ))}
        </tbody>
        {table.rodape && (
          <tfoot>
            <tr>
              <td className="lc-nutri-foot" colSpan={totalColunas}>
                {table.rodape}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

function NutritionRow({ row, table }: { row: NutritionTableRow; table: NutritionTableData }) {
  // Nota real da linha (quando existe) é mais exata que uma frase fixa -
  // "provisória — aguardando laudo" só entra quando a apuração não deixou
  // nota nenhuma. Nunca os dois ao mesmo tempo, nunca inventado.
  const provisorioTexto = row.provisorio ? (row.nota ?? "provisória — aguardando laudo") : null;
  // Indentação por nível (0 = nutriente principal, 1 = "n", 2 = "nn", 3 =
  // "nnn" no Anexo XII) via padding calculado em CSS a partir de --lc-nivel -
  // nunca "&nbsp;" repetido no texto, que quebraria a cópia do valor.
  const itemStyle = { "--lc-nivel": row.nivel } as CSSProperties;
  // Unidade entre parênteses no NOME do item (Anexo XI/XII) - a célula de
  // valor, abaixo, mostra só o número.
  const itemComUnidade = row.unidade ? `${row.item} (${row.unidade})` : row.item;

  return (
    <tr className={row.provisorio ? "lc-nutri-row--provisorio" : undefined} title={provisorioTexto ?? undefined}>
      <th scope="row" className="lc-nutri-item" style={itemStyle}>
        {itemComUnidade}
        {provisorioTexto && <span className="lc-sr-only"> (dado provisório: {provisorioTexto})</span>}
      </th>
      {table.por100 && <td className="lc-nutri-qty">{formatNutritionValorCelula(row.quantidade100)}</td>}
      <td className="lc-nutri-qty">{formatNutritionValorCelula(row.quantidade)}</td>
      {table.gruposVd.map((grupo) => (
        <td className="lc-nutri-vd" key={grupo}>
          {formatNutritionVdCell(row, grupo)}
        </td>
      ))}
    </tr>
  );
}
