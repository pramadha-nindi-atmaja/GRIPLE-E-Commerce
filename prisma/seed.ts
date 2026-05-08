import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// TYPE DEFINITIONS (matching mock data structure)
// ─────────────────────────────────────────────

interface MockProductColor {
  name: string;
  hex: string;
  images: string[];
}

interface MockProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  gender: "men" | "women" | "unisex";
  price: number;
  originalPrice: number | null;
  badge: "Best Seller" | "New" | "Sale" | null;
  description: string;
  fabric?: string;
  care?: string;
  colors: MockProductColor[];
  sizes: string[];
  stock: Record<string, number>;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
}

interface MockCategory {
  id: string;
  name: string;
  slug: string;
  gender: "men" | "women" | "all";
  image: string;
}

// ─────────────────────────────────────────────
// MAPPING FUNCTIONS
// ─────────────────────────────────────────────

function mapGender(gender: string) {
  const map: Record<string, "MEN" | "WOMEN" | "ALL"> = {
    men: "MEN",
    women: "WOMEN",
    unisex: "ALL",
    all: "ALL",
  };
  return map[gender] || "ALL";
}

function mapBadge(badge: string | null) {
  if (!badge) return null;
  const map: Record<string, "BEST_SELLER" | "NEW" | "SALE"> = {
    "Best Seller": "BEST_SELLER",
    New: "NEW",
    Sale: "SALE",
  };
  return map[badge] || null;
}

// ─────────────────────────────────────────────
// LOAD MOCK DATA
// ─────────────────────────────────────────────

function loadMockData() {
  const dataDir = path.join(process.cwd(), "data");

  const categoriesPath = path.join(dataDir, "categories.json");
  const productsPath = path.join(dataDir, "products.json");

  if (!fs.existsSync(categoriesPath)) {
    throw new Error(`Categories file not found: ${categoriesPath}`);
  }
  if (!fs.existsSync(productsPath)) {
    throw new Error(`Products file not found: ${productsPath}`);
  }

  const categories: MockCategory[] = JSON.parse(
    fs.readFileSync(categoriesPath, "utf-8"),
  );
  const products: MockProduct[] = JSON.parse(
    fs.readFileSync(productsPath, "utf-8"),
  );

  return { categories, products };
}

// ─────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  try {
    const { categories, products } = loadMockData();

    // ─────────────────────────────────────────────
    // CLEAR EXISTING DATA (for clean seed)
    // ─────────────────────────────────────────────
    console.log("🗑️  Clearing existing data...");
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.productStock.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.productSize.deleteMany({});
    await prisma.productColor.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    console.log("✓ Data cleared\n");

    // Map old category slugs to new category IDs created in DB
    const categoryMap = new Map<string, string>();

    // ─────────────────────────────────────────────
    // 1. SEED CATEGORIES
    // ─────────────────────────────────────────────
    console.log(`📦 Seeding ${categories.length} categories...`);

    for (const cat of categories) {
      const created = await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          gender: mapGender(cat.gender),
          image: cat.image,
        },
      });

      categoryMap.set(cat.slug, created.id);
      console.log(`  ✓ ${cat.name}`);
    }

    // ─────────────────────────────────────────────
    // 2. SEED PRODUCTS WITH VARIANTS
    // ─────────────────────────────────────────────
    console.log(`\n📦 Seeding ${products.length} products with variants...`);

    for (const prod of products) {
      // Find category ID
      const categoryId = categoryMap.get(prod.category);
      if (!categoryId) {
        console.warn(`  ⚠ Category not found for product: ${prod.name}`);
        continue;
      }

      // Create product
      const product = await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          categoryId,
          gender: mapGender(prod.gender),
          price: prod.price,
          originalPrice: prod.originalPrice,
          badge: mapBadge(prod.badge),
          description: prod.description,
          fabric: prod.fabric || null,
          care: prod.care || null,
          isPublished: prod.isPublished,
          isFeatured: prod.isFeatured,
          isNewArrival: prod.isNewArrival,
          createdAt: new Date(prod.createdAt),
        },
      });

      console.log(`  ✓ ${prod.name}`);

      // ─────────────────────────────────────────────
      // 2.1 SEED PRODUCT SIZES
      // ─────────────────────────────────────────────
      for (let sizeIdx = 0; sizeIdx < prod.sizes.length; sizeIdx++) {
        const size = prod.sizes[sizeIdx];
        await prisma.productSize.create({
          data: {
            productId: product.id,
            size,
            position: sizeIdx,
          },
        });
      }

      // ─────────────────────────────────────────────
      // 2.2 SEED PRODUCT COLORS WITH IMAGES & STOCK
      // ─────────────────────────────────────────────
      for (let colorIdx = 0; colorIdx < prod.colors.length; colorIdx++) {
        const color = prod.colors[colorIdx];

        const productColor = await prisma.productColor.create({
          data: {
            productId: product.id,
            name: color.name,
            hex: color.hex,
            position: colorIdx,
          },
        });

        // ─────────────────────────────────────────────
        // 2.2.1 SEED PRODUCT IMAGES (per color)
        // ─────────────────────────────────────────────
        for (let imgIdx = 0; imgIdx < color.images.length; imgIdx++) {
          const imageUrl = color.images[imgIdx];
          await prisma.productImage.create({
            data: {
              colorId: productColor.id,
              url: imageUrl,
              alt: `${prod.name} - ${color.name}`,
              position: imgIdx,
            },
          });
        }

        // ─────────────────────────────────────────────
        // 2.2.2 SEED PRODUCT STOCK (per color × size)
        // Note: Mock data has stock per size, not per color
        // We apply the same stock to all colors of the product
        // ─────────────────────────────────────────────
        for (const [size, qty] of Object.entries(prod.stock)) {
          await prisma.productStock.create({
            data: {
              colorId: productColor.id,
              size,
              qty,
            },
          });
        }
      }
    }

    console.log("\n✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
