import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { getMockCartItems } from "@/lib/mock/cart";

export default function Page() {
  const items = getMockCartItems();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

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
            <OrderSummary subtotal={subtotal} items={items} showItems />
          </div>
        </div>
      </div>
    </main>
  );
}

