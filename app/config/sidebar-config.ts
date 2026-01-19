

import {
  Squares2X2Icon,
  BoltIcon,
  // Add other icons if needed later
} from "@heroicons/react/24/outline";

import type { ComponentType, SVGProps } from "react";

export type NavItem = {
  label: string;
  tab: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type ReferOption = {
  label: string;
  tab: string;
};

export type QuickLink = {
  label: string;
  href?: string;
  tab?: string;           // optional — only for query-param style links
  badge?: string;
  children?: QuickLink[];
};

export const sidebarConfig = {
  navItems: [
    { label: "Patient Queue", tab: "patient-queue", icon: Squares2X2Icon },
    {
      label: "Super Speciality Consultation Queue",
      tab: "super-speciality-queue",
      icon: Squares2X2Icon,
    },
    { label: "Package Queue", tab: "package-queue", icon: Squares2X2Icon },
    { label: "UI Shortcuts", tab: "ui-shortcuts", icon: BoltIcon },
  ] satisfies NavItem[],

  referOptions: [
    { label: "Laboratory Tests", tab: "lab-tests" },
    { label: "Super Specialty", tab: "refer-super-specialty" },
    { label: "Packages", tab: "refer-packages" },
  ] satisfies ReferOption[],

  quickLinks: [
    { label: "Enhance Test Capabilities", href: "/lab/enhance-lab" },
    { label: "Update Tests Price", href: "/lab/update-tests-price" },
    { label: "Lab timings", href: "/lab?tab=lab-timings" },
    { label: "Lab calendar", href: "/lab?tab=lab-calendar" },
    { label: "Laboratory Doctor", href: "/lab?tab=laboratory-doctor" },
    { label: "Package", href: "/lab?tab=package-settings" },
    { label: "Change Password", href: "/physician/change-password" },
    { label: "Archived Patient Records", href: "/lab?tab=archived-patient-records" },
    { label: "Archived Package Records", href: "/lab?tab=archived-package-records" },
    {
      label: "Customize Reports",
      href: "/lab?tab=customize-reports",
      badge: "new",
    },
    {
      label: "Others",
      children: [
        { label: "Invoice EULA", href: "/Physician_EULA" },
        { label: "Read EULA", href: "/Physician_EULA" },
      ],
    },
  ] satisfies QuickLink[],
} as const;