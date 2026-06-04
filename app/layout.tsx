/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { inter } from "@/app/fonts";
import { AppSessionProvider } from "@/components/providers/AppSessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Griple",
    template: "%s — Griple",
  },
  description: "Premium athletic gear engineered for modern performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background font-body-md">
        <ThemeProvider>
          <AppSessionProvider>{children}</AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
