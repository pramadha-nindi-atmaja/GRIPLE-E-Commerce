"use client";

import { FilterControls } from "@/components/store/FilterControls";
import { useStoreQuery } from "@/lib/hooks/useStoreQuery";
import { countActiveFilters } from "@/lib/utils/filters";

type CategoryOpt = { slug: string; name: string };
type ColorOpt = { name: string; hex: string };

type Props = {
  categories: CategoryOpt[];
  colors: ColorOpt[];
  sizes: readonly string[];
};

export function FilterSidebar({ categories, colors, sizes }: Props) {
  const { query, replaceQuery, clearAll } = useStoreQuery();
  const activeCount = countActiveFilters(query);

  return (
    <aside className="w-full md:w-[260px] shrink-0 border-r border-outline-variant pr-gutter pb-12 hidden md:block">
      <div className="flex justify-between items-center mb-8 gap-2">
        <h2 className="text-headline-md font-headline-md flex items-center gap-2">
          Filter
          {activeCount > 0 ? (
            <span className="inline-flex min-w-6 h-6 px-1 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-semibold">
              {activeCount}
            </span>
          ) : null}
        </h2>
        <button
          type="button"
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary underline underline-offset-4 rounded-full shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={clearAll}
          disabled={activeCount === 0}
        >
          Clear All
        </button>
      </div>

      <FilterControls
        query={query}
        onUpdate={replaceQuery}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </aside>
  );
}
