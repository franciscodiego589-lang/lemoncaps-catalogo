import Link from "next/link";
import { ChevronRight, Coins, ImageOff, ListChecks, ShieldAlert, ShieldCheck, Tag, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { AdminDashboardPendenciaDTO, PendenciaSeveridade } from "@/lib/data/admin";

// Painel de pendências do cadastro - a parte do /admin que faltava.
//
// A tela antiga só dizia quantas fórmulas existiam. Um painel de gestão tem de
// dizer o que está FALTANDO: hoje há fórmula ativa no catálogo sem foto, sem
// advertência de rótulo e sem custo lançado, e nada disso aparecia em lugar
// nenhum - só se descobria abrindo produto por produto.
//
// Acessibilidade: a gravidade NUNCA é comunicada só pela cor. Cada linha traz
// (1) um ícone próprio, (2) a palavra "Urgente" ou "Atenção" escrita, e (3) a
// contagem "8 de 27" em texto. A barra de proporção é reforço visual e por
// isso fica aria-hidden - o leitor de tela já ouviu o mesmo número em texto,
// e repeti-lo só atrapalharia.

const ICONE_POR_PENDENCIA: Record<AdminDashboardPendenciaDTO["id"], LucideIcon> = {
  "sem-custo": Coins,
  "sem-foto": ImageOff,
  "sem-ingredientes": ListChecks,
  "sem-advertencia": TriangleAlert,
  "sem-selo": ShieldAlert,
  "sem-preco": Tag,
};

const ROTULO_SEVERIDADE: Record<PendenciaSeveridade, string> = {
  urgente: "Urgente",
  atencao: "Atenção",
};

interface DashboardPendenciasProps {
  pendencias: AdminDashboardPendenciaDTO[];
}

export function DashboardPendencias({ pendencias }: DashboardPendenciasProps) {
  const urgentes = pendencias.filter((p) => p.severity === "urgente").length;

  return (
    <section className="lc-admin-panel lc-admin-pend" aria-labelledby="lc-admin-pend-titulo">
      <div className="lc-admin-panel-head">
        <h2 id="lc-admin-pend-titulo">Pendências do cadastro</h2>
        {pendencias.length > 0 ? (
          <span className="lc-admin-panel-head-meta">
            {pendencias.length} {pendencias.length === 1 ? "ponto aberto" : "pontos abertos"}
            {urgentes > 0 ? ` · ${urgentes} urgente${urgentes === 1 ? "" : "s"}` : ""}
          </span>
        ) : null}
      </div>

      {pendencias.length === 0 ? (
        <p className="lc-admin-pend-limpo">
          <ShieldCheck size={18} aria-hidden="true" />
          Nenhuma pendência nas verificações desta tela.
        </p>
      ) : (
        <ul className="lc-admin-pend-lista">
          {pendencias.map((pendencia) => {
            const Icone = ICONE_POR_PENDENCIA[pendencia.id];
            // Piso de 4% para a barra nunca sumir quando a fatia é mínima:
            // uma pendência de 1 em 70 continua tendo de ser vista.
            const fatia = pendencia.total > 0 ? Math.max(4, Math.round((pendencia.count / pendencia.total) * 100)) : 100;

            return (
              <li key={pendencia.id} className={`lc-admin-pend-item lc-admin-pend-item--${pendencia.severity}`}>
                <span className="lc-admin-pend-icone" aria-hidden="true">
                  <Icone size={18} />
                </span>

                <div className="lc-admin-pend-texto">
                  <p className="lc-admin-pend-titulo">
                    {pendencia.label}
                    <span className="lc-admin-pend-selo">{ROTULO_SEVERIDADE[pendencia.severity]}</span>
                  </p>
                  <p className="lc-admin-pend-hint">{pendencia.hint}</p>
                </div>

                <div className="lc-admin-pend-medida">
                  <span className="lc-admin-pend-numero">
                    {pendencia.count}
                    <span className="lc-admin-pend-de"> de {pendencia.total}</span>
                  </span>
                  <span className="lc-admin-pend-barra" aria-hidden="true">
                    <span className="lc-admin-pend-barra-preenchida" style={{ width: `${fatia}%` }} />
                  </span>
                </div>

                <Link href={pendencia.href} className="lc-admin-pend-acao">
                  {pendencia.hrefLabel}
                  <ChevronRight size={15} aria-hidden="true" />
                  <span className="lc-sr-only"> — {pendencia.label.toLowerCase()}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
