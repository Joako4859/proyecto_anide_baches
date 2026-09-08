<?php
$enviado = isset($_GET['enviado']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Baches - Reportar Problema</title>
    <link rel="stylesheet" href="inicio.css" />
</head>
<body>
    <header class="page-header">
        <h1>Reporte de Baches</h1>
        <p>Reporta un problema en la vía pública de forma rápida</p>
    </header>

    <main class="form-container">
        <form id="report-form" class="report-form" action="api.php" method="post" enctype="multipart/form-data">
            <?php if ($enviado): ?>
                <div class="form-success">Reporte enviado correctamente.</div>
            <?php endif; ?>

            <h2>Reportar un problema</h2>

            <div class="form-group">
                <label for="tipo">Tipo de problema</label>
                <select id="tipo" name="tipo" required>
                    <option value="">Seleccionar...</option>
                    <option value="bache">Bache</option>
                    <option value="luminaria">Luminaria en mal estado</option>
                    <option value="vereda">Vereda rota</option>
                    <option value="basura">Acumulación de basura</option>
                    <option value="pluvial">Desagüe tapado / inundación</option>
                    <option value="otro">Otro</option>
                </select>
            </div>

            <div class="form-group">
                <label for="descripcion">Descripción del problema</label>
                <textarea id="descripcion" name="descripcion" rows="4" placeholder="Describí el problema con detalle..." required></textarea>
            </div>

            <div class="form-group">
                <label for="ubicacion">Ubicación</label>
                <input type="text" id="ubicacion" name="ubicacion" placeholder="Ej: Av. San Martín 123, entre calles..." required>
            </div>

            <div class="form-group">
                <label>Foto del problema</label>
                <div class="photo-actions">
                    <input type="file" id="foto" name="foto" accept="image/*" class="hidden">
                    <button type="button" id="galeria-btn" class="btn-photo">📁 Subir foto</button>
                    <button type="button" id="camara-btn" class="btn-photo">📷 Sacar con la cámara</button>
                </div>
                <div id="foto-preview" class="hidden">
                    <img id="preview-img" alt="Vista previa de la foto" style="max-width:100%; height:auto; max-height:300px; object-fit:contain; border-radius:6px;">
                </div>
            </div>

            <div class="form-group">
                <label for="telefono">Número de teléfono</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Ej: 351 123 4567">
            </div>

            <button type="submit" class="btn-primary">Enviar reporte</button>

            <a href="mapa.php" class="btn-map">🗺️ Ver mapa de reportes</a>
        </form>
    </main>

    <script src="inicio.js"></script>
</body>
</html>