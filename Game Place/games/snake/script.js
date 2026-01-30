/**
 * Snake Game Logic
 */
const CELL_SIZE = 20;
let GRID_SIZE = 20;

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score-value');

        // Responsive Canvas
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.gameActive = false;
        this.score = 0;
        this.speed = 150;
        this.lastRender = 0;

        document.addEventListener('keydown', (e) => this.handleInput(e));
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());

        // Mobile Controls
        document.getElementById('btn-up').addEventListener('click', () => this.setDirection(0, -1));
        document.getElementById('btn-down').addEventListener('click', () => this.setDirection(0, 1));
        document.getElementById('btn-left').addEventListener('click', () => this.setDirection(-1, 0));
        document.getElementById('btn-right').addEventListener('click', () => this.setDirection(1, 0));
    }

    resize() {
        // limit canvas size to be within view
        const size = Math.min(window.innerWidth - 40, 400);
        this.canvas.width = size;
        this.canvas.height = size;
        GRID_SIZE = Math.floor(size / CELL_SIZE);
    }

    startGame() {
        if (this.gameActive) return;
        this.snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.placeFood();
        this.score = 0;
        this.updateScore(0);
        this.gameActive = true;
        this.speed = 150;
        document.getElementById('status-msg').style.display = 'none';

        requestAnimationFrame((time) => this.loop(time));
    }

    loop(currentTime) {
        if (!this.gameActive) return;

        requestAnimationFrame((time) => this.loop(time));

        const secondsSinceLastRender = (currentTime - this.lastRender) / 1000;
        if (secondsSinceLastRender < this.speed / 1000) return;

        this.lastRender = currentTime;
        this.update();
        this.draw();
    }

    update() {
        this.direction = this.nextDirection;
        const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

        // Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            this.gameOver();
            return;
        }

        // Self Collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Food Collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore(this.score);
            this.speed = Math.max(50, this.speed - 2); // Increase speed
            this.placeFood();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Food
        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--neon-gold');
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * CELL_SIZE + CELL_SIZE / 2,
            this.food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Snake
        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--neon-cyan');
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2
            );
        });
    }

    placeFood() {
        let valid = false;
        while (!valid) {
            this.food = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            // Ensure food doesn't spawn on snake
            valid = !this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y);
        }
    }

    handleInput(e) {
        if (!this.gameActive) return;

        switch (e.key) {
            case 'ArrowUp': this.setDirection(0, -1); break;
            case 'ArrowDown': this.setDirection(0, 1); break;
            case 'ArrowLeft': this.setDirection(-1, 0); break;
            case 'ArrowRight': this.setDirection(1, 0); break;
        }
    }

    setDirection(x, y) {
        if (this.direction.x === -x && this.direction.y === -y) return; // Prevent 180 reverse
        this.nextDirection = { x, y };
    }

    updateScore(val) {
        this.scoreElement.innerText = val;
    }

    gameOver() {
        this.gameActive = false;
        GameManager.recordResult('Snake', this.score, 'GAME OVER');
        GameManager.showResultModal('Snake', this.score, 'GAME OVER');
        document.getElementById('status-msg').style.display = 'block';
        document.getElementById('status-msg').innerText = "Game Over!";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
