// app/lab/AddReport/[medical_num]/[patient_id]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Upload, FileCheck, AlertCircle, X, Eye, Printer } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface ReportUploadPageProps {
  params: Promise<{
    medical_num: string;
    patient_id: string;
  }>;
}

interface PatientInfo {
  name: string;
  phoneNumber: string;
  gender?: string;
  age?: number;
  referredDoctor?: string;
}

interface ReportType {
  id: string;
  name: string;
  description: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  reportType: string;
}

interface PassedData {
  patient_id?: string;
  medical_num?: string;
  investigation_id?: string;
  labapproval_id?: string;
  sample_collected_id?: string;
  billing_id?: string;
}

const REPORT_TYPES: ReportType[] = [
  { id: 'mri_brain', name: 'MRI Brain with Contrast', description: 'Brain MRI scan report' },
  { id: 'mri_spine', name: 'MRI Spine', description: 'Spine MRI scan report' },
  { id: 'ct_scan', name: 'CT Scan', description: 'CT scan report' },
  { id: 'xray', name: 'X-Ray', description: 'X-ray report' },
  { id: 'ultrasound', name: 'Ultrasound', description: 'Ultrasound report' },
  { id: 'blood_test', name: 'Blood Test', description: 'Blood test report' },
  { id: 'other', name: 'Other', description: 'Other medical reports' },
];



const AddReportOptions: React.FC<{
  billing_id: number;
  sample_collected_id: number;
  investigation_id: number;
  labapproval_id: number;
  medical_num?: string;
  patient_id?: string;
}> = ({ billing_id, sample_collected_id, investigation_id, labapproval_id, medical_num, patient_id }) => {
    console.log('Received Props:', { billing_id, sample_collected_id, investigation_id, labapproval_id, medical_num, patient_id });

    // Condition 1: Billing Pending (Commented Out)
        // return (
        // <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-6 shadow-md">
        //     <div className="flex items-center gap-4">
        //     <div className="bg-amber-100 p-3 rounded-full">
        //         <AlertCircle size={24} className="text-amber-600" />
        //     </div>
        //     <div>
        //         <h3 className="text-lg font-bold text-amber-900">Pending for Billing</h3>
        //         <p className="text-sm text-amber-700 mt-1">The report processing is complete but awaiting billing confirmation.</p>
        //     </div>
        //     </div>
        // </div>
        // );
    

    // Condition 2: Results Pending (Sample Not Collected)
    if (parseInt(sample_collected_id.toString()) == 0) {
        return (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
                <AlertCircle size={24} className="text-blue-600" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-blue-900">Results Pending</h3>
                <p className="text-sm text-blue-700 mt-1">Awaiting sample collection. Please contact the lab for sample collection appointment.</p>
            </div>
            </div>
        </div>
        );
    }

    // Condition 3: Investigation = 4 && Lab Approval = 0 && Sample Collected = 2
    if (parseInt(investigation_id.toString()) == 4 && parseInt(labapproval_id.toString()) == 0 && (parseInt(sample_collected_id.toString()) == 2)) {
        return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="bg-purple-100 p-3 rounded-full">
                <AlertCircle size={24} className="text-purple-600" />
                </div>
                <div>
                <h3 className="text-lg font-bold text-purple-900">Pending Doctor Signature</h3>
                <p className="text-sm text-purple-700 mt-1">Report requires doctor&quot;s signature and approval before final release.</p>
                </div>
            </div>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 flex-shrink-0">
                <Printer size={18} />
                Edit
            </button>
            </div>
        </div>
        );
    }

    // Condition 4: Investigation = 4 && Lab Approval = 1 && Billing = 1 (Balance Due)
    if (parseInt(investigation_id.toString()) === 4 && parseInt(labapproval_id.toString()) === 1 && parseInt(billing_id.toString()) === 1) {
        return (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
                </div>
                <div>
                <h3 className="text-lg font-bold text-red-900">Payment Pending</h3>
                <p className="text-sm text-red-700 mt-1">Reports are ready, but balance payment is due. Complete payment to access reports.</p>
                </div>
            </div>
            <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 flex-shrink-0" disabled>
                <Eye size={18} />
                Available
            </button>
            </div>
        </div>
        );
    }

    // Condition 5: Investigation = 4 && Lab Approval = 1 && Billing = 2 (Paid - View Report)
    if (parseInt(investigation_id.toString()) === 4 && parseInt(labapproval_id.toString()) === 1 && parseInt(billing_id.toString()) === 2) {
        return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="bg-green-100 p-3 rounded-full">
                <FileCheck size={24} className="text-green-600" />
                </div>
                <div>
                <h3 className="text-lg font-bold text-green-900">Report Available</h3>
                <p className="text-sm text-green-700 mt-1">Your report is ready for download. Click below to view and download.</p>
                </div>
            </div>
            <Link
                href={`/Lab/ViewReport/${medical_num}/${patient_id}`}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
            >
                <Eye size={18} />
                View Report
            </Link>
            </div>
        </div>
        );
    }

    // Condition 6: Investigation != 4 && Billing = 1 && Sample Collected = 2 && Lab Approval = 1 (Not Available)
    if (parseInt(investigation_id.toString()) !== 4 && parseInt(billing_id.toString()) === 1 && parseInt(sample_collected_id.toString()) === 2 && parseInt(labapproval_id.toString()) === 1) {
        return (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-full">
                <AlertCircle size={24} className="text-gray-600" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">Not Available</h3>
                <p className="text-sm text-gray-700 mt-1">This report is currently not available for access.</p>
            </div>
            </div>
        </div>
        );
    }

    // Condition 7: Investigation != 4 && (Billing = 1 OR Billing = 2) && Sample Collected = 2 (Download Report)
    if (parseInt(investigation_id.toString()) !== 4 && (parseInt(billing_id.toString()) === 1 || parseInt(billing_id.toString()) === 2) && parseInt(sample_collected_id.toString()) === 2) {
        return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="bg-blue-100 p-3 rounded-full">
                <FileCheck size={24} className="text-blue-600" />
                </div>
                <div>
                <h3 className="text-lg font-bold text-blue-900">Test Reports Ready</h3>
                <p className="text-sm text-blue-700 mt-1">Your test reports are ready for download. Click below to access.</p>
                </div>
            </div>
            <Link
                href={`/Lab/DownloadReport/${medical_num}`}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
            >
                <Eye size={18} />
                View Test Reports
            </Link>
            </div>
        </div>
        );
    }

    // Default: Not Available
    return (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-full">
            <AlertCircle size={24} className="text-gray-600" />
            </div>
            <div>
            <h3 className="text-lg font-bold text-gray-900">Not Available</h3>
            <p className="text-sm text-gray-700 mt-1">This report is not available at this time. Please try again later.</p>
            </div>
        </div>
        </div>
    );
};
        
    


export default AddReportOptions;