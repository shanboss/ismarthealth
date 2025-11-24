"use client";

import { useParams } from "next/navigation";

export default function PreventiveHealthPackagesPage() {
  const params = useParams<{ slug: string }>();
  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">
        Preventive Health Package Tests - {params?.slug}
      </h1>
    </div>
  );
}



