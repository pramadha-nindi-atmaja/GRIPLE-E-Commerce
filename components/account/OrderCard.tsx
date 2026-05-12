import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { OrderStatus } from "@/lib/types/order-status";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "text-on-surface-variant bg-surface-container",
  PROCESSING: "text-primary bg-primary-container",
  SHIPPED: "text-on-surface bg-surface-container-high",
  DELIVERED: "text-on-surface bg-[#E8F5E9] text-[#2E7D32]",
  CANCELLED: "text-error bg-error-container",
};

type Props = {
  id: string;
  displayId: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: Date | string;
};

export function OrderCard({ id, displayId, status, total, itemCount, createdAt }: Props) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/account/orders/${id}`}
      className="flex items-center justify-between p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors"
    >
      <div className="flex flex-col gap-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          #{displayId}
        </span>
        <span className="font-body-md text-on-surface-variant text-sm">{date}</span>
        <span className="font-body-md text-on-surface-variant text-sm">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="font-headline-sm text-on-surface">${Number(total).toFixed(2)}</span>
        <span
          className={cn(
            "font-label-caps text-[10px] tracking-widest uppercase px-3 py-1 rounded-full",
            STATUS_COLOR[status],
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
    </Link>
  );
}
