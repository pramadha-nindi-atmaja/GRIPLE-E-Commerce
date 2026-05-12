import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  address1: z.string().min(5, "Address must be at least 5 characters"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State / province is required"),
  zip: z.string().min(1, "Postal code is required"),
  country: z.enum(["US", "CA", "UK"], { message: "Select a country" }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const checkoutFormSchema = checkoutSchema.extend({
  password: z.string().min(8, "Password min 8 characters"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
