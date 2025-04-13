import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientConsultationDetails = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultation details
  const fetchConsultationDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/consultations/${consultationId}`);
      // const data = await response.json();
      
      // Mock data based on the schema - only including fields from the schema
      const mockConsultation = {
        consult_id: parseInt(consultationId),
        patient_id: 1,
        doctor_id: 3,
        doctor_name: "Dr. Sarah Johnson", // Added for display purposes
        patient_name: "John Doe", // Added for display purposes
        booked_date_time: "2025-03-28T10:30:00",
        status: "completed", // One of: scheduled, completed, cancelled
        reason: "Annual checkup",
        created_by: 2,
        created_by_name: "Nurse Emily Clark", // Added for display purposes
        created_at: "2025-03-20T08:15:00",
        actual_start_datetime: "2025-03-28T10:35:00",
        remark: "Patient is in good health. Blood pressure is normal at 120/80. Heart rate is 72 bpm.",
        diagnosis: "Healthy, no concerns. Recommended standard blood work as preventative measure.",
        bill_id: 1001,
        prescription: true, // Boolean indicating if prescription exists
        reports: true, // Boolean indicating if reports exist
        recordedAt: "2025-03-28"
      };
      
      setConsultation(mockConsultation);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch consultation details:", error);
      setError("Failed to load consultation information");
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    fetchConsultationDetails();
  }, [consultationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700">Loading consultation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={handleBackClick}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700">Consultation not found</p>
          <button 
            onClick={handleBackClick}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleBackClick}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span>← Back</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800">
            Consultation Details
          </h1>
          
          <div className="w-24"></div> {/* Empty div for flex spacing */}
        </div>
        
        {/* Consultation Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Info */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Consultation ID</p>
                <p className="font-medium">C{consultation.consult_id.toString().padStart(3, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">{consultation.patient_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{consultation.doctor_name}</p>
              </div>
            </div>
          </div>
          
          {/* Main Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Status</h3>
                <p className={`font-medium ${
                  consultation.status === 'completed' ? 'text-green-600' : 
                  consultation.status === 'scheduled' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Booked Date & Time</h3>
                <p className="font-medium">{formatDate(consultation.booked_date_time)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Reason</h3>
              <p className="font-medium">{consultation.reason}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Created By</h3>
                <p className="font-medium">{consultation.created_by_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Created At</h3>
                <p className="font-medium">{formatDate(consultation.created_at)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Actual Start Time</h3>
              <p className="font-medium">{formatDate(consultation.actual_start_datetime)}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Remark</h3>
              <p className="font-medium">{consultation.remark || 'No remarks'}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Diagnosis</h3>
              <p className="font-medium">{consultation.diagnosis || 'No diagnosis recorded'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Bill ID</h3>
                <p className="font-medium">{consultation.bill_id ? `B${consultation.bill_id.toString().padStart(3, '0')}` : 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Prescription</h3>
                <p className="font-medium">{consultation.prescription ? 'Yes' : 'No'}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Reports</h3>
                <p className="font-medium">{consultation.reports ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Recorded At</h3>
              <p className="font-medium">{formatDate(consultation.recordedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientConsultationDetails;