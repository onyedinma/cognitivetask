import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASK_CONFIG } from '../../config';
import './DigitSpan.css';

/**
 * DigitSpanMainTask component - Main task for both forward and backward digit span
 */
const DigitSpanMainTask = () => {
  const { direction } = useParams();
  const navigate = useNavigate();
  
  const [currentDigit, setCurrentDigit] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [currentSpan, setCurrentSpan] = useState(TASK_CONFIG.digitSpan.minSpan);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [results, setResults] = useState([]);
  const [taskComplete, setTaskComplete] = useState(false);
  const [maxSpanReached, setMaxSpanReached] = useState(0);
  const [exportingCSV, setExportingCSV] = useState(false);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  const isBackward = direction === 'backward';
  const title = isBackward ? 'Backward Digit Span Task' : 'Forward Digit Span Task';
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Start showing the digit sequence with improved timing
  const startSequence = () => {
    // Simply call startNextSequence with the current span level
    startNextSequence(currentSpan);
  };
  
  // Check user's response
  const checkResponse = () => {
    let expectedResponse = '';
    
    if (isBackward) {
      expectedResponse = [...sequence].reverse().join('');
    } else {
      expectedResponse = sequence.join('');
    }
    
    const isCorrect = userResponse === expectedResponse;
    console.log(`Response: ${userResponse}, Expected: ${expectedResponse}, Correct: ${isCorrect}`);
    
    const newSpan = isCorrect && currentSpan < TASK_CONFIG.digitSpan.maxSpan 
      ? currentSpan + 1 
      : currentSpan;
      
    const newAttempt = isCorrect 
      ? 1 
      : currentAttempt === 1 
        ? 2 
        : currentAttempt;
        
    const isTaskComplete = 
      (isCorrect && currentSpan >= TASK_CONFIG.digitSpan.maxSpan) || 
      (!isCorrect && currentAttempt === 2);
    
    // Record result before changing state
    const result = {
      span: currentSpan,
      attempt: currentAttempt,
      isCorrect,
      isBackward,
      sequence: [...sequence],
      userResponse: userResponse,
      expectedResponse: isBackward ? [...sequence].reverse().join('') : sequence.join(''),
      timestamp: new Date().toISOString()
    };
    
    // Update max span if needed
    const newMaxSpan = isCorrect && currentSpan > maxSpanReached 
      ? currentSpan 
      : maxSpanReached;
    
    // Update all states at once to ensure consistency
    setUserResponse('');
    setShowResponse(false);
    setResults(prev => [...prev, result]);
    setMaxSpanReached(newMaxSpan);
    setCurrentSpan(newSpan);
    setCurrentAttempt(newAttempt);
    setTaskComplete(isTaskComplete);
    
    // If the task is not complete, start the next sequence with the updated span
    if (!isTaskComplete) {
      // Add a slight delay before starting the next sequence
      const nextTimer = setTimeout(() => {
        console.log("Starting next sequence with span:", newSpan, "attempt:", newAttempt);
        startNextSequence(newSpan);
      }, 1500);
      timersRef.current.push(nextTimer);
    }
  };
  
  // Function to start a sequence with a specific span
  const startNextSequence = (spanToUse) => {
    // Clear any existing timers
    clearAllTimers();
    
    // Generate sequence using the provided span
    const newSequence = [];
    for (let i = 0; i < spanToUse; i++) {
      newSequence.push(Math.floor(Math.random() * 9) + 1); // Digits 1-9
    }
    
    console.log(`Starting next sequence for span ${spanToUse}:`, newSequence.join(', '));
    console.log(`Sequence length: ${newSequence.length}, specified span: ${spanToUse}`);
    
    setSequence(newSequence);
    setShowingSequence(true);
    
    // Empty display before starting sequence
    setCurrentDigit(null);
    
    // Use individual timeouts for each digit
    newSequence.forEach((digit, index) => {
      // Timer for showing each digit
      const showTimer = setTimeout(() => {
        console.log(`Showing digit ${digit} at index ${index}`);
        setCurrentDigit(digit);
      }, index * (TASK_CONFIG.digitSpan.displayTime + TASK_CONFIG.digitSpan.blankTime));
      
      timersRef.current.push(showTimer);
      
      // Timer for clearing each digit (except the last one)
      if (index < newSequence.length - 1) {
        const hideTimer = setTimeout(() => {
          console.log(`Hiding digit ${digit}`);
          setCurrentDigit(null);
        }, index * (TASK_CONFIG.digitSpan.displayTime + TASK_CONFIG.digitSpan.blankTime) + TASK_CONFIG.digitSpan.displayTime);
        
        timersRef.current.push(hideTimer);
      }
    });
    
    // Timer for ending the sequence and showing response
    const endTimer = setTimeout(() => {
      console.log('Sequence ended, showing response form');
      setShowingSequence(false);
      setCurrentDigit(null);
      setShowResponse(true);
    }, newSequence.length * (TASK_CONFIG.digitSpan.displayTime + TASK_CONFIG.digitSpan.blankTime));
    
    timersRef.current.push(endTimer);
  };
  
  // Convert results to CSV format
  const convertToCSV = (data) => {
    // Define CSV header
    const headers = [
      'Timestamp',
      'Direction',
      'Span Length',
      'Attempt',
      'Sequence',
      'Expected Response',
      'User Response',
      'Correct'
    ];
    
    // Create CSV header row
    let csv = headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
      const row = [
        item.timestamp,
        isBackward ? 'Backward' : 'Forward',
        item.span,
        item.attempt,
        item.sequence.join(''),
        item.expectedResponse,
        item.userResponse,
        item.isCorrect ? 'Yes' : 'No'
      ];
      
      // Escape any commas in the data
      const escapedRow = row.map(field => {
        // If the field contains a comma, quote, or newline, wrap it in quotes
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          // Double up any quotes to escape them
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      });
      
      csv += escapedRow.join(',') + '\n';
    });
    
    return csv;
  };
  
  // Handle CSV export
  const exportAsCSV = () => {
    setExportingCSV(true);
    
    try {
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
      const fileName = `digit-span-${isBackward ? 'backward' : 'forward'}-${studentId}-${timestamp}.csv`;
      
      // Convert results to CSV
      const csv = convertToCSV(results);
      
      // Create a blob with the CSV data
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Set link properties
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      // Add link to document, click it, then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportingCSV(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('There was an error exporting the results. Please try again.');
      setExportingCSV(false);
    }
  };
  
  // Start the task when the component mounts
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
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // Handle task completion
  const handleTaskComplete = () => {
    // Store results in localStorage
    const storedResults = JSON.parse(localStorage.getItem('digitSpanResults') || '[]');
    const updatedResults = [...storedResults, {
      timestamp: new Date().toISOString(),
      direction: isBackward ? 'backward' : 'forward',
      maxSpan: maxSpanReached,
      results
    }];
    
    localStorage.setItem('digitSpanResults', JSON.stringify(updatedResults));
    
    // Navigate back to the main tasks screen
    navigate('/');
  };
  
  return (
    <div className="task-screen">
      {!taskComplete ? (
        <>
          <h1>{title} - Span {currentSpan} (Attempt {currentAttempt}/2)</h1>
          
          {showingSequence && (
            <div className="digit-display">
              <div className="span-indicator">Current Span: {currentSpan}</div>
              <div className={`digit ${currentDigit ? 'visible' : 'hidden'}`}>
                {currentDigit}
              </div>
            </div>
          )}
          
          {showResponse && (
            <div className="response-section">
              <h2>Please type the digits in the {isBackward ? 'reverse' : 'same'} order</h2>
              <p>Do not leave spaces between the numbers.</p>
              
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="response-input"
                  autoFocus
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder={isBackward ? "Enter in reverse order..." : "Enter in same order..."}
                />
                <button type="submit" className="submit-button">Submit</button>
              </form>
            </div>
          )}
          
          {!showingSequence && !showResponse && (
            <div className="loading">
              Preparing next sequence...
            </div>
          )}
        </>
      ) : (
        <div className="completion-screen">
          <h1>Task Complete</h1>
          
          <div className="results-summary">
            <p>Maximum span reached: <span className="max-span">{maxSpanReached}</span> (Final Score)</p>
            <p>Total correct sequences: <span className="correct-sequences">
              {results.filter(r => r.isCorrect).length}
            </span> of {results.length}</p>
          </div>
          
          <div className="results-detail">
            <h2>Performance by Span Length</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Span</th>
                  <th>Attempt 1</th>
                  <th>Attempt 2</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxSpanReached - TASK_CONFIG.digitSpan.minSpan + 1 }, (_, i) => 
                  TASK_CONFIG.digitSpan.minSpan + i
                ).map(span => {
                  const attempt1 = results.find(r => r.span === span && r.attempt === 1);
                  const attempt2 = results.find(r => r.span === span && r.attempt === 2);
                  
                  return (
                    <tr key={span}>
                      <td>{span}</td>
                      <td className={attempt1?.isCorrect ? 'correct' : 'incorrect'}>
                        {attempt1 ? (attempt1.isCorrect ? '✓' : '✗') : '-'}
                      </td>
                      <td className={attempt2?.isCorrect ? 'correct' : 'incorrect'}>
                        {attempt2 ? (attempt2.isCorrect ? '✓' : '✗') : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="result-actions">
            <button 
              onClick={exportAsCSV} 
              className="export-button"
              disabled={exportingCSV}
            >
              {exportingCSV ? 'Exporting...' : 'Export Results to CSV'}
            </button>
            
            <button onClick={handleTaskComplete} className="finish-button">
              Complete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitSpanMainTask; 