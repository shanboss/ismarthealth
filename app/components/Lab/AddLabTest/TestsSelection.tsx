"use client";

import { useState } from "react";

const TESTS = [
  "CBC",
  "LFT",
  "KFT",
  "Thyroid Profile",
  "Lipid Profile",
  "Vitamin D",
  "COVID RTPCR",
  "Urine Routine",
];

export default function TestsSelection({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: (tests: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(test: string) {
    setSelected((cur) =>
      cur.includes(test) ? cur.filter((t) => t !== test) : [...cur, test]
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Patient Information
      </h2>
      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Tests Selection
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Select Tests</label>
        <div className="grid gap-2 sm:max-w-xl">
          {TESTS.map((t) => (
            <label
              key={t}
              className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(t)}
                onChange={() => toggle(t)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-md bg-foreground/20 px-4 py-2 text-sm font-semibold text-foreground transition hover:opacity-90 active:scale-95"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onNext(selected)}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}



