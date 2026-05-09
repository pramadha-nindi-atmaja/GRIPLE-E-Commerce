import type { NextAuthConfig } from "next-auth";

import type { AdminRole } from "@/lib/types/admin-role";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user && "role" in user && user.role) {
        token.role = user.role as AdminRole;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        if (token.role) session.user.role = token.role as AdminRole;
      }
      return session;
    },
  },
  providers: [],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
} satisfies NextAuthConfig;
