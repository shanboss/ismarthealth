export type AddPatientForm = {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "others";
  email?: string;
  phone: string;
  dob?: string;
  age?: string;
  address?: string;
  pincode?: string;
  state?: string;
  city?: string;
};