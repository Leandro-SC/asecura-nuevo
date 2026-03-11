/**
 * ASEGURA - Main JavaScript
 * Consultora de seguridad empresarial
 */

document.addEventListener("DOMContentLoaded", function () {
    console.log("MAIN JS NUEVO CARGADO");

    initNavbar();
    initMobileMenu();
    initHeroSlider();
    initScrollAnimations();
    initCounters();
    initFormValidation();
    initSmoothScroll();
    initContactForm();
});

/**
 * Navbar - Scroll effect
 */
function initNavbar() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", function () {
        navbar.classList.toggle("navbar--scrolled", window.scrollY > 50);
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector(".navbar__toggle");
    const menu = document.querySelector(".navbar__menu");
    const overlay = document.querySelector(".navbar-overlay");

    if (!toggle || !menu) return;

    function closeMenu() {
        toggle.classList.remove("is-active");
        menu.classList.remove("is-active");
        if (overlay) overlay.classList.remove("is-active");
        document.body.classList.remove("menu-open");
    }

    toggle.addEventListener("click", function () {
        toggle.classList.toggle("is-active");
        menu.classList.toggle("is-active");

        if (overlay) {
            overlay.classList.toggle("is-active");
        }

        document.body.classList.toggle("menu-open");
    });

    if (overlay) {
        overlay.addEventListener("click", closeMenu);
    }

    const menuLinks = menu.querySelectorAll(".navbar__link");
    menuLinks.forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });
}

/**
 * Hero Slider
 */
function initHeroSlider() {
    const slider = document.querySelector(".hero-slider");
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll(".hero-slider__slide"));
    const dots = Array.from(slider.querySelectorAll(".hero-slider__dot"));

    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideInterval = null;
    const delay = 5000;

    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("is-active", i === index);
        });

        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
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
        dot.addEventListener("click", function () {
            goToSlide(index);
            startAutoSlide();
        });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
            prevSlide();
            startAutoSlide();
        } else if (e.key === "ArrowRight") {
            nextSlide();
            startAutoSlide();
        }
    });

    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);
    slider.addEventListener("touchstart", stopAutoSlide, { passive: true });
    slider.addEventListener("touchend", startAutoSlide);

    goToSlide(0);
    startAutoSlide();
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(".scroll-animate");
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        }
    );

    animatedElements.forEach(function (element) {
        observer.observe(element);
    });
}

/**
 * Animated Counters
 */
function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
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
            });
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 0.5
        }
    );

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
}

/**
 * Form Validation placeholder
 */
function initFormValidation() {
    // Intencionalmente vacío si no lo estás usando en otras páginas
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            const navbar = document.querySelector(".navbar");

            if (target && navbar) {
                e.preventDefault();

                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // Evita registrar el submit más de una vez
    if (form.dataset.initialized === "true") return;
    form.dataset.initialized = "true";

    const submitBtn = document.getElementById("contactSubmitBtn");
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxW2Vq4eBplgMHfGiiCa3lOtu4IZc5p3udpZNMmLVsu3zW8QnDL0p_xS78KSzK_j-Qh/exec";

    form.dataset.formTs = String(Date.now());

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Evita doble click o doble envío mientras está procesando
        if (form.dataset.sending === "true") return;
        form.dataset.sending = "true";

        const formData = new FormData(form);

        const payload = {
            nombre: (formData.get("nombre") || "").toString().trim(),
            empresa: (formData.get("empresa") || "").toString().trim(),
            ruc: (formData.get("ruc") || "").toString().trim(),
            celular: (formData.get("celular") || "").toString().trim(),
            email: (formData.get("email") || "").toString().trim(),
            servicio: (formData.get("servicio") || "").toString().trim(),
            mensaje: (formData.get("mensaje") || "").toString().trim(),
            website: (formData.get("website") || "").toString().trim(),
            form_ts: Number(form.dataset.formTs || Date.now()),
            ua: navigator.userAgent,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
            page: window.location.href
        };

        if (!payload.nombre || !payload.empresa || !payload.celular || !payload.email || !payload.servicio) {
            form.dataset.sending = "false";
            await Swal.fire({
                icon: "warning",
                title: "Complete los campos obligatorios",
                text: "Por favor revise el formulario antes de enviarlo.",
                confirmButtonText: "Entendido"
            });
            return;
        }

        if (!isValidEmail(payload.email)) {
            form.dataset.sending = "false";
            await Swal.fire({
                icon: "warning",
                title: "Correo no válido",
                text: "Ingrese un correo electrónico correcto.",
                confirmButtonText: "Entendido"
            });
            return;
        }

        if (payload.ruc && !isValidRuc(payload.ruc)) {
            form.dataset.sending = "false";
            await Swal.fire({
                icon: "warning",
                title: "RUC no válido",
                text: "El RUC debe tener 11 dígitos numéricos.",
                confirmButtonText: "Entendido"
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

            const result = (await response.text()).trim();

            if (result !== "OK") {
                throw new Error(result || "Error al enviar");
            }

            form.reset();
            form.dataset.formTs = String(Date.now());

            await Swal.fire({
                icon: "success",
                title: "¡Mensaje enviado!",
                text: "Gracias por contactarnos. Nuestro equipo se comunicará con usted dentro de las 24 horas hábiles.",
                confirmButtonText: "OK",
                allowOutsideClick: true,
                allowEscapeKey: true
            });
        } catch (error) {
            console.error("Error enviando formulario:", error);

            await Swal.fire({
                icon: "error",
                title: "No se pudo enviar el mensaje",
                text: "Ocurrió un problema al registrar su solicitud. Intente nuevamente en unos minutos.",
                confirmButtonText: "Entendido"
            });
        } finally {
            form.dataset.sending = "false";

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidRuc(ruc) {
    return /^\d{11}$/.test(ruc);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidRuc(ruc) {
    return /^\d{11}$/.test(ruc);
}

window.initFormValidation = initFormValidation;