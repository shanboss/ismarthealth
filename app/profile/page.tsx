'use client';

import { useState } from 'react';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CameraIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome Madhavan
          </h1>
          <p className="text-lg text-slate-600">Manage your professional profile and clinic information</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Profile Summary Card */}
          <div className="group rounded-2xl border border-blue-200 bg-white shadow-lg transition duration-300 hover:shadow-2xl overflow-hidden">
            {/* Card Header Background */}
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <div className="px-6 py-8">
              {/* Profile Image */}
              <div className="relative -mt-20 mb-6 flex justify-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg flex items-center justify-center">
                  <UserIcon className="h-24 w-24 text-blue-400" />
                </div>
                <button className="absolute bottom-2 right-2 inline-flex items-center justify-center rounded-full bg-blue-600 p-2 text-white shadow-md transition hover:bg-blue-700">
                  <CameraIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Name and Title */}
              <h2 className="text-center text-2xl font-bold text-foreground">Dr. Madhavan</h2>
              <p className="mt-1 text-center text-lg font-medium text-blue-600">General Physician</p>

              {/* Info Details */}
              <div className="mt-8 space-y-4">
                {/* Registration Number */}
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Registration Number</p>
                  <p className="mt-1 text-lg font-bold text-foreground">234687985</p>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-slate-50 transition">
                  <PhoneIcon className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone Number</p>
                    <p className="text-sm font-medium text-foreground">9902030560</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-slate-50 transition">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-foreground">physician@inetframe.com</p>
                  </div>
                </div>

                {/* Specialization */}
                <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-slate-50 transition">
                  <UserIcon className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Specialization</p>
                    <p className="text-sm font-medium text-foreground">General Physician</p>
                  </div>
                </div>

                {/* Degree */}
                <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-slate-50 transition">
                  <CheckIcon className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Degree</p>
                    <p className="text-sm font-medium text-slate-400">—</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95"
                >
                  <MapPinIcon className="h-5 w-5" />
                  Setup Preferred Lab
                </button>
              </div>
            </div>
          </div>

          {/* Right Update Profile Form */}
          <div className="rounded-2xl border border-blue-200 bg-white shadow-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <h2 className="text-xl font-bold text-foreground">Update Profile</h2>
              <p className="mt-1 text-sm text-slate-600">Edit your professional information and clinic details</p>
            </div>

            <form className="space-y-6 p-6">
              {/* Contact Section */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">Contact Information</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="altPhone">
                      Alternate Phone Number
                    </label>
                    <input
                      id="altPhone"
                      type="tel"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      defaultValue="7618743177"
                    />
                  </div>
                </div>
              </div>

              {/* Clinic Section */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">Clinic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="clinicName">
                      Clinic Name
                    </label>
                    <input
                      id="clinicName"
                      type="text"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      defaultValue="Madhavan Clinic"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="clinicPhone">
                        Phone Number
                      </label>
                      <input
                        id="clinicPhone"
                        type="tel"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        defaultValue="9902030560"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="clinicAltPhone">
                        Alternate Phone
                      </label>
                      <input
                        id="clinicAltPhone"
                        type="tel"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        defaultValue="7618743177"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="clinicAddress">
                      Clinic Address
                    </label>
                    <textarea
                      id="clinicAddress"
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                      defaultValue="8th Block, Basavanagudi"
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">Location Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="state">
                      State
                    </label>
                    <select
                      id="state"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      defaultValue="Karnataka"
                    >
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                      <option>Tamil Nadu</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="city">
                      City
                    </label>
                    <select
                      id="city"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      defaultValue="Bangalore"
                    >
                      <option>Bangalore</option>
                      <option>Mysore</option>
                      <option>Hubli</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="locality">
                      Locality
                    </label>
                    <input
                      id="locality"
                      type="text"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      defaultValue="Banashankari"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">Additional Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="pincode">
                      Pincode
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-foreground placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      defaultValue="333333"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Clinic Manager</label>
                    <div className="flex items-center gap-6 rounded-lg border border-slate-300 bg-white px-4 py-2.5">
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="clinicManager" defaultChecked className="cursor-pointer" />
                        <span className="text-foreground">Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="clinicManager" className="cursor-pointer" />
                        <span className="text-foreground">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="photo">
                      Update Photo
                    </label>
                    <input
                      id="photo"
                      type="file"
                      className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border file:border-slate-300 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95"
                >
                  <CheckIcon className="h-5 w-5" />
                  Update
                </button>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center rounded-lg border-2 border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition duration-200 hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}