document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    });

    // --- On-Scroll Animations (AOS) ---
    const aosElements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    aosElements.forEach(el => observer.observe(el));

    // --- Portfolio Page Logic ---
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) {
        let portfolioItems = [];

        fetch('assets/data/images.json')
            .then(response => response.json())
            .then(data => {
                portfolioItems = data;
                displayPortfolioItems(portfolioItems);
            });

        const displayPortfolioItems = (items) => {
            portfolioGrid.innerHTML = '';
            items.forEach((item) => {
                const div = document.createElement('div');
                div.className = 'portfolio-item';
                div.setAttribute('data-aos', 'fade-up');
                div.innerHTML = `
                    <img src="${item.url}" alt="${item.alt}">
                    <div class="portfolio-overlay">
                        <h3>${item.title}</h3>
                    </div>
                `;
                div.addEventListener('click', () => openLightbox(item));
                portfolioGrid.appendChild(div);
            });
            document.querySelectorAll('.portfolio-item[data-aos]').forEach(el => observer.observe(el));
        };

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                
                const filteredItems = (filterValue === '*')
                    ? portfolioItems
                    : portfolioItems.filter(item => item.category === filterValue);
                
                displayPortfolioItems(filteredItems);
            });
        });
    }

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxClose = document.querySelector('.lightbox-close');

        window.openLightbox = (item) => {
            lightboxImg.src = item.url;
            lightboxTitle.textContent = item.title;
            lightbox.classList.add('show');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- AI Chatbot Logic ---
    const chatIcon = document.getElementById('chat-icon');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatBody = document.getElementById('chat-body');
    const chatOptions = document.getElementById('chat-options');
    let conversationTranscript = [];

    const conversationFlow = {
        start: {
            text: "Hello! I'm Michael's AI assistant. I can help you find the right creative service. What are you looking for today?",
            options: [
                { text: "Design", next: "design_options" },
                { text: "Photography", next: "photo_options" },
                { text: "Videography", next: "videography_options" },
                { text: "Other Services", next: "other_options" }
            ]
        },
        design_options: {
            text: "Great! What kind of design service do you need?",
            options: [
                { text: "Logo & Branding", next: "get_details" },
                { text: "Social Media", next: "get_details" },
                { text: "Marketing Materials", next: "get_details" }
            ]
        },
        photo_options: {
            text: "Excellent choice. What type of photography are you interested in?",
            options: [
                { text: "Events", next: "get_details" },
                { text: "Products", next: "get_details" },
                { text: "Portraits", next: "get_details" }
            ]
        },
        videography_options: {
            text: "Perfect. What kind of video project do you have in mind?",
            options: [
                { text: "Promotional Video", next: "get_details" },
                { text: "Event Coverage", next: "get_details" },
                { text: "Social Media Clips", next: "get_details" }
            ]
        },
        other_options: {
            text: "We offer a range of services. Which one interests you?",
            options: [
                { text: "Voice Over", next: "get_details" },
                { text: "Marketing Strategy", next: "get_details" }
            ]
        },
        get_details: {
            text: "Understood. To provide you with the best possible service and an accurate quote, could you please provide your phone number? Michael will contact you shortly to discuss the details.",
            action: "show_contact_info"
        },
        end: {
            text: "Thank you! You can also reach out directly using the methods below. To send a summary of our chat to Michael, please click the email button.",
            action: "show_final_contact"
        }
    };

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        conversationTranscript.push(`${sender.toUpperCase()}: ${text}`);
    };

    const showOptions = (options) => {
        chatOptions.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option.text;
            button.onclick = () => handleOptionClick(option);
            chatOptions.appendChild(button);
        });
    };

    const handleOptionClick = (option) => {
        addMessage(option.text, 'user');
        setTimeout(() => navigateToStep(option.next), 500);
    };

    const navigateToStep = (stepKey) => {
        const step = conversationFlow[stepKey];
        if (!step) return;

        addMessage(step.text, 'bot');
        
        if (step.options) {
            showOptions(step.options);
        } else {
            chatOptions.innerHTML = '';
        }

        if (step.action === "show_contact_info") {
            setTimeout(() => navigateToStep('end'), 1000);
        }
        
        if (step.action === "show_final_contact") {
            const contactHTML = `
                <div class="contact-info">
                    <p>Contact Michael directly:</p>
                    <div>
                        <a href="tel:01025946594" title="Call 01025946594"><i class="fas fa-phone"></i></a>
                        <a href="https://wa.me/201025946594" target="_blank" title="WhatsApp 01025946594"><i class="fab fa-whatsapp"></i></a>
                        <a href="tel:01281912441" title="Call 01281912441"><i class="fas fa-phone"></i></a>
                        <a href="https://wa.me/201281912441" target="_blank" title="WhatsApp 01281912441"><i class="fab fa-whatsapp"></i></a>
                        <a href="#" id="email-btn" title="Email Transcript"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
            `;
            chatBody.insertAdjacentHTML('beforeend', contactHTML);
            document.getElementById('email-btn').onclick = generateMailtoLink;
        }
    };
    
    const generateMailtoLink = (e) => {
        e.preventDefault();
        const subject = "New Project Inquiry from Website Chat";
        const body = "Hello Michael,\n\nHere is a summary of my conversation with your AI assistant:\n\n---\n" + conversationTranscript.join('\n') + "\n---\n\nPlease contact me at: [Please add your phone number here]\n\nBest regards,";
        const mailto = `mailto:micohelmy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    };

    if (chatIcon) {
        chatIcon.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open') && chatBody.innerHTML === '') {
                navigateToStep('start');
            }
        });

        chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));
    }
});
