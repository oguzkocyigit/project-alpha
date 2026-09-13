"use client";

import { useState } from "react";
import type { DayCode } from "@/lib/constants";
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

      <div className="mt-4 space-y-2.5">
        {itemsForDay.length === 0 ? (
          <div className="rounded-sm border border-dashed border-mil-border py-14 text-center">
            <p className="font-heading text-lg uppercase tracking-wide text-mil-muted">
              İstirahat Günü
            </p>
            <p className="mt-1 text-sm text-mil-muted">Bugün için planlanmış bir şey yok.</p>
          </div>
        ) : (
          itemsForDay.map((item) => (
            <ProtocolCard
              key={item.id}
              item={item}
              taken={isToday ? taken.has(item.id) : undefined}
              onToggleTaken={isToday ? () => toggle(item.id) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
