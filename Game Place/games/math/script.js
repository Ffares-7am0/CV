
const problemEl = document.getElementById('problem');
const inputEl = document.getElementById('answer-input');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

let score = 0;
let time = 10;
let currentAnswer = 0;
let interval;
let isPlaying = false;

function generateProblem() {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * 3)];
    let n1 = Math.floor(Math.random() * 20) + 1;
    let n2 = Math.floor(Math.random() * 20) + 1;

    // Easy mode adjust
    if (op === '*') {
        n1 = Math.floor(Math.random() * 12) + 1;
        n2 = Math.floor(Math.random() * 12) + 1;
    }
    if (op === '-' && n1 < n2) {
        let temp = n1; n1 = n2; n2 = temp;
    }

    currentAnswer = eval(`${n1} ${op} ${n2}`);
    problemEl.innerText = `${n1} ${op} ${n2} = ?`;
}

function startGame() {
    score = 0;
    time = 10;
    isPlaying = true;
    scoreEl.innerText = 0;

    generateProblem();

    if (interval) clearInterval(interval);
    interval = setInterval(() => {
        time--;
        timerEl.innerText = time + 's';

        if (time <= 3) timerEl.style.borderColor = 'red';
        else timerEl.style.borderColor = 'var(--neon-gold)';

        if (time <= 0) {
            gameOver();
        }
    }, 1000);

    inputEl.value = '';
    inputEl.focus();
}

function checkAnswer() {
    if (!isPlaying) return;

    const val = parseInt(inputEl.value);
    if (val === currentAnswer) {
        score++;
        scoreEl.innerText = score;
        time += 2; // Bonus time
        inputEl.value = '';
        generateProblem();
    } else {
        // Wrong answer penalty? Or just clear?
        inputEl.style.borderColor = 'red';
        setTimeout(() => inputEl.style.borderColor = 'var(--neon-purple)', 200);
        inputEl.value = '';
    }
}

function gameOver() {
    isPlaying = false;
    clearInterval(interval);
    GameManager.showResultModal('Math Challenge', score, 'GAME OVER');
}

inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

startGame();
