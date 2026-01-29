// app/lab/reports/[patient_id]/[medical_num]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Download, Printer } from 'lucide-react';
import Link from 'next/link';
//import { useRouter } from 'next/navigation';

interface ReportData {
  laboratory: {
    name: string;
    phone: string;
    address: string;
  };
  patient: {
    name: string;
    phone: string;
    sex: string;
    age: string;
    referredDoctor: string;
  };
  tests: Array<{
    slNo: number;
    investigationName: string;
    testName: string;
    date: string;
    time: string;
    sampleResult: string;
    unit: string;
    referenceRange: string;
    reviewApprove: string;
    reportStatus: string;
    sampleCollectedId: number;
  }>;
}

interface ReportsPageProps {
  params: Promise<{
    patient_id: string;
    medical_num: string;
  }>;
}

export default function ReportsPage({ params }: ReportsPageProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);
  //const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const { patient_id, medical_num } = resolvedParams;
        const response = await fetch(`/api/lab/reports?patient_id=${patient_id}&medical_num=${medical_num}`);

        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }

        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'No data found');

        setReportData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [resolvedParams]);

  const handleDownloadPDF = async () => {
    if (!reportContentRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;

    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `Lab_Report_${resolvedParams?.patient_id}_${resolvedParams?.medical_num}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(reportContentRef.current)
      .save();
  };

  const handlePrint = () => {
    if (!reportContentRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Report</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 1rem; color: #334155; }
            @media print { .print\\:hidden { display: none; } }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; }
            .text-xs { font-size: 0.75rem; }
            .font-bold { font-weight: 700; }
            .uppercase { text-transform: uppercase; }
            .text-slate-900 { color: #0f172a; }
            .text-slate-600 { color: #475569; }
            .border-b { border-bottom: 1px solid #e2e8f0; }
            .pb-4 { padding-bottom: 1rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          ${reportContentRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading report...
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || 'Report not found'}
      </div>
    );
  }

  const { laboratory, patient, tests } = reportData;
  const currentDate = format(new Date(), 'dd MMM yyyy');
  const reportDate = tests[0]?.date ? format(new Date(tests[0].date), 'dd MMM yyyy') : currentDate;

  return (
    <div className="min-h-screen bg-slate-50 p-6 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors border border-slate-300 shadow-sm print:hidden"
              title="Back to Lab Dashboard"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="hidden sm:inline"></span>
            </Link>  
        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 p-4 print:hidden border-b border-slate-200">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={16} /> Download PDF
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <Printer size={16} /> Print
          </button>
        </div>

        {/* REPORT CONTENT */}
        <div ref={reportContentRef} className="p-6 print:p-4">
          
          {/* HEADER */}
          <div className="grid grid-cols-2 gap-4 border-b-2 border-slate-300 print:border-b print:border-gray-400 pb-4">
            <div>
              <h1 className="text-xl font-black uppercase text-slate-900">{laboratory.name}</h1>
              <p className="text-sm text-slate-600 mt-1">{laboratory.address}</p>
              <p className="text-sm text-slate-600 mt-0.5"><span className="font-bold">Phone:</span> {laboratory.phone}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black uppercase text-slate-900">Laboratory Report</h2>
              <p className="text-sm text-slate-600 mt-1"><span className="font-bold">Report Date:</span> {reportDate}</p>
            </div>
          </div>

          {/* PATIENT DETAILS */}
          <div className="grid grid-cols-3 gap-4 py-4 text-sm border-b-2 border-slate-300 print:border-b print:border-gray-400">
            <div>
              <p className="font-bold uppercase text-xs text-slate-700">Patient Name</p>
              <p className="font-medium text-slate-900 mt-0.5">{patient.name}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-xs text-slate-700">Phone</p>
              <p className="font-medium text-slate-900 mt-0.5">{patient.phone}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-xs text-slate-700">Sex</p>
              <p className="font-medium text-slate-900 mt-0.5">{patient.sex}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-xs text-slate-700">Age</p>
              <p className="font-medium text-slate-900 mt-0.5">{patient.age}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-xs text-slate-700">Referred By</p>
              <p className="font-medium text-slate-900 mt-0.5">{patient.referredDoctor}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-xs text-slate-700">Medical No</p>
              <p className="font-medium text-slate-900 mt-0.5">{resolvedParams?.medical_num}</p>
            </div>
          </div>

          {/* TEST DETAILS – GROUPED BY INVESTIGATION NAME */}
          <div className="mt-6">
            <h3 className="text-base font-bold uppercase text-slate-900 mb-3">Test Details</h3>
            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700 w-12">S.No</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700">Test Name</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700 w-28">Date</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700 w-24">Time</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700">Result</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700 w-20">Unit</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700">Reference Range</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700 w-24">Review</th>
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700 w-24">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Group tests by investigationName
                    const grouped = tests.reduce((acc, test) => {
                      const key = (test.investigationName)?test.investigationName.trim():'NA';
                      if (!acc[key]) acc[key] = [];
                      acc[key].push(test);
                      return acc;
                    }, {} as Record<string, typeof tests>);

                    return Object.entries(grouped).map(([investigationName, groupTests]) => (
                      <React.Fragment key={investigationName}>
                        {/* Group header row */}
                        <tr className="bg-slate-100/70 border-y border-slate-300">
                          <td 
                            colSpan={9}
                            className="px-4 py-2.5 font-bold text-slate-800 uppercase tracking-wide text-sm"
                          >
                            {investigationName}
                          </td>
                        </tr>

                        {/* Tests in this group */}
                        {groupTests.map((test) => (
                          <tr 
                            key={test.slNo} 
                            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                          >
                            <td className="px-3 py-2 font-medium text-slate-900">{test.slNo}</td>
                            <td className="px-3 py-2 font-medium text-slate-900">{test.testName}</td>
                            <td className="px-3 py-2 text-slate-600">{test.date}</td>
                            <td className="px-3 py-2 text-slate-600">{test.time}</td>
                            <td className="px-3 py-2 font-medium text-slate-700">{test.sampleResult}</td>
                            <td className="px-3 py-2 text-slate-600">{test.unit}</td>
                            <td className="px-3 py-2 text-slate-600">{test.referenceRange}</td>
                            <td className="px-3 py-2 text-slate-600">{test.reviewApprove}</td>
                            <td className="px-3 py-2 text-slate-600">
                              
                              {test.sampleCollectedId == 2 ? 
                              <button className={`w-full inline-flex items-center justify-center gap-1 font-bold py-1.5 px-2.5 rounded text-[10px] transition-all bg-red-600 hover:bg-red-700 text-white`}> Available </button> : test.reportStatus}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t-2 border-slate-300 print:border-t print:border-gray-400 text-center text-xs text-slate-500 font-medium mt-6">
            This is a computer-generated laboratory report. Generated on {currentDate}
          </div>
        </div>
      </div>
    </div>
  );
}