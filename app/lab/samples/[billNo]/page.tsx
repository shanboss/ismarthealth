"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Mock data - in production this would come from a database
const mockSamplesData: Record<string, any> = {
  "2018110471": {
    billNo: "2018110471",
    patient: {
      name: "Amith",
      phoneNumber: "9876545454",
      referredBy: "Madhavan PH",
      date: "31-Oct-2025",
    },
    samples: [
      {
        slNo: 1,
        testName: "24 Hours Urine Protine",
        sampleType: "Urine",
        collectionDate: "30-Oct-2025",
        collectionTime: "09:30",
        status: "Collected",
        barcode: "SM-2018110471-001",
      },
      {
        slNo: 2,
        testName: "Activated Partial Thromboplastin Time Panel",
        sampleType: "Blood",
        collectionDate: "30-Oct-2025",
        collectionTime: "09:30",
        status: "Collected",
        barcode: "SM-2018110471-002",
      },
    ],
  },
};

export default function SamplesPage({
  params,
}: {
  params: { billNo: string };
}) {
  const router = useRouter();
  const billNo = params.billNo;
  const samplesData = mockSamplesData[billNo];

  if (!samplesData) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-foreground/70 hover:text-foreground"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
          <div className="rounded-lg bg-card p-8 text-center">
            <p className="text-foreground/60">Samples data not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 rounded-md p-2 text-foreground/70 transition hover:bg-foreground/5 hover:text-foreground"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm">Sample Details</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="rounded-lg border border-foreground/10 bg-card shadow-sm">
          {/* Title */}
          <div className="border-b border-foreground/10 bg-foreground/5 px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              <span className="font-normal text-foreground/70">Sample</span>{" "}
              Details
            </h1>
          </div>

          <div className="p-6">
            {/* Patient Information */}
            <div className="mb-6 rounded-md border border-foreground/10 bg-foreground/5 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">Bill No:</span>
                  <span className="ml-2 text-foreground/80">
                    {samplesData.billNo}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Patient Name:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {samplesData.patient.name}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Phone Number:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {samplesData.patient.phoneNumber}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Referred By:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {samplesData.patient.referredBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Samples Table */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">
                Sample Collection Details
              </h3>
              <div className="overflow-hidden rounded-md border border-foreground/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-foreground/5">
                    <tr className="text-left text-foreground">
                      <th className="px-3 py-2 font-medium">Sl No.</th>
                      <th className="px-3 py-2 font-medium">Test Name</th>
                      <th className="px-3 py-2 font-medium">Sample Type</th>
                      <th className="px-3 py-2 font-medium">
                        Collection Date
                      </th>
                      <th className="px-3 py-2 font-medium">
                        Collection Time
                      </th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Barcode</th>
                      <th className="px-3 py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samplesData.samples.map((sample: any) => (
                      <tr
                        key={sample.slNo}
                        className="border-t border-foreground/5"
                      >
                        <td className="px-3 py-2 text-foreground/90">
                          {sample.slNo}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {sample.testName}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {sample.sampleType}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {sample.collectionDate}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {sample.collectionTime}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              sample.status === "Collected"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            }`}
                          >
                            {sample.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-foreground/90">
                          {sample.barcode}
                        </td>
                        <td className="px-3 py-2">
                          <button className="rounded-md px-2 py-1 text-xs text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground">
                            Print Label
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3 border-t border-foreground/10 pt-6">
              <button className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                Print All Labels
              </button>
              <button className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


