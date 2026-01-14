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
  createdOn: string;
  firstName: string;
  phoneNum: string;
}

interface PatientDepDetailsData {
  firstname: string;
  lastname: string;
  gender: string;
  age: number;
}

interface TestDetail {
  testName: string;
  date: string;
  time: string;
  instructions: string;
  price: number;
  billingStatus: string;
}

interface BillingData {
  patientQueue: PatientQueueData;
  patientDepDetails: PatientDepDetailsData;
  patientTestDetails: TestDetail[];
}

export default function BillingPage({ params }: BillingPageProps) {
  const [patientData, setPatientData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);

  // 1. Resolve URL parameters
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // 2. Fetch data from the API
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing details...</p>
        </div>
      </div>
    );
  }

  if (error || !patientData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-red-600 font-bold text-xl mb-2">Error</p>
          <p className="text-gray-700">{error || 'Patient data not found'}</p>
        </div>
      </div>
    );
  }

  const { patientQueue, patientDepDetails, patientTestDetails } = patientData;
  
  // Calculate total dynamically from the tests array
  const totalDue = patientTestDetails.reduce((sum, test) => sum + test.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-60 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Bill Container */}
        <div className="bg-white rounded-xl shadow-xl border-t-8 border-blue-600 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-600 px-8 py-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">BILLING REPORT</h1>
              <p className="text-blue-400 text-sm font-medium mt-1 uppercase tracking-widest">iSmart Health Lab System</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase">Date Generated</p>
              <p className="text-lg font-semibold">{format(new Date(), 'dd MMM yyyy')}</p>
            </div>
          </div>

          {/* ID Section */}
          <div className="px-8 py-6 border-b border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-6 bg-slate-50/50">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Patient ID</p>
              <p className="text-md font-mono font-bold text-blue-700">{resolvedParams?.patient_id}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Bill Reference</p>
              <p className="text-md font-mono font-bold text-slate-900">{patientQueue.billId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Medical Number</p>
              <p className="text-md font-mono font-bold text-slate-900">{resolvedParams?.medical_num}</p>
            </div>
          </div>

          {/* Patient Details Section */}
          <div className="px-8 py-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Patient Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Full Name</p>
                <p className="text-md font-bold text-slate-900">
                  {patientDepDetails?.firstname 
                    ? `${patientDepDetails.firstname} ${patientDepDetails.lastname}`
                    : patientQueue.firstName || 'N/A'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Contact</p>
                <p className="text-md font-bold text-slate-900">{patientQueue.phoneNum || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Gender</p>
                <p className="text-md font-bold text-slate-900">{patientDepDetails?.gender || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Age</p>
                <p className="text-md font-bold text-slate-900">{patientDepDetails?.age || 'N/A'} Yrs</p>
              </div>
            </div>
          </div>

          {/* NEW: Patient Test Details Section */}
          <div className="px-8 pb-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Patient Test Details</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase">Tests</th>
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase text-center">Schedule</th>
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase">Instructions</th>
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase text-right">Price</th>
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase text-center">Billing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientTestDetails.length > 0 ? (
                    patientTestDetails.map((test, index) => (
                      <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{test.testName}</p>
                        </td>
                        <td className="p-4 text-center">
                          <p className="text-sm text-slate-700 font-medium">{test.date}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{test.time}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs text-slate-500 italic max-w-[200px] truncate" title={test.instructions}>
                            {test.instructions}
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-mono font-bold text-slate-900">${test.price.toFixed(2)}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            test.billingStatus === 'Approved' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {test.billingStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">No tests assigned to this medical number.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-slate-50 px-8 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="text-slate-500 text-xs max-w-sm">
              <p className="font-bold uppercase mb-2">Notice:</p>
              <p>This is a computer-generated billing report. Please ensure all tests listed above match the physician's referral before processing the final payment.</p>
            </div>
            
            <div className="w-full md:w-72">
              <div className="flex justify-between py-2 border-b border-slate-200 text-slate-600">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-mono font-bold">${totalDue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 text-slate-900">
                <span className="text-xl font-black uppercase">Total Due</span>
                <span className="text-2xl font-black font-mono text-blue-700">${totalDue.toFixed(2)}</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                Generate Final Bill
              </button>
              <button className="w-full mt-3 bg-white border border-slate-300 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-50 transition-all text-sm">
                Download PDF
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-slate-100 px-8 py-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Generated by {patientQueue.firstName || 'System'} • Original Entry: {format(new Date(patientQueue.createdOn), 'PPPP')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}