import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalDeductiveReasoning.css';

const EcologicalDeductiveReasoningTask = () => {
  const navigate = useNavigate();
  
  // Component state to handle display
  const [showIntro, setShowIntro] = useState(true);
  
  // Handle navigation to practice section
  const handleStartPractice = () => {
    navigate('/ecological-deductive/practice');
  };
  
  return (
    <div className="eco-deductive-screen">
      <div className="eco-deductive-content">
        <div className="eco-deductive-header">
          <h1>Ecological Deductive Reasoning Task</h1>
        </div>
        
        <div className="eco-instructions-container">
          <div className="eco-instructions-section">
            <p>
              In this task, you will be presented with a rule and four cards. 
              Each card has different information on each side.
            </p>
            <p>
              Your task is to determine which cards you need to turn over to check 
              if the rule is being followed.
            </p>
          </div>
          
          <div className="eco-instructions-section">
            <h2>How to Play</h2>
            <p>
              You will see a rule statement at the top of the screen, followed by four cards below.
            </p>
            <p>
              Each card shows information, and there is hidden information on the back of each card.
            </p>
            <p>
              Your task is to select exactly 2 cards that you would need to turn over to check if the rule is being followed or broken.
            </p>
            <p>
              Think carefully about which cards could provide evidence that would prove the rule is being broken.
            </p>
          </div>
          
          <div className="eco-instructions-section">
            <h2>Example</h2>
            <p>
              If the rule is: "If a card has a vowel on one side, then it has an even number on the other side."
            </p>
            <p>
              And the cards show: A, K, 2, 7
            </p>
            <p>
              The correct cards to turn over would be: A and 7
            </p>
            <p>
              Why? Because we need to check if A has an even number on the back (the rule requires this), 
              and we need to check if 7 has a vowel on the back (which would break the rule).
            </p>
          </div>
        </div>
        
        <button 
          className="eco-deductive-button eco-continue-button" 
          onClick={handleStartPractice}
        >
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default EcologicalDeductiveReasoningTask; 