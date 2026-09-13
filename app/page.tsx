import type { Metadata } from "next";

import { CompanyClosing } from "@/components/home/CompanyClosing";
import { computeCatalogStats } from "@/components/home/catalog-stats";
import { Hero } from "@/components/home/Hero";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProofStats } from "@/components/home/ProofStats";
import { getCatalogData } from "@/lib/data/formulas";

export const metadata: Metadata = {
  title: "Lemon Caps - Fabricação de suplementos em marca própria",
  description:
    "Indústria de suplementos em Cuiabá-MT. Catálogo de fórmulas prontas, dossiê técnico e pedido a partir de 100 potes por fórmula.",
};

// NÃO incluído nesta landing por falta de dado confirmado (regra de exatidão
// do projeto, ver AGENTS.md e o CLAUDE.md do dono) — cada item abaixo só entra
// quando existir fonte primária para conferir, nunca por estimativa:
// - Ano de fundação / tempo de mercado.
// - Número de clientes atendidos.
// - Capacidade produtiva (potes/mês, turnos, linhas de produção).
// - Prazo de entrega / lead time de produção.
// - Certificações (ISO, BPF/GMP, HACCP) — nenhuma confirmada em documento oficial.
// - Depoimentos de clientes.
// - Logotipos de clientes/marcas atendidas.
// - Número de funcionários.
// - Metragem da fábrica (m²).
// - Prêmios ou reconhecimentos do setor.
export default async function Home() {
  const { segments, formulas } = await getCatalogData();
  const stats = computeCatalogStats(formulas, segments);

  return (
    <>
      <HomeTopBar />
      <main>
        <Hero />
        <ProofStats stats={stats} />
        <HowItWorks />
      </main>
      <CompanyClosing />
    </>
  );
}
