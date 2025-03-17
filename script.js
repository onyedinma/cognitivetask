// Game Configuration
const CONFIG = {
    practiceMode: { minShapes: 5, maxShapes: 10, displayTime: 1000, blankTime: 250 },
    realMode: { minShapes: 10, maxShapes: 15, displayTime: 1000, blankTime: 250, rounds: 5 },
    countingMode: { minObjects: 5, maxObjects: 10, displayTime: 1000, blankTime: 250 },
    countingRealMode: { minObjects: 10, maxObjects: 15, displayTime: 1000, blankTime: 250, rounds: 5 },
    digitSpanMode: { displayTime: 1000, blankTime: 500, startDigits: 3, maxDigits: 9 }
};

// Game State Management
const gameState = { 
    studentId: null, 
    scheme: null, 
    isRealGame: false,
    isCountingGame: false,
    isPatternGame: false,
    currentRound: 0, 
    gameResults: [],
    correctCounts: null,
    isBackward: false
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
    countingGameIntro: {
        id: 'counting-game-intro',
        content: `
            <h2>You will now play a Counting game.</h2>
            <p>In this game, you will see a series of pictures ($5 bill, UTA bus, and a face) one at a time. Your job is to keep a <span class="important">MENTAL count for each object</span>. You can keep count out loud or in your head, but please <span class="important">DO NOT use your fingers or a pencil/pen and paper</span> to count.</p>
            <p>After you see each object series, you will be asked to report the number of each type of object you saw in the series.</p>
            <p>Click 'continue' to see an example.</p>
            <button id="countingGameIntroButton">continue</button>
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
    
    // Store the scheme in the results
    results.scheme = scheme;
    
    // Show the appropriate screen based on the scheme
    if (scheme === '2') {
        // Digit Span Game
        showScreen('pattern-game-intro');
    } else if (scheme === '4') {
        // Counting Game
        showScreen('counting-game-intro');
    } else {
        // Shape Counting Game
        showScreen('welcome');
    }
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
    console.log("Finish button clicked - Exporting results");
    
    // Prepare results for export
    const results = {
        studentId: gameState.studentId,
        scheme: gameState.scheme,
        rounds: gameState.gameResults
    };
    
    console.log("Exporting results:", results);
    
    // Export results as CSV
    exportCSV(results);
    
    // Also save as JSON for debugging
    saveResultsAsJSON(results);
    
    // Reset game state for next session
    gameState.isRealGame = false;
    gameState.isCountingGame = false;
    gameState.isPatternGame = false;
    gameState.isBackward = false;
    gameState.currentRound = 0;
    gameState.gameResults = [];
    gameState.correctCounts = null;
    
    // Return to counter balance screen for next participant
    showScreen('counter-balance');
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
        let formattedUserAnswers, formattedCorrectCounts, taskName, variable;
        
        // Check if this is a counting game (scheme 4), shape counting game, or digit span game
        const isCountingGame = results.scheme === '4';
        const isDigitSpanGame = results.scheme === '2';
        
        if (isCountingGame) {
            // Format for counting game (bills, buses, faces)
            formattedUserAnswers = {
                "Q0": round.userAnswers['5dollar'],
                "Q1": round.userAnswers.bus,
                "Q2": round.userAnswers.face
            };
            
            formattedCorrectCounts = {
                "Q0": round.correctCounts['5dollar'],
                "Q1": round.correctCounts.bus,
                "Q2": round.correctCounts.face
            };
            
            taskName = 'object_counting';
            variable = 'object_count';
        } else if (isDigitSpanGame) {
            // Format for digit span game
            formattedUserAnswers = {
                "Q0": round.userResponse
            };
            
            formattedCorrectCounts = {
                "Q0": round.correctResponse
            };
            
            taskName = 'digit_span';
            variable = 'digit_sequence';
        } else {
            // Format for shape game (squares, triangles, circles)
            formattedUserAnswers = {
                "Q0": round.userAnswers.square,
                "Q1": round.userAnswers.triangle,
                "Q2": round.userAnswers.circle
            };
            
            formattedCorrectCounts = {
                "Q0": round.correctCounts.square,
                "Q1": round.correctCounts.triangle,
                "Q2": round.correctCounts.circle
            };
            
            taskName = 'shape_counting';
            variable = 'shape_count';
        }
        
        // Ensure both responses and correct have the same structure
        // Convert values to strings to ensure consistent formatting
        const responsesObj = {
            "Q0": String(formattedUserAnswers.Q0),
            "Q1": String(formattedUserAnswers.Q1 || ''),
            "Q2": String(formattedUserAnswers.Q2 || '')
        };
        
        const correctObj = {
            "Q0": String(formattedCorrectCounts.Q0),
            "Q1": String(formattedCorrectCounts.Q1 || ''),
            "Q2": String(formattedCorrectCounts.Q2 || '')
        };
        
        const responses = JSON.stringify(responsesObj);
        const correct = JSON.stringify(correctObj);
        
        // Use the calculateCorrectness function to determine if the answers are correct
        const remark = calculateCorrectness(round);
        
        const csvRow = {
            rt: roundIndex * 1000 + Math.random() * 500, // Simulated response time
            stimulus: '', // No specific stimulus text
            button_pressed: 0, // Default button index
            variable: variable, // The experimental variable
            trial_type: 'html-button-response', // Trial type
            trial_index: roundIndex, // Trial index
            time_elapsed: (Date.now() - startTime), // Time elapsed since start
            internal_node_id: `node_${roundIndex}_${Date.now()}`, // Unique node ID
            ID: parseInt(results.studentId), // Subject ID
            counter_balance: parseInt(results.scheme), // Counter-balance condition
            view_history: JSON.stringify({screens: ['instructions', 'game', 'response']}), // View history
            task: taskName, // Task name
            animation_sequence: JSON.stringify(generateAnimationSequence(round, isCountingGame)), // Animation sequence
            responses: responses, // User responses
            correct: correct, // Correct answers
            remark: remark // Set based on calculateCorrectness function
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
 * Generates an animation sequence for CSV export based on round data
 * @param {Object} round - The round data
 * @param {boolean} isCountingGame - Whether this is a counting game
 * @returns {Array} - The animation sequence
 */
function generateAnimationSequence(round, isCountingGame) {
    let sequence = [];
    
    if (isCountingGame) {
        const config = gameState.isRealGame ? CONFIG.countingRealMode : CONFIG.countingMode;
        const objects = ['5dollar', 'bus', 'face'];
        
        // Ensure at least one of each object type
        sequence = ['5dollar', 'bus', 'face'];
        
        // Calculate how many more objects to add without exceeding the maximum
        const correctTotal = round.correctCounts['5dollar'] + round.correctCounts.bus + round.correctCounts.face;
        const maxAdditional = Math.min(correctTotal - 3, config.maxObjects - 3);
        
        // Add remaining objects based on correct counts proportionally
        if (maxAdditional > 0) {
            const proportions = {
                '5dollar': round.correctCounts['5dollar'] - 1,
                'bus': round.correctCounts.bus - 1,
                'face': round.correctCounts.face - 1
            };
            
            const totalRemaining = proportions['5dollar'] + proportions.bus + proportions.face;
            
            // If we have valid proportions, use them
            if (totalRemaining > 0) {
                for (let i = 0; i < maxAdditional; i++) {
                    // Select object type based on remaining proportions
                    let selectedObject = null;
                    const rand = Math.random() * totalRemaining;
                    let cumulative = 0;
                    
                    for (const obj of objects) {
                        cumulative += proportions[obj];
                        if (rand <= cumulative) {
                            selectedObject = obj;
                            break;
                        }
                    }
                    
                    // Fallback if proportional selection fails
                    if (!selectedObject) {
                        selectedObject = objects[Math.floor(Math.random() * objects.length)];
                    }
                    
                    sequence.push(selectedObject);
                }
            } else {
                // If all proportions are 0, add random objects
                for (let i = 0; i < maxAdditional; i++) {
                    const object = objects[Math.floor(Math.random() * objects.length)];
                    sequence.push(object);
                }
            }
        }
        
        // Convert to the format expected by the CSV export
        sequence = sequence.map(obj => ({
            object: obj,
            duration: config.displayTime,
            delay: config.blankTime
        }));
    } else {
        // Create sequence for shape game (squares, triangles, circles)
        const config = gameState.isRealGame ? CONFIG.realMode : CONFIG.practiceMode;
        
        // Create sequence based on correct counts
        if (round.correctCounts) {
            Object.entries(round.correctCounts).forEach(([shape, count]) => {
                for (let i = 0; i < count; i++) {
                    sequence.push({
                        shape: shape,
                        duration: config.displayTime,
                        delay: config.blankTime
                    });
                }
            });
        }
    }
    
    // Shuffle the sequence
    return sequence.sort(() => Math.random() - 0.5);
}

/**
 * Calculates correctness based on user answers vs. correct counts
 * @param {Object} round - The round data
 * @returns {string} - Correctness indicator
 */
function calculateCorrectness(round) {
    // Convert all values to strings for consistent comparison
    const userAnswersStr = {};
    const correctCountsStr = {};
    
    Object.keys(round.correctCounts).forEach(key => {
        userAnswersStr[key] = String(round.userAnswers[key]);
        correctCountsStr[key] = String(round.correctCounts[key]);
    });
    
    // Check if all answers match
    const correct = Object.keys(correctCountsStr).every(
        key => userAnswersStr[key] === correctCountsStr[key]
    );
    
    return correct ? 'TRUE' : 'FALSE';
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
    
    // Special handling for digit-span-response screen
    if (screenId === 'digit-span-response') {
        const responseTitle = document.querySelector('#digit-span-response h2');
        if (responseTitle) {
            if (gameState.isBackward) {
                responseTitle.textContent = "Please type in the number in REVERSE order and press enter.";
            } else {
                responseTitle.textContent = "Please type in the number in the same order and press enter.";
            }
        }
    }
    
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
            const scheme = e.target.dataset.scheme;
            selectScheme(scheme);
        });
    });

    // Counting game intro screen
    document.getElementById('countingGameIntroButton')?.addEventListener('click', () => {
        showScreen('counting-game-example');
    });
    
    // Counting game example screen
    document.getElementById('countingGoBackButton')?.addEventListener('click', () => {
        showScreen('counting-game-intro');
    });
    
    document.getElementById('startCountingPracticeButton')?.addEventListener('click', () => {
        startCountingPractice();
    });

    // Counting game answer form
    document.getElementById('submitCountingAnswersButton')?.addEventListener('click', submitCountingAnswers);

    // Counting game results
    document.getElementById('nextCountingRoundButton')?.addEventListener('click', nextCountingRound);

    // Counting game practice complete prompt
    document.getElementById('countingReadyToContinueButton')?.addEventListener('click', () => {
        showScreen('counting-real-game-instructions');
    });
    
    document.getElementById('countingPracticeAgainButton')?.addEventListener('click', () => {
        startCountingPractice();
    });

    // Counting game real game instructions
    document.getElementById('startCountingRealGameButton')?.addEventListener('click', startCountingRealGame);

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
    document.getElementById('finishGameButton').addEventListener('click', function() {
        console.log("Finish game button clicked");
        finishGame();
    });

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

    // Digit span game intro screen
    document.getElementById('digitSpanIntroButton').addEventListener('click', () => {
        showScreen('digit-span-example');
    });

    // Digit span game example screen
    document.getElementById('startDigitSpanPracticeButton').addEventListener('click', startDigitSpanPractice);

    // Digit span practice game
    document.getElementById('startDigitSpanPracticeButton').addEventListener('click', startDigitSpanPractice);

    // Digit span real game
    document.getElementById('startDigitSpanBackwardButton').addEventListener('click', () => {
        console.log("Starting backward digit span practice from button click");
        gameState.isBackward = true; // Explicitly set backward mode
        console.log("isBackward flag set to:", gameState.isBackward);
        startDigitSpanBackwardPractice();
    });

    // Digit span complete
    document.getElementById('finishDigitSpanButton').addEventListener('click', () => {
        if (gameState.isBackward) {
            // If we've completed the backward mode, go to game complete and export results
            showScreen('game-complete');
            
            // Prepare results for export
            const results = {
                studentId: gameState.studentId,
                scheme: gameState.scheme,
                rounds: gameState.gameResults
            };
            
            // Export results as CSV
            exportCSV(results);
            
            // Also save as JSON for debugging
            saveResultsAsJSON(results);
            
            // Reset game state to prevent transitioning to other games
            gameState.isRealGame = false;
            gameState.isCountingGame = false;
            gameState.isPatternGame = false;
            gameState.isBackward = false;
            gameState.currentRound = 0;
        } else {
            // If we've completed the forward mode, go to backward mode instructions
            showScreen('digit-span-backward-example');
        }
    });

    // Add event listener for starting the real digit span game
    document.getElementById('startDigitSpanRealGameButton').addEventListener('click', startDigitSpanRealGame);

    // Add event listener for digit span response submission
    document.getElementById('submitDigitResponseButton').addEventListener('click', submitDigitSpanResponse);

    // Update the nextDigitSpanButton to handle transitions between modes
    document.getElementById('nextDigitSpanButton').addEventListener('click', () => {
        if (gameState.isRealGame) {
            console.log(`Next button clicked - Real game, Round: ${gameState.currentRound}/${CONFIG.realMode.rounds}, Mode: ${gameState.isBackward ? "Backward" : "Forward"}`);
            
            if (gameState.currentRound < CONFIG.realMode.rounds) {
                // Move to next round in the current mode
                gameState.currentRound++;
                console.log(`Moving to round ${gameState.currentRound} in ${gameState.isBackward ? "backward" : "forward"} mode`);
                document.getElementById('round-number').textContent = gameState.currentRound;
                
                // Show the digit game area directly instead of the round start screen
                const digitGameArea = document.getElementById('digit-game-area');
                
                // Hide all screens
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.classList.add('hidden');
                });
                
                // Show the digit game area
                digitGameArea.classList.remove('hidden');
                digitGameArea.style.display = 'flex';
                
                // Start the digit sequence
                startDigitSequence();
            } else {
                // Completed all rounds in current mode
                if (gameState.isBackward) {
                    // If backward mode is complete, show completion screen
                    console.log("Completed all backward rounds, showing completion screen");
                    showScreen('digit-span-complete');
                } else {
                    // If forward mode is complete, transition to backward mode
                    console.log("Completed all forward rounds, transitioning to backward mode");
                    completeForwardDigitSpanRealGame();
                }
            }
        } else {
            // Practice mode
            console.log(`Next button clicked - Practice mode, Mode: ${gameState.isBackward ? "Backward" : "Forward"}`);
            
            if (gameState.isBackward) {
                // If backward practice is complete, show real game instructions
                console.log("Completed backward practice, showing real game instructions");
                showScreen('digit-span-real-game-instructions');
            } else {
                // If forward practice is complete, transition to backward practice
                console.log("Completed forward practice, transitioning to backward practice");
                completeForwardDigitSpanPractice();
            }
        }
    });

    // Function to start the real backward digit span game
    // document.getElementById('startDigitSpanBackwardRealGame').addEventListener('click', startDigitSpanBackwardRealGame);
}

// Game Logic
function startPracticeGame() {
    // Reset game state for practice
    gameState.isRealGame = false;
    gameState.correctCounts = null;
    
    // First, remove all screen classes that might interfere
    const gameArea = document.getElementById('game-area');
    gameArea.className = ''; // Remove all classes
    gameArea.classList.add('game-area'); // Add only game-area class
    
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
    shapeElement.innerHTML = '';
    
    // Show the game area
    gameArea.style.display = 'flex';
    
    // Start the sequence based on game type
    if (gameState.isPatternGame) {
        // For digit span game
        const digitGameArea = document.getElementById('digit-game-area');
        digitGameArea.classList.remove('hidden');
        digitGameArea.style.display = 'flex';
        gameArea.style.display = 'none';
        startDigitSequence();
    } else if (gameState.isCountingGame) {
        // For counting game
        startCountingSequence();
    } else {
        // For shape counting game
        startShapeSequence();
    }
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

// Start the counting game sequence
function startCountingSequence() {
    // Use the correct filename for the $5 bill image
    const objects = ['5dollar', 'bus', 'face'];
    const objectCount = { '5dollar': 0, bus: 0, face: 0 };
    const config = gameState.isRealGame ? CONFIG.countingRealMode : CONFIG.countingMode;
    
    console.log(`Starting counting sequence with config:`, config);
    
    // Calculate total objects - ensure we don't exceed the maximum
    let totalObjects = Math.floor(Math.random() * (config.maxObjects - config.minObjects + 1)) + config.minObjects;
    console.log(`Initial total objects: ${totalObjects} (min: ${config.minObjects}, max: ${config.maxObjects})`);
    
    // Ensure at least one of each object type appears
    let sequence = ['5dollar', 'bus', 'face'];
    objectCount['5dollar'] = 1;
    objectCount.bus = 1;
    objectCount.face = 1;
    
    // Add remaining objects randomly, but don't exceed the maximum
    const remainingSlots = Math.min(totalObjects - 3, config.maxObjects - 3);
    console.log(`Remaining slots to fill: ${remainingSlots}`);
    
    for (let i = 0; i < remainingSlots; i++) {
        const object = objects[Math.floor(Math.random() * objects.length)];
        sequence.push(object);
        objectCount[object]++;
    }
    
    // Shuffle the sequence
    sequence = sequence.sort(() => Math.random() - 0.5);
    
    console.log("Sequence:", sequence);
    console.log("Object counts:", objectCount);
    console.log("Total objects:", sequence.length);
    console.log("Game mode:", gameState.isRealGame ? "Real" : "Practice");
    console.log("Max allowed:", config.maxObjects);
    
    // Ensure we don't exceed the maximum
    if (sequence.length > config.maxObjects) {
        console.warn(`Sequence length (${sequence.length}) exceeds maximum (${config.maxObjects}). Trimming sequence.`);
        sequence = sequence.slice(0, config.maxObjects);
        
        // Recalculate object counts after trimming
        objectCount['5dollar'] = 0;
        objectCount.bus = 0;
        objectCount.face = 0;
        
        sequence.forEach(obj => {
            objectCount[obj]++;
        });
        
        console.log("Updated sequence length:", sequence.length);
        console.log("Updated object counts:", objectCount);
    }
    
    gameState.correctCounts = objectCount;
    animateObjects(sequence);
}

// Animate the counting objects
function animateObjects(sequence) {
    let index = 0;
    const shapeElement = document.querySelector('.shape');
    const config = gameState.isRealGame ? CONFIG.countingRealMode : CONFIG.countingMode;
    
    // Ensure we don't exceed the maximum number of objects
    if (gameState.isCountingGame) {
        const maxObjects = config.maxObjects;
        if (sequence.length > maxObjects) {
            console.warn(`Sequence length (${sequence.length}) exceeds maximum (${maxObjects}). Trimming sequence.`);
            sequence = sequence.slice(0, maxObjects);
        }
    }
    
    // Preload all images to ensure they're in the browser cache
    const preloadImages = () => {
        const imagesToPreload = ['5dollar', 'bus', 'face'];
        imagesToPreload.forEach(imgName => {
            const img = new Image();
            img.src = `dollarmanbus/${imgName}.jpg`;
            console.log(`Preloading image: dollarmanbus/${imgName}.jpg`);
        });
    };
    
    // Preload images before starting the sequence
    preloadImages();
    
    console.log(`Animating sequence with ${sequence.length} objects. Max allowed: ${config.maxObjects}`);
    
    function displayNext() {
        if (index >= sequence.length) {
            shapeElement.className = 'shape blank';
            shapeElement.innerHTML = '';
            setTimeout(() => {
                // Reset game area display
                const gameArea = document.getElementById('game-area');
                gameArea.style.display = 'none';
                gameArea.classList.add('hidden');
                
                // Show answer form based on game type
                if (gameState.isCountingGame) {
                    showScreen('counting-answer-form');
                } else {
                    showScreen('answer-form');
                }
            }, 500);
            return;
        }
        
        // Clear all classes first
        shapeElement.className = 'shape';
        shapeElement.innerHTML = '';
        
        // Add a small delay before showing the next object
        setTimeout(() => {
            // For counting game, use images
            if (gameState.isCountingGame) {
                const currentObject = sequence[index];
                console.log(`Displaying object at index ${index}: ${currentObject}`);
                
                // Preload the image to ensure it's ready before displaying
                const img = new Image();
                img.onload = function() {
                    console.log(`Image loaded successfully: dollarmanbus/${currentObject}.jpg`);
                    shapeElement.innerHTML = `<img src="dollarmanbus/${currentObject}.jpg" alt="${currentObject}" class="counting-object">`;
                    
                    // Display for the configured time
                    setTimeout(() => {
                        // Hide the object
                        shapeElement.className = 'shape blank';
                        shapeElement.innerHTML = '';
                        
                        // Wait during blank time before showing next object
                        setTimeout(() => {
                            index++;
                            displayNext();
                        }, config.blankTime);
                    }, config.displayTime);
                };
                
                img.onerror = function() {
                    console.error(`Failed to load image: dollarmanbus/${currentObject}.jpg`);
                    // Continue to next image even if this one fails
                    index++;
                    displayNext();
                };
                
                img.src = `dollarmanbus/${currentObject}.jpg`;
            } else {
                // For shape game, use CSS classes
                const shapeConfig = gameState.isRealGame ? CONFIG.realMode : CONFIG.practiceMode;
                shapeElement.classList.add(sequence[index]);
                
                // Display for the configured time
                setTimeout(() => {
                    // Hide the object
                    shapeElement.className = 'shape blank';
                    
                    // Wait during blank time before showing next object
                    setTimeout(() => {
                        index++;
                        displayNext();
                    }, shapeConfig.blankTime);
                }, shapeConfig.displayTime);
            }
        }, 50);
    }
    
    displayNext();
}

// Submit answers for counting game
function submitCountingAnswers() {
    const userAnswers = {
        '5dollar': document.getElementById('bill-count').value,
        bus: document.getElementById('bus-count').value,
        face: document.getElementById('face-count').value
    };
    
    if (gameState.isRealGame) {
        storeCountingRoundResults(userAnswers);
        if (gameState.currentRound < CONFIG.realMode.rounds) {
            gameState.currentRound++;
            document.getElementById('round-number').textContent = gameState.currentRound;
            showScreen('round-start');
        } else {
            showScreen('game-complete');
        }
    } else {
        showCountingResults(userAnswers);
    }
    
    // Reset inputs for next time
    document.getElementById('bill-count').value = 0;
    document.getElementById('bus-count').value = 0;
    document.getElementById('face-count').value = 0;
}

// Show results for counting game
function showCountingResults(userAnswers) {
    document.getElementById('correct-bills').textContent = gameState.correctCounts['5dollar'];
    document.getElementById('correct-buses').textContent = gameState.correctCounts.bus;
    document.getElementById('correct-faces').textContent = gameState.correctCounts.face;
    
    document.getElementById('user-bills').textContent = userAnswers['5dollar'];
    document.getElementById('user-buses').textContent = userAnswers.bus;
    document.getElementById('user-faces').textContent = userAnswers.face;
    
    showScreen('counting-results');
}

// Next round for counting game
function nextCountingRound() { 
    transitionScreens('counting-results', 'counting-practice-complete-prompt'); 
}

// Start real counting game
function startCountingRealGame() {
    gameState.isRealGame = true;
    gameState.isCountingGame = true;
    gameState.currentRound = 1;
    document.getElementById('round-number').textContent = gameState.currentRound;
    showScreen('round-start');
}

// Start practice for counting game
function startCountingPractice() {
    // Set game state for counting practice
    gameState.isRealGame = false;
    gameState.isCountingGame = true;
    gameState.correctCounts = null;
    
    // First, remove all screen classes that might interfere
    const gameArea = document.getElementById('game-area');
    gameArea.className = ''; // Remove all classes
    gameArea.classList.add('game-area'); // Add only game-area class
    
    // Hide all other screens
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'game-area') {
            screen.classList.add('hidden');
        }
    });
    
    // Reset the shape element
    const shapeElement = document.querySelector('.shape');
    shapeElement.className = 'shape';
    shapeElement.innerHTML = '';
    
    // Show the game area
    gameArea.classList.remove('hidden');
    gameArea.style.display = 'flex';
    
    // Reset any input values
    document.getElementById('bill-count').value = 0;
    document.getElementById('bus-count').value = 0;
    document.getElementById('face-count').value = 0;
    
    // Start the sequence after a short delay
    setTimeout(() => {
        startCountingSequence();
    }, 100);
}

// Store round results for counting game
function storeCountingRoundResults(userAnswers) {
    gameState.gameResults.push({
        round: gameState.currentRound,
        correctCounts: { ...gameState.correctCounts },
        userAnswers: { ...userAnswers }
    });
}

// Function to start the digit span game
function startDigitSpanGame() {
    gameState.isPatternGame = true;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    showScreen('digit-game-area');
    startDigitSequence();
}

// Function to start a sequence of digits
function startDigitSequence() {
    // Generate a sequence of random digits
    const sequenceLength = gameState.isRealGame ? 
        Math.min(3 + gameState.currentRound, 9) : // Increase length with rounds in real game
        3; // Fixed length for practice
    
    console.log(`Starting digit sequence - Mode: ${gameState.isBackward ? "Backward" : "Forward"}, Round: ${gameState.currentRound}, Length: ${sequenceLength}`);
    
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
        sequence.push(Math.floor(Math.random() * 10)); // Random digit 0-9
    }
    
    console.log("Digit sequence:", sequence);
    
    // Store the correct sequence for later comparison
    gameState.correctSequence = sequence;
    
    // Display the sequence
    animateDigits(sequence);
}

// Function to animate digits one by one
function animateDigits(sequence) {
    let index = 0;
    const digitElement = document.querySelector('.digit');
    const config = CONFIG.digitSpanMode;

    function showNextDigit() {
        if (index >= sequence.length) {
            digitElement.textContent = '';
            setTimeout(() => {
                // Show response form
                showScreen('digit-span-response');
            }, 500);
            return;
        }

        digitElement.textContent = sequence[index];
        setTimeout(() => {
            digitElement.textContent = '';
            setTimeout(() => {
                index++;
                showNextDigit();
            }, config.blankTime);
        }, config.displayTime);
    }

    showNextDigit();
}

// Function to submit digit span response
function submitDigitSpanResponse() {
    const userResponse = document.getElementById('digit-response').value;
    const originalSequence = gameState.correctSequence.join('');
    
    console.log("Digit Span Response - Mode:", gameState.isBackward ? "Backward" : "Forward");
    console.log("Original sequence:", gameState.correctSequence);
    
    // Determine the correct response based on mode
    let correctResponse;
    if (gameState.isBackward) {
        // For backward mode, the correct response is the reverse of the original sequence
        correctResponse = gameState.correctSequence.slice().reverse().join('');
        console.log("Backward mode - Correct response should be:", correctResponse);
    } else {
        // For forward mode, the correct response is the original sequence
        correctResponse = originalSequence;
        console.log("Forward mode - Correct response should be:", correctResponse);
    }
    
    // Check if the response is correct
    const isCorrect = userResponse === correctResponse;
    console.log("User response:", userResponse, "Correct response:", correctResponse, "Is correct:", isCorrect);
    
    // Display the results
    document.getElementById('user-digit-response').textContent = userResponse;
    document.getElementById('correct-digit-response').textContent = correctResponse;
    
    // Show correct/incorrect feedback
    const resultElement = document.getElementById('digit-span-result-feedback');
    if (isCorrect) {
        resultElement.textContent = "Correct!";
        resultElement.className = "correct-answer";
    } else {
        resultElement.textContent = "Incorrect";
        resultElement.className = "incorrect-answer";
    }
    
    // Store round results
    if (gameState.isRealGame) {
        gameState.gameResults.push({
            round: gameState.currentRound,
            userResponse: userResponse,
            correctResponse: correctResponse,
            originalSequence: originalSequence,
            isCorrect: isCorrect,
            isBackward: gameState.isBackward
        });
    }
    
    // Clear the input field
    document.getElementById('digit-response').value = '';
    
    // Show the results screen
    showScreen('digit-span-results');
}

// Function to start the digit span practice game
function startDigitSpanPractice() {
    gameState.isPatternGame = true;
    gameState.isRealGame = false;
    gameState.isBackward = false;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    showScreen('digit-game-area');
    startDigitSequence();
}

// Function to start the backward digit span practice
function startDigitSpanBackwardPractice() {
    gameState.isPatternGame = true;
    gameState.isRealGame = false;
    gameState.isBackward = true;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    console.log("Starting backward digit span practice. isBackward:", gameState.isBackward);
    showScreen('digit-game-area');
    startDigitSequence();
}

// Function to start the real digit span game
function startDigitSpanRealGame() {
    console.log("Starting real forward digit span game");
    gameState.isPatternGame = true;
    gameState.isRealGame = true;
    gameState.isBackward = false;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    
    // Show the digit game area directly
    const digitGameArea = document.getElementById('digit-game-area');
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the digit game area
    digitGameArea.classList.remove('hidden');
    digitGameArea.style.display = 'flex';
    
    // Start the digit sequence
    startDigitSequence();
}

// Function to handle completion of forward digit span practice
function completeForwardDigitSpanPractice() {
    showScreen('digit-span-backward-example');
}

// Function to handle completion of forward digit span real game
function completeForwardDigitSpanRealGame() {
    console.log("Completing forward digit span real game, transitioning to backward mode");
    
    // Reset round counter for backward digit span
    gameState.currentRound = 1;
    
    // Set backward mode
    gameState.isBackward = true;
    
    // Show backward instructions before starting
    showScreen('digit-span-backward-example');
    
    // Add event listener for the backward button if it doesn't exist
    const backwardButton = document.getElementById('startDigitSpanBackwardButton');
    if (backwardButton) {
        // Remove any existing listeners to avoid duplicates
        const newBackwardButton = backwardButton.cloneNode(true);
        backwardButton.parentNode.replaceChild(newBackwardButton, backwardButton);
        
        // Add the correct listener for real game mode
        newBackwardButton.addEventListener('click', () => {
            console.log("Starting backward digit span real game from transition");
            startDigitSpanBackwardRealGame();
        });
    }
}

// Function to save results as JSON
function saveResultsAsJSON(results) {
    const jsonString = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digit_span_results_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to start the real backward digit span game
function startDigitSpanBackwardRealGame() {
    console.log("Starting real backward digit span game");
    gameState.isPatternGame = true;
    gameState.isRealGame = true;
    gameState.isBackward = true;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    
    // Show the digit game area directly
    const digitGameArea = document.getElementById('digit-game-area');
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the digit game area
    digitGameArea.classList.remove('hidden');
    digitGameArea.style.display = 'flex';
    
    // Start the digit sequence
    startDigitSequence();
}
