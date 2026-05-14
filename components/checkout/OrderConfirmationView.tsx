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

function getEstimatedDelivery(): string {
  const start = new Date();
  start.setDate(start.getDate() + 5);
  const end = new Date();
  end.setDate(end.getDate() + 7);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
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
      <main className="flex-grow min-h-[calc(100vh-160px)] flex items-center justify-center py-6 px-8">
        <div className="w-full max-w-xl flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-[80px] text-primary animate-pulse">
            sync
          </span>
          <h1 className="text-2xl font-bold text-primary uppercase tracking-tight">
            Verifying your payment…
          </h1>
          <p className="text-sm text-on-surface-variant">
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
      <main className="flex-grow min-h-[calc(100vh-160px)] flex items-center justify-center py-6 px-8">
        <div className="w-full max-w-xl flex flex-col items-center text-center gap-6">
          <span className="material-symbols-outlined text-[80px] text-error">
            error
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary uppercase tracking-tight">
              We couldn&apos;t complete your order
            </h1>
            <p className="text-sm text-on-surface-variant">{message}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Link
              href="/checkout"
              className="flex-1 bg-primary text-on-primary text-sm font-bold py-4 rounded-full text-center transition-all hover:opacity-90 uppercase tracking-wide"
            >
              Try again
            </Link>
            <Link
              href="/cart"
              className="flex-1 bg-transparent border border-primary text-primary text-sm font-bold py-4 rounded-full text-center transition-all hover:bg-surface-container uppercase tracking-wide"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isProcessing = status === "processing";
  const shipping = snapshot?.shipping;
  const addressLine = shipping
    ? `${shipping.address1}, ${shipping.city}`
    : null;

  return (
    <main className="flex-grow min-h-[calc(100vh-160px)] flex items-center justify-center py-6 px-8">
      <div className="w-full max-w-xl flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6">
          <span className="material-symbols-outlined text-[80px] text-primary">
            {isProcessing ? "schedule" : "check_circle"}
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-primary uppercase tracking-tight">
            {isProcessing ? "Your payment is being processed" : "Thank you for your order"}
          </h1>
          <p className="text-sm text-on-surface-variant">
            Order Confirmation:{" "}
            <span className="font-bold text-primary">#{orderId}</span>
          </p>
          <p className="text-sm text-outline">
            {isProcessing
              ? "We’ll email you once your payment clears."
              : "A confirmation email has been sent to your inbox."}
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant mb-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Shipment Details
            </span>
            <span className="text-xs font-medium px-3 py-1 bg-surface-container rounded-full text-primary">
              Standard Shipping
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">
                Items ({items.length})
              </span>
              <span className="text-sm text-primary font-medium">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">Shipping</span>
              <span className="text-sm font-medium" style={{ color: "#16A34A" }}>
                Free
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant flex justify-between items-end">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Order Total
              </span>
              <p className="text-xs text-outline mt-1">Paid via Stripe</p>
            </div>
            <span className="text-3xl font-bold text-primary leading-none">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Bento grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-start gap-4">
            <div className="bg-surface-container p-2 rounded-xl">
              <span className="material-symbols-outlined text-primary">
                local_shipping
              </span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Est. Delivery
              </p>
              <p className="text-sm text-primary font-semibold mt-1">
                {getEstimatedDelivery()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-start gap-4">
            <div className="bg-surface-container p-2 rounded-xl">
              <span className="material-symbols-outlined text-primary">
                location_on
              </span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Delivery Address
              </p>
              <p className="text-sm text-primary font-semibold mt-1">
                {addressLine ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Link
            href="/store"
            className="flex-1 bg-primary text-on-primary text-sm font-bold py-4 rounded-full text-center transition-all hover:opacity-90 uppercase tracking-wide"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 bg-transparent border border-primary text-primary text-sm font-bold py-4 rounded-full text-center transition-all hover:bg-surface-container uppercase tracking-wide"
          >
            Track Order
          </Link>
        </div>
      </div>
    </main>
  );
}
