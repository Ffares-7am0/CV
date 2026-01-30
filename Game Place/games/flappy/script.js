/**
 * Flappy Space Logic
 */

const GRAVITY = 0.25;
const FLAP = -4.5;
const SPAWN_RATE = 1500; // ms
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;

class FlappyGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.bird = { x: 50, y: 150, w: 30, h: 30, velocity: 0 };
        this.pipes = [];
        this.score = 0;
        this.gameActive = false;
        this.lastTime = 0;
        this.timer = 0;

        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.flap();
        });
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scroll
            this.flap();
        });

        // Initial Draw
        this.draw();
    }

    resize() {
        // height responsive
        this.canvas.width = Math.min(window.innerWidth - 20, 480);
        this.canvas.height = 640;
    }

    start() {
        if (this.gameActive) return;
        this.bird = { x: 50, y: this.canvas.height / 2, w: 30, h: 30, velocity: 0 };
        this.pipes = [];
        this.score = 0;
        this.scoreEl.innerText = 0;
        this.gameActive = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
        document.getElementById('msg').style.display = 'none';
        document.getElementById('start-btn').style.display = 'none';
    }

    flap() {
        if (!this.gameActive) return;
        this.bird.velocity = FLAP;
    }

    loop(time) {
        if (!this.gameActive) return;
        const dt = time - this.lastTime;
        this.lastTime = time;

        this.update(dt);
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Bird Physics
        this.bird.velocity += GRAVITY;
        this.bird.y += this.bird.velocity;

        // Spawn Pipes
        this.timer += dt;
        if (this.timer > SPAWN_RATE) {
            this.timer = 0;
            this.spawnPipe();
        }

        // Pipe Logic
        this.pipes.forEach((pipe, index) => {
            pipe.x -= 2; // Speed

            if (pipe.x + PIPE_WIDTH < 0) {
                this.pipes.splice(index, 1);
                this.score++;
                this.scoreEl.innerText = this.score;
            }

            // Collision
            // 1. Top Pipe
            if (
                this.bird.x < pipe.x + PIPE_WIDTH &&
                this.bird.x + this.bird.w > pipe.x &&
                this.bird.y < pipe.topHeight
            ) {
                this.gameOver();
            }
            // 2. Bottom Pipe
            if (
                this.bird.x < pipe.x + PIPE_WIDTH &&
                this.bird.x + this.bird.w > pipe.x &&
                this.bird.y + this.bird.h > pipe.topHeight + PIPE_GAP
            ) {
                this.gameOver();
            }
        });

        // Floor/Ceiling Collision
        if (this.bird.y + this.bird.h >= this.canvas.height || this.bird.y < 0) {
            this.gameOver();
        }
    }

    spawnPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - PIPE_GAP - minHeight;
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        this.pipes.push({
            x: this.canvas.width,
            topHeight: height
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Bird (Rocket)
        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--neon-gold');
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.w, this.bird.h);

        // Pipes (Neon Obstacles)
        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--neon-cyan');
        this.pipes.forEach(pipe => {
            // Top
            this.ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
            // Bottom
            this.ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, this.canvas.height - (pipe.topHeight + PIPE_GAP));
        });
    }

    gameOver() {
        this.gameActive = false;
        document.getElementById('msg').style.display = 'block';
        document.getElementById('msg').innerText = 'CRASHED';
        GameManager.recordResult('FlappySpace', this.score, 'GAME OVER');
        setTimeout(() => GameManager.showResultModal('FlappySpace', this.score, 'GAME OVER'), 500);
        document.getElementById('start-btn').style.display = 'block';
        document.getElementById('start-btn').innerText = 'RETRY MISSION';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlappyGame();
});
