import { z } from "zod";

import { checkoutSchema } from "@/lib/schemas/checkout";

export const cartItemRequestSchema = z.object({
  productId: z.string().min(1),
  // Backward/forward compatibility:
  // - Old persisted carts used mock IDs (e.g. "prod_008")
  // - New DB-backed products use Prisma IDs
  // We send `productSlug` so the server can fallback to slug lookup.
  productSlug: z.string().min(1).optional(),
  color: z.string().min(1),
  size: z.string().min(1),
  qty: z.number().int().positive().max(99),
});

export const paymentIntentRequestSchema = z.object({
  items: z.array(cartItemRequestSchema).min(1, "Cart is empty"),
  shipping: checkoutSchema,
});

export type PaymentIntentRequest = z.infer<typeof paymentIntentRequestSchema>;
export type CartItemRequest = z.infer<typeof cartItemRequestSchema>;
