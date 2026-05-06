import { getFeaturedProducts } from "@/lib/mock/products";

import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/shared/Container";
import Link from "next/link";

export function BestSellers() {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-12 md:py-24 bg-background">
      <Container>
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-label-caps text-outline mb-4">Trending Now</span>
          <h2 className="text-headline-lg font-headline-lg text-on-background">
            Best Sellers
          </h2>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-8 snap-x snap-mandatory">
          {featured.map((p) => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-[280px] md:w-[320px] flex flex-col"
            >
              <ProductCard
                name={p.name}
                slug={p.slug}
                price={p.price}
                originalPrice={p.originalPrice}
                badge={p.badge}
                image={p.colors[0]?.images[0] ?? "/images/products/_pool/black.jpg"}
                hoverImage={p.colors[0]?.images[1]}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/store"
            className="border border-outline text-on-background rounded-full px-8 py-3 font-label-caps uppercase hover:bg-surface-container transition-colors"
          >
            View All Products
          </Link>
        </div>
      </Container>
    </section>
  );
}

