// ===================================
// PREMIUM PORTFOLIO - JAVASCRIPT
// ===================================

// Initialize Lucide Icons
lucide.createIcons();

// ===================================
// SMOOTH SCROLL WITH LENIS
// ===================================
const lenis = new Lenis({
    duration: 0.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Handle Anchor Links for Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement, {
                offset: 0,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// ===================================
// GSAP ANIMATIONS
// ===================================
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
gsap.from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.hero-cta', {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.hero-image', {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
});

// General Section Animations (Robust Visibility)
const sections = ['about', 'skills', 'projects', 'soft-skills', 'contact'];

sections.forEach(section => {
    gsap.from(`#${section} .container-custom > *`, {
        scrollTrigger: {
            trigger: `#${section}`,
            start: 'top 85%', // Trigger earlier for better visibility
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all' // Ensure visibility after animation
    });
});

// ===================================
// MOUSE INTERACTION (Parallax)
// ===================================
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const blobs = document.querySelectorAll('.animate-float');
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 20;
        const x = (window.innerWidth - mouseX * speed) / 100;
        const y = (window.innerHeight - mouseY * speed) / 100;

        blob.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// ===================================
// NAVIGATION SCROLL EFFECT (Throttled)
// ===================================
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (lastScrollY > 50) {
                navbar.classList.add('glass', 'py-4');
                navbar.classList.remove('bg-transparent', 'py-6');
            } else {
                navbar.classList.remove('glass', 'py-4');
                navbar.classList.add('bg-transparent', 'py-6');
            }

            // Active Section Highlighting logic here (simplified for per-frame speed)
            const navLinks = document.querySelectorAll('.nav-link');
            const sectionEls = document.querySelectorAll('section[id]');

            let current = '';
            sectionEls.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active', 'text-white');
                link.classList.add('text-gray-400');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active', 'text-white');
                    link.classList.remove('text-gray-400');
                }
            });
            ticking = false;
        });
        ticking = true;
    }
});

// ===================================
// CUSTOM HIGH-PERFORMANCE PARTICLES
// ===================================
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: null,
    y: null,
    radius: 150,
    isPressed: false // Track click state
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;

    // Optimized GSAP Blob Interaction (Throttle checking?)
    // kept simple as CSS transform is cheap
    gsap.to('.animate-blob', {
        x: (event.clientX - window.innerWidth / 2) * 0.05,
        y: (event.clientY - window.innerHeight / 2) * 0.05,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto'
    });
});

window.addEventListener('mousedown', () => mouse.isPressed = true);
window.addEventListener('mouseup', () => mouse.isPressed = false);

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Boundary Check
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        // Mouse Interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        // Optimization: Skip sqrt if obviously far
        // A box check is faster than circle check
        if (Math.abs(dx) < mouse.radius && Math.abs(dy) < mouse.radius) {
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = (dx / distance) * force * 50; // Strength
                const directionY = (dy / distance) * force * 50;

                if (mouse.isPressed) {
                    // Repulsion (Click)
                    this.x -= directionX * 0.5; // Stronger push
                    this.y -= directionY * 0.5;
                } else {
                    // Attraction (Hover)
                    this.x += directionX * 0.05; // Gentle pull
                    this.y += directionY * 0.05;
                }
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    // Balanced: More particles than before, but lighter loop
    let numberOfParticles = (canvas.height * canvas.width) / 13000;
    const colors = ['rgba(139, 92, 246, 0.5)', 'rgba(6, 182, 212, 0.5)', 'rgba(16, 185, 129, 0.5)'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = Math.random() * innerWidth;
        let y = Math.random() * innerHeight;
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    let opacityValue = 1;
    // Optimization: Reduce connection distance to draw fewer lines
    const connectDistance = 100;
    const connectDistanceSq = connectDistance * connectDistance;

    for (let a = 0; a < particlesArray.length; a++) {
        // Optimization: Only check a subset of particles or neighbors?
        // For N=100-200 this double loop is OK if inner checks are fast.

        for (let b = a; b < particlesArray.length; b++) {
            // Fast Box Check first!
            if (Math.abs(particlesArray[a].x - particlesArray[b].x) > connectDistance) continue;
            if (Math.abs(particlesArray[a].y - particlesArray[b].y) > connectDistance) continue;

            let distanceSq = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);

            if (distanceSq < connectDistanceSq) {
                opacityValue = 1 - (distanceSq / connectDistanceSq);
                ctx.strokeStyle = 'rgba(139, 92, 246,' + opacityValue * 0.15 + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

init();
animate();

// ===================================
// MOBILE MENU (Optional Enhancement)
// ===================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        // Add mobile menu functionality here if needed
        console.log('Mobile menu clicked');
    });
}

console.log('🚀 Premium Portfolio Loaded Successfully!');
