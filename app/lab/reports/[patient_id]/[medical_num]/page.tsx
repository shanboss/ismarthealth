// app/lab/reports/[patient_id]/[medical_num]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Download, Printer, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
    testId: number;
    parseParentId: number;
  }>;
}

interface ReportsPageProps {
  params: Promise<{
    patient_id: string;
    medical_num: string;
  }>;
}

interface DoctorOption {
  id: number;
  name: string;
}

interface ModalApprovalState {
  isOpen: boolean;
  testId: number | null;
  selectedDoctorId: number | null;
  password: string;
  error: string;
  loading: boolean;
}

interface ModalApprovalTableState {
  isOpen: boolean;
  parentTestName: string;
  tests: Array<{
    slNo: number;
    testName: string;
    sampleResult: string;
    unit: string;
    referenceRange: string;
    testId: number;
  }>;
  selectedDoctorId: number | null;
  doctorName: string;
  approving: boolean;
  approvingTestId: number | null;
}

// Dummy doctors list - Replace with actual API call
const DUMMY_DOCTORS: DoctorOption[] = [
  { id: 1, name: 'Dr. John Smith' },
  { id: 2, name: 'Dr. Sarah Johnson' },
  { id: 3, name: 'Dr. Michael Brown' },
  { id: 4, name: 'Dr. Emily Davis' },
];

const DUMMY_PASSWORD = '123456';

export default function ReportsPage({ params }: ReportsPageProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const [modalApproval, setModalApproval] = useState<ModalApprovalState>({
    isOpen: false,
    testId: null,
    selectedDoctorId: null,
    password: '',
    error: '',
    loading: false,
  });

  const [modalApprovalTable, setModalApprovalTable] = useState<ModalApprovalTableState>({
    isOpen: false,
    parentTestName: '',
    tests: [],
    selectedDoctorId: null,
    doctorName: '',
    approving: false,
    approvingTestId: null,
  });

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Fetch report data
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const { patient_id, medical_num } = resolvedParams;
        const response = await fetch(
          `/api/lab/reports?patient_id=${patient_id}&medical_num=${medical_num}`
        );

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

  // Open approval modal (Doctor login)
  const openApprovalModal = (test: ReportData['tests'][0]) => {
    setModalApproval({
      isOpen: true,
      testId: test.testId,
      selectedDoctorId: null,
      password: '',
      error: '',
      loading: false,
    });
  };

  // Handle doctor login and show approval table
  const handleDoctorLogin = async () => {
    if (!modalApproval.selectedDoctorId || !modalApproval.password) {
      setModalApproval(prev => ({
        ...prev,
        error: 'Please select doctor and enter password',
      }));
      return;
    }

    // Validate password (dummy validation)
    if (modalApproval.password !== DUMMY_PASSWORD) {
      setModalApproval(prev => ({
        ...prev,
        error: 'Invalid password. Use 123456 for demo',
      }));
      return;
    }

    setModalApproval(prev => ({ ...prev, loading: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get selected doctor name
      const selectedDoctor = DUMMY_DOCTORS.find(d => d.id === modalApproval.selectedDoctorId);
      const doctorName = selectedDoctor?.name || 'Unknown Doctor';

      // Get the test data to show in approval table
      if (!reportData || !reportData.tests) {
        throw new Error('No test data available');
      }

      // Find the parent test that was clicked
      const clickedTest = reportData.tests.find(t => t.testId === modalApproval.testId);
      if (!clickedTest) {
        throw new Error('Test not found');
      }

      const parentTestName = clickedTest.investigationName || 'Unknown Test';

      // Filter tests that have the same investigation name (parent test)
      // and need approval (sampleCollectedId === 2)
      const testsToApprove = reportData.tests
        .filter(test => 
          test.investigationName === clickedTest.investigationName && 
          test.sampleCollectedId === 2
        )
        .map(test => ({
          slNo: test.slNo,
          testName: test.testName,
          sampleResult: test.sampleResult,
          unit: test.unit,
          referenceRange: test.referenceRange,
          testId: test.testId,
        }));

      // Show approval table modal
      setModalApprovalTable({
        isOpen: true,
        parentTestName: parentTestName,
        tests: testsToApprove,
        selectedDoctorId: modalApproval.selectedDoctorId,
        doctorName: doctorName,
        approving: false,
        approvingTestId: null,
      });

      // Close login modal
      setModalApproval(prev => ({
        ...prev,
        isOpen: false,
        loading: false,
      }));
    } catch (err) {
      setModalApproval(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Login failed',
        loading: false,
      }));
    }
  };

  // Handle individual test approval
  const handleApproveSingleTest = async (testId: number) => {
    try {
      setModalApprovalTable(prev => ({
        ...prev,
        approving: true,
        approvingTestId: testId,
      }));

      // Here you would typically call an API to approve the test
      // Example:
      // const response = await fetch('/api/lab/approve-test', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     doctorId: modalApprovalTable.selectedDoctorId,
      //     testId: testId,
      //     patientId: resolvedParams?.patient_id,
      //     medicalNum: resolvedParams?.medical_num,
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      alert('Test approved successfully by ' + modalApprovalTable.doctorName);
      
      // Remove approved test from list
      setModalApprovalTable(prev => ({
        ...prev,
        tests: prev.tests.filter(t => t.testId !== testId),
        approving: false,
        approvingTestId: null,
      }));

      // If all tests approved, close modal
      if (modalApprovalTable.tests.length === 1) {
        setTimeout(() => {
          setModalApprovalTable(prev => ({ ...prev, isOpen: false }));
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Approval failed');
      setModalApprovalTable(prev => ({
        ...prev,
        approving: false,
        approvingTestId: null,
      }));
    }
  };

  // Handle approve all
  const handleApproveAll = async () => {
    try {
      setModalApprovalTable(prev => ({
        ...prev,
        approving: true,
      }));

      // Here you would typically call an API to approve all tests
      // Example:
      // const response = await fetch('/api/lab/approve-tests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     doctorId: modalApprovalTable.selectedDoctorId,
      //     testIds: modalApprovalTable.tests.map(t => t.testId),
      //     patientId: resolvedParams?.patient_id,
      //     medicalNum: resolvedParams?.medical_num,
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('All tests approved successfully by ' + modalApprovalTable.doctorName);
      setModalApprovalTable(prev => ({ ...prev, isOpen: false, approving: false }));
      
      // Reload report data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Approval failed');
      setModalApprovalTable(prev => ({ ...prev, approving: false }));
    }
  };

  // Handle signout
  const handleSignout = () => {
    setModalApprovalTable(prev => ({ ...prev, isOpen: false }));
    setModalApproval({
      isOpen: false,
      testId: null,
      selectedDoctorId: null,
      password: '',
      error: '',
      loading: false,
    });
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors border border-slate-300 shadow-sm print:hidden m-4"
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
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
              <p className="text-sm text-slate-600 mt-0.5">
                <span className="font-bold">Phone:</span> {laboratory.phone}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black uppercase text-slate-900">Laboratory Report</h2>
              <p className="text-sm text-slate-600 mt-1">
                <span className="font-bold">Report Date:</span> {reportDate}
              </p>
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
                    <th className="px-3 py-2 text-left font-bold uppercase text-slate-700 w-32">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const grouped = tests.reduce((acc, test) => {
                      const key = test.investigationName?.trim() || 'NA';
                      if (!acc[key]) acc[key] = [];
                      acc[key].push(test);
                      return acc;
                    }, {} as Record<string, typeof tests>);

                    return Object.entries(grouped).map(([investigationName, groupTests]) => (
                      <React.Fragment key={investigationName}>
                        <tr className="bg-slate-100/70 border-y border-slate-300">
                          <td
                            colSpan={9}
                            className="px-4 py-2.5 font-bold text-slate-800 uppercase tracking-wide text-sm"
                          >
                            {investigationName}
                          </td>
                        </tr>

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
                              {test.sampleCollectedId === 2 ? (
                                <button
                                  onClick={() => openApprovalModal(test)}
                                  className="w-full inline-flex items-center justify-center gap-1 font-bold py-1.5 px-2.5 rounded text-[10px] transition-all bg-red-600 hover:bg-red-700 text-white print:hidden"
                                >
                                  Approve
                                </button>
                              ) : (
                                <span className="text-slate-600">{test.reportStatus}</span>
                              )}
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

      {/* MODAL 1: DOCTOR LOGIN / APPROVAL STEP 1 */}
      {modalApproval.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h5 className="text-lg font-semibold">Doctor Approval</h5>
              <button
                onClick={() => setModalApproval(prev => ({ ...prev, isOpen: false }))}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modalApproval.error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {modalApproval.error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  value={modalApproval.selectedDoctorId || ''}
                  onChange={(e) =>
                    setModalApproval(prev => ({
                      ...prev,
                      selectedDoctorId: e.target.value ? Number(e.target.value) : null,
                      error: '',
                    }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                >
                  <option value="">-- Select a Doctor --</option>
                  {DUMMY_DOCTORS.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={modalApproval.password}
                  onChange={(e) =>
                    setModalApproval(prev => ({
                      ...prev,
                      password: e.target.value,
                      error: '',
                    }))
                  }
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Demo password: 123456</p>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-4 flex justify-between gap-3 rounded-b-lg">
              <button
                onClick={handleDoctorLogin}
                disabled={modalApproval.loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {modalApproval.loading ? 'Validating...' : 'Continue'}
              </button>
              <button
                onClick={() => setModalApproval(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APPROVAL TABLE / APPROVAL STEP 2 */}
      {modalApprovalTable.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg sticky top-0">
              <div>
                <h5 className="text-lg font-semibold">{modalApprovalTable.parentTestName}</h5>
                <p className="text-sm text-green-100 mt-1">Doctor: {modalApprovalTable.doctorName}</p>
              </div>
              <button
                onClick={handleSignout}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto border border-slate-300 rounded-lg mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Test Name</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Sample Value</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Unit</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Reference Range</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-800 w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalApprovalTable.tests.map((test, index) => (
                      <tr key={test.testId} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3 border-b border-slate-200 font-medium text-slate-900">
                          {test.testName}
                        </td>
                        <td className="px-4 py-3 border-b border-slate-200 text-slate-700">
                          {test.sampleResult}
                        </td>
                        <td className="px-4 py-3 border-b border-slate-200 text-slate-700">
                          {test.unit}
                        </td>
                        <td className="px-4 py-3 border-b border-slate-200 text-slate-700">
                          {test.referenceRange}
                        </td>
                        <td className="px-4 py-3 border-b border-slate-200 text-center">
                          <button
                            onClick={() => handleApproveSingleTest(test.testId)}
                            disabled={
                              modalApprovalTable.approving &&
                              modalApprovalTable.approvingTestId === test.testId
                            }
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {modalApprovalTable.approving &&
                            modalApprovalTable.approvingTestId === test.testId ? (
                              <>
                                <span className="animate-spin">⏳</span> Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={14} /> Approve
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Tests Remaining:</span> {modalApprovalTable.tests.length}
                </p>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-4 flex justify-end gap-3 rounded-b-lg sticky bottom-0 border-t border-slate-200">
              <button
                onClick={handleSignout}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Sign Out
              </button>
              <button
                onClick={handleApproveAll}
                disabled={modalApprovalTable.approving || modalApprovalTable.tests.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {modalApprovalTable.approving ? (
                  <>
                    <span className="animate-spin">⏳</span> Approving All...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> Approve All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}