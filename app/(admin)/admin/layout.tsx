import type { Metadata } from "next";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s — Griple Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  const [productCount, orderCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
  ]);

  return (
    <div className="min-h-screen bg-admin-bg text-text-primary antialiased">
      <AdminSidebar />
      <div className="min-h-screen" style={{ marginLeft: "var(--spacing-sidebar-width)" }}>
        <AdminTopBar
          userName={session?.user?.name}
          userRole={session?.user?.role}
          productCount={productCount}
          orderCount={orderCount}
        />
        <div className="pt-16 p-container-padding">{children}</div>
      </div>
    </div>
  );
}
