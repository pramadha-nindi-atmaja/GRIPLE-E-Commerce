import type { Product } from "@/lib/types";

import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/shared/Container";

type Props = {
  products: Product[];
};

export function RelatedProducts({ products }: Props) {
  return (
    <section className="py-section-gap bg-background">
      <Container>
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-label-caps text-label-caps text-outline mb-4">
            You May Also Like
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-background">
            Related Products
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
      </Container>
    </section>
  );
}

