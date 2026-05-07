"use client";

import { useState } from "react";

import type { ParsedStoreQuery } from "@/lib/utils/filters";
import { cn } from "@/lib/utils/cn";

type CategoryOpt = { slug: string; name: string };
type ColorOpt = { name: string; hex: string };

type Props = {
  query: ParsedStoreQuery;
  onUpdate: (next: ParsedStoreQuery) => void;
  categories: CategoryOpt[];
  colors: ColorOpt[];
  sizes: readonly string[];
};

const GENDER_ROWS: { label: string; value: "men" | "women" | "unisex" }[] = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
];

function toggleStr(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function FilterPriceInputs({
  minPrice,
  maxPrice,
  onApply,
}: {
  minPrice?: number;
  maxPrice?: number;
  onApply: (min?: number, max?: number) => void;
}) {
  const [minStr, setMinStr] = useState(() =>
    minPrice != null ? String(minPrice) : "",
  );
  const [maxStr, setMaxStr] = useState(() =>
    maxPrice != null ? String(maxPrice) : "",
  );

  const apply = () => {
    const minV = minStr.trim() === "" ? undefined : Number.parseFloat(minStr);
    const maxV = maxStr.trim() === "" ? undefined : Number.parseFloat(maxStr);
    onApply(
      minV != null && Number.isFinite(minV) ? minV : undefined,
      maxV != null && Number.isFinite(maxV) ? maxV : undefined,
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label className="flex flex-col gap-1 flex-1">
          <span className="font-label-caps text-[10px] text-outline">Min</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={minStr}
            onChange={(e) => setMinStr(e.target.value)}
            onBlur={apply}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 px-3 font-body-md text-on-surface focus:border-primary focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 flex-1">
          <span className="font-label-caps text-[10px] text-outline">Max</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="200"
            value={maxStr}
            onChange={(e) => setMaxStr(e.target.value)}
            onBlur={apply}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 px-3 font-body-md text-on-surface focus:border-primary focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}

export function FilterControls({
  query,
  onUpdate,
  categories,
  colors,
  sizes,
}: Props) {
  const toggleGender = (value: "men" | "women" | "unisex") => {
    const next = query.gender.includes(value)
      ? query.gender.filter((g) => g !== value)
      : [...query.gender, value];
    onUpdate({ ...query, gender: next as ParsedStoreQuery["gender"] });
  };

  const toggleCategory = (slug: string) => {
    onUpdate({
      ...query,
      category: toggleStr(query.category, slug.toLowerCase()),
    });
  };

  const toggleSize = (size: string) => {
    onUpdate({ ...query, size: toggleStr(query.size, size) });
  };

  const toggleColor = (name: string) => {
    onUpdate({ ...query, color: toggleStr(query.color, name) });
  };

  return (
    <>
      <details open className="border-b border-outline-variant py-4 group">
        <summary className="flex justify-between items-center w-full cursor-pointer list-none">
          <span className="font-label-caps text-label-caps text-primary">Gender</span>
          <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
            expand_more
          </span>
        </summary>
        <div className="mt-4 flex flex-col gap-3">
          {GENDER_ROWS.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={query.gender.includes(value)}
                onChange={() => toggleGender(value)}
                className="form-checkbox h-4 w-4 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface rounded-md"
              />
              <span className="text-body-md font-body-md text-on-surface-variant">
                {label}
              </span>
            </label>
          ))}
        </div>
      </details>

      <details open className="border-b border-outline-variant py-4 group">
        <summary className="flex justify-between items-center w-full cursor-pointer list-none">
          <span className="font-label-caps text-label-caps text-primary">Category</span>
          <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
            expand_more
          </span>
        </summary>
        <div className="mt-4 flex flex-col gap-3">
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={query.category.includes(c.slug.toLowerCase())}
                onChange={() => toggleCategory(c.slug)}
                className="form-checkbox h-4 w-4 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface rounded-md"
              />
              <span className="text-body-md font-body-md text-on-surface-variant">
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </details>

      <details open className="border-b border-outline-variant py-4 group">
        <summary className="flex justify-between items-center w-full cursor-pointer list-none">
          <span className="font-label-caps text-label-caps text-primary">Size</span>
          <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
            expand_more
          </span>
        </summary>
        <div className="mt-4 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const on = query.size.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggleSize(s)}
                className={cn(
                  "w-10 h-10 border flex items-center justify-center font-label-caps text-label-caps transition-colors rounded-full",
                  on
                    ? "border-primary bg-surface-container text-primary"
                    : "border-outline-variant hover:border-primary hover:bg-surface-container",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </details>

      <details open className="border-b border-outline-variant py-4 group">
        <summary className="flex justify-between items-center w-full cursor-pointer list-none">
          <span className="font-label-caps text-label-caps text-primary">Color</span>
          <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
            expand_more
          </span>
        </summary>
        <div className="mt-4 flex flex-wrap gap-2">
          {colors.map((c) => {
            const on = query.color.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={on}
                onClick={() => toggleColor(c.name)}
                className={cn(
                  "h-7 w-7 rounded-full border transition",
                  on
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary"
                    : "border-outline-variant hover:ring-2 hover:ring-primary",
                )}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </details>

      <details open className="border-b border-outline-variant py-4 group">
        <summary className="flex justify-between items-center w-full cursor-pointer list-none">
          <span className="font-label-caps text-label-caps text-primary">Price</span>
          <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
            expand_more
          </span>
        </summary>
        <FilterPriceInputs
          key={`${query.minPrice ?? ""}-${query.maxPrice ?? ""}`}
          minPrice={query.minPrice}
          maxPrice={query.maxPrice}
          onApply={(minPrice, maxPrice) =>
            onUpdate({ ...query, minPrice, maxPrice })
          }
        />
      </details>
    </>
  );
}
