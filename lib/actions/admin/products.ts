"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/actions/admin/guards";
import {
  adminProductPayloadSchema,
  type AdminProductPayload,
} from "@/lib/schemas/admin-product";
import { slugify } from "@/lib/utils/slug";

async function uniqueSlug(base: string, excludeProductId?: string) {
  let slug = base;
  let n = 0;
  for (;;) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeProductId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

async function persistVariants(productId: string, data: AdminProductPayload) {
  const sizeSet = new Set<string>();
  for (const v of data.variants) {
    Object.keys(v.stock).forEach((s) => sizeSet.add(s));
  }
  const sizes = Array.from(sizeSet).sort();

  await prisma.productSize.deleteMany({ where: { productId } });
  await prisma.productColor.deleteMany({ where: { productId } });

  for (let i = 0; i < sizes.length; i++) {
    await prisma.productSize.create({
      data: {
        productId,
        size: sizes[i],
        position: i,
      },
    });
  }

  let cPos = 0;
  for (const v of data.variants) {
    const color = await prisma.productColor.create({
      data: {
        productId,
        name: v.name,
        hex: v.hex,
        position: cPos,
      },
    });
    cPos += 1;

    for (let i = 0; i < v.images.length; i++) {
      await prisma.productImage.create({
        data: {
          colorId: color.id,
          url: v.images[i],
          alt: `${v.name} — ${i + 1}`,
          position: i,
        },
      });
    }

    for (const [size, qty] of Object.entries(v.stock)) {
      await prisma.productStock.create({
        data: {
          colorId: color.id,
          size,
          qty,
        },
      });
    }
  }
}

export type ProductActionResult = { ok: true } | { ok: false; message: string };

export async function createProductAction(formData: FormData): Promise<ProductActionResult> {
  try {
    await requireSuperAdmin();

    const raw = formData.get("payload");
    if (typeof raw !== "string") {
      return { ok: false, message: "Payload tidak valid" };
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return { ok: false, message: "Payload JSON tidak valid" };
    }

    const parsed = adminProductPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Validasi gagal",
      };
    }

    const data = parsed.data;
    const slug = await uniqueSlug(data.slug);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        gender: data.gender,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        badge: data.badge ?? null,
        description: data.description,
        fabric: data.fabric ?? null,
        care: data.care ?? null,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
      },
    });

    await persistVariants(product.id, data);

    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal menyimpan produk";
    return { ok: false, message: msg };
  }
}

export async function updateProductAction(
  productId: string,
  formData: FormData,
): Promise<ProductActionResult> {
  try {
    await requireSuperAdmin();

    const raw = formData.get("payload");
    if (typeof raw !== "string") {
      return { ok: false, message: "Payload tidak valid" };
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return { ok: false, message: "Payload JSON tidak valid" };
    }

    const parsed = adminProductPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Validasi gagal",
      };
    }

    const data = parsed.data;
    const slug = await uniqueSlug(data.slug, productId);

    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        gender: data.gender,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        badge: data.badge ?? null,
        description: data.description,
        fabric: data.fabric ?? null,
        care: data.care ?? null,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
      },
    });

    await persistVariants(productId, data);

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal menyimpan produk";
    return { ok: false, message: msg };
  }
}

export async function deleteProductAction(
  productId: string,
): Promise<ProductActionResult> {
  try {
    await requireSuperAdmin();
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal menghapus";
    return { ok: false, message: msg };
  }
}

/** Helper untuk UI: generate slug dari nama */
export async function previewSlug(name: string) {
  return slugify(name);
}
