import type { Category } from "@/lib/types";

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories", { cache: "no-store" });
    if (!response.ok) { console.error("Failed to fetch categories:", response.statusText); return []; }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoriesByGender(gender: "men" | "women"): Promise<Category[]> {
  try {
    const response = await fetch(`/api/categories?gender=${gender}`, { cache: "no-store" });
    if (!response.ok) { console.error("Failed to fetch categories by gender:", response.statusText); return []; }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories by gender:", error);
    return [];
  }
}
