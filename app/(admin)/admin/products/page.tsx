import Link from "next/link";

import type { Gender } from "@/lib/types/catalog-enums";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminProductFilters, type ProductListFilters } from "@/components/admin/AdminProductFilters";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

import { isSuperAdmin } from "@/lib/actions/admin/guards";

function totalStock(p: {
  colors: { stocks: { qty: number }[] }[];
}): number {
  return p.colors.reduce(
    (sum: number, c: (typeof p.colors)[number]) =>
      sum +
      c.stocks.reduce(
        (innerSum: number, z: (typeof c.stocks)[number]) => innerSum + z.qty,
        0,
      ),
    0,
  );
}

function thumbUrl(p: {
  colors: { images: { url: string }[] }[];
}): string | undefined {
  const first = p.colors[0]?.images[0]?.url;
  return first;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    gender?: string;
    category?: string;
    published?: string;
  }>;
}) {
  const { q, gender: genderRaw, category: catRaw, published: pubRaw } =
    await searchParams;
  const session = await auth();
  const superAdmin = session?.user?.role && isSuperAdmin(session.user.role);

  const genderFilter =
    genderRaw && (["MEN", "WOMEN", "ALL"] as const).includes(genderRaw as Gender)
      ? (genderRaw as Gender)
      : undefined;

  const pubMode =
    pubRaw === "draft" ? "draft" : pubRaw === "all" ? "all" : "published";

  const currentFilters: ProductListFilters = {
    q,
    gender: genderFilter ?? "ANY",
    categoryId: catRaw && catRaw !== "ALL" ? catRaw : "ALL",
    published: pubMode,
  };

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const categoryIdFilter =
    catRaw && categories.some((c: { id: string }) => c.id === catRaw) ? catRaw : undefined;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        genderFilter ? { gender: genderFilter } : {},
        categoryIdFilter ? { categoryId: categoryIdFilter } : {},
        pubMode === "published"
          ? { isPublished: true }
          : pubMode === "draft"
            ? { isPublished: false }
            : {},
      ],
    },
    include: {
      category: true,
      colors: {
        orderBy: { position: "asc" },
        include: {
          images: { orderBy: { position: "asc" }, take: 1 },
          stocks: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <>
      <div className="-mx-container-padding px-container-padding py-stack-lg space-y-stack-md bg-background border-b border-admin-border mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 gap-y-stack-md">
          <AdminProductFilters categories={categories} current={currentFilters} />
          {superAdmin ? (
            <Link
              href="/admin/products/new"
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
            >
              <AdminIcon name="add" className="text-[18px]" />
              Add Product
            </Link>
          ) : null}
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-admin-border overflow-x-auto shadow-sm">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="border-b border-admin-border bg-surface-container-low">
              <th className="py-4 px-6 w-12">
                <input
                  type="checkbox"
                  disabled
                  className="rounded-sm border-admin-border text-primary focus:ring-primary opacity-40"
                  aria-label="Select all (coming soon)"
                />
              </th>
              <th className="py-4 px-4 font-section-label text-section-label-secondary">
                Product
              </th>
              <th className="py-4 px-4 font-section-label text-section-label-secondary">
                Attributes
              </th>
              <th className="py-4 px-4 font-section-label text-section-label-secondary">
                Price
              </th>
              <th className="py-4 px-4 font-section-label text-section-label-secondary">
                Stock
              </th>
              <th className="py-4 px-4 font-section-label text-section-label-secondary">
                Status
              </th>
              <th className="py-4 px-6 text-right font-section-label text-section-label-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {products.map((p: (typeof products)[number]) => {
              const thumb = thumbUrl(p);
              const stock = totalStock(p);
              const genderLabel =
                p.gender === "MEN"
                  ? "MEN"
                  : p.gender === "WOMEN"
                    ? "WOMEN"
                    : "UNISEX";
              return (
                <tr
                  key={p.id}
                  className="hover:bg-surface-container-lowest transition-colors group"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      disabled
                      className="rounded-sm border-admin-border text-primary focus:ring-primary opacity-40"
                      aria-hidden
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[48px] h-[60px] bg-surface-container rounded-xl overflow-hidden flex-shrink-0 relative">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-surface-container-high" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary text-admin-body">{p.name}</p>
                        <p className="text-[11px] font-mono text-text-muted uppercase">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className="block text-[11px] font-bold text-secondary-fixed-dim bg-secondary-container px-2 py-0.5 rounded uppercase tracking-tight max-w-[160px] truncate" title={p.category.name}>
                        {p.category.name}
                      </span>
                      <span className="block text-[10px] text-on-surface-variant font-medium">
                        {genderLabel}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-admin-body font-medium text-text-primary">
                        ${Number(p.price).toFixed(2)}
                      </span>
                      {p.originalPrice ? (
                        <span className="text-[11px] text-text-muted line-through">
                          ${Number(p.originalPrice).toFixed(2)}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-admin-body text-text-primary font-medium">
                    {stock} in stock
                  </td>
                  <td className="py-4 px-4">
                    {p.isPublished ? (
                      <span className="px-3 py-1 bg-success/15 text-success text-[10px] font-bold rounded-full uppercase tracking-wider border border-success/20">
                        Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-secondary-container text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    {superAdmin ? (
                      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-[13px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Edit
                          <AdminIcon name="chevron_right" className="text-[16px]" />
                        </Link>
                        <DeleteProductButton productId={p.id} productName={p.name} />
                      </div>
                    ) : (
                      <span className="text-[13px] text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
