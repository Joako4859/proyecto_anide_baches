<?php
// reportes.php
// GET  -> devuelve todos los reportes (JSON del mapa + MySQL del formulario)
// POST -> guarda un reporte nuevo (sistema del mapa, JSON)

require 'conexion.php';

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

function cargarReportesBaseDeDatos(): array
{
    global $pdo;
    $reportes = [];
    try {
        $stmt = $pdo->query("SELECT * FROM reportes WHERE lat IS NOT NULL AND lng IS NOT NULL ORDER BY id DESC");
        foreach ($stmt as $fila) {
            $foto = null;
            if (!empty($fila['foto_url'])) {
                $foto = '../BackEnd/' . ltrim($fila['foto_url'], '/');
            }
            $reportes[] = [
                'lat' => (float) $fila['lat'],
                'lng' => (float) $fila['lng'],
                'description' => $fila['descripcion'],
                'ubicacion' => $fila['ubicacion'],
                'tipo' => $fila['tipo_problema'],
                'categoria' => $fila['categoria'],
                'metodo' => $fila['metodo_movimiento'],
                'severity' => null,
                'photo' => $foto,
                'date' => isset($fila['fecha_creacion']) ? date('d/m/Y H:i', strtotime($fila['fecha_creacion'])) : null,
                'source' => 'form'
            ];
        }
    } catch (PDOException $e) {
        // Si no hay tabla o conexión, devolver vacío sin romper el mapa
        return [];
    }
    return $reportes;
}

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($metodo === 'GET') {
    $reportes = cargarReportesBaseDeDatos();
    foreach (cargarReportes() as $r) {
        $reportes[] = $r;
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($reportes, JSON_UNESCAPED_UNICODE);
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