"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkoutDaySchema } from "@/lib/validation";

export type WorkoutFormState = { error?: string; fieldErrors?: Record<string, string[]> };

async function getSingleClient() {
  const client = await prisma.client.findFirst();
  if (!client) {
    throw new Error("Henüz bir müşteri kaydı yok. Önce `npm run seed` çalıştırın.");
  }
  return client;
}

export async function saveWorkoutDay(
  dayCode: string,
  _prevState: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  let exercisesRaw: unknown;
  try {
    exercisesRaw = JSON.parse(String(formData.get("exercisesJson") ?? "[]"));
  } catch {
    return { error: "Egzersiz listesi okunamadı, sayfayı yenileyip tekrar deneyin." };
  }

  const parsed = WorkoutDaySchema.safeParse({
    title: formData.get("title"),
    notes: formData.get("notes") ?? "",
    exercises: exercisesRaw,
  });

  if (!parsed.success) {
    return { error: "Formu kontrol edin.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const client = await getSingleClient();

  const workoutDay = await prisma.workoutDay.upsert({
    where: { clientId_dayOfWeek: { clientId: client.id, dayOfWeek: dayCode } },
    create: {
      clientId: client.id,
      dayOfWeek: dayCode,
      title: parsed.data.title,
      notes: parsed.data.notes || null,
    },
    update: {
      title: parsed.data.title,
      notes: parsed.data.notes || null,
    },
  });

  // Replace the exercise list wholesale — simplest consistent way to persist
  // an arbitrary add/remove/reorder of rows edited client-side.
  await prisma.workoutExercise.deleteMany({ where: { workoutDayId: workoutDay.id } });
  if (parsed.data.exercises.length > 0) {
    await prisma.workoutExercise.createMany({
      data: parsed.data.exercises.map((exercise, index) => ({
        workoutDayId: workoutDay.id,
        type: exercise.type,
        name: exercise.name,
        sets: exercise.type === "STRENGTH" ? exercise.sets : null,
        reps: exercise.type === "STRENGTH" ? exercise.reps : null,
        durationMinutes: exercise.type === "CARDIO" ? exercise.durationMinutes : null,
        intensity: exercise.type === "CARDIO" ? exercise.intensity || null : null,
        restNote: exercise.restNote || null,
        notes: exercise.notes || null,
        sortOrder: index,
      })),
    });
  }

  revalidatePath("/admin/workout");
  revalidatePath(`/p/${client.slug}`);
  redirect("/admin/workout");
}

export async function deleteWorkoutDay(dayCode: string) {
  const client = await getSingleClient();
  await prisma.workoutDay.deleteMany({
    where: { clientId: client.id, dayOfWeek: dayCode },
  });

  revalidatePath("/admin/workout");
  revalidatePath(`/p/${client.slug}`);
}
