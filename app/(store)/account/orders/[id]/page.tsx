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

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/account/orders"
            className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors flex items-center gap-1 mb-4 text-sm"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            All Orders
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-1">
            Order #{order.displayId}
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 mb-6">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-6 text-sm">
            Order Status
          </h2>
          <OrderTimeline status={order.status} />
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 mb-6">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-4 text-sm">
            Items ({order.items.length})
          </h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item) => {
              const colorMatch = item.product?.colors.find(
                (c) => c.name === item.colorName,
              );
              const imgUrl = colorMatch?.images[0]?.url;

              return (
                <div key={item.id} className="flex items-center gap-4">
                  {imgUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                      <Image
                        src={imgUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-surface-container flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-on-surface truncate">{item.productName}</p>
                    <p className="font-body-md text-on-surface-variant text-sm">
                      {item.colorName} · Size {item.size} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-body-md text-on-surface flex-shrink-0">
                    ${(Number(item.unitPrice) * item.qty).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-outline-variant mt-4 pt-4 flex flex-col gap-2">
            <div className="flex justify-between font-body-md text-on-surface-variant">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-body-md text-on-surface-variant">
              <span>Shipping</span>
              <span>
                {Number(order.shippingCost) === 0
                  ? "Free"
                  : `$${Number(order.shippingCost).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-headline-sm text-on-surface mt-1">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-4 text-sm">
            Shipping Address
          </h2>
          <address className="not-italic font-body-md text-on-surface leading-relaxed">
            <p>{order.fullName}</p>
            <p>{address.address1}</p>
            {address.address2 && <p>{address.address2}</p>}
            <p>
              {address.city}, {address.state} {address.zip}
            </p>
            <p>{address.country}</p>
          </address>
        </div>
      </div>
    </main>
  );
}
