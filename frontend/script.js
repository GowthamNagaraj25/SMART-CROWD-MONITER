document.addEventListener('DOMContentLoaded', () => {
    const placesGrid = document.getElementById('placesGrid');
    const searchInput = document.getElementById('searchInput');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');

    let allPlaces = [];

    // Fetch places from backend API
    const fetchPlaces = async () => {
        try {
            const response = await fetch('/api/places');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            allPlaces = data;
            displayPlaces(allPlaces);
            loadingEl.classList.add('hidden');
        } catch (error) {
            console.error('Error fetching places:', error);
            loadingEl.classList.add('hidden');
            errorEl.classList.remove('hidden');
        }
    };

    // Display places in the grid
    const displayPlaces = (places) => {
        placesGrid.innerHTML = '';

        if (places.length === 0) {
            placesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">No places found matching your search.</p>';
            return;
        }

        places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';

            // Determine crowd badge class based on level
            let crowdClass = '';
            const level = place.crowd_level.toLowerCase();
            if (level === 'low') crowdClass = 'crowd-low';
            else if (level === 'medium') crowdClass = 'crowd-medium';
            else if (level === 'high') crowdClass = 'crowd-high';
            else crowdClass = 'crowd-medium'; // default fallback

            card.innerHTML = `
                <div class="place-header">
                    <h3>${place.name}</h3>
                    <div class="place-city">${place.city}</div>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Crowd Level</span>
                    <span class="crowd-badge ${crowdClass}">${place.crowd_level}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Best Time To Visit</span>
                    <span class="info-value">🕒 ${place.best_time}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Less Crowded Alternatives</span>
                    <span class="info-value">🔄 ${place.alternatives}</span>
                </div>
            `;

            placesGrid.appendChild(card);
        });
    };

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            const filteredPlaces = allPlaces.filter(place => 
                place.name.toLowerCase().includes(searchTerm)
            );
            
            displayPlaces(filteredPlaces);
        });
    }

    // Initialize
    if (placesGrid) {
        fetchPlaces();
    }
});
