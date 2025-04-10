import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeductiveReasoning.css';

/**
 * DeductiveReasoningMainTask component
 * Main task component for the deductive reasoning assessment (Wason Selection Task)
 */
const DeductiveReasoningMainTask = () => {
  const navigate = useNavigate();
  
  // Define the main puzzles (Wason Selection Tasks)
  const mainPuzzles = [
    {
      question: "If a card has a vowel on one side, then it has an even number on the other side.",
      cards: [
        { front: "A", back: "4", type: "text" },
        { front: "K", back: "7", type: "text" },
        { front: "2", back: "U", type: "text" },
        { front: "7", back: "E", type: "text" }
      ],
      correctCards: [0, 3],  // A and 7 (0-indexed)
      explanation: "Correct answer: A and 7. You need to check if A has an even number on the back (the rule requires this) and if 7 has a vowel on the back (which would break the rule)."
    },
    {
      question: "If a student passes all their exams, then they graduate.",
      cards: [
        { front: "Passed all exams", back: "Graduated", type: "text" },
        { front: "Failed some exams", back: "Did not graduate", type: "text" },
        { front: "Graduated", back: "Passed all exams", type: "text" },
        { front: "Did not graduate", back: "Failed some exams", type: "text" }
      ],
      correctCards: [0, 3],  // "Passed all exams" and "Did not graduate"
      explanation: "Correct answer: 'Passed all exams' and 'Did not graduate'. You need to check if someone who passed all exams graduated (the rule requires this) and if someone who didn't graduate passed all exams (which would break the rule)."
    },
    {
      question: "If a person is drinking alcohol, then they must be over 21 years old.",
      cards: [
        { front: "Drinking alcohol", back: "25 years old", type: "text" },
        { front: "Drinking soda", back: "16 years old", type: "text" },
        { front: "30 years old", back: "Drinking alcohol", type: "text" },
        { front: "17 years old", back: "Drinking alcohol", type: "text" }
      ],
      correctCards: [0, 3],  // "Drinking alcohol" and "17 years old"
      explanation: "Correct answer: 'Drinking alcohol' and '17 years old'. You need to check if someone drinking alcohol is over 21 (the rule requires this) and if someone who is 17 is drinking alcohol (which would break the rule)."
    },
    {
      question: "If it's raining, then the ground is wet.",
      cards: [
        { front: "Raining", back: "Ground is wet", type: "text" },
        { front: "Not raining", back: "Ground is dry", type: "text" },
        { front: "Ground is wet", back: "Raining", type: "text" },
        { front: "Ground is dry", back: "Not raining", type: "text" }
      ],
      correctCards: [0, 3],  // "Raining" and "Ground is dry"
      explanation: "Correct answer: 'Raining' and 'Ground is dry'. You need to check if when it's raining the ground is wet (the rule requires this) and if when the ground is dry it's not raining (to verify the rule is consistent)."
    }
  ];

  // Component state
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

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

  // Evaluate response for current puzzle
  const evaluateResponse = () => {
    const currentPuzzle = mainPuzzles[currentPuzzleIndex];
    const isCorrect = checkCorrectCards(currentPuzzle.correctCards);
    
    // Store result
    const newResult = {
      puzzleIndex: currentPuzzleIndex,
      question: currentPuzzle.question,
      selectedCards: [...selectedCards],
      correctCards: [...currentPuzzle.correctCards],
      isCorrect: isCorrect,
      timestamp: new Date().toISOString()
    };
    
    setResults(prevResults => [...prevResults, newResult]);
    
    // Move to next puzzle or show results
    if (currentPuzzleIndex < mainPuzzles.length - 1) {
      setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
      setSelectedCards([]);
    } else {
      setShowResults(true);
    }
  };

  // Complete task and return to home
  const handleComplete = () => {
    // Save results to localStorage for later retrieval
    try {
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const counterBalance = localStorage.getItem('counterBalance') || 'unknown';
      
      const exportData = {
        task: 'deductive_reasoning',
        studentId: studentId,
        counterBalance: counterBalance,
        results: results,
        timestamp: new Date().toISOString(),
        score: {
          correct: results.filter(result => result.isCorrect).length,
          total: results.length,
          accuracy: results.length > 0 
            ? Math.round((results.filter(result => result.isCorrect).length / results.length) * 100) 
            : 0
        }
      };
      
      // Get existing results or initialize new array
      const existingResults = JSON.parse(localStorage.getItem('taskResults') || '[]');
      existingResults.push(exportData);
      localStorage.setItem('taskResults', JSON.stringify(existingResults));
      
      console.log('Deductive Reasoning results saved:', exportData);
    } catch (error) {
      console.error('Error saving results:', error);
    }
    
    navigate('/home');
  };

  // Render card component
  const renderCard = (card, index) => {
    const isSelected = selectedCards.includes(index);
    
    return (
      <div 
        key={index} 
        className={`deductive-card ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleCardSelection(index)}
      >
        <div className="card-content">
          <span className="card-text">{card.front}</span>
        </div>
      </div>
    );
  };

  // Render results screen
  if (showResults) {
    const correctCount = results.filter(result => result.isCorrect).length;
    const totalCount = results.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    
    return (
      <div className="deductive-screen">
        <div className="deductive-content">
          <div className="deductive-results">
            <h2>Results</h2>
            <div className="results-item">
              Correct answers: <span className="results-value">{correctCount}</span>
            </div>
            <div className="results-item">
              Total problems: <span className="results-value">{totalCount}</span>
            </div>
            <div className="results-item">
              Accuracy: <span className="results-value">{accuracy}%</span>
            </div>
          </div>
          
          <button 
            className="deductive-button complete-button" 
            onClick={handleComplete}
          >
            Complete Task
          </button>
        </div>
      </div>
    );
  }

  // Get current puzzle
  const currentPuzzle = mainPuzzles[currentPuzzleIndex];
  const submitDisabled = selectedCards.length !== 2;
  
  return (
    <div className="deductive-screen">
      <div className="deductive-content">
        <div className="deductive-header">
          <div className="deductive-question">
            {currentPuzzle.question}
          </div>
          <p>
            Problem {currentPuzzleIndex + 1} of {mainPuzzles.length}
          </p>
        </div>
        
        <p className="selected-count">
          Selected cards: {selectedCards.length}/2
        </p>
        
        <div className="cards-container">
          {currentPuzzle.cards.map((card, index) => renderCard(card, index))}
        </div>
        
        <button 
          className="deductive-button submit-button" 
          onClick={evaluateResponse}
          disabled={submitDisabled}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default DeductiveReasoningMainTask; 