"use client";

import Sidebar from "../../components/Lab/Sidebar";
import { useState } from "react";
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

const initialTestCategories: TestCategory[] = [
  {
    id: "mri",
    name: "MRI",
    tests: [
      {
        id: "4144",
        name: "MRI R/L LEG CONTRAST",
        price: 3000,
        customName: "MRI LC",
        instruction: "",
        method: "",
        unit: "",
        referenceRange: "",
      },
      {
        id: "4131",
        name: "MRI BRAIN PLAIN",
        price: 5000,
        customName: "",
        instruction: "NON LAB TEST",
        method: "",
        unit: "",
        referenceRange: "",
      },
      {
        id: "88",
        name: "MRI UPPER LIMBS ANGIO",
        price: 100,
        customName: "MULA",
        instruction: "sdd",
        method: "",
        unit: "",
        referenceRange: "",
      },
      {
        id: "87",
        name: "MRI TEMPORAL BONE CONTRAST",
        price: 200,
        customName: "MTBC",
        instruction: "INS2",
        method: "Method1",
        unit: "",
        referenceRange: "",
      },
      {
        id: "86",
        name: "MRI TEMPORAL BONE PLAIN",
        price: 300,
        customName: "MTBP",
        instruction: "INS1",
        method: "Method 1",
        unit: "",
        referenceRange: "",
      },
    ],
  },
  {
    id: "ultrasound",
    name: "ULTRASOUND/SONOGRAPHY",
    tests: [
      {
        id: "101",
        name: "US Chest",
        price: 28000,
        customName: "",
        instruction: "Instruction",
        method: "Test",
        unit: "",
        referenceRange: "",
      },
      {
        id: "100",
        name: "Ultrasound thyroid",
        price: 1000,
        customName: "",
        instruction: "Ultrasound Thyrriod Check ",
        method: "Ultrasound Thyrriod CheckUltrasound Thyrriod Check",
        unit: "",
        referenceRange: "",
      },
      {
        id: "99",
        name: "Ultrasound neck",
        price: 2000,
        customName: "",
        instruction: "Instruction",
        method: "Method",
        unit: "",
        referenceRange: "",
      },
    ],
  },
  {
    id: "xray",
    name: "X-RAY",
    tests: [
      {
        id: "4143",
        name: "Xray chest AP",
        price: 0,
        customName: "",
        instruction: "",
        method: "",
        unit: "",
        referenceRange: "",
      },
      {
        id: "111",
        name: "Xray cervical spine AP & lateral view",
        price: 2000,
        customName: "",
        instruction: "",
        method: "",
        unit: "",
        referenceRange: "",
      },
    ],
  },
  {
    id: "lab-investigation",
    name: "LAB INVESTIGATION",
    tests: [
      {
        id: "6399",
        name: "MBG (mg/dl)",
        price: 0,
        customName: "",
        instruction: "",
        method: "",
        unit: "",
        referenceRange: "",
      },
      {
        id: "6398",
        name: "A1c(%)",
        price: 0,
        customName: "",
        instruction: "",
        method: "",
        unit: "",
        referenceRange: "",
      },
      {
        id: "6391",
        name: "FBS-fasting blood sugar",
        price: 35,
        customName: "",
        instruction: "",
        method: "",
        unit: "",
        referenceRange: "",
      },
      {
        id: "6390",
        name: "MCV",
        price: 200,
        customName: "MCV",
        instruction: "MVCinst",
        method: "testmthd",
        unit: "fL",
        referenceRange: "N:82-98",
      },
    ],
  },
];

export default function UpdateTestsPricePage() {
  const [testCategories, setTestCategories] = useState<TestCategory[]>(
    initialTestCategories
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleTestChange = (
    categoryId: string,
    testId: string,
    field: keyof TestItem,
    value: any
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
          test.customName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.tests.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting updated test prices:", testCategories);
    alert("Test prices updated (console logged)");
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          Update Tests Price
        </h1>

        <div className="mx-auto w-full max-w-6xl rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
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
              {filteredCategories.map((category) => (
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
                      title={`Delete all tests under ${category.name}`}
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
                                  className="w-24 rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground"
                                  value={test.price}
                                  onChange={(e) =>
                                    handleTestChange(
                                      category.id,
                                      test.id,
                                      "price",
                                      parseInt(e.target.value)
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
                                    onClick={() =>
                                      console.log("Update test:", test)
                                    }
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-md bg-red-500 px-2 py-1 text-white hover:opacity-90"
                                    onClick={() =>
                                      handleDeleteTest(category.id, test.id)
                                    }
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
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                type="submit"
                className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
