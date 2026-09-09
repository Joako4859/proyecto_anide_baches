CREATE DATABASE IF NOT EXISTS mi_pagina CHARACTER SET utf8mb4;
USE mi_pagina;

CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mensaje TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_problema VARCHAR( fifty ) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    foto_url VARCHAR(255),
    telefono VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);