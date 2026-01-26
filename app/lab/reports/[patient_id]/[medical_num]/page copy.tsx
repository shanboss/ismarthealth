'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';

/* -------------------- TYPES -------------------- */

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
    medicalNumber: string;
  };
  tests: Array<{
    slNo: number;
    testName: string;
    date: string;
    time: string;
    sampleResult: string;
    unit: string;
    referenceRange: string;
    reviewApprove: string;
    reportStatus: string;
  }>;
}

interface ReportsPageProps {
  params: {
    patient_id: string;
    medical_num: string;
  };
}

/* -------------------- DATE FORMAT -------------------- */

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

/* -------------------- PAGE -------------------- */

export default function ReportsPage({ params }: ReportsPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);
    // Resolve URL parameters
    useEffect(() => {
      const resolveParams = async () => {
        const resolved = await params;
        setResolvedParams(resolved);
      };
      resolveParams();
    }, [params]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const patient_id = resolvedParams?.patient_id;
  const medical_num = resolvedParams?.medical_num;

  const reportContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  
  /* -------------------- FETCH DATA -------------------- */

  useEffect(() => {
    const fetchReport = async () => {
      if (!resolvedParams) return;

      try {
        setLoading(true);
        const res = await fetch(
          `/api/lab/reports?patient_id=${resolvedParams.patient_id}&medical_num=${resolvedParams.medical_num}`
        );

        if (!res.ok) throw new Error('Failed to fetch report');

        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'No data found');

        setReportData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [resolvedParams]);

  /* -------------------- PDF -------------------- */

  const handleDownloadPDF = async () => {
    if (!reportContentRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;

    html2pdf()
      .set({
        margin: 10,
        filename: `Lab_Report_${patient_id}_${medical_num}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4', orientation: 'portrait' },
      })
      .from(reportContentRef.current)
      .save();
  };

  /* -------------------- PRINT -------------------- */

  const handlePrint = () => {
    if (!reportContentRef.current) return;

    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Lab Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #999; padding: 6px; font-size: 12px; }
            th { background: #f1f1f1; }
          </style>
        </head>
        <body>
          ${reportContentRef.current.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  /* -------------------- STATES -------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 print:hidden">
          <button onClick={handleDownloadPDF} className="btn-primary flex gap-2">
            <Download size={16} /> PDF
          </button>
          <button onClick={handlePrint} className="btn-secondary flex gap-2">
            <Printer size={16} /> Print
          </button>
        </div>

        {/* REPORT */}
        <div ref={reportContentRef}>

          {/* LAB HEADER */}
          <div className="border-b pb-4">
            <h1 className="text-2xl font-bold uppercase">{laboratory.name}</h1>
            <p>{laboratory.address}</p>
            <p><b>Phone:</b> {laboratory.phone}</p>
          </div>

          {/* TITLE */}
          <div className="flex justify-between py-4">
            <h2 className="text-xl font-bold">LABORATORY REPORT</h2>
            <p>{formatDate(new Date())}</p>
          </div>

          {/* IDS */}
          <div className="grid grid-cols-4 gap-4 text-sm border-b pb-4">
            <div><b>Patient ID:</b> {patient_id}</div>
            <div><b>Medical No:</b> {medical_num}</div>
            <div><b>Status:</b> {tests[0]?.reportStatus || 'N/A'}</div>
            <div><b>Report Date:</b> {tests[0]?.date || formatDate(new Date())}</div>
          </div>

          {/* PATIENT */}
          <div className="grid grid-cols-5 gap-4 py-4 text-sm border-b">
            <div><b>Name:</b> {patient.name}</div>
            <div><b>Phone:</b> {patient.phone}</div>
            <div><b>Sex:</b> {patient.sex}</div>
            <div><b>Age:</b> {patient.age}</div>
            <div><b>Referred By:</b> {patient.referredDoctor}</div>
          </div>

          {/* TEST TABLE */}
          <table className="w-full mt-4 text-sm">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Test Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Reference Range</th>
                <th>Review</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.slNo}>
                  <td>{t.slNo}</td>
                  <td>{t.testName}</td>
                  <td>{t.date}</td>
                  <td>{t.time}</td>
                  <td>{t.sampleResult}</td>
                  <td>{t.unit}</td>
                  <td>{t.referenceRange}</td>
                  <td>{t.reviewApprove}</td>
                  <td>{t.reportStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* FOOTER */}
          <p className="text-center text-xs mt-6">
            This is a computer-generated laboratory report.
          </p>
        </div>
      </div>
    </div>
  );
}
