"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SuperSpecialityConsultationPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground transition hover:bg-foreground/10"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <h1 className="mb-4 text-center text-4xl font-semibold">
        Super Speciality
      </h1>

      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="bg-foreground/10 px-4 py-3 text-lg font-semibold">
          Super Speciality
        </div>
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="block text-base font-semibold text-foreground">
              Specialization
            </label>
            <select className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground">
              <option>Specialization</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-foreground">
              Select Specialist
            </label>
            <select
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              disabled
            >
              <option>No Records Found</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
