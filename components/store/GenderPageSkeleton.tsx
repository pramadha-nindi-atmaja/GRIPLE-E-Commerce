import { Container } from "@/components/shared/Container";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export function GenderPageSkeleton() {
  return (
    <>
      {/* Hero */}
      <div className="w-full aspect-[21/9] bg-surface-container-high animate-pulse" />

      {/* Shop by Category */}
      <section className="py-section-gap">
        <Container>
          <div className="flex items-center justify-between mb-12">
            <div className="h-7 w-48 rounded-full bg-surface-container-high animate-pulse" />
            <div className="h-4 w-16 rounded-full bg-surface-container-high animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-surface-container-high animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Best Sellers */}
      <section className="py-section-gap">
        <Container>
          <div className="flex items-center justify-between mb-12">
            <div className="h-7 w-40 rounded-full bg-surface-container-high animate-pulse" />
            <div className="h-4 w-20 rounded-full bg-surface-container-high animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
