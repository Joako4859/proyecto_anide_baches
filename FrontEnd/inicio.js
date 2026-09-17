// ================= FECHA EN EL HEADER =================

const headerDate = document.getElementById('header-date');
if (headerDate) {
    const hoy = new Date();
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const texto = hoy.toLocaleDateString('es-AR', opciones);
    headerDate.textContent = texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ================= TIPO DE PROBLEMA (TARJETAS) =================

const problemCards = document.querySelectorAll('.problem-card');
const tipoSelect = document.getElementById('tipo');

problemCards.forEach(card => {
    card.addEventListener('click', () => {
        problemCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        tipoSelect.value = card.dataset.value;
        updateProgress();
    });
});

// ================= CONTADOR DE CARACTERES =================

const descripcionInput = document.getElementById('descripcion');
const characterCount = document.getElementById('character-count');

if (descripcionInput && characterCount) {
    descripcionInput.addEventListener('input', () => {
        characterCount.textContent = `${descripcionInput.value.length} / 500`;
        updateProgress();
    });
}

// ================= BARRA DE PROGRESO =================

const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const form = document.getElementById('report-form');

function updateProgress() {
    let completado = 0;
    const total = 5;

    if (tipoSelect && tipoSelect.value) completado++;
    if (descripcionInput && descripcionInput.value.trim()) completado++;
    const ubicacion = document.getElementById('ubicacion');
    if (ubicacion && ubicacion.value.trim()) completado++;
    const telefono = document.getElementById('telefono');
    if (telefono && telefono.value.trim()) completado++;
    const fotoInput = document.getElementById('foto');
    if (fotoInput && fotoInput.files && fotoInput.files.length > 0) completado++;

    const pct = Math.round((completado / total) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = pct + '% completado';
}

if (form) {
    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
}

// ================= Efecto visual al hacer clic en el botón principal =================

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

// ================= Carga de foto: desde la galería o con la cámara =================

const fotoInput = document.getElementById('foto');
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