// ===========================
// PAGE LOADER
// ===========================

window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

// Show loader when navigating to another page
document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '/' && href !== '#' && !href.startsWith('/#')) {
            const loader = document.getElementById('page-loader');
            loader.classList.remove('hidden');
        }
    });
});

// ===========================
// NAVIGATION SCROLL EFFECT
// ===========================

const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===========================
// MOBILE MENU TOGGLE
// ===========================

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// ===========================
// SMOOTH SCROLL
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===========================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-slide-right, .animate-slide-left, .animate-fade-up');
    
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Standards section slideshow (u krug)
    const slideshow = document.querySelector('.standards-slideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.standards-slide');
        const dots = slideshow.querySelectorAll('.slideshow-dot');
        const total = slides.length;
        let current = 0;
        const intervalMs = 3500;

        function goToSlide(index) {
            current = (index + total) % total;
            slides.forEach((s, i) => s.classList.toggle('active', i === current));
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        let timer = setInterval(() => goToSlide(current + 1), intervalMs);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
                clearInterval(timer);
                timer = setInterval(() => goToSlide(current + 1), intervalMs);
            });
        });
    }
});

// ===========================
// ACTIVE NAVIGATION LINK
// ===========================

// Set active link based on current page URL only
const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
    if (currentPath === '/' && href === '/') {
            link.classList.add('active');
    } else if (href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
});
