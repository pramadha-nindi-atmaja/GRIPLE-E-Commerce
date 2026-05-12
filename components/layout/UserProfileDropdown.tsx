"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/lib/hooks/useOnClickOutside";

export function UserProfileDropdown() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  const isCustomer = session?.user?.role === "CUSTOMER";

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse" />
    );
  }

  if (!isCustomer) {
    return (
      <button
        type="button"
        aria-label="Sign in"
        onClick={() => router.push("/account/login")}
        className="p-2 rounded-full hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[22px] text-on-surface">
          person
        </span>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="My account"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[22px] text-primary">
          person
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-surface rounded-2xl shadow-lg border border-outline-variant overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-outline-variant">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">
              Signed in as
            </p>
            <p className="font-body-md text-on-surface truncate mt-0.5">
              {session.user.name}
            </p>
          </div>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 font-body-md text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            My Orders
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="flex items-center gap-3 px-4 py-3 w-full font-body-md text-error hover:bg-error-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
