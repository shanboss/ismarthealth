"use client";

import { useMemo, useState } from "react";

type Doctor = {
  name: string;
  phone: string;
  email: string;
  specialization: string;
  clinic: string;
};

const DOCTORS: Doctor[] = [
  { name: "Amit", phone: "7892598570", email: "amit@amit.com", specialization: "Cardiology/Cardiac Science", clinic: "—" },
  { name: "ABC", phone: "9538205289", email: "abc@inet.in", specialization: "Obstetrics", clinic: "Bang" },
  { name: "Amith", phone: "9986607713", email: "amithkm713@gmail.com", specialization: "General Medicine & Surgery", clinic: "—" },
  { name: "Anand", phone: "9686551733", email: "anandsh78@gmail.com", specialization: "Radiology", clinic: "tumkur" },
];

export default function DoctorDetails({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: (doctor: Doctor | undefined) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return DOCTORS.filter((d) =>
      [d.name, d.phone, d.email, d.specialization, d.clinic]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <div className="rounded-md bg-red-400/60 px-3 py-2 text-center text-lg font-semibold text-foreground">
        Doctor Details
      </div>

      <div className="flex items-center justify-end gap-2">
        <label className="text-sm text-foreground/80">Search:</label>
        <input
          className="w-64 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search doctors..."
        />
      </div>

      <div className="overflow-hidden rounded-md border border-foreground/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-foreground/5">
            <tr className="text-foreground">
              <th className="px-3 py-2">Select</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone Number</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Specialization</th>
              <th className="px-3 py-2">Clinic Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr key={idx} className="border-t border-foreground/10">
                <td className="px-3 py-2">
                  <input
                    type="radio"
                    name="doc"
                    checked={selected === idx}
                    onChange={() => setSelected(idx)}
                  />
                </td>
                <td className="px-3 py-2">{d.name}</td>
                <td className="px-3 py-2">{d.phone}</td>
                <td className="px-3 py-2">{d.email}</td>
                <td className="px-3 py-2">{d.specialization}</td>
                <td className="px-3 py-2">{d.clinic}</td>
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
          onClick={() => onNext(selected !== undefined ? filtered[selected] : undefined)}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}



