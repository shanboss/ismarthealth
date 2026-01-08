"use client";

import { useMemo, useState } from "react";

type Package = {
  id: string;
  name: string;
  price: number;
  tests: number;
};

const PACKAGES: Package[] = [
  { id: "pkg1", name: "Basic Health Check", price: 999, tests: 10 },
  { id: "pkg2", name: "Comprehensive Check", price: 2999, tests: 35 },
  { id: "pkg3", name: "Thyroid Package", price: 799, tests: 3 },
  { id: "pkg4", name: "Diabetes Package", price: 1299, tests: 6 },
];

export default function AvailablePackage({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: (pkg: Package | undefined) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PACKAGES.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Patient Information
      </h2>
      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Available Package
      </div>

      <div className="flex items-center justify-end gap-2">
        <label className="text-sm text-foreground/80">Search:</label>
        <input
          className="w-64 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packages..."
        />
      </div>

      <div className="overflow-hidden rounded-md border border-foreground/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-foreground/5">
            <tr className="text-foreground">
              <th className="px-3 py-2">Select</th>
              <th className="px-3 py-2">Package</th>
              <th className="px-3 py-2">Tests</th>
              <th className="px-3 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-foreground/10">
                <td className="px-3 py-2">
                  <input
                    type="radio"
                    name="pkg"
                    checked={selected === p.id}
                    onChange={() => setSelected(p.id)}
                  />
                </td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.tests}</td>
                <td className="px-3 py-2">₹ {p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-md bg-foreground/20 px-4 py-2 text-sm font-semibold text-foreground transition hover:opacity-90 active:scale-95"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() =>
            onNext(filtered.find((p) => p.id === selected) ?? undefined)
          }
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}



