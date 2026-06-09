document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });
        
        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
            });
        });
    }

    // Function to render property cards into a specific track
    function renderProperties(data, trackId) {
        const track = document.getElementById(trackId);
        if (!track) return;
        
        track.innerHTML = '';
        
        data.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            
            card.innerHTML = `
                <div class="property-img-wrapper">
                    <img src="${prop.image}" alt="${prop.title}" class="property-img" onerror="this.src='https://via.placeholder.com/400x300?text=Valant+Inmobiliaria'">
                    <span class="property-badge">${prop.operation.toUpperCase()}</span>
                </div>
                <div class="property-details">
                    <div class="property-price">${prop.price}</div>
                    <h3 class="property-title">${prop.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i> ${prop.location}
                    </div>
                    <div class="property-features">
                        ${prop.bedrooms > 0 ? `<div class="feature"><i class="fas fa-bed"></i> ${prop.bedrooms} Hab.</div>` : ''}
                        ${prop.bathrooms > 0 ? `<div class="feature"><i class="fas fa-bath"></i> ${prop.bathrooms} Baños</div>` : ''}
                        <div class="feature"><i class="fas fa-ruler-combined"></i> ${prop.area}</div>
                    </div>
                    <button class="btn btn-outline" style="width: 100%; display: block; margin-top: 10px;" onclick="openPropertyModal('${prop.id}')">Ver más</button>
                </div>
            `;
            
            track.appendChild(card);
        });
    }

    // Modal Logic
    const modal = document.getElementById('property-modal');
    const closeBtn = document.getElementById('modal-close');

    window.openPropertyModal = function(id) {
        const prop = properties.find(p => p.id == id);
        if (!prop) return;

        // Populate info
        document.getElementById('modal-price').textContent = prop.price;
        document.getElementById('modal-title').textContent = prop.title;
        document.getElementById('modal-location').textContent = prop.location;
        document.getElementById('modal-desc').textContent = prop.description;
        document.getElementById('modal-badge').textContent = prop.operation.toUpperCase();

        // Features
        const featuresEl = document.getElementById('modal-features');
        featuresEl.innerHTML = '';
        if (prop.bedrooms > 0) featuresEl.innerHTML += `<div class="feature"><i class="fas fa-bed"></i> ${prop.bedrooms} Hab.</div>`;
        if (prop.bathrooms > 0) featuresEl.innerHTML += `<div class="feature"><i class="fas fa-bath"></i> ${prop.bathrooms} Baños</div>`;
        featuresEl.innerHTML += `<div class="feature"><i class="fas fa-ruler-combined"></i> ${prop.area}</div>`;

        // Advisor Links
        const wMsg = encodeURIComponent(`Hola, me interesa la propiedad: ${prop.title} (${prop.location})`);
        document.getElementById('btn-agustin').href = `https://wa.me/5493765251886?text=${wMsg}`;
        document.getElementById('btn-fabricio').href = `https://wa.me/5493764815607?text=${wMsg}`;

        // Gallery
        const mainImg = document.getElementById('modal-img-main');
        const thumbnailsEl = document.getElementById('modal-thumbnails');
        
        const imgs = prop.images && prop.images.length > 0 ? prop.images : [prop.image];
        mainImg.src = imgs[0];
        
        thumbnailsEl.innerHTML = '';
        if (imgs.length > 1) {
            imgs.forEach((imgSrc, idx) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.className = 'thumb-img' + (idx === 0 ? ' active' : '');
                thumb.onclick = function() {
                    mainImg.src = imgSrc;
                    document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                };
                thumbnailsEl.appendChild(thumb);
            });
        }

        // Map
        const mapContainer = document.getElementById('modal-map-container');
        if (mapContainer) {
            // using the mapQuery or location property as search query for google maps embed
            const query = encodeURIComponent(prop.mapQuery || prop.location);
            mapContainer.innerHTML = `
                <iframe src="https://www.google.com/maps?q=${query}&output=embed" width="100%" height="300" style="border:0; border-radius: var(--border-radius-sm); margin-top: 15px; box-shadow: var(--shadow-soft);" allowfullscreen="" loading="lazy"></iframe>
                <a href="https://www.google.com/maps/search/?api=1&query=${query}" target="_blank" style="display: inline-block; margin-top: 10px; color: var(--primary-color); font-weight: 600; text-decoration: none;"><i class="fas fa-map-marker-alt"></i> Abrir en Google Maps</a>
            `;
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling behind
    };

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Initial render for Carousels
    if (typeof properties !== 'undefined') {
        const ventaProps = properties.filter(p => p.operation === 'venta' && p.type !== 'terreno');
        const alquilerProps = properties.filter(p => p.operation === 'alquiler' && p.type !== 'terreno');
        const terrenosProps = properties.filter(p => p.type === 'terreno');

        renderProperties(ventaProps, 'track-venta');
        renderProperties(alquilerProps, 'track-alquiler');
        renderProperties(terrenosProps, 'track-terrenos');
    }

    // Carousel logic
    const wrappers = document.querySelectorAll('.carousel-wrapper');
    wrappers.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');

        if (track && prevBtn && nextBtn) {
            const scrollAmount = 350; // Width of card + gap

            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
