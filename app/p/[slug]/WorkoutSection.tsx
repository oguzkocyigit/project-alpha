"use client";

import { useState } from "react";
import SegmentedTabs from "./SegmentedTabs";
import WorkoutDayView, { type WorkoutDayData } from "./WorkoutDayView";
import WorkoutWeekView from "./WorkoutWeekView";

type WorkoutViewMode = "day" | "week";

export default function WorkoutSection({ workoutDays }: { workoutDays: WorkoutDayData[] }) {
  const [mode, setMode] = useState<WorkoutViewMode>("day");

  return (
    <div>
      <SegmentedTabs
        value={mode}
        onChange={setMode}
        options={[
          { value: "day", label: "Günlük" },
          { value: "week", label: "Haftalık" },
        ]}
      />
      {mode === "day" && <WorkoutDayView workoutDays={workoutDays} />}
      {mode === "week" && <WorkoutWeekView workoutDays={workoutDays} />}
    </div>
  );
}
