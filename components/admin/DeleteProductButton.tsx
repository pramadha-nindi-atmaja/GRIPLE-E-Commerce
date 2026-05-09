"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteProductAction } from "@/lib/actions/admin/products";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (
      !confirm(
        `Hapus produk "${productName}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    ) {
      return;
    }
    setPending(true);
    const res = await deleteProductAction(productId);
    setPending(false);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={onDelete}
      className="text-[13px] font-semibold text-error hover:underline disabled:opacity-50"
    >
      {pending ? "…" : "Hapus"}
    </button>
  );
}
