import { auth } from "@/auth";

import type { AdminRole } from "@prisma/client";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireSuperAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

export function isSuperAdmin(role: AdminRole) {
  return role === "SUPER_ADMIN";
}
