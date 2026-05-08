"use client";

import { Suspense, useEffect, useState } from "react";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import { MobileFilterDrawer } from "@/components/store/MobileFilterDrawer";
import { Pagination } from "@/components/store/Pagination";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SortBar } from "@/components/store/SortBar";
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

function StoreProducts({
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">Loading products...</div>
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store" }]} />

      <StoreProducts searchParams={sp} />
    </main>
  );
}
