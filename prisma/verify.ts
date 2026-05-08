import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyData() {
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const colorCount = await prisma.productColor.count();
    const imageCount = await prisma.productImage.count();
    const stockCount = await prisma.productStock.count();

    console.log("📊 Database Verification:");
    console.log(`  📦 Categories: ${categoryCount}`);
    console.log(`  📦 Products: ${productCount}`);
    console.log(`  🎨 Product Colors: ${colorCount}`);
    console.log(`  🖼️  Product Images: ${imageCount}`);
    console.log(`  📈 Stock Records: ${stockCount}`);

    // Sample product check
    const sampleProduct = await prisma.product.findFirst({
      include: {
        colors: {
          include: {
            images: true,
            stocks: true,
          },
        },
        sizes: true,
      },
    });

    if (sampleProduct) {
      console.log(`\n✅ Sample Product: ${sampleProduct.name}`);
      console.log(`  - Colors: ${sampleProduct.colors.length}`);
      console.log(`  - Images: ${sampleProduct.colors.reduce((sum, c) => sum + c.images.length, 0)}`);
      console.log(`  - Stock entries: ${sampleProduct.colors.reduce((sum, c) => sum + c.stocks.length, 0)}`);
    }

  } catch (error) {
    console.error("❌ Verification failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();