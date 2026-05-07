"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  parseStoreSearchParams,
  serializeStoreQuery,
  type ParsedStoreQuery,
} from "@/lib/utils/filters";

type Props = {
  productCount: number;
};

const SORT_OPTIONS: { label: string; value: ParsedStoreQuery["sort"] }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Selling", value: "best-selling" },
];

export function SortBar({ productCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => {
    const raw = Object.fromEntries(searchParams.entries());
    return parseStoreSearchParams(raw);
  }, [searchParams]);

  const replaceSort = useCallback(
    (sort: ParsedStoreQuery["sort"]) => {
      const next: ParsedStoreQuery = { ...query, sort };
      const qs = serializeStoreQuery(next);
      router.replace(`${pathname}${qs}`, { scroll: false });
    },
    [pathname, query, router],
  );

  return (
    <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant">
      <span className="font-label-caps text-label-caps text-on-surface-variant">
        {productCount} Products
      </span>
      <div className="flex items-center gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Sort By
        </span>
        <select
          className="form-select border-0 bg-transparent py-0 pl-2 pr-8 font-label-caps text-label-caps focus:ring-0 cursor-pointer rounded-2xl"
          value={query.sort}
          onChange={(e) =>
            replaceSort(e.target.value as ParsedStoreQuery["sort"])
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
