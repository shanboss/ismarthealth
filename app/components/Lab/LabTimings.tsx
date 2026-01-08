"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type DaySchedule = {
  type: "Holiday" | "Working day";
  openingTime: string;
  closingTime: string;
};

type WeekSchedule = {
  Sunday: DaySchedule;
  Monday: DaySchedule;
  Tuesday: DaySchedule;
  wednesday: DaySchedule;
  Thursday: DaySchedule;
  Friday: DaySchedule;
  Saturday: DaySchedule;
};

const initialSchedule: WeekSchedule = {
  Sunday: {
    type: "Holiday",
    openingTime: "",
    closingTime: "",
  },
  Monday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "8:00 PM",
  },
  Tuesday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "8:00 PM",
  },
  wednesday: {
    type: "Working day",
    openingTime: "8:00 AM",
    closingTime: "6:00 PM",
  },
  Thursday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "8:00 PM",
  },
  Friday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "7:59 PM",
  },
  Saturday: {
    type: "Working day",
    openingTime: "9:00 AM",
    closingTime: "1:00 PM",
  },
};

export default function LabTimings() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<WeekSchedule>(initialSchedule);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

  const handleDayTypeChange = (
    day: keyof WeekSchedule,
    value: "Holiday" | "Working day"
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        type: value,
      },
    }));
  };

  const handleTimeChange = (
    day: keyof WeekSchedule,
    field: "openingTime" | "closingTime",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting lab timings:", schedule);
    alert("Lab timings updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          <span className="font-normal">Inet Lab</span> working time details
        </h1>
      </div>

      <div className="h-1 bg-blue-500"></div>

      <div className="flex items-start">
        <button
          type="button"
          onClick={() => router.push("/lab")}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 transition hover:bg-blue-50"
          title="Go back"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {days.map((day) => (
            <div key={day} className="flex flex-col gap-3">
              <h3 className="text-center text-base font-semibold text-foreground">
                {day}
              </h3>
              <select
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                value={schedule[day].type}
                onChange={(e) =>
                  handleDayTypeChange(
                    day,
                    e.target.value as "Holiday" | "Working day"
                  )
                }
              >
                <option value="Holiday">Holiday</option>
                <option value="Working day">Working day</option>
              </select>

              <div className="rounded-md bg-foreground/5 px-3 py-2 text-sm text-foreground/60">
                Opening time
              </div>
              <input
                type="text"
                placeholder="9:30 AM"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={schedule[day].openingTime}
                onChange={(e) =>
                  handleTimeChange(day, "openingTime", e.target.value)
                }
                disabled={schedule[day].type === "Holiday"}
              />

              <div className="rounded-md bg-foreground/5 px-3 py-2 text-sm text-foreground/60">
                Closing time
              </div>
              <input
                type="text"
                placeholder="8:00 PM"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={schedule[day].closingTime}
                onChange={(e) =>
                  handleTimeChange(day, "closingTime", e.target.value)
                }
                disabled={schedule[day].type === "Holiday"}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-green-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

