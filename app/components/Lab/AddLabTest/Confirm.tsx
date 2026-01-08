"use client";

export default function Confirm({
  summary,
  onPrev,
  onFinish,
}: {
  summary: {
    phone?: string;
    patient?: Record<string, unknown>;
    doctor?: Record<string, unknown>;
    tests?: string[];
  };
  onPrev: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="space-y-6 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Patient Information
      </h2>
      <div className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white">
        Confirm
      </div>

      <div className="space-y-2">
        <details className="rounded-md border border-foreground/10">
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">
            Patient Information
          </summary>
          <pre className="overflow-x-auto px-3 py-2 text-sm">
{JSON.stringify(summary.patient, null, 2)}
          </pre>
        </details>

        <details className="rounded-md border border-foreground/10">
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">
            Address Information
          </summary>
          <div className="px-3 py-2 text-sm text-foreground/70">
            Included in patient details (mock).
          </div>
        </details>

        <details className="rounded-md border border-foreground/10">
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">
            Doctor Information
          </summary>
          <pre className="overflow-x-auto px-3 py-2 text-sm">
{JSON.stringify(summary.doctor, null, 2)}
          </pre>
        </details>

        <details className="rounded-md border border-foreground/10">
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">
            Tests Selected
          </summary>
          <div className="px-3 py-2 text-sm">
            {(summary.tests ?? []).join(", ") || "No tests selected"}
          </div>
        </details>

        <details className="rounded-md border border-foreground/10">
          <summary className="cursor-pointer select-none px-3 py-2 font-medium">
            Additional Information
          </summary>
          <div className="px-3 py-2 text-sm text-foreground/70">
            None
          </div>
        </details>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-md bg-foreground/20 px-4 py-2 text-sm font-semibold text-foreground transition hover:opacity-90 active:scale-95"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        >
          Finish
        </button>
      </div>
    </div>
  );
}



