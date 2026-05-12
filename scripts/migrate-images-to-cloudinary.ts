/**
 * One-time migration: upload local product images to Cloudinary,
 * then update ProductImage.url in DB to the Cloudinary secure_url.
 *
 * Run: npx tsx scripts/migrate-images-to-cloudinary.ts
 */

import { readFile } from "fs/promises";
import { join } from "path";

import { v2 as cloudinary } from "cloudinary";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBuffer(
  buffer: Buffer,
  publicId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "griple/products",
          public_id: publicId,
          overwrite: false,
          resource_type: "image",
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Upload failed"));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

async function main() {
  const localImages = await prisma.productImage.findMany({
    where: {
      OR: [
        { url: { startsWith: "/uploads/" } },
        { url: { startsWith: "/images/" } },
      ],
    },
    select: { id: true, url: true },
  });

  if (localImages.length === 0) {
    console.log("Tidak ada gambar lokal di DB. Migration selesai.");
    return;
  }

  console.log(`Ditemukan ${localImages.length} gambar lokal. Mulai upload...\n`);

  let success = 0;
  let failed = 0;

  for (const img of localImages) {
    // url: /uploads/products/uuid.jpg  OR  /images/products/slug/name.jpg
    const relativePath = img.url.replace(/^\//, ""); // strip leading slash
    const localPath = join(process.cwd(), "public", relativePath);

    // public_id: griple/products/slug/name (no extension)
    const withoutPublic = relativePath.replace(/^images\//, "");
    const publicId = withoutPublic.replace(/\.[^/.]+$/, "");

    try {
      const buffer = await readFile(localPath);
      const cloudUrl = await uploadBuffer(buffer, publicId);

      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: cloudUrl },
      });

      console.log(`✓ ${img.url}`);
      console.log(`  → ${cloudUrl}\n`);
      success++;
    } catch (err) {
      console.error(`✗ ${img.url}: ${(err as Error).message}\n`);
      failed++;
    }
  }

  console.log(`\nSelesai: ${success} berhasil, ${failed} gagal.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
