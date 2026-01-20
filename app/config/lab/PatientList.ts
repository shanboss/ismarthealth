export type PatientQueue = {
  patientqueue_id: number;
  BillId: string;
  medical_num: string;
  firstname: string;
  mailid: string;
  phonenum: string;
  refer_date: Date;
  patient_unique_id: string;
  physician_id: number | null;
  phyfname: string | null;
  referred_id: number;
  ID: number;
  billing_id: number;
  laboratory_id: number;
  ref_type: string;
  lab_test_status: number;
  billing_status: number;
  is_sync: number;
  created_on: Date;
};

export type Patient = {
  billNo: string;
  name: string;
  phoneNumber: string;
  doctor: string;
  referDate: string;
  settled: boolean;
  medical_num: string;
  patient_unique_id: string;
};