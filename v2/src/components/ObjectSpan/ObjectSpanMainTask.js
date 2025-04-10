import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASK_CONFIG, UTILS, EXPORT_FORMATS } from '../../config';
import './ObjectSpan.css';
import ObjectReference from './ObjectReference';

const ObjectSpanMainTask = () => {
  const { direction } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [currentState, setCurrentState] = useState('ready'); // ready, displaying, responding, feedback, complete
  const [sequence, setSequence] = useState([]);
  const [currentSpan, setCurrentSpan] = useState(TASK_CONFIG.objectSpan.minSpan);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [maxSpanReached, setMaxSpanReached] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentObject, setCurrentObject] = useState(null);
  const [results, setResults] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [counterBalance, setCounterBalance] = useState('');
  
  const responseInputRef = useRef(null);
  const isBackward = direction === 'backward';

  // Load student info from localStorage
  useEffect(() => {
    const savedStudentId = localStorage.getItem('studentId') || 'unknown';
    const savedCounterBalance = localStorage.getItem('counterBalance') || 'unknown';
    
    setStudentId(savedStudentId);
    setCounterBalance(savedCounterBalance);
  }, []);

  // Generate a sequence
  const generateSequence = () => {
    const newSequence = [];
    for (let i = 0; i < currentSpan; i++) {
      // Random object from 1-9
      const randomObjectId = Math.floor(Math.random() * 9) + 1;
      newSequence.push(randomObjectId);
    }
    return newSequence;
  };

  // Start displaying sequence
  const startSequence = () => {
    setCurrentState('displaying');
    setCurrentIndex(0);
    const newSequence = generateSequence();
    setSequence(newSequence);
    setCurrentObject(TASK_CONFIG.objectSpan.objectMapping[newSequence[0]]);
    
    // Schedule display of objects
    displayObjects(newSequence);
  };
  
  // Display objects one by one
  const displayObjects = (objectSequence) => {
    let index = 0;
    
    const displayNext = () => {
      if (index < objectSequence.length) {
        // Set the current object
        setCurrentIndex(index);
        setCurrentObject(TASK_CONFIG.objectSpan.objectMapping[objectSequence[index]]);
        
        // Schedule next object
        index++;
        setTimeout(() => {
          // Hide current object (blank period)
          setCurrentObject(null);
          
          // Schedule next object or end sequence
          setTimeout(() => {
            if (index < objectSequence.length) {
              displayNext();
            } else {
              // End of sequence, show response input
              setCurrentState('responding');
              setTimeout(() => {
                if (responseInputRef.current) {
                  responseInputRef.current.focus();
                }
              }, 100);
            }
          }, TASK_CONFIG.objectSpan.blankTime);
        }, TASK_CONFIG.objectSpan.displayTime);
      }
    };
    
    displayNext();
  };
  
  // Handle response submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalize response (trim whitespace, lowercase)
    const normalizedResponse = userResponse.trim().toLowerCase();
    
    // Don't proceed if response is empty
    if (normalizedResponse === '') {
      return;
    }
    
    // Get expected sequence of object names
    let expectedSequence = sequence.map(index => 
      TASK_CONFIG.objectSpan.objectMapping[index].name
    );
    
    // If in backward mode, reverse the expected sequence
    if (isBackward) {
      expectedSequence = expectedSequence.reverse();
    }
    
    // Join the sequence into a string
    const expectedString = expectedSequence.join(' ');
    
    // More flexible comparison:
    // 1. Normalize both strings by removing extra spaces
    // 2. Compare the normalized strings
    const normalizedExpected = expectedString.replace(/\s+/g, ' ').trim();
    const normalizedUserResponse = normalizedResponse.replace(/\s+/g, ' ').trim();
    
    let responseIsCorrect = false;
    
    // First try exact match
    if (normalizedUserResponse === normalizedExpected) {
      responseIsCorrect = true;
    } 
    // Then try checking if all the object names are present in the right order
    else {
      const expectedObjects = normalizedExpected.split(' ');
      const responseObjects = normalizedUserResponse.split(' ');
      
      // Only consider it correct if the number of objects matches
      if (expectedObjects.length === responseObjects.length) {
        responseIsCorrect = true;
        // Check each object
        for (let i = 0; i < expectedObjects.length; i++) {
          if (expectedObjects[i] !== responseObjects[i]) {
            responseIsCorrect = false;
            break;
          }
        }
      }
    }
    
    // Store the result
    const newResult = {
      participant_id: studentId,
      counter_balance: counterBalance,
      task_type: 'object_span',
      span_mode: isBackward ? 'backward' : 'forward',
      trial_number: currentRound,
      timestamp: new Date().toISOString(),
      span_length: currentSpan,
      attempt_number: currentAttempt,
      is_correct: responseIsCorrect,
      max_span_reached: maxSpanReached
    };
    
    setResults([...results, newResult]);
    
    // Store the response and correctness
    setLastResponse(normalizedResponse);
    setIsCorrect(responseIsCorrect);
    
    // Clear the input field
    setUserResponse('');
    
    // Handle result based on correctness
    handleTaskResponse(responseIsCorrect);
  };
  
  // Handle task response based on correctness
  const handleTaskResponse = (responseIsCorrect) => {
    if (responseIsCorrect) {
      // If this was the first attempt at this span length
      if (currentAttempt === 1) {
        // Move to next span length
        const newSpan = currentSpan + 1;
        setCurrentSpan(newSpan);
        setCurrentAttempt(1);
        setMaxSpanReached(Math.max(maxSpanReached, currentSpan));
        
        // Check if we've reached the maximum span
        if (newSpan > TASK_CONFIG.objectSpan.maxSpan) {
          // Reached maximum span, end task
          setCurrentState('complete');
          return;
        }
        
        // Check if we've completed all rounds
        const newRound = currentRound + 1;
        setCurrentRound(newRound);
        if (newRound > TASK_CONFIG.objectSpan.mainTaskRounds) {
          // Completed all rounds, end task
          setCurrentState('complete');
          return;
        } else {
          // Continue with next span length
          startSequence();
        }
      } else {
        // Second successful attempt, move to next span
        const newSpan = currentSpan + 1;
        setCurrentSpan(newSpan);
        setCurrentAttempt(1);
        setMaxSpanReached(Math.max(maxSpanReached, currentSpan));
        
        // Check if we've reached the maximum span
        if (newSpan > TASK_CONFIG.objectSpan.maxSpan) {
          // Reached maximum span, end task
          setCurrentState('complete');
          return;
        }
        
        // Check if we've completed all rounds
        const newRound = currentRound + 1;
        setCurrentRound(newRound);
        if (newRound > TASK_CONFIG.objectSpan.mainTaskRounds) {
          // Completed all rounds, end task
          setCurrentState('complete');
          return;
        } else {
          // Continue with next span length
          startSequence();
        }
      }
    } else {
      // If this was the first attempt and we haven't exceeded rounds
      if (currentAttempt === 1 && currentRound <= TASK_CONFIG.objectSpan.mainTaskRounds) {
        // Give second attempt at same span length
        setCurrentAttempt(2);
        startSequence();
      } else {
        // Failed both attempts or exceeded rounds, end task
        setCurrentState('complete');
        return;
      }
    }
  };
  
  // Export results as CSV
  const exportResultsAsCSV = () => {
    // Add total_correct_sequences to the last result
    const correctSequences = results.filter(r => r.is_correct).length;
    const finalResults = results.map(result => ({
      ...result,
      total_correct_sequences: correctSequences
    }));
    
    // Generate CSV content
    const csvContent = UTILS.objectToCSV(
      EXPORT_FORMATS.objectSpan.csv.headers,
      finalResults
    );
    
    // Generate filename
    const timestamp = UTILS.formatTimestamp();
    const filename = EXPORT_FORMATS.objectSpan.csv.filename(
      `object_span_${isBackward ? 'backward' : 'forward'}`,
      studentId,
      timestamp
    );
    
    // Download CSV
    UTILS.downloadCSV(csvContent, filename);
  };
  
  // Start sequence when component mounts
  useEffect(() => {
    startSequence();
  }, []);

  // Navigation handlers
  const handleBackToTasks = () => {
    navigate('/object-span');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  // Start the main task
  const startMainTask = () => {
    navigate(`/object-span/${direction}/task`);
  };

  return (
    <div className="task-screen">
      <h1>{isBackward ? 'Backward' : 'Forward'} Object Span Task</h1>

      {currentState === 'displaying' && (
        <div className="object-display-container">
          <p className="sequence-instruction">
            Remember these objects in {isBackward ? 'REVERSE' : 'the SAME'} order
          </p>
          <div className="object-display">
            {currentObject && (
              <img 
                src={currentObject.image} 
                alt={currentObject.name} 
                className="object-image"
              />
            )}
          </div>
          <p className="sequence-progress">
            Object {currentIndex + 1} of {sequence.length}
          </p>
          <p className="task-progress">
            Round {currentRound}/{TASK_CONFIG.objectSpan.mainTaskRounds} | 
            Span {currentSpan} | 
            Attempt {currentAttempt}
          </p>
        </div>
      )}

      {currentState === 'responding' && (
        <div className="response-container">
          <p className="response-instruction">
            Type the objects you saw in <strong>{isBackward ? 'REVERSE' : 'the SAME'}</strong> order:
          </p>
          <form onSubmit={handleSubmit} className="response-form">
            <input
              type="text"
              ref={responseInputRef}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="e.g. car bread book"
              className="response-input"
              autoComplete="off"
              spellCheck="false"
            />
            <button type="submit" className="submit-button">Submit Answer</button>
          </form>
          <p className="hint">Separate object names with spaces. Names are not case-sensitive.</p>
          <div className="task-metadata-inline">
            <p>Round {currentRound}/{TASK_CONFIG.objectSpan.mainTaskRounds} • 
            Span {currentSpan} • 
            Attempt {currentAttempt}</p>
          </div>
          
          {/* Object Reference Guide */}
          <ObjectReference />
        </div>
      )}

      {currentState === 'complete' && (
        <div className="results-container">
          <h2>Task Complete</h2>
          
          <div className="results-summary">
            <p>Maximum span reached: <strong>{maxSpanReached}</strong></p>
            <p>Rounds completed: <strong>{currentRound - 1}/{TASK_CONFIG.objectSpan.mainTaskRounds}</strong></p>
            <p>Total correct sequences: <strong>{results.filter(r => r.is_correct).length}</strong></p>
            <p>Final Score: <strong>{maxSpanReached}</strong></p>
          </div>
          
          <button onClick={exportResultsAsCSV} className="export-button">
            Export Results as CSV
          </button>
          
          <div className="nav-buttons">
            <button onClick={handleBackToTasks} className="back-button">
              Back to Object Span Tasks
            </button>
            <button onClick={handleReturnHome} className="home-button">
              Return to Home
            </button>
          </div>
        </div>
      )}
      
      {currentState !== 'complete' && (
        <div className="task-metadata">
          <p>Participant ID: {studentId}</p>
          <p>Mode: {isBackward ? 'Backward' : 'Forward'}</p>
        </div>
      )}
    </div>
  );
};

export default ObjectSpanMainTask; 