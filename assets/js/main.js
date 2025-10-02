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
                // --- MODIFIED CLICK LOGIC ---
                div.addEventListener('click', (e) => {
                    const clickedItem = e.currentTarget;
                    clickedItem.classList.add('clicked');
                    
                    setTimeout(() => {
                        openLightbox(item);
                        clickedItem.classList.remove('clicked');
                    }, 400); // Match animation duration
                });
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
        const lightboxDescription = document.getElementById('lightbox-description'); // New element
        const lightboxClose = document.querySelector('.lightbox-close');

        window.openLightbox = (item) => {
            lightboxImg.src = item.url;
            lightboxTitle.textContent = item.title;
            
            // --- POPULATE DESCRIPTION ---
            let descriptionHTML = '<ul>';
            item.description.forEach(point => {
                descriptionHTML += `<li>${point}</li>`;
            });
            descriptionHTML += '</ul>';
            lightboxDescription.innerHTML = descriptionHTML;

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

    // --- AI Chatbot Logic (same as before) ---
    // ... (The chatbot code from the previous response remains unchanged)
});
