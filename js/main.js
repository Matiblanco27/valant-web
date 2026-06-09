document.addEventListener('DOMContentLoaded', () => {
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
                    <a href="https://wa.me/5493765251886?text=Hola,%20me%20interesa%20la%20propiedad%20${prop.title}" target="_blank" class="btn btn-outline" style="width: 100%; display: block; margin-top: 10px;">Consultar</a>
                </div>
            `;
            
            track.appendChild(card);
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
