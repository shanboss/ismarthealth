"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";

type MedicineRow = {
  id: string;
  type: "Tablet" | "Syrup" | "Injection" | "Capsule";
  name: string;
  mgml: string;
  dose: string;
  days: number;
  instruction: "After Food" | "Before Food";
  advice: string;
};

export default function PrescribeMedicinePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [symptoms, setSymptoms] = useState("");
  const [rows, setRows] = useState<MedicineRow[]>([
    {
      id: "row-1",
      type: "Tablet",
      name: "",
      mgml: "",
      dose: "1-0-0",
      days: 1,
      instruction: "After Food",
      advice: "",
    },
  ]);

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${prev.length + 1}`,
        type: "Tablet",
        name: "",
        mgml: "",
        dose: "1-0-0",
        days: 1,
        instruction: "After Food",
        advice: "",
      },
    ]);
  }

  function updateRow<T extends keyof MedicineRow>(
    id: string,
    key: T,
    value: MedicineRow[T]
  ) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );
  }

  function submitPrescription() {
    try {
      const payload = {
        patient: params?.slug ?? "",
        symptoms,
        rows,
        createdAt: Date.now(),
      };
      localStorage.setItem("ismh_prescription_draft", JSON.stringify(payload));
    } catch {}
    alert("Prescription submitted.");
  }

  function resetForm() {
    setSymptoms("");
    setRows([
      {
        id: "row-1",
        type: "Tablet",
        name: "",
        mgml: "",
        dose: "1-0-0",
        days: 1,
        instruction: "After Food",
        advice: "",
      },
    ]);
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

      {/* Header */}
      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="grid grid-cols-3 items-center gap-4 p-4">
          <div className="text-4xl font-serif">Rx</div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Madhavan Clinic</h1>
            <p className="text-sm text-foreground/70">
              8th Block, Basavanagudi
            </p>
            <p className="text-sm">
              Clinic Phone:
              <span className="pl-1 text-foreground/80">
                9902030560, 7618743177
              </span>
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-xl font-semibold">Dr. Madhavan PH</p>
            <p>General Physician</p>
            <p>
              Reg. Number: <span className="pl-1"># 234687985</span>
            </p>
            <p>
              Date:
              <span className="pl-1">
                {new Date().toLocaleString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            <p>
              Mobile: <span className="pl-1">9902030560, 7618743177</span>
            </p>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="mt-4 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="bg-foreground/5 px-4 py-2 text-sm font-medium">
          Patient Information
        </div>
        <div className="grid grid-cols-2 gap-6 px-4 py-3 text-sm md:grid-cols-4">
          <div>
            <div className="font-medium">Name</div>
            <div className="text-foreground/80">{params?.slug || "—"}</div>
          </div>
          <div>
            <div className="font-medium">Phone Number</div>
            <div className="text-foreground/80">9876545454</div>
          </div>
          <div>
            <div className="font-medium">Age</div>
            <div className="text-foreground/80">26 Years, 06 Months</div>
          </div>
          <div>
            <div className="font-medium">Sex</div>
            <div className="text-foreground/80">Male</div>
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="mt-4 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="bg-foreground/5 px-4 py-2 text-sm font-medium">
          Symptoms
        </div>
        <div className="p-4">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="h-40 w-full resize-y rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            placeholder="Describe patient symptoms..."
          />
        </div>
      </div>

      {/* Medicine */}
      <div className="mt-4 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="bg-foreground/5 px-4 py-2 text-sm font-medium">
          Medicine
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-foreground/10">
            <thead className="bg-background">
              <tr className="text-left text-sm font-semibold">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Medicine Name</th>
                <th className="px-4 py-3">MG/ML</th>
                <th className="px-4 py-3">Dose</th>
                <th className="px-4 py-3">No. of Days</th>
                <th className="px-4 py-3">Instruction</th>
                <th className="px-4 py-3">Special Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">
                    <select
                      value={r.type}
                      onChange={(e) =>
                        updateRow(
                          r.id,
                          "type",
                          e.target.value as MedicineRow["type"]
                        )
                      }
                      className="w-40 rounded-md border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    >
                      <option>Tablet</option>
                      <option>Syrup</option>
                      <option>Injection</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={r.name}
                      onChange={(e) => updateRow(r.id, "name", e.target.value)}
                      placeholder="Medicine Name"
                      className="w-64 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={r.mgml}
                      onChange={(e) => updateRow(r.id, "mgml", e.target.value)}
                      placeholder="MG/ML"
                      className="w-28 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.dose}
                      onChange={(e) => updateRow(r.id, "dose", e.target.value)}
                      className="w-28 rounded-md border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    >
                      <option>1-0-0</option>
                      <option>1-1-0</option>
                      <option>1-1-1</option>
                      <option>0-1-0</option>
                      <option>0-1-1</option>
                      <option>0-0-1</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      value={r.days}
                      onChange={(e) =>
                        updateRow(r.id, "days", Number(e.target.value))
                      }
                      className="w-20 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.instruction}
                      onChange={(e) =>
                        updateRow(
                          r.id,
                          "instruction",
                          e.target.value as MedicineRow["instruction"]
                        )
                      }
                      className="w-36 rounded-md border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    >
                      <option>After Food</option>
                      <option>Before Food</option>
                      <option>With Water</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={r.advice}
                      onChange={(e) =>
                        updateRow(r.id, "advice", e.target.value)
                      }
                      placeholder="Special Advice"
                      className="w-56 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80 active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            Add Row
          </button>
        </div>
      </div>
      {/* Bottom actions */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={submitPrescription}
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          Submit Prescription
        </button>
      </div>
    </div>
  );
}
