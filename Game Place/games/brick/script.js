/**
 * Neon Brick Breaker Logic
 */

const canvas = document.getElementById('brickCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startMsg = document.getElementById('start-msg');

let score = 0;
let lives = 3;
let gameRunning = false;
let animationId;

// Paddle
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    width: 80,
    height: 10,
    color: 'var(--neon-cyan)',
    dx: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 6,
    dx: 4,
    dy: -4,
    speed: 4,
    color: 'white'
};

// Bricks
const brickRowCount = 5;
const brickColumnCount = 7;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;
const brickWidth = (canvas.width - 2 * brickOffsetLeft - (brickColumnCount - 1) * brickPadding) / brickColumnCount;
const brickHeight = 20;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Input
document.addEventListener('mousemove', mouseMoveHandler, false);
document.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        startMsg.style.display = 'none';
        loop();
    }
});

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
        // Clamp
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = 'cyan';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'cyan';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = `hsl(${c * 40}, 100%, 50%)`; // Rainbow rows
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;
                    scoreEl.innerText = score;
                    if (score === brickRowCount * brickColumnCount) {
                        endGame(true);
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            // Paddle Hit - Add speed? Change angle?
            ball.dy = -ball.dy;
            ball.dy *= 1.05; // Slightly faster
            ball.dx *= 1.05;
        } else {
            lives--;
            livesEl.innerText = lives;
            if (!lives) {
                endGame(false);
                return;
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 4;
                ball.dy = -4;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}

function endGame(win) {
    gameRunning = false;
    cancelAnimationFrame(animationId);

    GameManager.recordResult('brick', score, win ? 'WIN' : 'LOSE');
    GameManager.showResultModal('Neon Breakout', score, win ? 'WIN' : 'GAME OVER');
}

function loop() {
    if (!gameRunning) return;
    draw();
    animationId = requestAnimationFrame(loop);
}
