import { CategoryCard } from "@/components/product/CategoryCard";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function FeaturedCategories() {
  return (
    <section className="py-section-gap">
      <Container>
        <SectionHeader title="Shop by Category" href="/store" linkLabel="View All" />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard
            title="Men's Apparel"
            href="/men"
            image="/images/landing/men-apparel.jpg"
          />
          <CategoryCard
            title="Women's Apparel"
            href="/women"
            image="/images/landing/women-apparel.jpg"
          />
          <CategoryCard
            title="Footwear"
            href="/store"
            image="/images/landing/footwear.jpg"
          />
          <CategoryCard
            title="Accessories"
            href="/store"
            image="/images/landing/accessories.jpg"
          />
        </div>
      </Container>
    </section>
  );
}

