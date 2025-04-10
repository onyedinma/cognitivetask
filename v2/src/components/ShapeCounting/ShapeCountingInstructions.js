import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ShapeCounting.css';

/**
 * ShapeCountingInstructions component
 * Shows examples of the shapes and explains the task
 */
const ShapeCountingInstructions = () => {
  const navigate = useNavigate();
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [squareCount, setSquareCount] = useState(0);
  const [triangleCount, setTriangleCount] = useState(0);
  const [circleCount, setCircleCount] = useState(0);

  // Example sequence of shapes to show
  const exampleSequence = [
    'circle',
    'square',
    'triangle',
    'triangle',
    'square',
    'triangle'
  ];

  // Animate through the example sequence
  useEffect(() => {
    if (currentShapeIndex < exampleSequence.length) {
      const timer = setTimeout(() => {
        // Update the appropriate counter
        const shape = exampleSequence[currentShapeIndex];
        if (shape === 'square') setSquareCount(prev => prev + 1);
        if (shape === 'triangle') setTriangleCount(prev => prev + 1);
        if (shape === 'circle') setCircleCount(prev => prev + 1);
        
        // Move to the next shape
        setCurrentShapeIndex(prev => prev + 1);
      }, 1200);
      
      return () => clearTimeout(timer);
    } else if (currentShapeIndex === exampleSequence.length) {
      // Animation complete
      setAnimationComplete(true);
    }
  }, [currentShapeIndex]);

  const startPractice = () => {
    navigate('/shape-counting/practice');
  };

  const restartAnimation = () => {
    setCurrentShapeIndex(0);
    setSquareCount(0);
    setTriangleCount(0);
    setCircleCount(0);
    setAnimationComplete(false);
  };

  return (
    <div className="task-screen">
      <h1>Shape Counting Instructions</h1>

      <div className="task-description">
        <div className="instruction-card">
          <h2>Task Overview</h2>
          <p>In this task, you will see a series of shapes (squares, triangles, and circles) presented one at a time.</p>
          <p>Your job is to <strong>keep count of how many of each shape type</strong> you see in the sequence.</p>
        </div>
        
        <div className="instruction-card">
          <h2>Interactive Example</h2>
          <p>Below is an example sequence. Watch as shapes appear one by one:</p>
          
          <div className="example-animation">
            {!animationComplete ? (
              <div className="animated-shape-container">
                {currentShapeIndex > 0 && currentShapeIndex <= exampleSequence.length && (
                  <div className={`animated-shape ${exampleSequence[currentShapeIndex-1]}`}></div>
                )}
                <div className="animation-progress">
                  <div className="progress-bar" style={{ width: `${(currentShapeIndex / exampleSequence.length) * 100}%` }}></div>
                </div>
                <div className="current-counts">
                  <span>Squares: {squareCount}</span>
                  <span>Triangles: {triangleCount}</span>
                  <span>Circles: {circleCount}</span>
                </div>
              </div>
            ) : (
              <div className="example-complete">
                <div className="example-shapes">
                  {exampleSequence.map((shape, index) => (
                    <div key={index} className={`example-shape ${shape}`}></div>
                  ))}
                </div>
                <button onClick={restartAnimation} className="replay-button">
                  Replay Animation
                </button>
              </div>
            )}
          </div>
          
          <div className="example-counts">
            <p><strong>Squares: <span className="important">{animationComplete ? "2" : squareCount}</span></strong></p>
            <p><strong>Triangles: <span className="important">{animationComplete ? "3" : triangleCount}</span></strong></p>
            <p><strong>Circles: <span className="important">{animationComplete ? "1" : circleCount}</span></strong></p>
          </div>
        </div>
        
        <div className="instruction-card">
          <h2>Important Rules</h2>
          <ul className="instruction-list">
            <li>Shapes will appear one at a time</li>
            <li>Keep a mental count of each shape type</li>
            <li>When the sequence ends, you'll be asked to report your counts</li>
            <li>Do NOT use your fingers or pen and paper to help counting</li>
            <li>Focus and pay attention to each shape as it appears</li>
          </ul>
        </div>
      </div>
      
      <div className="navigation-buttons">
        <Link to="/shape-counting" className="back-button">Go Back</Link>
        <button onClick={startPractice} className="start-button">Start Practice</button>
      </div>
    </div>
  );
};

export default ShapeCountingInstructions; 