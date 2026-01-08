"use client";

import { useMemo, useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

type Row = {
  referralId: string;
  name: string;
  phone: string;
  doctor: string;
  referDate: string;
};

const SAMPLE: Row[] = [
  { referralId: "2018110471", name: "Amith", phone: "9876545454", doctor: "Madhavan", referDate: "31-Oct-2025" },
  { referralId: "2018110470", name: "Vinayak", phone: "8147374491", doctor: "Anand", referDate: "27-Oct-2025" },
  { referralId: "2018110469", name: "Amith", phone: "9876545454", doctor: "Madhavan", referDate: "08-Oct-2025" },
  { referralId: "2018110460", name: "Prem", phone: "7645636353", doctor: "Madhavan", referDate: "04-Jul-2023" },
  { referralId: "2018110457", name: "veersh", phone: "876876878", doctor: "Madhavan", referDate: "08-May-2023" },
  { referralId: "2018110454", name: "Sakshi", phone: "9845762380", doctor: "Madhavan", referDate: "08-May-2023" },
  { referralId: "2018110451", name: "Vinayak", phone: "8147374491", doctor: "Madhavan", referDate: "29-Oct-2022" },
];

type SortKey = keyof Pick<Row, "referralId" | "name" | "phone" | "doctor" | "referDate">;

export default function ReportQueue() {
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("referDate");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const rows = q
      ? SAMPLE.filter((r) =>
          [r.referralId, r.name, r.phone, r.doctor, r.referDate]
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
      : SAMPLE;
    const sorted = [...rows].sort((a, b) => {
      const av = String(a[sortKey]).toLowerCase();
      const bv = String(b[sortKey]).toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [query, sortKey, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(startIndex, startIndex + pageSize);

  function updateSort(next: SortKey) {
    if (sortKey === next) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(next);
      setSortAsc(true);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <label className="text-sm text-foreground/80">Show</label>
          <select
            className="rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm text-foreground"
            value={pageSize}
            onChange={(e) => {
              const size = Number(e.target.value);
              setPageSize(size);
              setPage(1);
            }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-sm text-foreground/80">entries</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <label className="text-sm text-foreground/80">Search:</label>
          <input
            className="w-56 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            placeholder="Search patient, doctor, referral..."
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
              <Th label="Referral ID" onClick={() => updateSort("referralId")} active={sortKey === "referralId"} asc={sortAsc} />
              <Th label="Name" onClick={() => updateSort("name")} active={sortKey === "name"} asc={sortAsc} />
              <Th label="Phone Number" onClick={() => updateSort("phone")} active={sortKey === "phone"} asc={sortAsc} />
              <Th label="Doctor" onClick={() => updateSort("doctor")} active={sortKey === "doctor"} asc={sortAsc} />
              <Th label="Refer Date" onClick={() => updateSort("referDate")} active={sortKey === "referDate"} asc={sortAsc} />
              <th className="px-3 py-2">Tests/Reports</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.referralId} className="border-top border-foreground/5">
                <td className="px-3 py-2 text-foreground/90">{r.referralId}</td>
                <td className="px-3 py-2 text-foreground/90">{r.name}</td>
                <td className="px-3 py-2 text-foreground/90">{r.phone}</td>
                <td className="px-3 py-2 text-foreground/90">{r.doctor}</td>
                <td className="px-3 py-2 text-foreground/90">{r.referDate}</td>
                <td className="px-3 py-2">
                  <DocumentTextIcon className="h-5 w-5 text-foreground/60" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager
        page={currentPage}
        pageCount={pageCount}
        onPageChange={(n) => setPage(n)}
        startIndex={startIndex}
        viewed={pageRows.length}
        total={filtered.length}
      />
    </div>
  );
}

function Th({
  label,
  onClick,
  active,
  asc,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  asc: boolean;
}) {
  return (
    <th className="px-3 py-2">
      <button
        type="button"
        onClick={onClick}
        className={
          "inline-flex items-center gap-1 text-left " +
          (active ? "text-foreground" : "text-foreground/80")
        }
      >
        <span>{label}</span>
        {active ? <span className="text-xs">{asc ? "▲" : "▼"}</span> : null}
      </button>
    </th>
  );
}

function Pager({
  page,
  pageCount,
  onPageChange,
  startIndex,
  viewed,
  total,
}: {
  page: number;
  pageCount: number;
  onPageChange: (n: number) => void;
  startIndex: number;
  viewed: number;
  total: number;
}) {
  const nums = useMemo(() => {
    const arr: number[] = [];
    const max = pageCount;
    const start = Math.max(1, page - 2);
    const end = Math.min(max, start + 4);
    for (let i = Math.max(1, end - 4); i <= end; i++) arr.push(i);
    return arr;
  }, [page, pageCount]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <div className="text-foreground/70">
        Showing {viewed ? startIndex + 1 : 0} to{" "}
        {Math.min(startIndex + viewed, total)} of {total} entries
      </div>
      <div className="inline-flex items-center gap-1">
        <button
          className="rounded-md border border-foreground/20 px-2 py-1 text-foreground/80 transition hover:bg-foreground/5 disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        {nums[0] !== 1 ? (
          <>
            <button
              className={"min-w-8 rounded-md px-2 py-1 " + (page === 1 ? "bg-foreground text-background" : "border border-foreground/20")}
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {nums[0] > 2 ? <span className="px-1 text-foreground/60">…</span> : null}
          </>
        ) : null}
        {nums.map((n) => (
          <button
            key={n}
            className={
              "min-w-8 rounded-md px-2 py-1 " +
              (page === n ? "bg-foreground text-background" : "border border-foreground/20")
            }
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}
        {nums[nums.length - 1] !== pageCount ? (
          <>
            {nums[nums.length - 1] < pageCount - 1 ? (
              <span className="px-1 text-foreground/60">…</span>
            ) : null}
            <button
              className={
                "min-w-8 rounded-md px-2 py-1 " +
                (page === pageCount ? "bg-foreground text-background" : "border border-foreground/20")
              }
              onClick={() => onPageChange(pageCount)}
            >
              {pageCount}
            </button>
          </>
        ) : null}
        <button
          className="rounded-md border border-foreground/20 px-2 py-1 text-foreground/80 transition hover:bg-foreground/5 disabled:opacity-50"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
}



