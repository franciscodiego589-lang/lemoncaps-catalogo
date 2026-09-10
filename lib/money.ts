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
export function brlStringToCents(input: string): number | null {
  const cleaned = input
    .replace(/[R$\s ]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "") // remove separador de milhar
    .replace(",", ".");
  if (cleaned === "" || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Math.round(parseFloat(cleaned) * 100);
}
