"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useRole } from "../providers/role-provider";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { role, setRole } = useRole();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function logout() {
    setRole("guest");
    router.push("/login");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={
            role === "physician"
              ? "/physician?tab=dashboard"
              : role === "lab"
              ? "/lab"
              : "/"
          }
          className="text-2xl font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          iSmartHealth.in
        </Link>
        <div className="flex items-center gap-4">
          {role === "guest" ? (
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
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm text-foreground transition hover:opacity-80"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <UserCircleIcon className="h-5 w-5" />
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              {open ? (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-foreground/10 bg-background shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-sm text-foreground hover:bg-foreground/5"
                    onClick={() => setOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-foreground/5"
                  >
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          )}
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
