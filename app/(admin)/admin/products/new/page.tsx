import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { prisma } from "@/lib/prisma";

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  if (categories.length === 0) {
    return (
      <p className="text-text-muted text-admin-body">
        Belum ada kategori di database. Jalankan{" "}
        <code className="font-mono text-[13px]">pnpm db:seed</code>.
      </p>
    );
  }

  return <AdminProductForm categories={categories} mode="create" />;
}
