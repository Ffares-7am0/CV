
const wordDisplay = document.getElementById('current-word');
const textInput = document.getElementById('text-input');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const timerBar = document.getElementById('timer-bar');

const words = [
    'star', 'galaxy', 'planet', 'nebula', 'comet',
    'orbit', 'asteroid', 'gravity', 'rocket', 'launch',
    'cosmos', 'alien', 'laser', 'void', 'moon',
    'mars', 'venus', 'earth', 'saturn', 'pluto',
    'solar', 'lunar', 'eclipse', 'meteor', 'crater',
    'telescope', 'astronaut', 'shuttle', 'station', 'probe',
    'blackhole', 'supernova', 'quasar', 'pulsar', 'photon'
];

let time = 10;
let score = 0;
let isPlaying = false;
let timerInterval;

function init() {
    isPlaying = true;
    showWord(words);
    textInput.addEventListener('input', startMatch);
    timerInterval = setInterval(countdown, 1000);
    textInput.focus();
}

function startMatch() {
    if (matchWords()) {
        isPlaying = true;
        time = 11; // Reset time (+1 for delay)
        showWord(words);
        textInput.value = '';
        score++;
    }
    scoreDisplay.innerHTML = score;
}

function matchWords() {
    if (textInput.value.toLowerCase() === wordDisplay.innerHTML.toLowerCase()) {
        wordDisplay.innerHTML = '';
        return true;
    } else {
        return false;
    }
}

function showWord(wordList) {
    const randIndex = Math.floor(Math.random() * wordList.length);
    wordDisplay.innerHTML = wordList[randIndex];
}

function countdown() {
    if (time > 0) {
        time--;
    } else if (time === 0) {
        isPlaying = false;
    }
    timeDisplay.innerHTML = time;

    // Bar
    const percent = (time / 10) * 100;
    timerBar.style.width = percent > 100 ? '100%' : `${percent}%`;

    if (!isPlaying && time === 0) {
        clearInterval(timerInterval);
        wordDisplay.innerHTML = 'Game Over';
        GameManager.showResultModal('Speed Typing', score, 'GAME OVER');
    }
}

// Start immediately on load or focus?
// Let's require click to start actually
textInput.placeholder = "Click & Type to Start";
textInput.addEventListener('focus', () => {
    if (!isPlaying && time > 0) init();
}, { once: true });
