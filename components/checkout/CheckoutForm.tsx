import Link from "next/link";

import { StripeCardPlaceholder } from "@/components/checkout/StripeCardPlaceholder";

export function CheckoutForm() {
  return (
    <form action={undefined} className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <h2 className="font-headline-md text-headline-md">Contact Information</h2>
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            aria-invalid="true"
            placeholder="Enter your email"
            className="w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
          />
          <p className="font-label-caps text-label-caps text-error mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            Email is required
          </p>
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
            name="fullName"
            type="text"
            placeholder="Jane Doe"
            className="w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface" htmlFor="address1">
            Address Line 1
          </label>
          <input
            id="address1"
            name="address1"
            type="text"
            placeholder="123 Main St"
            className="w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface" htmlFor="address2">
            Address Line 2 (Optional)
          </label>
          <input
            id="address2"
            name="address2"
            type="text"
            placeholder="Apt, Suite, Bldg"
            className="w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="City"
              className="w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="state">
              State / Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="State"
              className="w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="zip">
              Postal Code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              placeholder="Zip / Postal Code"
              className="w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-0 font-body-md text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="country">
              Country
            </label>
            <div className="relative">
              <select
                id="country"
                name="country"
                className="w-full appearance-none bg-surface-container-lowest border-b border-[#E5E5E5] py-3 pr-10 pl-0 font-body-md text-on-surface transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl"
                defaultValue="US"
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
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-headline-md text-headline-md">Payment</h2>
        <StripeCardPlaceholder />
      </section>

      <div className="pt-6">
        <Link
          href="/order/confirmation"
          className="w-full bg-[#1A1A1A] text-[#FFFFFF] font-label-caps text-label-caps py-6 px-8 hover:bg-primary-container transition-colors duration-300 flex items-center justify-center gap-2 rounded-full uppercase tracking-widest"
        >
          PLACE ORDER
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </form>
  );
}

