"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={
            user?.role_id === 1 || user?.role_id === 4
              ? "/physician?tab=dashboard"
              : user?.role_id === 2 || user?.role_id === 6 || user?.role_id === 7 || user?.role_id === 8
              ? "/lab"
              : "/"
          }
          className="text-2xl font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          iSmartHealth.in
        </Link>
        <div className="flex items-center gap-4">
          {!loading && !user ? (
            <>
              <Link
                href="/login"
                className="text-sm text-foreground/80 hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/Physician_EULA"
                className="text-sm text-foreground/80 hover:text-foreground"
              >
                New User
              </Link>
            </>
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground transition hover:opacity-80"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <UserCircleIcon className="h-5 w-5" />
                <span className="font-medium">{user.firstname}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              {open ? (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-foreground/10 bg-background shadow-lg">
                  <div className="border-b border-foreground/10 px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{user.firstname}</p>
                    <p className="text-xs text-foreground/60">{user.role_name}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-sm text-foreground hover:bg-foreground/5"
                    onClick={() => setOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-foreground/5"
                  >
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <Link
            href="#contact"
            className="text-sm text-foreground/80 hover:text-foreground"
          >
            Contact
          </Link>
          <Link
            href="#about"
            className="text-sm text-foreground/80 hover:text-foreground"
          >
            About
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
