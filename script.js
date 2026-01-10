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
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
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
    y: 100,
    opacity: 0,
    duration: 0.6,
    ease: 'power4.out'
});

gsap.from('.hero-subtitle', {
    y: 50,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power4.out'
});

gsap.from('.hero-cta', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.3,
    ease: 'power4.out'
});

gsap.from('.hero-image', {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    delay: 0.3,
    ease: 'elastic.out(1, 0.5)'
});

// About Section Animations
gsap.from('.about-title', {
    scrollTrigger: {
        trigger: '.about-title',
        start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1
});

gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1
});

// Skills Section Animations
gsap.from('.skill-card', {
    scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%',
    },
    y: 100,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out'
});

// Projects Section Animations
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%',
    },
    y: 100,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out'
});

// Soft Skills Section Animations
gsap.from('.soft-skill-card', {
    scrollTrigger: {
        trigger: '.soft-skills-grid',
        start: 'top 80%',
    },
    y: 100,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out'
});

// Contact Section Animations
gsap.from('.contact-content', {
    scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1
});

// ===================================
// NAVIGATION SCROLL EFFECT
// ===================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('glass', 'py-4');
        navbar.classList.remove('bg-transparent', 'py-6');
    } else {
        navbar.classList.remove('glass', 'py-4');
        navbar.classList.add('bg-transparent', 'py-6');
    }
});

// Active Section Highlighting
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
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
});

// ===================================
// PARTICLES.JS CONFIGURATION
// ===================================
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#8b5cf6', '#06b6d4', '#10b981']
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.2,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.05,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#8b5cf6',
            opacity: 0.15,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// ===================================
// RE-INITIALIZE ICONS ON DOM CHANGES
// ===================================
const observer = new MutationObserver(() => {
    lucide.createIcons();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

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
