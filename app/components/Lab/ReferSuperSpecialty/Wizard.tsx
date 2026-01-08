"use client";

import { useMemo, useState } from "react";
import { Stepper, StepId, STEPS } from "./Stepper";
import SearchPatient from "./SearchPatient";
import AddPatient from "./AddPatient";
import SuperSpeciality from "./SuperSpeciality";

export default function ReferSuperSpecialtyWizard() {
  const [active, setActive] = useState<StepId>("search");
  const [data, setData] = useState<{
    phone?: string;
    patient?: Record<string, unknown>;
    specialist?: Record<string, unknown>;
  }>({});

  const completed: StepId[] = useMemo(() => {
    const done: StepId[] = [];
    if (data.phone) done.push("search");
    if (data.patient) done.push("add");
    if (data.specialist) done.push("super");
    return done;
  }, [data]);

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        Add / Refer Patient to Specialist
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
            setActive("add");
          }}
        />
      ) : active === "add" ? (
        <AddPatient
          initial={{ phone: data.phone }}
          onPrev={() => setActive("search")}
          onNext={(patient) => {
            setData((d) => ({ ...d, patient }));
            setActive("super");
          }}
        />
      ) : (
        <SuperSpeciality
          onPrev={() => setActive("add")}
          onFinish={({ specialist }) => {
            setData((d) => ({ ...d, specialist }));
            // Reset for now after finish
            setActive("search");
          }}
        />
      )}
    </div>
  );
}



