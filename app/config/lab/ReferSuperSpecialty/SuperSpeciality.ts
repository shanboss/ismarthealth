export type Specialist = {
  name: string;
  specialty: string;
  hospital: string;
};

export const SPECIALISTS: Specialist[] = [
  { name: "Dr. Rao", specialty: "Cardiology", hospital: "Apex Heart" },
  { name: "Dr. Anita", specialty: "Neurology", hospital: "NeuroCare" },
  { name: "Dr. Kumar", specialty: "Orthopedics", hospital: "OrthoPlus" },
  { name: "Dr. Mehta", specialty: "Gastroenterology", hospital: "GI Center" },
];

export const SPECIALTIES = Array.from(
  new Set(SPECIALISTS.map((s) => s.specialty))
).sort();
