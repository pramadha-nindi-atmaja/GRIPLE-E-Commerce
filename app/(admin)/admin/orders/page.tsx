import Link from "next/link";

import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminOrderStatusFilters } from "@/components/admin/AdminOrderStatusFilters";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: statusRaw, q } = await searchParams;
  const filter: OrderStatus | "ALL" =
    statusRaw && statusRaw !== "ALL" && Object.values(OrderStatus).includes(statusRaw as OrderStatus)
      ? (statusRaw as OrderStatus)
      : "ALL";

  const orders = await prisma.order.findMany({
    where: {
      AND: [
        filter !== "ALL" ? { status: filter } : {},
        q?.trim()
          ? {
              OR: [
                { displayId: { contains: q.trim(), mode: "insensitive" } },
                { email: { contains: q.trim(), mode: "insensitive" } },
                { fullName: { contains: q.trim(), mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 150,
  });

  return (
    <>
      <div className="-mx-container-padding px-container-padding pb-stack-lg space-y-stack-md bg-background border-b border-admin-border mb-6">
        <AdminOrderStatusFilters q={q} currentStatus={filter} />
      </div>

      <div className="bg-surface rounded-2xl border border-admin-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[840px]">
            <thead>
              <tr className="border-b border-admin-border bg-surface-container-low/50">
                <th className="px-6 py-4 font-section-label text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 font-section-label text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 font-section-label text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 font-section-label text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 font-section-label text-[11px] text-on-surface-variant uppercase tracking-wider text-right">
                  Total
                </th>
                <th className="px-6 py-4 font-section-label text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-section-label text-[11px] text-on-surface-variant uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-text-muted text-admin-body"
                  >
                    Tidak ada pesanan.
                  </td>
                </tr>
              ) : (
                orders.map((o: (typeof orders)[number]) => {
                  const items = o.items.reduce(
                    (sum: number, item: (typeof o.items)[number]) => sum + item.qty,
                    0,
                  );
                  return (
                    <tr key={o.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-[13px] text-text-muted">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          #{o.displayId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-admin-body">
                        <div className="font-medium text-text-primary">{o.fullName}</div>
                        <div className="text-[12px] text-text-muted truncate max-w-[200px]">
                          {o.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-admin-body text-[13px] text-text-muted whitespace-nowrap">
                        {o.createdAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-admin-body text-text-muted">{items}x items</td>
                      <td className="px-6 py-4 text-admin-body font-bold text-text-primary text-right whitespace-nowrap">
                        ${Number(o.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center justify-center p-2 rounded-full text-secondary hover:bg-surface-container-low hover:text-primary transition-colors"
                          aria-label={`View order ${o.displayId}`}
                        >
                          <AdminIcon name="visibility" className="text-[20px]" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
