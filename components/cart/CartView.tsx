"use client";

import Link from "next/link";

import { CartItem } from "@/components/cart/CartItem";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { useCartStore } from "@/lib/stores/cart.store";

export function CartView() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());

  if (!mounted) {
    return (
      <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        <section className="md:col-span-7 flex flex-col gap-12">
          <div className="h-8 w-48 rounded-full bg-surface-container-high animate-pulse" />
          <div className="flex flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-8 flex flex-row items-center gap-6 border-b border-outline-variant">
                <div className="w-20 h-[100px] rounded-2xl bg-surface-container-high animate-pulse shrink-0" />
                <div className="flex-grow flex flex-col gap-2 min-w-0">
                  <div className="h-5 w-3/4 rounded-full bg-surface-container-high animate-pulse" />
                  <div className="h-4 w-1/3 rounded-full bg-surface-container-high animate-pulse" />
                </div>
                <div className="w-24 h-10 rounded-xl bg-surface-container-high animate-pulse shrink-0" />
                <div className="w-16 h-5 rounded-full bg-surface-container-high animate-pulse shrink-0" />
                <div className="w-6 h-6 rounded-full bg-surface-container-high animate-pulse shrink-0 ml-4" />
              </div>
            ))}
          </div>
        </section>
        <aside className="md:col-span-5 sticky top-24">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-10 flex flex-col gap-8">
            <div className="h-3 w-32 rounded-full bg-surface-container-high animate-pulse" />
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 rounded-full bg-surface-container-high animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-surface-container-high animate-pulse" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 rounded-full bg-surface-container-high animate-pulse" />
                <div className="h-4 w-28 rounded-full bg-surface-container-high animate-pulse" />
              </div>
            </div>
            <div className="h-px w-full bg-surface-container-high animate-pulse" />
            <div className="flex justify-between items-center">
              <div className="h-6 w-12 rounded-full bg-surface-container-high animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-surface-container-high animate-pulse" />
            </div>
            <div className="w-full h-14 rounded-full bg-surface-container-high animate-pulse mt-4" />
          </div>
        </aside>
      </main>
    );
  }

  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
      <section className="md:col-span-7 flex flex-col gap-12">
        <h1 className="font-headline-lg text-headline-lg text-primary">
          Your Cart ({items.length} items)
        </h1>

        <div className="flex flex-col">
          {items.map((item) => (
            <CartItem
              key={`${item.productId}-${item.color}-${item.size}`}
              item={item}
            />
          ))}
        </div>

        <Link
          href="/store"
          className="flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors w-fit mt-4"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Continue Shopping
        </Link>
      </section>

      <aside className="md:col-span-5 sticky top-24">
        <OrderSummary
          subtotal={total}
          ctaHref="/checkout"
          ctaLabel="Proceed to Checkout"
        />
      </aside>
    </main>
  );
}
