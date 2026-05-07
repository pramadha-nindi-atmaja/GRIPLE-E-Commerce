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
      <div className="min-h-[320px] flex items-center justify-center text-on-surface-variant font-body-md">
        Loading cart…
      </div>
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
