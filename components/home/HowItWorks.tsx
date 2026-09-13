// Descreve só o que o site faz hoje (pedido do dono): escolher no catálogo,
// cotar no carrinho (mínimo 100 potes) e sair de lá com um orçamento para
// copiar, baixar em PDF ou levar para conversa com a equipe. O botão "Falar
// no WhatsApp" da tela de orçamento (components/cart/QuoteSuccess.tsx) só
// aparece quando NEXT_PUBLIC_WHATSAPP_NUMBER estiver configurado — hoje não
// está (.env.local) — por isso o passo 3 não promete um canal específico.
const STEPS = [
  {
    title: "Escolha a fórmula",
    description: "Veja composição por dose, modo de uso e preço de cada fórmula no catálogo completo.",
  },
  {
    title: "Monte a cotação",
    description: "Adicione ao carrinho a partir de 100 potes por fórmula e gere o orçamento.",
  },
  {
    title: "Fale com a gente",
    description: "Copie o pedido ou baixe o PDF do orçamento e alinhe os próximos passos com a nossa equipe.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="lc-home-section" aria-labelledby="lc-home-steps-title">
      <div className="lc-home-section-head">
        <h2 id="lc-home-steps-title">Como funciona</h2>
        <p>Do catálogo ao orçamento, em três passos.</p>
      </div>

      <ol className="lc-home-steps">
        {STEPS.map((step) => (
          <li className="lc-home-step" key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
