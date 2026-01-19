export type LaboratoryTest = {
  laboratory_testid: number;
  laboratory_tests: string;
  code: string;
  display_order: number | null;
  mnemonics: string | null;
  test_type: string | null;
  sub_department: string | null;
  sample_type: string | null;
  container_type: string | null;
  confidential: string | null;
  methodology: string | null;
  transport_temperature: string | null;
  tat: string | null;
  outsourcing_status: string | null;
  instrument: string | null;
  laboratory_id: number;
  test_price: string; // Changed from bigint to string for JSON serialization
  custom_test_name: string;
  instruction: string;
  test_method: string;
  status: string;
  status_changed_by: string;
  status_changed_on: string;
  unit: string;
  reference_range: string;
  age_gender_specific: string | null;
  critical_alert: string | null;
  interpretation: string | null;
  sort_order: number;
  title_required: number;
};

export type SelectedTest = {
  id: number;
  name: string;
  department: string;
  price: string;
  code: string;
};