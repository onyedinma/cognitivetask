export const gameState = {
    studentId: null,
    scheme: null,
    isRealGame: false,
    currentRound: 0,
    gameResults: []
};

export const updateState = (key, value) => {
    gameState[key] = value;
}; 