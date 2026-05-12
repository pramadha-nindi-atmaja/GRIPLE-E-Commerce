"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/lib/hooks/useOnClickOutside";
import { cn } from "@/lib/utils/cn";

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn(
        "rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold select-none flex-shrink-0",
        size === "sm" ? "w-8 h-8 text-[13px]" : "w-10 h-10 text-[15px]",
      )}
    >
      {initials}
    </div>
  );
}

export function UserProfileDropdown() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  const isCustomer = session?.user?.role === "CUSTOMER";

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse" />;
  }

  if (!isCustomer) {
    return (
      <button
        type="button"
        aria-label="Sign in"
        onClick={() => router.push("/account/login")}
        className="p-2 rounded-full hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[22px] text-on-surface">person</span>
      </button>
    );
  }

  const name = session!.user.name ?? "User";
  const email = session!.user.email ?? "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="My account"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "rounded-full transition-all ring-2",
          open ? "ring-primary ring-offset-2" : "ring-transparent hover:ring-outline-variant",
        )}
      >
        <Avatar name={name} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-60 bg-surface rounded-2xl shadow-xl border border-outline-variant overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-4 bg-surface-container-lowest border-b border-outline-variant flex items-center gap-3">
            <Avatar name={name} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-sm text-on-surface truncate leading-tight">{name}</p>
              {email && (
                <p className="text-xs text-on-surface-variant truncate mt-0.5 leading-tight">{email}</p>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">receipt_long</span>
              <span>My Orders</span>
            </Link>
          </div>

          <div className="border-t border-outline-variant py-1.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-error hover:bg-error-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
