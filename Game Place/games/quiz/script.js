
const questions = [
    {
        q: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correct: 1
    },
    {
        q: "What is the largest planet in our solar system?",
        options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
        correct: 1
    },
    {
        q: "Which galaxy is Earth located in?",
        options: ["Andromeda", "Triangulum", "Milky Way", "Whirlpool"],
        correct: 2
    },
    {
        q: "What is the closest star to Earth?",
        options: ["Proxima Centauri", "Sirius", "The Sun", "Betelgeuse"],
        correct: 2
    },
    {
        q: "How many moons does Earth have?",
        options: ["1", "2", "0", "4"],
        correct: 0
    },
    {
        q: "Who was the first human to travel into space?",
        options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"],
        correct: 2
    },
    {
        q: "What is the hottest planet in the solar system?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correct: 1
    },
    {
        q: "What force keeps the planets in orbit around the Sun?",
        options: ["Magnetism", "Gravity", "Friction", "Inertia"],
        correct: 1
    },
    {
        q: "Which planet has the most extensive ring system?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 1
    },
    {
        q: "What is the term for a natural satellite?",
        options: ["Star", "Moon", "Comet", "Asteroid"],
        correct: 1
    }
];

let currentQ = 0;
let score = 0;
const questionText = document.getElementById('question-text');
const optionsArea = document.getElementById('options-area');
const scoreDisplay = document.getElementById('score');
const progressFill = document.getElementById('progress');

function loadQuestion() {
    if (currentQ >= questions.length) {
        GameManager.showResultModal('Cosmic Trivia', score * 10, 'COMPLETED');
        return;
    }

    // Update Progress
    progressFill.style.width = `${((currentQ) / questions.length) * 100}%`;

    const data = questions[currentQ];
    questionText.innerText = data.q;

    optionsArea.innerHTML = '';

    data.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optionsArea.appendChild(btn);
    });
}

function checkAnswer(index, btn) {
    // Disable all buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);

    const correctIndex = questions[currentQ].correct;

    if (index === correctIndex) {
        btn.classList.add('correct');
        score++;
        scoreDisplay.innerText = score * 10;
        setTimeout(() => {
            currentQ++;
            loadQuestion();
        }, 1000);
    } else {
        btn.classList.add('wrong');
        // Highlight correct one
        buttons[correctIndex].classList.add('correct');
        // Game Over or just continue? Let's just continue for trivia
        setTimeout(() => {
            currentQ++;
            loadQuestion();
        }, 1500);
    }
}

loadQuestion();
