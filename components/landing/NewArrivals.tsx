"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
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
            <span className="font-label-caps text-outline mb-4">Just Dropped</span>
            <h2 className="text-headline-lg font-headline-lg text-on-background">
              New Arrivals
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="text-center">Loading...</div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 bg-background">
      <Container>
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-label-caps text-outline mb-4">Just Dropped</span>
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
            className="border border-outline text-on-background rounded-full px-8 py-3 font-label-caps uppercase hover:bg-surface-container transition-colors"
          >
            Shop All New
          </Link>
        </div>
      </Container>
    </section>
  );
}
