// Validação de código de barras GTIN (EAN-13 na unidade de venda, DUN-14 na caixa
// de despacho). Função pura, sem dependência de React, de banco nem de navegador:
// roda igual no formulário do admin, na Server Action e em teste isolado.
//
// É a MESMA regra que private.is_valid_gtin aplica no banco
// (supabase/migrations/20260916000000_pacote_tecnico_e_assinatura_ficha.sql). A
// duplicação é deliberada e das boas: o banco é o backstop que ninguém contorna, e
// esta cópia existe só para o erro aparecer no campo certo, em português, antes da
// viagem ao servidor. Se um dia a regra mudar (não vai: é padrão GS1 fechado), os dois
// lados mudam juntos.
//
// Por que BLOQUEAR e não só avisar: o dígito verificador é aritmética fechada, não
// julgamento. Código com verificador errado nenhum leitor de loja lê - publicar isso no
// catálogo empurra o erro para dentro do cliente. E bloquear não atrapalha quem ainda
// não tem o código: o campo é opcional, fica em branco.

export const EAN13_LENGTH = 13;
export const DUN14_LENGTH = 14;

// Algoritmo GTIN da GS1: percorre da direita para a esquerda a partir do dígito
// vizinho ao verificador, multiplicando alternadamente por 3 e por 1; o verificador é
// o que falta para o próximo múltiplo de 10. Vale igual para GTIN-13 e GTIN-14 - o que
// muda é só o comprimento.
export function isValidGtin(code: string, length: number): boolean {
  if (!new RegExp(`^[0-9]{${length}}$`).test(code)) return false;

  let sum = 0;
  for (let i = 1; i < length; i += 1) {
    const digit = Number(code[length - 1 - i]);
    sum += digit * (i % 2 === 1 ? 3 : 1);
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(code[length - 1]);
}

export function isValidEan13(code: string): boolean {
  return isValidGtin(code, EAN13_LENGTH);
}

export function isValidDun14(code: string): boolean {
  return isValidGtin(code, DUN14_LENGTH);
}
