import { CATEGORY_ORDER } from "@/lib/constants";
import { MIL_CATEGORY_META } from "@/lib/mil-category-meta";
import { CATEGORY_ICON } from "@/lib/category-icon";
import ProtocolCard, { type ProtocolCardItem } from "./ProtocolCard";

export default function CategoryView({
  items,
}: {
  items: (ProtocolCardItem & { daysOfWeek: string[] })[];
}) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  if (grouped.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-mil-border py-14 text-center">
        <p className="font-heading text-lg uppercase tracking-wide text-mil-muted">
          Henüz Ürün Yok
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ category, items: categoryItems }) => {
        const meta = MIL_CATEGORY_META[category];
        const Icon = CATEGORY_ICON[category];
        return (
          <section key={category}>
            <div className="mb-2 flex items-center gap-2 border-b border-mil-border pb-1.5">
              <div className={"flex h-6 w-6 items-center justify-center rounded-sm border " + meta.iconClass}>
                <Icon size={13} strokeWidth={2.25} />
              </div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide">
                {meta.label}
              </h2>
              <span className="ml-auto font-mono text-xs text-mil-muted">
                {categoryItems.length} ürün
              </span>
            </div>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <ProtocolCard key={item.id} item={item} daysOfWeek={item.daysOfWeek} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
