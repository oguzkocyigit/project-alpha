import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/constants";
import ItemList from "./ItemList";

export const dynamic = "force-dynamic";

export default async function ProtocolPage() {
  const client = await prisma.client.findFirst({
    include: { protocolItems: { orderBy: { sortOrder: "asc" } } },
  });

  if (!client) {
    return (
      <div className="rounded-lg border border-surface-border bg-surface p-6">
        <p className="text-muted">
          Henüz bir müşteri kaydı yok. Terminalde <code>npm run seed</code> komutunu çalıştırın.
        </p>
      </div>
    );
  }

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: client.protocolItems.filter((item) => item.category === category),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide">
          {client.name} — Protokol
        </h1>
        <Link
          href="/admin/protocol/new"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
        >
          <Plus size={16} /> Ürün Ekle
        </Link>
      </div>

      {grouped.map(({ category, items }) => (
        <section key={category}>
          <h2
            className="mb-3 text-sm font-semibold uppercase tracking-wide"
            style={{ color: CATEGORY_META[category].color }}
          >
            {CATEGORY_META[category].label}
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-muted">Bu kategoride ürün yok.</p>
          ) : (
            <ItemList items={items} />
          )}
        </section>
      ))}
    </div>
  );
}
