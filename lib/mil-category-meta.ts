import type { Category } from "@prisma/client";

/**
 * Category styling for the client-facing (military-themed) app only.
 * Kept separate from CATEGORY_META in constants.ts, which the admin panel
 * still uses with its own (unrelated) color scheme.
 */
export const MIL_CATEGORY_META: Record<
  Category,
  { label: string; badgeClass: string; iconClass: string; barClass: string }
> = {
  SUPPLEMENT: {
    label: "Supplement",
    badgeClass: "bg-mil-steel/10 text-mil-steel border-mil-steel/30",
    iconClass: "bg-mil-steel/10 text-mil-steel border-mil-steel/30",
    barClass: "bg-mil-steel",
  },
  VITAMIN: {
    label: "Vitamin",
    badgeClass: "bg-mil-sage/10 text-mil-sage border-mil-sage/30",
    iconClass: "bg-mil-sage/10 text-mil-sage border-mil-sage/30",
    barClass: "bg-mil-sage",
  },
  PEPTIDE: {
    label: "Peptid",
    badgeClass: "bg-mil-olive/15 text-mil-olive border-mil-olive/35",
    iconClass: "bg-mil-olive/15 text-mil-olive border-mil-olive/35",
    barClass: "bg-mil-olive",
  },
  ANABOLIC: {
    label: "Anabolik",
    badgeClass: "bg-mil-danger/15 text-mil-danger border-mil-danger/35",
    iconClass: "bg-mil-danger/15 text-mil-danger border-mil-danger/35",
    barClass: "bg-mil-danger",
  },
};
