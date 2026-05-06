import type { Product } from "@/lib/types";

import { ProductCard } from "@/components/product/ProductCard";

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          name={p.name}
          slug={p.slug}
          price={p.price}
          originalPrice={p.originalPrice}
          badge={p.badge}
          image={p.colors[0]?.images[0] ?? "/images/products/_pool/black.jpg"}
          hoverImage={p.colors[0]?.images[1]}
        />
      ))}
    </div>
  );
}

