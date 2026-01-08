"use client";

import { useMemo, useState } from "react";

export default function SearchPatient({
  onNext,
}: {
  onNext: (payload: { phone: string }) => void;
}) {
  const [phone, setPhone] = useState<string>("");
  const isValid = useMemo(() => /^\d{10}$/.test(phone), [phone]);

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Patient Information
      </h2>

      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Search Patient Information
      </div>

      <div className="text-center text-sm font-medium">
        {phone.length === 0 ? (
          <span className="text-foreground/50">Enter mobile number</span>
        ) : isValid ? (
          <span className="text-green-600">Valid Mobile Number</span>
        ) : (
          <span className="text-red-600">Invalid Mobile Number</span>
        )}
      </div>

      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <input
          className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-red-600 focus:ring-1 focus:ring-red-600"
          placeholder="Search Patient by Phone Number..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="button"
          onClick={() => onNext({ phone })}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          Search
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNext({ phone })}
          className="rounded-md bg-red-300 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}



