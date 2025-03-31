// Game Configuration
const CONFIG = {
    practiceMode: { minShapes: 5, maxShapes: 10, displayTime: 1000, blankTime: 250 },
    realMode: { minShapes: 10, maxShapes: 15, displayTime: 1000, blankTime: 250, rounds: 5 },
    countingMode: { minObjects: 5, maxObjects: 10, displayTime: 1000, blankTime: 250 },
    countingRealMode: { minObjects: 10, maxObjects: 15, displayTime: 1000, blankTime: 250, rounds: 5 },
    digitSpanMode: { displayTime: 1000, blankTime: 500, startDigits: 3, maxDigits: 9 },
    patternRecognitionMode: { 
        displayTime: 3000, 
        blankTime: 500, 
        rounds: 5, 
        practiceDifficulty: 'easy',
        realDifficulty: 'medium'
    }
};

// Array of available images for Task 6
const TASK6_IMAGES = [
    'bird', 'flower', 'electriciron', 'bus', 'teacup', 
    'clock', 'cat', 'computer', 'dog', 'fryingpan',
    'elephant', 'guitar', 'house', 'umbrella', 'chair',
    'kettle'
];

// Centralized Timer Management System
const TimerManager = {
    timers: {},
    intervals: {},

    // Set a timeout with automatic cleanup
    setTimeout: function(callback, delay, id) {
        // Clear any existing timeout with this ID
        this.clearTimeout(id);
        
        // Create a new timeout
        const timeoutId = setTimeout(() => {
            // Auto-remove from tracking when it fires
            delete this.timers[id];
            // Execute the callback
            callback();
        }, delay);
        
        // Track this timeout
        if (id) {
            this.timers[id] = timeoutId;
        }
        
        return timeoutId;
    },
    
    // Clear a specific timeout
    clearTimeout: function(id) {
        if (id && this.timers[id]) {
            clearTimeout(this.timers[id]);
            delete this.timers[id];
        }
    },
    
    // Set an interval with automatic tracking
    setInterval: function(callback, delay, id) {
        // Clear any existing interval with this ID
        this.clearInterval(id);
        
        // Create a new interval
        const intervalId = setInterval(callback, delay);
        
        // Track this interval
        if (id) {
            this.intervals[id] = intervalId;
        }
        
        return intervalId;
    },
    
    // Clear a specific interval
    clearInterval: function(id) {
        if (id && this.intervals[id]) {
            clearInterval(this.intervals[id]);
            delete this.intervals[id];
        }
    },
    
    // Clear all timers and intervals
    clearAll: function() {
        // Clear all timeouts
        Object.keys(this.timers).forEach(id => {
            clearTimeout(this.timers[id]);
        });
        this.timers = {};
        
        // Clear all intervals
        Object.keys(this.intervals).forEach(id => {
            clearInterval(this.intervals[id]);
        });
        this.intervals = {};
        
        console.log('All timers and intervals cleared');
    },
    
    // Clear timers by category
    clearCategory: function(category) {
        const pattern = new RegExp(`^${category}`);
        
        // Clear timeouts in this category
        Object.keys(this.timers).forEach(id => {
            if (pattern.test(id)) {
                clearTimeout(this.timers[id]);
                delete this.timers[id];
            }
        });
        
        // Clear intervals in this category
        Object.keys(this.intervals).forEach(id => {
            if (pattern.test(id)) {
                clearInterval(this.intervals[id]);
                delete this.intervals[id];
            }
        });
        
        console.log(`Timers in category '${category}' cleared`);
    }
};

// Ensure key functions are globally accessible
window.startDigitSpanPractice = function() {
    console.log("Global wrapper for startDigitSpanPractice called");
    startDigitSpanPractice();
};

window.startDigitSpanBackwardPractice = function() {
    console.log("Global wrapper for startDigitSpanBackwardPractice called");
    startDigitSpanBackwardPractice();
};

window.submitDigitResponse = function() {
    console.log("Global wrapper for submitDigitResponse called");
    submitDigitSpanResponse();
};

// Game State Management
const gameState = { 
    studentId: null, 
    scheme: null, 
    isRealGame: false,
    isCountingGame: false,
    isPatternGame: false,
    isPatternRecognitionGame: false,
    currentRound: 0, 
    gameResults: [],
    correctCounts: null,
    isBackward: false,
    currentPattern: null,
    currentPatternType: null,
    patternAnswer: null,
    originalShapesData: null,
    movedShapeIndices: null,
    spatialPracticeTimerInterval: null,
    spatialRealTimerInterval: null,
    objectOrder: null
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

// Pattern Recognition Game Functions
const patternTypes = [
    'wordRelationship',
    'categoryMatching', 
    'memoryRecall',
    'visualPattern'
];

const patternData = {
    wordRelationship: {
        easy: [
            { 
                prompt: "Mary and Jane hang out", 
                options: [
                    "Mary and Jane are friends", 
                    "Mary and Jane are not friends"
                ],
                correctAnswer: "Mary and Jane are friends",
                explanation: "Hanging out indicates friendship" 
            },
            { 
                prompt: "John dislikes Peter", 
                options: [
                    "John and Peter are friends", 
                    "John and Peter are not friends"
                ],
                correctAnswer: "John and Peter are not friends",
                explanation: "Disliking indicates they are not friends" 
            }
        ],
        medium: [
            { 
                prompt: "Alice and Bob frequently argue", 
                options: [
                    "Alice and Bob agree on most things", 
                    "Alice and Bob disagree on most things"
                ],
                correctAnswer: "Alice and Bob disagree on most things",
                explanation: "Arguing frequently indicates disagreement" 
            },
            { 
                prompt: "Claire and David collaborate on projects", 
                options: [
                    "Claire and David work well together", 
                    "Claire and David struggle to work together"
                ],
                correctAnswer: "Claire and David work well together",
                explanation: "Collaborating indicates working well together" 
            }
        ]
    },
    categoryMatching: {
        easy: [
            { 
                pairs: [
                    { first: "Teacher", second: "Doctor" },
                    { first: "Cat", second: "Dog" },
                    { first: "Red", second: "Blue" }
                ],
                question: "Which pair belongs to the same category?",
                correctAnswer: ["Teacher – Doctor", "Cat – Dog"],
                explanation: "Teacher and Doctor are professions; Cat and Dog are animals." 
            },
            { 
                pairs: [
                    { first: "Apple", second: "Banana" },
                    { first: "Car", second: "Book" },
                    { first: "Happy", second: "Sad" }
                ],
                question: "Which pair belongs to the same category?",
                correctAnswer: ["Apple – Banana", "Happy – Sad"],
                explanation: "Apple and Banana are fruits; Happy and Sad are emotions." 
            }
        ],
        medium: [
            { 
                pairs: [
                    { first: "Python", second: "JavaScript" },
                    { first: "Guitar", second: "Piano" },
                    { first: "Mercury", second: "Mars" }
                ],
                question: "Which pair belongs to the same category?",
                correctAnswer: ["Python – JavaScript", "Guitar – Piano", "Mercury – Mars"],
                explanation: "Programming languages, musical instruments, and planets." 
            }
        ]
    },
    memoryRecall: {
        easy: [
            { 
                sequence: "8 A Z 5 5 3",
                question: "What was the sequence you saw?",
                options: [
                    "8 A Z 5 5 3",
                    "8 A Z 5 3 5",
                    "8 Z A 5 5 3"
                ],
                correctAnswer: "8 A Z 5 5 3",
                explanation: "The exact sequence shown was 8 A Z 5 5 3" 
            },
            { 
                sequence: "3 7 K L M 9",
                question: "What was the sequence you saw?",
                options: [
                    "3 7 K L M 9",
                    "3 K 7 L M 9",
                    "3 7 L K M 9"
                ],
                correctAnswer: "3 7 K L M 9",
                explanation: "The exact sequence shown was 3 7 K L M 9" 
            }
        ],
        medium: [
            { 
                sequence: "P 4 Q 9 R 2 S",
                question: "What was the sequence you saw?",
                options: [
                    "P 4 Q 9 R 2 S",
                    "P 4 9 Q R 2 S",
                    "P 4 Q 9 2 R S"
                ],
                correctAnswer: "P 4 Q 9 R 2 S",
                explanation: "The exact sequence shown was P 4 Q 9 R 2 S" 
            }
        ]
    },
    visualPattern: {
        easy: [
            { 
                pattern: "○ ○ ○ □ □",
                question: "What comes next in the pattern?",
                options: ["○", "□", "△"],
                correctAnswer: "□",
                explanation: "The pattern follows: 3 circles, then 3 squares" 
            },
            { 
                pattern: "1 2 3 5 8",
                question: "What comes next in the pattern?",
                options: ["9", "11", "13"],
                correctAnswer: "13",
                explanation: "Each number is the sum of the two preceding numbers (Fibonacci sequence)" 
            }
        ],
        medium: [
            { 
                pattern: "A C E G",
                question: "What comes next in the pattern?",
                options: ["H", "I", "J"],
                correctAnswer: "I",
                explanation: "Every other letter in the alphabet (A, C, E, G, I)" 
            }
        ]
    }
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

function handleSchemeSelection(scheme) {
    console.log(`Scheme selected: ${scheme}`);
    gameState.scheme = scheme;
    
    switch (scheme) {
        case '1':
            // Object Span Task
            console.log("Initializing Object Span Task");
            initializeObjectSpanTask(1);
            break;
        case '2':
            // Digit Span Game
            showScreen('pattern-game-intro');
            break;
        case '3':
            // Shape Counting Game
            showScreen('welcome');
            break;
        case '4':
            // Counting Game
            showScreen('counting-game-intro');
            break;
        case '5':
            // Spatial Working Memory Task
            showScreen('spatial-memory-intro');
            break;
        case '6':
            // Ecological Spatial Memory Task
            showScreen('task-6-intro');
            break;
        case '7':
            // Deductive Reasoning Task
            showScreen('task-7-intro');
            break;
        case '8':
            // Task 8
            showScreen('task-8-intro');
            break;
        default:
            console.error('Invalid scheme selected');
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
    // Clear any existing shape animation timers before starting a new animation
    TimerManager.clearCategory('shapeAnim');
    
    let index = 0;
    const shapeElement = document.querySelector('.shape');
    const shapeConfig = gameState.isRealGame ? CONFIG.realMode : CONFIG.practiceMode;
    
    function displayNext() {
        if (index >= sequence.length) {
            shapeElement.className = 'shape blank';
            
            TimerManager.setTimeout(() => {
                // Reset game area display
                const gameArea = document.getElementById('game-area');
                gameArea.style.display = 'none';
                gameArea.classList.add('hidden');
                
                // Show answer form
                showScreen('answer-form');
            }, 500, 'shapeAnim_showAnswer');
            
            return;
        }
        
        // Clear all classes first
        shapeElement.className = 'shape';
        
        // Add a small delay before showing the next shape
        TimerManager.setTimeout(() => {
            // Add the specific shape class
            shapeElement.classList.add(sequence[index]);
            
            // Display for the configured time
            TimerManager.setTimeout(() => {
                // Hide the shape
            shapeElement.className = 'shape blank';
                
                // Wait during blank time before showing next shape
                TimerManager.setTimeout(() => {
                index++;
                displayNext();
                }, shapeConfig.blankTime, 'shapeAnim_blankTime_' + index);
                
            }, shapeConfig.displayTime, 'shapeAnim_displayTime_' + index);
            
        }, 50, 'shapeAnim_delay_' + index);
    }
    
    // Start the display sequence
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
    // Clear all active timers whenever we transition screens
    TimerManager.clearAll();
    
    // Hide the current screen
    const currentScreen = document.getElementById(hideId);
    if (currentScreen) {
        currentScreen.classList.add('hidden');
    }
    
    // Show the target screen
    showScreen(showId);
}

function finishGame() {
    // Clear all timers before finishing the game
    TimerManager.clearAll();
    
    // Hide all screens except the completion screen
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the completion screen
    document.getElementById('game-complete').classList.remove('hidden');
    
    // Export the results as a CSV file
    exportCSV(gameState.results);
    
    // Reset the game state for another attempt if needed
    resetGameState();
}

/**
 * Exports experiment data in the required CSV format
 * @param {Object} results - The experiment results
 */
function exportCSV(results) {
    // Determine task type from the results
    const taskType = results.gameResults && results.gameResults[0] ? results.gameResults[0].task : 'unknown';
    
    let csvHeader, csvRows = [];
    
    if (taskType === 'ecological_spatial_memory') {
        // Ecological Spatial Memory task headers
        csvHeader = [
            'participant_id',
            'counter_balance',
            'task_type',
            'trial_number',
            'timestamp',
            'correct_count',
            'incorrect_count',
            'total_score',
            'accuracy_percentage',
            'original_positions',
            'final_positions',
            'moved_indices',
            'selected_indices'
        ].join(',');
        
        // Process ecological spatial memory trials
        results.gameResults.forEach((trial, index) => {
            const totalPossible = trial.movedIndices.length;
            const accuracyPercentage = totalPossible > 0 ? 
                ((trial.correctCount / totalPossible) * 100).toFixed(2) : '0.00';
            
            const row = {
                participant_id: results.studentId || 'unknown',
                counter_balance: results.scheme || 'unknown',
                task_type: 'ecological_spatial_memory',
                trial_number: index + 1,
                timestamp: trial.timestamp,
                correct_count: trial.correctCount,
                incorrect_count: trial.incorrectCount,
                total_score: trial.totalScore,
                accuracy_percentage: accuracyPercentage,
                original_positions: JSON.stringify(trial.originalPositions || []),
                final_positions: JSON.stringify(trial.finalPositions || []),
                moved_indices: JSON.stringify(trial.movedIndices || []),
                selected_indices: JSON.stringify(trial.selectedIndices || [])
            };
            
            csvRows.push(Object.values(row).map(value => 
                typeof value === 'string' && value.includes(',') ? 
                `"${value}"` : value
            ).join(','));
        });
    } else if (taskType === 'spatial_working_memory') {
        // Spatial Working Memory task headers
        
        csvHeader = [
            'participant_id',
            'counter_balance',
            'task_type',
            'trial_number',
            'timestamp',
            'study_time',
            'total_shapes',
            'shapes_moved',
            'shapes_selected',
            'correct_selections',
            'incorrect_selections',
            'total_score',
            'accuracy_percentage',
            'original_positions',
            'final_positions',
            'moved_shape_indices',
            'selected_shape_indices'
        ].join(',');
        
        // Process spatial memory trials
        results.gameResults.forEach((trial, index) => {
            const totalPossible = trial.movedShapesCount * 2;
            const accuracyPercentage = totalPossible > 0 ? 
                ((trial.correctCount / totalPossible) * 100).toFixed(2) : '0.00';
            
            const row = {
                participant_id: results.studentId || 'unknown',
                counter_balance: results.scheme || 'unknown',
                task_type: 'spatial_working_memory',
                trial_number: index + 1,
                timestamp: trial.timestamp,
                study_time: trial.studyTime || 'unknown',
                total_shapes: trial.totalShapes || 20,
                shapes_moved: trial.movedShapesCount * 2,
                shapes_selected: trial.correctCount + trial.incorrectCount,
                correct_selections: trial.correctCount,
                incorrect_selections: trial.incorrectCount,
                total_score: trial.totalScore,
                accuracy_percentage: accuracyPercentage,
                original_positions: JSON.stringify(trial.originalPositions || []),
                final_positions: JSON.stringify(trial.finalPositions || []),
                moved_shape_indices: JSON.stringify(trial.movedIndices || []),
                selected_shape_indices: JSON.stringify(trial.selectedIndices || [])
            };
            
            csvRows.push(Object.values(row).map(value => 
                typeof value === 'string' && value.includes(',') ? 
                `"${value}"` : value
            ).join(','));
        });
    } else if (taskType === 'deductive_reasoning') {
        // Deductive Reasoning task headers
        csvHeader = [
            'participant_id',
            'counter_balance',
            'task_type',
            'puzzle_number',
            'timestamp',
            'question',
            'selected_cards',
            'correct_cards',
            'is_correct'
        ].join(',');
        
        // Process deductive reasoning trials
        results.gameResults.forEach((trial, index) => {
            const row = {
                participant_id: results.studentId || 'unknown',
                counter_balance: results.scheme || 'unknown',
                task_type: 'deductive_reasoning',
                puzzle_number: trial.puzzleIndex + 1,
                timestamp: trial.timestamp,
                question: trial.question,
                selected_cards: JSON.stringify(trial.selectedCards || []),
                correct_cards: JSON.stringify(trial.correctCards || []),
                is_correct: trial.isCorrect
            };
            
            csvRows.push(Object.values(row).map(value => 
                typeof value === 'string' && value.includes(',') ? 
                `"${value}"` : value
            ).join(','));
        });
    } else {
        // Generic headers for other tasks
        csvHeader = [
            'participant_id',
            'counter_balance',
            'task_type',
            'trial_number',
            'timestamp',
            'correct_count',
            'incorrect_count',
            'total_score',
            'user_response',
            'correct_response',
            'is_backward',
            'additional_data'
        ].join(',');
        
        // Process other task trials
        results.gameResults.forEach((trial, index) => {
            const row = {
                participant_id: results.studentId || 'unknown',
                counter_balance: results.scheme || 'unknown',
                task_type: trial.task || taskType,
                trial_number: index + 1,
                timestamp: trial.timestamp || new Date().toISOString(),
                correct_count: trial.correctCount || 0,
                incorrect_count: trial.incorrectCount || 0,
                total_score: trial.totalScore || 0,
                user_response: JSON.stringify(trial.userResponse || ''),
                correct_response: JSON.stringify(trial.correctResponse || ''),
                is_backward: trial.isBackward || false,
                additional_data: JSON.stringify(trial.additionalData || {})
            };
            
            csvRows.push(Object.values(row).map(value => 
                typeof value === 'string' && value.includes(',') ? 
                `"${value}"` : value
            ).join(','));
        });
    }
    
    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Create timestamp for filename
    const now = new Date();
    const timestamp = now.getFullYear() + 
                     String(now.getMonth() + 1).padStart(2, '0') + 
                     String(now.getDate()).padStart(2, '0') + '_' +
                     String(now.getHours()).padStart(2, '0') + 
                     String(now.getMinutes()).padStart(2, '0');
    
    // Create and download CSV file
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `${taskType}_results_${results.studentId}_${timestamp}.csv`;
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
    // Output debug information
    console.log("DOM Content Loaded - Running diagnostics");
    
    // Check critical elements
    const criticalElements = [
        'digit-game-area',
        'digit-span-response',
        'digit-span-results',
        'startDigitSpanPracticeButton',
        'startDigitSpanBackwardButton',
        'submitDigitResponseButton',
        'nextDigitSpanButton'
    ];
    
    criticalElements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Element check: ${id} - ${element ? 'Found' : 'MISSING'}`);
    });
    
    // Check button connections
    const practiceButton = document.getElementById('startDigitSpanPracticeButton');
    if (practiceButton) {
        console.log('Practice button onclick: ', practiceButton.onclick ? 'Has handler' : 'No handler');
    }
    
    // Log global function availability
    console.log('Global directStartDigitSpanPractice available: ', 
        typeof window.directStartDigitSpanPractice === 'function' ? 'Yes' : 'No');
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Add event listeners for page visibility and unload to clean up timers
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            // Clear all timers when page is hidden
            TimerManager.clearAll();
            console.log('Page visibility hidden - all timers cleared');
        }
    });
    
    window.addEventListener('beforeunload', () => {
        // Clear all timers before page unload
        TimerManager.clearAll();
        console.log('Page unloading - all timers cleared');
    });
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
    console.log(`Showing screen: ${screenId}`);
    
    // Clear all timers when switching screens to prevent overlapping animations or timing issues
    TimerManager.clearAll();
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
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
    
    // Show the selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        
        // Special handling for digit-game-area
        if (screenId === 'digit-game-area') {
            targetScreen.style.display = 'flex';
        }
        
        console.log(`Screen "${screenId}" should now be visible`);
    } else {
        console.error(`Screen with ID "${screenId}" not found`);
    }
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
            handleSchemeSelection(scheme);
        });
    });

    // Spatial Memory Task intro screen
    document.getElementById('spatialMemoryIntroButton')?.addEventListener('click', () => {
        startSpatialPractice();
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

    // Digit span game example screen and practice game (combined)
    document.getElementById('startDigitSpanPracticeButton').addEventListener('click', function() {
        console.log("Starting digit span practice from button click");
        startDigitSpanPractice();
    });

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

    // Pattern Recognition Game
    document.getElementById('patternRecognitionIntroButton').addEventListener('click', function() {
        showScreen('pattern-recognition-example');
    });

    document.getElementById('startPatternPracticeButton').addEventListener('click', function() {
        startPatternGame(false); // false = practice mode
    });

    function startPatternGame(isReal) {
        gameState.isRealGame = isReal;
        gameState.isPatternRecognitionGame = true;
        gameState.currentRound = isReal ? 1 : 0;
        
        if (isReal) {
            document.getElementById('round-number').textContent = gameState.currentRound;
            showScreen('round-start');
        } else {
            showPatternGame();
        }
    }

    function showPatternGame() {
        // Hide all screens except the pattern game area
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.add('hidden'));
        
        const gameArea = document.getElementById('pattern-game-area');
        gameArea.classList.remove('hidden');
        
        // Select a random pattern type
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        gameState.currentPatternType = patternType;
        
        // Select difficulty based on game mode
        const difficulty = gameState.isRealGame ? 
            CONFIG.patternRecognitionMode.realDifficulty : 
            CONFIG.patternRecognitionMode.practiceDifficulty;
        
        // Get patterns for the selected type and difficulty
        const patterns = patternData[patternType][difficulty];
        
        // Select a random pattern
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        gameState.currentPattern = pattern;
        
        // Display pattern based on type
        displayPattern(patternType, pattern);
    }

    function displayPattern(patternType, pattern) {
        const contentArea = document.querySelector('.pattern-content');
        contentArea.innerHTML = '';
        
        const responseArea = document.querySelector('.response-area');
        responseArea.innerHTML = '';
        
        // Set up content based on pattern type
        switch(patternType) {
            case 'wordRelationship':
                contentArea.innerHTML = `<h2>Word Relationship</h2><p class="pattern-prompt">${pattern.prompt}</p>`;
                break;
                
            case 'categoryMatching':
                contentArea.innerHTML = `<h2>Category Matching</h2>`;
                const pairsContainer = document.createElement('div');
                pairsContainer.className = 'pairs-container';
                
                pattern.pairs.forEach(pair => {
                    const pairElement = document.createElement('div');
                    pairElement.className = 'pair';
                    pairElement.innerHTML = `<span>${pair.first} – ${pair.second}</span>`;
                    pairsContainer.appendChild(pairElement);
                });
                
                contentArea.appendChild(pairsContainer);
                contentArea.innerHTML += `<p class="pattern-question">${pattern.question}</p>`;
                break;
                
            case 'memoryRecall':
                contentArea.innerHTML = `<h2>Memory Recall</h2><p class="pattern-sequence">${pattern.sequence}</p>`;
                
                // Hide sequence after display time and show answer form
                setTimeout(() => {
                    contentArea.innerHTML = `<h2>Memory Recall</h2><p class="pattern-question">${pattern.question}</p>`;
                    showPatternAnswerForm(patternType, pattern);
                }, CONFIG.patternRecognitionMode.displayTime);
                return; // Exit early to prevent showing answer form immediately
                
            case 'visualPattern':
                contentArea.innerHTML = `<h2>Visual Pattern</h2><p class="pattern-sequence">${pattern.pattern}</p>`;
                contentArea.innerHTML += `<p class="pattern-question">${pattern.question}</p>`;
                break;
        }
        
        // Show answer form after display time for all except memory recall (which is handled separately)
        if (patternType !== 'memoryRecall') {
            setTimeout(() => {
                showPatternAnswerForm(patternType, pattern);
            }, CONFIG.patternRecognitionMode.displayTime);
        }
    }

    function showPatternAnswerForm(patternType, pattern) {
        // Hide game area and show answer form
        document.getElementById('pattern-game-area').classList.add('hidden');
        const answerForm = document.getElementById('pattern-answer-form');
        answerForm.classList.remove('hidden');
        
        const responseContainer = document.getElementById('pattern-response-container');
        responseContainer.innerHTML = '';
        
        // Create response interface based on pattern type
        switch(patternType) {
            case 'wordRelationship':
                pattern.options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'pattern-option';
                    optionElement.innerHTML = `
                        <input type="radio" name="wordRelationship" value="${option}" id="${option.replace(/\s+/g, '-')}">
                        <label for="${option.replace(/\s+/g, '-')}">${option}</label>
                    `;
                    responseContainer.appendChild(optionElement);
                });
                break;
                
            case 'categoryMatching':
                pattern.pairs.forEach(pair => {
                    const pairElement = document.createElement('div');
                    pairElement.className = 'pattern-option';
                    const pairText = `${pair.first} – ${pair.second}`;
                    pairElement.innerHTML = `
                        <input type="checkbox" name="categoryMatching" value="${pairText}" id="${pairText.replace(/\s+/g, '-')}">
                        <label for="${pairText.replace(/\s+/g, '-')}">${pairText}</label>
                    `;
                    responseContainer.appendChild(pairElement);
                });
                break;
                
            case 'memoryRecall':
            case 'visualPattern':
                pattern.options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'pattern-option';
                    optionElement.innerHTML = `
                        <input type="radio" name="patternResponse" value="${option}" id="${option.replace(/\s+/g, '-')}">
                        <label for="${option.replace(/\s+/g, '-')}">${option}</label>
                    `;
                    responseContainer.appendChild(optionElement);
                });
                break;
        }
    }

    // Handle pattern answer submission
    document.getElementById('submitPatternAnswerButton').addEventListener('click', function() {
        const patternType = gameState.currentPatternType;
        const pattern = gameState.currentPattern;
        let userAnswer = null;
        let isCorrect = false;
        
        // Get user's answer based on pattern type
        switch(patternType) {
            case 'wordRelationship':
            case 'visualPattern':
                const selectedOption = document.querySelector('input[name="patternResponse"]:checked') || 
                                      document.querySelector('input[name="wordRelationship"]:checked');
                userAnswer = selectedOption ? selectedOption.value : null;
                isCorrect = userAnswer === pattern.correctAnswer;
                break;
                
            case 'memoryRecall':
                const selectedMemory = document.querySelector('input[name="patternResponse"]:checked');
                userAnswer = selectedMemory ? selectedMemory.value : null;
                isCorrect = userAnswer === pattern.correctAnswer;
                break;
                
            case 'categoryMatching':
                const selectedPairs = document.querySelectorAll('input[name="categoryMatching"]:checked');
                userAnswer = Array.from(selectedPairs).map(input => input.value);
                
                // Check if user selected the correct number of pairs and all correct pairs
                isCorrect = userAnswer.length === pattern.correctAnswer.length && 
                            pattern.correctAnswer.every(correct => userAnswer.includes(correct));
                break;
        }
        
        // Store results
        if (gameState.isRealGame) {
            storePatternResults(patternType, pattern, userAnswer, isCorrect);
        }
        
        // Show results
        showPatternResults(patternType, pattern, userAnswer, isCorrect);
    });

    function storePatternResults(patternType, pattern, userAnswer, isCorrect) {
        const result = {
            round: gameState.currentRound,
            patternType: patternType,
            prompt: patternType === 'wordRelationship' ? pattern.prompt : 
                    patternType === 'categoryMatching' ? pattern.question : 
                    patternType === 'memoryRecall' ? pattern.sequence : 
                    pattern.pattern,
            correctAnswer: pattern.correctAnswer,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
        };
        
        gameState.gameResults.push(result);
    }

    function showPatternResults(patternType, pattern, userAnswer, isCorrect) {
        const resultsScreen = document.getElementById('pattern-results');
        const feedbackArea = document.getElementById('pattern-feedback');
        
        // Hide answer form and show results
        document.getElementById('pattern-answer-form').classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        // Show feedback
        feedbackArea.innerHTML = `
            <div class="result-status ${isCorrect ? 'correct' : 'incorrect'}">
                <p>${isCorrect ? 'Correct!' : 'Incorrect'}</p>
            </div>
            <div class="result-details">
                <p><strong>Your answer:</strong> ${Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || 'No answer provided'}</p>
                <p><strong>Correct answer:</strong> ${Array.isArray(pattern.correctAnswer) ? pattern.correctAnswer.join(', ') : pattern.correctAnswer}</p>
                <p><strong>Explanation:</strong> ${pattern.explanation}</p>
            </div>
        `;
    }

    // Handle next round after showing results
    document.getElementById('nextPatternRoundButton').addEventListener('click', function() {
        if (gameState.isRealGame) {
            if (gameState.currentRound < CONFIG.patternRecognitionMode.rounds) {
                gameState.currentRound++;
                document.getElementById('round-number').textContent = gameState.currentRound;
                showScreen('round-start');
            } else {
                // Game complete
                showScreen('game-complete');
            }
        } else {
            // Show real game instructions after practice
            showScreen('pattern-recognition-real-intro');
        }
    });

    // Start real pattern recognition game
    document.getElementById('startPatternRealGameButton').addEventListener('click', function() {
        startPatternGame(true); // true = real mode
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
    console.log('Starting counting sequence');
    
    // Set flag to indicate we're in the counting game
    gameState.isCountingGame = true;
    
    // Determine which config to use
    const config = gameState.isRealGame ? CONFIG.countingRealMode : CONFIG.countingMode;
    
    // Generate a sequence of counting objects
    const objectCount = {
        '5dollar': 0,
        'bus': 0,
        'face': 0
    };
    
    // Build a sequence with a random number of each object type
    const sequence = [];
    const objects = ['5dollar', 'bus', 'face'];
    
    // Get random counts for each object
    const billCount = Math.floor(Math.random() * (config.maxObjects / 3)) + 1; // At least 1
    const busCount = Math.floor(Math.random() * (config.maxObjects / 3)) + 1; // At least 1
    const faceCount = Math.floor(Math.random() * (config.maxObjects / 3)) + 1; // At least 1
    
    // Add the correct number of each object to the sequence
    for (let i = 0; i < billCount; i++) sequence.push('5dollar');
    for (let i = 0; i < busCount; i++) sequence.push('bus');
    for (let i = 0; i < faceCount; i++) sequence.push('face');
    
    // Shuffle the sequence
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }
    
    // Store the counts for checking answers
    objectCount['5dollar'] = billCount;
    objectCount['bus'] = busCount;
    objectCount['face'] = faceCount;
    
    console.log('Generated sequence for counting game:', sequence);
    console.log('Correct counts:', objectCount);
    
    // Store the correct counts in the game state
    gameState.correctCounts = objectCount;
    
    // Use the dedicated counting objects animation function
    animateCountingObjects(sequence);
}

// Animate the counting objects
function animateObjects(sequence) {
    // Clear any existing timers
    TimerManager.clearAll();
    
    // Show the game area
    const gameArea = document.getElementById('object-game-area');
    if (gameArea) {
        gameArea.classList.remove('hidden');
    }
    
    // Clear any existing content
    const objectDisplay = document.querySelector('.object-display');
    if (objectDisplay) {
        objectDisplay.innerHTML = '';
    }
    
    // Show each object in sequence
    sequence.forEach((objectDigit, index) => {
        // Show blank screen between objects
        setTimeout(() => {
            objectDisplay.innerHTML = '';
        }, index * (OBJECT_SPAN_CONFIG.displayTime + OBJECT_SPAN_CONFIG.blankTime), 'objectSpan_blankTime_' + index);
        
        // Show the object
        setTimeout(() => {
            const objectData = OBJECT_SPAN_CONFIG.objectMapping[objectDigit];
            if (objectData) {
                const img = document.createElement('img');
                img.src = objectData.image;
                img.alt = objectData.name;
                img.className = 'object-image';
                objectDisplay.appendChild(img);
            }
        }, index * (OBJECT_SPAN_CONFIG.displayTime + OBJECT_SPAN_CONFIG.blankTime) + OBJECT_SPAN_CONFIG.blankTime, 'objectSpan_displayTime_' + index);
    });
    
    // After showing all objects, show the response screen
    const totalTime = sequence.length * (OBJECT_SPAN_CONFIG.displayTime + OBJECT_SPAN_CONFIG.blankTime);
    setTimeout(() => {
        showObjectSpanResponse();
    }, totalTime + 500); // Add a small delay after the last object
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
    
    // Force DOM update to ensure digit element exists
    setTimeout(() => {
        // Check if digit element exists
        const digitElement = document.querySelector('.digit');
        if (digitElement) {
            console.log("Found digit display element, animating sequence");
    // Display the sequence
    animateDigits(sequence);
        } else {
            console.error("Digit element not found. Creating one...");
            
            // Get digit game area
            const digitGameArea = document.getElementById('digit-game-area');
            if (digitGameArea) {
                // Clear existing content
                digitGameArea.innerHTML = '<div class="digit" style="font-size: 5rem; font-weight: bold;"></div>';
                
                // Try animating again
                setTimeout(() => animateDigits(sequence), 100);
            } else {
                console.error("Fatal error: digit-game-area element not found");
                alert("There was an error displaying the digit sequence. Please refresh the page.");
            }
        }
    }, 100);
}

// Function to animate digits one by one
function animateDigits(sequence) {
    console.log('Starting digit animation with sequence:', sequence);
    
    let index = 0;
    const digitElement = document.querySelector('.digit');
    
    if (!digitElement) {
        console.error('Digit element not found in the DOM');
        return;
    }
    
    const config = CONFIG.digitSpanMode;
    console.log('Using config:', config);

    function showNextDigit() {
        if (index >= sequence.length) {
            console.log('Sequence complete, clearing digit display');
            digitElement.textContent = '';
            
            TimerManager.setTimeout(() => {
                console.log('Showing response screen');
                showScreen('digit-span-response');
                
                // Focus on the input field
                const inputField = document.getElementById('digit-response');
                if (inputField) {
                    inputField.value = '';
                    inputField.focus();
                }
            }, 500, 'digitSpan_showResponse');
            
            return;
        }

        console.log(`Showing digit ${sequence[index]} at index ${index}`);
        digitElement.textContent = sequence[index];
        digitElement.style.fontSize = '5rem'; // Make sure the digit is large and visible
        
        TimerManager.setTimeout(() => {
            console.log(`Hiding digit ${sequence[index]}`);
            digitElement.textContent = '';
            
            TimerManager.setTimeout(() => {
                index++;
                showNextDigit();
            }, config.blankTime, 'digitSpan_blankTime');
            
        }, config.displayTime, 'digitSpan_displayTime');
    }

    // Start showing the first digit
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
    console.log('Starting Digit Span Practice - setting game state');
    
    // Set the game state
    gameState.isPatternGame = true;
    gameState.isRealGame = false;
    gameState.isBackward = false;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    
    console.log('Current game state:', 
        'isPatternGame:', gameState.isPatternGame,
        'isRealGame:', gameState.isRealGame,
        'isBackward:', gameState.isBackward
    );
    
    // Get the digit game area element
    const digitGameArea = document.getElementById('digit-game-area');
    if (!digitGameArea) {
        console.error('digit-game-area element not found!');
        return;
    }
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the digit game area with proper styling
    digitGameArea.classList.remove('hidden');
    digitGameArea.style.display = 'flex';
    
    console.log('Digit game area should now be visible');
    
    // Start the digit sequence
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

// Task Initialization Functions
function startTask1aPractice() {
    console.log("Starting Task 1a Practice");
    // Initialize task 1a practice logic here
    showScreen('task-1a-practice');
}

function startTask1bPractice() {
    console.log("Starting Task 1b Practice");
    // Initialize task 1b practice logic here
    showScreen('task-1b-practice');
}

function startTask2aPractice() {
    console.log("Starting Task 2a Practice");
    // Initialize task 2a practice logic here
    showScreen('task-2a-practice');
}

function startTask2bPractice() {
    console.log("Starting Task 2b Practice");
    // Initialize task 2b practice logic here
    showScreen('task-2b-practice');
}

function startTask3aPractice() {
    console.log("Starting Task 3a Practice");
    // Initialize task 3a practice logic here
    showScreen('task-3a-practice');
}

function startTask3bPractice() {
    console.log("Starting Task 3b Practice");
    // Initialize task 3b practice logic here
    showScreen('task-3b-practice');
}

function startTask4aPractice() {
    console.log("Starting Task 4a Practice");
    // Initialize task 4a practice logic here
    showScreen('task-4a-practice');
}

function startTask4bPractice() {
    console.log("Starting Task 4b Practice");
    // Initialize task 4b practice logic here
    showScreen('task-4b-practice');
}

// Event Listeners for Task Buttons
// Event listener removed and replaced with safe version below
// Event listener removed and replaced with safe version below
// Event listener removed and replaced with safe version below
// Event listener removed and replaced with safe version below
// Event listener removed and replaced with safe version below
// Event listener removed and replaced with safe version below
// Event listener removed and replaced with safe version below
// Event listener removed and replaced with safe version below

// Object Span Game Configuration
const OBJECT_SPAN_CONFIG = {
    displayTime: 1500,  // 1.5 seconds to show each object
    blankTime: 750,     // 0.75 seconds between objects
    startObjects: 3,    // Starting span length
    minSpan: 3,         // Starting span length
    maxSpan: 10,        // Maximum span length
    attemptsPerSpan: 2, // Number of attempts allowed at each span length
    mainTaskRounds: 8,  // Number of rounds in the main task (from 3 to 10 objects)
    objectMapping: {
        1: { name: 'bread', image: 'images/Bread.png' },
        2: { name: 'car', image: 'images/Car.png' },
        3: { name: 'book', image: 'images/Book.png' },
        4: { name: 'bag', image: 'images/Bag.png' },
        5: { name: 'chair', image: 'images/Chair.png' },
        6: { name: 'computer', image: 'images/Computer.png' },
        7: { name: 'money', image: 'images/Money.png' },
        8: { name: 'pot', image: 'images/Pot.png' },
        9: { name: 'shoe', image: 'images/Shoe.png' }
    }
};

// Object Span Game State
const objectSpanState = {
    sequence: [],           // Current sequence being shown
    isRealGame: false,      // Whether we're in the real game or practice
    currentSpan: 3,         // Current span length (start with 3)
    currentAttempt: 1,      // Current attempt at this span length (1 or 2)
    currentRound: 1,        // Current round in main task (1-8)
    maxSpanReached: 0,      // Maximum span length successfully reached (our final score)
    results: [],            // Store all results
    practiceAttempts: 0,    // Number of practice attempts
    readyForMainTask: false, // Whether participant has indicated readiness for main task
    lastAttemptTime: 0,     // Timestamp of last attempt to prevent double counting
    lastResponse: '',       // Store the last response for display in feedback
    isBackward: false       // Whether we're in backward recall mode
};

// Event listeners for Object Span game
document.getElementById('objectSpanIntroButton')?.addEventListener('click', function() {
    showScreen('object-span-example');
});

document.getElementById('objectSpanGoBackButton')?.addEventListener('click', function() {
    showScreen('object-span-intro');
});

document.getElementById('startObjectSpanPracticeButton')?.addEventListener('click', function() {
    console.log('Starting object span practice from button click');
    // Ensure we reset the practice attempts counter to 0
    objectSpanState.practiceAttempts = 0;
    startObjectSpanPractice();
});

document.getElementById('startObjectSpanBackwardButton')?.addEventListener('click', function() {
    startObjectSpanBackwardPractice();
});

document.getElementById('submitObjectResponseButton')?.addEventListener('click', function() {
    submitObjectSpanResponse();
});

document.getElementById('nextObjectSpanButton')?.addEventListener('click', function() {
    if (objectSpanState.isRealGame) {
        startObjectSequence();
    } else {
        if (objectSpanState.isBackward) {
            completeBackwardObjectSpanPractice();
        } else {
            completeForwardObjectSpanPractice();
        }
    }
});

document.getElementById('startObjectSpanRealGameButton')?.addEventListener('click', function() {
    startObjectSpanRealGame();
});

document.getElementById('finishObjectSpanButton')?.addEventListener('click', function() {
    showScreen('counter-balance');
});

// Object Span Game Functions
function startObjectSpanPractice() {
    console.log('Starting object span practice');
    
    // Reset practice state
    objectSpanState.isRealGame = false;
    objectSpanState.currentSpan = OBJECT_SPAN_CONFIG.minSpan;
    objectSpanState.currentAttempt = 1;
    objectSpanState.practiceAttempts = 0;
    objectSpanState.readyForMainTask = false;
    objectSpanState.results = [];
    
    // Update debug info
    const debugEl = document.getElementById('object-debug');
    if (debugEl) {
        debugEl.textContent = `Debug: Practice starting with span ${objectSpanState.currentSpan}`;
    }
    
    // Show game area
    showScreen('object-game-area');
    
    // Start sequence with minimum span length
    startObjectSequence();
}

function startObjectSpanBackwardPractice() {
    console.log('Starting object span backward practice');
    
    // Clear any existing timers
    TimerManager.clearAll();
    
    // Set game flags
    gameState.isPatternGame = false;
    gameState.isRealGame = false;
    gameState.isBackward = true;
    gameState.currentRound = 0;
    gameState.correctCounts = null;
    
    // Reset object span state to starting level
    objectSpanState.currentLevel = OBJECT_SPAN_CONFIG.startObjects;
    objectSpanState.isBackward = true;
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
    
    // Show object game area
    const objectGameArea = document.getElementById('object-game-area');
    if (objectGameArea) {
        objectGameArea.classList.remove('hidden');
        objectGameArea.style.display = 'flex';
    } else {
        console.error('Object game area not found');
        return;
    }
    
    // Generate a sequence of random objects
    const sequence = generateObjectSequence(OBJECT_SPAN_CONFIG.startObjects);
    objectSpanState.sequence = sequence;
    
    // Log the sequence (for debugging)
    console.log("Object Sequence (backward):", sequence.map(d => OBJECT_SPAN_CONFIG.objectMapping[d].name).join(' '));
    
    // Start animating the objects with delay to ensure everything is ready
    setTimeout(() => {
        // Start the animation
        animateObjects(sequence);
    }, 300);
}

function startObjectSpanRealGame() {
    objectSpanState.isRealGame = true;
    objectSpanState.isBackward = false;
    objectSpanState.currentSpan = OBJECT_SPAN_CONFIG.minSpan; // Start with minSpan (3)
    objectSpanState.currentAttempt = 1;
    objectSpanState.currentRound = 1;
    objectSpanState.maxSpanReached = 0;
    objectSpanState.results = [];
    
    startObjectSequence();
}

function startObjectSequence() {
    console.log('Starting object sequence with span:', objectSpanState.currentSpan);
    
    // Clear any existing timers that might be preventing progress
    TimerManager.clearAll();
    
    // Clear any existing content in the display
    const objectDisplay = document.querySelector('.object-display');
    if (objectDisplay) {
        objectDisplay.innerHTML = '';
    }
    
    // Make sure game area is visible
    const gameArea = document.getElementById('object-game-area');
    if (gameArea) {
        gameArea.classList.remove('hidden');
    }
    
    // Update debug element with current state
    const debugEl = document.getElementById('object-debug');
    if (debugEl) {
        debugEl.textContent = `Debug: Generating sequence span=${objectSpanState.currentSpan}, attempt=${objectSpanState.currentAttempt}, round=${objectSpanState.currentRound}`;
    }
    
    // Generate a sequence of digits from 1-9 of the current span length
    const objectSequence = [];
    // Use currentSpan instead of currentLevel
    for (let i = 0; i < objectSpanState.currentSpan; i++) {
        // Use all digits 1-9 since we have all 9 images
        const objectDigit = Math.floor(Math.random() * 9) + 1;
        objectSequence.push(objectDigit);
    }
    
    objectSpanState.sequence = objectSequence;
    
    console.log("Object Sequence:", objectSequence.map(d => OBJECT_SPAN_CONFIG.objectMapping[d].name).join(' '));
    
    // Show the game area and animate the digits
    showScreen('object-game-area');
    
    // Update debug again to confirm we're starting animation
    if (debugEl) {
        debugEl.textContent = `Debug: Starting animation for ${objectSequence.length} objects`;
    }
    
    // Force the game area to be visible before animation with a slightly longer delay
    setTimeout(() => {
        try {
    // Start the animation
    animateObjects(objectSequence);
        } catch (error) {
            console.error("Error starting animation:", error);
            if (debugEl) {
                debugEl.textContent = `ERROR: ${error.message}`;
                debugEl.style.color = 'red';
            }
        }
    }, 300);
}

function submitObjectSpanResponse() {
    // Debug info
    console.log('Submit object span response called');
    
    // Get the input element
    const responseInput = document.getElementById('object-response');
    
    // Make sure we have the input element and it has a value
    if (!responseInput) {
        console.error('Response input element not found!');
        return;
    }
    
    console.log('Current state:', {
        isRealGame: objectSpanState.isRealGame,
        currentSpan: objectSpanState.currentSpan,
        currentAttempt: objectSpanState.currentAttempt,
        practiceAttempts: objectSpanState.practiceAttempts
    });
    
    // Get user's response and normalize it (trim whitespace, lowercase)
    const response = responseInput.value.trim().toLowerCase();
    console.log('Raw input value:', responseInput.value);
    console.log('Processed response value:', response);
    
    // Safety check - don't proceed if response is empty
    if (response.trim() === '') {
        // Remove the alert popup
        return false;
    }
    
    // Get expected sequence of object names
    const expectedSequence = objectSpanState.sequence.map(index => 
        OBJECT_SPAN_CONFIG.objectMapping[index].name
    ).join(' ');
    
    console.log('Expected sequence:', expectedSequence);
    console.log('User response:', response);
    
    // More flexible comparison:
    // 1. Normalize both strings by removing extra spaces
    // 2. Compare the normalized strings
    const normalizedExpected = expectedSequence.replace(/\s+/g, ' ').trim();
    const normalizedResponse = response.replace(/\s+/g, ' ').trim();
    
    let isCorrect = false;
    
    // First try exact match
    if (normalizedResponse === normalizedExpected) {
        isCorrect = true;
    } 
    // Then try checking if all the object names are present in the right order
    else {
        const expectedObjects = normalizedExpected.split(' ');
        const responseObjects = normalizedResponse.split(' ');
        
        // Only consider it correct if the number of objects matches
        if (expectedObjects.length === responseObjects.length) {
            isCorrect = true;
            // Check each object
            for (let i = 0; i < expectedObjects.length; i++) {
                if (expectedObjects[i] !== responseObjects[i]) {
                    isCorrect = false;
                    break;
                }
            }
        }
    }
    
    console.log('Is correct:', isCorrect);
    
    // Show which objects were incorrect (for debugging)
    if (!isCorrect) {
        const expectedObjects = normalizedExpected.split(' ');
        const responseObjects = normalizedResponse.split(' ');
        
        console.log('Expected vs Response:');
        for (let i = 0; i < Math.max(expectedObjects.length, responseObjects.length); i++) {
            const expected = expectedObjects[i] || 'missing';
            const response = responseObjects[i] || 'missing';
            const match = expected === response ? '✓' : '✗';
            console.log(`Object ${i+1}: ${expected} vs ${response} ${match}`);
        }
    }
    
    // Store the response for display in feedback
    objectSpanState.lastResponse = response;
    
    if (objectSpanState.isRealGame) {
        handleMainTaskResponse(isCorrect);
    } else {
        // Force reset the input field to prevent double submissions
        responseInput.value = '';
        handlePracticeResponse(isCorrect);
    }
}

function handlePracticeResponse(isCorrect) {
    // We're simply going to reset the counter in the feedback display
    // rather than incrementing it to ensure consistency
    
    // Show feedback
    const feedbackScreen = document.getElementById('object-span-practice-feedback');
    const feedbackText = document.getElementById('practice-feedback-text');
    const scoreText = document.getElementById('practice-score');
    
    // Get the user's response from stored state
    const userResponse = objectSpanState.lastResponse || '(no response)';
    const expectedSequence = objectSpanState.sequence.map(index => 
        OBJECT_SPAN_CONFIG.objectMapping[index].name
    ).join(' ');
    
    if (isCorrect) {
        feedbackText.textContent = 'Correct! Well done!';
        feedbackText.className = 'feedback-correct';
    } else {
        feedbackText.innerHTML = `Incorrect. Keep practicing!<br><br>Your answer: "${userResponse}"<br>Expected: "${expectedSequence}"`;
        feedbackText.className = 'feedback-incorrect';
    }
    
    // Display the actual practice number (start from 1 not 0)
    objectSpanState.practiceAttempts = 1; 
    scoreText.textContent = `Practice attempt: ${objectSpanState.practiceAttempts}`;
    
    // Show feedback screen
    showScreen('object-span-practice-feedback');
}

function handleMainTaskResponse(isCorrect) {
    // Store result
    objectSpanState.results.push({
        round: objectSpanState.currentRound,
        span: objectSpanState.currentSpan,
        attempt: objectSpanState.currentAttempt,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
    });
    
    // Update debug info
    const debugEl = document.getElementById('object-debug');
    if (debugEl) {
        debugEl.textContent = `Debug: Round ${objectSpanState.currentRound}/${OBJECT_SPAN_CONFIG.mainTaskRounds}, Span ${objectSpanState.currentSpan}, Attempt ${objectSpanState.currentAttempt}`;
    }
    
    if (isCorrect) {
        // If this was the first attempt at this span length
        if (objectSpanState.currentAttempt === 1) {
            // Move to next span length
            objectSpanState.currentSpan++;
            objectSpanState.currentAttempt = 1;
            objectSpanState.maxSpanReached = Math.max(objectSpanState.maxSpanReached, objectSpanState.currentSpan - 1);
            
            // Check if we've reached the maximum span
            if (objectSpanState.currentSpan > OBJECT_SPAN_CONFIG.maxSpan) {
                // Reached maximum span, end task
                showFinalResults();
                return;
            }
            
            // Check if we've completed all rounds
            objectSpanState.currentRound++;
            if (objectSpanState.currentRound > OBJECT_SPAN_CONFIG.mainTaskRounds) {
                // Completed all rounds, end task
                showFinalResults();
                    return;
                } else {
                // Continue with next span length
                startObjectSequence();
            }
        } else {
            // Second successful attempt, move to next span
            objectSpanState.currentSpan++;
            objectSpanState.currentAttempt = 1;
            objectSpanState.maxSpanReached = Math.max(objectSpanState.maxSpanReached, objectSpanState.currentSpan - 1);
            
            // Check if we've reached the maximum span
            if (objectSpanState.currentSpan > OBJECT_SPAN_CONFIG.maxSpan) {
                // Reached maximum span, end task
                showFinalResults();
                    return;
                }
            
            // Check if we've completed all rounds
            objectSpanState.currentRound++;
            if (objectSpanState.currentRound > OBJECT_SPAN_CONFIG.mainTaskRounds) {
                // Completed all rounds, end task
                showFinalResults();
                return;
            } else {
                // Continue with next span length
                startObjectSequence();
            }
        }
    } else {
        // If this was the first attempt and we haven't exceeded rounds
        if (objectSpanState.currentAttempt === 1 && objectSpanState.currentRound <= OBJECT_SPAN_CONFIG.mainTaskRounds) {
            // Give second attempt at same span length
            objectSpanState.currentAttempt = 2;
            startObjectSequence();
        } else {
            // Failed both attempts or exceeded rounds, end task
            showFinalResults();
            return;
        }
    }
}

function showFinalResults() {
    document.getElementById('max-span-reached').textContent = objectSpanState.maxSpanReached;
    
    const correctSequences = objectSpanState.results.filter(r => r.isCorrect).length;
    document.getElementById('total-correct-sequences').textContent = correctSequences;
    
    // Remove any existing dynamically added elements first
    const resultsContainer = document.getElementById('object-span-results');
    if (resultsContainer) {
        // Remove all paragraphs that don't have an ID (the dynamically added ones)
        const dynamicParagraphs = resultsContainer.querySelectorAll('p:not([id])');
        dynamicParagraphs.forEach(p => p.remove());
        
        // Add information about rounds completed
        const roundsCompletedEl = document.createElement('p');
        roundsCompletedEl.textContent = `Rounds completed: ${objectSpanState.currentRound - 1}/${OBJECT_SPAN_CONFIG.mainTaskRounds}`;
        
        const totalTrialsEl = document.createElement('p');
        totalTrialsEl.textContent = `Total trials: ${objectSpanState.results.length}`;
        
        // Add a final score element based on max span reached
        const finalScoreEl = document.createElement('p');
        finalScoreEl.textContent = `Final Score: ${objectSpanState.maxSpanReached}`;
        finalScoreEl.classList.add('important');
        
        // Insert these elements after the existing content but before the button
        const finishButton = document.getElementById('finishObjectSpanButton');
        if (finishButton) {
            resultsContainer.insertBefore(finalScoreEl, finishButton);
            resultsContainer.insertBefore(roundsCompletedEl, finishButton);
            resultsContainer.insertBefore(totalTrialsEl, finishButton);
    } else {
            resultsContainer.appendChild(finalScoreEl);
            resultsContainer.appendChild(roundsCompletedEl);
            resultsContainer.appendChild(totalTrialsEl);
    }
    }
    
    showScreen('object-span-results');
}

function showObjectSpanResults(result) {
    document.getElementById('user-object-response').textContent = result.userResponse || 'No response provided';
    document.getElementById('correct-object-response').textContent = result.correctResponse;
    
    const feedback = document.getElementById('object-span-result-feedback');
    if (result.isCorrect) {
        feedback.textContent = 'Correct! You remembered the sequence correctly.';
        feedback.className = 'result-feedback correct-answer';
    } else {
        feedback.textContent = 'Incorrect. Try to remember the sequence exactly as shown.';
        feedback.className = 'result-feedback incorrect-answer';
    }
    
    showScreen('object-span-results');
}

function completeForwardObjectSpanPractice() {
    showScreen('object-span-backward-example');
}

function completeBackwardObjectSpanPractice() {
    showScreen('object-span-real-game-instructions');
}

function completeForwardObjectSpanRealGame() {
    objectSpanState.isBackward = true;
    objectSpanState.currentLevel = OBJECT_SPAN_CONFIG.startObjects;
    objectSpanState.successes = 0;
    objectSpanState.failures = 0;
    
    // Show the backward instructions before starting
    showScreen('object-span-backward-example');
}

// Function to start the Spatial Memory Practice
function startSpatialPractice() {
    // Clear any existing timers before starting practice
    clearSpatialTimer();
    
    transitionScreens('spatial-memory-intro', 'spatial-memory-practice-instructions');
    
    // Add listener for the start practice button if it doesn't already have one
    const startPracticeButton = document.getElementById('startSpatialPracticeButton');
    if (startPracticeButton) {
        // Remove any existing listeners to avoid duplicates
        const newStartPracticeButton = startPracticeButton.cloneNode(true);
        startPracticeButton.parentNode.replaceChild(newStartPracticeButton, startPracticeButton);
        
        // Add the new listener
        newStartPracticeButton.addEventListener('click', () => {
            transitionScreens('spatial-memory-practice-instructions', 'spatial-memory-grid');
            initializeSpatialGrid(false); // false = practice mode
        });
    }
    
    // Add listener for the start main task button
    const startMainButton = document.getElementById('startSpatialMainButton');
    if (startMainButton) {
        // Remove any existing listeners to avoid duplicates
        const newStartMainButton = startMainButton.cloneNode(true);
        startMainButton.parentNode.replaceChild(newStartMainButton, startMainButton);
        
        // Add the new listener
        newStartMainButton.addEventListener('click', () => {
            transitionScreens('spatial-memory-real-instructions', 'spatial-memory-grid');
            initializeSpatialGrid(true); // true = real game mode
        });
    }
}

// Function to generate random shapes
function generateRandomShapes(count) {
    const availableShapes = [
        'blackcircle', 'blackpentagon', 'blacksquare', 'blacktraingle',
        'bluecircle', 'blueheart', 'greencircle', 'greenpentagon', 
        'greentraingle', 'purpletraingle', 'redheart', 'redsquare',
        'yellowpentagon', 'yellowsquare'
    ];
    
    const shapesData = [];
    
    for (let i = 0; i < count; i++) {
        const randomShapeIndex = Math.floor(Math.random() * availableShapes.length);
        const shapeName = availableShapes[randomShapeIndex];
        
        shapesData.push({
            name: shapeName,
            position: i
        });
    }
    
    return shapesData;
}

// Function to initialize the grid with shapes
function initializeSpatialGrid(isRealGame) {
    // Clear any existing timer before starting a new one
    clearSpatialTimer();
    
    const gridContainer = document.querySelector('#spatial-memory-grid .grid-container');
    gridContainer.innerHTML = ''; // Clear any previous content
    
    // Get configuration based on game mode
    const config = isRealGame ? 
        { maxShapes: 20, displayTime: 90000 } : // 90 seconds for real game
        { maxShapes: 5, displayTime: 30000 };  // 30 seconds for practice
    
    // Update the timer display
    const timerElement = document.getElementById('spatial-timer');
    const timeInSeconds = config.displayTime / 1000;
    timerElement.textContent = `Time remaining: ${timeInSeconds} seconds`;
    
    // Generate random shapes and their positions
    const shapesData = generateRandomShapes(config.maxShapes);
    
    // Store original positions for comparison later
    gameState.originalShapesData = [...shapesData];
    
    // Reset any existing modified data and selections
    gameState.modifiedShapesData = null;
    gameState.selectedCells = new Set();
    
    // Set the game mode in state
    gameState.isRealSpatialGame = isRealGame;
    
    // Calculate grid dimensions to ensure content fits
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const gridSize = Math.min(screenWidth * 0.8, screenHeight * 0.7);
    
    // Set grid container size
    gridContainer.style.maxWidth = `${gridSize}px`;
    gridContainer.style.maxHeight = `${Math.floor(gridSize * 0.8)}px`;
    
    // Create grid cells with shapes
    shapesData.forEach((shapeData, index) => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = index;
        
        const shapeImg = document.createElement('img');
        shapeImg.src = `shapes/${shapeData.name}.png`;
        shapeImg.alt = shapeData.name;
        shapeImg.className = 'grid-shape';
        
        // Optional: Add a number label to each shape
        const numberLabel = document.createElement('div');
        numberLabel.className = 'cell-number';
        numberLabel.textContent = (index + 1);
        
        cell.appendChild(shapeImg);
        cell.appendChild(numberLabel);
        gridContainer.appendChild(cell);
    });
    
    // Start timer - use a different property based on game mode to prevent interference
    let timeLeft = timeInSeconds;
    const timerProperty = isRealGame ? 'spatialRealTimerInterval' : 'spatialPracticeTimerInterval';
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time remaining: ${timeLeft} seconds`;
        
        if (timeLeft <= 0) {
            clearInterval(gameState[timerProperty]);
            gameState[timerProperty] = null;
            transitionToResponseGrid(isRealGame);
        }
    }, 1000);
    
    // Store timer interval to clear it if needed
    gameState[timerProperty] = timerInterval;
    
    // Allow early submission after a minimum viewing time
    setTimeout(() => {
        // Add a "I'm ready" button after 10 seconds
        const gridElement = document.getElementById('spatial-memory-grid');
        const readyButton = document.createElement('button');
        readyButton.id = 'readyForResponseButton';
        readyButton.textContent = "I'm ready to identify changes";
        readyButton.addEventListener('click', () => {
            // Clear the timer immediately
            clearSpatialTimer();
            transitionToResponseGrid(isRealGame);
        });
        
        // Only add if it doesn't already exist
        if (!document.getElementById('readyForResponseButton')) {
            gridElement.appendChild(readyButton);
        }
    }, 10000); // Allow early submission after 10 seconds
}

// Function to handle transition to response grid
function transitionToResponseGrid(isRealGame) {
    // Clear any remaining timers
    clearSpatialTimer();
    
    // Transition to response screen
    transitionScreens('spatial-memory-grid', 'spatial-memory-response');
    
    // Initialize response grid
    initializeResponseGrid(isRealGame);
}

// Function to clear any active spatial timer
function clearSpatialTimer() {
    // Clear both practice and real game timers
    if (gameState.spatialPracticeTimerInterval) {
        clearInterval(gameState.spatialPracticeTimerInterval);
        gameState.spatialPracticeTimerInterval = null;
    }
    if (gameState.spatialRealTimerInterval) {
        clearInterval(gameState.spatialRealTimerInterval);
        gameState.spatialRealTimerInterval = null;
    }
    
    // Also clear any timers in the timer manager
    TimerManager.clearCategory('spatial');
    
    console.log('All spatial timers cleared');
}

// Function to initialize the response grid
function initializeResponseGrid(isRealGame) {
    const gridContainer = document.querySelector('#spatial-memory-response .grid-container');
    
    // Store the current selections before clearing the container
    const previousSelections = new Set();
    document.querySelectorAll('#spatial-memory-response .grid-cell.selected').forEach(cell => {
        previousSelections.add(parseInt(cell.dataset.index));
    });
    
    gridContainer.innerHTML = ''; // Clear any previous content
    
    // Get the original shapes data
    const originalShapesData = gameState.originalShapesData;
    
    // If we already have modified data, use it; otherwise create it
    if (!gameState.modifiedShapesData) {
    // Create a copy to modify for the response grid
    const modifiedShapesData = [...originalShapesData];
    
    // Determine how many shapes to move based on difficulty
    const shapesToMove = isRealGame ? 
        Math.floor(originalShapesData.length * 0.4) : // 40% of shapes in real game
            Math.min(2, originalShapesData.length - 1);   // 2 shapes in practice
    
    // Move shapes (swap positions)
    const movedIndices = [];
    for (let i = 0; i < shapesToMove; i++) {
        let index1, index2;
        
        // Keep trying until we find a new pair to swap
        do {
            index1 = Math.floor(Math.random() * modifiedShapesData.length);
            index2 = Math.floor(Math.random() * modifiedShapesData.length);
        } while (
            index1 === index2 || 
            movedIndices.includes(index1) || 
            movedIndices.includes(index2)
        );
        
            // Swap the shapes
        [modifiedShapesData[index1], modifiedShapesData[index2]] = 
        [modifiedShapesData[index2], modifiedShapesData[index1]];
        
        // Track which indices were moved
        movedIndices.push(index1, index2);
    }
    
        // Store the modified data and moved indices
        gameState.modifiedShapesData = modifiedShapesData;
    gameState.movedShapeIndices = movedIndices;
    }
    
    // Initialize or restore selected cells tracking
    if (!gameState.selectedCells) {
        gameState.selectedCells = new Set(previousSelections);
    }
    
    // Calculate grid dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const gridSize = Math.min(screenWidth * 0.8, screenHeight * 0.7);
    
    // Set grid container size
    gridContainer.style.maxWidth = `${gridSize}px`;
    gridContainer.style.maxHeight = `${Math.floor(gridSize * 0.8)}px`;
    
    // Create response grid with modified shape positions
    gameState.modifiedShapesData.forEach((shapeData, index) => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell clickable';
        if (gameState.selectedCells.has(index)) {
            cell.classList.add('selected');
        }
        cell.dataset.index = index;
        cell.dataset.originalPosition = shapeData.position;
        
        const shapeImg = document.createElement('img');
        shapeImg.src = `shapes/${shapeData.name}.png`;
        shapeImg.alt = shapeData.name;
        shapeImg.className = 'grid-shape';
        
        // Optional: Add a number label to each shape
        const numberLabel = document.createElement('div');
        numberLabel.className = 'cell-number';
        numberLabel.textContent = (index + 1);
        
        cell.appendChild(shapeImg);
        cell.appendChild(numberLabel);
        
        // Add click event to toggle selection with state tracking
        cell.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent any default behavior
            event.stopPropagation(); // Prevent event bubbling
            const cellIndex = parseInt(cell.dataset.index);
            
            if (gameState.selectedCells.has(cellIndex)) {
                gameState.selectedCells.delete(cellIndex);
                cell.classList.remove('selected');
            } else {
                gameState.selectedCells.add(cellIndex);
                cell.classList.add('selected');
            }
        });
        
        gridContainer.appendChild(cell);
    });
    
    // Set up submission button event
    const submitButton = document.getElementById('submitSpatialResponseButton');
    if (submitButton) {
        // Remove any existing listeners to avoid duplicates
        const newSubmitButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
        
        // Add new listener
        newSubmitButton.addEventListener('click', () => {
            evaluateSpatialResponse(isRealGame);
        });
    }
}

// Function to evaluate the user's response
function evaluateSpatialResponse(isRealGame) {
    clearSpatialTimer();
    
    const selectedCells = document.querySelectorAll('#spatial-memory-response .grid-cell.selected');
    const movedIndices = gameState.movedShapeIndices || [];
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    // Get selected indices
    const selectedIndices = Array.from(selectedCells).map(cell => parseInt(cell.dataset.index));
    
    // Check each selected cell
    selectedCells.forEach(cell => {
        const cellIndex = parseInt(cell.dataset.index);
        if (movedIndices.includes(cellIndex)) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    });
    
    const totalScore = correctCount - incorrectCount;
    const isActuallyRealGame = gameState.isRealSpatialGame || isRealGame;
    
    if (isActuallyRealGame) {
        // Store result with additional data for real game
        gameState.gameResults.push({
            task: 'spatial_working_memory',
            correctCount: correctCount,
            incorrectCount: incorrectCount,
            totalScore: totalScore,
            movedShapesCount: movedIndices.length / 2,
            timestamp: new Date().toISOString(),
            studyTime: gameState.studyStartTime ? 
                (Date.now() - gameState.studyStartTime) / 1000 : null,
            totalShapes: gameState.originalShapesData.length,
            originalPositions: gameState.originalShapesData.map(shape => ({
                name: shape.name,
                position: shape.position
            })),
            finalPositions: gameState.modifiedShapesData.map(shape => ({
                name: shape.name,
                position: shape.position
            })),
            movedIndices: movedIndices,
            selectedIndices: selectedIndices
        });
        
        // Update results display
        document.getElementById('spatial-correct-count').textContent = correctCount;
        document.getElementById('spatial-incorrect-count').textContent = incorrectCount;
        document.getElementById('spatial-total-score').textContent = totalScore;
        
        transitionScreens('spatial-memory-response', 'spatial-memory-results');
        
        // Setup finish button
        const finishButton = document.getElementById('finishSpatialTaskButton');
        if (finishButton) {
            const newFinishButton = finishButton.cloneNode(true);
            finishButton.parentNode.replaceChild(newFinishButton, finishButton);
            
            newFinishButton.addEventListener('click', () => {
                clearSpatialTimer();
                // Export results when finishing the task
                exportCSV({
                    studentId: gameState.studentId,
                    scheme: gameState.scheme,
                    gameResults: gameState.gameResults
                });
                finishGame();
            });
        }
    } else {
        // Practice results handling
        const accuracyElement = document.getElementById('practice-accuracy');
        const totalPossible = movedIndices.length / 2;
        const accuracy = (correctCount / totalPossible) * 100;
        
        if (accuracyElement) {
            accuracyElement.textContent = `You correctly identified ${correctCount} out of ${totalPossible * 2} moved shapes (${accuracy.toFixed(1)}% accuracy).`;
        }
        
        transitionScreens('spatial-memory-response', 'spatial-memory-practice-results');
        
        // Setup start real game button
        const startRealButton = document.getElementById('startSpatialRealButton');
        if (startRealButton) {
            const newStartRealButton = startRealButton.cloneNode(true);
            startRealButton.parentNode.replaceChild(newStartRealButton, startRealButton);
            
            newStartRealButton.addEventListener('click', () => {
                clearSpatialTimer();
                transitionScreens('spatial-memory-practice-results', 'spatial-memory-real-instructions');
                
                // Setup main task button
                const startMainButton = document.getElementById('startSpatialMainButton');
                if (startMainButton) {
                    const newStartMainButton = startMainButton.cloneNode(true);
                    startMainButton.parentNode.replaceChild(newStartMainButton, startMainButton);
                    
                    newStartMainButton.addEventListener('click', () => {
                        clearSpatialTimer();
                        transitionScreens('spatial-memory-real-instructions', 'spatial-memory-grid');
                        initializeSpatialGrid(true); // Start the real game
                    });
                }
            });
        }
    }
}

// Ensure key functions are globally accessible
window.directStartDigitSpanPractice = function() {
    console.log("Direct global access for startDigitSpanPractice");
    
    // Set the game state directly
    gameState.isPatternGame = true;
    gameState.isRealGame = false;
    gameState.isBackward = false;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    
    // Get the digit game area element
    const digitGameArea = document.getElementById('digit-game-area');
    if (!digitGameArea) {
        console.error('digit-game-area element not found!');
        return;
    }
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the digit game area with proper styling
    digitGameArea.classList.remove('hidden');
    digitGameArea.style.display = 'flex';
    
    // Generate and show a digit sequence
    setTimeout(() => {
        // Create a sequence of 3 random digits
        const sequence = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ];
        
        // Store in game state
        gameState.correctSequence = sequence;
        
        // Display the sequence
        const digitElement = document.querySelector('.digit');
        if (!digitElement) {
            digitGameArea.innerHTML = '<div class="digit" style="font-size: 5rem; font-weight: bold;"></div>';
        }
        
        // Show the sequence
        animateDigits(sequence);
    }, 100);
};

// Direct global function for backward digit span practice
window.directStartDigitSpanBackwardPractice = function() {
    console.log("Direct global access for startDigitSpanBackwardPractice");
    
    // Set the game state directly
    gameState.isPatternGame = true;
    gameState.isRealGame = false;
    gameState.isBackward = true;
    gameState.currentRound = 1;
    gameState.correctCounts = null;
    
    // Get the digit game area element
    const digitGameArea = document.getElementById('digit-game-area');
    if (!digitGameArea) {
        console.error('digit-game-area element not found!');
        return;
    }
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the digit game area with proper styling
    digitGameArea.classList.remove('hidden');
    digitGameArea.style.display = 'flex';
    
    // Generate and show a digit sequence
    setTimeout(() => {
        // Create a sequence of 3 random digits
        const sequence = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ];
        
        // Store in game state
        gameState.correctSequence = sequence;
        
        // Display the sequence
        const digitElement = document.querySelector('.digit');
        if (!digitElement) {
            digitGameArea.innerHTML = '<div class="digit" style="font-size: 5rem; font-weight: bold;"></div>';
        }
        
        // Show the sequence
        animateDigits(sequence);
    }, 100);
};

// Direct global function for object span example screen
window.directObjectSpanExample = function() {
    console.log("Direct global access for showing object span example");
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the object span example screen
    const exampleScreen = document.getElementById('object-span-example');
    if (exampleScreen) {
        exampleScreen.classList.remove('hidden');
        console.log('Object span example screen should now be visible');
    } else {
        console.error('object-span-example element not found!');
    }
};

// Direct global function for starting object span practice
window.directStartObjectSpanPractice = function() {
    console.log("Direct global access for starting object span practice");
    
    // Set game state
    objectSpanState.isRealGame = false;
    objectSpanState.isBackward = false;
    objectSpanState.currentLevel = OBJECT_SPAN_CONFIG.startObjects;
    objectSpanState.successes = 0;
    objectSpanState.failures = 0;
    objectSpanState.results = [];
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the object game area
    const gameArea = document.getElementById('object-game-area');
    if (gameArea) {
        gameArea.classList.remove('hidden');
        gameArea.style.display = 'flex';
        console.log('Object game area should now be visible');
        
        // Generate and start an object sequence
        setTimeout(() => {
            // Create a sequence of 3 random object indices
            const sequence = [
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1
            ];
            
            console.log("Starting object sequence:", sequence);
            
            // Get the object display element
            const objectDisplay = document.querySelector('.object-display');
            if (!objectDisplay) {
                gameArea.innerHTML = '<div class="object-display"></div>';
            }
            
            // Show the sequence
            animateObjects(sequence);
        }, 100);
    } else {
        console.error('object-game-area element not found!');
    }
};

// Direct global function for starting backward object span practice
window.directStartObjectSpanBackwardPractice = function() {
    console.log("Direct global access for starting backward object span practice");
    
    // Set game state
    objectSpanState.isRealGame = false;
    objectSpanState.isBackward = true;
    objectSpanState.currentLevel = OBJECT_SPAN_CONFIG.startObjects;
    objectSpanState.successes = 0;
    objectSpanState.failures = 0;
    objectSpanState.results = [];
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the object game area
    const gameArea = document.getElementById('object-game-area');
    if (gameArea) {
        gameArea.classList.remove('hidden');
        gameArea.style.display = 'flex';
        console.log('Object game area should now be visible');
        
        // Generate and start an object sequence
        setTimeout(() => {
            // Create a sequence of 3 random object indices
            const sequence = [
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1
            ];
            
            console.log("Starting object sequence:", sequence);
            
            // Get the object display element
            const objectDisplay = document.querySelector('.object-display');
            if (!objectDisplay) {
                gameArea.innerHTML = '<div class="object-display"></div>';
            }
            
            // Show the sequence
            animateObjects(sequence);
        }, 100);
    } else {
        console.error('object-game-area element not found!');
    }
};

// Comprehensive debugging for all buttons
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - Running comprehensive button diagnostic');
    
    // Check all screens
    const screens = document.querySelectorAll('.screen');
    console.log(`Found ${screens.length} screens`);
    
    // Check all continue buttons throughout the application
    const allButtons = document.querySelectorAll('button');
    console.log(`Found ${allButtons.length} buttons in total`);
    
    const continueButtons = Array.from(allButtons).filter(btn => 
        btn.textContent.toLowerCase().includes('continue'));
    console.log(`Found ${continueButtons.length} continue buttons`);
    
    // Log each continue button and ensure it has an onclick handler
    continueButtons.forEach((btn, index) => {
        const btnId = btn.id || `unnamed-continue-${index}`;
        const hasOnclick = btn.hasAttribute('onclick') || btn.onclick;
        console.log(`Button ${btnId}: Has onclick handler: ${hasOnclick ? 'YES' : 'NO'}`);
        
        // Ensure each continue button has at least a basic handler
        if (!hasOnclick) {
            btn.onclick = function() {
                console.log(`Clicked fallback handler for ${btnId}`);
                // Try to find the parent screen
                let parentScreen = btn.closest('.screen');
                if (parentScreen) {
                    console.log(`Button is in screen: ${parentScreen.id}`);
                    // Apply an automatic fallback based on screen ID
                    if (parentScreen.id === 'object-span-intro') {
                        directObjectSpanExample();
                    } else if (parentScreen.id === 'digit-span-intro') {
                        directStartDigitSpanPractice();
                    } else if (parentScreen.id === 'digit-span-backward-intro') {
                        directStartDigitSpanBackwardPractice();
                    } else if (parentScreen.id === 'object-span-example') {
                        directStartObjectSpanPractice();
                    } else if (parentScreen.id === 'object-span-backward-intro') {
                        directStartObjectSpanBackwardPractice();
                    }
                }
            };
            console.log(`Added fallback handler to ${btnId}`);
        }
    });
    
    // Check for global functions
    console.log('Checking global functions:');
    console.log(`directStartDigitSpanPractice: ${typeof window.directStartDigitSpanPractice === 'function' ? 'Available' : 'Missing'}`);
    console.log(`directStartDigitSpanBackwardPractice: ${typeof window.directStartDigitSpanBackwardPractice === 'function' ? 'Available' : 'Missing'}`);
    console.log(`directObjectSpanExample: ${typeof window.directObjectSpanExample === 'function' ? 'Available' : 'Missing'}`);
    console.log(`directStartObjectSpanPractice: ${typeof window.directStartObjectSpanPractice === 'function' ? 'Available' : 'Missing'}`);
    console.log(`directStartObjectSpanBackwardPractice: ${typeof window.directStartObjectSpanBackwardPractice === 'function' ? 'Available' : 'Missing'}`);
});

// Direct global wrapper functions for better accessibility
window.directObjectSpanExample = function() {
    console.log('Direct object span example function called');
    try {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.add('hidden'));
        
        // Show object span example screen
        const exampleScreen = document.getElementById('object-span-example');
        if (exampleScreen) {
            exampleScreen.classList.remove('hidden');
            console.log('Object span example screen shown');
        } else {
            console.error('Object span example screen element not found');
        }
    } catch (error) {
        console.error('Error in directObjectSpanExample:', error);
    }
};

// Replace the event listeners around line 2130 with safe versions
function addSafeEventListener(id, event, handler) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.warn(`Element with ID '${id}' not found for event listener`);
    }
}

// Safely add event listeners
/*addSafeEventListener('startTask1aPracticeButton', 'click', startTask1aPractice);
addSafeEventListener('startTask1bPracticeButton', 'click', startTask1bPractice);
addSafeEventListener('startTask2aPracticeButton', 'click', startTask2aPractice);
addSafeEventListener('startTask2bPracticeButton', 'click', startTask2bPractice);
addSafeEventListener('startTask3aPracticeButton', 'click', startTask3aPractice);
addSafeEventListener('startTask3bPracticeButton', 'click', startTask3bPractice);
addSafeEventListener('startTask4aPracticeButton', 'click', startTask4aPractice);
addSafeEventListener('startTask4bPracticeButton', 'click', startTask4bPractice);*/

// Animation function for counting objects (dollar bills, buses, faces)
function animateCountingObjects(sequence) {
    // Clear any existing counting object timers before starting a new animation
    TimerManager.clearCategory('countingObj');
    
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
            
            TimerManager.setTimeout(() => {
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
            }, 500, 'countingObj_showAnswer');
            
            return;
        }
        
        // Clear all classes first
        shapeElement.className = 'shape';
        shapeElement.innerHTML = '';
        
        // Add a small delay before showing the next object
        TimerManager.setTimeout(() => {
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
                    TimerManager.setTimeout(() => {
                        // Hide the object
                        shapeElement.className = 'shape blank';
                        shapeElement.innerHTML = '';
                        
                        // Wait during blank time before showing next object
                        TimerManager.setTimeout(() => {
                            index++;
                            displayNext();
                        }, config.blankTime, 'countingObj_blankTime_' + index);
                        
                    }, config.displayTime, 'countingObj_displayTime_' + index);
                };
                
                img.onerror = function() {
                    console.error(`Failed to load image: dollarmanbus/${currentObject}.jpg`);
                    // Continue to next image even if this one fails
                    index++;
                    displayNext();
                };
                
                img.src = `dollarmanbus/${currentObject}.jpg`;
            }
        }, 50, 'countingObj_delay_' + index);
    }
    
    // Start the display sequence
    displayNext();
}

// Direct global function for starting object span practice
window.directStartObjectSpanPractice = function() {
    console.log('Direct start object span practice function called');
    try {
        // Call the normal start function
        startObjectSpanPractice();
    } catch (error) {
        console.error('Error starting object span practice:', error);
    }
};

window.directStartObjectSpanBackwardPractice = function() {
    console.log('Direct start object span backward practice function called');
    try {
        // Call the normal start function
        startObjectSpanBackwardPractice();
    } catch (error) {
        console.error('Error starting object span backward practice:', error);
    }
};

// Direct global functions for Object Span tasks that can be called from inline onclick handlers
window.directObjectSpanExample = function() {
    console.log("Direct Object Span Example function called");
    try {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show object span example screen
        const exampleScreen = document.getElementById('object-span-example');
        if (!exampleScreen) {
            console.error("Could not find object-span-example element");
            return;
        }
        exampleScreen.classList.remove('hidden');
    } catch (error) {
        console.error("Error in directObjectSpanExample:", error);
    }
};

window.directStartObjectSpanPractice = function() {
    console.log("Direct Object Span Practice function called");
    try {
        objectSpanState.isRealGame = false;
        objectSpanState.isBackward = false;
        objectSpanState.currentLevel = OBJECT_SPAN_CONFIG.startObjects;
        objectSpanState.successes = 0;
        objectSpanState.failures = 0;
        objectSpanState.results = [];
        
        // Begin the object sequence
        startObjectSequence();
    } catch (error) {
        console.error("Error in directStartObjectSpanPractice:", error);
    }
};

window.directStartObjectSpanBackwardPractice = function() {
    console.log("Direct Object Span Backward Practice function called");
    try {
        objectSpanState.isRealGame = false;
        objectSpanState.isBackward = true;
        objectSpanState.currentLevel = OBJECT_SPAN_CONFIG.startObjects;
        objectSpanState.successes = 0;
        objectSpanState.failures = 0;
        objectSpanState.results = [];
        
        // Begin the object sequence
        startObjectSequence();
    } catch (error) {
        console.error("Error in directStartObjectSpanBackwardPractice:", error);
    }
};

// Task 6: Completely isolated ecological spatial memory module
const Task6Module = {
    IMAGES: [
        'bird', 'flower', 'electriciron', 'bus', 'teacup', 
        'clock', 'cat', 'computer', 'dog', 'fryingpan',
        'elephant', 'guitar', 'house', 'umbrella', 'chair',
        'kettle'
    ],
    
    state: {
        isRealGame: false,
        originalPositions: [],
        finalPositions: [],
        movedIndices: [],
        results: []
    },
    
    // Shuffle array method (Fisher-Yates algorithm)
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    // Initialize all event listeners for Task 6
    initializeEventListeners: function() {
        document.getElementById('task6ContinueButton')?.addEventListener('click', () => {
            console.log('Task 6 continue button clicked');
            Task6Module.startPractice();
        });
        
        document.getElementById('startTask6GridButton')?.addEventListener('click', () => {
            console.log('Task 6 start grid button clicked');
            Task6Module.startGrid();
        });
        
        document.getElementById('startTask6RealButton')?.addEventListener('click', () => {
            console.log('Task 6 real button clicked');
            Task6Module.startReal();
        });
        
        document.getElementById('submitTask6ResponseButton')?.addEventListener('click', () => {
            console.log('Task 6 submit response button clicked');
            Task6Module.evaluateResponse();
        });
    },
    
    // Screen transition handling specific to Task 6
    startPractice: function() {
        // Clear any existing timers
        TimerManager.clearAll();
        transitionScreens('task-6-intro', 'task-6-practice-instructions');
    },
    
    startGrid: function() {
        transitionScreens('task-6-practice-instructions', 'task-6-grid');
        this.initializeGrid(false); // false = practice mode
    },
    
    startReal: function() {
        transitionScreens('task-6-real-instructions', 'task-6-grid');
        this.initializeGrid(true); // true = real game mode
    },
    
    // Grid initialization specific to Task 6
    initializeGrid: function(isRealGame) {
        const gridContainer = document.querySelector('#task-6-grid .task6-grid-container');
        gridContainer.innerHTML = '';
        
        // Add practice-mode class if in practice mode
        if (!isRealGame) {
            gridContainer.classList.add('practice-mode');
        } else {
            gridContainer.classList.remove('practice-mode');
        }
        
        // Set game state
        this.state.isRealGame = isRealGame;
        
        // Setup grid container
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = `repeat(${isRealGame ? 5 : 3}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${isRealGame ? 4 : 2}, 1fr)`;
        gridContainer.style.gap = isRealGame ? '3px' : '6px'; // Further reduced gap for main task
        gridContainer.style.margin = isRealGame ? '3px auto' : '6px auto';
        gridContainer.style.padding = isRealGame ? '6px' : '8px'; // Further reduced padding for main task
        gridContainer.style.backgroundColor = '#f8f9fa';
        gridContainer.style.borderRadius = '8px';
        gridContainer.style.border = '1px solid #dee2e6'; // Thinner border
        gridContainer.style.boxSizing = 'border-box';
        gridContainer.style.maxWidth = isRealGame ? '95vw' : '65vw'; // Increased width for main task
        gridContainer.style.width = '100%';
        gridContainer.style.maxHeight = isRealGame ? '80vh' : '70vh'; // Increased height for main task
        gridContainer.style.overflow = 'hidden'; // Prevent scrolling
        
        // Reset grid cells
        const totalCells = isRealGame ? 20 : 6; // 5x4 grid for real, 3x2 for practice
        
        // Determine how many images to place
        const totalImages = isRealGame ? 20 : 6; // Using 20 images for real mode (all cells)
        
        // Get enough images, repeating from the list if necessary
        let selectedImages = [];
        while (selectedImages.length < totalImages) {
            const neededImages = totalImages - selectedImages.length;
            const shuffledImages = [...this.IMAGES];
            this.shuffleArray(shuffledImages);
            selectedImages = [...selectedImages, ...shuffledImages.slice(0, neededImages)];
        }
        
        // Position images in grid - for real mode, fill all cells
        const positions = isRealGame ? 
            selectedImages.slice(0, totalCells) : // Fill all cells for real mode
            new Array(totalCells).fill(null);     // Only some cells for practice
            
        // For practice mode, place images in random positions
        if (!isRealGame) {
            // Create and shuffle array of indices
            const indices = Array.from({ length: totalCells }, (_, i) => i);
            this.shuffleArray(indices);
            
            // Select positions for images
            const imagePositions = indices.slice(0, totalImages);
            
            imagePositions.forEach((position, i) => {
                positions[position] = selectedImages[i];
            });
        }
        
        // Store initial positions
        this.state.initialPositions = [...positions];
        
        // Create grid cells
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'task6-grid-cell';
            cell.dataset.index = i;
            
            // Apply styling directly to ensure isolation
            cell.style.position = 'relative';
            cell.style.aspectRatio = '1/1';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.style.backgroundColor = 'white';
            cell.style.border = '1px solid #dee2e6'; // Thinner border
            cell.style.borderRadius = '3px'; // Smaller border radius
            cell.style.padding = isRealGame ? '2px' : '3px'; // Reduced padding
            cell.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; // Lighter shadow
            cell.style.boxSizing = 'border-box';
            cell.style.maxWidth = '100%';
            cell.style.maxHeight = '100%';
            
            if (positions[i]) {
                const img = document.createElement('img');
                img.src = `imagescreen/${positions[i]}.png`;
                img.alt = positions[i];
                img.className = 'task6-grid-image';
                
                // Apply styling directly to ensure isolation
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.padding = isRealGame ? '1px' : '2px'; // Reduced padding for both
                
                cell.appendChild(img);
            }
            
            gridContainer.appendChild(cell);
        }
        
        // Update display timer
        this.updateTimerDisplay();
    },
    
    swapRandomImages: function() {
        // Set number of images to move based on real/practice mode
        const numToMove = this.state.isRealGame ? 3 : 2;
        
        // Get current positions
        const positions = [...this.state.initialPositions];
        const imageIndices = positions.map((p, i) => p ? i : null).filter(i => i !== null);
        
        // Shuffle image indices and select some to move
        this.shuffleArray(imageIndices);
        const indicesToMove = imageIndices.slice(0, numToMove);
        
        // Track which indices were moved (for scoring)
        this.state.movedIndices = indicesToMove;
        
        // Create copy of positions for swapping
        const newPositions = [...positions];
        
        // Create pair of indices to swap
        for (let i = 0; i < indicesToMove.length; i += 2) {
            if (i + 1 < indicesToMove.length) {
                // Swap a pair
                const temp = newPositions[indicesToMove[i]];
                newPositions[indicesToMove[i]] = newPositions[indicesToMove[i + 1]];
                newPositions[indicesToMove[i + 1]] = temp;
            }
        }
        
        // Store the final positions
        this.state.finalPositions = [...newPositions];
        
        // Display final grid
        const gridContainer = document.querySelector('#task-6-grid .task6-grid-container');
        const cells = gridContainer.querySelectorAll('.task6-grid-cell');
        
        // Update the grid display
        cells.forEach((cell, index) => {
            const img = cell.querySelector('img');
            if (img && newPositions[index]) {
                img.src = `imagescreen/${newPositions[index]}.png`;
                img.alt = newPositions[index];
            }
        });

        // Immediately show response screen
        this.showResponseScreen();
    },
    
    // Show response screen and initialize response grid
    showResponseScreen: function() {
        transitionScreens('task-6-grid', 'task-6-response');
        this.initializeResponseGrid();
    },
    
    initializeResponseGrid: function() {
        const responseContainer = document.querySelector('#task-6-response .task6-grid-container');
        responseContainer.innerHTML = '';
        
        // Add practice-mode class if in practice mode
        if (!this.state.isRealGame) {
            responseContainer.classList.add('practice-mode');
        } else {
            responseContainer.classList.remove('practice-mode');
        }
        
        // Apply grid container styling
        responseContainer.style.display = 'grid';
        responseContainer.style.gridTemplateColumns = `repeat(${this.state.isRealGame ? 5 : 3}, 1fr)`;
        responseContainer.style.gridTemplateRows = `repeat(${this.state.isRealGame ? 4 : 2}, 1fr)`;
        responseContainer.style.gap = this.state.isRealGame ? '3px' : '6px'; // Further reduced gap
        responseContainer.style.margin = this.state.isRealGame ? '3px auto' : '6px auto';
        responseContainer.style.padding = this.state.isRealGame ? '6px' : '8px'; 
        responseContainer.style.backgroundColor = '#f8f9fa';
        responseContainer.style.borderRadius = '8px';
        responseContainer.style.border = '1px solid #dee2e6'; // Thinner border
        responseContainer.style.boxSizing = 'border-box';
        responseContainer.style.maxWidth = this.state.isRealGame ? '95vw' : '65vw';
        responseContainer.style.width = '100%';
        responseContainer.style.maxHeight = this.state.isRealGame ? '80vh' : '70vh';
        responseContainer.style.overflow = 'hidden'; // Prevent scrolling
        
        // Copy the final grid state to response grid
        this.state.finalPositions.forEach((imageName, index) => {
            const cell = document.createElement('div');
            cell.className = 'task6-grid-cell';
            cell.dataset.index = index;
            
            // Apply styling directly to ensure isolation
            cell.style.position = 'relative';
            cell.style.aspectRatio = '1/1';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.style.backgroundColor = 'white';
            cell.style.border = '1px solid #dee2e6'; // Thinner border
            cell.style.borderRadius = '3px'; // Smaller border radius
            cell.style.padding = this.state.isRealGame ? '2px' : '3px';
            cell.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; // Lighter shadow
            cell.style.boxSizing = 'border-box';
            cell.style.maxWidth = '100%';
            cell.style.maxHeight = '100%';
            cell.style.cursor = 'pointer';
            cell.style.transition = 'all 0.2s ease';
            
            if (imageName) {
                const img = document.createElement('img');
                img.src = `imagescreen/${imageName}.png`;
                img.alt = imageName;
                img.className = 'task6-grid-image';
                
                // Apply styling directly to ensure isolation
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.padding = this.state.isRealGame ? '1px' : '2px';
                img.style.transition = 'transform 0.2s ease';
                
                cell.appendChild(img);
            }
            
            responseContainer.appendChild(cell);
            
            // Add hover effect
            const img = cell.querySelector('.task6-grid-image');
            if (img) {
                cell.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.05)';
                });
                cell.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            }
            
            // Add click handler
            cell.addEventListener('click', () => {
                cell.classList.toggle('selected');
                if (cell.classList.contains('selected')) {
                    cell.style.backgroundColor = '#d1ecf1';
                    cell.style.border = '3px solid #0d6efd';
                } else {
                    cell.style.backgroundColor = 'white';
                    cell.style.border = '2px solid #dee2e6';
                }
            });
        });
    },
    
    evaluateResponse: function() {
        const selectedCells = document.querySelectorAll('#task-6-response .task6-grid-cell.selected');
        const selectedIndices = Array.from(selectedCells).map(cell => parseInt(cell.dataset.index));
        
        let correctCount = 0;
        let incorrectCount = 0;
        
        // Check each selected cell
        selectedIndices.forEach(index => {
            if (this.state.movedIndices.includes(index)) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });
        
        const totalScore = correctCount - incorrectCount;
        
        if (this.state.isRealGame) {
            // Store results for real game
            const result = {
                task: 'ecological_spatial_memory',
                correctCount,
                incorrectCount,
                totalScore,
                timestamp: new Date().toISOString(),
                movedIndices: this.state.movedIndices,
                selectedIndices,
                originalPositions: this.state.originalPositions,
                finalPositions: this.state.finalPositions
            };
            
            if (!this.state.results) {
                this.state.results = [];
            }
            this.state.results.push(result);
            
            // Also add to global game results for export
            if (!gameState.gameResults) {
                gameState.gameResults = [];
            }
            gameState.gameResults.push(result);
            
            // Show results
            document.getElementById('task6-correct-count').textContent = correctCount;
            document.getElementById('task6-incorrect-count').textContent = incorrectCount;
            document.getElementById('task6-total-score').textContent = totalScore;
            
            transitionScreens('task-6-response', 'task-6-results');

            // Setup finish button to export results
            const finishButton = document.getElementById('completeTask6Button');
            if (finishButton) {
                const newFinishButton = finishButton.cloneNode(true);
                finishButton.parentNode.replaceChild(newFinishButton, finishButton);
                
                newFinishButton.addEventListener('click', () => {
                    // Export results when finishing the task
                    exportCSV({
                        studentId: gameState.studentId,
                        scheme: gameState.scheme,
                        gameResults: gameState.gameResults
                    });
                    finishGame();
                });
            }
        } else {
            // Show practice results
            const accuracy = (correctCount / this.state.movedIndices.length) * 100;
            const message = `You correctly identified ${correctCount} out of ${this.state.movedIndices.length} moved images (${accuracy.toFixed(1)}% accuracy).`;
            
            // Display practice results
            const practiceResults = document.getElementById('task-6-practice-results');
            const resultsParagraph = practiceResults.querySelector('p') || document.createElement('p');
            resultsParagraph.textContent = message;
            if (!practiceResults.contains(resultsParagraph)) {
                practiceResults.insertBefore(resultsParagraph, practiceResults.querySelector('button'));
            }
            
            transitionScreens('task-6-response', 'task-6-practice-results');
        }
    },
    
    // Update timer display
    updateTimerDisplay: function() {
        // Create timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'task6-timer';
        timerDisplay.className = 'task6-timer';
        timerDisplay.style.fontSize = '1.1rem';
        timerDisplay.style.marginBottom = '8px';
        timerDisplay.style.textAlign = 'center';
        timerDisplay.style.color = '#dc3545';
        timerDisplay.style.fontWeight = 'bold';
        
        // Find grid container parent and add timer before it
        const gridContainer = document.querySelector('#task-6-grid .task6-grid-container');
        const existingTimer = document.getElementById('task6-timer');
        if (existingTimer) {
            existingTimer.remove();
        }
        
        // Remove any existing ready button
        const existingReadyButton = document.getElementById('task6-ready-button');
        if (existingReadyButton) {
            existingReadyButton.remove();
        }
        
        gridContainer.parentElement.insertBefore(timerDisplay, gridContainer);
        
        // Set time limit based on real/practice mode
        const timeLimit = this.state.isRealGame ? 90 : 30;
        let timeLeft = timeLimit;
        
        // Update timer display
        const updateTimer = () => {
            timerDisplay.textContent = `Time remaining: ${timeLeft} seconds`;
        };
        updateTimer();

        // Create ready button
        const readyButton = document.createElement('button');
        readyButton.id = 'task6-ready-button';
        readyButton.textContent = "I'm ready";
        readyButton.className = 'task6-button';
        readyButton.style.marginTop = '8px';
        readyButton.style.padding = this.state.isRealGame ? '6px 14px' : '5px 10px';
        readyButton.style.fontSize = this.state.isRealGame ? '15px' : '13px';
        
        // Start timer
        const timer = setInterval(() => {
            timeLeft--;
            updateTimer();

            // Show ready button after 8 seconds (practice) or 10 seconds (real)
            if (timeLeft === timeLimit - (this.state.isRealGame ? 10 : 8)) {
                if (!document.getElementById('task6-ready-button')) {
                    gridContainer.parentElement.appendChild(readyButton);
                }
            }

            // When timer reaches 0
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.swapRandomImages();
            }
        }, 1000);

        // Ready button click handler
        readyButton.onclick = () => {
            clearInterval(timer);
            this.swapRandomImages();
        };
    },
};

// Add Task 6 module initialization to the main init function
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize Task 6 module
    Task6Module.initializeEventListeners();
});

// Function to shuffle objects for counter-balance
function shuffleObjects(objects) {
    for (let i = objects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [objects[i], objects[j]] = [objects[j], objects[i]];
    }
    return objects;
}

// Initialize Object Span task for session 1 with counter-balance
function initializeObjectSpanTask(session) {
    if (session === 1) {
        console.log("Initializing Object Span Task for session 1");
        
        // Create the object span screen if it doesn't exist
        let objectSpanScreen = document.getElementById('object-span-intro');
        if (!objectSpanScreen) {
            objectSpanScreen = document.createElement('div');
            objectSpanScreen.id = 'object-span-intro';
            objectSpanScreen.className = 'screen';
            
            // Create content for object span screen
            objectSpanScreen.innerHTML = `
                <h1>Object Span Task</h1>
                <p>In this task, you will be shown a series of objects one at a time.</p>
                <p>Your task is to remember the objects in the order they appeared.</p>
                <p>After the objects are shown, you'll be asked to recall them.</p>
                <button id="startObjectSpanButton" class="button">Start Object Span Task</button>
            `;
            
            // Add screen to the document
            document.body.appendChild(objectSpanScreen);
            
            // Add event listener to the button
            document.getElementById('startObjectSpanButton').addEventListener('click', () => {
                // Start the object span task
                const objects = ['shoe', 'bread', 'car', 'pot', 'money', 'book', 'chair', 'bag', 'computer'];
                const shuffledObjects = shuffleObjects(objects);
                
                // Store the shuffled order for this session
                gameState.objectOrder = shuffledObjects;
                
                // Show the object span practice screen
                startObjectSpanPractice();
            });
        }
        
        // Show the object span intro screen
        showScreen('object-span-intro');
    }
}

// Function to start the Object Span task
function startObjectSpanTask(objects) {
    // Logic to display objects in the given order
    // This function will handle the presentation of objects to the participant
    console.log('Starting Object Span Task with objects:', objects);
    // ... existing code to display objects ...
}

// Ensure event listeners are set up for scheme buttons
function initializeSchemeButtons() {
    document.querySelectorAll('.scheme-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const scheme = e.target.dataset.scheme;
            handleSchemeSelection(scheme);
        });
    });
}

// Call this function during initialization
initializeSchemeButtons();

// Function to directly select a scheme (for debugging/testing)
function directSelectScheme(scheme) {
    console.log(`Directly selecting scheme: ${scheme}`);
    handleSchemeSelection(scheme);
}

// Fix event listeners for scheme buttons
function fixSchemeButtons() {
    console.log("Fixing scheme buttons...");
    const schemeButtons = document.querySelectorAll('.scheme-button');
    console.log(`Found ${schemeButtons.length} scheme buttons`);
    
    schemeButtons.forEach(button => {
        const scheme = button.dataset.scheme;
        console.log(`Setting up button for scheme: ${scheme}`);
        
        // Remove all existing click listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new click listener
        newButton.addEventListener('click', () => {
            console.log(`Button clicked for scheme: ${scheme}`);
            directSelectScheme(scheme);
        });
    });
    
    // Add a manual click trigger for testing scheme 1
    const scheme1Button = document.querySelector('.scheme-button[data-scheme="1"]');
    if (scheme1Button) {
        console.log("Adding test function for scheme 1");
        window.testScheme1 = function() {
            console.log("Testing scheme 1 button");
            scheme1Button.click();
        };
    }
}

// Call this function during initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, fixing scheme buttons");
    fixSchemeButtons();
});

// Task 7: Deductive Reasoning Task Module
const Task7Module = {
    // Puzzle definitions based on the provided examples
    practicePuzzle: {
        question: "If a card has a circle on one side, then it has the color yellow on the other side.",
        cards: [
            { front: "shape-square", back: "color-red", type: "shape" },
            { front: "shape-circle", back: "color-yellow", type: "shape" },
            { front: "color-yellow", back: "color-yellow", type: "color" },
            { front: "color-red", back: "color-red", type: "color" }
        ],
        correctCards: [1, 3],  // Circle and Red (0-indexed)
        explanation: "You need to check the circle card (to see if it has yellow on the other side) and the red card (to make sure it doesn't have a circle on the other side)."
    },
    
    mainPuzzles: [
        {
            question: "If a card has a circle on one side, then it has the color yellow on the other side.",
            cards: [
                { front: "shape-square", back: "color-red", type: "shape" },
                { front: "shape-circle", back: "color-yellow", type: "shape" },
                { front: "color-yellow", back: "color-yellow", type: "color" },
                { front: "color-red", back: "color-red", type: "color" }
            ],
            correctCards: [1, 3],  // Circle and Red
            explanation: "Correct answer: Circle and Red. You need to check the circle card (to see if it has yellow on the other side) and the red card (to make sure it doesn't have a circle on the other side)."
        },
        {
            question: "If a card has the letter a vowel on one side, then it has an even number on the other side.",
            cards: [
                { front: "8", back: "8", type: "text" },
                { front: "A", back: "A", type: "text" },
                { front: "Z", back: "Z", type: "text" },
                { front: "5", back: "5", type: "text" }
            ],
            correctCards: [1, 3],  // A and 5
            explanation: "Correct answer: A and 5. You need to check the A card (vowel, to verify it has an even number on the other side) and the 5 card (odd number, to verify it doesn't have a vowel on the other side)."
        },
        {
            question: "If a card has an even number on one side, then it has the color green on the other side.",
            cards: [
                { front: "3", back: "3", type: "text" },
                { front: "8", back: "8", type: "text" },
                { front: "color-green", back: "color-green", type: "color" },
                { front: "color-blue", back: "color-blue", type: "color" }
            ],
            correctCards: [1, 3],  // 8 and Blue
            explanation: "Correct answer: 8 and Blue. You need to check the 8 card (even number, to verify it has green on the other side) and the blue card (to verify it doesn't have an even number on the other side)."
        },
        {
            question: "If a card has the digit \"5\" on one side, then it has a triangle on the other side.",
            cards: [
                { front: "5", back: "5", type: "text" },
                { front: "shape-triangle", back: "shape-triangle", type: "shape" },
                { front: "3", back: "3", type: "text" },
                { front: "blue-circle", back: "blue-circle", type: "shape" }
            ],
            correctCards: [0, 3],  // 5 and Circle
            explanation: "Correct answer: 5 and Circle. You need to check the 5 card (to verify it has a triangle on the other side) and the circle card (to verify it doesn't have a 5 on the other side)."
        },
        {
            question: "If a card has a square on one side, then it has the color red on the other side.",
            cards: [
                { front: "shape-square", back: "shape-square", type: "shape" },
                { front: "shape-circle", back: "shape-circle", type: "shape" },
                { front: "color-red", back: "color-red", type: "color" },
                { front: "color-yellow", back: "color-yellow", type: "color" }
            ],
            correctCards: [0, 3],  // Square and Yellow
            explanation: "Correct answer: Square and Yellow. You need to check the square card (to verify it has red on the other side) and the yellow card (to verify it doesn't have a square on the other side)."
        },
        {
            question: "If a card has a consonant on one side, then it has an odd number on the other side.",
            cards: [
                { front: "Z", back: "Z", type: "text" },
                { front: "E", back: "E", type: "text" },
                { front: "4", back: "4", type: "text" },
                { front: "7", back: "7", type: "text" }
            ],
            correctCards: [0, 2],  // Z and 4
            explanation: "Correct answer: Z and 4. You need to check the Z card (consonant, to verify it has an odd number on the other side) and the 4 card (even number, to verify it doesn't have a consonant on the other side)."
        },
        {
            question: "If a card has the color blue on one side, then it has a circle on the other side.",
            cards: [
                { front: "color-blue", back: "color-blue", type: "color" },
                { front: "color-green", back: "color-green", type: "color" },
                { front: "shape-circle", back: "shape-circle", type: "shape" },
                { front: "shape-triangle", back: "shape-triangle", type: "shape" }
            ],
            correctCards: [0, 3],  // Blue and Triangle
            explanation: "Correct answer: Blue and Triangle. You need to check the blue card (to verify it has a circle on the other side) and the triangle card (to verify it doesn't have blue on the other side)."
        }
    ],
    
    state: {
        isRealGame: false,
        currentPuzzleIndex: 0,
        selectedCards: [],
        results: []
    },
    
    // Initialize all event listeners for Task 7
    initializeEventListeners: function() {
        // Store 'this' reference for callbacks
        const self = this;
        
        // Intro screen continue button
        document.getElementById('task7ContinueButton')?.addEventListener('click', function() {
            console.log('Task 7 continue button clicked');
            transitionScreens('task-7-intro', 'task-7-instructions');
        });
        
        // Instructions screen practice button
        document.getElementById('startTask7PracticeButton')?.addEventListener('click', function() {
            console.log('Task 7 practice button clicked');
            self.startPractice();
        });
        
        // Feedback continue button
        document.getElementById('task7ContinueAfterFeedbackButton')?.addEventListener('click', function() {
            console.log('Task 7 feedback continue button clicked');
            transitionScreens('task-7-feedback', 'task-7-real-instructions');
        });
        
        // Real game start button
        document.getElementById('startTask7RealButton')?.addEventListener('click', function() {
            console.log('Task 7 real game button clicked');
            self.startRealGame();
        });
        
        // Global helper function to fix main submit button
        window.task7SubmitMainAnswer = function() {
            console.log("Global task7SubmitMainAnswer called");
            // Call the module method directly without relying on closure scope
            Task7Module.evaluateMainResponse();
        };
        
        // Global helper function to fix practice submit button
        window.task7SubmitPracticeAnswer = function() {
            console.log("Global task7SubmitPracticeAnswer called");
            // Call the module method directly without relying on closure scope
            Task7Module.evaluatePracticeResponse();
        };
        
        // Note: Submit buttons for practice and main tasks are now handled
        // in renderPracticePuzzle and renderMainPuzzle functions
    },
    
    // Start practice round
    startPractice: function() {
        this.state.isRealGame = false;
        this.state.selectedCards = [];
        transitionScreens('task-7-instructions', 'task-7-practice');
        
        this.renderPracticePuzzle();
    },
    
    // Render practice puzzle
    renderPracticePuzzle: function() {
        const container = document.getElementById('task7-cards-container');
        container.innerHTML = '';
        
        // Reset submit button state
        const submitButton = document.getElementById('task7SubmitButton');
        submitButton.disabled = true;
        
        // The onclick attribute now handles the click event - no need for addEventListener
        
        // Store 'this' reference for callbacks
        const self = this;
        
        // Create cards
        this.practicePuzzle.cards.forEach(function(card, index) {
            const cardElement = document.createElement('div');
            cardElement.className = 'task7-card';
            cardElement.dataset.index = index;
            
            const contentElement = document.createElement('div');
            contentElement.className = 'task7-card-content';
            
            // Add content based on card type
            if (card.type === 'shape') {
                const shapeElement = document.createElement('div');
                shapeElement.className = card.front;
                contentElement.appendChild(shapeElement);
            } else if (card.type === 'color') {
                contentElement.className = `task7-card-content ${card.front}`;
            } else if (card.type === 'text') {
                const textElement = document.createElement('span');
                textElement.className = 'card-text';
                textElement.textContent = card.front;
                contentElement.appendChild(textElement);
            }
            
            cardElement.appendChild(contentElement);        
            container.appendChild(cardElement);
            
            // Add click handler with proper binding
            cardElement.addEventListener('click', function() {
                console.log(`Card ${index} clicked in practice`);
                self.toggleCardSelection(index, 'practice');
            });
        });
    },
    
    // Start real game
    startRealGame: function() {
        this.state.isRealGame = true;
        this.state.currentPuzzleIndex = 0;
        this.state.results = [];
        
        transitionScreens('task-7-real-instructions', 'task-7-main');
        this.renderMainPuzzle();
    },
    
    // Render main puzzle
    renderMainPuzzle: function() {
        const currentPuzzle = this.mainPuzzles[this.state.currentPuzzleIndex];
        const container = document.getElementById('task7-main-cards-container');
        const questionElement = document.getElementById('task7-main-question-text');
        
        this.state.selectedCards = [];
        document.getElementById('task7-main-selected-count').textContent = '0';
        
        // Reset submit button state
        const submitButton = document.getElementById('task7MainSubmitButton');
        submitButton.disabled = true;
        
        // The onclick attribute now handles the click event - no need for addEventListener
        
        questionElement.textContent = currentPuzzle.question;
        container.innerHTML = '';
        
        // Store 'this' reference for callbacks
        const self = this;
        
        // Create cards
        currentPuzzle.cards.forEach(function(card, index) {
            const cardElement = document.createElement('div');
            cardElement.className = 'task7-card';
            cardElement.dataset.index = index;
            
            const contentElement = document.createElement('div');
            contentElement.className = 'task7-card-content';
            
            // Add content based on card type
            if (card.type === 'shape') {
                const shapeElement = document.createElement('div');
                shapeElement.className = card.front;
                contentElement.appendChild(shapeElement);
            } else if (card.type === 'color') {
                contentElement.className = `task7-card-content ${card.front}`;
            } else if (card.type === 'text') {
                const textElement = document.createElement('span');
                textElement.className = 'card-text';
                textElement.textContent = card.front;
                contentElement.appendChild(textElement);
            }
            
            cardElement.appendChild(contentElement);
            container.appendChild(cardElement);
            
            // Add click handler with binding preserved
            cardElement.addEventListener('click', function() {
                console.log(`Card ${index} clicked in main task`);
                self.toggleCardSelection(index, 'main');
            });
        });
    },
    
    // Toggle card selection
    toggleCardSelection: function(cardIndex, gameType) {
        const prefix = gameType === 'practice' ? 'task7' : 'task7-main';
        const cardsContainer = document.getElementById(`${prefix}-cards-container`);
        const cards = cardsContainer.querySelectorAll('.task7-card');
        const submitButton = document.getElementById(`${prefix}SubmitButton`);
        const selectedCountElement = document.getElementById(`${prefix}-selected-count`);
        
        console.log(`Toggle card ${cardIndex} selection in ${gameType} mode`);
        
        // Toggle selected class
        cards[cardIndex].classList.toggle('selected');
        
        // Update selected cards array
        if (this.state.selectedCards.includes(cardIndex)) {
            this.state.selectedCards = this.state.selectedCards.filter(i => i !== cardIndex);
        } else {
            // Only allow selecting two cards maximum
            if (this.state.selectedCards.length < 2) {
                this.state.selectedCards.push(cardIndex);
                console.log(`Card ${cardIndex} selected. Selected cards: ${this.state.selectedCards.join(', ')}`);
            } else {
                // If already have 2 selected, deselect the first one
                const firstSelected = this.state.selectedCards.shift();
                cards[firstSelected].classList.remove('selected');
                this.state.selectedCards.push(cardIndex);
                console.log(`Card ${firstSelected} deselected, card ${cardIndex} selected. Selected cards: ${this.state.selectedCards.join(', ')}`);
            }
        }
        
        // Update selected count display
        selectedCountElement.textContent = this.state.selectedCards.length;
        
        // Enable submit button if exactly two cards are selected
        const shouldEnable = this.state.selectedCards.length === 2;
        submitButton.disabled = !shouldEnable;
        
        console.log(`Submit button ${submitButton.disabled ? 'disabled' : 'enabled'} (selectedCards.length = ${this.state.selectedCards.length})`);
        console.log(`Button element: id=${submitButton.id}, disabled=${submitButton.disabled}`);
        
        // Force button to be clickable when 2 cards are selected
        if (shouldEnable) {
            // Force button to be clickable
            submitButton.removeAttribute('disabled');
            console.log("Forcibly removed disabled attribute");
        }
    },
    
    // Evaluate practice response
    evaluatePracticeResponse: function() {
        const isCorrect = this.checkCorrectCards(this.practicePuzzle.correctCards);
        const resultElement = document.getElementById('task7-result-text');
        const explanationElement = document.getElementById('task7-explanation');
        
        if (isCorrect) {
            resultElement.textContent = 'Correct! You selected the right cards.';
            resultElement.className = 'correct-answer';
        } else {
            resultElement.textContent = 'Incorrect. You did not select the right cards.';
            resultElement.className = 'incorrect-answer';
        }
        
        explanationElement.textContent = this.practicePuzzle.explanation;
        transitionScreens('task-7-practice', 'task-7-feedback');
    },
    
    // Evaluate main response
    evaluateMainResponse: function() {
        const currentPuzzle = this.mainPuzzles[this.state.currentPuzzleIndex];
        const isCorrect = this.checkCorrectCards(currentPuzzle.correctCards);
        
        // Store result
        this.state.results.push({
            puzzleIndex: this.state.currentPuzzleIndex,
            question: currentPuzzle.question,
            selectedCards: [...this.state.selectedCards],
            correctCards: [...currentPuzzle.correctCards],
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
        });
        
        // Add to global game results for export
        if (!gameState.gameResults) {
            gameState.gameResults = [];
        }
        
        gameState.gameResults.push({
            task: 'deductive_reasoning',
            puzzleIndex: this.state.currentPuzzleIndex,
            question: currentPuzzle.question,
            selectedCards: [...this.state.selectedCards],
            correctCards: [...currentPuzzle.correctCards],
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
        });
        
        // Move to next puzzle or show results
        this.state.currentPuzzleIndex++;
        
        if (this.state.currentPuzzleIndex < this.mainPuzzles.length) {
            this.renderMainPuzzle();
        } else {
            this.showResults();
        }
    },
    
    // Check if selected cards match correct cards
    checkCorrectCards: function(correctCards) {
        if (this.state.selectedCards.length !== 2) return false;
        
        // Sort both arrays for comparison
        const selectedSorted = [...this.state.selectedCards].sort((a, b) => a - b);
        const correctSorted = [...correctCards].sort((a, b) => a - b);
        
        return selectedSorted[0] === correctSorted[0] && selectedSorted[1] === correctSorted[1];
    },
    
    // Show final results
    showResults: function() {
        const correctCount = this.state.results.filter(result => result.isCorrect).length;
        const totalCount = this.state.results.length;
        const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        
        document.getElementById('task7-correct-count').textContent = correctCount;
        document.getElementById('task7-total-count').textContent = totalCount;
        document.getElementById('task7-accuracy').textContent = `${accuracy}%`;
        
        transitionScreens('task-7-main', 'task-7-results');
        
        // Setup finish button to export results
        const finishButton = document.getElementById('completeTask7Button');
        if (finishButton) {
            const newFinishButton = finishButton.cloneNode(true);
            finishButton.parentNode.replaceChild(newFinishButton, finishButton);
            
            newFinishButton.addEventListener('click', () => {
                // Export results when finishing the task
                exportCSV({
                    studentId: gameState.studentId,
                    scheme: gameState.scheme,
                    gameResults: gameState.gameResults.filter(result => result.task === 'deductive_reasoning')
                });
                finishGame();
            });
        }
    },
};

// Add Task 7 module initialization to the main init function
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize Task 7 module
    Task7Module.initializeEventListeners();
});

// Ensure submit buttons have onclick handlers
document.addEventListener('DOMContentLoaded', function() {
    console.log("Setting up direct click handlers for Task 7 submit buttons");
    
    // Practice button
    const practiceSubmitButton = document.getElementById('task7SubmitButton');
    if (practiceSubmitButton) {
        practiceSubmitButton.onclick = function() {
            console.log("Practice submit button clicked via direct handler");
            task7SubmitPracticeAnswer();
        };
    }
    
    // Main task button
    const mainSubmitButton = document.getElementById('task7MainSubmitButton');
    if (mainSubmitButton) {
        mainSubmitButton.onclick = function() {
            console.log("Main task submit button clicked via direct handler");
            debugSubmitTask7();
        };
    }
});

// Global handler functions that match the HTML onclick attributes
window.debugSubmitTask7 = function() {
    console.log("debugSubmitTask7 called from HTML onclick");
    if (typeof Task7Module !== 'undefined') {
        Task7Module.evaluateMainResponse();
    } else {
        console.error('Task7Module is not defined!');
        alert('Error: Task7Module not found. Please refresh the page and try again.');
    }
};

// Task 8: Ecological Deductive Reasoning Task Module
const Task8Module = {
    // Puzzle definitions based on the provided examples
    practicePuzzle: {
        question: "If a person drinks an alcoholic drink, then they must be over the age of 21 years old.",
        cards: [
            { front: "16", back: "16", type: "text" },
            { front: "beer", back: "beer", type: "drink", image: "imageslas/beer.jpg" },
            { front: "25", back: "25", type: "text" },
            { front: "juice", back: "juice", type: "drink", image: "imageslas/juice.jpg" }
        ],
        correctCards: [0, 1],  // 16 and beer (0-indexed)
        explanation: "You need to check the 16 card (to verify this person is not drinking alcohol) and the beer card (to verify the person drinking it is at least 21)."
    },
    
    mainPuzzles: [
        {
            question: "If a person drinks an alcoholic drink, then they must be over the age of 21 years old.",
            cards: [
                { front: "16", back: "16", type: "text" },
                { front: "beer", back: "beer", type: "drink", image: "imageslas/beer.jpg" },
                { front: "25", back: "25", type: "text" },
                { front: "juice", back: "juice", type: "drink", image: "imageslas/juice.jpg" }
            ],
            correctCards: [0, 1],  // 16 and beer
            explanation: "Correct answer: 16 and beer. You need to check the 16 card (to verify this person is not drinking alcohol) and the beer card (to verify the person drinking it is at least 21)."
        },
        {
            question: "If Mary and Jane always hang out together, then they must be friends.",
            cards: [
                { front: "Mary and Jane hang out", back: "Mary and Jane hang out", type: "text" },
                { front: "Mary and Jane do not hang out", back: "Mary and Jane do not hang out", type: "text" },
                { front: "Mary and Jane are friends", back: "Mary and Jane are friends", type: "text" },
                { front: "Mary and Jane are not friends", back: "Mary and Jane are not friends", type: "text" }
            ],
            correctCards: [0, 3],  // "Mary and Jane hang out" and "Mary and Jane are not friends"
            explanation: "Correct answer: 'Mary and Jane hang out' and 'Mary and Jane are not friends'. You need to check if they hang out (to verify they are friends) and if they are not friends (to verify they don't hang out)."
        },
        {
            question: "If Amy treats sick children in the hospital, then she must be a doctor.",
            cards: [
                { front: "Doctor", back: "Doctor", type: "text" },
                { front: "Teacher", back: "Teacher", type: "text" },
                { front: "Treats children", back: "Treats children", type: "image", image: "imageslas/doctor-patient.jpg" },
                { front: "Teaching", back: "Teaching", type: "image", image: "imageslas/teacher.jpg" }
            ],
            correctCards: [1, 2],  // Teacher and Treats children
            explanation: "Correct answer: Teacher and 'Treats children'. You need to check if someone treating children is a doctor and if a teacher might also be treating children."
        },
        {
            question: "If an animal barks, then it must be a dog.",
            cards: [
                { front: "Barks", back: "Barks", type: "image", image: "imageslas/dog-barking.jpg" },
                { front: "Doesn't bark", back: "Doesn't bark", type: "image", image: "imageslas/cat.jpg" },
                { front: "Dog", back: "Dog", type: "text" },
                { front: "Cat", back: "Cat", type: "text" }
            ],
            correctCards: [0, 3],  // Barks and Cat
            explanation: "Correct answer: 'Barks' and Cat. You need to check if a barking animal is a dog and if a cat might also bark."
        }
    ],
    
    state: {
        isRealGame: false,
        currentPuzzleIndex: 0,
        selectedCards: [],
        results: []
    },
    
    // Initialize all event listeners for Task 8
    initializeEventListeners: function() {
        // Store 'this' reference for callbacks
        const self = this;
        
        // Intro screen continue button
        document.getElementById('task8ContinueButton')?.addEventListener('click', function() {
            console.log('Task 8 continue button clicked');
            transitionScreens('task-8-intro', 'task-8-instructions');
        });
        
        // Instructions screen practice button
        document.getElementById('startTask8PracticeButton')?.addEventListener('click', function() {
            console.log('Task 8 practice button clicked');
            self.startPractice();
        });
        
        // Feedback continue button
        document.getElementById('task8ContinueAfterFeedbackButton')?.addEventListener('click', function() {
            console.log('Task 8 feedback continue button clicked');
            transitionScreens('task-8-feedback', 'task-8-real-instructions');
        });
        
        // Real game start button
        document.getElementById('startTask8RealButton')?.addEventListener('click', function() {
            console.log('Task 8 real game button clicked');
            self.startRealGame();
        });
        
        // Global helper function to fix main submit button
        window.task8SubmitMainAnswer = function() {
            console.log("Global task8SubmitMainAnswer called");
            // Call the module method directly without relying on closure scope
            Task8Module.evaluateMainResponse();
        };
        
        // Global helper function to fix practice submit button
        window.task8SubmitPracticeAnswer = function() {
            console.log("Global task8SubmitPracticeAnswer called");
            // Call the module method directly without relying on closure scope
            Task8Module.evaluatePracticeResponse();
        };
    },
    
    // Start practice round
    startPractice: function() {
        this.state.isRealGame = false;
        this.state.selectedCards = [];
        transitionScreens('task-8-instructions', 'task-8-practice');
        
        this.renderPracticePuzzle();
    },
    
    // Render practice puzzle
    renderPracticePuzzle: function() {
        const container = document.getElementById('task8-cards-container');
        container.innerHTML = '';
        
        // Reset submit button state
        const submitButton = document.getElementById('task8SubmitButton');
        submitButton.disabled = true;
        
        // Store 'this' reference for callbacks
        const self = this;
        
        // Create cards
        this.practicePuzzle.cards.forEach(function(card, index) {
            const cardElement = document.createElement('div');
            cardElement.className = 'task8-card';
            cardElement.dataset.index = index;
            
            const contentElement = document.createElement('div');
            contentElement.className = 'task8-card-content';
            
            // Add content based on card type
            if (card.type === 'text') {
                const textElement = document.createElement('span');
                textElement.className = 'card-text';
                textElement.textContent = card.front;
                contentElement.appendChild(textElement);
            } else if (card.type === 'drink' || card.type === 'image') {
                if (card.image) {
                    const imgElement = document.createElement('img');
                    imgElement.src = card.image;
                    imgElement.alt = card.front;
                    imgElement.className = 'card-image';
                    contentElement.appendChild(imgElement);
                } else {
                    const textElement = document.createElement('span');
                    textElement.className = 'card-text';
                    textElement.textContent = card.front;
                    contentElement.appendChild(textElement);
                }
            }
            
            cardElement.appendChild(contentElement);        
            container.appendChild(cardElement);
            
            // Add click handler with proper binding
            cardElement.addEventListener('click', function() {
                console.log(`Card ${index} clicked in practice`);
                self.toggleCardSelection(index, 'practice');
            });
        });
    },
    
    // Start real game
    startRealGame: function() {
        this.state.isRealGame = true;
        this.state.currentPuzzleIndex = 0;
        this.state.results = [];
        
        transitionScreens('task-8-real-instructions', 'task-8-main');
        this.renderMainPuzzle();
    },
    
    // Render main puzzle
    renderMainPuzzle: function() {
        const currentPuzzle = this.mainPuzzles[this.state.currentPuzzleIndex];
        const container = document.getElementById('task8-main-cards-container');
        const questionElement = document.getElementById('task8-main-question-text');
        
        this.state.selectedCards = [];
        document.getElementById('task8-main-selected-count').textContent = '0';
        
        // Reset submit button state
        const submitButton = document.getElementById('task8MainSubmitButton');
        submitButton.disabled = true;
        
        questionElement.textContent = currentPuzzle.question;
        container.innerHTML = '';
        
        // Store 'this' reference for callbacks
        const self = this;
        
        // Create cards
        currentPuzzle.cards.forEach(function(card, index) {
            const cardElement = document.createElement('div');
            cardElement.className = 'task8-card';
            cardElement.dataset.index = index;
            
            const contentElement = document.createElement('div');
            contentElement.className = 'task8-card-content';
            
            // Add content based on card type
            if (card.type === 'text') {
                const textElement = document.createElement('span');
                textElement.className = 'card-text';
                textElement.textContent = card.front;
                contentElement.appendChild(textElement);
            } else if (card.type === 'drink' || card.type === 'image') {
                if (card.image) {
                    const imgElement = document.createElement('img');
                    imgElement.src = card.image;
                    imgElement.alt = card.front;
                    imgElement.className = 'card-image';
                    contentElement.appendChild(imgElement);
                } else {
                    const textElement = document.createElement('span');
                    textElement.className = 'card-text';
                    textElement.textContent = card.front;
                    contentElement.appendChild(textElement);
                }
            }
            
            cardElement.appendChild(contentElement);
            container.appendChild(cardElement);
            
            // Add click handler with binding preserved
            cardElement.addEventListener('click', function() {
                console.log(`Card ${index} clicked in main task`);
                self.toggleCardSelection(index, 'main');
            });
        });
    },
    
    // Toggle card selection
    toggleCardSelection: function(cardIndex, gameType) {
        const prefix = gameType === 'practice' ? 'task8' : 'task8-main';
        const cardsContainer = document.getElementById(`${prefix}-cards-container`);
        const cards = cardsContainer.querySelectorAll('.task8-card');
        const submitButton = document.getElementById(`${prefix}SubmitButton`);
        const selectedCountElement = document.getElementById(`${prefix}-selected-count`);
        
        console.log(`Toggle card ${cardIndex} selection in ${gameType} mode`);
        
        // Find the clicked card using the data-index attribute
        const selectedCard = Array.from(cards).find(card => parseInt(card.dataset.index) === cardIndex);
        
        if (!selectedCard) {
            console.error(`Card with index ${cardIndex} not found`);
            return;
        }
        
        // Toggle selected state
        const isSelected = selectedCard.classList.toggle('selected');
        
        // Update selectedCards array
        if (isSelected) {
            // Add to selected cards if not already there
            if (!this.state.selectedCards.includes(cardIndex)) {
                this.state.selectedCards.push(cardIndex);
            }
        } else {
            // Remove from selected cards
            this.state.selectedCards = this.state.selectedCards.filter(idx => idx !== cardIndex);
        }
        
        // Update selected count display
        selectedCountElement.textContent = this.state.selectedCards.length;
        
        // Enable/disable submit button based on selection count
        submitButton.disabled = this.state.selectedCards.length !== 2;
    },
    
    // Evaluate practice response
    evaluatePracticeResponse: function() {
        console.log('Evaluating practice response');
        
        const resultElement = document.getElementById('task8-practice-result');
        const explanationElement = document.getElementById('task8-practice-explanation');
        
        // Check if selected cards match correct cards
        const isCorrect = this.checkCorrectCards(this.practicePuzzle.correctCards);
        
        if (isCorrect) {
            resultElement.textContent = 'Correct! You have selected the right cards.';
            resultElement.className = 'correct-answer';
        } else {
            resultElement.textContent = 'Incorrect. You did not select the right cards.';
            resultElement.className = 'incorrect-answer';
        }
        
        explanationElement.textContent = this.practicePuzzle.explanation;
        transitionScreens('task-8-practice', 'task-8-feedback');
    },
    
    // Evaluate main response
    evaluateMainResponse: function() {
        const currentPuzzle = this.mainPuzzles[this.state.currentPuzzleIndex];
        const isCorrect = this.checkCorrectCards(currentPuzzle.correctCards);
        
        // Store result
        this.state.results.push({
            puzzleIndex: this.state.currentPuzzleIndex,
            question: currentPuzzle.question,
            selectedCards: [...this.state.selectedCards],
            correctCards: [...currentPuzzle.correctCards],
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
        });
        
        // Add to global game results for export
        if (!gameState.gameResults) {
            gameState.gameResults = [];
        }
        
        gameState.gameResults.push({
            task: 'ecological_deductive_reasoning',
            puzzleIndex: this.state.currentPuzzleIndex,
            question: currentPuzzle.question,
            selectedCards: [...this.state.selectedCards],
            correctCards: [...currentPuzzle.correctCards],
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
        });
        
        // Move to next puzzle or show results
        this.state.currentPuzzleIndex++;
        
        if (this.state.currentPuzzleIndex < this.mainPuzzles.length) {
            this.renderMainPuzzle();
        } else {
            this.showResults();
        }
    },
    
    // Check if selected cards match correct cards
    checkCorrectCards: function(correctCards) {
        if (this.state.selectedCards.length !== 2) return false;
        
        // Sort both arrays for comparison
        const selectedSorted = [...this.state.selectedCards].sort((a, b) => a - b);
        const correctSorted = [...correctCards].sort((a, b) => a - b);
        
        return selectedSorted[0] === correctSorted[0] && selectedSorted[1] === correctSorted[1];
    },
    
    // Show final results
    showResults: function() {
        const correctCount = this.state.results.filter(result => result.isCorrect).length;
        const totalCount = this.state.results.length;
        const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        
        document.getElementById('task8-correct-count').textContent = correctCount;
        document.getElementById('task8-total-count').textContent = totalCount;
        document.getElementById('task8-accuracy').textContent = `${accuracy}%`;
        
        transitionScreens('task-8-main', 'task-8-results');
        
        // Setup finish button to export results
        const finishButton = document.getElementById('completeTask8Button');
        if (finishButton) {
            const newFinishButton = finishButton.cloneNode(true);
            finishButton.parentNode.replaceChild(newFinishButton, finishButton);
            
            newFinishButton.addEventListener('click', () => {
                // Export results when finishing the task
                exportCSV({
                    studentId: gameState.studentId,
                    scheme: gameState.scheme,
                    gameResults: gameState.gameResults.filter(result => result.task === 'ecological_deductive_reasoning')
                });
                finishGame();
            });
        }
    },
};

// Add Task 8 module initialization to the main init function
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize Task 8 module
    Task8Module.initializeEventListeners();
});

// Ensure submit buttons have onclick handlers for Task 8
document.addEventListener('DOMContentLoaded', function() {
    console.log("Setting up direct click handlers for Task 8 submit buttons");
    
    // Practice button
    const practiceSubmitButton = document.getElementById('task8SubmitButton');
    if (practiceSubmitButton) {
        practiceSubmitButton.onclick = function() {
            console.log("Practice submit button clicked via direct handler");
            task8SubmitPracticeAnswer();
        };
    }
    
    // Main task button
    const mainSubmitButton = document.getElementById('task8MainSubmitButton');
    if (mainSubmitButton) {
        mainSubmitButton.onclick = function() {
            console.log("Main task submit button clicked via direct handler");
            debugSubmitTask8();
        };
    }
});

// Global handler function for Task 8
window.debugSubmitTask8 = function() {
    console.log("debugSubmitTask8 called from HTML onclick");
    if (typeof Task8Module !== 'undefined') {
        Task8Module.evaluateMainResponse();
    } else {
        console.error('Task8Module is not defined!');
        alert('Error: Task8Module not found. Please refresh the page and try again.');
    }
};

// Add to the DOMContentLoaded event listener section
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Object Span Task event listeners
    document.getElementById('startObjectSpanButton')?.addEventListener('click', function() {
        console.log('Starting object span practice from button click');
        // Ensure we reset the practice attempts counter to 0
        objectSpanState.practiceAttempts = 0;
        startObjectSpanPractice();
    });

    document.getElementById('continuePracticeButton')?.addEventListener('click', function() {
        // Don't increment the practice attempts counter when continuing practice
        // (it will be incremented once when submitting the response)
        
        // Reset input and start a new sequence
        const objectDisplay = document.querySelector('.object-display');
        if (objectDisplay) {
            objectDisplay.innerHTML = ''; // Clear any previous content
        }
        
        // Show game area and start a new sequence
        showScreen('object-game-area');
        startObjectSequence();
    });

    document.getElementById('readyForMainTaskButton')?.addEventListener('click', function() {
        console.log('User indicated ready for main task');
        objectSpanState.readyForMainTask = true;
        objectSpanState.practiceAttempts = 0; // Reset practice attempts
        
        // Clear any existing timers
        TimerManager.clearAll();
        
        // Show the main task instructions
        showScreen('object-span-main-instructions');
    });

    document.getElementById('startObjectSpanMainButton')?.addEventListener('click', function() {
        console.log('Starting main object span task');
        
        // Reset state for main task
        objectSpanState.isRealGame = true;
        objectSpanState.currentSpan = OBJECT_SPAN_CONFIG.minSpan;
        objectSpanState.currentAttempt = 1;
        objectSpanState.currentRound = 1; // Start at round 1
        objectSpanState.maxSpanReached = OBJECT_SPAN_CONFIG.minSpan - 1;
        objectSpanState.results = [];
        
        // Clear any existing timers
        TimerManager.clearAll();
        
        // Clear any input values that might remain from practice
        const responseInput = document.getElementById('object-response');
        if (responseInput) {
            responseInput.value = '';
        }
        
        // Update debug info
        const debugEl = document.getElementById('object-debug');
        if (debugEl) {
            debugEl.textContent = 'Starting main task';
            debugEl.style.color = 'black';
        }
        
        // Start the first sequence
        startObjectSequence();
    });

    document.getElementById('submitObjectResponseButton')?.addEventListener('click', function() {
        submitObjectSpanResponse();
    });

    // Add keypress event listener for the response input
    document.getElementById('object-response')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitObjectSpanResponse();
        }
    });
    
    // Add keyup event listener to monitor input
    document.getElementById('object-response')?.addEventListener('keyup', function(e) {
        // Log the current input value
        console.log('Current input value (keyup):', this.value);
        
        // Store in state to ensure we have the latest value
        objectSpanState.lastResponse = this.value.trim().toLowerCase();
    });
    
    // Add special focus event to capture initial focus
    document.getElementById('object-response')?.addEventListener('focus', function(e) {
        console.log('Input field received focus');
    });
});

// Creates a visual reference guide for object names
function createObjectReferenceGuide() {
    const referenceContainer = document.createElement('div');
    referenceContainer.className = 'object-reference-guide';
    referenceContainer.style.display = 'flex';
    referenceContainer.style.flexWrap = 'wrap';
    referenceContainer.style.justifyContent = 'center';
    referenceContainer.style.marginTop = '20px';
    referenceContainer.style.gap = '10px';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Object Name Reference:';
    heading.style.width = '100%';
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '10px';
    referenceContainer.appendChild(heading);
    
    Object.values(OBJECT_SPAN_CONFIG.objectMapping).forEach(obj => {
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.flexDirection = 'column';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.margin = '5px';
        
        const img = document.createElement('img');
        img.src = obj.image;
        img.alt = obj.name;
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.objectFit = 'contain';
        
        const name = document.createElement('span');
        name.textContent = obj.name;
        name.style.fontSize = '12px';
        name.style.marginTop = '5px';
        
        itemDiv.appendChild(img);
        itemDiv.appendChild(name);
        referenceContainer.appendChild(itemDiv);
    });
    
    return referenceContainer;
}

// Add the object reference guide to the response screen
document.addEventListener('DOMContentLoaded', function() {
    const responseScreen = document.getElementById('object-span-response');
    if (responseScreen) {
        const guide = createObjectReferenceGuide();
        responseScreen.appendChild(guide);
    }
});

function showObjectSpanResponse() {
    // Clear any existing timers
    TimerManager.clearAll();
    
    // Show the response screen
    showScreen('object-span-response');
    
    // Get and enable the submit button
    const submitButton = document.getElementById('submitObjectResponseButton');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('disabled'); // Force enable
    }
    
    // Get and enable the input field
    const responseInput = document.getElementById('object-response');
    if (responseInput) {
        responseInput.value = ''; // Clear any previous input
        responseInput.disabled = false; // Ensure input is enabled
        responseInput.focus(); // Set focus to input field
    }
    
    // Update debug info
    const debugEl = document.getElementById('object-debug');
    if (debugEl) {
        debugEl.textContent = `Debug: Showing response screen for span ${objectSpanState.currentSpan}, attempt ${objectSpanState.currentAttempt}`;
    }
}

function submitObjectSpanResponse() {
    // Debug info
    console.log('Submit object span response called');
    
    // Get the input element
    const responseInput = document.getElementById('object-response');
    
    // Make sure we have the input element and it has a value
    if (!responseInput) {
        console.error('Response input element not found!');
        return;
    }
    
    // Get user's response and normalize it (trim whitespace, lowercase)
    const response = responseInput.value.trim().toLowerCase();
    
    // Safety check - don't proceed if response is empty
    if (response.trim() === '') {
        return false;
    }
    
    // Get expected sequence of object names
    const expectedSequence = objectSpanState.sequence.map(index => 
        OBJECT_SPAN_CONFIG.objectMapping[index].name
    ).join(' ');
    
    // More flexible comparison:
    // 1. Normalize both strings by removing extra spaces
    // 2. Compare the normalized strings
    const normalizedExpected = expectedSequence.replace(/\s+/g, ' ').trim();
    const normalizedResponse = response.replace(/\s+/g, ' ').trim();
    
    let isCorrect = false;
    
    // First try exact match
    if (normalizedResponse === normalizedExpected) {
        isCorrect = true;
    } 
    // Then try checking if all the object names are present in the right order
    else {
        const expectedObjects = normalizedExpected.split(' ');
        const responseObjects = normalizedResponse.split(' ');
        
        // Only consider it correct if the number of objects matches
        if (expectedObjects.length === responseObjects.length) {
            isCorrect = true;
            // Check each object
            for (let i = 0; i < expectedObjects.length; i++) {
                if (expectedObjects[i] !== responseObjects[i]) {
                    isCorrect = false;
                    break;
                }
            }
        }
    }
    
    // Store the response for display in feedback
    objectSpanState.lastResponse = response;
    
    if (objectSpanState.isRealGame) {
        handleMainTaskResponse(isCorrect);
    } else {
        handlePracticeResponse(isCorrect);
    }
    
    // Clear the input field
    responseInput.value = '';
}

function handleMainTaskResponse(isCorrect) {
    // Store result
    objectSpanState.results.push({
        round: objectSpanState.currentRound,
        span: objectSpanState.currentSpan,
        attempt: objectSpanState.currentAttempt,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
    });
    
    // Check if we've exceeded the maximum rounds first
    if (objectSpanState.currentRound > OBJECT_SPAN_CONFIG.mainTaskRounds) {
        showFinalResults();
        return;
    }
    
    if (isCorrect) {
        // If this was the first attempt at this span length
        if (objectSpanState.currentAttempt === 1) {
            // Move to next span length
            objectSpanState.currentSpan++;
            objectSpanState.currentAttempt = 1;
            objectSpanState.maxSpanReached = Math.max(objectSpanState.maxSpanReached, objectSpanState.currentSpan - 1);
            
            // Check if we've reached the maximum span
            if (objectSpanState.currentSpan > OBJECT_SPAN_CONFIG.maxSpan) {
                // Reached maximum span, end task
                showFinalResults();
                return;
            }
            
            // Check if we've completed all rounds
            objectSpanState.currentRound++;
            if (objectSpanState.currentRound > OBJECT_SPAN_CONFIG.mainTaskRounds) {
                // Completed all rounds, end task
                showFinalResults();
                return;
            } else {
                // Continue with next span length
                startObjectSequence();
            }
        } else {
            // Second successful attempt, move to next span
            objectSpanState.currentSpan++;
            objectSpanState.currentAttempt = 1;
            objectSpanState.maxSpanReached = Math.max(objectSpanState.maxSpanReached, objectSpanState.currentSpan - 1);
            
            // Check if we've reached the maximum span
            if (objectSpanState.currentSpan > OBJECT_SPAN_CONFIG.maxSpan) {
                // Reached maximum span, end task
                showFinalResults();
                return;
            }
            
            // Check if we've completed all rounds
            objectSpanState.currentRound++;
            if (objectSpanState.currentRound > OBJECT_SPAN_CONFIG.mainTaskRounds) {
                // Completed all rounds, end task
                showFinalResults();
                return;
            } else {
                // Continue with next span length
                startObjectSequence();
            }
        }
    } else {
        // If this was the first attempt and we haven't exceeded rounds
        if (objectSpanState.currentAttempt === 1 && objectSpanState.currentRound <= OBJECT_SPAN_CONFIG.mainTaskRounds) {
            // Give second attempt at same span length
            objectSpanState.currentAttempt = 2;
            startObjectSequence();
        } else {
            // Failed both attempts or exceeded rounds, end task
            showFinalResults();
            return;
        }
    }
}

