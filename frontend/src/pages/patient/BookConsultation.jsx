import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/patient/BookConsultation.css";
import { Search } from "lucide-react";
import axios from "axios";

const BookConsultation = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  // Fetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/patients/doctors');
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        
        // Extract unique departments
        const uniqueDepartments = [...new Set(response.data.map(doctor => 
          doctor.department_id?.name || 'Unknown Department'))];
        setDepartments(uniqueDepartments);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to fetch doctors. Please try again later.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search query and location
  useEffect(() => {
    if (doctors.length > 0) {
      let filtered = [...doctors];
      
      // Filter by location/department if selected
      if (location) {
        filtered = filtered.filter(doctor => 
          doctor.department_id?.name === location
        );
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(doctor =>
          doctor.employee_id?.name?.toLowerCase().includes(query) ||
          doctor.specialization?.toLowerCase().includes(query)
        );
      }
      
      setFilteredDoctors(filtered);
    }
  }, [doctors, location, searchQuery]);

  const handleDoctorSelection = (doctorId) => {
    setSelectedDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  // Navigate to doctor appointment page
  const handleDoctorClick = (doctorId) => {
    navigate(`/patient/doctor/${doctorId}`);
  };

  // Group doctors by specialization
  const getSpecialtyDoctors = () => {
    const specialties = {};
    
    doctors.forEach(doctor => {
      if (doctor.specialization) {
        if (!specialties[doctor.specialization]) {
          specialties[doctor.specialization] = [];
        }
        specialties[doctor.specialization].push(doctor);
      }
    });
    
    return Object.entries(specialties);
  };

  return (
    <div className="book-consultation">
      <h2 className="consultation-header">Patient Book Consultations</h2>

      <div className="consultation-search">
        <p className="search-title">I'm looking for</p>
        <div className="search-controls">
          <select
            className="location-dropdown"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Enter Doctor's Name / Specialty / Condition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <hr />

      <div className="doctor-list">
        {loading ? (
          <p>Loading doctors...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="doctor-item-container">
              <label className="doctor-item">
                <input 
                  type="checkbox" 
                  checked={selectedDoctors.includes(doctor._id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleDoctorSelection(doctor._id);
                  }}
                /> 
                <div 
                  className="doctor-info" 
                  onClick={() => handleDoctorClick(doctor._id)}
                >
                  <span className="doctor-name">
                    {doctor.employee_id?.name || 'Unknown Doctor'}
                  </span>
                  <span className="doctor-specialty">
                    {doctor.specialization} | {doctor.department_id?.name || 'Unknown Department'}
                  </span>
                  <span className="doctor-qualification">
                    {doctor.qualification} • {doctor.experience} years experience
                  </span>
                  <div className="doctor-rating">
                    Rating: {doctor.rating}/5 ({doctor.num_ratings} ratings)
                  </div>
                </div>
              </label>
              <button 
                className="book-now-button"
                onClick={() => handleDoctorClick(doctor._id)}
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p>No doctors match your search criteria.</p>
        )}
      </div>

      <div className="specialty-section">
        <p className="section-title">Doctors with specialty in</p>
        <div className="specialties">
          {getSpecialtyDoctors().map(([specialty, doctors], index) => (
            <div key={index} className="specialty-card" onClick={() => setSearchQuery(specialty)}>
              <Search className="icon" />
              <div className="specialty-info">
                <span className="specialty-name">{specialty}</span>
                <span className="specialty-count">{doctors.length} doctor(s)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;