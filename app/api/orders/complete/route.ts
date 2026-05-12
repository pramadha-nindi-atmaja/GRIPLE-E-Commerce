import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { orderCompleteSchema } from "@/lib/schemas/order-complete";
import { stripe } from "@/lib/stripe";

import type { OrderStatus } from "@/lib/types/order-status";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = orderCompleteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const body = parsed.data;

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(body.paymentIntentId);
  } catch {
    return NextResponse.json({ error: "Payment lookup failed" }, { status: 400 });
  }

  if (
    intent.metadata?.orderId &&
    intent.metadata.orderId !== body.displayOrderId
  ) {
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
  }

  const expectedCents = Math.round(
    body.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0) * 100,
  );
  if (intent.amount !== expectedCents) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({
    where: { paymentIntentId: intent.id },
  });
  if (existing) {
    return NextResponse.json({ ok: true, orderId: existing.id, duplicate: true });
  }

  const subtotal = body.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const total = intent.amount / 100;
  const shippingCost = Math.max(0, total - subtotal);

  let status: OrderStatus = "PENDING";
  if (intent.status === "succeeded") status = "PROCESSING";
  else if (intent.status === "processing") status = "PENDING";

  const order = await prisma.order.create({
    data: {
      displayId: body.displayOrderId,
      status,
      customerId: body.customerId ?? null,
      email: body.shipping.email,
      fullName: body.shipping.fullName,
      shippingAddress: {
        address1: body.shipping.address1,
        address2: body.shipping.address2 ?? undefined,
        city: body.shipping.city,
        state: body.shipping.state,
        zip: body.shipping.zip,
        country: body.shipping.country,
      },
      subtotal,
      shippingCost,
      total,
      paymentIntentId: intent.id,
      paidAt: intent.status === "succeeded" ? new Date() : null,
      items: {
        create: body.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          colorName: i.colorName,
          colorHex: i.colorHex,
          size: i.size,
          qty: i.qty,
          unitPrice: i.unitPrice,
        })),
      },
    },
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}
