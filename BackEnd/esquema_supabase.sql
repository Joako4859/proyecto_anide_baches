-- ============================================================
-- ANIDE / Neuquén Responde - Esquema para Supabase (PostgreSQL)
-- Pegar en Supabase > SQL Editor y ejecutar (Run).
-- ============================================================

CREATE TABLE IF NOT EXISTS contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mensaje TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reportes (
    id SERIAL PRIMARY KEY,
    tipo_problema VARCHAR(50) NOT NULL,
    categoria VARCHAR(50),
    metodo_movimiento VARCHAR(50),
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    foto_url VARCHAR(255),
    telefono VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

-- El PHP se conecta como "postgres", que no está afectado por RLS.
-- Activarlo bloquea el acceso público vía la API REST de Supabase
-- (así nadie puede leer los teléfonos con la anon key).
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;
