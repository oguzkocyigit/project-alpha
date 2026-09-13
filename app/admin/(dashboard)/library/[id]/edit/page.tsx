import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLibraryProduct } from "../../actions";
import LibraryForm from "../../LibraryForm";

export const dynamic = "force-dynamic";

export default async function EditLibraryProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.libraryProduct.findUnique({ where: { id } });
  if (!product) notFound();

  const boundAction = updateLibraryProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide mb-6">
        Arşiv Ürününü Düzenle
      </h1>
      <LibraryForm
        action={boundAction}
        submitLabel="Güncelle"
        initialValues={{
          category: product.category,
          name: product.name,
          content: product.content,
          defaultDosage: product.defaultDosage ?? "",
          defaultTimeOfDay: product.defaultTimeOfDay ?? "",
        }}
      />
    </div>
  );
}
