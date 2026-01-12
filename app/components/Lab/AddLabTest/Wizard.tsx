"use client";

import { useMemo, useState } from "react";
import { Stepper, StepId, STEPS } from "./Stepper";
import SearchPatient from "./SearchPatient";
import AddPatient from "./AddPatient";
import DoctorDetails from "./DoctorDetails";
import TestsSelection from "./TestsSelection";
import Confirm from "./Confirm";

type PatientQueueResult = {
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

type SelectedTest = {
  id: number;
  name: string;
  department: string;
  price: string;
  code: string;
};

export default function AddLabTestWizard() {
  const [active, setActive] = useState<StepId>("search");
  const [data, setData] = useState<{
    phone?: string;
    selectedPatient?: PatientQueueResult;
    patient?: Record<string, unknown>;
    doctor?: Record<string, unknown>;
    tests?: SelectedTest[];
  }>({});

  const completed: StepId[] = useMemo(() => {
    const done: StepId[] = [];
    if (data.phone) done.push("search");
    if (data.patient) done.push("add");
    if (data.doctor) done.push("doctor");
    if (data.tests && data.tests.length > 0) done.push("tests");
    return done;
  }, [data]);

  function next(step: StepId) {
    setActive(step);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        Add / Refer Patient to Lab Tests
      </h1>

      <Stepper
        activeStep={active}
        completed={completed}
        onSelect={(s) => setActive(s)}
      />

      {active === "search" ? (
        <SearchPatient
          onNext={({ phone, patient }) => {
            if (patient) {
              // Patient found and selected, skip to doctor details
              // Also mark the add step as completed by setting patient data
              setData((d) => ({
                ...d,
                phone,
                selectedPatient: patient,
                patient: {
                  firstName: patient.firstname,
                  phone: patient.phonenum,
                  email: patient.mailid,
                  // Include other relevant patient data
                },
              }));
              next("doctor");
            } else {
              // No patient selected, go to add patient page
              setData((d) => ({ ...d, phone, selectedPatient: undefined }));
              next("add");
            }
          }}
        />
      ) : active === "add" ? (
        <AddPatient
          initial={{
            phone: data.selectedPatient?.phonenum || data.phone,
            firstName: data.selectedPatient?.firstname || "",
            email: data.selectedPatient?.mailid || "",
          }}
          onPrev={() => next("search")}
          onNext={(patient) => {
            setData((d) => ({ ...d, patient }));
            next("doctor");
          }}
        />
      ) : active === "doctor" ? (
        <DoctorDetails
          onPrev={() => next("add")}
          onNext={(doctor) => {
            setData((d) => ({ ...d, doctor }));
            next("tests");
          }}
        />
      ) : active === "tests" ? (
        <TestsSelection
          onPrev={() => next("doctor")}
          onNext={(tests) => {
            setData((d) => ({ ...d, tests }));
            next("confirm");
          }}
        />
      ) : (
        <Confirm
          summary={data}
          onPrev={() => next("tests")}
          onFinish={() => {
            // For now, just reset the wizard
            setActive("search");
            setData({});
          }}
        />
      )}
    </div>
  );
}



