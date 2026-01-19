

type Row = {
  billNo: string;
  name: string;
  phone: string;
  doctor: string;
  referDate: string;
  settled: boolean;
};

export const SAMPLE: Row[] = [
  { billNo: "2018110456", name: "Abhishek", phone: "9987645464", doctor: "Madhavan", referDate: "28-Jun-2023", settled: false },
  { billNo: "2018110459", name: "Sakshi", phone: "9845762380", doctor: "Madhavan", referDate: "10-May-2023", settled: false },
  { billNo: "2018110449", name: "Vinayak", phone: "8147374491", doctor: "Madhavan", referDate: "29-Aug-2022", settled: false },
  { billNo: "2018110433", name: "Ritu", phone: "9834207800", doctor: "Anand", referDate: "28-Dec-2019", settled: true },
  { billNo: "2018110432", name: "Ritu", phone: "9022873590", doctor: "ABC", referDate: "28-Dec-2019", settled: true },
  { billNo: "2018110431", name: "Ritu", phone: "9834207800", doctor: "Amit", referDate: "28-Dec-2019", settled: true },
  { billNo: "2018110430", name: "shweta", phone: "8497006622", doctor: "Amit", referDate: "27-Dec-2019", settled: true },
  { billNo: "2018110428", name: "Sakshi", phone: "9845762380", doctor: "Madhavan", referDate: "26-Dec-2019", settled: true },
  { billNo: "2018110427", name: "Sakshi", phone: "9845762380", doctor: "Madhavan", referDate: "26-Dec-2019", settled: true },
  { billNo: "2018110429", name: "Sakshi", phone: "9845762380", doctor: "Madhavan", referDate: "26-Dec-2019", settled: true },
];

export type SortKey = keyof Pick<Row, "billNo" | "name" | "phone" | "doctor" | "referDate">;
