"use client";

import type { ReactNode } from "react";

import { useStoreQuery } from "@/lib/hooks/useStoreQuery";
import type { ParsedStoreQuery } from "@/lib/utils/filters";

type Props = {
  productCount: number;
  /** Optional slot for the mobile filter trigger button (rendered on the left). */
  filterSlot?: ReactNode;
};

const SORT_OPTIONS: { label: string; value: ParsedStoreQuery["sort"] }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Selling", value: "best-selling" },
];

export function SortBar({ productCount, filterSlot }: Props) {
  const { query, replaceQuery } = useStoreQuery();

  return (
    <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant gap-3">
      <div className="flex items-center gap-3">
        {filterSlot}
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          {productCount} Products
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant hidden sm:inline">
          Sort By
        </span>
        <select
          className="form-select border-0 bg-transparent py-0 pl-2 pr-8 font-label-caps text-label-caps focus:ring-0 cursor-pointer rounded-2xl"
          value={query.sort}
          onChange={(e) =>
            replaceQuery({
              ...query,
              sort: e.target.value as ParsedStoreQuery["sort"],
            })
          }
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
