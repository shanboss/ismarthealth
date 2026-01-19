
export type PackageQueueData = {
  id: string;
  medical_num: string | null;
  package_id: string | null;
  lab_id: string | null;
  patient_id: string | null;
  dependent_id: string;
  doctor_id: string | null;
  referdate: string | null;
  created_by: string | null;
  created_on: string | null;
  package_status: string | null;
};

export type PackageRow = {
  id: string;
  referralId: string;
  packageName: string;
  patientName: string;
  patientNumber: string;
  doctor: string;
  settled: boolean;
  referDate: string;
};