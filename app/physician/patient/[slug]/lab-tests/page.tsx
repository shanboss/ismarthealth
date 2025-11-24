"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function LabTestsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const groups = useMemo(
    () => ({
      MRI: [
        "MRA BRAIN WITH CONTRAST",
        "MRCP",
        "MRCP CONTRAST",
        "MRI ABDOMEN AND PELVIS PLAIN",
        "MRI ABDOMEN AND PELVIS PLAIN WITH CONTRAST",
        "MRI ABDOMEN PLAIN",
        "MRI ABDOMEN WITH CONTRAST",
        "MRI AORTA WITH PERIPHERAL ANGIO",
        "MRI BRAIN + CAROTID ANGIO CONTRAST",
        "MRI BRAIN + CAROTID ANGIO PLAIN",
        "MRI BRAIN PLAIN",
        "MRI BRAIN PLAIN CONTRAST",
        "MRI BREAST PLAIN",
        "MRI BREAST WITH CONTRAST",
        "MRI CERVICAL SPINE",
        "MRI CERVICAL SPINE WITH CONTRAST",
        "MRI CHEST PLAIN/PULMANARY",
        "MRI CHEST WITH CONTRAST",
        "MRI LS SPINE",
        "MRI LS SPINE WITH CONTRAST",
      ],
      "ULTRASOUND/SONOGRAPHY": [
        "Ultrasound cranium",
        "Ultrasound abdomen & pelvis",
        "Ultrasound Breast",
        "Ultrasound Early pregnancy scan",
        "Ultrasound endorectal(N)",
        "Ultrasound endovaginal(N)",
        "Ultrasound Follicular Study",
        "Ultrasound guided aspiration(N)",
        "Ultrasound guided FNAC",
        "Ultrasound musculoskeletal system",
        "Ultrasound neck",
        "Ultrasound thyroid",
        "US Chest",
      ],
      "X-RAY": [
        "X-Ray Barium Enema",
        "xray abdomen AP supine",
        "xray AP & lateral single joint",
        "xray AP single joint",
        "Xray Ascending uretherogram (ASU)",
        "Xray Barium meal follow through",
        "Xray Barium meal upper GI",
        "Xray Barium swallow",
        "Xray cervical spine AP & lateral view",
        "xray cervical spine lateral",
        "Xray chest AP",
      ],
      "LAB INVESTIGATION": [
        "24 Hours Urine Protein",
        "Absolute Eosinophil Count",
        "Adenosine Deaminase",
        "Albumin",
        "Alkaline Phosphatase Serum",
        "Anti Nuclear Antibody (Qualitative)",
        "Anti Nuclear Antibody (Quantitative)",
        "Anti Streptolysin O Antibody",
        "Arterial Blood Gas Panel",
        "Bilirubin (Total & Direct) Panel",
        "Creatinine Serum",
        "CSF Analysis",
        "Erythrocyte Sedimentation Rate",
        "Fasting Blood Sugar",
        "HbA1C",
        "Kidney Function Test",
        "Liver Function Test",
        "Lipid Profile",
        "Platelet Count",
        "Random Blood Sugar",
        "Total Cholesterol",
        "Triglycerides",
        "Vitamin B12",
      ],
      "CT SCAN": [
        "CT abdomen and pelvis",
        "CT Brain (Plain)",
        "CT cervical spine",
        "CT head (bone window)",
        "CT hip joint both sides",
        "CT Lumbar spine",
        "CT neck(N)",
        "CT Orbits",
        "CT Pelvis",
        "CT Thorax",
        "CT wrist left side",
        "CT wrist right side",
      ],
      "ECHO/TMT": ["Echo", "Fetal Echo"],
      "DOPPLER INVESTIGATION": [
        "Doppler both arms arterial",
        "Doppler both arms venous",
        "Doppler Renal Arterial",
        "Venous Doppler",
      ],
      PHYSIOTHERAPY: ["Physiotherapy"],
      CARDIAC: [
        "Electrocardiogram (ECG)",
        "Echocardiogram (ECHO)",
        "Treadmill Test (TMT)",
        "Chest X-ray (CXR)",
      ],
    }),
    []
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(Object.keys(groups).map((g) => [g, false]))
  );

  function toggleGroup(name: string) {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function toggleItem(group: string, label: string) {
    const key = `${group}::${label}`;
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]
    );
  }
  function removeSelected(key: string) {
    setSelected((prev) => prev.filter((v) => v !== key));
  }

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return groups;
    const next: Record<string, string[]> = {};
    for (const [group, items] of Object.entries(groups)) {
      const filtered = items.filter((label) => label.toLowerCase().includes(q));
      if (filtered.length) next[group] = filtered;
    }
    return next;
  }, [groups, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground transition hover:bg-foreground/10"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>
      <h1 className="text-3xl font-semibold border-b border-neutral-200">
        Order lab tests for {params?.slug}
      </h1>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4">
            <label className="sr-only" htmlFor="test-search">
              Search tests
            </label>
            <input
              id="test-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests..."
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">Select tests</p>
            {Object.entries(filteredGroups).map(([group, items]) => {
              if (!items.length) return null;
              const opened = isSearching ? true : !!openGroups[group];
              return (
                <div
                  key={group}
                  className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-foreground hover:opacity-90"
                    aria-expanded={opened}
                    aria-controls={`group-${group}`}
                  >
                    <span>{group}</span>
                    <span className="select-none text-xl leading-none">
                      {opened ? "−" : "+"}
                    </span>
                  </button>
                  {opened ? (
                    <ul
                      id={`group-${group}`}
                      className="divide-y divide-foreground/10"
                    >
                      {items.map((label) => {
                        const key = `${group}::${label}`;
                        const checked = selected.includes(key);
                        return (
                          <li key={key} className="flex items-center">
                            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 py-2 hover:bg-foreground/5">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-foreground/30 bg-background text-foreground focus:ring-foreground"
                                checked={checked}
                                onChange={() => toggleItem(group, label)}
                              />
                              <span className="truncate text-sm text-foreground">
                                {label}
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                !checked ? toggleItem(group, label) : undefined
                              }
                              className="m-2 inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background p-1 text-foreground transition hover:opacity-80 disabled:opacity-40"
                              disabled={checked}
                              aria-label={`Add ${label}`}
                              title={
                                checked ? "Already selected" : "Add to selected"
                              }
                            >
                              <PlusIcon className="h-5 w-5" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <aside className="h-fit rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Selected Tests</h2>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-foreground/20 bg-foreground px-3 py-1.5 text-sm font-medium text-background transition hover:opacity-80 active:scale-95 disabled:opacity-40"
              disabled={selected.length === 0}
              aria-disabled={selected.length === 0}
            >
              Send tests
            </button>
          </div>
          <p className="mt-1 text-xs text-foreground/60">
            Selected Items ({selected.length})
          </p>
          <div className="mt-2 h-px w-full bg-foreground/10" />
          {selected.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {selected.map((v) => {
                const [group, label] = v.split("::");
                return (
                  <li key={v} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{label}</div>
                      <div className="truncate text-xs text-foreground/60">
                        {group}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelected(v)}
                      className="ml-1 inline-flex h-8 w-8 aspect-square shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-background text-red-600 transition hover:bg-foreground/10 hover:opacity-90"
                      aria-label={`Remove ${label}`}
                      title="Remove"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-foreground/60">
              No tests selected.
            </p>
          )}
        </aside>
      </div>
      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-4 w-full max-w-md rounded-lg border border-foreground/10 bg-background p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Send selected tests?
            </h3>
            <p className="mt-2 text-sm text-foreground/70">
              You are about to send {selected.length} test
              {selected.length === 1 ? "" : "s"} for patient {params?.slug}. You
              can still make changes before confirming.
            </p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground transition hover:bg-foreground/10"
              >
                Make changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  try {
                    const payload = {
                      patientSlug: params?.slug ?? "",
                      tests: selected,
                      createdAt: Date.now(),
                    };
                    localStorage.setItem(
                      "ismh_pending_tests",
                      JSON.stringify(payload)
                    );
                  } catch {}
                  router.push("/physician/select-lab");
                }}
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
              >
                Send tests
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
