"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ChangePasswordPage() {
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

      <h1 className="text-3xl font-semibold tracking-tight">Change Password</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Form card with blue title bar */}
        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
          <div className="bg-blue-700 px-4 py-3 text-white">
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>
          <form className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="email"
                disabled
                defaultValue="physician@inetframe.com"
                className="w-full cursor-not-allowed rounded-md border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder:text-foreground/40"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="current" className="block text-sm font-semibold">
                Current Password
              </label>
              <input
                id="current"
                name="current"
                type="password"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new" className="block text-sm font-semibold">
                New Password
              </label>
              <input
                id="new"
                name="new"
                type="password"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm" className="block text-sm font-semibold">
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>
          </form>
        </div>

        {/* Right: Note card */}
        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-red-600/90 text-white shadow-sm">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-semibold">Kindly Note!</h2>
            <ol className="list-decimal space-y-4 pl-6">
              <li>
                To protect your account don't reveal your password.
              </li>
              <li>
                For security reasons, keep changing your password at regular
                intervals.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Fixed submit button */}
      <button
        type="button"
        onClick={() => alert("Password changed")}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-500"
      >
        Submit
      </button>
    </div>
  );
}


