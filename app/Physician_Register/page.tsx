"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/outline";

const SPECIALIZATIONS = [
  { value: "8", label: "Cardiology/Cardiac Science" },
  { value: "20", label: "CTVS [Cardio Thoracic And Vascular Surgery]" },
  { value: "2", label: "Dermatology & Cosmetology" },
  { value: "11", label: "Diabetes & Endocrinology" },
  { value: "1", label: "Gastroenterology/Gastrointestinal Science" },
  { value: "12", label: "General Medicine & Surgery" },
  { value: "17", label: "General Physician" },
  { value: "10", label: "Genetics" },
  { value: "14", label: "Gynaecology" },
  { value: "9", label: "Nephrology & Urology" },
  { value: "6", label: "Neurology" },
  { value: "16", label: "Obstetrics" },
  { value: "13", label: "Oncology" },
  { value: "5", label: "Ophthalmology" },
  { value: "3", label: "Orthopaedics" },
  { value: "18", label: "Otolaryngology" },
  { value: "4", label: "Paediatrics" },
  { value: "19", label: "Plastic Surgery" },
  { value: "22", label: "Psychiatry" },
  { value: "21", label: "Pulmonology" },
  { value: "7", label: "Radiology" },
  { value: "15", label: "Rheumatology" },
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const CITIES_BY_STATE: { [key: string]: string[] } = {
  Alabama: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
  Alaska: ["Anchorage", "Juneau", "Fairbanks", "Sitka", "Ketchikan"],
  Arizona: ["Phoenix", "Mesa", "Chandler", "Scottsdale", "Glendale"],
  Arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
  California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "Oakland"],
  Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
  Connecticut: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Norwalk"],
  Delaware: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
  Florida: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg"],
  Georgia: ["Atlanta", "Augusta", "Savannah", "Columbus", "Athens"],
  Hawaii: ["Honolulu", "Pearl City", "Kailua", "Kaneohe", "Waipahu"],
  Idaho: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
  Illinois: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville"],
  Indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Bloomington"],
  Iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
  Kansas: ["Kansas City", "Wichita", "Overland Park", "Topeka", "Lawrence"],
  Kentucky: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
  Louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
  Maine: ["Portland", "Lewiston", "Bangor", "Auburn", "Augusta"],
  Maryland: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie"],
  Massachusetts: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge"],
  Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
  Minnesota: ["Minneapolis", "St. Paul", "Rochester", "Bloomington", "Duluth"],
  Mississippi: ["Jackson", "Gulfport", "Biloxi", "Hattiesburg", "Meridian"],
  Missouri: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
  Montana: ["Billings", "Missoula", "Great Falls", "Butte", "Helena"],
  Nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
  Nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
  "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Dover"],
  "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Santa Fe", "Rio Rancho", "Roswell"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
  "North Dakota": ["Bismarck", "Fargo", "Grand Forks", "Minot", "Williston"],
  Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  Oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
  Oregon: ["Portland", "Eugene", "Salem", "Gresham", "Hillsboro"],
  Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
  "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
  "South Carolina": ["Charleston", "Columbia", "Greenville", "Summerville", "Rock Hill"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
  Tennessee: ["Memphis", "Nashville", "Knoxville", "Chattanooga", "Clarksville"],
  Texas: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
  Utah: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
  Vermont: ["Burlington", "Essex", "Rutland", "Barre", "Montpelier"],
  Virginia: ["Virginia Beach", "Norfolk", "Richmond", "Alexandria", "Roanoke"],
  Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
  "West Virginia": ["Charleston", "Huntington", "Parkersburg", "Wheeling", "Morgantown"],
  Wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
  Wyoming: ["Cheyenne", "Laramie", "Casper", "Gillette", "Rock Springs"],
};

export default function PhysicianRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const thisform = e.currentTarget;
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      const payload = {
        ...data,
        pincode: data.pincode ? parseInt(data.pincode as string) : null,
        status: data.status ? parseInt(data.status as string) : 0,
        qualification_id: data.qualification_id ? parseInt(data.qualification_id as string) : null,
        active: true,
        role_id: 1,
        clinic_module_activated: 0, 
        consultation_fee_validity: "7 Days",
        Signature_image: "",
        created_by_id: 1,
        alternate_phone_number: data.alternate_phone_number || "",
        clinic_alternate_phonenum: data.clinic_alternate_phonenum || "",
        clinic_manager: data.clinic_manager || "",
        locality: data.locality || ""
      };

      const response = await fetch("/api/physician-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: result.error || "Registration failed" });
        return;
      }

      setMessage({ type: "success", text: "Physician registered successfully!" });
      thisform.reset();
      setSelectedState("");
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const citiesForState = selectedState ? CITIES_BY_STATE[selectedState] || [] : [];

  // Reusable input style for consistency
  const inputBaseStyle = "mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-500 text-sm";
  const labelStyle = "block text-sm font-semibold text-slate-700 ml-0.5";

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Physician Registration
              </h1>
              <p className="text-sm text-slate-500">Add a new medical professional to the system</p>
            </div>
          </div>
          <div className="hidden sm:block">
             <UserPlusIcon className="h-10 w-10 text-slate-200" />
          </div>
        </div>

        {/* Feedback Messages */}
        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current opacity-20" />
            {message.text}
          </div>
        )}

        {/* Main Form Card */}
        <form
          onSubmit={onSubmit}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          {/* Section: Personal Info */}
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">General Information</h3>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-3">
              <div>
                <label htmlFor="firstname" className={labelStyle}>First Name</label>
                <input id="firstname" name="firstname" type="text" placeholder="John" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="lastname" className={labelStyle}>Last Name <span className="text-rose-500">*</span></label>
                <input id="lastname" name="lastname" type="text" required placeholder="Doe" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="phone_num" className={labelStyle}>Phone Number <span className="text-rose-500">*</span></label>
                <input id="phone_num" name="phone_num" type="tel" required placeholder="+1 (555) 000-0000" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="alternate_phone_number" className={labelStyle}>Alternate Phone</label>
                <input id="alternate_phone_number" name="alternate_phone_number" type="tel" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="mail_id" className={labelStyle}>Email Address <span className="text-rose-500">*</span></label>
                <input id="mail_id" name="mail_id" type="email" required placeholder="john.doe@hospital.com" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="specialization" className={labelStyle}>Specialization <span className="text-rose-500">*</span></label>
                <select id="specialization" name="specialization" required className={inputBaseStyle}>
                  <option value="">Select Option</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec.value} value={spec.value}>{spec.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Clinic Info */}
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Clinic & Practice Details</h3>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-3">
              <div>
                <label htmlFor="clinic_name" className={labelStyle}>Clinic Name</label>
                <input id="clinic_name" name="clinic_name" type="text" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="clinic_phonenum" className={labelStyle}>Clinic Phone <span className="text-rose-500">*</span></label>
                <input id="clinic_phonenum" name="clinic_phonenum" type="tel" required className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="clinic_alternate_phonenum" className={labelStyle}>Clinic Alternate Phone</label>
                <input id="clinic_alternate_phonenum" name="clinic_alternate_phonenum" type="tel" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="clinic_manager" className={labelStyle}>Clinic Manager</label>
                <input id="clinic_manager" name="clinic_manager" type="text" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="registration_number" className={labelStyle}>Registration Number</label>
                <input id="registration_number" name="registration_number" type="text" placeholder="MD-123456" className={inputBaseStyle} />
              </div>
              <div>
                <label htmlFor="status" className={labelStyle}>Status <span className="text-rose-500">*</span></label>
                <select id="status" name="status" required className={inputBaseStyle}>
                  <option value="">Select Status</option>
                  <option value="0">Unregistered</option>
                  <option value="1">Registered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Location Details</h3>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-3">
              <div>
                <label htmlFor="state" className={labelStyle}>State <span className="text-rose-500">*</span></label>
                <select
                  id="state"
                  name="state"
                  required
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className={inputBaseStyle}
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className={labelStyle}>City <span className="text-rose-500">*</span></label>
                <select id="city" name="city" required disabled={!selectedState} className={inputBaseStyle}>
                  <option value="">Select City</option>
                  {citiesForState.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pincode" className={labelStyle}>Zip / Pin Code</label>
                <input id="pincode" name="pincode" type="text" inputMode="numeric" className={inputBaseStyle} />
              </div>
              <div className="md:col-span-1">
                <label htmlFor="locality" className={labelStyle}>Locality</label>
                <input id="locality" name="locality" type="text" className={inputBaseStyle} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className={labelStyle}>Full Address <span className="text-rose-500">*</span></label>
                <textarea id="address" name="address" rows={1} required className={inputBaseStyle} />
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="flex items-center justify-end gap-3 bg-slate-50 px-8 py-6 border-t border-slate-100">
            <button
              type="reset"
              disabled={loading}
              onClick={() => setSelectedState("")}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200/50 active:scale-95 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:hover:bg-blue-600"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}