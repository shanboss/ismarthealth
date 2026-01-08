"use client";

import { useState, useMemo } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

type Doctor = {
  id: string;
  name: string;
  department: string;
  phoneNo: string;
  email: string;
};

const sampleDoctors: Doctor[] = [
  {
    id: "1",
    name: "LabInvestigation Doc1",
    department: "LAB INVESTIGATION",
    phoneNo: "4646546464",
    email: "LabInvestigationdoc1@inetframe.com",
  },
  {
    id: "2",
    name: "Ultrasound Doc1",
    department: "ULTRASOUND/SONOGRAPHY",
    phoneNo: "4646546464",
    email: "Ultrasounddoc1@inetframe.com",
  },
  {
    id: "3",
    name: "Ajit Kumar",
    department: "MRI",
    phoneNo: "4646546423",
    email: "xraydoc1@inetframe.com",
  },
  {
    id: "4",
    name: "Vijay Sarnobat",
    department: "LAB INVESTIGATION",
    phoneNo: "4646546465",
    email: "LabInvestigationdoc2@inetframe.com",
  },
  {
    id: "5",
    name: "Sudrashan N",
    department: "ECHO/TMT",
    phoneNo: "9620864852",
    email: "info.info@inetlab.com",
  },
];

type SortField = keyof Doctor;
type SortOrder = "asc" | "desc";

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
        const aVal = a[sortField];
        const bVal = b[sortField];
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

  const SortIcon = ({ field }: { field: SortField }) => {
    return (
      <span className="ml-1 inline-flex flex-col text-xs">
        <span
          className={`-mb-1 ${
            sortField === field && sortOrder === "asc"
              ? "text-foreground"
              : "text-foreground/30"
          }`}
        >
          ▲
        </span>
        <span
          className={
            sortField === field && sortOrder === "desc"
              ? "text-foreground"
              : "text-foreground/30"
          }
        >
          ▼
        </span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          <span className="font-bold">Laboratory</span>{" "}
          <span className="font-normal">Doctors</span>
        </h1>
      </div>

      <div className="h-1 bg-blue-500"></div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddDoctor}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          Add Doctor
        </button>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="flex items-center justify-between border-b border-foreground/10 p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">Show</span>
            <select
              className="rounded border border-foreground/20 bg-background px-2 py-1 text-sm text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
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
            <span className="text-sm text-foreground">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="search" className="text-sm text-foreground">
              Search:
            </label>
            <input
              id="search"
              type="text"
              className="rounded border border-foreground/20 bg-background px-3 py-1 text-sm text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/5">
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("name")}
                >
                  Doctor Name
                  <SortIcon field="name" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("department")}
                >
                  Department
                  <SortIcon field="department" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("phoneNo")}
                >
                  Phone No
                  <SortIcon field="phoneNo" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("email")}
                >
                  Email
                  <SortIcon field="email" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("id")}
                >
                  Action
                  <SortIcon field="id" />
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b border-foreground/10 hover:bg-foreground/5"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{doctor.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {doctor.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {doctor.phoneNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{doctor.email}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(doctor)}
                          className="rounded bg-green-600 p-2 text-white transition hover:opacity-90"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doctor.id)}
                          className="rounded bg-red-500 p-2 text-white transition hover:opacity-90"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-foreground/60"
                  >
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-foreground/10 p-4">
          <div className="text-sm text-foreground">
            Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of{" "}
            {totalEntries} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded border border-foreground/20 bg-background px-3 py-1 text-sm text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 text-sm transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-foreground/20 bg-background text-foreground hover:bg-foreground/5"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded border border-foreground/20 bg-background px-3 py-1 text-sm text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

