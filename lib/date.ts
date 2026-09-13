import type { DayCode } from "@/lib/constants";

const WEEKDAY_TO_CODE: Record<string, DayCode> = {
  Mon: "MON",
  Tue: "TUE",
  Wed: "WED",
  Thu: "THU",
  Fri: "FRI",
  Sat: "SAT",
  Sun: "SUN",
};

/**
 * Today's day code, computed in a fixed timezone so server-rendered and
 * client-hydrated output always agree regardless of the machine's local TZ.
 */
export function getTodayDayCode(): DayCode {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Istanbul",
    weekday: "short",
  }).format(new Date());
  return WEEKDAY_TO_CODE[weekday] ?? "MON";
}

/** Today's date as YYYY-MM-DD in a fixed timezone — used as a localStorage key. */
export function getTodayDateKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}
