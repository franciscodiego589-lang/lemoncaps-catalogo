import { Mail } from "lucide-react";

import { MANUFACTURER_INFO } from "@/lib/catalog/regulatory-info";

// DECISÃO DO DONO em 14/09/2026 — os botões de WhatsApp saíram do site inteiro.
// Motivo: quem chega ao catálogo já falou com o comercial antes, então o botão
// não abria um canal novo, só repetia um contato que já existe. Isto reverte a
// correção do mesmo dia que havia tornado o WhatsApp o CTA primário aqui.
// O e-mail volta a ser a ação principal — é canal real e conferido, vindo de
// lib/catalog/regulatory-info.ts. Com a saída do botão, a variável
// NEXT_PUBLIC_WHATSAPP_NUMBER deixa de ser necessária nesta página.
const EMAIL_SUBJECT = "Fabricação em marca própria";

export function ManufacturingContact() {
  return (
    <section className="lc-home-section" aria-labelledby="lc-fab-contact-title">
      <div className="lc-fab-contact">
        <h2 id="lc-fab-contact-title">Vamos conversar sobre a sua linha</h2>
        <p>
          Conte qual produto você quer fabricar, em qual formato e para qual público. Respondemos com os próximos
          passos.
        </p>

        <div className="lc-fab-contact-actions">
          <a
            href={`mailto:${MANUFACTURER_INFO.sac}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
            className="lc-btn lc-btn-primary lc-btn-icon-inline lc-fab-contact-btn"
          >
            <Mail size={18} aria-hidden="true" />
            {MANUFACTURER_INFO.sac}
          </a>
        </div>
      </div>
    </section>
  );
}
