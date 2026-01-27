"use client";

import { useState } from "react";
import type { AddPatientForm } from "../../../config/lab/ReferSuperSpecialty/AddPatient";
import type { Specialist } from "../../../config/lab/ReferSuperSpecialty/SuperSpeciality";

export default function Confirm({
  summary,
  onPrev,
  onFinish,
}: {
  summary: {
    patient?: AddPatientForm | Record<string, unknown>;
    specialist?: Specialist | Record<string, unknown>;
  };
  onPrev: () => void;
  onFinish: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{
    referralId?: string;
    patientUniqueId?: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!summary.patient || !summary.specialist) {
      setError("Missing required information. Please go back and complete all steps.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const patientData = {
        firstName: (summary.patient as AddPatientForm & { patient_unique_id?: string }).firstName ?? "",
        lastName: (summary.patient as AddPatientForm).lastName ?? "",
        gender: (summary.patient as AddPatientForm).gender ?? undefined,
        email: (summary.patient as AddPatientForm).email ?? undefined,
        phone: (summary.patient as AddPatientForm).phone ?? "",
        age: (summary.patient as AddPatientForm).age ?? undefined,
        patient_unique_id: (summary.patient as AddPatientForm & { patient_unique_id?: string }).patient_unique_id ?? undefined,
      };
      const specialistData = {
        name: (summary.specialist as Specialist).name ?? "",
        specialty: (summary.specialist as Specialist).specialty ?? "",
        hospital: (summary.specialist as Specialist).hospital ?? "",
      };

      const response = await fetch("/api/lab/add-superspecialty-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: patientData, specialist: specialistData }),
      });

      const rawText = await response.text();
      let data: { success?: boolean; data?: { referralId?: string; patientUniqueId?: string }; error?: string; details?: string };
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorMessage = data.details
          ? `${data.error || "Request failed"}: ${data.details}`
          : data.error ||
            `Request failed (${response.status}${response.statusText ? " " + response.statusText : ""})`;
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setResult(data.data ?? null);
      setTimeout(() => onFinish(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting superspecialty referral:", err);
    } finally {
      setLoading(false);
    }
  };

  const patient = summary.patient as AddPatientForm | undefined;
  const specialist = summary.specialist as Specialist | undefined;

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Confirm Super Specialty Referral
      </h2>
      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Review & Submit
      </div>

      {error && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {success && result && (
        <div className="rounded-md bg-green-100 px-4 py-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <div className="font-semibold">✓ Super specialty referral created successfully!</div>
          <div className="mt-1">
            Referral ID: <span className="font-mono font-semibold">{result.referralId}</span>
          </div>
          {result.patientUniqueId && (
            <div>
              Patient ID: <span className="font-mono font-semibold">{result.patientUniqueId}</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <details className="rounded-md border border-foreground/10" open>
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">
            Patient Information
          </summary>
          <div className="px-3 py-2 text-sm space-y-1">
            <div><span className="font-medium">Name:</span> {patient?.firstName} {patient?.lastName}</div>
            <div><span className="font-medium">Phone:</span> {patient?.phone}</div>
            {patient?.email && <div><span className="font-medium">Email:</span> {patient.email}</div>}
            {patient?.gender && <div><span className="font-medium">Gender:</span> {patient.gender}</div>}
            {patient?.age && <div><span className="font-medium">Age:</span> {patient.age}</div>}
          </div>
        </details>

        {specialist && (
          <details className="rounded-md border border-foreground/10" open>
            <summary className="cursor-pointer select-none px-3 py-2 font-medium">
              Specialist
            </summary>
            <div className="px-3 py-2 text-sm space-y-1">
              <div><span className="font-medium">Name:</span> {specialist.name}</div>
              <div><span className="font-medium">Specialty:</span> {specialist.specialty}</div>
              <div><span className="font-medium">Hospital/Clinic:</span> {specialist.hospital}</div>
            </div>
          </details>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={loading || success}
          className="rounded-md bg-foreground/20 px-4 py-2 text-sm font-semibold text-foreground transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || success}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : success ? "Submitted ✓" : "Submit Referral"}
        </button>
      </div>
    </div>
  );
}
