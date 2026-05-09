"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/actions/admin/guards";

import type { OrderStatus } from "@/lib/types/order-status";

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  await requireAuth();

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/dashboard");
}
