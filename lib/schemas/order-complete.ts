import { z } from "zod";

import { checkoutSchema } from "@/lib/schemas/checkout";

export const orderCompleteSchema = z.object({
  paymentIntentId: z.string().min(1),
  displayOrderId: z.string().min(1),
  customerId: z.string().optional(),
  shipping: checkoutSchema,
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productName: z.string().min(1),
        colorName: z.string().min(1),
        colorHex: z.string().min(1),
        size: z.string().min(1),
        qty: z.number().int().positive(),
        unitPrice: z.number().nonnegative(),
      }),
    )
    .min(1),
});

export type OrderCompleteInput = z.infer<typeof orderCompleteSchema>;
