export type Gender = "men" | "women" | "unisex";

export type ProductBadge = "Best Seller" | "New" | "Sale" | string | null;

export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

export interface ProductStock {
  [size: string]: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  gender: Gender;
  price: number;
  originalPrice: number | null;
  badge: ProductBadge;
  description: string;
  fabric: string;
  care: string;
  colors: ProductColor[];
  sizes: string[];
  stock: ProductStock;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: "men" | "women" | "all";
  image: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  image: string;
  qty: number;
}
