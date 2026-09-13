// Quantos dias um pote dura, calculado a partir da apresentação e do modo de
// uso que já estão no banco.
//
// Regra que vale acima de tudo aqui: só devolve número quando os dois lados
// são inequívocos. Posologia em faixa ("1 a 2 cápsulas ao dia") não vira
// média, e resultado quebrado não vira arredondamento — nos dois casos a
// resposta é null e a interface simplesmente não mostra a informação. É
// catálogo de suplemento: número inventado aqui vira expectativa errada de
// consumo e de recompra.

const NUMERO = String.raw`(\d+(?:[.,]\d+)?)`;
const UNIDADES_CONTAVEIS = String.raw`c[áa]psulas?|gummys?|gomas?|softgels?|comprimidos?|sach[êe]s?|tabletes?`;
const UNIDADES_PESO: Record<string, number> = { kg: 1000, g: 1, mg: 0.001 };

function paraNumero(bruto: string): number {
  return Number.parseFloat(bruto.replace(",", "."));
}

// "1 a 2 cápsulas", "2 ou 3 gomas", "1-2 doses" — ambíguo de propósito.
function temFaixa(texto: string): boolean {
  return /\d\s*(?:a|ou|-|até)\s*\d/i.test(texto);
}

// "60 Cápsulas" -> 60 unidades. "300 gramas" -> 300 g.
function lerApresentacao(texto: string): { valor: number; tipo: "unidade" | "peso" } | null {
  const contavel = new RegExp(`${NUMERO}\\s*(?:${UNIDADES_CONTAVEIS})`, "i").exec(texto);
  if (contavel) return { valor: paraNumero(contavel[1]), tipo: "unidade" };

  const peso = new RegExp(`${NUMERO}\\s*(kg|g|gramas?)\\b`, "i").exec(texto);
  if (peso) {
    const unidade = peso[2].toLowerCase().startsWith("k") ? "kg" : "g";
    return { valor: paraNumero(peso[1]) * UNIDADES_PESO[unidade], tipo: "peso" };
  }
  return null;
}

// "Ingerir 2 cápsulas ao dia" -> 2 unidades. "Diluir 5 g (1 scoop)" -> 5 g.
// "2 cápsulas 2x ao dia" -> 4 unidades.
//
// `preferir` existe porque um pó descreve a dose das duas formas na mesma
// frase ("Diluir 5 g (1 scoop)"): num pote medido em gramas, o número que
// divide é o peso, não o scoop. Sem isso a conta compara grama com scoop e
// não fecha.
function lerDoseDiaria(
  texto: string,
  preferir: "unidade" | "peso",
): { valor: number; tipo: "unidade" | "peso" } | null {
  const vezesAoDia = /(\d)\s*(?:x|vezes)\s*(?:ao|por)\s*dia/i.exec(texto);
  const multiplicador = vezesAoDia ? paraNumero(vezesAoDia[1]) : 1;

  const lerContavel = () => {
    const achado = new RegExp(`${NUMERO}\\s*(?:${UNIDADES_CONTAVEIS}|doses?|scoops?)`, "i").exec(texto);
    return achado
      ? { valor: paraNumero(achado[1]) * multiplicador, tipo: "unidade" as const }
      : null;
  };
  const lerPeso = () => {
    const achado = new RegExp(`${NUMERO}\\s*(g|mg|gramas?)\\b`, "i").exec(texto);
    if (!achado) return null;
    const unidade = achado[2].toLowerCase().startsWith("m") ? "mg" : "g";
    return { valor: paraNumero(achado[1]) * UNIDADES_PESO[unidade] * multiplicador, tipo: "peso" as const };
  };

  return preferir === "peso" ? (lerPeso() ?? lerContavel()) : (lerContavel() ?? lerPeso());
}

// "Porções por embalagem: 30" — quando o próprio rótulo já diz, essa é a
// fonte melhor, porque veio do cadastro e não de conta nossa.
function lerPorcoesPorEmbalagem(texto: string): number | null {
  const achado = new RegExp(`por[çc][õo]es?\\s*por\\s*embalagem[:\\s]*${NUMERO}`, "i").exec(texto);
  return achado ? paraNumero(achado[1]) : null;
}

export interface DuracaoDoPote {
  dias: number;
  /** De onde saiu o número, para exibir a procedência a quem cadastra. */
  origem: "rotulo" | "calculo";
}

export function calcularDuracaoDoPote(input: {
  apresentacao: string | null;
  modoDeUso: string | null;
  informacaoNutricional: string | null;
}): DuracaoDoPote | null {
  const { apresentacao, modoDeUso, informacaoNutricional } = input;

  if (modoDeUso && temFaixa(modoDeUso)) return null;

  if (apresentacao && modoDeUso) {
    const pote = lerApresentacao(apresentacao);
    const dose = pote ? lerDoseDiaria(modoDeUso, pote.tipo) : null;
    if (pote && dose && dose.valor > 0 && pote.tipo === dose.tipo) {
      const dias = pote.valor / dose.valor;
      if (Number.isInteger(dias) && dias > 0) return { dias, origem: "calculo" };
      return null;
    }
  }

  if (informacaoNutricional) {
    const porcoes = lerPorcoesPorEmbalagem(informacaoNutricional);
    if (porcoes && Number.isInteger(porcoes) && porcoes > 0) {
      return { dias: porcoes, origem: "rotulo" };
    }
  }

  return null;
}

export function formatarDuracao(duracao: DuracaoDoPote): string {
  return duracao.dias === 1 ? "1 dia de uso" : `${duracao.dias} dias de uso`;
}
