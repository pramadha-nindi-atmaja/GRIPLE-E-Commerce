import { NextResponse } from "next/server";

import { getAllProducts } from "@/lib/mock/products";
import { paymentIntentRequestSchema } from "@/lib/schemas/payment-intent";
import { stripe } from "@/lib/stripe";

function generateOrderId() {
  return `GR-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = paymentIntentRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { items, shipping } = parsed.data;

  const products = getAllProducts();
  const productMap = new Map(products.map((p) => [p.id, p]));

  let amountCents = 0;
  const itemSummary: string[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || !product.isPublished) {
      return NextResponse.json(
        { error: `Product not available: ${item.productId}` },
        { status: 400 },
      );
    }
    amountCents += Math.round(product.price * 100) * item.qty;
    itemSummary.push(`${product.name} x${item.qty}`);
  }

  if (amountCents < 50) {
    return NextResponse.json(
      { error: "Order total below minimum" },
      { status: 400 },
    );
  }

  const orderId = generateOrderId();

  try {
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: shipping.email,
      shipping: {
        name: shipping.fullName,
        address: {
          line1: shipping.address1,
          line2: shipping.address2 || undefined,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.zip,
          country: shipping.country,
        },
      },
      metadata: {
        orderId,
        items: itemSummary.join(", ").slice(0, 500),
      },
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      orderId,
      amount: amountCents,
    });
  } catch (err) {
    console.error("Stripe PaymentIntent error", err);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
