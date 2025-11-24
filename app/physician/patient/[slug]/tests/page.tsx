"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";

type PatientTest = {
  id: string | number;
  name: string;
  date: string;
  time: string;
  status?: string;
};

export default function PatientTestsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug ?? "";
  const displayName = slug.replace(/-/g, " ");

  const tests: PatientTest[] = [
    { id: 1, name: "Random Blood Sugar", date: "05-Dec-2023", time: "12:00" },
    {
      id: 2,
      name: "MRA BRAIN WITH CONTRAST",
      date: "05-Dec-2023",
      time: "12:00",
    },
    { id: 3, name: "Fasting Blood Sugar", date: "05-Dec-2023", time: "08:00" },
    { id: 4, name: "MCV", date: "05-Dec-2023", time: "12:00", status: "—" },
    { id: 5, name: "MRI BRAIN PLAIN", date: "30-Jul-2019", time: "18:00" },
    { id: 6, name: "Growth Hormone", date: "30-Jul-2019", time: "18:00" },
    { id: 7, name: "Ultrasound neck", date: "29-Jul-2019", time: "12:00" },
    { id: 8, name: "HBsAg (Screening)", date: "29-Jul-2019", time: "12:00" },
    {
      id: 9,
      name: "xray cervical spine lateral",
      date: "10-Jul-2019",
      time: "12:00",
      status: "Not Available",
    },
  ];

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
      <h1 className="mb-4 text-center text-3xl font-semibold">
        {displayName}'s Lab Tests
      </h1>

      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-foreground/10 text-sm">
            <thead className="bg-background">
              <tr className="text-left font-semibold">
                <th className="px-4 py-3">Sr No.</th>
                <th className="px-4 py-3">Tests</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {tests.map((t, i) => (
                <tr key={t.id}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3">{t.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground/80">
                        {t.status ?? ""}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full border border-foreground/30 p-1 text-foreground hover:opacity-80"
                        onClick={() =>
                          router.push(
                            `/physician/patient/${slug}/lab-report?test=${encodeURIComponent(
                              t.name
                            )}`
                          )
                        }
                        aria-label={`View report for ${t.name}`}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



