// Vacía la tabla "reportes" (y reportes.json) y carga 60 reportes de ejemplo en Neuquén capital.
// Antes de borrar guarda una copia en BackEnd/backups/.
// Uso: npm run seed
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const CANTIDAD = 60;

// Generador pseudoaleatorio con semilla: siempre produce los mismos 60 puntos
let semilla = 20260923;
function azar() {
    semilla = (semilla * 1103515245 + 12345) % 2147483648;
    return semilla / 2147483648;
}
const elegir = (lista) => lista[Math.floor(azar() * lista.length)];

// Centros de barrios de Neuquén capital (todos al norte del río Limay)
const BARRIOS = [
    { nombre: 'Centro',             lat: -38.9516, lng: -68.0591 },
    { nombre: 'Bajo',               lat: -38.9605, lng: -68.0625 },
    { nombre: 'Área Centro Oeste',  lat: -38.9535, lng: -68.0755 },
    { nombre: 'Área Centro Este',   lat: -38.9540, lng: -68.0450 },
    { nombre: 'Santa Genoveva',     lat: -38.9455, lng: -68.0445 },
    { nombre: 'Villa Farrell',      lat: -38.9430, lng: -68.0700 },
    { nombre: 'Alta Barda',         lat: -38.9385, lng: -68.0530 },
    { nombre: 'Rincón de Emilio',   lat: -38.9420, lng: -68.0270 },
    { nombre: 'Villa María',        lat: -38.9475, lng: -68.0850 },
    { nombre: 'Confluencia',        lat: -38.9615, lng: -68.0860 },
    { nombre: 'Mariano Moreno',     lat: -38.9400, lng: -68.0880 },
    { nombre: 'Parque Central',     lat: -38.9585, lng: -68.0690 },
    { nombre: 'Provincias Unidas',  lat: -38.9530, lng: -68.0270 },
    { nombre: 'Sapere',             lat: -38.9450, lng: -68.0980 },
];

const CALLES = [
    'Av. Argentina', 'Av. Olascoaga', 'Av. Mitre', 'Av. Leloir', 'Av. San Martín', 'Belgrano',
    'Alderete', 'Rivadavia', 'Diagonal Alvear', 'Santa Fe', 'Tucumán', 'Sarmiento', 'Fotheringham',
    'Juan B. Justo', 'Antártida Argentina', 'Linares', 'Láinez', 'Buenos Aires', 'Ministro González', 'Perito Moreno',
];

// [categoria, metodo, tipo, descripciones posibles]
const PLANTILLAS = [
    ['situacion_mejorar', 'caminando', 'vereda_rota', ['Baldosas sueltas en media cuadra, hay que caminar por la calle.', 'La vereda está levantada por las raíces de un árbol.']],
    ['situacion_mejorar', 'caminando', 'mala_luz', ['Dos luminarias apagadas hace semanas, de noche no se ve nada.']],
    ['situacion_mejorar', 'caminando', 'basura', ['Se acumula basura en la esquina, el contenedor siempre está lleno.']],
    ['situacion_mejorar', 'caminando', 'obstaculo', ['Autos estacionados sobre la vereda todos los días.']],
    ['situacion_mejorar', 'bicicleta', 'bache', ['Bache grande sobre el carril derecho, hay que esquivarlo.', 'Varios baches seguidos después de la lluvia.']],
    ['situacion_mejorar', 'bicicleta', 'ciclovia_mal', ['La ciclovía está despintada y casi no se distingue.']],
    ['situacion_mejorar', 'bicicleta', 'falta_bicicletero', ['No hay dónde dejar la bici frente a los comercios.']],
    ['situacion_mejorar', 'movilidad_reducida', 'falta_rampa', ['La esquina no tiene rampa, imposible subir con silla de ruedas.']],
    ['situacion_mejorar', 'movilidad_reducida', 'rampa_mal', ['La rampa termina en un escalón de 10 cm.']],
    ['situacion_riesgo', 'caminando', 'riesgo_pozo_abierto', ['Cámara sin tapa en plena vereda, muy peligroso de noche.']],
    ['situacion_riesgo', 'caminando', 'riesgo_cables', ['Cables colgando a la altura de la cabeza.']],
    ['situacion_riesgo', 'caminando', 'riesgo_velocidad', ['Los autos pasan muy rápido y no frenan en la senda peatonal.']],
    ['situacion_riesgo', 'caminando', 'riesgo_arbol', ['Rama grande quebrada que puede caer sobre la vereda.']],
    ['situacion_riesgo', 'bicicleta', 'riesgo_bache_profundo', ['Bache profundo tapado con agua, ya vi a alguien caerse.']],
    ['situacion_riesgo', 'bicicleta', 'riesgo_puertas', ['Autos estacionados sobre la ciclovía, obligan a salir al tránsito.']],
    ['situacion_riesgo', 'bicicleta', 'riesgo_rejilla', ['Rejilla con las barras en el sentido de la marcha, traba la rueda.']],
    ['situacion_riesgo', 'movilidad_reducida', 'riesgo_cruce_sin_tiempo', ['El semáforo peatonal dura muy poco, no alcanzo a cruzar.']],
    ['situacion_riesgo', 'movilidad_reducida', 'riesgo_desnivel', ['Desnivel sin señalizar a la salida de la parada del colectivo.']],
    ['experiencia_positiva', 'caminando', 'positiva_vereda_buena', ['Hicieron la vereda nueva, ahora se camina muy cómodo.']],
    ['experiencia_positiva', 'caminando', 'positiva_espacio_verde', ['La plaza está limpia y con el pasto cortado, da gusto venir.']],
    ['experiencia_positiva', 'caminando', 'positiva_buena_luz', ['Pusieron luces LED nuevas, de noche se ve perfecto.']],
    ['experiencia_positiva', 'bicicleta', 'positiva_ciclovia_buena', ['La bicisenda está impecable y bien señalizada.']],
    ['experiencia_positiva', 'bicicleta', 'positiva_respeto', ['Los autos respetan la prioridad de las bicis en este cruce.']],
    ['experiencia_positiva', 'movilidad_reducida', 'positiva_rampa_buena', ['Rampas nuevas en las cuatro esquinas, muy bien hechas.']],
    ['experiencia_positiva', 'movilidad_reducida', 'positiva_transporte', ['El colectivo bajó la rampa sin problema y el chofer ayudó.']],
    ['propuesta_ciudadana', 'caminando', 'propuesta_senda', ['Hace falta una senda peatonal frente a la escuela.']],
    ['propuesta_ciudadana', 'caminando', 'propuesta_arboles', ['Sería bueno plantar árboles, en verano no hay nada de sombra.']],
    ['propuesta_ciudadana', 'caminando', 'propuesta_bancos', ['Propongo poner bancos en el boulevard para descansar.']],
    ['propuesta_ciudadana', 'bicicleta', 'propuesta_ciclovia', ['Una ciclovía en esta avenida ayudaría a los que van al trabajo en bici.']],
    ['propuesta_ciudadana', 'bicicleta', 'propuesta_conexion', ['Conectar esta bicisenda con la del paseo costero.']],
    ['propuesta_ciudadana', 'movilidad_reducida', 'propuesta_semaforo_sonoro', ['Un semáforo sonoro en este cruce ayudaría a personas ciegas.']],
    ['propuesta_ciudadana', 'movilidad_reducida', 'propuesta_podotactil', ['Agregar baldosas podotáctiles en la vereda del hospital.']],
];

function generarReportes() {
    const ahora = Date.now();
    const reportes = [];
    for (let i = 0; i < CANTIDAD; i++) {
        // Recorre todas las plantillas en orden para repartir bien las 4 situaciones
        const [categoria, metodo, tipo, descripciones] = PLANTILLAS[i % PLANTILLAS.length];
        const barrio = elegir(BARRIOS);
        const lat = barrio.lat + (azar() - 0.5) * 0.009;
        const lng = barrio.lng + (azar() - 0.5) * 0.011;
        const altura = 100 + Math.floor(azar() * 30) * 50;
        const diasAtras = Math.floor(azar() * 60);
        reportes.push({
            tipo_problema: tipo,
            categoria,
            metodo_movimiento: metodo,
            descripcion: elegir(descripciones),
            ubicacion: `${elegir(CALLES)} ${altura}, ${barrio.nombre}`,
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6)),
            telefono: `299 4${String(Math.floor(azar() * 100)).padStart(2, '0')} ${String(Math.floor(azar() * 10000)).padStart(4, '0')}`,
            fecha_creacion: new Date(ahora - diasAtras * 86400000 - Math.floor(azar() * 86400000)),
        });
    }
    return reportes;
}

async function main() {
    const carpetaBackup = path.join(__dirname, 'backups');
    fs.mkdirSync(carpetaBackup, { recursive: true });
    const sello = new Date().toISOString().replace(/[:.]/g, '-');

    const { rows: anteriores } = await pool.query('SELECT * FROM reportes ORDER BY id');
    const archivoJson = path.join(__dirname, 'reportes.json');
    const anterioresJson = fs.existsSync(archivoJson) ? fs.readFileSync(archivoJson, 'utf8') : '[]';
    const archivoBackup = path.join(carpetaBackup, `reportes_${sello}.json`);
    fs.writeFileSync(archivoBackup, JSON.stringify({ base: anteriores, reportes_json: JSON.parse(anterioresJson || '[]') }, null, 2));
    console.log(`Copia de seguridad: ${anteriores.length} reportes guardados en ${archivoBackup}`);

    const nuevos = generarReportes();
    const cliente = await pool.connect();
    try {
        await cliente.query('BEGIN');
        await cliente.query('TRUNCATE reportes RESTART IDENTITY');
        for (const r of nuevos) {
            await cliente.query(
                `INSERT INTO reportes (tipo_problema, categoria, metodo_movimiento, descripcion, ubicacion, lat, lng, foto_url, telefono, fecha_creacion)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9)`,
                [r.tipo_problema, r.categoria, r.metodo_movimiento, r.descripcion, r.ubicacion, r.lat, r.lng, r.telefono, r.fecha_creacion]
            );
        }
        await cliente.query('COMMIT');
    } catch (e) {
        await cliente.query('ROLLBACK');
        throw e;
    } finally {
        cliente.release();
    }

    fs.writeFileSync(archivoJson, '[]');
    console.log(`Listo: se borraron ${anteriores.length} reportes y se cargaron ${nuevos.length} nuevos en Neuquén.`);
}

main()
    .catch((e) => {
        console.error('Error:', e.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
