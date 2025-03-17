// Game Configuration
const CONFIG = {
    practiceMode: { minShapes: 5, maxShapes: 9, displayTime: 1000, blankTime: 500 },
    realMode: { minShapes: 5, maxShapes: 9, displayTime: 1000, blankTime: 500, rounds: 5 },
};

// Game State Management
const gameState = { 
    studentId: null, 
    scheme: null, 
    isRealGame: false, 
    currentRound: 0, 
    gameResults: [],
    correctCounts: null
};

// Add to the top of script.js
const INSTRUCTION_SCREENS = {
    images: [
        'images/c1.png',
        'images/c2.png',
        'images/c3.png',
        // ... add other image paths
    ],
    currentIndex: 0
};

// Organize screen content in a more modular way
const SCREENS = {
    fullscreen: {
        id: 'fullscreen-prompt',
        content: `
            <p>Press the button below to switch to full screen mode.</p>
            <button id="fullscreenButton">Continue</button>
        `
    },
    studentId: {
        id: 'student-id',
        content: `
            <p>Enter the participant's student ID:</p>
            <input type="text" id="studentIdInput">
            <button id="studentIdButton">Continue</button>
        `
    },
    // ... other screens
};

// Utility function for error handling
function handleError(fn) {
    return function (...args) {
        try { return fn.apply(this, args); }
        catch (error) { console.error('Error:', error); alert('An error occurred. Please try again.'); }
    };
}

// Validate Student ID
function validateStudentId(id) { return /^\d{5,10}$/.test(id); }

function enterFullscreen() {
    document.documentElement.requestFullscreen().then(() => {
        showScreen('student-id');
    }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
}

function submitStudentId() {
    const studentId = document.getElementById('studentIdInput').value;
    if (!validateStudentId(studentId)) {
        alert('Please enter a valid student ID (5-10 digits)');
        return;
    }
    gameState.studentId = studentId;
    showScreen('counter-balance');
}

function selectScheme(scheme) {
    gameState.scheme = scheme;
    transitionScreens('counter-balance', 'welcome');
}

function showInstructions() { transitionScreens('welcome', 'instructions'); }

function startGame() {
    transitionScreens('instructions', 'example');
}

function startShapeSequence() {
    const shapes = ['circle', 'square', 'triangle'];
    const shapeCount = { circle: 0, square: 0, triangle: 0 };
    const config = gameState.isRealGame ? CONFIG.realMode : CONFIG.practiceMode;
    const totalShapes = Math.floor(Math.random() * (config.maxShapes - config.minShapes + 1)) + config.minShapes;
    
    let sequence = Array.from({ length: totalShapes }, () => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        shapeCount[shape]++;
        return shape;
    });
    
    gameState.correctCounts = shapeCount;
    animateShapes(sequence);
}

function animateShapes(sequence) {
    let index = 0;
    const shapeElement = document.querySelector('.shape');
    
    function displayNext() {
        if (index >= sequence.length) {
            shapeElement.className = 'shape blank';
            setTimeout(() => {
                // Reset game area display
                const gameArea = document.getElementById('game-area');
                gameArea.style.display = 'none';
                gameArea.classList.add('hidden');
                
                // Show answer form
                showScreen('answer-form');
            }, 500);
            return;
        }
        
        // Clear all classes first
        shapeElement.className = 'shape';
        
        // Add a small delay before showing the next shape
        setTimeout(() => {
            // Add the specific shape class
            shapeElement.classList.add(sequence[index]);
            
            // Display for the configured time
            setTimeout(() => {
                // Hide the shape
                shapeElement.className = 'shape blank';
                
                // Wait during blank time before showing next shape
                setTimeout(() => {
                    index++;
                    displayNext();
                }, CONFIG.realMode.blankTime);
            }, CONFIG.realMode.displayTime);
        }, 50);
    }
    
    displayNext();
}

function showAnswerForm(correctCounts) {
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('answer-form').classList.remove('hidden');
    window.correctCounts = correctCounts;
}

function submitAnswers() {
    const userAnswers = {
        square: document.getElementById('square-count').value,
        triangle: document.getElementById('triangle-count').value,
        circle: document.getElementById('circle-count').value
    };
    
    if (gameState.isRealGame) {
        storeRoundResults(userAnswers);
        if (gameState.currentRound < CONFIG.realMode.rounds) {
            gameState.currentRound++;
            document.getElementById('round-number').textContent = gameState.currentRound;
            showScreen('round-start');
        } else {
            showScreen('game-complete');
        }
    } else {
        showResults(userAnswers);
    }
    
    // Reset inputs for next time
    document.getElementById('square-count').value = 0;
    document.getElementById('triangle-count').value = 0;
    document.getElementById('circle-count').value = 0;
}

function showResults(userAnswers) {
    document.getElementById('correct-squares').textContent = gameState.correctCounts.square;
    document.getElementById('correct-triangles').textContent = gameState.correctCounts.triangle;
    document.getElementById('correct-circles').textContent = gameState.correctCounts.circle;
    
    document.getElementById('user-squares').textContent = userAnswers.square;
    document.getElementById('user-triangles').textContent = userAnswers.triangle;
    document.getElementById('user-circles').textContent = userAnswers.circle;
    
    showScreen('results');
}

function nextRound() { transitionScreens('results', 'practice-complete-prompt'); }

function startRealGame() {
    gameState.isRealGame = true;
    gameState.currentRound = 1;
    document.getElementById('round-number').textContent = gameState.currentRound;
    showScreen('round-start');
}

function transitionScreens(hideId, showId) {
    document.getElementById(hideId).classList.add('hidden');
    document.getElementById(showId).classList.remove('hidden');
}

function finishGame() {
    // Original JSON export
    const results = { 
        studentId: gameState.studentId, 
        scheme: gameState.scheme, 
        timestamp: new Date().toISOString(), 
        rounds: gameState.gameResults 
    };
    
    // Export JSON
    const jsonBlob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `results_${gameState.studentId}_${Date.now()}.json`;
    jsonLink.click();
    URL.revokeObjectURL(jsonUrl);
    
    // Export CSV with required structure
    exportCSV(results);
}

/**
 * Exports experiment data in the required CSV format
 * @param {Object} results - The experiment results
 */
function exportCSV(results) {
    // CSV header row
    const csvHeader = [
        'rt', 'stimulus', 'button_pressed', 'variable', 'trial_type', 
        'trial_index', 'time_elapsed', 'internal_node_id', 'ID', 
        'counter_balance', 'view_history', 'task', 'animation_sequence', 
        'responses', 'correct', 'remark'
    ].join(',');
    
    // Process each round into CSV rows
    const csvRows = [];
    
    // Start time to calculate time_elapsed
    const startTime = Date.now() - (results.rounds.length * 5000); // Approximate start time
    
    results.rounds.forEach((round, roundIndex) => {
        // Create a row for each round
        // Format responses and correct with consistent order: square, triangle, circle
        const formattedUserAnswers = {
            "Q0": round.userAnswers.square,
            "Q1": round.userAnswers.triangle,
            "Q2": round.userAnswers.circle
        };
        
        const formattedCorrectCounts = {
            "Q0": round.correctCounts.square,
            "Q1": round.correctCounts.triangle,
            "Q2": round.correctCounts.circle
        };
        
        const responses = JSON.stringify(formattedUserAnswers);
        const correct = JSON.stringify(formattedCorrectCounts);
        const isCorrect = JSON.stringify(formattedUserAnswers) === JSON.stringify(formattedCorrectCounts);
        
        const csvRow = {
            rt: roundIndex * 1000 + Math.random() * 500, // Simulated response time
            stimulus: '', // No specific stimulus text
            button_pressed: 0, // Default button index
            variable: 'shape_count', // The experimental variable
            trial_type: 'html-button-response', // Trial type
            trial_index: roundIndex, // Trial index
            time_elapsed: (Date.now() - startTime), // Time elapsed since start
            internal_node_id: `node_${roundIndex}_${Date.now()}`, // Unique node ID
            ID: parseInt(results.studentId), // Subject ID
            counter_balance: parseInt(results.scheme), // Counter-balance condition
            view_history: JSON.stringify({screens: ['instructions', 'game', 'response']}), // View history
            task: 'shape_counting', // Task name
            animation_sequence: JSON.stringify(generateAnimationSequence(round)), // Animation sequence
            responses: responses, // User responses
            correct: correct, // Correct answers
            remark: isCorrect ? 'TRUE' : 'FALSE' // Whether response matches correct
        };
        
        // Format the row according to CSV standards
        csvRows.push(Object.values(csvRow).map(formatCSVValue).join(','));
    });
    
    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Create timestamp for filename
    const now = new Date();
    const timestamp = now.getFullYear() + 
                     String(now.getMonth() + 1).padStart(2, '0') + 
                     String(now.getDate()).padStart(2, '0');
    
    // Create and download CSV file
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `processed_output_${timestamp}.csv`;
    csvLink.click();
    URL.revokeObjectURL(csvUrl);
}

/**
 * Formats a value for CSV output, handling special cases
 * @param {*} value - The value to format
 * @returns {string} - The formatted value
 */
function formatCSVValue(value) {
    if (value === null || value === undefined) {
        return ''; // Empty for null/undefined values
    }
    
    if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if needed
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
    
    return String(value); // Convert numbers and other types to string
}

/**
 * Generates a simulated animation sequence based on round data
 * @param {Object} round - The round data
 * @returns {Array} - The animation sequence
 */
function generateAnimationSequence(round) {
    const sequence = [];
    const shapes = ['circle', 'square', 'triangle'];
    
    // Create sequence based on correct counts
    Object.entries(round.correctCounts).forEach(([shape, count]) => {
        for (let i = 0; i < count; i++) {
            sequence.push({
                shape: shape,
                duration: CONFIG.realMode.displayTime,
                delay: CONFIG.realMode.blankTime
            });
        }
    });
    
    // Shuffle the sequence
    return sequence.sort(() => Math.random() - 0.5);
}

/**
 * Calculates correctness based on user answers vs. correct counts
 * @param {Object} round - The round data
 * @returns {string} - Correctness indicator
 */
function calculateCorrectness(round) {
    const correct = Object.entries(round.correctCounts).every(
        ([shape, count]) => round.userAnswers[shape] == count
    );
    return correct ? 'true' : 'false';
}

function showExample() {
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('example').classList.remove('hidden');
}

function goBack() {
    transitionScreens('example', 'instructions');
}

function startPractice() {
    // First, remove all screen classes that might interfere
    const gameArea = document.getElementById('game-area');
    gameArea.className = ''; // Remove all classes
    gameArea.classList.add('game-area'); // Add only the game-area class
    
    // Hide all other screens
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'game-area') {
            screen.classList.add('hidden');
        }
    });
    
    // Reset the shape element
    const shapeElement = document.querySelector('.shape');
    shapeElement.className = 'shape';
    
    // Show the game area
    gameArea.style.display = 'flex';
    
    // Start the sequence after a short delay
    setTimeout(() => {
        startShapeSequence();
    }, 100);
}

function startPracticeRound() {
    document.getElementById('practice-start').classList.add('hidden');
    // Begin the practice round shape sequence
    startShapeSequence();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize event listeners
    initializeEventListeners();
});

// Add new function to handle image screens
function showInstructionScreen(index) {
    const screen = document.getElementById('instruction-screen');
    if (index < INSTRUCTION_SCREENS.images.length) {
        screen.innerHTML = `
            <img src="${INSTRUCTION_SCREENS.images[index]}" alt="Instruction ${index + 1}">
            <button onclick="nextInstructionScreen()">Next</button>
        `;
    }
}

function nextInstructionScreen() {
    INSTRUCTION_SCREENS.currentIndex++;
    if (INSTRUCTION_SCREENS.currentIndex < INSTRUCTION_SCREENS.images.length) {
        showInstructionScreen(INSTRUCTION_SCREENS.currentIndex);
    } else {
        // Move to next phase of the app
        startGame();
    }
}

// Function to load screen content
function loadScreen(screenId) {
    const screen = SCREENS[screenId];
    const element = document.getElementById(screen.id);
    element.innerHTML = screen.content;
    // Show this screen, hide others
    transitionScreens(currentScreen, screen.id);
}

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

// Set up all event listeners
function initializeEventListeners() {
    // Fullscreen screen
    document.getElementById('fullscreenButton').addEventListener('click', enterFullscreen);
    
    // Add fullscreen change event listener
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Student ID screen
    document.getElementById('studentIdButton').addEventListener('click', submitStudentId);

    // Counter Balance screen
    document.querySelectorAll('.scheme-button').forEach(button => {
        button.addEventListener('click', (e) => {
            gameState.scheme = e.target.dataset.scheme;
            showScreen('welcome');
        });
    });

    // Welcome screen
    document.getElementById('welcomeButton').addEventListener('click', () => {
        showScreen('instructions');
    });

    // Instructions screen
    document.getElementById('instructionsButton').addEventListener('click', () => {
        showScreen('example');
    });

    // Example screen
    document.getElementById('goBackButton').addEventListener('click', () => {
        showScreen('instructions');
    });
    
    document.getElementById('startPracticeButton').addEventListener('click', startPractice);

    // Answer form
    document.getElementById('submitAnswersButton').addEventListener('click', submitAnswers);

    // Results screen
    document.getElementById('nextRoundButton').addEventListener('click', nextRound);

    // Practice complete prompt
    document.getElementById('readyToContinueButton').addEventListener('click', () => {
        showScreen('real-game-instructions');
    });
    
    document.getElementById('practiceAgainButton').addEventListener('click', () => {
        startPracticeGame();
    });

    // Real game instructions
    document.getElementById('startRealGameButton').addEventListener('click', startRealGame);

    // Round start
    document.getElementById('beginRoundButton').addEventListener('click', startRound);

    // Game complete
    document.getElementById('finishGameButton').addEventListener('click', finishGame);

    // Number input buttons
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const currentValue = parseInt(input.value) || 0;
            input.value = Math.min(currentValue + 1, parseInt(input.max));
        });
    });
    
    document.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const currentValue = parseInt(input.value) || 0;
            input.value = Math.max(currentValue - 1, parseInt(input.min));
        });
    });
}

// Game Logic
function startPracticeGame() {
    // Reset game state for practice
    gameState.isRealGame = false;
    gameState.correctCounts = null;
    
    // First, remove all screen classes that might interfere
    const gameArea = document.getElementById('game-area');
    gameArea.className = ''; // Remove all classes
    gameArea.classList.add('game-area'); // Add only game-area class, not screen
    
    // Hide all other screens
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'game-area') {
            screen.classList.add('hidden');
        }
    });
    
    // Reset the shape element
    const shapeElement = document.querySelector('.shape');
    shapeElement.className = 'shape';
    
    // Show the game area
    gameArea.classList.remove('hidden');
    gameArea.style.display = 'flex';
    
    // Reset any input values
    document.getElementById('square-count').value = 0;
    document.getElementById('triangle-count').value = 0;
    document.getElementById('circle-count').value = 0;
    
    // Start the sequence after a short delay
    setTimeout(() => {
        startShapeSequence();
    }, 100);
}

function startRound() {
    // First, remove all screen classes that might interfere
    const gameArea = document.getElementById('game-area');
    gameArea.className = ''; // Remove all classes
    gameArea.classList.add('game-area'); // Add only the game-area class
    
    // Hide all other screens
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'game-area') {
            screen.classList.add('hidden');
        }
    });
    
    // Reset the shape element
    const shapeElement = document.querySelector('.shape');
    shapeElement.className = 'shape';
    
    // Show the game area
    gameArea.style.display = 'flex';
    
    // Start the sequence
    startShapeSequence();
}

function storeRoundResults(userAnswers) {
    gameState.gameResults.push({
        round: gameState.currentRound,
        correctCounts: { ...gameState.correctCounts },
        userAnswers: { ...userAnswers }
    });
}

// Handle fullscreen change event
function handleFullscreenChange() {
    // Force redraw of triangle elements to maintain proper shape
    const triangles = document.querySelectorAll('.triangle');
    triangles.forEach(triangle => {
        // Trigger a reflow/repaint
        triangle.style.display = 'none';
        setTimeout(() => {
            triangle.style.display = 'block';
        }, 10);
    });
}
