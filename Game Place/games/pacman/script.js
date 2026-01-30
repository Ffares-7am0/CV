
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// 20x20 Grid, tiles are 20px
const ROWS = 20;
const COLS = 20;
const TILE = 20;

// Map: 1 = Wall, 0 = Dot, 2 = Power Pellet, 9 = Empty
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 9, 1, 9, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [9, 9, 9, 1, 0, 1, 9, 9, 9, 9, 9, 9, 9, 1, 0, 0, 1, 9, 9, 9],
    [1, 1, 1, 1, 0, 1, 9, 1, 1, 9, 9, 1, 1, 9, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 9, 9, 9, 9, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // Simplified map for brevity, usually should be square
];
// Pad map to 20 rows if needed or adjust logic.
// Above has 18 rows. Let's add 2 fill rows to be safe or adjust logic.
while (map.length < 20) map.push(new Array(20).fill(1));


let score = 0;
let pacman = { x: 1, y: 1, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouth: 0.2, mouthDir: 1 };
let dots = 0;

// Count dots
map.forEach(row => row.forEach(tile => { if (tile === 0) dots++; }));

function update() {
    // Try to change direction
    if (canMove(pacman.x, pacman.y, pacman.nextDx, pacman.nextDy)) {
        pacman.dx = pacman.nextDx;
        pacman.dy = pacman.nextDy;
    }

    // Move
    if (canMove(pacman.x, pacman.y, pacman.dx, pacman.dy)) {
        // Simple discrete movement for valid tiles
        // Basic Pacman usually has smooth movement between tiles, 
        // here we jump tiles for simplicity in this implementation
        // To make it playable we slow it down significantly
    }
}

// Smooth implementation needs frame interpolation, 
// for concise implementation we'll use a tick-based movement
let tick = 0;
function gameLoop() {
    tick++;
    if (tick % 10 === 0) { // Move every 10 frames
        movePacman();
    }

    // Animate Mouth
    pacman.mouth += 0.1 * pacman.mouthDir;
    if (pacman.mouth > 0.2 || pacman.mouth < 0) pacman.mouthDir *= -1;

    draw();
    if (dots > 0) requestAnimationFrame(gameLoop);
    else GameManager.showResultModal('Pac-Man', score, 'WIN');
}

function movePacman() {
    // Attempt turn
    let nextX = pacman.x + pacman.nextDx;
    let nextY = pacman.y + pacman.nextDy;
    if (!isWall(nextX, nextY)) {
        pacman.dx = pacman.nextDx;
        pacman.dy = pacman.nextDy;
    }

    // Move
    let newX = pacman.x + pacman.dx;
    let newY = pacman.y + pacman.dy;

    if (!isWall(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;

        // Eat Dot
        if (map[pacman.y][pacman.x] === 0) {
            map[pacman.y][pacman.x] = 9;
            score += 10;
            dots--;
            scoreDisplay.innerText = score;
            if (dots === 0) GameManager.showResultModal('Pac-Man', score, 'WIN');
        }
    }
}

function isWall(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
    return map[y][x] === 1;
}

function canMove(x, y, dx, dy) {
    return !isWall(x + dx, y + dy);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = '#2222ff';
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            } else if (map[y][x] === 0) {
                ctx.fillStyle = '#ffbbbb';
                ctx.beginPath();
                ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Draw Key Pacman
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();

    // Rotation logic for drawing
    let angle = 0;
    if (pacman.dx === 1) angle = 0;
    if (pacman.dx === -1) angle = Math.PI;
    if (pacman.dy === -1) angle = -Math.PI / 2;
    if (pacman.dy === 1) angle = Math.PI / 2;

    ctx.translate(pacman.x * TILE + TILE / 2, pacman.y * TILE + TILE / 2);
    ctx.rotate(angle);
    ctx.arc(0, 0, TILE / 2 - 2, 0.2 + pacman.mouth, (Math.PI * 2) - (0.2 + pacman.mouth));
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') { pacman.nextDx = -1; pacman.nextDy = 0; }
    if (e.code === 'ArrowRight') { pacman.nextDx = 1; pacman.nextDy = 0; }
    if (e.code === 'ArrowUp') { pacman.nextDx = 0; pacman.nextDy = -1; }
    if (e.code === 'ArrowDown') { pacman.nextDx = 0; pacman.nextDy = 1; }
});

gameLoop();
