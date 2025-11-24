"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SelectLabPage() {
  const router = useRouter();

  const labs = [
    {
      id: "devagiri-hospital",
      name: "Devagiri Hospital",
      phone: "7986546456",
      email: "devagiri@gmail.com",
      address: "#185, ISHTA ,1st Floor,Banashankari Stage II",
      city: "Bangalore",
      locality: "Banashankari 2nd Stage",
      tests: "MRCP",
      price: "—",
    },
    {
      id: "inet-lab",
      name: "Inet Lab",
      phone: "7760091356",
      email: "inet@example.com",
      address: "Banashankari",
      city: "Bangalore",
      locality: "Jayanagar",
      tests: "MRCP",
      price: "3000",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground transition hover:bg-foreground/10"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>
      <h1 className="text-3xl font-semibold border-b border-neutral-200">
        Select Laboratory
      </h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm text-foreground">
            Search City
          </label>
          <select
            id="city"
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            defaultValue="Bangalore"
          >
            <option>Bangalore</option>
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Chennai</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="locality" className="block text-sm text-foreground">
            Search Locality
          </label>
          <select
            id="locality"
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            defaultValue=""
          >
            <option value="" disabled>
              Select locality
            </option>
            <option>Banashankari 2nd Stage</option>
            <option>Jayanagar</option>
            <option>Koramangala</option>
          </select>
        </div>

        <div className="flex items-end gap-4">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-80 active:scale-95"
          >
            Filter
          </button>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-foreground/30 bg-background text-foreground focus:ring-foreground"
            />
            Show Results from Non-Preferred Labs
          </label>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span>Show</span>
          <select className="rounded-md border border-foreground/20 bg-background px-2 py-1 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>Search:</span>
          <input
            type="text"
            className="w-56 rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            placeholder=""
          />
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <table className="min-w-full divide-y divide-foreground/10">
          <thead className="bg-foreground/5">
            <tr className="text-left text-sm font-semibold">
              <th className="px-4 py-3">SELECT LABORATORY</th>
              <th className="px-4 py-3">PHONE</th>
              <th className="px-4 py-3">ADDRESS</th>
              <th className="px-4 py-3">CITY</th>
              <th className="px-4 py-3">LOCALITY</th>
              <th className="px-4 py-3">TESTS</th>
              <th className="px-4 py-3">TESTS PRICE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {labs.map((lab) => (
              <tr
                key={lab.id}
                className="cursor-pointer hover:bg-foreground/5"
                onClick={() =>
                  router.push(`/physician/select-lab/${lab.id}/schedule`)
                }
                role="button"
              >
                <td className="px-4 py-3">
                  <span className="text-foreground underline-offset-4 hover:underline">
                    {lab.name}
                  </span>
                </td>
                <td className="px-4 py-3">{lab.phone}</td>
                <td className="px-4 py-3">{lab.address}</td>
                <td className="px-4 py-3">{lab.city}</td>
                <td className="px-4 py-3">{lab.locality}</td>
                <td className="px-4 py-3">{lab.tests}</td>
                <td className="px-4 py-3">{lab.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-foreground/70">
        <p>Showing 1 to 2 of 2 entries</p>
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-foreground transition hover:bg-foreground/10"
          >
            Previous
          </button>
          <span className="rounded-md border border-foreground/20 bg-foreground px-3 py-1.5 text-background">
            1
          </span>
          <button
            type="button"
            className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-foreground transition hover:bg-foreground/10"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
