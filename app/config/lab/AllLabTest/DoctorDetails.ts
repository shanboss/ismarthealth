export type LaboratoryDoctor = {
  laboratory_doctors_id: number;
  laboratory_id: number;
  doc_firstname: string;
  doc_lastname: string;
  doc_password: string;
  doc_phone_number: string;
  doc_email: string;
  doc_dept: number;
  doc_signature: string;
  added_date: Date;
  doc_designation: string;
  is_active: number;
};

export type Doctor = {
  id: number;
  name: string;
  phone: string;
  email: string;
  designation: string;
  department: number;
};
