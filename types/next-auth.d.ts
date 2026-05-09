import type { AdminRole } from "@/lib/types/admin-role";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AdminRole;
    };
  }

  interface User {
    role?: AdminRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AdminRole;
  }
}
