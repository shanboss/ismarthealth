"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function LabReportPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const testName = search.get("test") || "—";
  const slug = params?.slug ?? "";
  const displayName = slug.replace(/-/g, " ");

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

      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <Image
                src="/vercel.svg"
                alt="Lab"
                width={160}
                height={120}
                className="rounded-md border border-foreground/10 bg-background"
              />
              <div className="text-sm">
                <div className="text-base font-semibold">Inet Lab</div>
                <div>Banashankari</div>
                <div>Phone: 7760091356</div>
                <div>Email: info@inetlab.com</div>
              </div>
            </div>
            <div className="text-sm md:text-right">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                <span>Mr. {displayName}</span>
              </div>
              <div>
                <span className="font-semibold">Phone Number:</span>{" "}
                <span>7892044648</span>
              </div>
              <div>
                <span className="font-semibold">Sex/Age:</span>{" "}
                <span>Male/45 Years, 10 Months</span>
              </div>
              <div>
                <span className="font-semibold">Referred Dr:</span>{" "}
                <span>Madhavan PH</span>
              </div>
              <div>
                <span className="font-semibold">Date:</span>{" "}
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/10 px-4 py-3 text-center text-xl font-semibold">
          Test Report
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-foreground/10 text-sm">
            <thead className="bg-background">
              <tr className="text-left font-semibold">
                <th className="px-4 py-3">Test Name</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Reference Range</th>
                <th className="px-4 py-3">Instruction</th>
                <th className="px-4 py-3">Test Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              <tr>
                <td className="px-4 py-3">{testName}</td>
                <td className="px-4 py-3">130</td>
                <td className="px-4 py-3">mg/dL</td>
                <td className="px-4 py-3">Less than 140</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">—</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Fasting Blood Sugar</td>
                <td className="px-4 py-3">80</td>
                <td className="px-4 py-3">mg/dL</td>
                <td className="px-4 py-3">70-99</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">—</td>
              </tr>
              <tr>
                <td className="px-4 py-3">MCV</td>
                <td className="px-4 py-3">90</td>
                <td className="px-4 py-3">fL</td>
                <td className="px-4 py-3">N:82-98</td>
                <td className="px-4 py-3">MVCinst</td>
                <td className="px-4 py-3">testmthd</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



