
const board = document.getElementById('sudoku-board');
let selectedCell = null;

// Simple Easy Puzzle for Demo (0 = empty)
const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Solution for validation
const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

let currentBoard = JSON.parse(JSON.stringify(initialBoard));

function init() {
    board.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const val = initialBoard[r][c];
            if (val !== 0) {
                cell.innerText = val;
                cell.classList.add('fixed');
            } else {
                cell.addEventListener('click', () => selectCell(cell, r, c));
            }
            cell.id = `cell-${r}-${c}`;
            board.appendChild(cell);
        }
    }
}

function selectCell(cell, r, c) {
    if (selectedCell) selectedCell.element.classList.remove('selected');
    selectedCell = { element: cell, r: r, c: c };
    cell.classList.add('selected');
}

function fillNumber(num) {
    if (!selectedCell) return;

    const { r, c } = selectedCell;
    currentBoard[r][c] = num;
    selectedCell.element.innerText = num === 0 ? '' : num;
}

function checkSolution() {
    let mistakes = 0;
    let isComplete = true;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (currentBoard[r][c] === 0) {
                isComplete = false;
            } else if (currentBoard[r][c] !== solution[r][c]) {
                mistakes++;
                document.getElementById(`cell-${r}-${c}`).style.color = 'red';
            }
        }
    }

    if (mistakes > 0) {
        alert(`You have ${mistakes} mistakes. Keep trying!`);
    } else if (isComplete) {
        GameManager.showResultModal('Sudoku', 1000, 'WIN');
    } else {
        alert('Puzzle not finished yet.');
    }
}

init();
