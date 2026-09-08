<?php
// api.php - Backend en PHP
// GET  -> devuelve todos los reportes como JSON
// POST -> crea un reporte nuevo (formulario de inicio o de mapa)

declare(strict_types=1);

const DATA_FILE = __DIR__ . '/reportes.json';
const UPLOAD_DIR = __DIR__ . '/uploads';

function responderJson(array $datos, int $codigo = 200): never
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function cargarReportes(): array
{
    if (!file_exists(DATA_FILE)) {
        return [];
    }
    $json = file_get_contents(DATA_FILE);
    $datos = json_decode($json, true);
    return is_array($datos) ? $datos : [];
}

function guardarReportes(array $reportes): void
{
    file_put_contents(DATA_FILE, json_encode($reportes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function metodo(): string
{
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

if (metodo() === 'GET') {
    responderJson(cargarReportes());
}

if (metodo() !== 'POST') {
    responderJson(['error' => 'Método no permitido'], 405);
}

// ---- Procesamiento del POST ----

$tipo = trim($_POST['tipo'] ?? '');
$descripcion = trim($_POST['descripcion'] ?? '');
$ubicacion = trim($_POST['ubicacion'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$severidad = trim($_POST['severidad'] ?? '');
$lat = trim($_POST['lat'] ?? '');
$lng = trim($_POST['lng'] ?? '');

if ($descripcion === '' || $tipo === '') {
    responderJson(['error' => 'El tipo de problema y la descripción son obligatorios.'], 400);
}

// Guardar la foto si viene adjunta
$foto = '';
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $info = pathinfo($_FILES['foto']['name']);
    $ext = strtolower($info['extension'] ?? 'jpg');
    $permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];
    if (!in_array($ext, $permitidas, true)) {
        responderJson(['error' => 'Formato de imagen no permitido.'], 400);
    }
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0775, true);
    }
    $nombre = 'reporte_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $destino = UPLOAD_DIR . '/' . $nombre;
    if (move_uploaded_file($_FILES['foto']['tmp_name'], $destino)) {
        $foto = 'uploads/' . $nombre;
    }
}

$reporte = [
    'id' => uniqid('', true),
    'tipo' => $tipo,
    'descripcion' => $descripcion,
    'ubicacion' => $ubicacion,
    'telefono' => $telefono,
    'severidad' => $severidad,
    'lat' => is_numeric($lat) ? (float) $lat : null,
    'lng' => is_numeric($lng) ? (float) $lng : null,
    'foto' => $foto,
    'date' => date('d/m/Y H:i'),
];

$reportes = cargarReportes();
$reportes[] = $reporte;
guardarReportes($reportes);

// Redirige con mensaje de éxito: los formularios normales esperan una redirección
if (isset($_POST['ajax'])) {
    responderJson(['ok' => true, 'reporte' => $reporte]);
}

// Volver al inicio con feedback vía query string
header('Location: index.php?enviado=1');
exit;