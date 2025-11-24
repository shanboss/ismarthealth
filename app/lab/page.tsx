"use client";

import Link from "next/link";
import { useRole } from "../providers/role-provider";

export default function LabDashboardPage() {
  const { role } = useRole();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Lab Dashboard</h1>
          <p className="text-sm text-foreground/70">Welcome to the lab portal.</p>
        </div>
        <Link
          href="/"
          className="rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground hover:bg-foreground/5"
        >
          Home
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
          <h2 className="text-sm font-medium text-foreground">Pending Samples</h2>
          <p className="mt-1 text-2xl font-semibold text-foreground">12</p>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
          <h2 className="text-sm font-medium text-foreground">In Analysis</h2>
          <p className="mt-1 text-2xl font-semibold text-foreground">5</p>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
          <h2 className="text-sm font-medium text-foreground">Ready Reports</h2>
          <p className="mt-1 text-2xl font-semibold text-foreground">3</p>
        </div>
      </section>

      <section className="rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
        <h3 className="text-sm font-medium text-foreground">Quick Actions</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-80 active:scale-95">
            Register Sample
          </button>
          <button className="rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground hover:bg-foreground/5">
            Upload Result
          </button>
          <button className="rounded-md border border-foreground/20 px-3 py-1.5 text-sm text-foreground hover:bg-foreground/5">
            View Queue
          </button>
        </div>
      </section>

      <p className="text-xs text-foreground/60">
        Current role: <span className="font-medium">{role}</span>
      </p>
    </div>
  );
}


