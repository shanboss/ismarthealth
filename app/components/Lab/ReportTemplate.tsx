"use client";

import { useState } from "react";

type ReportSettings = {
  header: boolean;
  footer: boolean;
  pageSize: "A4" | "A5";
};

export default function ReportTemplate() {
  const [settings, setSettings] = useState<ReportSettings>({
    header: true,
    footer: true,
    pageSize: "A4",
  });

  const handleSave = () => {
    console.log("Saving report settings:", settings);
    alert("Report template settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-normal tracking-tight text-foreground">
          Report Template
        </h1>
      </div>

      <div className="h-1 bg-blue-500"></div>

      <div className="mx-auto max-w-2xl rounded-lg border border-foreground/10 bg-background p-8 shadow-sm">
        <h2 className="mb-8 text-center text-xl font-medium text-blue-600">
          Customize Settings for Lab Reports
        </h2>

        <div className="space-y-6">
          {/* Header Setting */}
          <div className="flex items-center justify-end gap-8">
            <label className="text-base font-semibold text-foreground">Header</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, header: true })}
                className={`min-w-[70px] rounded border px-4 py-2 text-sm font-medium transition ${
                  settings.header
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : "border-foreground/20 bg-background text-foreground/60 hover:bg-foreground/5"
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, header: false })}
                className={`min-w-[70px] rounded border px-4 py-2 text-sm font-medium transition ${
                  !settings.header
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : "border-foreground/20 bg-background text-foreground/60 hover:bg-foreground/5"
                }`}
              >
                NO
              </button>
            </div>
          </div>

          {/* Footer Setting */}
          <div className="flex items-center justify-end gap-8">
            <label className="text-base font-semibold text-foreground">Footer</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, footer: true })}
                className={`min-w-[70px] rounded border px-4 py-2 text-sm font-medium transition ${
                  settings.footer
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : "border-foreground/20 bg-background text-foreground/60 hover:bg-foreground/5"
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, footer: false })}
                className={`min-w-[70px] rounded border px-4 py-2 text-sm font-medium transition ${
                  !settings.footer
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : "border-foreground/20 bg-background text-foreground/60 hover:bg-foreground/5"
                }`}
              >
                NO
              </button>
            </div>
          </div>

          {/* Page Size Setting */}
          <div className="flex items-center justify-end gap-8">
            <label className="text-base font-semibold text-foreground">Page Size</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, pageSize: "A4" })}
                className={`min-w-[70px] rounded border px-4 py-2 text-sm font-medium transition ${
                  settings.pageSize === "A4"
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : "border-foreground/20 bg-background text-foreground/60 hover:bg-foreground/5"
                }`}
              >
                A4
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, pageSize: "A5" })}
                className={`min-w-[70px] rounded border px-4 py-2 text-sm font-medium transition ${
                  settings.pageSize === "A5"
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : "border-foreground/20 bg-background text-foreground/60 hover:bg-foreground/5"
                }`}
              >
                A5
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-blue-600 px-8 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

