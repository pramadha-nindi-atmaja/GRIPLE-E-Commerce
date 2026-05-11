"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Gender } from "@/lib/types/catalog-enums";

type Cat = { id: string; name: string };

export type ProductListFilters = {
  q?: string;
  gender?: Gender | "ANY";
  categoryId?: string | "ALL";
  published?: "published" | "draft" | "all";
};

function buildParams(f: ProductListFilters): string {
  const p = new URLSearchParams();
  if (f.q?.trim()) p.set("q", f.q.trim());
  if (f.gender && f.gender !== "ANY") p.set("gender", f.gender);
  if (f.categoryId && f.categoryId !== "ALL") p.set("category", f.categoryId);
  if (f.published && f.published !== "published") p.set("published", f.published);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function chipClass(active: boolean) {
  return active
    ? "px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold"
    : "px-4 py-1.5 rounded-full border border-admin-border text-secondary text-xs font-semibold hover:border-primary";
}

export function AdminProductFilters({
  categories,
  current,
}: {
  categories: Cat[];
  current: ProductListFilters;
}) {
  const router = useRouter();

  const genderChips: { value: Gender | "ANY"; label: string }[] = [
    { value: "ANY", label: "All" },
    { value: "MEN", label: "Men" },
    { value: "WOMEN", label: "Women" },
    { value: "ALL", label: "Unisex" },
  ];
  const pubFilters: { key: "published" | "draft" | "all"; label: string }[] = [
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
    { key: "all", label: "All" },
  ];

  const activeCatId = current.categoryId && current.categoryId !== "ALL" ? current.categoryId : "";

  return (
    <section className="space-y-4 py-2">
      <div className="flex flex-wrap items-center gap-stack-lg">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">
            Gender
          </span>
          <div className="flex gap-2 flex-wrap">
            {genderChips.map(({ value: g, label }) => {
              const active = (current.gender ?? "ANY") === g;
              const next: ProductListFilters = { ...current, gender: g };
              return (
                <Link key={g} href={`/admin/products${buildParams(next)}`} className={chipClass(active)}>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="h-6 w-px bg-admin-border hidden sm:block" aria-hidden />

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">
            Category
          </span>
          <select
            value={activeCatId}
            onChange={(e) => {
              const next: ProductListFilters = { ...current, categoryId: e.target.value || "ALL" };
              router.push(`/admin/products${buildParams(next)}`);
            }}
            className="text-xs border border-admin-border rounded-full px-3 py-1.5 bg-surface text-secondary font-semibold focus:outline-none focus:border-primary hover:border-primary transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">
            Status
          </span>
          <div className="flex gap-2 flex-wrap">
            {pubFilters.map(({ key, label }) => {
              const active = (current.published ?? "published") === key;
              const next: ProductListFilters = { ...current, published: key };
              return (
                <Link key={key} href={`/admin/products${buildParams(next)}`} className={chipClass(active)}>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
