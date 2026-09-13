"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LibraryProductSchema } from "@/lib/validation";

export type LibraryFormState = { error?: string; fieldErrors?: Record<string, string[]> };

function parseFormData(formData: FormData) {
  return LibraryProductSchema.safeParse({
    category: formData.get("category"),
    name: formData.get("name"),
    content: formData.get("content"),
    defaultDosage: formData.get("defaultDosage") ?? "",
    defaultTimeOfDay: formData.get("defaultTimeOfDay") ?? "",
  });
}

export async function createLibraryProduct(
  _prevState: LibraryFormState,
  formData: FormData,
): Promise<LibraryFormState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: "Formu kontrol edin.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.libraryProduct.create({
    data: {
      ...parsed.data,
      defaultDosage: parsed.data.defaultDosage || null,
      defaultTimeOfDay: parsed.data.defaultTimeOfDay || null,
    },
  });

  revalidatePath("/admin/library");
  redirect("/admin/library");
}

export async function updateLibraryProduct(
  id: string,
  _prevState: LibraryFormState,
  formData: FormData,
): Promise<LibraryFormState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: "Formu kontrol edin.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.libraryProduct.update({
    where: { id },
    data: {
      ...parsed.data,
      defaultDosage: parsed.data.defaultDosage || null,
      defaultTimeOfDay: parsed.data.defaultTimeOfDay || null,
    },
  });

  revalidatePath("/admin/library");
  redirect("/admin/library");
}

export async function deleteLibraryProduct(id: string) {
  await prisma.libraryProduct.delete({ where: { id } });
  revalidatePath("/admin/library");
}
