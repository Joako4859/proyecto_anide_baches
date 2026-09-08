<?php
// reportes.php
// La unica logica de datos de la app: leer y guardar reportes en reportes.json
// GET  -> devuelve todos los reportes como JSON
// POST -> guarda un reporte nuevo

const ARCHIVO_REPORTES = __DIR__ . '/reportes.json';

function cargarReportes(): array
{
    if (!file_exists(ARCHIVO_REPORTES)) {
        return [];
    }
    $json = file_get_contents(ARCHIVO_REPORTES);
    $datos = json_decode($json, true);
    return is_array($datos) ? $datos : [];
}

function guardarReportes(array $reportes): void
{
    file_put_contents(ARCHIVO_REPORTES, json_encode($reportes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($metodo === 'GET') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(cargarReportes(), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($metodo === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $reporte = [
        'lat' => isset($input['lat']) ? (float) $input['lat'] : null,
        'lng' => isset($input['lng']) ? (float) $input['lng'] : null,
        'description' => trim($input['description'] ?? ''),
        'severity' => trim($input['severity'] ?? ''),
        'photo' => trim($input['photo'] ?? ''),
        'date' => trim($input['date'] ?? '') !== ''
            ? $input['date']
            : date('d/m/Y H:i'),
    ];

    if ($reporte['lat'] === null || $reporte['lng'] === null || $reporte['description'] === '' || $reporte['severity'] === '') {
        http_response_code(400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Faltan datos obligatorios.']);
        exit;
    }

    $reportes = cargarReportes();
    $reportes[] = $reporte;
    guardarReportes($reportes);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true, 'reporte' => $reporte]);
    exit;
}

http_response_code(405);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Método no permitido.']);