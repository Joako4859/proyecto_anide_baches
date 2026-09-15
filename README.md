# 🕳️ Reporte de Baches — Proyecto Anide

Aplicación web para que los vecinos reporten problemas en la vía pública (baches, luminarias en mal estado, veredas rotas, acumulación de basura, desagües tapados, etc.) y los visualicen en un **mapa interactivo**.

Desarrollada con **HTML, CSS, JavaScript, PHP y MySQL**, pensada para correr localmente con **XAMPP**.

## ✨ Funcionalidades

- **Formulario de reporte** (`FrontEnd/index.html`):
  - Selección del tipo de problema (bache, luminaria, vereda, basura, pluvial, otro).
  - Descripción, ubicación y teléfono de contacto.
  - Carga de foto desde la galería o directamente con la cámara (desde un celular).
  - Vista previa de la imagen antes de enviar.
  - Los datos se guardan en la base de datos MySQL.
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
├── FrontEnd/                      # Interfaz de usuario
│   ├── index.html                 # Página de reporte (formulario)
│   ├── mapa.html                  # Mapa interactivo de reportes
│   ├── inicio.css / styles.css    # Estilos
│   ├── inicio.js                  # Lógica del formulario (cámara/galería)
│   └── script.js                  # Lógica del mapa (Leaflet)
└── BackEnd/                       # Servidor (PHP + BD)
    ├── conexion.php               # Conexión PDO a MySQL
    ├── esquema.sql                # Script para crear la base de datos
    ├── registrar_reporte.php      # Guarda reportes del formulario en MySQL
    ├── reportes.php               # API JSON de los reportes del mapa
    ├── gracias.php                # Página de confirmación
    ├── reportes.json              # Almacenamiento de reportes del mapa
    └── uploads/                   # Fotos subidas (requiere permisos de escritura)
```

## 📋 Requisitos

- [XAMPP](https://www.apachefriends.org/es/index.html) (Apache + MySQL + PHP 7.4 o superior). Compatible con **Windows**, **Linux** y **macOS**.
- Conexión a internet para cargar los mapas (Leaflet y tiles de Esri) y el buscador de calles (Nominatim).
- Navegador moderno (Chrome, Firefox, Edge).

## 🚀 Instalación y puesta en marcha

### Paso 1 — Instalar XAMPP

**Windows / macOS**

1. Descargá el instalador desde [apachefriends.org](https://www.apachefriends.org/es/download.html).
2. Ejecutalo y seguí el asistente (dejá la instalación por defecto).

**Linux (Debian/Ubuntu/Mint)**

```bash
# 1) Descargar el instalador .run desde apachefriends.org
# 2) Darle permisos de ejecución e instalarlo:
chmod +x xampp-linux-*-installer.run
sudo ./xampp-linux-*-installer.run

# 3) Una vez instalado, iniciar todos los servicios:
sudo /opt/lampp/lampp start

# Si querés solo Apache y MySQL:
sudo /opt/lampp/xampp startapache && sudo /opt/lampp/xampp startmysql
```

### Paso 2 — Copiar el proyecto dentro de `htdocs`

XAMPP sirve los sitios web desde la carpeta `htdocs`:

| Sistema | Ruta de `htdocs` |
| --- | --- |
| Windows | `C:\xampp\htdocs` |
| Linux | `/opt/lampp/htdocs` |
| macOS | `/Applications/XAMPP/htdocs` |

Copiá **toda la carpeta del proyecto** (la raíz que contiene `FrontEnd/` y `BackEnd/`) dentro de `htdocs`.

```
C:\xampp\htdocs\proyecto_anide_baches\      (Windows)
/opt/lampp/htdocs/proyecto_anide_baches/    (Linux)
```

Si lo bajaste de GitHub, también podés clonarlo directamente ahí:

```bash
cd /opt/lampp/htdocs
git clone https://github.com/TU_USUARIO/proyecto_anide_baches.git
```

### Paso 3 — Iniciar Apache y MySQL

- **Windows:** abrí el **Panel de Control de XAMPP** y presioná **Start** en *Apache* y *MySQL*.
- **Linux:** `sudo /opt/lampp/lampp start` (o el atajo `sudo /opt/lampp/xampp start`).
- **macOS:** abrí la app **Manager** de XAMPP y activá Apache y MySQL.

Verificá que ambos servicios queden de color verde en el panel.

### Paso 4 — Crear la base de datos

Los reportes del formulario (`index.html`) se guardan en **MySQL**. Para crearla:

1. Asegurate de tener MySQL activo.
2. Entrá a **phpMyAdmin**: [`http://localhost/phpmyadmin`](http://localhost/phpmyadmin).
3. Andá a la pestaña **Importar** / **SQL**.
4. Ejecutá el contenido de **`BackEnd/esquema.sql`**.

Alternativa por consola:

```bash
sudo /opt/lampp/bin/mysql -u root < BackEnd/esquema.sql
```

Esto crea la base **`anide_formulario`** con las tablas `contactos` y `reportes`. La configuración por defecto de XAMPP usa el usuario `root` sin contraseña; si tu instalación tiene otra contraseña, actualizala en `BackEnd/conexion.php`.

### Paso 5 — Dar permisos de escritura (solo Linux/macOS)

Los reportes del mapa y las fotos necesitan carpeta escribible:

```bash
sudo chmod -R 777 /opt/lampp/htdocs/proyecto_anide_baches/BackEnd
```

### Paso 6 — Acceder a la web

Abrí en el navegador:

- **Formulario de reporte:** [`http://localhost/proyecto_anide_baches/FrontEnd/index.html`](http://localhost/proyecto_anide_baches/FrontEnd/index.html)
- **Mapa de reportes:** [`http://localhost/proyecto_anide_baches/FrontEnd/mapa.html`](http://localhost/proyecto_anide_baches/FrontEnd/mapa.html)

> ⚠️ **Importante:** siempre ingresá por `http://localhost/...`. Si abrís el archivo `.html` con doble clic, el formulario y el mapa no van a poder hablar con el backend (PHP) y se van a romper los reportes.

---

## 🧪 Probar que todo funciona

1. Abrí `index.html` y completá el formulario con un reporte de prueba (incluyendo una foto).
2. Deberías llegar a `gracias.php` ("¡Gracias por tu reporte!").
3. Entrá a phpMyAdmin → base `anide_formulario` → tabla `reportes` y verificá que el registro esté.
4. Abrí `mapa.html`, hacé clic en el mapa, completá el popup y guardá: el marcador debería aparecer y también quedar guardado en `BackEnd/reportes.json`.

## ❌ Solución de problemas

| Problema | Solución |
| --- | --- |
| **Apache no inicia (puerto 80 en uso)** | Otro servidor web ocupa el puerto. En Linux detené el Apache del sistema: `sudo systemctl stop apache2`, o cambiá el puerto de Apache a 8080 desde el panel de XAMPP. |
| **MySQL no inicia** | Eliminá archivos corruptos: en Linux, `rm -rf /opt/lampp/var/mysql/*.err` o reemplazá la carpeta `var/mysql` por una copia limpia. Suele ser la causa más común de fallo de MySQL. |
| **Error de conexión a la base de datos** | Verificá que creaste la BD ejecutando `esquema.sql` y que el usuario/contraseña de `BackEnd/conexion.php` coincida con tu MySQL. |
| **No se guardan las fotos** | Revisá los permisos de `BackEnd/uploads/` (debe ser escribible). En Linux: `chmod -R 777`. |
| **No se guardan reportes del mapa** | Verificá que `BackEnd/reportes.json` exista y tenga permisos de escritura. |
| **El mapa se ve sin fondo** | Requiere internet (tiles de Esri y Leaflet desde CDN). |
| **El buscador de calles no responde** | El servicio Nominatim de OpenStreetMap limita el uso intensivo; esperá unos segundos y reintentá. |
| **La página muestra "Acceso denegado" o no carga el CSS** | Verificá la ruta: PHP puede necesitar `include_path` o que el archivo esté dentro de `htdocs` (los enlaces relativos `../FrontEnd` y `../BackEnd` dependen del nombre de la carpeta). |
| **Errores de PHP visibles en pantalla** | En `BackEnd/conexion.php` se muestran errores JSON genéricos; revisá el log de Apache en `/opt/lampp/logs/error_log`. |

## 👥 Contribuciones

¿Querés sumarte? Hacé un fork, creá una rama con tu mejora y enviá un **pull request**. Ideas interesantes:

- Gestión/edición/baja de reportes por un admin.
- Envío de notificaciones (correo o WhatsApp) al reportarse un bache.
- Estado de los reportes (recibido / en proceso / resuelto).
- Estadísticas por tipo de problema y por barrio.
- Soporte para más ciudades.

## 🛠️ Tecnologías

| Capa | Tecnología |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript (vanilla) |
| Backend | PHP (PDO) |
| Base de datos | MySQL (phpMyAdmin) |
| Mapas | Leaflet.js + tiles de Esri |
| Geolocalización | OpenStreetMap / Nominatim |
| Servidor local | XAMPP (Apache + MySQL + PHP) |

## 📄 Licencia

Este proyecto es de uso académico. Free to copy, learn and improve.
