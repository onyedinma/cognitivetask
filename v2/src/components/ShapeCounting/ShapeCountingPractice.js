import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShapeCounting.css';

/**
 * ShapeCountingPractice component
 * Practice round for the shape counting task
 */
const ShapeCountingPractice = () => {
  const navigate = useNavigate();
  
  // States for managing shapes and counts
  const [currentShape, setCurrentShape] = useState(null);
  const [showingShapes, setShowingShapes] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [squareCount, setSquareCount] = useState(0);
  const [triangleCount, setTriangleCount] = useState(0);
  const [circleCount, setCircleCount] = useState(0);
  const [correctCounts, setCorrectCounts] = useState({ squares: 0, triangles: 0, circles: 0 });
  const [result, setResult] = useState({ correct: false, feedback: '' });
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Shapes for the practice
  const shapes = ['square', 'triangle', 'circle'];
  
  // Generate a sequence of random shapes
  const generateSequence = () => {
    const sequenceLength = 6; // Fixed at 6 shapes for practice
    const sequence = [];
    const counts = { squares: 0, triangles: 0, circles: 0 };
    
    for (let i = 0; i < sequenceLength; i++) {
      const shapeIndex = Math.floor(Math.random() * shapes.length);
      const shape = shapes[shapeIndex];
      sequence.push(shape);
      
      // Count each shape
      if (shape === 'square') counts.squares++;
      else if (shape === 'triangle') counts.triangles++;
      else if (shape === 'circle') counts.circles++;
    }
    
    return { sequence, counts };
  };
  
  // Start showing the shapes
  const startSequence = () => {
    // Clear any existing timers
    clearAllTimers();
    
    // Reset state
    setCurrentShape(null);
    setShowingShapes(true);
    setShowResponse(false);
    setShowFeedback(false);
    
    // Generate sequence
    const { sequence, counts } = generateSequence();
    console.log('Generated sequence:', sequence);
    console.log('Correct counts:', counts);
    
    // Store correct counts for feedback
    setCorrectCounts(counts);
    
    // Display shapes one by one
    sequence.forEach((shape, index) => {
      // Show shape
      const showTimer = setTimeout(() => {
        console.log(`Showing shape: ${shape}`);
        setCurrentShape(shape);
      }, index * 1500); // Show each shape for 1.5 seconds
      
      timersRef.current.push(showTimer);
      
      // Hide shape (except for the last one)
      if (index < sequence.length - 1) {
        const hideTimer = setTimeout(() => {
          setCurrentShape(null);
        }, (index * 1500) + 1000); // Show for 1 second, blank for 0.5 seconds
        
        timersRef.current.push(hideTimer);
      }
    });
    
    // Show response form after all shapes
    const responseTimer = setTimeout(() => {
      setShowingShapes(false);
      setCurrentShape(null);
      setShowResponse(true);
    }, sequence.length * 1500);
    
    timersRef.current.push(responseTimer);
  };
  
  // Check user's response
  const checkResponse = () => {
    const isCorrect = 
      squareCount === correctCounts.squares && 
      triangleCount === correctCounts.triangles && 
      circleCount === correctCounts.circles;
    
    const feedback = isCorrect
      ? 'Correct! You counted all the shapes accurately.'
      : 'Not quite right. Check the correct counts below.';
    
    setResult({
      correct: isCorrect,
      feedback,
      userCounts: {
        squares: squareCount,
        triangles: triangleCount,
        circles: circleCount
      }
    });
    
    setShowResponse(false);
    setShowFeedback(true);
    setPracticeAttempts(prev => prev + 1);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // Continue practice or go to main task
  const continuePractice = () => {
    // Reset counts
    setSquareCount(0);
    setTriangleCount(0);
    setCircleCount(0);
    setShowFeedback(false);
    startSequence();
  };
  
  const goToMainTask = () => {
    navigate('/shape-counting/task');
  };
  
  // Start practice when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startSequence();
    }, 1000);
    
    timersRef.current.push(timer);
    
    // Cleanup on unmount
    return () => {
      clearAllTimers();
    };
  }, []);
  
  // Increment/decrement handlers for number inputs
  const handleIncrement = (setter) => {
    setter(prev => Math.min(prev + 1, 6));
  };
  
  const handleDecrement = (setter) => {
    setter(prev => Math.max(prev - 1, 0));
  };
  
  return (
    <div className="task-screen">
      <h1>Shape Counting Practice (6 Shapes)</h1>
      
      {showingShapes && (
        <div className="shape-display">
          {currentShape === 'square' && <div className="shape square"></div>}
          {currentShape === 'triangle' && <div className="shape triangle"></div>}
          {currentShape === 'circle' && <div className="shape circle"></div>}
        </div>
      )}
      
      {showResponse && (
        <div className="response-section">
          <h2>How many of each shape did you count?</h2>
          
          <form onSubmit={handleSubmit} className="counting-form">
            <div className="count-input-group">
              <label>Squares:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setSquareCount)}>-</button>
                <input 
                  type="number" 
                  value={squareCount} 
                  onChange={(e) => setSquareCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="6"
                />
                <button type="button" onClick={() => handleIncrement(setSquareCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>Triangles:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setTriangleCount)}>-</button>
                <input 
                  type="number" 
                  value={triangleCount} 
                  onChange={(e) => setTriangleCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="6"
                />
                <button type="button" onClick={() => handleIncrement(setTriangleCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>Circles:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setCircleCount)}>-</button>
                <input 
                  type="number" 
                  value={circleCount} 
                  onChange={(e) => setCircleCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="6"
                />
                <button type="button" onClick={() => handleIncrement(setCircleCount)}>+</button>
              </div>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      )}
      
      {showFeedback && (
        <div className="feedback-section">
          <h2>Practice Feedback</h2>
          <p className={result.correct ? 'feedback-correct' : 'feedback-incorrect'}>
            {result.feedback}
          </p>
          
          <div className="counts-comparison">
            <div className="correct-counts">
              <h3>Correct Counts:</h3>
              <p>Squares: <span className="important">{correctCounts.squares}</span></p>
              <p>Triangles: <span className="important">{correctCounts.triangles}</span></p>
              <p>Circles: <span className="important">{correctCounts.circles}</span></p>
            </div>
            
            <div className="user-counts">
              <h3>Your Counts:</h3>
              <p>Squares: <span className={squareCount === correctCounts.squares ? 'correct' : 'incorrect'}>{squareCount}</span></p>
              <p>Triangles: <span className={triangleCount === correctCounts.triangles ? 'correct' : 'incorrect'}>{triangleCount}</span></p>
              <p>Circles: <span className={circleCount === correctCounts.circles ? 'correct' : 'incorrect'}>{circleCount}</span></p>
            </div>
          </div>
          
          <div className="practice-controls">
            <button onClick={continuePractice} className="continue-button">
              Continue Practice
            </button>
            
            {practiceAttempts >= 2 && (
              <button onClick={goToMainTask} className="main-task-button">
                I'm Ready for Main Task
              </button>
            )}
          </div>
        </div>
      )}
      
      {!showingShapes && !showResponse && !showFeedback && (
        <div className="loading">
          Preparing 6 shapes for practice...
        </div>
      )}
    </div>
  );
};

export default ShapeCountingPractice; 