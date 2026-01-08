"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCardIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Row = {
  ss_id: number;
  referralId: string;
  name: string;
  age: string;
  mobile: string;
  email: string;
  referdate: Date;
  totalAmount: number | null;
  status: number;
};

type DisplayRow = {
  ss_id: number;
  referralId: string;
  name: string;
  age: string;
  mobile: string;
  email: string;
  referredDate: string;
};


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

    // Debounce search to avoid too many API calls
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-foreground/60">Loading consultations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-foreground/70">
          Showing {displayRows.length} of {pagination.totalCount} total consultations
        </div>
        <div className="inline-flex items-center gap-2">
          <label className="text-sm text-foreground/80">Search:</label>
          <input
            className="w-56 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            placeholder="Search ID, name, mobile..."
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
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Mobile</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Referred Date</th>
              <th className="px-3 py-2">Billing</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((r) => (
              <tr key={r.referralId} className="border-t border-foreground/5">
                <td className="px-3 py-2 text-foreground/90">{r.name}</td>
                <td className="px-3 py-2 text-foreground/90">{r.age}</td>
                <td className="px-3 py-2 text-foreground/90">{r.mobile}</td>
                <td className="px-3 py-2 text-foreground/90">{r.email}</td>
                <td className="px-3 py-2 text-foreground/90">
                  {r.referredDate}
                </td>
                <td className="px-3 py-2">
                  <button
                    title="Billing"
                    onClick={() =>
                      router.push(`/lab/superspecialty-bill/${r.referralId}`)
                    }
                    className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                  >
                    <CreditCardIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {displayRows.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-foreground/60"
                  colSpan={6}
                >
                  {query ? "No matching consultations" : "No consultations found"}
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

