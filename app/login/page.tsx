"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { 
  Phone, 
  Lock, 
  AlertCircle,
  Loader2 
} from "lucide-react";

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
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      const redirect = searchParams.get("redirect");
      let redirectPath = "/";

      if (redirect) {
        redirectPath = redirect;
      } else {
        switch (data.user.role_id) {
          case 1: // Physician
          case 4: // Phy_Admin
            redirectPath = "/physician?tab=dashboard";
            break;
          case 2: case 6: case 7: case 8: // Lab-related roles
            redirectPath = "/lab";
            break;
          case 3: // Patient
            redirectPath = "/profile";
            break;
          case 5: // Super_Admin
            redirectPath = "/lab";
            break;
          default:
            redirectPath = "/";
        }
      }

      window.location.href = redirectPath;
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            iSmartHealth
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Secure access to your healthcare dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/60 overflow-hidden">
          <div className="px-8 py-10 sm:px-10">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Sign In
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Phone Number */}
              <div>
                <label 
                  htmlFor="phone_num" 
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone_num"
                    name="phone_num"
                    type="tel"
                    autoComplete="tel"
                    required
                    disabled={loading}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                             placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                             disabled:opacity-60 disabled:bg-gray-50 transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                             placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                             disabled:opacity-60 disabled:bg-gray-50 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 
                             focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <span>Remember me</span>
                </label>

                <Link 
                  href="/forgot-password" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 
                         bg-indigo-600 hover:bg-indigo-700 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                         text-white font-medium rounded-lg shadow-md shadow-indigo-200/50
                         disabled:opacity-60 disabled:shadow-none transition-all duration-200"
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Create account
              </Link>
            </p>

            {/* Test Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-4 text-xs text-blue-800">
                <p className="font-semibold mb-2 text-blue-900">Test Accounts (Development):</p>
                <p className="font-mono">Lab: 1234567890 / LabPassword123!</p>
                <p className="mt-1.5 text-blue-700 text-xs">
                  Use your registered phone number in production
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}