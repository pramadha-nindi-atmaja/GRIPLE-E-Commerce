import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!req.auth?.user) {
      const login = new URL("/auth/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(login);
    }

    const role = req.auth.user.role;
    if (role === "STAFF") {
      if (pathname === "/admin/products/new") {
        return NextResponse.redirect(new URL("/admin/products", req.nextUrl.origin));
      }
      const editProduct = /^\/admin\/products\/([^/]+)$/.exec(pathname);
      if (editProduct && editProduct[1] !== "new") {
        return NextResponse.redirect(new URL("/admin/products", req.nextUrl.origin));
      }
    }
  }

  if (pathname === "/auth/login" && req.auth?.user) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
