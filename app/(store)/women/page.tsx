import { GenderHero } from "@/components/landing/GenderHero";
import { CategoryCard } from "@/components/product/CategoryCard";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductGrid } from "@/components/store/ProductGrid";
import { getCategoriesByGender } from "@/lib/mock/categories";
import { getProductsByGender } from "@/lib/mock/products";

export default function Page() {
  const categories = getCategoriesByGender("women");
  const products = getProductsByGender("women").slice(0, 8);

  return (
    <>
      <GenderHero
        image="/images/landing/women-apparel.jpg"
        eyebrow="WOMEN'S COLLECTION"
        title="Engineered for Movement"
        subtitle="Sculpted silhouettes and performance fabrics made to move with you."
        ctaHref="/store"
        ctaLabel="Shop All"
      />

      <section className="py-section-gap">
        <Container>
          <SectionHeader title="Shop by Category" href="/store" linkLabel="View All" />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c) => (
              <CategoryCard
                key={c.id}
                title={c.name}
                href={`/store?category=${c.slug}`}
                image={c.image}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-section-gap">
        <Container>
          <SectionHeader title="Best Sellers" href="/store" linkLabel="Shop All" />
          <div className="mt-12">
            <ProductGrid products={products} />
          </div>
        </Container>
      </section>
    </>
  );
}

