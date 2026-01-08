"use client";

import { useState, useMemo, useEffect } from "react";
import { DocumentTextIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

type ArchivedPackage = {
  id: string;
  referralId: string;
  name: string;
  phoneNumber: string;
  doctor: string;
  referDate: string;
};

const samplePackages: ArchivedPackage[] = [
  {
    id: "1",
    referralId: "p_te8219111201081",
    name: "Test",
    phoneNumber: "8217050141",
    doctor: "Madhavan",
    referDate: "12-Nov-2019",
  },
  {
    id: "2",
    referralId: "p_aj781906250177",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "",
    referDate: "25-Jun-2019",
  },
  {
    id: "3",
    referralId: "p_su881905220962",
    name: "Sujay",
    phoneNumber: "8888888881",
    doctor: "Madhavan",
    referDate: "22-May-2019",
  },
  {
    id: "4",
    referralId: "p_vi991905220949",
    name: "Vijaya",
    phoneNumber: "9901855824",
    doctor: "Madhavan",
    referDate: "22-May-2019",
  },
  {
    id: "5",
    referralId: "p_mo981905160941",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "",
    referDate: "16-May-2019",
  },
  {
    id: "6",
    referralId: "p_mo981905150932",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "Chandan",
    referDate: "15-May-2019",
  },
  {
    id: "7",
    referralId: "p_mo981905150931",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "Madhavan",
    referDate: "15-May-2019",
  },
  {
    id: "8",
    referralId: "p_mo981905150920",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "",
    referDate: "15-May-2019",
  },
  {
    id: "9",
    referralId: "p_mo981905150917",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "",
    referDate: "15-May-2019",
  },
  {
    id: "10",
    referralId: "p_mo981905150916",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "Madhavan",
    referDate: "15-May-2019",
  },
  {
    id: "11",
    referralId: "p_ra981905140915",
    name: "Rahul",
    phoneNumber: "9876543210",
    doctor: "Madhavan",
    referDate: "14-May-2019",
  },
];

type SortField = keyof ArchivedPackage;
type SortOrder = "asc" | "desc";

export default function ArchivedPackageRecords() {
  const [packages] = useState<ArchivedPackage[]>(samplePackages);
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
          <span className="font-bold">Archived Package</span>{" "}
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
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="border-b border-foreground/10 hover:bg-foreground/5"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {pkg.referralId}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{pkg.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {pkg.phoneNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {pkg.doctor}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {pkg.referDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <button
                        type="button"
                        onClick={() => handleBilling(pkg)}
                        className="text-blue-500 transition hover:text-blue-700"
                        title="View Billing"
                      >
                        <ClipboardDocumentListIcon className="h-6 w-6" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <button
                        type="button"
                        onClick={() => handleReports(pkg)}
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
                    No archived packages found
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

          <div className="text-sm text-foreground">
            Previous site visit: <span className="font-medium">{lastVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

