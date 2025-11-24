"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SuperSpecialtyDetailsPage() {
  const router = useRouter();

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

      <h1 className="text-3xl font-semibold tracking-tight">
        Super-Specialty Details
      </h1>

      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        {/* Form row */}
        <form
          className="grid gap-4 p-4 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-semibold" htmlFor="specialist">
              Select Specialist
            </label>
            <select
              id="specialist"
              name="specialist"
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
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

          <div className="flex items-end justify-start md:justify-start">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-500"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto p-3">
          <table className="min-w-full divide-y divide-foreground/10 text-sm">
            <thead className="bg-background">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Patient Name
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Specialization Name
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Refer Date
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Specialist
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {/* Rows would render here after submit/search */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


