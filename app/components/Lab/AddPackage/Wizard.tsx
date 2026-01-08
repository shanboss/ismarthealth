"use client";

import { useMemo, useState } from "react";
import { Stepper, StepId, STEPS } from "./Stepper";
import SearchPatient from "./SearchPatient";
import AddPatient from "./AddPatient";
import AvailablePackage from "./AvailablePackage";
import Confirm from "./Confirm";

export default function AddPackageWizard() {
  const [active, setActive] = useState<StepId>("search");
  const [data, setData] = useState<{
    phone?: string;
    patient?: Record<string, unknown>;
    pkg?: Record<string, unknown>;
  }>({});

  const completed: StepId[] = useMemo(() => {
    const done: StepId[] = [];
    if (data.phone) done.push("search");
    if (data.patient) done.push("add");
    if (data.pkg) done.push("packages");
    return done;
  }, [data]);

  function next(step: StepId) {
    setActive(step);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        Add / Refer Patient to Packages
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
            next("packages");
          }}
        />
      ) : active === "packages" ? (
        <AvailablePackage
          onPrev={() => next("add")}
          onNext={(pkg) => {
            setData((d) => ({ ...d, pkg }));
            next("confirm");
          }}
        />
      ) : (
        <Confirm
          summary={data}
          onPrev={() => next("packages")}
          onFinish={() => {
            setActive("search");
            setData({});
          }}
        />
      )}
    </div>
  );
}



