import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderCard } from "@/components/account/OrderCard";

export const metadata = { title: "My Orders — Griple" };

export default async function OrdersPage() {
  const session = await auth();
  const customerId = session!.user.id;
  const name = session!.user.name ?? "there";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const orders = await prisma.order.findMany({
    where: { customerId },
    include: { items: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-2xl">

        {/* Profile header */}
        <div className="mb-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-xl font-bold select-none flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-0.5">My Account</p>
            <h1 className="font-semibold text-xl text-on-surface truncate">{name}</h1>
          </div>
          <Link
            href="/store"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant rounded-full px-4 py-2 hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[14px]">storefront</span>
            Shop
          </Link>
        </div>

        {/* Stats row */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest text-center">
              <p className="text-2xl font-bold text-on-surface">{orders.length}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Total Orders</p>
            </div>
            <div className="p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest text-center">
              <p className="text-2xl font-bold text-on-surface">${totalSpent.toFixed(2)}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Total Spent</p>
            </div>
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base text-on-surface">Order History</h2>
          {orders.length > 0 && (
            <span className="text-xs text-on-surface-variant">{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-5 rounded-2xl border border-outline-variant bg-surface-container-lowest">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">receipt_long</span>
            </div>
            <div>
              <p className="font-semibold text-on-surface mb-1">No orders yet</p>
              <p className="text-sm text-on-surface-variant">Your order history will appear here.</p>
            </div>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
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
