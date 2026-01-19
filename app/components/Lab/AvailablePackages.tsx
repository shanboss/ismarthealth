"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

import { Package, samplePackages, SortField, SortOrder } from "../../config/lab/AvailablePackages";

// Move SortIcon outside the main component
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

export default function AvailablePackages() {
  const [packages, setPackages] = useState<Package[]>(samplePackages);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleToggleSelection = (packageId: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === packageId ? { ...pkg, selected: !pkg.selected } : pkg
      )
    );
  };

  const filteredAndSortedPackages = useMemo(() => {
    let result = [...packages];

    // Filter
    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.testCount.toString().includes(searchTerm)
      );
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let aVal: string | number | boolean = a[sortField] as string | number | boolean;
        let bVal: string | number | boolean = b[sortField] as string | number | boolean;

        // Handle numeric sorting for id
        if (sortField === "id") {
          aVal = parseInt(aVal.toString());
          bVal = parseInt(bVal.toString());
        }

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
            <div className="w-16 h-18 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                Available Packages
              </h1>
              <h6 className="text-sm bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                Discover and select lab test packages.
              </h6>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Showing <span className="font-bold text-purple-600">{currentPackages.length}</span> of{' '}
                <span className="font-bold text-pink-600">{totalEntries.toLocaleString()}</span> available packages
              </p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm text-sm font-medium placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-100/50 focus:outline-none shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300/80"
              placeholder="Search by package name..."
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-200/90 to-gray-300/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b-2 border-gray-300">
              <tr className="divide-x divide-gray-300/50">
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors group"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    S No
                    <SortIcon field="id" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors group"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Package Name
                    <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors group"
                  onClick={() => handleSort("testCount")}
                >
                  <div className="flex items-center">
                    No. of Tests
                    <SortIcon field="testCount" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100/50">
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className="transition-all duration-300 hover:shadow-md hover:shadow-purple-100/50 border border-transparent hover:border-gray-200/30 group bg-white/40 hover:bg-purple-50/80"
                  >
                    <td className="px-6 py-3.5 font-semibold text-sm text-gray-900 group-hover:text-gray-950">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-sm"></div>
                        {startIndex + index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-sm text-gray-900 group-hover:text-gray-950">
                      {pkg.name}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm">
                        {pkg.testCount} tests
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSelection(pkg.id)}
                        className={`group/btn relative px-4 py-2 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 border ${
                          pkg.selected
                            ? "bg-gradient-to-br from-purple-400/90 to-pink-500/90 hover:shadow-purple-400/30 focus:ring-purple-200/50 border-purple-300/50 hover:border-purple-400/50"
                            : "bg-gradient-to-br from-gray-400/90 to-gray-500/90 hover:shadow-gray-400/30 focus:ring-gray-200/50 border-gray-300/50 hover:border-gray-400/50"
                        }`}
                      >
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110"
                          style={{
                            background: pkg.selected
                              ? "linear-gradient(to bottom right, rgb(192, 132, 250), rgb(236, 72, 153))"
                              : "linear-gradient(to bottom right, rgb(107, 114, 128), rgb(55, 65, 81))"
                          }}
                        />
                        {pkg.selected ? "Selected" : "Select"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-12 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="max-w-sm space-y-1.5">
                        <h3 className="text-xl font-bold text-gray-900">
                          {searchTerm ? "No matching packages found" : "No packages available"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {searchTerm
                            ? `No packages match "${searchTerm}". Try different search terms.`
                            : "Package list is currently empty."}
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
      {currentPackages.length > 0 && (
        <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 disabled:hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-200/50"
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            Previous
          </button>

          <div className="px-6 py-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-md font-semibold text-base text-gray-900 min-w-[140px] text-center">
            Page <span className="text-purple-600 font-bold text-lg">{currentPage}</span> of{' '}
            <span className="text-pink-600 font-bold text-lg">{totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
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