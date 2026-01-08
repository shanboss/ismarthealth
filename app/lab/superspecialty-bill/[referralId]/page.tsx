"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Mock data - in production this would come from a database
const mockSuperSpecialtyBillData: Record<string, any> = {
  SS2023050001: {
    referralId: "SS2023050001",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Sanju",
      phoneNumber: "9008423475",
      email: "test@test.com",
      sex: "Male",
      age: "06 Years, 07 Months",
      referredDate: "17-May-2023 14:30:20",
    },
    specialty: "Cardiology",
    consultationType: "In-Person Consultation",
    consultationFee: 1500,
    discount: 0,
    netAmount: 1500,
  },
  SS2022080001: {
    referralId: "SS2022080001",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Rajendra",
      phoneNumber: "9988112233",
      email: "raje@test.com",
      sex: "Male",
      age: "25 Years, 09 Months",
      referredDate: "29-Aug-2022 10:15:45",
    },
    specialty: "Neurology",
    consultationType: "Video Consultation",
    consultationFee: 1200,
    discount: 100,
    netAmount: 1100,
  },
  SS2021010001: {
    referralId: "SS2021010001",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Vinayak",
      phoneNumber: "8147374491",
      email: "vinayak3272@gmail.com",
      sex: "Male",
      age: "36 Years, 09 Months",
      referredDate: "04-Jan-2021 11:20:30",
    },
    specialty: "Orthopedics",
    consultationType: "In-Person Consultation",
    consultationFee: 1800,
    discount: 200,
    netAmount: 1600,
  },
  SS2019110001: {
    referralId: "SS2019110001",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Test",
      phoneNumber: "8217050141",
      email: "test@gmail.com",
      sex: "Male",
      age: "06 Years, 01 Months",
      referredDate: "18-Nov-2019 09:45:15",
    },
    specialty: "Pediatrics",
    consultationType: "In-Person Consultation",
    consultationFee: 1000,
    discount: 0,
    netAmount: 1000,
  },
  SS2019090001: {
    referralId: "SS2019090001",
    labName: "Inet Lab",
    labLocation: "Banashankari",
    labPhone: "7760091356",
    labEmail: "info@inetlab.com",
    patient: {
      name: "Amith",
      phoneNumber: "9875465425",
      email: "amith.123@nfo.com",
      sex: "Male",
      age: "26 Years, 06 Months",
      referredDate: "30-Sep-2019 16:20:10",
    },
    specialty: "Dermatology",
    consultationType: "Video Consultation",
    consultationFee: 900,
    discount: 0,
    netAmount: 900,
  },
};

export default function SuperSpecialtyBillPage({
  params,
}: {
  params: { referralId: string };
}) {
  const router = useRouter();
  const referralId = params.referralId;
  const billData = mockSuperSpecialtyBillData[referralId];

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
            <p className="text-foreground/60">Referral billing not found</p>
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
            <span className="text-sm">Super Specialty Billing</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="rounded-lg border border-foreground/10 bg-card shadow-sm">
          {/* Title */}
          <div className="border-b border-foreground/10 bg-foreground/5 px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              <span className="font-normal text-foreground/70">
                Super Specialty Billing
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
                  <span className="font-medium text-foreground">Age/Sex:</span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.age} / {billData.patient.sex}
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
                  <span className="font-medium text-foreground">Email:</span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.email}
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium text-foreground">
                    Referral ID:
                  </span>
                  <span className="ml-2 text-foreground/80">
                    {billData.referralId}
                  </span>
                </div>
                <div className="flex justify-start text-sm md:justify-end">
                  <span className="font-medium text-foreground">Date:</span>
                  <span className="ml-2 text-foreground/80">
                    {billData.patient.referredDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div className="mb-6">
              <h3 className="mb-3 text-center text-sm font-medium text-foreground/80">
                Consultation Details
              </h3>
              <div className="overflow-hidden rounded-md border border-foreground/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-foreground/5">
                    <tr className="text-left text-foreground">
                      <th className="px-3 py-2 font-medium">Specialty</th>
                      <th className="px-3 py-2 font-medium">
                        Consultation Type
                      </th>
                      <th className="px-3 py-2 text-right font-medium">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-foreground/5">
                      <td className="px-3 py-2 text-foreground/90">
                        {billData.specialty}
                      </td>
                      <td className="px-3 py-2 text-foreground/90">
                        {billData.consultationType}
                      </td>
                      <td className="px-3 py-2 text-right text-foreground/90">
                        ₹{billData.consultationFee}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="mb-6 flex justify-end">
              <div className="w-full max-w-sm space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">
                    Consultation Fee
                  </span>
                  <span className="text-foreground/80">
                    ₹{billData.consultationFee}
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

            {/* Payment Status */}
            <div className="mb-6 rounded-md border border-foreground/10 bg-foreground/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Payment Status:
                </span>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Paid
                </span>
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
              <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground transition hover:bg-foreground/5">
                📧 Email Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

