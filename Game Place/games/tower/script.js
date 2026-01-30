
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

// Game constants
const INITIAL_WIDTH = 200;
const HEIGHT = 30;
const SPEED = 5;

// State
let width = INITIAL_WIDTH;
let currentBlock = null;
let stack = [];
let score = 0;
let gameOver = false;
let moveDir = 1;

function init() {
    stack = [];
    score = 0;
    width = INITIAL_WIDTH;
    gameOver = false;

    // Base block
    stack.push({
        x: (canvas.width - INITIAL_WIDTH) / 2,
        y: canvas.height - HEIGHT,
        w: INITIAL_WIDTH,
        h: HEIGHT,
        c: getRandomColor()
    });

    spawnNewBlock();
}

function spawnNewBlock() {
    const prevBlock = stack[stack.length - 1];
    currentBlock = {
        x: 0,
        y: prevBlock.y - HEIGHT,
        w: width,
        h: HEIGHT,
        c: getRandomColor()
    };
    // Randomize start pos usually, but for now 0 with speed
}

function update() {
    if (gameOver) return;

    currentBlock.x += SPEED * moveDir;

    if (currentBlock.x + currentBlock.w > canvas.width || currentBlock.x < 0) {
        moveDir *= -1;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Stack
    stack.forEach(b => {
        ctx.fillStyle = b.c;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(b.x, b.y, b.w, b.h);
    });

    // Draw Current
    if (currentBlock) {
        ctx.fillStyle = currentBlock.c;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
    }

    if (!gameOver) requestAnimationFrame(() => {
        update();
        draw();
    });
}

function placeBlock() {
    if (gameOver) {
        init();
        draw();
        return;
    }

    const prev = stack[stack.length - 1];
    const curr = currentBlock;

    // Check overlap
    let hit = false;
    // Difference in X
    let diff = curr.x - prev.x;

    if (Math.abs(diff) >= curr.w) {
        // Missed completely
        gameOver = true;
        GameManager.showResultModal('Tower Stack', score, 'GAME OVER');
        return;
    }

    // Cut block
    let left = curr.x < prev.x ? prev.x : curr.x;

    if (diff > 0) {
        // Overhang right -> cut right
        width -= diff;
        curr.w = width;
    } else {
        // Overhang left -> cut left
        width -= Math.abs(diff);
        curr.x = prev.x; // Shift to align with prev left edge basically
        curr.w = width;
    }

    stack.push(curr);
    score++;
    scoreEl.innerText = score;

    // Scroll down if too high
    if (currentBlock.y < 100) {
        stack.forEach(b => b.y += HEIGHT);
    }

    spawnNewBlock();
}

function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') placeBlock();
});
canvas.addEventListener('click', placeBlock);

init();
draw();
