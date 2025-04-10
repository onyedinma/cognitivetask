import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="welcome-screen">
      <h1>Cognitive Task Assessment</h1>
      <p>Welcome to the React-based implementation of the Cognitive Tasks.</p>
      <p>Please choose a task to begin:</p>
      
      <div className="task-buttons">
        <Link to="/object-span" className="task-button">
          Object Span Task
        </Link>
        <Link to="/digit-span" className="task-button">
          Digit Span Task
        </Link>
        <Link to="/shape-counting" className="task-button">
          Shape Counting Task
        </Link>
        <Link to="/counting-game" className="task-button">
          Counting Game (Ecological)
        </Link>
        <Link to="/spatial-memory" className="task-button">
          Spatial Working Memory
        </Link>
        <Link to="/ecological-spatial" className="task-button">
          Ecological Spatial Memory
        </Link>
        <Link to="/ecological-deductive" className="task-button">
          Ecological Deductive Reasoning
        </Link>
        <Link to="/deductive-reasoning" className="task-button">
          Deductive Reasoning
        </Link>
        {/* Add more task buttons as they are implemented */}
      </div>
      
      <div className="version-info">
        <p>This is the modern implementation (v2). <a href="/">Click here for the original version</a>.</p>
      </div>
    </div>
  );
};

export default Home; 