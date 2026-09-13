import { Flame, Timer } from "lucide-react";

export type WorkoutExerciseItem = {
  id: string;
  type: "STRENGTH" | "CARDIO";
  name: string;
  sets: number | null;
  reps: string | null;
  durationMinutes: number | null;
  intensity: string | null;
  restNote: string | null;
  notes: string | null;
};

export default function WorkoutCard({
  exercise,
  index,
}: {
  exercise: WorkoutExerciseItem;
  index: number;
}) {
  const isCardio = exercise.type === "CARDIO";

  return (
    <div className="flex gap-3 rounded-sm border border-mil-border bg-mil-surface p-3.5">
      <div
        className={
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border font-mono text-sm font-bold " +
          (isCardio
            ? "border-mil-danger/35 bg-mil-danger/15 text-mil-danger"
            : "border-mil-olive/35 bg-mil-olive/15 text-mil-olive")
        }
      >
        {isCardio ? <Flame size={18} strokeWidth={2} /> : index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium leading-snug">{exercise.name}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-mil-muted">
          {isCardio ? (
            <span className="font-mono font-semibold text-mil-ink/90">
              {exercise.durationMinutes} dk
            </span>
          ) : (
            <span className="font-mono font-semibold text-mil-ink/90">
              {exercise.sets} x {exercise.reps}
            </span>
          )}
          {isCardio && exercise.intensity && (
            <>
              <span className="text-mil-border">•</span>
              <span>{exercise.intensity}</span>
            </>
          )}
          {exercise.restNote && (
            <>
              <span className="text-mil-border">•</span>
              <span className="inline-flex items-center gap-1">
                <Timer size={11} strokeWidth={2.25} />
                {exercise.restNote}
              </span>
            </>
          )}
        </div>
        {exercise.notes && <p className="mt-1.5 text-xs text-mil-muted">{exercise.notes}</p>}
      </div>
    </div>
  );
}
