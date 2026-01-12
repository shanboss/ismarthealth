"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentTextIcon,
  BeakerIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type PackageQueueData = {
  id: string;
  medical_num: string | null;
  package_id: string | null;
  lab_id: string | null;
  patient_id: string | null;
  dependent_id: string;
  doctor_id: string | null;
  referdate: string | null;
  created_by: string | null;
  created_on: string | null;
  package_status: string | null;
};

type PackageRow = {
  id: string;
  referralId: string;
  packageName: string;
  patientName: string;
  patientNumber: string;
  doctor: string;
  settled: boolean;
  referDate: string;
};

export default function PackageList() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [packages, setPackages] = useState<PackageQueueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch package queue data
  useEffect(() => {
    async function fetchPackages() {
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
          `/api/lab/package-queue?${params.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          setPackages(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchPackages();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, query]);

  // Convert PackageQueueData to PackageRow format for display
  const displayPackages: PackageRow[] = useMemo(() => {
    return packages.map((p) => ({
      id: p.id,
      referralId: p.medical_num || "N/A",
      packageName: p.package_id || "Package",
      patientName: p.patient_id || "Unknown",
      patientNumber: p.patient_id || "N/A",
      doctor: p.doctor_id || "—",
      settled: p.package_status === "completed" || p.package_status === "paid",
      referDate: p.referdate || "N/A",
    }));
  }, [packages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-foreground/60">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-foreground/70">
          Showing {displayPackages.length} of {pagination.totalCount} total
          packages
        </div>
        <div className="inline-flex items-center gap-2">
          <label className="text-sm text-foreground/80">Search:</label>
          <input
            className="w-56 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            placeholder="Search package, patient, doctor..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-foreground/10">
        <table className="min-w-full text-sm">
          <thead className="bg-foreground/5">
            <tr className="text-left text-foreground">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Medical #</th>
              <th className="px-3 py-2">Package ID</th>
              <th className="px-3 py-2">Patient ID</th>
              <th className="px-3 py-2">Doctor ID</th>
              <th className="px-3 py-2">Refer Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Billing</th>
              <th className="px-3 py-2">Samples</th>
              <th className="px-3 py-2">Reports</th>
            </tr>
          </thead>
          <tbody>
            {displayPackages.map((r) => {
              const bg = r.settled
                ? "bg-emerald-50 dark:bg-emerald-900/20"
                : "bg-red-50 dark:bg-red-900/20";
              return (
                <tr key={r.id} className={bg + " border-t border-foreground/5"}>
                  <td className="px-3 py-2 text-foreground/90">{r.id}</td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.referralId}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.packageName}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.patientName}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">{r.doctor}</td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.referDate}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                        r.settled
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      {r.settled ? "Settled" : "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Billing"
                      onClick={() => router.push(`/lab/package-bill/${r.id}`)}
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <CreditCardIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Samples"
                      onClick={() =>
                        router.push(`/lab/package-samples/${r.id}`)
                      }
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <BeakerIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Reports"
                      onClick={() =>
                        router.push(`/lab/package-reports/${r.id}`)
                      }
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {displayPackages.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-foreground/60"
                  colSpan={10}
                >
                  {query ? "No matching packages" : "No packages in queue"}
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
