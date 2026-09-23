const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const pool = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);

const CARPETA_FRONTEND = path.join(__dirname, '..', 'FrontEnd');
const CARPETA_UPLOADS = path.join(__dirname, 'uploads');
const ARCHIVO_REPORTES = path.join(__dirname, 'reportes.json');

fs.mkdirSync(CARPETA_UPLOADS, { recursive: true });

// Fotos del formulario: se guardan en BackEnd/uploads y se sirven en /uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: CARPETA_UPLOADS,
        filename: (req, file, cb) => {
            const nombreSeguro = path.basename(file.originalname).replace(/[^\w.\-]/g, '_');
            cb(null, `${Date.now().toString(16)}_${nombreSeguro}`);
        },
    }),
    limits: { fileSize: 15 * 1024 * 1024 },
});

app.use(express.json({ limit: '20mb' })); // el mapa manda la foto en base64
app.use(express.static(CARPETA_FRONTEND));
app.use('/uploads', express.static(CARPETA_UPLOADS));

// ---------- Reportes del mapa (archivo JSON) ----------

function cargarReportes() {
    try {
        const datos = JSON.parse(fs.readFileSync(ARCHIVO_REPORTES, 'utf8'));
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function guardarReportes(reportes) {
    fs.writeFileSync(ARCHIVO_REPORTES, JSON.stringify(reportes, null, 4));
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).replace(',', '');
}

// ---------- Reportes del formulario (Supabase) ----------

// El teléfono NO se consulta: el mapa es público y no debe exponer datos de contacto
async function cargarReportesBaseDeDatos() {
    try {
        const { rows } = await pool.query(
            `SELECT lat, lng, categoria, tipo_problema, metodo_movimiento, descripcion, ubicacion, foto_url, fecha_creacion
             FROM reportes WHERE lat IS NOT NULL AND lng IS NOT NULL ORDER BY id DESC`
        );
        return rows.map((f) => ({
            lat: f.lat,
            lng: f.lng,
            categoria: f.categoria,
            tipo: f.tipo_problema,
            metodo: f.metodo_movimiento,
            descripcion: f.descripcion,
            ubicacion: f.ubicacion,
            foto: f.foto_url ? '/' + f.foto_url.replace(/^\/+/, '') : null,
            fecha: f.fecha_creacion ? formatearFecha(f.fecha_creacion) : null,
        }));
    } catch (e) {
        // Si no hay tabla o conexión, devolver vacío sin romper el mapa
        console.error('Error leyendo reportes de la base:', e.message);
        return [];
    }
}

// Reportes creados desde el mapa (reportes.json), con el mismo formato
function cargarReportesMapa() {
    return cargarReportes().map((r) => ({
        lat: r.lat,
        lng: r.lng,
        categoria: r.categoria,
        tipo: null,
        metodo: null,
        descripcion: r.description,
        ubicacion: null,
        foto: typeof r.photo === 'string' && r.photo.startsWith('data:image/') ? r.photo : null,
        fecha: r.date || null,
    }));
}

const CATEGORIAS = ['situacion_mejorar', 'situacion_riesgo', 'experiencia_positiva', 'propuesta_ciudadana'];

// GET -> reportes para el mapa (Supabase + JSON del mapa), sin datos de contacto
app.get('/api/reportes', async (req, res) => {
    const todos = [...(await cargarReportesBaseDeDatos()), ...cargarReportesMapa()];
    res.json(
        todos
            .filter((r) => Number.isFinite(Number(r.lat)) && Number.isFinite(Number(r.lng)))
            .map((r) => ({
                ...r,
                lat: Number(r.lat),
                lng: Number(r.lng),
                categoria: CATEGORIAS.includes(r.categoria) ? r.categoria : null,
            }))
    );
});

// POST -> guarda un reporte nuevo del mapa (JSON)
app.post('/api/reportes', (req, res) => {
    const input = req.body || {};
    const reporte = {
        lat: input.lat != null ? Number(input.lat) : null,
        lng: input.lng != null ? Number(input.lng) : null,
        description: String(input.description ?? '').trim(),
        categoria: String(input.categoria ?? '').trim(),
        photo: String(input.photo ?? '').trim(),
        date: String(input.date ?? '').trim() || formatearFecha(new Date()),
    };

    if (reporte.lat === null || reporte.lng === null || !reporte.description || !CATEGORIAS.includes(reporte.categoria)) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const reportes = cargarReportes();
    reportes.push(reporte);
    guardarReportes(reportes);
    res.json({ ok: true });
});

// POST del formulario principal -> inserta en Supabase y redirige a gracias.html
app.post('/api/registrar-reporte', upload.single('foto'), async (req, res) => {
    const b = req.body || {};
    const vacio = (v) => v === undefined || String(v).trim() === '';
    const numero = (v) => (vacio(v) ? null : Number(v));

    if (['tipo_problema', 'descripcion', 'ubicacion', 'telefono'].some((c) => vacio(b[c]))) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const fotoUrl = req.file ? `uploads/${req.file.filename}` : null;

    try {
        await pool.query(
            `INSERT INTO reportes (tipo_problema, categoria, metodo_movimiento, descripcion, ubicacion, lat, lng, foto_url, telefono)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [b.tipo_problema, b.categoria || null, b.metodo_movimiento || null, b.descripcion,
             b.ubicacion, numero(b.lat), numero(b.lng), fotoUrl, b.telefono]
        );
    } catch (e) {
        console.error('Error guardando reporte:', e.message);
        return res.status(500).json({ error: 'No se pudo guardar el reporte.' });
    }

    res.redirect(303, '/gracias.html');
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
