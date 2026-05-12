import { Suspense } from "react";

import { OrderConfirmationView } from "@/components/checkout/OrderConfirmationView";

function ConfirmationSkeleton() {
  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-2xl flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-surface-container-high animate-pulse" />
        <div className="h-4 w-32 rounded-full bg-surface-container-high animate-pulse" />
        <div className="h-9 w-64 rounded-xl bg-surface-container-high animate-pulse" />
        <div className="h-5 w-80 rounded-full bg-surface-container-high animate-pulse" />
        <div className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="h-4 w-12 rounded-full bg-surface-container-high animate-pulse" />
            <div className="h-4 w-6 rounded-full bg-surface-container-high animate-pulse" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-10 rounded-full bg-surface-container-high animate-pulse" />
            <div className="h-4 w-16 rounded-full bg-surface-container-high animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <OrderConfirmationView />
    </Suspense>
  );
}
