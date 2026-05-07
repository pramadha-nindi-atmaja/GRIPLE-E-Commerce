"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  children?: ReactNode;
};

export function ProductView({ product, children }: Props) {
  const initialColor = product.colors[0]?.name ?? "";
  const [selectedColorName, setSelectedColorName] = useState(initialColor);

  const activeImages = useMemo(() => {
    const c =
      product.colors.find((x) => x.name === selectedColorName) ?? product.colors[0];
    return c?.images?.length ? c.images : ["/images/products/_pool/black.jpg"];
  }, [product.colors, selectedColorName]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      <ImageGallery
        key={selectedColorName}
        images={activeImages}
        alt={product.name}
      />

      <div>
        <div className="font-label-caps text-label-caps text-outline mb-4">
          {product.gender} / {product.category}
        </div>
        <h1 className="text-headline-lg font-headline-lg text-on-background">
          {product.name}
        </h1>

        <div className="mt-6 flex items-baseline gap-3">
          <div className="text-headline-md font-headline-md text-on-background">
            ${product.price.toFixed(2)}
          </div>
          {product.originalPrice ? (
            <div className="text-body-md font-body-md text-outline line-through">
              ${product.originalPrice.toFixed(2)}
            </div>
          ) : null}
          {product.badge ? (
            <span className="ml-auto bg-surface text-on-surface font-label-caps px-3 py-1 rounded-full text-[10px] border border-outline-variant">
              {product.badge}
            </span>
          ) : null}
        </div>

        <ProductPurchasePanel
          product={product}
          selectedColorName={selectedColorName}
          onColorChange={setSelectedColorName}
        />

        {children}
      </div>
    </div>
  );
}
