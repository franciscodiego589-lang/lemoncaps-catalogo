import type { Metadata } from "next";

import { AnimatedBackground } from "@/components/catalog/AnimatedBackground";
import { CompanyClosing } from "@/components/home/CompanyClosing";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { FormatCapabilities } from "@/components/manufacturing/FormatCapabilities";
import { KeyFigures } from "@/components/manufacturing/KeyFigures";
import { ManufacturingContact } from "@/components/manufacturing/ManufacturingContact";
import { ManufacturingHero } from "@/components/manufacturing/ManufacturingHero";
import { ManufacturingProcess } from "@/components/manufacturing/ManufacturingProcess";
import { RegulatoryRigor } from "@/components/manufacturing/RegulatoryRigor";
import { SegmentsServed } from "@/components/manufacturing/SegmentsServed";
import { StartingPoint } from "@/components/manufacturing/StartingPoint";
import { computeManufacturingStats } from "@/lib/catalog/manufacturing-stats";
import { DEFAULT_BACKGROUND } from "@/lib/catalog/segment-visuals";
import { getCatalogData } from "@/lib/data/formulas";
import { getIngredientBankStats } from "@/lib/data/ingredient-bank";

export const metadata: Metadata = {
  title: "Lemon Caps - Fabricação de suplementos em marca própria",
  description:
    "Indústria de suplementos em Cuiabá-MT. Fabricamos a sua linha em marca própria (private label) em cápsula, pó solúvel, goma e líquido. Comece por uma fórmula pronta do catálogo ou desenvolva a sua.",
};

// =============================================================================
// POR QUE A RAIZ DO SITE É A PÁGINA DE FABRICAÇÃO — leia antes de "consertar"
// =============================================================================
// Decisão do dono, 13/09/2026, com estas palavras: "o cliente entra na página
// de apresentação e dela parte pro catálogo". O link que a Lemon Caps divulga
// aponta para a raiz, e é a fabricação em marca própria — o negócio de maior
// valor da fábrica — que precisa ser a primeira tela.
//
// Até esta data havia duas páginas: uma landing institucional em / e uma página
// de fabricação em /fabricacao, criada horas antes. As duas diziam metade das
// mesmas coisas (as duas tinham um "como funciona" e as duas mostravam números
// do catálogo). Viraram uma só, aqui.
//
// O conteúdo foi MOVIDO para cá, e /fabricacao virou redirecionamento
// permanente para / (ver next.config.ts). Não é um detalhe de gosto:
//
//   - A raiz responde com conteúdo, nunca com um salto para outro endereço —
//     era exigência expressa do dono, porque é a raiz que ele divulga.
//   - Servir o mesmo conteúdo em dois endereços dividiria o site aos olhos de
//     busca (conteúdo duplicado) e daria dois links diferentes para a mesma
//     coisa em conversa comercial. Um endereço, um conteúdo.
//   - O redirecionamento no next.config.ts (e não uma página que chama
//     redirect()) resolve antes do roteamento: quem tiver o link antigo é
//     levado sem renderizar React nem consultar o banco.
//
// O que sobrou da landing antiga está registrado no relatório da tarefa; o que
// veio para cá foi o rodapé institucional (CompanyClosing, logo abaixo) e a
// faixa de preço por pote, hoje dentro de StartingPoint.
//
// -----------------------------------------------------------------------------
// O QUE NÃO ENTRA NESTA PÁGINA — e por quê
// -----------------------------------------------------------------------------
// Regra de exatidão do projeto (AGENTS.md e o CLAUDE.md do dono): página de
// indústria regulada não recebe número plausível. Cada item abaixo deixaria a
// página comercialmente mais forte, e nenhum tem fonte primária hoje. Entram
// quando o dono confirmar, um a um, nunca por estimativa:
//
// - Capacidade produtiva mensal (potes/mês, turnos, linhas).
// - Prazo de produção e de entrega — por isso ManufacturingProcess descreve as
//   etapas sem citar prazo, e sem os sinônimos ("rápido", "ágil") que são a
//   mesma promessa sem número.
// - Certificações (BPF/GMP, ISO, HACCP): nenhuma confirmada em documento.
// - Área da fábrica (m²) e número de funcionários.
// - Tempo de mercado / ano de fundação.
// - Política de exclusividade de fórmula por cliente.
// - Custo e prazo de desenvolvimento de fórmula nova.
// - Prazo de validade (shelf life) dos produtos.
// - Depoimentos, logotipos e prêmios.
// - Nome das marcas de terceiros já atendidas: existem sete confirmadas nas
//   artes de rótulo, mas nome de cliente é informação confidencial e o dono NÃO
//   autorizou divulgar. Nem o número aparece aqui: sem poder nomear, "sete
//   marcas" seria uma afirmação que o visitante não tem como conferir — e
//   afirmação não verificável é exatamente o que esta página evita. Fica
//   guardado para a conversa comercial.
//
// TODO número exibido sai do banco nesta mesma requisição (fórmulas ativas,
// formatos, apresentações, segmentos, preços, pedido mínimo, insumos
// cadastrados) ou de lib/catalog/regulatory-info.ts, cuja procedência está
// documentada linha a linha lá. Nenhum é digitado no JSX.
//
// -----------------------------------------------------------------------------
// RITMO DA PÁGINA (a crítica do dono a outra tela deste projeto foi "está muito
// simples": blocos de peso igual, um atrás do outro). Aqui o peso varia de
// propósito, e as faixas .lc-fab-band alternam o fundo para marcar os cortes:
//
//   herói grande  ->  painel de números (sólido, alto contraste)
//   ->  FAIXA: os dois caminhos, que é o coração da decisão do visitante
//   ->  o que a fábrica já faz hoje (formatos + segmentos)
//   ->  FAIXA: como funciona
//   ->  rigor regulatório
//   ->  FAIXA: chamada final
//   ->  rodapé institucional
// =============================================================================
export default async function Home() {
  // Em paralelo: as duas leituras são independentes e já vêm cacheadas por 5
  // minutos cada (ver lib/data/formulas.ts e lib/data/ingredient-bank.ts).
  const [{ segments, formulas }, ingredientBank] = await Promise.all([
    getCatalogData(),
    getIngredientBankStats(),
  ]);
  const stats = computeManufacturingStats(formulas, segments);

  return (
    <>
      {/* O fundo vivo é o que faz a barra de topo virar vidro de verdade. Ela
          já usava GlassSurface (backdrop-filter), mas vidro só é vidro se
          houver algo atrás para borrar: sobre o branco puro o blur não tinha o
          que processar e a barra aparecia como um painel chapado. É a mesma
          lição que o admin já registrou em .lc-admin-shell.

          Usa as cores padrão do catálogo (DEFAULT_BACKGROUND), e não uma
          paleta própria: a home é a porta de entrada e o catálogo é o destino
          — as duas telas passam a ler como um sistema só. Aqui as cores são
          fixas porque não há segmento selecionado para trocá-las. */}
      <AnimatedBackground colors={DEFAULT_BACKGROUND} />
      <HomeTopBar />
      <main id="main-content">
        <ManufacturingHero />
        <KeyFigures stats={stats} ingredientBank={ingredientBank} />

        <div className="lc-fab-band">
          <StartingPoint
            ingredientBank={ingredientBank}
            priceMinCents={stats.priceMinCents}
            priceMaxCents={stats.priceMaxCents}
          />
        </div>

        <FormatCapabilities formats={stats.formats} />
        <SegmentsServed segmentNames={stats.segmentNames} />

        <div className="lc-fab-band">
          <ManufacturingProcess />
        </div>

        <RegulatoryRigor />

        <div className="lc-fab-band">
          <ManufacturingContact />
        </div>
      </main>
      {/* Rodapé institucional herdado da landing antiga: razão social, CNPJ,
          endereço, farmacêutico e SAC vêm de lib/catalog/regulatory-info.ts, e
          o CTA dele é o terceiro e último caminho visível para o catálogo —
          primeira dobra, meio da página e fim, como o dono pediu. */}
      <CompanyClosing />
    </>
  );
}
