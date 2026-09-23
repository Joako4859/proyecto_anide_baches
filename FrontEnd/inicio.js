// ================= OPCIONES POR SITUACIÓN Y MÉTODO =================
// Las opciones del paso 3 dependen de la situación elegida en el paso 1
// (mejorar, riesgo, positiva, propuesta) y del método del paso 2.

const opcionesPorSituacion = {};

opcionesPorSituacion.situacion_mejorar = {
    caminando: [
        { value: 'vereda_rota',     icon: '🚶', name: 'Vereda rota',           desc: 'Baldosas sueltas o pisos rotos' },
        { value: 'cruce_peligroso', icon: '⚠️', name: 'Cruce de calle peligroso', desc: 'Difícil cruzar o sin líneas de cebra' },
        { value: 'mala_luz',        icon: '🌒', name: 'Mala iluminación peatonal', desc: 'Calles oscuras al caminar' },
        { value: 'basura',          icon: '🗑️', name: 'Basura acumulada',       desc: 'Residuos tirados en la vía' },
        { value: 'senial_peatonal', icon: '🪧', name: 'Señalización para peatones', desc: 'Carteles faltantes o en mal estado' },
        { value: 'obstaculo',       icon: '🚧', name: 'Obstáculos en la vereda', desc: 'Postes, escombros o autos que bloquean' }
    ],
    bicicleta: [
        { value: 'bache',           icon: '🕳️', name: 'Bache en la calzada',    desc: 'Huecos que dañan las ruedas' },
        { value: 'ciclovia_mal',    icon: '🚲', name: 'Ciclovía en mal estado', desc: 'Rayadas, cortadas o sin pintar' },
        { value: 'falta_bicicletero', icon: '🔒', name: 'Falta de bicicleteros', desc: 'Poco lugar para dejar la bici' },
        { value: 'senial_ciclista', icon: '🪧', name: 'Señalización ciclista',  desc: 'Faltan carteles o son confusos' },
        { value: 'ripio_escombros', icon: '🪨', name: 'Ripio o escombros en la calzada', desc: 'Material suelto en el camino' },
        { value: 'poco_espacio',    icon: '📏', name: 'Poco espacio para circular', desc: 'Calle angosta o muy transitada' }
    ],
    movilidad_reducida: [
        { value: 'falta_rampa',     icon: '♿', name: 'Falta de rampa de acceso', desc: 'No podés entrar a la vereda' },
        { value: 'rampa_mal',       icon: '🛠️', name: 'Rampa en mal estado',    desc: 'Rota, muy inclinada o con bordes altos' },
        { value: 'vereda_obstaculos', icon: '🧱', name: 'Vereda con obstáculos', desc: 'Elementos que impiden el paso' },
        { value: 'cruce_sin_desnivel', icon: '🚦', name: 'Cruce sin desnivel accesible', desc: 'No hay rebaje para cruzar' },
        { value: 'semaforo_sonoro', icon: '🔉', name: 'Semáforo sin señal sonora / poco tiempo', desc: 'Difícil cruzar con seguridad' },
        { value: 'transporte_inaccesible', icon: '🚌', name: 'Transporte sin accesibilidad', desc: 'Imposible subir o llegar a la parada' }
    ]
};

opcionesPorSituacion.situacion_riesgo = {
    caminando: [
        { value: 'riesgo_pozo_abierto',  icon: '🕳️', name: 'Pozo o cámara abierta', desc: 'Tapas faltantes o zanjas sin señalizar' },
        { value: 'riesgo_cables',        icon: '⚡', name: 'Cables sueltos o expuestos', desc: 'Riesgo eléctrico al paso' },
        { value: 'riesgo_arbol',         icon: '🌳', name: 'Árbol o rama por caer', desc: 'Puede caer sobre peatones' },
        { value: 'riesgo_velocidad',     icon: '🏎️', name: 'Autos a alta velocidad', desc: 'Conductores que no frenan en el cruce' },
        { value: 'riesgo_oscuridad',     icon: '🌑', name: 'Zona oscura e insegura', desc: 'Sin luz, da miedo pasar de noche' },
        { value: 'riesgo_obra',          icon: '🚧', name: 'Obra sin protección', desc: 'Obra en la vereda sin vallas ni señales' }
    ],
    bicicleta: [
        { value: 'riesgo_bache_profundo', icon: '🕳️', name: 'Bache profundo', desc: 'Puede provocar una caída' },
        { value: 'riesgo_puertas',        icon: '🚪', name: 'Autos estacionados en la ciclovía', desc: 'Riesgo de choque o apertura de puertas' },
        { value: 'riesgo_cruce_ciclista', icon: '⚠️', name: 'Cruce peligroso para ciclistas', desc: 'Los autos no respetan la prioridad' },
        { value: 'riesgo_rejilla',        icon: '🔩', name: 'Rejilla o tapa peligrosa', desc: 'Las ruedas se pueden trabar' },
        { value: 'riesgo_invasion',       icon: '🚚', name: 'Vehículos invaden la ciclovía', desc: 'Motos o autos circulan por la bicisenda' },
        { value: 'riesgo_calzada_resbaladiza', icon: '💧', name: 'Calzada resbaladiza', desc: 'Agua, aceite o arena en el camino' }
    ],
    movilidad_reducida: [
        { value: 'riesgo_desnivel',       icon: '📉', name: 'Desnivel peligroso', desc: 'Escalón o borde que puede provocar una caída' },
        { value: 'riesgo_rampa_empinada', icon: '⛰️', name: 'Rampa demasiado empinada', desc: 'Peligro de volcar o perder el control' },
        { value: 'riesgo_cruce_sin_tiempo', icon: '🚦', name: 'Semáforo con poco tiempo', desc: 'No alcanza para cruzar con seguridad' },
        { value: 'riesgo_calzada_obligada', icon: '🚗', name: 'Obligado a ir por la calle', desc: 'La vereda no permite pasar y hay que ir entre autos' },
        { value: 'riesgo_pozo_vereda',    icon: '🕳️', name: 'Pozo en la vereda', desc: 'Hueco donde puede trabarse una rueda o bastón' },
        { value: 'riesgo_piso_resbaladizo', icon: '💧', name: 'Piso resbaladizo', desc: 'Superficie lisa, mojada o con musgo' }
    ]
};

opcionesPorSituacion.experiencia_positiva = {
    caminando: [
        { value: 'positiva_vereda_buena',  icon: '✨', name: 'Vereda en buen estado', desc: 'Cómoda y segura para caminar' },
        { value: 'positiva_buena_luz',     icon: '💡', name: 'Buena iluminación', desc: 'Se camina tranquilo de noche' },
        { value: 'positiva_espacio_verde', icon: '🌳', name: 'Espacio verde cuidado', desc: 'Plaza o parque limpio y agradable' },
        { value: 'positiva_cruce_seguro',  icon: '🚸', name: 'Cruce seguro', desc: 'Senda peatonal clara y respetada' },
        { value: 'positiva_limpieza',      icon: '🧹', name: 'Lugar limpio', desc: 'Calle o espacio sin basura' },
        { value: 'positiva_arreglo',       icon: '🛠️', name: 'Arreglo realizado', desc: 'Se solucionó un problema que existía' }
    ],
    bicicleta: [
        { value: 'positiva_ciclovia_buena', icon: '🚲', name: 'Ciclovía en buen estado', desc: 'Bien pintada, lisa y continua' },
        { value: 'positiva_bicicletero',    icon: '🔒', name: 'Buenos bicicleteros', desc: 'Lugar seguro para dejar la bici' },
        { value: 'positiva_respeto',        icon: '🤝', name: 'Respeto de los conductores', desc: 'Los autos respetan al ciclista' },
        { value: 'positiva_senial_clara',   icon: '🪧', name: 'Señalización clara', desc: 'Carteles y marcas fáciles de seguir' },
        { value: 'positiva_calzada_lisa',   icon: '🛣️', name: 'Calzada lisa', desc: 'Sin baches, se circula cómodo' },
        { value: 'positiva_arreglo_bici',   icon: '🛠️', name: 'Arreglo realizado', desc: 'Se solucionó un problema que existía' }
    ],
    movilidad_reducida: [
        { value: 'positiva_rampa_buena',   icon: '♿', name: 'Rampa accesible', desc: 'Bien hecha y fácil de usar' },
        { value: 'positiva_vereda_libre',  icon: '✨', name: 'Vereda libre de obstáculos', desc: 'Se circula sin problemas' },
        { value: 'positiva_semaforo_sonoro', icon: '🔉', name: 'Semáforo accesible', desc: 'Con señal sonora y tiempo suficiente' },
        { value: 'positiva_transporte',    icon: '🚌', name: 'Transporte accesible', desc: 'Fácil subir y llegar a la parada' },
        { value: 'positiva_atencion',      icon: '🤝', name: 'Buena atención o ayuda', desc: 'Personas o servicios que facilitaron el paso' },
        { value: 'positiva_arreglo_acceso', icon: '🛠️', name: 'Mejora de accesibilidad', desc: 'Se hizo una obra que ayuda a circular' }
    ]
};

opcionesPorSituacion.propuesta_ciudadana = {
    caminando: [
        { value: 'propuesta_senda',        icon: '🚸', name: 'Nueva senda peatonal', desc: 'Un cruce donde hace falta' },
        { value: 'propuesta_luminarias',   icon: '💡', name: 'Más luminarias', desc: 'Iluminar una calle o plaza' },
        { value: 'propuesta_arboles',      icon: '🌳', name: 'Más árboles o sombra', desc: 'Forestar veredas y espacios' },
        { value: 'propuesta_bancos',       icon: '🪑', name: 'Bancos y lugares de descanso', desc: 'Para sentarse en el recorrido' },
        { value: 'propuesta_peatonal',     icon: '🚶', name: 'Calle peatonal o ensanche', desc: 'Más espacio para caminar' },
        { value: 'propuesta_cestos',       icon: '🗑️', name: 'Más cestos de basura', desc: 'Para mantener limpia la zona' }
    ],
    bicicleta: [
        { value: 'propuesta_ciclovia',     icon: '🚲', name: 'Nueva ciclovía', desc: 'Un tramo donde hace falta' },
        { value: 'propuesta_conexion',     icon: '🔗', name: 'Conectar ciclovías', desc: 'Unir tramos que hoy están cortados' },
        { value: 'propuesta_bicicleteros', icon: '🔒', name: 'Más bicicleteros', desc: 'Lugares para estacionar la bici' },
        { value: 'propuesta_semaforo_bici', icon: '🚦', name: 'Semáforo para bicis', desc: 'Prioridad en cruces importantes' },
        { value: 'propuesta_inflador',     icon: '🔧', name: 'Punto de reparación', desc: 'Inflador y herramientas públicas' },
        { value: 'propuesta_bici_publica', icon: '🚏', name: 'Estación de bicis públicas', desc: 'Préstamo de bicicletas en la zona' }
    ],
    movilidad_reducida: [
        { value: 'propuesta_rampa',        icon: '♿', name: 'Nueva rampa', desc: 'Una esquina que necesita rebaje' },
        { value: 'propuesta_semaforo_sonoro', icon: '🔉', name: 'Semáforo sonoro', desc: 'Para cruzar con seguridad' },
        { value: 'propuesta_podotactil',   icon: '🟨', name: 'Baldosas podotáctiles', desc: 'Guía para personas ciegas' },
        { value: 'propuesta_estacionamiento', icon: '🅿️', name: 'Estacionamiento reservado', desc: 'Lugar para personas con discapacidad' },
        { value: 'propuesta_parada',       icon: '🚌', name: 'Parada accesible', desc: 'Refugio y acceso adaptado' },
        { value: 'propuesta_bano',         icon: '🚻', name: 'Baño público accesible', desc: 'En plazas o zonas concurridas' }
    ]
};

// Textos del formulario que cambian según la situación elegida
const textosPorSituacion = {
    situacion_mejorar: {
        titulo: '¿Qué se puede mejorar?',
        descTitulo: 'Contanos qué pasó',
        descSub: 'Agregá todos los detalles que puedas',
        placeholder: 'Ej: Hay un bache grande en medio de la calle que dificulta el paso de los vehículos...',
        ubicacionSub: 'Indicá la ubicación del problema',
        fotoSub: 'Una imagen ayuda a entender mejor el problema'
    },
    situacion_riesgo: {
        titulo: '¿Qué riesgo encontraste?',
        descTitulo: 'Contanos el riesgo',
        descSub: 'Describí el peligro para que se pueda actuar rápido',
        placeholder: 'Ej: Hay una tapa de cloaca abierta en la vereda y de noche no se ve...',
        ubicacionSub: 'Indicá dónde está el peligro',
        fotoSub: 'Una imagen ayuda a dimensionar el riesgo'
    },
    experiencia_positiva: {
        titulo: '¿Qué te gustó?',
        descTitulo: 'Contanos tu experiencia',
        descSub: 'Queremos saber qué está funcionando bien',
        placeholder: 'Ej: Arreglaron la vereda de la plaza y ahora se puede caminar muy cómodo...',
        ubicacionSub: 'Indicá dónde fue tu experiencia',
        fotoSub: 'Compartí una imagen de lo que te gustó'
    },
    propuesta_ciudadana: {
        titulo: '¿Qué te gustaría proponer?',
        descTitulo: 'Contanos tu idea',
        descSub: 'Explicá tu propuesta y cómo ayudaría a la ciudad',
        placeholder: 'Ej: Sería bueno poner una ciclovía en esta avenida porque muchos van en bici al trabajo...',
        ubicacionSub: 'Indicá dónde se aplicaría tu propuesta',
        fotoSub: 'Una imagen ayuda a entender tu propuesta'
    }
};

function aplicarTextos(categoria) {
    const t = textosPorSituacion[categoria] || textosPorSituacion.situacion_mejorar;
    const set = (id, texto) => { const el = document.getElementById(id); if (el) el.textContent = texto; };
    set('reclamo-titulo', t.titulo);
    set('descripcion-titulo', t.descTitulo);
    set('descripcion-sub', t.descSub);
    set('ubicacion-sub', t.ubicacionSub);
    set('foto-sub', t.fotoSub);
    if (descripcionInput) descripcionInput.placeholder = t.placeholder;
}

// ================= ELEMENTOS =================

const secciones = document.querySelectorAll('.reveal-section');
const colorGrid = document.getElementById('color-grid');
const metodoGrid = document.getElementById('metodo-grid');
const claimGrid = document.getElementById('claim-grid');
const sectionMetodo = document.getElementById('section-metodo');
const sectionReclamo = document.getElementById('section-reclamo');
const sectionDescripcion = document.getElementById('section-descripcion');
const sectionUbicacion = document.getElementById('section-ubicacion');
const sectionTelefono = document.getElementById('section-telefono');
const sectionFoto = document.getElementById('section-foto');
const sectionFooter = document.getElementById('section-footer');
const reclamoSub = document.getElementById('reclamo-sub');
const claimHint = document.getElementById('claim-hint');

const categoriaInput = document.getElementById('categoria');
const metodoMovimientoInput = document.getElementById('metodo-movimiento');
const tipoSelect = document.getElementById('tipo');

const descripcionInput = document.getElementById('descripcion');
const characterCount = document.getElementById('character-count');
const ubicacionInput = document.getElementById('ubicacion');
const telefonoInput = document.getElementById('telefono');
const fotoInput = document.getElementById('foto');

const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// ================= UTILIDADES =================

function showSection(el) {
    if (el) {
        el.classList.remove('hidden');
        el.classList.add('visible');
    }
}

function hideSection(el) {
    if (el) {
        el.classList.remove('visible');
        el.classList.add('hidden');
    }
}

function revealSection(el) {
    if (!el) return;
    const estabaOculta = el.classList.contains('hidden');
    showSection(el);
    if (estabaOculta) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function marcarSeleccion(cards, card) {
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
}

// ================= PASO 1: COLOR =================

let categoriaSeleccionada = null;
let metodoSeleccionado = null;
let reclamoSeleccionado = null;

const colorCards = Array.from(colorGrid.querySelectorAll('.color-card'));

colorCards.forEach(card => {
    card.addEventListener('click', () => {
        marcarSeleccion(colorCards, card);
        categoriaSeleccionada = card.dataset.value;
        categoriaInput.value = card.dataset.value;

        // Reset de los pasos siguientes
        metodoSeleccionado = null;
        reclamoSeleccionado = null;
        metodoMovimientoInput.value = '';
        tipoSelect.value = '';
        claimGrid.innerHTML = '';
        hideSection(sectionReclamo);
        hideSection(sectionDescripcion);
        hideSection(sectionUbicacion);
        hideSection(sectionTelefono);
        hideSection(sectionFoto);
        hideSection(sectionFooter);
        metodoGrid.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));

        aplicarTextos(categoriaSeleccionada);
        revealSection(sectionMetodo);
        updateProgress();
    });
});

// ================= PASO 2: MÉTODO =================

const methodCards = Array.from(metodoGrid.querySelectorAll('.method-card'));

methodCards.forEach(card => {
    card.addEventListener('click', () => {
        marcarSeleccion(methodCards, card);
        metodoSeleccionado = card.dataset.value;
        metodoMovimientoInput.value = card.dataset.value;

        // Reset del paso siguiente
        reclamoSeleccionado = null;
        tipoSelect.value = '';
        hideSection(sectionDescripcion);
        hideSection(sectionUbicacion);
        hideSection(sectionTelefono);
        hideSection(sectionFoto);
        hideSection(sectionFooter);
        claimGrid.querySelectorAll('.claim-card').forEach(c => c.classList.remove('selected'));

        // Cargar las opciones de la situación y el método elegidos
        const opciones = opcionesPorSituacion[categoriaSeleccionada] || opcionesPorSituacion.situacion_mejorar;
        const reclamos = opciones[metodoSeleccionado] || [];
        claimGrid.innerHTML = '';
        reclamos.forEach(claim => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'opt-card method-card claim-card';
            btn.dataset.value = claim.value;
            btn.innerHTML = `
                <span class="opt-big-icon">${claim.icon}</span>
                <span class="opt-name">${claim.name}</span>
                <span class="opt-desc">${claim.desc}</span>
            `;
            btn.addEventListener('click', () => {
                marcarSeleccion(Array.from(claimGrid.children), btn);
                reclamoSeleccionado = claim.value;
                tipoSelect.value = claim.value;
                claimHint.style.display = 'none';
                revealSection(sectionDescripcion);
                updateProgress();
            });
            claimGrid.appendChild(btn);
        });

        showSection(sectionReclamo);
        if (reclamoSub) {
            const nombreMetodo = card.querySelector('.opt-name').textContent;
            reclamoSub.textContent = `Opciones para: ${nombreMetodo}`;
        }
        revealSection(sectionReclamo);
        updateProgress();
    });
});

// ================= CAMPOS SIGUIENTES =================

if (descripcionInput) {
    descripcionInput.addEventListener('input', () => {
        if (characterCount) {
            characterCount.textContent = `${descripcionInput.value.length} / 500`;
        }
        if (descripcionInput.value.trim()) {
            revealSection(sectionUbicacion);
        }
        updateProgress();
    });
}

if (ubicacionInput) {
    ubicacionInput.addEventListener('input', () => {
        if (ubicacionInput.value.trim()) {
            revealSection(sectionTelefono);
        }
        updateProgress();
    });
}

if (telefonoInput) {
    telefonoInput.addEventListener('input', () => {
        if (telefonoInput.value.trim()) {
            revealSection(sectionFoto);
        }
        updateProgress();
    });
}

// ================= PROGRESO =================

function updateProgress() {
    let completado = 0;
    const total = 6;
    if (categoriaSeleccionada) completado++;
    if (metodoSeleccionado) completado++;
    if (reclamoSeleccionado) completado++;
    if (descripcionInput && descripcionInput.value.trim()) completado++;
    if (ubicacionInput && ubicacionInput.value.trim()) completado++;
    if (telefonoInput && telefonoInput.value.trim()) completado++;

    let pct = Math.round((completado / total) * 100);
    if (fotoInput && fotoInput.files && fotoInput.files.length > 0) {
        pct = Math.min(100, pct + Math.round((100 / total) * 0.5));
        showSection(sectionFooter);
    }
    if (completado === total) pct = 100;

    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = pct + '% completado';

    // El footer se muestra al completar teléfono (o foto si se agregó)
    if (telefonoInput && telefonoInput.value.trim()) {
        showSection(sectionFooter);
    }
}

// ================= FOTO =================

const preview = document.getElementById('foto-preview');
const previewImg = document.getElementById('preview-img');
const galeriaBtn = document.getElementById('galeria-btn');
const camaraBtn = document.getElementById('camara-btn');
const removePhoto = document.getElementById('remove-photo');

function showPreview(file) {
    if (!previewImg || !preview) return;
    previewImg.src = URL.createObjectURL(file);
    preview.classList.remove('hidden');
}

function clearPreview() {
    if (previewImg) previewImg.src = '';
    if (preview) preview.classList.add('hidden');
}

if (galeriaBtn) {
    galeriaBtn.addEventListener('click', () => {
        fotoInput.accept = 'image/*';
        fotoInput.removeAttribute('capture');
        fotoInput.click();
    });
}

if (camaraBtn) {
    camaraBtn.addEventListener('click', () => {
        fotoInput.accept = 'image/*';
        fotoInput.setAttribute('capture', 'environment');
        fotoInput.click();
    });
}

if (fotoInput) {
    fotoInput.addEventListener('change', () => {
        if (fotoInput.files && fotoInput.files[0]) {
            showPreview(fotoInput.files[0]);
            updateProgress();
        }
    });
}

if (removePhoto) {
    removePhoto.addEventListener('click', () => {
        if (fotoInput) fotoInput.value = '';
        clearPreview();
        updateProgress();
    });
}

// ================= UBICACIÓN / GEOLOCALIZACIÓN =================

const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
const usarUbicacionBtn = document.getElementById('usar-ubicacion-btn');
const ubicacionStatus = document.getElementById('ubicacion-status');
const formMap = document.getElementById('form-map');

let locationMap = null;
let locationMarker = null;

function setUbicacionStatus(texto, tipo) {
    if (ubicacionStatus) {
        ubicacionStatus.textContent = texto;
        ubicacionStatus.className = 'ubicacion-status' + (tipo ? ' ' + tipo : '');
    }
}

// Centro por defecto: Neuquén capital
const DEFAULT_CENTER = [-38.9516, -68.0591];

function ensureLocationMap() {
    if (locationMap || !formMap) return;
    formMap.classList.add('active');
    locationMap = L.map('form-map', { scrollWheelZoom: false }).setView(DEFAULT_CENTER, 13);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Map data © OpenStreetMap contributors, Esri',
        maxZoom: 19
    }).addTo(locationMap);

    locationMarker = L.marker(DEFAULT_CENTER, { draggable: true, icon: createFormIcon() }).addTo(locationMap);

    locationMarker.on('dragend', function() {
        const pos = locationMarker.getLatLng();
        latInput.value = pos.lat;
        lngInput.value = pos.lng;
        reverseGeocodeForm(pos.lat, pos.lng);
        updateProgress();
    });

    locationMap.on('click', function(e) {
        locationMarker.setLatLng(e.latlng);
        latInput.value = e.latlng.lat;
        lngInput.value = e.latlng.lng;
        reverseGeocodeForm(e.latlng.lat, e.latlng.lng);
        updateProgress();
    });

    setTimeout(() => { if (locationMap) locationMap.invalidateSize(); }, 200);
}

function createFormIcon() {
    return L.divIcon({
        className: 'form-pin-wrap',
        html: '<span class="form-pin-ico"><i>📍</i></span>',
        iconSize: [36, 40],
        iconAnchor: [18, 38],
        popupAnchor: [0, -36]
    });
}

function setMapPosition(lat, lng, zoom) {
    ensureLocationMap();
    if (!locationMap || !locationMarker) return;
    locationMap.setView([lat, lng], zoom || 16);
    locationMarker.setLatLng([lat, lng]);
}

function reverseGeocodeForm(lat, lng) {
    const controlador = new AbortController();
    setTimeout(() => controlador.abort(), 6000);
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&accept-language=es&zoom=18', { signal: controlador.signal })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data.display_name && ubicacionInput) {
                const partes = data.display_name.split(',');
                const corto = partes.slice(0, 3).join(',').trim();
                ubicacionInput.value = corto.slice(0, 150);
                setUbicacionStatus('✓ Ubicación ajustada', 'ok');
                revealSection(sectionTelefono);
                updateProgress();
            }
        })
        .catch(function() {});
}

// Zonas de búsqueda (oeste,norte,este,sur): primero Neuquén capital y alrededores, después toda la provincia
const VIEWBOX_CIUDAD = '-68.30,-38.80,-67.90,-39.05';
const VIEWBOX_PROVINCIA = '-71.95,-36.10,-68.00,-41.10';

function buscarEnZona(direccion, viewbox, signal) {
    return fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(direccion) + '&limit=1&accept-language=es&countrycodes=ar&bounded=1&viewbox=' + viewbox, { signal: signal })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data[0]) {
                return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
            return null;
        });
}

function geocodificarTexto(direccion, limiteMs) {
    const limite = limiteMs || 6000;
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), limite);
    return buscarEnZona(direccion, VIEWBOX_CIUDAD, controlador.signal)
        .then(function(coords) {
            return coords || buscarEnZona(direccion, VIEWBOX_PROVINCIA, controlador.signal);
        })
        .catch(function() { return null; })
        .finally(function() { clearTimeout(temporizador); });
}

if (usarUbicacionBtn) {
    usarUbicacionBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            setUbicacionStatus('Tu navegador no soporta geolocalización.', 'err');
            return;
        }
        ensureLocationMap();
        setUbicacionStatus('Buscando tu ubicación...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const metros = Math.round((position.coords.accuracy * 0.5) || 0);
                latInput.value = lat;
                lngInput.value = lng;
                setMapPosition(lat, lng, 17);
                setUbicacionStatus('✓ Ubicación detectada (±' + metros + 'm). Arrastrá el pin si querés precisar.', 'ok');
                reverseGeocodeForm(lat, lng);
                revealSection(sectionTelefono);
                updateProgress();
            },
            (err) => {
                let mensaje = 'No se pudo obtener la ubicación. Revisá los permisos.';
                if (err && err.code === 2) mensaje = 'No se pudo determinar la ubicación. Escribí la dirección manualmente.';
                if (err && err.code === 3) mensaje = 'Tardó demasiado. Escribí la dirección manualmente.';
                setUbicacionStatus(mensaje, 'err');
                ensureLocationMap();
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
        );
    });
}

let temporizadorGeocode = null;

if (ubicacionInput) {
    ubicacionInput.addEventListener('input', () => {
        clearTimeout(temporizadorGeocode);
        // La dirección cambió: descartar coordenadas anteriores para no enviar un punto viejo
        latInput.value = '';
        lngInput.value = '';
        const direccion = ubicacionInput.value.trim();
        if (direccion.length < 4) return;
        temporizadorGeocode = setTimeout(() => {
            geocodificarTexto(direccion, 6000).then(function(coords) {
                // Ignorar respuestas de búsquedas viejas si el usuario siguió escribiendo
                if (ubicacionInput.value.trim() !== direccion) return;
                if (coords) {
                    latInput.value = coords.lat;
                    lngInput.value = coords.lng;
                    setMapPosition(coords.lat, coords.lng, 16);
                    setUbicacionStatus('✓ Dirección ubicada. Podés arrastrar el pin para confirmar.', 'ok');
                } else {
                    setUbicacionStatus('⚠ No encontramos esa dirección en Neuquén. Probá con calle y altura, o calle y esquina.', 'err');
                }
            });
        }, 700);
    });
}

// ================= BOTÓN ENVIAR =================

const reportForm = document.getElementById('report-form');
const btnEnviar = document.getElementById('btnEnviar');

if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        const faltantes = [];
        if (!reclamoSeleccionado) {
            faltantes.push({ seccion: sectionReclamo, campo: null, msj: 'Falta elegir una opción en el paso 3.' });
        }
        if (!descripcionInput || !descripcionInput.value.trim()) {
            faltantes.push({ seccion: sectionDescripcion, campo: descripcionInput, msj: 'Falta escribir una descripción breve.' });
        }
        if (!ubicacionInput || !ubicacionInput.value.trim()) {
            faltantes.push({ seccion: sectionUbicacion, campo: ubicacionInput, msj: 'Falta indicar la ubicación.' });
        }
        if (!telefonoInput || !telefonoInput.value.trim()) {
            faltantes.push({ seccion: sectionTelefono, campo: telefonoInput, msj: 'Falta ingresar un teléfono de contacto.' });
        }

        if (faltantes.length === 0) return;

        e.preventDefault();
        const primero = faltantes[0];
        showSection(primero.seccion);
        primero.seccion.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (primero.campo) {
            setTimeout(() => { if (primero.campo) primero.campo.focus(); }, 400);
        } else if (claimHint && primero.seccion === sectionReclamo) {
            claimHint.textContent = primero.msj;
            claimHint.style.display = 'block';
        }
    });
}

if (btnEnviar) {
    btnEnviar.addEventListener('click', () => {
        btnEnviar.style.transform = 'scale(0.95)';
        btnEnviar.style.backgroundColor = '#D35400';
        setTimeout(() => {
            btnEnviar.style.transform = 'scale(1)';
            btnEnviar.style.backgroundColor = 'var(--accent)';
        }, 150);
    });
}

updateProgress();
