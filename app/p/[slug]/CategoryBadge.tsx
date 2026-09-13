import { MIL_CATEGORY_META } from "@/lib/mil-category-meta";
import { CATEGORY_ICON } from "@/lib/category-icon";
import type { Category } from "@prisma/client";

export default function CategoryBadge({
  category,
  size = "sm",
}: {
  category: Category;
  size?: "sm" | "md";
}) {
  const meta = MIL_CATEGORY_META[category];
  const Icon = CATEGORY_ICON[category];
  const isSmall = size === "sm";

  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-sm border font-medium uppercase tracking-wide " +
        meta.badgeClass +
        (isSmall ? " px-1.5 py-0.5 text-[10px]" : " px-2 py-0.5 text-[11px]")
      }
    >
      <Icon size={isSmall ? 10 : 12} strokeWidth={2.25} />
      {meta.label}
    </span>
  );
}
