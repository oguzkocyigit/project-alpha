import { prisma } from "@/lib/prisma";
import { createItem } from "../actions";
import ItemForm from "../ItemForm";

export const dynamic = "force-dynamic";

export default async function NewProtocolItemPage({
  searchParams,
}: {
  searchParams: Promise<{ library?: string }>;
}) {
  const { library } = await searchParams;
  const libraryProducts = await prisma.libraryProduct.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide mb-6">
        Yeni Ürün Ekle
      </h1>
      <ItemForm
        action={createItem}
        submitLabel="Ekle"
        libraryProducts={libraryProducts}
        initialLibraryId={library}
      />
    </div>
  );
}
