"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { WorkoutFormState } from "./actions";

type ExerciseType = "STRENGTH" | "CARDIO";

type ExerciseRow = {
  key: string;
  type: ExerciseType;
  name: string;
  sets: string;
  reps: string;
  durationMinutes: string;
  intensity: string;
  restNote: string;
  notes: string;
};

let rowCounter = 0;
function newKey() {
  rowCounter += 1;
  return `row-${rowCounter}-${Date.now()}`;
}

function emptyRow(type: ExerciseType): ExerciseRow {
  return {
    key: newKey(),
    type,
    name: "",
    sets: "3",
    reps: "",
    durationMinutes: "20",
    intensity: "",
    restNote: "",
    notes: "",
  };
}

const initialState: WorkoutFormState = {};

export type InitialExercise = {
  type: ExerciseType;
  name: string;
  sets: number | null;
  reps: string | null;
  durationMinutes: number | null;
  intensity: string | null;
  restNote: string | null;
  notes: string | null;
};

export default function WorkoutDayForm({
  dayLabel,
  action,
  deleteAction,
  initialTitle = "",
  initialNotes = "",
  initialExercises = [],
  isNew,
}: {
  dayLabel: string;
  action: (prevState: WorkoutFormState, formData: FormData) => Promise<WorkoutFormState>;
  deleteAction?: () => Promise<void>;
  initialTitle?: string;
  initialNotes?: string;
  initialExercises?: InitialExercise[];
  isNew: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [rows, setRows] = useState<ExerciseRow[]>(() =>
    initialExercises.map((ex) => ({
      key: newKey(),
      type: ex.type,
      name: ex.name,
      sets: ex.sets != null ? String(ex.sets) : "3",
      reps: ex.reps ?? "",
      durationMinutes: ex.durationMinutes != null ? String(ex.durationMinutes) : "20",
      intensity: ex.intensity ?? "",
      restNote: ex.restNote ?? "",
      notes: ex.notes ?? "",
    })),
  );
  const [isDeleting, startDeleteTransition] = useTransition();
  const router = useRouter();

  function updateRow(key: string, patch: Partial<ExerciseRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function submitWithExercises(formData: FormData) {
    const payload = rows
      .filter((row) => row.name.trim().length > 0)
      .map((row) =>
        row.type === "STRENGTH"
          ? {
              type: "STRENGTH",
              name: row.name,
              sets: Number(row.sets) || 0,
              reps: row.reps,
              restNote: row.restNote,
              notes: row.notes,
            }
          : {
              type: "CARDIO",
              name: row.name,
              durationMinutes: Number(row.durationMinutes) || 0,
              intensity: row.intensity,
              restNote: row.restNote,
              notes: row.notes,
            },
      );
    formData.set("exercisesJson", JSON.stringify(payload));
    return formAction(formData);
  }

  return (
    <form action={submitWithExercises} className="space-y-6">
      <div>
        <label className="block text-sm text-muted mb-1.5">Başlık</label>
        <input
          name="title"
          defaultValue={initialTitle}
          required
          placeholder={`${dayLabel} için başlık — örn. "Göğüs & Triceps"`}
          className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Not (opsiyonel)</label>
        <textarea
          name="notes"
          defaultValue={initialNotes}
          rows={2}
          placeholder="Isınma, genel talimat vb."
          className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-muted">Egzersizler</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, emptyRow("STRENGTH")])}
              className="flex items-center gap-1 rounded-md border border-surface-border px-2.5 py-1 text-xs text-muted hover:text-foreground"
            >
              <Plus size={14} /> Kuvvet
            </button>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, emptyRow("CARDIO")])}
              className="flex items-center gap-1 rounded-md border border-surface-border px-2.5 py-1 text-xs text-muted hover:text-foreground"
            >
              <Plus size={14} /> Kardiyo
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-surface-border px-3.5 py-4 text-sm text-muted">
            Henüz egzersiz eklenmedi.
          </p>
        ) : (
          <div className="space-y-2">
            {rows.map((row, index) => (
              <div
                key={row.key}
                className="rounded-lg border border-surface-border bg-surface p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-2.5 w-4 shrink-0 text-xs text-muted">{index + 1}.</span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        value={row.name}
                        onChange={(e) => updateRow(row.key, { name: e.target.value })}
                        placeholder={
                          row.type === "STRENGTH"
                            ? "Egzersiz adı — örn. Bench Press"
                            : "Egzersiz adı — örn. Koşu bandı"
                        }
                        className="flex-1 rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                      <div className="flex shrink-0 overflow-hidden rounded-md border border-surface-border text-xs">
                        <button
                          type="button"
                          onClick={() => updateRow(row.key, { type: "STRENGTH" })}
                          className={
                            "px-2.5 py-2 " +
                            (row.type === "STRENGTH"
                              ? "bg-accent text-white"
                              : "text-muted hover:text-foreground")
                          }
                        >
                          Kuvvet
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRow(row.key, { type: "CARDIO" })}
                          className={
                            "px-2.5 py-2 " +
                            (row.type === "CARDIO"
                              ? "bg-accent text-white"
                              : "text-muted hover:text-foreground")
                          }
                        >
                          Kardiyo
                        </button>
                      </div>
                    </div>

                    {row.type === "STRENGTH" ? (
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={row.sets}
                          onChange={(e) => updateRow(row.key, { sets: e.target.value })}
                          placeholder="Set"
                          className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                        <input
                          value={row.reps}
                          onChange={(e) => updateRow(row.key, { reps: e.target.value })}
                          placeholder="Tekrar (8-12)"
                          className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                        <input
                          value={row.restNote}
                          onChange={(e) => updateRow(row.key, { restNote: e.target.value })}
                          placeholder="Dinlenme (60sn)"
                          className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          min={1}
                          max={600}
                          value={row.durationMinutes}
                          onChange={(e) =>
                            updateRow(row.key, { durationMinutes: e.target.value })
                          }
                          placeholder="Süre (dk)"
                          className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                        <input
                          value={row.intensity}
                          onChange={(e) => updateRow(row.key, { intensity: e.target.value })}
                          placeholder="Yoğunluk (Zone 2)"
                          className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                        <input
                          value={row.restNote}
                          onChange={(e) => updateRow(row.key, { restNote: e.target.value })}
                          placeholder="Dinlenme (opsiyonel)"
                          className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                      </div>
                    )}

                    <input
                      value={row.notes}
                      onChange={(e) => updateRow(row.key, { notes: e.target.value })}
                      placeholder="Not (opsiyonel)"
                      className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                    className="mt-2 shrink-0 text-muted hover:text-accent"
                    aria-label="Egzersizi kaldır"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-accent" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/workout")}
          className="rounded-lg border border-surface-border px-5 py-2.5 text-muted hover:text-foreground"
        >
          Vazgeç
        </button>
        {!isNew && deleteAction && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              if (confirm(`${dayLabel} günü için antrenman planı silinsin mi?`)) {
                startDeleteTransition(async () => {
                  await deleteAction();
                  router.push("/admin/workout");
                });
              }
            }}
            className="ml-auto text-sm text-muted hover:text-accent"
          >
            Günü Sil
          </button>
        )}
      </div>
    </form>
  );
}
