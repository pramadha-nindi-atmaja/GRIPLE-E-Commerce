"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useCartStore } from "@/lib/stores/cart.store";
import type { CheckoutFormValues } from "@/lib/schemas/checkout";
import type { CartItem } from "@/lib/types";
import { getMockCartItems } from "@/lib/mock/cart";

const STORAGE_KEY = "griple-last-order";

type Snapshot = {
  orderId: string;
  customerId?: string | null;
  items: CartItem[];
  total: number;
  shipping?: CheckoutFormValues;
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

type VerifyResponse = {
  id: string;
  status:
    | "succeeded"
    | "processing"
    | "requires_payment_method"
    | "requires_action"
    | "requires_confirmation"
    | "requires_capture"
    | "canceled";
  amount: number;
  currency: string;
  orderId: string | null;
  receiptEmail: string | null;
};

type VerifyState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; data: VerifyResponse }
  | { kind: "error"; message: string };

export function OrderConfirmationView() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const orderIdFromUrl = searchParams.get("orderId");
  const clearCart = useCartStore((s) => s.clear);
  const persistedOrderRef = useRef(false);

  const snapshot = useSyncExternalStore(
    () => () => {},
    readSnapshot,
    () => null,
  );

  const [verify, setVerify] = useState<VerifyState>(
    paymentIntentId ? { kind: "loading" } : { kind: "idle" },
  );

  useEffect(() => {
    if (!paymentIntentId) return;
    const controller = new AbortController();

    fetch(
      `/api/checkout/verify?payment_intent=${encodeURIComponent(paymentIntentId)}`,
      { signal: controller.signal },
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to verify payment");
        }
        return data as VerifyResponse;
      })
      .then((data) => setVerify({ kind: "ok", data }))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setVerify({
          kind: "error",
          message: err instanceof Error ? err.message : "Failed to verify payment",
        });
      });

    return () => controller.abort();
  }, [paymentIntentId]);

  useEffect(() => {
    if (persistedOrderRef.current) return;
    if (!paymentIntentId) return;
    if (verify.kind !== "ok") return;
    if (verify.data.status !== "succeeded" && verify.data.status !== "processing") {
      return;
    }
    const snap = readSnapshot();
    if (!snap?.items?.length || !snap.shipping) return;

    persistedOrderRef.current = true;
    void fetch("/api/orders/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId,
        displayOrderId: snap.orderId,
        customerId: snap.customerId ?? undefined,
        shipping: snap.shipping,
        items: snap.items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          colorName: i.color,
          colorHex: i.colorHex,
          size: i.size,
          qty: i.qty,
          unitPrice: i.price,
        })),
      }),
    }).then(async (res) => {
      if (!res.ok) persistedOrderRef.current = false;
    });
  }, [paymentIntentId, verify]);

  // Clear the cart once we've confirmed the payment actually succeeded —
  // covers the 3DS redirect path where CheckoutForm could not clear it.
  useEffect(() => {
    if (verify.kind === "ok" && verify.data.status === "succeeded") {
      clearCart();
    }
  }, [verify, clearCart]);

  const items = snapshot?.items ?? getMockCartItems();
  const fallbackTotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const verifiedOrderId = verify.kind === "ok" ? verify.data.orderId : null;
  const orderId =
    snapshot?.orderId ?? verifiedOrderId ?? orderIdFromUrl ?? "GR-MOCK-0001";

  const verifiedTotal =
    verify.kind === "ok" ? verify.data.amount / 100 : null;
  const total = verifiedTotal ?? snapshot?.total ?? fallbackTotal;

  // Branch on status when we actually have a payment_intent param to verify.
  const status: "succeeded" | "processing" | "failed" | "unknown" =
    !paymentIntentId
      ? "unknown"
      : verify.kind === "ok"
        ? verify.data.status === "succeeded"
          ? "succeeded"
          : verify.data.status === "processing"
            ? "processing"
            : "failed"
        : "unknown";

  if (paymentIntentId && verify.kind === "loading") {
    return (
      <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-[64px] text-primary mb-8 animate-pulse">
            sync
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">
            Verifying your payment…
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Please wait while we confirm your transaction with Stripe.
          </p>
        </div>
      </main>
    );
  }

  if (status === "failed" || verify.kind === "error") {
    const message =
      verify.kind === "error"
        ? verify.message
        : verify.kind === "ok"
          ? `Payment ${verify.data.status.replace(/_/g, " ")}.`
          : "Payment was not completed.";
    return (
      <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-[64px] text-error mb-8">
            error
          </span>
          <div className="font-label-caps text-label-caps text-outline tracking-widest uppercase mb-4">
            Payment Issue
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">
            We couldn&apos;t complete your order
          </h1>
          <p className="font-body-md text-on-surface-variant mb-10">{message}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors"
            >
              Try again
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-outline text-on-surface font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isProcessing = status === "processing";

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
        <span className="material-symbols-outlined text-[64px] text-primary mb-8">
          {isProcessing ? "schedule" : "check_circle"}
        </span>

        <div className="font-label-caps text-label-caps text-outline tracking-widest uppercase mb-4">
          {isProcessing ? "Payment Processing" : "Order Confirmed"}
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">
          {isProcessing
            ? "Your payment is being processed"
            : "Thank you for your order"}
        </h1>

        <p className="font-body-md text-on-surface-variant mb-10">
          {isProcessing ? (
            <>
              Order <span className="text-primary font-semibold">#{orderId}</span> is
              waiting for confirmation. We&apos;ll email you once it clears.
            </>
          ) : (
            <>
              Your order <span className="text-primary font-semibold">#{orderId}</span>{" "}
              has been placed successfully.
            </>
          )}
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
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-outline text-on-surface font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            Track order
          </Link>
        </div>
      </div>
    </main>
  );
}
