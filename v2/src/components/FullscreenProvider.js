import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for fullscreen functionality
const FullscreenContext = createContext({
  isFullscreen: false,
  enterFullscreen: () => {},
  exitFullscreen: () => {},
  toggleFullscreen: () => {},
});

// Custom hook to use the fullscreen context
export const useFullscreen = () => useContext(FullscreenContext);

// Fullscreen Provider Component
export const FullscreenProvider = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if browser is in fullscreen mode
  const checkFullscreen = () => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  // Enter fullscreen mode
  const enterFullscreen = async () => {
    try {
      const docEl = document.documentElement;
      
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
      
      setIsFullscreen(true);
      console.log('Entered fullscreen mode');
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  // Exit fullscreen mode
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      
      setIsFullscreen(false);
      console.log('Exited fullscreen mode');
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (checkFullscreen()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(checkFullscreen());
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
}; 