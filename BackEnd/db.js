// Conexión a Supabase (PostgreSQL). Los datos se leen de las variables de entorno (.env).
const { Pool } = require('pg');

const faltantes = ['DB_HOST', 'DB_USER', 'DB_PASSWORD'].filter((v) => !process.env[v]);
if (faltantes.length) {
    console.error(`Faltan variables de entorno: ${faltantes.join(', ')}. Copiá .env.example como .env y completalo.`);
    process.exit(1);
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Supabase exige SSL. Su certificado no está en el almacén por defecto de Node,
    // por eso no se valida la cadena (la conexión igual va cifrada).
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;
