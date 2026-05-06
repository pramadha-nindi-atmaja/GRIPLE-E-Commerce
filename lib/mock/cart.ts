import type { CartItem } from "@/lib/types";

/**
 * Phase 1 placeholder cart data.
 *
 * Hard-coded items sourced from `data/products.json` so that `/cart` and
 * `/checkout` can render consistent UI without any client state. Phase 2 will
 * replace this helper with `useCartStore.items` (same `CartItem[]` signature).
 */
export function getMockCartItems(): CartItem[] {
  return [
    {
      productId: "prod_001",
      name: "Essential Fleece Hoodie",
      slug: "essential-fleece-hoodie",
      color: "Midnight Black",
      colorHex: "#1A1A1A",
      size: "L",
      price: 79.99,
      image: "/images/products/essential-fleece-hoodie/black-1.jpg",
      qty: 1,
    },
    {
      productId: "prod_002",
      name: "Tapered Training Jogger",
      slug: "tapered-training-jogger",
      color: "Midnight Black",
      colorHex: "#1A1A1A",
      size: "M",
      price: 64.99,
      image: "/images/products/tapered-training-jogger/black-1.jpg",
      qty: 1,
    },
    {
      productId: "prod_003",
      name: "Compression Base Layer Top",
      slug: "compression-base-layer-top",
      color: "Navy",
      colorHex: "#1B2A4A",
      size: "S",
      price: 49.99,
      image: "/images/products/compression-base-layer-top/navy-1.jpg",
      qty: 1,
    },
  ];
}
