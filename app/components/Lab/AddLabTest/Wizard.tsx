"use client";

import { useMemo, useState } from "react";
import { Stepper, StepId, STEPS } from "./Stepper";
import SearchPatient from "./SearchPatient";
import AddPatient from "./AddPatient";
import DoctorDetails from "./DoctorDetails";
import TestsSelection from "./TestsSelection";
import Confirm from "./Confirm";

export default function AddLabTestWizard() {
  const [active, setActive] = useState<StepId>("search");
  const [data, setData] = useState<{
    phone?: string;
    patient?: Record<string, unknown>;
    doctor?: Record<string, unknown>;
    tests?: string[];
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
          onNext={({ phone }) => {
            setData((d) => ({ ...d, phone }));
            next("add");
          }}
        />
      ) : active === "add" ? (
        <AddPatient
          initial={{ phone: data.phone }}
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



