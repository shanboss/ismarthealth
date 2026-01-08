"use client";

import Link from "next/link";
import { useRole } from "../providers/role-provider";
import Sidebar from "../components/Lab/Sidebar";
import { useSearchParams } from "next/navigation";
import PatientList from "../components/Lab/PatientList";
import PackageList from "../components/Lab/PackageList";
import SuperSpecialtyQueue from "../components/Lab/SuperSpecialtyQueue";
import AddLabTestWizard from "../components/Lab/AddLabTest/Wizard";
import UIShortcuts from "../components/Lab/UIShortcuts";
import BillingQueue from "../components/Lab/BillingQueue";
import SamplesQueue from "../components/Lab/SamplesQueue";
import ReportQueue from "../components/Lab/ReportQueue";
import AddPackageWizard from "../components/Lab/AddPackage/Wizard";
import ReferSuperSpecialtyWizard from "../components/Lab/ReferSuperSpecialty/Wizard";
import LabTimings from "../components/Lab/LabTimings";
import LabCalendar from "../components/Lab/LabCalendar";
import LabDoctors from "../components/Lab/LabDoctors";
import AvailablePackages from "../components/Lab/AvailablePackages";
import ArchivedPatientList from "../components/Lab/ArchivedPatientList";
import ArchivedPackageRecords from "../components/Lab/ArchivedPackageRecords";
import ReportTemplate from "../components/Lab/ReportTemplate";

export default function LabDashboardPage() {
  const { role } = useRole();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") ?? "patient-queue").toLowerCase();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        {tab === "patient-queue" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Patient List
                </h1>
                <p className="text-sm text-foreground/70">
                  Manage today's patient queue and actions.
                </p>
              </div>
            </header>
            <PatientList />
          </>
        ) : tab === "package-queue" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Package Details
                </h1>
                <p className="text-sm text-foreground/70">
                  View and manage package queue.
                </p>
              </div>
            </header>
            <PackageList />
          </>
        ) : tab === "lab-tests" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Add / Refer Patient to Lab Tests
                </h1>
                <p className="text-sm text-foreground/70">
                  Complete each step to add a lab test referral.
                </p>
              </div>
            </header>
            <AddLabTestWizard />
          </>
        ) : tab === "billing-queue" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Patient List
                </h1>
                <p className="text-sm text-foreground/70">
                  Billing queue overview.
                </p>
              </div>
            </header>
            <BillingQueue />
          </>
        ) : tab === "samples-queue" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Patient List
                </h1>
                <p className="text-sm text-foreground/70">
                  Sample collection queue.
                </p>
              </div>
            </header>
            <SamplesQueue />
          </>
        ) : tab === "report-queue" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Patient List
                </h1>
                <p className="text-sm text-foreground/70">
                  Report upload queue.
                </p>
              </div>
            </header>
            <ReportQueue />
          </>
        ) : tab === "super-speciality-queue" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Super Speciality Consultation
                </h1>
                <p className="text-sm text-foreground/70">
                  View and manage super speciality consultations.
                </p>
              </div>
            </header>
            <SuperSpecialtyQueue />
          </>
        ) : tab === "refer-super-specialty" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Add / Refer Patient to Specialist
                </h1>
                <p className="text-sm text-foreground/70">
                  Complete each step to refer to a super speciality.
                </p>
              </div>
            </header>
            <ReferSuperSpecialtyWizard />
          </>
        ) : tab === "ui-shortcuts" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  UI Shortcuts
                </h1>
                <p className="text-sm text-foreground/70">
                  Quick access actions for lab workflow.
                </p>
              </div>
            </header>
            <UIShortcuts />
          </>
        ) : tab === "refer-packages" ? (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Add / Refer Patient to Packages
                </h1>
                <p className="text-sm text-foreground/70">
                  Complete each step to add a package referral.
                </p>
              </div>
            </header>
            <AddPackageWizard />
          </>
        ) : tab === "lab-timings" ? (
          <LabTimings />
        ) : tab === "lab-calendar" ? (
          <LabCalendar />
        ) : tab === "laboratory-doctor" ? (
          <LabDoctors />
        ) : tab === "package-settings" ? (
          <AvailablePackages />
        ) : tab === "archived-patient-records" ? (
          <ArchivedPatientList />
        ) : tab === "archived-package-records" ? (
          <ArchivedPackageRecords />
        ) : tab === "customize-reports" ? (
          <ReportTemplate />
        ) : (
          <>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Lab Dashboard
                </h1>
                <p className="text-sm text-foreground/70">
                  Welcome to the lab portal.
                </p>
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
                <h2 className="text-sm font-medium text-foreground">
                  Pending Samples
                </h2>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  12
                </p>
              </div>
              <div className="rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
                <h2 className="text-sm font-medium text-foreground">
                  In Analysis
                </h2>
                <p className="mt-1 text-2xl font-semibold text-foreground">5</p>
              </div>
              <div className="rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
                <h2 className="text-sm font-medium text-foreground">
                  Ready Reports
                </h2>
                <p className="mt-1 text-2xl font-semibold text-foreground">3</p>
              </div>
            </section>
          </>
        )}

        <p className="text-xs text-foreground/60">
          Current role: <span className="font-medium">{role}</span>
        </p>
      </main>
    </div>
  );
}
