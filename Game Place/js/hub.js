/**
 * Game Place - Hub Controller
 * Handles Game List Rendering & Filtering
 */

const GAMES_LIST = [
    { id: 'xo', name: 'XO (Tic-Tac-Toe)', type: 'Multiplayer', icon: '❌⭕', path: 'games/xo/index.html' },
    { id: 'chess', name: 'Chess AI', type: 'AI', icon: '♟️', path: 'games/chess/index.html' },
    { id: 'snake', name: 'Snake', type: 'Classic', icon: '🐍', path: 'games/snake/index.html' },
    { id: 'connect4', name: 'Connect Four', type: 'Strategy', icon: '🔴', path: 'games/connect4/index.html' },
    { id: 'memory', name: 'Memory Game', type: 'Puzzle', icon: '🧠', path: 'games/memory/index.html' },
    { id: 'flappy', name: 'Flappy Bird', type: 'Action', icon: '🐦', path: 'games/flappy/index.html' },
    { id: 'car', name: 'Car Race', type: 'Action', icon: '🏎️', path: 'games/car/index.html' },
    { id: '2048', name: '2048', type: 'Classic', icon: '🔢', path: 'games/2048/index.html' },
    { id: 'ludo', name: 'Ludo', type: 'Multiplayer', icon: '🎲', path: 'games/ludo/index.html' },
    { id: 'tetris', name: 'Tetris', type: 'Classic', icon: '🧱', path: 'games/tetris/index.html' },
    { id: 'minesweeper', name: 'Minesweeper', type: 'Puzzle', icon: '💣', path: 'games/minesweeper/index.html' },
    { id: 'sudoku', name: 'Sudoku', type: 'Puzzle', icon: '📝', path: 'games/sudoku/index.html' },
    { id: 'pong', name: 'Pong', type: 'Retro', icon: '🏓', path: 'games/pong/index.html' },
    { id: 'brick', name: 'Brick Breaker', type: 'Retro', icon: '🧱', path: 'games/brick/index.html' },
    { id: 'whack', name: 'Whack-a-Mole', type: 'Action', icon: '🔨', path: 'games/whack/index.html' },
    { id: 'invaders', name: 'Space Invaders', type: 'Retro', icon: '👾', path: 'games/invaders/index.html' },
    { id: 'wordle', name: 'Wordle Clone', type: 'Puzzle', icon: '🔤', path: 'games/wordle/index.html' },
    { id: 'typing', name: 'Speed Typing', type: 'Skill', icon: '⌨️', path: 'games/typing/index.html' },
    { id: 'simon', name: 'Simon Says', type: 'Memory', icon: '🚨', path: 'games/simon/index.html' },
    { id: 'quiz', name: 'Quiz Game', type: 'Trivia', icon: '❓', path: 'games/quiz/index.html' },
    { id: 'math', name: 'Math Challenge', type: 'Education', icon: '✖️', path: 'games/math/index.html' },
    { id: 'hangman', name: 'Hangman', type: 'Classic', icon: '😵', path: 'games/hangman/index.html' },
    { id: 'tower', name: 'Tower Stack', type: 'Skill', icon: '🗼', path: 'games/tower/index.html' },
    { id: 'pacman', name: 'Pac-Man', type: 'Retro', icon: '🍒', path: 'games/pacman/index.html' }
];

class HubManager {
    constructor() {
        this.grid = document.getElementById('games-grid');
        this.searchInput = document.getElementById('search-bar');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        this.init();
    }

    init() {
        this.renderGames(GAMES_LIST);

        // Search Listener
        this.searchInput.addEventListener('input', (e) => {
            this.filterGames(e.target.value, this.getActiveFilter());
        });

        // Filter Listeners
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');

                this.filterGames(this.searchInput.value, btn.dataset.filter);
            });
        });
    }

    getActiveFilter() {
        return document.querySelector('.filter-btn.active').dataset.filter;
    }

    filterGames(keyword, category) {
        const lowerKeyword = keyword.toLowerCase();

        const filtered = GAMES_LIST.filter(game => {
            const matchesSearch = game.name.toLowerCase().includes(lowerKeyword);
            const matchesCategory = category === 'all' || game.type.toLowerCase() === category.toLowerCase();
            return matchesSearch && matchesCategory;
        });

        this.renderGames(filtered);
    }

    renderGames(games) {
        this.grid.innerHTML = '';

        if (games.length === 0) {
            this.grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #fff;">No games found in this sector.</div>`;
            return;
        }

        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'glass-panel';
            card.style.cssText = `
                padding: 20px; text-align: center; cursor: pointer; transition: transform 0.3s;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                min-height: 200px; position: relative; overflow: hidden;
            `;

            // Hover effect logic is in CSS usually, but we can add some inline
            card.onmouseenter = () => card.style.transform = "translateY(-10px) scale(1.02)";
            card.onmouseleave = () => card.style.transform = "translateY(0) scale(1)";

            card.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 10px;">${game.icon}</div>
                <h3 style="color: var(--neon-cyan); margin-bottom: 5px;">${game.name}</h3>
                <span style="font-size: 0.8rem; color: #aaa; border: 1px solid #aaa; padding: 2px 8px; border-radius: 10px;">${game.type}</span>
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 5px; background: linear-gradient(90deg, transparent, var(--neon-purple), transparent);"></div>
            `;

            card.addEventListener('click', () => {
                // Check if file exists functionality or just go (browser will 404 if not ready)
                window.location.href = game.path;
            });

            this.grid.appendChild(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HubManager();
});
