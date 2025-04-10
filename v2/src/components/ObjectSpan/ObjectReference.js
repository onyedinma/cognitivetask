import React from 'react';
import { TASK_CONFIG } from '../../config';
import './ObjectReference.css';

/**
 * Object Reference Component
 * Displays a visual reference guide for all objects and their names
 */
const ObjectReference = () => {
  const objects = Object.values(TASK_CONFIG.objectSpan.objectMapping);

  return (
    <div className="object-reference-guide">
      <h3>Object Name Reference:</h3>
      <div className="object-reference-grid">
        {objects.map((obj) => (
          <div key={obj.name} className="object-reference-item">
            <img src={obj.image} alt={obj.name} className="reference-image" />
            <span className="object-name">{obj.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectReference; 