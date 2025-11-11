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
    
    // Initialize Lucide icons after DOM is loaded
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
});

// Animated Background
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
    
    // Update and draw particles
    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = '#58A6FF';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Update and draw nodes
    nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.globalAlpha = node.opacity;
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw connections between nodes
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = Math.sqrt(
                Math.pow(node.x - nodes[j].x, 2) + 
                Math.pow(node.y - nodes[j].y, 2)
            );
            
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
    
    // Draw connections between particles and nodes
    particles.forEach(particle => {
        nodes.forEach(node => {
            const distance = Math.sqrt(
                Math.pow(particle.x - node.x, 2) + 
                Math.pow(particle.y - node.y, 2)
            );
            
            if (distance < 100) {
                ctx.globalAlpha = (100 - distance) / 100 * 0.1;
                ctx.strokeStyle = '#58A6FF';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(node.x, node.y);
                ctx.stroke();
            }
        });
    });
    
    animationFrame = requestAnimationFrame(animate);
}

// Navigation
function initializeNavigation() {
    const nav = document.getElementById('navigation');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 100; // height of navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        closeMobileMenu();
    }
}


function toggleTheme() {
    isDarkMode = !isDarkMode;
    const themeIcon = document.querySelector('.theme-toggle i');
    
    if (isDarkMode) {
        themeIcon.setAttribute('data-lucide', 'moon');
    } else {
        themeIcon.setAttribute('data-lucide', 'sun');
    }
    
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

// Skills Animation
function initializeSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
            }
        });
    }, { threshold: 0.1 });
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
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

// Form Handling
function initializeFormHandling() {
    // Add any additional form initialization here
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showToast('Thank you for your message! I\'ll get back to you soon.', 'success');
    
    // Reset form
    event.target.reset();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll for older browsers
function smoothScrollTo(element) {
    const targetPosition = element.offsetTop - 80; // Account for fixed navigation
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Intersection Observer for animations
function createScrollAnimations() {
    const animatedElements = document.querySelectorAll('.hero-content, .project-card, .skill-category');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', createScrollAnimations);

// Performance optimization
function optimizePerformance() {
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        } else {
            animate();
        }
    });
    
    // Reduce particle count on mobile
    if (window.innerWidth < 768) {
        particles = particles.slice(0, Math.floor(particles.length * 0.5));
        nodes = nodes.slice(0, Math.floor(nodes.length * 0.5));
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Portfolio Error:', event.error);
});

// Preload critical images
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

document.addEventListener('DOMContentLoaded', preloadImages);
