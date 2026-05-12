import { cn } from "@/lib/utils/cn";
import type { OrderStatus } from "@/lib/types/order-status";

const STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "PENDING", label: "Order Placed", icon: "shopping_bag" },
  { status: "PROCESSING", label: "Payment Confirmed", icon: "payments" },
  { status: "SHIPPED", label: "Shipped", icon: "local_shipping" },
  { status: "DELIVERED", label: "Delivered", icon: "check_circle" },
];

const STATUS_RANK: Record<OrderStatus, number> = {
  PENDING: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: -1,
};

type Props = { status: OrderStatus };

export function OrderTimeline({ status }: Props) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-error font-label-caps text-label-caps uppercase tracking-widest">
        <span className="material-symbols-outlined text-[20px]">cancel</span>
        Order Cancelled
      </div>
    );
  }

  const currentRank = STATUS_RANK[status];

  return (
    <div className="flex items-start gap-0 w-full">
      {STEPS.map((step, idx) => {
        const rank = STATUS_RANK[step.status];
        const reached = currentRank >= rank;
        const isActive = currentRank === rank;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.status} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* connector line left */}
              {idx > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    currentRank >= rank ? "bg-primary" : "bg-outline-variant",
                  )}
                />
              )}

              {/* circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0",
                  reached
                    ? "bg-primary border-primary text-on-primary"
                    : "bg-surface border-outline-variant text-on-surface-variant",
                  isActive && "ring-2 ring-primary ring-offset-2",
                )}
              >
                <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
              </div>

              {/* connector line right */}
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    currentRank > rank ? "bg-primary" : "bg-outline-variant",
                  )}
                />
              )}
            </div>

            <p
              className={cn(
                "mt-2 font-label-caps text-[10px] tracking-widest uppercase text-center leading-tight",
                reached ? "text-primary" : "text-on-surface-variant",
                isActive && "font-semibold",
              )}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
