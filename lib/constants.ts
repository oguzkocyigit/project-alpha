import type { Category } from "@prisma/client";

export const DAYS_OF_WEEK = [
  { code: "MON", label: "Pzt", full: "Pazartesi" },
  { code: "TUE", label: "Sal", full: "Salı" },
  { code: "WED", label: "Çar", full: "Çarşamba" },
  { code: "THU", label: "Per", full: "Perşembe" },
  { code: "FRI", label: "Cum", full: "Cuma" },
  { code: "SAT", label: "Cmt", full: "Cumartesi" },
  { code: "SUN", label: "Paz", full: "Pazar" },
] as const;

export type DayCode = (typeof DAYS_OF_WEEK)[number]["code"];

export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; badgeClass: string; barClass: string; ringClass: string }
> = {
  SUPPLEMENT: {
    label: "Supplement",
    color: "#7c8794",
    badgeClass: "bg-white/[0.06] text-accent-steel border-white/10",
    barClass: "bg-accent-steel",
    ringClass: "ring-accent-steel/40",
  },
  VITAMIN: {
    label: "Vitamin",
    color: "#4ea968",
    badgeClass: "bg-accent-green/10 text-accent-green border-accent-green/25",
    barClass: "bg-accent-green",
    ringClass: "ring-accent-green/40",
  },
  PEPTIDE: {
    label: "Peptid",
    color: "#f2a93c",
    badgeClass: "bg-accent-amber/10 text-accent-amber border-accent-amber/25",
    barClass: "bg-accent-amber",
    ringClass: "ring-accent-amber/40",
  },
  ANABOLIC: {
    label: "Anabolik",
    color: "#e0332f",
    badgeClass: "bg-accent/10 text-accent border-accent/25",
    barClass: "bg-accent",
    ringClass: "ring-accent/40",
  },
};

export const CATEGORY_ORDER: Category[] = [
  "ANABOLIC",
  "PEPTIDE",
  "VITAMIN",
  "SUPPLEMENT",
];

// Order here drives both the admin dropdown and the grouping order on the
// client-facing day view.
export const TIME_OF_DAY_OPTIONS = [
  "Spordan önce",
  "Spordan sonra",
  "Kahvaltıdan sonra",
  "Öğlen Öğün öncesi",
  "Uykudan önce",
] as const;
