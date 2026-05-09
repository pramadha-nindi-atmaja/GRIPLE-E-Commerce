import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { OrderDetailHeaderBar } from "@/components/admin/OrderDetailHeaderBar";
import { OrderQuickActions } from "@/components/admin/OrderQuickActions";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { AdminIcon } from "@/components/admin/AdminIcon";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const addr = order.shippingAddress as {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  const productIds = [
    ...new Set(order.items.map((i: (typeof order.items)[number]) => i.productId)),
  ];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      colors: {
        orderBy: { position: "asc" },
        take: 1,
        select: {
          images: {
            orderBy: { position: "asc" },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });
  const thumbByProductId = new Map(
    products.map((p: (typeof products)[number]) => [
      p.id,
      p.colors[0]?.images[0]?.url ?? null,
    ] as const),
  );

  const itemCount = order.items.reduce(
    (sum: number, item: (typeof order.items)[number]) => sum + item.qty,
    0,
  );
  const paid = Boolean(order.paidAt);

  return (
    <div className="max-w-[1400px] mx-auto">
      <OrderDetailHeaderBar displayId={order.displayId} status={order.status} />

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          <section className="bg-surface rounded-2xl border border-admin-border overflow-hidden">
            <div className="p-6 border-b border-admin-border flex justify-between items-center">
              <h2 className="font-section-label text-section-label-secondary tracking-widest">
                Items Ordered
              </h2>
              <span className="text-secondary text-xs">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="p-6 space-y-6">
              {order.items.map((item: (typeof order.items)[number]) => {
                const thumb = thumbByProductId.get(item.productId);
                return (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-16 h-20 bg-surface-container rounded-xl overflow-hidden flex-shrink-0 relative">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary font-semibold text-base">
                        {item.productName}
                      </h3>
                      <div className="flex gap-4 mt-1 text-secondary text-xs flex-wrap">
                        <span className="flex items-center gap-1">
                          Color:{" "}
                          <span className="text-text-primary font-medium">{item.colorName}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Size:{" "}
                          <span className="text-text-primary font-medium">{item.size}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-secondary">
                        {item.qty} × ${Number(item.unitPrice).toFixed(2)}
                      </p>
                      <p className="text-text-primary font-bold mt-1">
                        ${(Number(item.unitPrice) * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mx-6 border-t border-admin-border" />
            <div className="p-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span className="text-text-primary font-medium">
                    ${Number(order.subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Shipping</span>
                  <span className="text-text-primary font-medium">
                    ${Number(order.shippingCost).toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-admin-border flex justify-between items-end">
                  <span className="text-secondary font-semibold">Total</span>
                  <span className="text-2xl font-extrabold text-primary tracking-tight">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt}
            paidAt={order.paidAt}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <section className="bg-surface rounded-2xl border border-admin-border p-6">
            <h2 className="font-section-label text-section-label-secondary tracking-widest mb-4">
              Customer Info
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-bold text-lg text-primary overflow-hidden">
                {order.fullName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-text-primary truncate">{order.fullName}</p>
                <div className="flex items-center gap-1.5 text-secondary text-xs mt-0.5">
                  <AdminIcon name="mail" className="text-[14px]" />
                  <span className="truncate">{order.email}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface rounded-2xl border border-admin-border p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-section-label text-section-label-secondary tracking-widest">
                Shipping Address
              </h2>
            </div>
            <div className="flex gap-3">
              <AdminIcon name="location_on" className="text-secondary text-[20px] shrink-0" />
              <address className="not-italic text-sm text-text-primary leading-relaxed">
                {addr.address1}
                {addr.address2 ? (
                  <>
                    <br />
                    {addr.address2}
                  </>
                ) : null}
                <br />
                {addr.city}, {addr.state} {addr.zip}
                <br />
                {addr.country}
              </address>
            </div>
            <div className="mt-4 pt-4 border-t border-admin-border">
              <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold mb-1">
                Shipping Method
              </p>
              <p className="text-sm font-medium">Standard shipping</p>
            </div>
          </section>

          <section className="bg-surface rounded-2xl border border-admin-border p-6">
            <h2 className="font-section-label text-section-label-secondary tracking-widest mb-4">
              Payment
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-6 bg-surface-container rounded flex items-center justify-center text-[10px] font-bold text-primary border border-admin-border shrink-0">
                    STRIPE
                  </div>
                  <p className="text-sm font-medium truncate">Card payment</p>
                </div>
                {paid ? (
                  <span className="text-success text-[10px] font-bold uppercase tracking-widest bg-success/10 px-2 py-0.5 rounded-full shrink-0">
                    Paid
                  </span>
                ) : (
                  <span className="text-warning text-[10px] font-bold uppercase tracking-widest bg-warning/10 px-2 py-0.5 rounded-full shrink-0">
                    Unpaid
                  </span>
                )}
              </div>
              {order.paymentIntentId ? (
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold mb-1">
                    Stripe Intent ID
                  </p>
                  <code className="text-xs font-mono text-secondary break-all">
                    {order.paymentIntentId}
                  </code>
                </div>
              ) : null}
              <div className="flex justify-between items-center text-xs gap-2">
                <span className="text-secondary shrink-0">Paid at</span>
                <span className="text-text-primary font-medium text-right">
                  {order.paidAt
                    ? order.paidAt.toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
              <div className="pt-3 border-t border-admin-border flex justify-between items-center">
                <span className="text-sm font-semibold">Total Amount</span>
                <span className="text-lg font-extrabold text-primary">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          <OrderQuickActions orderId={order.id} status={order.status} />

          <section className="bg-surface rounded-2xl border border-admin-border p-6 shadow-sm print:hidden">
            <h3 className="text-[13px] font-bold text-text-primary mb-3">Set status manually</h3>
            <OrderStatusForm orderId={order.id} current={order.status} />
          </section>

          <Link
            href="/admin/orders"
            className="inline-flex text-[13px] text-primary font-semibold hover:underline print:hidden"
          >
            ← Back to orders
          </Link>
        </div>
      </div>
    </div>
  );
}
