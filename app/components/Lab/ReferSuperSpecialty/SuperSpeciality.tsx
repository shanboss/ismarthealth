"use client";

import { useMemo, useState } from "react";

type Specialist = {
  name: string;
  specialty: string;
  hospital: string;
};

const SPECIALISTS: Specialist[] = [
  { name: "Dr. Rao", specialty: "Cardiology", hospital: "Apex Heart" },
  { name: "Dr. Anita", specialty: "Neurology", hospital: "NeuroCare" },
  { name: "Dr. Kumar", specialty: "Orthopedics", hospital: "OrthoPlus" },
  { name: "Dr. Mehta", specialty: "Gastroenterology", hospital: "GI Center" },
];

const SPECIALTIES = Array.from(
  new Set(SPECIALISTS.map((s) => s.specialty))
).sort();

export default function SuperSpeciality({
  onPrev,
  onFinish,
}: {
  onPrev: () => void;
  onFinish: (payload: { specialist?: Specialist }) => void;
}) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(
    SPECIALTIES[0] ?? ""
  );
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  );
  const filtered = useMemo(
    () => SPECIALISTS.filter((s) => s.specialty === selectedSpecialty),
    [selectedSpecialty]
  );

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Patient Information
      </h2>
      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Super Speciality
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm">Speciality</label>
        <select
          className="rounded-md border border-foreground/20 bg-background px-3 py-2"
          value={selectedSpecialty}
          onChange={(e) => {
            setSelectedSpecialty(e.target.value);
            setSelectedIndex(undefined);
          }}
        >
          {SPECIALTIES.map((sp) => (
            <option key={sp} value={sp}>
              {sp}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-md border border-foreground/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-foreground/5">
            <tr className="text-foreground">
              <th className="px-3 py-2">Select</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Hospital/Clinic</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr key={idx} className="border-t border-foreground/10">
                <td className="px-3 py-2">
                  <input
                    type="radio"
                    name="spec"
                    checked={selectedIndex === idx}
                    onChange={() => setSelectedIndex(idx)}
                  />
                </td>
                <td className="px-3 py-2">{d.name}</td>
                <td className="px-3 py-2">{d.hospital}</td>
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
            onFinish({
              specialist:
                selectedIndex !== undefined ? filtered[selectedIndex] : undefined,
            })
          }
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Finish
        </button>
      </div>
    </div>
  );
}



