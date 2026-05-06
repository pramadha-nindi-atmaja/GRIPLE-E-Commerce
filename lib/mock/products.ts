import type { Gender, Product } from "@/lib/types";
import products from "@/data/products.json";

export function getAllProducts(): Product[] {
  return products as Product[];
}

export function getProductBySlug(slug: string): Product | null {
  const all = getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.isFeatured && p.isPublished);
}

export function getNewArrivals(): Product[] {
  return getAllProducts().filter((p) => p.isNewArrival && p.isPublished);
}

export function getProductsByGender(gender: Gender): Product[] {
  return getAllProducts().filter(
    (p) => p.isPublished && (p.gender === gender || p.gender === "unisex"),
  );
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getAllProducts().filter((p) => p.isPublished && p.category === categorySlug);
}

