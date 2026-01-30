/**
 * Game Place - Utility Functions & Global State Manager
 */

/* --- 1. Star Background Generator --- */
function initStars() {
    const container = document.createElement('div');
    container.id = 'stars-container';
    document.body.appendChild(container);

    const starCount = 100; // Optimal for performance
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const xy = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const size = Math.random() * 2 + 1;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(star);
    }
}

/* --- 2. Navbar & Footer Injection --- */
function injectUI() {
    // Navbar
    const nav = document.createElement('nav');
    nav.className = 'glass-panel';
    nav.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 1200px; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; z-index: 100;";

    const isGuest = localStorage.getItem('guest_mode') === 'true';
    const authLink = isGuest
        ? `<button id="nav-auth-btn" class="glass-btn" style="border-color: var(--neon-cyan); color: var(--neon-cyan);">Login to Save</button>`
        : `<button id="nav-auth-btn" class="glass-btn" style="border-color: #ff4444; color: #ff4444;">Logout</button>`;

    // Determine relative path to root
    const isInGameDir = window.location.pathname.includes('/games/');
    const pfx = isInGameDir ? '../../' : '';

    // Home Link Logic: Guest -> index.html (to login), User -> hub.html
    const targetPage = isGuest ? 'index.html' : 'hub.html';
    const homeLink = pfx + targetPage;

    nav.innerHTML = `
        <div class="logo" style="font-family: 'Orbitron'; font-weight: 700; font-size: 1.5rem;">
            <span style="color: var(--neon-cyan)">GAME</span> <span style="color: var(--neon-purple)">PLACE</span>
        </div>
        <div class="nav-links">
            <a href="${homeLink}" class="glass-btn" style="text-decoration: none; margin-right: 15px;">Home</a>
            <button id="creator-btn" class="glass-btn" style="border-color: var(--neon-gold); color: var(--neon-gold); margin-right: 15px;">Fares Mohammed</button>
            ${authLink}
        </div>
    `;
    document.body.prepend(nav);

    // Auth Button Handler
    document.getElementById('nav-auth-btn').addEventListener('click', () => {
        if (isGuest) {
            // If guest clicking "Login to Save", go to login page
            localStorage.removeItem('guest_mode');
            window.location.href = 'index.html';
        } else {
            // Logout
            if (window.gameAuth) {
                window.gameAuth.logout();
            } else {
                // Fallback
                window.location.href = 'index.html';
            }
        }
    });
    document.body.prepend(nav);

    // Footer
    const footer = document.createElement('footer');
    footer.className = 'glass-panel';
    footer.style.cssText = "margin-top: 50px; padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;";
    footer.innerHTML = `
        Game Place by <span style="color: var(--neon-gold)">Fares Mohammed</span> (فـ ادعيله يتجوز)
    `;
    document.body.appendChild(footer);

    // Copy Event
    document.getElementById('creator-btn').addEventListener('click', () => {
        navigator.clipboard.writeText("01203927960").then(() => {
            showToast("Number Copied! 01203927960");
        });
    });
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);

    // Trigger reflow
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* --- 3. Global Game Manager --- */
class GameManager {
    static recordResult(gameName, score, outcome) {
        console.log(`Recording Result: ${gameName} - ${outcome} (${score})`);
        // TODO: Integrate Firebase Firestore here
    }

    static showResultModal(gameName, score, outcome) {
        // Create Modal HTML
        const modalId = 'result-modal';
        let modal = document.getElementById(modalId);
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'glass-panel';
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            padding: 40px; text-align: center; z-index: 200; width: 400px;
            display: flex; flex-direction: column; gap: 20px;
        `;

        const title = outcome === 'WIN' ? 'VICTORY' : 'GAME OVER';
        const color = outcome === 'WIN' ? 'var(--neon-cyan)' : 'var(--neon-purple)';

        modal.innerHTML = `
            <h2 style="color: ${color}; font-size: 2rem;">${title}</h2>
            <p style="font-size: 1.2rem;">Game: ${gameName}</p>
            <p style="font-size: 1.5rem; font-weight: bold;">Score: ${score}</p>
            <p id="player-name-display" style="color: var(--neon-gold)">Player: User</p> 
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.print()" class="glass-btn">Print</button>
                <button id="pdf-btn" class="glass-btn">Save PDF</button>
                <button onclick="location.reload()" class="glass-btn" style="border-color: #ff4444; color: #ff4444;">Restart</button>
            </div>
        `;

        document.body.appendChild(modal);

        // PDF Logic
        document.getElementById('pdf-btn').addEventListener('click', () => {
            const element = document.getElementById(modalId);
            const opt = {
                margin: 10,
                filename: `${gameName}_Certificate.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, backgroundColor: '#10101a' }, // Dark background for visibility
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            if (window.html2pdf) {
                html2pdf().set(opt).from(element).save();
            } else {
                alert("PDF Engine loading... please try again in a moment.");
            }
        });
    }
}

// Auto-Init
document.addEventListener('DOMContentLoaded', () => {
    initStars();
    if (!window.isLandingPage) injectUI(); // Don't run on landing page if preferred, or run everywhere
});
