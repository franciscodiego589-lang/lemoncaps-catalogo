"use client";

// Carrinho de cotação do catálogo. Estado só do cliente (Zustand), persistido
// em localStorage — nunca é fonte de preço ou de dado de fórmula: cada item
// guarda uma cópia (snapshot) do preço e do nome no momento da cotação, mas
// quem manda no valor de venda continua sendo o banco (list_price_cents).
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_MINIMUM_ORDER_POTES = 100;

export interface CartItem {
  formulaId: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  quantityPotes: number;
  minimumOrderPotes: number;
}

export type AddCartItemInput = Omit<CartItem, "quantityPotes"> & {
  quantityPotes: number;
};

interface CartState {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (formulaId: string) => void;
  updateQuantity: (formulaId: string, quantityPotes: number) => void;
  clear: () => void;
}

function clampQuantity(quantityPotes: number, minimumOrderPotes: number): number {
  const minimum = minimumOrderPotes > 0 ? minimumOrderPotes : DEFAULT_MINIMUM_ORDER_POTES;
  return Math.max(Math.trunc(quantityPotes) || 0, minimum);
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const quantityPotes = clampQuantity(item.quantityPotes, item.minimumOrderPotes);
          const nextItem: CartItem = { ...item, quantityPotes };
          const existingIndex = state.items.findIndex((line) => line.formulaId === item.formulaId);
          if (existingIndex === -1) {
            return { items: [...state.items, nextItem] };
          }
          return {
            items: state.items.map((line, index) => (index === existingIndex ? nextItem : line)),
          };
        }),
      removeItem: (formulaId) =>
        set((state) => ({ items: state.items.filter((line) => line.formulaId !== formulaId) })),
      updateQuantity: (formulaId, quantityPotes) =>
        set((state) => ({
          items: state.items.map((line) =>
            line.formulaId === formulaId
              ? { ...line, quantityPotes: clampQuantity(quantityPotes, line.minimumOrderPotes) }
              : line,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "lemoncaps-cart" },
  ),
);

export function cartItemTotalCents(item: CartItem): number {
  return item.unitPriceCents * item.quantityPotes;
}

export function cartTotalCents(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + cartItemTotalCents(item), 0);
}
