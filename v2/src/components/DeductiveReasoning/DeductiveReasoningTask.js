import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeductiveReasoning.css';

/**
 * DeductiveReasoningTask component
 * Entry point for the Deductive Reasoning task (Wason Selection Task)
 */
const DeductiveReasoningTask = () => {
  const navigate = useNavigate();

  const startPractice = () => {
    navigate('/deductive-reasoning/practice');
  };

  return (
    <div className="deductive-screen">
      <div className="deductive-content">
        <h1>Deductive Reasoning Task</h1>
        
        <div className="instructions-container">
          <div className="instructions-section">
            <p>
              In this task, you will be presented with a rule and four cards. 
              Each card has different information on each side.
            </p>
            <p>
              Your task is to determine which cards you need to turn over to check 
              if the rule is being followed.
            </p>
          </div>
          
          <div className="instructions-section">
            <h2>How to Play</h2>
            <p>
              You will see a rule statement at the top of the screen, followed by four cards below.
            </p>
            <p>
              Each card shows information, and there is hidden information on the back of each card.
            </p>
            <p>
              Shapes will appear as black symbols on white backgrounds, and colors will appear as solid colored cards.
            </p>
            <p>
              Your task is to select exactly 2 cards that you would need to turn over to check if the rule is being followed or broken.
              You can select a card by simply clicking on it. Selected cards will be highlighted with a blue border.
            </p>
            <p>
              Think carefully about which cards could provide evidence that would prove the rule is being broken.
            </p>
          </div>
          
          <div className="instructions-section">
            <h2>Example</h2>
            <p>
              If the rule is: "If a card has a circle on one side, then it has the color yellow on the other side."
            </p>
            <p>
              And the cards show: a Square shape, a Circle shape, a Yellow color, and a Red color
            </p>
            <p>
              The correct cards to turn over would be: Circle and Red
            </p>
            <p>
              Why? Because we need to check if Circle has Yellow on the back (the rule requires this), 
              and we need to check if Red has a Circle on the back (which would break the rule).
            </p>
            <p>
              In this task, shapes and colors will be displayed visually, with black shapes on white backgrounds 
              and solid colored cards, matching the format of standard psychological tests. Click directly on a card to select it.
            </p>
          </div>
        </div>
        
        <button 
          className="deductive-button continue-button" 
          onClick={startPractice}
        >
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default DeductiveReasoningTask; 