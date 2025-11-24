"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const actions = [
  "Laboratory Tests",
  "Super Speciality Consultation",
  "Preventive Health Package Tests",
  "Prescribe Medicine",
];

export default function PatientActionsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-md border border-foreground/30 bg-background px-3 py-2 text-sm text-foreground shadow-sm transition hover:opacity-80"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="px-6 py-5">
          <h1 className="text-3xl font-semibold tracking-tight text-center">
            Actions
          </h1>
          <div className="my-4 h-px w-full bg-foreground/10" />

          <ul className="space-y-6">
            {actions.map((label) => (
              <li key={label}>
                <button
                  type="button"
                  className="group flex w-full items-center gap-4 rounded-md px-1 py-2 text-left text-xl font-semibold text-foreground transition hover:opacity-90"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-foreground/70" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
