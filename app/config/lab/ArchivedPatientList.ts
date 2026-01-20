export type ArchivedPatient = {
  id: string;
  referralId: string;
  name: string;
  phoneNumber: string;
  doctor: string;
  referDate: string;
};

export const samplePatients: ArchivedPatient[] = [
  {
    id: "1",
    referralId: "sa9824012901151",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "29-Jan-2024",
  },
  {
    id: "2",
    referralId: "sa9824012901150",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "29-Jan-2024",
  },
  {
    id: "3",
    referralId: "sa9823120601148",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "4",
    referralId: "aj7823120601147",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "5",
    referralId: "aj7823120601146",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "6",
    referralId: "sa9823120601145",
    name: "Sachin",
    phoneNumber: "9876575657",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "7",
    referralId: "aj7823120601144",
    name: "Ajay",
    phoneNumber: "7892044648",
    doctor: "Madhavan",
    referDate: "06-Dec-2023",
  },
  {
    id: "8",
    referralId: "su9923070501142",
    name: "Suresh",
    phoneNumber: "9987674646",
    doctor: "Madhavan",
    referDate: "05-Jul-2023",
  },
  {
    id: "9",
    referralId: "an9923063001139",
    name: "Anu",
    phoneNumber: "9987565765",
    doctor: "Madhavan",
    referDate: "30-Jun-2023",
  },
  {
    id: "10",
    referralId: "sa9823051001136",
    name: "Sakshi",
    phoneNumber: "9845762380",
    doctor: "Madhavan",
    referDate: "10-May-2023",
  },
  // Add more entries to reach ~82 total
  ...Array.from({ length: 72 }, (_, i) => ({
    id: `${11 + i}`,
    referralId: `ref${1000 + i}`,
    name: ["Rahul", "Priya", "Amit", "Neha", "Raj"][i % 5],
    phoneNumber: `98765${10000 + i}`,
    doctor: "Madhavan",
    referDate: "15-Mar-2023",
  })),
];

export type SortField = keyof ArchivedPatient;
export type SortOrder = "asc" | "desc";