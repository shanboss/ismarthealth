// app/lab/AddReport/[medical_num]/[patient_id]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Upload, FileCheck, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const REPORT_TYPES: ReportType[] = [
  { id: 'mri_brain', name: 'MRI Brain with Contrast', description: 'Brain MRI scan report' },
  { id: 'mri_spine', name: 'MRI Spine', description: 'Spine MRI scan report' },
  { id: 'ct_scan', name: 'CT Scan', description: 'CT scan report' },
  { id: 'xray', name: 'X-Ray', description: 'X-ray report' },
  { id: 'ultrasound', name: 'Ultrasound', description: 'Ultrasound report' },
  { id: 'blood_test', name: 'Blood Test', description: 'Blood test report' },
  { id: 'other', name: 'Other', description: 'Other medical reports' },
];

export default function ReportUploadPage({ params }: ReportUploadPageProps) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{
    medical_num: string;
    patient_id: string;
  } | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Resolve URL parameters
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // 2. Fetch patient data
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/lab/patient?patient_id=${resolvedParams.patient_id}&medical_num=${resolvedParams.medical_num}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const result = await response.json();
        setPatientInfo(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [resolvedParams]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!selectedReportType) {
      setError('Please select a report type first');
      return;
    }

    Array.from(files).forEach((file) => {
      // Validate file type (PDF, images)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Only PDF, JPG, and PNG files are allowed');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : '/pdf-icon.svg';

      setUploadedFiles((prev) => [
        ...prev,
        {
          file,
          preview,
          reportType: selectedReportType,
        },
      ]);
    });

    // Reset file input
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview.startsWith('blob:')) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('patient_id', resolvedParams?.patient_id || '');
      formData.append('medical_num', resolvedParams?.medical_num || '');
      formData.append('notes', notes);

      uploadedFiles.forEach((uploadedFile, index) => {
        formData.append(`file_${index}`, uploadedFile.file);
        formData.append(`reportType_${index}`, uploadedFile.reportType);
      });

      const response = await fetch('/api/lab/upload-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload reports');
      }

      // Success - redirect back
      setTimeout(() => {
        router.push(`/lab/bill/${resolvedParams?.patient_id}/${resolvedParams?.medical_num}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading patient information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/lab/bill/${resolvedParams?.patient_id}/${resolvedParams?.medical_num}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Billing
          </Link>
          <h1 className="text-4xl font-black text-gray-900">
            Report <span className="text-blue-600">Upload</span>
          </h1>
          <p className="text-gray-600 mt-2">Upload health reports and medical documents for this patient</p>
        </div>

        {/* Patient Info Card */}
        {patientInfo && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Patient Name</p>
                <p className="text-xl font-bold text-gray-900">{patientInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                <p className="text-xl font-bold text-gray-900">{patientInfo.phoneNumber}</p>
              </div>
              {patientInfo.gender && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Gender / Age</p>
                  <p className="text-xl font-bold text-gray-900">
                    {patientInfo.gender} {patientInfo.age ? `/ ${patientInfo.age} yrs` : ''}
                  </p>
                </div>
              )}
              {patientInfo.referredDoctor && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Referred Doctor</p>
                  <p className="text-xl font-bold text-gray-900">{patientInfo.referredDoctor}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Upload Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Report Type Selection */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Report Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TYPES.map((reportType) => (
                <button
                  key={reportType.id}
                  type="button"
                  onClick={() => {
                    setSelectedReportType(reportType.id);
                    setError(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedReportType === reportType.id
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{reportType.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{reportType.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-indigo-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-blue-300 rounded-xl p-12 bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-100"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Upload size={32} className="text-blue-600" />
                </div>
                <p className="text-lg font-bold text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-600">
                  PDF, JPG, PNG • Max 10MB per file
                </p>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck size={20} className="text-green-600" />
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.map((uploadedFile, index) => {
                    const reportTypeLabel = REPORT_TYPES.find(
                      (rt) => rt.id === uploadedFile.reportType
                    )?.name;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {uploadedFile.preview.startsWith('blob:') ? (
                              <img
                                src={uploadedFile.preview}
                                alt={uploadedFile.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-red-100">
                                <span className="text-xs font-bold text-red-600">PDF</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {reportTypeLabel} • {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                          title="Remove file"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or comments about these reports..."
              className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link
              href={`/lab/bill/${resolvedParams?.patient_id}/${resolvedParams?.medical_num}`}
              className="px-8 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={uploading || uploadedFiles.length === 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Reports
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}