import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/patient/Consultations.css";

const Consultations = () => {
  const navigate = useNavigate();

  return (
    <div className="consultations-container">
      <h2 className="consultations-title">Patient Consultations</h2>
      <div className="consultations-buttons">
        <button onClick={() => navigate("/patient/book-consultation")}>
          Book a new consultation
        </button>
        <button onClick={() => navigate("/patient/previous-consultations")}>
          View previous consultations
        </button>
        <button onClick={() => navigate("/patient/booked-consultation")}>
          View booked consultations
        </button>
      </div>
    </div>
  );
};

export default Consultations;
