'use client';

import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Download, Printer, Plus } from 'lucide-react';
import Link from 'next/link';

interface labInfo {
  laboratory_name: string;
  laboratory_address: string;
  lab_city: string;
  lab_state: string;
  laboratory_phone: string;
  laboratory_email: string;
}

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
  testId: string;
  testName: string;
  date: string;
  time: string;
  instructions: string;
  billingStatus: string;
  status: string;
  price: string;
  sampleCollectedId?: number | 0;
  billingId: number | null;
  labapprovalId?: number | null;
  investigationId?: number | null;
}

interface BillingData {
  patientQueue: PatientQueueData;
  patientDepDetails: PatientDepDetailsData;
  patientTestDetails: TestDetail[];
  labInfo: labInfo;
}

export default function SampleDetailsPage({ params }: BillingPageProps) {
  const [patientData, setPatientData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);
  const [samplesCollected, setSamplesCollected] = useState<Set<number>>(new Set());
  const [samplesApproved, setSamplesApproved] = useState<Set<number>>(new Set());
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const billContentRef = useRef<HTMLDivElement>(null);

  // Resolve URL parameters
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Fetch data from the API
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/lab/samples?patient_id=${resolvedParams.patient_id}&medical_num=${resolvedParams.medical_num}`
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

  const handleSamplesCollected = async (index: number) => {
    if (!patientData || !resolvedParams) return;

    const test = patientData.patientTestDetails[index];

    // If sample is already collected (sampleCollectedId == 2), do nothing
    if ((test.sampleCollectedId ?? 0) >= 1) {
      console.log("Sample already marked as collected");
      return;
    }

    setIsUpdating(index);

    try {
      const response = await fetch("/api/lab/samples", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: resolvedParams.patient_id,
          medical_num: resolvedParams.medical_num,
          testId: test.testId,
          billingId: test.billingId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to mark sample as collected");
      }

      // Update local state to reflect the sample as collected
      setSamplesCollected(prev => {
        const newSet = new Set(prev);
        newSet.add(index);
        return newSet;
      });

      // Refresh the patient data to get the updated sampleCollectedId
      const refreshResponse = await fetch(
        `/api/lab/samples?patient_id=${resolvedParams.patient_id}&medical_num=${resolvedParams.medical_num}`
      );

      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();
        setPatientData(refreshResult.data);
      }

      console.log("Sample marked as collected successfully:", result);
    } catch (err) {
      console.error("Error marking sample as collected:", err);
      alert(err instanceof Error ? err.message : "Failed to mark sample as collected");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAddResults = (index: number) => {
    setSamplesApproved(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const handleDownloadPDF = async () => {
    if (!billContentRef.current) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = billContentRef.current;

      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.backgroundColor = '#ffffff';

      clonedElement.querySelectorAll<HTMLElement>('*').forEach((el) => {
        el.style.backgroundColor = window.getComputedStyle(el).backgroundColor || 'transparent';
        el.style.color = window.getComputedStyle(el).color || '#000000';
      });

      html2pdf()
        .set({
          margin: 10,
          filename: `sample_details_${resolvedParams?.patient_id}_${resolvedParams?.medical_num}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          },
          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        }).from(clonedElement).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF');
    }
  };

  const handlePrint = () => {
    if (!billContentRef.current) return;

    const printWindow = window.open('', '_blank', 'height=900,width=1200');
    if (!printWindow) {
      alert('Please allow pop-ups to print');
      return;
    }

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(style => style.outerHTML)
      .join('\n');

    const content = billContentRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sample Details Report - ${resolvedParams?.patient_id}</title>
          ${styles} 
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background-color: #fff;
              color: #000;
              margin: 0;
              padding: 0;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:border {
              border: 1px solid #999;
            }
            .print\\:border-b {
              border-bottom: 1px solid #999;
            }
            .print\\:border-t {
              border-top: 1px solid #999;
            }
            .print\\:border-gray-400 {
              border-color: #999;
            }
            .print\\:divide-y > * + * {
              border-top: 1px solid #999;
            }
            .print\\:divide-gray-400 {
              border-color: #999;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Loading sample details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 text-lg">No data available</p>
        </div>
      </div>
    );
  }

  const { patientQueue, patientDepDetails, patientTestDetails, labInfo } = patientData;

  return (
    <div className="min-h-screen bg-slate-50 py-4 print:bg-white">
      <div className="max-w-6xl mx-auto print:max-w-full">
        {/* Action Buttons */}
        <div className="mb-4 px-4 flex gap-2 print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
            title="Download as PDF"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition-all"
            title="Print report"
          >
            <Printer size={18} />
            Print
          </button>
        </div>

        {/* Main Content */}
        <div ref={billContentRef} className="bg-white shadow-lg print:shadow-none">
          {/* Header */}
          <div className="px-6 py-6 border-b-2 border-slate-300 print:border-b print:border-gray-400">
            <div className="flex flex-nowrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-700">
                  {labInfo.laboratory_name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {labInfo.laboratory_address}, {labInfo.lab_city}, {labInfo.lab_state}
                </p>
              </div>
              <div className="text-right text-sm text-gray-700 space-y-1">
                <p><span className="font-semibold">Phone:</span> {labInfo.laboratory_phone}</p>
                <p><span className="font-semibold">Email:</span> {labInfo.laboratory_email}</p>
              </div>
            </div>
          </div>

          {/* Sample Details Report Header */}
          <div className="px-6 py-6 border-b-2 border-slate-300 print:border-b print:border-gray-400 flex flex-nowrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-700">SAMPLE DETAILS REPORT</h1>
              <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">
                iSmart Health Lab System
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-500 uppercase">Date Generated</p>
              <p className="text-lg font-semibold text-slate-700 whitespace-nowrap">
                {format(new Date(), 'dd MMM yyyy')}
              </p>
            </div>
          </div>

          {/* IDs Section */}
          <div className="px-6 py-4 border-b-2 border-slate-300 print:border-b print:border-gray-400">
            <div className="flex flex-nowrap items-start justify-between gap-3 print:flex print:flex-nowrap print:gap-2 print:justify-between print:items-baseline">
              <div className="flex-1 min-w-[80px] max-w-[25%] print:min-w-[70px] print:max-w-[24%]">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Patient ID</p>
                <p className="text-xs font-mono font-bold text-blue-700 break-all leading-tight">
                  {resolvedParams?.patient_id}
                </p>
              </div>
              <div className="flex-1 min-w-[80px] max-w-[25%] print:min-w-[70px] print:max-w-[24%]">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Bill Reference</p>
                <p className="text-xs font-mono font-bold text-slate-900 break-all leading-tight">
                  {patientQueue.billId || 'N/A'}
                </p>
              </div>
              <div className="flex-1 min-w-[80px] max-w-[25%] print:min-w-[70px] print:max-w-[24%]">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Medical Number</p>
                <p className="text-xs font-mono font-bold text-slate-900 break-all leading-tight">
                  {resolvedParams?.medical_num}
                </p>
              </div>
              <div className="flex-1 min-w-[80px] max-w-[25%] print:min-w-[70px] print:max-w-[24%]">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Bill Created On</p>
                <p className="text-xs font-bold text-slate-900 whitespace-nowrap leading-tight">
                  {format(new Date(patientQueue.createdOn), 'dd MMM yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="px-6 py-4 border-b-2 border-slate-300 print:border-b print:border-gray-400">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3 print:mb-2">
              Patient Details
            </h3>
            <div className="grid grid-cols-5 gap-x-4 gap-y-2 text-sm print:grid-cols-5 print:gap-x-2 print:gap-y-1 print:text-xs">
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Full Name</p>
                <p className="font-bold text-slate-900 leading-tight">
                  {patientDepDetails?.firstname
                    ? `${patientDepDetails.firstname} ${patientDepDetails.lastname}`
                    : patientQueue.firstName || 'N/A'}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Contact</p>
                <p className="font-bold text-slate-900 leading-tight">{patientQueue.phoneNum || 'N/A'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Gender</p>
                <p className="font-bold text-slate-900 leading-tight">{patientDepDetails?.gender || 'N/A'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Age</p>
                <p className="font-bold text-slate-900 leading-tight">{patientDepDetails?.age || 'N/A'} Yrs</p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Status</p>
                <p className="font-bold text-slate-900 leading-tight">Active</p>
              </div>
            </div>
          </div>

          {/* Tests Table */}
          <div className="px-6 py-4 border-b-2 border-slate-300 print:border-b print:border-gray-400">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Patient Test Details</h3>
            <div className="border border-slate-300 print:border print:border-gray-400 rounded overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 border-b border-slate-300 print:border-b print:border-gray-400">
                  <tr>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase w-12">S.No</th>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase">Tests</th>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase text-center w-32">Schedule</th>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase w-40">Price</th>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase text-center w-24">Status</th>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase text-center w-40 print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 print:divide-y print:divide-gray-400">
                  {patientTestDetails.length > 0 ? (
                    patientTestDetails.map((test, index) => (
                      <tr key={index} className="print:hover:bg-transparent">
                        <td className="p-3 text-center font-bold text-slate-900">{index + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{test.testName}</td>
                        <td className="p-3 text-center">
                          <div className="text-xs font-medium text-slate-700">{test.date}</div>
                          <div className="text-[9px] text-slate-500">{test.time}</div>
                        </td>
                        <td className="p-3 text-xs text-slate-600">{test.price}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase ${
                              test.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {test.status}
                          </span>
                        </td>
                        <td className="p-3 text-center print:hidden space-y-2">
                          <button
                            onClick={() => handleSamplesCollected(index)}
                            disabled={isUpdating === index || test.sampleCollectedId == 2}
                            className={`w-full inline-flex items-center justify-center gap-1 font-bold py-1.5 px-2.5 rounded text-[10px] transition-all ${
                              test.sampleCollectedId ?? 0 >= 1
                                ? (test.sampleCollectedId == 1 ? 'bg-gray-900 text-white cursor-not-allowed opacity-75': 'bg-green-700 text-white cursor-not-allowed opacity-75')
                                : isUpdating === index
                                ? 'bg-gray-500 text-white cursor-wait'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                            title={test.sampleCollectedId ?? 0 >= 1 ? "Sample already approved" : "Mark sample as collected"}
                          >
                            {isUpdating === index
                              ? "Updating..."
                              : test.sampleCollectedId ?? 0 >= 1
                              ? (test.sampleCollectedId == 1 ? "Sample Approved": "Sample Collected")
                              : "Approve Sample"}
                          </button>
                          {(test.sampleCollectedId == 1) && (
                            
                            <Link
                              href={`/lab/AddReport/${resolvedParams?.medical_num}/${resolvedParams?.patient_id}/${test.investigationId}/${test.labapprovalId}/${test.billingId}/${test.sampleCollectedId}`}
                              className="w-full inline-flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-2.5 rounded text-[10px] transition-all"
                              title="Add test results"
                            >
                              <Plus size={14} />
                              Add Results
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        No tests assigned to this medical number.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notice Section */}
          <div className="px-6 py-6 border-t-2 border-slate-300 print:border-t print:border-gray-400">
            <div className="text-slate-600 text-xs">
              <p className="font-bold uppercase mb-2 text-slate-700">Notice:</p>
              <p>This is a computer-generated Sample Details Report. Please ensure all tests listed above match the physician&quot;s referral before processing the final payment.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t-2 border-slate-300 print:border-t print:border-gray-400 text-center text-xs text-slate-500 font-medium">
            Generated by {patientQueue.firstName || 'System'} • Original Entry: {format(new Date(patientQueue.createdOn), 'dd MMM yyyy')}
          </div>
        </div>
      </div>
    </div>
  );
}