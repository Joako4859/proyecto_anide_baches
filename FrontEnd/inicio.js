// ================= FECHA EN EL HEADER =================

const headerDate = document.getElementById('header-date');
if (headerDate) {
    const hoy = new Date();
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const texto = hoy.toLocaleDateString('es-AR', opciones);
    headerDate.textContent = texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ================= OPCIONES DE RECLAMO POR MÉTODO =================

const reclamosPorMetodo = {
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

        // Cargar reclamos del método elegido
        const reclamos = reclamosPorMetodo[metodoSeleccionado] || [];
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

const reportForm = document.getElementById('report-form');
const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
const usarUbicacionBtn = document.getElementById('usar-ubicacion-btn');
const ubicacionStatus = document.getElementById('ubicacion-status');

function setUbicacionStatus(texto, tipo) {
    if (ubicacionStatus) {
        ubicacionStatus.textContent = texto;
        ubicacionStatus.className = 'ubicacion-status' + (tipo ? ' ' + tipo : '');
    }
}

function geocodificarTexto(direccion, limiteMs) {
    const limite = limiteMs || 6000;
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), limite);
    return fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(direccion) + '&limit=1&accept-language=es', { signal: controlador.signal })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data[0]) {
                return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
            return null;
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
        setUbicacionStatus('Buscando tu ubicación...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latInput.value = position.coords.latitude;
                lngInput.value = position.coords.longitude;
                const metros = Math.round(position.coords.accuracy || 0);
                setUbicacionStatus('✓ Ubicación detectada' + (metros ? ' (precisión ±' + metros + 'm)' : ''), 'ok');
                fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&accept-language=es&zoom=18', { signal: AbortSignal.timeout(6000) })
                    .then(function(res) { return res.json(); })
                    .then(function(data) {
                        if (data && data.display_name && ubicacionInput) {
                            ubicacionInput.value = data.display_name.slice(0, 150);
                            revealSection(sectionTelefono);
                            updateProgress();
                        }
                    })
                    .catch(function() {});
            },
            () => {
                setUbicacionStatus('No se pudo obtener la ubicación. Revisá los permisos.', 'err');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
    });
}

if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        if (latInput && latInput.value && lngInput && lngInput.value) return;

        e.preventDefault();
        const direccion = (ubicacionInput && ubicacionInput.value.trim()) || '';

        if (!direccion) {
            reportForm.submit();
            return;
        }

        let enviado = false;
        const enviar = function() {
            if (enviado) return;
            enviado = true;
            reportForm.submit();
        };

        const redDeSeguridad = setTimeout(enviar, 8000);
        geocodificarTexto(direccion, 6000)
            .then(function(coords) {
                if (coords) {
                    latInput.value = coords.lat;
                    lngInput.value = coords.lng;
                }
            })
            .catch(function() {})
            .finally(function() {
                clearTimeout(redDeSeguridad);
                enviar();
            });
    });
}

// ================= BOTÓN ENVIAR =================

const btnEnviar = document.getElementById('btnEnviar');
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