let currentSlide = 0;
let isAnimating = false;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const progressFill = document.querySelector('.progress-fill');
const currentIdxDisplay = document.getElementById('current-idx');

// --- Advanced Animation Engine ---
const anim = {
    transition: 1.2,
    ease: "expo.out",
    stagger: 0.1
};

function updateView(direction = 1) {
    if (isAnimating) return;

    const prevSlide = document.querySelector('.slide.active');
    const nextSlide = slides[currentSlide];

    if (prevSlide === nextSlide) return;
    isAnimating = true;
    const topNav = document.querySelector('.top-nav');
    if (topNav) {
        gsap.to(topNav, {
            opacity: currentSlide === 0 ? 0 : 1,
            y: currentSlide === 0 ? -20 : 0,
            pointerEvents: currentSlide === 0 ? 'none' : 'all',
            duration: 0.5
        });
    }

    if (prevSlide === nextSlide) return;

    // Handle Slide Transitions
    if (prevSlide) {
        gsap.to(prevSlide, {
            opacity: 0,
            x: -100 * direction,
            rotateY: -20 * direction,
            display: 'none',
            duration: anim.transition,
            ease: anim.ease
        });
        prevSlide.classList.remove('active');
    }

    gsap.set(nextSlide, { display: 'flex', opacity: 0, x: 100 * direction, rotateY: 20 * direction });

    gsap.to(nextSlide, {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: anim.transition,
        ease: anim.ease,
        onComplete: () => {
            nextSlide.classList.add('active');
            isAnimating = false;
        }
    });

    // Staggered Content Animation
    const elements = nextSlide.querySelectorAll('.main-title, .subtitle, .badge, .card, .code-window, .dash-card, .btn-primary');
    gsap.fromTo(elements,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: anim.stagger, ease: "back.out(1.7)", delay: 0.2 }
    );

    // Progress & Index
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    gsap.to(progressFill, { width: `${progress}%`, duration: 1, ease: anim.ease });

    if (currentIdxDisplay) {
        currentIdxDisplay.textContent = (currentSlide + 1).toString().padStart(2, '0');
    }

    lucide.createIcons();
}

// --- Navigation Flow ---
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateView(1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateView(-1);
    }
}

function goToSlide(index) {
    const direction = index > currentSlide ? 1 : -1;
    currentSlide = index;
    updateView(direction);
}

// --- Interaction Features ---
function copyCode(btn) {
    const codeBlock = btn.parentElement.nextElementSibling.innerText;
    navigator.clipboard.writeText(codeBlock).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span><i data-lucide="check"></i> Copied!</span>';
        gsap.from(btn, { scale: 1.2, duration: 0.3, ease: "back.out" });

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            lucide.createIcons();
        }, 3000);
        lucide.createIcons();
    });
}

// --- Immersive Effects ---
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    gsap.to('#orb1', { x: x * 100, y: y * 100, duration: 2, ease: "power2.out" });
    gsap.to('#orb2', { x: -x * 80, y: -y * 80, duration: 2, ease: "power2.out" });
    gsap.to('.circuit-grid', { x: x * 30, y: y * 30, duration: 3, ease: "power1.out" });

    // 3D Card Parallax
    const activeCards = document.querySelectorAll('.slide.active .card, .slide.active .code-window, .slide.active .floating-chip');
    activeCards.forEach(card => {
        gsap.to(card, {
            rotateY: x * 10,
            rotateX: -y * 10,
            duration: 1,
            ease: "power2.out"
        });
    });
});

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Add a quick pulse effect to the toggle button
    const btn = document.getElementById('theme-toggle');
    gsap.from(btn, { scale: 0.8, duration: 0.3, ease: "back.out(2)" });
}

// Keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') nextSlide();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
});

// Init
window.onload = () => {
    gsap.set('.slide', { display: 'none', opacity: 0 });
    gsap.set(slides[0], { display: 'flex', opacity: 1 });
    slides[0].classList.add('active');

    // Splash Entrance Animation
    const splashTl = gsap.timeline();
    splashTl.from('.splash-logo-container', { scale: 0, opacity: 0, duration: 1.5, ease: "back.out(1.7)" })
        .from('.logo-large-icon', { rotateY: 360, duration: 2, ease: "power2.out" }, "-=1.2")
        .from('.logo-large .vijaya', { y: 100, opacity: 0, duration: 1.5, ease: "expo.out" }, "-=1.5")
        .from('.logo-large .embedded', { y: 50, opacity: 0, duration: 1.5, ease: "expo.out" }, "-=1.2")
        .from('.company-subtext', { letterSpacing: "3rem", opacity: 0, duration: 2, ease: "power4.out" }, "-=1")
        .from('.loading-line', { width: 0, opacity: 0, duration: 1 }, "-=1.5")
        .from('#splash .btn-primary', { y: 20, opacity: 0, duration: 1, ease: "back.out" }, "-=0.5");

    updateView();
    initTheme();
};
