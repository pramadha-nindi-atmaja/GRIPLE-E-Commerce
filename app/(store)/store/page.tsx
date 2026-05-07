import { Suspense } from "react";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import { Pagination } from "@/components/store/Pagination";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SortBar } from "@/components/store/SortBar";
import { getAllCategories } from "@/lib/mock/categories";
import { getAllProducts } from "@/lib/mock/products";
import type { Product } from "@/lib/types";
import {
  applyFilters,
  applySort,
  parseStoreSearchParams,
} from "@/lib/utils/filters";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

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
  const published = getAllProducts().filter((p) => p.isPublished);
  const q = parseStoreSearchParams(searchParams);
  const filtered = applySort(applyFilters(published, q), q.sort);

  const categories = getAllCategories().map((c) => ({
    slug: c.slug,
    name: c.name,
  }));
  const colors = uniqueColors(published);

  return (
    <div className="flex flex-col md:flex-row gap-gutter">
      <Suspense
        fallback={
          <aside className="hidden md:block w-[260px] shrink-0 rounded-2xl bg-surface-container-high min-h-[24rem] animate-pulse" />
        }
      >
        <FilterSidebar categories={categories} colors={colors} sizes={SIZES} />
      </Suspense>

      <div className="flex-grow">
        <Suspense
          fallback={
            <div className="h-12 mb-8 rounded-xl bg-surface-container-high animate-pulse" />
          }
        >
          <SortBar productCount={filtered.length} />
        </Suspense>
        <ProductGrid products={filtered} />
        <Pagination />
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await Promise.resolve(searchParams);

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store" }]} />

      <StoreProducts searchParams={sp} />
    </main>
  );
}
