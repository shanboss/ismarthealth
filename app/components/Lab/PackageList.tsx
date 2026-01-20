"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentTextIcon,
  BeakerIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import { PackageQueueData, PackageRow }  from "../../config/lab/PackageList";


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
      <div className="min-h-[400px] flex flex-col items-center justify-center py-12 px-6">
        <div className="w-12 h-12 border-4 border-purple-200/50 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <div className="text-base font-semibold text-gray-700 mb-1">Loading packages...</div>
        <div className="text-xs text-gray-500">Fetching latest package queue</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-2xl border border-purple-100/50 shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex items-center justify-center">
              <ShoppingBagIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-purple-900 bg-clip-text text-transparent">
                Package Queue
              </h1>
              <h6 className="text-sm bg-gradient-to-r from-gray-900 via-gray-800 to-purple-900 bg-clip-text text-transparent">
                 View and manage package queue
              </h6>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Showing <span className="font-bold text-purple-600">{displayPackages.length}</span> of{' '}
                <span className="font-bold text-pink-600">{pagination.totalCount.toLocaleString()}</span> total packages
              </p>
            </div>
          </div>
          
          {/* Enhanced Search */}
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm text-sm font-medium placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-100/50 focus:outline-none shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300/80"
              placeholder="Search by package, patient, doctor..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Table Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-200/90 to-gray-300/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b-2 border-gray-300">
              <tr className="divide-x divide-gray-300/50">
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Medical #
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Package
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Refer Date
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Billing
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Samples
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Reports
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {displayPackages.map((r, index) => {
                const bg = r.settled
                  ? "hover:bg-emerald-50/80 bg-emerald-50/60"
                  : "hover:bg-red-50/80 bg-red-50/60";
                
                return (
                  <tr
                    key={r.id}
                    className={`transition-all duration-300 hover:shadow-md hover:shadow-emerald-100/50 border border-transparent hover:border-gray-200/30 group ${bg}`}
                  >
                    <td className="px-6 py-3.5 font-semibold text-sm text-gray-900 group-hover:text-gray-950">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-sm"></div>
                        {r.id}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-sm text-gray-900 group-hover:text-gray-950">
                      {r.referralId}
                    </td>
                    <td className="px-6 py-3.5 text-gray-700 text-sm font-medium">{r.packageName}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 shadow-sm">
                        {r.patientName}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-700 text-sm font-medium">{r.doctor}</td>
                    <td className="px-6 py-3.5 text-gray-700 text-sm font-medium">{r.referDate}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                        r.settled
                          ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800"
                          : "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800"
                      }`}>
                        {r.settled ? "Settled" : "Pending"}
                      </span>
                    </td>
                    
                    {/* Action Buttons */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        title="Billing"
                        onClick={() => router.push(`/lab/package-bill/${r.id}`)}
                        className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-orange-400/90 to-orange-500/90 text-white shadow-md hover:shadow-lg hover:shadow-orange-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-200/50 border border-orange-300/50 hover:border-orange-400/50"
                      >
                        <CreditCardIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        title="Samples"
                        onClick={() => router.push(`/lab/package-samples/${r.id}`)}
                        className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-400/90 to-teal-500/90 text-white shadow-md hover:shadow-lg hover:shadow-emerald-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200/50 border border-emerald-300/50 hover:border-emerald-400/50"
                      >
                        <BeakerIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        title="Reports"
                        onClick={() => router.push(`/lab/package-reports/${r.id}`)}
                        className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-blue-400/90 to-indigo-500/90 text-white shadow-md hover:shadow-lg hover:shadow-blue-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200/50 border border-blue-300/50 hover:border-blue-400/50"
                      >
                        <DocumentTextIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {displayPackages.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-12 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="max-w-sm space-y-1.5">
                        <h3 className="text-xl font-bold text-gray-900">
                          {query ? "No matching packages found" : "No packages in queue"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {query 
                            ? `No packages match "${query}". Try different search terms.` 
                            : "Package queue is currently empty. Check back later."
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {displayPackages.length > 0 && (
        <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 disabled:hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-200/50"
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            Previous
          </button>

          <div className="px-6 py-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-md font-semibold text-base text-gray-900 min-w-[140px] text-center">
            Page <span className="text-purple-600 font-bold text-lg">{pagination.page}</span> of{' '}
            <span className="text-pink-600 font-bold text-lg">{pagination.totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={!pagination.hasNext}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 disabled:hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-200/50"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
}
