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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const newArrivals = searchParams.get('newArrivals') === 'true';
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');

    let where: any = { isPublished: true };

    if (featured) {
      where.isFeatured = true;
    }

    if (newArrivals) {
      where.isNewArrival = true;
    }

    if (gender) {
      const genderEnum = gender.toUpperCase();
      where.gender = genderEnum === 'UNISEX' ? 'ALL' : genderEnum;
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    const products = await prisma.product.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });

    const transformedProducts = products.map(transformProduct);

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}