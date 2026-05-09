"use client";

import Link from "next/link";

import { OrderStatus } from "@prisma/client";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export function OrderDetailHeaderBar({
  displayId,
  status,
}: {
  displayId: string;
  status: OrderStatus;
}) {
  function onPrint() {
    window.print();
  }

  return (
    <div className="sticky top-16 z-30 -mx-container-padding px-container-padding py-3 bg-surface border-b border-admin-border flex flex-wrap items-center justify-between gap-4 mb-6">
      <nav className="flex items-center text-secondary text-sm gap-2 min-w-0">
        <Link href="/admin/orders" className="hover:text-primary transition-colors shrink-0">
          Orders
        </Link>
        <AdminIcon name="chevron_right" className="text-[16px] text-outline-variant shrink-0" />
        <span className="text-primary font-medium font-mono truncate">{displayId}</span>
      </nav>
      <div className="flex items-center gap-3 shrink-0">
        <OrderStatusBadge status={status} />
        <button
          type="button"
          onClick={onPrint}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors border border-admin-border text-secondary"
          aria-label="Print order"
        >
          <AdminIcon name="print" className="text-[20px]" />
        </button>
      </div>
    </div>
  );
}
