import Link from "next/link";
import { Dumbbell, Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DAYS_OF_WEEK } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function WorkoutPage() {
  const client = await prisma.client.findFirst({
    include: {
      workoutDays: { include: { exercises: true } },
    },
  });

  if (!client) {
    return (
      <div className="rounded-lg border border-surface-border bg-surface p-6">
        <p className="text-muted">
          Henüz bir müşteri kaydı yok. Terminalde <code>npm run seed</code> komutunu çalıştırın.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide">
        {client.name} — Antrenman Programı
      </h1>

      <div className="space-y-2">
        {DAYS_OF_WEEK.map((day) => {
          const workoutDay = client.workoutDays.find((w) => w.dayOfWeek === day.code);
          return (
            <div
              key={day.code}
              className="flex items-center justify-between gap-4 rounded-lg border border-surface-border bg-surface px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">
                  {day.label}
                </span>
                {workoutDay ? (
                  <div className="min-w-0">
                    <p className="truncate font-medium">{workoutDay.title}</p>
                    <p className="text-xs text-muted">{workoutDay.exercises.length} egzersiz</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted">Gün eklenmedi (istirahat)</p>
                )}
              </div>

              <Link
                href={`/admin/workout/${day.code}/edit`}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-surface-border px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-foreground"
              >
                {workoutDay ? (
                  <>
                    <Pencil size={14} /> Düzenle
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Ekle
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Dumbbell size={13} /> Gün eklenmeyen günler müşteri sayfasında istirahat günü olarak
        görünür.
      </p>
    </div>
  );
}
