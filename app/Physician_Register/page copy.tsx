"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PhysicianRegister() {
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Submit handling would go here
    
    alert("Submitted");
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Back to home"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background text-foreground transition hover:opacity-80 active:scale-95"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Physician Registration
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-foreground"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-foreground"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-foreground"
            >
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="specialization"
              className="block text-sm font-medium text-foreground"
            >
              Specialization *
            </label>
            <input
              id="specialization"
              name="specialization"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="clinicName"
              className="block text-sm font-medium text-foreground"
            >
              Clinic Name
            </label>
            <input
              id="clinicName"
              name="clinicName"
              type="text"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="clinicPhone"
              className="block text-sm font-medium text-foreground"
            >
              Clinic Phone
            </label>
            <input
              id="clinicPhone"
              name="clinicPhone"
              type="tel"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="registrationNumber"
              className="block text-sm font-medium text-foreground"
            >
              Registration Number
            </label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="degree"
              className="block text-sm font-medium text-foreground"
            >
              Degree
            </label>
            <input
              id="degree"
              name="degree"
              type="text"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-foreground"
            >
              State *
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-foreground"
            >
              City *
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="locality"
              className="block text-sm font-medium text-foreground"
            >
              Locality
            </label>
            <input
              id="locality"
              name="locality"
              type="text"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="pinCode"
              className="block text-sm font-medium text-foreground"
            >
              Pin Code
            </label>
            <input
              id="pinCode"
              name="pinCode"
              type="text"
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="landMark"
              className="block text-sm font-medium text-foreground"
            >
              Land Mark
            </label>
            <input
              id="landMark"
              name="landMark"
              type="text"
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div className="md:col-span-3">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-foreground"
            >
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground"
            >
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              className="mt-1 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="reset"
            className="inline-flex items-center justify-center rounded-md border border-foreground/30 px-4 py-2 text-sm font-medium text-foreground transition hover:opacity-80 active:scale-95"
          >
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80 active:scale-95"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
