// Efecto visual al hacer clic en el botón principal
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

// Animaciones para los botones del header
const botones = ['btnReportar', 'btnMapa', 'btnMisReportes'];
botones.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', () => {
            btn.style.color = 'var(--accent-deep)';
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                btn.style.color = 'var(--ink-soft)';
                btn.style.transform = 'scale(1)';
            }, 200);
        });
    }
});

// Carga de foto: desde la galería o con la cámara
const fotoInput = document.getElementById('foto');
const preview = document.getElementById('foto-preview');
const previewImg = document.getElementById('preview-img');
const galeriaBtn = document.getElementById('galeria-btn');
const camaraBtn = document.getElementById('camara-btn');

function showPreview(file) {
    if (!previewImg || !preview) return;
    previewImg.src = URL.createObjectURL(file);
    preview.classList.remove('hidden');
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
        }
    });
}