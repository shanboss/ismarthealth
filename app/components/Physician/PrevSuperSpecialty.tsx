"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

type Result = {
  patientName: string;
  specializationName: string;
  referDate: string;
  specialist: string;
};

export default function PrevSuperSpecialty() {
  const router = useRouter();
  const results: Result[] = [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-semibold tracking-tight border-b border-neutral-300">
          Previous Super Speciality Consultations
        </h1>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background shadow-sm">
        <form className="grid gap-4 p-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-foreground"
            >
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              placeholder="dd-mm-yyyy"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-foreground"
            >
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              placeholder="dd-mm-yyyy"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div className="flex items-end gap-3">
            <div className="w-full">
              <label
                htmlFor="specialist"
                className="block text-sm font-medium text-foreground"
              >
                Select Specialist
              </label>
              <select
                id="specialist"
                name="specialist"
                className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Specialist
                </option>
                <option>Cardiologist</option>
                <option>Neurologist</option>
                <option>Endocrinologist</option>
                <option>Oncologist</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center self-end rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80 active:scale-95"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="border-t border-foreground/10" />

        <div className="overflow-hidden p-3">
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-950/40">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">
                    Patient Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">
                    Specialization Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">
                    Refer Date
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300">
                    Specialist
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  results.map((r, i) => (
                    <tr
                      key={i}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-3 py-2 text-zinc-900 dark:text-zinc-100">
                        {r.patientName}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {r.specializationName}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {r.referDate}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {r.specialist}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
