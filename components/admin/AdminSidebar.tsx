"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const mainNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "inventory_2" },
  { href: "/admin/orders", label: "Orders", icon: "shopping_cart" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  function linkCls(href: string) {
    const active =
      pathname === href || pathname === `${href}/` || pathname.startsWith(`${href}/`);
    const base =
      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all scale-[0.98] active:opacity-80";
    if (active) {
      return `${base} text-sidebar-text-active bg-tertiary-container`;
    }
    return `${base} text-sidebar-text hover:bg-tertiary-container/50 hover:text-sidebar-text-active`;
  }

  return (
    <aside
      className="w-sidebar-width h-screen fixed left-0 top-0 bg-sidebar-bg z-50 border-r border-outline-variant flex flex-col"
      aria-label="Admin navigation"
    >
      <div className="flex flex-col justify-between py-8 px-4 h-full">
        <div>
          <div className="px-4 mb-10">
            <p className="text-admin-page-title font-black tracking-tighter text-on-primary leading-tight">
              GRIPLE
            </p>
            <p className="text-[10px] text-sidebar-text font-bold tracking-[0.2em] uppercase mt-1 opacity-50">
              Admin Dashboard
            </p>
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className={linkCls(item.href)}>
                <AdminIcon
                  name={item.icon}
                  className="text-[20px]"
                  filled={
                    pathname === item.href ||
                    pathname === `${item.href}/` ||
                    pathname.startsWith(`${item.href}/`)
                  }
                />
                <span className="text-sidebar-nav">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-1">
          <Link
            href="/admin/profile"
            className={linkCls("/admin/profile")}
          >
            <AdminIcon
              name="account_circle"
              className="text-[20px]"
              filled={
                pathname === "/admin/profile" ||
                pathname === "/admin/profile/"
              }
            />
            <span className="text-sidebar-nav">Profile</span>
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
    </aside>
  );
}
