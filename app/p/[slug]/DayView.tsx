"use client";

import { useState } from "react";
import { CATEGORY_ORDER, type DayCode } from "@/lib/constants";
import { MIL_CATEGORY_META } from "@/lib/mil-category-meta";
import { CATEGORY_ICON } from "@/lib/category-icon";
import { getTodayDateKey, getTodayDayCode } from "@/lib/date";
import { useTakenItems } from "@/lib/use-taken";
import DayPills from "./DayPills";
import ProtocolCard, { type ProtocolCardItem } from "./ProtocolCard";

const TODAY_CODE = getTodayDayCode();

export default function DayView({
  slug,
  items,
}: {
  slug: string;
  items: (ProtocolCardItem & { daysOfWeek: string[] })[];
}) {
  const [selectedDay, setSelectedDay] = useState<DayCode>(TODAY_CODE);
  const { taken, toggle } = useTakenItems(slug, getTodayDateKey());
  const isToday = selectedDay === TODAY_CODE;

  const itemsForDay = items.filter((item) => item.daysOfWeek.includes(selectedDay));
  const groupedForDay = CATEGORY_ORDER.map((category) => ({
    category,
    items: itemsForDay.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
  const takenCount = isToday
    ? itemsForDay.filter((item) => taken.has(item.id)).length
    : 0;
  const allDone = isToday && itemsForDay.length > 0 && takenCount === itemsForDay.length;

  return (
    <div>
      <DayPills selected={selectedDay} todayCode={TODAY_CODE} onSelect={setSelectedDay} />

      {isToday && itemsForDay.length > 0 && (
        <div className="relative mt-4 rounded-sm border border-mil-border bg-mil-surface px-4 py-3">
          <span className="absolute -left-px top-0 h-full w-1 bg-mil-brass" />
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-mil-muted">
              Günlük Rapor
            </span>
            <span className="font-mono text-sm font-bold text-mil-ink">
              {takenCount}/{itemsForDay.length}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-sm bg-white/[0.06]">
            <div
              className={
                "h-full transition-all duration-500 " +
                (allDone ? "bg-mil-olive" : "bg-mil-brass")
              }
              style={{
                width: `${itemsForDay.length ? (takenCount / itemsForDay.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 space-y-5">
        {groupedForDay.length === 0 ? (
          <div className="rounded-sm border border-dashed border-mil-border py-14 text-center">
            <p className="font-heading text-lg uppercase tracking-wide text-mil-muted">
              İstirahat Günü
            </p>
            <p className="mt-1 text-sm text-mil-muted">Bugün için planlanmış bir şey yok.</p>
          </div>
        ) : (
          groupedForDay.map(({ category, items: categoryItems }) => {
            const meta = MIL_CATEGORY_META[category];
            const Icon = CATEGORY_ICON[category];
            return (
              <section key={category}>
                <div className="mb-2 flex items-center gap-2 border-b border-mil-border pb-1.5">
                  <div
                    className={"flex h-6 w-6 items-center justify-center rounded-sm border " + meta.iconClass}
                  >
                    <Icon size={13} strokeWidth={2.25} />
                  </div>
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wide">
                    {meta.label}
                  </h2>
                </div>
                <div className="space-y-2.5">
                  {categoryItems.map((item) => (
                    <ProtocolCard
                      key={item.id}
                      item={item}
                      showCategoryBadge={false}
                      taken={isToday ? taken.has(item.id) : undefined}
                      onToggleTaken={isToday ? () => toggle(item.id) : undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
