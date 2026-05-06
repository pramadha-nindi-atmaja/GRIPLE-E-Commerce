import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
};

export function StripeCardPlaceholder({ className }: Props) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="font-label-caps text-label-caps text-on-surface">
        Card Details
      </label>

      <div className="w-full bg-surface-container-low border border-[#E5E5E5] p-4 flex items-center justify-between rounded-xl">
        <span className="font-body-md text-outline">Card number, MM/YY, CVC</span>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-outline">credit_card</span>
        </div>
      </div>

      <p className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1 mt-2">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        Payments secured by Stripe
      </p>
    </div>
  );
}

