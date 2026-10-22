// Data relativa curta ("hoje", "ontem", "há 3 dias") para as listas do painel
// administrativo.
//
// Existe porque a lista de leads recentes mostrava só dd/mm/aaaa: para saber
// se um lead tinha chegado agora ou na semana passada era preciso lembrar a
// data de hoje e fazer a conta de cabeça. Num painel cuja função é dizer o que
// pede ação, "há 2 dias" responde na hora o que "11/09/2026" não responde.
//
// O fuso é America/Cuiaba, fixo, pelo mesmo motivo já registrado em
// lib/catalog/regulatory-info.ts: a fábrica e a operação estão em Cuiabá-MT, e
// é o dia de lá que decide se algo é "hoje". Sem fuso fixo, o mesmo lead
// apareceria como "hoje" na máquina do dono e "ontem" no servidor de produção
// (que roda em UTC) toda vez que a hora passasse das 20h de Cuiabá.
//
// A virada é por DIA DE CALENDÁRIO, não por blocos de 24 horas: um lead das
// 23h de ontem é "ontem" às 8h da manhã seguinte, mesmo tendo 9 horas de vida.
// É assim que a pessoa lê a data, e o contrário confundiria.

const FUSO_DA_OPERACAO = "America/Cuiaba";

// en-CA formata como "2026-09-13" — ordenável e trivial de fatiar. O locale
// aqui é só o formato da string interna; nada disto aparece na tela.
const DIA_NO_FUSO = new Intl.DateTimeFormat("en-CA", {
  timeZone: FUSO_DA_OPERACAO,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const DATA_ABSOLUTA = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_DA_OPERACAO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const MS_POR_DIA = 86_400_000;
const DIAS_ATE_VIRAR_DATA_ABSOLUTA = 7;

// Converte o instante para o número de dias desde a época CONTADO NO FUSO DA
// OPERAÇÃO. Date.UTC sobre as partes já traduzidas para Cuiabá dá um número de
// dia estável, imune ao fuso de quem está renderizando.
function diaDeCalendario(data: Date): number {
  const [ano, mes, dia] = DIA_NO_FUSO.format(data).split("-").map(Number);
  return Math.floor(Date.UTC(ano, mes - 1, dia) / MS_POR_DIA);
}

/**
 * Devolve "hoje", "ontem", "há N dias" (até 6 dias) ou a data em dd/mm/aaaa.
 * `agora` é parâmetro para a função continuar pura e testável.
 */
export function dataRelativa(iso: string, agora: Date = new Date()): string {
  const quando = new Date(iso);
  if (Number.isNaN(quando.getTime())) return "";

  const diferenca = diaDeCalendario(agora) - diaDeCalendario(quando);

  // Data no futuro (relógio do servidor atrasado, registro importado): cai na
  // data absoluta em vez de imprimir "há -1 dias".
  if (diferenca < 0) return DATA_ABSOLUTA.format(quando);
  if (diferenca === 0) return "hoje";
  if (diferenca === 1) return "ontem";
  if (diferenca < DIAS_ATE_VIRAR_DATA_ABSOLUTA) return `há ${diferenca} dias`;
  return DATA_ABSOLUTA.format(quando);
}
