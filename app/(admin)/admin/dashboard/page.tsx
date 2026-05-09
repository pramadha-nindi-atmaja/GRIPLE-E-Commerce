import Link from "next/link";
import type { ReactNode } from "react";

import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { prisma } from "@/lib/prisma";

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const excluded = { not: "CANCELLED" as const };

  const [
    totalOrders,
    pendingOrders,
    publishedProducts,
    draftProducts,
    revenueAgg,
    revenueThisAgg,
    revenueLastAgg,
    recentOrders,
    orderItemsAgg,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { isPublished: false } }),
    prisma.order.aggregate({
      where: { status: excluded },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: excluded, createdAt: { gte: startThisMonth } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: excluded,
        createdAt: { gte: startLastMonth, lt: startThisMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
    prisma.orderItem.findMany({
      where: { order: { status: excluded } },
      select: {
        productId: true,
        productName: true,
        qty: true,
        unitPrice: true,
      },
    }),
  ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);
  const revThis = Number(revenueThisAgg._sum.total ?? 0);
  const revLast = Number(revenueLastAgg._sum.total ?? 0);
  const avgOrder = totalOrders > 0 ? revenue / totalOrders : 0;

  const revDeltaPct =
    revLast > 0 ? Math.round(((revThis - revLast) / revLast) * 100) : revThis > 0 ? 100 : 0;

  const byProduct = new Map<
    string,
    { revenue: number; qty: number; name: string }
  >();
  for (const it of orderItemsAgg) {
    const line = Number(it.unitPrice) * it.qty;
    const cur = byProduct.get(it.productId) ?? {
      revenue: 0,
      qty: 0,
      name: it.productName,
    };
    cur.revenue += line;
    cur.qty += it.qty;
    cur.name = it.productName;
    byProduct.set(it.productId, cur);
  }

  const topIds = [...byProduct.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 4)
    .map(([id]) => id);

  const topProducts =
    topIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: topIds } },
          include: {
            category: true,
            colors: {
              orderBy: { position: "asc" },
              include: {
                images: { orderBy: { position: "asc" }, take: 1 },
              },
              take: 1,
            },
          },
        })
      : [];

  const topOrdered = topIds
    .map((id) => {
      const p = topProducts.find((x) => x.id === id);
      const agg = byProduct.get(id)!;
      const img = p?.colors[0]?.images[0]?.url;
      return p
        ? { product: p, revenue: agg.revenue, qty: agg.qty, thumb: img }
        : null;
    })
    .filter(Boolean) as {
    product: (typeof topProducts)[0];
    revenue: number;
    qty: number;
    thumb?: string;
  }[];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg mt-stack-lg">
        <StatCard
          label="Total revenue"
          value={formatUsd(revenue)}
          icon="payments"
          hint={
            revThis > 0 || revLast > 0 ? (
              <p className="text-success text-[12px] font-semibold flex items-center gap-1">
                <AdminIcon name="trending_up" className="text-[14px]" />
                {revLast > 0
                  ? `${revDeltaPct >= 0 ? "+" : ""}${revDeltaPct}% from last month`
                  : "No comparison last month"}
              </p>
            ) : (
              <p className="text-[12px] text-text-muted font-medium">No paid orders yet</p>
            )
          }
        />
        <StatCard
          label="Total orders"
          value={String(totalOrders)}
          icon="shopping_bag"
          hint={
            <p className="text-warning text-[12px] font-semibold flex items-center gap-1">
              <AdminIcon name="pending_actions" className="text-[14px]" />
              {pendingOrders} pending action
              {pendingOrders !== 1 ? "s" : ""}
            </p>
          }
        />
        <StatCard
          label="Published products"
          value={String(publishedProducts)}
          icon="inventory_2"
          hint={
            <p className="text-text-muted text-[12px] font-medium">{draftProducts} drafts</p>
          }
        />
        <StatCard
          label="Avg. order value"
          value={formatUsd(avgOrder)}
          icon="analytics"
          hint={
            <p className="text-text-muted text-[12px] font-medium">
              Based on all non-cancelled orders
            </p>
          }
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-gutter">
        <div className="lg:col-span-3 bg-surface rounded-2xl border border-admin-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-admin-border flex justify-between items-center bg-white">
            <h2 className="text-admin-page-title text-[18px] font-bold text-text-primary">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All
              <AdminIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admin-bg/80">
                  <th className="px-6 py-4 font-section-label text-[11px] text-text-muted uppercase tracking-wider border-b border-admin-border">
                    Order ID
                  </th>
                  <th className="px-6 py-4 font-section-label text-[11px] text-text-muted uppercase tracking-wider border-b border-admin-border">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-section-label text-[11px] text-text-muted uppercase tracking-wider border-b border-admin-border">
                    Items
                  </th>
                  <th className="px-6 py-4 font-section-label text-[11px] text-text-muted uppercase tracking-wider border-b border-admin-border">
                    Total
                  </th>
                  <th className="px-6 py-4 font-section-label text-[11px] text-text-muted uppercase tracking-wider border-b border-admin-border">
                    Status
                  </th>
                  <th className="px-6 py-4 font-section-label text-[11px] text-text-muted uppercase tracking-wider border-b border-admin-border">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-text-muted text-admin-body"
                    >
                      Belum ada pesanan.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => {
                    const n = o.items.reduce((s, i) => s + i.qty, 0);
                    return (
                      <tr key={o.id}>
                        <td className="px-6 py-4 font-mono text-[13px] text-text-muted">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="hover:text-primary hover:underline"
                          >
                            #{o.displayId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-admin-body font-medium text-text-primary">
                          {o.fullName}
                        </td>
                        <td className="px-6 py-4 text-admin-body text-text-muted">
                          {n}x items
                        </td>
                        <td className="px-6 py-4 text-admin-body font-bold text-text-primary">
                          {formatUsd(Number(o.total))}
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={o.status} />
                        </td>
                        <td className="px-6 py-4 text-admin-body text-text-muted text-[13px]">
                          {o.createdAt.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface rounded-2xl border border-admin-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-admin-border bg-white">
            <h2 className="text-admin-page-title text-[18px] font-bold text-text-primary">
              Top Products
            </h2>
          </div>
          <div className="p-4 space-y-4 flex-1">
            {topOrdered.length === 0 ? (
              <p className="text-admin-body text-text-muted px-2 py-6 text-center">
                Belum ada data penjualan.
              </p>
            ) : (
              topOrdered.map(({ product, revenue: rev, qty, thumb }, idx) => (
                <div key={product.id}>
                  {idx > 0 ? <div className="h-px bg-admin-border mx-2 mb-4" /> : null}
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-surface-container rounded-xl overflow-hidden flex-shrink-0 relative">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="text-admin-body font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                          {product.name}
                        </p>
                        <p className="text-admin-label-sm text-text-muted">
                          {product.category.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 pl-2">
                      <p className="text-admin-body font-black text-text-primary">
                        {formatUsd(rev)}
                      </p>
                      <p className="text-[11px] text-success font-bold uppercase tracking-tighter">
                        {qty} sales
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="mt-auto p-6 bg-surface-container-low/30 border-t border-admin-border">
            <Link
              href="/admin/products"
              className="w-full py-2 bg-primary text-on-primary rounded-full font-bold text-[13px] hover:opacity-90 transition-all flex items-center justify-center gap-2 text-admin-body"
            >
              Manage Inventory
              <AdminIcon name="open_in_new" className="text-[16px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: string;
  hint: ReactNode;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="font-section-label text-section-label-muted tracking-widest">
          {label}
        </span>
        <span className="material-symbols-outlined text-primary bg-surface-container-low p-2 rounded-xl text-[20px]">
          {icon}
        </span>
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-bold tracking-tight text-text-primary">{value}</h3>
        {hint}
      </div>
    </div>
  );
}
