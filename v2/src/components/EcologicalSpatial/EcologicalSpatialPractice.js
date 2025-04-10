import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalSpatial.css';

// Import images from Ecoimages folder
import dog from './Ecoimages/dog.png';
import cat from './Ecoimages/cat.png';
import bird from './Ecoimages/bird.png';
import car from './Ecoimages/Car.png';
import house from './Ecoimages/house.png';
import bus from './Ecoimages/bus.png';
import chair from './Ecoimages/chair.png';
import computer from './Ecoimages/computer.png';
import umbrella from './Ecoimages/umbrella.png';
import clock from './Ecoimages/clock.png';

// Define image objects to use for practice
const ecoImages = [
  { name: 'dog', src: dog },
  { name: 'cat', src: cat },
  { name: 'bird', src: bird },
  { name: 'car', src: car },
  { name: 'house', src: house },
  { name: 'bus', src: bus },
  { name: 'chair', src: chair },
  { name: 'computer', src: computer },
  { name: 'umbrella', src: umbrella },
  { name: 'clock', src: clock }
];

/**
 * EcologicalSpatialPractice component
 * Practice component for the ecological spatial memory task with study and response phases
 */
const EcologicalSpatialPractice = () => {
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
  
  // Generate shapes with ecological images
  const generateShapes = () => {
    // Shuffle the eco images array and take only 5 for practice
    const shuffledImages = [...ecoImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    // Create practice shapes with the selected images
    const practiceShapes = shuffledImages.map((image, index) => ({
      id: index,
      imageName: image.name,
      imageSrc: image.src,
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
    navigate('/ecological-spatial/task');
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
    
    // Calculate image size (smaller than cell)
    const imageSize = Math.floor(cellSize * 0.7);
    
    return {
      gridStyles: {
        display: 'grid',
        gridTemplateColumns: `repeat(5, ${cellSize}px)`,
        gridTemplateRows: `${cellSize}px`,
        gap: '15px',
        margin: '0 auto 20px',
        padding: '15px',
        background: '#f7f7f7',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        width: 'fit-content'
      },
      cellSize,
      imageSize
    };
  };
  
  // Render function for the instructions phase
  const renderInstructions = () => {
  return (
        <div className="instructions-container">
          <div className="instructions-header">
          <h1>Ecological Spatial Memory Task - Practice</h1>
          </div>
          
          <div className="instructions-content">
            <div className="instructions-section">
            <h2>How it works</h2>
            <p>This task tests your ability to remember the positions of everyday objects.</p>
              
              <div className="instructions-steps">
                <div className="instruction-step">
                  <div className="step-number">1</div>
                <div className="step-text">You will see a row of 5 objects</div>
                </div>
                <div className="instruction-step">
                  <div className="step-number">2</div>
                <div className="step-text">Study the positions carefully (30 seconds)</div>
                </div>
                <div className="instruction-step">
                  <div className="step-number">3</div>
                <div className="step-text">Two objects will swap positions</div>
              </div>
              <div className="instruction-step">
                <div className="step-number">4</div>
                <div className="step-text">Your job is to identify which objects moved</div>
              </div>
            </div>
            
            <div className="instructions-note">
              <p>Important: In this task, you need to identify BOTH objects that change positions.</p>
            </div>
          </div>
          
          <div className="instructions-footer">
            <button onClick={() => startStudyPhase()} className="primary-button">Start Practice</button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render function for the study phase
  const renderStudyPhase = () => {
    return (
      <div className="study-phase">
        <h2 className="phase-title">Study Phase</h2>
        <p className="phase-instruction">Memorize the positions of these objects</p>
        
        <div className="timer-display">Time remaining: {timeRemaining}s</div>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = shapes.find(s => s.position === i);
            const { imageSize } = getResponsiveGridStyles();
              
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
                    className="eco-image-container"
                    style={{ 
                      width: `${imageSize}px`, 
                      height: `${imageSize}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <img 
                      src={shape.imageSrc} 
                      alt={shape.imageName}
                      className="eco-image"
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {showReadyButton && (
          <button onClick={handleReadyClick} className="ready-button">
            I'm Ready
            </button>
          )}
        </div>
    );
  };
  
  // Render function for the response phase
  const renderResponsePhase = () => {
    return (
      <div className="response-phase">
        <h2 className="phase-title">Response Phase</h2>
        <p className="response-instruction">Click on the objects that changed position</p>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = movedShapes.find(s => s.position === i);
              const isSelected = selectedCells.includes(i);
            const { imageSize } = getResponsiveGridStyles();
              
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
                    className="eco-image-container"
                    style={{ 
                      width: `${imageSize}px`, 
                      height: `${imageSize}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <img 
                      src={shape.imageSrc} 
                      alt={shape.imageName}
                      className="eco-image"
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button 
          onClick={handleSubmit} 
            className="spatial-button submit-button"
          disabled={selectedCells.length < 2}
        >
          Submit
          </button>
      </div>
    );
  };
  
  // Render function for the feedback phase
  const renderFeedbackPhase = () => {
    return (
      <div className="feedback-phase">
        <h2 className="phase-title">Feedback</h2>
        <div className={`feedback-message ${
          feedbackMessage.includes('Perfect') ? 'correct' : 'incorrect'}`}>
          {feedbackMessage}
        </div>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = movedShapes.find(s => s.position === i);
              const didChange = movedPositions.includes(i);
            const { imageSize } = getResponsiveGridStyles();
              
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
                    className="eco-image-container"
                    style={{ 
                      width: `${imageSize}px`, 
                      height: `${imageSize}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <img 
                      src={shape.imageSrc} 
                      alt={shape.imageName}
                      className="eco-image"
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
        <div className="button-container" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={handlePracticeAgain} className="spatial-button">
              Practice Again
            </button>
          <button onClick={handleStartTask} className="spatial-button ready-button">
              Start Main Task
            </button>
          </div>
        </div>
    );
  };

  return (
    <div className="spatial-screen">
      <div className="spatial-content">
        {phase === 'instructions' && renderInstructions()}
        {phase === 'study' && renderStudyPhase()}
        {phase === 'response' && renderResponsePhase()}
        {phase === 'feedback' && renderFeedbackPhase()}
      </div>
    </div>
  );
};

export default EcologicalSpatialPractice; 
