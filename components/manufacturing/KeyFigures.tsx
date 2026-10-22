import type { ManufacturingStats } from "@/lib/catalog/manufacturing-stats";
import type { IngredientBankStats } from "@/lib/data/ingredient-bank";
import { joinPortugueseList } from "@/lib/format";

interface KeyFiguresProps {
  stats: ManufacturingStats;
  ingredientBank: IngredientBankStats;
}

// A fábrica resumida em quatro números, colada no herói e ainda dentro da
// primeira dobra. É a parte que responde "que empresa é esta?" antes de o
// visitante rolar a página — e ela consegue responder sem nenhuma frase de
// marketing porque cada número sai do banco na mesma requisição (ver
// lib/catalog/manufacturing-stats.ts e lib/data/ingredient-bank.ts).
//
// POR QUE ESTES QUATRO, e não outros: são exatamente as quatro perguntas que
// quem procura fabricante faz antes de decidir se continua lendo — o que vocês
// já têm pronto, em que formatos produzem, com o que trabalham se eu quiser
// fórmula minha, e qual é o volume mínimo. O quarto é o que mais desqualifica
// visitante cedo, e por isso subiu do meio da página para cá: quem não faz o
// lote mínimo descobre em cinco segundos, não em cinco seções.
//
// REGRA DE EXATIDÃO: nenhum número é digitado aqui, e nenhum deles se repete
// adiante na página. Onde uma seção posterior fala do mesmo assunto, ela
// acrescenta detalhe que este resumo não dá (quantas fórmulas por formato e
// quais apresentações já saem da linha, em FormatCapabilities; a divisão do
// banco de insumos por categoria, em StartingPoint) — nunca repete o número.
export function KeyFigures({ stats, ingredientBank }: KeyFiguresProps) {
  const figures: { value: string; label: string; note: string }[] = [];

  // Catálogo vazio é estado possível (ver lib/data/formulas.ts): em vez de
  // mostrar um "0 fórmulas prontas", a figura simplesmente não existe.
  if (stats.totalFormulas > 0) {
    figures.push({
      value: String(stats.totalFormulas),
      label: stats.totalFormulas === 1 ? "fórmula pronta no catálogo" : "fórmulas prontas no catálogo",
      note: "já desenvolvidas e em produção, prontas para sair com a sua marca",
    });
  }

  if (stats.formats.length > 0) {
    figures.push({
      value: String(stats.formats.length),
      label: stats.formats.length === 1 ? "formato de produção" : "formatos de produção",
      // Minúscula porque aqui os rótulos entram numa frase corrida, não como
      // título de cartão — no cartão (FormatCapabilities) eles continuam
      // capitalizados, que é onde nomeiam a seção.
      note: joinPortugueseList(stats.formats.map((format) => format.label.toLocaleLowerCase("pt-BR"))),
    });
  }

  if (ingredientBank.total > 0) {
    figures.push({
      value: String(ingredientBank.total),
      label: ingredientBank.total === 1 ? "matéria-prima cadastrada" : "matérias-primas cadastradas",
      note: "o banco com que a fábrica trabalha para desenvolver fórmula nova",
    });
  }

  // Só aparece quando o mínimo é o mesmo em TODAS as fórmulas ativas — a
  // checagem está em lib/catalog/manufacturing-stats.ts. Havendo divergência,
  // some em vez de escolher um número.
  if (stats.uniformMinimumOrderPotes != null) {
    figures.push({
      value: String(stats.uniformMinimumOrderPotes),
      label: "potes: lote mínimo por fórmula",
      // A parte que não pode faltar: o mínimo é POR FÓRMULA. Quem quer três
      // produtos diferentes precisa do mínimo em cada um, e descobrir isso
      // depois seria descobrir tarde.
      note: "vale para cada fórmula separadamente, não para o pedido inteiro",
    });
  }

  if (figures.length === 0) return null;

  return (
    <section className="lc-fab-figures-wrap" aria-label="A fábrica em números">
      <ul className="lc-fab-figures">
        {figures.map((figure) => (
          <li className="lc-fab-figure" key={figure.label}>
            <span className="lc-fab-figure-value">{figure.value}</span>
            <span className="lc-fab-figure-label">{figure.label}</span>
            <span className="lc-fab-figure-note">{figure.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
