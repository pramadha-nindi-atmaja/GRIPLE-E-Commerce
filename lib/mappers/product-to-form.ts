import type {
  Product,
  ProductColor,
  ProductImage,
  ProductStock,
} from "@prisma/client";

import type { AdminProductPayload } from "@/lib/schemas/admin-product";

const SIZE_KEYS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type ProductWithRelations = Product & {
  colors: (ProductColor & {
    images: ProductImage[];
    stocks: ProductStock[];
  })[];
};

export function productToFormPayload(p: ProductWithRelations): AdminProductPayload {
  const variants: AdminProductPayload["variants"] = p.colors.map((c) => {
    const stock: Record<string, number> = Object.fromEntries(
      SIZE_KEYS.map((sz) => [sz, 0]),
    ) as Record<string, number>;
    for (const s of c.stocks) {
      stock[s.size] = s.qty;
    }
    return {
      name: c.name,
      hex: c.hex,
      images: c.images.length ? c.images.sort((a, b) => a.position - b.position).map((i) => i.url) : [""],
      stock,
    };
  });

  return {
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    gender: p.gender,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    badge: p.badge,
    description: p.description,
    fabric: p.fabric,
    care: p.care,
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
    isNewArrival: p.isNewArrival,
    variants: variants.length
      ? variants
      : [
          {
            name: "Default",
            hex: "#000000",
            images: [""],
            stock: Object.fromEntries(SIZE_KEYS.map((s) => [s, 0])) as Record<
              string,
              number
            >,
          },
        ],
  };
}
