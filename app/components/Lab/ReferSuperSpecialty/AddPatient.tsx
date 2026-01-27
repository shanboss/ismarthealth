"use client";

import { useState, useEffect } from "react";
import { AddPatientForm } from "../../../config/lab/ReferSuperSpecialty/AddPatient";
import type { PatientQueueResult } from "../../../config/lab/ReferSuperSpecialty/SearchPatient";

export default function AddPatient({
  onPrev,
  onNext,
  initial,
  selectedPatient,
}: {
  onPrev: () => void;
  onNext: (data: AddPatientForm) => void;
  initial?: Partial<AddPatientForm> & {
    firstname?: string;
    phonenum?: string;
    mailid?: string;
    patient_unique_id?: string;
  };
  selectedPatient?: PatientQueueResult | null;
}) {
  const [form, setForm] = useState<AddPatientForm>({
    firstName: initial?.firstName ?? initial?.firstname ?? "",
    lastName: initial?.lastName ?? "",
    gender: (initial?.gender as AddPatientForm["gender"]) ?? "male",
    email: initial?.email ?? initial?.mailid ?? "",
    phone: initial?.phone ?? initial?.phonenum ?? "",
    age: initial?.age ?? "",
    patient_unique_id: initial?.patient_unique_id ?? selectedPatient?.patient_unique_id,
  });

  useEffect(() => {
    if (selectedPatient) {
      setForm((f) => ({
        ...f,
        firstName: f.firstName || selectedPatient.firstname,
        phone: f.phone || selectedPatient.phonenum,
        email: f.email || selectedPatient.mailid || "",
        patient_unique_id: selectedPatient.patient_unique_id,
      }));
    }
  }, [selectedPatient]);

  function update<K extends keyof AddPatientForm>(key: K, val: AddPatientForm[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Patient Information
      </h2>

      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Personal Information
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm">First Name</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Last Name</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Phone Number</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">E-Mail Address</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Age</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Gender</label>
          <select
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value as AddPatientForm["gender"])}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
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
            onNext({
              ...form,
              patient_unique_id:
                form.patient_unique_id ?? selectedPatient?.patient_unique_id,
            })
          }
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}



