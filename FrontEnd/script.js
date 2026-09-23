const map = L.map('map', { zoomControl: false }).setView([-38.9522, -68.0593], 13);
L.control.zoom({ position: 'topright' }).addTo(map);

// ================= MAPA BASE: NORMAL / SATÉLITE =================
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
const esriTile = servicio => ESRI + servicio + '/MapServer/tile/{z}/{y}/{x}';

// Nombres de calles y barrios: encima del mapa base pero debajo de los puntos
map.createPane('etiquetas').style.zIndex = 350;
map.getPane('etiquetas').style.pointerEvents = 'none';

const MAPAS_BASE = {
    // Gris claro: los colores de los reportes resaltan más
    normal: L.layerGroup([
        L.tileLayer(esriTile('Canvas/World_Light_Gray_Base'), {
            attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
            maxNativeZoom: 16,
            maxZoom: 19
        }),
        L.tileLayer(esriTile('Canvas/World_Light_Gray_Reference'), { maxNativeZoom: 16, maxZoom: 19, pane: 'etiquetas' })
    ]),
    satelite: L.layerGroup([
        L.tileLayer(esriTile('World_Imagery'), {
            attribution: 'Imágenes &copy; Esri &mdash; Maxar, Earthstar Geographics',
            maxNativeZoom: 18,
            maxZoom: 19
        }),
        L.tileLayer(esriTile('Reference/World_Transportation'), { maxNativeZoom: 18, maxZoom: 19, pane: 'etiquetas', opacity: 0.8 }),
        L.tileLayer(esriTile('Reference/World_Boundaries_and_Places'), { maxNativeZoom: 18, maxZoom: 19, pane: 'etiquetas' })
    ])
};

let mapaBase = 'normal';
try {
    if (localStorage.getItem('mapaBase') === 'satelite') mapaBase = 'satelite';
} catch (e) {}
MAPAS_BASE[mapaBase].addTo(map);

function cambiarMapaBase(tipo) {
    if (tipo === mapaBase) return;
    map.removeLayer(MAPAS_BASE[mapaBase]);
    MAPAS_BASE[tipo].addTo(map);
    mapaBase = tipo;
    document.querySelectorAll('.basemap-toggle button').forEach(b => b.classList.toggle('active', b.dataset.base === tipo));
    map.getContainer().classList.toggle('is-satelite', tipo === 'satelite');
    try { localStorage.setItem('mapaBase', tipo); } catch (e) {}
}

const BasemapToggle = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function() {
        const div = L.DomUtil.create('div', 'basemap-toggle');
        div.setAttribute('role', 'group');
        div.setAttribute('aria-label', 'Tipo de mapa');
        div.innerHTML = `
            <button type="button" data-base="normal"><i class="fa-solid fa-map"></i> Mapa</button>
            <button type="button" data-base="satelite"><i class="fa-solid fa-earth-americas"></i> Satélite</button>
        `;
        div.querySelectorAll('button').forEach(b => {
            b.classList.toggle('active', b.dataset.base === mapaBase);
            b.addEventListener('click', () => cambiarMapaBase(b.dataset.base));
        });
        // Que los clics en los botones no abran el formulario de "nuevo reporte"
        L.DomEvent.disableClickPropagation(div);
        return div;
    }
});
new BasemapToggle().addTo(map);
map.getContainer().classList.toggle('is-satelite', mapaBase === 'satelite');

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
const situacionSelect = document.getElementById('situacion');

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

// ================= REPORTES EN EL MAPA =================
// La API devuelve cada reporte sin datos de contacto (no incluye el teléfono).

// Mismos colores que las tarjetas de situación del formulario
const SITUACIONES = {
    situacion_mejorar:    { nombre: 'Para mejorar', largo: 'Situación para mejorar', color: '#E74C3C', icono: 'fa-screwdriver-wrench' },
    situacion_riesgo:     { nombre: 'Riesgo',       largo: 'Situación de riesgo',    color: '#F1C40F', icono: 'fa-triangle-exclamation', tinta: '#5E4500' },
    experiencia_positiva: { nombre: 'Positiva',     largo: 'Experiencia positiva',   color: '#27AE60', icono: 'fa-thumbs-up' },
    propuesta_ciudadana:  { nombre: 'Propuesta',    largo: 'Propuesta ciudadana',    color: '#2980B9', icono: 'fa-lightbulb' }
};
const SIN_SITUACION = { nombre: 'Otros', largo: 'Sin clasificar', color: '#95A5A6', icono: 'fa-circle-info' };

const TIPOS = {
    vereda_rota: 'Vereda rota',
    cruce_peligroso: 'Cruce de calle peligroso',
    mala_luz: 'Mala iluminación',
    basura: 'Basura acumulada',
    senial_peatonal: 'Señalización para peatones',
    obstaculo: 'Obstáculos en la vereda',
    bache: 'Bache en la calzada',
    ciclovia_mal: 'Ciclovía en mal estado',
    falta_bicicletero: 'Falta de bicicleteros',
    senial_ciclista: 'Señalización ciclista',
    ripio_escombros: 'Ripio o escombros',
    poco_espacio: 'Poco espacio para circular',
    falta_rampa: 'Falta de rampa de acceso',
    rampa_mal: 'Rampa en mal estado',
    vereda_obstaculos: 'Vereda con obstáculos',
    cruce_sin_desnivel: 'Cruce sin desnivel accesible',
    semaforo_sonoro: 'Semáforo sin señal sonora',
    transporte_inaccesible: 'Transporte sin accesibilidad',
    riesgo_pozo_abierto: 'Pozo o cámara abierta',
    riesgo_cables: 'Cables sueltos o expuestos',
    riesgo_arbol: 'Árbol o rama por caer',
    riesgo_velocidad: 'Autos a alta velocidad',
    riesgo_oscuridad: 'Zona oscura e insegura',
    riesgo_obra: 'Obra sin protección',
    riesgo_bache_profundo: 'Bache profundo',
    riesgo_puertas: 'Autos estacionados en la ciclovía',
    riesgo_cruce_ciclista: 'Cruce peligroso para ciclistas',
    riesgo_rejilla: 'Rejilla o tapa peligrosa',
    riesgo_invasion: 'Vehículos invaden la ciclovía',
    riesgo_calzada_resbaladiza: 'Calzada resbaladiza',
    riesgo_desnivel: 'Desnivel peligroso',
    riesgo_rampa_empinada: 'Rampa demasiado empinada',
    riesgo_cruce_sin_tiempo: 'Semáforo con poco tiempo',
    riesgo_calzada_obligada: 'Obligado a ir por la calle',
    riesgo_pozo_vereda: 'Pozo en la vereda',
    riesgo_piso_resbaladizo: 'Piso resbaladizo',
    positiva_vereda_buena: 'Vereda en buen estado',
    positiva_buena_luz: 'Buena iluminación',
    positiva_espacio_verde: 'Espacio verde cuidado',
    positiva_cruce_seguro: 'Cruce seguro',
    positiva_limpieza: 'Lugar limpio',
    positiva_arreglo: 'Arreglo realizado',
    positiva_ciclovia_buena: 'Ciclovía en buen estado',
    positiva_bicicletero: 'Buenos bicicleteros',
    positiva_respeto: 'Respeto de los conductores',
    positiva_senial_clara: 'Señalización clara',
    positiva_calzada_lisa: 'Calzada lisa',
    positiva_arreglo_bici: 'Arreglo realizado',
    positiva_rampa_buena: 'Rampa accesible',
    positiva_vereda_libre: 'Vereda libre de obstáculos',
    positiva_semaforo_sonoro: 'Semáforo accesible',
    positiva_transporte: 'Transporte accesible',
    positiva_atencion: 'Buena atención o ayuda',
    positiva_arreglo_acceso: 'Mejora de accesibilidad',
    propuesta_senda: 'Nueva senda peatonal',
    propuesta_luminarias: 'Más luminarias',
    propuesta_arboles: 'Más árboles o sombra',
    propuesta_bancos: 'Bancos y lugares de descanso',
    propuesta_peatonal: 'Calle peatonal o ensanche',
    propuesta_cestos: 'Más cestos de basura',
    propuesta_ciclovia: 'Nueva ciclovía',
    propuesta_conexion: 'Conectar ciclovías',
    propuesta_bicicleteros: 'Más bicicleteros',
    propuesta_semaforo_bici: 'Semáforo para bicis',
    propuesta_inflador: 'Punto de reparación',
    propuesta_bici_publica: 'Estación de bicis públicas',
    propuesta_rampa: 'Nueva rampa',
    propuesta_semaforo_sonoro: 'Semáforo sonoro',
    propuesta_podotactil: 'Baldosas podotáctiles',
    propuesta_estacionamiento: 'Estacionamiento reservado',
    propuesta_parada: 'Parada accesible',
    propuesta_bano: 'Baño público accesible'
};

const METODOS = {
    caminando: { texto: 'Caminando', icono: 'fa-person-walking' },
    bicicleta: { texto: 'En bicicleta', icono: 'fa-bicycle' },
    movilidad_reducida: { texto: 'Movilidad reducida', icono: 'fa-wheelchair' }
};

// Los textos vienen de los vecinos: escaparlos evita que alguien inyecte HTML en el mapa
function esc(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function tarjetaReporte(r) {
    const info = infoDe(claveDe(r));
    const metodo = METODOS[r.metodo];
    const foto = r.foto ? `<img class="rc-foto" src="${esc(r.foto)}" alt="Foto del reporte" loading="lazy">` : '';
    return `
        <div class="rc" style="--rc: ${info.color}">
            ${foto}
            <div class="rc-body">
                <span class="rc-badge"><span class="rc-dot"></span>${esc(info.largo)}</span>
                ${r.tipo ? `<h4 class="rc-tipo">${esc(TIPOS[r.tipo] || r.tipo)}</h4>` : ''}
                ${r.descripcion ? `<p class="rc-desc">${esc(r.descripcion)}</p>` : ''}
                <ul class="rc-meta">
                    ${r.ubicacion ? `<li><i class="fa-solid fa-location-dot"></i>${esc(r.ubicacion)}</li>` : ''}
                    ${metodo ? `<li><i class="fa-solid ${metodo.icono}"></i>${metodo.texto}</li>` : ''}
                    ${r.fecha ? `<li><i class="fa-regular fa-clock"></i>${esc(r.fecha)}</li>` : ''}
                </ul>
            </div>
        </div>`;
}

let reportes = [];
let vista = 'puntos';
const activas = new Set([...Object.keys(SITUACIONES), 'otros']);

const puntosLayer = L.layerGroup().addTo(map);
const heatLayer = L.heatLayer([], {
    radius: 30,
    blur: 22,
    // maxZoom bajo = cada reporte pesa lo mismo en cualquier zoom (si no, se desvanecen al alejar)
    maxZoom: 10,
    // Cantidad de reportes superpuestos para llegar al color más intenso
    max: 3,
    minOpacity: 0.5,
    gradient: { 0.25: '#FDE68A', 0.5: '#F5B041', 0.7: '#E67E22', 0.88: '#E74C3C', 1.0: '#922B21' }
});

const filterChips = document.getElementById('filter-chips');
const mapTotal = document.getElementById('map-total');

function claveDe(r) {
    return SITUACIONES[r.categoria] ? r.categoria : 'otros';
}

function infoDe(clave) {
    return SITUACIONES[clave] || SIN_SITUACION;
}

function renderChips() {
    const conteo = {};
    reportes.forEach(r => { conteo[claveDe(r)] = (conteo[claveDe(r)] || 0) + 1; });

    const claves = Object.keys(SITUACIONES).concat(conteo.otros ? ['otros'] : []);
    filterChips.innerHTML = '';
    claves.forEach(clave => {
        const info = infoDe(clave);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip' + (activas.has(clave) ? ' on' : '');
        btn.style.setProperty('--chip', info.color);
        btn.title = info.largo;
        btn.setAttribute('aria-pressed', activas.has(clave));
        btn.innerHTML = `<span class="chip-dot"></span>${info.nombre}<span class="chip-count">${conteo[clave] || 0}</span>`;
        btn.addEventListener('click', () => {
            activas.has(clave) ? activas.delete(clave) : activas.add(clave);
            renderChips();
            renderMapa();
        });
        filterChips.appendChild(btn);
    });
}

// Pin con forma de gota, color de la situación e ícono adentro.
// La punta del pin (abajo al centro) es la que marca la ubicación exacta.
const PIN_ANCHO = 34;
const PIN_ALTO = 44;

// La tarjeta se ancla al centro del pin; el offset la separa del borde según el lado donde se abre
const OFFSET_TARJETA = { top: [0, -22], bottom: [0, 24], left: [-20, 0], right: [20, 0] };

let animarEntrada = true;

function iconoPin(info, indice) {
    // Solo la primera carga "cae" en cascada; al filtrar o cambiar de vista aparecen sin animación
    const demora = animarEntrada ? Math.min(indice * 25, 600) : 0;
    return L.divIcon({
        className: 'pin-wrap',
        html: `
            <div class="pin${animarEntrada ? ' pin-drop' : ''}" style="--pin: ${info.color}; --pin-ink: ${info.tinta || '#fff'}; animation-delay: ${demora}ms">
                <div class="pin-head"><i class="fa-solid ${info.icono}"></i></div>
            </div>
            <span class="pin-shadow"></span>`,
        iconSize: [PIN_ANCHO, PIN_ALTO],
        iconAnchor: [PIN_ANCHO / 2, PIN_ALTO],
        tooltipAnchor: [0, -PIN_ALTO / 2]
    });
}

// Abre la tarjeta hacia el lado donde hay lugar, para que no quede cortada por el borde del mapa
function ubicarTarjeta(e) {
    const tip = e.tooltip;
    const p = map.latLngToContainerPoint(tip.getLatLng());
    const size = map.getSize();
    const medioAncho = 150;

    let direction = p.y < size.y / 2 ? 'bottom' : 'top';
    if (p.x < medioAncho) direction = 'right';
    else if (p.x > size.x - medioAncho) direction = 'left';

    if (tip.options.direction !== direction) {
        tip.options.direction = direction;
        tip.options.offset = OFFSET_TARJETA[direction];
        tip.update();
    }
}

function renderMapa() {
    const visibles = reportes.filter(r => activas.has(claveDe(r)));

    puntosLayer.clearLayers();
    if (vista === 'puntos') {
        if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
        visibles.forEach((r, i) => {
            const info = infoDe(claveDe(r));
            // Los marcadores no propagan el clic al mapa: tocar un pin no abre el formulario de "nuevo reporte"
            const punto = L.marker([r.lat, r.lng], {
                icon: iconoPin(info, i),
                riseOnHover: true,
                keyboard: false
            })
                .bindTooltip(tarjetaReporte(r), { direction: 'top', offset: OFFSET_TARJETA.top, opacity: 1, className: 'report-card-tip' })
                .addTo(puntosLayer);
            // Leaflet abre la tarjeta al pasar el mouse y también al tocar (celulares)
            punto.on('tooltipopen', ubicarTarjeta);
        });
    } else {
        heatLayer.setLatLngs(visibles.map(r => [r.lat, r.lng]));
        if (!map.hasLayer(heatLayer)) heatLayer.addTo(map);
    }
    if (reportes.length) animarEntrada = false;

    const n = visibles.length;
    mapTotal.innerHTML = reportes.length === 0
        ? 'Todavía no hay reportes'
        : `<strong>${n}</strong> ${n === 1 ? 'reporte visible' : 'reportes visibles'}`;
}

document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        vista = btn.dataset.view;
        document.querySelectorAll('.view-toggle button').forEach(b => b.classList.toggle('active', b === btn));
        renderMapa();
    });
});

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

function loadReportes() {
    fetchReports().then(function(data) {
        reportes = Array.isArray(data) ? data : [];
        renderChips();
        renderMapa();
        if (reportes.length > 1) {
            map.fitBounds(L.latLngBounds(reportes.map(r => [r.lat, r.lng])), { padding: [40, 40], maxZoom: 14 });
        }
    }).catch(function() {
        mapTotal.textContent = 'No se pudieron cargar los reportes';
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
    situacionSelect.value = '';
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
    const categoria = situacionSelect.value;

    if (!description || !categoria || !pendingLatLng) return;

    const report = {
        lat: pendingLatLng.lat,
        lng: pendingLatLng.lng,
        description: description,
        categoria: categoria,
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
            reportes.push({
                lat: report.lat,
                lng: report.lng,
                categoria: categoria,
                descripcion: report.description,
                foto: report.photo,
                fecha: report.date
            });
            activas.add(categoria);
            renderChips();
            renderMapa();
            showStatus('¡Gracias! Tu reporte fue registrado.', 'success');

            modalOverlay.classList.add('hidden');
            pendingLatLng = null;
            pendingPhoto = null;
        })
        .catch(function() {
            showStatus('No se pudo guardar el reporte.', 'error');
        });
});

loadReportes();