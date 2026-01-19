"use client";

import { useState } from "react";
import { ArrowLeftIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { WeekSchedule, initialSchedule, days } from "../../config/lab/LabTimings";

export default function LabTimings() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<WeekSchedule>(initialSchedule);
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/lab")}
            className="inline-flex items-center justify-center h-11 w-11 rounded-full border-2 border-blue-500 text-blue-500 transition duration-200 hover:bg-blue-50 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          {submitted && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 border border-green-200">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Lab timings updated successfully!</span>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-5 text-center">
          <div className="inline-flex items-center gap-2 mb-1">
            <ClockIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-foreground">
              <span className="text-blue-600">Lab Hours</span> Management
            </h1>
          </div>
          <p className="text-lg text-foreground/60 mt-2">Configure weekly schedule and working hours for the laboratory</p>
        </div>

        {/* Decorative Line */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 mb-10 rounded-full"></div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Schedule Grid */}
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-7">
            {days.map((day) => (
              <div
                key={day}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg hover:border-blue-300"
              >
                {/* Day Header */}
                <h3 className="mb-4 text-center text-base font-bold text-foreground group-hover:text-blue-600 transition">
                  {day}
                </h3>

                {/* Day Type Selector */}
                <div className="mb-4">
                  <select
                    className="w-full rounded-sm border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-sm font-medium text-foreground transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer hover:border-slate-400"
                    value={schedule[day].type}
                    title="Click To Select"
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
                </div>

                {/* Opening Time */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Opening Time
                  </label>
                  <input
                    type="text"
                    placeholder="9:30 AM"
                    className="w-full rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 text-sm text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100"
                    value={schedule[day].openingTime}
                    onChange={(e) =>
                      handleTimeChange(day, "openingTime", e.target.value)
                    }
                    disabled={schedule[day].type === "Holiday"}
                  />
                </div>

                {/* Closing Time */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    placeholder="8:00 PM"
                    className="w-full rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 text-sm text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100"
                    value={schedule[day].closingTime}
                    onChange={(e) =>
                      handleTimeChange(day, "closingTime", e.target.value)
                    }
                    disabled={schedule[day].type === "Holiday"}
                  />
                </div>

                {/* Holiday Badge */}
                {schedule[day].type === "Holiday" && (
                  <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-700 border border-amber-200">
                    Closed
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:shadow-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-12 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Tip:</span> Mark days as &quot;Holiday&quot; to disable time inputs for that day. All changes will be saved when you click the &quot;Save Changes&quot; button.
          </p>
        </div>
      </div>
    </div>
  );
}