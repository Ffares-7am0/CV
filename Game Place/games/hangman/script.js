
const words = ['ASTRONOMY', 'GALAXY', 'NEBULA', 'PLANET', 'GRAVITY', 'COMET', 'TELESCOPE', 'UNIVERSE', 'ECLIPSE', 'ASTEROID', 'SATELLITE', 'COSMONAUT'];
let targetWord = '';
let guessed = [];
let mistakes = 0;
const maxMistakes = 6;

const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');

function init() {
    targetWord = words[Math.floor(Math.random() * words.length)];
    guessed = [];
    mistakes = 0;

    // Reset Drawing
    for (let i = 0; i < 6; i++) {
        document.getElementById(`part-${i}`).style.display = 'none';
    }

    createKeyboard();
    updateDisplay();
}

function createKeyboard() {
    keyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    letters.split('').forEach(char => {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.innerText = char;
        btn.onclick = () => handleGuess(char, btn);
        keyboard.appendChild(btn);
    });
}

function handleGuess(char, btn) {
    btn.disabled = true;
    if (targetWord.includes(char)) {
        guessed.push(char);
        btn.style.backgroundColor = '#4caf50';
        updateDisplay();
        checkWin();
    } else {
        mistakes++;
        document.getElementById(`part-${mistakes - 1}`).style.display = 'block';
        btn.style.backgroundColor = '#f44336';
        if (mistakes >= maxMistakes) {
            GameManager.showResultModal('Hangman', 0, 'GAME OVER');
        }
    }
}

function updateDisplay() {
    const display = targetWord.split('').map(char => guessed.includes(char) ? char : '_').join(' ');
    wordDisplay.innerText = display;
}

function checkWin() {
    if (!wordDisplay.innerText.includes('_')) {
        GameManager.showResultModal('Hangman', 100, 'WIN');
    }
}

init();
