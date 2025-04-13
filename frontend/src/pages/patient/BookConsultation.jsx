import React, { useState, useEffect } from "react";
import "../../styles/patient/BookConsultation.css";
import { Search } from "lucide-react";

const BookConsultation = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);

  // Dummy fetch function to simulate fetching doctor names
  useEffect(() => {
    const fetchDoctors = async () => {
      // Simulating an API call with a delay
      setTimeout(() => {
        setDoctors(["Dr. John Doe", "Dr. Jane Smith", "Dr. Alex Brown"]);
      }, 1000);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="book-consultation">
      <h2 className="consultation-header">Patient Book Consultations</h2>

      <div className="consultation-search">
        <p className="search-title">I’m looking for</p>
        <div className="search-controls">
          <select
            className="location-dropdown"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Location</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Renal Sciences">Renal Sciences</option>
          </select>
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Enter Doctor’s Name / Specialty / Condition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <hr />

      <div className="doctor-list">
        {doctors.length > 0 ? (
          doctors.map((name, index) => (
            <label key={index} className="doctor-item">
              <input type="checkbox" /> {name}
            </label>
          ))
        ) : (
          <p>Loading doctors...</p>
        )}
      </div>

      <div className="specialty-section">
        <p className="section-title">Doctors with specialty in</p>
        <div className="specialties">
          {["General Medicine", "Renal Sciences"].map((specialty, index) => (
            <div key={index} className="specialty-card">
              <Search className="icon" />
              {specialty}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
