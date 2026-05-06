import Link from "next/link";
import Image from "next/image";

import type { CartItem } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

type Props = {
  subtotal: number;
  items?: CartItem[];
  showItems?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

export function OrderSummary({
  subtotal,
  items = [],
  showItems = false,
  ctaHref,
  ctaLabel = "Proceed to Checkout",
  className,
}: Props) {
  const total = subtotal;

  return (
    <div
      className={cn(
        "rounded-2xl border border-outline-variant bg-surface-container-lowest",
        showItems ? "p-8" : "p-10",
        "flex flex-col gap-8",
        className,
      )}
    >
      {showItems ? (
        <h2 className="font-headline-md text-headline-md border-b border-outline-variant pb-6">
          Order Summary
        </h2>
      ) : (
        <h2 className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
          Order Summary
        </h2>
      )}

      {showItems ? (
        <div className="flex flex-col gap-6 border-b border-outline-variant pb-8">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
              <div className="relative w-[80px] h-[100px] bg-surface-container-high shrink-0 overflow-hidden border border-outline-variant">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between h-[100px] py-1 min-w-0">
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="font-body-md text-on-surface-variant text-[14px]">
                    {item.color} / {item.size}
                  </p>
                </div>
                <p className="font-label-caps text-label-caps text-on-surface">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn("flex flex-col gap-4", showItems ? "border-b border-outline-variant pb-8" : "")}>
        <div className="flex justify-between items-center font-body-md text-body-md">
          <span className="text-on-surface-variant">Subtotal</span>
          <span className="text-primary">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center font-body-md text-body-md">
          <span className="text-on-surface-variant">Shipping</span>
          <span className={cn("text-on-surface-variant", showItems ? "italic" : "text-sm")}>
            {showItems ? "Calculated next step" : "Calculated at checkout"}
          </span>
        </div>
      </div>

      {showItems ? (
        <div className="flex justify-between items-end">
          <span className="font-headline-md text-headline-md">Total</span>
          <span className="font-headline-md text-headline-md">${total.toFixed(2)}</span>
        </div>
      ) : (
        <>
          <div className="h-px w-full bg-primary my-2" />
          <div className="flex justify-between items-center font-headline-md text-headline-md text-primary">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </>
      )}

      {ctaHref ? (
        <Link
          href={ctaHref}
          className={cn(
            "w-full h-14 rounded-full flex items-center justify-center font-label-caps text-label-caps uppercase tracking-widest transition-colors",
            "bg-primary text-on-primary hover:bg-inverse-surface",
            showItems ? "mt-0" : "mt-4",
          )}
        >
          {ctaLabel}
          {showItems ? (
            <span className="material-symbols-outlined text-[18px] ml-2">
              arrow_forward
            </span>
          ) : null}
        </Link>
      ) : null}

      {showItems ? (
        <div className="flex justify-center items-center gap-2 pt-4">
          <span className="material-symbols-outlined text-outline text-[16px]">
            lock
          </span>
          <span className="font-label-caps text-label-caps text-outline">
            Secure checkout
          </span>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4 mt-2 opacity-60">
          <span className="material-symbols-outlined text-3xl">credit_card</span>
          <span className="material-symbols-outlined text-3xl">
            account_balance_wallet
          </span>
          <span className="material-symbols-outlined text-3xl">payments</span>
        </div>
      )}
    </div>
  );
}

