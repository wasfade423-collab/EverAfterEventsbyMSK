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
    handleHeaderScroll(); 

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
        let scrollPosition = window.scrollY + 200; 
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

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(element => revealObserver.observe(element));
    }

    /* ==========================================================================
       05. Gallery Filter System
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
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
       06. Contact Form Basic Mock Submit
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btnText = submitBtn.querySelector('span');
            btnText.textContent = "Envoi en cours...";
            
            setTimeout(() => {
                btnText.textContent = "Message Envoyé !";
                contactForm.reset();
                setTimeout(() => btnText.textContent = "Envoyer le projet", 3000);
            }, 1500);
        });
    }

    /* ==========================================================================
       07. Assistant de questions fréquentes (Refait selon votre demande)
       ========================================================================== */
    const assistantFab = document.getElementById('assistantFab');
    const assistantModal = document.getElementById('assistantModal');
    const closeAssistant = document.getElementById('closeAssistant');
    const assistantOptions = document.querySelectorAll('.assistant-option');
    const assistantAnswerText = document.getElementById('assistantAnswerText');

    // Réponses définies pour les questions clés
    const faqResponses = {
        'q1': "Nos prestations débutent à partir de 1 000 000 FCFA pour la coordination, et 2 500 000 FCFA pour l'organisation complète. Chaque mariage étant unique, nous réalisons des devis sur-mesure détaillés.",
        'q2': "Basés à Cotonou au Bénin, nous organisons des mariages d'exception partout en Afrique (Bénin, Côte d'Ivoire, Sénégal...) ainsi qu'à l'international pour nos formules 'Destination Wedding'.",
        'q3': "Remplissez le formulaire dans la section Contact de notre site. Notre équipe vous recontactera sous 24h à 48h pour planifier un premier rendez-vous de découverte de votre projet."
    };

    const openAssistantModal = () => {
        assistantModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeAssistantModal = () => {
        assistantModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Reset state
        assistantOptions.forEach(btn => btn.classList.remove('active'));
        assistantAnswerText.textContent = "Bonjour, cliquez sur une question ci-dessus pour que je puisse vous éclairer.";
    };

    assistantFab.addEventListener('click', openAssistantModal);
    closeAssistant.addEventListener('click', closeAssistantModal);
    document.querySelector('[data-close-assistant]').addEventListener('click', closeAssistantModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && assistantModal.getAttribute('aria-hidden') === 'false') {
            closeAssistantModal();
        }
    });

    assistantOptions.forEach(button => {
        button.addEventListener('click', () => {
            assistantOptions.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const questionKey = button.dataset.question;
            assistantAnswerText.textContent = faqResponses[questionKey];
        });
    });

});


document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    // Ouvre ou ferme la fenêtre
    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.remove('hidden');
        chatToggleBtn.style.display = 'none';
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        chatToggleBtn.style.display = 'block';
    });

    // Fonction d'ajout de message à l'UI
    function addMessage(text, sender, id = null) {
        if (!text.trim()) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        if (id) messageDiv.id = id;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- LOGIQUE IA AVEC GROQ ---
    async function getAiResponse(userMessage) {
        // Remplace par ta vraie clé API Groq
        const apiKey = "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"; 
        const url = "https://api.groq.com/openai/v1/chat/completions";

        // Définition du contexte et des limites du chatbot
        const systemPrompt = `Tu es l'assistant virtuel de 'Ever After Events', une agence d'organisation de mariages de luxe. 
        Ton rôle est de répondre aux questions des clients sur nos services, de manière professionnelle, chaleureuse et concise.
        RÈGLE STRICTE : Si la question de l'utilisateur n'a absolument AUCUN rapport avec l'organisation de mariage, l'événementiel, ou notre agence, tu dois poliment lui rappeler que tu es l'assistant d'une agence de mariage et lui demander comment tu peux l'aider à planifier son événement. Ne réponds pas aux requêtes hors sujet.`;

        const payload = {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error(`Erreur HTTP: ${response.status}`);
                return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.";
            }

            const data = await response.json();
            return data.choices[0].message.content || "Désolé, je n'ai pas pu générer de réponse.";

        } catch (error) {
            console.error("Erreur API:", error);
            return "Erreur de connexion. Vérifiez votre réseau.";
        }
    }

    // Gestion de l'envoi
    async function handleSend() {
        const userText = chatInput.value;
        if (userText.trim() === '') return;

        // 1. Afficher le message de l'utilisateur
        addMessage(userText, 'user');
        chatInput.value = '';

        // 2. Afficher un indicateur de chargement
        const loadingId = 'loading-' + Date.now();
        addMessage("Rédaction en cours...", 'bot', loadingId);

        // 3. Récupérer la réponse de l'IA
        const aiResponse = await getAiResponse(userText);

        // 4. Supprimer le chargement et afficher la vraie réponse
        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) loadingMsg.remove();
        addMessage(aiResponse, 'bot');
    }

    // Déclencheurs d'envoi
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
