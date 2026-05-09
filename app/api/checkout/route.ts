import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
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

  // Fetch products from database.
  // We primarily resolve by `productId` (Prisma ID), but also support fallback
  // by `productSlug` to handle older persisted carts that still carry mock IDs
  // like "prod_008".
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const productSlugs = Array.from(
    new Set(items.map((item) => item.productSlug).filter(Boolean)),
  ) as string[];

  const productsById = await prisma.product.findMany({
    where: { id: { in: productIds }, isPublished: true },
    include: { colors: { include: { images: true, stocks: true } }, sizes: true },
  });

  const productsBySlug = productSlugs.length
    ? await prisma.product.findMany({
        where: { slug: { in: productSlugs }, isPublished: true },
        include: { colors: { include: { images: true, stocks: true } }, sizes: true },
      })
    : ([] as typeof productsById);

  const productById = new Map<string, (typeof productsById)[number]>(
    productsById.map((p) => [p.id, p]),
  );
  const productBySlug = new Map<string, (typeof productsBySlug)[number]>(
    productsBySlug.map((p) => [p.slug, p]),
  );

  let amountCents = 0;
  const itemSummary: string[] = [];
  for (const item of items) {
    const product =
      productById.get(item.productId) ??
      (item.productSlug ? productBySlug.get(item.productSlug) : undefined);
    if (!product) {
      return NextResponse.json(
        { error: `Product not available: ${item.productId}` },
        { status: 400 },
      );
    }
    amountCents += Math.round(Number(product.price) * 100) * item.qty;
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
