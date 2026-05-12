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

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-surface-container text-on-surface-variant",
  PROCESSING: "bg-[#FFF8E1] text-[#F9A825]",
  SHIPPED: "bg-surface-container-high text-on-surface",
  DELIVERED: "bg-[#E8F5E9] text-[#2E7D32]",
  CANCELLED: "bg-error-container text-error",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  PENDING: "bg-on-surface-variant/40",
  PROCESSING: "bg-[#FFF8E1]",
  SHIPPED: "bg-on-surface",
  DELIVERED: "bg-[#2E7D32]",
  CANCELLED: "bg-error",
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
      className="group flex items-center gap-4 p-5 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container hover:border-outline hover:shadow-sm transition-all"
    >
      {/* Left: order icon */}
      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/90 transition-colors">
        <span className="material-symbols-outlined text-[22px] text-on-surface-variant group-hover:text-white/70 transition-colors">
          receipt_long
        </span>
      </div>

      {/* Middle: info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-on-surface">#{displayId}</span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full",
              STATUS_STYLE[status],
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", STATUS_DOT[status])} />
            {STATUS_LABEL[status]}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">
          {date} · {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Right: total + arrow */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-semibold text-base text-on-surface">${Number(total).toFixed(2)}</span>
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface group-hover:translate-x-0.5 transition-all">
          chevron_right
        </span>
      </div>
    </Link>
  );
}
