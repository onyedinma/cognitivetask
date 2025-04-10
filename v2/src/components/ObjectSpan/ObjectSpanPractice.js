import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASK_CONFIG } from '../../config';
import './ObjectSpan.css';
import ObjectReference from './ObjectReference';

const ObjectSpanPractice = () => {
  const { direction } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [currentState, setCurrentState] = useState('ready'); // ready, displaying, responding, feedback
  const [sequence, setSequence] = useState([]);
  const [currentSpan, setCurrentSpan] = useState(TASK_CONFIG.objectSpan.minSpan);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentObject, setCurrentObject] = useState(null);
  
  const responseInputRef = useRef(null);
  const isBackward = direction === 'backward';

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
    setPracticeAttempts(prev => prev + 1);
    
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
    
    // Store the response and correctness
    setLastResponse(normalizedResponse);
    setIsCorrect(responseIsCorrect);
    setCurrentState('feedback');
    
    // Clear the input field
    setUserResponse('');
  };
  
  // Start next practice round
  const startNextPractice = () => {
    setCurrentState('ready');
    startSequence();
  };
  
  // Start the main task
  const startMainTask = () => {
    navigate(`/object-span/${direction}/task`);
  };
  
  // Start sequence when component mounts
  useEffect(() => {
    startSequence();
  }, []);

  // Handle back button click
  const handleBackClick = () => {
    // Navigate programmatically to the instruction page for this direction
    navigate(`/object-span/${direction}`);
  };

  return (
    <div className="task-screen">
      <h1>{isBackward ? 'Backward' : 'Forward'} Object Span Practice</h1>

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
          
          {/* Object Reference Guide */}
          <ObjectReference />
        </div>
      )}

      {currentState === 'feedback' && (
        <div className="feedback-container">
          <h2 className={isCorrect ? 'feedback-correct' : 'feedback-incorrect'}>
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </h2>
          <div className="response-details">
            <p>Your response: <span className="user-response">{lastResponse}</span></p>
            <p>
              Expected response: <span className="expected-response">
                {isBackward 
                  ? sequence.map(index => TASK_CONFIG.objectSpan.objectMapping[index].name).reverse().join(' ')
                  : sequence.map(index => TASK_CONFIG.objectSpan.objectMapping[index].name).join(' ')
                }
              </span>
            </p>
          </div>
          <p className="practice-count">
            You've completed {practiceAttempts} practice {practiceAttempts === 1 ? 'attempt' : 'attempts'}.
          </p>
          <div className="practice-buttons">
            <button onClick={startNextPractice} className="practice-button">
              Practice Again
            </button>
            {practiceAttempts >= 2 && (
              <button onClick={startMainTask} className="main-task-button">
                Start Main Task
              </button>
            )}
          </div>
          
          {/* Object Reference Guide */}
          <ObjectReference />
        </div>
      )}

      <button onClick={handleBackClick} className="back-button">
        Back to Instructions
      </button>
    </div>
  );
};

export default ObjectSpanPractice; 