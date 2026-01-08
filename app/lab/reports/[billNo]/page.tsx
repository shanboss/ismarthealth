"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Mock data - in production this would come from a database
const mockReportsData: Record<string, any> = {
  "2018110471": {
    billNo: "2018110471",
    patient: {
      name: "Amith",
      phoneNumber: "9876545454",
      age: "26 Years",
      sex: "Male",
      referredBy: "Madhavan PH",
      date: "31-Oct-2025",
    },
    reports: [
      {
        slNo: 1,
        testName: "24 Hours Urine Protine",
        reportDate: "31-Oct-2025",
        status: "Ready",
        reportUrl: "#",
      },
      {
        slNo: 2,
        testName: "Activated Partial Thromboplastin Time Panel",
        reportDate: "31-Oct-2025",
        status: "Ready",
        reportUrl: "#",
      },
    ],
  },
};

export default function ReportsPage({
  params,
}: {
  params: { billNo: string };
}) {
  const router = useRouter();
  const billNo = params.billNo;
  const reportsData = mockReportsData[billNo];

  if (!reportsData) {
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
            <p className="text-foreground/60">Reports data not found</p>
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
            <span className="text-sm">Report Details</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="rounded-lg border border-foreground/10 bg-card shadow-sm">
          {/* Title */}
          <div className="border-b border-foreground/10 bg-foreground/5 px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              <span className="font-normal text-foreground/70">Report</span>{" "}
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
                    {reportsData.billNo}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Patient Name:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {reportsData.patient.name}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Phone Number:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {reportsData.patient.phoneNumber}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">Age/Sex:</span>
                  <span className="ml-2 text-foreground/80">
                    {reportsData.patient.age} / {reportsData.patient.sex}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Referred By:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {reportsData.patient.referredBy}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">Date:</span>
                  <span className="ml-2 text-foreground/80">
                    {reportsData.patient.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">
                Test Reports
              </h3>
              <div className="overflow-hidden rounded-md border border-foreground/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-foreground/5">
                    <tr className="text-left text-foreground">
                      <th className="px-3 py-2 font-medium">Sl No.</th>
                      <th className="px-3 py-2 font-medium">Test Name</th>
                      <th className="px-3 py-2 font-medium">Report Date</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportsData.reports.map((report: any) => (
                      <tr
                        key={report.slNo}
                        className="border-t border-foreground/5"
                      >
                        <td className="px-3 py-2 text-foreground/90">
                          {report.slNo}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {report.testName}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {report.reportDate}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              report.status === "Ready"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : report.status === "Processing"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              className="rounded-md px-2 py-1 text-xs text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                              disabled={report.status !== "Ready"}
                            >
                              View
                            </button>
                            <button
                              className="rounded-md px-2 py-1 text-xs text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                              disabled={report.status !== "Ready"}
                            >
                              Download
                            </button>
                            <button
                              className="rounded-md px-2 py-1 text-xs text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                              disabled={report.status !== "Ready"}
                            >
                              Print
                            </button>
                          </div>
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
                Download All Reports
              </button>
              <button className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                Print All Reports
              </button>
              <button className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                Email Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


