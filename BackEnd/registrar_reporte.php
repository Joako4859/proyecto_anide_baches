<?php
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipo = $_POST['tipo_problema'];
    $categoria = $_POST['categoria'] ?? null;
    $metodoMovimiento = $_POST['metodo_movimiento'] ?? null;
    $descripcion = $_POST['descripcion'];
    $ubicacion = $_POST['ubicacion'];
    $telefono = $_POST['telefono'];
    $lat = isset($_POST['lat']) && $_POST['lat'] !== '' ? (float) $_POST['lat'] : null;
    $lng = isset($_POST['lng']) && $_POST['lng'] !== '' ? (float) $_POST['lng'] : null;
    $fotoUrl = null;

    // Manejo de la foto subida
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = uniqid() . '_' . basename($_FILES['foto']['name']);
        $rutaDestino = 'uploads/' . $nombreArchivo;
        move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino);
        $fotoUrl = $rutaDestino;
    }

try {
    $stmt = $pdo->prepare("INSERT INTO reportes (tipo_problema, categoria, metodo_movimiento, descripcion, ubicacion, lat, lng, foto_url, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$tipo, $categoria, $metodoMovimiento, $descripcion, $ubicacion, $lat, $lng, $fotoUrl, $telefono]);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'No se pudo guardar el reporte. Verificá que la tabla reportes tenga las columnas lat y lng.']);
    exit;
}

header('Location: gracias.php');
exit;
} else {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Método no permitido.']);
}
?>
