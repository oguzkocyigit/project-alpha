"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteLibraryProduct } from "./actions";

export type LibraryProductRow = {
  id: string;
  name: string;
  content: string;
  defaultDosage: string | null;
  defaultTimeOfDay: string | null;
};

export default function LibraryList({ products }: { products: LibraryProductRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <ul className="space-y-2">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex items-start justify-between gap-4 rounded-lg border border-surface-border bg-surface px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{product.name}</span>
              {product.defaultDosage && (
                <span className="text-sm text-muted">{product.defaultDosage}</span>
              )}
              {product.defaultTimeOfDay && (
                <span className="text-xs text-muted">· {product.defaultTimeOfDay}</span>
              )}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{product.content}</p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={`/admin/protocol/new?library=${product.id}`}
              className="flex items-center gap-1 rounded-md border border-surface-border px-2.5 py-1.5 text-xs text-muted hover:border-accent hover:text-foreground"
            >
              <Plus size={13} /> Danışana Ekle
            </Link>
            <Link
              href={`/admin/library/${product.id}/edit`}
              className="text-muted hover:text-foreground"
              aria-label="Düzenle"
            >
              <Pencil size={16} />
            </Link>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (confirm(`"${product.name}" arşivden silinsin mi?`)) {
                  startTransition(() => {
                    deleteLibraryProduct(product.id);
                  });
                }
              }}
              className="text-muted hover:text-accent"
              aria-label="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
