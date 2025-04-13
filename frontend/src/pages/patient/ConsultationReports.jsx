import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Fetch full consultation (but only use diagnosis in UI)
export const fetchConsultationById = async (consultationId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/consultations/${consultationId}/view`);
    if (!response.ok) throw new Error("Failed to fetch consultation");
    const data = await response.json();
    return data.consultation.reports || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};


const ConsultationReports = () => {
  const [consultation, setConsultation] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchConsultationById(id);
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [id]);

  if (loading) return <div className="flex justify-center p-8">Loading reports...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Table Header */}
      <div className="bg-gray-800 text-white rounded-md mb-8">
        <div className="grid grid-cols-4 p-4">
          <div className="font-medium">Date</div>
          <div className="font-medium">Doctor Name</div>
          <div className="font-medium">Location</div>
          <div className="font-medium">Details</div>
        </div>
      </div>
      
      {/* Report Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Report</h2>
        
        {selectedReport ? (
          <div className="bg-gray-300 rounded-md p-6 min-h-64">
            <p><strong>Date:</strong> {selectedReport.createdAt}</p>
            <p><strong>Doctor:</strong> {selectedReport.doctorName}</p>
            <p><strong>Location:</strong> {selectedReport.location}</p>
            <p><strong>Status:</strong> {selectedReport.status.toUpperCase()}</p>
            <p className="mt-4">{selectedReport.reportText}</p>
          </div>
        ) : (
          <div className="bg-gray-300 rounded-md p-6 min-h-64 flex items-center justify-center">
            <p>No report selected. Please select a report to view details.</p>
          </div>
        )}
      </div>
      
      {/* Back Button */}
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => navigate(`/patient/previous-consultations/${id}`)}
        >
          Back to Consultation
        </button>
      </div>
    </div>
  );
};

export default ConsultationReports;