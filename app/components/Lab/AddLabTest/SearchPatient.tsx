"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";

type PatientQueueResult = {
  patientqueue_id: number;
  BillId: string;
  medical_num: string;
  firstname: string;
  mailid: string;
  phonenum: string;
  refer_date: Date;
  patient_unique_id: string;
  physician_id: number | null;
  phyfname: string | null;
  referred_id: number;
  ID: number;
  billing_id: number;
  laboratory_id: number;
  ref_type: string;
  lab_test_status: number;
  billing_status: number;
  is_sync: number;
  created_on: Date;
};

export default function SearchPatient({
  onNext,
}: {
  onNext: (payload: { phone: string; patient?: PatientQueueResult }) => void;
}) {
  const [phone, setPhone] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PatientQueueResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientQueueResult | null>(null);

  const handleSearch = async () => {
    if (!phone.trim()) {
      setError("Please enter a phone number");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    setSearchResults([]);
    setSelectedPatient(null);

    try {
      const response = await fetch(
        `/api/lab/patient-queue?search=${encodeURIComponent(
          phone.trim()
        )}&limit=10`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setSearchResults(data.data || []);
        if (data.data.length === 0) {
          setError("No patients found with this phone number");
        }
      } else {
        setError(data.error || "Failed to search patients");
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient: PatientQueueResult) => {
    setSelectedPatient(patient);
  };

  const handleNext = () => {
    if (selectedPatient) {
      onNext({ phone, patient: selectedPatient });
    } else {
      onNext({ phone });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Patient Information
      </h2>

      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Search Patient Information
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            placeholder="Search Patient by Phone Number..."
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
              if (!e.target.value.trim()) {
                setSearchResults([]);
                setHasSearched(false);
                setSelectedPatient(null);
              }
            }}
            onKeyPress={handleKeyPress}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Search Results */}
        {hasSearched && searchResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground/80">
              Found {searchResults.length} patient
              {searchResults.length !== 1 ? "s" : ""}
            </h3>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {searchResults.map((patient) => (
                <div
                  key={patient.patientqueue_id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`cursor-pointer rounded-lg border p-3 transition ${
                    selectedPatient?.patientqueue_id === patient.patientqueue_id
                      ? "border-red-600 bg-red-50 dark:bg-red-900/20"
                      : "border-foreground/20 bg-background hover:border-red-400 hover:bg-foreground/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                      <UserIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">
                          {patient.firstname}
                        </h4>
                        <span className="text-xs text-foreground/60">
                          Bill: {patient.BillId}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-foreground/70">
                        <div>
                          <span className="font-medium">Phone:</span>{" "}
                          {patient.phonenum}
                        </div>
                        <div>
                          <span className="font-medium">Medical #:</span>{" "}
                          {patient.medical_num}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span>{" "}
                          {patient.mailid || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Doctor:</span>{" "}
                          {patient.phyfname || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Refer Date:</span>{" "}
                          {new Date(patient.refer_date).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Patient ID:</span>{" "}
                          {patient.patient_unique_id}
                        </div>
                      </div>
                      {selectedPatient?.patientqueue_id ===
                        patient.patientqueue_id && (
                        <div className="mt-2 text-xs font-medium text-red-600">
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info message when no search has been performed yet */}
        {!hasSearched && !loading && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Enter a phone number and click Search to find existing patients
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-foreground/60">
          {selectedPatient ? (
            <span className="text-green-600 dark:text-green-400">
              ✓ Patient selected: {selectedPatient.firstname} - Will skip to
              doctor details
            </span>
          ) : (
            <span>
              No patient selected - You can proceed to add a new patient
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          {selectedPatient ? "Continue with Patient" : "Add New Patient"}
        </button>
      </div>
    </div>
  );
}
