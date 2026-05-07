"use client";

import { OrderSummary } from "@/components/cart/OrderSummary";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { useCartStore } from "@/lib/stores/cart.store";

export function CheckoutOrderSummary() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());

  if (!mounted) {
    return (
      <OrderSummary
        subtotal={0}
        items={[]}
        showItems
        className="opacity-60"
      />
    );
  }

  return <OrderSummary subtotal={total} items={items} showItems />;
}
