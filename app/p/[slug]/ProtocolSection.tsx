"use client";

import { useState } from "react";
import SegmentedTabs from "./SegmentedTabs";
import DayView from "./DayView";
import WeekView from "./WeekView";
import CategoryView from "./CategoryView";
import type { ProtocolCardItem } from "./ProtocolCard";

type ProtocolViewMode = "day" | "week" | "category";

export default function ProtocolSection({
  slug,
  items,
}: {
  slug: string;
  items: (ProtocolCardItem & { daysOfWeek: string[] })[];
}) {
  const [mode, setMode] = useState<ProtocolViewMode>("day");

  return (
    <div>
      <SegmentedTabs
        value={mode}
        onChange={setMode}
        options={[
          { value: "day", label: "Günlük" },
          { value: "week", label: "Haftalık" },
          { value: "category", label: "Envanter" },
        ]}
      />
      {mode === "day" && <DayView slug={slug} items={items} />}
      {mode === "week" && <WeekView items={items} />}
      {mode === "category" && <CategoryView items={items} />}
    </div>
  );
}
