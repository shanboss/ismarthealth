"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const actions = [
  { label: "Laboratory Tests", path: "lab-tests" },
  {
    label: "Super Speciality Consultation",
    path: "super-speciality-consultation",
  },
  {
    label: "Preventive Health Package Tests",
    path: "preventive-health-packages",
  },
  { label: "Prescribe Medicine", path: "prescribe-medicine" },
];

export default function PatientActionsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const patientSlug = params?.slug ?? "";

  // Demo data; replace with real patient data when available
  const patient = {
    name: patientSlug || "—",
    phone: "9876545454",
    birthday: "1999-05-24",
    age: "26 Years, 06 Months",
    sex: "Male",
  };
  const medicalHistory = [
    "Type 2 Diabetes (Diet controlled)",
    "Allergy: Penicillin",
    "Past Surgery: Appendectomy (2017)",
  ];
  const dependents = [
    { name: "Anita Kumar", relation: "Spouse" },
    { name: "Ishaan Kumar", relation: "Son" },
  ];
  const prevInvestigations = [
    { test: "CBC", date: "2025-05-02", summary: "Within normal limits" },
    { test: "Lipid Profile", date: "2025-07-14", summary: "LDL borderline" },
    { test: "X-Ray Chest", date: "2025-09-10", summary: "No active disease" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-foreground/30 bg-background px-3 py-2 text-sm text-foreground shadow-sm transition hover:opacity-80"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
            <div className="bg-foreground/5 px-4 py-2 text-sm font-medium">
              Patient Details
            </div>
            <div className="grid grid-cols-2 gap-6 px-4 py-4 text-sm md:grid-cols-3">
              <div>
                <div className="font-medium">Name</div>
                <div className="text-foreground/80">{patient.name}</div>
              </div>
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-foreground/80">{patient.phone}</div>
              </div>
              <div>
                <div className="font-medium">Birthday</div>
                <div className="text-foreground/80">{patient.birthday}</div>
              </div>
              <div>
                <div className="font-medium">Age</div>
                <div className="text-foreground/80">{patient.age}</div>
              </div>
              <div>
                <div className="font-medium">Sex</div>
                <div className="text-foreground/80">{patient.sex}</div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
            <div className="bg-foreground/5 px-4 py-2 text-sm font-medium">
              Medical History
            </div>
            <ul className="px-5 py-3 list-disc text-sm marker:text-foreground/60">
              {medicalHistory.map((item) => (
                <li key={item} className="text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
            <div className="bg-foreground/5 px-4 py-2 text-sm font-medium">
              Dependents
            </div>
            <table className="min-w-full divide-y divide-foreground/10 text-sm">
              <thead className="bg-background">
                <tr className="text-left font-semibold">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Relation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {dependents.map((d) => (
                  <tr key={`${d.name}-${d.relation}`}>
                    <td className="px-4 py-2">{d.name}</td>
                    <td className="px-4 py-2">{d.relation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
            <div className="bg-foreground/5 px-4 py-2 text-sm font-medium">
              Previous Investigations
            </div>
            <table className="min-w-full divide-y divide-foreground/10 text-sm">
              <thead className="bg-background">
                <tr className="text-left font-semibold">
                  <th className="px-4 py-2">Test</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {prevInvestigations.map((inv) => (
                  <tr key={`${inv.test}-${inv.date}`}>
                    <td className="px-4 py-2">{inv.test}</td>
                    <td className="px-4 py-2">{inv.date}</td>
                    <td className="px-4 py-2">{inv.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
            <div className="px-4 py-3 text-lg font-semibold">Actions</div>
            <ul className="divide-y divide-foreground/10">
              {actions.map(({ label, path }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/physician/patient/${patientSlug}/${path}`)
                    }
                    className="block w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-foreground/5"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
