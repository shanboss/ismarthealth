"use client";

import { useState } from "react";
import { SelectedTest } from "../../../config/lab/AllLabTest/TestsSelection";
import { AddPatientForm } from "../../../config/lab/AllLabTest/AddPatient";
import { Doctor } from "../../../config/lab/AllLabTest/DoctorDetails";

export default function Confirm({
  summary,
  onPrev,
  onFinish,
}: {
  summary: {
    phone?: string;
    patient?: AddPatientForm | Record<string, unknown>;
    doctor?: Doctor | Record<string, unknown>;
    tests?: SelectedTest[];
  };
  onPrev: () => void;
  onFinish: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{
    medicalNum?: string;
    patientUniqueId?: string;
  } | null>(null);

  const handleFinish = async () => {
    if (!summary.patient || !summary.tests || summary.tests.length === 0) {
      setError("Missing required information. Please go back and complete all steps.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Ensure patient has required fields and clean up the data
      const patientData = {
        firstName: (summary.patient as any)?.firstName || "",
        lastName: (summary.patient as any)?.lastName || "",
        gender: (summary.patient as any)?.gender || undefined,
        email: (summary.patient as any)?.email || undefined,
        phone: (summary.patient as any)?.phone || "",
        dob: (summary.patient as any)?.dob || undefined,
        age: (summary.patient as any)?.age || undefined,
        address: (summary.patient as any)?.address || undefined,
        pincode: (summary.patient as any)?.pincode || undefined,
        state: (summary.patient as any)?.state || undefined,
        city: (summary.patient as any)?.city || undefined,
        patient_unique_id: (summary.patient as any)?.patient_unique_id || undefined,
      };

      // Ensure doctor data is clean
      const doctorData = summary.doctor ? {
        id: (summary.doctor as any)?.id,
        name: (summary.doctor as any)?.name || "",
        phone: (summary.doctor as any)?.phone || "",
        email: (summary.doctor as any)?.email || "",
        designation: (summary.doctor as any)?.designation || "",
        department: (summary.doctor as any)?.department || 0,
      } : undefined;

      // Ensure tests data is clean
      const testsData = summary.tests.map(test => ({
        id: test.id,
        name: test.name,
        department: test.department,
        price: test.price,
        code: test.code,
      }));

      const response = await fetch("/api/lab/add-lab-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: patientData,
          doctor: doctorData,
          tests: testsData,
        }),
      });

      const rawText = await response.text();
      let data: { success?: boolean; data?: unknown; error?: string; details?: string };
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorMessage =
          data.error ||
          data.details ||
          (typeof rawText === "string" && rawText.length > 0 && rawText.length < 200 ? rawText : null) ||
          `Request failed (${response.status}${response.statusText ? " " + response.statusText : ""})`;
        console.error(
          "API Error:",
          "status=" + response.status,
          "statusText=" + response.statusText,
          "error=" + (data.error ?? "none"),
          "details=" + (data.details ?? "none"),
          "body=" + (rawText?.slice?.(0, 500) ?? "empty")
        );
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setResult((data && "data" in data ? data.data : null) as { medicalNum?: string; patientUniqueId?: string } | null);
      
      // Reset wizard after a short delay
      setTimeout(() => {
        onFinish();
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Error submitting lab test:", err);
      if (err instanceof TypeError && err.message.includes("JSON")) {
        console.error("JSON serialization error - patient data:", summary.patient);
        console.error("Doctor data:", summary.doctor);
        console.error("Tests data:", summary.tests);
      }
    } finally {
      setLoading(false);
    }
  };

  const patient = summary.patient as AddPatientForm | undefined;
  const doctor = summary.doctor as Doctor | undefined;
  const tests = summary.tests || [];

  // Calculate total price
  const totalPrice = tests.reduce((sum, test) => {
    const price = parseFloat(test.price) || 0;
    return sum + price;
  }, 0);

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Confirm Lab Test Order
      </h2>
      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Review & Confirm
      </div>

      {error && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {success && result && (
        <div className="rounded-md bg-green-100 px-4 py-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <div className="font-semibold">✓ Lab test order created successfully!</div>
          <div className="mt-1">
            Medical Number: <span className="font-mono font-semibold">{result.medicalNum}</span>
          </div>
          <div>
            Patient ID: <span className="font-mono font-semibold">{result.patientUniqueId}</span>
          </div>
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
            {patient?.dob && <div><span className="font-medium">Date of Birth:</span> {patient.dob}</div>}
          </div>
        </details>

        {patient?.address && (
          <details className="rounded-md border border-foreground/10">
            <summary className="cursor-pointer select-none px-3 py-2 font-medium">
              Address Information
            </summary>
            <div className="px-3 py-2 text-sm space-y-1">
              <div>{patient.address}</div>
              {(patient.city || patient.state || patient.pincode) && (
                <div>
                  {patient.city && `${patient.city}, `}
                  {patient.state && `${patient.state} `}
                  {patient.pincode && `- ${patient.pincode}`}
                </div>
              )}
            </div>
          </details>
        )}

        {doctor && (
          <details className="rounded-md border border-foreground/10">
            <summary className="cursor-pointer select-none px-3 py-2 font-medium">
              Doctor Information
            </summary>
            <div className="px-3 py-2 text-sm space-y-1">
              <div><span className="font-medium">Name:</span> {doctor.name}</div>
              <div><span className="font-medium">Designation:</span> {doctor.designation}</div>
              {doctor.phone && <div><span className="font-medium">Phone:</span> {doctor.phone}</div>}
              {doctor.email && <div><span className="font-medium">Email:</span> {doctor.email}</div>}
            </div>
          </details>
        )}

        <details className="rounded-md border border-foreground/10" open>
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">
            Tests Selected ({tests.length})
          </summary>
          <div className="px-3 py-2 text-sm">
            <ul className="space-y-2">
              {tests.map((test) => (
                <li key={test.id} className="flex justify-between items-start border-b border-foreground/10 pb-2">
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-xs text-foreground/60">
                      {test.code} • {test.department}
                    </div>
                  </div>
                  <div className="font-semibold">₹{test.price}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-2 border-t border-foreground/20 flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </details>
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
          onClick={handleFinish}
          disabled={loading || success}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : success ? "Submitted ✓" : "Submit Order"}
        </button>
      </div>
    </div>
  );
}



