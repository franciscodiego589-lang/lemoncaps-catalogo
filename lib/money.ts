// Dinheiro em CENTAVOS (inteiro). O banco guarda tudo em centavos para nunca
// depender de ponto flutuante. Estes helpers são a única fronteira de
// conversão: exibir divide por 100, gravar multiplica por 100 com
// arredondamento correto. Nada de `preco * 1.3` solto no código.

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// 1690 -> "R$ 16,90"
export function centsToBRL(cents: number): string {
  return BRL.format(cents / 100);
}

// 1690 -> "16,90" (sem símbolo, para dentro de campos)
export function centsToPlain(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

// "16,90" ou "16.90" ou "R$ 16,90" -> 1690. Retorna null se não for número.
//
// A conversão é por STRING, nunca `parseFloat(x) * 100`. O motivo é concreto,
// medido em 13/09/2026 na versão anterior desta função:
//
//   "8,165" -> 816  (8.165 * 100 dá 816.4999999999999 em ponto flutuante)
//   "4,205" -> 421  (4.205 * 100 dá 420.50000000000006)
//   "1,005" -> 100  (perde meio centavo)
//
// O sentido do arredondamento dependia de como o binário caiu, e este número
// alimenta custo, preço e o profit_cents do orçamento multiplicado pela
// quantidade de potes — com mínimo de 100 e pedidos de 10.000, o erro de
// centavo vira dezenas de reais de margem errada. O AGENTS.md proíbe ponto
// flutuante binário em dinheiro; esta borda de entrada era a última que usava.
//
// Mais de 2 casas decimais passa a ser RECUSADO (null), não arredondado em
// silêncio: "4,999" virava R$ 5,00 sem o operador perceber. Melhor o campo
// acusar erro do que gravar um valor que ninguém digitou.
export function brlStringToCents(input: string): number | null {
  const cleaned = input
    .replace(/[R$\s ]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "") // remove separador de milhar
    .replace(",", ".");
  if (cleaned === "") return null;

  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null; // 3+ casas decimais caem aqui, de propósito

  const [, sinal, inteiros, decimais = ""] = match;
  const centavos = Number(inteiros) * 100 + Number(decimais.padEnd(2, "0"));
  return sinal === "-" ? -centavos : centavos;
}
