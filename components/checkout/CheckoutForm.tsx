"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { StripeCardPlaceholder } from "@/components/checkout/StripeCardPlaceholder";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import {
  type CheckoutFormValues,
  checkoutSchema,
} from "@/lib/schemas/checkout";
import { useCartStore } from "@/lib/stores/cart.store";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "griple-last-order";

function inputClass(invalid: boolean) {
  return cn(
    "w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl",
    invalid && "border-error",
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      fullName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
    },
  });

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  const onSubmit = (data: CheckoutFormValues) => {
    // Unique id per submission (impure by design).
    // eslint-disable-next-line react-hooks/purity -- order id generated only on submit
    const orderId = `GR-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          orderId,
          items,
          total,
          shipping: data,
        }),
      );
    } catch {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ orderId, items, total }),
      );
    }
    clear();
    router.push("/order/confirmation");
  };

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center gap-4 text-on-surface-variant font-body-md">
        <p>Redirecting to cart…</p>
        <Link href="/cart" className="text-primary underline">
          Go to cart
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-12"
      noValidate
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-headline-md text-headline-md">Contact Information</h2>
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={inputClass(!!errors.email)}
            aria-invalid={errors.email ? "true" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p className="font-label-caps text-label-caps text-error mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-headline-md text-headline-md">Shipping Address</h2>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            className={inputClass(!!errors.fullName)}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="font-label-caps text-label-caps text-error mt-1">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface" htmlFor="address1">
            Address Line 1
          </label>
          <input
            id="address1"
            type="text"
            autoComplete="address-line1"
            placeholder="123 Main St"
            className={inputClass(!!errors.address1)}
            {...register("address1")}
          />
          {errors.address1 ? (
            <p className="font-label-caps text-label-caps text-error mt-1">
              {errors.address1.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface" htmlFor="address2">
            Address Line 2 (Optional)
          </label>
          <input
            id="address2"
            type="text"
            autoComplete="address-line2"
            placeholder="Apt, Suite, Bldg"
            className={inputClass(false)}
            {...register("address2")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="city">
              City
            </label>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              placeholder="City"
              className={inputClass(!!errors.city)}
              {...register("city")}
            />
            {errors.city ? (
              <p className="font-label-caps text-label-caps text-error mt-1">
                {errors.city.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="state">
              State / Province
            </label>
            <input
              id="state"
              type="text"
              autoComplete="address-level1"
              placeholder="State"
              className={inputClass(!!errors.state)}
              {...register("state")}
            />
            {errors.state ? (
              <p className="font-label-caps text-label-caps text-error mt-1">
                {errors.state.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="zip">
              Postal Code
            </label>
            <input
              id="zip"
              type="text"
              autoComplete="postal-code"
              placeholder="Zip / Postal Code"
              className={inputClass(!!errors.zip)}
              {...register("zip")}
            />
            {errors.zip ? (
              <p className="font-label-caps text-label-caps text-error mt-1">
                {errors.zip.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="country">
              Country
            </label>
            <div className="relative">
              <select
                id="country"
                className={cn(
                  "w-full appearance-none bg-surface-container-lowest border-b border-[#E5E5E5] py-3 pr-10 pl-0 font-body-md text-on-surface transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl",
                  errors.country && "border-error",
                )}
                {...register("country")}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-on-surface">
                <span className="material-symbols-outlined text-[20px]">
                  expand_more
                </span>
              </span>
            </div>
            {errors.country ? (
              <p className="font-label-caps text-label-caps text-error mt-1">
                {errors.country.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-headline-md text-headline-md">Payment</h2>
        <StripeCardPlaceholder />
      </section>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1A1A1A] text-[#FFFFFF] font-label-caps text-label-caps py-6 px-8 hover:bg-primary-container transition-colors duration-300 flex items-center justify-center gap-2 rounded-full uppercase tracking-widest disabled:opacity-60"
        >
          PLACE ORDER
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
