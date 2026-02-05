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

export default function ReportsPage({ params }: ReportsPageProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [LabDoctors, setLabDoctors] = useState<DoctorOption[]>(DUMMY_DOCTORS);

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

  const [approvedTestIds, setApprovedTestIds] = useState<Set<number>>(new Set());

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
  const openApprovalModal = async (test: ReportData['tests'][0]) => {
    try {
      // Call the API to fetch lab doctors
      const response = await fetch(
        `/api/lab/reports/labdoctors?testId=${test.testId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch lab doctors');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch doctors');
      }

      // Set the lab doctors from API response
      const doctors: DoctorOption[] = result.data.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
      }));

      setLabDoctors(doctors);

      // Open the modal
      setModalApproval({
        isOpen: true,
        testId: test.testId,
        selectedDoctorId: null,
        password: '',
        error: '',
        loading: false,
      });
    } catch (err) {
      setModalApproval({
        isOpen: true,
        testId: test.testId,
        selectedDoctorId: null,
        password: '',
        error: err instanceof Error ? err.message : 'Failed to fetch doctors',
        loading: false,
      });
    }
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

    setModalApproval(prev => ({ ...prev, loading: true }));

    try {
      // Call the API to validate doctor credentials
      const response = await fetch('/api/lab/reports/labdoctorlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          laboratory_doctors_id: modalApproval.selectedDoctorId,
          password: modalApproval.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Password is wrong or doctor not found
        setModalApproval(prev => ({
          ...prev,
          error: result.message || 'Invalid credentials',
          loading: false,
        }));
        return;
      }

      // Credentials are valid, proceed to approval modal
      // Get selected doctor name
      const selectedDoctor = LabDoctors.find(d => d.id === modalApproval.selectedDoctorId);
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
    if (!resolvedParams) {
      alert('Error: Parameters not loaded');
      return;
    }

    try {
      setModalApprovalTable(prev => ({
        ...prev,
        approving: true,
        approvingTestId: testId,
      }));

      // Call the API to approve the test
      const response = await fetch('/api/lab/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_id: testId,
          medical_num: resolvedParams.medical_num,
          patient_id: resolvedParams.patient_id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to approve test');
      }

      // Add testId to approved list
      setApprovedTestIds(prev => new Set([...prev, testId]));

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
    if (!resolvedParams) {
      alert('Error: Parameters not loaded');
      return;
    }

    try {
      setModalApprovalTable(prev => ({
        ...prev,
        approving: true,
      }));

      // Approve all tests sequentially
      const testIds = modalApprovalTable.tests.map(t => t.testId);
      let successCount = 0;
      let failureCount = 0;
      const successfulTestIds: number[] = [];

      for (const testId of testIds) {
        try {
          const response = await fetch('/api/lab/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              test_id: testId,
              medical_num: resolvedParams.medical_num,
              patient_id: resolvedParams.patient_id,
            }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            successCount++;
            successfulTestIds.push(testId);
          } else {
            failureCount++;
          }
        } catch (err) {
          failureCount++;
        }
      }

      // Add all successfully approved tests to the approvedTestIds Set
      if (successfulTestIds.length > 0) {
        setApprovedTestIds(prev => new Set([...prev, ...successfulTestIds]));
      }

      alert(`Approval complete: ${successCount} approved, ${failureCount} failed`);

      // Clear modal and refresh
      setModalApprovalTable(prev => ({ ...prev, isOpen: false, tests: [], approving: false }));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Bulk approval failed');
      setModalApprovalTable(prev => ({
        ...prev,
        approving: false,
      }));
    }
  };

  // Handle signout
  const handleSignout = () => {
    setModalApprovalTable(prev => ({ ...prev, isOpen: false }));
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Report</h2>
            <p className="text-slate-600 mb-4">{error || 'No data available'}</p>
            <Link
              href="/lab/reports"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Reports
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentDate = format(new Date(), 'dd MMM yyyy, hh:mm a');

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* HEADER CONTROLS */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <h1 className="text-2xl font-bold text-slate-900">Laboratory Report</h1>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <Download size={18} /> Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              <Printer size={18} /> Print
            </button>
          </div>
        </div>

        {/* REPORT CONTENT */}
        <div ref={reportContentRef} className="p-6">
          {/* LABORATORY HEADER */}
          <div className="text-center border-b-2 border-slate-300 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{reportData.laboratory.name}</h2>
            <p className="text-slate-600 text-sm mt-1">{reportData.laboratory.address}</p>
            <p className="text-slate-600 text-sm">Phone: {reportData.laboratory.phone}</p>
          </div>

          {/* PATIENT DETAILS */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div className="border border-slate-300 rounded-lg p-4">
              <h3 className="font-bold text-slate-900 mb-2 text-base">Patient Information</h3>
              <div className="space-y-1 text-slate-700">
                <p><span className="font-semibold">Name:</span> {reportData.patient.name}</p>
                <p><span className="font-semibold">Sex:</span> {reportData.patient.sex}</p>
                <p><span className="font-semibold">Age:</span> {reportData.patient.age}</p>
                <p><span className="font-semibold">Phone:</span> {reportData.patient.phone}</p>
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg p-4">
              <h3 className="font-bold text-slate-900 mb-2 text-base">Referred Doctor</h3>
              <div className="space-y-1 text-slate-700">
                <p>{reportData.patient.referredDoctor || 'N/A'}</p>
                <p className="text-xs text-slate-500 mt-2">Doctor Name and Details</p>
              </div>
            </div>
          </div>

          {/* TESTS TABLE */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3 uppercase">Laboratory Test Results</h3>
            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-200 border-b-2 border-slate-300">
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Sl No</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Investigation</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Test Name</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Date</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Result</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Unit</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Reference Range</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Status</th>
                    <th className="px-4 py-2 text-center font-bold text-slate-900 w-20 print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Group tests by investigation name
                    const groupedTests = reportData.tests.reduce((acc: any, test) => {
                      if (!acc[test.investigationName]) {
                        acc[test.investigationName] = [];
                      }
                      acc[test.investigationName].push(test);
                      return acc;
                    }, {});

                    return Object.entries(groupedTests).map(([investigationName, tests]: any) => (
                      <React.Fragment key={investigationName}>
                        {tests.map((test: any, idx: number) => (
                          <tr
                            key={`${investigationName}-${idx}`}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                          >
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800">{test.testId}</td>
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800">{investigationName}</td>
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800 font-medium">{test.testName}</td>
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800">{test.date}</td>
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800 font-semibold text-blue-600">
                              {test.sampleResult}
                            </td>
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800">{test.unit}</td>
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800">{test.referenceRange}</td>
                            <td className="px-4 py-3 border-b border-slate-200 text-slate-800">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  test.reportStatus === 'Completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {test.reportStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-b border-slate-200 text-center print:hidden">
                              {test.sampleCollectedId >= 2 && test.reviewApprove === 'Pending' ? (
                                <button
                                  onClick={() => openApprovalModal(test)}
                                  title="Click to approve this test"
                                  
                                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                                >
                                  Approve
                                </button>
                              ) : (
                                test.reviewApprove === 'Approved'?
                                (<span title="Pending Sample Approval" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-green-400 text-white-800">
                                  <CheckCircle size={14} /> Approved
                                 </span>):
                                 (<span title="Pending Sample Approval" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-orange-200 text-green-800">
                                  <CheckCircle size={14} /> Pending
                                </span>)
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
                  {LabDoctors.map((doctor) => (
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
                <p className="text-xs text-slate-500 mt-1">Enter the doctor&quot;s password for authentication</p>
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
                          {approvedTestIds.has(test.testId) ? (
                            <span className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-green-600 text-white">
                              <CheckCircle size={14} /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApproveSingleTest(test.testId)}
                              disabled={
                                modalApprovalTable.approving &&
                                modalApprovalTable.approvingTestId === test.testId
                              }
                              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          )}
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