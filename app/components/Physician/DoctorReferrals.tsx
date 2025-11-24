"use client";

import { ArrowRightCircleIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type Referral = {
  name: string;
  age: string;
  mobile: string;
  email: string;
  referredBy: string;
  tests: number;
  referredDate: string;
};

export default function DoctorReferrals() {
  const router = useRouter();
  const data: Referral[] = [
    {
      name: "Ajay",
      age: "45 Years, 09 Months",
      mobile: "7892044648",
      email: "patient.12@inetframe.com",
      referredBy: "Karmajeet",
      tests: 1,
      referredDate: "22-Jul-2019",
    },
    {
      name: "Arathi",
      age: "43 Years, 04 Months",
      mobile: "9985745858",
      email: "patient.12@inetframe.com",
      referredBy: "Madhavan",
      tests: 1,
      referredDate: "19-Jul-2019",
    },
    {
      name: "Kirahaka",
      age: "39 Years, 03 Months",
      mobile: "9565656325",
      email: "patient.12@inetframe.com",
      referredBy: "Madhavan",
      tests: 1,
      referredDate: "09-Jul-2019",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold tracking-tight border-b border-neutral-300">
        Referral Patient Details
      </h1>
      <div className="rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="text-sm text-foreground/70">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{data.length}</span> of{" "}
            <span className="font-medium">{data.length}</span> entries
          </div>
          <div className="relative w-56">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-foreground/10 text-sm">
            <thead className="bg-background">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Name
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Age
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Mobile
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Email
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Select
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Referred By
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Tests
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Referred Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {data.map((r, i) => (
                <tr key={i} className="">
                  <td className="px-3 py-2 text-foreground">{r.name}</td>
                  <td className="px-3 py-2 text-foreground/80">{r.age}</td>
                  <td className="px-3 py-2 text-foreground/80">{r.mobile}</td>
                  <td className="px-3 py-2 text-foreground/80">{r.email}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-foreground/30 p-1 text-foreground hover:opacity-80"
                      onClick={() =>
                        router.push(
                          `/physician/patient/${r.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/actions`
                        )
                      }
                      aria-label={`Open actions for ${r.name}`}
                    >
                      <ArrowRightCircleIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-foreground/80">
                    {r.referredBy}
                  </td>
                  <td className="px-3 py-2 text-foreground/80">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-foreground/30 p-1 text-foreground hover:opacity-80"
                      onClick={() =>
                        router.push(
                          `/physician/patient/${r.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/tests`
                        )
                      }
                      aria-label={`View ${r.name}'s tests`}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-foreground/80">
                    {r.referredDate}
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
