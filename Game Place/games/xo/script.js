/**
 * XO Game Logic
 * Supports: Local PVP, AI (Random), AI (Unbeatable Minimax)
 */

class XOGame {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.mode = 'ai'; // 'ai' or 'pvp'
        this.difficulty = 'hard'; // 'easy' or 'hard'

        // DOM Elements
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('game-status');
        this.restartBtn = document.getElementById('restart-btn');
        this.modeSelect = document.getElementById('mode-select');
        this.diffSelect = document.getElementById('difficulty-select'); // Container

        this.init();
    }

    init() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        this.restartBtn.addEventListener('click', () => this.restartGame());

        this.modeSelect.addEventListener('change', (e) => {
            this.mode = e.target.value;
            this.restartGame();
            // Toggle difficulty visibility
            if (this.mode === 'pvp') {
                this.diffSelect.style.display = 'none';
            } else {
                this.diffSelect.style.display = 'block';
            }
        });

        // Difficulty drop down listener
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.restartGame();
        });
    }

    handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.dataset.index);

        if (this.board[index] || !this.gameActive) return;

        this.makeMove(index, this.currentPlayer);

        if (this.gameActive && this.mode === 'ai' && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500); // Small delay for realism
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].innerText = player;
        this.cells[index].classList.add(player); // For styling color

        if (this.checkWin()) {
            this.endGame(false);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus(`${this.currentPlayer}'s Turn`);
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;

        let index;
        if (this.difficulty === 'easy') {
            // Random Move
            const available = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
            index = available[Math.floor(Math.random() * available.length)];
        } else {
            // Minimax (Hard)
            index = this.minimax(this.board, 'O').index;
        }

        if (index !== undefined) {
            this.makeMove(index, 'O');
        }
    }

    minimax(newBoard, player) {
        // Available spots
        const availSpots = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);

        // Terminal States
        if (this.checkWinState(newBoard, 'X')) return { score: -10 };
        if (this.checkWinState(newBoard, 'O')) return { score: 10 };
        if (availSpots.length === 0) return { score: 0 };

        const moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = this.minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = this.minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    checkWin() {
        return this.checkWinState(this.board, this.currentPlayer);
    }

    checkWinState(board, player) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        return winConditions.some(combination => {
            return combination.every(index => {
                return board[index] === player;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    endGame(draw) {
        this.gameActive = false;
        let msg = "";
        let resultType = ""; // WIN, LOSS, DRAW

        if (draw) {
            msg = "It's a Draw!";
            resultType = "DRAW";
        } else {
            if (this.mode === 'ai') {
                if (this.currentPlayer === 'X') {
                    msg = "You Win!";
                    resultType = "WIN";
                } else {
                    msg = "AI Wins!";
                    resultType = "LOSS";
                }
            } else {
                msg = `${this.currentPlayer} Wins!`;
                resultType = "WIN"; // In PVP we might need to distinguish who is playing, but for now generic WIN
            }
        }

        this.updateStatus(msg);

        // Call Global Manager
        const score = resultType === 'WIN' ? 100 : (resultType === 'DRAW' ? 50 : 0);
        GameManager.recordResult('XO', score, resultType);

        setTimeout(() => {
            GameManager.showResultModal('XO', score, resultType);
        }, 1000);
    }

    restartGame() {
        this.board.fill(null);
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('X', 'O');
        });
        this.updateStatus("X's Turn");
    }

    updateStatus(msg) {
        this.statusDisplay.innerText = msg;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new XOGame();
});
