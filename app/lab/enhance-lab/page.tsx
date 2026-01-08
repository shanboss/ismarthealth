"use client";

import Sidebar from "../../components/Lab/Sidebar";
import { useState } from "react";

export default function EnhanceLabPage() {
  const [selected, setSelected] = useState<string>("");
  const tests = [
    "Complete Blood Count (CBC)",
    "Liver Function Test (LFT)",
    "Kidney Function Test (KFT)",
    "Thyroid Profile",
    "Lipid Profile",
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          Enhance Test Capabilities
        </h1>

        <div className="mx-auto w-full max-w-3xl rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
          <div className="mx-auto w-full max-w-xl space-y-4">
            <div className="flex items-center justify-center">
              <select
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">Select Tests</option>
                {tests.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                disabled={!selected}
              >
                Add
              </button>
              <button
                type="button"
                className="rounded-md bg-red-500 px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                onClick={() => setSelected("")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


