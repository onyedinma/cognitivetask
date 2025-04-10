import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ObjectSpan.css';

const BackwardObjectSpan = () => {
  const navigate = useNavigate();

  const startPractice = () => {
    navigate('/object-span/backward/practice');
  };

  const navigateBack = () => {
    navigate('/object-span');
  };

  return (
    <div className="task-screen">
      <h1>Backward Object Span Task</h1>
      
      <div className="task-instructions">
        <p>In this task, you will be shown a series of objects one at a time.</p>
        <p>Your task is to remember and recall the objects in <strong>REVERSE ORDER</strong> from how they appeared.</p>
        <p>For example, if you see: bread → car → book</p>
        <p>You should type: "book car bread"</p>
        <p>You will start with practice trials to help you understand the task.</p>
      </div>

      <div className="example-objects">
        <img src="/images/Bread.png" alt="Bread" className="example-object" />
        <div className="arrow">→</div>
        <img src="/images/Car.png" alt="Car" className="example-object" />
        <div className="arrow">→</div>
        <img src="/images/Book.png" alt="Book" className="example-object" />
      </div>
      
      <div className="example-response">
        <p>You should respond: "book car bread"</p>
      </div>

      <button onClick={startPractice} className="start-button">
        Start Practice
      </button>
      
      <button onClick={navigateBack} className="back-button">
        Back to Object Span Tasks
      </button>
    </div>
  );
};

export default BackwardObjectSpan; 