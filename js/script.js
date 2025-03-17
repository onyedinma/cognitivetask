import { CONFIG } from './config.js';
import { gameState } from './utils/state.js';
import { ScreenManager } from './utils/transitions.js';
import { fullscreenScreen } from './screens/fullscreen.js';
// Import other screen modules...

// Make screenManager available globally
window.screenManager = new ScreenManager();

// Register all screens
screenManager.register('fullscreen-prompt', fullscreenScreen);
// Register other screens...

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the first screen
    screenManager.transition('fullscreen-prompt');
});

// Make functions available globally
window.enterFullscreen = function() {
    document.documentElement.requestFullscreen()
        .then(() => screenManager.transition('student-id'))
        .catch(err => console.error('Fullscreen error:', err));
}; 