import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Admin login
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        if (!emailRaw || !passwordRaw) return null;

        const email = String(emailRaw).trim().toLowerCase();
        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(String(passwordRaw), user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),

    // Customer login / register
    Credentials({
      id: "customer-credentials",
      name: "Customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        if (!emailRaw || !passwordRaw) return null;

        const email = String(emailRaw).trim().toLowerCase();
        const password = String(passwordRaw);
        const nameRaw = credentials?.name ? String(credentials.name).trim() : undefined;

        const existing = await prisma.customer.findUnique({ where: { email } });

        if (existing) {
          const valid = await bcrypt.compare(password, existing.passwordHash);
          if (!valid) return null;
          return { id: existing.id, email: existing.email, name: existing.name, role: "CUSTOMER" as const };
        }

        // Register new customer — only if name is provided (checkout flow)
        if (!nameRaw) return null;

        const hash = await bcrypt.hash(password, 10);
        const customer = await prisma.customer.create({
          data: { email, name: nameRaw, passwordHash: hash },
        });

        return { id: customer.id, email: customer.email, name: customer.name, role: "CUSTOMER" as const };
      },
    }),
  ],
});
