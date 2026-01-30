/**
 * Chess Logic with Minimax AI
 * simplified for demonstration of "AI Level 2"
 */

class ChessGame {
    constructor() {
        this.board = document.getElementById('chess-board');
        this.status = document.getElementById('status');
        this.gameActive = true;
        this.turn = 'white'; // white (user) starts
        this.selectedSquare = null;

        // Initial Board State (Simple 8x8 representation)
        // lowercase = black, uppercase = white
        this.state = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];

        // Piece Unicode
        this.pieces = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
        };

        this.initBoard();
        document.getElementById('reset-btn').addEventListener('click', () => window.location.reload());
    }

    initBoard() {
        this.render();
    }

    render() {
        this.board.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = document.createElement('div');
                sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                sq.dataset.r = r;
                sq.dataset.c = c;

                const piece = this.state[r][c];
                if (piece) {
                    sq.innerText = this.pieces[piece];
                    sq.classList.add(piece === piece.toUpperCase() ? 'white-piece' : 'black-piece');
                }

                if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
                    sq.classList.add('selected');
                }

                sq.addEventListener('click', () => this.handleSquareClick(r, c));
                this.board.appendChild(sq);
            }
        }
    }

    handleSquareClick(r, c) {
        if (!this.gameActive || this.turn === 'black') return; // AI turn block

        // Select Piece
        if (this.state[r][c] && this.isWhite(this.state[r][c])) {
            this.selectedSquare = { r, c };
            this.render();
        }
        // Move
        else if (this.selectedSquare) {
            // Validate Move (Simplified validation for this demo)
            // Ideally use a full move validator
            if (this.isValidMove(this.selectedSquare, { r, c }, this.state)) {
                this.move(this.selectedSquare, { r, c });
                this.selectedSquare = null;
                this.render();

                // AI Turn
                this.turn = 'black';
                this.status.innerText = "Computer Thinking...";
                setTimeout(() => this.makeAIMove(), 100);
            }
        }
    }

    isWhite(p) { return p === p.toUpperCase(); }

    isValidMove(from, to, board) {
        const piece = board[from.r][from.c];
        const target = board[to.r][to.c];
        const type = piece.toLowerCase();

        // 1. Cannot capture own piece
        if (target && ((this.isWhite(piece) && this.isWhite(target)) || (!this.isWhite(piece) && !this.isWhite(target)))) {
            return false;
        }

        const dr = to.r - from.r;
        const dc = to.c - from.c;
        const absDr = Math.abs(dr);
        const absDc = Math.abs(dc);

        // 2. Piece Logic
        if (type === 'r') { // Rook: Linear
            if (dr !== 0 && dc !== 0) return false;
            if (!this.isPathClear(from, to, board)) return false;
        }
        else if (type === 'b') { // Bishop: Diagonal
            if (absDr !== absDc) return false;
            if (!this.isPathClear(from, to, board)) return false;
        }
        else if (type === 'q') { // Queen: Linear + Diagonal
            if ((dr !== 0 && dc !== 0) && (absDr !== absDc)) return false;
            if (!this.isPathClear(from, to, board)) return false;
        }
        else if (type === 'n') { // Knight: L-shape
            if (!((absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2))) return false;
        }
        else if (type === 'k') { // King: 1 step
            if (absDr > 1 || absDc > 1) return false;
        }
        else if (type === 'p') { // Pawn
            const direction = this.isWhite(piece) ? -1 : 1; // White moves Up (index decreases), Black Down
            const startRow = this.isWhite(piece) ? 6 : 1;

            // Move forward 1
            if (dc === 0 && dr === direction) {
                if (target) return false; // Blocked
                return true;
            }
            // Move forward 2 (First move)
            if (dc === 0 && dr === direction * 2 && from.r === startRow) {
                if (target || board[from.r + direction][from.c]) return false; // Blocked
                return true;
            }
            // Capture Diagonal
            if (Math.abs(dc) === 1 && dr === direction) {
                if (!target) return false; // Must capture
                return true;
            }
            return false;
        }

        return true;
    }

    isPathClear(from, to, board) {
        const dr = Math.sign(to.r - from.r);
        const dc = Math.sign(to.c - from.c);
        let currR = from.r + dr;
        let currC = from.c + dc;

        while (currR !== to.r || currC !== to.c) {
            if (board[currR][currC]) return false;
            currR += dr;
            currC += dc;
        }
        return true;
    }

    move(from, to) {
        const piece = this.state[from.r][from.c];
        // Capture logic
        if (this.state[to.r][to.c]) {
            // Capture sound or effect
        }

        this.state[to.r][to.c] = piece;
        this.state[from.r][from.c] = null;

        // Promotion (Simple Queen)
        if (piece === 'P' && to.r === 0) this.state[to.r][to.c] = 'Q';
        if (piece === 'p' && to.r === 7) this.state[to.r][to.c] = 'q';
    }

    makeAIMove() {
        // Simple Minimax or Random for now as full engine is large
        // We will do a "Material Evaluation" based greedy move for Level 2

        const moves = this.getAllMoves('black');
        if (moves.length === 0) {
            this.gameOver("White Wins!");
            return;
        }

        let bestMove = moves[0];
        let bestScore = -9999;

        moves.forEach(m => {
            // Simulate
            const savedFrom = this.state[m.from.r][m.from.c];
            const savedTo = this.state[m.to.r][m.to.c];

            this.state[m.to.r][m.to.c] = savedFrom;
            this.state[m.from.r][m.from.c] = null;

            const score = this.evaluateBoard();

            // Undo
            this.state[m.from.r][m.from.c] = savedFrom;
            this.state[m.to.r][m.to.c] = savedTo;

            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        });

        this.move(bestMove.from, bestMove.to);
        this.turn = 'white';
        this.status.innerText = "Your Turn";
        this.render();
    }

    getAllMoves(turn) {
        // Generate pseudo-legal moves
        const moves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = this.state[r][c];
                if (p && ((turn === 'white' && p === p.toUpperCase()) || (turn === 'black' && p === p.toLowerCase()))) {
                    // Try all targets (Optimization needed for real engine)
                    for (let tr = 0; tr < 8; tr++) {
                        for (let tc = 0; tc < 8; tc++) {
                            if (this.isValidMove({ r, c }, { r: tr, c: tc }, this.state)) {
                                moves.push({ from: { r, c }, to: { r: tr, c: tc } });
                            }
                        }
                    }
                }
            }
        }
        return moves;
    }

    evaluateBoard() {
        const weights = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900 };
        let score = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = this.state[r][c];
                if (p) {
                    const val = weights[p.toLowerCase()] || 0;
                    score += p === p.toLowerCase() ? val : -val; // Black positive, White negative
                }
            }
        }
        return score;
    }

    gameOver(msg) {
        this.gameActive = false;
        this.status.innerText = msg;
        GameManager.recordResult('Chess', 0, msg.includes('Win') ? 'WIN' : 'LOSS');
        GameManager.showResultModal('Chess', 0, msg.includes('Win') ? 'WIN' : 'LOSS');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});
