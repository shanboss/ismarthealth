export type AddPatientForm = {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "others";
  email?: string;
  phone: string;
  age?: string;
};