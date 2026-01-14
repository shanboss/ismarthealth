// app/lab/bill/[patient_id]/[medical_num]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface BillingPageProps {
  params: Promise<{
    patient_id: string;
    medical_num: string;
  }>;
}

interface PatientQueueData {
  billId: string;
  createdOn: Date;
  firstName: string;
  phoneNum: string;
}

interface PatientDepDetailsData {
  firstname: string;
  lastname: string;
  gender: string;
  age: number;
}

interface BillingData {
  patientQueue: PatientQueueData;
  patientDepDetails: PatientDepDetailsData;
}

export default function BillingPage({ params }: BillingPageProps) {
  const [patientData, setPatientData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Fetch billing data
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/lab/billing?patient_id=${resolvedParams.patient_id}&medical_num=${resolvedParams.medical_num}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch billing data');
        }

        const result = await response.json();
        setPatientData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing details...</p>
        </div>
      </div>
    );
  }

  if (error || !patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <p className="text-red-600 font-semibold">Error</p>
          <p className="text-gray-700 mt-2">{error || 'Patient data not found'}</p>
        </div>
      </div>
    );
  }

  const { patientQueue, patientDepDetails } = patientData;
  const billingItems = [
    {
      service: 'Lab Services',
      date: patientQueue.createdOn,
      amount: 0.00,
    },
  ];
  const totalDue = billingItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-t-lg shadow-lg border-t-4 border-blue-600 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Billing Report</h1>
            <p className="text-blue-100 text-sm mt-1">Lab Management System</p>
          </div>

          {/* Patient Information */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Patient ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">{resolvedParams?.patient_id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bill ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">{patientQueue.billId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medical Number</p>
                <p className="text-lg font-mono font-bold text-gray-900">{resolvedParams?.medical_num}</p>
              </div>
            </div>
          </div>

          {/* Patient Details Section */}
          <div className="px-8 py-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {patientDepDetails?.firstname && patientDepDetails?.lastname
                    ? `${patientDepDetails.firstname} ${patientDepDetails.lastname}`
                    : patientQueue.firstName || 'N/A'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{patientQueue.phoneNum || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Gender</p>
                <p className="text-lg font-semibold text-gray-900">{patientDepDetails?.gender || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Age</p>
                <p className="text-lg font-semibold text-gray-900">{patientDepDetails?.age || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Section */}
        <div className="bg-white shadow-lg px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Summary</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-600 bg-blue-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billingItems.length > 0 ? (
                  billingItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{item.service}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {format(new Date(item.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 px-4 text-center text-gray-500">
                      No billing items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total Section */}
          <div className="mt-8 border-t-2 border-gray-300 pt-6">
            <div className="flex justify-end mb-4">
              <div className="w-full md:w-80">
                <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-t-lg">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="font-semibold text-gray-900">${totalDue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 px-4 bg-blue-600 text-white rounded-b-lg">
                  <span className="text-lg font-bold">Total Due</span>
                  <span className="text-lg font-bold">${totalDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-end">
            <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
              Download PDF
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">
              Generate Final Bill
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white shadow-lg rounded-b-lg border-t border-gray-200 px-8 py-4 text-center text-sm text-gray-600">
          <p>Bill generated on {format(new Date(patientQueue.createdOn), 'MMMM dd, yyyy')}</p>
        </div>
      </div>
    </div>
  );
}