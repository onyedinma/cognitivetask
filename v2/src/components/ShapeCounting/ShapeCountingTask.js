import React from 'react';
import { Link } from 'react-router-dom';
import './ShapeCounting.css';

/**
 * Main ShapeCounting Task component
 * This component introduces the Shape Counting task and provides navigation to start
 */
const ShapeCountingTask = () => {
  return (
    <div className="task-screen">
      <h1>Shape Counting Task</h1>
      
      <div className="task-description">
        <p>In this task, you will see a series of shapes (squares, triangles, and circles) one at a time.</p>
        <p>Your job is to keep a <span className="important">MENTAL count for each type of shape</span>.</p>
        <p>After you see each shape series, you will be asked <span className="important">how many of each type of shape</span> you saw.</p>
        <p>Click 'Continue' to see an example.</p>
      </div>
      
      <div className="task-options">
        <Link to="/shape-counting/instructions" className="task-option-button">
          Continue
        </Link>
      </div>
      
      <Link to="/" className="back-button">Back to Tasks</Link>
    </div>
  );
};

export default ShapeCountingTask; 