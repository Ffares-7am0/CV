/**
 * Game Place - Authentication Manager
 * Handles Login, Signup, and Strict Email Verification
 */

// Gmail Strict Regex
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

class AuthManager {
    constructor() {
        if (window.FIREBASE_CONFIG_VALID) {
            this.auth = firebase.auth();
            this.db = firebase.firestore();
            this.initAuthListener();
        } else {
            this.auth = null;
            this.db = null;
            console.warn("AuthManager: Offline Mode Active");
        }
    }

    initAuthListener() {
        this.auth.onAuthStateChanged(user => {
            if (user) {
                console.log("User logged in:", user.email);
                this.checkVerification(user);
            } else {
                console.log("User logged out");
                // Allow guest access if explicitly set
                if (localStorage.getItem('guest_mode') === 'true') {
                    console.log("Guest Mode Active");
                    return;
                }

                // If we are on the Hub or Dashboard, redirect to login
                if (window.location.pathname.includes('hub.html') || window.location.pathname.includes('dashboard.html')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }

    // --- Guest Mode ---
    loginAsGuest() {
        localStorage.setItem('guest_mode', 'true');
        window.location.href = 'hub.html';
    }

    logout() {
        localStorage.removeItem('guest_mode');
        //... standard logout
    }

    // --- Sign Up ---
    async signUp(email, password, fullName) {
        if (!this.auth) {
            alert("Cannot Sign Up: Firebase Configuration is missing. Please check js/firebase-config.js");
            return;
        }

        if (!GMAIL_REGEX.test(email)) {
            alert("Security Alert: Only @gmail.com addresses are allowed.");
            return;
        }

        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Send Verification Email
            await user.sendEmailVerification();

            // Create User Profile in Firestore
            await this.db.collection('users').doc(user.uid).set({
                fullName: fullName,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                stats: { wins: 0, losses: 0 }
            });

            alert(`Account created! A verification link has been sent to ${email}. Please verify before playing.`);
            this.auth.signOut(); // Force logout until verified
            window.location.reload();

        } catch (error) {
            console.error("Signup Error:", error);
            alert(error.message);
        }
    }

    // --- Login ---
    async login(email, password) {
        if (!this.auth) {
            alert("Cannot Login: Firebase Configuration is missing. Please check js/firebase-config.js");
            return;
        }
        try {
            await this.auth.signInWithEmailAndPassword(email, password);
            // onAuthStateChanged will handle redirection
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login Failed: " + error.message);
        }
    }

    // --- Logout ---
    async logout() {
        localStorage.removeItem('guest_mode');
        await this.auth.signOut();
        window.location.href = 'index.html';
    }

    // --- Strict Verification Check ---
    checkVerification(user) {
        if (!this.auth) return;
        if (!user.emailVerified) {
            this.showVerificationOverlay(user);
        } else {
            // If valid and on login page, go to Hub
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                window.location.href = 'hub.html';
            }
        }
    }

    showVerificationOverlay(user) {
        // If we represent this as an overlay on the current page
        // It prevents any interaction
        const overlayId = 'verification-overlay';
        if (document.getElementById(overlayId)) return;

        const overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.innerHTML = `
            <h2><span style="color:red">Access Denied</span></h2>
            <p style="color: white; font-size: 1.2rem; margin-bottom: 20px;">
                Your email <strong>${user.email}</strong> is not verified.
            </p>
            <p style="color: #aaa; margin-bottom: 30px;">
                We require strict identity verification for the Game Place.
                <br>Please check your Gmail inbox and spam folder.
            </p>
            <button id="resend-btn" class="glass-btn" style="margin-right: 10px;">Resend Link</button>
            <button id="logout-btn" class="glass-btn" style="border-color: red; color: red;">Logout</button>
        `;
        document.body.appendChild(overlay);

        document.getElementById('resend-btn').addEventListener('click', async () => {
            await user.sendEmailVerification();
            alert("Verification link resent!");
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
            overlay.remove();
        });
    }
}

// Expose instance
window.gameAuth = null;
document.addEventListener('DOMContentLoaded', () => {
    // Always init manager, it handles offline state internally
    window.gameAuth = new AuthManager();
    console.log("GameAuth Initialized (State: " + (window.FIREBASE_CONFIG_VALID ? "Online" : "Offline") + ")");
});
