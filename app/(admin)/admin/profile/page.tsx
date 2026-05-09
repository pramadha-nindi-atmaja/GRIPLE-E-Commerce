import { auth } from "@/auth";

export default async function AdminProfilePage() {
  const session = await auth();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-section-label text-section-label-secondary mb-2">
          PROFILE
        </h2>
        <p className="text-admin-body text-text-muted">
          Informasi akun Anda.
        </p>
      </div>
      <div className="bg-surface rounded-2xl border border-admin-border p-6 shadow-sm space-y-2">
        <p className="text-admin-body font-semibold text-text-primary">
          {session?.user?.name ?? "—"}
        </p>
        <p className="text-admin-body text-text-muted">{session?.user?.email ?? ""}</p>
        {session?.user?.role ? (
          <p className="text-[11px] uppercase tracking-wide text-outline">
            {session.user.role.replace("_", " ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
