import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TASK_CONFIG } from '../../config';
import './ObjectSpan.css';

// Main ObjectSpanTask component
const ObjectSpanTask = () => {
  const [studentId, setStudentId] = useState('');
  const [counterBalance, setCounterBalance] = useState('');
  const navigate = useNavigate();

  // Get these from localStorage if they exist
  useEffect(() => {
    const savedStudentId = localStorage.getItem('studentId');
    const savedCounterBalance = localStorage.getItem('counterBalance');
    
    if (savedStudentId) setStudentId(savedStudentId);
    if (savedCounterBalance) setCounterBalance(savedCounterBalance);
  }, []);

  // Navigation handlers
  const navigateToForward = () => {
    navigate('/object-span/forward');
  };

  const navigateToBackward = () => {
    navigate('/object-span/backward');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="task-screen">
      <h1>Object Span Task</h1>
      
      <div className="task-instructions">
        <p>In this task, you will be shown a series of objects one at a time.</p>
        <p>Your task is to remember and recall the objects in the correct order.</p>
        <p>You'll have the option to practice before starting the main task.</p>
      </div>
      
      <div className="task-options">
        <button onClick={navigateToForward} className="task-option-button">
          Forward Recall
        </button>
        <button onClick={navigateToBackward} className="task-option-button">
          Backward Recall
        </button>
      </div>
      
      <div className="task-metadata">
        {studentId && <p>Participant ID: {studentId}</p>}
        {counterBalance && <p>Counter Balance: {counterBalance}</p>}
      </div>
      
      <button onClick={navigateToHome} className="back-button">Back to Home</button>
    </div>
  );
};

export default ObjectSpanTask; 