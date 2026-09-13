#!/usr/bin/env node
/**
 * PreToolUse guard: recusa comandos de shell que leiam arquivo de segredo
 * (.env, .env.local, secrets/) e devolvam o conteúdo para o contexto.
 *
 * Por que existe: o `deny` de .claude/settings.json cobre apenas a ferramenta
 * Read. Com `defaultMode: bypassPermissions`, um único `cat .env.local`
 * colocava SUPABASE_SECRET_KEY e SUPABASE_ACCESS_TOKEN dentro da conversa sem
 * nenhuma confirmação — buraco encontrado na auditoria do harness em
 * 13/09/2026. Este hook fecha o mesmo alvo pela porta do Bash.
 *
 * Deliberadamente NÃO bloqueia o que apenas *usa* as variáveis sem imprimir o
 * arquivo (`source .env.local`, `set -a`, `dotenv`), porque é assim que os
 * scripts do projeto carregam a configuração para falar com a Supabase.
 * O alvo é a leitura que despeja o conteúdo, não o carregamento.
 *
 * Ligar em .claude/settings.json, PreToolUse, matcher "Bash".
 * Falha aberto (exit 0) em qualquer erro de I/O ou parse.
 */
import fs from "node:fs";

/** @returns {string} */
function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

/** @type {any} */
let event = {};
try {
  event = JSON.parse(readStdin() || "{}");
} catch {
  process.exit(0);
}

const command = /** @type {string} */ (event?.tool_input?.command ?? "");
if (!command) process.exit(0);

// Só interessa quando o comando cita um arquivo de segredo. `.env.example` é
// template versionado, só com placeholder, e fica de fora de propósito — daí o
// lookahead vir logo depois de `.env`, antes do sufixo opcional: colocado no
// fim, ele deixava `.env.example` casar (o próprio sufixo consumia o
// `.example`, e não sobrava nada para o lookahead recusar).
// O `@` na classe inicial cobre `curl -d @.env.local`, que é upload do arquivo
// para fora — o pior caso, e o que passava batido sem ele.
const CITA_SEGREDO =
  /(^|[\s"'=/@])\.env(?!\.example\b)(\.[A-Za-z0-9_-]+)?\b|(^|[\s"'/@])secrets\//;
if (!CITA_SEGREDO.test(command)) process.exit(0);

// Formas de despejar conteúdo. Inclui interpretadores porque `python -c
// "print(open('.env.local').read())"` contorna qualquer lista de prefixo.
const DESPEJA_CONTEUDO =
  /\b(cat|bat|less|more|head|tail|nl|od|xxd|strings|grep|egrep|fgrep|rg|ag|ack|awk|sed|cut|sort|uniq|tr|tee|cp|mv|rsync|scp|curl|wget|base64|python3?|node|ruby|perl|php)\b/;

// A decisão é por SEGMENTO, não pela linha inteira. O padrão legítimo deste
// projeto é `set -a && source .env.local && set +a && curl ...`: ali o `.env`
// e o `curl` existem na mesma linha, mas em segmentos diferentes — o arquivo é
// carregado, nunca impresso. Olhar a linha toda condenaria esse uso, que é
// justamente como os scripts falam com a Supabase.
const segmentos = command.split(/\|\||&&|[;|\n]/);
const segmentoPerigoso = segmentos.find(
  (seg) => CITA_SEGREDO.test(seg) && DESPEJA_CONTEUDO.test(seg),
);

if (!segmentoPerigoso) process.exit(0);

const permissionDecisionReason = [
  "guard-env-read: recusado — este comando leria um arquivo de segredo e o",
  "conteúdo cairia dentro da conversa.",
  "",
  "Neste projeto o .env.local guarda SUPABASE_SECRET_KEY (chave de serviço, ignora",
  "RLS) e SUPABASE_ACCESS_TOKEN (PAT da Management API). Uma vez no contexto, não",
  "há como retirá-los de lá.",
  "",
  "Para USAR as variáveis sem expor o valor, carregue em vez de imprimir:",
  "  set -a && source .env.local && set +a && <seu comando>",
  "",
  "Para conferir apenas se o arquivo existe:",
  "  test -f .env.local && echo presente",
  "",
  "Os NOMES das chaves esperadas estão em .env.example, que é versionado e não",
  "guarda valor nenhum — esse pode ser lido à vontade.",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason,
    },
  }),
);

process.exit(0);
