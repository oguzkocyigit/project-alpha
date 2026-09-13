import { DAYS_OF_WEEK, type DayCode } from "@/lib/constants";

export default function DayPills({
  selected,
  todayCode,
  onSelect,
}: {
  selected: DayCode;
  todayCode: DayCode;
  onSelect: (day: DayCode) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = day.code === selected;
        const isTodayPill = day.code === todayCode;
        return (
          <button
            key={day.code}
            type="button"
            onClick={() => onSelect(day.code)}
            className={
              "relative shrink-0 rounded-sm border px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors " +
              (isSelected
                ? "border-mil-brass bg-mil-brass text-mil-bg"
                : "border-mil-border bg-mil-surface text-mil-muted hover:text-mil-ink")
            }
          >
            {day.label}
            {isTodayPill && !isSelected && (
              <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-mil-brass" />
            )}
          </button>
        );
      })}
    </div>
  );
}
