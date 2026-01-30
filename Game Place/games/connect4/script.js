/**
 * Connect Four Logic
 */

class Connect4 {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = [];
        this.currPlayer = 'red'; // red (human) vs yellow (AI)
        this.gameActive = true;
        this.boardEl = document.getElementById('board');
        this.statusEl = document.getElementById('status');

        this.init();
    }

    init() {
        this.createBoard();
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    }

    createBoard() {
        this.board = [];
        this.boardEl.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push(null);
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.c = c;
                cell.addEventListener('click', () => this.handleMove(c));
                this.boardEl.appendChild(cell);
            }
            this.board.push(row);
        }
    }

    handleMove(col) {
        if (!this.gameActive || this.currPlayer !== 'red') return;

        if (this.dropPiece(col, 'red')) {
            if (this.checkWin('red')) {
                this.endGame('You Win!', 'WIN');
            } else {
                this.currPlayer = 'yellow';
                this.statusEl.innerText = "AI Thinking...";
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    dropPiece(col, player) {
        for (let r = this.rows - 1; r >= 0; r--) {
            if (!this.board[r][col]) {
                this.board[r][col] = player;
                this.animateDrop(r, col, player);
                return true;
            }
        }
        return false;
    }

    animateDrop(r, c, player) {
        const index = r * this.cols + c;
        const cell = this.boardEl.children[index];
        const piece = document.createElement('div');
        piece.className = `piece ${player}`;
        cell.appendChild(piece);
    }

    makeAIMove() {
        if (!this.gameActive) return;

        // Simple AI: Random valid column (Upgrade to Minimax later)
        const validCols = [];
        for (let c = 0; c < this.cols; c++) {
            if (!this.board[0][c]) validCols.push(c);
        }

        if (validCols.length > 0) {
            const choice = validCols[Math.floor(Math.random() * validCols.length)];
            this.dropPiece(choice, 'yellow');

            if (this.checkWin('yellow')) {
                this.endGame('AI Wins!', 'LOSS');
            } else {
                this.currPlayer = 'red';
                this.statusEl.innerText = "Your Turn";
            }
        } else {
            this.endGame('Draw!', 'DRAW'); // No moves left
        }
    }

    checkWin(player) {
        // Horizontal
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (this.board[r][c] === player && this.board[r][c + 1] === player && this.board[r][c + 2] === player && this.board[r][c + 3] === player) return true;
            }
        }
        // Vertical
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c] === player && this.board[r + 1][c] === player && this.board[r + 2][c] === player && this.board[r + 3][c] === player) return true;
            }
        }
        // Diagonal /
        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (this.board[r][c] === player && this.board[r - 1][c + 1] === player && this.board[r - 2][c + 2] === player && this.board[r - 3][c + 3] === player) return true;
            }
        }
        // Diagonal \
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (this.board[r][c] === player && this.board[r + 1][c + 1] === player && this.board[r + 2][c + 2] === player && this.board[r + 3][c + 3] === player) return true;
            }
        }
        return false;
    }

    endGame(msg, result) {
        this.gameActive = false;
        this.statusEl.innerText = msg;
        GameManager.recordResult('Connect4', result === 'WIN' ? 100 : 0, result);
        setTimeout(() => GameManager.showResultModal('Connect4', result === 'WIN' ? 100 : 0, result), 1000);
    }

    restart() {
        this.gameActive = true;
        this.currPlayer = 'red';
        this.statusEl.innerText = "Your Turn";
        this.createBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Connect4();
});
