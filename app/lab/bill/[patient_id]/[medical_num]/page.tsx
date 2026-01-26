// app/lab/bill/[patient_id]/[medical_num]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Download, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  labInfo: labInfo;
}

export default function BillingPage({ params }: BillingPageProps) {
  const [patientData, setPatientData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{
    patient_id: string;
    medical_num: string;
  } | null>(null);
  const billContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Billing state management
  const [isApproved, setIsApproved] = useState(false);
  const [showBillingControls, setShowBillingControls] = useState(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountValue, setDiscountValue] = useState<string>('');
  const [advancePayment, setAdvancePayment] = useState<string>('');
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: string; text: string } | null>(null);
  const [enableAdvAmount, setEnableAdvAmount] = useState(false);
  const [balAmountState, setBalAmountState] = useState(0);

  const [discountReadOnly, setDiscountReadOnly] = useState(false);
  const [advPaymentReadOnly, setAdvPaymentReadOnly] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(true);
  const [firstTimeBilling, setFirstTimeBilling] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchBillingData = async () => {
      try {
        setLoading(true);
        let { patient_id, medical_num } = resolvedParams;
        console.log("Fetching billing data for:", { patient_id, medical_num });
        patient_id = patient_id.trim();
        medical_num = medical_num.trim();
        const response = await fetch(`/api/lab/billing?patient_id=${patient_id}&medical_num=${medical_num}`);

        if (!response.ok) {
          throw new Error('Failed to fetch billing data');
        }

        const result = await response.json();
        console.log("result==", result.data);
        setPatientData(result.data);
        console.log("Billing Data fetched successfully=", result.data.billingDetails);

        if(result.data.billingDetails != null ){
          const billingDetails = result.data.billingDetails;
          const advAmt = billingDetails.adv_amt || 0;
          const netAmt = billingDetails.net_amt || 0;
          const balAmt = billingDetails.balance_amt || 0;
          const balPymnt2 = billingDetails.balance_pymnt2 || 0;
          console.log("balPymnt2==", balPymnt2);
          console.log("balAmt==", balAmt);
          setFirstTimeBilling(false);
          setAdvPaymentReadOnly(balAmt == 0 || balAmt == 0.00 ? true : (!(balPymnt2 == balAmt)? true : false));
          setShowSaveButton((balAmt == 0 || balAmt == 0.00) ? false : (balPymnt2 == balAmt? false : true));
          setDiscountReadOnly(true);
          console.log("advAmt==", advAmt);
          console.log("netAmt==", netAmt);
          setDiscountValue(billingDetails.discount?.toString() || '');
          setShowBillingControls(true);
          console.log("ShowBillingControls==", showBillingControls);
          setDiscountEnabled(true)
          setEnableAdvAmount(false);
          setAdvancePayment( parseFloat(balAmt.toString()) > 0 ? balAmt?.toString() || '' : advAmt?.toString() || '');
          setBalAmountState(balAmt);
         

        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [resolvedParams]);

  // Calculations
  const totalAmount = patientData?.patientTestDetails.reduce((sum, test) => sum + test.price, 0) || 0;
  const discountAmount = discountEnabled ? (totalAmount * (parseFloat(discountValue) || 0)) / 100 : 0;
  const netAmount = totalAmount - discountAmount;
  //setNetAmountState(netAmount);
  console.log("balAmountState==", balAmountState);
  const advancePaymentNum = parseFloat(advancePayment) || 0;
  const balanceAmount = (parseFloat(balAmountState.toString()) > 0)? 0 : Math.max(0, netAmount - advancePaymentNum);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setDiscountValue(value);
    }
  };

  const handleAdvancePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      const numValue = parseFloat(value) || 0;
      if (numValue <= netAmount) {
        setAdvancePayment(value);
      } else if (value !== '') {
        setAdvancePayment('');
      }
    }
  };

  const handleApproveAll = () => {
    setIsApproved(true);
    setShowBillingControls(true);
  };

  const handleBillingApproved = () => {
    setIsApproved(false);
    setShowBillingControls(false);
    setDiscountEnabled(false);
    setDiscountValue('');
    setAdvancePayment('');
  };

  const handleSaveChanges = async () => {
    setSavingChanges(true);
    setSaveMessage(null);

    try {
      const payload = {
        patient_id: resolvedParams?.patient_id,
        medical_num: resolvedParams?.medical_num,
        total_amount: totalAmount,
        discount_enabled: discountEnabled,
        discount_percentage: discountEnabled ? parseFloat(discountValue) || 0 : 0,
        discount_amount: discountAmount,
        net_amount: netAmount,
        advance_payment: advancePaymentNum,
        balance_amount: balanceAmount,
        billing_status: 'Approved',
        firstTimeBilling
      };

      const response = await fetch('/api/lab/billing/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save changes');
      const result = await response.json();
      console.log('Billing changes saved successfully=', result);

      setSaveMessage({ type: 'success', text: 'Billing changes saved successfully!' });
      setLoading(true);
      setTimeout(() => handleBillingApproved(), 2000);
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save changes'
      });
    } finally {

      setSavingChanges(false);
        setTimeout(() => { 
          setLoading(false);
          router.refresh();
        },2500);
    }
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
          filename: `billing_${resolvedParams?.patient_id}_${resolvedParams?.medical_num}.pdf`,
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

    // 1. Get all stylesheets from the current document
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(style => style.outerHTML)
      .join('\n');

    const content = billContentRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Billing Report - ${resolvedParams?.patient_id}</title>
          ${styles} 
          <style>
            /* Additional overrides for print consistency */
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
              -webkit-print-color-adjust: exact;
            }
            /* Ensure flex and grid layouts are forced in print */
            .flex { display: flex !important; }
            .grid { display: grid !important; }
            .flex-nowrap { flex-wrap: nowrap !important; }
            .justify-between { justify-content: space-between !important; }
            
            /* Hide any interactive elements that might have leaked in */
            .print\\:hidden { display: none !important; }
          </style>
        </head>
        <body>
          <div class="min-h-screen bg-white">
            ${content}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // 2. Wait for styles/images to load before triggering print
    printWindow.onload = () => {
      // Small delay to ensure Tailwind's JIT styles are applied
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Optional: Close window after printing
        // printWindow.close();
      }, 500);
    };
  };

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

  const { patientQueue, patientDepDetails, patientTestDetails, labInfo } = patientData;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Action buttons – visible only on screen */}
        <div className="flex justify-end gap-4 print:hidden">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDownloadPDF();
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-all text-sm"
          >
            <Download size={16} />
            Download PDF
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePrint();
            }}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-all text-sm"
          >
            <Printer size={16} />
            Print
          </button>
        </div>

        {/* ──────────────────────────────────────────────── */}
        {/* Everything below is included in PDF and Print     */}
        {/* ──────────────────────────────────────────────── */}

        <div ref={billContentRef} className="bg-white print:bg-white">

          {/* Lab Information Header – now included in print/PDF */}
          <div className="p-6 bg-white border-b-2 border-slate-300 print:border-b print:border-gray-400">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
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

          {/* Billing Report Header */}
          <div className="px-6 py-6 border-b-2 border-slate-300 print:border-b print:border-gray-400 flex flex-nowrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-700">BILLING REPORT</h1>
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
            <div className="
              flex flex-nowrap items-start justify-between gap-3
              print:flex print:flex-nowrap print:gap-2 print:justify-between print:items-baseline
            ">
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
            <div className="
              grid grid-cols-5 gap-x-4 gap-y-2 text-sm
              print:grid-cols-5 print:gap-x-2 print:gap-y-1 print:text-xs
            ">
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
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase w-40">Instructions</th>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase text-right w-24">Price</th>
                    <th className="p-3 text-xs font-bold text-slate-700 uppercase text-center w-28">Status</th>
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
                        <td className="p-3 text-xs text-slate-600">{test.instructions}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ${test.price.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase ${
                              test.billingStatus === 'Approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {test.billingStatus}
                          </span>
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

          {/* Summary Section */}
          <div className="px-6 py-6 border-t-2 border-slate-300 print:border-t print:border-gray-400">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 text-slate-600 text-xs">
                <p className="font-bold uppercase mb-2 text-slate-700">Notice:</p>
                <p>This is a computer-generated billing report. Please ensure all tests match the physician&quot;s referral.</p>
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="border border-slate-300 print:border print:border-gray-400 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700 uppercase">Total Amount</span>
                    <span className="text-xl font-black font-mono text-slate-900">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {!showBillingControls && (
                  <button
                    onClick={handleApproveAll}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded transition-all uppercase tracking-wider text-sm print:hidden"
                  >
                    Approve All
                  </button>
                )}

                {showBillingControls && (
                  <>
                    <div className="border border-slate-300 print:border print:border-gray-400 p-4 rounded space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={discountEnabled}
                            onChange={(e) => setDiscountEnabled(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                            disabled={enableAdvAmount}
                          />
                          <span className="text-sm font-bold text-slate-700 uppercase">Apply Discount %</span>
                        </label>
                        {discountEnabled && !enableAdvAmount  && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={discountValue}
                              onChange={handleDiscountChange}
                              placeholder="0.00"
                              className="w-20 px-3 py-1.5 border border-slate-300 rounded text-sm font-semibold text-center"
                              disabled={enableAdvAmount}
                              readOnly={discountReadOnly}
                            />
                            <span className="text-sm font-bold text-slate-700">%</span>
                          </div>
                        )}
                      </div>
                      {discountEnabled  && (
                        <div className="text-right text-sm text-slate-600 pt-2 border-t border-slate-200">
                          Discount Amount: <span className="font-bold text-slate-900 ml-2">${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-blue-300 print:border print:border-gray-400 p-4 rounded bg-blue-50">
                        <p className="text-xs font-bold text-blue-700 uppercase mb-1">Net Amount</p>
                        <p className="text-xl font-black font-mono text-blue-900">${netAmount.toFixed(2)}</p>
                      </div>
                      <div className="border border-amber-300 print:border print:border-gray-400 p-4 rounded bg-amber-50">
                        <p className="text-xs font-bold text-amber-700 uppercase mb-1">Balance Due</p>
                        <p className="text-xl font-black font-mono text-amber-900">
                          {
                            advPaymentReadOnly? `$${advancePayment}` : `$${balanceAmount.toFixed(2)}`
                          }


                        </p>
                      </div>
                    </div>
                    
                    {showSaveButton && (
                    <div className="border border-slate-300 print:border print:border-gray-400 p-4 rounded space-y-2">
                      <label className="block">
                        <p className="text-sm font-bold text-slate-700 uppercase mb-2">
                          {advPaymentReadOnly? 'Balance Pending': 'Advance Payment'}
                         
                        </p>
                        <input
                          type="text"
                          value={advancePayment}
                          disabled={enableAdvAmount} // Disable the input if netAmount is 0
                          onChange={handleAdvancePaymentChange}
                          placeholder={`0.00 (Max: ${netAmount.toFixed(2)})`}
                          readOnly={advPaymentReadOnly}
                          className="w-full px-4 py-2 border border-slate-300 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Enter amount up to ${netAmount.toFixed(2)}</p>
                      </label>
                    </div>
                    )
                    
                    }


                    {saveMessage && !enableAdvAmount && (
                      <div
                        className={`p-3 rounded text-sm font-medium border ${
                          saveMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {saveMessage.text}
                      </div>
                    )}

                    {showSaveButton && (
                    <div className="flex gap-4 print:hidden">
                      <button
                        onClick={handleSaveChanges}
                        disabled={savingChanges}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded transition-all uppercase text-sm"
                      >
                        {savingChanges ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleBillingApproved}
                        disabled={savingChanges}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded transition-all uppercase text-sm"
                      >
                        Billing Approved
                      </button>
                    </div>)}
                  </>
                )}
              </div>
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