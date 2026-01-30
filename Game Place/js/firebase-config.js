// Firebase Configuration
// REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE PROJECT CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Initialize Firebase (will be done in auth.js/utils.js after loading libraries)
// window.firebaseConfig = firebaseConfig; 
// We will expose it globally or import it if using modules, 
// strictly for this environment we'll attach to window for simplicity in non-module scripts
window.GAME_PLACE_CONFIG = firebaseConfig;

// Check for valid configuration (simple check for placebo value)
window.FIREBASE_CONFIG_VALID = (firebaseConfig.apiKey !== "YOUR_API_KEY");

if (!window.FIREBASE_CONFIG_VALID) {
    console.warn("Firebase Configuration is missing. Entering Offline/Safe Mode.");
    // We will not alert here to avoid blocking parsing, but UI will show status.
}
