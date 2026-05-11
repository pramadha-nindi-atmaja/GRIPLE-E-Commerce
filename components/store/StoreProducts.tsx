"use client";

import { Suspense, useEffect, useState } from "react";

import { FilterSidebar } from "@/components/store/FilterSidebar";
import { MobileFilterDrawer } from "@/components/store/MobileFilterDrawer";
import { Pagination } from "@/components/store/Pagination";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SortBar } from "@/components/store/SortBar";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { getAllCategories } from "@/lib/mock/categories";
import { getAllProducts } from "@/lib/mock/products";
import type { Category, Product } from "@/lib/types";
import {
  applyFilters,
  applySort,
  paginate,
  parseStoreSearchParams,
} from "@/lib/utils/filters";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const PAGE_SIZE = 12;

function uniqueColors(products: Product[]) {
  const seen = new Map<string, string>();
  for (const p of products) {
    for (const c of p.colors) {
      if (!seen.has(c.name)) seen.set(c.name, c.hex);
    }
  }
  return Array.from(seen, ([name, hex]) => ({ name, hex }));
}

export function StoreProducts({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allProducts, allCategories] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(allProducts.filter((p) => p.isPublished));
        setCategories(allCategories);
      } catch (error) {
        console.error("Failed to load store data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-gutter">
        <aside className="hidden md:flex md:flex-col w-[260px] shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-4 border-b border-outline-variant">
              <div className="h-3 w-20 rounded-full bg-surface-container-high animate-pulse mb-4" />
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-4 w-full rounded-full bg-surface-container-high animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </aside>
        <div className="flex-grow">
          <div className="h-12 mb-8 rounded-xl bg-surface-container-high animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const q = parseStoreSearchParams(searchParams);
  const sorted = applySort(applyFilters(products, q), q.sort);
  const {
    items: pageItems,
    page,
    totalPages,
  } = paginate(sorted, q.page, PAGE_SIZE);

  const categoryOptions = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));
  const colors = uniqueColors(products);

  return (
    <div className="flex flex-col md:flex-row gap-gutter">
      <Suspense
        fallback={
          <aside className="hidden md:block w-[260px] shrink-0 rounded-2xl bg-surface-container-high min-h-[24rem] animate-pulse" />
        }
      >
        <FilterSidebar categories={categoryOptions} colors={colors} sizes={SIZES} />
      </Suspense>

      <div className="flex-grow">
        <Suspense
          fallback={
            <div className="h-12 mb-8 rounded-xl bg-surface-container-high animate-pulse" />
          }
        >
          <SortBar
            productCount={sorted.length}
            filterSlot={
              <MobileFilterDrawer
                categories={categories}
                colors={colors}
                sizes={SIZES}
              />
            }
          />
        </Suspense>
        <ProductGrid products={pageItems} />
        <Suspense fallback={null}>
          <Pagination page={page} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}
