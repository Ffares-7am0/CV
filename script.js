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
// MOBILE MENU
// ===================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        // Add mobile menu functionality here if needed
        console.log('Mobile menu clicked');
    });
}

// ===================================
// INTERNATIONALIZATION (I18N)
// ===================================
const translations = {
    en: {
        nav_home: "Home",
        nav_about: "About",
        nav_skills: "Skills",
        nav_projects: "Projects",
        nav_soft_skills: "Soft Skills",
        nav_contact: "Contact",
        hero_welcome: "Welcome to my portfolio",
        hero_im: "I'm",
        hero_name: "Fares Mohammed",
        hero_desc_1: "Junior Software Developer crafting high-performance desktop and web applications.\nComputer Science student at",
        hero_school: "Fathallah International Applied Technology School",
        hero_view_work: "View My Work",
        hero_contact: "Get In Touch",
        about_title_1: "About",
        about_title_2: "Me",
        about_tagline_1: "I turn ideas and programming concepts into",
        about_tagline_2: "real, working applications",
        about_desc_1: "Hello! I'm",
        about_name: "Fares Mohammed",
        about_desc_2: "a Computer Science student passionate about developing efficient, user-friendly software systems.",
        about_specialize: "I specialize in",
        tech_wpf: "WPF",
        about_and: "and",
        about_enjoy: "I enjoy transforming abstract concepts into robust, real-world applications.",
        about_teaching: "Through teaching and mentoring, I also refine my communication and problem-solving skills.",
        skills_technical: "Technical",
        skills_title: "Skills",
        category_languages: "Languages",
        category_frameworks: "Frameworks",
        category_tools: "Tools",
        category_concepts: "Concepts",
        skill_problem_solving: "Problem Solving",
        projects_featured: "Featured",
        projects_title: "Projects",
        project_1_title: "Product Management System",
        project_1_desc: "Desktop application in WPF and MVC for tracking inventory and sales. Includes secure Authentication and Authorization protocols.",
        project_2_title: "Hospital Management System",
        project_2_desc: "A medical data integrity suite to manage patient records and appointments with a clean MVC architecture.",
        project_3_title: "Project Management Tool",
        project_3_desc: "Collaborative environment to track tasks, deadlines, and project progress in a high-performance desktop app.",
        project_4_title: "The Game Hub",
        project_4_desc: "A collection of 20+ specialized JavaScript engines exploring physics, DOM manipulation, and algorithms.",
        soft_skills_soft: "Soft",
        soft_skills_title: "Skills",
        soft_collab: "Collaboration",
        soft_teamwork: "Teamwork",
        soft_collaboration: "Collaboration",
        soft_communication: "Communication",
        soft_efficiency: "Efficiency",
        soft_pressure: "Work Under Pressure",
        soft_time_mgmt: "Time Management",
        soft_self_learning: "Self-Learning",
        soft_leadership: "Leadership",
        soft_leadership_item: "Leadership",
        soft_volunteering: "Volunteering",
        soft_thinking: "Thinking",
        soft_creativity: "Creativity",
        soft_design_thinking: "Design Thinking",
        contact_lets: "Let's Build",
        contact_together: "Together",
        contact_desc: "Reach out for collaborations, mentorship, or high-performance engineering opportunities.",
        contact_email: "Email Me",
        contact_whatsapp: "WhatsApp",
        footer_copy: "© 2026 Fares Mohammed. Crafted with passion and code."
    },
    ar: {
        nav_home: "الرئيسية",
        nav_about: "من انا",
        nav_skills: "المهارات",
        nav_projects: "المشاريع",
        nav_soft_skills: "المهارات الشخصية",
        nav_contact: "تواصل معي",
        hero_welcome: "مرحباً بكم في معرض أعمالي",
        hero_im: "أنا",
        hero_name: "فارس محمد",
        hero_desc_1: "مطور برمجيات مبتدئ أصمم تطبيقات سطح مكتب ومواقع ويب عالية الأداء.\nطالب علوم حاسب في",
        hero_school: "مدرسة فتح الله الدولية للتكنولوجيا التطبيقية",
        hero_view_work: "شاهد أعمالي",
        hero_contact: "تواصل معي",
        about_title_1: "من",
        about_title_2: "أكون",
        about_tagline_1: "أحول الأفكار والمفاهيم البرمجية إلى",
        about_tagline_2: "تطبيقات حقيقية وفعالة",
        about_desc_1: "أهلاً! أنا",
        about_name: "فارس محمد",
        about_desc_2: "طالب علوم حاسب شغوف بتطوير أنظمة برمجية فعالة وسهلة الاستخدام.",
        about_specialize: "أنا متخصص في",
        tech_wpf: "WPF",
        about_and: "و",
        about_enjoy: "أستمتع بتحويل المفاهيم المجردة إلى تطبيقات قوية واقعية.",
        about_teaching: "من خلال التدريس والتوجيه، أطور أيضاً مهاراتي في التواصل وحل المشكلات.",
        skills_technical: "المهارات",
        skills_title: "التقنية",
        category_languages: "لغات البرمجة",
        category_frameworks: "أطر العمل",
        category_tools: "الأدوات",
        category_concepts: "المفاهيم",
        skill_problem_solving: "حل المشكلات",
        projects_featured: "أبرز",
        projects_title: "المشاريع",
        project_1_title: "نظام إدارة المنتجات",
        project_1_desc: "تطبيق سطح مكتب باستخدام WPF و MVC لتتبع المخزون والمبيعات. يتضمن بروتوكولات آمنة للمصادقة والتفويض.",
        project_2_title: "نظام إدارة المستشفيات",
        project_2_desc: "مجموعة لسلامة البيانات الطبية لإدارة سجلات المرضى والمواعيد بهندسة MVC نظيفة.",
        project_3_title: "أداة إدارة المشاريع",
        project_3_desc: "بيئة تعاونية لتتبع المهام والمواعيد النهائية وتقدم المشروع في تطبيق سطح مكتب عالي الأداء.",
        project_4_title: "مجمع الألعاب",
        project_4_desc: "مجموعة من أكثر من 20 محرك جافا سكريبت متخصص تستكشف الفيزياء، ومعالجة DOM، والخوارزميات.",
        soft_skills_soft: "المهارات",
        soft_skills_title: "الشخصية",
        soft_collab: "التعاون",
        soft_teamwork: "العمل الجماعي",
        soft_collaboration: "التعاون",
        soft_communication: "التواصل",
        soft_efficiency: "الكفاءة",
        soft_pressure: "العمل تحت الضغط",
        soft_time_mgmt: "إدارة الوقت",
        soft_self_learning: "التعلم الذاتي",
        soft_leadership: "القيادة",
        soft_leadership_item: "القيادة",
        soft_volunteering: "العمل التطوعي",
        soft_thinking: "التفكير",
        soft_creativity: "الإبداع",
        soft_design_thinking: "التفكير التصميمي",
        contact_lets: "لنعمل",
        contact_together: "سوياً",
        contact_desc: "تواصل معي للتعاون، أو التوجيه، أو فرص هندسة البرمجيات عالية الأداء.",
        contact_email: "راسلني",
        contact_whatsapp: "واتساب",
        footer_copy: "© 2026 فارس محمد. صنع بشغف وكود."
    }
};

let currentLang = localStorage.getItem('portfolio-lang') || 'en';
const langToggleBtn = document.getElementById('lang-toggle');
const mobileLangToggleBtn = document.getElementById('mobile-lang-toggle');
const langText = document.getElementById('lang-text');

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const content = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (content[key]) {
            element.textContent = content[key];
        }
    });

    if (lang === 'ar') {
        if (langText) langText.textContent = 'EN';
        if (mobileLangToggleBtn) mobileLangToggleBtn.textContent = 'EN';
    } else {
        if (langText) langText.textContent = 'AR';
        if (mobileLangToggleBtn) mobileLangToggleBtn.textContent = 'AR';
    }
}

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        updateLanguage(newLang);
    });
}

if (mobileLangToggleBtn) {
    mobileLangToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        updateLanguage(newLang);
    });
}

// Initialize
updateLanguage(currentLang);

console.log('🚀 Premium Portfolio Loaded Successfully!');
