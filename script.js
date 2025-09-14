// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.animation = `hamburgerPulse 0.3s ease ${index * 0.1}s`;
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Add hamburger animation keyframes
if (!document.querySelector('#hamburger-styles')) {
    const style = document.createElement('style');
    style.id = 'hamburger-styles';
    style.textContent = `
        @keyframes hamburgerPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced scroll effects
let ticking = false;

function updateScrollEffects() {
    const scrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Navbar background change
    if (scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    // Scroll progress indicator
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
    
    // Parallax effects
    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Create scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
}

// Initialize scroll progress on page load
document.addEventListener('DOMContentLoaded', createScrollProgress);

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !service) {
            const message = currentLanguage === 'hu' ? 'Kérjük, töltsd ki az összes kötelező mezőt.' : 'Please fill in all required fields.';
            showNotification(message, 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            const message = currentLanguage === 'hu' ? 'Kérjük, adj meg egy érvényes e-mail címet.' : 'Please enter a valid email address.';
            showNotification(message, 'error');
            return;
        }
        
        // Enhanced form submission with loading animation
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = currentLanguage === 'hu' ? 'Küldés...' : 'Sending...';
        
        // Add form submission animation
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.3s ease';
        
        // Simulate API call with progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 20;
            if (progress >= 100) {
                clearInterval(progressInterval);
                const successMessage = currentLanguage === 'hu' 
                    ? 'Köszönjük! Az üzeneted sikeresen elküldve. 24 órán belül válaszolok.' 
                    : 'Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.';
                showNotification(successMessage, 'success');
                this.reset();
                this.style.transform = 'scale(1)';
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
            }
        }, 400);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation delay
            const delay = index * 0.1;
            entry.target.style.animationDelay = `${delay}s`;
            
            // Add special animations for different elements
            if (entry.target.classList.contains('service-card')) {
                entry.target.style.animation = 'scaleIn 0.6s ease-out forwards';
            } else if (entry.target.classList.contains('testimonial')) {
                entry.target.style.animation = 'slideInLeft 0.6s ease-out forwards';
            } else if (entry.target.classList.contains('step')) {
                entry.target.style.animation = 'slideInRight 0.6s ease-out forwards';
            } else if (entry.target.classList.contains('principle')) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .testimonial, .step, .principle');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.classList.add(`animate-delay-${(index % 5) + 1}`);
        observer.observe(el);
    });
});

// Enhanced parallax effects
function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image .image-placeholder');
    
    if (hero) {
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    if (heroImage) {
        const rate = scrolled * 0.2;
        heroImage.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
    }
}

// Magnetic hover effect for buttons
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .service-card, .principle');
    
    magneticElements.forEach(element => {
        element.classList.add('magnetic');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Particle system for hero section
function createParticleSystem() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 3 + 3;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.animationDuration = `${animationDuration}s`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, animationDuration * 1000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 300);
}

// Text reveal animation
function addTextRevealAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    const words = text.split(' ');
    
    heroTitle.innerHTML = words.map(word => 
        `<span class="text-reveal"><span>${word}</span></span>`
    ).join(' ');
    
    // Trigger animation on load
    setTimeout(() => {
        const spans = heroTitle.querySelectorAll('.text-reveal span');
        spans.forEach((span, index) => {
            setTimeout(() => {
                span.style.animation = 'slideInUp 0.6s ease-out forwards';
            }, index * 100);
        });
    }, 500);
}

// Initialize all enhanced animations
document.addEventListener('DOMContentLoaded', () => {
    addMagneticEffect();
    createParticleSystem();
    addTextRevealAnimation();
    
    // Update parallax on scroll
    window.addEventListener('scroll', updateParallax);
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.type === 'submit') return; // Skip for form submit buttons
        
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation keyframes
if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Enhanced section reveal animations
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Add special effects for different sections
            if (entry.target.id === 'hero') {
                entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
            } else if (entry.target.id === 'about') {
                entry.target.style.animation = 'slideInLeft 0.8s ease-out forwards';
            } else if (entry.target.id === 'services') {
                entry.target.style.animation = 'slideInRight 0.8s ease-out forwards';
            } else if (entry.target.id === 'approach') {
                entry.target.style.animation = 'scaleIn 0.8s ease-out forwards';
            } else if (entry.target.id === 'contact') {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    sectionObserver.observe(section);
});

// Add revealed class styles and enhanced animations
if (!document.querySelector('#reveal-styles')) {
    const style = document.createElement('style');
    style.id = 'reveal-styles';
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Enhanced loading animation */
        .page-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--white);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--gray-200);
            border-top: 3px solid var(--primary-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        .loading-text {
            color: var(--text-light);
            font-size: 1.125rem;
            animation: pulse 2s infinite;
        }
        
        /* Cursor trail effect */
        .cursor-trail {
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, var(--primary-blue), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            animation: cursorTrail 0.3s ease-out forwards;
        }
        
        @keyframes cursorTrail {
            0% {
                transform: scale(0);
                opacity: 0.6;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Page loading animation
function showPageLoading() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'page-loading';
    loadingScreen.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading...</div>
    `;
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
}

// Cursor trail effect
function addCursorTrail() {
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = mouseX - 10 + 'px';
        trail.style.top = mouseY - 10 + 'px';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 300);
    });
}

// Language switching functionality
let currentLanguage = 'en';

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-en][data-hu]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const inputs = document.querySelectorAll('input[data-placeholder-en], textarea[data-placeholder-en]');
    inputs.forEach(input => {
        const placeholder = input.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
    
    // Update select options
    const selects = document.querySelectorAll('select option[data-en]');
    selects.forEach(option => {
        const text = option.getAttribute(`data-${lang}`);
        if (text) {
            option.textContent = text;
        }
    });
    
    // Update document title
    const title = document.querySelector('title');
    if (title) {
        const titleText = title.getAttribute(`data-${lang}`);
        if (titleText) {
            title.textContent = titleText;
        }
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language switching
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLanguage);
    
    // Add event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    showPageLoading();
    addCursorTrail();
});
