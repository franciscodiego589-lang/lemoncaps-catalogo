import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MANUFACTURER_INFO } from "@/lib/catalog/regulatory-info";
import { DeveloperCredit } from "@/components/common/DeveloperCredit";

// Rodapé institucional da landing: mesmos dados de fabricante já usados em
// todo dossiê técnico (lib/catalog/regulatory-info.ts — procedência conferida
// linha a linha contra os Dizeres de Rotulagem oficiais, ver o comentário
// daquele arquivo). Nenhum dado novo é digitado aqui, só reaproveitado.
export function CompanyClosing() {
  return (
    <footer className="lc-footer">
      <div className="lc-home-footer">
        <dl className="lc-home-facts">
          <div className="lc-home-fact">
            <dt>Razão social</dt>
            <dd>{MANUFACTURER_INFO.companyName}</dd>
          </div>
          <div className="lc-home-fact">
            <dt>CNPJ</dt>
            <dd>{MANUFACTURER_INFO.cnpj}</dd>
          </div>
          <div className="lc-home-fact">
            <dt>Endereço</dt>
            <dd>{MANUFACTURER_INFO.address}</dd>
          </div>
          <div className="lc-home-fact">
            <dt>Farmacêutico responsável</dt>
            <dd>{MANUFACTURER_INFO.pharmacist}</dd>
          </div>
          <div className="lc-home-fact">
            <dt>SAC</dt>
            <dd>{MANUFACTURER_INFO.sac}</dd>
          </div>
        </dl>

        <div className="lc-home-footer-cta">
          <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline">
            Ver catálogo de fórmulas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <p>
        © 2026 <span translate="no">Lemon Caps</span> - Indústria de Suplementos e Nutracêuticos
      </p>
      <DeveloperCredit />
    </footer>
  );
}
