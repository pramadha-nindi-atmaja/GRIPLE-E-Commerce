import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderTimeline } from "@/components/account/OrderTimeline";

export const metadata = { title: "Order Detail — Griple" };

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const customerId = session!.user.id;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              colors: {
                include: { images: { orderBy: { position: "asc" }, take: 1 } },
              },
            },
          },
        },
      },
    },
  });

  if (!order || order.customerId !== customerId) notFound();

  const address = order.shippingAddress as {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  const placedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-2xl">

        {/* Back nav */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          All Orders
        </Link>

        {/* Page header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-bold text-2xl text-on-background leading-tight">Order #{order.displayId}</h1>
            <p className="text-sm text-on-surface-variant mt-1">Placed on {placedDate}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 mb-4">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-5">Order Status</p>
          <OrderTimeline status={order.status} />
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 mb-4">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-5">
            Items ({order.items.length})
          </p>
          <div className="flex flex-col divide-y divide-outline-variant">
            {order.items.map((item) => {
              const colorMatch = item.product?.colors.find((c) => c.name === item.colorName);
              const imgUrl = colorMatch?.images[0]?.url;

              return (
                <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  {imgUrl ? (
                    <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                      <Image
                        src={imgUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-xl bg-surface-container flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px] text-on-surface-variant/40">image</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-on-surface truncate">{item.productName}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {item.colorName} · Size {item.size}
                    </p>
                    <p className="text-xs text-on-surface-variant">Qty {item.qty}</p>
                  </div>
                  <p className="font-semibold text-sm text-on-surface flex-shrink-0">
                    ${(Number(item.unitPrice) * item.qty).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Price summary */}
          <div className="mt-4 pt-4 border-t border-outline-variant flex flex-col gap-2">
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Shipping</span>
              <span>
                {Number(order.shippingCost) === 0 ? "Free" : `$${Number(order.shippingCost).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-on-surface mt-1 pt-2 border-t border-outline-variant">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Shipping Address</p>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant mt-0.5 flex-shrink-0">location_on</span>
            <address className="not-italic text-sm text-on-surface leading-relaxed">
              <p className="font-medium">{order.fullName}</p>
              <p className="text-on-surface-variant">{address.address1}</p>
              {address.address2 && <p className="text-on-surface-variant">{address.address2}</p>}
              <p className="text-on-surface-variant">
                {address.city}, {address.state} {address.zip}
              </p>
              <p className="text-on-surface-variant">{address.country}</p>
            </address>
          </div>
        </div>

      </div>
    </main>
  );
}
