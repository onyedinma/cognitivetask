import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CountingGame.css';

// Import images
import dollarBillImage from '../../assets/images/counting/5dollar.jpg';
import busImage from '../../assets/images/counting/bus.jpg';
import faceImage from '../../assets/images/counting/face.jpg';

/**
 * CountingGameInstructions component
 * Shows examples of the objects and explains the task
 */
const CountingGameInstructions = () => {
  const navigate = useNavigate();

  const startPractice = () => {
    navigate('/counting-game/practice');
  };

  return (
    <div className="task-screen">
      <h1>Counting Game Example</h1>

      <div className="task-description">
        <p>In this example, let's say you see the following series of objects:</p>
        
        <div className="example-objects">
          <div 
            className="example-object dollar-bill"
            style={{ backgroundImage: `url(${dollarBillImage})` }}
          ></div>
          <div 
            className="example-object bus"
            style={{ backgroundImage: `url(${busImage})` }}
          ></div>
          <div 
            className="example-object face"
            style={{ backgroundImage: `url(${faceImage})` }}
          ></div>
          <div 
            className="example-object bus"
            style={{ backgroundImage: `url(${busImage})` }}
          ></div>
          <div 
            className="example-object dollar-bill"
            style={{ backgroundImage: `url(${dollarBillImage})` }}
          ></div>
        </div>
        
        <h2>In this example, the correct count number for each object would be:</h2>
        
        <div className="example-counts">
          <p><strong>$5 Bills: <span className="important">2</span></strong></p>
          <p><strong>UTA Buses: <span className="important">2</span></strong></p>
          <p><strong>Faces: <span className="important">1</span></strong></p>
        </div>
        
        <p>Remember:</p>
        <ul className="instruction-list">
          <li>Objects will appear one at a time</li>
          <li>Keep a mental count of each object type</li>
          <li>Do NOT use your fingers or pen and paper to count</li>
        </ul>
      </div>
      
      <div className="navigation-buttons">
        <Link to="/counting-game" className="back-button">Go Back</Link>
        <button onClick={startPractice} className="start-button">Start Practice</button>
      </div>
    </div>
  );
};

export default CountingGameInstructions; 