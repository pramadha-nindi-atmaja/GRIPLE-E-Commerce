import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Transform database category to frontend format
function transformCategory(dbCategory: any) {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    gender: dbCategory.gender.toLowerCase(), // Convert enum to lowercase
    image: dbCategory.image,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');

    let where: any = {};

    if (gender) {
      const genderEnum = gender.toUpperCase();
      where.gender = genderEnum === 'UNISEX' ? 'ALL' : genderEnum;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { position: 'asc' },
    });

    const transformedCategories = categories.map(transformCategory);

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}