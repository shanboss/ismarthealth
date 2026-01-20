"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import { sidebarConfig } from "../../config/sidebar-config"; // adjust path

const { navItems, referOptions, quickLinks } = sidebarConfig;

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "patient-queue";

  const quickOpenInitially = useMemo(
    () =>
      pathname === "/lab" &&
      (currentTab === "reports" ||
        quickLinks.some((q) => "tab" in q && q.tab === currentTab)),
    [pathname, currentTab]
  );

  const referOpenInitially = useMemo(
    () => pathname === "/lab" && referOptions.some((q) => q.tab === currentTab),
    [pathname, currentTab]
  );

  const [quickOpen, setQuickOpen] = useState(quickOpenInitially);
  const [referOpen, setReferOpen] = useState(referOpenInitially);
  const [othersOpen, setOthersOpen] = useState(false);

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-80 shrink-0 overflow-y-auto border-r border-gray-400/70 bg-gradient-to-b from-slate-50 to-white/80 backdrop-blur-xl shadow-md md:block">
      <div className="flex h-full flex-col">
        {/* Enhanced Header */}
        <div className="border-b border-gray-200/70 px-6 py-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Lab Dashboard
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">Laboratory Management</p>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {/* Main Items - Enhanced */}
          {navItems.map((item) => {
            const href = `/lab?tab=${item.tab}`;
            const isActive = pathname === "/lab" && currentTab === item.tab;

            return (
              <Link
                key={item.tab}
                href={href}
                className={`
                  group relative flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 overflow-hidden
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25 transform scale-[1.02] ring-2 ring-blue-500/30"
                      : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-lg hover:shadow-gray-100/50 hover:backdrop-blur-sm border border-transparent hover:border-gray-200/50"
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 h-full w-1 bg-gradient-to-b from-blue-400 to-indigo-500 shadow-lg" />
                )}
                
                {/* Icon with enhanced styling */}
                <div className={`
                  relative h-6 w-6 rounded-xl p-1.5 flex items-center justify-center transition-all duration-300
                  ${isActive ? "bg-white/20 backdrop-blur-sm shadow-md" : "group-hover:bg-blue-100/50"}
                `}>
                  <item.icon
                    className={`h-5 w-5 transition-all duration-300 ${isActive ? "text-white drop-shadow-lg" : "text-gray-500 group-hover:text-blue-600"}`}
                  />
                </div>
                
                <span className="relative z-10 tracking-wide">{item.label}</span>
                
                {/* Subtle glow effect on hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-indigo-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            );
          })}

          {/* Enhanced Expandable Section: Add Patients & Refer */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setReferOpen((v) => !v)}
              className={`
                group relative flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 overflow-hidden
                ${
                  referOpen
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-500/30"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-lg hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
                }
              `}
              aria-expanded={referOpen}
            >
              <div className="flex items-center gap-4">
                <div className="
                  relative h-6 w-6 rounded-xl p-1.5 flex items-center justify-center 
                  bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-sm shadow-md
                ">
                  <Squares2X2Icon className="h-5 w-5 text-white/90" />
                </div>
                <span>Add Patients & Refer</span>
              </div>
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform duration-300 ${referOpen ? "rotate-180" : ""} ${referOpen ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`}
              />
            </button>

            {referOpen && (
              <div className="ml-6 mt-2 space-y-1.5 border-l-2 border-emerald-200/50 bg-emerald-50/30 rounded-2xl p-3">
                {referOptions.map((q) => {
                  const href = `/lab?tab=${q.tab}`;
                  const isActive = pathname === "/lab" && currentTab === q.tab;

                  return (
                    <Link
                      key={q.tab}
                      href={href}
                      className={`
                        flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 relative
                        ${
                          isActive
                            ? "bg-white text-emerald-700 shadow-md shadow-emerald-200/50 ring-1 ring-emerald-300/50 font-semibold"
                            : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                        }
                      `}
                    >
                      <span
                        className={`
                          inline-block h-3 w-3 rounded-full transition-all duration-300
                          ${
                            isActive 
                              ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg scale-110" 
                              : "bg-gray-300 hover:bg-emerald-400 hover:scale-110"
                          }
                        `}
                      />
                      <span>{q.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enhanced Quick Links Section */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setQuickOpen((v) => !v)}
              className={`
                group relative flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 overflow-hidden
                ${
                  quickOpen
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/25 ring-2 ring-purple-500/30"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-lg hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/50"
                }
              `}
              aria-expanded={quickOpen}
            >
              <div className="flex items-center gap-4">
                <div className="
                  relative h-6 w-6 rounded-xl p-1.5 flex items-center justify-center 
                  bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm shadow-md
                ">
                  <Squares2X2Icon className="h-5 w-5 text-white/90" />
                </div>
                <span>Quick Links</span>
              </div>
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform duration-300 ${quickOpen ? "rotate-180" : ""} ${quickOpen ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`}
              />
            </button>

            {quickOpen && (
              <div className="ml-6 mt-2 space-y-1.5 border-l-2 border-purple-200/50 bg-purple-50/30 rounded-2xl p-3">
                {quickLinks.map((q, i) => {
                  if (q.children) {
                    return (
                      <div key={i} className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => setOthersOpen((v) => !v)}
                          className="
                            flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300
                            hover:bg-white hover:shadow-sm hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/30
                          "
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 shadow-sm" />
                            <span>{q.label}</span>
                          </div>
                          <ChevronDownIcon className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-transform duration-300" />
                        </button>

                        {othersOpen && (
                          <div className="ml-4 space-y-1 bg-white/50 rounded-xl p-2.5">
                            {q.children.map((c, j) => (
                              <Link
                                key={j}
                                href={c.href!}
                                className="
                                  flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-600 transition-all duration-300
                                  hover:bg-white hover:text-gray-900 hover:shadow-sm hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/30
                                "
                              >
                                <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300 shadow-sm" />
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
                      key={i}
                      href={q.href!}
                      className="
                        flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300
                        hover:bg-white hover:shadow-sm hover:shadow-gray-100/50 border border-transparent hover:border-gray-200/30
                      "
                    >
                      <span className="inline-block h-3 w-3 rounded-full bg-gray-400 shadow-sm" />
                      <div className="flex items-center gap-2 flex-1">
                        <span>{q.label}</span>
                        {q.badge && (
                          <span className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                            {q.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Enhanced Footer */}
        <div className="border-t border-gray-200/50 px-4 py-6 bg-gradient-to-t from-white/50 to-transparent">
          <Link
            href="/logout"
            className="
              group flex w-full items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300
              hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 hover:text-white hover:shadow-xl hover:shadow-rose-500/25 hover:ring-2 hover:ring-rose-500/30
              border border-transparent hover:border-rose-200/50
            "
          >
            <div className="
              relative h-6 w-6 rounded-xl p-1.5 flex items-center justify-center 
              group-hover:bg-white/20 backdrop-blur-sm shadow-md
            ">
              <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:text-white" />
            </div>
            <span className="relative z-10 tracking-wide">Sign Out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
