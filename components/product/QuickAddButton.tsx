"use client";

import type { ProductColor } from "@/lib/types";
import { useCartStore } from "@/lib/stores/cart.store";

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  colors: ProductColor[];
  sizes: string[];
  stock: Record<string, number>;
};

function firstInStockSize(sizes: string[], stock: Record<string, number>): string | null {
  const hit = sizes.find((s) => (stock?.[s] ?? 0) > 0);
  return hit ?? null;
}

export function QuickAddButton({
  productId,
  slug,
  name,
  price,
  colors,
  sizes,
  stock,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      aria-label="Quick add"
      className="h-10 w-10 bg-surface rounded-full flex items-center justify-center text-primary border border-outline-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const color = colors[0];
        if (!color) return;
        const size = firstInStockSize(sizes, stock);
        if (!size) return;
        const image = color.images[0] ?? "/images/products/_pool/black.jpg";
        addItem({
          productId,
          name,
          slug,
          color: color.name,
          colorHex: color.hex,
          size,
          price,
          image,
          qty: 1,
        });
      }}
    >
      <span className="material-symbols-outlined text-[20px]">add</span>
    </button>
  );
}
