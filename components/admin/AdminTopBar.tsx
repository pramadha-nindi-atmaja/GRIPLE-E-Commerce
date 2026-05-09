"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminTopBarSearch } from "@/components/admin/AdminTopBarSearch";

function titleFromPath(pathname: string): string {
  if (pathname === "/admin/dashboard") return "Dashboard";
  if (pathname === "/admin/products/new") return "New product";
  if (pathname.startsWith("/admin/products/")) return "Edit product";
  if (pathname === "/admin/products") return "Products";
  if (pathname.startsWith("/admin/orders/")) return "Order detail";
  if (pathname === "/admin/orders") return "Orders";
  if (pathname === "/admin/settings" || pathname.startsWith("/admin/settings/"))
    return "Settings";
  if (pathname === "/admin/profile" || pathname.startsWith("/admin/profile/"))
    return "Profile";
  return "Admin";
}

type AdminTopBarProps = {
  userName?: string | null;
  userRole?: string | null;
  productCount?: number;
  orderCount?: number;
};

export function AdminTopBar({
  userName,
  userRole,
  productCount,
  orderCount,
}: AdminTopBarProps) {
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  const badge =
    pathname === "/admin/products"
      ? productCount !== undefined
        ? `${productCount} products`
        : null
      : pathname === "/admin/orders"
        ? orderCount !== undefined
          ? `${orderCount} orders`
          : null
        : null;

  return (
    <header
      className="fixed top-0 right-0 h-16 z-40 bg-surface border-b border-admin-border"
      style={{ left: "var(--spacing-sidebar-width)" }}
    >
      <div className="flex justify-between items-center px-container-padding w-full h-full">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[20px] font-bold text-primary truncate leading-tight">
              {title}
            </h1>
            {badge ? (
              <span className="hidden sm:inline-flex px-3 py-1 bg-surface-container rounded-full text-text-muted font-medium text-[12px] whitespace-nowrap shrink-0">
                {badge}
              </span>
            ) : null}
          </div>
          <Suspense fallback={null}>
            <AdminTopBarSearch />
          </Suspense>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <button
            type="button"
            className="material-symbols-outlined text-secondary cursor-pointer p-2 rounded-full hover:bg-surface-container-low transition-opacity hidden sm:inline-flex"
            aria-label="Notifications"
          >
            notifications
          </button>
          <button
            type="button"
            className="material-symbols-outlined text-secondary cursor-pointer p-2 rounded-full hover:bg-surface-container-low transition-opacity hidden sm:inline-flex border-0 bg-transparent"
            aria-label="Help"
          >
            help_outline
          </button>
          <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2">
            <div
              className="w-8 h-8 rounded-full border border-admin-border bg-surface-container-low flex items-center justify-center text-admin-body font-medium text-text-muted"
              aria-hidden
            >
              {(userName ?? "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden min-[380px]:flex flex-col items-start">
              <span className="text-admin-body font-medium text-text-primary leading-tight">
                {userName ?? "Admin"}
              </span>
              {userRole ? (
                <span className="text-[11px] text-text-muted uppercase tracking-wide">
                  {userRole.replace("_", " ")}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
