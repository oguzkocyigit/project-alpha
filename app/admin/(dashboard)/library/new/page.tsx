import { createLibraryProduct } from "../actions";
import LibraryForm from "../LibraryForm";

export default function NewLibraryProductPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide mb-6">
        Arşive Ürün Ekle
      </h1>
      <LibraryForm action={createLibraryProduct} submitLabel="Ekle" />
    </div>
  );
}
