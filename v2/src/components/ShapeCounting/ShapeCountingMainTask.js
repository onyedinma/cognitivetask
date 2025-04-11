import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShapeCounting.css';

/**
 * ShapeCountingMainTask component
 * Main task component for shape counting with levels
 */
const ShapeCountingMainTask = () => {
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
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [results, setResults] = useState([]);
  const [trialComplete, setTrialComplete] = useState(false);
  const [taskComplete, setTaskComplete] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  // Level configuration
  const levels = [
    { level: 1, shapes: 4 },
    { level: 2, shapes: 6 },
    { level: 3, shapes: 8 },
    { level: 4, shapes: 10 },
    { level: 5, shapes: 12 }
  ];
  
  // Maximum attempts per level
  const maxAttempts = 2;
  
  // Shapes for the task
  const shapes = ['square', 'triangle', 'circle'];
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Generate a sequence of random shapes based on current level
  const generateSequence = () => {
    const currentLevelConfig = levels[currentLevel - 1];
    const sequenceLength = currentLevelConfig.shapes;
    
    const sequence = [];
    const counts = { squares: 0, triangles: 0, circles: 0 };
    
    // Ensure we have exactly the number of shapes defined for this level
    for (let i = 0; i < sequenceLength; i++) {
      const shapeIndex = Math.floor(Math.random() * shapes.length);
      const shape = shapes[shapeIndex];
      sequence.push(shape);
      
      // Count each shape
      if (shape === 'square') counts.squares++;
      else if (shape === 'triangle') counts.triangles++;
      else if (shape === 'circle') counts.circles++;
    }
    
    // Double-check the total number of shapes equals the required amount
    const totalShapes = counts.squares + counts.triangles + counts.circles;
    console.log(`Level ${currentLevel} (Attempt ${currentAttempt}) - Total shapes: ${totalShapes}, Expected: ${sequenceLength}`);
    
    if (totalShapes !== sequenceLength) {
      console.error(`Shape count mismatch: got ${totalShapes}, expected ${sequenceLength}`);
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
    setTrialComplete(false);
    
    // Reset counts for new trial
    setSquareCount(0);
    setTriangleCount(0);
    setCircleCount(0);
    
    // Generate sequence for level
    const { sequence, counts } = generateSequence();
    console.log(`Level ${currentLevel} (Attempt ${currentAttempt}) - Generated sequence:`, sequence);
    console.log(`Level ${currentLevel} (Attempt ${currentAttempt}) - Correct counts:`, counts);
    
    // Store correct counts for scoring
    setCorrectCounts(counts);
    
    // Display shapes one by one
    sequence.forEach((shape, index) => {
      // Show shape
      const showTimer = setTimeout(() => {
        console.log(`Showing shape ${index + 1}/${sequence.length}: ${shape}`);
        setCurrentShape(shape);
      }, index * 1500); // Show each shape for 1.5 seconds
      
      timersRef.current.push(showTimer);
      
      // Hide shape (except for the last one)
      if (index < sequence.length - 1) {
        const hideTimer = setTimeout(() => {
          setCurrentShape(null);
        }, (index * 1500) + 1000); // Show for 1 second, blank for 0.5 seconds
        
        timersRef.current.push(hideTimer);
      } else {
        // For the last shape, ensure it's hidden before showing the response form
        const hideLastTimer = setTimeout(() => {
          setCurrentShape(null);
        }, (index * 1500) + 1000);
        
        timersRef.current.push(hideLastTimer);
      }
    });
    
    // Show response form after all shapes
    const responseTimer = setTimeout(() => {
      setShowingShapes(false);
      setCurrentShape(null);
      setShowResponse(true);
    }, (sequence.length * 1500) + 500); // Add a small buffer after the last shape
    
    timersRef.current.push(responseTimer);
  };
  
  // Check user's response and record result
  const checkResponse = () => {
    const userCounts = {
      squares: squareCount,
      triangles: triangleCount,
      circles: circleCount
    };
    
    const isCorrect = 
      squareCount === correctCounts.squares && 
      triangleCount === correctCounts.triangles && 
      circleCount === correctCounts.circles;
    
    // Record result for this level and attempt
    const trialResult = {
      level: currentLevel,
      attempt: currentAttempt,
      correctCounts: { ...correctCounts },
      userCounts: { ...userCounts },
      correct: isCorrect,
      timestamp: new Date().toISOString()
    };
    
    // Only add the result if we don't already have a successful attempt for this level
    const existingSuccessfulAttempt = results.find(
      r => r.level === currentLevel && r.correct
    );
    
    if (!existingSuccessfulAttempt) {
      setResults(prevResults => [...prevResults, trialResult]);
    }
    
    setTrialComplete(true);
    setShowResponse(false);
    setShowFeedback(true);
    
    // Decide what happens next based on the result
    if (isCorrect) {
      // If correct, move to next level
      if (currentLevel >= levels.length) {
        // If this was the last level, game complete
        setTaskComplete(true);
      }
    } else {
      // If incorrect and this was the second attempt, game over
      if (currentAttempt >= maxAttempts) {
        setGameOver(true);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // Continue to next level or retry current level
  const continueTask = () => {
    if (trialComplete) {
      const lastResult = results[results.length - 1];
      
      if (lastResult.correct) {
        // Move to next level
        if (currentLevel < levels.length) {
          // First update the level, then start the sequence in a separate effect
          // to ensure the current level state is updated before generating the sequence
          setCurrentLevel(prev => prev + 1);
          setCurrentAttempt(1);
          setShowFeedback(false);
        } else {
          // Game completed successfully
          setTaskComplete(true);
        }
      } else {
        // Failed attempt
        if (currentAttempt < maxAttempts) {
          // Try again same level
          setCurrentAttempt(prev => prev + 1);
          setShowFeedback(false);
          startSequence();
        } else {
          // Game over
          setGameOver(true);
          setTaskComplete(true);
        }
      }
    }
  };
  
  // Effect to start sequence after level change
  useEffect(() => {
    if (!taskComplete && !showFeedback) {
      const timer = setTimeout(() => {
        startSequence();
      }, 500); // Short delay to ensure state is updated
      
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    }
  }, [currentLevel, currentAttempt, showFeedback, taskComplete]);
  
  // Navigate back to tasks menu
  const returnToMenu = () => {
    navigate('/tasks');
  };
  
  // Export results to CSV
  const exportToCSV = () => {
    setExportingCSV(true);
    
    try {
      // Format results for CSV - only include the best outcome for each level
      const processedResults = [];
      const levelsTracked = new Set();
      
      // First add all successful attempts
      results.filter(r => r.correct).forEach(result => {
        processedResults.push(result);
        levelsTracked.add(result.level);
      });
      
      // Then add the last attempts for levels without successes
      results.forEach(result => {
        if (!levelsTracked.has(result.level) && result.attempt === maxAttempts) {
          processedResults.push(result);
          levelsTracked.add(result.level);
        }
      });
      
      // Sort by level
      processedResults.sort((a, b) => a.level - b.level);
      
      const csvContent = processedResults.map(result => {
        return [
          result.timestamp,
          result.level,
          result.attempt,
          result.correctCounts.squares,
          result.correctCounts.triangles,
          result.correctCounts.circles,
          result.userCounts.squares,
          result.userCounts.triangles,
          result.userCounts.circles,
          result.correct ? 1 : 0
        ].join(',');
      });
      
      // Add header row
      const header = 'Timestamp,Level,Attempt,CorrectSquares,CorrectTriangles,CorrectCircles,UserSquares,UserTriangles,UserCircles,Correct';
      const csv = [header, ...csvContent].join('\n');
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `shape-counting-results-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportingCSV(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportingCSV(false);
    }
  };
  
  // Start task when component mounts
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
    setter(prev => Math.min(prev + 1, 20));
  };
  
  const handleDecrement = (setter) => {
    setter(prev => Math.max(prev - 1, 0));
  };
  
  // Calculate overall performance
  const calculatePerformance = () => {
    // Process results to only include the best attempt for each level
    const bestResults = [];
    const levelsCompleted = new Set();
    
    // First add all successful attempts
    results.filter(r => r.correct).forEach(result => {
      if (!levelsCompleted.has(result.level)) {
        bestResults.push(result);
        levelsCompleted.add(result.level);
      }
    });
    
    // Then add the last attempts for levels without successes
    results.forEach(result => {
      if (!levelsCompleted.has(result.level) && result.attempt === maxAttempts) {
        bestResults.push(result);
        levelsCompleted.add(result.level);
      }
    });
    
    const correctCount = bestResults.filter(result => result.correct).length;
    return {
      correct: correctCount,
      total: bestResults.length,
      percentage: bestResults.length > 0 ? Math.round((correctCount / bestResults.length) * 100) : 0,
      highestLevel: Math.max(...Array.from(levelsCompleted))
    };
  };
  
  // Get descriptive level name
  const getLevelName = (level) => {
    const levelConfig = levels[level - 1];
    return `Level ${level} (${levelConfig.shapes} shapes)`;
  };
  
  return (
    <div className="task-screen">
      {!taskComplete && (
        <h1>Shape Counting Task - {getLevelName(currentLevel)} - Attempt {currentAttempt}/{maxAttempts}</h1>
      )}
      
      {taskComplete && (
        <h1>Shape Counting Task - {gameOver ? 'Game Over' : 'Complete'}</h1>
      )}
      
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
                  max="20"
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
                  max="20"
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
                  max="20"
                />
                <button type="button" onClick={() => handleIncrement(setCircleCount)}>+</button>
              </div>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      )}
      
      {showFeedback && !taskComplete && (
        <div className="feedback-section">
          <h2>{getLevelName(currentLevel)} - Attempt {currentAttempt} Feedback</h2>
          
          {trialComplete && (
            <>
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
              
              <div className="trial-controls">
                <button onClick={continueTask} className="continue-button">
                  {results[results.length - 1]?.correct 
                    ? (currentLevel < levels.length ? `Continue to ${getLevelName(currentLevel + 1)}` : 'See Results') 
                    : (currentAttempt < maxAttempts ? `Try ${getLevelName(currentLevel)} Again` : 'See Results')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {taskComplete && (
        <div className="results-section">
          <h2>{gameOver ? 'Game Over' : 'Task Complete!'}</h2>
          
          {results.length > 0 && (
            <>
              <div className="performance-summary">
                <h3>Overall Performance</h3>
                <p>
                  Highest level reached: <strong>{getLevelName(calculatePerformance().highestLevel)}</strong>
                </p>
                <p>
                  Levels passed: <strong>{calculatePerformance().correct}</strong> out of <strong>{calculatePerformance().total}</strong> 
                  ({calculatePerformance().percentage}%)
                </p>
              </div>
              
              <div className="results-table-container">
                <h3>Level Details</h3>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Shapes</th>
                      <th>Best Attempt</th>
                      <th>Squares</th>
                      <th>Triangles</th>
                      <th>Circles</th>
                      <th>Passed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((levelConfig) => {
                      // Find the successful attempt for this level if it exists
                      const successfulAttempt = results.find(
                        r => r.level === levelConfig.level && r.correct
                      );
                      
                      // If no successful attempt, find the last attempt
                      const lastAttempt = results.find(
                        r => r.level === levelConfig.level && r.attempt === maxAttempts && !r.correct
                      );
                      
                      const bestAttempt = successfulAttempt || lastAttempt;
                      
                      // Only show levels that were attempted
                      if (!bestAttempt) return null;
                      
                      return (
                        <tr key={levelConfig.level} className={bestAttempt.correct ? 'correct-row' : 'incorrect-row'}>
                          <td>{levelConfig.level}</td>
                          <td>{levelConfig.shapes}</td>
                          <td>{bestAttempt.attempt}</td>
                          <td>
                            {bestAttempt.userCounts.squares}/{bestAttempt.correctCounts.squares}
                          </td>
                          <td>
                            {bestAttempt.userCounts.triangles}/{bestAttempt.correctCounts.triangles}
                          </td>
                          <td>
                            {bestAttempt.userCounts.circles}/{bestAttempt.correctCounts.circles}
                          </td>
                          <td>{bestAttempt.correct ? 'Yes' : 'No'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="export-controls">
                <button 
                  onClick={exportToCSV} 
                  className="export-button"
                  disabled={exportingCSV}
                >
                  {exportingCSV ? 'Exporting...' : 'Export Results to CSV'}
                </button>
                
                <button onClick={returnToMenu} className="menu-button">
                  Return to Tasks Menu
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {!showingShapes && !showResponse && !showFeedback && !taskComplete && (
        <div className="loading">
          Preparing shapes for {getLevelName(currentLevel)}...
        </div>
      )}
    </div>
  );
};

export default ShapeCountingMainTask; 