"use client";

import { useState, useEffect, useMemo } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

type LaboratoryTest = {
  laboratory_testid: number;
  laboratory_tests: string;
  code: string;
  display_order: number | null;
  mnemonics: string | null;
  test_type: string | null;
  sub_department: string | null;
  sample_type: string | null;
  container_type: string | null;
  confidential: string | null;
  methodology: string | null;
  transport_temperature: string | null;
  tat: string | null;
  outsourcing_status: string | null;
  instrument: string | null;
  laboratory_id: number;
  test_price: string; // Changed from bigint to string for JSON serialization
  custom_test_name: string;
  instruction: string;
  test_method: string;
  status: string;
  status_changed_by: string;
  status_changed_on: string;
  unit: string;
  reference_range: string;
  age_gender_specific: string | null;
  critical_alert: string | null;
  interpretation: string | null;
  sort_order: number;
  title_required: number;
};

type SelectedTest = {
  id: number;
  name: string;
  department: string;
  price: string;
  code: string;
};

export default function TestsSelection({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: (tests: SelectedTest[]) => void;
}) {
  const [tests, setTests] = useState<LaboratoryTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Fetch tests from API
  useEffect(() => {
    async function fetchTests() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/lab/tests");
        const data = await response.json();

        if (response.ok && data.success) {
          setTests(data.data || []);
          // Initialize all groups as closed
          const departments = new Set(
            data.data.map((t: LaboratoryTest) => t.sub_department || "Other")
          );
          setOpenGroups(
            Object.fromEntries(Array.from(departments).map((d) => [d, false]))
          );
        } else {
          setError(data.error || "Failed to fetch tests");
        }
      } catch (err) {
        setError("An error occurred while fetching tests");
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, []);

  // Group tests by sub_department
  const groupedTests = useMemo(() => {
    const groups: Record<string, LaboratoryTest[]> = {};
    tests.forEach((test) => {
      const dept = test.sub_department || "Other";
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(test);
    });
    return groups;
  }, [tests]);

  // Filter tests based on search query
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return groupedTests;

    const filtered: Record<string, LaboratoryTest[]> = {};
    Object.entries(groupedTests).forEach(([dept, tests]) => {
      const matchingTests = tests.filter(
        (test) =>
          test.laboratory_tests.toLowerCase().includes(q) ||
          test.custom_test_name.toLowerCase().includes(q) ||
          test.code.toLowerCase().includes(q) ||
          (test.test_type && test.test_type.toLowerCase().includes(q))
      );
      if (matchingTests.length > 0) {
        filtered[dept] = matchingTests;
      }
    });
    return filtered;
  }, [groupedTests, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  function toggleGroup(dept: string) {
    setOpenGroups((prev) => ({ ...prev, [dept]: !prev[dept] }));
  }

  function toggleTest(testId: number) {
    setSelected((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  }

  function removeTest(testId: number) {
    setSelected((prev) => prev.filter((id) => id !== testId));
  }

  const selectedTests: SelectedTest[] = useMemo(() => {
    return selected
      .map((id) => {
        const test = tests.find((t) => t.laboratory_testid === id);
        if (!test) return null;
        return {
          id: test.laboratory_testid,
          name: test.laboratory_tests,
          department: test.sub_department || "Other",
          price: test.test_price,
          code: test.code,
        };
      })
      .filter((t): t is SelectedTest => t !== null);
  }, [selected, tests]);

  if (loading) {
    return (
      <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="text-foreground/60">Loading tests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Order Lab Tests
      </h2>

      {error && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left side - Test selection */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <label className="sr-only" htmlFor="test-search">
              Search tests
            </label>
            <input
              id="test-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests by name, code, or type..."
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-foreground/80">Select tests</p>
            {Object.entries(filteredGroups).length === 0 ? (
              <p className="py-6 text-center text-sm text-foreground/60">
                {isSearching
                  ? "No tests found matching your search"
                  : "No tests available"}
              </p>
            ) : (
              Object.entries(filteredGroups).map(([dept, deptTests]) => {
                const opened = isSearching ? true : !!openGroups[dept];
                return (
                  <div
                    key={dept}
                    className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGroup(dept)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-foreground hover:bg-foreground/5"
                      aria-expanded={opened}
                      aria-controls={`group-${dept}`}
                    >
                      <span>{dept}</span>
                      <span className="select-none text-xl leading-none">
                        {opened ? "−" : "+"}
                      </span>
                    </button>
                    {opened && (
                      <ul
                        id={`group-${dept}`}
                        className="divide-y divide-foreground/10"
                      >
                        {deptTests.map((test) => {
                          const isSelected = selected.includes(
                            test.laboratory_testid
                          );
                          return (
                            <li
                              key={test.laboratory_testid}
                              className="flex items-center"
                            >
                              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 py-2 hover:bg-foreground/5">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 cursor-pointer rounded border-foreground/30 bg-background text-foreground focus:ring-foreground"
                                  checked={isSelected}
                                  onChange={() =>
                                    toggleTest(test.laboratory_testid)
                                  }
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm text-foreground">
                                    {test.laboratory_tests}
                                  </div>
                                  <div className="flex gap-2 text-xs text-foreground/60">
                                    <span>{test.code}</span>
                                    <span>•</span>
                                    <span>₹{test.test_price}</span>
                                  </div>
                                </div>
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  !isSelected
                                    ? toggleTest(test.laboratory_testid)
                                    : undefined
                                }
                                className="m-2 inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background p-1 text-foreground transition hover:opacity-80 disabled:opacity-40"
                                disabled={isSelected}
                                aria-label={`Add ${test.laboratory_tests}`}
                                title={
                                  isSelected
                                    ? "Already selected"
                                    : "Add to selected"
                                }
                              >
                                <PlusIcon className="h-5 w-5" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right side - Selected tests */}
        <aside className="h-fit rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
          <h3 className="text-base font-semibold text-foreground">
            Selected Tests
          </h3>
          <p className="mt-1 text-xs text-foreground/60">
            Selected Items ({selectedTests.length})
          </p>
          <div className="mt-2 h-px w-full bg-foreground/10" />

          {selectedTests.length > 0 ? (
            <ul className="mt-3 max-h-96 space-y-2 overflow-y-auto text-sm">
              {selectedTests.map((test) => (
                <li key={test.id} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/70" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-foreground">{test.name}</div>
                    <div className="truncate text-xs text-foreground/60">
                      {test.department} • ₹{test.price}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTest(test.id)}
                    className="ml-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-background text-red-600 transition hover:bg-foreground/10 hover:opacity-90"
                    aria-label={`Remove ${test.name}`}
                    title="Remove"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-foreground/60">
              No tests selected.
            </p>
          )}
        </aside>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-md bg-foreground/20 px-4 py-2 text-sm font-semibold text-foreground transition hover:opacity-90 active:scale-95"
        >
          Previous
        </button>
        <div className="text-sm text-foreground/70">
          {selectedTests.length > 0 ? (
            <span className="font-medium text-green-600 dark:text-green-400">
              {selectedTests.length} test{selectedTests.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          ) : (
            <span>No tests selected</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onNext(selectedTests)}
          disabled={selectedTests.length === 0}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
