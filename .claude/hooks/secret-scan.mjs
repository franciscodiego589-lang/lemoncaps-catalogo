#!/usr/bin/env node
/**
 * PreToolUse guard (opt-in): block an Edit/Write/Bash whose payload looks like a
 * committed secret. Exit code 2 blocks the tool call; exit 0 allows it.
 * Wire this in .claude/settings.json under PreToolUse with matcher "Edit|Write|MultiEdit".
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

const ti = event?.tool_input ?? {};
const text = [ti.content, ti.new_string, ti.command]
  .filter((v) => typeof v === "string")
  .join("\n");

const patterns = [
  /AKIA[0-9A-Z]{16}/, // AWS access key id
  /-----BEGIN (?:RSA|EC|OPENSSH|PGP|DSA) PRIVATE KEY-----/,
  /sk-[A-Za-z0-9]{20,}/, // OpenAI-style secret
  /ghp_[A-Za-z0-9]{36}/, // GitHub PAT
  /xox[baprs]-[A-Za-z0-9-]{10,}/, // Slack token
  /AIza[0-9A-Za-z_-]{35}/, // Google API key
  // Supabase: os dois segredos DESTE projeto. A lista que veio do template
  // não cobria nenhum dos dois, então justamente as credenciais que o
  // catálogo não pode vazar passavam pelo scanner sem disparar nada.
  // Formatos conferidos em .env.example: sb_secret_... (service role) e
  // sbp_... (PAT da Management API).
  /sb_secret_[A-Za-z0-9_-]{10,}/,
  /sbp_[A-Za-z0-9]{20,}/,
  // JWT: as chaves legadas anon/service_role da Supabase e qualquer token
  // no formato. Três blocos base64url separados por ponto.
  /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
];

for (const re of patterns) {
  if (re.test(text)) {
    process.stderr.write(
      "aia-harness secret-scan: refusing to write an apparent secret. Use an env var in .claude/settings.local.json instead.\n",
    );
    process.exit(2);
  }
}

process.exit(0);
