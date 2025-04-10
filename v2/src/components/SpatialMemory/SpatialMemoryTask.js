import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SpatialMemory.css';

/**
 * SpatialMemoryTask component
 * Entry point for the Spatial Working Memory task
 */
const SpatialMemoryTask = () => {
  const navigate = useNavigate();

  const startPractice = () => {
    navigate('/spatial-memory/practice');
  };

  return (
    <div className="spatial-screen">
      <h1>Spatial Working Memory Task</h1>
      
      <div className="task-description">
        <p>This task measures your ability to remember the positions of objects in space.</p>
        
        <h2>How it works:</h2>
        <ol className="instruction-list">
          <li>You will be shown a grid containing various colored shapes</li>
          <li>Study the positions of these shapes carefully</li>
          <li>After some time, a second grid will appear where some shapes have moved positions</li>
          <li>Your task is to identify which shapes have changed position by clicking on them</li>
        </ol>
        
        <div className="task-note">
          <p><strong>Important:</strong></p>
          <ul className="instruction-list">
            <li>The same shapes appear in both grids - only their positions change</li>
            <li>When shapes swap positions, you need to identify BOTH shapes involved</li>
            <li>You gain one point for each correctly identified moved shape</li>
            <li>You lose one point for each incorrectly identified shape</li>
          </ul>
        </div>
        
        <p>We'll start with a practice session using a small grid before moving to the main task.</p>
      </div>
      
      <div className="navigation-buttons">
        <Link to="/" className="spatial-button">Back to Tasks</Link>
        <button onClick={startPractice} className="spatial-button ready-button">Start Practice</button>
      </div>
    </div>
  );
};

export default SpatialMemoryTask; 