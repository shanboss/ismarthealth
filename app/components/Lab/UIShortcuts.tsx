"use client";

import Link from "next/link";
import {
  UserIcon,
  CurrencyRupeeIcon,
  PencilSquareIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/solid";

function Shortcut({
  href,
  color,
  icon,
  label,
}: {
  href: string;
  color: "amber" | "green" | "blue" | "red";
  icon: React.ReactNode;
  label: string;
}) {
  const bg =
    color === "amber"
      ? "bg-amber-400"
      : color === "green"
      ? "bg-green-400"
      : color === "blue"
      ? "bg-blue-400"
      : "bg-red-400";

  return (
    <Link
      href={href}
      className={
        "inline-flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90 active:scale-95 " +
        bg
      }
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function UIShortcuts() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        UI Shortcuts
      </h1>
      <div className="rounded-md border border-foreground/10 bg-background p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <Shortcut
            href="/lab?tab=lab-tests"
            color="amber"
            icon={<UserIcon className="h-5 w-5 text-white" />}
            label="Patient registration"
          />
          <Shortcut
            href="/lab?tab=billing-queue"
            color="green"
            icon={<CurrencyRupeeIcon className="h-5 w-5 text-white" />}
            label="Billing"
          />
          <Shortcut
            href="/lab?tab=samples-queue"
            color="blue"
            icon={<PencilSquareIcon className="h-5 w-5 text-white" />}
            label="Sample collection"
          />
          <Shortcut
            href="/lab?tab=report-queue"
            color="red"
            icon={<DocumentArrowUpIcon className="h-5 w-5 text-white" />}
            label="Report upload"
          />
        </div>
      </div>
    </div>
  );
}
