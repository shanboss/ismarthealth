"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentTextIcon,
  BeakerIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

type PackageRow = {
  id: string;
  referralId: string;
  packageName: string;
  patientName: string;
  patientNumber: string;
  doctor: string;
  settled: boolean;
};

const SAMPLE_PACKAGES: PackageRow[] = [
  {
    id: "p_sa9819122701104",
    referralId: "madsak632",
    packageName: "Packagenew",
    patientName: "Sakshi",
    patientNumber: "9845762380",
    doctor: "Madhavan",
    settled: true,
  },
  {
    id: "p_sh841912170190",
    referralId: "595shsrhw121",
    packageName: "Packagenew",
    patientName: "shweta",
    patientNumber: "8497006622",
    doctor: "—",
    settled: false,
  },
  {
    id: "p_sh8419121601096",
    referralId: "amishr595",
    packageName: "Packagenew",
    patientName: "Shruti",
    patientNumber: "8497006622",
    doctor: "Madhavan",
    settled: true,
  },
  {
    id: "p_te821911160188",
    referralId: "tes615",
    packageName: "Package 5",
    patientName: "Test",
    patientNumber: "8217050141",
    doctor: "—",
    settled: true,
  },
  {
    id: "p_aj781908130185",
    referralId: "1madniu114",
    packageName: "Package 4",
    patientName: "niu",
    patientNumber: "7892044648",
    doctor: "—",
    settled: false,
  },
  {
    id: "p_aj781907300184",
    referralId: "1madpaw104",
    packageName: "Package 4",
    patientName: "Pawani",
    patientNumber: "7892044648",
    doctor: "—",
    settled: false,
  },
  {
    id: "p_ab141907300183",
    referralId: "abc591",
    packageName: "Package3",
    patientName: "abc",
    patientNumber: "1432432142",
    doctor: "—",
    settled: false,
  },
  {
    id: "p_sa771907040181",
    referralId: "san578",
    packageName: "Package1",
    patientName: "saniha",
    patientNumber: "7788996665",
    doctor: "—",
    settled: false,
  },
  {
    id: "p_pr7419070401030",
    referralId: "568madpra102",
    packageName: "Package3",
    patientName: "Prateeksha",
    patientNumber: "7423111122",
    doctor: "Madhavan",
    settled: true,
  },
  {
    id: "p_su851906270179",
    referralId: "sun575",
    packageName: "Thyroid Package",
    patientName: "Sundar Pillai",
    patientNumber: "8533212131",
    doctor: "—",
    settled: false,
  },
];

type SortKey = keyof Pick<
  PackageRow,
  | "id"
  | "referralId"
  | "packageName"
  | "patientName"
  | "patientNumber"
  | "doctor"
>;

export default function PackageList() {
  const router = useRouter();
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? SAMPLE_PACKAGES.filter((r) =>
          [
            r.id,
            r.referralId,
            r.packageName,
            r.patientName,
            r.patientNumber,
            r.doctor,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
      : SAMPLE_PACKAGES;
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
            placeholder="Search package, patient, doctor..."
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
              <Th
                label="ID"
                onClick={() => updateSort("id")}
                active={sortKey === "id"}
                asc={sortAsc}
              />
              <Th
                label="Referral ID"
                onClick={() => updateSort("referralId")}
                active={sortKey === "referralId"}
                asc={sortAsc}
              />
              <Th
                label="Package Name"
                onClick={() => updateSort("packageName")}
                active={sortKey === "packageName"}
                asc={sortAsc}
              />
              <Th
                label="Patient Name"
                onClick={() => updateSort("patientName")}
                active={sortKey === "patientName"}
                asc={sortAsc}
              />
              <Th
                label="Patient Number"
                onClick={() => updateSort("patientNumber")}
                active={sortKey === "patientNumber"}
                asc={sortAsc}
              />
              <Th
                label="Doctor"
                onClick={() => updateSort("doctor")}
                active={sortKey === "doctor"}
                asc={sortAsc}
              />
              <th className="px-3 py-2">Billing</th>
              <th className="px-3 py-2">Samples</th>
              <th className="px-3 py-2">Reports</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => {
              const bg = r.settled
                ? "bg-emerald-50 dark:bg-emerald-900/20"
                : "bg-red-50 dark:bg-red-900/20";
              return (
                <tr key={r.id} className={bg + " border-t border-foreground/5"}>
                  <td className="px-3 py-2 text-foreground/90">{r.id}</td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.referralId}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.packageName}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.patientName}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">
                    {r.patientNumber}
                  </td>
                  <td className="px-3 py-2 text-foreground/90">{r.doctor}</td>
                  <td className="px-3 py-2">
                    <button
                      title="Billing"
                      onClick={() => router.push(`/lab/package-bill/${r.id}`)}
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <CreditCardIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Samples"
                      onClick={() =>
                        router.push(`/lab/package-samples/${r.id}`)
                      }
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <BeakerIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      title="Reports"
                      onClick={() =>
                        router.push(`/lab/package-reports/${r.id}`)
                      }
                      className="rounded-md p-1 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-foreground/60"
                  colSpan={9}
                >
                  No matching packages
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-foreground/70">
          Showing {pageRows.length ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + pageRows.length, filtered.length)} of{" "}
          {filtered.length} entries
        </div>
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={(n) => setPage(n)}
        />
      </div>
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

function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (n: number) => void;
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
          <PageBtn n={1} active={page === 1} onClick={onPageChange} />
          {nums[0] > 2 ? (
            <span className="px-1 text-foreground/60">…</span>
          ) : null}
        </>
      ) : null}
      {nums.map((n) => (
        <PageBtn key={n} n={n} active={page === n} onClick={onPageChange} />
      ))}
      {nums[nums.length - 1] !== pageCount ? (
        <>
          {nums[nums.length - 1] < pageCount - 1 ? (
            <span className="px-1 text-foreground/60">…</span>
          ) : null}
          <PageBtn
            n={pageCount}
            active={page === pageCount}
            onClick={onPageChange}
          />
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
  );
}

function PageBtn({
  n,
  active,
  onClick,
}: {
  n: number;
  active: boolean;
  onClick: (n: number) => void;
}) {
  return (
    <button
      className={
        "min-w-8 rounded-md px-2 py-1 text-foreground transition " +
        (active
          ? "bg-foreground text-background"
          : "border border-foreground/20 hover:bg-foreground/5")
      }
      onClick={() => onClick(n)}
    >
      {n}
    </button>
  );
}
