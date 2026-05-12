"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils/cn";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

function inputClass(invalid: boolean) {
  return cn(
    "w-full bg-surface-container-lowest border-b border-[#E5E5E5] py-3 px-2 font-body-md outline-none text-on-surface placeholder:text-outline transition-colors focus:border-[#1A1A1A] focus:ring-0 rounded-xl",
    invalid && "border-error",
  );
}

export function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account/orders";

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginValues) => {
    setServerError(null);
    const result = await signIn("customer-credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setServerError("Incorrect email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label className="font-label-caps text-label-caps text-on-surface" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass(!!errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="font-label-caps text-label-caps text-error mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-caps text-label-caps text-on-surface" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className={inputClass(!!errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p className="font-label-caps text-label-caps text-error mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="font-label-caps text-label-caps text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1A1A1A] text-[#FFFFFF] font-label-caps text-label-caps py-4 px-8 hover:bg-primary-container transition-colors duration-300 flex items-center justify-center gap-2 rounded-full uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
