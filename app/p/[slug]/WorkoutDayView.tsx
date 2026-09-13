"use client";

import { useState } from "react";
import type { DayCode } from "@/lib/constants";
import { getTodayDayCode } from "@/lib/date";
import DayPills from "./DayPills";
import WorkoutCard, { type WorkoutExerciseItem } from "./WorkoutCard";

export type WorkoutDayData = {
  dayOfWeek: string;
  title: string;
  notes: string | null;
  exercises: WorkoutExerciseItem[];
};

const TODAY_CODE = getTodayDayCode();

export default function WorkoutDayView({ workoutDays }: { workoutDays: WorkoutDayData[] }) {
  const [selectedDay, setSelectedDay] = useState<DayCode>(TODAY_CODE);
  const workout = workoutDays.find((w) => w.dayOfWeek === selectedDay);

  return (
    <div>
      <DayPills selected={selectedDay} todayCode={TODAY_CODE} onSelect={setSelectedDay} />

      <div className="mt-4">
        {!workout ? (
          <div className="rounded-sm border border-dashed border-mil-border py-14 text-center">
            <p className="font-heading text-lg uppercase tracking-wide text-mil-muted">
              İstirahat Günü
            </p>
            <p className="mt-1 text-sm text-mil-muted">
              Bu gün için planlanmış bir antrenman yok.
            </p>
          </div>
        ) : (
          <>
            <div className="relative rounded-sm border border-mil-border bg-mil-surface px-4 py-3">
              <span className="absolute -left-px top-0 h-full w-1 bg-mil-olive" />
              <h2 className="font-heading text-lg font-semibold uppercase tracking-wide">
                {workout.title}
              </h2>
              {workout.notes && <p className="mt-1 text-sm text-mil-muted">{workout.notes}</p>}
            </div>

            <div className="mt-3 space-y-2.5">
              {workout.exercises.map((exercise, index) => (
                <WorkoutCard key={exercise.id} exercise={exercise} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
