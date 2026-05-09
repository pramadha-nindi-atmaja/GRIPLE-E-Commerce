"use client";

import { signOut } from "next-auth/react";

import { AdminIcon } from "@/components/admin/AdminIcon";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sidebar-text hover:bg-tertiary-container/50 hover:text-sidebar-text-active transition-colors"
    >
      <AdminIcon name="logout" className="text-[20px]" />
      <span className="text-sidebar-nav">Logout</span>
    </button>
  );
}
