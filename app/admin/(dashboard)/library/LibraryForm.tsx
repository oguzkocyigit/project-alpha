"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { LibraryFormState } from "./actions";
import type { Category } from "@prisma/client";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "SUPPLEMENT", label: "Supplement" },
  { value: "VITAMIN", label: "Vitamin" },
  { value: "PEPTIDE", label: "Peptid" },
  { value: "ANABOLIC", label: "Anabolik" },
];

export type LibraryFormValues = {
  category: Category;
  name: string;
  content: string;
  defaultDosage: string;
  defaultTimeOfDay: string;
};

const emptyValues: LibraryFormValues = {
  category: "SUPPLEMENT",
  name: "",
  content: "",
  defaultDosage: "",
  defaultTimeOfDay: "",
};

const initialState: LibraryFormState = {};

export default function LibraryForm({
  action,
  initialValues = emptyValues,
  submitLabel = "Kaydet",
}: {
  action: (prevState: LibraryFormState, formData: FormData) => Promise<LibraryFormState>;
  initialValues?: LibraryFormValues;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm text-muted mb-1.5">Kategori</label>
        <select
          name="category"
          defaultValue={initialValues.category}
          className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Ürün adı</label>
        <input
          name="name"
          defaultValue={initialValues.name}
          required
          placeholder="NOW Foods - Berberine Glucose Support"
          className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Varsayılan doz (opsiyonel)</label>
          <input
            name="defaultDosage"
            defaultValue={initialValues.defaultDosage}
            placeholder="5g"
            className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Varsayılan zaman (opsiyonel)</label>
          <input
            name="defaultTimeOfDay"
            defaultValue={initialValues.defaultTimeOfDay}
            placeholder="Ana öğünlerden önce"
            className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">İçerik / kullanım notu</label>
        <textarea
          name="content"
          defaultValue={initialValues.content}
          required
          rows={5}
          placeholder="Kullanım zamanlaması, gerekçe, risk/uyarı notları..."
          className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      {state.error && (
        <p className="text-sm text-accent" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/library")}
          className="rounded-lg border border-surface-border px-5 py-2.5 text-muted hover:text-foreground"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}
