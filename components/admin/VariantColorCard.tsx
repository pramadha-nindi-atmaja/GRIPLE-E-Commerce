"use client";

import { useRef, useState } from "react";

import { AdminIcon } from "@/components/admin/AdminIcon";

function ensureHex(hex: string): string {
  const s = hex.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  return "#1A1A1A";
}

type VariantColorCardProps = {
  name: string;
  hex: string;
  images: string[];
  canRemoveVariant: boolean;
  onUpdate: (patch: { name?: string; hex?: string; images?: string[] }) => void;
  onRemoveVariant: () => void;
};

export function VariantColorCard({
  name,
  hex,
  images,
  canRemoveVariant,
  onUpdate,
  onRemoveVariant,
}: VariantColorCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const safeHex = ensureHex(hex);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Upload gagal");
      }
      if (!data.url) {
        throw new Error("Upload gagal");
      }
      onUpdate({ images: [...images, data.url] });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onUpdate({ images: images.filter((_, i) => i !== index) });
  }

  return (
    <div className="p-4 rounded-xl border border-admin-border bg-surface-container-lowest flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="relative w-8 h-8 rounded-full border border-admin-border flex-shrink-0 cursor-pointer overflow-hidden block">
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ backgroundColor: safeHex }}
            aria-hidden
          />
          <input
            type="color"
            value={safeHex}
            onChange={(e) => onUpdate({ hex: e.target.value })}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Pilih warna"
          />
        </label>
        <div className="flex-grow min-w-0">
          <input
            type="text"
            value={name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-admin-border bg-background text-admin-body outline-none focus:ring-1 focus:ring-primary"
            placeholder="Nama warna"
          />
        </div>
        {canRemoveVariant ? (
          <button
            type="button"
            onClick={onRemoveVariant}
            className="text-error opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
            aria-label="Hapus varian"
          >
            <AdminIcon name="delete" />
          </button>
        ) : (
          <span className="w-10 flex-shrink-0" aria-hidden />
        )}
      </div>

      {uploadError ? (
        <p className="text-[13px] text-error">{uploadError}</p>
      ) : null}

      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-admin-border flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer bg-background disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AdminIcon name="add_a_photo" className="text-secondary text-[24px]" />
          <span className="text-admin-label-sm font-medium text-secondary">
            {uploading ? "…" : "Upload"}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />

        {images.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="aspect-square rounded-xl overflow-hidden border border-admin-border relative group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="text-on-primary"
                aria-label="Hapus gambar"
              >
                <AdminIcon name="close" className="text-[24px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
