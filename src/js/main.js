/**
 * ASEGURA - Main JavaScript
 * Consultora de seguridad empresarial
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initNavbar();
    initMobileMenu();
    initHeroSlider();
    initScrollAnimations();
    initCounters();
    initFormValidation();
    initSmoothScroll();
});

/**
 * Navbar - Scroll effect
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');
    const overlay = document.querySelector('.navbar-overlay');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('is-active');
        menu.classList.toggle('is-active');
        
        if (overlay) {
            overlay.classList.toggle('is-active');
        }
        
        // Prevent body scroll
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu on overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            toggle.classList.remove('is-active');
            menu.classList.remove('is-active');
            overlay.classList.remove('is-active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Close menu on link click
    const menuLinks = menu.querySelectorAll('.navbar__link');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            toggle.classList.remove('is-active');
            menu.classList.remove('is-active');
            if (overlay) {
                overlay.classList.remove('is-active');
            }
            document.body.classList.remove('menu-open');
        });
    });
}

/**
 * Hero Slider
 */
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.hero-slider__slide'));
    const dots = Array.from(slider.querySelectorAll('.hero-slider__dot'));

    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideInterval = null;
    const delay = 5000;

    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
        });

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, delay);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            goToSlide(index);
            startAutoSlide();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoSlide();
        }
    });

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    slider.addEventListener('touchstart', stopAutoSlide, { passive: true });
    slider.addEventListener('touchend', startAutoSlide);

    goToSlide(0);
    startAutoSlide();
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
}

/**
 * Animated Counters
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                function updateCounter() {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('.contact-form__form');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = form.querySelector('input[name="nombre"]');
            const email = form.querySelector('input[type="email"]');
            const phone = form.querySelector('input[name="celular"]');
            const company = form.querySelector('input[name="empresa"]');
            const service = form.querySelector('select[name="servicio"]');
            const message = form.querySelector('textarea[name="mensaje"]');
            
            let isValid = true;
            let errorMessage = '';
            
            // Name validation
            if (!name || name.value.trim() === '') {
                isValid = false;
                errorMessage = 'Por favor ingrese su nombre';
                name.classList.add('error');
            } else {
                name.classList.remove('error');
            }
            
            // Email validation
            if (!email || !isValidEmail(email.value)) {
                isValid = false;
                if (isValid) errorMessage = 'Por favor ingrese un correo válido';
                email.classList.add('error');
            } else {
                email.classList.remove('error');
            }
            
            // Phone validation
            if (!phone || phone.value.trim() === '') {
                isValid = false;
                if (isValid) errorMessage = 'Por favor ingrese su número de celular';
                phone.classList.add('error');
            } else {
                phone.classList.remove('error');
            }
            
            if (isValid) {
                // Show success message
                const successMessage = form.querySelector('.form-success');
                if (successMessage) {
                    form.style.display = 'none';
                    successMessage.classList.add('is-visible');
                } else {
                    // Simulate form submission
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Enviando...';
                    submitBtn.disabled = true;
                    
                    setTimeout(function() {
                        form.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        alert('Mensaje enviado correctamente. Nos contactaremos pronto.');
                    }, 1500);
                }
            } else {
                alert(errorMessage);
            }
        });
        
        // Remove error class on input
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('input', function() {
                input.classList.remove('error');
            });
        });
    });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/**
 * ASEGURA - Contact Form to Google Sheets
 */

document.addEventListener("DOMContentLoaded", function () {
    initContactForm();
});

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const submitBtn = document.getElementById("contactSubmitBtn");
    const successBox = document.getElementById("formSuccess");

    // Reemplaza con tu URL del Web App desplegado
    const GOOGLE_SCRIPT_URL = "PEGAR_AQUI_TU_WEBAPP_URL";

    // Time trap
    form.dataset.formTs = String(Date.now());

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        const payload = {
            nombre: (formData.get("nombre") || "").toString().trim(),
            empresa: (formData.get("empresa") || "").toString().trim(),
            celular: (formData.get("celular") || "").toString().trim(),
            email: (formData.get("email") || "").toString().trim(),
            servicio: (formData.get("servicio") || "").toString().trim(),
            mensaje: (formData.get("mensaje") || "").toString().trim(),
            website: (formData.get("website") || "").toString().trim(), // honeypot
            form_ts: Number(form.dataset.formTs || Date.now()),
            ua: navigator.userAgent,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
            page: window.location.href
        };

        // Validación básica front
        if (!payload.nombre || !payload.empresa || !payload.celular || !payload.email || !payload.servicio) {
            Swal.fire({
                icon: "warning",
                title: "Complete los campos obligatorios",
                text: "Por favor revise el formulario antes de enviarlo."
            });
            return;
        }

        if (!isValidEmail(payload.email)) {
            Swal.fire({
                icon: "warning",
                title: "Correo no válido",
                text: "Ingrese un correo electrónico correcto."
            });
            return;
        }

        const originalBtnText = submitBtn ? submitBtn.innerHTML : "";

        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = "Enviando...";
            }

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.text();

            if (result === "OK") {
                form.reset();
                form.dataset.formTs = String(Date.now());

                if (successBox) {
                    successBox.classList.add("is-visible");
                }

                await Swal.fire({
                    icon: "success",
                    title: "¡Mensaje enviado!",
                    text: "Gracias por contactarnos. Nuestro equipo se comunicará con usted dentro de las 24 horas hábiles.",
                    confirmButtonText: "Entendido"
                });
            } else {
                throw new Error(result || "Error al enviar");
            }
        } catch (error) {
            console.error("Error enviando formulario:", error);

            Swal.fire({
                icon: "error",
                title: "No se pudo enviar el mensaje",
                text: "Ocurrió un problema al registrar su solicitud. Intente nuevamente en unos minutos."
            });
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Add to global scope for inline handlers
 */
window.initFormValidation = initFormValidation;

