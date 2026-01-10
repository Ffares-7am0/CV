/**
 * THE BRAND IDENTITY - Professional Orchestration
 * Dependencies: GSAP, ScrollTrigger, Lenis
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Init Smooth Scroll (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }


    // --- 2. GSAP Hero Entrance ---
    const heroTl = gsap.timeline();

    if (document.querySelector(".navbar")) {
        heroTl.from(".navbar", {
            y: -100,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out"
        });
    }

    if (document.querySelector(".hero-brand")) {
        heroTl.from(".hero-brand", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.8");
    }

    if (document.querySelector("#hero-title span")) {
        heroTl.from("#hero-title span", {
            y: 100,
            opacity: 0,
            rotateX: -45,
            stagger: 0.1,
            duration: 1.2,
            ease: "expo.out"
        }, "-=0.6");
    }

    if (document.querySelector("#hero-subtext")) {
        heroTl.from("#hero-subtext", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=1");
    }

    if (document.querySelector(".hero-actions")) {
        heroTl.from(".hero-actions", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8");
    }

    if (document.querySelector(".hero-image-wrap")) {
        heroTl.from(".hero-image-wrap", {
            scale: 0.8,
            opacity: 0,
            duration: 1.5,
            ease: "expo.out"
        }, "-=1.2");
    }


    // --- 3. Scroll Trigger Reveals ---
    if (typeof ScrollTrigger !== 'undefined') {
        // Section Header Anim
        gsap.utils.toArray(".section-title, h2").forEach(heading => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "expo.out"
            });
        });

        // About Content Slide
        if (document.querySelector("#about p")) {
            gsap.from("#about p", {
                scrollTrigger: {
                    trigger: "#about",
                    start: "top 70%"
                },
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: "power3.out"
            });
        }

        // Combined Skill Cards Reveal (Technical + Soft)
        if (document.querySelector(".skill-card")) {
            gsap.from(".skill-card", {
                scrollTrigger: {
                    trigger: ".skills-grid",
                    start: "top 80%"
                },
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "expo.out",
                clearProps: "all"
            });
        }

        // Project Cards Reveal
        if (document.querySelector(".project-card")) {
            gsap.from(".project-card", {
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 75%"
                },
                y: 100,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: "expo.out",
                clearProps: "all"
            });
        }
    }


    // --- 4. Interactive Polish ---

    // Navbar Scrolled State
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Magnetic / Mouse Effect on profile photo frame
    const photoFrame = document.querySelector('.photo-frame');
    const photoWrap = document.querySelector('.hero-image-wrap');

    if (photoWrap && photoFrame) {
        photoWrap.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = photoWrap.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) * 0.1;
            const y = (e.clientY - top - height / 2) * 0.1;

            gsap.to(photoFrame, {
                x: x,
                y: y,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        photoWrap.addEventListener('mouseleave', () => {
            gsap.to(photoFrame, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }

    // Init Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

});
