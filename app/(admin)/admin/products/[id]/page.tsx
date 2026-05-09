import { notFound } from "next/navigation";

import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { productToFormPayload } from "@/lib/mappers/product-to-form";
import { prisma } from "@/lib/prisma";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      colors: {
        include: { images: true, stocks: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const initial = productToFormPayload(product);

  return (
    <AdminProductForm
      categories={categories}
      mode="edit"
      productId={id}
      initial={initial}
    />
  );
}
