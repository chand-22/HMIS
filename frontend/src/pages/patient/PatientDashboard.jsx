import React, { useState, useEffect } from "react";
import { Pencil, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/patient/PatientDashboard.css";

const PatientDashboard = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      const dummyData = {
        patient_username: "johndoe123",
        profile_pic: null,
        patient_info: {
          name: "John Doe",
          age: 45,
          height: 175,
          weight: 80,
          bloodGrp: "O+",
          address: "123 Main St, New York",
          familyHistory: "Hypertension",
          bedNo: 5,
          roomNo: 12,
          other: "N/A",
        },
        appointments: [
          { id: 1, doctorName: "Dr. Smith", time: "2024-04-05 10:00 AM", status: "Scheduled" },
          { id: 2, doctorName: "Dr. Johnson", time: "2024-04-07 03:00 PM", status: "Completed" },
          { id: 3, doctorName: "Dr. Lee", time: "2024-04-10 11:30 AM", status: "Scheduled" },
        ],
      };

      setPatientData(dummyData);
    };

    fetchPatientData();
  }, []);

  if (!patientData) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const { patient_info, appointments } = patientData;

  return (
    <div className="patient-dashboard">
      {/* Left Section: Profile + Basic Info */}
      <div className="profile-section">
        {/* Profile Photo */}
        <div className="profile-photo-container">
          <div className="profile-photo">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" />
            ) : (
              <span className="text-gray-600">Profile Photo</span>
            )}
            <button className="edit-button">
              <Pencil />
            </button>
          </div>
        </div>

        {/* Patient Info */}
        <div className="patient-info">
          <h1>{patient_info.name}</h1>

          <div className="patient-detail">
            <label>Age:</label>
            <span>{patient_info.age}</span>
          </div>

          <div className="patient-detail">
            <label>Blood Group:</label>
            <span>{patient_info.bloodGrp}</span>
          </div>

          <div className="patient-detail">
            <label>Height:</label>
            <span>{patient_info.height} cm</span>
          </div>

          <div className="patient-detail">
            <label>Weight:</label>
            <span>{patient_info.weight} kg</span>
          </div>

          <div className="patient-detail">
            <label>Bed No:</label>
            <span>{patient_info.bedNo}</span>
          </div>

          <div className="patient-detail">
            <label>Room No:</label>
            <span>{patient_info.roomNo}</span>
          </div>
        </div>
      </div>

      {/* Right Section: Appointments */}
      <div className="appointments-section">
        <h2 className="appointments-heading" onClick={() => navigate("./consultations")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Appointments <ArrowRight />
        </h2>
        <div>
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <p className="font-bold">{appointment.doctorName}</p>
              <p className="text-gray-600">{appointment.time}</p>
              <p className={`appointment-status ${appointment.status === "Completed" ? "status-completed" : "status-scheduled"}`}>
                {appointment.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;