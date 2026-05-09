import type { OrderStatus } from "@/lib/types/order-status";

const STATUS_STYLES: Record<OrderStatus, string> = {
  SHIPPED: "bg-green-100 text-green-700",
  DELIVERED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cls = STATUS_STYLES[status];
  return (
    <span
      className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}
