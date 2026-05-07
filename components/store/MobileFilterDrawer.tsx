"use client";

import { useEffect, useState } from "react";

import { FilterControls } from "@/components/store/FilterControls";
import { useStoreQuery } from "@/lib/hooks/useStoreQuery";
import { countActiveFilters } from "@/lib/utils/filters";
import { cn } from "@/lib/utils/cn";

type CategoryOpt = { slug: string; name: string };
type ColorOpt = { name: string; hex: string };

type Props = {
  categories: CategoryOpt[];
  colors: ColorOpt[];
  sizes: readonly string[];
  className?: string;
};

export function MobileFilterDrawer({
  categories,
  colors,
  sizes,
  className,
}: Props) {
  const { query, replaceQuery, clearAll } = useStoreQuery();
  const activeCount = countActiveFilters(query);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "md:hidden inline-flex items-center gap-2 h-10 px-4 rounded-full border border-outline-variant font-label-caps text-label-caps text-on-surface hover:bg-surface-container transition-colors",
          className,
        )}
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        <span>Filter</span>
        {activeCount > 0 ? (
          <span className="inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-primary text-on-primary text-[11px] font-semibold leading-none">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[min(100%,360px)] bg-surface shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-outline-variant">
              <span className="font-headline-md text-headline-md flex items-center gap-2">
                Filter
                {activeCount > 0 ? (
                  <span className="inline-flex min-w-6 h-6 px-1 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-semibold">
                    {activeCount}
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container"
                aria-label="Close filters"
                onClick={() => setOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <FilterControls
                query={query}
                onUpdate={replaceQuery}
                categories={categories}
                colors={colors}
                sizes={sizes}
              />
            </div>

            <div className="border-t border-outline-variant px-4 py-4 flex items-center gap-3">
              <button
                type="button"
                onClick={clearAll}
                disabled={activeCount === 0}
                className="flex-1 h-12 rounded-full border border-outline-variant font-label-caps text-label-caps text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 h-12 rounded-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
