import type { Category } from "@/lib/types";
import categories from "@/data/categories.json";

export function getAllCategories(): Category[] {
  return categories as Category[];
}

export function getCategoriesByGender(gender: "men" | "women"): Category[] {
  return getAllCategories().filter((c) => c.gender === "all" || c.gender === gender);
}

