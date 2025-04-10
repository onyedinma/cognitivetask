import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeductiveReasoning.css';

/**
 * DeductiveReasoningPractice component
 * Practice component for the deductive reasoning task (Wason Selection Task)
 */
const DeductiveReasoningPractice = () => {
  const navigate = useNavigate();
  
  // Define practice puzzle (Wason Selection Task)
  const practicePuzzle = {
    question: "If a card has a circle on one side, then it has the color yellow on the other side.",
    cards: [
      { front: "yellow", back: "square", type: "color", cardType: "color-card yellow" },
      { front: "red", back: "circle", type: "color", cardType: "color-card red" },
      { front: "square", back: "red", type: "shape", cardType: "shape-card" },
      { front: "circle", back: "yellow", type: "shape", cardType: "shape-card" }
    ],
    correctCards: [3, 1],  // Circle and Red (0-indexed)
    explanation: "You need to check the circle card (to see if it has yellow on the other side) and the red card (to make sure it doesn't have a circle on the other side)."
  };

  // Component state
  const [selectedCards, setSelectedCards] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [practiceResult, setPracticeResult] = useState({ isCorrect: false, message: '', explanation: '' });

  // Toggle card selection
  const toggleCardSelection = (cardIndex) => {
    setSelectedCards(prevSelected => {
      const isSelected = prevSelected.includes(cardIndex);
      
      if (isSelected) {
        // Remove from selected cards if already selected
        return prevSelected.filter(idx => idx !== cardIndex);
      } else {
        // Add to selected cards if not already selected
        return [...prevSelected, cardIndex];
      }
    });
  };

  // Check if selected cards match correct cards
  const checkCorrectCards = (correctCards) => {
    if (selectedCards.length !== 2) return false;
    
    // Sort both arrays for comparison
    const selectedSorted = [...selectedCards].sort((a, b) => a - b);
    const correctSorted = [...correctCards].sort((a, b) => a - b);
    
    return selectedSorted[0] === correctSorted[0] && selectedSorted[1] === correctSorted[1];
  };

  // Evaluate practice response
  const evaluatePracticeResponse = () => {
    const isCorrect = checkCorrectCards(practicePuzzle.correctCards);
    
    if (isCorrect) {
      setPracticeResult({
        isCorrect: true,
        message: 'Correct! You have selected the right cards.',
        explanation: practicePuzzle.explanation
      });
    } else {
      setPracticeResult({
        isCorrect: false,
        message: 'Incorrect. You did not select the right cards.',
        explanation: practicePuzzle.explanation
      });
    }
    
    setShowFeedback(true);
  };

  // Handle navigation to main task
  const handleStartMainTask = () => {
    navigate('/deductive-reasoning/task');
  };

  // Render card component
  const renderCard = (card, index) => {
    const isSelected = selectedCards.includes(index);
    
    return (
      <div 
        key={index} 
        className={`deductive-card ${card.cardType} ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleCardSelection(index)}
      >
        <div className="card-content">
          {card.type === 'shape' && (
            <div className={`shape ${card.front}`}></div>
          )}
          {card.type === 'color' && (
            <div className="shape"></div>
          )}
          {card.type === 'text' && (
            <span className="card-text">{card.front}</span>
          )}
        </div>
      </div>
    );
  };

  // Render practice component or feedback
  if (showFeedback) {
    return (
      <div className="deductive-screen">
        <div className="deductive-content">
          <div className="deductive-feedback">
            <div className={`feedback-result ${practiceResult.isCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
              {practiceResult.message}
            </div>
            <div className="feedback-explanation">
              {practiceResult.explanation}
            </div>
          </div>
          <button 
            className="deductive-button continue-button" 
            onClick={handleStartMainTask}
          >
            Continue to Main Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="deductive-screen">
      <div className="deductive-content">
        <div className="deductive-header">
          <h2>Practice Round</h2>
          <div className="deductive-question">
            {practicePuzzle.question}
          </div>
        </div>
        
        <p className="selected-count">
          Selected cards: {selectedCards.length}/2
        </p>
        
        <div className="cards-container">
          {practicePuzzle.cards.map((card, index) => renderCard(card, index))}
        </div>
        
        <button 
          className="deductive-button submit-button" 
          onClick={evaluatePracticeResponse}
          disabled={selectedCards.length !== 2}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default DeductiveReasoningPractice; 