import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EcologicalSpatial.css';

/**
 * EcologicalSpatialTask component
 * Entry point for the Ecological Spatial Working Memory task
 */
const EcologicalSpatialTask = () => {
  const navigate = useNavigate();

  const startPractice = () => {
    navigate('/ecological-spatial/practice');
  };

  return (
    <div className="spatial-screen">
      <h1>Ecological Spatial Working Memory Task</h1>
      
      <div className="task-description">
        <p>This task measures your ability to remember the positions of real-world objects in space.</p>
        
        <h2>How it works:</h2>
        <ol className="instruction-list">
          <li>You will be shown a grid containing various everyday objects</li>
          <li>Study the positions of these objects carefully</li>
          <li>After some time, a second grid will appear where some objects have moved positions</li>
          <li>Your task is to identify which objects have changed position by clicking on them</li>
        </ol>
        
        <div className="task-note">
          <p><strong>Important:</strong></p>
          <ul className="instruction-list">
            <li>The same objects appear in both grids - only their positions change</li>
            <li>When objects swap positions, you need to identify BOTH objects involved</li>
            <li>You gain one point for each correctly identified moved object</li>
            <li>You lose one point for each incorrectly identified object</li>
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

export default EcologicalSpatialTask; 