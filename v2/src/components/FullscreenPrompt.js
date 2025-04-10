import React, { useState, useEffect } from 'react';
import { useFullscreen } from './FullscreenProvider';
import './FullscreenPrompt.css';

const FullscreenPrompt = ({ onEnterFullscreen }) => {
  const { isFullscreen, enterFullscreen } = useFullscreen();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show prompt if not already in fullscreen mode
    if (!isFullscreen) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
      if (onEnterFullscreen) onEnterFullscreen();
    }
  }, [isFullscreen, onEnterFullscreen]);

  const handleEnterFullscreen = async () => {
    await enterFullscreen();
    if (onEnterFullscreen) onEnterFullscreen();
  };

  if (!showPrompt) return null;

  return (
    <div className="fullscreen-prompt">
      <div className="fullscreen-prompt-content">
        <h2>Enter Fullscreen Mode</h2>
        <p>
          This cognitive task is designed to be used in fullscreen mode.
          Please click the button below to continue.
        </p>
        <button
          className="fullscreen-button"
          onClick={handleEnterFullscreen}
        >
          Enter Fullscreen
        </button>
      </div>
    </div>
  );
};

export default FullscreenPrompt; 