"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import type React from "react";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BoltIcon,
  BeakerIcon,
  BuildingOffice2Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

type NavItem = {
  label: string;
  tab: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", tab: "dashboard", icon: HomeIcon },
  { label: "Patient Look-Up", tab: "patients", icon: UserGroupIcon },
  {
    label: "Previous Super Speciality Consultations",
    tab: "prevsuperspeciality",
    icon: CalendarDaysIcon,
  },
  // Quick Links rendered as a dropdown below
  {
    label: "Other Doctor Referrals",
    tab: "other-doctor-referrals",
    icon: BuildingOffice2Icon,
  },

  { label: "Lab Consultation Queue", tab: "settings", icon: BeakerIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "dashboard";
  const quickLinks = useMemo(
    () => [
      { label: "Previous Lab Investigation", tab: "prev-lab-investigation" },
      {
        label: "Physician Timings",
        href: "/physician/modify-timings" as const,
      },
      {
        label: "Physician Calendar",
        href: "/physician/super-specialty-details" as const,
      },
      {
        label: "Clinic Manager",
        href: "/physician/clinic-registration" as const,
      },
      { label: "Change Password", href: "/physician/change-password" as const },
    ],
    []
  );
  const quickOpenInitially =
    quickLinks.some(
      (q: any) =>
        ((q as any).href && pathname === (q as any).href) ||
        ((q as any).tab && (q as any).tab === currentTab)
    ) || currentTab === "reports";
  const [quickOpen, setQuickOpen] = useState<boolean>(quickOpenInitially);

  return (
    <aside className="sticky top-0 hidden h-[calc(100dvh-0px)] w-64 shrink-0 border-r border-foreground/10 bg-background p-4 backdrop-blur md:block">
      <div className="mb-6 px-2 text-sm font-semibold uppercase tracking-wider text-foreground/60">
        Physician
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const href = `/physician?tab=${item.tab}`;
          const isActive = pathname === "/physician" && currentTab === item.tab;
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
                  "h-5 w-5 " +
                  (isActive ? "text-foreground" : "text-foreground/60")
                }
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

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
            <BoltIcon className="h-5 w-5 text-foreground/60" />
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
              const href =
                (q as any).href ?? `/physician?tab=${(q as any).tab}`;
              const isActive =
                ((q as any).href && pathname === (q as any).href) ||
                (pathname === "/physician" &&
                  (q as any).tab &&
                  currentTab === (q as any).tab);
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
      </nav>
      <div className="mt-auto flex grow items-end border-t border-foreground/10">
        <Link
          href="/logout"
          className="mt-6 inline-flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition hover:opacity-80"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
