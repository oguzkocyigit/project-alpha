import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/constants";
import LibraryList from "./LibraryList";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const products = await prisma.libraryProduct.findMany({
    orderBy: { name: "asc" },
  });

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    products: products.filter((p) => p.category === category),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide">
          Ürün Arşivi
        </h1>
        <Link
          href="/admin/library/new"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
        >
          <Plus size={16} /> Ürün Ekle
        </Link>
      </div>

      <p className="text-sm text-muted">
        Burada tuttuğunuz ürünleri &quot;Danışana Ekle&quot; ile herhangi bir danışanın protokolüne
        hızlıca aktarabilirsiniz.
      </p>

      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-surface-border px-4 py-6 text-center text-sm text-muted">
          Arşiv boş. Sağ üstten ilk ürünü ekleyin.
        </p>
      ) : (
        grouped.map(({ category, products: categoryProducts }) =>
          categoryProducts.length === 0 ? null : (
            <section key={category}>
              <h2
                className="mb-3 text-sm font-semibold uppercase tracking-wide"
                style={{ color: CATEGORY_META[category].color }}
              >
                {CATEGORY_META[category].label}
              </h2>
              <LibraryList products={categoryProducts} />
            </section>
          ),
        )
      )}
    </div>
  );
}
