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
  /** null = preço sob consulta (fórmula ainda sem list_price_cents). */
  unitPriceCents: number | null;
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

/**
 * Teto de potes por item. O piso já existia (o pedido mínimo); o teto faltava, e
 * sem ele o carrinho aceitava 999999999999999999 potes e exibia um subtotal de
 * R$ 32,9 quintilhões — número que não trava o site, mas destrói a confiança de
 * quem está cotando, e viraria um orçamento absurdo no banco.
 *
 * 100.000 potes é folgado para o negócio (o maior pedido mínimo do catálogo é de
 * algumas centenas) e ainda assim mantém o total numa ordem de grandeza plausível.
 */
export const MAXIMUM_ORDER_POTES = 100_000;

function clampQuantity(quantityPotes: number, minimumOrderPotes: number): number {
  const minimum = minimumOrderPotes > 0 ? minimumOrderPotes : DEFAULT_MINIMUM_ORDER_POTES;
  const pedido = Math.trunc(quantityPotes) || 0;
  return Math.min(Math.max(pedido, minimum), MAXIMUM_ORDER_POTES);
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

// Item sob consulta (sem preço) não tem subtotal: devolve null, nunca 0, para
// a tela e o PDF não mostrarem "R$ 0,00" como se fosse preço.
export function cartItemTotalCents(item: CartItem): number | null {
  return item.unitPriceCents === null ? null : item.unitPriceCents * item.quantityPotes;
}

// Soma só os itens com preço. Quem mostra o total avisa à parte, com
// hasPriceOnRequest, que há item sob consulta fora da conta.
export function cartTotalCents(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + (cartItemTotalCents(item) ?? 0), 0);
}

export function hasPriceOnRequest(items: readonly CartItem[]): boolean {
  return items.some((item) => item.unitPriceCents === null);
}

export const PRICE_ON_REQUEST_LABEL = "Preço sob consulta";
