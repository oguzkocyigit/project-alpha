"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProtocolItemSchema } from "@/lib/validation";
import { CATEGORY_ORDER } from "@/lib/constants";
import type { Category } from "@prisma/client";

export type ItemFormState = { error?: string; fieldErrors?: Record<string, string[]> };

async function getSingleClient() {
  const client = await prisma.client.findFirst();
  if (!client) {
    throw new Error("Henüz bir müşteri kaydı yok. Önce `npm run seed` çalıştırın.");
  }
  return client;
}

function parseFormData(formData: FormData) {
  return ProtocolItemSchema.safeParse({
    category: formData.get("category"),
    productName: formData.get("productName"),
    dosage: formData.get("dosage"),
    daysOfWeek: formData.getAll("daysOfWeek"),
    timeOfDay: formData.get("timeOfDay"),
    notes: formData.get("notes") ?? "",
    active: formData.get("active") === "on",
    sortOrder: formData.get("sortOrder") || 0,
  });
}

export async function createItem(
  _prevState: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: "Formu kontrol edin.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const client = await getSingleClient();
  await prisma.protocolItem.create({
    data: { ...parsed.data, clientId: client.id },
  });

  revalidatePath("/admin/protocol");
  revalidatePath(`/p/${client.slug}`);
  redirect("/admin/protocol");
}

export async function updateItem(
  id: string,
  _prevState: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: "Formu kontrol edin.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const item = await prisma.protocolItem.update({
    where: { id },
    data: parsed.data,
    include: { client: true },
  });

  revalidatePath("/admin/protocol");
  revalidatePath(`/p/${item.client.slug}`);
  redirect("/admin/protocol");
}

export async function deleteItem(id: string) {
  const item = await prisma.protocolItem.delete({
    where: { id },
    include: { client: true },
  });

  revalidatePath("/admin/protocol");
  revalidatePath(`/p/${item.client.slug}`);
}

export async function toggleActive(id: string, active: boolean) {
  const item = await prisma.protocolItem.update({
    where: { id },
    data: { active },
    include: { client: true },
  });

  revalidatePath("/admin/protocol");
  revalidatePath(`/p/${item.client.slug}`);
}

/**
 * Persists a drag-and-drop reorder within one category. sortOrder is a single
 * global field shared across all categories (it also drives the order items
 * appear in on a given day on the client page), so we keep every other
 * category's relative order untouched and only splice in the new order for
 * the category being dragged, then renumber everything sequentially in
 * CATEGORY_ORDER blocks.
 */
export async function reorderItems(category: Category, orderedIds: string[]) {
  const client = await getSingleClient();
  const allItems = await prisma.protocolItem.findMany({
    where: { clientId: client.id },
    orderBy: { sortOrder: "asc" },
  });

  const byCategory = new Map<Category, typeof allItems>();
  for (const cat of CATEGORY_ORDER) {
    byCategory.set(
      cat,
      allItems.filter((item) => item.category === cat),
    );
  }

  const reorderedCategoryItems = orderedIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter((item): item is (typeof allItems)[number] => Boolean(item));
  byCategory.set(category, reorderedCategoryItems);

  const finalOrder = CATEGORY_ORDER.flatMap((cat) => byCategory.get(cat) ?? []);

  await prisma.$transaction(
    finalOrder.map((item, index) =>
      prisma.protocolItem.update({ where: { id: item.id }, data: { sortOrder: index } }),
    ),
  );

  revalidatePath("/admin/protocol");
  revalidatePath(`/p/${client.slug}`);
}
