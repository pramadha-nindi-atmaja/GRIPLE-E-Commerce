"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { Container } from "@/components/shared/Container";
import { getNewArrivals } from "@/lib/mock/products";
import type { Product } from "@/lib/types";

export function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        const products = await getNewArrivals();
        setNewArrivals(products.slice(0, 4));
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-background">
        <Container>
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="font-label-caps text-label-caps text-secondary mb-4">Just Dropped</span>
            <h2 className="text-headline-lg font-headline-lg text-on-background">
              New Arrivals
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 bg-background">
      <Container>
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-label-caps text-label-caps text-secondary mb-4">Just Dropped</span>
          <h2 className="text-headline-lg font-headline-lg text-on-background">
            New Arrivals
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              slug={p.slug}
              price={p.price}
              originalPrice={p.originalPrice}
              badge={p.badge}
              image={p.colors[0]?.images[0] ?? "/images/products/_pool/black.jpg"}
              hoverImage={p.colors[0]?.images[1]}
              colors={p.colors.map((c) => ({ name: c.name, hex: c.hex }))}
              quickAdd={{
                productId: p.id,
                sizes: p.sizes,
                stock: p.stock,
                colors: p.colors,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/store"
            className={[
              "glass-card border border-white/[0.08] text-on-surface rounded-full px-8 py-3 font-label-caps uppercase",
              "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
              "hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/30",
              "hover:shadow-[0_0_12px_rgba(0,245,255,0.2),0_2px_16px_rgba(0,0,0,0.3)]",
            ].join(" ")}
          >
            Shop All New
          </Link>
        </div>
      </Container>
    </section>
  );
}
