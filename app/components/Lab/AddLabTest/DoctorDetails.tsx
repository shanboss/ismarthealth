"use client";

import { useMemo, useState, useEffect } from "react";

type LaboratoryDoctor = {
  laboratory_doctors_id: number;
  laboratory_id: number;
  doc_firstname: string;
  doc_lastname: string;
  doc_password: string;
  doc_phone_number: string;
  doc_email: string;
  doc_dept: number;
  doc_signature: string;
  added_date: Date;
  doc_designation: string;
  is_active: number;
};

type Doctor = {
  id: number;
  name: string;
  phone: string;
  email: string;
  designation: string;
  department: number;
};

export default function DoctorDetails({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: (doctor: Doctor | undefined) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [doctors, setDoctors] = useState<LaboratoryDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctors from API
  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/lab/doctors");
        const data = await response.json();

        if (response.ok && data.success) {
          setDoctors(data.data || []);
        } else {
          setError(data.error || "Failed to fetch doctors");
        }
      } catch (err) {
        setError("An error occurred while fetching doctors");
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return doctors.filter((d) =>
      [
        d.doc_firstname,
        d.doc_lastname,
        d.doc_phone_number,
        d.doc_email,
        d.doc_designation,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, doctors]);

  if (loading) {
    return (
      <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="text-foreground/60">Loading doctors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <div className="rounded-md bg-red-400/60 px-3 py-2 text-center text-lg font-semibold text-foreground">
        Doctor Details
      </div>

      {error && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/70">
          {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} available
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground/80">Search:</label>
          <input
            className="w-64 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-foreground/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-foreground/5">
            <tr className="text-foreground">
              <th className="px-3 py-2">Select</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone Number</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">Department</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-foreground/60"
                >
                  {query
                    ? "No doctors found matching your search"
                    : "No doctors available"}
                </td>
              </tr>
            ) : (
              filtered.map((d, idx) => (
                <tr key={d.laboratory_doctors_id} className="border-t border-foreground/10">
                  <td className="px-3 py-2">
                    <input
                      type="radio"
                      name="doc"
                      checked={selected === idx}
                      onChange={() => setSelected(idx)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2">
                    {d.doc_firstname} {d.doc_lastname}
                  </td>
                  <td className="px-3 py-2">{d.doc_phone_number}</td>
                  <td className="px-3 py-2">{d.doc_email}</td>
                  <td className="px-3 py-2">{d.doc_designation}</td>
                  <td className="px-3 py-2">{d.doc_dept}</td>
                </tr>
              ))
            )}
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
          onClick={() => {
            if (selected !== undefined) {
              const selectedDoc = filtered[selected];
              onNext({
                id: selectedDoc.laboratory_doctors_id,
                name: `${selectedDoc.doc_firstname} ${selectedDoc.doc_lastname}`,
                phone: selectedDoc.doc_phone_number,
                email: selectedDoc.doc_email,
                designation: selectedDoc.doc_designation,
                department: selectedDoc.doc_dept,
              });
            } else {
              onNext(undefined);
            }
          }}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}



