"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { OrderStatus } from "@/lib/types/order-status";

import { updateOrderStatusAction } from "@/lib/actions/admin/orders";

type OrderQuickActionsProps = {
  orderId: string;
  status: OrderStatus;
};

export function OrderQuickActions({ orderId, status }: OrderQuickActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function setStatus(next: OrderStatus) {
    setPending(true);
    try {
      await updateOrderStatusAction(orderId, next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="bg-primary p-6 rounded-2xl text-white print:hidden">
      <h3 className="font-bold text-sm mb-2">Quick Actions</h3>
      <p className="text-xs text-white/60 mb-4">Manage the fulfillment flow of this order.</p>
      <div className="space-y-2">
        {status === "PENDING" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("PROCESSING")}
            className="w-full py-3 bg-white text-primary rounded-full text-xs font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            Confirm payment
          </button>
        ) : null}
        {status === "PROCESSING" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("SHIPPED")}
            className="w-full py-3 bg-white text-primary rounded-full text-xs font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            Fulfill Order
          </button>
        ) : null}
        {status === "SHIPPED" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("DELIVERED")}
            className="w-full py-3 bg-white text-primary rounded-full text-xs font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            Mark delivered
          </button>
        ) : null}
        {status !== "CANCELLED" && status !== "DELIVERED" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm("Cancel this order?")) void setStatus("CANCELLED");
            }}
            className="w-full py-3 bg-white/10 text-white rounded-full text-xs font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            Cancel Order
          </button>
        ) : null}
      </div>
    </section>
  );
}
