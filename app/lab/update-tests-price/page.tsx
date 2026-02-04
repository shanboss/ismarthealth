"use client";

import Sidebar from "../../components/Lab/Sidebar";
import { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type TestItem = {
  id: string;
  name: string;
  price: number;
  customName: string;
  instruction: string;
  method: string;
  unit: string;
  referenceRange: string;
};

type TestCategory = {
  id: string;
  name: string;
  tests: TestItem[];
};

type LabTestFromApi = {
  laboratory_testid: number;
  laboratory_tests: string;
  test_name?: string | null;
  custom_test_name?: string | null;
  sub_department?: string | null;
  test_price: string | number;
  instruction?: string | null;
  test_method?: string | null;
  unit?: string | null;
  reference_range?: string | null;
};

function apiTestsToCategories(data: LabTestFromApi[]): TestCategory[] {
  const groups: Record<string, TestItem[]> = {};
  const displayNames: Record<string, string> = {};

  data.forEach((test) => {
    const dept = test.sub_department || "Other";
    const key = dept.toLowerCase().replace(/\s+/g, "-");
    const displayName =
      dept.charAt(0).toUpperCase() + dept.slice(1).toLowerCase();

    if (!groups[key]) {
      groups[key] = [];
      displayNames[key] = displayName;
    }

    const price =
      typeof test.test_price === "string"
        ? parseFloat(test.test_price) || 0
        : Number(test.test_price) || 0;

    groups[key].push({
      id: String(test.laboratory_testid),
      name:
        test.test_name || test.custom_test_name || test.laboratory_tests || "",
      price,
      customName: (test.custom_test_name || "").trim(),
      instruction: (test.instruction || "").trim(),
      method: (test.test_method || "").trim(),
      unit: (test.unit || "").trim(),
      referenceRange: (test.reference_range || "").trim(),
    });
  });

  return Object.entries(groups).map(([id, tests]) => ({
    id,
    name: displayNames[id] || id,
    tests,
  }));
}

export default function UpdateTestsPricePage() {
  const [testCategories, setTestCategories] = useState<TestCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchTests() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/lab/tests");
        const data = await response.json();

        if (response.ok && data.success) {
          setTestCategories(apiTestsToCategories(data.data || []));
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

  const handleTestChange = (
    categoryId: string,
    testId: string,
    field: keyof TestItem,
    value: string | number
  ) => {
    setTestCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tests: category.tests.map((test) =>
                test.id === testId ? { ...test, [field]: value } : test
              ),
            }
          : category
      )
    );
    setSubmitMessage(null);
  };

  const handleDeleteTest = (categoryId: string, testId: string) => {
    setTestCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tests: category.tests.filter((test) => test.id !== testId),
            }
          : category
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setTestCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryId)
    );
  };

  const filteredCategories = testCategories
    .map((category) => ({
      ...category,
      tests: category.tests.filter(
        (test) =>
          test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (test.customName || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.tests.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const testsToUpdate: Array<{
        id: string;
        price: number;
        customName: string;
        instruction: string;
        method: string;
        unit: string;
        referenceRange: string;
      }> = [];

      testCategories.forEach((category) => {
        category.tests.forEach((test) => {
          testsToUpdate.push({
            id: test.id,
            price: test.price,
            customName: test.customName,
            instruction: test.instruction,
            method: test.method,
            unit: test.unit,
            referenceRange: test.referenceRange,
          });
        });
      });

      const response = await fetch("/api/lab/update-test-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tests: testsToUpdate }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitMessage({ type: "success", text: data.message });
      } else {
        setSubmitMessage({
          type: "error",
          text: data.error || "Failed to update test prices",
        });
      }
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: "An error occurred while updating test prices",
      });
      console.error("Error submitting:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 space-y-6 p-4 md:p-6">
          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Update Tests Price
          </h1>
          <div className="flex items-center justify-center py-12">
            <p className="text-foreground/60">Loading tests...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          Update Tests Price
        </h1>

        <div className="mx-auto w-full max-w-6xl rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
          {error && (
            <div className="mb-6 rounded-md bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          {submitMessage && (
            <div
              className={`mb-6 rounded-md px-4 py-3 text-sm ${
                submitMessage.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="search-test"
              className="block text-sm font-medium text-foreground"
            >
              Search for Test Name...
            </label>
            <input
              type="text"
              id="search-test"
              autoComplete="off"
              placeholder="Search"
              title="Search for Test Name"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div id="accordion" role="tablist" aria-multiselectable="true">
              {filteredCategories.length === 0 ? (
                <p className="py-8 text-center text-foreground/60">
                  {searchTerm
                    ? "No tests match your search"
                    : "No tests available"}
                </p>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <div className="flex items-center justify-between border border-foreground/20 bg-foreground/5 p-3">
                      <h3
                        className="flex-1 cursor-pointer text-lg font-semibold"
                        onClick={() =>
                          setOpenCategory(
                            openCategory === category.id ? null : category.id
                          )
                        }
                      >
                        {category.name}
                      </h3>
                      <TrashIcon
                        className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
                        title={`Remove ${category.name} from view`}
                      />
                      <ChevronDownIcon
                        className={`ml-2 h-5 w-5 transition-transform ${
                          openCategory === category.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openCategory === category.id && (
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                          <thead>
                            <tr className="bg-foreground/10">
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Sl No
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Test Name
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Price
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Custom Name
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Instruction
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Test Method
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Unit
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Reference Range
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.tests.map((test, index) => (
                              <tr
                                key={test.id}
                                className="border-b border-foreground/10 hover:bg-foreground/5"
                              >
                                <td className="px-4 py-2 text-sm text-foreground">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  {test.name}
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-24 rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground"
                                    value={test.price}
                                    onChange={(e) =>
                                      handleTestChange(
                                        category.id,
                                        test.id,
                                        "price",
                                        Number(e.target.value) || 0
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  <input
                                    type="text"
                                    className="w-32 rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground"
                                    value={test.customName}
                                    onChange={(e) =>
                                      handleTestChange(
                                        category.id,
                                        test.id,
                                        "customName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  <input
                                    type="text"
                                    className="w-40 rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground"
                                    value={test.instruction}
                                    onChange={(e) =>
                                      handleTestChange(
                                        category.id,
                                        test.id,
                                        "instruction",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  <input
                                    type="text"
                                    className="w-32 rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground"
                                    value={test.method}
                                    onChange={(e) =>
                                      handleTestChange(
                                        category.id,
                                        test.id,
                                        "method",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  <input
                                    type="text"
                                    className="w-20 rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground"
                                    value={test.unit}
                                    onChange={(e) =>
                                      handleTestChange(
                                        category.id,
                                        test.id,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  <input
                                    type="text"
                                    className="w-32 rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground"
                                    value={test.referenceRange}
                                    onChange={(e) =>
                                      handleTestChange(
                                        category.id,
                                        test.id,
                                        "referenceRange",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 text-sm text-foreground">
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      className="rounded-md bg-green-600 px-2 py-1 text-white hover:opacity-90"
                                      title="Save (use Submit below to persist)"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-md bg-red-500 px-2 py-1 text-white hover:opacity-90"
                                      onClick={() =>
                                        handleDeleteTest(category.id, test.id)
                                      }
                                      title="Remove from view"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                type="submit"
                disabled={submitting || testCategories.length === 0}
                className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
