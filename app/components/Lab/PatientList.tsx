"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentTextIcon,
  PencilSquareIcon,
  BeakerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type PatientQueue = {
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

type Patient = {
  billNo: string;
  name: string;
  phoneNumber: string;
  doctor: string;
  referDate: string;
  settled: boolean;
};

export default function PatientList() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [patients, setPatients] = useState<PatientQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch patient queue data
  useEffect(() => {
    async function fetchPatients() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        if (query.trim()) {
          params.append("search", query.trim());
        }

        const response = await fetch(
          `/api/lab/patient-queue?${params.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          setPatients(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, query]);

  // Convert PatientQueue to Patient format for display
  const displayPatients: Patient[] = useMemo(() => {
    return patients.map((p) => ({
      billNo: p.BillId,
      name: p.firstname,
      phoneNumber: p.phonenum,
      doctor: p.phyfname || "N/A",
      referDate: new Date(p.refer_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      settled: p.billing_status === 1, // Adjust based on your business logic
    }));
  }, [patients]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-foreground/60">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-foreground/70">
          Showing {displayPatients.length} of {pagination.totalCount} total
          patients
        </div>
        <div className="inline-flex items-center gap-2">
          <label className="text-sm text-foreground/80">Search:</label>
          <input
            className="w-56 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            placeholder="Search patient, doctor, bill..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-foreground/10">
        <table className="min-w-full text-sm">
          <thead className="bg-foreground/5">
            <tr className="text-left text-foreground">
              <th className="px-3 py-2">Bill #</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone Number</th>
              <th className="px-3 py-2">Doctor</th>
              <th className="px-3 py-2">Refer Date</th>
              <th className="px-3 py-2">Billing</th>
              <th className="px-3 py-2">Samples</th>
              <th className="px-3 py-2">Reports</th>
            </tr>
          </thead>
          <tbody>
            {displayPatients.map((p) => {
              const bg = p.settled
                ? "bg-emerald-50 dark:bg-emerald-900/20"
                : "bg-red-50 dark:bg-red-900/20";
              return (
                <tr
                  key={p.billNo}
                  className={bg + " border-t border-foreground/5"}
                >
                  <td className="px-3 py-2 text-foreground/90">{p.billNo}</td>
                  <td className="px-3 py-2 text-foreground/90">{p.name}</td>
                  <td className="px-3 py-2 text-foreground/90">
                    {p.phoneNumber}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">{p.doctor}</td>
                  <td className="px-3 py-2 text-foreground/90">
                    {p.referDate}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Billing"
                      onClick={() => router.push(`/lab/bill/${p.billNo}`)}
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Samples"
                      onClick={() => router.push(`/lab/samples/${p.billNo}`)}
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <BeakerIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Reports"
                      onClick={() => router.push(`/lab/reports/${p.billNo}`)}
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {displayPatients.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-foreground/60"
                  colSpan={8}
                >
                  {query ? "No matching patients" : "No patients in queue"}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!pagination.hasPrev}
          className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Previous
        </button>

        <div className="rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground">
          Page {pagination.page} of {pagination.totalPages}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
          disabled={!pagination.hasNext}
          className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
