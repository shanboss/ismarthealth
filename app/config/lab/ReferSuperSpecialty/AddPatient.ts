export type AddPatientForm = {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "others";
  email?: string;
  phone: string;
  age?: string;
  patient_unique_id?: string;
};