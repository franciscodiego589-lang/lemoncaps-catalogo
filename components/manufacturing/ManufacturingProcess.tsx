// As etapas de um projeto de marca própria, na ordem em que acontecem.
//
// REGRA DE EXATIDÃO, e é a mais importante desta seção: NENHUMA etapa cita
// prazo, porque prazo de produção e de entrega não existe confirmado em fonte
// nenhuma (ver o bloco de pendências em app/page.tsx). Um "em até X
// dias" aqui seria promessa comercial inventada — e quem lê uma página de
// indústria lê prazo como compromisso. Nada de "rápido", "ágil" ou "curto"
// também: são a mesma promessa sem número.
//
// Cada etapa descreve só o que a própria operação já faz e o site comprova:
// catálogo de fórmulas prontas, banco de insumos, apresentações em linha,
// pedido mínimo por fórmula. Etapa sobre a qual não há certeza (amostra/piloto,
// registro de marca, teste de estabilidade) ficou de fora inteira.
const STEPS = [
  {
    title: "Escolha da fórmula",
    description:
      "Comece por uma das fórmulas já desenvolvidas do catálogo ou desenvolva a sua a partir do nosso banco de matérias-primas.",
  },
  {
    title: "Definição da apresentação",
    description: "Formato, quantidade por pote e sabor, dentro do que a fábrica já produz.",
  },
  {
    title: "Arte do rótulo",
    description: "O rótulo sai com a sua marca, com os dizeres de rotulagem exigidos para suplemento alimentar.",
  },
  {
    title: "Produção",
    description: "Fabricação do lote sob responsabilidade técnica do nosso farmacêutico.",
  },
  {
    title: "Entrega",
    description: "O lote pronto e rotulado segue para o endereço que você indicar.",
  },
] as const;

export function ManufacturingProcess() {
  return (
    <section className="lc-home-section" aria-labelledby="lc-fab-process-title">
      <div className="lc-home-section-head">
        <h2 id="lc-fab-process-title">Como funciona</h2>
        <p>Da escolha da fórmula ao lote entregue com a sua marca.</p>
      </div>

      <ol className="lc-home-steps lc-fab-steps">
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
