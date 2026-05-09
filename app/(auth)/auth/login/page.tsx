import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-6 relative">
      <Suspense fallback={<div className="text-text-muted text-admin-body">Memuat…</div>}>
        <LoginForm />
      </Suspense>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-surface-container rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-surface-container-highest rounded-full blur-[120px] opacity-30" />
      </div>
    </div>
  );
}
