import { notFound } from "next/navigation";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { deleteWorkoutDay, saveWorkoutDay } from "../../actions";
import WorkoutDayForm from "../../WorkoutDayForm";

export const dynamic = "force-dynamic";

export default async function EditWorkoutDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const dayCode = day.toUpperCase();
  const dayMeta = DAYS_OF_WEEK.find((d) => d.code === dayCode);
  if (!dayMeta) notFound();

  const client = await prisma.client.findFirst({
    include: {
      workoutDays: {
        where: { dayOfWeek: dayCode },
        include: { exercises: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  const workoutDay = client?.workoutDays[0];
  const boundSave = saveWorkoutDay.bind(null, dayCode);
  const boundDelete = workoutDay ? deleteWorkoutDay.bind(null, dayCode) : undefined;

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide mb-6">
        {dayMeta.full} — Antrenman
      </h1>
      <WorkoutDayForm
        dayLabel={dayMeta.full}
        action={boundSave}
        deleteAction={boundDelete}
        initialTitle={workoutDay?.title ?? ""}
        initialNotes={workoutDay?.notes ?? ""}
        initialExercises={workoutDay?.exercises ?? []}
        isNew={!workoutDay}
      />
    </div>
  );
}
