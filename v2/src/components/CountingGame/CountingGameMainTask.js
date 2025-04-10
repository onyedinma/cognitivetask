import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountingGame.css';

// Import images
import dollarBillImage from '../../assets/images/counting/5dollar.jpg';
import busImage from '../../assets/images/counting/bus.jpg';
import faceImage from '../../assets/images/counting/face.jpg';

/**
 * CountingGameMainTask component
 * Main task component for the counting game
 */
const CountingGameMainTask = () => {
  const navigate = useNavigate();
  
  // States for managing objects and counts
  const [currentObject, setCurrentObject] = useState(null);
  const [showingObjects, setShowingObjects] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [billCount, setBillCount] = useState(0);
  const [busCount, setBusCount] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [correctCounts, setCorrectCounts] = useState({ bills: 0, buses: 0, faces: 0 });
  const [currentTrial, setCurrentTrial] = useState(1);
  const [results, setResults] = useState([]);
  const [trialComplete, setTrialComplete] = useState(false);
  const [taskComplete, setTaskComplete] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  // Total number of trials for the main task
  const totalTrials = 5;
  
  // Objects for the task
  const objects = ['bill', 'bus', 'face'];
  
  // Object image mapping
  const objectImages = {
    bill: dollarBillImage,
    bus: busImage,
    face: faceImage
  };
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Generate a sequence of random objects
  const generateSequence = () => {
    const difficultyFactor = Math.min(currentTrial, 3); // Increases up to level 3
    const baseObjectCount = 5 + difficultyFactor;
    const sequenceLength = baseObjectCount + Math.floor(Math.random() * 3); // Length increases with trials
    
    const sequence = [];
    const counts = { bills: 0, buses: 0, faces: 0 };
    
    for (let i = 0; i < sequenceLength; i++) {
      const objectIndex = Math.floor(Math.random() * objects.length);
      const object = objects[objectIndex];
      sequence.push(object);
      
      // Count each object
      if (object === 'bill') counts.bills++;
      else if (object === 'bus') counts.buses++;
      else if (object === 'face') counts.faces++;
    }
    
    return { sequence, counts };
  };
  
  // Start showing the objects
  const startSequence = () => {
    // Clear any existing timers
    clearAllTimers();
    
    // Reset state
    setCurrentObject(null);
    setShowingObjects(true);
    setShowResponse(false);
    setShowFeedback(false);
    setTrialComplete(false);
    
    // Reset counts for new trial
    setBillCount(0);
    setBusCount(0);
    setFaceCount(0);
    
    // Generate sequence for trial
    const { sequence, counts } = generateSequence();
    console.log(`Trial ${currentTrial} - Generated sequence:`, sequence);
    console.log(`Trial ${currentTrial} - Correct counts:`, counts);
    
    // Store correct counts for scoring
    setCorrectCounts(counts);
    
    // Display objects one by one
    sequence.forEach((object, index) => {
      // Show object
      const showTimer = setTimeout(() => {
        console.log(`Showing object: ${object}`);
        setCurrentObject(object);
      }, index * 1500); // Show each object for 1.5 seconds
      
      timersRef.current.push(showTimer);
      
      // Hide object (except for the last one)
      if (index < sequence.length - 1) {
        const hideTimer = setTimeout(() => {
          setCurrentObject(null);
        }, (index * 1500) + 1000); // Show for 1 second, blank for 0.5 seconds
        
        timersRef.current.push(hideTimer);
      }
    });
    
    // Show response form after all objects
    const responseTimer = setTimeout(() => {
      setShowingObjects(false);
      setCurrentObject(null);
      setShowResponse(true);
    }, sequence.length * 1500);
    
    timersRef.current.push(responseTimer);
  };
  
  // Check user's response and record result
  const checkResponse = () => {
    const userCounts = {
      bills: billCount,
      buses: busCount,
      faces: faceCount
    };
    
    const isCorrect = 
      billCount === correctCounts.bills && 
      busCount === correctCounts.buses && 
      faceCount === correctCounts.faces;
    
    // Record result for this trial
    const trialResult = {
      trial: currentTrial,
      correctCounts: { ...correctCounts },
      userCounts: { ...userCounts },
      correct: isCorrect,
      timestamp: new Date().toISOString()
    };
    
    setResults(prevResults => [...prevResults, trialResult]);
    setTrialComplete(true);
    
    // Check if task is complete
    if (currentTrial >= totalTrials) {
      setTaskComplete(true);
    }
    
    setShowResponse(false);
    setShowFeedback(true);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // Continue to next trial or finish task
  const continueTask = () => {
    if (currentTrial < totalTrials) {
      setCurrentTrial(prev => prev + 1);
      setShowFeedback(false);
      startSequence();
    } else {
      setTaskComplete(true);
    }
  };
  
  // Navigate back to tasks menu
  const returnToMenu = () => {
    navigate('/');
  };
  
  // Export results to CSV
  const exportToCSV = () => {
    setExportingCSV(true);
    
    try {
      // Format results for CSV
      const csvContent = results.map(result => {
        return [
          result.timestamp,
          result.trial,
          result.correctCounts.bills,
          result.correctCounts.buses,
          result.correctCounts.faces,
          result.userCounts.bills,
          result.userCounts.buses,
          result.userCounts.faces,
          result.correct ? 1 : 0
        ].join(',');
      });
      
      // Add header row
      const header = 'Timestamp,Trial,CorrectBills,CorrectBuses,CorrectFaces,UserBills,UserBuses,UserFaces,Correct';
      const csv = [header, ...csvContent].join('\n');
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `counting-game-results-${new Date().toISOString().slice(0,10)}.csv`);
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
    setter(prev => Math.min(prev + 1, 9));
  };
  
  const handleDecrement = (setter) => {
    setter(prev => Math.max(prev - 1, 0));
  };
  
  // Calculate overall performance
  const calculatePerformance = () => {
    const correctCount = results.filter(result => result.correct).length;
    return {
      correct: correctCount,
      total: results.length,
      percentage: Math.round((correctCount / results.length) * 100)
    };
  };
  
  return (
    <div className="task-screen">
      {!taskComplete && (
        <h1>Counting Game - Trial {currentTrial} of {totalTrials}</h1>
      )}
      
      {taskComplete && (
        <h1>Counting Game - Complete</h1>
      )}
      
      {showingObjects && (
        <div className="object-display">
          {currentObject === 'bill' && 
            <div 
              className="counting-object dollar-bill" 
              style={{ backgroundImage: `url(${objectImages.bill})` }}
            ></div>
          }
          {currentObject === 'bus' && 
            <div 
              className="counting-object bus" 
              style={{ backgroundImage: `url(${objectImages.bus})` }}
            ></div>
          }
          {currentObject === 'face' && 
            <div 
              className="counting-object face" 
              style={{ backgroundImage: `url(${objectImages.face})` }}
            ></div>
          }
        </div>
      )}
      
      {showResponse && (
        <div className="response-section">
          <h2>How many of each object did you count?</h2>
          
          <form onSubmit={handleSubmit} className="counting-form">
            <div className="count-input-group">
              <label>$5 Bills:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setBillCount)}>-</button>
                <input 
                  type="number" 
                  value={billCount} 
                  onChange={(e) => setBillCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="9"
                />
                <button type="button" onClick={() => handleIncrement(setBillCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>UTA Buses:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setBusCount)}>-</button>
                <input 
                  type="number" 
                  value={busCount} 
                  onChange={(e) => setBusCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="9"
                />
                <button type="button" onClick={() => handleIncrement(setBusCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>Faces:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setFaceCount)}>-</button>
                <input 
                  type="number" 
                  value={faceCount} 
                  onChange={(e) => setFaceCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="9"
                />
                <button type="button" onClick={() => handleIncrement(setFaceCount)}>+</button>
              </div>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      )}
      
      {showFeedback && !taskComplete && (
        <div className="feedback-section">
          <h2>Trial {currentTrial} Feedback</h2>
          
          {trialComplete && (
            <>
              <div className="counts-comparison">
                <div className="correct-counts">
                  <h3>Correct Counts:</h3>
                  <p>$5 Bills: <span className="important">{correctCounts.bills}</span></p>
                  <p>UTA Buses: <span className="important">{correctCounts.buses}</span></p>
                  <p>Faces: <span className="important">{correctCounts.faces}</span></p>
                </div>
                
                <div className="user-counts">
                  <h3>Your Counts:</h3>
                  <p>$5 Bills: <span className={billCount === correctCounts.bills ? 'correct' : 'incorrect'}>{billCount}</span></p>
                  <p>UTA Buses: <span className={busCount === correctCounts.buses ? 'correct' : 'incorrect'}>{busCount}</span></p>
                  <p>Faces: <span className={faceCount === correctCounts.faces ? 'correct' : 'incorrect'}>{faceCount}</span></p>
                </div>
              </div>
              
              <div className="trial-controls">
                <button onClick={continueTask} className="continue-button">
                  {currentTrial < totalTrials ? 'Continue to Next Trial' : 'See Results'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {taskComplete && (
        <div className="results-section">
          <h2>Task Results</h2>
          
          {results.length > 0 && (
            <>
              <div className="performance-summary">
                <h3>Overall Performance</h3>
                <p>
                  You correctly counted all objects in {calculatePerformance().correct} out of {calculatePerformance().total} trials 
                  ({calculatePerformance().percentage}%)
                </p>
              </div>
              
              <div className="results-table-container">
                <h3>Trial Details</h3>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Trial</th>
                      <th>$5 Bills</th>
                      <th>UTA Buses</th>
                      <th>Faces</th>
                      <th>Correct</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className={result.correct ? 'correct-row' : 'incorrect-row'}>
                        <td>{result.trial}</td>
                        <td>
                          {result.userCounts.bills}/{result.correctCounts.bills}
                        </td>
                        <td>
                          {result.userCounts.buses}/{result.correctCounts.buses}
                        </td>
                        <td>
                          {result.userCounts.faces}/{result.correctCounts.faces}
                        </td>
                        <td>{result.correct ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
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
      
      {!showingObjects && !showResponse && !showFeedback && !taskComplete && (
        <div className="loading">
          Preparing objects...
        </div>
      )}
    </div>
  );
};

export default CountingGameMainTask; 