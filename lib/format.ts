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
