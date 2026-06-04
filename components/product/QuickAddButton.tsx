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
      className={[
        // Glass dark base
        "h-10 w-10 rounded-full flex items-center justify-center",
        "bg-background/80 backdrop-blur-md text-primary",
        "border border-primary/40",
        // Premium cubic-bezier transition
        "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        // Hover: fill neon + glow
        "hover:bg-primary hover:text-on-primary hover:scale-[1.08]",
        "hover:shadow-[0_0_16px_rgba(0,245,255,0.5),0_0_32px_rgba(0,245,255,0.2)]",
      ].join(" ")}
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
