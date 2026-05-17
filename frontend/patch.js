const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Add keyframes
if (!html.includes('@keyframes spin')) {
    html = html.replace('</style>', `    @keyframes spin { to { transform: rotate(360deg); } }\n    </style>`);
}

// Add error banner
if (!html.includes('errorBanner')) {
    html = html.replace('<body>\r\n\r\n    <!-- NAV -->', `<body>\n\n    <div id="errorBanner" style="display:none;background:#ef4444;color:#fff;text-align:center;padding:12px;font-family:'DM Sans',sans-serif;font-size:14px;position:sticky;top:58px;z-index:90;">\n        ⚠️ Could not connect to server. Please run: cd backend && npm start\n    </div>\n\n    <!-- NAV -->`);
    // Fallback if the \r\n doesn't match
    html = html.replace('<body>\n\n    <!-- NAV -->', `<body>\n\n    <div id="errorBanner" style="display:none;background:#ef4444;color:#fff;text-align:center;padding:12px;font-family:'DM Sans',sans-serif;font-size:14px;position:sticky;top:58px;z-index:90;">\n        ⚠️ Could not connect to server. Please run: cd backend && npm start\n    </div>\n\n    <!-- NAV -->`);
    html = html.replace('<body>\n    <!-- NAV -->', `<body>\n\n    <div id="errorBanner" style="display:none;background:#ef4444;color:#fff;text-align:center;padding:12px;font-family:'DM Sans',sans-serif;font-size:14px;position:sticky;top:58px;z-index:90;">\n        ⚠️ Could not connect to server. Please run: cd backend && npm start\n    </div>\n\n    <!-- NAV -->`);
}

const newScript = `<script>
        /* ══════════════════════════════════════════════════
           STATE
        ══════════════════════════════════════════════════ */
        let PLACES = [];
        let currentFilter = 'all';
        let currentSearch = '';
        let selectedSlot = null;
        let currentAmenityForBooking = null;
        let currentPlaceIdForBooking = null;

        /* ══════════════════════════════════════════════════
           HELPERS
        ══════════════════════════════════════════════════ */
        const ccol = c => c === 'low' ? 'var(--green)' : c === 'moderate' ? 'var(--yellow)' : 'var(--red)';
        const cclass = c => c === 'low' ? 'cb-low' : c === 'moderate' ? 'cb-mod' : 'cb-high';
        const clabel = c => c === 'low' ? 'Low Crowd' : c === 'moderate' ? 'Moderate' : 'High Crowd';
        const catbg = cat => ({ beach: 'rgba(20,184,166,.12)', heritage: 'rgba(167,139,250,.12)', nature: 'rgba(34,197,94,.12)' })[cat] || 'rgba(255,255,255,.04)';

        function toast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg; t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        function showErrorBanner(show) {
            const eb = document.getElementById('errorBanner');
            if (eb) eb.style.display = show ? 'block' : 'none';
        }

        /* ══════════════════════════════════════════════════
           API CALLS
        ══════════════════════════════════════════════════ */
        const API_BASE = '/api'; // Use relative path to work with the proxy/static serving

        async function fetchPlaces(isPolling = false) {
            const grid = document.getElementById('placesGrid');
            if (!isPolling && grid) {
                grid.innerHTML = '<div style="color:var(--muted);grid-column:1/-1;padding:40px;text-align:center;font-size:15px"><div style="display:inline-block;width:24px;height:24px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite;margin-bottom:10px;"></div><br>Loading live data...</div>';
            }
            try {
                let url = \`\${API_BASE}/places\`;
                const params = new URLSearchParams();
                if (currentSearch) params.append('search', currentSearch);
                if (currentFilter !== 'all') params.append('category', currentFilter);
                if (params.toString()) url += \`?\${params.toString()}\`;

                const res = await fetch(url);
                if (!res.ok) throw new Error('API Error');
                const json = await res.json();
                PLACES = json.data || [];
                renderCards(PLACES);
                showErrorBanner(false);
            } catch (err) {
                console.error(err);
                if (!isPolling && grid) grid.innerHTML = '<div style="color:var(--red);grid-column:1/-1;padding:40px;text-align:center;">Failed to load data.</div>';
                showErrorBanner(true);
            }
        }

        async function fetchStats() {
            try {
                const res = await fetch(\`\${API_BASE}/stats\`);
                if (!res.ok) throw new Error('API Error');
                const json = await res.json();
                const d = json.data;
                document.getElementById('statLow').textContent = d.low;
                document.getElementById('statHigh').textContent = d.high;
                
                // Update average wait time tile (the 4th stat pill)
                const statPills = document.querySelectorAll('.stat-pill');
                if(statPills.length >= 4) {
                    const waitEl = statPills[3].querySelector('.spv');
                    if (waitEl) waitEl.textContent = d.avgWait + 'm';
                }

                showErrorBanner(false);
            } catch (err) {
                console.error(err);
            }
        }

        async function fetchPlaceDetails(id) {
            try {
                const res = await fetch(\`\${API_BASE}/places/\${id}\`);
                if (!res.ok) throw new Error('API Error');
                const json = await res.json();
                const p = json.data;
                
                // If crowd is high, fetch alternatives
                let alts = [];
                if (p.crowd === 'high') {
                    const resAlts = await fetch(\`\${API_BASE}/places/\${id}/alternatives\`);
                    if (resAlts.ok) {
                        const jsonAlts = await resAlts.json();
                        alts = jsonAlts.data || [];
                    }
                }
                
                renderPlaceDetails(p, alts);
            } catch (err) {
                console.error(err);
                toast('⚠️ Failed to load place details');
            }
        }

        async function apiCreateBooking(data) {
            try {
                const res = await fetch(\`\${API_BASE}/bookings\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('API Error');
                const json = await res.json();
                toast('✅ ' + json.message);
                return true;
            } catch (err) {
                console.error(err);
                toast('❌ Failed to create booking');
                return false;
            }
        }

        /* ══════════════════════════════════════════════════
           SCREEN ROUTING
        ══════════════════════════════════════════════════ */
        function showScreen(id, btn) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('screen-' + id).classList.add('active');
            if (btn) {
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
            }
            if (id === 'map-page') renderMap();
            if (id === 'amenities-page') renderAllAmenities('all');
            if (id === 'gallery-page') renderGalleryPage();
        }

        function goBack() {
            showScreen('dashboard');
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelector('.nav-tab').classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /* ══════════════════════════════════════════════════
           DASHBOARD — CARDS
        ══════════════════════════════════════════════════ */
        function renderCards(list) {
            const grid = document.getElementById('placesGrid');
            if (!grid) return;
            if (!list.length) {
                grid.innerHTML = '<div style="color:var(--muted);grid-column:1/-1;padding:40px;text-align:center;font-size:15px">No destinations match your search.</div>';
                return;
            }
            grid.innerHTML = list.map((p, i) => \`
    <div class="place-card" onclick="openDetailPage(\${p.id})" style="animation-delay:\${i * .05}s">
      <div class="card-img-wrap" style="background:\${catbg(p.category)}">
        <img src="\${p.hero}" alt="\${p.name}" loading="lazy" onerror="this.style.display='none'">
        <div class="card-img-overlay"></div>
        <div class="card-crowd-badge"><div class="cbadge \${cclass(p.crowd)}">\${clabel(p.crowd)}</div></div>
      </div>
      <div class="card-body">
        <div class="card-name">\${p.emoji} \${p.name}</div>
        <div class="card-meta">📍 \${p.region} · ⭐ \${p.rating} · \${p.type}</div>
        <div class="card-row">
          <div class="cs">Wait: <strong>\${p.wait}</strong></div>
          <div class="cs">Best: <strong>\${p.best}</strong></div>
        </div>
        <div class="prog-bg"><div class="prog-fill" style="width:\${p.crowdPct}%;background:\${ccol(p.crowd)}"></div></div>
      </div>
    </div>
  \`).join('');
        }

        function setFilter(f, el) {
            currentFilter = f;
            document.querySelectorAll('.filter-bar .chip').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            fetchPlaces();
        }
        function handleSearch(q) { 
            currentSearch = q.toLowerCase().trim(); 
            fetchPlaces(); 
        }

        /* ══════════════════════════════════════════════════
           DETAIL PAGE
        ══════════════════════════════════════════════════ */
        const HOURS = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am', '2am', '4am'];

        function openDetailPage(id) {
            // Show a loading state or just wait for fetch
            document.getElementById('d-hero-img').src = '';
            document.getElementById('d-title').innerHTML = '<div style="display:inline-block;width:24px;height:24px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite;margin-right:10px;"></div>Loading...';
            document.getElementById('d-subtitle').textContent = '';
            
            // show detail screen immediately for better UX
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('screen-detail').classList.add('active');
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            window.scrollTo({ top: 0, behavior: 'smooth' });

            fetchPlaceDetails(id);
        }

        function renderPlaceDetails(p, alts) {
            if (!p) return;

            // hero
            document.getElementById('d-hero-img').src = p.hero;
            document.getElementById('d-hero-img').alt = p.name;
            document.getElementById('d-title').textContent = p.emoji + ' ' + p.name;
            document.getElementById('d-subtitle').textContent = p.desc;

            // info tiles
            document.getElementById('d-info-grid').innerHTML = \`
    <div class="info-tile"><div class="info-tile-label">Crowd Level</div><div class="info-tile-val" style="color:\${ccol(p.crowd)}">\${clabel(p.crowd)}</div></div>
    <div class="info-tile"><div class="info-tile-label">Crowd %</div><div class="info-tile-val">\${p.crowdPct}%</div></div>
    <div class="info-tile"><div class="info-tile-label">Avg Wait</div><div class="info-tile-val">\${p.wait}</div></div>
    <div class="info-tile"><div class="info-tile-label">Best Time</div><div class="info-tile-val" style="font-size:15px">\${p.best}</div></div>
    <div class="info-tile"><div class="info-tile-label">Rating</div><div class="info-tile-val">⭐ \${p.rating}</div></div>
    <div class="info-tile"><div class="info-tile-label">Type</div><div class="info-tile-val" style="font-size:13px">\${p.type}</div></div>
  \`;

            // bars
            const mx = Math.max(...p.forecast);
            document.getElementById('d-bars').innerHTML = p.forecast.map((v, i) => {
                const h = Math.max(5, Math.round((v / mx) * 72));
                const col = v < 40 ? 'var(--green)' : v < 70 ? 'var(--yellow)' : 'var(--red)';
                return \`<div class="barcol"><div class="barrect" style="height:\${h}px;background:\${col}"></div><div class="barlabel">\${HOURS[i]}</div></div>\`;
            }).join('');

            // alternatives
            const heading = document.getElementById('d-alts-heading');
            const altsList = document.getElementById('d-alts-list');
            if (p.crowd === 'high' && alts.length > 0) {
                heading.innerHTML = '<span style="color:var(--red)">⚠️</span> Crowd is high — try these less crowded alternatives:';
                altsList.innerHTML = alts.map(a => \`
      <div class="alt-row" onclick="openDetailPage(\${a.id})">
        <div><div class="alt-name">\${a.emoji} \${a.name}</div><div class="alt-region">📍 \${a.region}</div></div>
        <div class="cbadge \${cclass(a.crowd)}">\${clabel(a.crowd)}</div>
      </div>
    \`).join('');
                document.getElementById('d-alts-section').style.display = 'block';
            } else {
                document.getElementById('d-alts-section').style.display = 'none';
            }

            // hotels
            document.getElementById('d-hotels').innerHTML = p.hotels.map(h => \`
    <div class="amenity-card">
      \${h.img ? \`<img class="ac-img" src="\${h.img}" alt="\${h.name}" loading="lazy" onerror="this.style.display='none'">\` : ''}
      <div class="ac-body">
        <div class="ac-name">\${h.name}</div>
        <div class="ac-meta">📍 \${h.dist} · \${h.price}</div>
        <div class="ac-tags">\${h.tags.map(t => \`<span class="actag">\${t}</span>\`).join('')}</div>
        <div class="ac-rating">★ \${h.rating} <span style="color:var(--muted);font-size:11px">Rating</span></div>
        <button class="avail-btn" style="margin-top:10px;width:100%;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.25);color:var(--accent2);border-radius:9px;padding:8px;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .2s" onclick="bookHotel('\${h.name}', \${p.id})">Check Availability →</button>
      </div>
    </div>
  \`).join('');

            // restaurants
            document.getElementById('d-restaurants').innerHTML = p.restaurants.map(r => \`
    <div class="amenity-card">
      \${r.img ? \`<img class="ac-img" src="\${r.img}" alt="\${r.name}" loading="lazy">\` : \`<div class="ac-img-placeholder">\${r.emoji || '🍽️'}</div>\`}
      <div class="ac-body">
        <div class="ac-name">\${r.name}</div>
        <div class="ac-meta">\${r.cuisine} · \${r.dist}</div>
        <div class="ac-tags">\${r.tags.map(t => \`<span class="actag">\${t}</span>\`).join('')}</div>
        <div class="ac-rating">★ \${r.rating}</div>
      </div>
    </div>
  \`).join('');

            // shops
            document.getElementById('d-shops').innerHTML = p.shops.map(s => \`
    <div class="amenity-card">
      <div class="ac-img-placeholder">\${s.emoji}</div>
      <div class="ac-body">
        <div class="ac-name">\${s.name}</div>
        <div class="ac-meta">\${s.dist}</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:7px;line-height:1.4">\${s.desc}</div>
        <div class="ac-rating">★ \${s.rating}</div>
      </div>
    </div>
  \`).join('');

            // POIs
            document.getElementById('d-pois').innerHTML = p.pois.map(poi => \`
    <div class="poi-card">
      <div class="poi-icon">\${poi.icon}</div>
      <div><div class="poi-name">\${poi.name}</div><div class="poi-desc">\${poi.desc}</div></div>
    </div>
  \`).join('');

            // gallery
            document.getElementById('d-gallery').innerHTML = p.gallery.map(url => \`
    <div class="gallery-thumb">
      <img src="\${url}" alt="Gallery" loading="lazy" onerror="this.parentElement.style.display='none'">
    </div>
  \`).join('');

            // map
            document.getElementById('d-map-text').textContent = p.mapText;
            document.getElementById('d-map-link').href = p.mapLink;
        }

        function bookHotel(name, placeId) {
            openModal(name, placeId);
        }

        /* ══════════════════════════════════════════════════
           MAP
        ══════════════════════════════════════════════════ */
        const MAP_NODES = [
            { id: 1, name: 'Marina Beach', x: 590, y: 195, crowd: 'low' },
            { id: 2, name: 'Kapaleeshwarar', x: 570, y: 215, crowd: 'high' },
            { id: 3, name: 'Mahabalipuram', x: 595, y: 290, crowd: 'moderate' },
            { id: 7, name: 'Meenakshi Temple', x: 220, y: 330, crowd: 'high' },
            { id: 4, name: 'Ooty Garden', x: 108, y: 148, crowd: 'moderate' },
            { id: 6, name: 'Kodaikanal', x: 190, y: 268, crowd: 'moderate' },
            { id: 11, name: 'Rameswaram', x: 305, y: 388, crowd: 'high' },
            { id: 10, name: 'Yercaud', x: 248, y: 168, crowd: 'low' },
            { id: 9, name: 'Vedanthangal', x: 500, y: 265, crowd: 'low' },
            { id: 8, name: 'Covelong', x: 598, y: 252, crowd: 'low' },
            { id: 5, name: "Elliot's Beach", x: 582, y: 235, crowd: 'low' },
            { id: 12, name: 'Pichavaram', x: 448, y: 308, crowd: 'low' },
        ];
        function renderMap() {
            const svg = document.getElementById('mapSvg');
            const cm = { low: '#22c55e', moderate: '#f59e0b', high: '#ef4444' };
            let h = \`<rect width="700" height="440" fill="#0d1a2e"/>
    <defs><pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0L0 0 0 30" fill="none" stroke="rgba(255,255,255,.035)" stroke-width=".5"/></pattern></defs>
    <rect width="700" height="440" fill="url(#g)"/>
    <text x="18" y="30" font-size="13" fill="rgba(255,255,255,.22)" font-family="DM Sans,sans-serif" font-weight="500">Tamil Nadu — Click a node to view details</text>\`;
            MAP_NODES.forEach(n => {
                const p = PLACES.find(x => x.id === n.id);
                const c = cm[p ? p.crowd : n.crowd];
                const lbl = n.name.length > 13 ? n.name.slice(0, 12) + '…' : n.name;
                h += \`<g style="cursor:pointer" onclick="openDetailPage(\${n.id})">
      <circle cx="\${n.x}" cy="\${n.y}" r="30" fill="\${c}" opacity=".08"/>
      <circle cx="\${n.x}" cy="\${n.y}" r="17" fill="\${c}" opacity=".2"/>
      <circle cx="\${n.x}" cy="\${n.y}" r="9" fill="\${c}" opacity=".9"/>
      <text x="\${n.x}" y="\${n.y + 24}" text-anchor="middle" font-size="10.5" fill="rgba(255,255,255,.7)" font-family="DM Sans,sans-serif">\${lbl}</text>
    </g>\`;
            });
            svg.innerHTML = h;
        }

        /* ══════════════════════════════════════════════════
           ALL AMENITIES PAGE
        ══════════════════════════════════════════════════ */
        function renderAllAmenities(type) {
            try {
                const grid = document.getElementById('allAmenitiesGrid');

                const all = [];
                PLACES.forEach(p => {
                    p.hotels.forEach(h => all.push({ ...h, ptype: 'hotel', place: p.name }));
                    p.restaurants.forEach(r => all.push({ ...r, ptype: 'restaurant', place: p.name }));
                    p.shops.forEach(s => all.push({ ...s, ptype: 'shopping', place: p.name, rating: s.rating || 4.0, tags: s.tags || [] }));
                });
                const filtered = type === 'all' ? all : all.filter(a => a.ptype === type);
                
                grid.innerHTML = filtered.slice(0, 24).map(a => \`
        <div class="amenity-card" style="background:var(--s1)">
          \${a.img ? \`<img class="ac-img" src="\${a.img}" alt="\${a.name}" loading="lazy" onerror="this.style.display='none'">\` : \`<div class="ac-img-placeholder">\${a.emoji || '🏪'}</div>\`}
          <div class="ac-body">
            <div class="ac-name">\${a.name}</div>
            <div class="ac-meta" style="color:var(--muted);font-size:12px">📍 \${a.place} · \${a.dist || 'Nearby'}</div>
            <div class="ac-tags">\${(a.tags || []).slice(0, 3).map(t => \`<span class="actag">\${t}</span>\`).join('')}</div>
            <div class="ac-rating" style="display:flex;align-items:center;gap:5px;font-size:12px;color:var(--yellow)">★ \${a.rating}</div>
          </div>
        </div>
      \`).join('');
            } catch (err) {
                console.error(err);
            }
        }

        /* ══════════════════════════════════════════════════
           GALLERY PAGE
        ══════════════════════════════════════════════════ */
        function renderGalleryPage() {
            const grid = document.getElementById('galleryPageGrid');
            const items = [];
            PLACES.forEach(p => p.gallery.forEach(url => items.push({ url, place: p.name, emoji: p.emoji })));
            grid.innerHTML = items.map(item => \`
    <div style="border-radius:12px;overflow:hidden;background:var(--s1);border:1px solid var(--border);transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform=''">
      <div style="height:130px;overflow:hidden;background:var(--s2)">
        <img src="\${item.url}" alt="\${item.place}" loading="lazy" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.display='none'">
      </div>
      <div style="padding:10px 12px">
        <div style="font-family:'Syne',sans-serif;font-weight:600;font-size:13px">\${item.emoji} \${item.place}</div>
      </div>
    </div>
  \`).join('');
        }

        /* ══════════════════════════════════════════════════
           BOOKING MODAL
        ══════════════════════════════════════════════════ */
        const GENERIC_SLOTS = ['9am', '11am', '1pm', '3pm', '5pm', '7pm'];
        function openModal(amenityName, placeId) {
            currentAmenityForBooking = amenityName;
            currentPlaceIdForBooking = placeId;
            selectedSlot = null;
            document.getElementById('modal-title').textContent = amenityName;
            document.getElementById('modal-desc').textContent = 'Select a time slot for your reservation:';
            document.getElementById('modal-slots').innerHTML = GENERIC_SLOTS.map(s => \`
    <div class="slot-btn" onclick="pickSlot(this,'\${s}')">\${s}</div>
  \`).join('');
            document.getElementById('modalOverlay').classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function pickSlot(el, s) {
            document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('chosen'));
            el.classList.add('chosen');
            selectedSlot = s;
        }
        async function confirmBooking() {
            if (!selectedSlot) { toast('⚠️ Please select a time slot'); return; }
            
            const btn = document.querySelector('.btn-confirm');
            const oldText = btn.textContent;
            btn.textContent = 'Confirming...';
            btn.disabled = true;

            const success = await apiCreateBooking({
                placeId: currentPlaceIdForBooking || 1,
                amenityName: currentAmenityForBooking,
                amenityType: 'hotel',
                slot: selectedSlot,
                userName: 'Guest',
                userEmail: 'guest@example.com'
            });

            btn.textContent = oldText;
            btn.disabled = false;

            if (success) {
                closeModal();
            }
        }
        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('open');
            document.body.style.overflow = '';
        }
        function handleOverlayClick(e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); }

        /* ══════════════════════════════════════════════════
           KEYBOARD
        ══════════════════════════════════════════════════ */
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') { closeModal(); }
        });

        /* ══════════════════════════════════════════════════
           INIT
        ══════════════════════════════════════════════════ */
        fetchPlaces();
        fetchStats();
        setInterval(() => {
            fetchPlaces(true);
            fetchStats();
        }, 30000);
</script>`;

html = html.replace(/<script>[\s\S]*?<\/script>/, newScript);

fs.writeFileSync(filePath, html);
console.log("Successfully patched index.html");
