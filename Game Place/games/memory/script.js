/**
 * Cosmic Memory Game
 */

const ICONS = ['🪐', '🚀', '👽', '☄️', '🔭', '🛰️', '🌟', '🌑'];
let cards = [...ICONS, ...ICONS]; // Pairs
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval;
let gameActive = false;

const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');

function initGame() {
    // Reset state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    gameActive = false;
    clearInterval(timerInterval);

    movesEl.innerText = '0';
    timerEl.innerText = '00:00';

    // Shuffle
    cards.sort(() => Math.random() - 0.5);

    // Render
    grid.innerHTML = '';
    cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.icon = icon;

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">${icon}</div>
        `;

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });

    startTimer();
}

function startTimer() {
    gameActive = true;
    timerInterval = setInterval(() => {
        timer++;
        const mins = Math.floor(timer / 60).toString().padStart(2, '0');
        const secs = (timer % 60).toString().padStart(2, '0');
        timerEl.innerText = `${mins}:${secs}`;
    }, 1000);
}

function flipCard() {
    if (!gameActive) return;
    if (flippedCards.length >= 2) return;
    if (this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesEl.innerText = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.icon === card2.dataset.icon;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedPairs++;

        if (matchedPairs === ICONS.length) {
            endGame(true);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function endGame(win) {
    clearInterval(timerInterval);
    gameActive = false;

    setTimeout(() => {
        // Calculate Score (Base 1000 - Moves * 10 - Time * 2)
        let score = Math.max(0, 1000 - (moves * 10) - (timer * 2));

        GameManager.showResultModal('Cosmic Memory', score, 'WIN');
        GameManager.recordResult('memory', score, 'WIN');
    }, 500);
}

// Start
document.addEventListener('DOMContentLoaded', initGame);
