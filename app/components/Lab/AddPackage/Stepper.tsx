"use client";

import React from "react";

export type StepId = "search" | "add" | "packages" | "confirm";

export type Step = {
  id: StepId;
  label: string;
};

const STEPS: Step[] = [
  { id: "search", label: "Search Patient" },
  { id: "add", label: "Add Patient" },
  { id: "packages", label: "Available Package" },
  { id: "confirm", label: "Confirm" },
];

export function Stepper({
  activeStep,
  completed,
  onSelect,
}: {
  activeStep: StepId;
  completed: StepId[];
  onSelect?: (s: StepId) => void;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-full items-center justify-between gap-2 rounded-md border border-foreground/10 bg-foreground/5 p-2">
        {STEPS.map((s) => {
          const isActive = s.id === activeStep;
          const isDone = completed.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect?.(s.id)}
              className={
                "min-w-40 rounded-md px-3 py-2 text-sm font-medium transition " +
                (isActive
                  ? "bg-red-500 text-white shadow"
                  : isDone
                  ? "bg-foreground/10 text-foreground"
                  : "bg-transparent text-foreground/80 hover:bg-foreground/10")
              }
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { STEPS };



