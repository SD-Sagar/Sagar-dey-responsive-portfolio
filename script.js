// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================

// Smooth scroll with active link highlighting
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section-block, .header');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Close mobile menu
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// Highlight active section in navigation
function highlightActiveSection() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Add shadow to navbar on scroll
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', () => {
    highlightActiveSection();
    handleNavbarScroll();
});

// ========================================
// DARK MODE TOGGLE
// ========================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Toggle icon
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Stagger animation for skill cards, education cards, and project cards
            const cards = entry.target.querySelectorAll('.skillcard, .educationcard, .projectcard');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all fade-in sections
document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
});

// Initial styles for cards (for stagger effect)
document.querySelectorAll('.skillcard, .educationcard, .projectcard').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// ========================================
// LOAD MORE PROJECTS FUNCTIONALITY
// ========================================

const loadMoreBtn = document.getElementById('loadMoreBtn');
const hiddenProjects = document.querySelectorAll('.hidden-project');
let projectsShown = 0;
const projectsPerLoad = 4;

loadMoreBtn.addEventListener('click', () => {
    const start = projectsShown;
    const end = Math.min(projectsShown + projectsPerLoad, hiddenProjects.length);
    
    // Show next batch of projects
    for (let i = start; i < end; i++) {
        hiddenProjects[i].classList.remove('hidden-project');
        hiddenProjects[i].classList.add('show-project');
    }
    
    projectsShown = end;
    
    // Update button text
    const remaining = hiddenProjects.length - projectsShown;
    if (remaining > 0) {
        loadMoreBtn.innerHTML = `Load More Projects <span class="remaining-count">(${remaining})</span>`;
    } else {
        loadMoreBtn.innerHTML = 'Show Less';
        loadMoreBtn.onclick = () => {
            // Hide all projects
            hiddenProjects.forEach(project => {
                project.classList.add('hidden-project');
                project.classList.remove('show-project');
            });
            
            projectsShown = 0;
            loadMoreBtn.innerHTML = `Load More Projects <span class="remaining-count">(${hiddenProjects.length})</span>`;
            loadMoreBtn.onclick = null;
            
            // Scroll to projects section
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            
            // Re-add the original event listener
            window.location.reload();
        };
    }
});

// ========================================
// CONTACT FORM VALIDATION
// ========================================

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Real-time validation
function validateField(field, validator, errorElement) {
    const isValid = validator(field.value);
    
    if (field.value === '') {
        field.classList.remove('error', 'success');
        errorElement.textContent = '';
        return null;
    }
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
        errorElement.textContent = '';
        return true;
    } else {
        field.classList.remove('success');
        field.classList.add('error');
        return false;
    }
}

nameInput.addEventListener('input', () => {
    const errorElement = document.getElementById('nameError');
    const isValid = validateField(nameInput, (value) => value.trim().length >= 2, errorElement);
    if (isValid === false) {
        errorElement.textContent = 'Name must be at least 2 characters';
    }
});

emailInput.addEventListener('input', () => {
    const errorElement = document.getElementById('emailError');
    const isValid = validateField(emailInput, (value) => emailRegex.test(value), errorElement);
    if (isValid === false) {
        errorElement.textContent = 'Please enter a valid email address';
    }
});

messageInput.addEventListener('input', () => {
    const errorElement = document.getElementById('messageError');
    const isValid = validateField(messageInput, (value) => value.trim().length >= 10, errorElement);
    if (isValid === false) {
        errorElement.textContent = 'Message must be at least 10 characters';
    }
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameValid = nameInput.value.trim().length >= 2;
    const emailValid = emailRegex.test(emailInput.value);
    const messageValid = messageInput.value.trim().length >= 10;
    
    if (!nameValid || !emailValid || !messageValid) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all fields correctly';
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loader').style.display = 'inline-block';
    
    try {
        // Submit form to Formspree
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            contactForm.reset();
            nameInput.classList.remove('success');
            emailInput.classList.remove('success');
            messageInput.classList.remove('success');
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Oops! Something went wrong. Please try again.';
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        
        // Hide feedback message after 4 seconds
        setTimeout(() => {
            formFeedback.style.display = 'none';
            // Reset classes so next submission shows properly
            setTimeout(() => {
                formFeedback.className = 'form-feedback';
            }, 300);
        }, 4000);
    }
});

// ========================================
// INITIAL PAGE LOAD
// ========================================

// Trigger initial highlight
highlightActiveSection();

// Ensure fade-in animation for header
document.querySelector('.header').classList.add('fade-in');
