import { DAYS_OF_WEEK } from "@/lib/constants";
import { getTodayDayCode } from "@/lib/date";
import ProtocolCard, { type ProtocolCardItem } from "./ProtocolCard";

export default function WeekView({
  items,
}: {
  items: (ProtocolCardItem & { daysOfWeek: string[] })[];
}) {
  const todayCode = getTodayDayCode();

  return (
    <div className="space-y-5">
      {DAYS_OF_WEEK.map((day) => {
        const dayItems = items.filter((item) => item.daysOfWeek.includes(day.code));
        const isToday = day.code === todayCode;

        return (
          <section key={day.code}>
            <div className="mb-2 flex items-center gap-2 border-b border-mil-border pb-1.5">
              <h2
                className={
                  "font-heading text-sm font-semibold uppercase tracking-wide " +
                  (isToday ? "text-mil-brass" : "text-mil-ink/80")
                }
              >
                {day.full}
              </h2>
              {isToday && (
                <span className="rounded-sm bg-mil-brass/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mil-brass">
                  Bugün
                </span>
              )}
              <span className="ml-auto font-mono text-xs text-mil-muted">
                {dayItems.length > 0 ? `${dayItems.length} ürün` : ""}
              </span>
            </div>

            {dayItems.length === 0 ? (
              <p className="rounded-sm border border-dashed border-mil-border px-4 py-3 text-sm text-mil-muted">
                İstirahat günü
              </p>
            ) : (
              <div className="space-y-2">
                {dayItems.map((item) => (
                  <ProtocolCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
