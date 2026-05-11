import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const INCLUDE = {
  category: true,
  colors: {
    include: {
      images: { orderBy: { position: "asc" as const } },
      stocks: true,
    },
    orderBy: { position: "asc" as const },
  },
  sizes: { orderBy: { position: "asc" as const } },
} as const;

function transformProduct(dbProduct: any) {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    category: dbProduct.category.slug,
    gender: dbProduct.gender.toLowerCase(),
    price: Number(dbProduct.price),
    originalPrice: dbProduct.originalPrice ? Number(dbProduct.originalPrice) : null,
    badge: dbProduct.badge?.toLowerCase().replace("_", " ") ?? null,
    description: dbProduct.description,
    fabric: dbProduct.fabric,
    care: dbProduct.care,
    colors: dbProduct.colors.map((color: any) => ({
      name: color.name,
      hex: color.hex,
      images: color.images.map((img: any) => img.url),
    })),
    sizes: dbProduct.sizes.map((size: any) => size.size),
    stock: dbProduct.colors.reduce((acc: any, color: any) => {
      color.stocks.forEach((stock: any) => {
        acc[stock.size] = stock.qty;
      });
      return acc;
    }, {}),
    isPublished: dbProduct.isPublished,
    isFeatured: dbProduct.isFeatured,
    isNewArrival: dbProduct.isNewArrival,
    createdAt: dbProduct.createdAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const newArrivals = searchParams.get("newArrivals") === "true";
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");

    const base = { isPublished: true };
    let where: any = { ...base };

    if (gender) {
      const g = gender.toUpperCase();
      where.gender = g === "UNISEX" ? "ALL" : g;
    }
    if (category) {
      where.category = { slug: category };
    }

    // Featured products — fallback to 8 newest if none are flagged
    if (featured) {
      const featuredProducts = await prisma.product.findMany({
        where: { ...where, isFeatured: true },
        include: INCLUDE,
        orderBy: { createdAt: "desc" },
        take: 8,
      });

      if (featuredProducts.length > 0) {
        return NextResponse.json(featuredProducts.map(transformProduct));
      }

      // Fallback: return 8 newest published products
      const fallback = await prisma.product.findMany({
        where,
        include: INCLUDE,
        orderBy: { createdAt: "desc" },
        take: 8,
      });
      return NextResponse.json(fallback.map(transformProduct));
    }

    // New arrivals — fallback to 8 newest if none are flagged
    if (newArrivals) {
      const newProducts = await prisma.product.findMany({
        where: { ...where, isNewArrival: true },
        include: INCLUDE,
        orderBy: { createdAt: "desc" },
        take: 8,
      });

      if (newProducts.length > 0) {
        return NextResponse.json(newProducts.map(transformProduct));
      }

      // Fallback: return 8 newest with offset to differ from featured
      const fallback = await prisma.product.findMany({
        where,
        include: INCLUDE,
        orderBy: { createdAt: "desc" },
        take: 8,
        skip: 8,
      });
      return NextResponse.json(fallback.map(transformProduct));
    }

    // Default: all products (capped at 200 for performance)
    const products = await prisma.product.findMany({
      where,
      include: INCLUDE,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(products.map(transformProduct));
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
