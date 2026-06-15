/**
 * Akash B - Portfolio Script
 * Handles Theme Toggling, Typing Animation, Scroll Reveals, Active Nav links, and Form Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLER LOGIC
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Load theme preference from localStorage or default to system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });

    // ==========================================================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    };

    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // ==========================================================================
    // CYCLING TYPING ANIMATION
    // ==========================================================================
    const typingTextElement = document.querySelector('.typing-text');
    const phrases = [
        "AI & Data Science Student",
        "Future Software Engineer",
        "Tech Enthusiast"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeAnimation = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Remove character
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            // Add character
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle typing state transitions
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Full phrase typed, pause before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Phrase deleted, move to the next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(typeAnimation, typingSpeed);
    };

    // Start typing animation if element exists
    if (typingTextElement) {
        setTimeout(typeAnimation, 1000);
    }

    // ==========================================================================
    // INTERSECTION OBSERVER FOR SCROLL REVEALS & SKILL BARS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    // Save target widths of progress bars and reset them to 0% for animation trigger
    const skillBarTargets = [];
    skillProgressBars.forEach((bar, idx) => {
        const targetWidth = bar.style.width || '0%';
        skillBarTargets.push(targetWidth);
        bar.style.width = '0%'; // Set initial state to 0%
    });

    const observerOptions = {
        root: null, // use viewport
        threshold: 0.15, // trigger when 15% visible
        rootMargin: '0px 0px -50px 0px' // offset bottom threshold slightly
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If the entry is the skills section, animate skill bars
                if (entry.target.id === 'skills') {
                    skillProgressBars.forEach((bar, idx) => {
                        bar.style.width = skillBarTargets[idx];
                    });
                }
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Also observe skills section itself specifically to trigger progress bars
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        revealObserver.observe(skillsSection);
    }

    // ==========================================================================
    // ACTIVE NAVIGATION LINKS HIGHLIGHTING ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActiveNav = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for fixed navbar
            const sectionId = current.getAttribute('id');
            const navLinkElement = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if (navLinkElement) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLinkElement.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', scrollActiveNav);

    // ==========================================================================
    // CONTACT FORM INTERACTION & SIMULATED SUBMIT
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('i');
            
            // Set Loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin';
            
            // Simulate API request delay (1.5 seconds)
            setTimeout(() => {
                // Reset submit button
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                btnIcon.className = 'fa-solid fa-paper-plane';
                
                // Display success message
                formFeedback.textContent = "Thank you! Your message has been sent successfully. Akash will get back to you shortly.";
                formFeedback.className = "form-feedback success";
                
                // Reset form inputs
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formFeedback.className = "form-feedback hidden";
                    formFeedback.textContent = "";
                }, 5000);
            }, 1500);
        });
    }
});
