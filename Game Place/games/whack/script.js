
const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
let lastHole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(500, 1500); // Speed
    const hole = randomHole(holes);
    hole.classList.add('up');

    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    startBtn.style.display = 'none';
    peep();
    setTimeout(() => {
        timeUp = true;
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Play Again';
        GameManager.showResultModal('Whack-a-Mole', score, 'GAME OVER');
    }, 20000); // 20 Seconds Game
}

function bonk(e) {
    if (!e.isTrusted) return; // Cheater!
    if (!this.classList.contains('up')) return;

    score++;
    this.classList.remove('up');
    scoreBoard.textContent = score;

    // Impact effect? (Optional)
}

holes.forEach(hole => hole.addEventListener('click', bonk));
startBtn.addEventListener('click', startGame);
