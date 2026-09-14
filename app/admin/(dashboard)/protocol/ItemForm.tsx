"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DAYS_OF_WEEK, TIME_OF_DAY_OPTIONS } from "@/lib/constants";

const CUSTOM_TIME_VALUE = "__custom__";
import type { ItemFormState } from "./actions";
import type { Category } from "@prisma/client";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "SUPPLEMENT", label: "Supplement" },
  { value: "VITAMIN", label: "Vitamin" },
  { value: "PEPTIDE", label: "Peptid" },
  { value: "ANABOLIC", label: "Anabolik" },
];

export type ItemFormValues = {
  category: Category;
  productName: string;
  dosage: string;
  daysOfWeek: string[];
  timeOfDay: string;
  notes: string;
  active: boolean;
  sortOrder: number;
};

export type LibraryProductOption = {
  id: string;
  category: Category;
  name: string;
  content: string;
  defaultDosage: string | null;
  defaultTimeOfDay: string | null;
};

const emptyValues: ItemFormValues = {
  category: "SUPPLEMENT",
  productName: "",
  dosage: "",
  daysOfWeek: [],
  timeOfDay: "",
  notes: "",
  active: true,
  sortOrder: 0,
};

const initialState: ItemFormState = {};

export default function ItemForm({
  action,
  initialValues = emptyValues,
  submitLabel = "Kaydet",
  libraryProducts = [],
  initialLibraryId,
}: {
  action: (prevState: ItemFormState, formData: FormData) => Promise<ItemFormState>;
  initialValues?: ItemFormValues;
  submitLabel?: string;
  libraryProducts?: LibraryProductOption[];
  initialLibraryId?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();

  const categoryRef = useRef<HTMLSelectElement>(null);
  const productNameRef = useRef<HTMLInputElement>(null);
  const dosageRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  function isPresetTime(value: string) {
    return value === "" || (TIME_OF_DAY_OPTIONS as readonly string[]).includes(value);
  }

  // The library item preselected via ?library=<id> (if any) determines the
  // initial time value too — computed once as lazy initial state rather than
  // in a mount effect, so no effect ever needs to call setState here.
  const preselectedProduct = libraryProducts.find((p) => p.id === initialLibraryId);
  const initialTime = preselectedProduct?.defaultTimeOfDay ?? initialValues.timeOfDay;
  const [timeMode, setTimeMode] = useState<"preset" | "custom">(() =>
    isPresetTime(initialTime) ? "preset" : "custom",
  );
  const [timeValue, setTimeValue] = useState(initialTime);

  function applyTimeOfDay(value: string) {
    setTimeMode(isPresetTime(value) ? "preset" : "custom");
    setTimeValue(value);
  }

  function fillFromLibrary(id: string) {
    const product = libraryProducts.find((p) => p.id === id);
    if (!product) return;
    if (categoryRef.current) categoryRef.current.value = product.category;
    if (productNameRef.current) productNameRef.current.value = product.name;
    if (dosageRef.current) dosageRef.current.value = product.defaultDosage ?? "";
    applyTimeOfDay(product.defaultTimeOfDay ?? "");
    if (notesRef.current) notesRef.current.value = product.content;
  }

  useEffect(() => {
    // Only the ref-backed (uncontrolled) fields need this — timeOfDay's
    // initial value is already handled above via useState.
    if (preselectedProduct) {
      if (categoryRef.current) categoryRef.current.value = preselectedProduct.category;
      if (productNameRef.current) productNameRef.current.value = preselectedProduct.name;
      if (dosageRef.current) dosageRef.current.value = preselectedProduct.defaultDosage ?? "";
      if (notesRef.current) notesRef.current.value = preselectedProduct.content;
    }
    // Only meant to run once, applying the preselected library item on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form action={formAction} className="space-y-5">
      {libraryProducts.length > 0 && (
        <div>
          <label className="block text-sm text-muted mb-1.5">
            Arşivden doldur (opsiyonel)
          </label>
          <select
            defaultValue={initialLibraryId ?? ""}
            onChange={(e) => e.target.value && fillFromLibrary(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
          >
            <option value="">— Seçiniz —</option>
            {libraryProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm text-muted mb-1.5">Kategori</label>
        <select
          ref={categoryRef}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Ürün adı</label>
          <input
            ref={productNameRef}
            name="productName"
            defaultValue={initialValues.productName}
            required
            placeholder="Testosterone Enanthate"
            className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Doz</label>
          <input
            ref={dosageRef}
            name="dosage"
            defaultValue={initialValues.dosage}
            required
            placeholder="250mg"
            className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Haftanın günleri</label>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <label
              key={day.code}
              className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm has-checked:border-accent has-checked:bg-accent/10 has-checked:text-foreground"
            >
              <input
                type="checkbox"
                name="daysOfWeek"
                value={day.code}
                defaultChecked={initialValues.daysOfWeek.includes(day.code)}
                className="accent-accent"
              />
              {day.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Zaman</label>
          {timeMode === "preset" ? (
            <select
              name="timeOfDay"
              value={timeValue}
              required
              onChange={(e) => {
                if (e.target.value === CUSTOM_TIME_VALUE) {
                  setTimeMode("custom");
                  setTimeValue("");
                } else {
                  setTimeValue(e.target.value);
                }
              }}
              className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
            >
              <option value="" disabled>
                Seçiniz
              </option>
              {TIME_OF_DAY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value={CUSTOM_TIME_VALUE}>Özel…</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                name="timeOfDay"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                required
                placeholder="Sabah / Akşam / 08:00"
                className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => {
                  setTimeMode("preset");
                  setTimeValue("");
                }}
                className="shrink-0 rounded-lg border border-surface-border px-3 text-xs text-muted hover:text-foreground"
              >
                Listeden seç
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Sıra</label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={initialValues.sortOrder}
            className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Not (opsiyonel)</label>
        <textarea
          ref={notesRef}
          name="notes"
          defaultValue={initialValues.notes}
          rows={2}
          placeholder="IM enjeksiyon vb."
          className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initialValues.active}
          className="accent-accent"
        />
        Aktif (müşteri sayfasında görünür)
      </label>

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
          onClick={() => router.push("/admin/protocol")}
          className="rounded-lg border border-surface-border px-5 py-2.5 text-muted hover:text-foreground"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}
