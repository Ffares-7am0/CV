
const board = document.getElementById('game-board');
const diceBtn = document.getElementById('dice');
const turnIndicator = document.getElementById('turn-indicator');

// Game State
const players = ['r', 'g', 'y', 'b']; // Red, Green, Yellow, Blue
let currentPlayerIndex = 0;
let tokens = {
    'r': [0, 0, 0, 0], // Positions: 0 = base, 1-52 normal path, 53-57 home run, 58 home
    'g': [0, 0, 0, 0],
    'y': [0, 0, 0, 0],
    'b': [0, 0, 0, 0]
};

// Simplified Move Logic
diceBtn.addEventListener('click', () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    diceBtn.innerText = `🎲 ${roll}`;

    // Auto move first available token for simplicity in this demo version
    // In a full version, we'd highlight tokens to choose
    moveToken(players[currentPlayerIndex], roll);
});

function moveToken(player, steps) {
    const playerTokens = tokens[player];
    let moved = false;

    // Simple AI/Rules: Try to move out of base if roll is 6, else move furthest
    for (let i = 0; i < 4; i++) {
        let pos = playerTokens[i];

        if (pos === 0 && steps === 6) {
            playerTokens[i] = 1; // Start
            moved = true;
            break;
        } else if (pos > 0 && pos < 58) {
            if (pos + steps <= 58) {
                playerTokens[i] += steps;
                moved = true;
                break;
            }
        }
    }

    if (moved) {
        renderTokens();
        checkWin(player);
        if (steps !== 6) nextTurn();
    } else {
        nextTurn();
    }
}

function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % 4;
    const colors = { r: 'Red', g: 'Green', y: 'Yellow', b: 'Blue' };
    turnIndicator.innerText = `${colors[players[currentPlayerIndex]]}'s Turn`;
    turnIndicator.style.color = getPlayerColor(players[currentPlayerIndex]);
}

function getPlayerColor(p) {
    if (p === 'r') return '#ff4444';
    if (p === 'g') return '#44ff44';
    if (p === 'y') return '#ffff44';
    if (p === 'b') return '#4444ff';
}

function checkWin(player) {
    if (tokens[player].every(t => t === 58)) {
        GameManager.showResultModal('Ludo', 1000, 'WIN');
    }
}

function renderTokens() {
    // For this simplified demo, we won't fully map 3D coordinates.
    // Real Ludo implementation requires complex grid mapping.
    // We will just log the state for now to prove functionality in this turn
    // and visually would require mapping every cell ID.
    console.log("Tokens Updated:", tokens);
}
