"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function PatientDetails() {
  const router = useRouter();
  const patients = [
    {
      name: "Drake Johnson",
      age: 42,
      mobile: "+91 98765 43210",
      email: "drake.johnson@example.com",
      prevInvestigation: true,
      dependents: 2,
      createdAt: "2025-10-12",
    },
    {
      name: "Aditi Sharma",
      age: 35,
      mobile: "+91 90123 45678",
      email: "aditi.sharma@example.com",
      prevInvestigation: false,
      dependents: 1,
      createdAt: "2025-10-10",
    },
    {
      name: "Samuel Lee",
      age: 29,
      mobile: "+91 99887 66554",
      email: "samuel.lee@example.com",
      prevInvestigation: true,
      dependents: 0,
      createdAt: "2025-09-30",
    },
    {
      name: "Priya Nair",
      age: 47,
      mobile: "+91 91234 56789",
      email: "priya.nair@example.com",
      prevInvestigation: true,
      dependents: 3,
      createdAt: "2025-08-21",
    },
    {
      name: "Rahul Mehta",
      age: 38,
      mobile: "+91 93456 78901",
      email: "rahul.mehta@example.com",
      prevInvestigation: false,
      dependents: 2,
      createdAt: "2025-07-15",
    },
  ];

  function slugify(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold tracking-tight border-b border-neutral-300">
        Patient Details
      </h1>
      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="flex items-center justify-between border-b border-foreground/10 bg-background px-3 py-2">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search patients..."
              className="peer w-full rounded-md border border-foreground/20 bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
              aria-label="Search patients"
            />
          </div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-foreground/10">
            <thead className="bg-background">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Age
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Mobile
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Prev. Investigation
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Dependents
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {patients.map((p, idx) => {
                const slug = slugify(p.name);
                return (
                  <tr
                    key={idx}
                    className="cursor-pointer transition-colors hover:bg-foreground/5"
                    onClick={() =>
                      router.push(`/physician/patient/${slug}/actions`)
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground cursor-pointer">
                      {p.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80 cursor-pointer">
                      {p.age}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80 cursor-pointer">
                      {p.mobile}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80 cursor-pointer">
                      {p.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {p.prevInvestigation ? (
                        <span className="inline-flex items-center rounded-full border border-foreground/30 px-2 py-0.5 text-xs font-medium text-foreground">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-foreground/20 px-2 py-0.5 text-xs font-medium text-foreground/70">
                          None
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80 cursor-pointer">
                      {p.dependents}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80 cursor-pointer">
                      {p.createdAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
