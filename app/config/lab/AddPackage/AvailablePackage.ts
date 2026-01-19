
export type Package = {
  id: string;
  name: string;
  price: number;
  tests: number;
};

export const PACKAGES: Package[] = [
  { id: "pkg1", name: "Basic Health Check", price: 999, tests: 10 },
  { id: "pkg2", name: "Comprehensive Check", price: 2999, tests: 35 },
  { id: "pkg3", name: "Thyroid Package", price: 799, tests: 3 },
  { id: "pkg4", name: "Diabetes Package", price: 1299, tests: 6 },
];
