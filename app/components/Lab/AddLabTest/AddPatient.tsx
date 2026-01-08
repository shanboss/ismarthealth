"use client";

import { useState } from "react";

type AddPatientForm = {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "others";
  email?: string;
  phone: string;
  dob?: string;
  age?: string;
  address?: string;
  pincode?: string;
  state?: string;
  city?: string;
};

export default function AddPatient({
  onPrev,
  onNext,
  initial,
}: {
  onPrev: () => void;
  onNext: (data: AddPatientForm) => void;
  initial?: Partial<AddPatientForm>;
}) {
  const [form, setForm] = useState<AddPatientForm>({
    firstName: "",
    lastName: "",
    gender: "male",
    email: "",
    phone: initial?.phone ?? "",
    dob: "",
    age: "",
    address: "",
    pincode: "",
    state: "",
    city: "",
  });

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
          <label className="block text-sm">Date of Birth</label>
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.dob}
            onChange={(e) => update("dob", e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Address Information
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm">Address</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Pincode</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.pincode}
            onChange={(e) => update("pincode", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Select State</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Select City</label>
          <input
            className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
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
          onClick={() => onNext(form)}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}



