export const fullscreenScreen = {
    id: 'fullscreen-prompt',
    content: `
        <p>Press the button below to switch to full screen mode.</p>
        <button id="fullscreenButton" onclick="enterFullscreen()">Continue</button>
    `,
    init: () => {
        // Any additional initialization if needed
    }
};

function enterFullscreen() {
    document.documentElement.requestFullscreen()
        .then(() => window.screenManager.transition('student-id'))
        .catch(err => console.error('Fullscreen error:', err));
} 