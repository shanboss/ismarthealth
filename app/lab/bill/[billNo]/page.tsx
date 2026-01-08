"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Mock data - in production this would come from a database
const mockBillData: Record<string, any> = {
  "2018110471": {
    billNo: "2018110471",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Amith",
      phoneNumber: "9876545454",
      sex: "Male",
      age: "26 Years, 07 Months",
      referredBy: "Madhavan PH",
      date: "31-Oct-2025 20:39:20",
    },
    tests: [
      {
        slNo: 1,
        testName: "24 Hours Urine Protine",
        date: "30-Oct-2025",
        time: "09:30",
        instruction: "",
        price: 800,
        billing: "Approved",
      },
      {
        slNo: 2,
        testName: "Activated Partial Thromboplastin Time Panel",
        date: "30-Oct-2025",
        time: "09:30",
        instruction: "",
        price: 3999,
        billing: "Approved",
      },
    ],
    total: 4799,
    discount: 0,
    netAmount: 4799,
  },
};

export default function BillDetailsPage({
  params,
}: {
  params: { billNo: string };
}) {
  const router = useRouter();
  const billNo = params.billNo;
  const billData = mockBillData[billNo];

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
            <p className="text-foreground/60">Bill not found</p>
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
            <span className="text-sm">Bill Details</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="rounded-lg border border-foreground/10 bg-card shadow-sm">
          {/* Title */}
          <div className="border-b border-foreground/10 bg-foreground/5 px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              <span className="font-normal text-foreground/70">Bill</span>{" "}
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
              📥 Download Barcode
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground transition hover:bg-foreground/5">
              🖨️ Print Barcode
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
                  <span className="font-medium text-foreground">Bill Id:</span>
                  <span className="ml-2 text-foreground/80">
                    {billData.billNo}
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

            {/* Patient Test Details */}
            <div className="mb-6">
              <h3 className="mb-3 text-center text-sm font-medium text-foreground/80">
                Patient Test Details
              </h3>
              <div className="overflow-hidden rounded-md border border-foreground/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-foreground/5">
                    <tr className="text-left text-foreground">
                      <th className="px-3 py-2 font-medium">Sl No.</th>
                      <th className="px-3 py-2 font-medium">Tests</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Time</th>
                      <th className="px-3 py-2 font-medium">Instruction</th>
                      <th className="px-3 py-2 text-right font-medium">
                        Price
                      </th>
                      <th className="px-3 py-2 font-medium">Billing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billData.tests.map((test: any) => (
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
                        <td className="px-3 py-2 text-foreground/90">
                          {test.date}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {test.time}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {test.instruction || "-"}
                        </td>
                        <td className="px-3 py-2 text-right text-foreground/90">
                          {test.price}
                        </td>
                        <td className="px-3 py-2 text-foreground/90">
                          {test.billing}
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
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-foreground/80">{billData.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Discount</span>
                  <span className="text-foreground/80">
                    {billData.discount}
                  </span>
                </div>
                <div className="flex justify-between border-t border-foreground/10 pt-2">
                  <span className="font-semibold text-foreground">
                    Net Amount
                  </span>
                  <span className="font-semibold text-foreground">
                    {billData.netAmount}
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
                📥 Download Barcode
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                🖨️ Print Barcode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


