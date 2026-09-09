<?php
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipo = $_POST['tipo_problema'];
    $descripcion = $_POST['descripcion'];
    $ubicacion = $_POST['ubicacion'];
    $telefono = $_POST['telefono'];
    $fotoUrl = null;

    // Manejo de la foto subida
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = uniqid() . '_' . basename($_FILES['foto']['name']);
        $rutaDestino = 'uploads/' . $nombreArchivo;
        move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino);
        $fotoUrl = $rutaDestino;
    }

    $stmt = $pdo->prepare("INSERT INTO reportes (tipo_problema, descripcion, ubicacion, foto_url, telefono) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$tipo, $descripcion, $ubicacion, $fotoUrl, $telefono]);

    header('Location: gracias.php');
    exit;
}
?>
