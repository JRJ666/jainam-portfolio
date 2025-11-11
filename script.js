// Initialize Lucide icons
lucide.createIcons();

// Global variables
let particles = [];
let nodes = [];
let animationFrame;
let canvas;
let ctx;
let isDarkMode = true;
let isMobileMenuOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimatedBackground();
    initializeNavigation();
    initializeSkillsAnimation();
    initializeFormHandling();
    optimizePerformance();
    createScrollAnimations();
    preloadImages();
    
    // Initialize Lucide icons after DOM is loaded
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
});

// ================== Animated Background ==================
function initializeAnimatedBackground() {
    canvas = document.getElementById('animatedBackground');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    createParticles();
    createNodes();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
        createNodes();
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const numParticles = Math.min(150, window.innerWidth / 10);
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

function createNodes() {
    nodes = [];
    const numNodes = Math.min(8, canvas.width / 200);
    
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 30 + 20,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw particles
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#58A6FF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw nodes and connections
    nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.globalAlpha = node.opacity;
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.stroke();

        for (let j = i + 1; j < nodes.length; j++) {
            const distance = Math.hypot(node.x - nodes[j].x, node.y - nodes[j].y);
            if (distance < 200) {
                ctx.globalAlpha = (200 - distance) / 200 * 0.2;
                ctx.strokeStyle = '#10B981';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    });

    // Connect particles to nodes
    particles.forEach(p => {
        nodes.forEach(n => {
            const distance = Math.hypot(p.x - n.x, p.y - n.y);
            if (distance < 100) {
                ctx.globalAlpha = (100 - distance) / 100 * 0.1;
                ctx.strokeStyle = '#58A6FF';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(n.x, n.y);
                ctx.stroke();
            }
        });
    });

    animationFrame = requestAnimationFrame(animate);
}

// ================== Navigation ==================
function initializeNavigation() {
    const nav = document.getElementById('navigation');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Attach scroll to nav buttons
    document.querySelectorAll('.nav-links button').forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('onclick').match(/'(.*?)'/)[1];
            scrollToSection(sectionId);
        });
    });

    document.querySelectorAll('#mobileMenu button').forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('onclick').match(/'(.*?)'/)[1];
            scrollToSection(sectionId);
        });
    });
}

// Smooth scroll to section with offset
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 80; // Fixed navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        closeMobileMenu();
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.setAttribute('data-lucide', isDarkMode ? 'moon' : 'sun');
    lucide.createIcons();
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.querySelector('.mobile-menu-toggle i');

    if (isMobileMenuOpen) {
        mobileMenu.classList.add('open');
        menuIcon.setAttribute('data-lucide', 'x');
    } else {
        mobileMenu.classList.remove('open');
        menuIcon.setAttribute('data-lucide', 'menu');
    }

    lucide.createIcons();
}

function closeMobileMenu() {
    isMobileMenuOpen = false;
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.querySelector('.mobile-menu-toggle i');
    mobileMenu.classList.remove('open');
    menuIcon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
}

// ================== Skills Animation ==================
function initializeSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
            }
        });
    }, { threshold: 0.1 });

    if (skillsSection) observer.observe(skillsSection);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level');
        setTimeout(() => {
            bar.style.width = level + '%';
        }, index * 200);
    });
}

// ================== Form Handling ==================
function initializeFormHandling() {
    const form = document.querySelector('.contact-form');
    if (form) form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }

    showToast('Thank you for your message! I\'ll get back to you soon.', 'success');
    event.target.reset();
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ================== Scroll Animations ==================
function createScrollAnimations() {
    const animatedElements = document.querySelectorAll('.hero-content, .project-card, .skill-category');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.style.animationPlayState = 'running';
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
}

// ================== Performance Optimization ==================
function optimizePerformance() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationFrame) cancelAnimationFrame(animationFrame);
        else animate();
    });

    if (window.innerWidth < 768) {
        particles = particles.slice(0, Math.floor(particles.length * 0.5));
        nodes = nodes.slice(0, Math.floor(nodes.length * 0.5));
    }
}

// ================== Image Preload ==================
function preloadImages() {
    const imageUrls = [
        'Potrait.jpg' // add more images here if needed
    ];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ================== Global Error Handling ==================
window.addEventListener('error', (event) => {
    console.error('Portfolio Error:', event.error);
});
