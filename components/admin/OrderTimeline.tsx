import type { OrderStatus } from "@/lib/types/order-status";

import { AdminIcon } from "@/components/admin/AdminIcon";

const STEPS: { key: string; label: string; minStatus: OrderStatus }[] = [
  { key: "placed", label: "Order Placed", minStatus: "PENDING" },
  { key: "payment", label: "Payment Confirmed", minStatus: "PROCESSING" },
  { key: "shipped", label: "Shipped", minStatus: "SHIPPED" },
  { key: "delivered", label: "Delivered", minStatus: "DELIVERED" },
];

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function statusIndex(s: OrderStatus): number {
  return STATUS_ORDER.indexOf(s);
}

function stepComplete(current: OrderStatus, stepMin: OrderStatus): boolean {
  if (current === "CANCELLED") {
    return stepMin === "PENDING";
  }
  if (statusIndex(current) < 0) return false;
  return statusIndex(current) >= statusIndex(stepMin);
}

type OrderTimelineProps = {
  status: OrderStatus;
  createdAt: Date;
  paidAt: Date | null;
};

export function OrderTimeline({ status, createdAt, paidAt }: OrderTimelineProps) {
  return (
    <section className="bg-surface rounded-2xl border border-admin-border p-6">
      <h2 className="font-section-label text-section-label-secondary tracking-widest mb-8">
        Order Timeline
      </h2>
      <div className="relative pl-8 space-y-10">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-surface-container-high" aria-hidden />

        {STEPS.map((step) => {
          const done = stepComplete(status, step.minStatus);
          const upcoming = !done && status !== "CANCELLED";

          let sub = "";
          if (step.key === "placed") {
            sub = createdAt.toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (step.key === "payment") {
            if (paidAt) {
              sub = paidAt.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            } else if (done) {
              sub = "Confirmed";
            } else if (upcoming) {
              sub = "Pending";
            }
          } else if (upcoming) {
            sub =
              step.key === "shipped"
                ? "Awaiting fulfillment"
                : "Pending carrier update";
          }

          return (
            <div key={step.key} className="relative">
              <div
                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full z-10 flex items-center justify-center ${
                  done
                    ? "bg-primary ring-4 ring-background"
                    : "border-2 border-surface-container-highest bg-background"
                }`}
              >
                {done ? (
                  <AdminIcon name="check" className="text-on-primary text-[12px]" filled />
                ) : null}
              </div>
              <div className={upcoming ? "opacity-40" : ""}>
                <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                {sub ? <p className="text-xs text-secondary mt-1">{sub}</p> : null}
              </div>
            </div>
          );
        })}

        {status === "CANCELLED" ? (
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-error ring-4 ring-background z-10" />
            <div>
              <p className="text-sm font-semibold text-error">Order Cancelled</p>
              <p className="text-xs text-secondary mt-1">Order will not be fulfilled</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
