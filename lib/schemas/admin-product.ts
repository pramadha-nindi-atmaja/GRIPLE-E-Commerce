import { z } from "zod";

import { Badge, Gender } from "@prisma/client";

const colorVariantSchema = z.object({
  name: z.string().min(1, "Nama warna wajib"),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Hex harus #RRGGBB"),
  images: z.array(z.string().min(1)).min(1, "Minimal satu gambar per varian warna"),
  stock: z.record(z.string(), z.number().int().min(0)).refine(
    (s) => Object.keys(s).length > 0,
    "Isi stok minimal satu ukuran",
  ),
});

export const adminProductPayloadSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().min(1),
  gender: z.nativeEnum(Gender),
  price: z.number().positive(),
  originalPrice: z.union([z.number().positive(), z.null()]).optional(),
  badge: z.union([z.nativeEnum(Badge), z.null()]).optional(),
  description: z.string().min(1),
  fabric: z.string().optional().nullable(),
  care: z.string().optional().nullable(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  variants: z.array(colorVariantSchema).min(1, "Minimal satu varian warna"),
});

export type AdminProductPayload = z.infer<typeof adminProductPayloadSchema>;
