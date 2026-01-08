"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Mock data - in production this would come from a database
const mockPackageSamplesData: Record<string, any> = {
  p_sa9819122701104: {
    packageId: "p_sa9819122701104",
    referralId: "madsak632",
    packageName: "Packagenew",
    patient: {
      name: "Sakshi",
      phoneNumber: "9845762380",
      referredBy: "Madhavan",
      date: "27-Dec-2019",
    },
    samples: [
      {
        slNo: 1,
        testName: "Complete Blood Count (CBC)",
        sampleType: "Blood",
        collectionDate: "27-Dec-2019",
        collectionTime: "10:45",
        status: "Collected",
        barcode: "PKG-p_sa9819122701104-001",
      },
      {
        slNo: 2,
        testName: "Lipid Profile",
        sampleType: "Blood",
        collectionDate: "27-Dec-2019",
        collectionTime: "10:45",
        status: "Collected",
        barcode: "PKG-p_sa9819122701104-002",
      },
      {
        slNo: 3,
        testName: "Thyroid Function Test",
        sampleType: "Blood",
        collectionDate: "27-Dec-2019",
        collectionTime: "10:45",
        status: "Collected",
        barcode: "PKG-p_sa9819122701104-003",
      },
      {
        slNo: 4,
        testName: "Blood Sugar Fasting",
        sampleType: "Blood",
        collectionDate: "27-Dec-2019",
        collectionTime: "10:45",
        status: "Collected",
        barcode: "PKG-p_sa9819122701104-004",
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
      referredBy: "—",
      date: "17-Dec-2019",
    },
    samples: [
      {
        slNo: 1,
        testName: "Complete Blood Count (CBC)",
        sampleType: "Blood",
        collectionDate: "17-Dec-2019",
        collectionTime: "01:15",
        status: "Pending",
        barcode: "PKG-p_sh841912170190-001",
      },
      {
        slNo: 2,
        testName: "Lipid Profile",
        sampleType: "Blood",
        collectionDate: "17-Dec-2019",
        collectionTime: "01:15",
        status: "Pending",
        barcode: "PKG-p_sh841912170190-002",
      },
      {
        slNo: 3,
        testName: "Thyroid Function Test",
        sampleType: "Blood",
        collectionDate: "17-Dec-2019",
        collectionTime: "01:15",
        status: "Pending",
        barcode: "PKG-p_sh841912170190-003",
      },
      {
        slNo: 4,
        testName: "Blood Sugar Fasting",
        sampleType: "Blood",
        collectionDate: "17-Dec-2019",
        collectionTime: "01:15",
        status: "Pending",
        barcode: "PKG-p_sh841912170190-004",
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
      referredBy: "—",
      date: "27-Jun-2019",
    },
    samples: [
      {
        slNo: 1,
        testName: "TSH",
        sampleType: "Blood",
        collectionDate: "27-Jun-2019",
        collectionTime: "01:15",
        status: "Collected",
        barcode: "PKG-p_su851906270179-001",
      },
      {
        slNo: 2,
        testName: "T3",
        sampleType: "Blood",
        collectionDate: "27-Jun-2019",
        collectionTime: "01:15",
        status: "Collected",
        barcode: "PKG-p_su851906270179-002",
      },
      {
        slNo: 3,
        testName: "T4",
        sampleType: "Blood",
        collectionDate: "27-Jun-2019",
        collectionTime: "01:15",
        status: "Collected",
        barcode: "PKG-p_su851906270179-003",
      },
    ],
  },
};

export default function PackageSamplesPage({
  params,
}: {
  params: { packageId: string };
}) {
  const router = useRouter();
  const packageId = params.packageId;
  const samplesData = mockPackageSamplesData[packageId];

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
            <p className="text-foreground/60">Package samples data not found</p>
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
            <span className="text-sm">Package Sample Details</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="rounded-lg border border-foreground/10 bg-card shadow-sm">
          {/* Title */}
          <div className="border-b border-foreground/10 bg-foreground/5 px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              <span className="font-normal text-foreground/70">
                Package Sample
              </span>{" "}
              Details
            </h1>
          </div>

          <div className="p-6">
            {/* Package & Patient Information */}
            <div className="mb-6 rounded-md border border-foreground/10 bg-foreground/5 p-4">
              <div className="mb-3">
                <p className="text-sm text-foreground/60">Package Name</p>
                <p className="text-lg font-semibold text-foreground">
                  {samplesData.packageName}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Package ID:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {samplesData.packageId}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Referral ID:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {samplesData.referralId}
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
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">Date:</span>
                  <span className="ml-2 text-foreground/80">
                    {samplesData.patient.date}
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

