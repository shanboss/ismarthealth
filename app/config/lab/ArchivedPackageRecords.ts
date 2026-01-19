export type ArchivedPackage = {
  id: string;
  referralId: string;
  name: string;
  phoneNumber: string;
  doctor: string;
  referDate: string;
};

export const samplePackages: ArchivedPackage[] = [
  {
    id: "1",
    referralId: "p_te8219111201081",
    name: "Test",
    phoneNumber: "8217050141",
    doctor: "Madhavan",
    referDate: "12-Nov-2019",
  },
  {
    id: "2",
    referralId: "p_aj781906250177",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "",
    referDate: "25-Jun-2019",
  },
  {
    id: "3",
    referralId: "p_su881905220962",
    name: "Sujay",
    phoneNumber: "8888888881",
    doctor: "Madhavan",
    referDate: "22-May-2019",
  },
  {
    id: "4",
    referralId: "p_vi991905220949",
    name: "Vijaya",
    phoneNumber: "9901855824",
    doctor: "Madhavan",
    referDate: "22-May-2019",
  },
  {
    id: "5",
    referralId: "p_mo981905160941",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "",
    referDate: "16-May-2019",
  },
  {
    id: "6",
    referralId: "p_mo981905150932",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "Chandan",
    referDate: "15-May-2019",
  },
  {
    id: "7",
    referralId: "p_mo981905150931",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "Madhavan",
    referDate: "15-May-2019",
  },
  {
    id: "8",
    referralId: "p_mo981905150920",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "",
    referDate: "15-May-2019",
  },
  {
    id: "9",
    referralId: "p_mo981905150917",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "",
    referDate: "15-May-2019",
  },
  {
    id: "10",
    referralId: "p_mo981905150916",
    name: "Monalisa",
    phoneNumber: "9874532121",
    doctor: "Madhavan",
    referDate: "15-May-2019",
  },
  {
    id: "11",
    referralId: "p_ra981905140915",
    name: "Rahul",
    phoneNumber: "9876543210",
    doctor: "Madhavan",
    referDate: "14-May-2019",
  },
];

export type SortField = keyof ArchivedPackage;
export type SortOrder = "asc" | "desc";
