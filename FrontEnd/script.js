const map = L.map('map').setView([-38.9522, -68.0593], 13);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Map data © OpenStreetMap contributors, Esri',
    maxZoom: 19
}).addTo(map);

// Animaciones para los botones del header
document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// Efecto visual al hacer clic en "Mi ubicación"
const btnUbicacion = document.getElementById('btnUbicacion');
if (btnUbicacion) {
    btnUbicacion.addEventListener('click', () => {
        btnUbicacion.style.transform = 'scale(0.95)';
        btnUbicacion.style.backgroundColor = '#D35400';
        setTimeout(() => {
            btnUbicacion.style.transform = 'scale(1)';
            btnUbicacion.style.backgroundColor = 'var(--accent)';
        }, 150);
    });
}

const modalOverlay = document.getElementById('modal-overlay');
const reportForm = document.getElementById('report-form');
const cancelBtn = document.getElementById('cancel-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
const descriptionInput = document.getElementById('description');
const severitySelect = document.getElementById('severity');

let pendingLatLng = null;
let pendingPhoto = null;

let userCity = null;
let cityCircle = null;

const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photo-preview');
const previewImg = document.getElementById('preview-img');
const galleryBtn = document.getElementById('gallery-btn');
const cameraBtn = document.getElementById('camera-btn');

if (galleryBtn) {
    galleryBtn.addEventListener('click', function() {
        photoInput.removeAttribute('capture');
        photoInput.click();
    });
}

if (cameraBtn) {
    cameraBtn.addEventListener('click', function() {
        photoInput.setAttribute('capture', 'environment');
        photoInput.click();
    });
}

if (photoInput) {
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('La imagen es muy grande. Máximo 10MB.');
            photoInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(ev) {
            pendingPhoto = ev.target.result;
            previewImg.src = pendingPhoto;
            photoPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });
}

// ================= MAPA DE CALOR =================
// Solo se muestra dónde hay reportes: la API devuelve únicamente coordenadas [lat, lng].

let heatPoints = [];

const heatLayer = L.heatLayer([], {
    radius: 30,
    blur: 20,
    // maxZoom bajo = cada reporte pesa lo mismo en cualquier zoom (si no, se desvanecen al alejar)
    maxZoom: 10,
    // Cantidad de reportes superpuestos para llegar al color más intenso
    max: 5,
    minOpacity: 0.45,
    gradient: {
        0.2: '#FDE68A',
        0.45: '#F5B041',
        0.65: '#E67E22',
        0.85: '#E74C3C',
        1.0: '#922B21'
    }
}).addTo(map);

const HeatLegend = L.Control.extend({
    options: { position: 'bottomright' },
    onAdd: function() {
        const div = L.DomUtil.create('div', 'heat-legend');
        div.innerHTML = `
            <div class="heat-legend-title">Concentración de reportes</div>
            <div class="heat-legend-bar"></div>
            <div class="heat-legend-labels"><span>Menos</span><span>Más</span></div>
            <div class="heat-legend-count" id="heat-count">Cargando…</div>
        `;
        return div;
    }
});
new HeatLegend().addTo(map);

function updateHeatCount() {
    const el = document.getElementById('heat-count');
    if (!el) return;
    const n = heatPoints.length;
    el.textContent = n === 0 ? 'Todavía no hay reportes' : n + (n === 1 ? ' reporte' : ' reportes');
}

function fetchReports() {
    return fetch('/api/reportes')
        .then(function(res) { return res.json(); });
}

function createIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 24px; height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

function loadHeatmap() {
    fetchReports().then(function(points) {
        heatPoints = Array.isArray(points) ? points : [];
        heatLayer.setLatLngs(heatPoints);
        updateHeatCount();
    }).catch(function() {
        const el = document.getElementById('heat-count');
        if (el) el.textContent = 'No se pudieron cargar los reportes';
    });
}

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const locateBtn = document.getElementById('btnUbicacion');
const statusBar = document.getElementById('status-bar');

let searchTimer = null;
let geocodeAbort = null;

function showStatus(message, type, duration) {
    statusBar.textContent = message;
    statusBar.className = 'status-bar ' + (type || '');
    setTimeout(function() {
        statusBar.className = 'status-bar hidden';
    }, duration || 4000);
}

function searchPlaces(query) {
    if (geocodeAbort) geocodeAbort.abort();
    geocodeAbort = new AbortController();

    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=6&accept-language=es', {
        signal: geocodeAbort.signal
    })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            searchResults.innerHTML = '';
            data.forEach(function(item) {
                const div = document.createElement('div');
                div.className = 'search-item';
                div.textContent = item.display_name;
                div.addEventListener('click', function() {
                    map.flyTo([parseFloat(item.lat), parseFloat(item.lon)], 15);
                    searchInput.value = item.display_name;
                    hideResults();
                });
                searchResults.appendChild(div);
            });
            if (data.length > 0) {
                searchResults.classList.add('visible');
            } else {
                hideResults();
            }
        })
        .catch(function() {})
        .finally(function() { geocodeAbort = null; });
}

function hideResults() {
    searchResults.classList.remove('visible');
    searchResults.innerHTML = '';
}

searchInput.addEventListener('input', function() {
    clearTimeout(searchTimer);
    const query = searchInput.value.trim();
    if (query.length < 3) {
        hideResults();
        return;
    }
    searchTimer = setTimeout(function() { searchPlaces(query); }, 400);
});

searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideResults();
        searchInput.blur();
    }
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-bar')) {
        hideResults();
    }
});

function setUserCity(lat, lng, cityName) {
    userCity = { lat: lat, lng: lng, name: cityName };
    if (cityCircle) map.removeLayer(cityCircle);
    cityCircle = L.circle([lat, lng], {
        radius: 10000,
        color: '#e74c3c',
        fillColor: '#e74c3c',
        fillOpacity: 0.05
    }).addTo(map);
    showStatus('Solo se pueden reportar baches en ' + cityName + '.', 'success', 5000);
}

function reverseGeocode(lat, lng) {
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&accept-language=es&zoom=10')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            const cityName = data.address.city || data.address.town || data.address.village ||
                data.address.municipality || data.address.state || 'tu ciudad';
            setUserCity(lat, lng, cityName);
        })
        .catch(function() {
            setUserCity(lat, lng, 'tu ciudad');
        });
}

locateBtn.addEventListener('click', function() {
    if (!navigator.geolocation) {
        showStatus('Tu navegador no soporta geolocalización.', 'error');
        return;
    }
    showStatus('Solicitando tu ubicación...', '');
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.flyTo([lat, lng], 14);

        L.marker([lat, lng], { icon: createIcon('#3498db') })
            .addTo(map)
            .bindPopup('<strong>Tu ubicación</strong>')
            .openPopup();

        reverseGeocode(lat, lng);
    }, function() {
        showStatus('No se pudo obtener tu ubicación. Revisa los permisos.', 'error');
    });
});

map.on('click', function(e) {
    if (userCity) {
        const distance = map.distance([userCity.lat, userCity.lng], [e.latlng.lat, e.latlng.lng]);
        if (distance > 10000) {
            showStatus('El punto está fuera de ' + userCity.name + '. Solo se pueden marcar baches dentro de tu ciudad.', 'error');
            return;
        }
    }

    pendingLatLng = e.latlng;
    modalOverlay.classList.remove('hidden');
    descriptionInput.value = '';
    severitySelect.value = '';
    photoInput.value = '';
    photoPreview.classList.add('hidden');
    pendingPhoto = null;
    descriptionInput.focus();
});

cancelBtn.addEventListener('click', function() {
    modalOverlay.classList.add('hidden');
    pendingLatLng = null;
    pendingPhoto = null;
});

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function() {
        modalOverlay.classList.add('hidden');
        pendingLatLng = null;
        pendingPhoto = null;
    });
}

modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
        pendingLatLng = null;
        pendingPhoto = null;
    }
});

reportForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const severity = severitySelect.value;

    if (!description || !severity || !pendingLatLng) return;

    const report = {
        lat: pendingLatLng.lat,
        lng: pendingLatLng.lng,
        description: description,
        severity: severity,
        photo: pendingPhoto,
        date: new Date().toLocaleString('es-AR')
    };

    fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
    })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.error) {
                showStatus(result.error, 'error');
                return;
            }
            heatPoints.push([report.lat, report.lng]);
            heatLayer.setLatLngs(heatPoints);
            updateHeatCount();
            showStatus('¡Gracias! Tu reporte fue registrado.', 'success');

            modalOverlay.classList.add('hidden');
            pendingLatLng = null;
            pendingPhoto = null;
        })
        .catch(function() {
            showStatus('No se pudo guardar el reporte.', 'error');
        });
});

loadHeatmap();