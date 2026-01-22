"use client";

import { useState, useMemo } from "react";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import { Doctor, sampleDoctors, SortField, SortOrder } from "../../config/lab/LabDoctors";

const SortIcon = ({ field, sortField, sortOrder }: { 
  field: SortField; 
  sortField: SortField | null; 
  sortOrder: SortOrder 
}) => {
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

export default function LabDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
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

  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...doctors];

    // Filter
    if (searchTerm) {
      result = result.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.phoneNo.includes(searchTerm) ||
          doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField] as string;
        const bVal = b[sortField] as string;
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [doctors, searchTerm, sortField, sortOrder]);

  const totalEntries = filteredAndSortedDoctors.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentDoctors = filteredAndSortedDoctors.slice(startIndex, endIndex);

  // Helper to generate page numbers with ellipsis
  const generatePageNumbers = (current: number, total: number): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // you can change this (5, 9, etc.)

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

  const handleEdit = (doctor: Doctor) => {
    console.log("Edit doctor:", doctor);
    alert(`Edit doctor: ${doctor.name}`);
  };

  const handleDelete = (doctorId: string) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      setDoctors(doctors.filter((d) => d.id !== doctorId));
    }
  };

  const handleAddDoctor = () => {
    console.log("Add new doctor");
    alert("Add Doctor functionality - to be implemented");
  };

  return (
    <div className="space-y-6 p-1">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-xl rounded-2xl border border-blue-100/50 shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-18 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                Laboratory Doctors
              </h1>
              <h6 className="text-sm bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                Manage medical professionals in your laboratory.
              </h6>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Total doctors: <span className="font-bold text-emerald-600">{totalEntries.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Add Doctor Button */}
          <button
            type="button"
            onClick={handleAddDoctor}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200/50 border border-emerald-400/50 hover:border-emerald-500/50"
          >
            + Add Doctor
          </button>
        </div>

        {/* Enhanced Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="search"
            type="text"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200/60 bg-white/80 backdrop-blur-sm text-sm font-medium placeholder:text-gray-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100/50 focus:outline-none shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300/80"
            placeholder="Search by doctor name, department, phone, or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Enhanced Table Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200/50 p-4 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Show</span>
            <select
              className="rounded-lg border-2 border-gray-200/60 bg-white/80 px-3 py-2 text-sm text-gray-900 font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100/50 focus:outline-none transition-all duration-300"
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
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Doctor Name
                    <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex items-center">
                    Department
                    <SortIcon field="department" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("phoneNo")}
                >
                  <div className="flex items-center">
                    Phone No
                    <SortIcon field="phoneNo" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-800 tracking-wide text-xs uppercase hover:bg-gray-300/50 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon field="email" sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-800 tracking-wide text-xs uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="transition-all duration-300 hover:shadow-md hover:shadow-emerald-100/50 border border-transparent hover:border-gray-200/30 group bg-white/40 hover:bg-emerald-50/80"
                  >
                    <td className="px-6 py-3.5 font-semibold text-sm text-gray-900 group-hover:text-gray-950">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm"></div>
                        {doctor.name}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm">
                        {doctor.department}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-900 font-medium">{doctor.phoneNo}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-700">{doctor.email}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(doctor)}
                          title="Edit"
                          className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-blue-400/90 to-indigo-500/90 text-white shadow-md hover:shadow-lg hover:shadow-blue-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200/50 border border-blue-300/50 hover:border-blue-400/50"
                        >
                          <PencilIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doctor.id)}
                          title="Delete"
                          className="group/btn relative p-2.5 rounded-xl bg-gradient-to-br from-red-400/90 to-pink-500/90 text-white shadow-md hover:shadow-lg hover:shadow-red-400/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200/50 border border-red-300/50 hover:border-red-400/50"
                        >
                          <TrashIcon className="h-4 w-4 drop-shadow-sm group-hover/btn:rotate-12" />
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm scale-110" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-12 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="max-w-sm space-y-1.5">
                        <h3 className="text-xl font-bold text-gray-900">
                          {searchTerm ? "No matching doctors found" : "No doctors available"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {searchTerm
                            ? `No doctors match "${searchTerm}". Try different search terms.`
                            : "Doctor list is currently empty. Add a new doctor to get started."}
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
      {currentDoctors.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
          {/* Previous */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:border-emerald-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-emerald-200/50 min-w-[110px] justify-center"
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {generatePageNumbers(currentPage, totalPages).map((pageItem, idx) => {
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

              const isCurrent = currentPage === pageItem;

              return (
                <button
                  key={pageItem}
                  onClick={() => setCurrentPage(Number(pageItem))}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium text-sm min-w-[40px] text-center transition-all duration-200
                    ${
                      isCurrent
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-400/40 scale-105"
                        : "bg-white/70 border border-gray-300/70 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm"
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300/50 text-gray-700 font-semibold text-sm shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:border-emerald-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-emerald-200/50 min-w-[110px] justify-center"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
}