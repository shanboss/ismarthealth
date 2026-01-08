"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type React from "react";
import {
  Squares2X2Icon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

type NavItem = {
  label: string;
  tab: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "Patient Queue", tab: "patient-queue", icon: Squares2X2Icon },
  {
    label: "Super Speciality Consultation Queue",
    tab: "super-speciality-queue",
    icon: Squares2X2Icon,
  },
  { label: "Package Queue", tab: "package-queue", icon: Squares2X2Icon },
  { label: "UI Shortcuts", tab: "ui-shortcuts", icon: BoltIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "patient-queue";

  const referOptions = useMemo(
    () => [
      { label: "Laboratory Tests", tab: "lab-tests" },
      { label: "Super Specialty", tab: "refer-super-specialty" },
      { label: "Packages", tab: "refer-packages" },
    ],
    []
  );

  const uiShortcuts = useMemo(
    () => [
      { label: "Register Sample", tab: "register-sample" },
      { label: "Upload Result", tab: "upload-result" },
      { label: "View Queue", tab: "view-queue" },
    ],
    []
  );

  const quickLinks = useMemo(
    () => [
      { label: "Enhance Test Capabilities", href: "/lab/enhance-lab" },
      { label: "Update Tests Price", href: "/lab/update-tests-price" },
      { label: "Lab timings", href: "/lab?tab=lab-timings" },
      { label: "Lab calendar", href: "/lab?tab=lab-calendar" },
      { label: "Laboratory Doctor", href: "/lab?tab=laboratory-doctor" },
      { label: "Package", href: "/lab?tab=package-settings" },
      { label: "Change Password", href: "/physician/change-password" },
      { label: "Archived Patient Records", href: "/lab?tab=archived-patient-records" },
      { label: "Archived Package Records", href: "/lab?tab=archived-package-records" },
      { label: "Customize Reports", href: "/lab?tab=customize-reports", badge: "new" },
      {
        label: "Others",
        children: [
          { label: "Invoice EULA", href: "/Physician_EULA" },
          { label: "Read EULA", href: "/Physician_EULA" },
        ],
      },
    ] as Array<any>,
    []
  );

  const quickOpenInitially =
    pathname === "/lab" &&
    (currentTab === "reports" ||
      uiShortcuts.some((q: any) => q.tab === currentTab) ||
      quickLinks.some((q: any) => q.tab === currentTab));

  const referOpenInitially =
    pathname === "/lab" &&
    referOptions.some((q: any) => q.tab === currentTab);

  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);
  const [quickOpen, setQuickOpen] = useState<boolean>(quickOpenInitially);
  const [referOpen, setReferOpen] = useState<boolean>(referOpenInitially);
  const [othersOpen, setOthersOpen] = useState<boolean>(false);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-foreground/10 bg-background backdrop-blur md:block">
      <div className="flex min-h-full flex-col p-4">
        <div className="mb-6 px-2 text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Lab
        </div>
        <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const href = `/lab?tab=${item.tab}`;
          const isActive = pathname === "/lab" && currentTab === item.tab;
          return (
            <Link
              key={item.tab}
              href={href}
              className={
                "group inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm transition " +
                (isActive
                  ? "text-foreground ring-1 ring-inset ring-foreground/20"
                  : "text-foreground/80 hover:opacity-80")
              }
            >
              <item.icon
                className={
                  "h-5 w-5 " + (isActive ? "text-foreground" : "text-foreground/60")
                }
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Add Patients & Refer dropdown */}
        <button
          type="button"
          onClick={() => setReferOpen((v) => !v)}
          className={
            "group inline-flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition " +
            (referOpen
              ? "text-foreground ring-1 ring-inset ring-foreground/20"
              : "text-foreground/80 hover:opacity-80")
          }
          aria-expanded={referOpen}
        >
          <span className="inline-flex items-center gap-3">
            <Squares2X2Icon className="h-5 w-5 text-foreground/60" />
            Add Patients & Refer
          </span>
          <ChevronDownIcon
            className={
              "h-4 w-4 transition-transform " +
              (referOpen ? "rotate-180" : "rotate-0")
            }
          />
        </button>
        {referOpen && (
          <div className="ml-8 mt-1 flex flex-col">
            {referOptions.map((q: any) => {
              const href = `/lab?tab=${q.tab}`;
              const isActive = pathname === "/lab" && currentTab === q.tab;
              return (
                <Link
                  key={q.label}
                  href={href}
                  className={
                    "group inline-flex items-center gap-3 rounded-md px-2 py-2 text-sm transition " +
                    (isActive
                      ? "text-foreground"
                      : "text-foreground/80 hover:opacity-80")
                  }
                >
                  <span
                    className={
                      "inline-block h-2.5 w-2.5 rounded-full border-2 " +
                      (isActive ? "border-foreground" : "border-foreground/30")
                    }
                  />
                  <span>{q.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* UI Shortcuts now a top-level nav item above; dropdown removed */}

        {/* Quick Links dropdown */}
        <button
          type="button"
          onClick={() => setQuickOpen((v) => !v)}
          className={
            "group inline-flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition " +
            (quickOpen
              ? "text-foreground ring-1 ring-inset ring-foreground/20"
              : "text-foreground/80 hover:opacity-80")
          }
          aria-expanded={quickOpen}
        >
          <span className="inline-flex items-center gap-3">
            <Squares2X2Icon className="h-5 w-5 text-foreground/60" />
            Quick Links
          </span>
          <ChevronDownIcon
            className={
              "h-4 w-4 transition-transform " +
              (quickOpen ? "rotate-180" : "rotate-0")
            }
          />
        </button>
        {quickOpen && (
          <div className="ml-8 mt-1 flex flex-col">
            {quickLinks.map((q: any) => {
              if (q.children) {
                return (
                  <div key={q.label} className="mb-1">
                    <button
                      type="button"
                      onClick={() => setOthersOpen((v) => !v)}
                      className="group inline-flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-foreground/80 transition hover:opacity-80"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-foreground/30" />
                        <span>{q.label}</span>
                      </span>
                      <ChevronDownIcon
                        className={
                          "h-4 w-4 transition-transform " +
                          (othersOpen ? "rotate-180" : "rotate-0")
                        }
                      />
                    </button>
                    {othersOpen && (
                      <div className="ml-6 mt-1 flex flex-col">
                        {q.children.map((c: any) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            className="group inline-flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground/80 transition hover:opacity-80"
                          >
                            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-foreground/30" />
                            <span>{c.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={q.label}
                  href={q.href}
                  className="group inline-flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground/80 transition hover:opacity-80"
                >
                  <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-foreground/30" />
                  <span className="inline-flex items-center gap-2">
                    {q.label}
                    {q.badge ? (
                      <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {q.badge}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
      <div className="mt-auto border-t border-foreground/10 pt-6">
        <Link
          href="/logout"
          className="inline-flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition hover:opacity-80"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </Link>
      </div>
      </div>
    </aside>
  );
}



