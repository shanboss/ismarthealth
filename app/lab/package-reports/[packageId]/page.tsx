"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Mock data - in production this would come from a database
const mockPackageReportsData: Record<string, any> = {
  p_sa9819122701104: {
    packageId: "p_sa9819122701104",
    referralId: "madsak632",
    packageName: "Packagenew",
    patient: {
      name: "Sakshi",
      phoneNumber: "9845762380",
      age: "28 Years, 03 Months",
      sex: "Female",
      referredBy: "Madhavan",
      date: "27-Dec-2019",
    },
    reports: [
      {
        slNo: 1,
        testName: "Complete Blood Count (CBC)",
        reportDate: "28-Dec-2019",
        status: "Ready",
        reportUrl: "#",
      },
      {
        slNo: 2,
        testName: "Lipid Profile",
        reportDate: "28-Dec-2019",
        status: "Ready",
        reportUrl: "#",
      },
      {
        slNo: 3,
        testName: "Thyroid Function Test",
        reportDate: "28-Dec-2019",
        status: "Ready",
        reportUrl: "#",
      },
      {
        slNo: 4,
        testName: "Blood Sugar Fasting",
        reportDate: "28-Dec-2019",
        status: "Ready",
        reportUrl: "#",
      },
    ],
  },
  p_sh841912170190: {
    packageId: "p_sh841912170190",
    referralId: "595shsrhw121",
    packageName: "Packagenew",
    patient: {
      name: "shweta",
      phoneNumber: "8497006622",
      age: "32 Years, 05 Months",
      sex: "Female",
      referredBy: "—",
      date: "17-Dec-2019",
    },
    reports: [
      {
        slNo: 1,
        testName: "Complete Blood Count (CBC)",
        reportDate: "18-Dec-2019",
        status: "Processing",
        reportUrl: "#",
      },
      {
        slNo: 2,
        testName: "Lipid Profile",
        reportDate: "18-Dec-2019",
        status: "Processing",
        reportUrl: "#",
      },
      {
        slNo: 3,
        testName: "Thyroid Function Test",
        reportDate: "18-Dec-2019",
        status: "Pending",
        reportUrl: "#",
      },
      {
        slNo: 4,
        testName: "Blood Sugar Fasting",
        reportDate: "18-Dec-2019",
        status: "Ready",
        reportUrl: "#",
      },
    ],
  },
  p_su851906270179: {
    packageId: "p_su851906270179",
    referralId: "sun575",
    packageName: "Thyroid Package",
    patient: {
      name: "Sundar Pillai",
      phoneNumber: "8533212131",
      age: "45 Years, 08 Months",
      sex: "Male",
      referredBy: "—",
      date: "27-Jun-2019",
    },
    reports: [
      {
        slNo: 1,
        testName: "TSH",
        reportDate: "28-Jun-2019",
        status: "Ready",
        reportUrl: "#",
      },
      {
        slNo: 2,
        testName: "T3",
        reportDate: "28-Jun-2019",
        status: "Ready",
        reportUrl: "#",
      },
      {
        slNo: 3,
        testName: "T4",
        reportDate: "28-Jun-2019",
        status: "Ready",
        reportUrl: "#",
      },
    ],
  },
};

export default function PackageReportsPage({
  params,
}: {
  params: { packageId: string };
}) {
  const router = useRouter();
  const packageId = params.packageId;
  const reportsData = mockPackageReportsData[packageId];

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
            <p className="text-foreground/60">
              Package reports data not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  const readyCount = reportsData.reports.filter(
    (r: any) => r.status === "Ready"
  ).length;
  const totalCount = reportsData.reports.length;

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
            <span className="text-sm">Package Report Details</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="rounded-lg border border-foreground/10 bg-card shadow-sm">
          {/* Title */}
          <div className="border-b border-foreground/10 bg-foreground/5 px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              <span className="font-normal text-foreground/70">
                Package Report
              </span>{" "}
              Details
            </h1>
          </div>

          <div className="p-6">
            {/* Package & Patient Information */}
            <div className="mb-6 rounded-md border border-foreground/10 bg-foreground/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Package Name</p>
                  <p className="text-lg font-semibold text-foreground">
                    {reportsData.packageName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/60">Report Status</p>
                  <p className="text-lg font-semibold text-foreground">
                    {readyCount} / {totalCount} Ready
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Package ID:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {reportsData.packageId}
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
                              className="rounded-md px-2 py-1 text-xs text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground disabled:opacity-40"
                              disabled={report.status !== "Ready"}
                            >
                              View
                            </button>
                            <button
                              className="rounded-md px-2 py-1 text-xs text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground disabled:opacity-40"
                              disabled={report.status !== "Ready"}
                            >
                              Download
                            </button>
                            <button
                              className="rounded-md px-2 py-1 text-xs text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground disabled:opacity-40"
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
              <button
                className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
                disabled={readyCount === 0}
              >
                Download All Ready Reports
              </button>
              <button
                className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
                disabled={readyCount === 0}
              >
                Print All Ready Reports
              </button>
              <button
                className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
                disabled={readyCount === 0}
              >
                Email Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

