const map = L.map('map').setView([-34.6037, -58.3816], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const modalOverlay = document.getElementById('modal-overlay');
const reportForm = document.getElementById('report-form');
const cancelBtn = document.getElementById('cancel-btn');
const descriptionInput = document.getElementById('description');
const severitySelect = document.getElementById('severity');

let pendingLatLng = null;
let pendingPhoto = null;

let userCity = null;
let cityCircle = null;

const severityColors = {
    bajo: '#f1c40f',
    medio: '#e67e22',
    alto: '#e74c3c'
};

const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photo-preview');
const previewImg = document.getElementById('preview-img');
const galleryBtn = document.getElementById('gallery-btn');
const cameraBtn = document.getElementById('camera-btn');

galleryBtn.addEventListener('click', function() {
    photoInput.removeAttribute('capture');
    photoInput.click();
});

cameraBtn.addEventListener('click', function() {
    photoInput.setAttribute('capture', 'environment');
    photoInput.click();
});

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

function reportPopup(report) {
    const photoHtml = report.photo
        ? `<img src="${report.photo}" class="latest-photo" onclick="window.open('${report.photo}','_blank')">`
        : '<em>Sin foto</em>';
    return `
        <strong>Bache - ${report.severity.toUpperCase()}</strong><br>
        ${photoHtml}
        ${report.description}<br>
        <small>${report.date}</small>
    `;
}

function fetchReports() {
    return fetch('reportes.php')
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

function loadMarkers() {
    fetchReports().then(function(reports) {
        reports.forEach(function(report) {
            const color = severityColors[report.severity] || '#3498db';
            L.marker([report.lat, report.lng], { icon: createIcon(color) })
                .addTo(map)
                .bindPopup(reportPopup(report));
        });
    }).catch(function() {});
}

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const locateBtn = document.getElementById('locate-btn');
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
    if (!e.target.closest('.navbar-search')) {
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

    fetch('reportes.php', {
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
            const color = severityColors[severity] || '#3498db';
            L.marker([report.lat, report.lng], { icon: createIcon(color) })
                .addTo(map)
                .bindPopup(reportPopup(report))
                .openPopup();

            modalOverlay.classList.add('hidden');
            pendingLatLng = null;
            pendingPhoto = null;
        })
        .catch(function() {
            showStatus('No se pudo guardar el reporte.', 'error');
        });
});

loadMarkers();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.flyTo([lat, lng], 13);
        reverseGeocode(lat, lng);
    }, function() {}, { timeout: 8000 });
}
