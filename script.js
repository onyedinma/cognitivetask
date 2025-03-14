// Game configuration
const CONFIG = {
    practiceMode: {
        minShapes: 5,
        maxShapes: 10,
        displayTime: 1000,
        blankTime: 500
    },
    realMode: {
        minShapes: 15,
        maxShapes: 25,
        displayTime: 1000,
        blankTime: 500,
        rounds: 5
    },
    maxRadioOptions: 8
};

// State management
let gameState = {
    studentId: null,
    scheme: null,
    isRealGame: false,
    currentRound: 0,
    gameResults: []
};

// Error handling wrapper
function handleError(fn) {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please refresh the page and try again.');
        }
    }
}

// Validate student ID
function validateStudentId(id) {
    return /^\d{5,10}$/.test(id);
}

function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    document.getElementById('fullscreen-prompt').classList.add('hidden');
    document.getElementById('student-id').classList.remove('hidden');
}

// Modified submitStudentId function
function submitStudentId() {
    const studentId = document.getElementById('studentIdInput').value;
    if (!validateStudentId(studentId)) {
        alert('Please enter a valid student ID (5-10 digits)');
        return;
    }
    gameState.studentId = studentId;
    document.getElementById('student-id').classList.add('hidden');
    document.getElementById('counter-balance').classList.remove('hidden');
}

function selectScheme(scheme) {
    document.getElementById('counter-balance').classList.add('hidden');
    document.getElementById('welcome').classList.remove('hidden');
}

function showInstructions() {
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('instructions').classList.remove('hidden');
}

// Modified startGame function
function startGame() {
    // Reset all screens to hidden first
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Reset radio selections
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Show game area and start the sequence
    document.getElementById('game-area').classList.remove('hidden');
    
    const shapes = ['circle', 'square', 'triangle'];
    const shapeCount = {
        circle: 0,
        square: 0,
        triangle: 0
    };
    
    // Generate random sequence - more shapes in real game
    const config = gameState.isRealGame ? CONFIG.realMode : CONFIG.practiceMode;
    const totalShapes = Math.floor(Math.random() * 
        (config.maxShapes - config.minShapes + 1)) + config.minShapes;
    
    const sequence = [];
    
    for (let i = 0; i < totalShapes; i++) {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        sequence.push(randomShape);
        shapeCount[randomShape]++;
    }
    
    let currentIndex = 0;
    const displayTime = config.displayTime; // 1 second
    const blankTime = config.blankTime;    // 0.5 second blank screen between shapes
    
    function displayNextShape() {
        if (currentIndex >= sequence.length) {
            showAnswerForm(shapeCount);
            return;
        }
        
        const shape = sequence[currentIndex];
        const gameArea = document.getElementById('game-area');
        gameArea.className = `shape ${shape}`;
        
        setTimeout(() => {
            gameArea.className = 'shape blank';
            setTimeout(() => {
                currentIndex++;
                displayNextShape();
            }, blankTime);
        }, displayTime);
    }
    
    displayNextShape();
}

function showAnswerForm(correctCounts) {
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('answer-form').classList.remove('hidden');
    
    // Store correct counts for later comparison
    window.correctCounts = correctCounts;
}

function submitAnswers() {
    const userAnswers = {
        square: document.querySelector('input[name="squares"]:checked')?.value,
        triangle: document.querySelector('input[name="triangles"]:checked')?.value,
        circle: document.querySelector('input[name="circles"]:checked')?.value
    };
    
    // Validate that all questions are answered
    if (!userAnswers.square || !userAnswers.triangle || !userAnswers.circle) {
        alert('Please answer all questions');
        return;
    }
    
    showResults(userAnswers);
}

function showResults(userAnswers) {
    document.getElementById('answer-form').classList.add('hidden');
    
    if (window.isRealGame) {
        // Store answers and continue to next round without showing results
        storeRoundResults(userAnswers);
    } else {
        // Show results in practice mode
        document.getElementById('results').classList.remove('hidden');
        
        // Display correct answers
        document.getElementById('correct-squares').textContent = window.correctCounts.square;
        document.getElementById('correct-triangles').textContent = window.correctCounts.triangle;
        document.getElementById('correct-circles').textContent = window.correctCounts.circle;
        
        // Display user answers
        document.getElementById('user-squares').textContent = userAnswers.square;
        document.getElementById('user-triangles').textContent = userAnswers.triangle;
        document.getElementById('user-circles').textContent = userAnswers.circle;
    }
}

function nextRound() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('practice-complete-prompt').classList.remove('hidden');
}

function startPracticeAgain() {
    // Reset all screens to hidden
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Reset game state for practice
    gameState.isRealGame = false;
    gameState.currentRound = 0;
    gameState.gameResults = [];
    
    // Start fresh practice round
    startGame();
}

// Update the HTML onclick handler for the "Yes, practice again" button
function startRealGame() {
    document.getElementById('practice-complete-prompt').classList.add('hidden');
    document.getElementById('real-game-instructions').classList.remove('hidden');
}

function storeRoundResults(userAnswers) {
    window.gameResults.push({
        round: window.currentRound,
        userAnswers: userAnswers,
        correctCounts: window.correctCounts
    });
    
    if (window.currentRound < 5) {
        window.currentRound++;
        // Reset radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        // Show next round screen
        showRoundStart();
    } else {
        // Show game completion screen
        showGameComplete();
    }
}

function showRoundStart() {
    document.getElementById('answer-form').classList.add('hidden');
    document.getElementById('round-start').classList.remove('hidden');
    document.getElementById('round-number').textContent = window.currentRound;
}

function beginRound() {
    document.getElementById('round-start').classList.add('hidden');
    startGame();
}

function showGameComplete() {
    document.getElementById('answer-form').classList.add('hidden');
    document.getElementById('game-complete').classList.remove('hidden');
}

// Modified finishGame function with data export
function finishGame() {
    const results = {
        studentId: gameState.studentId,
        scheme: gameState.scheme,
        timestamp: new Date().toISOString(),
        rounds: gameState.gameResults
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], 
        { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `results_${gameState.studentId}_${new Date().getTime()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Update startRealGameRound to show the first round screen
function startRealGameRound() {
    window.isRealGame = true;
    window.currentRound = 1;
    window.gameResults = [];
    
    document.getElementById('real-game-instructions').classList.add('hidden');
    showRoundStart();
}

// Add loading states
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) loader.remove();
}

// Prevent exiting fullscreen with Esc key
document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    }
});

// Wrap all event handlers with error handling
document.addEventListener('DOMContentLoaded', () => {
    const functions = [enterFullscreen, submitStudentId, selectScheme, 
        startGame, submitAnswers, showResults, nextRound, finishGame];
    functions.forEach(fn => {
        window[fn.name] = handleError(fn);
    });
});