/**
 * Neon Racer Logic
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');

// Game State
let gameRunning = false;
let score = 0;
let speed = 5;
let frame = 0;

// Player
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 100,
    w: 40,
    h: 70,
    color: 'cyan',
    dx: 0
};

// Obstacles
let obstacles = [];

// Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -5;
    if (e.key === 'ArrowRight') player.dx = 5;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
    startScreen.classList.add('hidden');
    gameRunning = true;
    score = 0;
    speed = 5;
    obstacles = [];
    player.x = canvas.width / 2 - 20;
    loop();
}

function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Road
    drawRoad();

    // Player
    updatePlayer();
    drawCar(player.x, player.y, player.w, player.h, player.color);

    // Obstacles
    handleObstacles();

    // Score
    frame++;
    if (frame % 10 === 0) {
        score++;
        scoreEl.innerText = score;
        if (score % 500 === 0) speed += 1; // Increase speed
    }

    requestAnimationFrame(loop);
}

function drawRoad() {
    // Road Borders
    ctx.fillStyle = '#222';
    ctx.fillRect(50, 0, canvas.width - 100, canvas.height);

    ctx.strokeStyle = 'var(--neon-purple)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(50, 0); ctx.lineTo(50, canvas.height);
    ctx.moveTo(canvas.width - 50, 0); ctx.lineTo(canvas.width - 50, canvas.height);
    ctx.stroke();

    // Center Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -frame * speed; // Moving effect
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, -50);
    ctx.lineTo(canvas.width / 2, canvas.height + 50);
    ctx.stroke();
    ctx.setLineDash([]);
}

function updatePlayer() {
    player.x += player.dx;
    // Boundaries
    if (player.x < 50) player.x = 50;
    if (player.x + player.w > canvas.width - 50) player.x = canvas.width - 50 - player.w;
}

function drawCar(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;

    // Simple Car Shape
    ctx.fillRect(x, y, w, h);

    // Windshield
    ctx.fillStyle = '#000';
    ctx.shadowBlur = 0;
    ctx.fillRect(x + 5, y + 10, w - 10, 15);

    // Lights inside drawCar to prevent context leak? No, shadowBlur needs reset
    ctx.shadowBlur = 0;
}

function handleObstacles() {
    if (frame % 60 === 0) { // Spawn rate
        const obsW = 40;
        const lane = Math.random() < 0.5 ? canvas.width / 2 - 20 - obsW - 10 : canvas.width / 2 + 20 + 10;
        // Randomize position within road bounds more nicely
        const minX = 60;
        const maxX = canvas.width - 60 - obsW;
        const rX = Math.random() * (maxX - minX) + minX;

        obstacles.push({
            x: rX,
            y: -100,
            w: obsW,
            h: 70,
            color: 'red'
        });
    }

    obstacles.forEach((obs, index) => {
        obs.y += speed;
        drawCar(obs.x, obs.y, obs.w, obs.h, obs.color);

        // Collsision
        if (
            player.x < obs.x + obs.w &&
            player.x + player.w > obs.x &&
            player.y < obs.y + obs.h &&
            player.y + player.h > obs.y
        ) {
            endGame();
        }

        // Remove off-screen
        if (obs.y > canvas.height) {
            obstacles.splice(index, 1);
        }
    });
}

function endGame() {
    gameRunning = false;
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');

    GameManager.recordResult('car', score, 'GAME OVER');
    GameManager.showResultModal('Neon Racer', score, 'GAME OVER');
}
