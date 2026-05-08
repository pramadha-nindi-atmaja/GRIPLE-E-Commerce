import { Suspense } from "react";

import { OrderConfirmationView } from "@/components/checkout/OrderConfirmationView";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationView />
    </Suspense>
  );
}
