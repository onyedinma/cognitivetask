import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DigitSpan.css';

/**
 * BackwardDigitSpan component - Shows instructions for the backward digit span task
 */
const BackwardDigitSpan = () => {
  const navigate = useNavigate();

  const startPractice = () => {
    navigate('/digit-span/backward/practice');
  };

  return (
    <div className="task-screen">
      <h1>Backward Digit Span Task</h1>

      <div className="task-description">
        <p>In this task, you will be shown a series of digits one at a time.</p>
        <p>Your task is to remember and recall the digits in <span className="important">REVERSE ORDER</span> from how they appeared.</p>
        
        <p>For example, if you see:</p>
        
        <div className="example-digits">
          <div className="example-digit">1</div>
          <div className="example-digit">3</div>
          <div className="example-digit">8</div>
        </div>
        
        <p>You should type: <span className="important">831</span></p>
        <p>You will start with practice trials to help you understand the task.</p>
      </div>
      
      <button onClick={startPractice} className="start-button">
        Start Practice
      </button>
      
      <Link to="/digit-span" className="back-button">Back to Digit Span</Link>
    </div>
  );
};

export default BackwardDigitSpan; 