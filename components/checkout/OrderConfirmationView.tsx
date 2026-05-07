"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import type { CartItem } from "@/lib/types";
import { getMockCartItems } from "@/lib/mock/cart";

const STORAGE_KEY = "griple-last-order";

type Snapshot = {
  orderId: string;
  items: CartItem[];
  total: number;
};

let lastSnapshotRaw: string | null | undefined;
let lastSnapshotParsed: Snapshot | null | undefined;

function readSnapshot(): Snapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === lastSnapshotRaw) {
      return lastSnapshotParsed === undefined ? null : lastSnapshotParsed;
    }
    lastSnapshotRaw = raw;
    if (!raw) {
      lastSnapshotParsed = null;
      return null;
    }
    const parsed = JSON.parse(raw) as Snapshot;
    if (parsed?.items && typeof parsed.total === "number") {
      lastSnapshotParsed = parsed;
      return parsed;
    }
    lastSnapshotParsed = null;
  } catch {
    lastSnapshotParsed = null;
  }
  return null;
}

export function OrderConfirmationView() {
  const snapshot = useSyncExternalStore(
    () => () => {},
    readSnapshot,
    () => null,
  );

  const items = snapshot?.items ?? getMockCartItems();
  const total = snapshot?.total ?? items.reduce((s, i) => s + i.price * i.qty, 0);
  const orderId = snapshot?.orderId ?? "GR-MOCK-0001";

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
        <span className="material-symbols-outlined text-[64px] text-primary mb-8">
          check_circle
        </span>

        <div className="font-label-caps text-label-caps text-outline tracking-widest uppercase mb-4">
          Order Confirmed
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">
          Thank you for your order
        </h1>

        <p className="font-body-md text-on-surface-variant mb-10">
          Your order <span className="text-primary font-semibold">#{orderId}</span> has been
          placed successfully.
        </p>

        <div className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="font-body-md text-on-surface-variant">Items</span>
            <span className="font-body-md text-primary">{items.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body-md text-on-surface-variant">Total</span>
            <span className="font-body-md text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/store"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors"
          >
            Continue Shopping
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-outline text-on-surface font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            Track order
          </button>
        </div>
      </div>
    </main>
  );
}
