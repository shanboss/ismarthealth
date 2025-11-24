export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome Madhavan</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left profile summary */}
        <aside className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
          <div className="p-6">
            <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full border border-foreground/10 bg-foreground/5" />
            <h2 className="text-2xl font-semibold text-center">Dr. Madhavan</h2>
            <p className="mt-1 text-center text-sm text-foreground/70">
              General Physician
            </p>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                <dt className="text-sm text-foreground/70">Registration Number</dt>
                <dd className="text-sm font-medium">234687985</dd>
              </div>
              <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                <dt className="text-sm text-foreground/70">Phone Number</dt>
                <dd className="text-sm font-medium">9902030560</dd>
              </div>
              <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                <dt className="text-sm text-foreground/70">Email</dt>
                <dd className="text-sm font-medium">physician@inetframe.com</dd>
              </div>
              <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                <dt className="text-sm text-foreground/70">Specialization</dt>
                <dd className="text-sm font-medium">General Physician</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-foreground/70">Degree</dt>
                <dd className="text-sm font-medium">—</dd>
              </div>
            </dl>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-foreground/30 px-4 py-2 text-sm font-medium text-foreground transition hover:opacity-80"
              >
                Setup Preferred Lab
              </button>
            </div>
          </div>
        </aside>

        {/* Right update profile form */}
        <section className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
          <div className="border-b border-foreground/10 px-4 py-3">
            <h2 className="text-lg font-semibold">Update Profile</h2>
          </div>
          <form className="grid gap-4 p-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="altPhone">
                Alternate Phone Number
              </label>
              <input
                id="altPhone"
                type="tel"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                defaultValue="7618743177"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="clinicName">
                Clinic Name
              </label>
              <input
                id="clinicName"
                type="text"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                defaultValue="Madhavan Clinic"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="clinicPhone">
                Clinic Phone Number
              </label>
              <input
                id="clinicPhone"
                type="tel"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                defaultValue="9902030560"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="clinicAltPhone">
                Clinic Alternate Phone Number
              </label>
              <input
                id="clinicAltPhone"
                type="tel"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                defaultValue="7618743177"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="clinicAddress">
                Clinic Address
              </label>
              <textarea
                id="clinicAddress"
                rows={3}
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                defaultValue="8th Block, Basavanagudi"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="state">
                  State
                </label>
                <select
                  id="state"
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                  defaultValue="Karnataka"
                >
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Tamil Nadu</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="city">
                  City
                </label>
                <select
                  id="city"
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                  defaultValue="Bangalore"
                >
                  <option>Bangalore</option>
                  <option>Mysore</option>
                  <option>Hubli</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="locality">
                  Locality
                </label>
                <input
                  id="locality"
                  type="text"
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                  defaultValue="Banashankari"
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="pincode">
                  Pincode
                </label>
                <input
                  id="pincode"
                  type="text"
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                  defaultValue="333333"
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Clinic Manager</span>
                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="radio" name="clinicManager" defaultChecked />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="radio" name="clinicManager" />
                    No
                  </label>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="photo">
                  Update Photo
                </label>
                <input
                  id="photo"
                  type="file"
                  className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border file:border-foreground/20 file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:opacity-80"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
              >
                Update
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}


