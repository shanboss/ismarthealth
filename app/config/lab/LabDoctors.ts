export type Doctor = {
  id: string;
  name: string;
  department: string;
  phoneNo: string;
  email: string;
};

export const sampleDoctors: Doctor[] = [
  {
    id: "1",
    name: "LabInvestigation Doc1",
    department: "LAB INVESTIGATION",
    phoneNo: "4646546464",
    email: "LabInvestigationdoc1@inetframe.com",
  },
  {
    id: "2",
    name: "Ultrasound Doc1",
    department: "ULTRASOUND/SONOGRAPHY",
    phoneNo: "4646546464",
    email: "Ultrasounddoc1@inetframe.com",
  },
  {
    id: "3",
    name: "Ajit Kumar",
    department: "MRI",
    phoneNo: "4646546423",
    email: "xraydoc1@inetframe.com",
  },
  {
    id: "4",
    name: "Vijay Sarnobat",
    department: "LAB INVESTIGATION",
    phoneNo: "4646546465",
    email: "LabInvestigationdoc2@inetframe.com",
  },
  {
    id: "5",
    name: "Sudrashan N",
    department: "ECHO/TMT",
    phoneNo: "9620864852",
    email: "info.info@inetlab.com",
  },
];

export type SortField = keyof Doctor;
export type SortOrder = "asc" | "desc";