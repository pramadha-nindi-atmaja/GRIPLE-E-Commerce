import type { Gender, Product } from "@/lib/types";

// API-based functions (replace mock data)
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
      cache: 'no-store', // Disable cache for development
    });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('Failed to fetch product:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?featured=true`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch featured products:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?newArrivals=true`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch new arrivals:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export async function getProductsByGender(gender: Gender): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?gender=${gender}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch products by gender:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products by gender:', error);
    return [];
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${categorySlug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch products by category:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

