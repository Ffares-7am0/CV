
const board = document.getElementById('minesweeper-board');
const mineCountDisplay = document.getElementById('mine-count');
const ROWS = 10;
const COLS = 10;
const MINES = 10;

let grid = [];
let mines = [];
let gameOver = false;
let flags = 0;

function initGame() {
    board.innerHTML = '';
    grid = [];
    mines = [];
    gameOver = false;
    flags = 0;
    mineCountDisplay.innerText = MINES;

    // Create Grid
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r;
            cell.dataset.c = c;

            cell.addEventListener('click', (e) => handleClick(r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleFlag(r, c);
            });

            board.appendChild(cell);
            row.push({
                element: cell,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            });
        }
        grid.push(row);
    }

    placeMines();
    countNeighbors();
}

function placeMines() {
    let placed = 0;
    while (placed < MINES) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);

        if (!grid[r][c].isMine) {
            grid[r][c].isMine = true;
            mines.push(grid[r][c]);
            placed++;
        }
    }
}

function countNeighbors() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c].isMine) continue;

            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].isMine) {
                        count++;
                    }
                }
            }
            grid[r][c].neighborMines = count;
        }
    }
}

function handleClick(r, c) {
    if (gameOver || grid[r][c].isFlagged || grid[r][c].isRevealed) return;

    const cell = grid[r][c];

    if (cell.isMine) {
        // Game Over
        revealAllMines();
        gameOver = true;
        GameManager.showResultModal('Minesweeper', 0, 'GAME OVER');
    } else {
        revealCell(r, c);
        checkWin();
    }
}

function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    const cell = grid[r][c];
    cell.isRevealed = true;
    cell.element.classList.add('revealed');

    if (cell.neighborMines > 0) {
        cell.element.innerText = cell.neighborMines;
        cell.element.classList.add(`c-${cell.neighborMines}`);
    } else {
        // Flood fill empty cells
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(r + i, c + j);
            }
        }
    }
}

function handleFlag(r, c) {
    if (gameOver || grid[r][c].isRevealed) return;

    const cell = grid[r][c];
    if (!cell.isFlagged && flags < MINES) {
        cell.isFlagged = true;
        cell.element.classList.add('flag');
        flags++;
    } else if (cell.isFlagged) {
        cell.isFlagged = false;
        cell.element.classList.remove('flag');
        flags--;
    }
    mineCountDisplay.innerText = MINES - flags;
}

function revealAllMines() {
    mines.forEach(m => {
        m.element.classList.add('mine');
        m.element.innerText = '💣';
    });
}

function checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c].isRevealed) revealedCount++;
        }
    }

    if (revealedCount === (ROWS * COLS - MINES)) {
        gameOver = true;
        GameManager.showResultModal('Minesweeper', 1000, 'WIN');
    }
}

initGame();
