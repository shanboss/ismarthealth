
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.BarcodeScalarFieldEnum = {
  barcode_id: 'barcode_id',
  billing_id: 'billing_id',
  barcode: 'barcode',
  barcode_image: 'barcode_image',
  created_date: 'created_date'
};

exports.Prisma.BillingScalarFieldEnum = {
  billing_id: 'billing_id',
  laboratory_tests: 'laboratory_tests',
  medical_num: 'medical_num',
  patient_unique_id: 'patient_unique_id',
  tot_amt: 'tot_amt',
  discount: 'discount',
  discount_type: 'discount_type',
  net_amt: 'net_amt',
  adv_amt: 'adv_amt',
  balance_amt: 'balance_amt',
  balance_pymnt2: 'balance_pymnt2',
  final_balance: 'final_balance',
  lab_id: 'lab_id',
  unique_billid: 'unique_billid',
  created_on: 'created_on'
};

exports.Prisma.Billing_logScalarFieldEnum = {
  billing_log_id: 'billing_log_id',
  billing_id: 'billing_id',
  amt: 'amt',
  payment_method: 'payment_method',
  added_date: 'added_date'
};

exports.Prisma.Bloodgroup_detailsScalarFieldEnum = {
  bloodgroup_id: 'bloodgroup_id',
  bloodgroup_name: 'bloodgroup_name',
  active: 'active'
};

exports.Prisma.CityScalarFieldEnum = {
  city_id: 'city_id',
  city_name: 'city_name',
  state_id: 'state_id',
  active: 'active'
};

exports.Prisma.Clinic_module_activation_requestScalarFieldEnum = {
  clinic_module_activation_request_id: 'clinic_module_activation_request_id',
  name: 'name',
  email: 'email',
  phone_num: 'phone_num',
  physicianid: 'physicianid',
  message: 'message',
  is_activated: 'is_activated',
  added_date: 'added_date'
};

exports.Prisma.Clinical_parametersScalarFieldEnum = {
  clinical_parameterid: 'clinical_parameterid',
  blood_pressure: 'blood_pressure',
  systolic_blood_pressure: 'systolic_blood_pressure',
  diastolic_blood_pressure: 'diastolic_blood_pressure',
  sugar: 'sugar',
  pulse: 'pulse',
  height: 'height',
  weight: 'weight',
  temperature: 'temperature',
  referral_patient_id: 'referral_patient_id',
  dependent_id: 'dependent_id',
  created_on: 'created_on'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  name: 'name',
  emailid: 'emailid',
  subject: 'subject',
  message: 'message',
  created_date: 'created_date'
};

exports.Prisma.CountryScalarFieldEnum = {
  country_id: 'country_id',
  country_name: 'country_name',
  active: 'active'
};

exports.Prisma.FilesScalarFieldEnum = {
  id: 'id',
  file_name: 'file_name',
  type: 'type',
  medical_num: 'medical_num',
  patient_unique_id: 'patient_unique_id',
  referral_id: 'referral_id',
  uploaded_on: 'uploaded_on',
  status: 'status'
};

exports.Prisma.Investigation_detailsScalarFieldEnum = {
  investigation_id: 'investigation_id',
  investigation_name: 'investigation_name',
  active: 'active'
};

exports.Prisma.Investigation_fileScalarFieldEnum = {
  file_id: 'file_id',
  investigation_file: 'investigation_file',
  referral_test_ID: 'referral_test_ID',
  uploaded_on: 'uploaded_on'
};

exports.Prisma.Investigation_test_detailsScalarFieldEnum = {
  parse_id: 'parse_id',
  test_name: 'test_name',
  investigation_id: 'investigation_id',
  parent_parse_id: 'parent_parse_id',
  active: 'active'
};

exports.Prisma.Lab_leavesScalarFieldEnum = {
  id: 'id',
  lab_id: 'lab_id',
  dates: 'dates',
  start_time: 'start_time',
  end_time: 'end_time',
  reason: 'reason',
  created_time: 'created_time'
};

exports.Prisma.Lab_tests_price_updatesScalarFieldEnum = {
  id: 'id',
  lab_id: 'lab_id',
  test_id: 'test_id',
  price: 'price',
  unit: 'unit',
  reference_range: 'reference_range',
  created_date: 'created_date',
  created_by: 'created_by',
  created_by_phone_num: 'created_by_phone_num'
};

exports.Prisma.Lab_timingsScalarFieldEnum = {
  id: 'id',
  lab_id: 'lab_id',
  theday: 'theday',
  work_type: 'work_type',
  start_time: 'start_time',
  end_time: 'end_time',
  created_time: 'created_time',
  updated_time: 'updated_time'
};

exports.Prisma.Laboratory_detailsScalarFieldEnum = {
  laboratory_id: 'laboratory_id',
  laboratory_name: 'laboratory_name',
  laboratory_address: 'laboratory_address',
  locality: 'locality',
  laboratory_phone: 'laboratory_phone',
  laboratory_email: 'laboratory_email',
  laboratory_password: 'laboratory_password',
  lab_state: 'lab_state',
  lab_city: 'lab_city',
  lab_pincode: 'lab_pincode',
  created_on: 'created_on',
  updated_on: 'updated_on',
  active: 'active',
  role_id: 'role_id',
  profile_filename: 'profile_filename',
  profile_fullpath: 'profile_fullpath'
};

exports.Prisma.Laboratory_doctorsScalarFieldEnum = {
  laboratory_doctors_id: 'laboratory_doctors_id',
  laboratory_id: 'laboratory_id',
  doc_firstname: 'doc_firstname',
  doc_lastname: 'doc_lastname',
  doc_password: 'doc_password',
  doc_phone_number: 'doc_phone_number',
  doc_email: 'doc_email',
  doc_dept: 'doc_dept',
  doc_signature: 'doc_signature',
  added_date: 'added_date',
  doc_designation: 'doc_designation',
  is_active: 'is_active'
};

exports.Prisma.Laboratory_test_detailsScalarFieldEnum = {
  laboratory_testid: 'laboratory_testid',
  laboratory_tests: 'laboratory_tests',
  code: 'code',
  display_order: 'display_order',
  mnemonics: 'mnemonics',
  test_type: 'test_type',
  sub_department: 'sub_department',
  sample_type: 'sample_type',
  container_type: 'container_type',
  confidential: 'confidential',
  methodology: 'methodology',
  transport_temperature: 'transport_temperature',
  tat: 'tat',
  outsourcing_status: 'outsourcing_status',
  instrument: 'instrument',
  laboratory_id: 'laboratory_id',
  test_price: 'test_price',
  custom_test_name: 'custom_test_name',
  instruction: 'instruction',
  test_method: 'test_method',
  status: 'status',
  status_changed_by: 'status_changed_by',
  status_changed_on: 'status_changed_on',
  unit: 'unit',
  reference_range: 'reference_range',
  age_gender_specific: 'age_gender_specific',
  critical_alert: 'critical_alert',
  interpretation: 'interpretation',
  sort_order: 'sort_order',
  title_required: 'title_required'
};

exports.Prisma.LocalityScalarFieldEnum = {
  locality_id: 'locality_id',
  locality_name: 'locality_name',
  city_id: 'city_id',
  active: 'active'
};

exports.Prisma.Login_detailsScalarFieldEnum = {
  login_id: 'login_id',
  firstname: 'firstname',
  physician_id: 'physician_id',
  laboratory_id: 'laboratory_id',
  patient_id: 'patient_id',
  phy_admin_id: 'phy_admin_id',
  username: 'username',
  password: 'password',
  phone_num: 'phone_num',
  state: 'state',
  city: 'city',
  count: 'count',
  role_id: 'role_id',
  active: 'active',
  last_login: 'last_login',
  created_on: 'created_on',
  updated_on: 'updated_on',
  otp: 'otp',
  device_id: 'device_id',
  player_id: 'player_id'
};

exports.Prisma.MedicineScalarFieldEnum = {
  ID: 'ID',
  medicine_name: 'medicine_name',
  active: 'active'
};

exports.Prisma.Notification_keysScalarFieldEnum = {
  notification_keys_id: 'notification_keys_id',
  app_id: 'app_id',
  rest_api_key: 'rest_api_key'
};

exports.Prisma.NotificationattemptScalarFieldEnum = {
  notificationattempt_id: 'notificationattempt_id',
  login_id: 'login_id',
  notification_heading: 'notification_heading',
  notification_message: 'notification_message',
  notification_type: 'notification_type',
  CreatedDateTime: 'CreatedDateTime',
  notification_medium: 'notification_medium',
  SendDateTime: 'SendDateTime',
  status: 'status'
};

exports.Prisma.RenamedpackageScalarFieldEnum = {
  id: 'id',
  package_name: 'package_name',
  created_on: 'created_on',
  created_by: 'created_by'
};

exports.Prisma.Package_containsScalarFieldEnum = {
  id: 'id',
  package_id: 'package_id',
  test_id: 'test_id',
  created_on: 'created_on',
  is_active: 'is_active'
};

exports.Prisma.Package_labsScalarFieldEnum = {
  id: 'id',
  package_id: 'package_id',
  lab_id: 'lab_id',
  package_price: 'package_price',
  created_on: 'created_on',
  created_by: 'created_by'
};

exports.Prisma.Package_queueScalarFieldEnum = {
  id: 'id',
  medical_num: 'medical_num',
  package_id: 'package_id',
  lab_id: 'lab_id',
  patient_id: 'patient_id',
  dependent_id: 'dependent_id',
  doctor_id: 'doctor_id',
  referdate: 'referdate',
  created_by: 'created_by',
  created_on: 'created_on',
  package_status: 'package_status'
};

exports.Prisma.Patient_dep_detailsScalarFieldEnum = {
  patient_dep_id: 'patient_dep_id',
  firstname: 'firstname',
  lastname: 'lastname',
  gender: 'gender',
  date_of_birth: 'date_of_birth',
  age: 'age',
  address: 'address',
  city: 'city',
  pincode: 'pincode',
  mailid: 'mailid',
  phonenum: 'phonenum',
  alt_phonenum: 'alt_phonenum',
  relationship: 'relationship',
  main_pat_id: 'main_pat_id',
  created_on: 'created_on',
  updated_on: 'updated_on',
  active: 'active',
  role_id: 'role_id',
  patient_unique_id: 'patient_unique_id',
  physician_id: 'physician_id',
  status: 'status',
  r_count: 'r_count',
  count: 'count',
  prescribe_receipt: 'prescribe_receipt'
};

exports.Prisma.Patient_doctor_mappingScalarFieldEnum = {
  patient_doctor_mapping_id: 'patient_doctor_mapping_id',
  referral_patient_id: 'referral_patient_id',
  prev_physician_id: 'prev_physician_id',
  new_physician_id: 'new_physician_id',
  patient_unique_id: 'patient_unique_id',
  added_date: 'added_date'
};

exports.Prisma.Patient_parameterScalarFieldEnum = {
  parameter_id: 'parameter_id',
  date_of_birth: 'date_of_birth',
  known_allergies: 'known_allergies',
  previous_medical_history: 'previous_medical_history',
  blood_group: 'blood_group',
  diabetic: 'diabetic',
  hypertension: 'hypertension',
  referral_patient_id: 'referral_patient_id',
  dependent_id: 'dependent_id',
  created_on: 'created_on'
};

exports.Prisma.PatientqueueScalarFieldEnum = {
  patientqueue_id: 'patientqueue_id',
  BillId: 'BillId',
  medical_num: 'medical_num',
  firstname: 'firstname',
  mailid: 'mailid',
  phonenum: 'phonenum',
  refer_date: 'refer_date',
  patient_unique_id: 'patient_unique_id',
  physician_id: 'physician_id',
  phyfname: 'phyfname',
  referred_id: 'referred_id',
  ID: 'ID',
  billing_id: 'billing_id',
  laboratory_id: 'laboratory_id',
  ref_type: 'ref_type',
  lab_test_status: 'lab_test_status',
  billing_status: 'billing_status',
  is_sync: 'is_sync',
  created_on: 'created_on'
};

exports.Prisma.PaymentScalarFieldEnum = {
  ID: 'ID',
  doctor_id: 'doctor_id',
  referral_patient_id: 'referral_patient_id',
  dependent_id: 'dependent_id',
  Receipt_id: 'Receipt_id',
  prescription_num: 'prescription_num',
  reg_fee: 'reg_fee',
  con_price: 'con_price',
  med_price: 'med_price',
  inv_price: 'inv_price',
  admin_price: 'admin_price',
  total_price: 'total_price',
  mode: 'mode',
  created_on: 'created_on',
  updated_on: 'updated_on',
  submitted: 'submitted'
};

exports.Prisma.Phy_adminScalarFieldEnum = {
  phy_admin_id: 'phy_admin_id',
  phy_admin_name: 'phy_admin_name',
  phy_admin_phone: 'phy_admin_phone',
  phy_admin_mail_id: 'phy_admin_mail_id',
  phy_admin_password: 'phy_admin_password',
  created_on: 'created_on',
  updated_on: 'updated_on',
  created_by: 'created_by',
  physician_id: 'physician_id',
  active: 'active',
  is_visible: 'is_visible',
  role_id: 'role_id'
};

exports.Prisma.Physician_appointmentScalarFieldEnum = {
  physician_id: 'physician_id',
  firstname: 'firstname',
  lastname: 'lastname',
  phone_num: 'phone_num',
  alternate_phone_number: 'alternate_phone_number',
  mail_id: 'mail_id',
  pincode: 'pincode',
  clinic_name: 'clinic_name',
  clinic_phonenum: 'clinic_phonenum',
  clinic_alternate_phonenum: 'clinic_alternate_phonenum',
  clinic_manager: 'clinic_manager',
  specialization: 'specialization',
  address: 'address',
  consultation_fee_validity: 'consultation_fee_validity',
  city: 'city',
  state: 'state',
  active: 'active',
  created_by: 'created_by',
  created_on: 'created_on',
  updated_on: 'updated_on',
  password: 'password',
  role_id: 'role_id',
  profile_filename: 'profile_filename',
  profile_fullpath: 'profile_fullpath',
  qualification_id: 'qualification_id',
  registration_number: 'registration_number',
  time_span: 'time_span',
  status: 'status',
  locality: 'locality',
  created_by_id: 'created_by_id',
  clinic_module_activated: 'clinic_module_activated',
  Signature_image: 'Signature_image'
};

exports.Prisma.Physician_clinic_timingsScalarFieldEnum = {
  id: 'id',
  physician_id: 'physician_id',
  theday: 'theday',
  work_type: 'work_type',
  clinic: 'clinic',
  start_time: 'start_time',
  end_time: 'end_time',
  created_time: 'created_time',
  updated_time: 'updated_time'
};

exports.Prisma.Physician_leavesScalarFieldEnum = {
  id: 'id',
  physician_id: 'physician_id',
  dates: 'dates',
  start_time: 'start_time',
  end_time: 'end_time',
  reason: 'reason',
  created_time: 'created_time'
};

exports.Prisma.Physician_timingsScalarFieldEnum = {
  id: 'id',
  physician_id: 'physician_id',
  theday: 'theday',
  work_type: 'work_type',
  start_time: 'start_time',
  end_time: 'end_time',
  created_time: 'created_time',
  updated_time: 'updated_time'
};

exports.Prisma.PreferredlabsScalarFieldEnum = {
  preferredlabs_id: 'preferredlabs_id',
  laboratory_id: 'laboratory_id',
  physician_id: 'physician_id',
  is_active: 'is_active'
};

exports.Prisma.PrescriptionScalarFieldEnum = {
  prescription_id: 'prescription_id',
  prescription_num: 'prescription_num',
  patient_id: 'patient_id',
  dependent_id: 'dependent_id',
  doctor_id: 'doctor_id',
  symptoms: 'symptoms',
  type: 'type',
  med_name: 'med_name',
  mg: 'mg',
  dose: 'dose',
  num_days: 'num_days',
  instruction: 'instruction',
  advice: 'advice',
  created_on: 'created_on'
};

exports.Prisma.Prescription_medicineScalarFieldEnum = {
  medicine_id: 'medicine_id',
  type: 'type',
  med_name: 'med_name',
  mg: 'mg',
  dose: 'dose',
  num_days: 'num_days',
  instruction: 'instruction',
  advice: 'advice',
  prescription_id: 'prescription_id'
};

exports.Prisma.QualificationScalarFieldEnum = {
  qualification_id: 'qualification_id',
  qualification_name: 'qualification_name',
  is_active: 'is_active'
};

exports.Prisma.Qualification_mappingScalarFieldEnum = {
  qualification_mapping_id: 'qualification_mapping_id',
  qualification_id: 'qualification_id',
  physician_id: 'physician_id'
};

exports.Prisma.Referral_confirmation_detailsScalarFieldEnum = {
  referred_id: 'referred_id',
  medical_num: 'medical_num',
  relationship: 'relationship',
  referral_pat_id: 'referral_pat_id',
  password: 'password',
  patient_unique_id: 'patient_unique_id',
  attempts: 'attempts',
  brief_history: 'brief_history',
  phy_advice: 'phy_advice',
  refer_date: 'refer_date',
  created_by: 'created_by',
  login_id: 'login_id',
  created_on: 'created_on',
  ref_type: 'ref_type',
  lab_test_status: 'lab_test_status',
  billing_status: 'billing_status'
};

exports.Prisma.Referral_confirmation_details1ScalarFieldEnum = {
  referred_id: 'referred_id',
  medical_num: 'medical_num',
  relationship: 'relationship',
  referral_pat_id: 'referral_pat_id',
  password: 'password',
  patient_unique_id: 'patient_unique_id',
  attempts: 'attempts',
  brief_history: 'brief_history',
  phy_advice: 'phy_advice',
  refer_date: 'refer_date',
  created_by: 'created_by',
  login_id: 'login_id',
  created_on: 'created_on',
  ref_type: 'ref_type',
  lab_test_status: 'lab_test_status'
};

exports.Prisma.Referral_patient_detailsScalarFieldEnum = {
  referral_patient_id: 'referral_patient_id',
  firstname: 'firstname',
  lastname: 'lastname',
  gender: 'gender',
  date_of_birth: 'date_of_birth',
  age: 'age',
  address: 'address',
  state: 'state',
  city: 'city',
  pincode: 'pincode',
  mailid: 'mailid',
  phonenum: 'phonenum',
  alt_phonenum: 'alt_phonenum',
  password: 'password',
  relationship: 'relationship',
  created_on: 'created_on',
  updated_on: 'updated_on',
  active: 'active',
  role_id: 'role_id',
  patient_unique_id: 'patient_unique_id',
  physician_id: 'physician_id',
  status: 'status',
  r_count: 'r_count',
  profile_filename: 'profile_filename',
  profile_fullpath: 'profile_fullpath',
  main_pat_id: 'main_pat_id',
  patient_dep_id: 'patient_dep_id',
  count: 'count',
  prescribe_receipt: 'prescribe_receipt'
};

exports.Prisma.Referral_patient_test_detailsScalarFieldEnum = {
  ID: 'ID',
  medical_num: 'medical_num',
  laboratory_tests: 'laboratory_tests',
  parse_parent_id: 'parse_parent_id',
  has_child: 'has_child',
  time: 'time',
  date: 'date',
  instruction: 'instruction',
  patient_unique_id: 'patient_unique_id',
  physician_id: 'physician_id',
  laboratory_id: 'laboratory_id',
  dependent_id: 'dependent_id',
  main_patient_id: 'main_patient_id',
  billing_id: 'billing_id',
  billing_datetime: 'billing_datetime',
  sample_collected_id: 'sample_collected_id',
  sample_datetime: 'sample_datetime',
  labapproval_id: 'labapproval_id',
  labapproval_datetime: 'labapproval_datetime',
  pat_status: 'pat_status',
  report_filename: 'report_filename',
  report_fullpath: 'report_fullpath',
  approved_lab_doc_id: 'approved_lab_doc_id',
  editor: 'editor',
  created_on: 'created_on'
};

exports.Prisma.RelationshipScalarFieldEnum = {
  rel_id: 'rel_id',
  rel_name: 'rel_name',
  active: 'active'
};

exports.Prisma.Report_templateScalarFieldEnum = {
  template_id: 'template_id',
  header: 'header',
  footer: 'footer',
  print_size: 'print_size',
  lab_id: 'lab_id',
  created_on: 'created_on',
  status: 'status'
};

exports.Prisma.Sample_resultsScalarFieldEnum = {
  result_id: 'result_id',
  sample_value: 'sample_value',
  referral_test_ID: 'referral_test_ID',
  created_on: 'created_on'
};

exports.Prisma.Ssconsultation_billingScalarFieldEnum = {
  ssbilling_id: 'ssbilling_id',
  ss_id: 'ss_id',
  tot_amt: 'tot_amt',
  lab_id: 'lab_id',
  unique_billid: 'unique_billid',
  created_on: 'created_on'
};

exports.Prisma.Ssconsultation_logScalarFieldEnum = {
  ssconsultation_log_id: 'ssconsultation_log_id',
  ssbilling_id: 'ssbilling_id',
  amt: 'amt',
  payment_method: 'payment_method',
  added_date: 'added_date'
};

exports.Prisma.StateScalarFieldEnum = {
  state_id: 'state_id',
  state_name: 'state_name',
  country_id: 'country_id',
  active: 'active'
};

exports.Prisma.Status_masterScalarFieldEnum = {
  status_id: 'status_id',
  status: 'status'
};

exports.Prisma.Super_specialityScalarFieldEnum = {
  superspeciality_id: 'superspeciality_id',
  superspeciality_name: 'superspeciality_name',
  created_on: 'created_on',
  active: 'active'
};

exports.Prisma.Superspeciality_consultationScalarFieldEnum = {
  ss_id: 'ss_id',
  laboratory_id: 'laboratory_id',
  referral_patient_id: 'referral_patient_id',
  patient_dep_id: 'patient_dep_id',
  superspeciality_id: 'superspeciality_id',
  comments: 'comments',
  by_assign: 'by_assign',
  to_assign: 'to_assign',
  referdate: 'referdate',
  refertime: 'refertime',
  referclinic_name: 'referclinic_name',
  consultationId: 'consultationId',
  consultationDate: 'consultationDate',
  consultationAmount: 'consultationAmount',
  miscellaneousAmount: 'miscellaneousAmount',
  totalAmount: 'totalAmount',
  status: 'status'
};

exports.Prisma.Superspeciality_detailsScalarFieldEnum = {
  speciality_id: 'speciality_id',
  referral_patient_id: 'referral_patient_id',
  patient_dep_id: 'patient_dep_id',
  superspeciality_id: 'superspeciality_id',
  comments: 'comments',
  by_assign: 'by_assign',
  to_assign: 'to_assign',
  referdate: 'referdate',
  refertime: 'refertime',
  referclinic_name: 'referclinic_name',
  created_on: 'created_on',
  active: 'active',
  laboratory_id: 'laboratory_id'
};

exports.Prisma.Test_report_notesScalarFieldEnum = {
  test_report_notes_id: 'test_report_notes_id',
  laboratory_tests: 'laboratory_tests',
  medical_num: 'medical_num',
  referral_patient_test_details_id: 'referral_patient_test_details_id',
  title: 'title',
  description: 'description',
  added_date: 'added_date'
};

exports.Prisma.Update_labsScalarFieldEnum = {
  update_labid: 'update_labid',
  laboratory_id: 'laboratory_id',
  phonenum_doesnt_exist: 'phonenum_doesnt_exist',
  print_billing: 'print_billing',
  collection_report: 'collection_report',
  test_report: 'test_report',
  active: 'active'
};

exports.Prisma.UserScalarFieldEnum = {
  role_id: 'role_id',
  name: 'name',
  active: 'active',
  created_on: 'created_on'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.files_status = exports.$Enums.files_status = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.lab_timings_work_type = exports.$Enums.lab_timings_work_type = {
  WORKING_DAY: 'WORKING_DAY',
  HOLI_DAY: 'HOLI_DAY'
};

exports.laboratory_test_details_status = exports.$Enums.laboratory_test_details_status = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.physician_clinic_timings_work_type = exports.$Enums.physician_clinic_timings_work_type = {
  WORKING_DAY: 'WORKING_DAY',
  HOLI_DAY: 'HOLI_DAY'
};

exports.physician_timings_work_type = exports.$Enums.physician_timings_work_type = {
  WORKING_DAY: 'WORKING_DAY',
  HOLI_DAY: 'HOLI_DAY'
};

exports.referral_confirmation_details_ref_type = exports.$Enums.referral_confirmation_details_ref_type = {
  I: 'I',
  P: 'P'
};

exports.referral_confirmation_details1_ref_type = exports.$Enums.referral_confirmation_details1_ref_type = {
  I: 'I',
  P: 'P'
};

exports.Prisma.ModelName = {
  barcode: 'barcode',
  billing: 'billing',
  billing_log: 'billing_log',
  bloodgroup_details: 'bloodgroup_details',
  city: 'city',
  clinic_module_activation_request: 'clinic_module_activation_request',
  clinical_parameters: 'clinical_parameters',
  contact: 'contact',
  country: 'country',
  files: 'files',
  investigation_details: 'investigation_details',
  investigation_file: 'investigation_file',
  investigation_test_details: 'investigation_test_details',
  lab_leaves: 'lab_leaves',
  lab_tests_price_updates: 'lab_tests_price_updates',
  lab_timings: 'lab_timings',
  laboratory_details: 'laboratory_details',
  laboratory_doctors: 'laboratory_doctors',
  laboratory_test_details: 'laboratory_test_details',
  locality: 'locality',
  login_details: 'login_details',
  medicine: 'medicine',
  notification_keys: 'notification_keys',
  notificationattempt: 'notificationattempt',
  Renamedpackage: 'Renamedpackage',
  package_contains: 'package_contains',
  package_labs: 'package_labs',
  package_queue: 'package_queue',
  patient_dep_details: 'patient_dep_details',
  patient_doctor_mapping: 'patient_doctor_mapping',
  patient_parameter: 'patient_parameter',
  patientqueue: 'patientqueue',
  payment: 'payment',
  phy_admin: 'phy_admin',
  physician_appointment: 'physician_appointment',
  physician_clinic_timings: 'physician_clinic_timings',
  physician_leaves: 'physician_leaves',
  physician_timings: 'physician_timings',
  preferredlabs: 'preferredlabs',
  prescription: 'prescription',
  prescription_medicine: 'prescription_medicine',
  qualification: 'qualification',
  qualification_mapping: 'qualification_mapping',
  referral_confirmation_details: 'referral_confirmation_details',
  referral_confirmation_details1: 'referral_confirmation_details1',
  referral_patient_details: 'referral_patient_details',
  referral_patient_test_details: 'referral_patient_test_details',
  relationship: 'relationship',
  report_template: 'report_template',
  sample_results: 'sample_results',
  ssconsultation_billing: 'ssconsultation_billing',
  ssconsultation_log: 'ssconsultation_log',
  state: 'state',
  status_master: 'status_master',
  super_speciality: 'super_speciality',
  superspeciality_consultation: 'superspeciality_consultation',
  superspeciality_details: 'superspeciality_details',
  test_report_notes: 'test_report_notes',
  update_labs: 'update_labs',
  user: 'user'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
