"use client";

import { useMemo, useState } from "react";
import { Stepper, StepId } from "./Stepper";
import SearchPatient from "./SearchPatient";
import AddPatient from "./AddPatient";
import SuperSpeciality from "./SuperSpeciality";
import Confirm from "./Confirm";
import type { PatientQueueResult } from "../../../config/lab/ReferSuperSpecialty/SearchPatient";

export default function ReferSuperSpecialtyWizard() {
  const [active, setActive] = useState<StepId>("search");
  const [data, setData] = useState<{
    phone?: string;
    selectedPatient?: PatientQueueResult;
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

  const stepOrder: StepId[] = useMemo(
    () => ["search", "add", "super", "confirm"],
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

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        Add / Refer Patient to Specialist
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
              setData((d) => ({
                ...d,
                phone,
                selectedPatient: patient,
                patient: {
                  firstName: patient.firstname,
                  phone: patient.phonenum,
                  email: patient.mailid || "",
                  patient_unique_id: patient.patient_unique_id,
                },
              }));
            } else {
              setData((d) => ({ ...d, phone, selectedPatient: undefined }));
            }
            setActive("add");
          }}
        />
      ) : active === "add" ? (
        <AddPatient
          initial={{
            phone: data.selectedPatient?.phonenum || data.phone,
            firstname: data.selectedPatient?.firstname,
            phonenum: data.selectedPatient?.phonenum,
            mailid: data.selectedPatient?.mailid,
            patient_unique_id: data.selectedPatient?.patient_unique_id,
          }}
          selectedPatient={data.selectedPatient}
          onPrev={() => setActive("search")}
          onNext={(patient) => {
            setData((d) => ({ ...d, patient }));
            setActive("super");
          }}
        />
      ) : active === "super" ? (
        <SuperSpeciality
          onPrev={() => setActive("add")}
          onNext={({ specialist }) => {
            setData((d) => ({ ...d, specialist }));
            setActive("confirm");
          }}
        />
      ) : (
        <Confirm
          summary={{
            patient: data.patient,
            specialist: data.specialist,
          }}
          onPrev={() => setActive("super")}
          onFinish={() => {
            setActive("search");
            setData({});
          }}
        />
      )}
    </div>
  );
}
