import Link from "next/link";

import { OrderStatus } from "@prisma/client";

const STATUSES: (OrderStatus | "ALL")[] = [
  "ALL",
  ...Object.values(OrderStatus),
];

function buildParams(q?: string, status?: OrderStatus | "ALL") {
  const p = new URLSearchParams();
  if (q?.trim()) p.set("q", q.trim());
  if (status && status !== "ALL") p.set("status", status);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function chipClass(active: boolean) {
  return active
    ? "px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold border border-primary"
    : "flex items-center gap-2 px-4 py-2 rounded-xl border border-admin-border text-admin-body hover:bg-surface-container-low transition-colors";
}

export function AdminOrderStatusFilters({
  q,
  currentStatus,
}: {
  q?: string;
  currentStatus: OrderStatus | "ALL";
}) {
  return (
    <div className="flex flex-wrap items-center gap-stack-md">
      <span className="text-xs font-bold text-outline uppercase tracking-wider shrink-0">
        Status
      </span>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = currentStatus === s;
          return (
            <Link
              key={s}
              href={`/admin/orders${buildParams(q, s)}`}
              className={chipClass(active)}
              scroll={false}
            >
              {s === "ALL" ? "All Statuses" : s.replace("_", " ")}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
