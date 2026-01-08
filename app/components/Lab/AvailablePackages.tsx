"use client";

import { useState, useMemo } from "react";

type Package = {
  id: string;
  name: string;
  testCount: number;
  selected: boolean;
};

const samplePackages: Package[] = [
  {
    id: "1",
    name: "Packagenew",
    testCount: 13,
    selected: true,
  },
  {
    id: "2",
    name: "Package 5",
    testCount: 19,
    selected: true,
  },
  {
    id: "3",
    name: "Package3",
    testCount: 5,
    selected: true,
  },
  {
    id: "4",
    name: "Thyroid Package",
    testCount: 7,
    selected: true,
  },
  {
    id: "5",
    name: "Package1",
    testCount: 5,
    selected: true,
  },
  {
    id: "6",
    name: "Diabetes Package",
    testCount: 8,
    selected: false,
  },
  {
    id: "7",
    name: "Cardiac Package",
    testCount: 12,
    selected: false,
  },
];

type SortField = "id" | "name" | "testCount" | "selected";
type SortOrder = "asc" | "desc";

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
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        // Handle numeric sorting for id
        if (sortField === "id") {
          aVal = parseInt(aVal);
          bVal = parseInt(bVal);
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
          <span className="font-bold">Available</span>{" "}
          <span className="font-normal">Packages</span>
        </h1>
      </div>

      <div className="h-1 bg-blue-500"></div>

      <div className="rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="flex items-center justify-end border-b border-foreground/10 p-4">
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
                  onClick={() => handleSort("id")}
                >
                  S No
                  <SortIcon field="id" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("name")}
                >
                  Package name
                  <SortIcon field="name" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("testCount")}
                >
                  No of test contains packages
                  <SortIcon field="testCount" />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-foreground"
                  onClick={() => handleSort("selected")}
                >
                  Select This Package
                  <SortIcon field="selected" />
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className="border-b border-foreground/10 hover:bg-foreground/5"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{pkg.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {pkg.testCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <button
                        type="button"
                        onClick={() => handleToggleSelection(pkg.id)}
                        className={`rounded px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 ${
                          pkg.selected ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        {pkg.selected ? "Selected" : "Select"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-foreground/60"
                  >
                    No packages found
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

