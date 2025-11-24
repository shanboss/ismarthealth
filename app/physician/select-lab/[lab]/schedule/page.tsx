"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type PendingTests = {
  patientSlug: string;
  tests: string[]; // "GROUP::LABEL"
};

const LABS: Record<
  string,
  {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    locality: string;
  }
> = {
  "devagiri-hospital": {
    name: "Devagiri Hospital",
    phone: "7986546456",
    email: "devagiri@gmail.com",
    address: "#185, ISHTA ,1st Floor,Banashankari Stage II",
    city: "Bangalore",
    locality: "Banashankari 2nd Stage",
  },
  "inet-lab": {
    name: "Inet Lab",
    phone: "7760091356",
    email: "inet@example.com",
    address: "Banashankari",
    city: "Bangalore",
    locality: "Jayanagar",
  },
};

export default function ScheduleTestsPage() {
  const params = useParams<{ lab: string }>();
  const router = useRouter();
  const labKey = params?.lab ?? "";
  const lab = LABS[labKey] ?? LABS["devagiri-hospital"];

  const [pending, setPending] = useState<PendingTests | null>(null);
  const [rows, setRows] = useState<
    { key: string; test: string; date: string; time: string; instruction: string }[]
  >([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ismh_pending_tests");
      if (raw) {
        const parsed = JSON.parse(raw) as PendingTests;
        setPending(parsed);
        setRows(
          (parsed.tests || []).map((t) => {
            const [, label] = t.split("::");
            return { key: t, test: label || t, date: "", time: "", instruction: "" };
          })
        );
      }
    } catch {}
  }, []);

  function updateRow(idx: number, field: "date" | "time" | "instruction", value: string) {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  const canContinue = useMemo(
    () => rows.length > 0 && rows.every((r) => r.date && r.time),
    [rows]
  );

  function onContinue() {
    try {
      const payload = {
        labKey,
        lab,
        patientSlug: pending?.patientSlug ?? "",
        items: rows,
      };
      localStorage.setItem("ismh_pending_order", JSON.stringify(payload));
    } catch {}
    router.push(`/physician/select-lab/${labKey}/confirm`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground transition hover:bg-foreground/10"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>
      <h1 className="text-3xl font-semibold border-b border-neutral-200">
        Laboratory Details
      </h1>

      <div className="mt-4 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="divide-y divide-foreground/10 text-sm">
          <div className="grid grid-cols-4 gap-4 px-4 py-3">
            <div className="col-span-1 font-medium">Name</div>
            <div className="col-span-3 text-foreground underline-offset-4">
              {lab.name}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 px-4 py-3">
            <div className="col-span-1 font-medium">Phone</div>
            <div className="col-span-3">{lab.phone}</div>
          </div>
          <div className="grid grid-cols-4 gap-4 px-4 py-3">
            <div className="col-span-1 font-medium">Email</div>
            <div className="col-span-3 text-foreground underline-offset-4">
              {lab.email}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 px-4 py-3">
            <div className="col-span-1 font-medium">Address</div>
            <div className="col-span-3 text-foreground underline-offset-4">
              {lab.address}
            </div>
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-center text-2xl font-semibold">
        The Selected Tests are displayed below:
      </h2>

      <div className="mt-4 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <table className="min-w-full divide-y divide-foreground/10">
          <thead className="bg-foreground/5">
            <tr className="text-left text-sm font-semibold">
              <th className="px-4 py-3">Test Name</th>
              <th className="px-4 py-3">Select Date</th>
              <th className="px-4 py-3">Select Time</th>
              <th className="px-4 py-3">Instruction</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-foreground/10">
              {rows.map((r, idx) => (
                <tr key={r.key}>
                  <td className="px-4 py-3 text-sm">{r.test}</td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={r.date}
                      onChange={(e) => updateRow(idx, "date", e.target.value)}
                      className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="dd-mm-yyyy"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="time"
                      value={r.time}
                      onChange={(e) => updateRow(idx, "time", e.target.value)}
                      className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={r.instruction}
                      onChange={(e) => updateRow(idx, "instruction", e.target.value)}
                      className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="Instruction (optional)"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/physician/select-lab")}
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}


