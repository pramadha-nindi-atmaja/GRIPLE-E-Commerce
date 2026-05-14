"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { useEffect } from "react";

import { getStripe } from "@/lib/stripe-client";

export type ConfirmPaymentParams = {
  returnUrl: string;
  receiptEmail?: string;
};

export type ConfirmPaymentResult =
  | { status: "succeeded"; paymentIntentId: string }
  | { status: "processing"; paymentIntentId: string }
  | { status: "redirected" }
  | { status: "error"; message: string };

export type ConfirmPaymentFn = (
  params: ConfirmPaymentParams,
) => Promise<ConfirmPaymentResult>;

const appearance: Appearance = {
  theme: "flat",
  labels: "floating",
  variables: {
    colorPrimary: "#1A1A1A",
    colorBackground: "#ffffff",
  },
};  

type InnerProps = {
  onReady: (confirm: ConfirmPaymentFn | null) => void;
};

function InnerPaymentForm({ onReady }: InnerProps) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe || !elements) {
      onReady(null);
      return;
    }

    const confirm: ConfirmPaymentFn = async ({ returnUrl, receiptEmail }) => {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        return {
          status: "error",
          message: submitError.message ?? "Please check your payment details.",
        };
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          receipt_email: receiptEmail,
        },
        redirect: "if_required",
      });

      if (error) {
        return {
          status: "error",
          message: error.message ?? "Payment failed.",
        };
      }

      if (!paymentIntent) {
        return { status: "redirected" };
      }

      if (paymentIntent.status === "succeeded") {
        return { status: "succeeded", paymentIntentId: paymentIntent.id };
      }
      if (paymentIntent.status === "processing") {
        return { status: "processing", paymentIntentId: paymentIntent.id };
      }
      return {
        status: "error",
        message: `Unexpected payment status: ${paymentIntent.status}`,
      };
    };

    onReady(confirm);
    return () => onReady(null);
  }, [stripe, elements, onReady]);

  return (
    <div className="flex flex-col gap-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <p className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        Payments secured by Stripe
      </p>
    </div>
  );
}

type Props = {
  clientSecret: string;
  onReady: (confirm: ConfirmPaymentFn | null) => void;
};

export function StripePaymentSection({ clientSecret, onReady }: Props) {
  return (
    <Elements
      stripe={getStripe()}
      options={{ clientSecret, appearance }}
    >
      <InnerPaymentForm onReady={onReady} />
    </Elements>
  );
}
