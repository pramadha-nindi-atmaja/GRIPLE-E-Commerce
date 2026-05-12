import { Suspense } from "react";
import Link from "next/link";
import { CustomerLoginForm } from "@/components/account/CustomerLoginForm";

export const metadata = { title: "Sign In — Griple" };

export default function AccountLoginPage() {
  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-section-gap">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <Link
            href="/"
            className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors flex items-center gap-1 mb-6"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to store
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">
            Sign In
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Sign in to view your orders and track your shipments.
          </p>
        </div>

        <Suspense>
          <CustomerLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
