import {
  CalendarDaysIcon,
  CalendarIcon,
  UserIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import type React from "react";

type InsightsProps = {
  weekly?: number;
  monthly?: number;
  yearly?: number;
  totalPatients?: number;
};

export default function Insights({
  weekly = 1,
  monthly = 0,
  yearly = 1,
  totalPatients = 272,
}: InsightsProps) {
  const cards: Array<{
    label: string;
    value: number | string;
    color: "mono";
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    {
      label: "Weekly Payments",
      value: weekly,
      color: "mono",
      icon: CalendarDaysIcon,
    },
    {
      label: "Monthly Payments",
      value: monthly,
      color: "mono",
      icon: CalendarIcon,
    },
    {
      label: "Annual Payments",
      value: yearly,
      color: "mono",
      icon: CalendarDaysIcon,
    },
    {
      label: "Number of Patients Registered!",
      value: totalPatients,
      color: "mono",
      icon: UserIcon,
    },
  ];
  const colorToClasses: Record<
    "mono",
    { bg: string; ring: string; footer: string; icon: string }
  > = {
    mono: {
      bg: "bg-foreground",
      ring: "ring-foreground/20",
      footer: "text-foreground",
      icon: "text-background",
    },
  };

  return (
    <div className="grid gap-6 xl:grid-cols-4">
      {cards.map((card) => {
        const { bg, ring, footer, icon } = colorToClasses[card.color];
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`overflow-hidden rounded-lg ring-1 ${ring} shadow-sm`}
          >
            <div className={`${bg} px-6 py-6 text-background h-32`}>
              <div className="flex items-center justify-between">
                <Icon className={`h-12 w-12 ${icon}`} />
                <div className="text-4xl font-semibold tabular-nums">
                  {card.value}
                </div>
              </div>
              <div className="mt-4 text-sm opacity-90">{card.label}</div>
            </div>
            <div className="flex items-center justify-between bg-background px-6 py-3 text-sm">
              <span className={`font-medium ${footer}`}>View Details</span>
              <ArrowRightCircleIcon className={`h-5 w-5 ${footer}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
