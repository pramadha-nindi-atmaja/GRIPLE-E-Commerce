import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function Page() {
  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-12">
          <div className="border-b border-outline-variant pb-8">
            <h1 className="font-headline-lg text-headline-lg mb-2">
              Guest Checkout
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Complete your order below.
            </p>
          </div>

          <CheckoutForm />
        </div>

        <div className="lg:col-span-5 xl:col-span-5 relative mt-12 lg:mt-0">
          <div className="sticky top-24">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </main>
  );
}

