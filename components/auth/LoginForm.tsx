"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AdminIcon } from "@/components/admin/AdminIcon";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError("Email atau kata sandi salah.");
      return;
    }
    router.push(callbackUrl.startsWith("/") ? callbackUrl : "/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="w-full max-w-[420px] bg-surface rounded-2xl border border-admin-border shadow-sm p-10 flex flex-col">
      <header className="text-center space-y-2 mb-8">
        <h1 className="text-[32px] font-black text-primary tracking-tighter leading-none">GRIPLE</h1>
        <p className="font-section-label text-text-muted tracking-widest text-[12px] small-caps">
          Admin dashboard
        </p>
      </header>

      <div className="h-px w-full bg-admin-border mb-8" />

      <section>
        <h2 className="text-[20px] font-bold text-text-primary mb-6">Sign in to your account</h2>
        <form className="space-y-5" onSubmit={onSubmit}>
          {error ? (
            <p className="text-admin-body text-error bg-error-container/40 px-3 py-2 rounded-xl">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium tracking-[0.02em] text-text-muted px-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-admin-border bg-surface text-text-primary text-admin-body focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-secondary-container"
              placeholder="admin@griple.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium tracking-[0.02em] text-text-muted px-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 rounded-xl border border-admin-border bg-surface text-text-primary text-admin-body focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-secondary-container"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-secondary-container hover:text-primary transition-colors"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Sembunyikan sandi" : "Tampilkan sandi"}
              >
                <AdminIcon name="visibility" className="text-[20px]" />
              </button>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={pending}
              className="w-full h-12 bg-primary text-on-primary font-semibold text-[14px] rounded-full uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60"
            >
              {pending ? "Memproses…" : "SIGN IN"}
            </button>
          </div>
        </form>
      </section>

      <footer className="mt-8 text-center">
        <p className="text-admin-body text-[12px] text-text-muted leading-relaxed">
          For access requests, contact your administrator.
        </p>
        <Link href="/" className="text-[13px] text-primary font-medium mt-4 inline-block hover:underline">
          Kembali ke toko
        </Link>
      </footer>
    </main>
  );
}
