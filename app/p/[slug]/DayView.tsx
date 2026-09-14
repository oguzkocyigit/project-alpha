"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { TIME_OF_DAY_OPTIONS, type DayCode } from "@/lib/constants";
import { getTodayDateKey, getTodayDayCode } from "@/lib/date";
import { useTakenItems } from "@/lib/use-taken";
import DayPills from "./DayPills";
import ProtocolCard, { type ProtocolCardItem } from "./ProtocolCard";

const TODAY_CODE = getTodayDayCode();
const PRESET_TIMES: readonly string[] = TIME_OF_DAY_OPTIONS;

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

  // Group by time of day, in the chronological order of TIME_OF_DAY_OPTIONS.
  // Any item using a custom (non-preset) time value falls into its own group,
  // appended after the presets in order of first appearance.
  const presetGroups = TIME_OF_DAY_OPTIONS.map((time) => ({
    time: time as string,
    items: itemsForDay.filter((item) => item.timeOfDay === time),
  })).filter((group) => group.items.length > 0);

  const customTimes: string[] = [];
  for (const item of itemsForDay) {
    if (!PRESET_TIMES.includes(item.timeOfDay) && !customTimes.includes(item.timeOfDay)) {
      customTimes.push(item.timeOfDay);
    }
  }
  const customGroups = customTimes.map((time) => ({
    time,
    items: itemsForDay.filter((item) => item.timeOfDay === time),
  }));

  const timeGroups = [...presetGroups, ...customGroups];

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
        {timeGroups.length === 0 ? (
          <div className="rounded-sm border border-dashed border-mil-border py-14 text-center">
            <p className="font-heading text-lg uppercase tracking-wide text-mil-muted">
              İstirahat Günü
            </p>
            <p className="mt-1 text-sm text-mil-muted">Bugün için planlanmış bir şey yok.</p>
          </div>
        ) : (
          timeGroups.map(({ time, items: timeItems }) => (
            <section key={time}>
              <div className="mb-2 flex items-center gap-2 border-b border-mil-border pb-1.5">
                <Clock size={14} strokeWidth={2.25} className="text-mil-brass" />
                <h2 className="font-heading text-sm font-semibold uppercase tracking-wide">
                  {time}
                </h2>
              </div>
              <div className="space-y-2.5">
                {timeItems.map((item) => (
                  <ProtocolCard
                    key={item.id}
                    item={item}
                    taken={isToday ? taken.has(item.id) : undefined}
                    onToggleTaken={isToday ? () => toggle(item.id) : undefined}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
