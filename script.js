/**
 * Ever After Events - Interactive Scripting
 */

document.addEventListener('DOMContentLoaded', () => {

    if (window.AOS) {
        AOS.init({
            duration: 800,
            once: true,
            offset: 120,
            easing: 'ease-out-cubic'
        });
    }

    /* ==========================================================================
       01. Header Scroll Effect
       ========================================================================== */
    const header = document.getElementById('header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Initial check


    /* ==========================================================================
       02. Mobile Navigation Toggle
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        const isOpen = menuToggle.classList.toggle('open');
        mobileOverlay.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a mobile nav link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    /* ==========================================================================
       03. Active Navigation Link Highlighting on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
        let scrollPosition = window.scrollY + 200; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();


    /* ==========================================================================
       04. Reveal Elements on Scroll
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealElement = (element) => {
        element.classList.add('revealed');
    };

    const revealOnScroll = () => {
        const triggerPoint = window.innerHeight * 0.9;

        revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < triggerPoint) {
                revealElement(element);
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealOnScroll();
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('load', revealOnScroll);


    /* ==========================================================================
       05. Gallery Filter System
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons and add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });


    /* ==========================================================================
       06. Lightbox Modal for Gallery
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImages = []; // Stores images currently visible (filtered)
    let currentImageIndex = 0;

    const updateLightboxImage = () => {
        const targetImg = currentImages[currentImageIndex].querySelector('img');
        const targetTitle = currentImages[currentImageIndex].querySelector('.gallery-title').textContent;
        const targetCat = currentImages[currentImageIndex].querySelector('.gallery-category').textContent;
        
        lightboxImg.src = targetImg.src;
        lightboxImg.alt = targetImg.alt;
        lightboxCaption.innerHTML = `${targetTitle} <span style="font-size:1rem; display:block; color:#c5a880; font-family:'Plus Jakarta Sans'; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; margin-top:5px;">${targetCat}</span>`;
    };

    const openLightbox = (index) => {
        // Collect only visible images in order
        currentImages = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
        currentImageIndex = currentImages.indexOf(galleryItems[index]);
        
        // If the clicked item is hidden, get its index in the filtered array or default to 0
        if (currentImageIndex === -1) {
            currentImageIndex = 0;
        }

        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateLightboxImage();
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    };

    // Attach click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Control events
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Close lightbox on clicking outside image content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });


    /* ==========================================================================
       07. Testimonials Slider
       ========================================================================== */
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dotElements = document.querySelectorAll('.slider-dots .dot');
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');

    let currentSlideIndex = 0;
    let slideInterval;

    const showSlide = (index) => {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dotElements.forEach(dot => dot.classList.remove('active'));

        currentSlideIndex = (index + testimonialSlides.length) % testimonialSlides.length;
        
        testimonialSlides[currentSlideIndex].classList.add('active');
        dotElements[currentSlideIndex].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlideIndex + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlideIndex - 1);
    };

    // Reset slide timer on manual action
    const resetSlideTimer = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    };

    sliderNext.addEventListener('click', () => {
        nextSlide();
        resetSlideTimer();
    });

    sliderPrev.addEventListener('click', () => {
        prevSlide();
        resetSlideTimer();
    });

    dotElements.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showSlide(index);
            resetSlideTimer();
        });
    });

    // Start auto slider
    slideInterval = setInterval(nextSlide, 6000);


    /* ==========================================================================
       08. Contact Form Validation & Mock Submit
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // Input elements
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Helper: validate email address format
    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Clear error class on input changes
    const inputs = [fullNameInput, emailInput, messageInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('has-error');
        });
    });

    const validateForm = () => {
        let isFormValid = true;

        // Name Validation
        if (!fullNameInput.value.trim()) {
            fullNameInput.parentElement.classList.add('has-error');
            isFormValid = false;
        } else {
            fullNameInput.parentElement.classList.remove('has-error');
        }

        // Email Validation
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('has-error');
            isFormValid = false;
        } else {
            emailInput.parentElement.classList.remove('has-error');
        }

        // Message Validation
        if (!messageInput.value.trim()) {
            messageInput.parentElement.classList.add('has-error');
            isFormValid = false;
        } else {
            messageInput.parentElement.classList.remove('has-error');
        }

        return isFormValid;
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Run validation
        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');

        // Mock Server Delay (1.5 seconds)
        setTimeout(() => {
            // Show Success Overlay
            formSuccess.classList.add('active');
            
            // Reset loading state
            submitBtn.disabled = false;
            submitBtn.classList.remove('submitting');
            contactForm.reset();
        }, 1500);
    });

    resetFormBtn.addEventListener('click', () => {
        formSuccess.classList.remove('active');
    });


    /* ==========================================================================
       09. Assistant de planning interactif
       ========================================================================== */
    const assistantFab = document.getElementById('assistantFab');
    const assistantModal = document.getElementById('assistantModal');
    const closeAssistant = document.getElementById('closeAssistant');
    const assistantGuestRange = document.getElementById('assistantGuestRange');
    const assistantGuestValue = document.getElementById('assistantGuestValue');
    const assistantEstimateBtn = document.getElementById('assistantEstimateBtn');
    const assistantResult = document.getElementById('assistantResult');
    const assistantIntroText = document.getElementById('assistantIntroText');
    const assistantOptions = document.querySelectorAll('.assistant-option');

    let selectedAssistantStyle = 'traditional';

    const updateAssistantSelection = () => {
        assistantOptions.forEach(button => {
            const isActive = button.dataset.assistantOption === selectedAssistantStyle;
            button.classList.toggle('active', isActive);
        });
    };

    assistantOptions.forEach(button => {
        button.addEventListener('click', () => {
            selectedAssistantStyle = button.dataset.assistantOption;
            updateAssistantSelection();

            const messages = {
                traditional: 'Votre mariage traditionnel mérite une scénographie élégante et raffinée, avec un grand soin porté à la reception et au déroulé de la journée.',
                civil: 'Pour un mariage civil, nous recommandons un rythme sobre, lumineux et parfaitement orchestré pour une ambiance chaleureuse et fluide.',
                destination: 'Pour une destination wedding, nous privilégions une organisation sans stress avec des prestataires locaux et une coordination internationale.'
            };

            assistantIntroText.textContent = messages[selectedAssistantStyle];
        });
    });

    assistantGuestRange.addEventListener('input', () => {
        assistantGuestValue.textContent = assistantGuestRange.value;
    });

    const openAssistantModal = () => {
        assistantModal.style.display = 'flex';
        assistantModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeAssistantModal = () => {
        assistantModal.style.display = 'none';
        assistantModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    assistantFab.addEventListener('click', openAssistantModal);
    closeAssistant.addEventListener('click', closeAssistantModal);
    document.querySelector('[data-close-assistant]').addEventListener('click', closeAssistantModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && assistantModal.style.display === 'flex') {
            closeAssistantModal();
        }
    });

    assistantEstimateBtn.addEventListener('click', () => {
        const guests = Number(assistantGuestRange.value);
        const baseBudgets = {
            traditional: 14000,
            civil: 9000,
            destination: 22000
        };

        const recommendation = {
            traditional: {
                title: 'Formule Prestige',
                description: 'Organisation complète avec scénographie florale et suivi de chaque détail jusqu’au grand soir.'
            },
            civil: {
                title: 'Formule Élégante',
                description: 'Coordination soignée et décoration minimaliste pour une cérémonie lumineuse et parfaitement organisée.'
            },
            destination: {
                title: 'Formule À l’international',
                description: 'Logistique internationale, sélection de prestataires locaux et planification sur mesure.'
            }
        };

        const estimatedBudget = baseBudgets[selectedAssistantStyle] + guests * 140;
        const currency = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        });

        assistantResult.innerHTML = `
            <div class="rounded-2xl border border-[#ebdcd0] bg-[#fdfcfb] p-4">
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#aa895d]">Suggestion</p>
                <h4 class="mt-2 text-xl font-semibold text-[#1c1f22]">${recommendation[selectedAssistantStyle].title}</h4>
                <p class="mt-2 text-sm leading-7 text-[#6e757c]">${recommendation[selectedAssistantStyle].description}</p>
                <div class="mt-4 flex items-center justify-between border-t border-[#ebdcd0] pt-3">
                    <span class="text-sm font-semibold uppercase tracking-[0.2em] text-[#6e757c]">Budget estimé</span>
                    <span class="text-lg font-semibold text-[#aa895d]">${currency.format(estimatedBudget)}</span>
                </div>
            </div>
        `;
    });

    updateAssistantSelection();

});
