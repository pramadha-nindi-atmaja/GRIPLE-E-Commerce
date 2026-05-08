import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get("payment_intent");

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "Missing payment_intent parameter" },
      { status: 400 },
    );
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      id: intent.id,
      status: intent.status,
      amount: intent.amount,
      currency: intent.currency,
      orderId: intent.metadata?.orderId ?? null,
      receiptEmail: intent.receipt_email,
    });
  } catch (err) {
    console.error("Stripe verify error", err);
    return NextResponse.json(
      { error: "Failed to retrieve payment intent" },
      { status: 500 },
    );
  }
}
