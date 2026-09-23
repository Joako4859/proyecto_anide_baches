#  Proyecto Anide y Defensoria del pueblo

Aplicación web para que los vecinos reporten problemas en la vía pública (baches, luminarias en mal estado, veredas rotas, acumulación de basura, desagües tapados, etc.) y los visualicen en un **mapa interactivo**.

Desarrollada con **HTML, CSS, JavaScript, Node.js (Express) y Supabase (PostgreSQL)**.

## ✨ Funcionalidades

- **Formulario de reporte** (`FrontEnd/index.html`):
  - Selección del tipo de problema (bache, luminaria, vereda, basura, pluvial, otro).
  - Descripción, ubicación y teléfono de contacto.
  - Carga de foto desde la galería o directamente con la cámara (desde un celular).
  - Vista previa de la imagen antes de enviar.
  - Los datos se guardan en la base de datos de **Supabase**.
- **Mapa interactivo** (`FrontEnd/mapa.html`):
  - Mapa de calles con [Leaflet.js](https://leafletjs.com/).
  - Marcadores con colores según la gravedad del bache:
    - 🟡 **Bajo** (pequeño hueco)
    - 🟠 **Medio** (daño considerable)
    - 🔴 **Alto** (bache peligroso)
  - Reportar un bache haciendo clic en el mapa.
  - Botón **"Mi ubicación"** para geolocalizarte y marcar baches en tu zona.
  - Buscador de calles y ciudades (geocodificación de OpenStreetMap/Nominatim).
  - Carga de fotos en el reporte del mapa.
  - Los reportes se guardan en `BackEnd/reportes.json` (sin depender de la BD).
- Cercado por ciudad: solo se permite marcar baches dentro de tu ciudad (radio de 10 km).

## 🗂️ Estructura del proyecto

```
proyecto_anide_baches/
├── FrontEnd/                      # Interfaz de usuario (se sirve como sitio estático)
│   ├── index.html                 # Página de reporte (formulario)
│   ├── mapa.html                  # Mapa interactivo de reportes
│   ├── gracias.html               # Página de confirmación
│   ├── inicio.css / styles.css    # Estilos
│   ├── inicio.js                  # Lógica del formulario (cámara/galería)
│   └── script.js                  # Lógica del mapa (Leaflet)
├── BackEnd/                       # Servidor Node.js
│   ├── server.js                  # Servidor Express + API
│   ├── db.js                      # Conexión a Supabase (lee las variables de entorno)
│   ├── esquema_supabase.sql       # Script para crear las tablas en Supabase
│   ├── reportes.json              # Almacenamiento de reportes del mapa
│   └── uploads/                   # Fotos subidas
├── .env.example                   # Plantilla de variables de entorno
└── package.json
```

### API

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `POST` | `/api/registrar-reporte` | Recibe el formulario (con foto) y lo guarda en Supabase |
| `GET` | `/api/reportes` | Devuelve todos los reportes (Supabase + `reportes.json`) para el mapa |
| `POST` | `/api/reportes` | Guarda un reporte creado desde el mapa en `reportes.json` |

## 📋 Requisitos

- [Node.js](https://nodejs.org/) **22 o superior**.
- Una cuenta en [Supabase](https://supabase.com) (gratis).
- Conexión a internet para los mapas (Leaflet y tiles de Esri), el buscador de calles (Nominatim) y la base de datos.

Ya **no hace falta XAMPP**.

## 🚀 Instalación y puesta en marcha

### Paso 1 — Clonar e instalar dependencias

```bash
git clone https://github.com/Joako4859/proyecto_anide_baches.git
cd proyecto_anide_baches
npm install
```

### Paso 2 — Crear las tablas en Supabase

1. Entrá a tu proyecto en [supabase.com](https://supabase.com).
2. En el menú izquierdo, abrí **SQL Editor** → **New query**.
3. Pegá el contenido de **`BackEnd/esquema_supabase.sql`** y tocá **Run**.
4. En **Table Editor** tienen que aparecer las tablas `reportes` y `contactos`.

### Paso 3 — Configurar las variables de entorno

Copiá la plantilla:

```bash
cp .env.example .env
```

(En Windows PowerShell: `Copy-Item .env.example .env`)

Abrí `.env` y completá **`DB_PASSWORD`** con la contraseña de la base de Supabase. El resto ya viene cargado:

| Variable | Valor |
| --- | --- |
| `DB_HOST` | `aws-0-sa-east-1.pooler.supabase.com` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `postgres` |
| `DB_USER` | `postgres.gztcavqtcihhcpzsgtcq` |
| `DB_PASSWORD` | la contraseña de la base (pedísela al equipo) |
| `PORT` | puerto del servidor local (por defecto `3000`) |

Estos datos están en Supabase → botón **Connect** → **Session pooler**. Si no sabés la contraseña, se puede cambiar en **Project Settings → Database → Reset database password**.

> ⚠️ El archivo `.env` **no se sube a git** (está en `.gitignore`). Nunca subas la contraseña al repositorio.

### Paso 4 — Iniciar el servidor

```bash
npm start
```

Para desarrollo (se reinicia solo al guardar cambios):

```bash
npm run dev
```

### Paso 5 — Acceder a la web

- **Formulario de reporte:** [`http://localhost:3000`](http://localhost:3000)
- **Mapa de reportes:** [`http://localhost:3000/mapa.html`](http://localhost:3000/mapa.html)

> ⚠️ **Importante:** siempre ingresá por `http://localhost:3000`. Si abrís el `.html` con doble clic o con Live Server, el formulario y el mapa no van a poder hablar con el backend.

---

## 🧪 Probar que todo funciona

1. Abrí `http://localhost:3000` y completá el formulario con un reporte de prueba (incluyendo una foto).
2. Deberías llegar a `gracias.html` ("¡Gracias por tu reporte!").
3. En Supabase → **Table Editor** → `reportes`, verificá que el registro esté.
4. Abrí `mapa.html`, hacé clic en el mapa, completá el popup y guardá: el marcador debería aparecer y también quedar guardado en `BackEnd/reportes.json`.

## ❌ Solución de problemas

| Problema | Solución |
| --- | --- |
| **`Faltan variables de entorno: ...` al iniciar** | No existe el `.env` o le falta algún dato. Copiá `.env.example` como `.env` y completá `DB_PASSWORD`. |
| **`No se pudo guardar el reporte`** | Mirá el mensaje en la consola donde corre `npm start`. Normalmente es contraseña incorrecta o que no se ejecutó `esquema_supabase.sql`. |
| **`password authentication failed`** | La contraseña de `.env` no es la correcta. Reseteala en Supabase y actualizala. |
| **`no tenant identifier provided` / `Tenant or user not found`** | El `DB_USER` tiene que ser `postgres.gztcavqtcihhcpzsgtcq` (con el punto y el código), no solo `postgres`. |
| **No conecta usando `db.xxxx.supabase.co`** | Esa es la *Direct connection* y solo funciona con IPv6. Usá el host del **Session pooler**. |
| **`EADDRINUSE` (puerto en uso)** | Otro programa usa el puerto 3000. Cambiá `PORT` en `.env`. |
| **El mapa se ve sin fondo** | Requiere internet (tiles de Esri y Leaflet desde CDN). |
| **El buscador de calles no responde** | El servicio Nominatim de OpenStreetMap limita el uso intensivo; esperá unos segundos y reintentá. |

## 👥 Contribuciones

¿Querés sumarte? Hacé un fork, creá una rama con tu mejora y enviá un **pull request**. Ideas interesantes:

- Gestión/edición/baja de reportes por un admin.
- Envío de notificaciones (correo o WhatsApp) al reportarse un bache.
- Estado de los reportes (recibido / en proceso / resuelto).
- Estadísticas por tipo de problema y por barrio.
- Guardar las fotos en Supabase Storage.
- Soporte para más ciudades.

## 🛠️ Tecnologías

| Capa | Tecnología |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript (vanilla) |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL) |
| Mapas | Leaflet.js + tiles de Esri |
| Geolocalización | OpenStreetMap / Nominatim |

## 📄 Licencia

Este proyecto es de uso académico. Free to copy, learn and improve.
