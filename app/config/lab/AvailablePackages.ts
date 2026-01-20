export type Package = {
  id: string;
  name: string;
  testCount: number;
  selected: boolean;
};

export const samplePackages: Package[] = [
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

export type SortField = "id" | "name" | "testCount" | "selected";
export type SortOrder = "asc" | "desc";