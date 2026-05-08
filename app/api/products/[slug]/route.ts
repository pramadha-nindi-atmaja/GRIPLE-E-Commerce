import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Transform database product to frontend format
function transformProduct(dbProduct: any) {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    category: dbProduct.category.slug, // Map to category slug for compatibility
    gender: dbProduct.gender.toLowerCase(), // Convert enum to lowercase
    price: Number(dbProduct.price),
    originalPrice: dbProduct.originalPrice ? Number(dbProduct.originalPrice) : null,
    badge: dbProduct.badge?.toLowerCase().replace('_', ' '), // Convert enum to string
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        colors: {
          include: {
            images: {
              orderBy: { position: 'asc' },
            },
            stocks: true,
          },
          orderBy: { position: 'asc' },
        },
        sizes: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!product || !product.isPublished) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const transformedProduct = transformProduct(product);

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}