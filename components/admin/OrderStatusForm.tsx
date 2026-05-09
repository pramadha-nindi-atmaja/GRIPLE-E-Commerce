"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateOrderStatusAction } from "@/lib/actions/admin/orders";

import { ORDER_STATUSES, type OrderStatus } from "@/lib/types/order-status";

const OPTIONS = ORDER_STATUSES;

type OrderStatusFormProps = {
  orderId: string;
  current: OrderStatus;
};

export function OrderStatusForm({ orderId, current }: OrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(current);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await updateOrderStatusAction(orderId, status);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui");
    }
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {error ? <p className="text-error text-admin-body text-[13px]">{error}</p> : null}
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-medium text-on-surface-variant">Status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full rounded-xl border border-admin-border px-4 py-3 text-admin-body bg-background outline-none focus:ring-1 focus:ring-primary"
        >
          {OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={pending || status === current}
        className="w-full h-11 rounded-full bg-primary text-on-primary text-[13px] font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {pending ? "Menyimpan…" : "Apply status"}
      </button>
    </form>
  );
}
