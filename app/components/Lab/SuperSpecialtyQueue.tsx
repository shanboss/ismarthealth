"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Row, DisplayRow } from "../../config/lab/SuperSpecialityQueue";

export default function SuperSpecialtyQueue() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [consultations, setConsultations] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch superspecialty consultation data
  useEffect(() => {
    async function fetchConsultations() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        if (query.trim()) {
          params.append("search", query.trim());
        }

        const response = await fetch(`/api/lab/superspecialty-queue?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setConsultations(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchConsultations();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, query]);

  // Convert Row to DisplayRow format
  const displayRows: DisplayRow[] = useMemo(() => {
    return consultations.map((c) => ({
      ss_id: c.ss_id,
      referralId: c.referralId,
      name: c.name,
      age: c.age,
      mobile: c.mobile,
      email: c.email,
      referredDate: new Date(c.referdate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));
  }, [consultations]);

  // Helper to generate page numbers with ellipsis
  const generatePageNumbers = (current: number, total: number): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // adjust if you want more/fewer visible pages

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("...");
    }

    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-12 px-6">
        <div className="w-12 h-12 border-4 border-indigo-200/50 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <div className="text-base font-semibold text-gray-700 mb-1">Loading consultations...</div>
        <div className="text-xs text-gray-500">Fetching superspecialty queue</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-xl rounded-2xl border border-indigo-100/50 shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-18 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 bg-clip-text text-transparent">
                Super Speciality Consultation
              </h1>
              <h6 className="text-sm bg-gradient-to-r from-gray-900 via-gray-800 to-purple-900 bg-clip-text text-transparent">
                View and manage super speciality consultations.
              </h6>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Showing <span className="font-bold text-indigo-600">{displayRows.length}</span> of{" "}
                <span className="font-bold text-blue-600">{pagination.totalCount.toLocaleString()}</span> total consultations
              </p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm text-sm font-medium placeholder:text-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100/50 focus:outline-none shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300/80"
              placeholder="Search by name, mobile, referral ID..."
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
                  Referral ID
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Age
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Referred Date
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Billing
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {displayRows.map((r, index) => (
                <tr
                  key={r.referralId}
                  className="transition-all duration-300 hover:shadow-md hover:shadow-indigo-100/50 border border-transparent hover:border-gray-200/30 group hover:bg-gray-50/50"
                >
                  <td className="px-6 py-3.5 font-semibold text-sm text-gray-900 group-hover:text-gray-950">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-sm"></div>
                      {r.referralId}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-medium text-sm text-gray-900 group-hover:text-gray-950">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-indigo-700">{r.name.charAt(0).toUpperCase()}</span>
                      </div>
                      {r.name}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-700 text-sm font-medium">{r.age}</td>
                  <td className="px-6 py-3.5 text-gray-700 text-sm font-medium">{r.mobile}</td>
                  <td className="px-6 py-3.5 text-gray-600 text-sm">{r.email}</td>
                  <td className="px-6 py-3.5 text-gray-700 text-sm font-medium">{r.referredDate}</td>

                  {/* Action Button */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      title="Billing"
                      onClick={() => router.push(`/lab/superspecialty-bill/${r.referralId}`)}
                      className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-orange-400/90 to-orange-500/90 text-white shadow-md hover:shadow-lg hover:shadow-orange-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-200/50 border border-orange-300/50 hover:border-orange-400/50"
                    >
                      <CreditCardIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                    </button>
                  </td>
                </tr>
              ))}

              {displayRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-12 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="max-w-sm space-y-1.5">
                        <h3 className="text-xl font-bold text-gray-900">
                          {query ? "No matching consultations found" : "No consultations in queue"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {query
                            ? `No consultations match "${query}". Try different search terms.`
                            : "Superspecialty queue is currently empty. Check back later."}
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

      {/* Enhanced Pagination with page numbers */}
      {displayRows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
          {/* Previous */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev || pagination.page === 1}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-blue-600 hover:text-white hover:border-indigo-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-200/50 min-w-[110px] justify-center"
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {generatePageNumbers(pagination.page, pagination.totalPages).map((pageItem, idx) => {
              if (pageItem === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-3 py-2 text-gray-500 font-medium select-none"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = pagination.page === pageItem;

              return (
                <button
                  key={pageItem}
                  onClick={() => setPage(Number(pageItem))}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium text-sm min-w-[40px] text-center transition-all duration-200
                    ${
                      isCurrent
                        ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-400/40 scale-105"
                        : "bg-white/70 border border-gray-300/70 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-sm"
                    }
                  `}
                >
                  {pageItem}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={!pagination.hasNext || pagination.page === pagination.totalPages}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-blue-600 hover:text-white hover:border-indigo-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-200/50 min-w-[110px] justify-center"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
}