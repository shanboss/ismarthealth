"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

type Slot = { clinic: string; open: string; close: string };
type DayConfig = { workType: "Working day" | "Holiday"; slots: Slot[] };

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export default function ModifyTimingsPage() {
  const [avgMinutes, setAvgMinutes] = useState<number>(15);
  const router = useRouter();
  const [byDay, setByDay] = useState<Record<(typeof DAYS)[number], DayConfig>>(
    () =>
      DAYS.reduce((acc, d) => {
        acc[d] = {
          workType: d === "Sunday" ? "Holiday" : "Working day",
          slots: [{ clinic: "", open: "", close: "" }],
        };
        return acc;
      }, {} as Record<(typeof DAYS)[number], DayConfig>)
  );

  function setDay<K extends keyof DayConfig>(
    day: (typeof DAYS)[number],
    key: K,
    value: DayConfig[K]
  ) {
    setByDay((prev) => ({ ...prev, [day]: { ...prev[day], [key]: value } }));
  }

  function updateSlot(
    day: (typeof DAYS)[number],
    idx: number,
    patch: Partial<Slot>
  ) {
    setByDay((prev) => {
      const nextSlots = prev[day].slots.map((s, i) =>
        i === idx ? { ...s, ...patch } : s
      );
      return { ...prev, [day]: { ...prev[day], slots: nextSlots } };
    });
  }

  function addSlot(day: (typeof DAYS)[number]) {
    setByDay((prev) => {
      const nextSlots = [
        ...prev[day].slots,
        { clinic: "", open: "", close: "" },
      ];
      return { ...prev, [day]: { ...prev[day], slots: nextSlots } };
    });
  }

  function removeSlot(day: (typeof DAYS)[number], idx: number) {
    setByDay((prev) => {
      const nextSlots = prev[day].slots.filter((_, i) => i !== idx);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: nextSlots.length
            ? nextSlots
            : [{ clinic: "", open: "", close: "" }],
        },
      };
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-md border border-foreground/30 bg-background px-3 py-2 text-sm text-foreground shadow-sm transition hover:opacity-80"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>
      <h1 className="text-2xl font-semibold tracking-tight">
        Modify Physician Timings
      </h1>

      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-foreground/10 text-sm">
            <thead className="bg-background">
              <tr>
                <th className="w-40 px-3 py-2 text-left font-medium text-foreground/70">
                  Day
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Work Type & Timings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {DAYS.map((day) => {
                const config = byDay[day];
                const disabled = config.workType === "Holiday";
                return (
                  <tr key={day} className="">
                    <td className="align-top px-3 py-3 text-foreground">
                      {day}
                    </td>
                    <td className="px-3 py-3">
                      <div className="grid gap-2">
                        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-3">
                          <select
                            value={config.workType}
                            onChange={(e) =>
                              setDay(
                                day,
                                "workType",
                                e.target.value as DayConfig["workType"]
                              )
                            }
                            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                          >
                            <option>Working day</option>
                            <option>Holiday</option>
                          </select>
                          <div className="md:col-span-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => addSlot(day)}
                              className="inline-flex items-center gap-2 rounded-md border border-foreground/30 px-3 py-2 text-xs font-medium text-foreground transition hover:opacity-80"
                              disabled={disabled}
                            >
                              <PlusIcon className="h-4 w-4" />
                              Add slot
                            </button>
                          </div>
                        </div>

                        {!disabled && (
                          <>
                            <div className="md:col-span-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => addSlot(day)}
                                className="inline-flex items-center gap-2 rounded-md border border-foreground/30 px-3 py-2 text-xs font-medium text-foreground transition hover:opacity-80"
                              >
                                <PlusIcon className="h-4 w-4" />
                                Add slot
                              </button>
                            </div>
                            <div className="space-y-2">
                              {config.slots.map((slot, idx) => (
                                <div
                                  key={idx}
                                  className="grid grid-cols-1 items-center gap-2 md:grid-cols-4"
                                >
                                  <input
                                    placeholder="Clinic name"
                                    value={slot.clinic}
                                    onChange={(e) =>
                                      updateSlot(day, idx, {
                                        clinic: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                                  />
                                  <input
                                    type="time"
                                    value={slot.open}
                                    onChange={(e) =>
                                      updateSlot(day, idx, {
                                        open: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                                  />
                                  <input
                                    type="time"
                                    value={slot.close}
                                    onChange={(e) =>
                                      updateSlot(day, idx, {
                                        close: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                                  />
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => removeSlot(day, idx)}
                                      className="inline-flex items-center gap-2 rounded-md border border-foreground/30 px-3 py-2 text-xs font-medium text-foreground transition hover:opacity-80"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-foreground/10 p-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-foreground">
              Average time span for each patient
            </label>
            <input
              type="number"
              min={5}
              step={5}
              value={avgMinutes}
              onChange={(e) => setAvgMinutes(Number(e.target.value))}
              className="w-24 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
            <span className="text-sm text-foreground/70">Minutes</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => router.push("/physician?tab=dashboard")}
        className="fixed bottom-4 right-4 font-semibold z-50 inline-flex items-center justify-center rounded-md bg-green-400 px-5 py-2 text-sm text-white shadow-lg transition hover:bg-green-500"
      >
        Save
      </button>
    </div>
  );
}
