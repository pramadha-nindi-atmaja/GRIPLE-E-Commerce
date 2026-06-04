"use client";

import { useMemo, useState } from "react";

import { ColorSelector } from "@/components/product/ColorSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { SizeSelector } from "@/components/product/SizeSelector";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/stores/cart.store";

type Props = {
  product: Product;
  selectedColorName: string;
  onColorChange: (name: string) => void;
};

function firstInStockSize(product: Product): string {
  const hit = product.sizes.find((s) => (product.stock?.[s] ?? 0) > 0);
  return hit ?? product.sizes[0] ?? "M";
}

export function ProductPurchasePanel({
  product,
  selectedColorName,
  onColorChange,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const [size, setSize] = useState(() => firstInStockSize(product));
  const [qty, setQty] = useState(1);

  const selectedColor = useMemo(
    () => product.colors.find((c) => c.name === selectedColorName) ?? product.colors[0]!,
    [product.colors, selectedColorName],
  );

  const sizeOptions = useMemo(
    () =>
      product.sizes.map((s) => ({
        size: s,
        outOfStock: (product.stock?.[s] ?? 0) <= 0,
      })),
    [product.sizes, product.stock],
  );

  const canAdd = (product.stock?.[size] ?? 0) > 0;

  return (
    <div className="mt-8 space-y-6">
      <div>
        <div className="mb-3 font-label-caps text-label-caps text-on-surface-variant">
          Color
        </div>
        <ColorSelector
          colors={product.colors.map((c) => ({ name: c.name, hex: c.hex }))}
          value={selectedColor.name}
          onChange={onColorChange}
        />
      </div>

      <div>
        <div className="mb-3 font-label-caps text-label-caps text-on-surface-variant">
          Size
        </div>
        <SizeSelector options={sizeOptions} value={size} onChange={setSize} />
      </div>

      <div>
        <div className="mb-3 font-label-caps text-label-caps text-on-surface-variant">
          Quantity
        </div>
        <QuantitySelector
          value={qty}
          onChange={setQty}
          max={Math.max(1, product.stock?.[size] ?? 99)}
        />
      </div>

      <button
        type="button"
        disabled={!canAdd}
        onClick={() => {
          if (!canAdd) return;
          const image = selectedColor.images[0] ?? "/images/products/_pool/black.jpg";
          addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            color: selectedColor.name,
            colorHex: selectedColor.hex,
            size,
            price: product.price,
            image,
            qty,
          });
        }}
        className={[
          "w-full h-12 rounded-full bg-primary text-on-primary font-label-caps uppercase",
          // Premium cubic-bezier transition
          "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          // Hover: lift + neon cyan glow
          "hover:-translate-y-0.5 hover:scale-[1.01]",
          "hover:shadow-[0_0_20px_rgba(0,245,255,0.5),0_0_40px_rgba(0,245,255,0.2),0_4px_24px_rgba(0,0,0,0.4)]",
          // Disabled
          "disabled:opacity-40 disabled:pointer-events-none",
        ].join(" ")}
      >
        Add to Cart
      </button>
    </div>
  );
}
