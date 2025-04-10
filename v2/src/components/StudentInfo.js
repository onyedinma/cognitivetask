import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentInfo.css';

const StudentInfo = () => {
  const [studentId, setStudentId] = useState('');
  const [idError, setIdError] = useState('');
  const navigate = useNavigate();

  // Validate student ID (5-10 digits)
  const validateStudentId = (id) => {
    return /^\d{5,10}$/.test(id);
  };

  // Handle student ID input change
  const handleStudentIdChange = (e) => {
    const value = e.target.value;
    setStudentId(value);
    
    // Clear error if input is valid
    if (validateStudentId(value)) {
      setIdError('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { studentId });
    
    // Validate student ID
    if (!validateStudentId(studentId)) {
      console.log('Invalid student ID');
      setIdError('Please enter a valid ID (5-10 digits)');
      return;
    }
    
    // Store in localStorage
    try {
      // Clear first, then set
      localStorage.clear(); // Clear all previous data
      
      // Store values in localStorage
      localStorage.setItem('studentId', studentId);
      localStorage.setItem('counterBalance', 'A'); // Default value
      
      // Log to confirm values are set
      console.log('Data saved to localStorage', { 
        studentId: localStorage.getItem('studentId'),
        counterBalance: localStorage.getItem('counterBalance')
      });
      
      // Force a complete page reload instead of using React Router
      // This ensures the app reads the latest localStorage values on startup
      window.location.href = '/';
      
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      alert('There was an error saving your information. Please try again.');
    }
  };

  return (
    <div className="student-info-container">
      <h1>Cognitive Task Assessment</h1>
      
      <form onSubmit={handleSubmit} className="student-info-form">
        <div className="input-group">
          <label htmlFor="studentId">Enter your participant ID:</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={handleStudentIdChange}
            placeholder="e.g. 12345678"
            className={idError ? 'error-input' : ''}
          />
          {idError && <p className="error-message">{idError}</p>}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!validateStudentId(studentId)}
        >
          Start
        </button>
      </form>
    </div>
  );
};

export default StudentInfo; 