import React, { useState, useEffect } from 'react';
import { useFullscreen } from './FullscreenProvider';
import './FullscreenWarning.css';

const FullscreenWarning = () => {
  const { isFullscreen, enterFullscreen } = useFullscreen();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Show warning when exiting fullscreen mode
    if (!isFullscreen) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [isFullscreen]);

  const handleReturn = async () => {
    await enterFullscreen();
  };

  if (!showWarning) return null;

  return (
    <div className="fullscreen-warning">
      <div className="fullscreen-warning-content">
        <h2>Fullscreen Mode Exited</h2>
        <p>
          This cognitive task is designed to be used in fullscreen mode.
          Please return to fullscreen mode to continue the task.
        </p>
        <button
          className="fullscreen-return-button"
          onClick={handleReturn}
        >
          Return to Fullscreen
        </button>
      </div>
    </div>
  );
};

export default FullscreenWarning; 