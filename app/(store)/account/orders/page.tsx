import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderCard } from "@/components/account/OrderCard";

export const metadata = { title: "My Orders — Griple" };

export default async function OrdersPage() {
  const session = await auth();
  const customerId = session!.user.id;

  const orders = await prisma.order.findMany({
    where: { customerId },
    include: { items: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background mb-1">
              My Orders
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Hi, {session!.user.name}
            </p>
          </div>
          <Link
            href="/store"
            className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors text-sm"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant">
              receipt_long
            </span>
            <p className="font-body-md text-on-surface-variant">
              No orders yet. Start shopping!
            </p>
            <Link
              href="/store"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                displayId={order.displayId}
                status={order.status}
                total={Number(order.total)}
                itemCount={order.items.length}
                createdAt={order.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
