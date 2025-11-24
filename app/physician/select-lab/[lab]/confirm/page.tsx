"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Order = {
  labKey: string;
  lab: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    locality: string;
  };
  patientSlug: string;
  items: { key: string; test: string; date: string; time: string; instruction: string }[];
};

export default function ConfirmOrderPage() {
  const params = useParams<{ lab: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ismh_pending_order");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {}
  }, []);

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">No order data</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Return to lab selection to create a new order.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-3xl font-semibold border-b border-neutral-200">
        Confirm Order
      </h1>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
          <div className="px-4 py-3 text-lg font-semibold">Patient</div>
          <div className="divide-y divide-foreground/10 text-sm">
            <div className="grid grid-cols-3 gap-4 px-4 py-3">
              <div className="col-span-1 font-medium">Name</div>
              <div className="col-span-2">{order.patientSlug}</div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
          <div className="px-4 py-3 text-lg font-semibold">Laboratory</div>
          <div className="divide-y divide-foreground/10 text-sm">
            <div className="grid grid-cols-3 gap-4 px-4 py-3">
              <div className="col-span-1 font-medium">Name</div>
              <div className="col-span-2">{order.lab.name}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-3">
              <div className="col-span-1 font-medium">Phone</div>
              <div className="col-span-2">{order.lab.phone}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-3">
              <div className="col-span-1 font-medium">Email</div>
              <div className="col-span-2">{order.lab.email}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-3">
              <div className="col-span-1 font-medium">Address</div>
              <div className="col-span-2">{order.lab.address}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <table className="min-w-full divide-y divide-foreground/10">
          <thead className="bg-foreground/5">
            <tr className="text-left text-sm font-semibold">
              <th className="px-4 py-3">Test Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Instruction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {order.items.map((it) => (
              <tr key={it.key}>
                <td className="px-4 py-3 text-sm">{it.test}</td>
                <td className="px-4 py-3 text-sm">{it.date}</td>
                <td className="px-4 py-3 text-sm">{it.time}</td>
                <td className="px-4 py-3 text-sm">{it.instruction || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm text-foreground transition hover:bg-foreground/10"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => router.push("/physician?tab=dashboard")}
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          Confirm & Finish
        </button>
      </div>
    </div>
  );
}


