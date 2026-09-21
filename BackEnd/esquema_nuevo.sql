-- ============================================================
-- ANIDE / Neuquén Responde - Esquema nuevo de la base
-- Compatible con registrar_reporte.php (necesita lat, lng,
-- categoria y metodo_movimiento)
--
-- MIGRA SIN BORRAR: si reportes ya tiene filas, solo agrega las
-- columnas que faltan. Tambien sirve para instalacion limpia.
-- ============================================================

CREATE DATABASE IF NOT EXISTS anide_formulario CHARACTER SET utf8mb4;
USE anide_formulario;

-- Tabla contactos (no se toca)
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mensaje TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla reportes
CREATE TABLE IF NOT EXISTS reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_problema VARCHAR(50) NOT NULL,
    categoria VARCHAR(50),
    metodo_movimiento VARCHAR(50),
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    lat DOUBLE NULL,
    lng DOUBLE NULL,
    foto_url VARCHAR(255),
    telefono VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MIGRACION (para tablas viejas sin las columnas nuevas)
-- Solo agrega las columnas si no existen. No borra datos.
-- ============================================================

SET @sql := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA='anide_formulario' AND TABLE_NAME='reportes'
    AND COLUMN_NAME='categoria') = 0,
    'ALTER TABLE reportes ADD COLUMN categoria VARCHAR(50) NULL AFTER tipo_problema',
    'SELECT ''categoria: ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA='anide_formulario' AND TABLE_NAME='reportes'
    AND COLUMN_NAME='metodo_movimiento') = 0,
    'ALTER TABLE reportes ADD COLUMN metodo_movimiento VARCHAR(50) NULL AFTER categoria',
    'SELECT ''metodo_movimiento: ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA='anide_formulario' AND TABLE_NAME='reportes'
    AND COLUMN_NAME='lat') = 0,
    'ALTER TABLE reportes ADD COLUMN lat DOUBLE NULL AFTER ubicacion',
    'SELECT ''lat: ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA='anide_formulario' AND TABLE_NAME='reportes'
    AND COLUMN_NAME='lng') = 0,
    'ALTER TABLE reportes ADD COLUMN lng DOUBLE NULL AFTER lat',
    'SELECT ''lng: ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- La tabla vieja llamaba a la fecha "fecha_creado"; el esquema nuevo
-- la llama "fecha_creacion". Cambia el nombre si existe la vieja.
SET @sql := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA='anide_formulario' AND TABLE_NAME='reportes'
    AND COLUMN_NAME='fecha_creado') > 0
    AND (SELECT COUNT(*) FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA='anide_formulario' AND TABLE_NAME='reportes'
        AND COLUMN_NAME='fecha_creacion') = 0,
    'ALTER TABLE reportes CHANGE COLUMN fecha_creado fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'SELECT ''fecha_creacion: ok''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;