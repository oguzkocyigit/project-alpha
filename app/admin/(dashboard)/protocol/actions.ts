"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProtocolItemSchema } from "@/lib/validation";

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
