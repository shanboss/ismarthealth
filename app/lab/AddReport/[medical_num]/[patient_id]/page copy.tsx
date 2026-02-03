// app/lab/AddReport/[medical_num]/[patient_id]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Upload, FileCheck, AlertCircle, X, Save } from 'lucide-react';
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
  investigationId: number;
}

interface PassedData {
  patient_id?: string;
  medical_num?: string;
}

interface ApprovedSample {
  investigationId: number;
  parentTestName: string;
  childTestName?: string | null;
  unit?: string | null;
  referenceRange?: string | null;
  testId: number;
  testDetails: {
    id: number;
    medicalNum: string;
    patientUniqueId: string;
    mainPatientId?: string | null;
    dependentId?: number | null;
    physicianId?: number | null;
    laboratoryId: number;
    date?: string | null;
    time?: string | null;
    instruction?: string | null;
    sampleCollectedId?: number | null;
    billingId?: number | null;
    labapprovalId?: number | null;
    patStatus?: number | null;
    createdOn?: string;
    parseParentId?: number;
    reportFilename?: string | null;
  };
}

interface SampleValueInput {
  testDetailsId: number;
  value: string;
}

interface PatientDetails {
  firstname: string;
  lastname: string;
  gender: string;
  age: number;
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
  const searchParams = useSearchParams();
  
  const [resolvedParams, setResolvedParams] = useState<{
    medical_num: string;
    patient_id: string;
  } | null>(null);
  
  // State for the passed variables
  const [passedData, setPassedData] = useState<PassedData>({});
  const [PatientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [approvedSamples, setApprovedSamples] = useState<ApprovedSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingSamples, setSavingSamples] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [sampleValues, setSampleValues] = useState<Map<string, SampleValueInput>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Resolve URL parameters
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
      
      // Extract only medical_num and patient_id
      const patient_id = resolved.patient_id;
      const medical_num = resolved.medical_num;

      setPassedData({
        patient_id: patient_id || undefined,
        medical_num: medical_num || undefined,
      });

      // Log the received data (for debugging)
      console.log('Received parameters:', { 
        patient_id, 
        medical_num, 
      });
    };
    resolveParams();
  }, [params]);

  // 2. Fetch approved samples
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchApprovedSamplesData = async () => {
      try {
        setLoading(true);
        console.log('Fetching approved samples with params:', resolvedParams);
        const response = await fetch(
          `/api/lab/samples/sampleReport?medicalNum=${resolvedParams.medical_num}&patientId=${resolvedParams.patient_id}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch approved samples');
        }

        const result = await response.json();
        if (result.success && result.data) {
          setApprovedSamples(result.data);
          setPatientDetails(result.patientDetails);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching approved samples:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedSamplesData();
  }, [resolvedParams]);

  // 3. Fetch patient data
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchPatientData = async () => {
      try {
        console.log('Fetching patient data with params:', resolvedParams);
        const response = await fetch(
          `/api/lab/billing?patient_id=${resolvedParams.patient_id}&medical_num=${resolvedParams.medical_num}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const result = await response.json();
        setPatientInfo(result.data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
      }
    };

    fetchPatientData();
  }, [resolvedParams]);

  // Group samples by investigation_id and parent_test_name
  const groupSamplesByInvestigation = () => {
    const grouped = new Map<number, Map<string, ApprovedSample[]>>();
    
    approvedSamples.forEach(sample => {
      if (!grouped.has(sample.investigationId)) {
        grouped.set(sample.investigationId, new Map());
      }
      
      const parentName = sample.parentTestName || 'Unknown Test';
      const parentGroup = grouped.get(sample.investigationId)!;
      
      if (!parentGroup.has(parentName)) {
        parentGroup.set(parentName, []);
      }
      
      parentGroup.get(parentName)!.push(sample);
    });
    
    return grouped;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, investigationId: number) => {
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
          investigationId,
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

  const handleSampleValueChange = (testDetailsId: string, value: string) => {
    const cleanedValue = parseFloat(value.trim());
    if (typeof cleanedValue === 'number' && !isNaN(cleanedValue)) {
      const testDetailsIdClean:number = parseInt(testDetailsId); 
      setSampleValues(prev => {
        const newMap = new Map(prev);
        newMap.set(testDetailsId, { testDetailsIdClean, value });
        return newMap;
      });
    }

  };

  const handleSaveSample = async (testDetailsId: number, value: string, investigationId: number, unit: string, referenceRange: string) => {
    try {
      setSavingSamples(true);
      const PostData = {
        testDetailsId, value, investigationId, unit, referenceRange, 
        medicalNum : passedData.medical_num,
        patientId : passedData.patient_id,
      }
      console.log('Saving sample value:', PostData);
      const postUrl = '/api/lab/samples/sampleReport';
      const postResponse = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(PostData),
      });
      const data = await postResponse.json();
      if (postResponse.ok) {
        // Handle success
        console.log(data);
        setSavingSamples(false);
      } else {
        console.error('Failed to save sample value:', data);
        setSavingSamples(false);
      } 
      // Get all samples for this investigation_id
      const samplesForInvestigation = approvedSamples.filter(s => s.investigationId === investigationId);
      
      // Prepare the data to send
      const sampleData = samplesForInvestigation.map(sample => ({
        testDetailsId: sample.testDetails.id,
        sampleValue: sampleValues.get(sample.testDetails.id)?.value || '',
        medicalNum: passedData.medical_num,
        patientId: passedData.patient_id,
      }));

      console.log('Saving sample data:', sampleData);

      // const saveResponse = await fetch('/api/lab/samples/saveSampleValues', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     investigationId,
      //     samples: sampleData,
      //   }),
      // });

      // if (!saveResponse.ok) {
      //   throw new Error('Failed to save sample values');
      // }

      // const result = await saveResponse.json();
      // console.log('Sample values saved:', result);
      alert('Sample values saved successfully!');
      router.refresh();
      
      // Clear the sample values for this investigation
      const newSampleValues = new Map(sampleValues);
      samplesForInvestigation.forEach(sample => {
        newSampleValues.delete(sample.testDetails.id);
      });
      setSampleValues(newSampleValues);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sample values');
      console.error('Error saving sample values:', err);
    } finally {
      setSavingSamples(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();

    uploadedFiles.forEach((file, index) => {
      formData.append(`files`, file.file);
      formData.append(`reportTypes[${index}]`, file.reportType);
      formData.append(`investigationIds[${index}]`, file.investigationId.toString());
    });

    formData.append('patient_id', passedData.patient_id || '');
    formData.append('medical_num', passedData.medical_num || '');

    try {
      const response = await fetch('/api/lab/reports', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      // Reset form
      setUploadedFiles([]);
      setSelectedReportType('');

      // Show success message
      alert('Reports uploaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const groupedSamples = groupSamplesByInvestigation();
  const investigation4Samples = approvedSamples.filter(s => s.investigationId === 4);
  const otherSamples = approvedSamples.filter(s => s.investigationId !== 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href={`/lab/bill/${passedData.patient_id}/${passedData.medical_num}`}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Go back"
            >
            <ArrowLeft size={24} className="text-gray-700" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Report</h1>
              <p className="text-gray-600 text-sm mt-1">Upload medical reports for the patient</p>
            </div>
          </div>
        </div>

        {/* Patient Data Display */}
        {passedData.patient_id && passedData.medical_num && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-indigo-600">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Information</h2>
            <div className="space-y-2">
              {passedData.patient_id && (
                <p><span className="font-medium text-blue-700">Patient ID:</span> <span className="text-gray-700">{passedData.patient_id}</span></p>
              )}
              {passedData.medical_num && (
                <p><span className="font-medium text-blue-700">Medical Number:</span> <span className="text-gray-700">{passedData.medical_num}</span></p>
              )}
            </div>
          </div>
        )}

        {/* Patient Details Card */}
        {PatientDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Patient Name</p>
                <p className="text-xl font-bold text-gray-900">{PatientDetails.firstname} {PatientDetails.lastname }</p>
              </div>

              {PatientDetails.gender && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Gender / Age</p>
                  <p className="text-xl font-bold text-gray-900">
                    {PatientDetails.gender} {PatientDetails.age ? `/ ${PatientDetails.age} yrs` : ''}
                  </p>
                </div>
              )}
     
            </div>
          </div>
        )}


        {/* Patient Info Card */}
        {/* {patientInfo && (
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
        )} */}

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

        {/* Dynamic Boxes based on Investigation ID */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading samples...</p>
          </div>
        ) : approvedSamples.length > 0 ? (
          <div className="space-y-3">
            {/* Investigation ID = 4: Sample Value Input Boxes */}
            {investigation4Samples.length > 0 && (
              Array.from(groupedSamples.get(4)?.entries() || []).map(([parentTestName, samples]) => (
                <div key={`inv4-${parentTestName}`} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-600">
                  {/* Box Title */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 border-b border-green-200">
                    <h2 className="text-sm font-bold text-gray-900">{parentTestName}</h2>
                  </div>
                  
                  {/* Box Body */}
                  <div className="p-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3 font-semibold text-gray-700 w-36">Test Name</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-700 w-36">Sample Value</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-700 w-36">Unit</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-700 w-36">Reference Range</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-700 w-36">Action</th>
                            </tr>
                          </thead>
                        <tbody>
                          {samples.map((sample, idx) => (
                            <tr key={`sample-${sample.testDetails.id}-${idx}`} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="py-2 px-2 text-gray-900 font-medium">{sample.childTestName || sample.parentTestName}</td>
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={sampleValues.get(`${sample.testDetails.id}-${idx}`)?.value || ''}
                                  onChange={(e) => handleSampleValueChange(`${sample.testDetails.id}-${idx}`, e.target.value)}
                                  placeholder="Enter value"
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </td>
                              <td className="py-2 px-2 text-gray-700">{sample.unit || 'N/A'}</td>
                              <td className="py-2 px-2 text-gray-700">{sample.referenceRange || 'N/A'}</td>
                              <td className="py-2 px-2">
                                <button
                                  onClick={() => handleSaveSample(sample.testDetails.id, sampleValues.get(`${sample.testDetails.id}-${idx}`)?.value || '', sample.investigationId, sample.unit || '', sample.referenceRange || '')}
                                  disabled={savingSamples}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1 whitespace-nowrap"
                                >
                                  {savingSamples ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                    </>
                                  ) : (
                                    <>
                                      <Save size={14} />
                                      Save
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Investigation ID != 4: File Upload Boxes on Right */}
            {otherSamples.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Left side - Investigation ID = 4 (if any) placeholder */}
                <div></div>
                
                {/* Right side - File Upload Boxes */}
                <div className="space-y-3">
                  {Array.from(groupedSamples.entries()).filter(([invId]) => invId !== 4).map(([investigationId, parentGroups]) => (
                    Array.from(parentGroups.entries()).map(([parentTestName, samples]) => (
                      <div key={`inv${investigationId}-${parentTestName}`} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-indigo-600">
                        {/* Box Title */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 border-b border-indigo-200">
                          <h2 className="text-sm font-bold text-gray-900">{parentTestName}</h2>
                        </div>
                        
                        {/* Box Body */}
                        <div className="p-3">
                          {/* Report Type Selection */}
                          <div className="mb-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Report Type</label>
                            <select
                              value={selectedReportType}
                              onChange={(e) => setSelectedReportType(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="">Select a report type...</option>
                              {REPORT_TYPES.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* File Upload Area */}
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative border-2 border-dashed border-indigo-300 rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-blue-50 cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-100 mb-2"
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              onChange={(e) => handleFileSelect(e, investigationId)}
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                            
                            <div className="flex flex-col items-center justify-center text-center">
                              <div className="bg-indigo-100 p-2 rounded-full mb-1">
                                <Upload size={16} className="text-indigo-600" />
                              </div>
                              <p className="text-xs font-bold text-gray-900 mb-0.5">
                                Click to upload
                              </p>
                              <p className="text-xs text-gray-600">
                                PDF, JPG, PNG • Max 10MB
                              </p>
                            </div>
                          </div>

                          {/* Uploaded Files Preview or No Uploads Message */}
                          {uploadedFiles.filter(f => f.investigationId === investigationId).length > 0 ? (
                            <div className="mt-2">
                              <h3 className="font-semibold text-gray-900 mb-1 text-xs flex items-center gap-1">
                                <FileCheck size={14} className="text-green-600" />
                                Uploads ({uploadedFiles.filter(f => f.investigationId === investigationId).length})
                              </h3>
                              <div className="space-y-1">
                                {uploadedFiles.filter(f => f.investigationId === investigationId).map((uploadedFile, index) => {
                                  const reportTypeLabel = REPORT_TYPES.find(
                                    (rt) => rt.id === uploadedFile.reportType
                                  )?.name;
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-2"
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
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
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-gray-900 truncate text-xs">
                                            {uploadedFile.file.name}
                                          </p>
                                          <p className="text-xs text-gray-600">
                                            {reportTypeLabel} • {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(uploadedFiles.indexOf(uploadedFile))}
                                        className="p-0.5 text-red-600 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                                        title="Remove file"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-center">
                              <p className="text-xs text-gray-600">No uploads</p>
                            </div>
                          )}

                          {/* Upload Button */}
                          <div className="flex justify-end pt-2 mt-2 border-t border-gray-200">
                            <button
                              onClick={() => handleUpload}
                              disabled={uploading || uploadedFiles.filter(f => f.investigationId === investigationId).length === 0}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
                            >
                              {uploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  Upload
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-gray-300">
            <AlertCircle size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="font-semibold text-gray-700 text-sm">No Approved Samples Found</p>
            <p className="text-gray-600 text-xs mt-1">There are no approved samples available for this patient at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}