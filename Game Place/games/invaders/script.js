
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

// Game Objects
const player = { x: canvas.width / 2 - 15, y: canvas.height - 30, w: 30, h: 20, speed: 5, dx: 0 };
let bullets = [];
let alienBullets = [];
let aliens = [];
let score = 0;
let gameOver = false;

// Init Aliens
const rows = 4;
const cols = 8;
const alienWidth = 30;
const alienHeight = 20;
const padding = 15;
const xOffset = 30;
const yOffset = 30;

let alienDir = 1; // 1 = right, -1 = left
let alienSpeed = 1;

function init() {
    aliens = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            aliens.push({
                x: xOffset + c * (alienWidth + padding),
                y: yOffset + r * (alienHeight + padding),
                w: alienWidth,
                h: alienHeight,
                alive: true
            });
        }
    }
}

function update() {
    if (gameOver) return;

    // Move Player
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

    // Move Bullets
    bullets.forEach((b, i) => {
        b.y -= 7;
        if (b.y < 0) bullets.splice(i, 1);
    });

    // Move Alien Bullets
    alienBullets.forEach((b, i) => {
        b.y += 5;
        if (b.y > canvas.height) alienBullets.splice(i, 1);

        // Player Hit Check
        if (b.x > player.x && b.x < player.x + player.w &&
            b.y > player.y && b.y < player.y + player.h) {
            gameOver = true;
            GameManager.showResultModal('Space Invaders', score, 'GAME OVER');
        }
    });

    // Move Aliens
    let moveDown = false;
    let rightEdge = canvas.width - 30;

    // Find edges based on living aliens
    let livingAliens = aliens.filter(a => a.alive);
    if (livingAliens.length === 0) {
        gameOver = true;
        GameManager.showResultModal('Space Invaders', score, 'WIN');
        return;
    }

    // Move block
    livingAliens.forEach(alien => alien.x += alienSpeed * alienDir);

    // Check boundaries
    let minX = Math.min(...livingAliens.map(a => a.x));
    let maxX = Math.max(...livingAliens.map(a => a.x + a.w));

    if (maxX > canvas.width - 10 || minX < 10) {
        alienDir *= -1;
        aliens.forEach(alien => alien.y += 10); // Drop down

        // Lose if too low
        let maxY = Math.max(...livingAliens.map(a => a.y + a.h));
        if (maxY > player.y) {
            gameOver = true;
            GameManager.showResultModal('Space Invaders', score, 'GAME OVER');
        }
    }

    // Alien Shoot
    if (Math.random() < 0.02) {
        const shooter = livingAliens[Math.floor(Math.random() * livingAliens.length)];
        alienBullets.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h, w: 4, h: 10 });
    }

    // Collisions
    bullets.forEach((b, bi) => {
        aliens.forEach((a, ai) => {
            if (a.alive && b.x > a.x && b.x < a.x + a.w &&
                b.y > a.y && b.y < a.y + a.h) {
                a.alive = false;
                bullets.splice(bi, 1);
                score += 10;
                scoreEl.innerText = score;
                // Increase speed
                if (aliens.filter(al => al.alive).length % 5 === 0) alienSpeed += 0.2;
            }
        });
    });
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = '#0f0';
    ctx.fillRect(player.x, player.y, player.w, player.h); // Main
    ctx.fillRect(player.x + 12, player.y - 5, 6, 5); // Cannon

    // Bullets
    ctx.fillStyle = '#fff';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

    // Alien Bullets
    ctx.fillStyle = '#f00';
    alienBullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

    // Aliens
    aliens.forEach(a => {
        if (a.alive) {
            ctx.fillStyle = '#f0f';
            ctx.fillRect(a.x, a.y, a.w, a.h);
            // Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(a.x + 5, a.y + 5, 5, 5);
            ctx.fillRect(a.x + 20, a.y + 5, 5, 5);
        }
    });

    if (!gameOver) requestAnimationFrame(() => {
        update();
        draw();
    });
}

document.addEventListener('keydown', e => {
    if (e.code === 'ArrowRight') player.dx = player.speed;
    if (e.code === 'ArrowLeft') player.dx = -player.speed;
    if (e.code === 'Space') {
        if (bullets.length < 3) // Limit shots
            bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10 });
    }
});

document.addEventListener('keyup', e => {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') player.dx = 0;
});

init();
draw();
