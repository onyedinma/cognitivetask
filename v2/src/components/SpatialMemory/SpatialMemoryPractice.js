import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpatialMemory.css';

/**
 * SpatialMemoryPractice component
 * Practice component for the spatial memory task with study and response phases
 */
const SpatialMemoryPractice = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('instructions'); // 'instructions', 'study', 'response', 'feedback'
  const [shapes, setShapes] = useState([]);
  const [movedShapes, setMovedShapes] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showReadyButton, setShowReadyButton] = useState(false);
  const [movedPositions, setMovedPositions] = useState([]);
  
  // Timer refs for managing transitions
  const timerRef = useRef(null);
  const studyTimerRef = useRef(null);
  const readyButtonTimerRef = useRef(null);
  
  // Generate shapes to match the reference image
  const generateShapes = () => {
    // Define shape types and colors
    const shapeOptions = [
      { type: 'circle', color: 'green' },
      { type: 'triangle', color: 'green' },
      { type: 'pentagon', color: 'yellow' },
      { type: 'triangle', color: 'purple' },
      { type: 'circle', color: 'blue' },
      { type: 'square', color: 'red' },
      { type: 'pentagon', color: 'purple' },
      { type: 'square', color: 'blue' },
    ];
    
    // Randomly select 5 shapes from options
    const shuffledOptions = [...shapeOptions].sort(() => Math.random() - 0.5);
    const selectedShapes = shuffledOptions.slice(0, 5);
    
    // Create practice shapes with random selection
    const practiceShapes = selectedShapes.map((shape, index) => ({
      id: index,
      type: shape.type,
      color: shape.color,
      position: index
    }));
    
    setShapes(practiceShapes);
    return practiceShapes;
  };
  
  const moveShapes = (originalShapes) => {
    // Create a deep copy of shapes
    const shapesCopy = JSON.parse(JSON.stringify(originalShapes));
    
    // Randomly select two different positions to swap
    let pos1, pos2;
    do {
      pos1 = Math.floor(Math.random() * shapesCopy.length);
      pos2 = Math.floor(Math.random() * shapesCopy.length);
    } while (pos1 === pos2);
    
    // Store which positions were swapped for later evaluation
    const changedPositions = [pos1, pos2];
    setMovedPositions(changedPositions);
    
    // Swap the positions
    const temp = shapesCopy[pos1].position;
    shapesCopy[pos1].position = shapesCopy[pos2].position;
    shapesCopy[pos2].position = temp;
    
    setMovedShapes(shapesCopy);
    return shapesCopy;
  };
  
  const transitionToResponsePhase = (originalShapes) => {
    // Clear all timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (studyTimerRef.current) clearInterval(studyTimerRef.current);
    if (readyButtonTimerRef.current) clearTimeout(readyButtonTimerRef.current);
    
    // Move to response phase
    moveShapes(originalShapes);
    setPhase('response');
  };
  
  const startStudyPhase = () => {
    const newShapes = generateShapes();
    setPhase('study');
    setSelectedCells([]);
    setTimeRemaining(30);
    setShowReadyButton(false);
    
    // Show "I'm ready" button after 10 seconds
    readyButtonTimerRef.current = setTimeout(() => {
      setShowReadyButton(true);
    }, 10000);
    
    // Start countdown timer
    const startTime = Date.now();
    const countdownTime = 30000; // 30 seconds in milliseconds
    
    studyTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((countdownTime - elapsed) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(studyTimerRef.current);
        transitionToResponsePhase(newShapes);
      }
    }, 1000);
    
    // Move to response phase after 30 seconds
    timerRef.current = setTimeout(() => {
      clearInterval(studyTimerRef.current);
      transitionToResponsePhase(newShapes);
    }, countdownTime);
  };
  
  const handleReadyClick = () => {
    transitionToResponsePhase(shapes);
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (studyTimerRef.current) clearInterval(studyTimerRef.current);
      if (readyButtonTimerRef.current) clearTimeout(readyButtonTimerRef.current);
    };
  }, []);
  
  const handleCellClick = (position) => {
    if (phase !== 'response') return;
    
    setSelectedCells(prev => {
      if (prev.includes(position)) {
        return prev.filter(pos => pos !== position);
      } else {
        return [...prev, position];
      }
    });
  };
  
  const handleSubmit = () => {
    if (phase !== 'response') return;
    
    // Use the dynamically generated changed positions
    const changedPositions = movedPositions;
    
    // Count correct and incorrect selections
    const correctSelections = selectedCells.filter(pos => changedPositions.includes(pos));
    const incorrectSelections = selectedCells.filter(pos => !changedPositions.includes(pos));
    
    if (correctSelections.length === changedPositions.length && incorrectSelections.length === 0) {
      setFeedbackMessage('Perfect! You correctly identified the shapes that changed position.');
    } else if (correctSelections.length > 0) {
      setFeedbackMessage(`You identified ${correctSelections.length} out of ${changedPositions.length} changes correctly, with ${incorrectSelections.length} incorrect selections.`);
    } else {
      // Add 1 to each position for user-friendly numbering (starting from 1 instead of 0)
      const positionDisplay = changedPositions.map(pos => pos + 1).join(' and ');
      setFeedbackMessage(`You didn't identify any changes correctly. The correct answer was shapes ${positionDisplay}.`);
    }
    
    setPhase('feedback');
  };
  
  // Function to restart practice session
  const handlePracticeAgain = () => {
    // Reset state for a new practice session
    setSelectedCells([]);
    setFeedbackMessage('');
    setMovedPositions([]);
    
    // Start a new study phase
    startStudyPhase();
  };
  
  const handleStartTask = () => {
    navigate('/spatial-memory/task');
  };
  
  // Add a function to calculate responsive dimensions for the practice grid
  const getResponsiveGridStyles = () => {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Calculate maximum available width (accounting for padding/margins)
    const maxAvailableWidth = Math.min(viewportWidth - 40, 700);
    
    // Calculate cell size based on available width (5 cells + gaps)
    const cellSize = Math.floor((maxAvailableWidth - (4 * 15)) / 5);
    
    // Calculate shape size (smaller than cell - reduced from 0.75 to 0.65)
    const shapeSize = Math.floor(cellSize * 0.65);
    
    return {
      gridStyles: {
        maxWidth: `${maxAvailableWidth}px`,
        width: "100%",
        margin: "0 auto",
        background: '#f7f7f7',
        padding: '15px',
        display: 'grid',
        gridTemplateColumns: `repeat(5, ${cellSize}px)`,
        gridTemplateRows: "1fr",
        boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        gap: '12px',
        boxSizing: 'border-box',
        justifyContent: 'center'
      },
      cellSize: cellSize,
      shapeSize: shapeSize
    };
  };
  
  return (
    <div className="spatial-memory-container">
      {phase === 'instructions' && (
        <div className="instructions-container">
          <div className="instructions-header">
            <h1>Spatial Working Memory - Practice</h1>
          </div>
          
          <div className="instructions-content">
            <div className="instructions-section">
              <h2>Instructions</h2>
              <p>This task tests your ability to remember the positions of shapes and identify when they change.</p>
              
              <div className="instructions-steps">
                <div className="instruction-step">
                  <div className="step-number">1</div>
                  <div className="step-text">Study the positions of shapes in a single row</div>
                </div>
                
                <div className="instruction-step">
                  <div className="step-number">2</div>
                  <div className="step-text">After 30 seconds, some shapes will swap positions</div>
                </div>
                
                <div className="instruction-step">
                  <div className="step-number">3</div>
                  <div className="step-text">Your task is to click on BOTH shapes that changed positions</div>
                </div>
              </div>
              
              <div className="instructions-note">
                <p><strong>Note:</strong> You'll have the option to move forward after 10 seconds if you feel ready</p>
              </div>
            </div>
            
            <div className="instructions-examples">
              <h3>Example:</h3>
              <div className="examples-container">
                <div className="example">
                  <div className="example-label">Original Order:</div>
                  <div className="example-shapes">
                    <div className="grid-shape shape-pentagon shape-yellow"></div>
                    <div className="grid-shape shape-triangle shape-green"></div>
                    <div className="grid-shape shape-circle shape-blue"></div>
                    <div className="grid-shape shape-pentagon shape-purple"></div>
                    <div className="grid-shape shape-circle shape-green"></div>
                  </div>
                </div>
                
                <div className="example-arrow">→</div>
                
                <div className="example">
                  <div className="example-label">After Change:</div>
                  <div className="example-shapes">
                    <div className="grid-shape shape-pentagon shape-yellow"></div>
                    <div className="grid-shape shape-circle shape-blue"></div>
                    <div className="grid-shape shape-triangle shape-green"></div>
                    <div className="grid-shape shape-pentagon shape-purple"></div>
                    <div className="grid-shape shape-circle shape-green"></div>
                  </div>
                </div>
              </div>
              <div className="example-caption">
                <p>In this example, the triangle and circle switched positions. You would need to click on BOTH shapes.</p>
              </div>
            </div>
          </div>
          
          <div className="instructions-actions">
            <button 
              className="spatial-button start-button"
              onClick={startStudyPhase}
              style={{ 
                fontSize: "1.2rem", 
                padding: "12px 40px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Start Practice
            </button>
          </div>
        </div>
      )}
      
      {phase === 'study' && (
        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.4rem', margin: '10px 0' }}>Study the positions of these shapes</h2>
          
          <div style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem', margin: '15px 0' }}>
            Time remaining: {timeRemaining} seconds
          </div>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = shapes.find(s => s.position === i);
              const { shapeSize } = getResponsiveGridStyles();
              
              return (
                <div key={i} className="grid-cell" style={{ 
                  background: 'white', 
                  padding: '5px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1/1'
                }}>
                  {shape && (
                    <div 
                      className={`grid-shape shape-${shape.type} shape-${shape.color}`}
                      style={{ 
                        width: `${shapeSize}px`, 
                        height: `${shapeSize}px`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        fontSize: '0',
                        color: 'transparent',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {showReadyButton && (
            <button 
              className="spatial-button ready-button"
              onClick={handleReadyClick}
              style={{ 
                fontSize: "1.1rem", 
                padding: "10px 20px",
                marginTop: "20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "block",
                margin: "20px auto 0"
              }}
            >
              I'm ready to identify changes
            </button>
          )}
        </div>
      )}
      
      {phase === 'response' && (
        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.4rem', margin: '10px 0' }}>Click on all shapes that have MOVED</h2>
          
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Remember:</p>
            <ul style={{ listStyleType: 'disc', textAlign: 'left', display: 'inline-block', margin: '5px auto', fontSize: '0.9rem' }}>
              <li style={{ margin: '3px 0' }}>When shapes swap positions, identify <strong>BOTH shapes</strong></li>
              <li style={{ margin: '3px 0' }}>Only the <strong>positions</strong> have changed</li>
            </ul>
          </div>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = movedShapes.find(s => s.position === i);
              const isSelected = selectedCells.includes(i);
              const { shapeSize } = getResponsiveGridStyles();
              
              return (
                <div 
                  key={i} 
                  className={`grid-cell clickable ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCellClick(i)}
                  style={{ 
                    background: isSelected ? '#e3f2fd' : 'white',
                    border: isSelected ? '2px solid #2196F3' : '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    padding: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1/1'
                  }}
                >
                  {shape && (
                    <div 
                      className={`grid-shape shape-${shape.type} shape-${shape.color}`}
                      style={{ 
                        width: `${shapeSize}px`, 
                        height: `${shapeSize}px`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        fontSize: '0',
                        color: 'transparent',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button 
            className="spatial-button submit-button"
            onClick={handleSubmit}
            style={{ 
              fontSize: "1.1rem", 
              padding: "10px 20px",
              marginTop: "15px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Submit Answers
          </button>
        </div>
      )}
      
      {phase === 'feedback' && (
        <div className="feedback-container" style={{ textAlign: 'center', padding: '0 10px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: '10px 0' }}>Feedback</h2>
          <p className="feedback-message" style={{ fontSize: '1rem', margin: '10px 0' }}>{feedbackMessage}</p>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = movedShapes.find(s => s.position === i);
              const didChange = movedPositions.includes(i);
              const { shapeSize } = getResponsiveGridStyles();
              
              return (
                <div 
                  key={i} 
                  className={`grid-cell ${didChange ? 'selected' : ''}`}
                  style={{ 
                    background: didChange ? '#e3f2fd' : 'white',
                    border: didChange ? '2px solid #2196F3' : '1px solid #ddd',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    padding: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1/1'
                  }}
                >
                  {shape && (
                    <div 
                      className={`grid-shape shape-${shape.type} shape-${shape.color}`}
                      style={{ 
                        width: `${shapeSize}px`, 
                        height: `${shapeSize}px`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        fontSize: '0',
                        color: 'transparent',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <p style={{ fontSize: '0.9rem', margin: '10px 0' }}>
            The shapes at positions {movedPositions.map(pos => pos + 1).join(' and ')} swapped positions.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
            <button 
              className="spatial-button"
              onClick={handlePracticeAgain}
              style={{ 
                fontSize: "1.1rem", 
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Practice Again
            </button>
            
            <button 
              className="spatial-button next-button"
              onClick={handleStartTask}
              style={{ 
                fontSize: "1.1rem", 
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Start Main Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpatialMemoryPractice; 
