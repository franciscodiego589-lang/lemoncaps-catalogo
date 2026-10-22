// Regra do DESTAQUE do catálogo (formulas.featured_at, migration 20260916143000).
//
// Mora aqui, e não dentro de um componente, porque a mesma régua é usada em dois
// lugares que não se enxergam: o aviso da lista do admin (servidor, na página) e o
// texto do botão de alternância (cliente). Duas cópias da constante virariam duas
// respostas diferentes para "isto já é destaque demais?".

// Um terço do catálogo ativo. Acima disso, o selo deixa de significar alguma coisa:
// numa grade de 3 colunas, um terço dos produtos é mais do que cabe na primeira tela,
// então o cliente rola e continua vendo "Destaque" - que é exatamente o efeito de não
// haver destaque nenhum. A fração (e não um número fixo) faz a régua acompanhar o
// tamanho do catálogo: hoje são 27 fórmulas ativas, amanhã podem ser 60.
const FRACAO_MAXIMA_DE_DESTAQUES = 1 / 3;

// Piso para catálogo pequeno: com 5 fórmulas, um terço daria 1,67 -> 2, e avisar já no
// segundo destaque seria implicância, não ajuda.
const MINIMO_DE_DESTAQUES_SEM_AVISO = 3;

/**
 * Quantos destaques cabem sem que o aviso apareça, dado o tamanho do catálogo ativo.
 * Nunca é um bloqueio - é o ponto a partir do qual o admin passa a comentar.
 */
export function limiteDeDestaques(totalDeFormulasAtivas: number): number {
  return Math.max(MINIMO_DE_DESTAQUES_SEM_AVISO, Math.floor(totalDeFormulasAtivas * FRACAO_MAXIMA_DE_DESTAQUES));
}

/**
 * Passou do ponto em que destacar mais um começa a diluir os que já existem?
 * Quem chama decide o que fazer com a resposta - a decisão do dono foi AVISAR,
 * nunca impedir: o catálogo é dele, e uma campanha pode legitimamente destacar
 * meia linha de produtos por uma semana.
 */
export function destaquesEmExcesso(quantidadeDestacada: number, totalDeFormulasAtivas: number): boolean {
  return quantidadeDestacada > limiteDeDestaques(totalDeFormulasAtivas);
}

/** Rótulo do selo na vitrine e no admin. Uma palavra, uma fonte só, nunca duas grafias. */
export const ROTULO_DESTAQUE = "Destaque";
