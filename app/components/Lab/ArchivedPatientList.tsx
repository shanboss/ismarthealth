"use client";

import { useState, useMemo, useEffect } from "react";
import { DocumentTextIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

type ArchivedPatient = {
  id: string;
  referralId: string;
  name: string;
  phoneNumber: string;
  doctor: string;
  referDate: string;
};

const samplePatients: ArchivedPatient[] = [
  {
    id: "1",
    referralId: "sa9824012901151",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "29-Jan-2024",
  },
  {
    id: "2",
    referralId: "sa9824012901150",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "29-Jan-2024",
  },
  {
    id: "3",
    referralId: "sa9823120601148",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "4",
    referralId: "aj7823120601147",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "5",
    referralId: "aj7823120601146",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "6",
    referralId: "sa9823120601145",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "7",
    referralId: "aj7823120601144",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "8",
    referralId: "su9923070501142",
    name: "Suresh",
    phoneNumber: "9987674646",
    doctor: "Madhavan",
    referDate: "05-Jul-2023",
  },
  {
    id: "9",
    referralId: "an9923063001139",
    name: "Anu",
    phoneNumber: "9987565765",
    doctor: "Madhavan",
    referDate: "30-Jun-2023",
  },
  {
    id: "10",
    referralId: "sa9823051001136",
    name: "Sakshi",
    phoneNumber: "9845762380",
    doctor: "Madhavan",
    referDate: "10-May-2023",
  },
  // Add more entries to reach 82 total
  ...Array.from({ length: 72 }, (_, i) => ({
    id: `${11 + i}`,
    referralId: `ref${1000 + i}`,
    name: ["Rahul", "Priya", "Amit", "Neha", "Raj"][i % 5],
    phoneNumber: `98765${10000 + i}`,
    doctor: "Madhavan",
    referDate: "15-Mar-2023",
  })),
];

type SortField = keyof ArchivedPatient;
type SortOrder = "asc" | "desc";

export default function ArchivedPatientList() {
  const [patients] = useState<ArchivedPatient[]>(samplePatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [lastVisit, setLastVisit] = useState<string>("");

  useEffect(() => {
    // Set the last visit timestamp
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setLastVisit(formatted);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleBilling = (patient: ArchivedPatient) => {
    console.log("View billing for:", patient);
    alert(`View billing for ${patient.name}`);
  };

  const handleReports = (patient: ArchivedPatient) => {
    console.log("View reports for:", patient);
    alert(`View reports for ${patient.name}`);
  };

  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];

    // Filter
    if (searchTerm) {
      result = result.filter(
        (patient) =>
          patient.referralId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phoneNumber.includes(searchTerm) ||
          patient.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.referDate.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [patients, searchTerm, sortField, sortOrder]);

  const totalEntries = filteredAndSortedPatients.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentPatients = filteredAndSortedPatients.slice(startIndex, endIndex);

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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first few, last, and current with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          <span className="font-bold">Archived Patient</span>{" "}
          <span className="font-normal">List</span>
        </h1>
      </div>

      <div className="h-1 bg-blue-500"></div>

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
                  onClick={() => handleSort("referralId")}
                >
                  Referral ID
                  <SortIcon field="referralId" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <SortIcon field="name" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("phoneNumber")}
                >
                  Phone Number
                  <SortIcon field="phoneNumber" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("doctor")}
                >
                  Doctor
                  <SortIcon field="doctor" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("referDate")}
                >
                  Refer Date
                  <SortIcon field="referDate" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Billing
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Reports
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-foreground/10 hover:bg-foreground/5"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {patient.referralId}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{patient.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {patient.phoneNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {patient.doctor}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {patient.referDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <button
                        type="button"
                        onClick={() => handleBilling(patient)}
                        className="text-blue-500 transition hover:text-blue-700"
                        title="View Billing"
                      >
                        <ClipboardDocumentListIcon className="h-6 w-6" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <button
                        type="button"
                        onClick={() => handleReports(patient)}
                        className="text-blue-500 transition hover:text-blue-700"
                        title="View Reports"
                      >
                        <DocumentTextIcon className="h-6 w-6" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-foreground/60"
                  >
                    No archived patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-foreground/10 p-4">
          <div className="mb-4 flex items-center justify-between">
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
              {renderPagination().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-sm text-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page as number)}
                    className={`rounded px-3 py-1 text-sm transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-foreground/20 bg-background text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
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

          <div className="text-sm text-foreground">
            Previous site visit: <span className="font-medium">{lastVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

