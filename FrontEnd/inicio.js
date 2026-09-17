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

const colorReclamoInput = document.getElementById('color-reclamo');
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

function marcarSeleccion(cards, card) {
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
}

// ================= PASO 1: COLOR =================

let colorSeleccionado = null;
let metodoSeleccionado = null;
let reclamoSeleccionado = null;

const colorCards = Array.from(colorGrid.querySelectorAll('.color-card'));

colorCards.forEach(card => {
    card.addEventListener('click', () => {
        marcarSeleccion(colorCards, card);
        colorSeleccionado = card.dataset.value;
        colorReclamoInput.value = card.dataset.value;

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

        showSection(sectionMetodo);
        sectionMetodo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                marcarSeleccion(claimGrid.children, btn);
                reclamoSeleccionado = claim.value;
                tipoSelect.value = claim.value;
                claimHint.style.display = 'none';
                showSection(sectionDescripcion);
                updateProgress();
            });
            claimGrid.appendChild(btn);
        });

        showSection(sectionReclamo);
        if (reclamoSub) {
            const nombreMetodo = card.querySelector('.opt-name').textContent;
            reclamoSub.textContent = `Opciones para: ${nombreMetodo}`;
        }
        sectionReclamo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
            showSection(sectionUbicacion);
            sectionUbicacion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        updateProgress();
    });
}

if (ubicacionInput) {
    ubicacionInput.addEventListener('input', () => {
        if (ubicacionInput.value.trim()) {
            showSection(sectionTelefono);
            sectionTelefono.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        updateProgress();
    });
}

if (telefonoInput) {
    telefonoInput.addEventListener('input', () => {
        if (telefonoInput.value.trim()) {
            showSection(sectionFoto);
            sectionFoto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        updateProgress();
    });
}

// ================= PROGRESO =================

function updateProgress() {
    let completado = 0;
    const total = 6;
    if (colorSeleccionado) completado++;
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