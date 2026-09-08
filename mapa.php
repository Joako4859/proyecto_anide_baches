<?php
$reportes = [];
$datosPath = __DIR__ . '/reportes.json';
if (file_exists($datosPath)) {
    $json = file_get_contents($datosPath);
    $datos = json_decode($json, true);
    if (is_array($datos)) {
        $reportes = $datos;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Baches</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    <nav class="navbar">
        <div class="navbar-brand">Reporte de Baches</div>
        <a href="index.php" class="btn-back">📝 Reportar problema</a>
        <div class="navbar-search">
            <input type="text" id="search-input" placeholder="Buscar calle o ciudad..." autocomplete="off">
            <div id="search-results"></div>
        </div>
        <button type="button" id="locate-btn" class="btn-locate">📍 Mi ubicación</button>
    </nav>

    <div class="status-bar hidden" id="status-bar"></div>

    <div class="map-wrapper">
        <div id="map" style="width:100%; height:420px;"></div>
    </div>

    <div id="modal-overlay" class="hidden">
        <div id="modal">
            <h2>Reportar Bache</h2>
            <p class="modal-hint" id="modal-hint">Hacé clic en el mapa para fijar el punto afectado.</p>
            <form id="report-form">
                <label for="description">Descripción del problema:</label>
                <textarea id="description" name="description" rows="3" placeholder="Ej: Bache grande frente al hospital..." required></textarea>

                <label for="severity">Gravedad:</label>
                <select id="severity" name="severity" required>
                    <option value="">Seleccionar...</option>
                    <option value="bajo">Bajo - Pequeño hueco</option>
                    <option value="medio">Medio - Daño considerable</option>
                    <option value="alto">Alto - Bache peligroso</option>
                </select>

                <label for="photo">Foto del bache:</label>
                <div class="photo-buttons">
                    <input type="file" id="photo" name="photo" accept="image/*" class="hidden">
                    <button type="button" id="gallery-btn" class="btn-photo">Subir de la galería</button>
                    <button type="button" id="camera-btn" class="btn-photo">Abrir cámara</button>
                </div>
                <div id="photo-preview" class="hidden"><img id="preview-img" alt="Vista previa"></div>

                <input type="hidden" id="report-lat" name="lat">
                <input type="hidden" id="report-lng" name="lng">

                <div class="modal-buttons">
                    <button type="submit" class="btn-primary">Guardar</button>
                    <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        window.REPORTES = <?php echo json_encode($reportes, JSON_UNESCAPED_UNICODE); ?>;
    </script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="script.js"></script>
</body>
</html>