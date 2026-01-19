"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const phone_num = String(formData.get("phone_num") || "").trim();
    const password = String(formData.get("password") || "").trim();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_num, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Login successful - redirect based on role
      console.log("Login successful, redirecting...", data.user);

      // Store user info in localStorage for client-side access
      localStorage.setItem("user", JSON.stringify(data.user));

      const redirect = searchParams.get("redirect");
      let redirectPath = "/";

      if (redirect) {
        redirectPath = redirect;
      } else {
        // Default redirects based on role
        switch (data.user.role_id) {
          case 1: // Physician
          case 4: // Phy_Admin
            redirectPath = "/physician?tab=dashboard";
            break;
          case 2: // Laboratory
          case 6: // Billing
          case 7: // Samples
          case 8: // Lab_Reports
            redirectPath = "/lab";
            break;
          case 3: // Patient
            redirectPath = "/profile";
            break;
          case 5: // Super_Admin
            redirectPath = "/lab"; // or admin dashboard
            break;
          default:
            redirectPath = "/";
        }
      }

      console.log("Redirecting to:", redirectPath);

      // Use window.location for a hard navigation (more reliable)
      window.location.href = redirectPath;
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          iSmartHealth
        </span>
      </div>
      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="phone_num"
              className="block text-sm font-medium text-foreground"
            >
              Phone Number
            </label>
            <input
              id="phone_num"
              name="phone_num"
              type="text"
              required
              disabled={loading}
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground disabled:opacity-50"
              placeholder="1234567890"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-foreground">
              <input
                type="checkbox"
                disabled={loading}
                className="h-4 w-4 rounded border-foreground/30 bg-background text-foreground focus:ring-foreground disabled:opacity-50"
              />
              Remember me
            </label>
            <a href="#" className="text-foreground hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-foreground/70">
          New here?{" "}
          <Link href="/#new-user" className="text-foreground hover:underline">
            Create an account
          </Link>
        </p>
        <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
          <p className="font-semibold mb-1">Test Credentials:</p>
          <p>
            Lab: <span className="font-mono">1234567890</span> /{" "}
            <span className="font-mono">LabPassword123!</span>
          </p>
          <p className="mt-1 text-blue-700">
            Use the phone number you created during registration
          </p>
        </div>
      </div>
    </div>
  );
}
