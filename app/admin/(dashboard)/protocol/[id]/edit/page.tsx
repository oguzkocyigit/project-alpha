import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateItem } from "../../actions";
import ItemForm from "../../ItemForm";

export const dynamic = "force-dynamic";

export default async function EditProtocolItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, libraryProducts] = await Promise.all([
    prisma.protocolItem.findUnique({ where: { id } }),
    prisma.libraryProduct.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!item) notFound();

  const boundAction = updateItem.bind(null, item.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide mb-6">
        Ürünü Düzenle
      </h1>
      <ItemForm
        action={boundAction}
        submitLabel="Güncelle"
        libraryProducts={libraryProducts}
        initialValues={{
          category: item.category,
          productName: item.productName,
          dosage: item.dosage,
          daysOfWeek: item.daysOfWeek,
          timeOfDay: item.timeOfDay,
          notes: item.notes ?? "",
          active: item.active,
          sortOrder: item.sortOrder,
        }}
      />
    </div>
  );
}
