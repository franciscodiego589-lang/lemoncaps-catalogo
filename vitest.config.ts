import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Suíte de teste do catálogo. Roda em Node puro: os módulos cobertos hoje são
// lógica pura (dinheiro, CSV, URL, validação, formatação), sem DOM nem banco.
// O plugin de paths lê o alias "@/*" que já existe no tsconfig.json, para o
// teste importar exatamente como o código de produção importa.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
