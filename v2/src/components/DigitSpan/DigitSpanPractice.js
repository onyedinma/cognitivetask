import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASK_CONFIG } from '../../config';
import './DigitSpan.css';

/**
 * DigitSpanPractice component - Practice trials for both forward and backward digit span
 */
const DigitSpanPractice = () => {
  const { direction } = useParams();
  const navigate = useNavigate();
  
  const [currentDigit, setCurrentDigit] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [result, setResult] = useState({ correct: false, feedback: '' });
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  const [currentSpan, setCurrentSpan] = useState(TASK_CONFIG.digitSpan.minSpan);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  const isBackward = direction === 'backward';
  const title = isBackward ? 'Backward Digit Span Practice' : 'Forward Digit Span Practice';
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Generate a random digit sequence for practice
  const generateSequence = () => {
    const length = currentSpan; // Use current span length
    const newSequence = [];
    
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * 9) + 1); // Digits 1-9
    }
    
    return newSequence;
  };
  
  // Start showing the sequence with improved timing
  const startSequence = () => {
    // Clear any existing timers
    clearAllTimers();
    
    const newSequence = generateSequence();
    console.log('Generated sequence:', newSequence.join(', '));
    
    setSequence(newSequence);
    setShowingSequence(true);
    
    // Empty display before starting sequence
    setCurrentDigit(null);
    
    // Use individual timeouts for each digit instead of intervals for better reliability
    newSequence.forEach((digit, index) => {
      // Timer for showing each digit
      const showTimer = setTimeout(() => {
        console.log(`Showing digit ${digit} at index ${index}`);
        setCurrentDigit(digit);
        setCurrentIndex(index);
      }, index * (TASK_CONFIG.digitSpan.displayTime + TASK_CONFIG.digitSpan.blankTime));
      
      timersRef.current.push(showTimer);
      
      // Timer for clearing each digit (except the last one, which is handled separately)
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
  
  // Check user's response
  const checkResponse = () => {
    let expectedResponse = '';
    
    if (isBackward) {
      expectedResponse = [...sequence].reverse().join('');
    } else {
      expectedResponse = sequence.join('');
    }
    
    const isCorrect = userResponse === expectedResponse;
    const feedback = isCorrect
      ? 'Correct! Great job remembering the sequence.'
      : 'Incorrect. Please try again with the next sequence.';
    
    setResult({
      correct: isCorrect,
      feedback,
      userResponse,
      expectedResponse
    });
    
    setShowResponse(false);
    setShowFeedback(true);
    setPracticeAttempts(prevAttempts => prevAttempts + 1);
    
    // If correct, increase the span for the next trial
    if (isCorrect && currentSpan < TASK_CONFIG.digitSpan.maxSpan) {
      setCurrentSpan(prevSpan => prevSpan + 1);
    }
  };
  
  // Continue practice or move to main task
  const continuePractice = () => {
    setUserResponse('');
    setShowFeedback(false);
    startSequence();
  };
  
  const goToMainTask = () => {
    navigate(`/digit-span/${direction}/task`);
  };
  
  // Start the practice when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startSequence();
    }, 1000);
    
    timersRef.current.push(timer);
    
    return () => {
      clearAllTimers();
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // Handle back button
  const handleBackClick = () => {
    navigate(`/digit-span/${direction}`);
  };
  
  return (
    <div className="task-screen">
      <h1>{title}</h1>
      
      {showingSequence && (
        <div className="digit-display">
          <div className={`digit ${currentDigit ? 'visible' : 'hidden'}`}>
            {currentDigit}
          </div>
        </div>
      )}
      
      {showResponse && (
        <div className="response-section">
          <h2>Please type the digits in the {isBackward ? 'reverse' : 'same'} order</h2>
          <p>Do not leave spaces between the numbers.</p>
          <p>Current span: {currentSpan}</p>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="response-input"
              autoFocus
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder={isBackward ? "Enter reverse order..." : "Enter same order..."}
            />
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
          
          <div className="result-details">
            <p>Your response: <span className="user-response">{result.userResponse}</span></p>
            <p>Expected response: <span className="expected-response">{result.expectedResponse}</span></p>
            <p>Span level: <span className="span-level">{currentSpan}</span></p>
            <p className="recall-reminder">
              <strong>Remember:</strong> Type the digits in the
              <span className="mode-text"> {isBackward ? 'REVERSE' : 'SAME'} </span>
              order as shown
            </p>
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
      
      {!showingSequence && !showResponse && !showFeedback && (
        <div className="loading">
          Loading practice trial...
        </div>
      )}
      
      <button onClick={handleBackClick} className="back-button">
        Back to Instructions
      </button>
    </div>
  );
};

export default DigitSpanPractice; 