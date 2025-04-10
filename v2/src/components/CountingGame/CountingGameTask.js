import React from 'react';
import { Link } from 'react-router-dom';
import './CountingGame.css';

/**
 * Main CountingGame Task component
 * This component introduces the Counting Game task and provides navigation to start
 */
const CountingGameTask = () => {
  return (
    <div className="task-screen">
      <h1>Counting Game Task</h1>
      
      <div className="task-description">
        <p>In this game, you will see a series of pictures ($5 bill, UTA bus, and a face) one at a time.</p>
        <p>Your job is to keep a <span className="important">MENTAL count for each object</span>.</p>
        <p>You can keep count out loud or in your head, but please <span className="important">DO NOT use your fingers or a pencil/pen and paper</span> to count.</p>
        <p>After you see each object series, you will be asked to report <span className="important">how many of each type of object</span> you saw.</p>
        <p>Click 'Continue' to see an example.</p>
      </div>
      
      <div className="task-options">
        <Link to="/counting-game/instructions" className="task-option-button">
          Continue
        </Link>
      </div>
      
      <Link to="/" className="back-button">Back to Tasks</Link>
    </div>
  );
};

export default CountingGameTask; 