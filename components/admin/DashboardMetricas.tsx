import Link from "next/link";
import { Coins, FileText, FlaskConical, Package, TrendingUp, Users } from "lucide-react";

import { QUOTE_STATUS_LABELS } from "@/components/admin/enum-labels";
import type { AdminDashboardDTO } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

// Bloco de indicadores do topo do /admin.
//
// Não é uma grade de quadrados iguais de propósito. A tela anterior tinha dois
// blocos do mesmo tamanho (ativas / inativas) e o olho não sabia onde pousar:
// tudo com o mesmo peso é o mesmo que nada em destaque. Aqui o número que
// sustenta o negócio - quantas fórmulas estão realmente no ar - ocupa o dobro
// da largura e tem o corpo maior; o resto é contexto ao lado dele.
//
// Todo bloco é um link para a tela onde aquele número vive. Além de útil, isso
// resolve o alvo de toque: o cartão inteiro é clicável, muito acima dos 44px
// mínimos, em vez de um "ver mais" minúsculo no rodapé.

interface DashboardMetricasProps {
  dashboard: AdminDashboardDTO;
}

interface MetricaProps {
  href: string;
  icone: React.ReactNode;
  valor: string;
  rotulo: string;
  /** Linha de contexto embaixo do rótulo. Só entra quando há dado real para ela. */
  nota?: string;
  destaque?: boolean;
}

function Metrica({ href, icone, valor, rotulo, nota, destaque = false }: MetricaProps) {
  return (
    <Link href={href} className={`lc-admin-metrica${destaque ? " lc-admin-metrica--destaque" : ""}`}>
      <span className="lc-admin-metrica-icone" aria-hidden="true">
        {icone}
      </span>
      <span className="lc-admin-metrica-valor">{valor}</span>
      <span className="lc-admin-metrica-rotulo">{rotulo}</span>
      {nota ? <span className="lc-admin-metrica-nota">{nota}</span> : null}
    </Link>
  );
}

// "4 abertos · 1 aprovado". Os quatro status do enum aceitam plural com "s"
// simples (aberto/aprovado/recusado/expirado), então não há caso especial.
function resumirStatus(porStatus: AdminDashboardDTO["quotesByStatus"]): string | undefined {
  if (!porStatus || porStatus.length === 0) return undefined;
  return porStatus.map(({ status, count }) => `${count} ${QUOTE_STATUS_LABELS[status].toLowerCase()}${count === 1 ? "" : "s"}`).join(" · ");
}

export function DashboardMetricas({ dashboard }: DashboardMetricasProps) {
  const totalCadastrado = dashboard.activeFormulasCount + dashboard.inactiveFormulasCount;

  // Duas frases, as duas verdadeiras - nunca "0 inativas", que é ruído. Só se
  // fala de fórmula inativa quando existe alguma.
  const notaFormulas =
    dashboard.inactiveFormulasCount > 0
      ? `${totalCadastrado} no cadastro · ${dashboard.inactiveFormulasCount} inativa${dashboard.inactiveFormulasCount === 1 ? "" : "s"}`
      : `todas as ${totalCadastrado} do cadastro estão ativas`;

  return (
    <section className="lc-admin-metricas" aria-labelledby="lc-admin-metricas-titulo">
      <h2 id="lc-admin-metricas-titulo" className="lc-sr-only">
        Indicadores do catálogo
      </h2>

      <Metrica
        destaque
        href="/admin/catalogo"
        icone={<Package size={22} />}
        valor={String(dashboard.activeFormulasCount)}
        rotulo="Fórmulas no ar"
        nota={notaFormulas}
      />

      <Metrica
        href="/admin/insumos"
        icone={<FlaskConical size={18} />}
        valor={String(dashboard.ingredientsCount)}
        rotulo="Insumos"
        nota="disponíveis para compor"
      />

      <Metrica href="/admin/leads" icone={<Users size={18} />} valor={String(dashboard.leadsCount)} rotulo="Leads" nota="pedidos de contato" />

      {/* Bloco de orçamento só existe para quem pode gerenciá-los; para os
          demais o dado nem sai do banco (ver getAdminDashboard). */}
      {dashboard.quotesCount !== null ? (
        <Metrica
          href="/admin/orcamentos"
          icone={<FileText size={18} />}
          valor={String(dashboard.quotesCount)}
          rotulo="Orçamentos"
          nota={resumirStatus(dashboard.quotesByStatus)}
        />
      ) : null}

      {/* Valor cotado vem null quando a soma não pôde ser feita por inteiro.
          Nesse caso o bloco some - melhor faltar do que mostrar um total
          parcial com cara de total. */}
      {dashboard.quotedTotalCents !== null ? (
        <Metrica
          href="/admin/orcamentos"
          icone={<Coins size={18} />}
          valor={centsToBRL(dashboard.quotedTotalCents)}
          rotulo="Valor cotado"
          nota="somando todos os orçamentos"
        />
      ) : null}

      {dashboard.averageQuoteCents !== null ? (
        <Metrica
          href="/admin/orcamentos"
          icone={<TrendingUp size={18} />}
          valor={centsToBRL(dashboard.averageQuoteCents)}
          rotulo="Ticket médio"
          nota="por orçamento"
        />
      ) : null}
    </section>
  );
}
