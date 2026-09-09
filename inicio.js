const fotoInput = document.getElementById('foto');
const preview = document.getElementById('foto-preview');
const previewImg = document.getElementById('preview-img');

const fechaElem = document.getElementById('header-date');
if (fechaElem) {
    fechaElem.textContent = new Date().toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function showPreview(file) {
    previewImg.src = URL.createObjectURL(file);
    preview.classList.remove('hidden');
}

document.getElementById('galeria-btn').addEventListener('click', function () {
    fotoInput.accept = 'image/*';
    fotoInput.removeAttribute('capture');
    fotoInput.click();
});

document.getElementById('camara-btn').addEventListener('click', function () {
    fotoInput.accept = 'image/*';
    fotoInput.setAttribute('capture', 'environment');
    fotoInput.click();
});

fotoInput.addEventListener('change', function () {
    if (fotoInput.files && fotoInput.files[0]) {
        showPreview(fotoInput.files[0]);
    }
});
