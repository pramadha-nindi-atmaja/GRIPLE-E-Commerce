import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function transformCategory(dbCategory: any) {
  // Use first published product image as category image fallback
  const productImage =
    dbCategory.products?.[0]?.colors?.[0]?.images?.[0]?.url ?? null;

  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    gender: dbCategory.gender.toLowerCase(),
    image: productImage ?? dbCategory.image,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get("gender");

    let where: any = {};

    if (gender) {
      const g = gender.toUpperCase();
      where.gender = g === "UNISEX" ? "ALL" : g;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { position: "asc" },
      include: {
        products: {
          where: { isPublished: true },
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            colors: {
              take: 1,
              orderBy: { position: "asc" },
              include: {
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(categories.map(transformCategory));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
