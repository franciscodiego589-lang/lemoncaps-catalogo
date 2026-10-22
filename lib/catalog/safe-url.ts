// Endereço externo que veio do BANCO, não do código, antes de virar href.
//
// `compliance_source` é digitado no admin e renderizado como link na página
// pública da fórmula e no PDF do dossiê. Um valor como `javascript:...` vira
// código executado no clique de quem visita o catálogo — o navegador não
// distingue, o React não escapa protocolo de href, e o link do PDF também
// abre o que estiver escrito ali.
//
// A regra é a mais estreita que serve ao caso: só http e https passam. Endereço
// vazio, malformado ou de qualquer outro protocolo (javascript:, data:, file:,
// vbscript:) devolve null, e quem chama some com o link em vez de renderizar
// um destino que não dá para confiar. Nunca devolve "#" nem string vazia: o
// link tem de sumir, não virar um link quebrado que parece funcionar.
const PROTOCOLOS_PERMITIDOS = ["http:", "https:"];

export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value.trim());
    return PROTOCOLOS_PERMITIDOS.includes(parsed.protocol) ? parsed.href : null;
  } catch {
    // URL relativa ou lixo: não serve como destino externo.
    return null;
  }
}
