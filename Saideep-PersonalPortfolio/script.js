/* ==========================================================================
   YELLANKI SAIDEEP - PERSONAL PORTFOLIO INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. TYPEWRITER EFFECT FOR HERO SUBTITLE ---
    const typedTextSpan = document.getElementById('typedText');
    const roles = [
        "Software Engineer",
        "Java Backend Developer",
        "IoT System Engineer",
        "Machine Learning Practitioner",
        "Analytical Problem Solver"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 90;
    const erasingDelay = 40;
    const newTextDelay = 2000;

    function type() {
        if (!typedTextSpan) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, newTextDelay);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 300);
        } else {
            setTimeout(type, isDeleting ? erasingDelay : typingDelay);
        }
    }
    setTimeout(type, 500);

    // --- 2. DARK / LIGHT THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const savedTheme = localStorage.getItem('saideep_portfolio_theme') || 'dark';

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('saideep_portfolio_theme', theme);
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.className = 'fa-solid fa-sun';
            } else {
                themeIcon.className = 'fa-solid fa-moon';
            }
        }
    }

    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- 3. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Shrink Navbar on Scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/Hide Back to Top Button
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Highlight Active Nav Link based on Scroll Position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 4. MOBILE HAMBURGER MENU ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        // Close menu on clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // --- 5. SKILL CATEGORY FILTERS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- 6. ANIMATED NUMERIC STAT COUNTERS ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            const duration = 1500;
            const steps = 60;
            const stepValue = target / steps;
            let current = 0;
            let count = 0;

            const timer = setInterval(() => {
                count++;
                current += stepValue;
                if (count >= steps) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
            }, duration / steps);
        });
    }

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animateStats();
                    animatedStats = true;
                }
            });
        }, { threshold: 0.3 });

        observer.observe(aboutSection);
    }

    // --- 7. COPY TO CLIPBOARD BUTTONS ---
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const icon = btn.querySelector('i');
                const origClass = icon.className;
                icon.className = 'fa-solid fa-check text-green';
                btn.style.color = '#10b981';
                setTimeout(() => {
                    icon.className = origClass;
                    btn.style.color = '';
                }, 2000);
            });
        });
    });

    // --- 8. INTERACTIVE PROJECT MODALS ---
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    const openModalBtns = document.querySelectorAll('.open-project-modal');

    const projectDetailsData = {
        project1: {
            title: "Smart Fire Detection & Surveillance System",
            badge: "ESP32 CAM • IoT • Python • Real-time Systems",
            role: "Project Lead (Managed team of 4 members)",
            overview: "Engineered an IoT-based safety system integrating real-time fire detection with live video surveillance using ESP32 CAM hardware. Designed to minimize disaster response times by automatically dispatching alerts to safety personnel.",
            keyHighlights: [
                "Configured ESP32 CAM microcontroller for continuous live stream broadcast over local/cloud network.",
                "Integrated Python-based computer vision & sensor signal monitoring for fire/smoke detection.",
                "Automated instant emergency notification dispatch mechanism with precise time-stamp logging.",
                "Coordinated cross-functional team across hardware setup, firmware flashing, and unit testing."
            ],
            githubLink: "https://github.com"
        },
        project2: {
            title: "CrimeCast: Crime Rate Analysis & Prediction",
            badge: "Python • Machine Learning • K-Means • Data Analytics",
            role: "Project Lead (Managed team of 3 members)",
            overview: "Developed a machine learning solution using the K-Means clustering algorithm to analyze historical crime datasets, discover spatial crime hot-spots, and generate predictive analytics for law enforcement agencies.",
            keyHighlights: [
                "Built an end-to-end data engineering pipeline to clean, normalize, and process large crime datasets.",
                "Implemented K-Means clustering algorithm to categorize geographical regions by risk factors and crime frequencies.",
                "Designed an interactive visualization dashboard enabling intuitive exploration of crime trends.",
                "Authored comprehensive technical documentation outlining model evaluation metrics and actionable insights."
            ],
            githubLink: "https://github.com"
        }
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pKey = btn.getAttribute('data-project');
            const data = projectDetailsData[pKey];
            if (!data) return;

            modalBody.innerHTML = `
                <div class="modal-project-header">
                    <span class="project-badge" style="display:inline-block; margin-bottom:12px;">${data.badge}</span>
                    <h2 style="font-family:var(--font-heading); font-size:1.6rem; margin-bottom:8px;">${data.title}</h2>
                    <p style="color:var(--accent-cyan); font-weight:600; font-size:0.9rem; margin-bottom:20px;">
                        <i class="fa-solid fa-user-shield"></i> ${data.role}
                    </p>
                </div>
                <div class="modal-project-content" style="color:var(--text-secondary); line-height:1.7;">
                    <h4 style="color:var(--text-primary); margin-bottom:8px;"><i class="fa-solid fa-circle-info"></i> Overview</h4>
                    <p style="margin-bottom:20px;">${data.overview}</p>
                    
                    <h4 style="color:var(--text-primary); margin-bottom:10px;"><i class="fa-solid fa-list-check"></i> Key Engineering Contributions</h4>
                    <ul style="padding-left:20px; margin-bottom:25px;">
                        ${data.keyHighlights.map(h => `<li style="margin-bottom:8px;">${h}</li>`).join('')}
                    </ul>

                    <div style="display:flex; gap:12px;">
                        <a href="${data.githubLink}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                            <i class="fa-brands fa-github"></i> View GitHub Repo
                        </a>
                        <button class="btn btn-outline btn-sm" onclick="document.getElementById('projectModal').classList.remove('active')">
                            Close
                        </button>
                    </div>
                </div>
            `;

            projectModal.classList.add('active');
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }

    // --- 9. QUICK RESUME MODAL ---
    const resumeModalBtn = document.getElementById('resumeModalBtn');
    const resumeModal = document.getElementById('resumeModal');
    const resumeModalClose = document.getElementById('resumeModalClose');

    if (resumeModalBtn && resumeModal) {
        resumeModalBtn.addEventListener('click', () => {
            resumeModal.classList.add('active');
        });

        resumeModalClose.addEventListener('click', () => {
            resumeModal.classList.remove('active');
        });

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
            }
        });
    }

    // --- 10. CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
                contactForm.reset();

                formStatus.className = 'form-status success';
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully. Saideep will respond shortly.`;

                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }, 1200);
        });
    }

});
