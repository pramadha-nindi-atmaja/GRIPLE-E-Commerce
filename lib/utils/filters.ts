import { z } from "zod";

import type { Product } from "@/lib/types";

const genderSchema = z.enum(["men", "women", "unisex"]);
const sortSchema = z.enum(["newest", "price-asc", "price-desc", "best-selling"]);
const badgeSchema = z.enum(["new", "sale", "best"]);

const storeQuerySchema = z.object({
  gender: z.array(genderSchema).default([]),
  category: z.array(z.string()).default([]),
  size: z.array(z.string()).default([]),
  color: z.array(z.string()).default([]),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  badge: badgeSchema.optional(),
  sort: sortSchema.default("newest"),
});

export type ParsedStoreQuery = z.infer<typeof storeQuerySchema>;

function firstParam(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function splitComma(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => decodeURIComponent(s.trim()))
    .filter(Boolean);
}

function parseNum(raw: string | undefined): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/** Normalize Next.js `searchParams` into validated store filters + sort. */
export function parseStoreSearchParams(
  sp: Record<string, string | string[] | undefined>,
): ParsedStoreQuery {
  const gender = splitComma(firstParam(sp.gender))
    .map((g) => g.toLowerCase())
    .filter((g): g is "men" | "women" | "unisex" =>
      g === "men" || g === "women" || g === "unisex",
    );

  const category = splitComma(firstParam(sp.category)).map((s) => s.toLowerCase());
  const size = splitComma(firstParam(sp.size));
  const color = splitComma(firstParam(sp.color));

  const minPrice = parseNum(firstParam(sp.minPrice));
  const maxPrice = parseNum(firstParam(sp.maxPrice));

  const badgeRaw = firstParam(sp.badge)?.toLowerCase();
  const badge =
    badgeRaw === "new" || badgeRaw === "sale" || badgeRaw === "best"
      ? badgeRaw
      : undefined;

  const sortRaw = firstParam(sp.sort)?.toLowerCase();
  const sort =
    sortRaw === "price-asc" ||
    sortRaw === "price-desc" ||
    sortRaw === "best-selling" ||
    sortRaw === "newest"
      ? sortRaw === "price-asc"
        ? "price-asc"
        : sortRaw === "price-desc"
          ? "price-desc"
          : sortRaw === "best-selling"
            ? "best-selling"
            : "newest"
      : "newest";

  const parsed = storeQuerySchema.safeParse({
    gender,
    category,
    size,
    color,
    minPrice,
    maxPrice,
    badge,
    sort,
  });

  if (parsed.success) return parsed.data;

  return storeQuerySchema.parse({
    gender: [],
    category: [],
    size: [],
    color: [],
    sort: "newest",
  });
}

export function applyFilters(products: Product[], q: ParsedStoreQuery): Product[] {
  return products.filter((p) => {
    if (q.gender.length > 0) {
      const ok =
        p.gender === "unisex" || q.gender.includes(p.gender as "men" | "women");
      if (!ok) return false;
    }

    if (q.category.length > 0) {
      if (!q.category.includes(p.category.toLowerCase())) return false;
    }

    if (q.size.length > 0) {
      const hit = q.size.some(
        (s) => p.sizes.includes(s) && (p.stock?.[s] ?? 0) > 0,
      );
      if (!hit) return false;
    }

    if (q.color.length > 0) {
      const names = new Set(p.colors.map((c) => c.name));
      const hit = q.color.some((c) => names.has(c));
      if (!hit) return false;
    }

    if (q.minPrice != null && p.price < q.minPrice) return false;
    if (q.maxPrice != null && p.price > q.maxPrice) return false;

    if (q.badge === "new") {
      if (!(p.isNewArrival || p.badge === "New")) return false;
    } else if (q.badge === "sale") {
      if (p.badge !== "Sale") return false;
    } else if (q.badge === "best") {
      if (!(p.isFeatured || p.badge === "Best Seller")) return false;
    }

    return true;
  });
}

export function applySort(products: Product[], sort: ParsedStoreQuery["sort"]): Product[] {
  const next = [...products];

  switch (sort) {
    case "price-asc":
      next.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      next.sort((a, b) => b.price - a.price);
      break;
    case "best-selling":
      next.sort((a, b) => {
        const fa = a.isFeatured ? 1 : 0;
        const fb = b.isFeatured ? 1 : 0;
        if (fb !== fa) return fb - fa;
        const ba = a.badge === "Best Seller" ? 1 : 0;
        const bb = b.badge === "Best Seller" ? 1 : 0;
        if (bb !== ba) return bb - ba;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    case "newest":
    default:
      next.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
  }

  return next;
}

export function countActiveFilters(q: ParsedStoreQuery): number {
  let n = 0;
  n += q.gender.length;
  n += q.category.length;
  n += q.size.length;
  n += q.color.length;
  if (q.minPrice != null) n += 1;
  if (q.maxPrice != null) n += 1;
  if (q.badge != null) n += 1;
  return n;
}

/** Build query string from parsed filters (comma-separated multi-values). */
export function serializeStoreQuery(q: ParsedStoreQuery): string {
  const p = new URLSearchParams();

  if (q.gender.length > 0) p.set("gender", q.gender.join(","));
  if (q.category.length > 0) p.set("category", q.category.join(","));
  if (q.size.length > 0) p.set("size", q.size.join(","));
  if (q.color.length > 0) p.set("color", q.color.join(","));
  if (q.minPrice != null) p.set("minPrice", String(q.minPrice));
  if (q.maxPrice != null) p.set("maxPrice", String(q.maxPrice));
  if (q.badge != null) p.set("badge", q.badge);
  if (q.sort !== "newest") p.set("sort", q.sort);

  const s = p.toString();
  return s.length > 0 ? `?${s}` : "";
}
