"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRole } from "../providers/role-provider";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [error, setError] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    if (username === "physician" && password === "physician123") {
      setError("");
      setRole("physician");
      router.push("/physician?tab=dashboard");
    } else if (username === "lab" && password === "lab123") {
      setError("");
      setRole("lab");
      router.push("/lab");
    } else {
      setError("Invalid credentials. Try physician/physician123 or lab/lab123.");
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
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Username
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
              placeholder="physician"
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
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
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
                className="h-4 w-4 rounded border-foreground/30 bg-background text-foreground focus:ring-foreground"
              />
              Remember me
            </label>
            <a href="#" className="text-foreground hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80 active:scale-95"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-foreground/70">
          New here?{" "}
          <Link href="/#new-user" className="text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
