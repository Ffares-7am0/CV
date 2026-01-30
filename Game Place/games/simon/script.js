
const buttons = {
    green: document.getElementById('green'),
    red: document.getElementById('red'),
    yellow: document.getElementById('yellow'),
    blue: document.getElementById('blue')
};
const startBtn = document.getElementById('center-btn');
const levelDisplay = document.getElementById('level');

let sequence = [];
let playerSequence = [];
let level = 0;
let isPlaying = false;
let isComputerTurn = false;

function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    sequence = [];
    playerSequence = [];
    level = 0;
    levelDisplay.innerText = level;
    startBtn.innerText = '...';
    nextRound();
}

function nextRound() {
    level++;
    levelDisplay.innerText = level;
    playerSequence = [];

    // Add random color
    const colors = ['green', 'red', 'yellow', 'blue'];
    const randomColor = colors[Math.floor(Math.random() * 4)];
    sequence.push(randomColor);

    playSequence();
}

function playSequence() {
    isComputerTurn = true;
    document.body.style.cursor = 'wait';

    let i = 0;
    const interval = setInterval(() => {
        const color = sequence[i];
        flashButton(color);
        i++;

        if (i >= sequence.length) {
            clearInterval(interval);
            isComputerTurn = false;
            document.body.style.cursor = 'default';
            startBtn.innerText = 'GO';
        }
    }, 800);
}

function flashButton(color) {
    const btn = buttons[color];
    btn.classList.add('lit');
    // Sound could go here
    setTimeout(() => {
        btn.classList.remove('lit');
    }, 400);
}

function handleInput(color) {
    if (!isPlaying || isComputerTurn) return;

    flashButton(color);
    playerSequence.push(color);

    // Check
    const index = playerSequence.length - 1;
    if (playerSequence[index] !== sequence[index]) {
        gameOver();
        return;
    }

    if (playerSequence.length === sequence.length) {
        setTimeout(nextRound, 1000);
    }
}

function gameOver() {
    isPlaying = false;
    startBtn.innerText = 'START';
    GameManager.showResultModal('Simon Says', level, 'GAME OVER');
}
