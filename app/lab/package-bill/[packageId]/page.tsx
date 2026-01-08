"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Mock data - in production this would come from a database
const mockPackageBillData: Record<string, any> = {
  p_sa9819122701104: {
    packageId: "p_sa9819122701104",
    referralId: "madsak632",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Sakshi",
      phoneNumber: "9845762380",
      sex: "Female",
      age: "28 Years, 03 Months",
      referredBy: "Madhavan",
      date: "27-Dec-2019 10:41:04",
    },
    packageName: "Packagenew",
    packageTests: [
      {
        slNo: 1,
        testName: "Complete Blood Count (CBC)",
        price: 400,
      },
      {
        slNo: 2,
        testName: "Lipid Profile",
        price: 800,
      },
      {
        slNo: 3,
        testName: "Thyroid Function Test",
        price: 1200,
      },
      {
        slNo: 4,
        testName: "Blood Sugar Fasting",
        price: 200,
      },
    ],
    packagePrice: 2200,
    discount: 200,
    netAmount: 2000,
  },
  p_sh841912170190: {
    packageId: "p_sh841912170190",
    referralId: "595shsrhw121",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "shweta",
      phoneNumber: "8497006622",
      sex: "Female",
      age: "32 Years, 05 Months",
      referredBy: "—",
      date: "17-Dec-2019 01:09:00",
    },
    packageName: "Packagenew",
    packageTests: [
      {
        slNo: 1,
        testName: "Complete Blood Count (CBC)",
        price: 400,
      },
      {
        slNo: 2,
        testName: "Lipid Profile",
        price: 800,
      },
      {
        slNo: 3,
        testName: "Thyroid Function Test",
        price: 1200,
      },
      {
        slNo: 4,
        testName: "Blood Sugar Fasting",
        price: 200,
      },
    ],
    packagePrice: 2200,
    discount: 0,
    netAmount: 2200,
  },
  p_sh8419121601096: {
    packageId: "p_sh8419121601096",
    referralId: "amishr595",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Shruti",
      phoneNumber: "8497006622",
      sex: "Female",
      age: "29 Years, 02 Months",
      referredBy: "Madhavan",
      date: "16-Dec-2019 01:09:06",
    },
    packageName: "Packagenew",
    packageTests: [
      {
        slNo: 1,
        testName: "Complete Blood Count (CBC)",
        price: 400,
      },
      {
        slNo: 2,
        testName: "Lipid Profile",
        price: 800,
      },
      {
        slNo: 3,
        testName: "Thyroid Function Test",
        price: 1200,
      },
      {
        slNo: 4,
        testName: "Blood Sugar Fasting",
        price: 200,
      },
    ],
    packagePrice: 2200,
    discount: 150,
    netAmount: 2050,
  },
  p_te821911160188: {
    packageId: "p_te821911160188",
    referralId: "tes615",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Test",
      phoneNumber: "8217050141",
      sex: "Male",
      age: "06 Years, 11 Months",
      referredBy: "—",
      date: "16-Nov-2019 01:08:08",
    },
    packageName: "Package 5",
    packageTests: [
      {
        slNo: 1,
        testName: "Vitamin D Test",
        price: 1500,
      },
      {
        slNo: 2,
        testName: "Vitamin B12",
        price: 900,
      },
    ],
    packagePrice: 2100,
    discount: 100,
    netAmount: 2000,
  },
  p_su851906270179: {
    packageId: "p_su851906270179",
    referralId: "sun575",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Sundar Pillai",
      phoneNumber: "8533212131",
      sex: "Male",
      age: "45 Years, 08 Months",
      referredBy: "—",
      date: "27-Jun-2019 01:07:09",
    },
    packageName: "Thyroid Package",
    packageTests: [
      {
        slNo: 1,
        testName: "TSH",
        price: 500,
      },
      {
        slNo: 2,
        testName: "T3",
        price: 400,
      },
      {
        slNo: 3,
        testName: "T4",
        price: 400,
      },
    ],
    packagePrice: 1100,
    discount: 100,
    netAmount: 1000,
  },
};

export default function PackageBillPage({
  params,
}: {
  params: { packageId: string };
}) {
  const router = useRouter();
  const packageId = params.packageId;
  const billData = mockPackageBillData[packageId];

  if (!billData) {
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
            <p className="text-foreground/60">Package billing not found</p>
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
            <span className="text-sm">Package Billing Details</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="rounded-lg border border-foreground/10 bg-card shadow-sm">
          {/* Title */}
          <div className="border-b border-foreground/10 bg-foreground/5 px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              <span className="font-normal text-foreground/70">
                Package Billing
              </span>{" "}
              Details
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 border-b border-foreground/10 px-6 py-3">
            <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground/70 transition hover:bg-foreground/5">
              <span>🖨️</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground/70 transition hover:bg-foreground/5">
              <span>❓</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground transition hover:bg-foreground/5">
              📥 Download Receipt
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground transition hover:bg-foreground/5">
              🖨️ Print Receipt
            </button>
          </div>

          <div className="p-6">
            {/* Lab Information */}
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-foreground/5">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {billData.labName}
                </h2>
                <p className="text-sm text-foreground/60">
                  {billData.labLocation}
                </p>
                <p className="text-sm text-foreground/60">
                  <span className="font-medium">Phone Number :</span>{" "}
                  {billData.labPhone}
                </p>
                <p className="text-sm text-foreground/60">
                  <span className="font-medium">Email Address :</span>{" "}
                  {billData.labEmail}
                </p>
              </div>
            </div>

            {/* Patient Details */}
            <div className="mb-6">
              <h3 className="mb-3 text-center text-sm font-medium text-foreground/80">
                Patient Details
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">Name:</span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.name}
                  </span>
                </div>
                <div className="flex justify-start text-sm md:justify-end">
                  <span className="font-medium text-foreground">Sex/Age:</span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.sex} / {billData.patient.age}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Phone Number:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-start text-sm md:justify-end">
                  <span className="font-medium text-foreground">
                    Referred Dr:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.referredBy}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Package ID:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {billData.packageId}
                  </span>
                </div>
                <div className="flex justify-start text-sm md:justify-end">
                  <span className="font-medium text-foreground">Date:</span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="mb-6">
              <div className="rounded-md border border-foreground/10 bg-foreground/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60">Package Name</p>
                    <p className="text-lg font-semibold text-foreground">
                      {billData.packageName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground/60">Referral ID</p>
                    <p className="font-mono text-sm text-foreground">
                      {billData.referralId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Tests Details */}
            <div className="mb-6">
              <h3 className="mb-3 text-center text-sm font-medium text-foreground/80">
                Package Tests Included
              </h3>
              <div className="overflow-hidden rounded-md border border-foreground/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-foreground/5">
                    <tr className="text-left text-foreground">
                      <th className="px-3 py-2 font-medium">Sl No.</th>
                      <th className="px-3 py-2 font-medium">Test Name</th>
                      <th className="px-3 py-2 text-right font-medium">
                        Individual Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {billData.packageTests.map((test: any) => (
                      <tr
                        key={test.slNo}
                        className="border-t border-foreground/5"
                      >
                        <td className="px-3 py-2 text-foreground/90">
                          {test.slNo}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {test.testName}
                        </td>
                        <td className="px-3 py-2 text-right text-foreground/90">
                          ₹{test.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="mb-6 flex justify-end">
              <div className="w-full max-w-sm space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">
                    Package Price
                  </span>
                  <span className="text-foreground/80">
                    ₹{billData.packagePrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Discount</span>
                  <span className="text-foreground/80">
                    ₹{billData.discount}
                  </span>
                </div>
                <div className="flex justify-between border-t border-foreground/10 pt-2">
                  <span className="font-semibold text-foreground">
                    Net Amount
                  </span>
                  <span className="font-semibold text-foreground">
                    ₹{billData.netAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Authorized Signatory */}
            <div className="mt-8 text-right">
              <p className="text-sm font-medium text-foreground">
                Authorized Signatory
              </p>
            </div>

            {/* Bottom action buttons */}
            <div className="mt-6 flex justify-center gap-3 border-t border-foreground/10 pt-6">
              <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                📥 Download Receipt
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

