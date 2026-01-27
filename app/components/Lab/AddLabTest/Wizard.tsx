"use client";

import { useMemo, useState } from "react";
import { Stepper, StepId, STEPS } from "./Stepper";
import SearchPatient from "./SearchPatient";
import AddPatient from "./AddPatient";
import DoctorDetails from "./DoctorDetails";
import TestsSelection from "./TestsSelection";
import Confirm from "./Confirm";
import { PatientQueueResult, SelectedTest } from "../../../config/lab/AllLabTest/Wizard";


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

  const stepOrder: StepId[] = useMemo(
    () => ["search", "add", "doctor", "tests", "confirm"],
    []
  );
  const selectableSteps: StepId[] = useMemo(() => {
    const i = stepOrder.indexOf(active);
    if (i < 0) return stepOrder;
    const currentAndPrevious = stepOrder.slice(0, i + 1);
    const canGoForward = completed.includes(active);
    return canGoForward && i + 1 < stepOrder.length
      ? [...currentAndPrevious, stepOrder[i + 1]]
      : currentAndPrevious;
  }, [active, stepOrder, completed]);

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
        selectableSteps={selectableSteps}
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
                  email: patient.mailid || "",
                  patient_unique_id: patient.patient_unique_id, // Pass existing patient_unique_id
                  // Note: The API will use this to find the existing patient
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
          summary={{
            phone: data.phone,
            patient: data.patient,
            doctor: data.doctor,
            tests: data.tests,
          }}
          onPrev={() => next("tests")}
          onFinish={() => {
            // Reset the wizard after successful submission
            setActive("search");
            setData({});
          }}
        />
      )}
    </div>
  );
}



