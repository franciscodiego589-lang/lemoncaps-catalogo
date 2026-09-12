"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ModalShell } from "@/components/glass/ModalShell";
import { lineLabel } from "@/lib/catalog/format-catalog";
import { centsToBRL } from "@/lib/money";
import { DEFAULT_MINIMUM_ORDER_POTES, useCartStore } from "@/lib/store/cart";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";

const QUANTITY_STEP = 50;

interface QuoteModalProps {
  formula: FormulaDTO | null;
  segment: SegmentDTO | undefined;
  isOpen: boolean;
  onClose: () => void;
}

// Vidro de verdade — é ação/cromo, não conteúdo denso (ver regra central no
// topo de app/globals.css). Trava de pedido mínimo (100 potes, ou o mínimo
// próprio da fórmula, se algum dia divergir) impede confirmar abaixo dela.
export function QuoteModal({ formula, segment, isOpen, onClose }: QuoteModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const existingQuantity = useCartStore((state) =>
    formula ? state.items.find((item) => item.formulaId === formula.id)?.quantityPotes : undefined,
  );

  const minimum =
    formula && formula.minimumOrderPotes > 0 ? formula.minimumOrderPotes : DEFAULT_MINIMUM_ORDER_POTES;
  const [quantity, setQuantity] = useState(minimum);

  // Reinicializa a quantidade quando o modal abre (ou troca de fórmula) sem
  // usar useEffect: ajustar estado durante a própria renderização, comparando
  // com a "chave de abertura" anterior, é o jeito recomendado pelo React para
  // resetar estado a partir de uma prop — nunca dispara um efeito à toa a
  // cada tecla digitada, e evita o re-render em cascata de um setState dentro
  // de useEffect.
  const openKey = isOpen && formula ? formula.id : null;
  const [lastOpenKey, setLastOpenKey] = useState<string | null>(null);
  if (openKey !== lastOpenKey) {
    setLastOpenKey(openKey);
    if (openKey !== null) {
      setQuantity(existingQuantity ?? minimum);
    }
  }

  if (!formula || formula.listPriceCents == null) return null;

  const priceCents = formula.listPriceCents;
  const isBelowMinimum = quantity < minimum;
  const subtotalCents = Math.max(quantity, 0) * priceCents;

  function handleConfirm() {
    if (formula === null || formula.listPriceCents === null || isBelowMinimum) return;
    addItem({
      formulaId: formula.id,
      slug: formula.slug,
      name: formula.name,
      unitPriceCents: formula.listPriceCents,
      quantityPotes: quantity,
      minimumOrderPotes: minimum,
    });
    onClose();
    toast.success("Adicionado à cotação.");
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      variant="glass"
      title={formula.name}
      subtitle={segment ? `${segment.name} · ${lineLabel(formula.line)}` : lineLabel(formula.line)}
    >
      <div className="lc-quote-price">
        {centsToBRL(priceCents)}
        <small> / pote</small>
      </div>
      <div className="lc-qty-stepper">
        <button
          type="button"
          className="lc-stepper-btn"
          aria-label="Diminuir quantidade"
          onClick={() => setQuantity((current) => Math.max(0, current - QUANTITY_STEP))}
        >
          −
        </button>
        <input
          type="number"
          min={minimum}
          step={QUANTITY_STEP}
          value={quantity}
          inputMode="numeric"
          aria-label="Quantidade de potes"
          onChange={(event) => setQuantity(Number(event.target.value) || 0)}
        />
        <button
          type="button"
          className="lc-stepper-btn"
          aria-label="Aumentar quantidade"
          onClick={() => setQuantity((current) => current + QUANTITY_STEP)}
        >
          +
        </button>
      </div>
      <p className="lc-min-warning" role="status">
        {isBelowMinimum ? `Pedido mínimo: ${minimum} potes.` : ""}
      </p>
      <div className="lc-quote-subtotal">
        <span className="lc-lbl">Subtotal estimado</span>
        <span className="lc-val">{centsToBRL(subtotalCents)}</span>
      </div>
      <div className="lc-modal-actions">
        <button type="button" className="lc-btn lc-btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="lc-btn lc-btn-primary"
          onClick={handleConfirm}
          disabled={isBelowMinimum}
        >
          Adicionar à cotação
        </button>
      </div>
    </ModalShell>
  );
}
