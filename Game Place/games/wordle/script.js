
const dictionary = ['SPACE', 'ALIEN', 'EARTH', 'ORBIT', 'STARS', 'COMET', 'MOONS', 'ROBOT', 'LASER', 'SOLAR', 'PLUTO', 'VENUS'];
const targetWord = dictionary[Math.floor(Math.random() * dictionary.length)];
let currentRow = 0;
let currentTile = 0;
const rows = 6;
const cols = 5;

const boardContainer = document.getElementById('board-container');
const keyboardContainer = document.getElementById('keyboard');

// Init Board
const guesses = Array(rows).fill(null).map(() => Array(cols).fill(''));

for (let r = 0; r < rows; r++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    for (let c = 0; c < cols; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${r}-${c}`;
        rowEl.appendChild(tile);
    }
    boardContainer.appendChild(rowEl);
}

// Init Keyboard
const keys = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
];

keys.forEach(rowStr => {
    const rowEl = document.createElement('div');
    rowEl.className = 'key-row';

    // Add Enter/Backspace for bottom row
    if (rowStr.startsWith('Z')) {
        const enterKey = createKey('ENTER');
        enterKey.onclick = submitGuess;
        rowEl.appendChild(enterKey);
    }

    rowStr.split('').forEach(char => {
        const key = createKey(char);
        key.onclick = () => addLetter(char);
        rowEl.appendChild(key);
    });

    if (rowStr.startsWith('Z')) {
        const bsKey = createKey('⌫');
        bsKey.onclick = backspace;
        rowEl.appendChild(bsKey);
    }

    keyboardContainer.appendChild(rowEl);
});

function createKey(char) {
    const key = document.createElement('div');
    key.className = 'key';
    key.textContent = char;
    key.id = `key-${char}`;
    return key;
}

function addLetter(char) {
    if (currentTile < 5 && currentRow < 6) {
        guesses[currentRow][currentTile] = char;
        const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
        tile.textContent = char;
        tile.classList.add('filled');
        currentTile++;
    }
}

function backspace() {
    if (currentTile > 0) {
        currentTile--;
        guesses[currentRow][currentTile] = '';
        const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
        tile.textContent = '';
        tile.classList.remove('filled');
    }
}

function submitGuess() {
    if (currentTile !== 5) return;

    const guess = guesses[currentRow].join('');

    // Check Tiles
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);
        const letter = guess[i];
        const key = document.getElementById(`key-${letter}`);

        // Colors
        if (letter === targetWord[i]) {
            tile.classList.add('correct');
            // Update key if not already correct?
            key.style.backgroundColor = '#6aaa64';
        } else if (targetWord.includes(letter)) {
            tile.classList.add('present');
            if (key.style.backgroundColor !== 'rgb(106, 170, 100)') key.style.backgroundColor = '#c9b458';
        } else {
            tile.classList.add('absent');
            key.style.backgroundColor = '#787c7e';
        }

        // Basic delay animation could go here
    }

    if (guess === targetWord) {
        setTimeout(() => GameManager.showResultModal('Wordle', 100, 'WIN'), 500);
    } else {
        if (currentRow === 5) {
            setTimeout(() => GameManager.showResultModal('Wordle', 0, 'GAME OVER'), 500); // Lost
        } else {
            currentRow++;
            currentTile = 0;
        }
    }
}

// Physical Keyboard Support
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitGuess();
    else if (e.key === 'Backspace') backspace();
    else {
        const char = e.key.toUpperCase();
        if (char.length === 1 && char >= 'A' && char <= 'Z') addLetter(char);
    }
});
