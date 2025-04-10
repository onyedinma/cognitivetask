import React from 'react';
import { Link } from 'react-router-dom';
import './DigitSpan.css';

/**
 * Main DigitSpan Task selection component
 * This component allows users to choose between Forward and Backward Digit Span tasks
 */
const DigitSpanTask = () => {
  return (
    <div className="task-screen">
      <h1>Digit Span Task</h1>
      
      <div className="task-description">
        <p>In this task, you will be shown a series of digits one at a time.</p>
        <p>You can choose to practice either:</p>
        
        <ul className="task-options-list">
          <li><strong>Forward Digit Span:</strong> Recall digits in the SAME order</li>
          <li><strong>Backward Digit Span:</strong> Recall digits in REVERSE order</li>
        </ul>
        
        <p>Select which version you would like to try:</p>
      </div>
      
      <div className="task-options">
        <Link to="/digit-span/forward" className="task-option-button">
          Forward Digit Span
        </Link>
        <Link to="/digit-span/backward" className="task-option-button">
          Backward Digit Span
        </Link>
      </div>
      
      <Link to="/" className="back-button">Back to Tasks</Link>
    </div>
  );
};

export default DigitSpanTask; 