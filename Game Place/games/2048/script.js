/**
 * 2048 Game Logic
 */
class Game2048 {
    constructor() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.tileContainer = document.getElementById('tile-container');
        this.scoreEl = document.getElementById('score');
        this.messageEl = document.getElementById('game-message');
        this.messageText = document.getElementById('message-text');
        this.tiles = []; // Internal optimization to track DOM nodes if needed

        this.initInput();
        this.start();
    }

    start() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.updateScore(0);
        this.tileContainer.innerHTML = '';
        this.messageEl.classList.add('hidden');

        this.addNewTile();
        this.addNewTile();
        this.draw();
    }

    addNewTile() {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.grid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    draw() {
        this.tileContainer.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.grid[r][c] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[r][c]}`;
                    tile.innerText = this.grid[r][c];

                    // Position calc: 10px gap, 67.5px size. 
                    // x = 10 + c*(67.5+10) -> not exact due to container padding...
                    // Container padding 15px? No, CSS #tile-container is absolute Top 15 Left 15.
                    // The grid gaps is 10px. 
                    // Cell 0,0: 0,0 relative to tile container?
                    // Let's use % or calc. 300px total width. 4 cells (25%)

                    // Simple calc:
                    // gap=10, size=67.5.
                    // 0: 0
                    // 1: 77.5
                    // 2: 155
                    // 3: 232.5

                    const left = c * (67.5 + 10); // 0, 77.5, 155, 232.5
                    const top = r * (67.5 + 10);

                    tile.style.transform = `translate(${left}px, ${top}px)`;
                    this.tileContainer.appendChild(tile);
                }
            }
        }
    }

    move(direction) {
        // 0: Up, 1: Right, 2: Down, 3: Left
        let moved = false;
        const newGrid = this.grid.map(row => [...row]);

        // Logic for sliding and merging...
        // Generalized: rotate grid to always process 'Left' logic then rotate back?
        // Or manual implementation.

        const rotate = (grid) => grid[0].map((val, index) => grid.map(row => row[index]).reverse());

        let workingGrid = [...this.grid];

        // Orient so we always move Left (3), which is standard Merge Row [a,b,0,c] -> [a,b,c,0]

        // Map directions to rotations needed to make it "Left"
        // Up (0) -> Rotate 3 times (270 deg) -> Left logic -> Rotate 1
        // Right (1) -> Rotate 2 times -> Left logic -> Rotate 2
        // Down (2) -> Rotate 1 time -> Left logic -> Rotate 3
        // Left (3) -> 0 rotations

        let rotations = 0;
        if (direction === 0) rotations = 3;
        if (direction === 1) rotations = 2;
        if (direction === 2) rotations = 1;

        for (let i = 0; i < rotations; i++) workingGrid = rotate(workingGrid);

        // Process Left Shift & Merge
        let scoreAdd = 0;
        for (let r = 0; r < 4; r++) {
            let row = workingGrid[r].filter(val => val !== 0);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    scoreAdd += row[i];
                    row.splice(i + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            workingGrid[r] = row;
        }

        // Rotate back
        for (let i = 0; i < (4 - rotations) % 4; i++) workingGrid = rotate(workingGrid);

        // Check change
        if (JSON.stringify(this.grid) !== JSON.stringify(workingGrid)) {
            this.grid = workingGrid;
            this.score += scoreAdd;
            this.updateScore(this.score);
            this.addNewTile();
            this.draw();
            this.checkStatus();
        }
    }

    updateScore(val) {
        this.scoreEl.innerText = val;
    }

    checkStatus() {
        // Win check
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.grid[r][c] === 2048) {
                    this.gameOver(true);
                    return;
                }
            }
        }

        // Loss check: No empty cells and no merges possible
        let hasEmpty = false;
        for (let r = 0; r < 4; r++) if (this.grid[r].includes(0)) hasEmpty = true;

        if (!hasEmpty) {
            let canMerge = false;
            // Check right/down neighbors
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) canMerge = true;
                    if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) canMerge = true;
                }
            }
            if (!canMerge) this.gameOver(false);
        }
    }

    gameOver(win) {
        this.messageText.innerText = win ? "You Won!" : "Game Over";
        this.messageText.style.color = win ? "var(--neon-gold)" : "var(--neon-purple)";
        this.messageEl.classList.remove('hidden');

        const res = win ? 'WIN' : 'LOSE';
        GameManager.recordResult('2048', this.score, res);

        if (win) {
            // Let them keep playing? Simplified: Show modal once
            GameManager.showResultModal('2048', this.score, 'WIN');
        } else {
            GameManager.showResultModal('2048', this.score, 'GAME OVER');
        }
    }

    initInput() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                if (e.key === 'ArrowUp') this.move(0);
                if (e.key === 'ArrowRight') this.move(1);
                if (e.key === 'ArrowDown') this.move(2);
                if (e.key === 'ArrowLeft') this.move(3);
            }
        });
    }

    static restart() {
        window.location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game2048();
});
