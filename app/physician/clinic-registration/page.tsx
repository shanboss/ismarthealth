"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ClinicRegistrationPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-md border border-foreground/30 bg-background px-3 py-2 text-sm text-foreground shadow-sm transition hover:opacity-80"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <h1 className="text-3xl font-semibold tracking-tight">
        Clinic Manager Registration
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Registration form with blue title bar */}
        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
          <div className="bg-blue-700 px-4 py-3 text-white">
            <h2 className="text-lg font-semibold">Clinic Manager Registration</h2>
          </div>
          <form className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold">
                <span className="text-red-600">*</span> Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold">
                <span className="text-red-600">*</span> Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold">
                <span className="text-red-600">*</span> Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold">
                <span className="text-red-600">*</span> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
                placeholder=""
              />
            </div>
          </form>
        </div>

        {/* Right: Physician info card (red background) */}
        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-red-600/90 text-white shadow-sm">
          <div className="space-y-6 p-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Physician: Dr. Madhavan
              </h2>
              <div className="mt-3 h-px w-full bg-white/40" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-lg">
                  Email : <span className="font-medium">physician@inetframe.com</span>
                </p>
              </div>
              <div>
                <div className="h-px w-full bg-white/40" />
              </div>
              <div>
                <p className="text-lg">
                  Phone Number : <span className="font-medium">9902030505</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed submit button bottom-right */}
      <button
        type="button"
        onClick={() => alert("Submitted")}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-500"
      >
        Submit
      </button>
    </div>
  );
}


