"use client";

import { useState } from "react";

type AiCopyStubProps = {
  onApply: (text: string) => void;
};

export function AiCopyStub({ onApply }: AiCopyStubProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  function handleApply() {
    setLoading(true);
    setTimeout(() => {
      const stub = `[AI stub] ${prompt.trim() || "Deskripsi produk performa tinggi dengan bahan premium dan potongan anatomis."}`;
      onApply(stub);
      setLoading(false);
      setOpen(false);
      setPrompt("");
    }, 600);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] font-semibold text-primary border border-admin-border rounded-full px-4 py-2 hover:bg-surface-container-low transition-colors"
      >
        Generate with AI
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
          <div
            className="bg-surface rounded-2xl border border-admin-border shadow-xl max-w-md w-full p-6 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-copy-title"
          >
            <h2 id="ai-copy-title" className="text-[18px] font-bold text-text-primary">
              AI Copywriter
            </h2>
            <p className="text-admin-body text-text-muted">
              Jelaskan singkat produk ini — untuk sekarang ini hanya placeholder (tanpa API AI).
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: hoodie fleece hangat untuk lari pagi..."
              rows={4}
              className="w-full rounded-xl border border-admin-border px-3 py-2 text-admin-body outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-full text-admin-body border border-admin-border hover:bg-surface-container-low"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleApply}
                className="px-4 py-2 rounded-full bg-primary text-on-primary text-admin-body font-semibold disabled:opacity-60"
              >
                {loading ? "Menulis…" : "Terapkan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
