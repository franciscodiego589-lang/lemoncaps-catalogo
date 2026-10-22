// ============================================================================
// SEM ROTA ATIVA desde 13/09/2026 — não é importado por nenhuma página.
// Era o "Como funciona" (3 passos: catálogo -> carrinho -> orçamento) da landing
// institucional que ficava em /. A raiz passou a ser a apresentação da fábrica,
// que já tem um "Como funciona" próprio — o de
// components/manufacturing/ManufacturingProcess.tsx, com as 5 etapas de um
// projeto de marca própria. Dois blocos com o mesmo título e o mesmo assunto na
// mesma página fariam o visitante ler a mesma coisa duas vezes, então ficou o
// que descreve a INDÚSTRIA, não o site.
// O que este tinha de exclusivo (montar cotação no carrinho e sair com o
// orçamento para copiar ou baixar em PDF) foi salvo dentro do cartão de fórmula
// pronta, em components/manufacturing/StartingPoint.tsx.
// Guardado no repositório em vez de apagado por ordem do dono.
// ============================================================================

// Descreve só o que o site faz hoje (pedido do dono): escolher no catálogo,
// cotar no carrinho (mínimo 100 potes) e sair de lá com um orçamento para
// copiar, baixar em PDF ou levar para conversa com a equipe. O passo 3 não
// promete canal nenhum de propósito: em 14/09/2026 o dono tirou os botões de
// WhatsApp do site ("o cliente já entra direto no catálogo depois de entrar em
// contato com o comercial"), então a tela de orçamento entrega o documento e
// quem já é atendido usa o contato que tem.
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
