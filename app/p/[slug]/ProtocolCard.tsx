import { Check } from "lucide-react";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { MIL_CATEGORY_META } from "@/lib/mil-category-meta";
import { CATEGORY_ICON } from "@/lib/category-icon";
import CategoryBadge from "./CategoryBadge";
import type { Category } from "@prisma/client";

export type ProtocolCardItem = {
  id: string;
  category: Category;
  productName: string;
  dosage: string;
  timeOfDay: string;
  notes: string | null;
};

export default function ProtocolCard({
  item,
  daysOfWeek,
  taken,
  onToggleTaken,
}: {
  item: ProtocolCardItem;
  /** When given, renders a compact day-of-week chip row (used outside Day view). */
  daysOfWeek?: string[];
  /** When given (with onToggleTaken), renders a "mark as taken" affordance. */
  taken?: boolean;
  onToggleTaken?: () => void;
}) {
  const meta = MIL_CATEGORY_META[item.category];
  const Icon = CATEGORY_ICON[item.category];

  return (
    <div
      className={
        "group relative flex gap-3 rounded-sm border bg-mil-surface p-3.5 transition-colors " +
        (taken ? "border-mil-border/40 opacity-55" : "border-mil-border")
      }
      style={{ borderLeftWidth: 3, borderLeftColor: `var(--mil-${categoryVar(item.category)})` }}
    >
      <div className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border " + meta.iconClass}>
        <Icon size={19} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={
              "truncate font-medium leading-snug " +
              (taken ? "line-through decoration-mil-muted/60" : "")
            }
          >
            {item.productName}
          </h3>
          {onToggleTaken && (
            <button
              type="button"
              onClick={onToggleTaken}
              aria-pressed={taken}
              aria-label={taken ? "Alındı olarak işaretlendi" : "Alındı olarak işaretle"}
              className={
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border transition " +
                (taken
                  ? "border-mil-olive bg-mil-olive text-mil-bg"
                  : "border-mil-border text-transparent hover:border-mil-muted")
              }
            >
              <Check size={13} strokeWidth={3} />
            </button>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-mil-muted">
          <span className="font-mono font-semibold text-mil-ink/90">{item.dosage}</span>
          <span className="text-mil-border">•</span>
          <span>{item.timeOfDay}</span>
          {!daysOfWeek && (
            <>
              <span className="text-mil-border">•</span>
              <CategoryBadge category={item.category} />
            </>
          )}
        </div>

        {daysOfWeek && (
          <div className="mt-2 flex flex-wrap gap-1">
            {DAYS_OF_WEEK.map((day) => {
              const active = daysOfWeek.includes(day.code);
              return (
                <span
                  key={day.code}
                  className={
                    "rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium " +
                    (active ? "bg-mil-brass/15 text-mil-brass" : "text-mil-muted/40")
                  }
                >
                  {day.label}
                </span>
              );
            })}
          </div>
        )}

        {item.notes && <p className="mt-1.5 text-xs text-mil-muted">{item.notes}</p>}
      </div>
    </div>
  );
}

function categoryVar(category: Category) {
  switch (category) {
    case "SUPPLEMENT":
      return "steel";
    case "VITAMIN":
      return "sage";
    case "PEPTIDE":
      return "olive";
    case "ANABOLIC":
      return "danger";
  }
}
