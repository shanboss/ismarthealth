"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="rounded-lg border border-foreground/10 bg-background p-8 shadow-sm">
          <div className="mb-4 text-6xl">🚫</div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            You don't have permission to access this page.
          </p>
          <p className="mt-4 text-sm text-foreground/70">
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5"
            >
              Go Back
            </button>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80"
            >
              Login with Different Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

