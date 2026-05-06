import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/lib/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQty: (productId: string, color: string, size: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  itemCount: () => number;
}

function keyOf(item: Pick<CartItem, "productId" | "color" | "size">): string {
  return `${item.productId}::${item.color}::${item.size}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item) =>
        set((state) => {
          const next = [...state.items];
          const idx = next.findIndex((i) => keyOf(i) === keyOf(item));
          if (idx >= 0) {
            next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
            return { items: next };
          }
          next.push(item);
          return { items: next };
        }),
      removeItem: (productId, color, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.color === color && i.size === size),
          ),
        })),
      updateQty: (productId, color, size, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId && i.color === color && i.size === size
                ? { ...i, qty }
                : i,
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
      itemCount: () => get().items.reduce((sum, item) => sum + item.qty, 0),
    }),
    { name: "griple-cart" },
  ),
);

