"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { deleteItem, reorderItems, toggleActive } from "./actions";
import type { Category } from "@prisma/client";

export type ProtocolItemRow = {
  id: string;
  productName: string;
  dosage: string;
  daysOfWeek: string[];
  timeOfDay: string;
  notes: string | null;
  active: boolean;
};

export default function ItemList({
  items,
  category,
}: {
  items: ProtocolItemRow[];
  category: Category;
}) {
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState(items);
  const [prevItems, setPrevItems] = useState(items);
  const dragIndex = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Re-sync local (draggable) order when the server sends fresh data (e.g.
  // after add/delete) — done during render, not an effect, per React's
  // guidance for adjusting state when a prop changes.
  if (items !== prevItems) {
    setPrevItems(items);
    setRows(items);
  }

  function commitOrder(nextRows: ProtocolItemRow[]) {
    startTransition(() => {
      reorderItems(
        category,
        nextRows.map((r) => r.id),
      );
    });
  }

  return (
    <ul className="space-y-2">
      {rows.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => {
            dragIndex.current = index;
            setDraggingId(item.id);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            const from = dragIndex.current;
            if (from === null || from === index) return;
            setRows((prev) => {
              const next = [...prev];
              const [moved] = next.splice(from, 1);
              next.splice(index, 0, moved);
              return next;
            });
            dragIndex.current = index;
          }}
          onDragEnd={() => {
            dragIndex.current = null;
            setDraggingId(null);
            commitOrder(rows);
          }}
          className={
            "flex cursor-grab items-center justify-between gap-4 rounded-lg border bg-surface px-4 py-3 active:cursor-grabbing " +
            (draggingId === item.id ? "border-accent opacity-50" : "border-surface-border")
          }
        >
          <GripVertical size={16} className="shrink-0 text-muted" aria-hidden />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.productName}</span>
              <span className="text-sm text-muted">{item.dosage}</span>
              {!item.active && (
                <span className="rounded border border-surface-border px-1.5 py-0.5 text-xs text-muted">
                  Pasif
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
              {DAYS_OF_WEEK.map((day) => (
                <span
                  key={day.code}
                  className={
                    "rounded px-1.5 py-0.5 " +
                    (item.daysOfWeek.includes(day.code)
                      ? "bg-accent/15 text-accent"
                      : "opacity-40")
                  }
                >
                  {day.label}
                </span>
              ))}
              <span className="ml-2">{item.timeOfDay}</span>
            </div>
            {item.notes && <p className="mt-1 text-xs text-muted">{item.notes}</p>}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-muted">
              <input
                type="checkbox"
                checked={item.active}
                disabled={isPending}
                onChange={(e) =>
                  startTransition(() => {
                    toggleActive(item.id, e.target.checked);
                  })
                }
                className="accent-accent"
              />
              Aktif
            </label>
            <Link
              href={`/admin/protocol/${item.id}/edit`}
              className="text-muted hover:text-foreground"
              aria-label="Düzenle"
            >
              <Pencil size={16} />
            </Link>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (confirm(`"${item.productName}" silinsin mi?`)) {
                  startTransition(() => {
                    deleteItem(item.id);
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
