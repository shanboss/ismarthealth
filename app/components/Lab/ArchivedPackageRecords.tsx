"use client";

import { useState, useMemo, useEffect } from "react";
import { DocumentTextIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { ArchivedPackage, samplePackages, SortField, SortOrder } from "../../config/lab/ArchivedPackageRecords";

const SortIcon = ({ field, sortField, sortOrder }: { field: SortField; sortField: SortField | null; sortOrder: SortOrder }) => {
    return (
      <span className="ml-2 inline-flex flex-col text-xs">
        <span
          className={`-mb-1 ${
            sortField === field && sortOrder === "asc"
              ? "text-gray-800"
              : "text-gray-300"
          }`}
        >
          ▲
        </span>
        <span
          className={
            sortField === field && sortOrder === "desc"
              ? "text-gray-800"
              : "text-gray-300"
          }
        >
          ▼
        </span>
      </span>
    );
};

export default function ArchivedPackageRecords() {
  const [packages] = useState<ArchivedPackage[]>(samplePackages);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [lastVisit] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleBilling = (pkg: ArchivedPackage) => {
    console.log("View billing for:", pkg);
    alert(`View billing for ${pkg.name}`);
  };

  const handleReports = (pkg: ArchivedPackage) => {
    console.log("View reports for:", pkg);
    alert(`View reports for ${pkg.name}`);
  };

  const filteredAndSortedPackages = useMemo(() => {
    let result = [...packages];

    // Filter
    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.referralId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.phoneNumber.includes(searchTerm) ||
          pkg.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.referDate.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [packages, searchTerm, sortField, sortOrder]);

  const totalEntries = filteredAndSortedPackages.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentPackages = filteredAndSortedPackages.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 p-1">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-xl rounded-2xl border border-blue-100/50 shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-18 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl shadow-lg flex items-center justify-center">
              <ArchiveBoxIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                Archived Package Records
              </h1>
              <h6 className="text-sm bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                Access historical package records and archives.
              </h6>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Total archived: <span className="font-bold text-violet-600">{totalEntries.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="search"
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm text-sm font-medium placeholder:text-gray-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-100/50 focus:outline-none shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300/80"
              placeholder="Search by referral ID, name, phone, doctor..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Table Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200/50 p-4 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Show</span>
            <select
              className="rounded-lg border-2 border-gray-200/60 bg-white/80 px-3 py-2 text-sm text-gray-900 font-medium focus:border-violet-400 focus:ring-2 focus:ring-violet-100/50 focus:outline-none transition-all duration-300"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700 font-medium">entries</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-200/90 to-gray-300/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b-2 border-gray-300">
              <tr className="divide-x divide-gray-300/50">
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("referralId")}
                >
                  <div className="flex items-center">
                    Referral ID
                    <SortIcon field="referralId" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("phoneNumber")}
                >
                  <div className="flex items-center">
                    Phone Number
                    <SortIcon field="phoneNumber" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("doctor")}
                >
                  <div className="flex items-center">
                    Doctor
                    <SortIcon field="doctor" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("referDate")}
                >
                  <div className="flex items-center">
                    Refer Date
                    <SortIcon field="referDate" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Billing
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Reports
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="transition-all duration-300 hover:shadow-md hover:shadow-violet-100/50 border border-transparent hover:border-gray-200/30 group bg-white/40 hover:bg-violet-50/80"
                  >
                    <td className="px-6 py-3.5 font-semibold text-sm text-gray-900 group-hover:text-gray-950">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-700 shadow-sm"></div>
                        {pkg.referralId}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-sm text-gray-900 group-hover:text-gray-950">
                      {pkg.name}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">{pkg.phoneNumber}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm">
                        {pkg.doctor}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">{pkg.referDate}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleBilling(pkg)}
                        title="View Billing"
                        className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-amber-400/90 to-orange-500/90 text-white shadow-md hover:shadow-lg hover:shadow-amber-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200/50 border border-amber-300/50 hover:border-amber-400/50"
                      >
                        <ClipboardDocumentListIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleReports(pkg)}
                        title="View Reports"
                        className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-violet-400/90 to-purple-600/90 text-white shadow-md hover:shadow-lg hover:shadow-violet-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-200/50 border border-violet-300/50 hover:border-violet-400/50"
                      >
                        <DocumentTextIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-12 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="max-w-sm space-y-1.5">
                        <h3 className="text-xl font-bold text-gray-900">
                          {searchTerm ? "No matching archived packages found" : "No archived packages available"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {searchTerm
                            ? `No archived packages match "${searchTerm}". Try different search terms.`
                            : "Archived package list is currently empty."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200/50 p-6 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">
              Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of{" "}
              <span className="font-bold text-violet-600">{totalEntries}</span> entries
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-violet-500 hover:to-purple-700 hover:text-white hover:border-violet-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 disabled:hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-violet-200/50"
              >
                <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md focus:ring-4 focus:ring-violet-200/50"
                        : "border-2 border-gray-200/60 bg-white/60 text-gray-700 hover:bg-gray-100/80 hover:border-gray-300/60 focus:ring-4 focus:ring-violet-200/50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-violet-500 hover:to-purple-700 hover:text-white hover:border-violet-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 disabled:hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-violet-200/50"
              >
                Next
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-700 font-medium">
            Previous site visit: <span className="text-violet-600 font-semibold">{lastVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}