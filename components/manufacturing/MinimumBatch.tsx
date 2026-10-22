import { Boxes } from "lucide-react";

interface MinimumBatchProps {
  /** Pedido mínimo por fórmula, em potes — igual em todas as fórmulas ativas. */
  minimumOrderPotes: number;
}

// ============================================================================
// SEM ROTA ATIVA desde 13/09/2026 — não é importado por nenhuma página.
// O raciocínio abaixo continua valendo e por isso o lote mínimo não sumiu: ele
// SUBIU. Quando /fabricacao virou a porta de entrada do site (ver app/page.tsx),
// o número foi para a faixa da primeira dobra
// (components/manufacturing/KeyFigures.tsx), junto com a ressalva que não pode
// faltar — o mínimo é por fórmula, não por pedido. Mantê-lo também aqui, no
// meio da página, faria o visitante ler o mesmo número duas vezes.
// Guardado no repositório em vez de apagado por ordem do dono.
// ============================================================================

// É a primeira pergunta de quem procura fabricante, então tem seção própria em
// vez de virar nota de rodapé: quem não consegue esse volume descobre agora, e
// quem consegue para de procurar.
//
// O número vem do banco (minimum_order_potes de cada fórmula) e só é exibido
// quando TODAS as fórmulas ativas praticam o mesmo mínimo — a checagem está em
// lib/catalog/manufacturing-stats.ts. Havendo divergência, esta seção some em
// vez de escolher um número por conta própria.
//
// "por fórmula" é a parte que não pode faltar: o mínimo é por fórmula, não por
// pedido. Quem quer três produtos diferentes precisa do mínimo em cada um, e
// descobrir isso depois seria descobrir tarde.
export function MinimumBatch({ minimumOrderPotes }: MinimumBatchProps) {
  return (
    <section className="lc-home-section" aria-labelledby="lc-fab-batch-title">
      <div className="lc-fab-batch">
        <span className="lc-fab-batch-icon" aria-hidden="true">
          <Boxes size={26} />
        </span>
        <div className="lc-fab-batch-text">
          <h2 id="lc-fab-batch-title">Lote mínimo: {minimumOrderPotes} potes por fórmula</h2>
          <p>
            É o mínimo praticado em todas as fórmulas do nosso catálogo. O mínimo vale para cada fórmula
            separadamente — uma linha com três produtos diferentes parte de {minimumOrderPotes} potes de cada.
          </p>
        </div>
      </div>
    </section>
  );
}
