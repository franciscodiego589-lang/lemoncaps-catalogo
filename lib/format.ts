// Lista no padrão do português ("a, b e c"). Nasceu em
// components/home/catalog-stats.ts, junto da landing antiga; subiu para cá em
// 13/09/2026, quando a página de apresentação (/) passou a precisar da mesma
// junção para listar os formatos de produção. Uma cópia em cada lugar era o
// caminho curto e o errado: duas frases que precisam sair idênticas na tela não
// podem depender de duas implementações.
export function joinPortugueseList(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

// Gera slug de URL a partir de um nome. Igual ao usado na migração do
// catálogo: minúsculas, sem acento, espaços e símbolos viram hífen.
// "MORO SLIM" -> "moro-slim"; "Multi Vitta - Gestante" -> "multi-vitta-gestante"
export function slugify(name: string): string {
  const noAccent = name.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  return (
    noAccent
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-")
      .toLowerCase() || "produto"
  );
}
