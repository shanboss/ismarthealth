"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    setOpen(false);
  }

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 shadow-md transition-colors">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8 lg:px-10">
        {/* Logo / Brand */}
        <Link
          href={
            user?.role_id === 1 || user?.role_id === 4
              ? "/physician?tab=dashboard"
              : user?.role_id === 2 || user?.role_id === 6 || user?.role_id === 7 || user?.role_id === 8
              ? "/lab"
              : "/"
          }
          className="flex items-center gap-1 text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
        >
          <span className="text-slate-900 dark:text-white">iSmart</span>
          <span className="text-indigo-600 dark:text-indigo-500">Health</span>
          <span className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline .in"> </span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* Always visible links */}
          <Link
            href="/contact"
            className={`hidden md:block text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-800/50 active:bg-slate-200 dark:active:bg-slate-700/70 transition-all duration-150 ${
              isActive('/contact') ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400 active:text-slate-500 dark:active:text-slate-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400'
            }`}
          >
            Contact
          </Link>
          <Link
            href="/about"
            className={`hidden md:block text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-800/50 active:bg-slate-200 dark:active:bg-slate-700/70 transition-all duration-150 ${
              isActive('/about') ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400 active:text-slate-500 dark:active:text-slate-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400'
            }`}
          >
            About
          </Link>
          <div className="pl-2">
            <ThemeToggle />
          </div>
                    {!loading && !user ? (
            <div className="flex items-center gap-5 md:gap-6">
              <Link
                href="/login"
                className={`text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-800/50 active:bg-slate-200 dark:active:bg-slate-700/70 transition-all duration-150 ${
                  isActive('/login') ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400 active:text-slate-500 dark:active:text-slate-400' : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400'
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/PhysicianEULA"
                className={`text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-800/50 active:bg-slate-200 dark:active:bg-slate-700/70 transition-all duration-150 ${
                  isActive('/Physician_EULA') ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400 active:text-slate-500 dark:active:text-slate-400' : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus-visible:text-indigo-700 dark:focus-visible:text-indigo-400'
                }`}
              >
                Get Started
              </Link>
            </div>
          ) : null}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="group flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-3.5 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <UserCircleIcon className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-500 transition-colors" />
                <span className="hidden sm:block">{user.firstname}</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-400 transition-transform duration-200" style={open ? { transform: 'rotate(180deg)' } : {}} />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.firstname}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{user.role_name}</p>
                  </div>
                  <div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors duration-150"
                        onClick={() => setOpen(false)}
                      >
                        View Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors duration-150"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

        </div>
      </nav>
    </header>
  );
}
