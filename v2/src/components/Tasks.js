import React from 'react';
import { Link } from 'react-router-dom';
import './Tasks.css';

/**
 * Tasks component
 * Displays the available cognitive tasks for the user to choose
 */
const Tasks = () => {
  return (
    <div className="task-screen welcome-screen">
      <h1>Cognitive Tasks</h1>
      <p>
        Please select a cognitive task to begin. Each task will start with instructions,
        followed by a practice round, and then the main task.
      </p>
      
      <div className="task-buttons">
        <Link to="/digit-span" className="task-button">
          <div className="task-button-content">
            <h2>Digit Span</h2>
            <p>Remember and recall sequences of digits</p>
          </div>
        </Link>
        
        <Link to="/shape-counting" className="task-button">
          <div className="task-button-content">
            <h2>Shape Counting</h2>
            <p>Count different shapes displayed in sequence</p>
          </div>
        </Link>
        
        {/* Add more task buttons here as they are implemented */}
      </div>
      
      <div className="home-link">
        <Link to="/">Return to Home</Link>
      </div>
    </div>
  );
};

export default Tasks; 