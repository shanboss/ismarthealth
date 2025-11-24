"use client";

import {
  ArrowRightCircleIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

type QueueRow = {
  name: string;
  age: string;
  mobile: string;
  email: string;
  referredBy: string;
  tests: number;
  referredDate: string;
};

export default function LabConsultQueue() {
  const rows: QueueRow[] = [
    {
      name: "bharat",
      age: "36 Years, 04 Months",
      mobile: "9987675884",
      email: "",
      referredBy: "Inet Lab",
      tests: 1,
      referredDate: "20-Oct-2021",
    },
    {
      name: "Vinayak",
      age: "36 Years, 08 Months",
      mobile: "8147374491",
      email: "vinayak3272@gmail.com",
      referredBy: "Inet Lab",
      tests: 1,
      referredDate: "04-Jan-2021",
    },
    {
      name: "veersh",
      age: "33 Years, 08 Months",
      mobile: "8768768678",
      email: "",
      referredBy: "Inet Lab",
      tests: 1,
      referredDate: "01-Jan-1970",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold tracking-tight border-b border-neutral-300">
        Lab Consultation Queue
      </h1>

      <div className="rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>Show</span>
            <select className="rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
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
                <th className="px-3 py-2 text-left font-medium text-foreground/70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {rows.map((r, i) => (
                <tr key={i} className="">
                  <td className="px-3 py-2 text-foreground">{r.name}</td>
                  <td className="px-3 py-2 text-foreground/80">{r.age}</td>
                  <td className="px-3 py-2 text-foreground/80">{r.mobile}</td>
                  <td className="px-3 py-2 text-foreground/80">
                    {r.email || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-foreground/30 p-1 text-foreground hover:opacity-80"
                    >
                      <ArrowRightCircleIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-foreground/80">
                    {r.referredBy}
                  </td>
                  <td className="px-3 py-2 text-foreground/80">
                    <EyeIcon className="h-5 w-5" />
                  </td>
                  <td className="px-3 py-2 text-foreground/80">
                    {r.referredDate}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background transition hover:opacity-80"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Consultation Fees
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-3 text-sm text-foreground/70">
          <div>
            Showing 1 to {rows.length} of {rows.length} entries
          </div>
          <div className="inline-flex overflow-hidden rounded-md border border-foreground/20">
            <button className="px-3 py-1.5 hover:opacity-80">Previous</button>
            <button className="bg-foreground px-3 py-1.5 font-medium text-background">
              1
            </button>
            <button className="px-3 py-1.5 hover:opacity-80">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
